

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
  setDoc,
} from "firebase/firestore";
import "./GroupsList.css";
import EmojiPicker from "emoji-picker-react";
import emojiIcon from "@/assets/chat/Emoji.svg";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import "../wonderland/EventInvitation.css";
import { FaRegKeyboard } from "react-icons/fa6";
import sendIcon from "@/assets/chat/sendicon.png";
import PinBanner from "../../assets/pinBanner.jpg";
import { BASE_URL, GET_GUEST_DETTAILS, GET_USER_BY_ID } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
import SearchIcon  from "@/assets/chat/Searchicon.svg"
import chatBgImage from "@/assets/chat/chatbackground.jpg"; // local image
import backIcon from "@/assets/chat/BackIcon.png";

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
const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
const eventId = selectedGroup?.id || null;
  const textareaRef = useRef(null);
const chatOpenRef = useRef(false);
const [unreadCounts, setUnreadCounts] = useState({});
 const [chatBg, setChatBg] = useState(null);

  const token = localStorage.getItem("token");

  const [orderDetails, setOrderDetails] = useState(null);

  const [guestDetails, setGuestDetails] = useState(null);

    const [userData, setUserData] = useState({});

    const [refreshKey, setRefreshKey] = useState(0);

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
  }, [userId] );


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

  // Prevent body scroll when chat overlay is open
  useEffect(() => {
    if (selectedGroup) {
      // Store original values
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const originalHeight = document.body.style.height;

      // Get current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling completely
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      // Also prevent html element scrolling
      const htmlElement = document.documentElement;
      const originalHtmlOverflow = htmlElement.style.overflow;
      htmlElement.style.overflow = 'hidden';

      // Prevent touch scrolling on mobile when not in chat messages
      const preventScroll = (e) => {
        if (!e.target.closest('.chat-messages') && !e.target.closest('.emoji-container')) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });

      // Restore on cleanup
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.height = originalHeight;

        htmlElement.style.overflow = originalHtmlOverflow;

        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);

        window.scrollTo(0, scrollY);
      };
    }
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

  
 useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);


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
  }, [userId,refreshKey]);

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


const userPhoneNumber = localStorage.getItem("mobileNumber");

const getUnreadCount = (group) => {
  return unreadCounts[group.id] || 0;
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
  if (!groups || groups.length === 0 || !userId || chatOpenRef.current) return;

  // Delay execution slightly
  const timeout = setTimeout(() => {
    const counts = {};
    let total = 0;
    groups.forEach((group) => {
      const userMember = group.members.find((m) => m.id === userId);
      const lastSeen = userMember?.lastSeenAt?.toDate
        ? userMember.lastSeenAt.toDate()
        : userMember?.lastSeenAt;

      const unreadMessages = (group.messages || []).filter((msg) => {
        if (!msg.sentAt || msg.senderId === userId) return false;
        const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;
        return lastSeen ? msgDate > lastSeen : true;
      });

      counts[group.id] = unreadMessages.length;
      total += unreadMessages.length;
    });

    setUnreadCounts(counts);
    localStorage.setItem("totalUnread", total.toString());
    window.dispatchEvent(new Event("unreadCountChange"));
  }, 500); // wait 500ms for Firestore update to apply

  return () => clearTimeout(timeout);
}, [groups, userId,refreshKey]);



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

// useEffect(() => {
//   if (pathname === "/chat") {
//     if (typeof window !== "undefined") {
//       const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
//     console.log("addToHomeScreenPopup",addToHomeScreenPopup);
    
//       if (addToHomeScreenPopup !== "true") {
//         setShowInstall(true);  
//       }
//     }

//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handler);
//     };
//   }
// }, [pathname]); 


useEffect(() => {
  if (typeof window !== "undefined") {
    const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
    console.log("addToHomeScreenPopup", addToHomeScreenPopup);

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

// --------------------------------------------------------------------------------------------------------------------------
useEffect(() => {
  if (!eventId || !userId) return;

  const unsubscribe = listenToMessages(eventId, userId);

  return () => unsubscribe();
}, [eventId, userId, selectedGroup]); 

useEffect(() => {
  chatOpenRef.current = !!selectedGroup;

  if (selectedGroup && eventId && userId) {
    const updatedCounts = {
      ...unreadCounts,
      [eventId]: 0,
    };
    setUnreadCounts(updatedCounts);

  }
}, [selectedGroup, eventId, userId]);

  const lastSeenAtRef = useRef(null);
  const notifiedMessageIdsRef = useRef(new Set()); 

  
const updateLocalUnread = (updatedCounts) => {
  const total = Object.values(updatedCounts).reduce((sum, count) => sum + count, 0);
  localStorage.setItem("totalUnread", total.toString());
  window.dispatchEvent(new Event("unreadCountChange"));
  return total;
};



const listenToMessages = (eventId, userId) => {
  if (!eventId || !userId) return () => {};

  const messagesRef = collection(db, "groups", eventId, "messages");
  const q = query(messagesRef, orderBy("sentAt", "asc"));
  const userRef = doc(db, "groups", eventId, "members", userId);

  const unsubscribeUser = onSnapshot(userRef, (memberSnap) => {
    lastSeenAtRef.current = memberSnap.exists() && memberSnap.data().lastSeenAt
      ? memberSnap.data().lastSeenAt.toDate()
      : null;
  });

const unsubscribeMessages = onSnapshot(q, (snapshot) => {
  const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setMessages(msgs);

  const unreadMessages = msgs.filter((msg) => {
    if (!msg.sentAt || msg.senderId === userId) return false;
    const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;
    return lastSeenAtRef.current ? msgDate > lastSeenAtRef.current : true;
  });

  setUnreadCounts((prev) => {
    const updated = { ...prev, [eventId]: chatOpenRef.current ? 0 : unreadMessages.length };

    if (chatOpenRef.current) {
      // Update Firestore immediately for lastSeen
      const userRef = doc(db, "groups", eventId, "members", userId);
      setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });
      lastSeenAtRef.current = new Date(); // local reference
    }

    updateLocalUnread(updated);
    return updated;
  });








    // Notifications
    if (!chatOpenRef.current && unreadMessages.length > 0) {
      unreadMessages.forEach((msg) => {
        if (
          Notification.permission === "granted" &&
          !notifiedMessageIdsRef.current.has(msg.id) &&
          "Notification" in window
        ) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(`New message from ${msg.senderName}`, {
              body: msg.text,
              icon: "/new_logo_light.png",
            });
          });
          notifiedMessageIdsRef.current.add(msg.id);
        }
      });
    }
  });



  return () => {
    unsubscribeUser();
    unsubscribeMessages();
  };
};

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!eventId || !userID) {
      console.warn("Missing eventId or userId — cannot send message.");
      return;
    }
    const localSenderName = localStorage.getItem("wonderLandUserName") || "";

    await addDoc(collection(db, "groups", eventId, "messages"), {
      text,
      senderId: userID,
      
      // senderName:
      //   urlParams?.userType === "host" ? orderDetails?.Name : localSenderName,
      senderName: localSenderName ? localSenderName : userData?.name,
      senderPhoneNumber: localStorage.getItem("mobileNumber"),
      sentAt: serverTimestamp(),
    });
   

    setText("");
    setShowEmojiPicker(false);
  };

const handleOpenMessages = async (group) => {
  chatOpenRef.current = true;
  setSelectedGroup(group);

  // reset unread immediately
  setUnreadCounts((prev) => {
    const updated = { ...prev, [group.id]: 0 };
    updateLocalUnread(updated);
    return updated;
  });

  // update lastSeen both local + Firestore
  lastSeenAtRef.current = new Date();
  if (userId) {
    const userRef = doc(db, "groups", group.id, "members", userId);
    await setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });
  }
};


// const handleCloseChat = async () => {
//   chatOpenRef.current = false;
//   lastSeenAtRef.current = new Date();

//   if (userId && selectedGroup) {
//     const userRef = doc(db, "groups", selectedGroup.id, "members", userId);
//     await setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });
//   }

//   setSelectedGroup(null);
// };


const handleCloseChat = async () => {
  if (!selectedGroup || !userId) return;

  // Forcefully mark all messages as seen
  const userRef = doc(db, "groups", selectedGroup.id, "members", userId);
  await setDoc(
    userRef,
    { lastSeenAt: serverTimestamp() }, // Firestore timestamp
    { merge: true }
  );
  lastSeenAtRef.current = new Date(); // local reference

  // Reset unread count for this chat locally
  setUnreadCounts((prev) => {
    const updated = { ...prev, [selectedGroup.id]: 0 };
    updateLocalUnread(updated);
    return updated;
  });

  setSelectedGroup(null);
    setRefreshKey((prev) => prev + 1);
};

const convertImageToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Base64 conversion failed:", error);
      return null;
    }
  };

 useEffect(() => {
    const saved = localStorage.getItem("chatBgImage");

    if (saved) {
      // Use the cached background
      setChatBg(saved);
    } else {
      // First load, use imported image src
      setChatBg(chatBgImage.src);
      localStorage.setItem("chatBgImage", chatBgImage.src);
    }
  }, []);
useEffect(() => {
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  window.addEventListener('resize', setVh);
  setVh();
  return () => window.removeEventListener('resize', setVh);
}, []);


  //------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="groups-container">
      <div className="groups-header">
       
        {/* <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search"
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
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

{pathname === "/chat" && showInstall && (
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
                  return (
              <div
                key={group.id}
                className="group-item"
                onClick={() => handleOpenMessages(group)}
              >
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
                        width: "clamp(40px, calc((53 / 393) * 100vw), 70px)",
                      height: "clamp(40px, calc((53 / 393) * 100vw), 70px)",
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

  {getUnreadCount(group) > 0 && (
    <span className="group-last">
      {getUnreadCount(group)} New Message
      {getUnreadCount(group) > 1 ? "s" : ""} *
    </span>
  )}
</div>

{unreadCounts[group.id] > 0 && <span className="unread-dot"></span>}
              </div>
            );
          })}
      </div>

      {selectedGroup && (
   <div
      className="chat-overlay"
      style={{
        backgroundImage: `url(${chatBg})`, // no ternary, always set
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
        onClick={handleCloseChat}
      />
      {selectedGroup?.imageUrl ? (
        <img
          src={selectedGroup.imageUrl}
          alt={selectedGroup.name}
          className="chat-group-img"
        />
      ) : (
        <div className="placeholder-avatar">
          {selectedGroup?.name
            ? selectedGroup.name.charAt(0).toUpperCase()
            : "?"}
        </div>
      )}

      <span className="chat-group-name">{selectedGroup.name}</span>
    </div>
  </div>
</div>




          <div className="chat-messages" ref={chatBodyRef}>
 {messages.map((msg, index) => {
               // message render
const isMe = msg.senderId === userID;
const senderName = msg.senderName;

// Check if this is a consecutive message from the same sender
const previousMsg = messages[index - 1];
const isConsecutive = previousMsg &&
                     previousMsg.senderId === msg.senderId;

// For alternating border radius in consecutive receiver messages
let consecutiveIndex = 0;
if (isConsecutive && !isMe) {
  // Count how many consecutive messages from same sender came before this one
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
                  className={`chat-message ${isMe ? "sender" : "receiver"} ${isConsecutive ? "consecutive" : ""}`}
                >
 {!isMe && !isConsecutive && (
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
                    <div className={`chat-bubble ${isMe ? "sender" : "receiver"} ${isConsecutive ? "consecutive" : ""} ${isConsecutive && !isMe ? (consecutiveIndex % 2 === 0 ? "consecutive-even" : "consecutive-odd") : ""}`}>
      {/* Sirf receiver ka naam/number - only show for first message in sequence */}
      {!isMe && !isConsecutive && (
        <div className="chat-sender">
          {senderName
            ? senderName
            : `+91 ${msg.senderPhoneNumber.slice(0, -4)}XXXX`}
        </div>
      )}

      <div className="chat-text">{linkify(msg.text)}</div>

     {/* <div className="chat-time">
        {msg.sentAt?.toDate
          ? new Date(msg.sentAt.toDate()).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : ""}
      </div> */}
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
                      sendMessage();
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


