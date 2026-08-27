import OtpLogin from "@/components/OtpLoginPopup";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import wonderlandBanner from "@/assets/wonderlandBanner1.webp";
import howitworks from "@/assets/howitworks2.jpg";
import hostandGuest from "@/assets/hostandGuest.webp";
import yourcelebration from "@/assets/yourcelebration.png";
import "@/components/wonderland/wonderland.css";
import InvitesListing from "@/components/wonderland/InvitesListing";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import CelebrationSection from "@/components/wonderland/wonderlandBanner1";
import HowItWorks from "@/components/HowItWorks";
import CheerChatBanner from "@/components/CheerChatBanner";
import GuestListBanner from "@/components/GuestListBanner";
import InviteSlider from "@/components/InviteSlider";
import { safeGetItem } from "@/utils/safeStorage";

const WonderlandMainPage = () => {
  const router = useRouter();

  // SSR-safe defaults – never read localStorage during render
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [showHostLoginModal, setShowHostLoginModal] = useState(false);

  // ---- Client-only: read login state + sync across tabs ----
  useEffect(() => {
    const syncLoginState = () => {
      const loggedIn = safeGetItem("isLoggedIn") === "true";
      const userId = safeGetItem("userID") || "";
      setIsUserLoggedIn(loggedIn);
      setLoggedinUserId(userId);
      setAuthChecked(true);
    };

    // Initial read
    syncLoginState();

    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  // ---- Client-only: auto-redirect logged-in users ----
  useLayoutEffect(() => {
    if (!authChecked) return;

    let timer;
    if (isUserLoggedIn && loggedinUserId) {
      timer = setTimeout(() => {
        router.push(`/wonderland`);
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [authChecked, isUserLoggedIn, loggedinUserId, router]);

  const createInviteClick = () => {
    // All of this is client-only
    const userId = safeGetItem("userID") || "";
    const mobileNumber = safeGetItem("mobileNumber") || "";
    const isLoggedIn = safeGetItem("isLoggedIn") || "false";

    let userName = "";
    try {
      const token = safeGetItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userName = payload?.name || "";
      }
    } catch (error) {
      console.log(error);
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "create_invite_click",
      page: "wonderland_main_page",
      button_name: "CREATE INVITE",
      user_id: userId,
      mobile_number: mobileNumber,
      user_name: userName,
      is_logged_in: isLoggedIn,
      timestamp: new Date().toISOString(),
    });

    if (!isUserLoggedIn) {
      setShowHostLoginModal(true);
      return;
    }

    router.replace("/wonderland/invite");
  };

  return (
    <>
      <div className="logedin-container">
        <div className="invite-banner">
          <Image
            src={wonderlandBanner}
            alt="Invite Banner"
            className="banner-image-top"
            priority
          />

          <button
            type="button"
            className="create-invite-btn-landing"
            onClick={createInviteClick}
          >
            <span>CREATE INVITE</span>
          </button>
        </div>

        {/* Only render after we know the user is logged in (client-side) */}
        {authChecked && isUserLoggedIn && loggedinUserId && (
          <InvitesListing userId={loggedinUserId} />
        )}

        <div style={{ maxWidth: "480px" }}>
          <InviteSlider onCreateInvite={createInviteClick} />
        </div>

        <GuestListBanner onCreateInvite={createInviteClick} />
        <HowItWorks />
        <CelebrationSection onCreateInvite={createInviteClick} />
        <CheerChatBanner onCreateInvite={createInviteClick} />

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontStyle: "normal",
            fontSize: "21px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            verticalAlign: "middle",
            margin: "10px 10px 0px",
          }}
        >
          Host & Guest Features
        </div>

        <div className="invite-banner">
          <Image
            src={hostandGuest}
            alt="Invite Banner"
            className="banner-image"
          />
        </div>

        <div className="invite">
          <Image
            src={yourcelebration}
            alt="Invite Banner"
            className="banner-image"
          />
        </div>
      </div>

      <LoginModal
        isOpen={showHostLoginModal}
        onClose={() => {
          setShowHostLoginModal(false);
          router.replace("/wonderland/invite");
        }}
      />
    </>
  );
};

// Force SSR on every request
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default WonderlandMainPage;