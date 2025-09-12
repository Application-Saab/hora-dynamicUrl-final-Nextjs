import React from "react";
// components/BottomNav.jsx
import Image from "next/image";
import Link from "next/link";
import eventIcon from "../../assets/nav_icon/events.png";
import messageIcon from "../../assets/nav_icon/message.png";
import servicesIcon from "../../assets/nav_icon/services.png";
import accountIcon from "../../assets/nav_icon/account.png";
import "./bottomNav.css";

export default function BottomNav({ id }) {
  const [showPopup, setShowPopup] = React.useState(false);
  const handleAccountClick = () => {
    setShowPopup(true);
  };
  const handleClosePopup = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };
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
      <div className="bottom-nav">
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
      </div>
    </>
  );
}
