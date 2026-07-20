
import React, { useEffect, useRef } from "react";
import socket, { connectSocket } from "@/socket";
import { useChatStore } from "./ChatContext";
import {
  BASE_URL,
  UNREAD_MESSAGE_COUNT,
} from "@/utils/apiconstants";

import { safeGetItem } from "@/utils/safeStorage";
import { fetchWithError } from "@/utils/fetchWithError";


export const sortRooms = (rooms) => {
  return [...rooms].sort((a, b) => {
    const aTime = a.lastMessageAt
      ? new Date(a.lastMessageAt)
      : new Date(a.createdAt);
    const bTime = b.lastMessageAt
      ? new Date(b.lastMessageAt)
      : new Date(b.createdAt);
    return bTime - aTime;
  });
};

const ChatProviderMain = ({ children }) => {
  const { setUnreadCountsContext, setChatRooms, refetchChatRooms, chatRooms } =
    useChatStore();
  const userID =
    typeof window !== "undefined"
      ? safeGetItem("userID") ||
        new URLSearchParams(window.location.search).get("id")
      : null;

  // Prevent multiple listener attachments
  const listenersAttachedRef = useRef(false);
  const processedMessagesRef = useRef(new Set());

  useEffect(() => {
    if (!userID) return;
    if (!socket || !socket.connected) {
      connectSocket(userID);
    }
  }, [userID]);

  useEffect(() => {
    if (!socket || !userID) return;

    // Prevent duplicate listener setup
    if (listenersAttachedRef.current) return;

    const setupListeners = () => {
      if (listenersAttachedRef.current) return;
      listenersAttachedRef.current = true;

      const onConnect = () => {
        processedMessagesRef.current.clear();
      };

      const onMessageNew = async (msg) => {
        const groupId = msg.groupId;
        const messageId = msg._id || msg.tempId;

        if (!groupId || !messageId) return;

        // Check for duplicates
        const messageKey = `${groupId}_${messageId}_${msg.createdAt}`;
        if (processedMessagesRef.current.has(messageKey)) {
          return;
        }

        processedMessagesRef.current.add(messageKey);

        // Cleanup old entries
        if (processedMessagesRef.current.size > 200) {
          const arr = Array.from(processedMessagesRef.current);
          processedMessagesRef.current = new Set(arr.slice(-100));
        }

        const isSentByMe = String(msg.senderId) === String(userID);

        if (!isSentByMe) {
          setUnreadCountsContext((old) => {
            const newCount = Number(old[groupId] || 0) + 1;
            return {
              ...old,
              [groupId]: newCount,
            };
          });
        }

        setChatRooms((prev) => {
          const roomExists = prev.some(
            (r) => String(r._id || r.id) === String(groupId)
          );
          let updated = prev;
          if (!roomExists) {
            refetchChatRooms(); 
            return prev;
          } else {
            updated = prev.map((r) =>
              String(r._id || r.id) === String(groupId)
                ? {
                    ...r,
                    lastMessageAt:
                      new Date(msg.createdAt) > new Date(r.lastMessageAt || 0)
                        ? msg.createdAt
                        : r.lastMessageAt,
                  }
                : r
            );
          }
          return sortRooms(updated);
        });
      };

      const onReadUpdate = (update) => {
        if (String(update.userId) === String(userID)) {
          setUnreadCountsContext((prev) => ({ ...prev, [update.groupId]: 0 }));
        }
      };

      const onUnreadInit = (map) => {
        setUnreadCountsContext((prev) => ({ ...prev, ...map }));
      };

      const onUnreadUpdate = ({ groupId, count, userId: forUser }) => {
        if (!forUser || String(forUser) === String(userID)) {
          setUnreadCountsContext((prev) => ({ ...prev, [groupId]: count }));
        }
      };

      const onRsvpRefetch = (data) => {
        const { eventId } = data;
        if (eventId) {
          window.dispatchEvent(
            new CustomEvent("rsvp:refetched", { detail: { eventId } })
          );
        }
      };

      const onChatRoomsUpdate = () => {
        refetchChatRooms();
      };

      const onDisconnect = () => {
        console.log("Socket disconnected");
        listenersAttachedRef.current = false;
      };

      // Remove ALL existing listeners first
      socket.removeAllListeners("connect");
      socket.removeAllListeners("message:new");
      socket.removeAllListeners("message:read:update");
      socket.removeAllListeners("unread:counts:init");
      socket.removeAllListeners("unread:update");
      socket.removeAllListeners("rsvp:refetch");
      socket.removeAllListeners("chat:rooms:updated");
      socket.removeAllListeners("disconnect");

      // Attach listeners
      socket.on("connect", onConnect);
      socket.on("message:new", onMessageNew);
      socket.on("message:read:update", onReadUpdate);
      socket.on("unread:counts:init", onUnreadInit);
      socket.on("unread:update", onUnreadUpdate);
      socket.on("rsvp:refetch", onRsvpRefetch);
      socket.on("chat:rooms:updated", onChatRoomsUpdate);
      socket.on("disconnect", onDisconnect);
    };

    if (socket.connected) {
      setupListeners();
    } else {
      const handleConnect = () => {
        setupListeners();
      };
      window.addEventListener("socket:connected", handleConnect);
      return () => {
        window.removeEventListener("socket:connected", handleConnect);
      };
    }

    return () => {
      listenersAttachedRef.current = false;
      if (socket) {
        socket.removeAllListeners();
      }
    };
  }, [userID, socket?.connected]);

  useEffect(() => {
    if (!userID) return;
    const fetchUnreadMap = async () => {
      try {
        const resp = await fetchWithError(
          `${BASE_URL}${UNREAD_MESSAGE_COUNT}/${userID}/unread`
        );
        const json = await resp.json();
        if (!json.error && json.data) {
          setUnreadCountsContext((prev) => ({ ...prev, ...json.data }));
        }
      } catch (e) {
        console.error("Error fetching unread counts");
      }
    };
    fetchUnreadMap();
  }, [userID]);

  return <>{children}</>;
};

export default ChatProviderMain;
