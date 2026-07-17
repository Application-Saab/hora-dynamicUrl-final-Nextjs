import React from "react";
import Image from "next/image";
import "./CustomizationModal.css";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import balloonIcon from "@/assets/customizatiton/BalloonColors.webp";
import neonIcon from "@/assets/customizatiton/NeonLights.webp";
import numberIcon from "@/assets/customizatiton/Numbers.webp";
import themeIcon from "@/assets/customizatiton/Changetheme.webp";
import balloonTitleIcon from "@/assets/customizatiton/titleBallons.webp";
const customizationItems = [
  {
    icon: balloonIcon,
    title: "Balloon Colors",
    desc: "Pick any color you like!",
  },
  {
    icon: neonIcon,

    title: "Neon Lights",
    desc: 'We can change messages like "happy birthday" to "happy anniversary" or customize as per event.',
    isDark: true,
  },
  {
    icon: numberIcon,
    title: "Numbers & Name",
    desc: "Your age and name can be added or changed easily.",
  },
  {
    icon: themeIcon,
    title: "Change Themes",
    desc: "We can change the theme as per your choice like jungle, space, princess, or anything you like.",
  },


];

const CustomizationModal = ({ open, onClose, image, whatsappNumber = "917338584828",  product,catValue, }) => {
 useLockBodyScroll(open);

  if (!open) return null;

const handleConsultation = () => {
  if (!product) return;

  const pageUrl = window.location.href;

  const message = `🎈 *Looking for a Custom Decoration?*

Our support team is ready to help.

*Product Details*

🎉 Product: ${product?.name || "N/A"}
💰 Price: ₹${product?.discountedPrice || product?.price || "N/A"}
📂 Category: ${catValue || "N/A"}

🖼️ Product Image:
${image || "N/A"}

🔗 Product Page:
${pageUrl}

I would like to customize this decoration. Please assist me. 😊`;

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};

  return (
    <div className="customModalOverlay" onClick={onClose}>
      <div className="customModalCard" onClick={(e) => e.stopPropagation()}>
     <button className="pcs-close" onClick={onClose}>✕</button>

        <div className="customModalBody">
          <div className="customModalHeading">
          <Image
  src={balloonTitleIcon}
  alt="Balloon"
  className="customModalHeadingEmoji"
/>
            <h2>Customize Your Decoration !</h2>
          </div>
          <p className="customModalSubtext">Make It Exactly The Way You Want!</p>

          <div className="customModalList">
            {customizationItems.map((item, idx) => (
              <div className="customModalItem" key={idx}>
                <div className="customModalIcon">
  <Image
    src={item.icon}
    alt={item.title}
    width={40}
    height={40}
    className="customModalIconImg"
  />
</div>
                
                <div className="customModalItemText">
                  <p className="customModalItemTitle">{item.title}</p>
                  <p className="customModalItemDesc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="customModalCta" onClick={handleConsultation}>
            <span className="customModalCtaIcon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10 9 9.4 7.6 9.1 7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3z"/>
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.9-1.4-1.3-3-1.3-4.6 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.6 8.3-8.1 8.3z"/>
              </svg>
            </span>
            Get Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;