import React from "react";
import "../../../pages/chat/GroupsList.css";

const ChatGroupsListing = ({
  allChatRooms,
  handleOpenMessages,
  unreadCounts,
  searchTerm
}) => {
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
          return (
            <div
              key={id}
              className="group-item"
              onClick={() => handleOpenMessages(group)}
            >
              {group?.roomProfileUrl ? (
                <img
                  src={group?.roomProfileUrl}
                  alt={group?.name}
                  className="group-avatar"
                />
              ) : (
                <div
                  className="group-avatar-placeholder"
                  style={{
                    backgroundColor: "#27ae60",
                    color: "white",
                    fontSize: "24px",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {group.roomName
                    ? group.roomName.charAt(0).toUpperCase()
                    : "?"}
                </div>
              )}

              <div className="group-info">
                <p className="group-name">
                  {group.roomName || "Unnamed Group"}
                </p>
                <span className="group-last">
                  {(unreadCounts[id] || 0) > 0
                    ? `${unreadCounts[id]} New Message${
                        unreadCounts[id] > 1 ? "s" : ""
                      }`
                    : "No new messages"}
                </span>
              </div>

              {(unreadCounts[id] || 0) > 0 && (
                <span className="unread-dot"></span>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ChatGroupsListing;
