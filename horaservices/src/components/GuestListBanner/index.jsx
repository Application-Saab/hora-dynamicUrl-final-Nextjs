import React from "react";
import Image from "next/image";
import "./guestlistbanner.css";
import guestImg from "@/assets/wonderland/guestlistbanner.webp";
import arrowIcon from "@/assets/arrowicon.svg";
const GuestListBanner = ({onCreateInvite}) => {
  return (
    <div className="gl-wrapper">

      {/* LEFT IMAGE */}
      <div className="gl-image-box">
        <Image
          src={guestImg}
          alt="guest list"
          className="gl-image"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="gl-content">
        <h2 className="gl-title">Guest List</h2>

        <p className="gl-subtitle">
          See who’s coming to your celebration
        </p>

        <p className="gl-desc">
          Manage your guests, track RSVPs, and stay organized all in one place.
        </p>

        <button className="gl-btn" onClick={onCreateInvite}>
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

    </div>
  );
};

export default GuestListBanner;