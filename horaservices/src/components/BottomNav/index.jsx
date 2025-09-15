// import React from "react";
// // components/BottomNav.jsx
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from 'next/router';
// import eventIcon from "../../assets/nav_icon/events.svg";
// import eventsIconFill from "@/assets/nav_icon/fillevents.svg"
// import messageIcon from "../../assets/nav_icon/message.svg";
// import messageIconFill from "../../assets/nav_icon/fillmessage.svg"
// import servicesIcon from "../../assets/nav_icon/services.svg";
// import serviceIconFill from "@/assets/nav_icon/fillservice.svg"
// import accountIcon from "../../assets/nav_icon/account.svg";
// import accountIconFill from "@/assets/nav_icon/fillaccount.svg"
// import { useEffect,useState } from "react";
// import "./bottomNav.css";

// export default function BottomNav({ id }) {
//     const router = useRouter();
//     const currentPath = router.pathname;
//   const [showPopup, setShowPopup] = React.useState(false);
//   const handleAccountClick = () => {
//     setShowPopup(true);
//   };
//   const handleClosePopup = (e) => {
//     e.stopPropagation();
//     setShowPopup(false);
//   };
  
//   const [userId, setUserId] = useState("");

//   // Fetch userId from localStorage
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedId = localStorage.getItem("userID");
//       if (storedId) {
//         setUserId(storedId);
//       }
//     }
//   }, []);
//   return (
//     <>
//       {showPopup && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.25)",
//             zIndex: 9999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           onClick={handleClosePopup}
//         >
//           <div
//             style={{
//               background: "#fff",
//               // color: "#333",
//               borderRadius: "18px",
//               padding: "32px 40px 28px 40px",
//               minWidth: "260px",
//               textAlign: "center",
//               fontFamily: "inherit",
//               fontSize: "1.08rem",
//               animation: "fadeIn 0.2s",
//               position: "relative",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               style={{
//                 fontWeight: 700,
//                 fontSize: "1.18rem",
//                 marginBottom: 10,
//                 color: "#97538c",
//               }}
//             >
//               Access Restricted
//             </div>
//             <div style={{ marginBottom: 20 }}>
//               Currently unable to access this section.
//             </div>
//             <button
//               onClick={handleClosePopup}
//               style={{
//                 background: "#97538c",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "8px",
//                 padding: "10px 28px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 fontSize: "1rem",
//                 // boxShadow: "0 2px 8px rgba(108,99,255,0.12)",
//                 marginTop: 8,
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
      
//         <div className="bottom-nav">
     
//    <Link href={`/wonderland?id=${id || ""}`}>
//   <div className={`nav-item ${currentPath.includes("wonderland") ? "active" : ""}`}>
//     <Image
//       src={currentPath.includes("wonderland") ? eventsIconFill : eventIcon}
//       alt="Message Icon"
//       className="nav-icon"
//     />
//     <span className="nav-text">Events</span>
//   </div>
// </Link>

//       <Link href={`/chat?id=${id || ""}`}>
//   <div className={`nav-item ${currentPath.includes("chat") ? "active" : ""}`}>
//     <Image
//       src={currentPath.includes("chat") ? messageIconFill : messageIcon}
//       alt="Message Icon"
//       className="nav-icon"
//     />
//     <span className="nav-text">Chats</span>
//   </div>
// </Link>

//     <Link href="/">
//  <div className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>    <Image
//       src={currentPath.includes("Services") ? serviceIconFill : servicesIcon}
//       alt="Message Icon"
//       className="nav-icon"
//     />
//     <span className="nav-text">Services</span>
//   </div>
// </Link>
   
//  <Link href={`/accounts?userid=${id}`}>
//   <div className={`nav-item ${currentPath.includes('accounts') ? 'active' : ''}`}>   <Image
//       src={currentPath.includes("accounts") ? accountIconFill : accountIcon}
//       alt="Message Icon"
//       className="nav-icon"
//     />
//     <span className="nav-text">Account</span>
//   </div>
// </Link>
//     </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import eventIcon from "../../assets/nav_icon/events.svg";
import eventsIconFill from "@/assets/nav_icon/fillevents.svg";
import messageIcon from "../../assets/nav_icon/message.svg";
import messageIconFill from "../../assets/nav_icon/fillmessage.svg";
import servicesIcon from "../../assets/nav_icon/services.svg";
import serviceIconFill from "@/assets/nav_icon/fillservice.svg";
import accountIcon from "../../assets/nav_icon/account.svg";
import accountIconFill from "@/assets/nav_icon/fillaccount.svg";
import "./bottomNav.css";

export default function BottomNav({ id ,groups = [] }) {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState("");
  const [showServices, setShowServices] = useState(false);

const getUnreadCount = (group) => group.unreadCount || 0;
const totalUnread = groups.reduce((sum, group) => sum + getUnreadCount(group), 0);
const [loadingGroups, setLoadingGroups] = useState(true);

useEffect(() => {
  if (!userId) return;
  setLoadingGroups(true);
  fetch(`/api/chat/groups?userId=${userId}`)
    .then(res => res.json())
    .then(data => setGroups(data))
    .finally(() => setLoadingGroups(false));
}, [userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userID");
      if (storedId) setUserId(storedId);
    }
  }, []);

  useEffect(() => {
    if (showServices) {
      setShowServices(false);
    }
  }, [currentPath]);

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  return (
    <>
      {/* Restricted Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleClosePopup}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "32px 40px 28px 40px",
              minWidth: "260px",
              textAlign: "center",
              fontFamily: "inherit",
              fontSize: "1.08rem",
              animation: "fadeIn 0.2s",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.18rem",
                marginBottom: 10,
                color: "#97538c",
              }}
            >
              Access Restricted
            </div>
            <div style={{ marginBottom: 20 }}>
              Currently unable to access this section.
            </div>
            <button
              onClick={handleClosePopup}
              style={{
                background: "#97538c",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 28px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
                marginTop: 8,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Services iframe overlay */}
      {showServices && (
  <div className="iframe-overlay">
    <iframe
      src="/"
      style={{
        border: "none",
        width: "100%",
        height: "100vh",
      }}
    />
  </div>
)}

  <div className="bottom-nav">
  <Link href={`/wonderland?id=${id || ""}`}>
    <div
      className={`nav-item ${
        !showServices && currentPath.includes("wonderland") ? "active" : ""
      }`}
    >
      <Image
        src={
          !showServices && currentPath.includes("wonderland")
            ? eventsIconFill
            : eventIcon
        }
        alt="Events"
        className="nav-icon"
      />
      <span className="nav-text">Events</span>
    </div>
  </Link>

<Link href={`/chat?id=${id || ""}`}>
  <div
    className={`nav-item ${!showServices && currentPath.includes("chat") ? "active" : ""}`}
    onClick={() => setShowServices(false)} // close overlay immediately
    style={{ position: "relative" }} // needed for absolute badge
  >
    <Image
      src={!showServices && currentPath.includes("chat") ? messageIconFill : messageIcon}
      alt="Chats"
      className="nav-icon"
    />
    <span className="nav-text">Chats</span>

    {/* ✅ Badge */}
    {totalUnread > 0 && (
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
        {totalUnread}
      </span>
    )}
  </div>
</Link>




  {/* Services iframe trigger */}
  <div
    className={`nav-item ${showServices ? "active" : ""}`}
    onClick={() => setShowServices(true)}
  >
    <Image
      src={showServices ? serviceIconFill : servicesIcon}
      alt="Services"
      className="nav-icon"
    />
    <span className="nav-text">Services</span>
  </div>

  <Link href={`/accounts?userid=${id}`}>
    <div
      className={`nav-item ${
        !showServices && currentPath.includes("accounts") ? "active" : ""
      }`}
    >
      <Image
        src={
          !showServices && currentPath.includes("accounts")
            ? accountIconFill
            : accountIcon
        }
        alt="Account"
        className="nav-icon"
      />
      <span className="nav-text">Account</span>
    </div>
  </Link>
</div>

    </>
  );
}
