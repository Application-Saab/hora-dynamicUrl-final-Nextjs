import { safeGetItem, safeSetItem } from "./safeStorage";

export const updateGroupUnread = (eventId, increment = 1) => {
  const storedCounts = JSON.parse(safeGetItem("groupUnreadCounts") || "{}");

  storedCounts[eventId] = (storedCounts[eventId] || 0) + increment;
  safeSetItem("groupUnreadCounts", JSON.stringify(storedCounts));

  const total = Object.values(storedCounts).reduce((a, b) => a + b, 0);
  safeSetItem("totalUnread", total.toString());
  window.dispatchEvent(new Event("unreadCountChange"));
  return total;
};
