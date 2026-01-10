// import React, { useEffect } from 'react';
// import socket from '@/socket';
// import { useChatStore } from './ChatContext';

// const ChatProviderMain = ({ children }) => {
//   const { setUnreadCountsContext } = useChatStore();
//   const userID = typeof window !== 'undefined' ? localStorage.getItem('userID') : null;

//   useEffect(() => {
//     if (typeof window === 'undefined' || !socket || !userID) return;

//     const onConnect = () => {
//       console.log('Global socket connected for unread updates');
//     };

//     // Handle new message: Always increment unread
//     const onMessageNew = (msg) => {
//       const groupId = msg.groupId;
//       if (!groupId) return;

//       // Increment unread for this room
//       setUnreadCountsContext((old) => {
//         const cur = Number(old[groupId] || 0) + 1;
//         return { ...old, [groupId]: cur };
//       });
//     };

//     const onReadUpdate = (update) => {
//       if (String(update.userId) === String(userID)) {
//         setUnreadCountsContext((prev) => ({ ...prev, [update.groupId]: 0 }));
//       }
//     };

//     const onUnreadInit = (map) => {
//       setUnreadCountsContext((prev) => ({ ...prev, ...map }));
//     };

//     const onUnreadUpdate = ({ groupId, count, userId: forUser }) => {
//       if (!forUser || String(forUser) === String(userID)) {
//         setUnreadCountsContext((prev) => ({ ...prev, [groupId]: count }));
//       }
//     };

//     socket.on('connect', onConnect);
//     socket.on('message:new', onMessageNew);
//     socket.on('message:read:update', onReadUpdate);
//     socket.on('unread:counts:init', onUnreadInit);
//     socket.on('unread:update', onUnreadUpdate);

//     return () => {
//       socket.off('connect', onConnect);
//       socket.off('message:new', onMessageNew);
//       socket.off('message:read:update', onReadUpdate);
//       socket.off('unread:counts:init', onUnreadInit);
//       socket.off('unread:update', onUnreadUpdate);
//     };
//   }, [userID]);

//   return <>{children}</>;
// };

// export default ChatProviderMain;

import React, { useEffect } from "react";
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
    return bTime - aTime; // Descending
  });
};

const ChatProviderMain = ({ children }) => {
  const { setUnreadCountsContext, setChatRooms, refetchChatRooms } = useChatStore();
  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const { data: chatRoomsData } = useApi(
    userID ? `${GET_CHAT_ROOMS}/${userID}` : null,
    "get"
  );

  // Rooms sorting
  useEffect(() => {
    if (chatRoomsData?.data) {
      const sortedRooms = sortRooms(chatRoomsData.data || []);
      setChatRooms(sortedRooms);
    }
  }, [chatRoomsData]);

  // First: Connect socket if needed
  useEffect(() => {
    if (!userID) return;

    if (!socket || !socket.connected) {
      connectSocket(userID);
    }
  }, [userID]);

  // Second: Attach listeners ONLY when socket is connected
  useEffect(() => {
    if (!socket || !userID) return;

    // Agar socket connected nahi hai, wait karo
    if (!socket.connected) {
      const handleConnect = () => {
        setupSocketListeners();
      };
      window.addEventListener("socket:connected", handleConnect);
      // Agar already connected hai, immediately setup
      if (socket.connected) {
        setupSocketListeners();
      }

      return () => {
        window.removeEventListener("socket:connected", handleConnect);
      };
    } else {
      setupSocketListeners();
    }
  }, [userID, socket?.connected]);

  // Extracted function for listeners
  const setupSocketListeners = () => {
    const onConnect = () => {
      console.log("Global socket connected for unread updates");
    };

    const onMessageNew = (msg) => {
      const groupId = msg.groupId;
      if (!groupId) return;

      setUnreadCountsContext((old) => ({
        ...old,
        [groupId]: Number(old[groupId] || 0) + 1,
      }));

      setChatRooms((prev) => {
        const updated = prev.map((r) =>
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
          new CustomEvent("rsvp:refetch", { detail: { eventId } })
        );
      }
    };

    const onChatRoomsUpdate = () => {
      refetchChatRooms(); // Yeh context se milega (value mein add kar dena)
    };

    // Attach all listeners
    socket.on("connect", onConnect);
    socket.on("message:new", onMessageNew);
    socket.on("message:read:update", onReadUpdate);
    socket.on("unread:counts:init", onUnreadInit);
    socket.on("unread:update", onUnreadUpdate);
    socket.on("rsvp:refetch", onRsvpRefetch);
    socket.on("chat:rooms:updated", onChatRoomsUpdate);

    // Cleanup
    return () => {
      socket.off("connect", onConnect);
      socket.off("message:new", onMessageNew);
      socket.off("message:read:update", onReadUpdate);
      socket.off("unread:counts:init", onUnreadInit);
      socket.off("unread:update", onUnreadUpdate);
      socket.off("rsvp:refetch", onRsvpRefetch);
      socket.off("chat:rooms:updated", onChatRoomsUpdate);
    };
  };

  // Manual unread fetch fallback
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
