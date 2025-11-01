import React from "react";
import BackArrow from "@/assets/BackArrowSvg.svg";
import Image from "next/image";
import "./ShareInviteModal.css";
import DefaultTemplate from "@/assets/NewDefaultTemplate.png";
import LockIcon from "@/assets/wonderland/ShareInviteLockIcon.svg";
import RightTick from "@/assets/wonderland/ShareInviteRightTick.svg";
import CameraIcon from "@/assets/wonderland/ShareInviteCameraIcon.svg";
import CopyLinkIcon from "@/assets/wonderland/CopyLinkIcon.svg";
import { formateDateInDMDFormat } from "@/utils/dateFormatters";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { MdMessage } from "react-icons/md";

const ShareInviteModal = ({ isOpen, onClose, eventData }) => {
  if (!isOpen) return null;

  const sharePlatforms = {
    whatsapp: {
      name: "WhatsApp",
      url: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
      icon: <FaWhatsapp />,
    },
    instagram: {
      name: "Instagram",
      url: (text) => `instagram://direct?text=${encodeURIComponent(text)}`,
      icon: <FaInstagram />,
    },
    messenger: {
      name: "Messenger",
      url: (text) => `fb-messenger://share?link=${encodeURIComponent(text)}`,
      icon: <FaFacebookMessenger />,
    },
    gmail: {
      name: "Gmail",
      url: (text) =>
        `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
          "You're Invited! 🎉"
        )}&body=${encodeURIComponent(text)}`,
      icon: <SiGmail />,
    },
    message: {
      name: "Message",
      url: (text) => `sms:?&body=${encodeURIComponent(text)}`,
      icon: <MdMessage />,
    },
  };

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

  const handleShare = (platformKey, orderDetails) => {
    const platform = sharePlatforms[platformKey];
    if (!platform || !orderDetails) return;

    const text = createShareText(orderDetails);
    const link = platform.url(text);

    // Try to open in new tab
    window.open(link, "_blank");
  };

  const handleCopyLink = async (orderDetails) => {
    if (!orderDetails) return;

    const inviteURL = `https://horaservices.com/wonderland?id=${
      orderDetails._id
    }&hostName=${orderDetails?.hostName?.replace(/ /g, "%20")}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteURL);
      } else {
        // Fallback for unsupported browsers
        const textArea = document.createElement("textarea");
        textArea.value = inviteURL;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Failed to copy link. Please try manually.");
    }
  };

  return (
    <>
      <div className="custom-modal-backdrop">
        <div className="custom-modal-content">
          <div className="modal-header-custom">
            <Image
              src={BackArrow}
              height={25}
              width={15}
              onClick={() => {
                onClose();
              }}
            />
            <h2 className="modal-title-custom">Share Invitation</h2>
          </div>

          <div className="modal-body-custom" style={{ padding: "10px 15px" }}>
            <div className="d-flex justify-content-center w-100">
              <div
                className="default-template-wrapper"
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
            <div className="d-flex align-items-center justify-content-between w-100 mt-3">
              <div className="d-flex flex-column align-items-center Share-icon-wrapper">
                <div className="d-flex justify-content-center align-items-center share-icon-circle">
                  <Image src={LockIcon} alt="Lock" />
                </div>
                <span className="share-icons-heading mt-1">
                  Private & Secure:
                </span>
                <span className="share-icons-subheading mt-1">
                  Only guests can access the event
                </span>
              </div>
              <div className="d-flex flex-column align-items-center Share-icon-wrapper">
                <div className="d-flex justify-content-center align-items-center share-icon-circle">
                  <Image src={RightTick} alt="right" />
                </div>
                <span className="share-icons-heading mt-1">
                  Confirm Presence:
                </span>
                <span className="share-icons-subheading mt-1">
                  Easy RSVP & Guest list
                </span>
              </div>
              <div className="d-flex flex-column align-items-center Share-icon-wrapper">
                <div className="d-flex justify-content-center align-items-center share-icon-circle">
                  <Image src={CameraIcon} alt="camera" />
                </div>
                <span className="share-icons-heading mt-1">
                  Share Memories:
                </span>
                <span className="share-icons-subheading mt-1">
                  Upload phtos & videos
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-center w-100 mt-4">
              <button
                className="copy-link-btn"
                onClick={() => handleCopyLink(eventData)}
              >
                <Image src={CopyLinkIcon} alt="copy" className="me-2" />
                Copy Link
              </button>
            </div>
            <div className="d-flex gap-2 mt-5">
              {Object.entries(sharePlatforms).map(([key, platform]) => (
                <button
                  key={key}
                  className="share-btn btn btn-outline-primary"
                  onClick={() => handleShare(key, eventData)}
                >
                  {platform.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareInviteModal;









// import React from "react";
// import Image from "next/image";
// import BackArrow from "@/assets/BackArrowSvg.svg";
// import DefaultTemplate from "@/assets/NewDefaultTemplate.png";
// import LockIcon from "@/assets/wonderland/ShareInviteLockIcon.svg";
// import RightTick from "@/assets/wonderland/ShareInviteRightTick.svg";
// import CameraIcon from "@/assets/wonderland/ShareInviteCameraIcon.svg";
// import CopyLinkIcon from "@/assets/wonderland/CopyLinkIcon.svg";
// import { formateDateInDMDFormat } from "@/utils/dateFormatters";
// import "./ShareInviteModal.css";

// const ShareInviteModal = ({ isOpen, onClose, eventData }) => {
//   if (!isOpen) return null;

//   const createShareText = (orderDetails) => {
//     if (!orderDetails) return "";

//     const inviteURL = `https://horaservices.com/wonderland?eventid=${
//       orderDetails?._id
//     }&hostName=${orderDetails?.hostName?.replace(/ /g, "%20")}`;

//     return `You're invited to ${orderDetails?.hostName || "someone"}'s ${
//       orderDetails["Event Type"] || "Birthday"
//     }! 🎉
// 📅 ${
//       orderDetails.eventDate
//         ? formateDateInDMDFormat(orderDetails?.eventDate)
//         : "Not Available"
//     }
// ⏰ ${orderDetails?.eventTime || "Not Available"}
// 📍 ${orderDetails?.location || "Venue"}
// 👉 Tap to view the invite:\n${inviteURL}`;
//   };

//   const handleShare = async (orderDetails) => {
//     if (!orderDetails) return;
//     const text = createShareText(orderDetails);
//     const title = `Invitation from ${orderDetails?.hostName || "Host"}`;

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title,
//           text,
//           url: `https://horaservices.com/wonderland?eventid=${orderDetails?._id}`,
//         });
//       } catch (error) {
//         console.error("Share canceled or failed:", error);
//       }
//     } else {
//       alert("Your browser does not support the native share feature.");
//     }
//   };

//   const handleCopyLink = async (orderDetails) => {
//     if (!orderDetails) return;

//     const inviteURL = `https://horaservices.com/wonderland?id=${
//       orderDetails._id
//     }&hostName=${orderDetails?.hostName?.replace(/ /g, "%20")}`;

//     try {
//       if (navigator.clipboard && window.isSecureContext) {
//         await navigator.clipboard.writeText(inviteURL);
//         alert("Link copied to clipboard!");
//       } else {
//         const textArea = document.createElement("textarea");
//         textArea.value = inviteURL;
//         textArea.style.position = "fixed";
//         textArea.style.left = "-9999px";
//         document.body.appendChild(textArea);
//         textArea.focus();
//         textArea.select();
//         document.execCommand("copy");
//         document.body.removeChild(textArea);
//         alert("Link copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Failed to copy link:", err);
//       alert("Failed to copy link. Please try manually.");
//     }
//   };

//   return (
//     <div className="custom-modal-backdrop">
//       <div className="custom-modal-content">
//         <div className="modal-header-custom">
//           <Image
//             src={BackArrow}
//             height={25}
//             width={15}
//             onClick={onClose}
//             alt="Back"
//           />
//           <h2 className="modal-title-custom">Share Invitation</h2>
//         </div>

//         <div className="modal-body-custom" style={{ padding: "10px 15px" }}>
//           <div className="d-flex justify-content-center w-100">
//             <div className="default-template-wrapper" style={{ width: "90%" }}>
//               <img
//                 src={DefaultTemplate.src}
//                 alt="Default Invitation Template"
//                 className="default-invite-image"
//               />
//               <div className="default-template-text w-100">
//                 <p>{eventData?.hostName}</p>
//               </div>
//             </div>
//           </div>

//           <div className="d-flex align-items-center justify-content-between w-100 mt-3">
//             <div className="d-flex flex-column align-items-center Share-icon-wrapper">
//               <div className="d-flex justify-content-center align-items-center share-icon-circle">
//                 <Image src={LockIcon} alt="Lock" />
//               </div>
//               <span className="share-icons-heading mt-1">Private & Secure:</span>
//               <span className="share-icons-subheading mt-1">
//                 Only guests can access the event
//               </span>
//             </div>
//             <div className="d-flex flex-column align-items-center Share-icon-wrapper">
//               <div className="d-flex justify-content-center align-items-center share-icon-circle">
//                 <Image src={RightTick} alt="right" />
//               </div>
//               <span className="share-icons-heading mt-1">Confirm Presence:</span>
//               <span className="share-icons-subheading mt-1">
//                 Easy RSVP & Guest list
//               </span>
//             </div>
//             <div className="d-flex flex-column align-items-center Share-icon-wrapper">
//               <div className="d-flex justify-content-center align-items-center share-icon-circle">
//                 <Image src={CameraIcon} alt="camera" />
//               </div>
//               <span className="share-icons-heading mt-1">Share Memories:</span>
//               <span className="share-icons-subheading mt-1">
//                 Upload photos & videos
//               </span>
//             </div>
//           </div>

//           <div className="d-flex justify-content-center w-100 mt-4">
//             <button
//               className="copy-link-btn"
//               onClick={() => handleCopyLink(eventData)}
//             >
//               <Image src={CopyLinkIcon} alt="copy" className="me-2" />
//               Copy Link
//             </button>
//           </div>

//           {/* ✅ Single Share Button for Native Share */}
//           <div className="d-flex justify-content-center w-100 mt-3">
//             <button
//               className="share-btn btn btn-primary"
//               onClick={() => handleShare(eventData)}
//             >
//               Share Invite
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareInviteModal;
