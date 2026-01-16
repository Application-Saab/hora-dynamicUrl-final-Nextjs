import { useState, useEffect, useCallback } from "react";
import { messageCache } from "@/utils/messageCache";
import useApi from "@/hooks/useApi";
import { GET_CHAT_MESSAGES } from "@/utils/apiconstants";

export const useMessageCache = (groupId, userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const { makeRequest: fetchMessagesRequest } = useApi();

  // Load messages (cache first, then fetch)
  const loadMessages = useCallback(async () => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load from cache first
      const cachedMessages = await messageCache.getMessages(groupId);
      if (cachedMessages.length > 0) {
        setMessages(cachedMessages);
        setFromCache(true);
        setLoading(false);
      }

      // Fetch fresh data from API
      const resp = await fetchMessagesRequest(
        `${GET_CHAT_MESSAGES}/${groupId}?page=1&limit=10000`,
        "GET"
      );

      if (!resp.error && resp.data) {
        const freshMessages = resp.data || [];

        // Update cache
        await messageCache.saveMessages(groupId, freshMessages);

        // Update UI only if different from cache
        if (JSON.stringify(freshMessages) !== JSON.stringify(cachedMessages)) {
          setMessages(freshMessages);
        }

        setFromCache(false);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading messages:", err);
      setLoading(false);
    }
  }, [groupId]);

  // Add new message to cache
  const addMessageToCache = useCallback(
    async (message) => {
      if (!groupId) return;

      await messageCache.addMessage(groupId, message);

      // Update local state
      setMessages((prev) => {
        const exists = prev.some(
          (m) => String(m._id || m.id) === String(message._id || message.id)
        );
        if (exists) {
          return prev.map((m) =>
            String(m._id || m.id) === String(message._id || message.id)
              ? { ...message, id: message._id }
              : m
          );
        }
        return [...prev, { ...message, id: message._id }];
      });
    },
    [groupId]
  );

  useEffect(() => {
    loadMessages();
  }, [groupId]);

  return {
    messages,
    loading,
    fromCache,
    refreshMessages: loadMessages,
    addMessageToCache,
    setMessages,
  };
};
