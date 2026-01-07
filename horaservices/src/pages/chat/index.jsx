import React, { useRef, useEffect, useState } from "react";
import "./GroupsList.css";
import Image from "next/image";
import "../wonderland/EventInvitation.css";
import PinBanner from "../../assets/pinBanner.jpg";
import SearchIcon from "@/assets/wonderland/chat/SearchIcon.svg";
import { useRouter } from "next/router";
import {
  GET_CHAT_ROOMS,
  MARK_READ_MESSAGE,
  BASE_URL,
  UNREAD_MESSAGE_COUNT,
} from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
import useApi from "@/hooks/useApi";
import socket from "@/socket";
import ChatGroupsListing from "@/components/wonderland/chat/ChatGroupsListing";
import { useChatStore } from "@/hooks/ChatContext";

// helper to read userId from url
// const getUserIdFromUrl = () => {
//   if (typeof window === "undefined") return null;
//   const params = new URLSearchParams(window.location.search);
//   return params.get("id");
// };

const GroupsList = () => {
  // const userId = getUserIdFromUrl();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const router = useRouter();
  const { data: chatRoomsData } = useApi(`${GET_CHAT_ROOMS}/${userId}`, "get");
  const { makeRequest: markReadRequest } = useApi();
  const [allChatRooms, setAllChatRooms] = useState([]);
  const { unreadCounts, setUnreadCountsContext } = useChatStore();

  useEffect(() => {
    if (chatRoomsData?.data) {
      setAllChatRooms(chatRoomsData.data || []);
    }
  }, [chatRoomsData]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const chatBodyRef = useRef(null);
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const chatOpenRef = useRef(false);

  // scroll to bottom when messages change
  useEffect(() => {
    const chatContainer =
      chatBodyRef.current || document.querySelector(".chat-messages");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  // handle back button
  useEffect(() => {
    const handleBackButton = (e) => {
      if (selectedGroup) {
        e.preventDefault();
        setSelectedGroup(null);
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [selectedGroup]);

  // Only local listeners
  useEffect(() => {
    if (typeof window === "undefined" || !socket || !selectedGroup) return;

    const groupId = selectedGroup._id || selectedGroup.id;

    const onMessageNewLocal = (msg) => {
      if (String(msg.groupId) !== String(groupId)) return;

      setMessages((prev) => {
        // replace optimistic if tempId
        if (msg.tempId && prev.some((m) => m.tempId === msg.tempId)) {
          return prev.map((m) =>
            m.tempId === msg.tempId ? { ...msg, id: msg._id } : m
          );
        }

        // prevent duplicate
        if (prev.some((m) => String(m._id || m.id) === String(msg._id)))
          return prev;

        // append and mark read (global provider handles unread reset)
        setTimeout(() => markRoomRead(groupId, userId), 50);
        return [...prev, { ...msg, id: msg._id }];
      });
    };

    socket.on("message:new", onMessageNewLocal);

    return () => {
      socket.off("message:new", onMessageNewLocal);
    };
  }, [selectedGroup, userId]);

  useEffect(() => {
    const fetchUnreadMap = async () => {
      try {
        const resp = await fetch(
          `${BASE_URL}${UNREAD_MESSAGE_COUNT}/${userId}/unread`
        );
        const json = await resp.json();
        if (!json.error && json.data) {
          setUnreadCountsContext((prev) => ({ ...prev, ...json.data }));
        }
      } catch (e) {
        console.error("Error fetching unread counts");
      }
    };

    if (userId) fetchUnreadMap();
  }, [userId, chatRoomsData]);

  const handleOpenMessages = async (group) => {
    const groupId = group._id || group.id;
    markRoomRead(groupId, userId);
    router.push(`/chat/room?groupId=${groupId}&id=${userId}`);
  };

  const markRoomRead = async (groupId, uid) => {
    if (!groupId || !uid) return;
    try {
      if (socket && socket.connected) {
        socket.emit("message:read", { groupId: groupId, userId: uid });
      }
      // REST call
      try {
        const resp = await markReadRequest(`${MARK_READ_MESSAGE}`, "POST", {
          groupId: groupId,
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
      } catch (e) {
        setUnreadCountsContext((prev) => ({ ...prev, [groupId]: 0 }));
      }
    } catch (err) {
      console.error("markRoomRead err", err);
    }
  };

  // compute unread counts across rooms
  useEffect(() => {
    if (
      !allChatRooms ||
      allChatRooms.length === 0 ||
      !userId ||
      chatOpenRef.current
    )
      return;
    const timeout = setTimeout(() => {
      const counts = {};
      let total = 0;
      allChatRooms.forEach((group) => {
        const groupId = group._id || group.id;
        const lastReadMap = group.lastReadAt || group.lastReadAtMap || {};
        const lastSeen = lastReadMap[userId]
          ? new Date(lastReadMap[userId])
          : null;
        const msgsForRoom = messages.filter(
          (m) => String(m.groupId || "") === String(groupId)
        );
        let unreadForRoom = unreadCounts[groupId] || 0;
        if (msgsForRoom.length > 0) {
          unreadForRoom = msgsForRoom.filter((msg) => {
            const msgDate = msg.sentAt
              ? new Date(msg.sentAt)
              : new Date(msg.createdAt);
            if (String(msg.senderId) === String(userId)) return false;
            return lastSeen ? msgDate > lastSeen : true;
          }).length;
        }
        counts[groupId] = unreadForRoom;
        total += unreadForRoom;
      });
      setUnreadCountsContext((prev) => ({ ...prev, ...counts }));
      localStorage.setItem("totalUnread", total.toString());
      window.dispatchEvent(new Event("unreadCountChange"));
    }, 300);
    return () => clearTimeout(timeout);
  }, [allChatRooms, userId, messages]);

  //  install prompt logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
      if (addToHomeScreenPopup !== "true") setShowInstall(true);
    }
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [pathname]);

  const handleInstallClick = async () => {
    setShowInstall(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted")
        localStorage.setItem("addToHomeScreenPopup", "true");
      else localStorage.setItem("addToHomeScreenPopup", "false");
      setDeferredPrompt(null);
    }
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

      {/* {pathname === "/chat" && showInstall && (
        <div className="chat-banner">
          <Image src={PinBanner} alt="Banner" className="chat-banner-img" />
          <button className="chat-banner-btn" onClick={handleInstallClick}>
            Add To Phone Screen
          </button>
        </div>
      )} */}

      <ChatGroupsListing
        allChatRooms={allChatRooms}
        handleOpenMessages={(group) => handleOpenMessages(group)}
        unreadCounts={unreadCounts}
        searchTerm={searchTerm}
        userId={userId}
      />
    </div>
  );
};

export default GroupsList;
