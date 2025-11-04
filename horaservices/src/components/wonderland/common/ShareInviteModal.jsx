import React, { useState } from "react";
import Image from "next/image";
import BackArrow from "@/assets/BackArrowSvg.svg";
import DefaultTemplate from "@/assets/NewDefaultTemplate.png";
import LockIcon from "@/assets/wonderland/ShareInviteLockIcon.svg";
import RightTick from "@/assets/wonderland/ShareInviteRightTick.svg";
import CameraIcon from "@/assets/wonderland/ShareInviteCameraIcon.svg";
import CopyLinkIcon from "@/assets/wonderland/CopyLinkIcon.svg";
import WhatsappIcon from "@/assets/wonderland/ShareInviteWhatsapp.svg";
import MessageIcon from "@/assets/wonderland/ShareInviteMessage.svg";
import GmailIcon from "@/assets/wonderland/ShareInviteGmail.svg";
import InstagramIcon from "@/assets/wonderland/ShareInviteInstagram.svg";
import SnapchatIcon from "@/assets/wonderland/ShareInviteSnapchat.svg";
import MessangerIcon from "@/assets/wonderland/ShareInviteMessanger.svg";
import LinkedinIcon from "@/assets/wonderland/ShareInviteLinkedin.svg";
import "./ShareInviteModal.css";

import { formateDateInDMDFormat } from "@/utils/dateFormatters";
import CustomModal from "./CustomModal";

const ShareInviteModal = ({ isOpen, onClose, eventData }) => {
  const [copyStatus, setCopyStatus] = useState(false);
  if (!isOpen) return null;

  // Direct share platforms
  const directSharePlatforms = {
    whatsapp: {
      name: "WhatsApp",
      url: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
      icon: WhatsappIcon,
    },
    message: {
      name: "Message",
      url: (text) => `sms:?&body=${encodeURIComponent(text)}`,
      icon: MessageIcon,
    },
    gmail: {
      name: "Gmail",
      url: (text) =>
        `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
          "You're Invited! 🎉"
        )}&body=${encodeURIComponent(text)}`,
      icon: GmailIcon,
    },
  };

  // Copy share platforms
  const copySharePlatforms = {
    instagram: {
      name: "Instagram",
      url: "https://www.instagram.com/",
      icon: InstagramIcon,
      deepLink: "instagram://app",
    },
    snapchat: {
      name: "Snapchat",
      url: "https://www.snapchat.com/add/",
      icon: SnapchatIcon,
      deepLink: "snapchat://add/",
    },
    messenger: {
      name: "Messenger",
      url: "https://www.messenger.com/",
      icon: MessangerIcon,
      deepLink: "fb-messenger://",
    },
    linkedin: {
      name: "LinkedIn",
      url: "https://www.linkedin.com/",
      icon: LinkedinIcon,
      deepLink: "linkedin://",
    },
  };

  // Format share text
  const createShareText = (orderDetails) => {
    if (!orderDetails) return "";

    const inviteURL = `https://horaservices.com/wonderland?eventid=${
      orderDetails?._id
    }&hostName=${orderDetails?.hostName?.replace(/ /g, "%20")}`;

    return `You're invited to ${orderDetails?.hostName || "someone"}'s ${
      orderDetails["Event Type"] || "Birthday"
    }! 🎉
📅 ${
      orderDetails.eventDate
        ? formateDateInDMDFormat(orderDetails?.eventDate)
        : "Not Available"
    }
⏰ ${orderDetails?.eventTime || "Not Available"}
📍 ${orderDetails?.location || "Venue"}
👉 Tap to view the invite:\n${inviteURL}`;
  };

  // Copy text utility
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      return true;
    } catch (err) {
      console.error("Copy failed:", err);
      return false;
    }
  };

  // Direct share handler
  const handleShare = (platformKey, orderDetails) => {
    const platform = directSharePlatforms[platformKey];
    if (!platform || !orderDetails) return;

    const text = createShareText(orderDetails);
    const link = platform.url(text);
    window.open(link, "_blank");
  };

  const handleCopyAndOpen = async (platformKey, orderDetails) => {
    const platform = copySharePlatforms[platformKey];
    if (!platform || !orderDetails) return;

    const text = createShareText(orderDetails);

    // Copy invite text
    copyToClipboard(text);

    // Open platform directly in new tab
    const newTab = window.open(platform.url, "_blank");

    // Try deep link only if mobile device
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile && platform.deepLink) {
      setTimeout(() => {
        window.location.href = platform.deepLink;
      }, 500);
    }
  };

  // Copy button handler
  const handleCopyInvite = async (orderDetails) => {
    const text = createShareText(orderDetails);
    const success = await copyToClipboard(text);
    if (success) {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 3000);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Share Invitation"
      body={
        <>
          {/* Template preview */}
          <div className="d-flex justify-content-center w-100">
            <div
              className="default-template-wrapper mt-0"
              style={{ width: "90%" }}
            >
              <img
                src={DefaultTemplate.src}
                alt="Default Invitation Template"
                className="default-invite-image"
              />
              <div className="default-template-text w-100">
                <p>{eventData?.hostName}</p>
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className="d-flex justify-content-between w-100 mt-3 gap-2">
            <InfoBox
              icon={LockIcon}
              title="Private & Secure"
              subtitle="Only guests can access the event"
            />
            <InfoBox
              icon={RightTick}
              title="Confirm Presence"
              subtitle="Easy RSVP & Guest list"
            />
            <InfoBox
              icon={CameraIcon}
              title="Share Memories"
              subtitle="Upload photos & videos"
            />
          </div>

          {/* Direct share */}
          <div className="share-with-ctn mt-4">
            <p className="text-center">Share Invite With</p>
            <div className="d-flex justify-content-between w-100 mt-1">
              {Object.entries(directSharePlatforms).map(([key, platform]) => (
                <div
                  key={key}
                  onClick={() => handleShare(key, eventData)}
                  className="m-2"
                  style={{ cursor: "pointer" }}
                >
                  <Image src={platform.icon} alt={`${platform.name} Icon`} />
                </div>
              ))}
            </div>

            <div className="seprator-line-share d-flex justify-content-center mt-4">
              <span className="seprator-txt">OR</span>
            </div>
          </div>

          {/* Copy button */}
          <div className="d-flex justify-content-center w-100 mt-4">
            <button
              className="copy-link-btn"
              onClick={() => handleCopyInvite(eventData)}
              disabled={copyStatus}
            >
              <Image src={CopyLinkIcon} alt="copy" className="me-2" />
              {copyStatus ? "Invite Copied!" : "Copy Invite & Share"}
            </button>
          </div>

          {/* Copy + open apps */}
          <div className="copy-share-ctn d-flex justify-content-around w-100 mt-3 mb-3">
            {Object.entries(copySharePlatforms).map(([key, platform]) => (
              <div
                key={key}
                onClick={() => handleCopyAndOpen(key, eventData)}
                className="m-2"
                style={{ cursor: "pointer" }}
              >
                <Image src={platform.icon} alt={`${platform.name} Icon`} />
              </div>
            ))}
          </div>
        </>
      }
    />
  );
};

// Small info card component
const InfoBox = ({ icon, title, subtitle }) => (
  <div className="col d-flex flex-column align-items-center Share-icon-wrapper">
    <div className="d-flex justify-content-center align-items-center share-icon-circle">
      <Image src={icon} alt={title} />
    </div>
    <span className="share-icons-heading mt-1">{title}</span>
    <span className="share-icons-subheading mt-1">{subtitle}</span>
  </div>
);

export default ShareInviteModal;
