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
import {
  getCachedMessages,
  setCachedMessages,
  getCachedRoomDetails,
  setCachedRoomDetails,
} from "@/utils/messagesCache";

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
  // router.query is empty on first render in Next.js (hydration delay).
  // Read directly from the URL as fallback so effects fire immediately.
  const groupId =
    router.query.groupId ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("groupId")
      : null);
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userID") ||
        new URLSearchParams(window.location.search).get("id")
      : null;
  const { chatRooms, setChatRooms, unreadCounts, setUnreadCountsContext } =
    useChatStore();
  const { makeRequest: fetchUserRequest } = useApi();
  const { makeRequest: fetchMessagesRequest } = useApi();
  const { makeRequest: markReadRequest } = useApi();
  const { makeRequest: createDirectChatRequest } = useApi();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [roomDisplayDetails, setRoomDisplayDetails] = useState(() => {
    if (typeof window === "undefined") return {};
    const gid = new URLSearchParams(window.location.search).get("groupId");
    return gid ? (getCachedRoomDetails(gid) || {}) : {};
  });

  // Synchronous lazy init — reads localStorage cache before first render.
  // If cache exists, chat shows on the very first paint with zero extra render cycles.
  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [];
    const gid = new URLSearchParams(window.location.search).get("groupId");
    return gid ? (getCachedMessages(gid) || []) : [];
  });
  const [messagesLoading, setMessagesLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    const gid = new URLSearchParams(window.location.search).get("groupId");
    if (!gid) return true;
    const cached = getCachedMessages(gid);
    return !cached || cached.length === 0;
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatBg] = useState(() => {
    if (typeof window === "undefined") return chatBgImage.src;
    const saved = localStorage.getItem("chatBgImage");
    if (saved) return saved;
    try { localStorage.setItem("chatBgImage", chatBgImage.src); } catch {}
    return chatBgImage.src;
  });
  const [userData, setUserData] = useState({});
  const textareaRef = useRef(null);
  const chatBodyRef = useRef(null);
  const lastRangeRef = useRef(null);
  const ignoreNextFocusRef = useRef(false);
  const isEmojiInsertRef = useRef(false);
  const isComposingRef = useRef(false);
  const initialScrollDoneRef = useRef(false);
  const showEmojiPickerRef = useRef(false);
  const inputTouchStartYRef = useRef(0);
  // Tracks which groupId is currently rendered — used to detect room switches
  const activeGroupIdRef = useRef(
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("groupId")
      : null
  );

  const scrollToBottom = (smooth = false) => {
    if (!chatBodyRef.current) return;
    requestAnimationFrame(() => {
      const el = chatBodyRef.current;
      if (!el) return;
      el.style.scrollBehavior = smooth ? "smooth" : "auto";
      el.scrollTop = el.scrollHeight;
    });
  };

  // Load messages on mount/room-switch — serve from cache, always refresh in background
  useEffect(() => {
    if (!groupId || !userId) return;

    const isRoomSwitch = activeGroupIdRef.current !== groupId;
    activeGroupIdRef.current = groupId;

    if (isRoomSwitch) {
      // Navigating to a different room — reset scroll/visibility and load that room
      initialScrollDoneRef.current = false;
      if (chatBodyRef.current) chatBodyRef.current.classList.remove("ready");

      const cached = getCachedMessages(groupId);
      if (cached && cached.length > 0) {
        setMessages(cached);
        setMessagesLoading(false);
        fetchMessagesForRoom(groupId, true);
      } else {
        setMessages([]);
        setMessagesLoading(true);
        fetchMessagesForRoom(groupId, false);
      }
    } else {
      // Initial mount — messages already loaded from cache via lazy useState.
      // Just background-refresh so new messages appear without any spinner.
      const cached = getCachedMessages(groupId);
      if (cached && cached.length > 0) {
        fetchMessagesForRoom(groupId, true);
      } else {
        // No cache at all — fetch normally
        fetchMessagesForRoom(groupId, false);
      }
    }

    markRoomRead(groupId, userId);
  }, [groupId, userId]);

  // Set selectedGroup from chatRooms (for header display and room details)
  useEffect(() => {
    if (!groupId || !chatRooms.length) return;
    const selected = chatRooms.find(
      (room) => String(room._id || room.id) === String(groupId),
    );
    if (selected) setSelectedGroup(selected);
  }, [groupId, chatRooms]);

  // Join socket room when chat opens so server sends message:new events here
  useEffect(() => {
    if (!socket || !selectedGroup) return;
    const gid = selectedGroup._id || selectedGroup.id;
    const join = () => socket.emit("joinRoom", { groupId: gid });
    if (socket.connected) {
      join();
    } else {
      window.addEventListener("socket:connected", join, { once: true });
      return () => window.removeEventListener("socket:connected", join);
    }
  }, [selectedGroup]);

  // Local message listener
  useEffect(() => {
    if (!socket || !selectedGroup) return;
    const gid = selectedGroup._id || selectedGroup.id;
    const onMessageNewLocal = (msg) => {
      if (String(msg.groupId) !== String(gid)) return;
      setMessages((prev) => {
        let updated;
        if (msg.tempId && prev.some((m) => m.tempId === msg.tempId)) {
          updated = prev.map((m) =>
            m.tempId === msg.tempId ? { ...msg, id: msg._id } : m,
          );
        } else if (prev.some((m) => String(m._id || m.id) === String(msg._id))) {
          return prev;
        } else {
          updated = [...prev, { ...msg, id: msg._id }];
        }
        setCachedMessages(gid, updated);
        return updated;
      });
      setTimeout(() => markRoomRead(gid, userId), 50);
      scrollToBottom(true);
    };
    socket.on("message:new", onMessageNewLocal);
    return () => socket.off("message:new", onMessageNewLocal);
  }, [selectedGroup, userId]);

  // First scroll BEFORE paint (synchronous) — runs as soon as messages are ready
  useLayoutEffect(() => {
    if (!messages.length || !chatBodyRef.current) return;
    if (initialScrollDoneRef.current) return;

    const container = chatBodyRef.current;
    // Always reset to instant scroll — prevents stale `smooth` from animating this jump
    container.style.scrollBehavior = "auto";

    const gid = selectedGroup?._id || selectedGroup?.id || groupId;
    const unreadCount = unreadCounts[gid] || 0;

    // Only attempt unread-scroll when chatRooms is loaded so lastReadAt is available
    if (unreadCount > 0 && chatRooms.length > 0) {
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

      if (firstUnreadIndex > 0) {
        const messageElements = container.querySelectorAll(".chat-message");
        const targetElement = messageElements[firstUnreadIndex];
        if (targetElement) {
          const containerTop = container.getBoundingClientRect().top;
          const targetTop = targetElement.getBoundingClientRect().top;
          container.scrollTop = container.scrollTop + (targetTop - containerTop);
        }
      } else {
        container.scrollTop = container.scrollHeight;
      }
    } else {
      // chatRooms not yet loaded or no unread — default to bottom
      container.scrollTop = container.scrollHeight;
    }

    initialScrollDoneRef.current = true;
    container.classList.add("ready");
  }, [messages, selectedGroup, unreadCounts, chatRooms, userId]);

  // Visual viewport handling for keyboard
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;
    const docEl = document.documentElement;

    const setVvh = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const chatLayout = document.querySelector(".chat-layout");

      if (vv.height < window.innerHeight) {
        // Emoji picker is managing layout — skip entirely to avoid flicker during
        // the keyboard-close animation that plays while transitioning keyboard→emoji.
        if (showEmojiPickerRef.current) return;

        const keyboardH = window.innerHeight - vv.height;
        docEl.style.setProperty("--vvh", `${vv.height}px`);
        document.body.style.overflow = "hidden";

        if (chatLayout) {
          chatLayout.addEventListener("touchmove", allowChatMessagesScroll, { passive: false });
          chatLayout.addEventListener("wheel", allowChatMessagesScroll, { passive: false });

          // iOS 15+ Safari: vv.height === window.innerHeight always, so this branch
          // never fires — browser handles bottom:0 above keyboard automatically.
          // Older iOS / Android / iPad Chrome: branch fires, paddingBottom pushes
          // content above the keyboard without hiding the input.
          // Math.max prevents padding from temporarily dropping during emoji→keyboard
          // transition (keyboard opens gradually, keyboardH starts small).
          const currentPadding = parseFloat(chatLayout.style.paddingBottom) || 0;
          chatLayout.style.paddingBottom = `${Math.max(keyboardH, currentPadding)}px`;
        }

        requestAnimationFrame(() => scrollToBottom());
      } else {
        // Keyboard fully closed
        docEl.style.setProperty("--vvh", `${window.innerHeight}px`);
        document.body.style.overflow = "";

        if (chatLayout) {
          chatLayout.removeEventListener("touchmove", allowChatMessagesScroll);
          chatLayout.removeEventListener("wheel", allowChatMessagesScroll);
          if (showEmojiPickerRef.current) {
            const kbh = parseFloat(localStorage.getItem("keyboardHeight") || "260");
            chatLayout.style.paddingBottom = `${kbh}px`;
          } else {
            chatLayout.style.paddingBottom = "";
          }
        }
      }
    };

    function allowChatMessagesScroll(e) {
      const chatMessages = document.querySelector(".chat-messages");
      const chatInput = document.querySelector(".chat-input");

      if (!chatMessages && !chatInput) return e.preventDefault();

      if (chatMessages.contains(e.target) || chatInput.contains(e.target)) {
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
      const chatLayout = document.querySelector(".chat-layout");
      if (chatLayout) {
        chatLayout.removeEventListener("touchmove", allowChatMessagesScroll);
        chatLayout.removeEventListener("wheel", allowChatMessagesScroll);
      }
    };
  }, []);

  const emojiEffectMountedRef = useRef(false);
  // Keep emoji ref in sync so setVvh closure can read it
  // Scroll to bottom after layout reflow — skip on initial mount to avoid visible animation
  useEffect(() => {
    showEmojiPickerRef.current = showEmojiPicker;
    if (!emojiEffectMountedRef.current) {
      emojiEffectMountedRef.current = true;
      return;
    }
    setTimeout(() => scrollToBottom(true), 80);
  }, [showEmojiPicker]);

  // Track cursor position whenever selection changes inside the input
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!textareaRef.current) return;
      const sel = window.getSelection();
      if (
        sel &&
        sel.rangeCount > 0 &&
        textareaRef.current.contains(sel.anchorNode)
      ) {
        lastRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const insertEmoji = (emojiObject) => {
    const emojiUrl = emojiObject?.imageUrl;
    if (!textareaRef.current) return;
    ignoreNextFocusRef.current = true;
    isEmojiInsertRef.current = true;

    const el = textareaRef.current;
    // Capture scroll BEFORE focus() so mobile browser scroll side-effects don't corrupt it
    const savedScrollTop = el.scrollTop;

    el.setAttribute("inputmode", "none");
    el.focus({ preventScroll: true });

    let sel = window.getSelection();
    let range;
    if (
      lastRangeRef.current &&
      el.contains(lastRangeRef.current.startContainer)
    ) {
      range = lastRangeRef.current;
    } else {
      range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);

    const img = document.createElement("img");
    img.src = emojiUrl;
    img.className = "emoji-inline";

    range.insertNode(img);

    const newRange = document.createRange();
    newRange.setStartAfter(img);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    lastRangeRef.current = newRange;

    requestAnimationFrame(() => {
      if (!el) return;

      // Resize height (may reset scrollTop on mobile)
      el.style.height = "auto";
      const newHeight = Math.min(el.scrollHeight, 120);
      el.style.height = `${newHeight}px`;

      // Restore to the scroll position the user had before selecting the emoji
      el.scrollTop = savedScrollTop;

      // Only nudge scroll if cursor is genuinely outside the visible area
      if (el.scrollHeight > el.clientHeight) {
        const s = window.getSelection();
        if (s && s.rangeCount > 0) {
          const rng = s.getRangeAt(0).cloneRange();
          rng.collapse(true);
          const rect = rng.getBoundingClientRect();
          if (rect.width !== 0 || rect.height !== 0 || rect.top !== 0) {
            const elRect = el.getBoundingClientRect();
            const relTop = rect.top - elRect.top + el.scrollTop;
            if (relTop < el.scrollTop) {
              el.scrollTop = relTop;
            } else if (relTop + rect.height > el.scrollTop + el.clientHeight) {
              el.scrollTop = relTop + rect.height - el.clientHeight;
            }
          } else {
            // mobile Chrome: cursor rect is zero after img node.
            // Use the inserted img's own rect to scroll just enough to keep it visible —
            // avoids jumping to end when emoji was inserted in the middle of a message.
            const imgRect = img.getBoundingClientRect();
            if (imgRect.height !== 0) {
              const elRect = el.getBoundingClientRect();
              const relTop = imgRect.top - elRect.top + el.scrollTop;
              if (relTop < el.scrollTop) {
                el.scrollTop = relTop;
              } else if (relTop + imgRect.height > el.scrollTop + el.clientHeight) {
                el.scrollTop = relTop + imgRect.height - el.clientHeight;
              }
              // else: emoji is already visible — keep savedScrollTop as-is
            }
            // if imgRect is also zero, savedScrollTop is already restored above — do nothing
          }
        }
      }

      // Clear flag in a second RAF so any async onInput fired by insertNode
      // (Chrome fires input events on contentEditable for programmatic mutations)
      // still sees isEmojiInsertRef = true and does not scroll-to-bottom
      requestAnimationFrame(() => {
        isEmojiInsertRef.current = false;
      });
    });
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

  const fetchMessagesForRoom = async (targetGroupId, isBackgroundRefresh = false, page = 1, limit = 1000) => {
    if (!targetGroupId) return;
    let stale = false;
    try {
      const resp = await fetchMessagesRequest(
        `${GET_CHAT_MESSAGES}/${targetGroupId}?page=${page}&limit=${limit}`,
        "GET",
      );
      if (!resp.error && resp.data) {
        // Discard results if user navigated to a different room while fetch was in flight
        if (activeGroupIdRef.current !== targetGroupId) { stale = true; return; }

        const fetched = resp.data || [];

        // Merge instead of overwrite: preserve any messages in current state that are
        // NOT in the server response — covers:
        //  • Optimistic messages sent but not yet confirmed by socket
        //  • Socket-received messages that arrived after this fetch was dispatched
        setMessages((prev) => {
          if (!prev.length) return fetched;
          const fetchedIdSet = new Set(fetched.map((m) => String(m._id || m.id)));
          const extra = prev.filter((m) => !fetchedIdSet.has(String(m._id || m.id)));
          return extra.length > 0 ? [...fetched, ...extra] : fetched;
        });

        setCachedMessages(targetGroupId, fetched);
        const roomObj = chatRooms.find(
          (r) => String(r._id || r.id) === String(targetGroupId),
        );
        const lastReadMap = roomObj?.lastReadAt || roomObj?.lastReadAtMap || {};
        const lastReadForMe = lastReadMap[userId]
          ? new Date(lastReadMap[userId])
          : null;
        const unread = fetched.filter((m) => {
          const created = m.createdAt
            ? new Date(m.createdAt)
            : m.sentAt
              ? new Date(m.sentAt)
              : null;
          if (!created || String(m.senderId) === String(userId)) return false;
          return lastReadForMe ? created > lastReadForMe : true;
        }).length;
        setUnreadCountsContext((prev) => ({ ...prev, [targetGroupId]: unread }));
      } else {
        console.warn("Failed fetch messages", resp);
      }
    } catch (err) {
      console.error("Fetch messages failed", err);
    } finally {
      if (!stale && !isBackgroundRefresh) setMessagesLoading(false);
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

  const handleBack = () => {
    router.back();
  };

  const sendMessage = async () => {
    if (!textareaRef.current) return;
    const rawHTML = textareaRef.current.innerHTML.trim();
    const messageText = textareaRef.current.textContent.trim();
    if (
      !messageText &&
      (!rawHTML ||
        rawHTML === "<br>" ||
        rawHTML === "<div><br></div>")
    ) {
      return;
    }
    if (!selectedGroup?.eventId || !userId) return;

    // Convert any keyboard Unicode emoji → <img class="emoji-inline"> so all emoji
    // are stored as images, matching the emoji picker's output
    const messageHTML = processEmojiInHtml(rawHTML);

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
    textareaRef.current.parentElement?.classList.remove("multi-line");
    scrollToBottom(true);

    if (!showEmojiPicker) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus({ preventScroll: true });
      });
    }
  };

  const handleBackspace = () => {
    if (!textareaRef.current) return;
    const sel = window.getSelection();
    if (!sel) return;

    // Restore saved cursor position
    if (lastRangeRef.current && textareaRef.current.contains(lastRangeRef.current.startContainer)) {
      sel.removeAllRanges();
      sel.addRange(lastRangeRef.current.cloneRange());
    }
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    if (!range.collapsed) {
      range.deleteContents();
    } else {
      const { startContainer: node, startOffset: offset } = range;
      if (node.nodeType === Node.TEXT_NODE && offset > 0) {
        range.setStart(node, offset - 1);
        range.deleteContents();
      } else {
        const target =
          node.nodeType === Node.ELEMENT_NODE && offset > 0
            ? node.childNodes[offset - 1]
            : node.nodeType === Node.TEXT_NODE
              ? node.previousSibling
              : null;
        if (target) {
          if (target.nodeType === Node.TEXT_NODE && target.length > 0) {
            target.deleteData(target.length - 1, 1);
            const r = document.createRange();
            r.setStart(target, target.length);
            r.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r);
          } else if (target.nodeType === Node.ELEMENT_NODE) {
            const parent = target.parentNode;
            const idx = [...parent.childNodes].indexOf(target);
            target.remove();
            const r = document.createRange();
            r.setStart(parent, idx);
            r.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r);
          }
        }
      }
    }

    const updated = window.getSelection();
    if (updated?.rangeCount > 0) lastRangeRef.current = updated.getRangeAt(0).cloneRange();
    resizeTextarea();
  };

  const convertEmojiInInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    const EMOJI_RE =
      /(?:[\u{1F1E0}-\u{1F1FF}]{2}|[#*0-9]️⃣|\p{Extended_Pictographic}\p{Emoji_Modifier}?️?(?:‍\p{Extended_Pictographic}\p{Emoji_Modifier}?️?)*)/gu;

    const sel = window.getSelection();
    const anchorNode = sel?.rangeCount ? sel.getRangeAt(0).startContainer : null;
    const anchorOffset = sel?.rangeCount ? sel.getRangeAt(0).startOffset : 0;

    let anyConverted = false;
    let cursorImg = null;
    let lastAnyImg = null;

    const walk = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "IMG") return;
        [...node.childNodes].forEach(walk);
        return;
      }
      if (node.nodeType !== Node.TEXT_NODE) return;

      const text = node.nodeValue;
      EMOJI_RE.lastIndex = 0;
      if (!EMOJI_RE.test(text)) return;
      EMOJI_RE.lastIndex = 0;

      const isCursor = node === anchorNode;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;

      while ((m = EMOJI_RE.exec(text)) !== null) {
        if (m.index > last)
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));

        const img = document.createElement("img");
        img.src = getEmojiImageUrl(m[0]);
        img.className = "emoji-inline";
        img.alt = m[0];
        img.setAttribute(
          "onerror",
          "if(!this.dataset.r){this.dataset.r='1';this.src=this.src.replace('.png','-fe0f.png');}else{this.alt='';this.style.display='none';}"
        );
        frag.appendChild(img);
        lastAnyImg = img;
        if (isCursor && m.index + m[0].length <= anchorOffset) cursorImg = img;
        last = m.index + m[0].length;
        anyConverted = true;
      }

      if (last < text.length)
        frag.appendChild(document.createTextNode(text.slice(last)));

      node.parentNode.replaceChild(frag, node);
    };

    [...el.childNodes].forEach(walk);

    if (!anyConverted) return;

    const target = cursorImg || lastAnyImg;
    if (target && sel) {
      const range = document.createRange();
      range.setStartAfter(target);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      lastRangeRef.current = range.cloneRange();
    }
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    const prevScrollTop = el.scrollTop;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, 120);
    el.style.height = `${newHeight}px`;

    // Reduce border-radius when input grows beyond a single line (~44px)
    const container = el.parentElement;
    if (container) {
      container.classList.toggle("multi-line", newHeight > 44);
    }

    // Always restore first — height:auto resets scrollTop to 0 on mobile
    el.scrollTop = prevScrollTop;

    // During emoji insert, the RAF handles final scroll — don't interfere
    if (isEmojiInsertRef.current) return;

    // For keyboard typing: scroll just enough to keep cursor visible
    if (newHeight >= 120) {
      const s = window.getSelection();
      if (s && s.rangeCount > 0 && el.contains(s.anchorNode)) {
        const rng = s.getRangeAt(0).cloneRange();
        rng.collapse(true);
        const rect = rng.getBoundingClientRect();
        if (rect.height !== 0) {
          const elRect = el.getBoundingClientRect();
          const relTop = rect.top - elRect.top + el.scrollTop;
          if (relTop < el.scrollTop) {
            el.scrollTop = relTop;
          } else if (relTop + rect.height > el.scrollTop + el.clientHeight) {
            el.scrollTop = relTop + rect.height - el.clientHeight;
          }
        }
      }
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
      const gid = selectedGroup._id || selectedGroup.id;
      const details = getRoomDetails(selectedGroup, userId);
      setRoomDisplayDetails(details);
      setCachedRoomDetails(gid, details);
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

  const getEmojiImageUrl = (emojiStr) => {
    const chars = [...emojiStr].map((c) => c.codePointAt(0));
    const codepoints = [];
    for (let i = 0; i < chars.length; i++) {
      const cp = chars[i];
      // Strip FE0F except inside keycap sequences (char + FE0F + 20E3).
      // Symbols that need FE0F in their filename (❤️ → 2764-fe0f.png) are
      // recovered by the onerror retry that appends -fe0f before .png.
      if (cp === 0xfe0f && chars[i + 1] !== 0x20e3) continue;
      codepoints.push(cp.toString(16).toLowerCase().padStart(4, "0"));
    }
    return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${codepoints.join("-")}.png`;
  };

  const processEmojiInHtml = (html) => {
    if (!html || typeof document === "undefined") return html;

    // Covers: flags (🇮🇳 🇺🇸), keycaps (#️⃣ 1️⃣), standard emoji, skin-tone variants, ZWJ sequences
    const EMOJI_RE =
      /(?:[\u{1F1E0}-\u{1F1FF}]{2}|[#*0-9]️⃣|\p{Extended_Pictographic}\p{Emoji_Modifier}?️?(?:‍\p{Extended_Pictographic}\p{Emoji_Modifier}?️?)*)/gu;

    const container = document.createElement("div");
    container.innerHTML = html;

    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        EMOJI_RE.lastIndex = 0;
        if (!EMOJI_RE.test(text)) return;

        EMOJI_RE.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let last = 0;
        let m;

        while ((m = EMOJI_RE.exec(text)) !== null) {
          if (m.index > last)
            frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const img = document.createElement("img");
          img.src = getEmojiImageUrl(m[0]);
          img.className = "emoji-inline";
          img.alt = m[0];
          img.setAttribute("onerror", "if(!this.dataset.r){this.dataset.r='1';this.src=this.src.replace('.png','-fe0f.png');}else{this.alt='';this.style.display='none';}");
          frag.appendChild(img);
          last = m.index + m[0].length;
        }

        if (last < text.length)
          frag.appendChild(document.createTextNode(text.slice(last)));

        node.parentNode.replaceChild(frag, node);
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "IMG" || node.tagName === "A") return;
        [...node.childNodes].forEach(walk);
      }
    };

    [...container.childNodes].forEach(walk);
    return container.innerHTML;
  };

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

      {messagesLoading && (
        <div className="chat-loading-overlay">
          <div className="chat-loading-spinner" />
        </div>
      )}

      <div className="chat-messages" ref={chatBodyRef} style={{ display: messagesLoading ? "none" : undefined }}>
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
                  dangerouslySetInnerHTML={{
                    __html: processEmojiInHtml(linkifyHtml(msg.html || msg.message)),
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
                {renderInfoMessage(msg, membersProfileMap || {})}
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
          onBackspace={handleBackspace}
          showEmojiPickerRef={showEmojiPickerRef}
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
            if (!showEmojiPicker || !textareaRef.current) return;
            const dy = Math.abs((e.changedTouches[0]?.clientY ?? 0) - inputTouchStartYRef.current);
            if (dy > 10) return; // swipe — keep picker open
            // Tap: remove inputmode so the focusin handler in EmojiPicker knows
            // this is a deliberate tap and can close the picker + open the keyboard.
            // Also instantly hide picker DOM for visual responsiveness.
            textareaRef.current.removeAttribute("inputmode");
            document.querySelector(".emoji-picker-container.open")?.classList.remove("open");
          }}
          onCompositionStart={() => { isComposingRef.current = true; }}
          onCompositionEnd={() => { isComposingRef.current = false; convertEmojiInInput(); }}
          onInput={() => { resizeTextarea(); if (!isComposingRef.current) convertEmojiInInput(); }}
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
