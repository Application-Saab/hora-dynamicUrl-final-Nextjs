
import React, { useEffect, useRef } from "react";
import socket, { connectSocket } from "@/socket";
import { useChatStore } from "./ChatContext";
import {
  BASE_URL,
  UNREAD_MESSAGE_COUNT,
  GET_CHAT_ROOMS,
} from "@/utils/apiconstants";
import useApi from "@/hooks/useApi";

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
  const { setUnreadCountsContext, setChatRooms, refetchChatRooms } =
    useChatStore();
  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;

  const { data: chatRoomsData } = useApi(
    userID ? `${GET_CHAT_ROOMS}/${userID}` : null,
    "get"
  );

  // Prevent multiple listener attachments
  const listenersAttachedRef = useRef(false);
  const processedMessagesRef = useRef(new Set());

  useEffect(() => {
    if (chatRoomsData?.data) {
      const sortedRooms = sortRooms(chatRoomsData.data || []);
      setChatRooms(sortedRooms);
    }
  }, [chatRoomsData]);

  useEffect(() => {
    if (!userID) return;
    if (!socket || !socket.connected) {
      connectSocket(userID);
    }
  }, [userID]);

  useEffect(() => {
    if (!socket || !userID) return;

    // Prevent duplicate listener setup
    if (listenersAttachedRef.current) {
      console.log("Listeners already attached, skipping...");
      return;
    }

    const setupListeners = () => {
      if (listenersAttachedRef.current) return;

      console.log("Setting up socket listeners for user:", userID);
      listenersAttachedRef.current = true;

      const onConnect = () => {
        console.log("Socket connected");
        processedMessagesRef.current.clear();
      };

      const onMessageNew = (msg) => {
        console.log("message:new event received:", msg);

        const groupId = msg.groupId;
        const messageId = msg._id || msg.tempId;

        if (!groupId || !messageId) {
          console.warn("Missing groupId or messageId");
          return;
        }

        // Check for duplicates
        const messageKey = `${groupId}_${messageId}_${msg.createdAt}`;
        if (processedMessagesRef.current.has(messageKey)) {
          console.warn("DUPLICATE EVENT DETECTED - SKIPPING:", messageKey);
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
          console.log("Incrementing unread for group:", groupId);
          setUnreadCountsContext((old) => {
            const newCount = Number(old[groupId] || 0) + 1;
            console.log(
              `Unread count for ${groupId}: ${old[groupId] || 0} → ${newCount}`
            );
            return {
              ...old,
              [groupId]: newCount,
            };
          });
        } else {
          console.log("Message sent by me, not incrementing unread");
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
          console.log("Message read for group:", update.groupId);
          setUnreadCountsContext((prev) => ({ ...prev, [update.groupId]: 0 }));
        }
      };

      const onUnreadInit = (map) => {
        console.log("Initial unread counts received:", map);
        setUnreadCountsContext((prev) => ({ ...prev, ...map }));
      };

      const onUnreadUpdate = ({ groupId, count, userId: forUser }) => {
        if (!forUser || String(forUser) === String(userID)) {
          console.log(`Unread update for ${groupId}: ${count}`);
          setUnreadCountsContext((prev) => ({ ...prev, [groupId]: count }));
        }
      };

      const onRsvpRefetch = (data) => {
        const { eventId } = data;
        if (eventId) {
          window.dispatchEvent(
            new CustomEvent("rsvp:refetch", { detail: { eventId } })
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

      // FIX 3: Remove ALL existing listeners first
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
      console.log("Cleaning up socket listeners");
      listenersAttachedRef.current = false;
      if (socket) {
        socket.removeAllListeners("connect");
        socket.removeAllListeners("message:new");
        socket.removeAllListeners("message:read:update");
        socket.removeAllListeners("unread:counts:init");
        socket.removeAllListeners("unread:update");
        socket.removeAllListeners("rsvp:refetch");
        socket.removeAllListeners("chat:rooms:updated");
        socket.removeAllListeners("disconnect");
      }
    };
  }, [userID, socket?.connected]);

  useEffect(() => {
    if (!userID) return;
    const fetchUnreadMap = async () => {
      try {
        const resp = await fetch(
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
