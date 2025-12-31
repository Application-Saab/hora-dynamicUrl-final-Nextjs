"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// Icons
import eventIcon from "../../assets/nav_icon/events.svg";
import eventsIconFill from "@/assets/nav_icon/fillevents.svg";
import CheerChatIcon from "@/assets/wonderland/NavCheerChatIcon.svg";
import CheerChatIconFilled from "@/assets/wonderland/NavCheerChatIconFilled.svg";
import ExploreIcon from "@/assets/wonderland/NavExploreIcon.svg";
import ExploreIconFilled from "@/assets/wonderland/NavExploreIconFilled.svg";
import accountIcon from "../../assets/nav_icon/account.svg";
import accountIconFill from "@/assets/nav_icon/fillaccount.svg";
import { useChatStore } from "@/hooks/ChatContext";
import "./bottomNav.css";

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const { totalUnread } = useChatStore();
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState("");

  // Fetch & update userId in one place
  useEffect(() => {
    const loadUserId = () => {
      if (typeof window !== "undefined") {
        setUserId(localStorage.getItem("userID") || "");
      }
    };

    loadUserId();

    router.events.on("routeChangeComplete", loadUserId);
    window.addEventListener("loginSuccess", loadUserId);

    return () => {
      router.events.off("routeChangeComplete", loadUserId);
      window.removeEventListener("loginSuccess", loadUserId);
    };
  }, [router]);

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  // Reusable Nav Item Component
  const NavItem  = ({ href, isActive, icon, iconFilled, label, className = "" }) => (
  <Link href={href}>
    <div className={`nav-item ${isActive ? "active" : ""} ${className}`}>

        <Image
          src={isActive ? iconFilled : icon}
          alt={label}
          className="nav-icon"
        />
        <span className="nav-text">{label}</span>
      </div>
    </Link>
  );

  // Active route checks
  const isEvents = currentPath.includes("wonderland");
  const isChat = currentPath.includes("chat");
  const isServices = currentPath.includes("services");
  const isAccount = currentPath.includes("accounts");

  return (
    <>
      {/* Access Restricted Popup */}
      {showPopup && (
        <div
          className="restricted-overlay"
          onClick={handleClosePopup}
        >
          <div className="restricted-popup" onClick={(e) => e.stopPropagation()}>
            <div className="restricted-title">Access Restricted</div>
            <div className="restricted-message">
              Currently unable to access this section.
            </div>
            <button className="restricted-close-btn" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <NavItem
          href={`/wonderland?id=${userId}`}
          isActive={isEvents}
          icon={eventIcon}
          iconFilled={eventsIconFill}
          label="Invites"
        />

        <NavItem
          href={`/chat?id=${userId}`}
          isActive={isChat}
          icon={CheerChatIcon}
          iconFilled={CheerChatIconFilled}
          label="CheerChat"
          className="chatter-icon" 
        />

        <NavItem
          href={`/services?userid=${userId}`}
          isActive={isServices}
          icon={ExploreIcon}
          iconFilled={ExploreIconFilled}
          label="Explore"
            className="Explore-icon" 
        />

        <NavItem
          href={`/accounts?userid=${userId}`}
          isActive={isAccount}
          icon={accountIcon}
          iconFilled={accountIconFill}
          label="Account"
        />
      </div>
    </>
  );
}
