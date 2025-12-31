import React from "react";
import "../../../pages/chat/GroupsList.css";
import { getRoomDetails } from "@/utils/setGroupDetails";

const ChatGroupsListing = ({
  allChatRooms,
  handleOpenMessages,
  unreadCounts,
  searchTerm,
  userId,
}) => {
  const capitalizeFirstLetter = (text = "") => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="groups-list">
      {allChatRooms
        .filter((group) =>
          (group.roomName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .map((group) => {
          const id = group._id || group.id;
          const roomDetails = getRoomDetails(group, userId);

          return (
            <div
              key={id}
              className="group-item"
              onClick={() => handleOpenMessages(group)}
            >
              {roomDetails?.avatar ? (
                <img
                  src={roomDetails?.avatar}
                  alt={roomDetails?.name}
                  className="group-avatar"
                />
              ) : (
                <div
                  className="group-avatar-placeholder"
                  style={{
                    backgroundColor: "#27ae60",
                    color: "white",
                    fontSize: "24px",
                    width: "clamp(40px, calc((53 / 393) * 100vw), 70px)",
                    height: "clamp(40px, calc((53 / 393) * 100vw), 70px)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {roomDetails?.avatarText}
                </div>
              )}

              <div className="group-info">
                <p className="group-name">
                  {capitalizeFirstLetter(roomDetails?.name) || "Unnamed Group"}
                </p>
                {/* <span className="group-last">
                  {(unreadCounts[id] || 0) > 0
                    ? `${unreadCounts[id]} New Message${
                        unreadCounts[id] > 1 ? "s" : ""
                      }`
                    : "No new messages"}
                </span> */}
                {unreadCounts[id] > 0 && (
                  <span className="group-last">
                    {unreadCounts[id]} New Message
                    {unreadCounts[id] > 1 ? "s" : ""} *
                  </span>
                )}
              </div>

              {(unreadCounts[id]) > 0 && (
                <span className="unread-dot"></span>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ChatGroupsListing;
