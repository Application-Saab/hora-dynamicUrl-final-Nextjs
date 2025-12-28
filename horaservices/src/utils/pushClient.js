export const getRoomDetails = (room, userId) => {
  if (!room) return;
  let details = {
    name: "",
    avatar: "",
    avatarText: "",
  };
  if (room?.roomType && room?.roomType === "group") {
    details.name = room?.roomName;
    details.avatar = room?.roomProfileUrl || "";
    if (!room?.roomProfileUrl) {
      details.avatarText = room.roomName.charAt(0).toUpperCase() || "?";
    }
  } else if (room?.roomType && room?.roomType === "direct") {
    let otherUser = room?.members?.filter((item) => item?.userId !== userId);
    let otherUserData = otherUser[0] || {};
    details.name = otherUserData?.name || otherUserData?.phone;
    details.avatar = otherUserData?.profileImageUrl;
    if (!otherUserData?.profileImageUrl) {
      details.avatarText = otherUserData.name.charAt(0).toUpperCase() || "?";
    }
  }
  return details;
};