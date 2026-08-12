import React, { useState } from "react";
import Image from "next/image";
import PinBanner from "../../assets/pinBanner.jpg";
import SearchIcon from "@/assets/wonderland/chat/SearchIcon.svg";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import ChatGroupsListing from "@/components/wonderland/chat/ChatGroupsListing";
import { useChatStore } from "@/hooks/ChatContext";
import { MARK_READ_MESSAGE } from "@/utils/apiconstants";
import useApi from "@/hooks/useApi";
import socket from "@/socket";
import { safeGetItem } from "@/utils/safeStorage";

const GroupsList = () => {
  const userId =
    typeof window !== "undefined"
      ? safeGetItem("userID") ||
        new URLSearchParams(window.location.search).get("id")
      : null;
  const router = useRouter();
  const { chatRooms, unreadCounts, setUnreadCountsContext } = useChatStore();
  const { makeRequest: markReadRequest } = useApi();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rooms: Show groups always, direct only if lastMessageAt exists (has messages)
  const filteredChatRooms = chatRooms.filter((room) => {
    if (room.roomType === "group") return true;
    return !!room.lastMessageAt; // Direct rooms only if message sent
  });

  const markRoomRead = async (groupId, uid) => {
    if (!groupId || !uid) return;
    try {
      setUnreadCountsContext((prev) => ({ ...prev, [groupId]: 0 })); // optimistic
      if (socket && socket.connected) {
        socket.emit("message:read", { groupId, userId: uid });
      }
      const resp = await markReadRequest(`${MARK_READ_MESSAGE}`, "POST", {
        groupId,
        userId: uid,
      });
      if (
        !resp.error &&
        (resp.unreadCounts || (resp.data && resp.data.unreadCounts))
      ) {
        setUnreadCountsContext((prev) => ({
          ...prev,
          ...(resp.unreadCounts || resp.data.unreadCounts),
        }));
      } else {
        setUnreadCountsContext((prev) => ({ ...prev, [groupId]: 0 }));
      }
    } catch (err) {
      setUnreadCountsContext((prev) => ({ ...prev, [groupId]: 0 }));
      console.error("markRoomRead err", err);
    }
  };

  const handleOpenMessages = async (group) => {
    const groupId = group._id || group.id;
    markRoomRead(groupId, userId);
    router.push(`/chat/room?groupId=${groupId}&id=${userId}`);
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <div className="search-wrapper">
          <div className="search-icon-img">
            <Image src={SearchIcon} alt="search" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ChatGroupsListing
        allChatRooms={filteredChatRooms}
        handleOpenMessages={handleOpenMessages}
        unreadCounts={unreadCounts}
        searchTerm={searchTerm}
        userId={userId}
      />
    </div>
  );
};

export default GroupsList;
