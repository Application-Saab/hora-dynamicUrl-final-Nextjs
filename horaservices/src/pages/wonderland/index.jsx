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
import socket from "../../socket";

const WonderlandMainPage = () => {
  const router = useRouter();
  const { id: queryId } = router.query;
  const slug = Array.isArray(queryId) ? queryId : queryId?.split("/") || [];
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || ""
  );
  const [showHostLoginModal, setShowHostLoginModal] = useState(false);

  useLayoutEffect(() => {
    let timer;

    if (isUserLoggedIn && loggedinUserId && slug?.length === 0) {
      timer = setTimeout(() => {
        router.push(`/wonderland?id=${loggedinUserId}`);
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [queryId, loggedinUserId, isUserLoggedIn, slug]);

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

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("message:new", (msg) => {
      console.log("📩 New message:", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("message:new");
    };
  }, []);

  // const sendMessage = () => {
  //   // socket.emit("message:send", {
  //   //   eventId: "6884a4ff6210988005d87ba5",
  //   //   message: "Frontend se hello for testing",
  //   //   tempId: Date.now().toString()
  //   // });

  //   socket.emit("message:send", {
  //     roomId: "6884a4ff6210988005d87ba5",
  //     message: "New Socket System Message",
  //     type: "text",
  //     tempId: Date.now().toString(),
  //   });
  // };

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

        {/* <button onClick={sendMessage}>Send</button> */}

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

      {showHostLoginModal && (
        <OtpLogin
          setIsModalOpen={() => {
            setShowHostLoginModal(false);
            router.replace(`/wonderland/invite`);
          }}
        />
      )}
    </>
  );
};

export default WonderlandMainPage;
