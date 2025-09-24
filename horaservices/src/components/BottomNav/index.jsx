
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp , getDocs} from "firebase/firestore";
import { db } from "../../firebase";
import eventIcon from "../../assets/nav_icon/events.svg";
import eventsIconFill from "@/assets/nav_icon/fillevents.svg";
import messageIcon from "../../assets/nav_icon/message.svg";
import messageIconFill from "../../assets/nav_icon/fillmessage.svg";
import servicesIcon from "../../assets/nav_icon/services.svg";
import serviceIconFill from "@/assets/nav_icon/fillservice.svg";
import accountIcon from "../../assets/nav_icon/account.svg";
import accountIconFill from "@/assets/nav_icon/fillaccount.svg";
import "./bottomNav.css";

export default function BottomNav({ id }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const [userId, setUserId] = useState("");
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const chatOpenRef = useRef(false); // Track if chat page is open
  const lastSeenRef = useRef({}); // Track lastSeen for each group
  const notifiedMessageIdsRef = useRef(new Set()); // For notifications

  // Load userId from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("userID");
    if (storedId) setUserId(storedId);
  }, []);

  // Sync unread count with localStorage
  useEffect(() => {
    const syncUnread = () => {
      setTotalUnreadCount(parseInt(localStorage.getItem("totalUnread") || "0"));
    };
    window.addEventListener("unreadCountChange", syncUnread);
    window.addEventListener("storage", syncUnread); // cross-tab

    return () => {
      window.removeEventListener("unreadCountChange", syncUnread);
      window.removeEventListener("storage", syncUnread);
    };
  }, []);

  // Listen to messages for all groups of this user
  useEffect(() => {
    if (!userId) return;

    const unsubscribeFunctions = [];

   const fetchGroups = async () => {
  const groupsRef = collection(db, "groups");
  const qGroups = query(groupsRef);
  const snap = await getDocs(qGroups);

  for (const groupDoc of snap.docs) {
    const groupId = groupDoc.id;

    const memberDocRef = doc(db, "groups", groupId, "members", userId);
    const memberSnap = await getDocs(collection(db, "groups", groupId, "members"));

    const isMember = memberSnap.docs.some(doc => doc.id === userId);
    if (!isMember) continue; // skip if user not a member

    const membersRef = doc(db, "groups", groupId, "members", userId);
    const messagesRef = collection(db, "groups", groupId, "messages");
    const qMessages = query(messagesRef, orderBy("sentAt", "asc"));

    // Listen to member's lastSeen
    const unsubscribeUser = onSnapshot(membersRef, (snap) => {
      lastSeenRef.current[groupId] = snap.exists() && snap.data().lastSeenAt
        ? snap.data().lastSeenAt.toDate()
        : null;
    });

    // Listen to messages
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      let unreadCount = 0;

      msgs.forEach((msg) => {
        if (msg.senderId === userId) return;

        const msgDate = msg.sentAt?.toDate ? msg.sentAt.toDate() : msg.sentAt;
        const lastSeen = lastSeenRef.current[groupId];

        if (!lastSeen || msgDate > lastSeen) {
          const isCurrentChatOpen = chatOpenRef.current && currentPath.includes(`/chat?id=${groupId}`);
          if (!isCurrentChatOpen) unreadCount++;

          if (!chatOpenRef.current && !notifiedMessageIdsRef.current.has(msg.id)) {
            // show notification
            notifiedMessageIdsRef.current.add(msg.id);
          }
        }
      });

      let allCounts = {};
      try {
        const stored = localStorage.getItem("unreadCounts");
        const parsed = stored ? JSON.parse(stored) : {};
        allCounts = typeof parsed === "object" && parsed !== null ? parsed : {};
      } catch (err) {
        console.error("Failed to parse unreadCounts:", err);
        allCounts = {};
      }

      allCounts[groupId] = chatOpenRef.current ? 0 : unreadCount;
      localStorage.setItem("unreadCounts", JSON.stringify(allCounts));
const totalUnread = Object.values(allCounts).reduce((acc, val) => acc + val, 0);
  localStorage.setItem("totalUnread", totalUnread.toString());
  window.dispatchEvent(new Event("unreadCountChange"));
    });

    unsubscribeFunctions.push(unsubscribeUser, unsubscribeMessages);
  }
};

    fetchGroups();

    return () => {
      unsubscribeFunctions.forEach((fn) => fn());
    };
  }, [userId]);

  // Track if chat page is open
  useEffect(() => {
    chatOpenRef.current = currentPath.includes("/chat");
  }, [currentPath]);

  return (
    <div className="bottom-nav">
      <Link href={`/wonderland?id=${userId || ""}`}>
        <div className={`nav-item ${currentPath.includes("wonderland") ? "active" : ""}`}>
          <Image
            src={currentPath.includes("wonderland") ? eventsIconFill : eventIcon}
            alt="Events"
            className="nav-icon"
          />
          <span className="nav-text">Events</span>
        </div>
      </Link>

      <Link href={`/chat?id=${userId || ""}`}>
        <div className={`nav-item ${currentPath.includes("chat") ? "active" : ""}`} style={{ position: "relative" }}>
          <Image
            src={currentPath.includes("chat") ? messageIconFill : messageIcon}
            alt="Chats"
            className="nav-icon"
          />
          <span className="nav-text">Chats</span>

          {/* Badge */}
          {totalUnreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "red",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "600",
                lineHeight: "1",
                minWidth: "18px",
                textAlign: "center",
              }}
            >
              {totalUnreadCount}
            </span>
          )}
        </div>
      </Link>

      <div className="nav-item">
        <Image src={servicesIcon} alt="Services" className="nav-icon" />
        <span className="nav-text">Services</span>
      </div>

      <Link href={`/accounts?userid=${userId}`}>
        <div className={`nav-item ${currentPath.includes("accounts") ? "active" : ""}`}>
          <Image src={currentPath.includes("accounts") ? accountIconFill : accountIcon} alt="Account" className="nav-icon" />
          <span className="nav-text">Account</span>
        </div>
      </Link>
    </div>
  );
}