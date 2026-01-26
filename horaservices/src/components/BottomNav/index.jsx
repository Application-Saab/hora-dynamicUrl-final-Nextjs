"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import eventIcon from "../../assets/nav_icon/events.svg";
import eventsIconFill from "@/assets/nav_icon/fillevents.svg";
import CheerChatIcon from "@/assets/wonderland/NavCheerChatIcon.svg";
import CheerChatIconFilled from "@/assets/wonderland/NavCheerChatIconFilled.svg";
import ExploreIcon from "@/assets/wonderland/NavExploreIcon.svg";
import ExploreIconFilled from "@/assets/wonderland/NavExploreIconFilled.svg";
import ChatModalImage from "@/assets/wonderland/ChatInstructionPopupImage.png";
import accountIcon from "../../assets/nav_icon/account.svg";
import accountIconFill from "@/assets/nav_icon/fillaccount.svg";
import { useChatStore } from "@/hooks/ChatContext";
import CustomModal from "../wonderland/common/CustomModal";
import "./bottomNav.css";
import LoginModal from "../wonderland/common/login/LoginModal";
import CustomButton from "../wonderland/common/CustomButton";

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const { totalUnread, chatRooms, roomsFetchLoading, roomsDataFetched } =
    useChatStore();
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [noChatsPopup, setNoChatsPopup] = useState(false);

  const loadUserId = useCallback(() => {
    const id = localStorage.getItem("userID") || "";
    setUserId(id);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    loadUserId();
    router.events.on("routeChangeComplete", loadUserId);
    window.addEventListener("loginStateChange", loadUserId);

    return () => {
      router.events.off("routeChangeComplete", loadUserId);
      window.removeEventListener("loginStateChange", loadUserId);
    };
  }, [router.events, loadUserId]);

  const { isEvents, isChat, isServices, isAccount } = useMemo(() => {
    return {
      isEvents: currentPath.includes("wonderland"),
      isChat: currentPath.includes("chat"),
      isServices: currentPath.includes("services"),
      isAccount: currentPath.includes("accounts"),
    };
  }, [currentPath]);

  useEffect(() => {
    if (!router.isReady || !authChecked) return;

    setShowPopup(false);
    setNoChatsPopup(false);

    if (isChat && !userId) {
      setShowPopup(true);
    }

    if (!roomsDataFetched || roomsFetchLoading) return;

    if (isChat && userId && chatRooms.length === 0) {
      setNoChatsPopup(true);
      setShowPopup(true);
      return;
    }
  }, [
    router.isReady,
    authChecked,
    isChat,
    userId,
    chatRooms.length,
    roomsDataFetched,
    roomsFetchLoading,
  ]);

  const NavItem = ({
    href,
    isActive,
    icon,
    iconFilled,
    label,
    className,
    badgeCount,
  }) => (
    <Link href={href}>
      <div
        className={`nav-item ${isActive ? "active" : ""} ${className || ""}`}
      >
        <div className="nav-icon-wrapper">
          <Image
            src={isActive ? iconFilled : icon}
            alt={label}
            className="nav-icon"
          />
          {badgeCount > 0 && (
            <span className="unread-badge">
              {badgeCount > 99 ? "99+" : badgeCount}
            </span>
          )}
        </div>
        <span className="nav-text">{label}</span>
      </div>
    </Link>
  );

  return (
    <>
      <CustomModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        showHeader={false}
        disableBackdropClick
        disableBgScroll
        modalClass="chat-instruction-popup"
        backdropClass="chat-instruction-backdrop"
        body={
          <div>
            <div className="chat-instruction-popup-image-ctn">
              <Image src={ChatModalImage} alt="Chat Instruction" />
            </div>

            <p className="chat-instruction-popup-heading text-center">
              Welcome To Cheerchat
            </p>
            {!noChatsPopup && (
              <p className="chat-instruction-popup-subheading text-center">
                Plan, laugh, and keep the <br /> buzz going.
              </p>
            )}
            {noChatsPopup && (
              <p className="chat-instruction-popup-subheading text-center">
                You have no chats yet. Pls join any invite or create an invite
                to start chatting.
              </p>
            )}

            <div className="d-flex justify-content-center">
              {!noChatsPopup && (
                <CustomButton
                  title={"Login"}
                  onClick={() => {
                    setShowPopup(false);
                    setShowLoginModal(true);
                  }}
                  buttonClass={"chat-instruction-popup-btn"}
                />
              )}
              {noChatsPopup && (
                <CustomButton
                  title={"Go to Invites"}
                  onClick={() => {
                    setShowPopup(false);
                    router.push("/wonderland");
                  }}
                  buttonClass={"chat-instruction-popup-btn"}
                />
              )}
            </div>
          </div>
        }
      />

      <div className="bottom-nav">
        <NavItem
          href="/wonderland"
          isActive={isEvents}
          icon={eventIcon}
          iconFilled={eventsIconFill}
          label="Invites"
        />

        <NavItem
          href="/chat"
          isActive={isChat}
          icon={CheerChatIcon}
          iconFilled={CheerChatIconFilled}
          label="CheerChat"
          className="chatter-icon"
          badgeCount={totalUnread}
        />

        <NavItem
          href="/services"
          isActive={isServices}
          icon={ExploreIcon}
          iconFilled={ExploreIconFilled}
          label="Explore"
          className="Explore-icon"
        />

        <NavItem
          href="/accounts"
          isActive={isAccount}
          icon={accountIcon}
          iconFilled={accountIconFill}
          label="Account"
        />
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
