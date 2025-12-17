


import React, {useRef, useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import "./GroupsList.css";
import Image from "next/image";
import PinBanner from "../../assets/pinBanner.jpg";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import SearchIcon from "@/assets/chat/Searchicon.svg";
import chatBgImage from "@/assets/chat/chatbackground.jpg";

const getUserIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const GroupsList = () => {
  const router = useRouter();
  const [groups, setGroups] = useState([]);const [selectedGroup, setSelectedGroup] = useState(null);
 const [messages, setMessages] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
  const [totalUnread, setTotalUnread] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [refreshKey] = useState(0);
  const userId = getUserIdFromUrl();
  const pathname = usePathname(); // ✅ Current route
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
const eventId = selectedGroup?.id || null;
const chatOpenRef = useRef(false);

 const [chatBg, setChatBg] = useState(null);
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


      const preventScroll = (e) => {
        if (!e.target.closest('.chat-messages') && !e.target.closest('.emoji-picker-container')) {
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


  
 useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
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
  }, [userId,refreshKey]);

const getUnreadCount = (group) => {
  return unreadCounts[group.id] || 0;
};




useEffect(() => {
  if (!groups || groups.length === 0 || !userId) return;

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
  }, 500);

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
    const messageHTML = textareaRef.current?.innerHTML?.trim();
    const messageText = textareaRef.current?.textContent?.trim();
    // Check if there's any content (text or images)
    if (!messageText && (!messageHTML || messageHTML === '<br>' || messageHTML === '<div><br></div>')) return;
    if (!eventId || !userID) {
      console.warn("Missing eventId or userId — cannot send message.");
      return;
    }
    const localSenderName = localStorage.getItem("wonderLandUserName") || "";

    await addDoc(collection(db, "groups", eventId, "messages"), {
      text: messageText,
      html: messageHTML, // Store HTML content for emojis
      senderId: userID,

      // senderName:
      //   urlParams?.userType === "host" ? orderDetails?.Name : localSenderName,
      senderName: localSenderName ? localSenderName : userData?.name,
      senderPhoneNumber: localStorage.getItem("mobileNumber"),
      sentAt: serverTimestamp(),
    });


    // Clear contentEditable
    if (textareaRef.current) {
      textareaRef.current.innerHTML = "";
      textareaRef.current.style.height = "auto";
    }
    setShowEmojiPicker(false);
  };

const handleOpenMessages = (group) => {
  // Navigate to dedicated chat page instead of opening overlay
  if (!group?.id) return;

  // Preserve existing `id` query param for userId if present
  const searchParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = searchParams.get("id");

  const query = userIdFromUrl ? `?id=${encodeURIComponent(userIdFromUrl)}` : "";
  router.push(`/chat/${group.id}${query}`);
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

const capitalizeFirstLetter = (text = "") => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

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
 <p className="group-name">
  {capitalizeFirstLetter(group.name || "Unnamed group")}
</p>

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

    </div>
  );
};

export default GroupsList;


