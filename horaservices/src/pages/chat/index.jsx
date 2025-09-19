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
import emojiIcon from "../../assets/Emoji.png";
import Image from "next/image";
import Linkify from "react-linkify";
import { FaArrowLeft } from "react-icons/fa";
import "../wonderland/EventInvitation.css";
import { FaRegKeyboard } from "react-icons/fa6";
import sendIcon from "@/assets/sendicon.png";
import PinBanner from "../../assets/pinBanner.jpg";
import { BASE_URL, GET_GUEST_DETTAILS, GET_USER_BY_ID } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
const getUserIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  console.log('%c [ groups ]-33', 'font-size:13px; background:pink; color:#bf2c9f;', groups)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const userId = getUserIdFromUrl();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const [totalUnread, setTotalUnread] = useState(0);
 const pathname = usePathname(); // ✅ Current route
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
const [text, setText] = useState("");

  const textareaRef = useRef(null);

  const token = localStorage.getItem("token");

  const [orderDetails, setOrderDetails] = useState(null);

  const [guestDetails, setGuestDetails] = useState(null);

    const [userData, setUserData] = useState({});
useEffect(() => {
  const handleBackButton = (e) => {
    if (selectedGroup) {
      e.preventDefault();
      setSelectedGroup(null); 
      window.history.pushState(null, "", window.location.href); 
    }
  };

  window.addEventListener("popstate", handleBackButton);

  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, [selectedGroup]);

  useEffect(() => {
    const handleResize = () => {
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  

  useEffect(() => {
    const fetchUserAccountDetails = async () => {
      if (!userId) {
        console.log('User id not available')
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          setUserData({});
          console.log(data.message || "Failed to fetch guests");
        } else {
          setUserData(data.data || {});
        }
      } catch (err) {
        console.log("Error fetching guests: " + err.message);
      }
    };
    // Initial call
    fetchUserAccountDetails();
  }, [userId]);


  const fetchOrderDetails = async (eventId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const result = await res.json();
      console.log(result.data.hostName, "result11");

      if (res.status === 200 && result.data) {
        const data = result.data;
        setOrderDetails({
          Name: data.hostName,
        });
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  };

  // Fetch guest details for a given eventId and userId
  const fetchGuestDetails = async (eventId, userId) => {
    try {
      const endpoint = `${BASE_URL}${GET_GUEST_DETTAILS}/${eventId}/user/${userId}`;
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Guest Details Response11:", data.data.name);
      if (data && data.data) {
        setGuestDetails({ name: data.data.name });
      }
    } catch (err) {
      console.error("Error fetching guest:", err);
    }
  };
const getAvatarColor = (name) => {
  const colors = [
    "#F44336", // red
    "#E91E63", // pink
    "#9C27B0", // purple
    "#673AB7", // deep purple
    "#3F51B5", // indigo
    "#2196F3", // blue
    "#009688", // teal
    "#4CAF50", // green
    "#FF9800", // orange
    "#795548"  // brown
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

  useEffect(() => {
    const checkRoleAndFetch = async () => {
      if (selectedGroup && selectedGroup.id) {
        const userIdFromStorage = localStorage.getItem("userID");
        if (!userIdFromStorage) {
          console.warn("No userId found in localStorage");
          return;
        }
        try {
          const memberDocRef = doc(
            db,
            "groups",
            selectedGroup.id,
            "members",
            userIdFromStorage
          );
          const memberSnap = await getDocs(
            query(collection(db, "groups", selectedGroup.id, "members"))
          );
          let role = null;
          memberSnap.forEach((docSnap) => {
            if (docSnap.id === userIdFromStorage) {
              role = docSnap.data().role;
            }
          });
          if (role === "host") {
            fetchOrderDetails(selectedGroup.id).then((orderDetails) => {
              console.log("Order Details:", orderDetails);
            });
          } else {
            fetchGuestDetails(selectedGroup.id, userIdFromStorage).then(
              (guestDetails) => {
                console.log("Guest Details:", guestDetails);
              }
            );
          }
        } catch (err) {
          console.error("Error checking member role:", err);
        }
      }
    };
    checkRoleAndFetch();
  }, [selectedGroup]);

  const [emojiWidth, setEmojiWidth] = useState(400);
  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 450) {
        setEmojiWidth(450);
      } else if (screenWidth <= 450) {
        setEmojiWidth(screenWidth - 20);
      } else {
        setEmojiWidth(screenWidth - 50);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // const toggleEmojiPicker = () => {
  //   setIsEmojiPickerOpen((prev) => {
  //     const next = !prev;

  //     if (next) {
  //       inputRef.current?.blur();
  //     } else {
  //       inputRef.current?.focus();
  //     }

  //     return next;
  //   });
  // };

  // const onEmojiClick = (emojiObject) => {
  //   setNewMessage((prev) => prev + emojiObject.emoji);
  //   // Don't refocus input here
  // };

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

  const handleImageUpload = async (e) => {};

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
    if (!text.trim() || !selectedGroup) return;

    try {
      const messagesRef = collection(
        db,
        "groups",
        selectedGroup.id,
        "messages"
      );

      // Prefer orderDetails.Name, then guestDetails.name, then fallback to member name or "Guest"
      let senderName = userData?.name || 'Guest';
      // if (orderDetails && orderDetails.Name) {
      //   senderName = orderDetails.Name;
      // } else if (guestDetails && guestDetails.name) {
      //   senderName = guestDetails.name;
      // } else {
      //   const currentUser = selectedGroup.members.find((m) => m.id === userId);
      //   if (currentUser?.name) senderName = currentUser.name;
      // }

      const newMsg = {
        text: text,
        senderId: userId,
        senderPhoneNumber: localStorage.getItem("mobileNumber"),
        senderName: senderName,
        sentAt: serverTimestamp(),
      };

      await addDoc(messagesRef, newMsg);

      const groupRef = doc(db, "groups", selectedGroup.id);
      await updateDoc(groupRef, { lastMessage: newMsg });

      setText("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
const userPhoneNumber = localStorage.getItem("mobileNumber");
  const getUnreadCount = (group) => {
    console.log('%c [ group ]-444', 'font-size:13px; background:pink; color:#bf2c9f;', group)
    const member = group.members.find((m) => m.id === userId);
    if (!member?.lastSeen) return group.messages?.length || 0;

    const lastSeen = member.lastSeen?.toDate?.() || new Date(0);
    let totalCount = (group.messages || []).filter(
      (msg) => msg.sentAt?.toDate?.() > lastSeen
    ).length;
    console.warn('%c [ totalCount ]-453', 'font-size:13px; background:pink; color:#bf2c9f;', totalCount)

    return totalCount;

    // return (group.messages || []).filter(
    //   (msg) => msg.sentAt?.toDate?.() > lastSeen
    // ).length;
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

  useEffect(() => {
  if (groups && groups.length > 0) {
    // har group ka unread count calculate karke sum le
    const total = groups.reduce((acc, group) => {
      const unread = getUnreadCount(group);
      return acc + unread;
    }, 0);

    localStorage.setItem("totalUnread", total.toString());
    window.dispatchEvent(new Event("unreadCountChange"));
    setTotalUnread(total);
  }
}, [groups]);
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
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

useEffect(() => {
  if (pathname === "/chat") {
    if (typeof window !== "undefined") {
      const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
    console.log("addToHomeScreenPopup",addToHomeScreenPopup);
    
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
  }
}, [pathname]); 




const handleInstallClick = async () => {
   setShowInstall(false);

   if (typeof window !== "undefined") {
     localStorage.setItem("addToHomeScreenPopup", "true");
   }
 
   

   if (deferredPrompt) {
     deferredPrompt.prompt();
     const { outcome } = await deferredPrompt.userChoice;
     if (outcome === 'accepted') {
       localStorage.setItem("addToHomeScreenPopup", "true");
       console.log("outcome",outcome,localStorage.getItem("addToHomeScreenPopup"));
       
     } else {
       localStorage.setItem("addToHomeScreenPopup", "false");
     }

     setDeferredPrompt(null);
   }
};


  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

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

{showInstall && (
  <div className="chat-banner">
    <Image src={PinBanner} alt="Banner" className="chat-banner-img" />
    <button className="chat-banner-btn" onClick={handleInstallClick}>
      Add To Phone Screen
    </button>
  </div>
)}




      <div className="groups-list">
        {groups
          .filter((group) =>
            group.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((group) => {
            const unread = getUnreadCount(group);
            console.log('%c [ unread ]-495', 'font-size:13px; background:pink; color:#bf2c9f;', unread)
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
        <div className="chat-overlay">
          <div className="chat-header">
            <div className="chat-user-info">
              <button
                className="btn back-arrow-chat"
                // onClick={() => {
                // setChatOpen(false);
                // chatOpenRef.current = false;
                onClick={() => setSelectedGroup(null)}
                // }}
              >
                <FaArrowLeft fontSize={16} />
              </button>
              <span className="mx-2">{`${selectedGroup.name}`}</span>{" "}
              {/* <span>{orderDetails?.eventType} </span> */}
            </div>
          </div>
 

          <div className="chat-messages" ref={chatBodyRef}>
 {messages.map((msg) => {
                const isMe = msg.senderPhoneNumber === userPhoneNumber;
                const senderName =
                  msg.senderName
              return (
                <div
                  key={msg.id}
                  className={`chat-message ${isMe ? "sender" : "receiver"}`}
                >
 {!isMe && (
  <div
    className="chat-avatar-receiver"
    style={{
      backgroundColor: getAvatarColor(
        senderName || msg.senderPhoneNumber
      )
    }}
  >
    {senderName
      ? senderName.charAt(0).toUpperCase()
      : msg.senderPhoneNumber.charAt(3)}
  </div>
)}
                    <div className={`chat-bubble ${isMe ? "sender" : "receiver"}`}>
      {/* Sirf receiver ka naam/number */}
      {!isMe && (
        <div className="chat-sender">
          {senderName
            ? senderName
            : `+91 ${msg.senderPhoneNumber.slice(0, -4)}XXXX`}
        </div>
      )}

      <div className="chat-text">{linkify(msg.text)}</div>

      <div className="chat-time">
        {msg.sentAt?.toDate
          ? new Date(msg.sentAt.toDate()).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : ""}
      </div>
    </div>

                  {/* Sender avatar (right side) */}
                  {/* {isMe && (
                    <div className="chat-avatar">
                      {senderName
                        ? senderName.charAt(0).toUpperCase()
                        : msg.senderPhoneNumber.charAt(3)}
                    </div>
                  )} */}
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
                          // setShowEmojiPicker(true);
                          // textareaRef.current?.blur();
                            textareaRef.current?.blur();
        setTimeout(() => {
          setShowEmojiPicker(true);
        },50);
                      }
                    }}
                    className="emoji-btn"
                  >
                    {showEmojiPicker ? (
                      <FaRegKeyboard fontSize={20} />
                    ) : (
                      <Image src={emojiIcon} alt="Emoji" className="emoji-icon" />
                    )}
    
                    <div>
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
    
                    </div>
                  </button>
    
                  <textarea
                    value={text}
                    ref={textareaRef}
                    className="chat-input"
                    rows={1}
                    onFocus={() => {
                     if (showEmojiPicker) {
                          setShowEmojiPicker(false);
                        }
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
                      if (e.target.value.length > 0) {
                          setShowEmojiPicker(false); 
                        }
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
                      handleSendMessage();
                      if (textareaRef.current) {
                        textareaRef.current.style.height = "auto"; 
                      }
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
    
                    // onMouseDown={(e) => e.preventDefault()}
                    // onTouchStart={(e) => e.preventDefault()}
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
