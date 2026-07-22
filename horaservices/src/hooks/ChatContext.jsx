import { BASE_URL, GET_CHAT_ROOMS } from "@/utils/apiconstants";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { sortRooms } from "./ChatProvider";
import useApi from "./useApi";
import { fetchWithError } from "@/utils/fetchWithError";
import { safeGetItem } from "@/utils/safeStorage";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [unreadCounts, setUnreadCountsContext] = useState({});
  const [totalUnread, setGlobalTotalUnread] = useState(0);
  const [loggedinUserId, setLoggedinUserId] = useState(
    (typeof window !== "undefined" && safeGetItem("userID")) || ""
  );
  const { makeRequest: fetchRoomsRequest, loading: roomsFetchLoading, isFetched: roomsDataFetched } = useApi();

  // Refetch function
  const refetchChatRooms = useCallback(async () => {
    try {
      if (!loggedinUserId) return;

      const response = await fetchWithError(
        `${BASE_URL}${GET_CHAT_ROOMS}/${loggedinUserId}`
      );
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
      setLoggedinUserId(safeGetItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);

    // Sync on same tab login without change page
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  // SSR hydration gap fix: on server window is undefined so useState initializer
  // returns "". React does NOT re-run it on the client. This effect runs once
  // after mount to sync from localStorage, with URL ?id= as fallback for
  // Safari/iOS fresh loads where localStorage may be empty.
  useEffect(() => {
    if (loggedinUserId) return;
    const id =
      safeGetItem("userID") ||
      new URLSearchParams(window.location.search).get("id");
    if (id) setLoggedinUserId(id);
  }, []);

  useLayoutEffect(() => {
    const fetchAllRooms = async () => {
      if (loggedinUserId) {
        try {
          let resp = await fetchRoomsRequest(
            `${GET_CHAT_ROOMS}/${loggedinUserId}`,
            "GET"
          );
          if (resp?.data) {
            const sorted = sortRooms(resp.data || []);
            setChatRooms(sorted);
          }
        } catch (err) {
          console.error("Error fetching guest details:", err);
        }
      }
    };
    fetchAllRooms();
  }, [loggedinUserId]);

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
        roomsFetchLoading,
        roomsDataFetched
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatStore = () => useContext(ChatContext);
