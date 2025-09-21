export const updateGroupUnread = (eventId, increment = 1) => {
  const storedCounts = JSON.parse(localStorage.getItem("groupUnreadCounts") || "{}");

  storedCounts[eventId] = (storedCounts[eventId] || 0) + increment;
  localStorage.setItem("groupUnreadCounts", JSON.stringify(storedCounts));

  const total = Object.values(storedCounts).reduce((a, b) => a + b, 0);
  localStorage.setItem("totalUnread", total.toString());
  window.dispatchEvent(new Event("unreadCountChange"));
  return total;
};

export const markGroupAsRead = (eventId) => {
  const storedCounts = JSON.parse(localStorage.getItem("groupUnreadCounts") || "{}");

  // 0 only for current group
  storedCounts[eventId] = 0;

  localStorage.setItem("groupUnreadCounts", JSON.stringify(storedCounts));

  // ✅ totalUnread = sum of all groups
  const total = Object.values(storedCounts).reduce((sum, count) => sum + count, 0);
  localStorage.setItem("totalUnread", total.toString());

  window.dispatchEvent(new Event("unreadCountChange"));
};

