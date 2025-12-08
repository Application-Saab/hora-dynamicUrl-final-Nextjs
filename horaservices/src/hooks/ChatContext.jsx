import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [unreadCounts, setUnreadCountsContext] = useState({});
  console.log(
    "%c [ unreadCounts in context ]-7",
    "font-size:13px; background:pink; color:#bf2c9f;",
    unreadCounts
  );
  const [totalUnread, setGlobalTotalUnread] = useState(0);

  useEffect(() => {
    const total = Object.values(unreadCounts).reduce(
      (s, v) => s + (Number(v) || 0),
      0
    );
    setGlobalTotalUnread(total)
  }, [unreadCounts]);

  return (
    <ChatContext.Provider
      value={{
        unreadCounts,
        setUnreadCountsContext,
        totalUnread,
        setGlobalTotalUnread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatStore = () => useContext(ChatContext);
