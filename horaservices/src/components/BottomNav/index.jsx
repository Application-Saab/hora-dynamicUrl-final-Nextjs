import React from "react";
// components/BottomNav.jsx
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import eventIcon from "../../assets/nav_icon/events.svg";
import eventsIconFill from "@/assets/nav_icon/fillevents.svg"
import messageIcon from "../../assets/nav_icon/message.svg";
import messageIconFill from "../../assets/nav_icon/fillmessage.svg"
import servicesIcon from "../../assets/nav_icon/services.svg";
import serviceIconFill from "@/assets/nav_icon/fillservice.svg"
import accountIcon from "../../assets/nav_icon/account.svg";
import accountIconFill from "@/assets/nav_icon/fillaccount.svg"
import { useEffect,useState } from "react";
import "./bottomNav.css";

export default function BottomNav({ id }) {
    const router = useRouter();
    const currentPath = router.pathname;
  const [showPopup, setShowPopup] = React.useState(false);
  const handleAccountClick = () => {
    setShowPopup(true);
  };
  const handleClosePopup = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };
  
  const [userId, setUserId] = useState("");

  // Fetch userId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userID");
      if (storedId) {
        setUserId(storedId);
      }
    }
  }, []);
  return (
    <>
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
              // color: "#333",
              borderRadius: "18px",
              // boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
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
                // boxShadow: "0 2px 8px rgba(108,99,255,0.12)",
                marginTop: 8,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* <div className="bottom-nav">
        <Link href={`/wonderland?id=${id || ""}`}>
          <div className="nav-item">
            <Image src={eventIcon} alt="Events Icon" className="nav-icon" />
            <span className="nav-text">Events</span>
          </div>
        </Link>

        <Link href={`/chat?id=${id || ""}`}>
          <div className="nav-item">
            <Image src={messageIcon} alt="Message Icon" className="nav-icon" />
            <span className="nav-text">Chats</span>
          </div>
        </Link>

        <Link href="/">
          <div className="nav-item">
            <Image
              src={servicesIcon}
              alt="Services Icon"
              className="nav-icon"
            />
            <span className="nav-text">Services</span>
          </div>
        </Link>

        <Link href={`/accounts?userid=${id}`}>
          <div
            className="nav-item"
            // onClick={handleAccountClick}
            style={{ cursor: "pointer" }}
          >
            <Image src={accountIcon} alt="Account Icon" className="nav-icon" />
            <span className="nav-text">Accounts</span>
          </div>
        </Link>
      </div> */}
        <div className="bottom-nav">
      {/* <Link href={`/wonderland?id=${id || ""}`}>
        <div className={`nav-item ${currentPath.includes('wonderland') ? 'active' : ''}`}>
          <Image src={eventIcon} alt="Events Icon" className="nav-icon" />
          <span className="nav-text">Events</span>
        </div>
      </Link> */}
   <Link href={`/wonderland?id=${id || ""}`}>
  <div className={`nav-item ${currentPath.includes("wonderland") ? "active" : ""}`}>
    <Image
      src={currentPath.includes("wonderland") ? eventsIconFill : eventIcon}
      alt="Message Icon"
      className="nav-icon"
    />
    <span className="nav-text">Events</span>
  </div>
</Link>

      <Link href={`/chat?id=${id || ""}`}>
  <div className={`nav-item ${currentPath.includes("chat") ? "active" : ""}`}>
    <Image
      src={currentPath.includes("chat") ? messageIconFill : messageIcon}
      alt="Message Icon"
      className="nav-icon"
    />
    <span className="nav-text">Chats</span>
  </div>
</Link>

    <Link href="/">
 <div className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>    <Image
      src={currentPath.includes("Services") ? serviceIconFill : servicesIcon}
      alt="Message Icon"
      className="nav-icon"
    />
    <span className="nav-text">Services</span>
  </div>
</Link>
   
 <Link href={`/accounts?userid=${id}`}>
  <div className={`nav-item ${currentPath.includes('accounts') ? 'active' : ''}`}>   <Image
      src={currentPath.includes("accounts") ? accountIconFill : accountIcon}
      alt="Message Icon"
      className="nav-icon"
    />
    <span className="nav-text">Account</span>
  </div>
</Link>
    </div>
    </>
  );
}
