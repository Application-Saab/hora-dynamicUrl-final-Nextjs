import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  CREATE_DIRECT_CHAT_ROOM,
  GET_CHAT_MESSAGES,
  GET_USER_BY_ID,
  MARK_READ_MESSAGE,
} from "@/utils/apiconstants";
import { getRoomDetails } from "@/utils/setGroupDetails";
import { useChatStore } from "@/hooks/ChatContext";
import socket from "@/socket";
import { sortRooms } from "@/hooks/ChatProvider";

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
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const { chatRooms, setChatRooms, unreadCounts, setUnreadCountsContext } =
    useChatStore();
  const { makeRequest: fetchUserRequest } = useApi();
  const { makeRequest: fetchMessagesRequest } = useApi();
  const { makeRequest: markReadRequest } = useApi();
  const { makeRequest: createDirectChatRequest } = useApi();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [roomDisplayDetails, setRoomDisplayDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatBg, setChatBg] = useState(null);
  const [userData, setUserData] = useState({});
  const textareaRef = useRef(null);
  const chatBodyRef = useRef(null);
  const hasScrolledToUnreadRef = useRef(false);
  const lastRangeRef = useRef(null);

  // Mark read on mount if selected
  useEffect(() => {
    if (selectedGroup && userId) {
      const gid = selectedGroup._id || selectedGroup.id;
      markRoomRead(gid, userId);
      fetchMessagesForRoom(gid)
    }
  }, [selectedGroup, userId]);

  // Set selected from groupId
  useEffect(() => {
    if (!groupId || !chatRooms.length) return;
    const selected = chatRooms.find(
      (room) => String(room._id || room.id) === String(groupId)
    );
    if (selected) setSelectedGroup(selected);
  }, [groupId, chatRooms]);

  // Local message listener
  useEffect(() => {
    if (!socket || !selectedGroup) return;
    const gid = selectedGroup._id || selectedGroup.id;
    const onMessageNewLocal = (msg) => {
      if (String(msg.groupId) !== String(gid)) return;
      setMessages((prev) => {
        if (msg.tempId && prev.some((m) => m.tempId === msg.tempId)) {
          return prev.map((m) =>
            m.tempId === msg.tempId ? { ...msg, id: msg._id } : m
          );
        }
        if (prev.some((m) => String(m._id || m.id) === String(msg._id)))
          return prev;
        return [...prev, { ...msg, id: msg._id }];
      });
      setTimeout(() => markRoomRead(gid, userId), 50);
    };
    socket.on("message:new", onMessageNewLocal);
    return () => socket.off("message:new", onMessageNewLocal);
  }, [selectedGroup, userId]);

  // Scroll to first unread or bottom on messages load
  useLayoutEffect(() => {
    if (!messages.length || !selectedGroup || !chatBodyRef.current) return;

    // Only scroll once when messages first load
    if (hasScrolledToUnreadRef.current) return;

    const gid = selectedGroup._id || selectedGroup.id;
    const unreadCount = unreadCounts[gid] || 0;

    setTimeout(() => {
      if (!chatBodyRef.current) return;

      if (unreadCount > 0) {
        const roomObj = chatRooms.find(
          (r) => String(r._id || r.id) === String(gid)
        );
        const lastReadMap = roomObj?.lastReadAt || roomObj?.lastReadAtMap || {};
        const lastReadForMe = lastReadMap[userId]
          ? new Date(lastReadMap[userId])
          : null;

        // Find first unread message index
        let firstUnreadIndex = -1;
        if (lastReadForMe) {
          for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            const msgTime = msg.createdAt ? new Date(msg.createdAt) : null;

            // Skip own messages
            if (String(msg.senderId) === String(userId)) continue;

            // Find first message after lastReadAt
            if (msgTime && msgTime > lastReadForMe) {
              firstUnreadIndex = i;
              break;
            }
          }
        }

        if (firstUnreadIndex !== -1) {
          // Scroll to first unread message
          const messageElements =
            chatBodyRef.current.querySelectorAll(".chat-message");
          const targetElement = messageElements[firstUnreadIndex];

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "auto",
              block: "start",
            });

            // Add a visual indicator
            targetElement.style.backgroundColor = "rgba(255, 235, 59, 0.3)";
            setTimeout(() => {
              targetElement.style.backgroundColor = "";
            }, 2000);
          }
        } else {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
      } else {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }

      hasScrolledToUnreadRef.current = true;
    }, 100);
  }, [messages, selectedGroup, unreadCounts, chatRooms, userId]);

  // Visual viewport handling for keyboard
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;
    const docEl = document.documentElement;
    const setVvh = () => {
      const vv = window.visualViewport;
      if (vv && vv.height < window.innerHeight) {
        docEl.style.setProperty("--vvh", `${vv.height}px`);
        setTimeout(() => {
          const input = document.querySelector(".chat-input-container");
          if (input) input.scrollIntoView({ block: "end", behavior: "smooth" });
        }, 100);
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100vw";
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
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        const chatLayout = document.querySelector(".chat-layout");
        if (chatLayout) {
          chatLayout.removeEventListener("touchmove", allowChatMessagesScroll);
          chatLayout.removeEventListener("wheel", allowChatMessagesScroll);
        }
      }
    };
    function allowChatMessagesScroll(e) {
      const chatMessages = document.querySelector(".chat-messages");
      if (!chatMessages) return e.preventDefault();
      if (chatMessages.contains(e.target)) {
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
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
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
    resizeTextarea();
  };

  const markRoomRead = async (groupId, userId) => {
    if (!groupId || !userId) return;
    try {
      setUnreadCountsContext((prev) => ({ ...prev, [groupId]: 0 }));
      if (socket && socket.connected) {
        socket.emit("message:read", { groupId: groupId, userId: userId });
      }
      const resp = await markReadRequest(`${MARK_READ_MESSAGE}`, "POST", {
        groupId: groupId,
        userId: userId,
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
      console.error("markRoomRead err", err);
    }
  };

  const fetchMessagesForRoom = async (groupId, page = 1, limit = 10000) => {
    if (!groupId) return;
    try {
      const resp = await fetchMessagesRequest(
        `${GET_CHAT_MESSAGES}/${groupId}?page=${page}&limit=${limit}`,
        "GET"
      );
      if (!resp.error && resp.data) {
        setMessages(resp?.data || []);
        const roomObj = chatRooms.find(
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

  // Fetch user details
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
      (!messageHTML ||
        messageHTML === "<br>" ||
        messageHTML === "<div><br></div>")
    ) {
      return;
    }
    if (!selectedGroup?.eventId || !userId) return;
    const groupId = selectedGroup?._id;
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
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
      senderName: userData?.name,
      senderPhone: localStorage.getItem("mobileNumber"),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    // tempIdToClientMap.current.set(tempId, true);
    if (socket && socket.connected) {
      socket.emit("message:send", {
        eventId: selectedGroup.eventId,
        groupId,
        message: messageHTML,
        html: messageHTML,
        type: "text",
        tempId,
        senderName: userData?.name,
        senderPhone: userData?.phone,
      });
    }
    textareaRef.current.innerHTML = "";
    textareaRef.current.style.height = "auto";
    if (!showEmojiPicker) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus({ preventScroll: true });
      });
    }
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, 120);
    el.style.height = newHeight + "px";
  };

  const handleClickUserName = async (senderId) => {
    try {
      const existingRoom = chatRooms.find((room) => {
        if (room.roomType !== "direct") return false;
        const memberIds = room.members.map((m) => m.userId);
        return memberIds.includes(userId) && memberIds.includes(senderId);
      });
      let newGroupId;
      if (existingRoom) {
        newGroupId = existingRoom._id || existingRoom.id;
      } else {
        const resp = await createDirectChatRequest(
          `${CREATE_DIRECT_CHAT_ROOM}`,
          "POST",
          {
            members: [userId, senderId],
            eventId: selectedGroup?.eventId,
          }
        );
        if (resp?.data) {
          const newRoom = {
            ...resp.data,
            lastMessageAt: null,
          };
          setChatRooms((prev) => sortRooms([...prev, newRoom]));
          newGroupId = resp.data._id || resp.data.id;

          if (socket && socket.connected) {
            socket.emit("joinRoom", { groupId: newGroupId });
            console.log(`Sender emitted joinRoom for ${newGroupId}`);
          }
        }
      }
      if (newGroupId) {
        router.push(`/chat/room?groupId=${newGroupId}&id=${userId}`);
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

  useEffect(() => {
    if (selectedGroup) {
      setRoomDisplayDetails(getRoomDetails(selectedGroup, userId));
    }
  }, [selectedGroup]);

  const membersProfileMap = selectedGroup?.members?.reduce((acc, member) => {
    acc[member.userId] = member.profileImageUrl || "";
    return acc;
  }, {});

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
              {!isMe &&
                !isConsecutive &&
                (membersProfileMap?.[msg.senderId] ? (
                  <img
                    src={membersProfileMap?.[msg.senderId]}
                    alt={senderName || "avatar"}
                    className="chat-avatar-receiver"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
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
                ))}
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
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ margin: "12px 0" }}
              key={msg._id}
            >
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
