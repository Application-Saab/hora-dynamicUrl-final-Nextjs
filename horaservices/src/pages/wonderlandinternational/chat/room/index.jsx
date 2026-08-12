import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import EmojiPickerButton from "@/components/EmojiPicker";
import emojiIcon from "@/assets/wonderland/chat/Emoji.svg";
import keyboardIcon from "@/assets/wonderland/chat/keyboardIcon.svg";
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
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";

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
    typeof window !== "undefined" ? safeGetItem("userID") : null;
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
  const ignoreNextFocusRef = useRef(false);
  const initialScrollDoneRef = useRef(false);
  const inputTouchStartYRef = useRef(0);

  const scrollToBottom = () => {
    if (!chatBodyRef.current) return;
    setTimeout(() => {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, 150);
  };

  // Mark read on mount if selected
  useEffect(() => {
    if (selectedGroup && userId) {
      const gid = selectedGroup._id || selectedGroup.id;
      markRoomRead(gid, userId);
      fetchMessagesForRoom(gid);
    }
  }, [selectedGroup, userId]);

  // Set selected from groupId
  useEffect(() => {
    if (!groupId || !chatRooms.length) return;
    const selected = chatRooms.find(
      (room) => String(room._id || room.id) === String(groupId),
    );
    if (selected) setSelectedGroup(selected);
  }, [groupId, chatRooms]);

  // Reset on room change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.classList.remove("ready");
    }
    hasScrolledToUnreadRef.current = false;
    initialScrollDoneRef.current = false;
  }, [groupId]);

  // Local message listener
  useEffect(() => {
    if (!socket || !selectedGroup) return;
    const gid = selectedGroup._id || selectedGroup.id;
    const onMessageNewLocal = (msg) => {
      if (String(msg.groupId) !== String(gid)) return;
      setMessages((prev) => {
        if (msg.tempId && prev.some((m) => m.tempId === msg.tempId)) {
          return prev.map((m) =>
            m.tempId === msg.tempId ? { ...msg, id: msg._id } : m,
          );
        }
        if (prev.some((m) => String(m._id || m.id) === String(msg._id)))
          return prev;
        return [...prev, { ...msg, id: msg._id }];
      });
      setTimeout(() => markRoomRead(gid, userId), 50);
      scrollToBottom();
    };
    socket.on("message:new", onMessageNewLocal);
    return () => socket.off("message:new", onMessageNewLocal);
  }, [selectedGroup, userId]);

  // First scroll BEFORE paint (synchronous)
  useLayoutEffect(() => {
    if (!messages.length || !selectedGroup || !chatBodyRef.current) return;
    if (initialScrollDoneRef.current) return;

    const container = chatBodyRef.current;
    const gid = selectedGroup._id || selectedGroup.id;
    const unreadCount = unreadCounts[gid] || 0;

    // FORCE scroll IMMEDIATELY (before ANY paint)
    if (unreadCount > 0) {
      const roomObj = chatRooms.find(
        (r) => String(r._id || r.id) === String(gid),
      );
      const lastReadMap = roomObj?.lastReadAt || roomObj?.lastReadAtMap || {};
      const lastReadForMe = lastReadMap[userId]
        ? new Date(lastReadMap[userId])
        : null;

      let firstUnreadIndex = -1;
      if (lastReadForMe) {
        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          const msgTime = msg.createdAt ? new Date(msg.createdAt) : null;
          if (String(msg.senderId) === String(userId)) continue;
          if (msgTime && msgTime > lastReadForMe) {
            firstUnreadIndex = i;
            break;
          }
        }
      }

      if (firstUnreadIndex !== -1) {
        // Scroll to element using direct scrollTop calculation
        const messageElements = container.querySelectorAll(".chat-message");
        const targetElement = messageElements[firstUnreadIndex];
        if (targetElement) {
          // Calculate exact scroll position
          const containerTop = container.getBoundingClientRect().top;
          const targetTop = targetElement.getBoundingClientRect().top;
          const scrollOffset = targetTop - containerTop;

          // Set scroll INSTANTLY
          container.scrollTop = container.scrollTop + scrollOffset;

          // Blink effect
          setTimeout(() => {
            targetElement.style.backgroundColor = "";
          }, 2000);
        }
      } else {
        container.scrollTop = container.scrollHeight;
      }
    } else {
      // No unread - bottom
      container.scrollTop = container.scrollHeight;
    }

    initialScrollDoneRef.current = true;
    hasScrolledToUnreadRef.current = true;

    // Show container AFTER scroll set
    container.classList.add("ready");
  }, [messages, selectedGroup, unreadCounts, chatRooms, userId]);

  // Visual viewport handling for keyboard
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;
    const docEl = document.documentElement;

    // Only update when height changes by >80px (keyboard open/close ~260px).
    // iOS cursor-drag fires vv.resize with ~5-20px fluctuations — these must NOT
    // trigger a paddingBottom recalculation or they shift the input box upward.
    let prevVvHeight = window.visualViewport?.height ?? window.innerHeight;

    const setVvh = (fromFocusEvent = false) => {
      const vv = window.visualViewport;
      if (!vv) return;

      const heightDelta = Math.abs(vv.height - prevVvHeight);
      const heightChanged = heightDelta > 80;
      if (heightChanged) prevVvHeight = vv.height;
      if (!heightChanged && !fromFocusEvent) return;

      // Reset page scroll only on real keyboard events, not on every scroll tick.
      if (window.scrollY !== 0) window.scrollTo(0, 0);

      const chatLayout = document.querySelector(".chat-layout");

      if (vv.height < window.innerHeight) {
        // iOS <15: keyboard reduces vv.height. The CSS uses height:var(--vvh) to
        // constrain the layout to the above-keyboard area — NO paddingBottom needed.
        // Adding paddingBottom here would double-compensate: layout height already = vv.height,
        // and padding would further shrink the content area (e.g. 400-260 = 140px — too small).
        docEl.style.setProperty("--vvh", `${vv.height}px`);
        document.body.style.overflow = "hidden";

        if (chatLayout) {
          chatLayout.addEventListener("touchmove", allowChatMessagesScroll, { passive: false });
          chatLayout.addEventListener("wheel", allowChatMessagesScroll, { passive: false });
          chatLayout.style.paddingBottom = "";
        }

        requestAnimationFrame(() => scrollToBottom());
      } else {
        // Keyboard closed, OR iOS 15+ where vv.height === window.innerHeight always.
        docEl.style.setProperty("--vvh", `${window.innerHeight}px`);
        document.body.style.overflow = "";

        if (chatLayout) {
          chatLayout.removeEventListener("touchmove", allowChatMessagesScroll);
          chatLayout.removeEventListener("wheel", allowChatMessagesScroll);

const cached = safeGetItem("keyboardHeight");
          const kbh = cached
            ? parseFloat(cached)
            : Math.max(Math.round((window.screen?.height ?? 750) * 0.44), 280);
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          if (
            isIOS &&
            fromFocusEvent &&
            textareaRef.current &&
            document.activeElement === textareaRef.current &&
            textareaRef.current.getAttribute("inputmode") !== "none"
          ) {
            // iOS 15+ only: vv.height = window.innerHeight even with keyboard open.
            // fromFocusEvent guard prevents Chrome iOS "Done" button from re-applying
            // padding: Done closes keyboard (vv.resize fires) but keeps input focused,
            // so without this guard activeElement===textarea wrongly re-applies padding.

            chatLayout.style.paddingBottom = `${kbh}px`;
             requestAnimationFrame(() => scrollToBottom());
          } else {
            chatLayout.style.paddingBottom = "";
          }
        }
      }
    };

    function allowChatMessagesScroll(e) {
      const chatMessages = document.querySelector(".chat-messages");
      const chatInput = document.querySelector(".chat-input");

      if (!chatMessages || !chatInput) return e.preventDefault();

      if (chatMessages.contains(e.target)) return;

      if (chatInput.contains(e.target)) {
        // Allow internal scroll ONLY when input has overflow text (multi-line).
        // If input is short/empty (scrollHeight <= clientHeight), iOS bubbles the
        // pan gesture to the window — shifting the fixed layout upward.
        // Preventing here stops iOS from treating the gesture as a page scroll.
        if (chatInput.scrollHeight > chatInput.clientHeight + 2) return;
        return e.preventDefault();
      }

      e.preventDefault();
    }

    // Minimal scroll handler — only resets page scrollY, does NOT recalculate layout.
    // On iOS, scrolling within the contentEditable or dragging the cursor handle fires
    // vv.scroll WITHOUT changing vv.height. Calling full setVvh here would incorrectly
    // recalculate keyboardH and shift the input box up, leaving a gap above the keyboard.
    const onVvScroll = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };

    // iOS 15+: keyboard does NOT change vv.height, so vv.resize never fires.
    // Use focus/blur on the input to apply/remove keyboard padding.
    // blurSafetyTimer: safety net for Chrome iOS "Done" on iOS 15+ — if blur fires
    // but vv.resize doesn't (height never changes), clear padding after animation.
    const inputEl = textareaRef.current;
let blurSafetyTimer = null;
    const onInputFocus = () => {
      clearTimeout(blurSafetyTimer);
      requestAnimationFrame(() => setVvh(true));
    };
    const onInputBlur = () => {
      requestAnimationFrame(() => setVvh(true));
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        blurSafetyTimer = setTimeout(() => {
          blurSafetyTimer = null;
          const cl = document.querySelector(".chat-layout");
          if (cl) cl.style.paddingBottom = "";
        }, -5);
      }
    };

    inputEl?.addEventListener("focus", onInputFocus);
    inputEl?.addEventListener("blur", onInputBlur);

    setVvh();
    window.visualViewport?.addEventListener("resize", setVvh);
    window.visualViewport?.addEventListener("scroll", onVvScroll);

    return () => {
      clearTimeout(blurSafetyTimer);
      window.visualViewport?.removeEventListener("resize", setVvh);
      window.visualViewport?.removeEventListener("scroll", onVvScroll);
      inputEl?.removeEventListener("focus", onInputFocus);
      inputEl?.removeEventListener("blur", onInputBlur);
      document.body.style.overflow = "";
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
    ignoreNextFocusRef.current = true;

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
        "GET",
      );
      if (!resp.error && resp.data) {
        setMessages(resp?.data || []);
        const roomObj = chatRooms.find(
          (r) => String(r._id || r.id) === String(groupId),
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
          "GET",
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
        ? safeGetItem("chatBgImage")
        : null;
    if (saved) {
      setChatBg(saved);
    } else {
      setChatBg(chatBgImage.src);
      if (typeof window !== "undefined") {
        safeSetItem("chatBgImage", chatBgImage.src);
      }
    }
  }, []);

  const handleBack = () => {
    const basePath = "/wonderlandinternational/chat";
    if (userId) {
      router.push(`${basePath}?id=${encodeURIComponent(userId)}`);
    } else {
      router.push(basePath);
    }
  };

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
      senderPhone: safeGetItem("mobileNumber"),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

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
    scrollToBottom();

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
    el.style.height = `${newHeight}px`;

    if (newHeight >= 120) {
      el.scrollTop = el.scrollHeight;
    }
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
          },
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
          }
        }
      }
      if (newGroupId) {
        router.push(`/wonderlandinternational/chat/room?groupId=${newGroupId}&id=${userId}`);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleClickGroupName = () => {
    if (selectedGroup?.roomType !== "direct" && selectedGroup?.eventId) {
      router.push(`/wonderlandinternational/invite?eventid=${selectedGroup?.eventId}`);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      setRoomDisplayDetails(getRoomDetails(selectedGroup, userId));
    }
  }, [selectedGroup]);

  const membersProfileMap = selectedGroup?.members?.reduce((acc, member) => {
    acc[member.userId] =
    { name: member.name, avatar: member.profileImageUrl } || {};
    return acc;
  }, {});
  function renderInfoMessage(msg, usersMap) {
    const currentName =
      usersMap[msg.actorId]?.name || msg.actorSnapshot?.name || "Someone";

    switch (msg.infoType) {
      case "user_joined":
        return `${currentName} joined the group`;
      default:
        return "";
    }
  }

  useEffect(() => {
    let pressTimer = null;

    const onTouchStart = (e) => {
      const link = e.target.closest("a.chat-link");
      if (!link) return;

      pressTimer = setTimeout(() => {
        const url = link.dataset.url;
        if (url) {
          navigator.clipboard.writeText(url);
        }
      }, 500);
    };

    const clearPress = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", clearPress);
    document.addEventListener("touchmove", clearPress);
    document.addEventListener("touchcancel", clearPress);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", clearPress);
      document.removeEventListener("touchmove", clearPress);
      document.removeEventListener("touchcancel", clearPress);
    };
  }, []);

  const linkifyHtml = (html) => {
    if (!html) return html;

    const container = document.createElement("div");
    container.innerHTML = html;

    const urlRegex = /((https?:\/\/)|(www\.))[^\s]+/gi;

    const walkNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!urlRegex.test(node.nodeValue)) return;

        const span = document.createElement("span");
        span.innerHTML = node.nodeValue.replace(urlRegex, (url) => {
          const href = url.startsWith("http") ? url : `https://${url}`;

          return `<a 
  href="${href}" 
  data-url="${href}"
  class="chat-link"
  target="_blank"
  rel="noopener noreferrer"
>${url}</a>`;
        });

        node.replaceWith(...span.childNodes);
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "IMG" || node.tagName === "A") return;

        [...node.childNodes].forEach(walkNodes);
      }
    };

    [...container.childNodes].forEach(walkNodes);

    return container.innerHTML;
  };
  function formatTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12;
    const min = minutes.toString().padStart(2, "0");

    return `${hours.toString().padStart(2, "0")}:${min} ${ampm}`;
  }

  return (
    <div
      className="chat-layout"
      style={{
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
      <div style={{ flex: 1 }} />
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
               className={`chat-message ${isMe ? "sender" : "receiver"} ${isConsecutive ? "consecutive" : ""
              }`}
            >
              {!isMe &&
                !isConsecutive &&
                (membersProfileMap?.[msg.senderId]?.avatar ? (
                  <img
                    src={membersProfileMap?.[msg.senderId]?.avatar}
                    alt={senderName || "avatar"}
                    className="chat-avatar-receiver"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="chat-avatar-receiver"
                    style={{
                      backgroundColor: getAvatarColor(
                        senderName || msg.senderPhone,
                      ),
                    }}
                  >
                    {senderName
                      ? senderName.charAt(0).toUpperCase()
                      : msg.senderPhone?.charAt(3)}
                  </div>
                ))}
              <div
                className={`chat-bubble ${isMe ? "sender" : "receiver"} ${isConsecutive ? "consecutive" : ""
                  } ${isConsecutive && !isMe
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
                      : `${msg.senderPhoneNumber?.slice(0, -4)}XXXX`}
                  </div>
                )}
                <div
                  className="chat-text"
                  dangerouslySetInnerHTML={{
                    __html: linkifyHtml(msg.html || msg.message),
                  }}
                />
                <div className="chat-time">{formatTime(msg.createdAt)}</div>
              </div>
            </div>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ margin: "12px 0" }}
              key={msg._id}
            >
              <p className="info-chat-message-box">
                {renderInfoMessage(msg, membersProfileMap)}
              </p>
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
          textareaRef={textareaRef}
          ignoreNextFocusRef={ignoreNextFocusRef}
        />
        <div
          ref={textareaRef}
          contentEditable
          inputMode="text"
          suppressContentEditableWarning={true}
          onTouchStart={(e) => {
            inputTouchStartYRef.current = e.touches[0]?.clientY ?? 0;
          }}
          onTouchEnd={(e) => {
            if (!textareaRef.current) return;
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
              const dy = Math.abs((e.changedTouches[0]?.clientY ?? 0) - inputTouchStartYRef.current);
              if (dy <= 10) {
                const cl = document.querySelector(".chat-layout");
                const hasPadding = parseFloat(cl?.style.paddingBottom) > 100;
                if (!hasPadding) {
                  // Keyboard is closed — replicate emoji-picker→keyboard flow.
                  // Setting inputmode="none" first makes iOS treat next focus as a fresh
                  // keyboard open → vv.height updates → vv.resize fires with real kbh.
                  const input = textareaRef.current;
                  input.setAttribute("inputmode", "none");
                  const tunnel = document.createElement("input");
                  tunnel.type = "text";
                  tunnel.setAttribute("autocomplete", "off");
                  tunnel.setAttribute("autocorrect", "off");
                  tunnel.setAttribute("autocapitalize", "off");
                  tunnel.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;";
                  document.body.appendChild(tunnel);
                  ignoreNextFocusRef.current = true;
                  tunnel.focus();
                  input.removeAttribute("inputmode");
                  input.focus({ preventScroll: true });
                  tunnel.remove();
                }
              }
            }
          }}

          onFocus={() => {
            if (showEmojiPicker) {
              setShowEmojiPicker(false);
            }
            const el = textareaRef.current;
            if (!el) return;
            el.addEventListener("keyup", saveCursor);
            el.addEventListener("mouseup", saveCursor);
            el.addEventListener("focus", saveCursor);
          }}
          onInput={() => {
            resizeTextarea();
            if (textareaRef.current.scrollHeight > 120) {
              textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
            }
          }}
          onClick={(e) => {
            setShowEmojiPicker(false);
            // iOS Safari: cursor placement in contentEditable is unreliable when
            // emoji <img> nodes are present — iOS places cursor at start/end of the
            // nearest block instead of the exact tap point.
            // The click event fires AFTER iOS's mousedown cursor placement, so
            // overriding the selection here wins over iOS's native (incorrect) result.
            if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) return;
            if (!textareaRef.current) return;
            const range =
              document.caretRangeFromPoint?.(e.clientX, e.clientY) ??
              (() => {
                const pos = document.caretPositionFromPoint?.(e.clientX, e.clientY);
                if (!pos) return null;
                const r = document.createRange();
                r.setStart(pos.offsetNode, pos.offset);
                r.collapse(true);
                return r;
              })();
            if (range && textareaRef.current.contains(range.startContainer)) {
              const sel = window.getSelection();
              sel?.removeAllRanges();
              sel?.addRange(range);
              lastRangeRef.current = range.cloneRange();
            }
          }}
          className="chat-input"
          data-placeholder="Type message here..."
        />
        <button
          onClick={sendMessage}
          onMouseDown={(e) => !showEmojiPicker && e.preventDefault()}
          className="chat-send-btn"
          type="button"
        >
          <Image src={sendIcon} alt="Send" className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
