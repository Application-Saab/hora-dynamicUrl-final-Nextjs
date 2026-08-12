import React from "react";
import Image from "next/image";
import "./cheerchatbanner.css";
import phoneImg from "@/assets/wonderland/cherrchatbanner1.webp";
import arrowIcon from "@/assets/arrowicon.svg";
const CheerChatBanner = ({onCreateInvite}) => {
  return (
    <div className="cc-wrapper">

      {/* LEFT CONTENT */}
      <div className="cc-content">
        <h2 className="cc-title">CheerChat</h2>

        <p className="cc-subtitle">
          Exclusive chat space for your event
        </p>

        <p className="cc-desc">
          Auto-create chat groups for confirmed guests. Share updates and
          reminders in real time to keep your event social!
        </p>

        <button className="cc-btn" onClick={onCreateInvite}>
          Create Invite 
           <Image
    src={arrowIcon}
    alt="arrow"
    width={16}
    height={16}
    className="arrow-img"
  />
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="cc-image-box">
        <Image
          src={phoneImg}
          alt="chat preview"
          className="cc-image"
        />
      </div>

    </div>
  );
};

export default CheerChatBanner;