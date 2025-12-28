import React, { useRef, useEffect, useState } from "react";
import "./GroupsList.css";
import EmojiPicker from "emoji-picker-react";
import emojiIcon from "../../assets/Emoji.png";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import "../wonderland/EventInvitation.css";
import { FaRegKeyboard } from "react-icons/fa6";
import sendIcon from "@/assets/sendicon.png";
import PinBanner from "../../assets/pinBanner.jpg";
import {
  GET_CHAT_ROOMS,
  GET_USER_BY_ID,
  GET_CHAT_MESSAGES,
  MARK_READ_MESSAGE,
  BASE_URL,
  CREATE_DIRECT_CHAT_ROOM,
  UNREAD_MESSAGE_COUNT,
} from "@/utils/apiconstants";
import { askAndSubscribe } from "@/utils/pushClient";
import { usePathname } from "next/navigation";
import useApi from "@/hooks/useApi";
import socket from "@/socket";
import { getAvatarColor } from "@/utils/chatHelpers";
import { PUBLIC_VAPID } from "@/utils/constants";
import ChatGroupsListing from "@/components/wonderland/chat/ChatGroupsListing";
import { useChatStore } from "@/hooks/ChatContext";
import { getRoomDetails } from "@/utils/setGroupDetails";

// helper to read userId from url
const getUserIdFromUrl = () => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const GroupsList = () => {
  const userId = getUserIdFromUrl();
  const { data: chatRoomsData } = useApi(`${GET_CHAT_ROOMS}/${userId}`, "get");
  const { makeRequest: fetchUserRequest } = useApi();
  const { makeRequest: fetchMessagesRequest } = useApi();
  const { makeRequest: markReadRequest } = useApi();
  const { makeRequest: createDirectChatRequest } = useApi();
  const [allChatRooms, setAllChatRooms] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const { unreadCounts, setUnreadCountsContext } = useChatStore();

  useEffect(() => {
    if (chatRoomsData?.data) {
      setAllChatRooms(chatRoomsData.data || []);
    }
  }, [chatRoomsData]);

  // fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const resp = await fetchUserRequest(
          `${GET_USER_BY_ID}/${userId}`,
          "GET"
        );
        if (resp?.data) {
          setUserDetails(resp?.data || {});
        }
      } catch (err) {
        console.log("Error fetching user:", err.message);
      }
    };
    fetchUserDetails();
  }, [userId]);

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker.register("/firebase-messaging-sw.js");
  //   }
  // }, []);

  async function enableNotifications() {
    try {
      const sub = await askAndSubscribe(PUBLIC_VAPID, userId);
      console.log("Subscribed:", sub);
    } catch (e) {
      console.log("Push error", e);
    }
  }

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [roomDisplayDetails, setRoomDisplayDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [text, setText] = useState("");
  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const eventId = selectedGroup?._id || selectedGroup?.id || null;
  const textareaRef = useRef(null);
  const chatOpenRef = useRef(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const lastSeenAtRef = useRef(null);
  const notifiedMessageIdsRef = useRef(new Set());
  const notifiedMessageIdsForPush = useRef(new Set());

  // keep a map for optimistic messages
  const tempIdToClientMap = useRef(new Map());

  // responsive emoji width
  const [emojiWidth, setEmojiWidth] = useState(400);
  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 450) setEmojiWidth(450);
      else if (screenWidth <= 450) setEmojiWidth(screenWidth - 20);
      else setEmojiWidth(screenWidth - 50);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

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
        setTimeout(() => markRoomRead(groupId, userID), 50);
        return [...prev, { ...msg, id: msg._id }];
      });
    };

    socket.on("message:new", onMessageNewLocal);

    return () => {
      socket.off("message:new", onMessageNewLocal);
    };
  }, [selectedGroup, userID]);

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

  // fetch messages REST API
  const fetchMessagesForRoom = async (groupId, page = 1, limit = 10000) => {
    if (!groupId) return;
    try {
      const resp = await fetchMessagesRequest(
        `${GET_CHAT_MESSAGES}/${groupId}?page=${page}&limit=${limit}`,
        "GET"
      );
      if (!resp.error && resp.data) {
        setMessages(resp?.data || []);
        const roomObj = allChatRooms.find(
          (r) => String(r._id || r.id) === String(groupId)
        );
        const lastReadMap = roomObj?.lastReadAt || roomObj?.lastReadAtMap || {};
        const lastReadForMe = lastReadMap[userID]
          ? new Date(lastReadMap[userID])
          : null;
        const unread = (resp.data || []).filter((m) => {
          const created = m.createdAt
            ? new Date(m.createdAt)
            : m.sentAt
            ? new Date(m.sentAt)
            : null;
          if (!created || String(m.senderId) === String(userID)) return false;
          return lastReadForMe ? created > lastReadForMe : true;
        }).length;
        setUnreadCountsContext((prev) => ({ ...prev, [groupId]: unread }));
      } else {
        console.warn("Failed fetch messages", resp);
      }
    } catch (err) {
      console.error("Fetch messages failed", err);
    }
  };

  // handle opening a room
  const handleOpenMessages = async (group) => {
    chatOpenRef.current = true;
    setSelectedGroup(group);
    const groupId = group._id || group.id;
    await fetchMessagesForRoom(groupId);
    setUnreadCountsContext((prev) => ({ ...prev, [groupId]: 0 }));
    markRoomRead(groupId, userID);
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

  // handle closing chat
  const handleCloseChat = async () => {
    if (!selectedGroup || !userId) return;
    await markRoomRead(selectedGroup._id || selectedGroup.id, userID);
    setSelectedGroup(null);
    setRefreshKey((prev) => prev + 1);
    chatOpenRef.current = false;
    setMessages([]);
  };

  // send message
  const sendMessage = async () => {
    if (!text.trim() || !eventId || !userID) return;
    const groupId = selectedGroup?._id;
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const optimistic = {
      id: tempId,
      tempId,
      _id: tempId,
      eventId,
      groupId,
      senderId: userID,
      message: text,
      text,
      type: "text",
      senderName: userDetails?.name,
      senderPhone: localStorage.getItem("mobileNumber"),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    tempIdToClientMap.current.set(tempId, true);

    if (socket && socket.connected) {
      socket.emit("message:send", {
        eventId,
        groupId,
        message: text,
        type: "text",
        tempId,
        senderName: userDetails?.name,
        senderPhone: userDetails?.phone,
      });
    }

    setText("");
    setShowEmojiPicker(false);
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
        const lastSeen = lastReadMap[userID]
          ? new Date(lastReadMap[userID])
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
            if (String(msg.senderId) === String(userID)) return false;
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
  }, [allChatRooms, userId, messages, refreshKey]);

  // helper to convert link text to anchor
  function linkify(textVal) {
    if (!textVal) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return textVal.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  }

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

  const handleClickUserName = async (senderId) => {
    try {
      // Check if a direct room already exists
      const existingRoom = allChatRooms.find((room) => {
        if (room.roomType !== "direct") return false;

        const memberIds = room.members.map((m) => m.userId);
        return memberIds.includes(userId) && memberIds.includes(senderId);
      });

      // If found -> Open that chat directly
      if (existingRoom) {
        console.log("Direct chat already exists:", existingRoom);
        handleOpenMessages(existingRoom);
        return;
      }

      // No room found -> Call backend API to create one
      const resp = await createDirectChatRequest(
        `${CREATE_DIRECT_CHAT_ROOM}`,
        "POST",
        {
          members: [userId, senderId],
          eventId: selectedGroup?.eventId,
        }
      );

      if (resp?.data) {
        setAllChatRooms((prev) => [...prev, resp?.data]);
        handleOpenMessages(resp?.data);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      setRoomDisplayDetails(getRoomDetails(selectedGroup, userId));
    }
  }, [selectedGroup]);

  // render UI
  return (
    <div className="groups-container">
      <div className="groups-header">
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search"
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {pathname === "/chat" && showInstall && (
        <div className="chat-banner">
          <Image src={PinBanner} alt="Banner" className="chat-banner-img" />
          <button className="chat-banner-btn" onClick={handleInstallClick}>
            Add To Phone Screen
          </button>
        </div>
      )}

      <ChatGroupsListing
        allChatRooms={allChatRooms}
        handleOpenMessages={(group) => handleOpenMessages(group)}
        unreadCounts={unreadCounts}
        searchTerm={searchTerm}
        userId={userId}
      />

      {selectedGroup && (
        <div className="chat-overlay">
          <div className="chat-header">
            <div className="chat-user-info">
              <button
                className="btn back-arrow-chat"
                onClick={() => {
                  handleCloseChat();
                }}
              >
                <FaArrowLeft fontSize={16} />
              </button>
              <span className="mx-2">{`${
                roomDisplayDetails?.name || selectedGroup.roomName
              }`}</span>
            </div>
          </div>
          <div className="chat-messages" ref={chatBodyRef}>
            {messages.map((msg) => {
              const isMe = String(msg.senderId) === String(userID);
              const senderName = msg.senderName;
              return msg?.type !== "info" ? (
                <div
                  key={msg.id || msg._id}
                  className={`chat-message ${isMe ? "sender" : "receiver"}`}
                >
                  {!isMe && (
                    <div
                      className="chat-avatar-receiver"
                      style={{
                        backgroundColor: getAvatarColor(
                          senderName || msg.senderPhone
                        ),
                      }}
                    >
                      {senderName
                        ? senderName.charAt(0).toUpperCase()
                        : (msg.senderPhone || "U").charAt(0)}
                    </div>
                  )}
                  <div
                    className={`chat-bubble ${isMe ? "sender" : "receiver"}`}
                  >
                    {!isMe && (
                      <div
                        className="chat-sender"
                        onClick={() => handleClickUserName(msg.senderId)}
                      >
                        {senderName
                          ? senderName
                          : `+91 ${(msg.senderPhone || "").slice(0, -4)}XXXX`}
                      </div>
                    )}
                    <div className="chat-text">{linkify(msg.message)}</div>
                    <div className="chat-time">
                      {msg.sentAt?.toDate
                        ? new Date(msg.sentAt.toDate()).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )
                        : msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <p className="text-info">{msg?.message}</p>
                </div>
              );
            })}
          </div>

          <div className="chat-input-container">
            <button
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => {
                if (showEmojiPicker) {
                  setShowEmojiPicker(false);
                  setTimeout(() => {
                    textareaRef.current?.focus();
                  }, 0);
                } else {
                  textareaRef.current?.blur();
                  setTimeout(() => {
                    setShowEmojiPicker(true);
                  }, 50);
                }
              }}
              className="emoji-btn"
            >
              {showEmojiPicker ? (
                <FaRegKeyboard fontSize={20} />
              ) : (
                <Image src={emojiIcon} alt="Emoji" className="emoji-icon" />
              )}
            </button>

            <textarea
              value={text}
              ref={textareaRef}
              className="chat-input"
              rows={1}
              onFocus={() => {
                if (showEmojiPicker) setShowEmojiPicker(false);
                setTimeout(() => {
                  textareaRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });
                  window.scrollBy(0, -180);
                }, 300);
              }}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value.length > 0) setShowEmojiPicker(false);
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
              placeholder="Type message here..."
            />

            <button
              onClick={() => {
                sendMessage();
                if (textareaRef.current)
                  textareaRef.current.style.height = "auto";
              }}
              className="chat-send-btn"
            >
              <Image src={sendIcon} alt="Send" className="send-icon" />
            </button>
          </div>

          {showEmojiPicker && (
            <div
              className="emoji-container"
              onPointerDown={(e) => e.preventDefault()}
            >
              <EmojiPicker
                width={emojiWidth}
                searchDisabled={true}
                onEmojiClick={(emojiData) => {
                  const textarea = textareaRef.current;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  setText((prevText) => {
                    const newText =
                      prevText.substring(0, start) +
                      emojiData.emoji +
                      prevText.substring(end);
                    requestAnimationFrame(() => {
                      textarea.selectionStart = textarea.selectionEnd =
                        start + emojiData.emoji.length;
                    });
                    return newText;
                  });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupsList;