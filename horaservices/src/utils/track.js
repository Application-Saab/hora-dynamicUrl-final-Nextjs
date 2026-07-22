import { BASE_URL } from "@/utils/apiconstants";
import axiosApi from "./axiosApi";
import { safeSetItem } from "./safeStorage";

const VISITOR_ID_KEY = "VISITOR_ID"; 

export function getVisitorId() {
  if (typeof window === "undefined") return null

  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    safeSetItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function getLoggedInUserId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userID") || null;
}

export function trackSearch({
  searchTerm,
  clickedItemId = null,
  clickedTitle = null,
  clickedType = null,
  userId = null,
}) {
  if (!searchTerm?.trim()) return;

  const visitorId = getVisitorId();

  const resolvedUserId = userId || getLoggedInUserId();

  axiosApi
    .post(`${BASE_URL}/api/search-tracking`, {
      searchTerm: searchTerm.trim(),
      clickedItemId,
      clickedTitle,
      clickedType,
      visitorId,
      userId: resolvedUserId, 
    })
    .catch(() => {
    
    });
}