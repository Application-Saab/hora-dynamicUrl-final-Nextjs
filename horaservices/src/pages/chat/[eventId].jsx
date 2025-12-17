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
import sendIcon from "@/assets/chat/sendicon.png";
import PinBanner from "../../assets/pinBanner.jpg";
import { BASE_URL, GET_USER_BY_ID } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [userData, setUserData] = useState({});

  const textareaRef = useRef(null);
  const chatBodyRef = useRef(null);
  const lastRangeRef = useRef(null);

  const pathname = usePathname();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const userId = getUserIdFromUrl();


  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const docEl = document.documentElement;

    const setVvh = () => {
      const vv = window.visualViewport;
      const height = vv ? vv.height : window.innerHeight;
      docEl.style.setProperty("--vvh", `${height}px`);
    };

    setVvh();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", setVvh);
      vv.addEventListener("scroll", setVvh);
    } else {
      window.addEventListener("resize", setVvh);
    }

    return () => {
      const vvCleanup = window.visualViewport;
      if (vvCleanup) {
        vvCleanup.removeEventListener("resize", setVvh);
        vvCleanup.removeEventListener("scroll", setVvh);
      } else {
        window.removeEventListener("resize", setVvh);
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


  useEffect(() => {
    if (typeof window !== "undefined") {
      const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
      if (addToHomeScreenPopup !== "true") {
        setShowInstall(true);
      }
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    setShowInstall(false);

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem("addToHomeScreenPopup", "true");
      } else {
        localStorage.setItem("addToHomeScreenPopup", "false");
      }
      setDeferredPrompt(null);
    }
  };

  const handleImageUpload = async () => {};

  const sendMessage = async () => {
    const messageHTML = textareaRef.current?.innerHTML?.trim();
    const messageText = textareaRef.current?.textContent?.trim();

    if (!messageText && (!messageHTML || messageHTML === "<br>" || messageHTML === "<div><br></div>")) {
      return;
    }
    if (!eventId || !userID) return;

    const localSenderName = typeof window !== "undefined"
      ? localStorage.getItem("wonderLandUserName") || ""
      : "";

    await addDoc(collection(db, "groups", eventId, "messages"), {
      text: messageText,
      html: messageHTML,
      senderId: userID,
      senderName: localSenderName ? localSenderName : userData?.name,
      senderPhoneNumber:
        typeof window !== "undefined" ? localStorage.getItem("mobileNumber") : "",
      sentAt: serverTimestamp(),
    });

    if (textareaRef.current) {
      textareaRef.current.innerHTML = "";
      textareaRef.current.style.height = "auto";
    }
    setShowEmojiPicker(false);
  };

  const handleBack = () => {

    const basePath = "/chat";
    if (userId) {
      router.push(`${basePath}?id=${encodeURIComponent(userId)}`);
    } else {
      router.push(basePath);
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
        paddingBottom: showEmojiPicker ? "260px" : "0px",
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
          suppressContentEditableWarning={true}
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
          onInput={(e) => {
            const el = e.target;
            if (el.textContent.trim().length > 0) {
              setShowEmojiPicker(false);
            }
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 120) + "px";
          }}
          className="chat-input"
          data-placeholder="Type message here..."
        />

        <button onClick={sendMessage} className="chat-send-btn">
          <Image src={sendIcon} alt="Send" className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;


