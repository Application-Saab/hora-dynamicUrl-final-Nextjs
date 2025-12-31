import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import "../GroupsList.css";
import EmojiPickerButton from "@/components/EmojiPicker";
import emojiIcon from "@/assets/wonderland/chat/Emoji.svg";
import keyboardIcon from "@/assets/wonderland/chat/KeyboardIcon.svg";
import sendIcon from "@/assets/wonderland/chat/sendicon.png";
import chatBgImage from "@/assets/wonderland/chat/chatbackground.jpg";
import backIcon from "@/assets/wonderland/chat/BackIcon.png";
import useApi from "@/hooks/useApi";
import {
  BASE_URL,
  CREATE_DIRECT_CHAT_ROOM,
  GET_CHAT_MESSAGES,
  GET_CHAT_ROOMS,
  GET_USER_BY_ID,
  MARK_READ_MESSAGE,
  UNREAD_MESSAGE_COUNT,
} from "@/utils/apiconstants";
import { getRoomDetails } from "@/utils/setGroupDetails";
import { useChatStore } from "@/hooks/ChatContext";
import socket from "@/socket";

const getUserIdFromUrl = () => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const getAvatarColor = (name) => {
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#009688",
    "#4CAF50",
    "#FF9800",
    "#795548",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const ChatPage = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const userId = getUserIdFromUrl();
  const { data: chatRoomsData } = useApi(`${GET_CHAT_ROOMS}/${userId}`, "get");
  const { makeRequest: fetchUserRequest } = useApi();
  const { makeRequest: fetchMessagesRequest } = useApi();
  const { makeRequest: markReadRequest } = useApi();
  const { makeRequest: createDirectChatRequest } = useApi();

  const [allChatRooms, setAllChatRooms] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [roomDisplayDetails, setRoomDisplayDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatBg, setChatBg] = useState(null);
  const [userData, setUserData] = useState({});
  const { unreadCounts, setUnreadCountsContext } = useChatStore();

  const textareaRef = useRef(null);
  const chatBodyRef = useRef(null);
  const lastRangeRef = useRef(null);
  const tempIdToClientMap = useRef(new Map());

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;
    const docEl = document.documentElement;

    const setVvh = () => {
      const vv = window.visualViewport;
      // Use vv.height for --vvh when keyboard is open, else window.innerHeight
      if (vv && vv.height < window.innerHeight) {
        docEl.style.setProperty("--vvh", `${vv.height}px`);
        // Scroll chat-input into view to avoid white space
        setTimeout(() => {
          const input = document.querySelector(".chat-input-container");
          if (input) input.scrollIntoView({ block: "end", behavior: "smooth" });
        }, 100);
        // Lock all scroll on body
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100vw";
        // Lock chat-layout scroll except for .chat-messages
        const chatLayout = document.querySelector(".chat-layout");
        if (chatLayout) {
          chatLayout.addEventListener("touchmove", allowChatMessagesScroll, {
            passive: false,
          });
          chatLayout.addEventListener("wheel", allowChatMessagesScroll, {
            passive: false,
          });
        }
      } else {
        docEl.style.setProperty("--vvh", `${window.innerHeight}px`);
        // Restore scroll
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        // Remove chat-layout scroll lock
        const chatLayout = document.querySelector(".chat-layout");
        if (chatLayout) {
          chatLayout.removeEventListener("touchmove", allowChatMessagesScroll);
          chatLayout.removeEventListener("wheel", allowChatMessagesScroll);
        }
      }
    };
    // Allow scroll only on .chat-messages
    function allowChatMessagesScroll(e) {
      const chatMessages = document.querySelector(".chat-messages");
      if (!chatMessages) return e.preventDefault();
      if (chatMessages.contains(e.target)) {
        // Allow scroll inside chat-messages
        return;
      }
      e.preventDefault();
    }

    setVvh();

    window.visualViewport?.addEventListener("resize", setVvh);
    window.visualViewport?.addEventListener("scroll", setVvh);

    return () => {
      window.visualViewport?.removeEventListener("resize", setVvh);
      window.visualViewport?.removeEventListener("scroll", setVvh);
      // Clean up scroll lock
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      // Remove chat-layout scroll lock
      const chatLayout = document.querySelector(".chat-layout");
      if (chatLayout) {
        chatLayout.removeEventListener("touchmove", allowChatMessagesScroll);
        chatLayout.removeEventListener("wheel", allowChatMessagesScroll);
      }
    };
  }, []);

  // Cursor memory for emoji insertion
  const saveCursor = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      lastRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const insertEmoji = (emojiObject) => {
    const emojiUrl = emojiObject?.imageUrl;
    if (!textareaRef.current) return;
    textareaRef.current.setAttribute("inputmode", "none");
    textareaRef.current.focus({ preventScroll: true });
    setTimeout(() => {
      textareaRef.current.removeAttribute("inputmode");
    }, 50);

    let sel = window.getSelection();
    let range;

    if (
      lastRangeRef.current &&
      textareaRef.current.contains(lastRangeRef.current.startContainer)
    ) {
      range = lastRangeRef.current;
    } else {
      range = document.createRange();
      range.selectNodeContents(textareaRef.current);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);

    const img = document.createElement("img");
    img.src = emojiUrl;
    img.className = "emoji-inline";
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.verticalAlign = "middle";
    img.style.display = "inline-block";
    img.style.margin = "0 2px";

    range.insertNode(img);

    const newRange = document.createRange();
    newRange.setStartAfter(img);
    newRange.collapse(true);

    sel.removeAllRanges();
    sel.addRange(newRange);

    lastRangeRef.current = newRange;

    // ✅ Resize chat input after inserting emoji
    resizeTextarea();
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

  useEffect(() => {
    if (chatRoomsData?.data) {
      setAllChatRooms(chatRoomsData.data || []);
      const selected = chatRoomsData.data.find((room) => {
        const id = room._id || room.id;
        return id === groupId;
      });
      setSelectedGroup(selected || null);
    }
  }, [chatRoomsData?.data, groupId]);

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
        const lastReadForMe = lastReadMap[userId]
          ? new Date(lastReadMap[userId])
          : null;
        const unread = (resp.data || []).filter((m) => {
          const created = m.createdAt
            ? new Date(m.createdAt)
            : m.sentAt
            ? new Date(m.sentAt)
            : null;
          if (!created || String(m.senderId) === String(userId)) return false;
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
          setUserData(resp?.data || {});
        }
      } catch (err) {
        console.log("Error fetching user:", err.message);
      }
    };
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("chatBgImage")
        : null;

    if (saved) {
      setChatBg(saved);
    } else {
      setChatBg(chatBgImage.src);
      if (typeof window !== "undefined") {
        localStorage.setItem("chatBgImage", chatBgImage.src);
      }
    }
  }, []);

  const handleBack = () => {
    const basePath = "/chat";
    if (userId) {
      router.push(`${basePath}?id=${encodeURIComponent(userId)}`);
    } else {
      router.push(basePath);
    }
  };

  const handleImageUpload = async () => {};

const sendMessage = async () => {
  if (!textareaRef.current) return;

  const messageHTML = textareaRef.current.innerHTML.trim();
  const messageText = textareaRef.current.textContent.trim();

  if (
    !messageText &&
    (!messageHTML || messageHTML === "<br>" || messageHTML === "<div><br></div>")
  ) return;

  if (!selectedGroup?.eventId || !userId) return;

  const groupId = selectedGroup._id;
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const optimistic = {
    id: tempId,
    tempId,
    _id: tempId,
    eventId: selectedGroup.eventId,
    groupId,
    senderId: userId,
    message: messageHTML,
    html: messageHTML,
    type: "text",
    senderName: userData?.name || "User",
    senderPhone: localStorage.getItem("mobileNumber") || "",
    createdAt: new Date().toISOString(),
  };

  setMessages((prev) => [...prev, optimistic]);
  tempIdToClientMap.current.set(tempId, true);

  if (socket && socket.connected) {
    socket.emit("message:send", {
      eventId: selectedGroup.eventId,
      groupId,
      message: messageHTML,
      html: messageHTML,
      type: "text",
      tempId,
      senderName: userData?.name || "User",
      senderPhone: localStorage.getItem("mobileNumber") || "",
    });
  }

  textareaRef.current.innerHTML = "";
  textareaRef.current.style.height = "auto";


  if (!showEmojiPicker) {
    setTimeout(() => {
      textareaRef.current?.focus({ preventScroll: true });
    }, 50);
  } else {
    textareaRef.current?.blur();
  }
};




  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto"; // reset
    const newHeight = Math.min(el.scrollHeight, 120); // max height 120px
    el.style.height = newHeight + "px";
  };

  useEffect(() => {
    if (selectedGroup) {
      setRoomDisplayDetails(getRoomDetails(selectedGroup, userId));
      fetchMessagesForRoom(selectedGroup._id || selectedGroup.id);
    }
  }, [selectedGroup]);

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
        // handleOpenMessages(existingRoom);
        router.push(
          `/chat/room?groupId=${
            existingRoom._id || existingRoom.id
          }&id=${userId}`
        );
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
        // handleOpenMessages(resp?.data);
        router.push(
          `/chat/room?groupId=${resp.data._id || resp.data.id}&id=${userId}`
        );
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleClickGroupName = () => {
    if (selectedGroup?.roomType !== "direct" && selectedGroup?.eventId) {
      router.push(`/wonderland/invite?eventid=${selectedGroup?.eventId}`);
    }
  };

  return (
    <div
      className="chat-layout"
      style={{
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingBottom: showEmojiPicker ? "260px" : "5px",
      }}
    >
      {" "}
      <div className="chat-header-wrapper">
        <div className="chat-header">
          <div className="chat-user-info">
            <Image
              src={backIcon}
              alt="Back"
              className="back-arrow-img"
              onClick={handleBack}
            />
            {roomDisplayDetails?.avatar ? (
              <img
                src={roomDisplayDetails.avatar}
                alt={roomDisplayDetails.name}
                className="chat-group-img"
              />
            ) : (
              <div className="placeholder-avatar">
                {roomDisplayDetails?.avatarText}
              </div>
            )}

            <span className="chat-group-name" onClick={handleClickGroupName}>
              {roomDisplayDetails?.name}
            </span>
          </div>
        </div>
      </div>
      <div className="chat-messages" ref={chatBodyRef}>
        {messages.map((msg, index) => {
          const isMe = msg.senderId === userId;
          const senderName = msg.senderName;
          const previousMsg = messages[index - 1];
          const isConsecutive =
            previousMsg && previousMsg.senderId === msg.senderId;

          let consecutiveIndex = 0;
          if (isConsecutive && !isMe) {
            for (let i = index - 1; i >= 0; i--) {
              if (messages[i].senderId === msg.senderId) {
                consecutiveIndex++;
              } else {
                break;
              }
            }
          }

          return msg?.type !== "info" ? (
            <div
              key={msg._id}
              className={`chat-message ${isMe ? "sender" : "receiver"} ${
                isConsecutive ? "consecutive" : ""
              }`}
            >
              {!isMe && !isConsecutive && (
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
                    : msg.senderPhone?.charAt(3)}
                </div>
              )}
              <div
                className={`chat-bubble ${isMe ? "sender" : "receiver"} ${
                  isConsecutive ? "consecutive" : ""
                } ${
                  isConsecutive && !isMe
                    ? consecutiveIndex % 2 === 0
                      ? "consecutive-even"
                      : "consecutive-odd"
                    : ""
                }`}
              >
                {!isMe && !isConsecutive && (
                  <div
                    className="chat-sender"
                    onClick={() => handleClickUserName(msg.senderId)}
                  >
                    {senderName
                      ? senderName
                      : `+91 ${msg.senderPhoneNumber?.slice(0, -4)}XXXX`}
                  </div>
                )}

                <div
                  className="chat-text"
                  dangerouslySetInnerHTML={{ __html: msg.html || msg.message }}
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ margin: "12px 0" }} key={msg._id}>
              <p className="info-chat-message-box">{msg?.message}</p>
            </div>
          );
        })}
      </div>
      <div className="chat-input-container">
        <EmojiPickerButton
          onEmojiSelect={insertEmoji}
          isPickerOpen={showEmojiPicker}
          setIsPickerOpen={setShowEmojiPicker}
          simple={true}
          emojiIcon={emojiIcon}
          keyboardIcon={keyboardIcon}
        />

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        <div
          ref={textareaRef}
          contentEditable
          inputMode="text"
          suppressContentEditableWarning={true}
          onFocus={() => {
            const el = textareaRef.current;
            if (!el) return;
            el.addEventListener("keyup", saveCursor);
            el.addEventListener("mouseup", saveCursor);
            el.addEventListener("focus", saveCursor);
          }}
          onInput={(e) => {
            resizeTextarea();
          }}
          className="chat-input"
          data-placeholder="Type message here..."
        />

        <button
          onClick={sendMessage}
          onMouseDown={(e) => e.preventDefault()}
          className="chat-send-btn"
        >
          <Image src={sendIcon} alt="Send" className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
