// import React, { useRef, useEffect, useState } from "react";
// import { db } from "../../firebase";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   addDoc,
//   serverTimestamp,
//   onSnapshot,
//   doc,
//   updateDoc,
//   setDoc,
// } from "firebase/firestore";
// import "./GroupsList.css";
// import EmojiPicker from "emoji-picker-react";
// import emojiIcon from "../../assets/Emoji.png";
// import Image from "next/image";
// import { FaArrowLeft } from "react-icons/fa";
// import "../wonderland/EventInvitation.css";
// import { FaRegKeyboard } from "react-icons/fa6";
// import sendIcon from "@/assets/sendicon.png";
// import PinBanner from "../../assets/pinBanner.jpg";
// import {
//   BASE_URL,
//   GET_CHAT_ROOMS,
//   GET_GUEST_DETTAILS,
//   GET_USER_BY_ID,
// } from "@/utils/apiconstants";
// import { usePathname } from "next/navigation";
// import useApi from "@/hooks/useApi";
// import socket from "@/socket";
// const getUserIdFromUrl = () => {
//   const params = new URLSearchParams(window.location.search);
//   return params.get("id");
// };

// const GroupsList = () => {
//   const [groups, setGroups] = useState([]);
//   const userId = getUserIdFromUrl();
//   const { data: chatRoomsData } = useApi(`${GET_CHAT_ROOMS}/${userId}`, "get");
//   console.log(
//     "%c [ groups ]-33",
//     "font-size:13px; background:pink; color:#bf2c9f;",
//     groups
//   );

//   const [allChatRooms, setAllChatRooms] = useState([]);
//   console.log('%c [ allChatRooms ]-49', 'font-size:13px; background:pink; color:#bf2c9f;', allChatRooms)

//   useEffect(() => {
//     if (chatRoomsData?.data) {
//       setAllChatRooms(chatRoomsData.data || []);
//     }
//   }, [chatRoomsData]);

//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [messages, setMessages] = useState([]);
//   // const [newMessage, setNewMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
//   const emojiPickerRef = useRef(null);
//   const inputRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const chatBodyRef = useRef(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [totalUnread, setTotalUnread] = useState(0);
//   const pathname = usePathname(); // ✅ Current route
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [showInstall, setShowInstall] = useState(false);
//   const [text, setText] = useState("");
//   const userID =
//     typeof window !== "undefined" ? localStorage.getItem("userID") : null;
//   const eventId = selectedGroup?.id || null;
//   const textareaRef = useRef(null);
//   const chatOpenRef = useRef(false);
//   const [unreadCounts, setUnreadCounts] = useState({});

//   const token = localStorage.getItem("token");

//   const [orderDetails, setOrderDetails] = useState(null);

//   const [guestDetails, setGuestDetails] = useState(null);

//   const [userData, setUserData] = useState({});

//   const [refreshKey, setRefreshKey] = useState(0);

//   useEffect(() => {
//     const handleBackButton = (e) => {
//       if (selectedGroup) {
//         e.preventDefault();
//         setSelectedGroup(null);
//         window.history.pushState(null, "", window.location.href);
//       }
//     };

//     window.addEventListener("popstate", handleBackButton);

//     return () => {
//       window.removeEventListener("popstate", handleBackButton);
//     };
//   }, [selectedGroup]);

//   useEffect(() => {
//     const handleResize = () => {
//       textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const fetchUserAccountDetails = async () => {
//       if (!userId) {
//         console.log("User id not available");
//         return;
//       }

//       try {
//         const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`, {
//           headers: {
//             Authorization: `${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         if (data.error) {
//           setUserData({});
//           console.log(data.message || "Failed to fetch guests");
//         } else {
//           setUserData(data.data || {});
//         }
//       } catch (err) {
//         console.log("Error fetching guests: " + err.message);
//       }
//     };
//     // Initial call
//     fetchUserAccountDetails();
//   }, [userId]);

//   const fetchOrderDetails = async (eventId) => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//         }
//       );

//       const result = await res.json();
//       console.log(result.data.hostName, "result11");

//       if (res.status === 200 && result.data) {
//         const data = result.data;
//         setOrderDetails({
//           Name: data.hostName,
//         });
//       }
//     } catch (err) {
//       console.error("❌ Fetch failed:", err);
//     }
//   };

//   // Fetch guest details for a given eventId and userId
//   const fetchGuestDetails = async (eventId, userId) => {
//     try {
//       const endpoint = `${BASE_URL}${GET_GUEST_DETTAILS}/${eventId}/user/${userId}`;
//       const response = await fetch(endpoint, {
//         headers: {
//           Authorization: `${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       console.log("Guest Details Response11:", data.data.name);
//       if (data && data.data) {
//         setGuestDetails({ name: data.data.name });
//       }
//     } catch (err) {
//       console.error("Error fetching guest:", err);
//     }
//   };
//   const getAvatarColor = (name) => {
//     const colors = [
//       "#F44336", // red
//       "#E91E63", // pink
//       "#9C27B0", // purple
//       "#673AB7", // deep purple
//       "#3F51B5", // indigo
//       "#2196F3", // blue
//       "#009688", // teal
//       "#4CAF50", // green
//       "#FF9800", // orange
//       "#795548", // brown
//     ];
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const index = Math.abs(hash % colors.length);
//     return colors[index];
//   };

//   useEffect(() => {
//     const checkRoleAndFetch = async () => {
//       if (selectedGroup && selectedGroup.id) {
//         const userIdFromStorage = localStorage.getItem("userID");
//         if (!userIdFromStorage) {
//           console.warn("No userId found in localStorage");
//           return;
//         }
//         try {
//           const memberDocRef = doc(
//             db,
//             "groups",
//             selectedGroup.id,
//             "members",
//             userIdFromStorage
//           );
//           const memberSnap = await getDocs(
//             query(collection(db, "groups", selectedGroup.id, "members"))
//           );
//           let role = null;
//           memberSnap.forEach((docSnap) => {
//             if (docSnap.id === userIdFromStorage) {
//               role = docSnap.data().role;
//             }
//           });
//           if (role === "host") {
//             fetchOrderDetails(selectedGroup.id).then((orderDetails) => {
//               console.log("Order Details:", orderDetails);
//             });
//           } else {
//             fetchGuestDetails(selectedGroup.id, userIdFromStorage).then(
//               (guestDetails) => {
//                 console.log("Guest Details:", guestDetails);
//               }
//             );
//           }
//         } catch (err) {
//           console.error("Error checking member role:", err);
//         }
//       }
//     };
//     checkRoleAndFetch();
//   }, [selectedGroup]);

//   const [emojiWidth, setEmojiWidth] = useState(400);
//   useEffect(() => {
//     const updateWidth = () => {
//       const screenWidth = window.innerWidth;
//       if (screenWidth > 450) {
//         setEmojiWidth(450);
//       } else if (screenWidth <= 450) {
//         setEmojiWidth(screenWidth - 20);
//       } else {
//         setEmojiWidth(screenWidth - 50);
//       }
//     };

//     updateWidth();
//     window.addEventListener("resize", updateWidth);

//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   useEffect(() => {
//     const chatContainer = document.querySelector(".chat-messages");
//     if (chatContainer) {
//       chatContainer.scrollTop = chatContainer.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         emojiPickerRef.current &&
//         !emojiPickerRef.current.contains(event.target) &&
//         !event.target.closest(".emoji-btn")
//       ) {
//         setIsEmojiPickerOpen(false);
//       }
//     };

//     if (isEmojiPickerOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isEmojiPickerOpen]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         setIsEmojiPickerOpen(false);
//       }
//     };

//     if (isEmojiPickerOpen) {
//       document.addEventListener("keydown", handleKeyDown);
//     }

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [isEmojiPickerOpen]);

//   useEffect(() => {
//     if (!userId) return;

//     const fetchGroupsWithMembers = async () => {
//       try {
//         const groupsRef = collection(db, "groups");
//         const snapshot = await getDocs(groupsRef);

//         const groupsData = await Promise.all(
//           snapshot.docs.map(async (groupDoc) => {
//             const membersRef = collection(db, "groups", groupDoc.id, "members");
//             const membersSnap = await getDocs(membersRef);

//             const members = membersSnap.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//             }));

//             const messagesRef = collection(
//               db,
//               "groups",
//               groupDoc.id,
//               "messages"
//             );
//             const q = query(messagesRef, orderBy("sentAt", "asc"));

//             let messagesArr = [];
//             onSnapshot(q, (snap) => {
//               messagesArr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//               setGroups((prev) =>
//                 prev.map((g) =>
//                   g.id === groupDoc.id ? { ...g, messages: messagesArr } : g
//                 )
//               );
//             });

//             return {
//               id: groupDoc.id,
//               ...groupDoc.data(),
//               members,
//               messages: [],
//             };
//           })
//         );

//         const filteredGroups = groupsData.filter((group) =>
//           group.members.some((member) => member.id === userId)
//         );

//         setGroups(filteredGroups);
//       } catch (error) {
//         console.error("Error fetching groups:", error);
//       }
//     };

//     fetchGroupsWithMembers();
//   }, [userId, refreshKey]);

//   const markAsRead = (groupId) => {
//     setGroups((prev) =>
//       prev.map((g) =>
//         g.id === groupId
//           ? {
//               ...g,
//               members: g.members.map((m) =>
//                 m.id === userId
//                   ? { ...m, lastSeen: { toDate: () => new Date() } }
//                   : m
//               ),
//             }
//           : g
//       )
//     );
//   };

//   const handleImageUpload = async (e) => {};

//   const userPhoneNumber = localStorage.getItem("mobileNumber");

//   const getUnreadCount = (group) => {
//     return unreadCounts[group.id] || 0;
//   };

//   const customDecorator = (href, text, key) => (
//     <a
//       key={key}
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{ color: "#fff", fontWeight: "bold" }}
//     >
//       {text}
//     </a>
//   );

//   useEffect(() => {
//     if (!groups || groups.length === 0 || !userId || chatOpenRef.current)
//       return;

//     // Delay execution slightly
//     const timeout = setTimeout(() => {
//       const counts = {};
//       let total = 0;
//       groups.forEach((group) => {
//         const userMember = group.members.find((m) => m.id === userId);
//         const lastSeen = userMember?.lastSeenAt?.toDate
//           ? userMember.lastSeenAt.toDate()
//           : userMember?.lastSeenAt;

//         const unreadMessages = (group.messages || []).filter((msg) => {
//           if (!msg.sentAt || msg.senderId === userId) return false;
//           const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;
//           return lastSeen ? msgDate > lastSeen : true;
//         });

//         counts[group.id] = unreadMessages.length;
//         total += unreadMessages.length;
//       });

//       setUnreadCounts(counts);
//       localStorage.setItem("totalUnread", total.toString());
//       window.dispatchEvent(new Event("unreadCountChange"));
//     }, 500); // wait 500ms for Firestore update to apply

//     return () => clearTimeout(timeout);
//   }, [groups, userId, refreshKey]);

//   function linkify(text) {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.split(urlRegex).map((part, index) => {
//       if (part.match(urlRegex)) {
//         return (
//           <a key={index} href={part} target="_blank" rel="noopener noreferrer">
//             {part}
//           </a>
//         );
//       }
//       return part;
//     });
//   }

//   // useEffect(() => {
//   //   if (pathname === "/chat") {
//   //     if (typeof window !== "undefined") {
//   //       const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
//   //     console.log("addToHomeScreenPopup",addToHomeScreenPopup);

//   //       if (addToHomeScreenPopup !== "true") {
//   //         setShowInstall(true);
//   //       }
//   //     }

//   //     const handler = (e) => {
//   //       e.preventDefault();
//   //       setDeferredPrompt(e);
//   //     };

//   //     window.addEventListener("beforeinstallprompt", handler);

//   //     return () => {
//   //       window.removeEventListener("beforeinstallprompt", handler);
//   //     };
//   //   }
//   // }, [pathname]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
//       console.log("addToHomeScreenPopup", addToHomeScreenPopup);

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
//   }, [pathname]);

//   const handleInstallClick = async () => {
//     setShowInstall(false);

//     if (deferredPrompt) {
//       deferredPrompt.prompt();
//       const { outcome } = await deferredPrompt.userChoice;
//       if (outcome === "accepted") {
//         localStorage.setItem("addToHomeScreenPopup", "true");
//         console.log(
//           "outcome",
//           outcome,
//           localStorage.getItem("addToHomeScreenPopup")
//         );
//       } else {
//         localStorage.setItem("addToHomeScreenPopup", "false");
//       }

//       setDeferredPrompt(null);
//     }
//   };

//   useEffect(() => {
//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowInstall(true);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   // --------------------------------------------------------------------------------------------------------------------------
//   useEffect(() => {
//     if (!eventId || !userId) return;

//     const unsubscribe = listenToMessages(eventId, userId);

//     return () => unsubscribe();
//   }, [eventId, userId, selectedGroup]);

//   useEffect(() => {
//     chatOpenRef.current = !!selectedGroup;

//     if (selectedGroup && eventId && userId) {
//       const updatedCounts = {
//         ...unreadCounts,
//         [eventId]: 0,
//       };
//       setUnreadCounts(updatedCounts);
//     }
//   }, [selectedGroup, eventId, userId]);

//   const lastSeenAtRef = useRef(null);
//   const notifiedMessageIdsRef = useRef(new Set());

//   const updateLocalUnread = (updatedCounts) => {
//     const total = Object.values(updatedCounts).reduce(
//       (sum, count) => sum + count,
//       0
//     );
//     localStorage.setItem("totalUnread", total.toString());
//     window.dispatchEvent(new Event("unreadCountChange"));
//     return total;
//   };

//   const listenToMessages = (eventId, userId) => {
//     if (!eventId || !userId) return () => {};

//     const messagesRef = collection(db, "groups", eventId, "messages");
//     const q = query(messagesRef, orderBy("sentAt", "asc"));
//     const userRef = doc(db, "groups", eventId, "members", userId);

//     const unsubscribeUser = onSnapshot(userRef, (memberSnap) => {
//       lastSeenAtRef.current =
//         memberSnap.exists() && memberSnap.data().lastSeenAt
//           ? memberSnap.data().lastSeenAt.toDate()
//           : null;
//     });

//     const unsubscribeMessages = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setMessages(msgs);

//       const unreadMessages = msgs.filter((msg) => {
//         if (!msg.sentAt || msg.senderId === userId) return false;
//         const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;
//         return lastSeenAtRef.current ? msgDate > lastSeenAtRef.current : true;
//       });

//       setUnreadCounts((prev) => {
//         const updated = {
//           ...prev,
//           [eventId]: chatOpenRef.current ? 0 : unreadMessages.length,
//         };

//         if (chatOpenRef.current) {
//           // Update Firestore immediately for lastSeen
//           const userRef = doc(db, "groups", eventId, "members", userId);
//           setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });
//           lastSeenAtRef.current = new Date(); // local reference
//         }

//         updateLocalUnread(updated);
//         return updated;
//       });

//       // Notifications
//       if (!chatOpenRef.current && unreadMessages.length > 0) {
//         unreadMessages.forEach((msg) => {
//           if (
//             Notification.permission === "granted" &&
//             !notifiedMessageIdsRef.current.has(msg.id) &&
//             "Notification" in window
//           ) {
//             navigator.serviceWorker.ready.then((registration) => {
//               registration.showNotification(
//                 `New message from ${msg.senderName}`,
//                 {
//                   body: msg.text,
//                   icon: "/new_logo_light.png",
//                 }
//               );
//             });
//             notifiedMessageIdsRef.current.add(msg.id);
//           }
//         });
//       }
//     });

//     return () => {
//       unsubscribeUser();
//       unsubscribeMessages();
//     };
//   };

//   const sendMessage = async () => {
//     if (!text.trim()) return;
//     if (!eventId || !userID) {
//       console.warn("Missing eventId or userId — cannot send message.");
//       return;
//     }
//     const localSenderName = localStorage.getItem("wonderLandUserName") || "";

//     await addDoc(collection(db, "groups", eventId, "messages"), {
//       text,
//       senderId: userID,

//       // senderName:
//       //   urlParams?.userType === "host" ? orderDetails?.Name : localSenderName,
//       senderName: localSenderName ? localSenderName : userData?.name,
//       senderPhoneNumber: localStorage.getItem("mobileNumber"),
//       sentAt: serverTimestamp(),
//     });
//     console.log(
//       "%c [ addDoc ]-1195",
//       "font-size:13px; background:pink; color:#bf2c9f;",
//       addDoc
//     );

//     setText("");
//     setShowEmojiPicker(false);
//   };

//   const handleOpenMessages = async (group) => {
//     chatOpenRef.current = true;
//     setSelectedGroup(group);

//     // reset unread immediately
//     setUnreadCounts((prev) => {
//       const updated = { ...prev, [group.id]: 0 };
//       updateLocalUnread(updated);
//       return updated;
//     });

//     // update lastSeen both local + Firestore
//     lastSeenAtRef.current = new Date();
//     if (userId) {
//       const userRef = doc(db, "groups", group.id, "members", userId);
//       await setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });
//     }
//   };

//   // const handleCloseChat = async () => {
//   //   chatOpenRef.current = false;
//   //   lastSeenAtRef.current = new Date();

//   //   if (userId && selectedGroup) {
//   //     const userRef = doc(db, "groups", selectedGroup.id, "members", userId);
//   //     await setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });
//   //   }

//   //   setSelectedGroup(null);
//   // };

//   const handleCloseChat = async () => {
//     if (!selectedGroup || !userId) return;

//     // Forcefully mark all messages as seen
//     const userRef = doc(db, "groups", selectedGroup.id, "members", userId);
//     await setDoc(
//       userRef,
//       { lastSeenAt: serverTimestamp() }, // Firestore timestamp
//       { merge: true }
//     );
//     lastSeenAtRef.current = new Date(); // local reference

//     // Reset unread count for this chat locally
//     setUnreadCounts((prev) => {
//       const updated = { ...prev, [selectedGroup.id]: 0 };
//       updateLocalUnread(updated);
//       return updated;
//     });

//     setSelectedGroup(null);
//     setRefreshKey((prev) => prev + 1);
//   };

//   //------------------------------------------------------------------------------------------------------------------------------
//   const testSendMessage = () => {
//     // socket.emit("message:send", {
//     //   eventId: "6884a4ff6210988005d87ba5",
//     //   message: "Frontend se hello for testing",
//     //   tempId: Date.now().toString()
//     // });

//     socket.emit("message:send", {
//       roomId: "6884a4ff6210988005d87ba5",
//       message: "New Socket System Message",
//       type: "text",
//       tempId: Date.now().toString(),
//     });
//   };
//   return (
//     <div className="groups-container">
//       <div className="groups-header">
//         {/* <h3>Chats</h3> */}
//         <div className="search-wrapper">
//           <i className="fas fa-search search-icon"></i>
//           <input
//             type="text"
//             placeholder="Search"
//             className="search-box"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <button onClick={sendMessage}>Send Test Message</button>

//       {pathname === "/chat" && showInstall && (
//         <div className="chat-banner">
//           <Image src={PinBanner} alt="Banner" className="chat-banner-img" />
//           <button className="chat-banner-btn" onClick={handleInstallClick}>
//             Add To Phone Screen
//           </button>
//         </div>
//       )}

//       <div className="groups-list">
//         {allChatRooms
//           .filter((group) =>
//             group.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//           .map((group) => {
//             return (
//               <div
//                 key={group._id}
//                 className="group-item"
//                 onClick={() => handleOpenMessages(group)}
//               >
//                 {group.imageUrl ? (
//                   <img
//                     src={group.imageUrl}
//                     alt={group.name}
//                     className="group-avatar"
//                   />
//                 ) : (
//                   <div
//                     className="group-avatar-placeholder"
//                     style={{
//                       backgroundColor: "#27ae60",
//                       color: "white",
//                       fontSize: "24px",
//                       width: "50px",
//                       height: "50px",
//                       borderRadius: "50%",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     {group.roomName ? group.roomName.charAt(0).toUpperCase() : "?"}
//                   </div>
//                 )}

//                 <div className="group-info">
//                   <p className="group-name">{group.roomName || "Unnamed Group"}</p>
//                   <span className="group-last">
//                     {getUnreadCount(group) > 0
//                       ? `${getUnreadCount(group)} New Message${
//                           getUnreadCount(group) > 1 ? "s" : ""
//                         }`
//                       : "No new messages"}
//                   </span>
//                 </div>

//                 {unreadCounts[group.id] > 0 && (
//                   <span className="unread-dot"></span>
//                 )}
//               </div>
//             );
//           })}
//       </div>

//       {selectedGroup && (
//         <div className="chat-overlay">
//           <div className="chat-header">
//             <div className="chat-user-info">
//               <button
//                 className="btn back-arrow-chat"
//                 onClick={() => {
//                   handleCloseChat();
//                 }}
//               >
//                 <FaArrowLeft fontSize={16} />
//               </button>
//               <span className="mx-2">{`${selectedGroup.name}`}</span>{" "}
//               {/* <span>{orderDetails?.eventType} </span> */}
//             </div>
//           </div>

//           <div className="chat-messages" ref={chatBodyRef}>
//             {messages.map((msg) => {
//               // message render
//               const isMe = msg.senderId === userID;

//               const senderName = msg.senderName;
//               return (
//                 <div
//                   key={msg.id}
//                   className={`chat-message ${isMe ? "sender" : "receiver"}`}
//                 >
//                   {!isMe && (
//                     <div
//                       className="chat-avatar-receiver"
//                       style={{
//                         backgroundColor: getAvatarColor(
//                           senderName || msg.senderPhoneNumber
//                         ),
//                       }}
//                     >
//                       {senderName
//                         ? senderName.charAt(0).toUpperCase()
//                         : msg.senderPhoneNumber.charAt(3)}
//                     </div>
//                   )}
//                   <div
//                     className={`chat-bubble ${isMe ? "sender" : "receiver"}`}
//                   >
//                     {/* Sirf receiver ka naam/number */}
//                     {!isMe && (
//                       <div className="chat-sender">
//                         {senderName
//                           ? senderName
//                           : `+91 ${msg.senderPhoneNumber.slice(0, -4)}XXXX`}
//                       </div>
//                     )}

//                     <div className="chat-text">{linkify(msg.text)}</div>

//                     <div className="chat-time">
//                       {msg.sentAt?.toDate
//                         ? new Date(msg.sentAt.toDate()).toLocaleTimeString(
//                             "en-IN",
//                             {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: true,
//                             }
//                           )
//                         : ""}
//                     </div>
//                   </div>

//                   {/* Sender avatar (right side) */}
//                   {/* {isMe && (
//                     <div className="chat-avatar">
//                       {senderName
//                         ? senderName.charAt(0).toUpperCase()
//                         : msg.senderPhoneNumber.charAt(3)}
//                     </div>
//                   )} */}
//                 </div>
//               );
//             })}
//           </div>

//           <div className="chat-input-container">
//             <button
//               type="button"
//               onPointerDown={(e) => e.preventDefault()}
//               onClick={() => {
//                 if (showEmojiPicker) {
//                   setShowEmojiPicker(false);
//                   setTimeout(() => {
//                     textareaRef.current?.focus();
//                   }, 0);
//                 } else {
//                   // setShowEmojiPicker(true);
//                   // textareaRef.current?.blur();
//                   textareaRef.current?.blur();
//                   setTimeout(() => {
//                     setShowEmojiPicker(true);
//                   }, 50);
//                 }
//               }}
//               className="emoji-btn"
//             >
//               {showEmojiPicker ? (
//                 <FaRegKeyboard fontSize={20} />
//               ) : (
//                 <Image src={emojiIcon} alt="Emoji" className="emoji-icon" />
//               )}

//               <div>
//                 {/* Hidden file input */}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={fileInputRef}
//                   onChange={handleImageUpload}
//                   style={{ display: "none" }}
//                 />
//               </div>
//             </button>

//             <textarea
//               value={text}
//               ref={textareaRef}
//               className="chat-input"
//               rows={1}
//               onFocus={() => {
//                 if (showEmojiPicker) {
//                   setShowEmojiPicker(false);
//                 }
//                 setTimeout(() => {
//                   textareaRef.current?.scrollIntoView({
//                     behavior: "smooth",
//                     block: "end",
//                   });
//                   window.scrollBy(0, -180);
//                 }, 300);
//               }}
//               onChange={(e) => {
//                 setText(e.target.value);
//                 if (e.target.value.length > 0) {
//                   setShowEmojiPicker(false);
//                 }
//               }}
//               onInput={(e) => {
//                 e.target.style.height = "auto";
//                 e.target.style.height =
//                   Math.min(e.target.scrollHeight, 120) + "px";
//               }}
//               placeholder="Type message here..."
//             />

//             <button
//               onClick={() => {
//                 sendMessage();
//                 if (textareaRef.current) {
//                   textareaRef.current.style.height = "auto";
//                 }
//               }}
//               className="chat-send-btn"
//             >
//               <Image src={sendIcon} alt="Send" className="send-icon" />
//             </button>
//           </div>

//           {showEmojiPicker && (
//             <div
//               className="emoji-container"
//               onPointerDown={(e) => e.preventDefault()}

//               // onMouseDown={(e) => e.preventDefault()}
//               // onTouchStart={(e) => e.preventDefault()}
//             >
//               <EmojiPicker
//                 width={emojiWidth}
//                 searchDisabled={true}
//                 onEmojiClick={(emojiData) => {
//                   const textarea = textareaRef.current;
//                   const start = textarea.selectionStart;
//                   const end = textarea.selectionEnd;

//                   setText((prevText) => {
//                     const newText =
//                       prevText.substring(0, start) +
//                       emojiData.emoji +
//                       prevText.substring(end);

//                     requestAnimationFrame(() => {
//                       textarea.selectionStart = textarea.selectionEnd =
//                         start + emojiData.emoji.length;
//                     });

//                     return newText;
//                   });
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GroupsList;

// // components/GroupsListSocket.jsx
// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { FaArrowLeft } from "react-icons/fa";
// import EmojiPicker from "emoji-picker-react";
// import emojiIcon from "../../assets/Emoji.png";
// import sendIcon from "@/assets/sendicon.png";
// import PinBanner from "../../assets/pinBanner.jpg";
// import {
//   BASE_URL,
//   GET_CHAT_ROOMS,
//   GET_CHAT_MESSAGES, // add this constant: '/chat/messages'
//   GET_USER_BY_ID,
//   GET_GUEST_DETTAILS,
// } from "@/utils/apiconstants";
// import { usePathname } from "next/navigation";
// import useApi from "@/hooks/useApi";
// import socket from "@/socket"; // ensure socket connects on client with userId
// import "./GroupsList.css";
// const getUserIdFromUrl = () => {
//   if (typeof window === "undefined") return null;
//   const params = new URLSearchParams(window.location.search);
//   return params.get("id") || localStorage.getItem("userID");
// };

// const GroupsList = () => {
//   const userId = getUserIdFromUrl();
//   const pathname = usePathname();
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // Rooms from backend API (your existing hook)
//   const { data: chatRoomsData } = useApi(`${GET_CHAT_ROOMS}/${userId}`, "get");
//   const [allChatRooms, setAllChatRooms] = useState([]);
//   useEffect(() => {
//     if (chatRoomsData?.data) setAllChatRooms(chatRoomsData.data || []);
//   }, [chatRoomsData]);

//   // chat UI state
//   const [selectedGroup, setSelectedGroup] = useState(null); // room object
//   const [messages, setMessages] = useState([]); // messages for opened room
//   const [text, setText] = useState("");
//   const textareaRef = useRef(null);
//   const chatBodyRef = useRef(null);

//   // emoji
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [emojiWidth, setEmojiWidth] = useState(400);

//   // unread
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const chatOpenRef = useRef(false);

//   // temp message map for optimistic UI
//   const tempIdToClientMap = useRef(new Map());

//   // socket listeners setup (only client-side)
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!socket) return;

//     // on connect log
//     const onConnect = () => console.log("Socket connected:", socket.id);
//     socket.on("connect", onConnect);

//     // incoming message handler
//     const onMessageNew = (msg) => {
//       // ensure msg has roomId
//       const roomId = msg.roomId || msg.eventId;
//       if (!roomId) return;

//       // If current open room -> push into messages
//       setMessages((prev) => {
//         // If msg.tempId exists, replace optimistic
//         if (msg.tempId) {
//           const replaced = prev.map((m) => (m.tempId === msg.tempId ? { ...msg, id: msg._id } : m));
//           // if not found, append
//           const found = prev.some((m) => m.tempId === msg.tempId);
//           return found ? replaced : [...prev, { ...msg, id: msg._id }];
//         } else {
//           // prevent duplicate by _id
//           if (prev.some((m) => m._id === msg._id || m.id === msg._id)) return prev;
//           // if message is for open chat, append; otherwise increase unread
//           if (selectedGroup && selectedGroup._id === roomId) {
//             return [...prev, { ...msg, id: msg._id }];
//           } else {
//             // update unreadCounts
//             setUnreadCounts((old) => {
//               const cur = Number(old[roomId] || 0) + 1;
//               return { ...old, [roomId]: cur };
//             });
//             return prev;
//           }
//         }
//       });
//     };

//     socket.on("message:new", onMessageNew);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("message:new", onMessageNew);
//     };
//   }, [selectedGroup]); // re-register when selectedGroup changes (safe)

//   // scroll to bottom on messages change
//   useEffect(() => {
//     if (!chatBodyRef.current) return;
//     chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//   }, [messages]);

//   // emoji width responsivity
//   useEffect(() => {
//     const updateWidth = () => {
//       const screenWidth = window.innerWidth;
//       setEmojiWidth(screenWidth > 450 ? 450 : Math.max(200, screenWidth - 20));
//     };
//     updateWidth();
//     window.addEventListener("resize", updateWidth);
//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   // helper: fetch messages from REST API
//   const fetchMessagesForRoom = async (roomId, page = 1, limit = 50) => {
//     try {
//       const res = await fetch(`${BASE_URL}${GET_CHAT_MESSAGES}/${roomId}?page=${page}&limit=${limit}`, {
//         headers: { Authorization: token || "" },
//       });
//       const json = await res.json();
//       if (!json.error && json.data) {
//         // ensure messages ascending
//         setMessages(json.data);
//         // reset unread for that room
//         setUnreadCounts((old) => ({ ...old, [roomId]: 0 }));
//       } else {
//         console.warn("Failed fetch messages", json);
//       }
//     } catch (err) {
//       console.error("Fetch messages failed", err);
//     }
//   };

//   // handle opening a room (click)
//   const handleOpenMessages = async (group) => {
//     setSelectedGroup(group);
//     chatOpenRef.current = true;
//     // fetch messages via API
//     await fetchMessagesForRoom(group._id || group.id);
//     // reset unread locally
//     setUnreadCounts((prev) => ({ ...prev, [group._id || group.id]: 0 }));
//     // (Optional) notify backend about lastSeen via API if you implement it
//   };

//   // handle closing chat
//   const handleCloseChat = () => {
//     if (!selectedGroup) return;
//     // we could call an API to mark lastSeen if implemented; for now, local only
//     setSelectedGroup(null);
//     chatOpenRef.current = false;
//     setMessages([]);
//   };

//   // send message (optimistic)
//   const sendMessage = () => {
//     if (!text.trim()) return;
//     if (!selectedGroup) return;

//     const roomId = selectedGroup._id || selectedGroup.id;
//     const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
//     const tempId = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

//     // create optimistic message object (same shape as server will send)
//     const optimistic = {
//       tempId,
//       _id: tempId,
//       id: tempId,
//       roomId,
//       senderId: userID,
//       message: text,
//       type: "text",
//       mediaUrl: "",
//       createdAt: new Date().toISOString(),
//       senderName: localStorage.getItem("wonderLandUserName") || "",
//     };

//     // add to UI immediately
//     setMessages((prev) => [...prev, optimistic]);
//     tempIdToClientMap.current.set(tempId, true);

//     // emit to socket
//     if (socket && socket.connected) {
//       socket.emit("message:send", {
//         roomId,
//         message: text,
//         type: "text",
//         tempId,
//       });
//     } else {
//       // If socket not connected, fallback: POST to messages API (optional)
//       console.warn("Socket not connected — message queued (not implemented queue).");
//     }

//     // clear input
//     setText("");
//     textareaRef.current && (textareaRef.current.style.height = "auto");
//     // scroll
//     setTimeout(() => {
//       chatBodyRef.current && (chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight);
//     }, 100);
//   };

//   // helper for display avatar color
//   const getAvatarColor = (name) => {
//     const colors = ["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#009688","#4CAF50","#FF9800","#795548"];
//     let hash = 0; for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     return colors[Math.abs(hash % colors.length)];
//   };

//   // test emit (kept for debug)
//   const testSendMessage = () => {
//     if (!socket) return;
//     socket.emit("message:send", {
//       roomId: selectedGroup?._id || selectedGroup?.id || allChatRooms[0]?._id,
//       message: "New Socket System Message",
//       type: "text",
//       tempId: Date.now().toString(),
//     });
//   };

//   return (
//     <div className="groups-container">
//       <div className="groups-header">
//         <div className="search-wrapper">
//           <i className="fas fa-search search-icon"></i>
//           <input type="text" placeholder="Search" className="search-box" />
//         </div>
//       </div>

//       <div className="groups-list">
//         {allChatRooms.map((group) => {
//           const roomId = group._id || group.id;
//           const unread = unreadCounts[roomId] || 0;
//           return (
//             <div key={roomId} className="group-item" onClick={() => handleOpenMessages(group)}>
//               {group.imageUrl ? (
//                 <img src={group.imageUrl} alt={group.roomName} className="group-avatar" />
//               ) : (
//                 <div className="group-avatar-placeholder"
//                      style={{ backgroundColor: "#27ae60", color: "white", fontSize: "24px", width: "50px", height: "50px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                   {group.roomName ? group.roomName.charAt(0).toUpperCase() : "?"}
//                 </div>
//               )}

//               <div className="group-info">
//                 <p className="group-name">{group.roomName || "Unnamed Group"}</p>
//                 <span className="group-last">{unread > 0 ? `${unread} New Message${unread>1?'s':''}` : "No new messages"}</span>
//               </div>

//               {unread > 0 && <span className="unread-dot" />}
//             </div>
//           );
//         })}
//       </div>

//       {selectedGroup && (
//         <div className="chat-overlay">
//           <div className="chat-header">
//             <div className="chat-user-info">
//               <button className="btn back-arrow-chat" onClick={handleCloseChat}><FaArrowLeft fontSize={16} /></button>
//               <span className="mx-2">{selectedGroup.roomName || selectedGroup.roomName}</span>
//             </div>
//           </div>

//           <div className="chat-messages" ref={chatBodyRef} style={{ overflowY: "auto", maxHeight: "60vh", padding: "16px" }}>
//             {messages.map((msg) => {
//               const isMe = msg.senderId === (typeof window !== "undefined" ? localStorage.getItem("userID") : null);
//               const senderName = msg.senderName || "";
//               return (
//                 <div key={msg.id || msg._id} className={`chat-message ${isMe ? "sender" : "receiver"}`}>
//                   {!isMe && <div className="chat-avatar-receiver" style={{ backgroundColor: getAvatarColor(senderName || msg.senderPhoneNumber) }}>
//                     {senderName ? senderName.charAt(0).toUpperCase() : (msg.senderPhoneNumber || "U").charAt(0)}
//                   </div>}

//                   <div className={`chat-bubble ${isMe ? "sender" : "receiver"}`}>
//                     {!isMe && <div className="chat-sender">{senderName || `+91 ${ (msg.senderPhoneNumber||'').slice(0,-4) }XXXX`}</div>}
//                     <div className="chat-text">{ msg.message || msg.text || "" }</div>
//                     <div className="chat-time">{ msg.sentAt ? (new Date(msg.sentAt).toLocaleTimeString()) : (msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : "") }</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="chat-input-container" style={{ display: "flex", alignItems: "center", padding: "8px" }}>
//             <button type="button" onClick={() => setShowEmojiPicker((s) => !s)} className="emoji-btn">
//               <Image src={emojiIcon} alt="Emoji" className="emoji-icon" />
//             </button>

//             <textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)}
//                       className="chat-input" placeholder="Type message here..."
//                       style={{ flex: 1, minHeight: 40, maxHeight: 120, resize: "none" }} />

//             <button onClick={sendMessage} className="chat-send-btn">
//               <Image src={sendIcon} alt="Send" className="send-icon" />
//             </button>
//           </div>

//           {showEmojiPicker && (
//             <div style={{ position: "absolute", bottom: 80, right: 16 }}>
//               <EmojiPicker width={emojiWidth} onEmojiClick={(e) => setText((t) => t + e.emoji)} />
//             </div>
//           )}

//         </div>
//       )}
//     </div>
//   );
// };

// export default GroupsList;

// components/GroupsList.jsx  (replace your old file content with this)
import React, { useRef, useEffect, useState } from "react";
import "./GroupsList.css";
import EmojiPicker from "emoji-picker-react";
import emojiIcon from "../../assets/Emoji.png";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import "../wonderland/EventInvitation.css";
import { FaRegKeyboard } from "react-icons/fa6";
import sendIcon from "@/assets/sendicon.png";
import PinBanner from "../../assets/pinBanner.jpg";
import {
  BASE_URL,
  GET_CHAT_ROOMS,
  GET_GUEST_DETTAILS,
  GET_USER_BY_ID,
  GET_CHAT_MESSAGES, // ensure this is present in your apiconstants
} from "@/utils/apiconstants";
import { askAndSubscribe } from "@/utils/pushClient";
import { usePathname } from "next/navigation";
import useApi from "@/hooks/useApi";
import socket from "@/socket"; // your socket client
// helper to read userId from url
const getUserIdFromUrl = () => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const GroupsList = () => {
  // ---------- state & refs (kept same names as your original)
  const [groups, setGroups] = useState([]); // not used heavily but kept
  const userId = getUserIdFromUrl();
  const { data: chatRoomsData } = useApi(`${GET_CHAT_ROOMS}/${userId}`, "get");
  const [allChatRooms, setAllChatRooms] = useState([]);
  useEffect(() => {
    if (chatRoomsData?.data) {
      setAllChatRooms(chatRoomsData.data || []);
    }
  }, [chatRoomsData]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  async function enableNotifications() {
    const PUBLIC_VAPID =
      "BHBPued2H9tMC6x97EOQchgTE8P5d6QGaoTsfN3diqNq5oYa8nZoBv0Qb29iabLpi43C9-fFTalSAJdqCYNSA-0";
    // const userId = localStorage.getItem("userID");

    try {
      const sub = await askAndSubscribe(
        PUBLIC_VAPID,
        userId,
        selectedGroup?.roomId
      );
      console.log("Subscribed:", sub);
    } catch (e) {
      console.log("Push error", e);
    }
  }

  const [selectedGroup, setSelectedGroup] = useState(null);
  console.log(
    "%c [ selectedGroup ]-1406",
    "font-size:13px; background:pink; color:#bf2c9f;",
    selectedGroup
  );
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [text, setText] = useState("");
  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const eventId = selectedGroup?._id || selectedGroup?.id || null;
  const textareaRef = useRef(null);
  const chatOpenRef = useRef(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [orderDetails, setOrderDetails] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const lastSeenAtRef = useRef(null);
  const notifiedMessageIdsRef = useRef(new Set());
  const notifiedMessageIdsForPush = useRef(new Set());

  // keep a map for optimistic messages
  const tempIdToClientMap = useRef(new Map());

  // ---------- basic helpers (kept)
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
    if (!name) return colors[0];
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
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

  // ---------- fetch user details (same)
  useEffect(() => {
    const fetchUserAccountDetails = async () => {
      if (!userId) {
        console.log("User id not available");
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
        } else {
          setUserData(data.data || {});
        }
      } catch (err) {
        console.log("Error fetching user:", err.message);
      }
    };
    fetchUserAccountDetails();
  }, [userId]);

  // ---------- fetch order/guest details (kept)
  const fetchOrderDetails = async (eventIdParam) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventIdParam}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );
      const result = await res.json();
      if (res.status === 200 && result.data) {
        const data = result.data;
        setOrderDetails({ Name: data.hostName });
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  };

  const fetchGuestDetails = async (eventIdParam, uid) => {
    try {
      const endpoint = `${BASE_URL}${GET_GUEST_DETTAILS}/${eventIdParam}/user/${uid}`;
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data && data.data) {
        setGuestDetails({ name: data.data.name });
      }
    } catch (err) {
      console.error("Error fetching guest:", err);
    }
  };

  // ---------- responsive emoji width (kept)
  const [emojiWidth, setEmojiWidth] = useState(400);
  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 450) setEmojiWidth(450);
      else if (screenWidth <= 450) setEmojiWidth(screenWidth - 20);
      else setEmojiWidth(screenWidth - 50);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // ---------- scroll to bottom when messages change (kept)
  useEffect(() => {
    const chatContainer =
      chatBodyRef.current || document.querySelector(".chat-messages");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  // ---------- copy of original "check role" logic (replace Firestore calls with API)
  useEffect(() => {
    const checkRoleAndFetch = async () => {
      if (selectedGroup && (selectedGroup._id || selectedGroup.id)) {
        const uid = localStorage.getItem("userID");
        if (!uid) return;
        // We assume room.members is available in room object (from GET_CHAT_ROOMS).
        const memberEntry = (selectedGroup.members || []).find((m) => {
          // m might be object { _id, role } or simple id; try both
          if (!m) return false;
          if (typeof m === "string") return m === uid;
          return (
            String(m._id || m.id) === String(uid) ||
            String(m.userId || m.user) === String(uid)
          );
        });
        const role =
          memberEntry?.role ||
          (memberEntry && memberEntry.isHost ? "host" : null);
        if (role === "host") {
          await fetchOrderDetails(selectedGroup._id || selectedGroup.id);
        } else {
          await fetchGuestDetails(selectedGroup._id || selectedGroup.id, uid);
        }
      }
    };
    checkRoleAndFetch();
  }, [selectedGroup]);

  // ---------- handle back button (kept)
  useEffect(() => {
    const handleBackButton = (e) => {
      if (selectedGroup) {
        e.preventDefault();
        setSelectedGroup(null);
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [selectedGroup]);

  // ---------- SOCKET: receive messages + read updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!socket) return;

    const onConnect = () => console.log("Socket connected:", socket.id);
    const onMessageNew = (msg) => {
      // msg expected: { _id, roomId, senderId, message, type, mediaUrl, tempId, createdAt }
      const roomId = msg.roomId || msg.eventId;
      if (!roomId) return;

      setMessages((prev) => {
        // if optimistic message exists replace it by server message
        if (msg.tempId) {
          const found = prev.some((m) => m.tempId === msg.tempId);
          if (found)
            return prev.map((m) =>
              m.tempId === msg.tempId ? { ...msg, id: msg._id } : m
            );
        }
        // prevent duplicate id
        if (prev.some((m) => String(m._id || m.id) === String(msg._id)))
          return prev;
        // if currently in this open room append, else leave messages unchanged and update unread
        if (
          selectedGroup &&
          String(selectedGroup._id || selectedGroup.id) === String(roomId)
        ) {
          // auto mark read for currently open chat
          // push and emit read
          setTimeout(() => {
            markRoomRead(roomId, userID);
          }, 50);
          return [...prev, { ...msg, id: msg._id }];
        } else {
          // update unread counter
          setUnreadCounts((old) => {
            const cur = Number(old[roomId] || 0) + 1;
            return { ...old, [roomId]: cur };
          });
          return prev;
        }
      });

      // show notification if chat not open
      // if (
      //   !chatOpenRef.current &&
      //   Notification.permission === "granted" &&
      //   "serviceWorker" in navigator
      // ) {
      //   if (!notifiedMessageIdsForPush.current.has(msg._id)) {
      //     navigator.serviceWorker.ready.then((reg) => {
      //       reg.showNotification(
      //         msg.senderName
      //           ? `New message from ${msg.senderName}`
      //           : "New message",
      //         {
      //           body: msg.message || msg.text || "",
      //           icon: "/new_logo_light.png",
      //         }
      //       );
      //     });
      //     notifiedMessageIdsForPush.current.add(msg._id);
      //   }
      // }
    };

    const onReadUpdate = (update) => {
      // update = { roomId, userId, lastReadAt }
      // update local unread counts if needed (safer to refetch messages or recompute)
      // For simplicity, if active room is same and userId === me, reset unread
      if (
        String(update.userId) === String(userID) &&
        selectedGroup &&
        String(selectedGroup._id || selectedGroup.id) === String(update.roomId)
      ) {
        setUnreadCounts((prev) => ({ ...prev, [update.roomId]: 0 }));
      }
    };

    socket.on("connect", onConnect);
    socket.on("message:new", onMessageNew);
    socket.on("message:read:update", onReadUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("message:new", onMessageNew);
      socket.off("message:read:update", onReadUpdate);
    };
  }, [selectedGroup, userID]);

  // ---------- fetch messages REST API (paginated)
  const fetchMessagesForRoom = async (roomId, page = 1, limit = 50) => {
    if (!roomId) return;
    try {
      const res = await fetch(
        `${BASE_URL}${GET_CHAT_MESSAGES}/${roomId}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (!json.error && json.data) {
        // ensure ascending order for UI (old -> new)
        setMessages(json.data || []);
        // compute unread for this room using lastReadAt from room
        const roomObj = allChatRooms.find(
          (r) => String(r._id || r.id) === String(roomId)
        );
        const lastReadMap = roomObj?.lastReadAt || roomObj?.lastReadAtMap || {};
        const lastReadForMe = lastReadMap
          ? lastReadMap[userID]
            ? new Date(lastReadMap[userID])
            : null
          : null;
        const unread = (json.data || []).filter((m) => {
          if (!m.createdAt && !m.sentAt) return false;
          const created = m.createdAt
            ? new Date(m.createdAt)
            : m.sentAt
            ? new Date(m.sentAt)
            : null;
          if (!created) return false;
          if (String(m.senderId) === String(userID)) return false;
          return lastReadForMe ? created > lastReadForMe : true;
        }).length;
        setUnreadCounts((prev) => ({ ...prev, [roomId]: unread }));
      } else {
        console.warn("Failed fetch messages", json);
      }
    } catch (err) {
      console.error("Fetch messages failed", err);
    }
  };

  // ---------- handle opening a room (kept UI behavior same)
  const handleOpenMessages = async (group) => {
    chatOpenRef.current = true;
    setSelectedGroup(group);
    const roomId = group._id || group.id;
    await fetchMessagesForRoom(roomId);
    // reset unread locally
    setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }));
    // mark read via socket and optional REST mark-read
    markRoomRead(roomId, userID);
  };

  // ---------- mark room read (emit socket + try REST)
  const markRoomRead = async (roomId, uid) => {
    if (!roomId || !uid) return;
    try {
      // emit socket event (server will update room.lastReadAt and broadcast)
      if (socket && socket.connected)
        socket.emit("message:read", { roomId, userId: uid });
      // optional REST fallback if you add mark-read endpoint
      try {
        await fetch(`${BASE_URL}/api/customer/event/mark-read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ roomId, userId: uid }),
        });
      } catch (e) {
        // ignore if not implemented
      }
      // local UI update
      setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }));
    } catch (err) {
      console.error("markRoomRead err", err);
    }
  };

  // ---------- handle closing chat (kept UI behavior)
  const handleCloseChat = async () => {
    if (!selectedGroup || !userId) return;
    // mark read before close
    await markRoomRead(selectedGroup._id || selectedGroup.id, userID);
    setSelectedGroup(null);
    setRefreshKey((prev) => prev + 1);
    chatOpenRef.current = false;
    setMessages([]);
  };

  // ---------- send message (optimistic, same UI)
  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!eventId || !userID) {
      console.warn("Missing eventId or userId — cannot send message.");
      return;
    }
    const roomId = eventId;
    const localSenderName =
      localStorage.getItem("wonderLandUserName") || userData?.name || "";

    // create optimistic message
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const optimistic = {
      id: tempId,
      tempId,
      _id: tempId,
      roomId,
      senderId: userID,
      message: text,
      text,
      type: "text",
      senderName: localSenderName,
      senderPhoneNumber: localStorage.getItem("mobileNumber"),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    tempIdToClientMap.current.set(tempId, true);

    // emit socket
    if (socket && socket.connected) {
      socket.emit("message:send", {
        roomId,
        message: text,
        type: "text",
        tempId,
      });
    } else {
      console.warn("Socket not connected — fallback not implemented");
    }

    setText("");
    setShowEmojiPicker(false);
  };

  // ---------- compute unread counts across rooms (keeps behaviour of original)
  useEffect(() => {
    if (
      !allChatRooms ||
      allChatRooms.length === 0 ||
      !userId ||
      chatOpenRef.current
    )
      return;
    const timeout = setTimeout(() => {
      const counts = {};
      let total = 0;
      (allChatRooms || []).forEach((group) => {
        const roomId = group._id || group.id;
        const lastReadMap = group.lastReadAt || group.lastReadAtMap || {};
        const lastSeen =
          lastReadMap && lastReadMap[userID]
            ? new Date(lastReadMap[userID])
            : null;

        // use current messages if they belong to this room, else we can't compute precisely without fetching
        const msgsForRoom = (messages || []).filter(
          (m) =>
            String(m.roomId || m.eventId || m.room || "") === String(roomId)
        );
        // If no local messages for that room, we cannot compute here reliably. We'll assume 0 unless previously stored in unreadCounts
        let unreadForRoom = unreadCounts[roomId] || 0;
        if (msgsForRoom.length > 0) {
          unreadForRoom = msgsForRoom.filter((msg) => {
            if (!msg.createdAt && !msg.sentAt) return false;
            const msgDate = msg.sentAt
              ? new Date(msg.sentAt)
              : new Date(msg.createdAt);
            if (String(msg.senderId) === String(userID)) return false;
            return lastSeen ? msgDate > lastSeen : true;
          }).length;
        }
        counts[roomId] = unreadForRoom;
        total += unreadForRoom;
      });
      setUnreadCounts((prev) => ({ ...prev, ...counts }));
      localStorage.setItem("totalUnread", total.toString());
      window.dispatchEvent(new Event("unreadCountChange"));
    }, 300);
    return () => clearTimeout(timeout);
  }, [allChatRooms, userId, messages, refreshKey]);

  // ---------- helper to convert link text to anchor (kept)
  function linkify(textVal) {
    if (!textVal) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return textVal.split(urlRegex).map((part, index) => {
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

  // ---------- install prompt logic (kept)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const addToHomeScreenPopup = localStorage.getItem("addToHomeScreenPopup");
      if (addToHomeScreenPopup !== "true") setShowInstall(true);
    }
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [pathname]);

  const handleInstallClick = async () => {
    setShowInstall(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted")
        localStorage.setItem("addToHomeScreenPopup", "true");
      else localStorage.setItem("addToHomeScreenPopup", "false");
      setDeferredPrompt(null);
    }
  };

  // --------- handle image upload placeholder (kept stub)
  const handleImageUpload = async (e) => {
    // Implement: upload to S3 via your API, then socket.emit message:send with type:image + mediaUrl
    console.log("image upload - not implemented here", e?.target?.files);
  };

  // ---------- render UI (kept exact structure/classes as original)
  return (
    <div className="groups-container">
      <div className="groups-header">
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

      {pathname === "/chat" && showInstall && (
        <div className="chat-banner">
          <Image src={PinBanner} alt="Banner" className="chat-banner-img" />
          <button className="chat-banner-btn" onClick={handleInstallClick}>
            Add To Phone Screen
          </button>
        </div>
      )}

      <div className="groups-list">
        {allChatRooms
          .filter((group) =>
            (group.roomName || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .map((group) => {
            const id = group._id || group.id;
            return (
              <div
                key={id}
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
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {group.roomName
                      ? group.roomName.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}

                <div className="group-info">
                  <p className="group-name">
                    {group.roomName || "Unnamed Group"}
                  </p>
                  <span className="group-last">
                    {(unreadCounts[id] || 0) > 0
                      ? `${unreadCounts[id]} New Message${
                          unreadCounts[id] > 1 ? "s" : ""
                        }`
                      : "No new messages"}
                  </span>
                </div>

                {(unreadCounts[id] || 0) > 0 && (
                  <span className="unread-dot"></span>
                )}
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
                onClick={() => {
                  handleCloseChat();
                }}
              >
                <FaArrowLeft fontSize={16} />
              </button>
              <span className="mx-2">{`${
                selectedGroup.roomName || selectedGroup.name || ""
              }`}</span>
            </div>
          </div>
          <button onClick={enableNotifications}>Send Test Message</button>
          <div className="chat-messages" ref={chatBodyRef}>
            {messages.map((msg) => {
              const isMe = String(msg.senderId) === String(userID);
              const senderName = msg.senderName;
              return (
                <div
                  key={msg.id || msg._id}
                  className={`chat-message ${isMe ? "sender" : "receiver"}`}
                >
                  {!isMe && (
                    <div
                      className="chat-avatar-receiver"
                      style={{
                        backgroundColor: getAvatarColor(
                          senderName || msg.senderPhoneNumber
                        ),
                      }}
                    >
                      {senderName
                        ? senderName.charAt(0).toUpperCase()
                        : (msg.senderPhoneNumber || "U").charAt(0)}
                    </div>
                  )}
                  <div
                    className={`chat-bubble ${isMe ? "sender" : "receiver"}`}
                  >
                    {!isMe && (
                      <div className="chat-sender">
                        {senderName
                          ? senderName
                          : `+91 ${(msg.senderPhoneNumber || "").slice(
                              0,
                              -4
                            )}XXXX`}
                      </div>
                    )}
                    <div className="chat-text">
                      {linkify(msg.message || msg.text || "")}
                    </div>
                    <div className="chat-time">
                      {msg.sentAt?.toDate
                        ? new Date(msg.sentAt.toDate()).toLocaleTimeString(
                            "en-IN",
                            { hour: "2-digit", minute: "2-digit", hour12: true }
                          )
                        : msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </div>
                  </div>
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
                  textareaRef.current?.blur();
                  setTimeout(() => {
                    setShowEmojiPicker(true);
                  }, 50);
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
                if (showEmojiPicker) setShowEmojiPicker(false);
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
                if (e.target.value.length > 0) setShowEmojiPicker(false);
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
                if (textareaRef.current)
                  textareaRef.current.style.height = "auto";
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
