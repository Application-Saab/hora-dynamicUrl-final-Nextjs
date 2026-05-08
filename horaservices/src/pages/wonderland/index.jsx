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

const WonderlandMainPage = () => {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || ""
  );
  const [showHostLoginModal, setShowHostLoginModal] = useState(false);

  useLayoutEffect(() => {
    let timer;

    if (isUserLoggedIn && loggedinUserId 
    ) {
      timer = setTimeout(() => {
        router.push(`/wonderland`);
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [loggedinUserId, isUserLoggedIn]);

const createInviteClick = () => {
  const userId = localStorage.getItem("userID") || "";
  const mobileNumber = localStorage.getItem("mobileNumber") || "";
  const isLoggedIn = localStorage.getItem("isLoggedIn") || "false";

  let userName = "";

  try {
    const token = localStorage.getItem("token");

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

    timestamp: new Date().toISOString()
  });

  if (!isUserLoggedIn) {
    setShowHostLoginModal(true);
    return;
  }

  router.replace("/wonderland/invite");
};
  useEffect(() => {
    const syncLoginState = () => {
      setIsUserLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  return (
    <>
      <div className="logedin-container">
        <div className="invite-banner">
          <Image
            src={wonderlandBanner}
            alt="Invite Banner"
            className="banner-image-top"
          />

          <button
            type="button"
            className="create-invite-btn-landing"
            onClick={createInviteClick}
          >
            <span>CREATE INVITE</span>
          </button>
        </div>
        {isUserLoggedIn && loggedinUserId && (
          <InvitesListing userId={loggedinUserId} />
        )}
      
<InviteSlider onCreateInvite={createInviteClick} />
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
          router.replace('/wonderland/invite')
        }}
      />
    </>
  );
};

export default WonderlandMainPage;
