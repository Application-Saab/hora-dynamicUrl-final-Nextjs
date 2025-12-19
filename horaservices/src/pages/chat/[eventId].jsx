import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./GroupsList.css";
import EmojiPickerButton from "@/components/EmojiPicker";
import emojiIcon from "@/assets/chat/Emoji.svg";
import keyboardIcon from "@/assets/chat/KeyboardIcon.svg";
import sendIcon from "@/assets/chat/sendicon.png";
import chatBgImage from "@/assets/chat/chatbackground.jpg";
import backIcon from "@/assets/chat/BackIcon.png";

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
  const { eventId } = router.query;

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatBg, setChatBg] = useState(null);
  const [userData, setUserData] = useState({});

  const textareaRef = useRef(null);
  const chatBodyRef = useRef(null);
  const lastRangeRef = useRef(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const userId = getUserIdFromUrl();


  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const docEl = document.documentElement;

    const setVvh = () => {
      const vv = window.visualViewport;
      // Use vv.height for --vvh when keyboard is open, else window.innerHeight
      if (vv && vv.height < window.innerHeight) {
        docEl.style.setProperty("--vvh", `${vv.height}px`);
        // Scroll chat-input into view to avoid white space
        setTimeout(() => {
          const input = document.querySelector('.chat-input-container');
          if (input) input.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }, 100);
        // Lock all scroll on body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100vw';
        // Lock chat-layout scroll except for .chat-messages
        const chatLayout = document.querySelector('.chat-layout');
        if (chatLayout) {
          chatLayout.addEventListener('touchmove', allowChatMessagesScroll, { passive: false });
          chatLayout.addEventListener('wheel', allowChatMessagesScroll, { passive: false });
        }
      } else {
        docEl.style.setProperty("--vvh", `${window.innerHeight}px`);
        // Restore scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        // Remove chat-layout scroll lock
        const chatLayout = document.querySelector('.chat-layout');
        if (chatLayout) {
          chatLayout.removeEventListener('touchmove', allowChatMessagesScroll);
          chatLayout.removeEventListener('wheel', allowChatMessagesScroll);
        }
      }
    };
    // Allow scroll only on .chat-messages
    function allowChatMessagesScroll(e) {
      const chatMessages = document.querySelector('.chat-messages');
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
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      // Remove chat-layout scroll lock
      const chatLayout = document.querySelector('.chat-layout');
      if (chatLayout) {
        chatLayout.removeEventListener('touchmove', allowChatMessagesScroll);
        chatLayout.removeEventListener('wheel', allowChatMessagesScroll);
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


  useEffect(() => {
    if (!eventId) return;

    const fetchGroup = async () => {
      try {
        const groupRef = doc(db, "groups", eventId);
        const snap = await getDoc(groupRef);
        if (snap.exists()) {
          setGroup({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    fetchGroup();
  }, [eventId]);


  useEffect(() => {
    if (!userId || !token) return;

    const fetchUserAccountDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data && !data.error) {
          setUserData(data.data || {});
        }
      } catch (err) {
        console.log("Error fetching user:", err.message);
      }
    };

    fetchUserAccountDetails();
  }, [userId, token]);


  useEffect(() => {
    if (!eventId || !userID) return;

    const messagesRef = collection(db, "groups", eventId, "messages");
    const q = query(messagesRef, orderBy("sentAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(msgs);

      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    });

   
    const userRef = doc(db, "groups", eventId, "members", userID);
    setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });

    return () => unsubscribe();
  }, [eventId, userID]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("chatBgImage") : null;

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

    // ❌ Empty message check
    if (
      !messageText &&
      (!messageHTML ||
        messageHTML === "<br>" ||
        messageHTML === "<div><br></div>")
    ) {
      return;
    }

    if (!eventId || !userID) return;

    const localSenderName =
      typeof window !== "undefined"
        ? localStorage.getItem("wonderLandUserName") || ""
        : "";

    try {
      // ✅ Message send
      await addDoc(collection(db, "groups", eventId, "messages"), {
        text: messageText,
        html: messageHTML,
        senderId: userID,
        senderName: localSenderName || userData?.name || "User",
        senderPhoneNumber:
          typeof window !== "undefined"
            ? localStorage.getItem("mobileNumber")
            : "",
        sentAt: serverTimestamp(),
      });
      textareaRef.current.innerHTML = "";
      textareaRef.current.style.height = "auto";
      if (!showEmojiPicker) {
        requestAnimationFrame(() => {
          textareaRef.current?.focus({ preventScroll: true });
        });
      }
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };
const resizeTextarea = () => {
  const el = textareaRef.current;
  if (!el) return;
  el.style.height = "auto"; // reset
  const newHeight = Math.min(el.scrollHeight, 120); // max height 120px
  el.style.height = newHeight + "px";
};

  return (
   <div
      className="chat-layout"
      style={{
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingBottom: showEmojiPicker ? "260px" : "5px"
      }}
      >    <div className="chat-header-wrapper">
        <div className="chat-header">
          <div className="chat-user-info">
            <Image
              src={backIcon}
              alt="Back"
              className="back-arrow-img"
              onClick={handleBack}
            />
            {group?.imageUrl ? (
              <img
                src={group.imageUrl}
                alt={group.name}
                className="chat-group-img"
              />
            ) : (
              <div className="placeholder-avatar">
                {group?.name ? group.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}

            <span className="chat-group-name">{group?.name}</span>
          </div>
        </div>
      </div>

      <div className="chat-messages" ref={chatBodyRef}>
        {messages.map((msg, index) => {
          const isMe = msg.senderId === userID;
          const senderName = msg.senderName;
          const previousMsg = messages[index - 1];
          const isConsecutive = previousMsg && previousMsg.senderId === msg.senderId;

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

          return (
            <div
              key={msg.id}
              className={`chat-message ${isMe ? "sender" : "receiver"} ${
                isConsecutive ? "consecutive" : ""
              }`}
            >
              {!isMe && !isConsecutive && (
                <div
                  className="chat-avatar-receiver"
                  style={{
                    backgroundColor: getAvatarColor(senderName || msg.senderPhoneNumber),
                  }}
                >
                  {senderName
                    ? senderName.charAt(0).toUpperCase()
                    : msg.senderPhoneNumber?.charAt(3)}
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
                  <div className="chat-sender">
                    {senderName
                      ? senderName
                      : `+91 ${msg.senderPhoneNumber?.slice(0, -4)}XXXX`}
                  </div>
                )}

                <div
                  className="chat-text"
                  dangerouslySetInnerHTML={{ __html: msg.html || msg.text }}
                />
              </div>
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

        <button onClick={sendMessage}onMouseDown={(e) => e.preventDefault()} className="chat-send-btn">
          <Image src={sendIcon} alt="Send" className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;


