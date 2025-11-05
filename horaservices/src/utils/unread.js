export const updateGroupUnread = (eventId, increment = 1) => {
  const storedCounts = JSON.parse(localStorage.getItem("groupUnreadCounts") || "{}");

  storedCounts[eventId] = (storedCounts[eventId] || 0) + increment;
  localStorage.setItem("groupUnreadCounts", JSON.stringify(storedCounts));

  const total = Object.values(storedCounts).reduce((a, b) => a + b, 0);
  localStorage.setItem("totalUnread", total.toString());
  window.dispatchEvent(new Event("unreadCountChange"));
  return total;
};
