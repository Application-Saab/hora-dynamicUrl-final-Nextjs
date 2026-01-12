import { BASE_URL, GET_CHAT_ROOMS } from "@/utils/apiconstants";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { sortRooms } from "./ChatProvider";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [unreadCounts, setUnreadCountsContext] = useState({});
  console.log('%c [ unreadCounts ]-42', 'font-size:13px; background:pink; color:#bf2c9f;', unreadCounts)
  const [totalUnread, setGlobalTotalUnread] = useState(0);
  const [loggedinUserId, setLoggedinUserId] = useState(
    (typeof window !== "undefined" && localStorage.getItem("userID")) || ""
  );

  // New: Refetch function
  const refetchChatRooms = useCallback(async () => {
    try {
      if (!loggedinUserId) return;
      
      const response = await fetch(`${BASE_URL}${GET_CHAT_ROOMS}/${loggedinUserId}`);
      const json = await response.json();

      if (!json.error && json.data) {
        const sorted = sortRooms(json.data || []);
        setChatRooms(sorted);
      }
    } catch (err) {
      console.error("Refetch chat rooms failed:", err);
    }
  }, []);

  useEffect(() => {
    const total = Object.values(unreadCounts).reduce(
      (s, v) => s + (Number(v) || 0),
      0
    );
    setGlobalTotalUnread(total);
  }, [unreadCounts]);

  // Listen local storage changes for login state
  useEffect(() => {
    const syncLoginState = () => {
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);

    // Sync on same tab login without change page
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chatRooms,
        setChatRooms,
        unreadCounts,
        setUnreadCountsContext,
        totalUnread,
        setGlobalTotalUnread,
        refetchChatRooms,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatStore = () => useContext(ChatContext);
