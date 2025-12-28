import React, { useEffect } from 'react';
import socket from '@/socket';
import { useChatStore } from './ChatContext';

const ChatProviderMain = ({ children }) => {
  const { setUnreadCountsContext } = useChatStore();
  const userID = typeof window !== 'undefined' ? localStorage.getItem('userID') : null;

  useEffect(() => {
    if (typeof window === 'undefined' || !socket || !userID) return;

    const onConnect = () => {
      console.log('Global socket connected for unread updates');
    };

    // Handle new message: Always increment unread
    const onMessageNew = (msg) => {
      const groupId = msg.groupId;
      if (!groupId) return;

      // Increment unread for this room
      setUnreadCountsContext((old) => {
        const cur = Number(old[groupId] || 0) + 1;
        return { ...old, [groupId]: cur };
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

    socket.on('connect', onConnect);
    socket.on('message:new', onMessageNew);
    socket.on('message:read:update', onReadUpdate);
    socket.on('unread:counts:init', onUnreadInit);
    socket.on('unread:update', onUnreadUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('message:new', onMessageNew);
      socket.off('message:read:update', onReadUpdate);
      socket.off('unread:counts:init', onUnreadInit);
      socket.off('unread:update', onUnreadUpdate);
    };
  }, [userID]);

  return <>{children}</>;
};

export default ChatProviderMain;