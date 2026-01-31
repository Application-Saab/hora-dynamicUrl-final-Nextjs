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
import inviteVideo from '@/assets/inviteVideo.mp4';
import createInviteImg from '@/assets/create-invite.png';
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
    if (!isUserLoggedIn) {
      setShowHostLoginModal(true);
      return;
    } else {
      router.replace(`/wonderland/invite`);
    }
  };

  // Listen local storage changes for login state
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
         <div className="polaroid tilt-right video-card">
  <video
    className="video-thumb"
    src={inviteVideo}
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
  />
</div>

<div
  className="create-invite-img-wrapper"
  onClick={createInviteClick}
>
  <Image
    src={createInviteImg}
    alt="Create Invite"
    className="create-invite-img"
  />
</div>
        {isUserLoggedIn && loggedinUserId && (
          <InvitesListing userId={loggedinUserId} />
        )}

        <div className="invite-banner">
          <Image
            src={howitworks}
            alt="Invite Banner"
            className="banner-image"
          />
        </div>
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
            margin: "10px",
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
