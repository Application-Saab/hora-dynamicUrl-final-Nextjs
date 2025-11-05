
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

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(localStorage.getItem("totalUnread") || 0);
  const [loadingGroups, setLoadingGroups] = useState(true);
useEffect(() => {
  const handleRouteChange = (url) => {
    // Route change ke baad latest data fetch karo
    const storedUserId = localStorage.getItem("userID") || "";
    const unread = localStorage.getItem("totalUnread") || 0;

    setUserId(storedUserId);
    setTotalUnreadCount(unread);
    setShowServices(false);  // Overlay hata do agar open hai
    // Add any other state reset here
  };

  router.events.on("routeChangeComplete", handleRouteChange);

  return () => {
    router.events.off("routeChangeComplete", handleRouteChange);
  };
}, [router]);
useEffect(() => {
  const syncUnread = () => {
    const count = parseInt(localStorage.getItem("totalUnread") || "0");
    setTotalUnreadCount(count);
  };

  // Initial sync
  syncUnread();

  // Listen to same-tab event
  window.addEventListener("unreadCountChange", syncUnread);

  // Listen to cross-tab storage change
  const storageListener = (e) => {
    if (e.key === "totalUnread") syncUnread();
  };
  window.addEventListener("storage", storageListener);

  return () => {
    window.removeEventListener("unreadCountChange", syncUnread);
    window.removeEventListener("storage", storageListener);
  };
}, []);

  useEffect(() => {
    const loadUserId = () => {
      const storedId = localStorage.getItem("userID");
      setUserId(storedId || "");
    };

    loadUserId();

    // Listen for OTP login success
    window.addEventListener("loginSuccess", loadUserId);

    return () => {
      window.removeEventListener("loginSuccess", loadUserId);
    };
  }, []);

  // 🔹 Update u
  useEffect(() => {
    if (!userId) return;
    setLoadingGroups(true);
    fetch(`/api/chat/groups?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setGroups(data))
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

  // 🔹 LocalStorage changes listen karo
  useEffect(() => {
    const syncLoginState = () => {
      setTotalUnreadCount(localStorage.getItem("totalUnread"));
    };

    window.addEventListener("storage", syncLoginState);

    // Same tab ke liye bhi run karo jab login success ke baad tum manually set karte ho
    window.addEventListener("unreadCountChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("unreadCountChange", syncLoginState);
    };
  }, []);

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

{/*     
     {showServices && (
  <div className="iframe-wrapper">
    <div className="iframe-overlay">
      <iframe
        src="/"
        style={{
          border: "none",
          width: "100%",
          height: "calc(100vh - 58px)",
          marginBottom: "58px",
        }}
      />
    </div>
  </div>
)} */}


      <div className="bottom-nav">
        <Link href={`/wonderland?id=${userId || ""}`}  onClick={() => setShowServices(false)} >
          <div
            className={`nav-item ${
              !showServices && currentPath.includes("wonderland")
                ? "active"
                : ""
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
            <span className="nav-text">Invites</span>
          </div>
        </Link>

        {/* <Link href={`/chat?id=${userId || ""}`}>
          <div
            className={`nav-item ${
              !showServices && currentPath.includes("chat") ? "active" : ""
            }`}
            // onClick={() => setShowServices(false)} 
              onClick={(e) => {
      e.preventDefault(); // 🛑 Prevent default navigation
      window.location.href = `/chat?id=${userId || ""}`; // 🔁 Force full reload
    }}
            style={{ position: "relative" }} 
          >
            <Image
              src={
                !showServices && currentPath.includes("chat")
                  ? messageIconFill
                  : messageIcon
              }
              alt="Chats"
              className="nav-icon"
            />
            <span className="nav-text">Chats</span>

          
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
        </Link> */}

        {/* Services iframe trigger */}
        {/* <div
          className={`nav-item ${showServices ? "active" : ""}`}
          onClick={() => setShowServices(true)}
        >
          <Image
            src={showServices ? serviceIconFill : servicesIcon}
            alt="Services"
            className="nav-icon"
          />
          <span className="nav-text">Services</span>
        </div> */}
<Link href={`/services?userid=${userId}`}>
  <div
    className={`nav-item ${
      currentPath.includes("services") ? "active" : ""
    }`}
    onClick={() => setShowServices(true)}
  >
    <Image
      src={currentPath.includes("services") ? serviceIconFill : servicesIcon}
      alt="Services"
      className="nav-icon"
    />
    <span className="nav-text">Services</span>
  </div>
</Link>

        <Link href={`/accounts?userid=${userId}`}>
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