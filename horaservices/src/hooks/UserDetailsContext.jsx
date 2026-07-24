import { createContext, useContext, useEffect, useState } from "react";
import useApi from "./useApi";
import { GET_USER_BY_ID } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
import { safeGetItem } from "@/utils/safeStorage";

const UserDetailsContext = createContext({
  userDetails: null,
  userLoading: false,
  refetchUser: () => {},
});

export function UserDetailsProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const pathname = usePathname();
  const isWonderland =
    pathname?.startsWith("/wonderlandinternational") ||
    pathname?.startsWith("/wonderland") ||
    pathname?.startsWith("/chat") ||
    pathname?.startsWith("/accounts") ||
    pathname?.startsWith("/services");

  const { makeRequest, loading } = useApi();

  //  Get userId from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(safeGetItem("userID"));
    }
  }, []);

  //   Fetch user details
  const fetchUserDetails = async (id) => {
    if (!id) {
      setUserDetails(null);
      return;
    }

    try {
      const resp = await makeRequest(`${GET_USER_BY_ID}/${id}`, "GET");
      setUserDetails(resp?.data || null);
      if (!resp?.data?.name && isWonderland) {
        localStorage.removeItem("userID");
        localStorage.removeItem("token");
        localStorage.removeItem("mobileNumber");
        localStorage.removeItem("isLoggedIn");
        setUserId(null);
        setUserDetails(null);
        window.dispatchEvent(new Event("loginStateChange"));
        window.location.reload();
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      setUserDetails(null);
    }
  };

  // Auto fetch user when userId changes
  useEffect(() => {
    fetchUserDetails(userId);
  }, [userId]);

  // Sync userId across tabs via login and logout
  useEffect(() => {
    const syncUser = () => {
      setUserId(safeGetItem("userID"));
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("loginStateChange", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("loginStateChange", syncUser);
    };
  }, []);

  return (
    <UserDetailsContext.Provider
      value={{
        userDetails,
        userLoading: loading,
        refetchUser: () => fetchUserDetails(userId),
        setUserDetails,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
}

export const useUserDetailsStore = () => useContext(UserDetailsContext);
