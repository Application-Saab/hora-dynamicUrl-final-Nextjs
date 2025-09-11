import React, { useRef, useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./GroupsList.css";
import EmojiPicker from "emoji-picker-react";
import emojiIcon from "../../assets/emojiIcon.png";
import Image from "next/image";
import Linkify from "react-linkify";

const getUserIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const userId = getUserIdFromUrl();

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => {
      const next = !prev;

      if (next) {
        // Opening emoji picker → blur input (hides keyboard on mobile)
        inputRef.current?.blur();
      } else {
        // Closing emoji picker → focus input (reopens keyboard)
        inputRef.current?.focus();
      }

      return next;
    });
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    // Don't refocus input here
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-btn")
      ) {
        setIsEmojiPickerOpen(false);
      }
    };

    if (isEmojiPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmojiPickerOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsEmojiPickerOpen(false);
      }
    };

    if (isEmojiPickerOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEmojiPickerOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    const fetchGroupsWithMembers = async () => {
      try {
        const groupsRef = collection(db, "groups");
        const snapshot = await getDocs(groupsRef);

        const groupsData = await Promise.all(
          snapshot.docs.map(async (groupDoc) => {
            const membersRef = collection(db, "groups", groupDoc.id, "members");
            const membersSnap = await getDocs(membersRef);

            const members = membersSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            const messagesRef = collection(
              db,
              "groups",
              groupDoc.id,
              "messages"
            );
            const q = query(messagesRef, orderBy("sentAt", "asc"));

            let messagesArr = [];
            onSnapshot(q, (snap) => {
              messagesArr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
              setGroups((prev) =>
                prev.map((g) =>
                  g.id === groupDoc.id ? { ...g, messages: messagesArr } : g
                )
              );
            });

            return {
              id: groupDoc.id,
              ...groupDoc.data(),
              members,
              messages: [],
            };
          })
        );

        const filteredGroups = groupsData.filter((group) =>
          group.members.some((member) => member.id === userId)
        );

        setGroups(filteredGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroupsWithMembers();
  }, [userId]);

  const markAsRead = (groupId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map((m) =>
                m.id === userId
                  ? { ...m, lastSeen: { toDate: () => new Date() } }
                  : m
              ),
            }
          : g
      )
    );
  };

  const handleOpenMessages = (group) => {
    setSelectedGroup(group);
    markAsRead(group.id);

    const messagesRef = collection(db, "groups", group.id, "messages");
    const q = query(messagesRef, orderBy("sentAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      const memberDocRef = doc(db, "groups", group.id, "members", userId);
      updateDoc(memberDocRef, { lastSeen: serverTimestamp() }).catch(() => {});
    });

    return unsubscribe;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    try {
      const messagesRef = collection(
        db,
        "groups",
        selectedGroup.id,
        "messages"
      );

      const newMsg = {
        text: newMessage,
        senderId: userId,
        senderName: "You",
        sentAt: serverTimestamp(),
      };

      await addDoc(messagesRef, newMsg);

      const groupRef = doc(db, "groups", selectedGroup.id);
      await updateDoc(groupRef, {
        lastMessage: newMsg,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getUnreadCount = (group) => {
    const member = group.members.find((m) => m.id === userId);
    if (!member?.lastSeen) return group.messages?.length || 0;

    const lastSeen = member.lastSeen?.toDate?.() || new Date(0);

    return (group.messages || []).filter(
      (msg) => msg.sentAt?.toDate?.() > lastSeen
    ).length;
  };

  const customDecorator = (href, text, key) => (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#fff", fontWeight: "bold" }}
    >
      {text}
    </a>
  );

  return (
    <div className="groups-container">
      <div className="groups-header">
        {/* <h3>Chats</h3> */}
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

      <div className="groups-list">
        {groups
          .filter((group) =>
            group.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((group) => {
            const unread = getUnreadCount(group);
            return (
              <div
                key={group.id}
                className="group-item"
                onClick={() => handleOpenMessages(group)}
              >
                {/* <img
                  src={
                    group.imageUrl || "https://i.pravatar.cc/150?u=" + group.id
                  }
                  alt={group.name}
                  className="group-avatar"
                />
                 */}
                {group.imageUrl ? (
                  <img
                    src={group.imageUrl}
                    alt={group.name}
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
                    {group.name ? group.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}

                <div className="group-info">
                  <p className="group-name">{group.name || "Unnamed Group"}</p>
                  <span className="group-last">
                    {unread > 0
                      ? `${unread} New Message${unread > 1 ? "s" : ""}`
                      : "No new messages"}
                  </span>
                </div>
                {unread > 0 && <span className="unread-dot"></span>}
              </div>
            );
          })}
      </div>

      {selectedGroup && (
        <div className="chat-popup mobile-full">
          <div className="chat-header">
            {/* <button className="back-btn" onClick={() => setSelectedGroup(null)}>
              ←
            </button> */}
            <button className="back-btn" onClick={() => setSelectedGroup(null)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            <span className="chat-title">{selectedGroup.name}</span>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg) => {
              const isMe = msg.senderId === userId;
              const displayName =
                msg.senderName?.length > 15
                  ? msg.senderName.slice(0, 15) + "..."
                  : msg.senderName;

              return (
                <div
                  key={msg.id}
                  className={`chat-row ${isMe ? "me" : "other"}`}
                >
                  {!isMe && (
                    <div className="profile-circle">
                      {msg.senderName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <div
                    className={`chat-bubble ${
                      isMe ? "me-bubble" : "other-bubble"
                    }`}
                  >
                    {!isMe && (
                      <div className="receiver-name">{displayName}</div>
                    )}
                    <Linkify componentDecorator={customDecorator}>
                      <p>{msg.text}</p>
                    </Linkify>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chat-input-first">
            <div className="input-wrapper">
              <button className="emoji-btn" onClick={toggleEmojiPicker}>
                <Image
                  src={emojiIcon}
                  alt="emoji icon"
                  className="emoji-icon"
                />
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder="Type message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                onFocus={() => setIsEmojiPickerOpen(false)}
              />

              <button className="send-btn" onClick={handleSendMessage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 2 9"></polygon>
                </svg>
              </button>
            </div>

            {isEmojiPickerOpen && (
              <div className="emoji-picker-container" ref={emojiPickerRef}>
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  height={280}
                  width="100%"
                  previewConfig={{ showPreview: false }}
                  skinTonesDisabled={true}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
