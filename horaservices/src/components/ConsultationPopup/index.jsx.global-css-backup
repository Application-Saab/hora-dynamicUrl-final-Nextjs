"use client";

import Image from "next/image";
import "./ConsultationPopup.css";
import ConsultationPopupimg from "@/assets/ConsultationPopupimg.webp";
import whatsappIcon from "@/assets/whatsapp-icon.svg";
import tickIcon from "@/assets/tickicon.svg";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
export default function PhotographyConsultationSheet({
  isOpen,
  onClose,
  data,
}) {
  if (!isOpen) return null;
const PHONE = "7338584828";
 const openWhatsApp = () => {
  trackWAClicks();
  // ✅ GTM Event — event name popup ke title se banega (bina "?" ke, space safely normalized)
  // e.g. "Need A Custom Decoration Popup Button Click", "Confused About Photography Packages Popup Button Click"
  const cleanTitle = `${data?.title || ""} ${data?.highlightText || ""}`
    .replace(/\?/g, "")
    .replace(/\s+/g, " ")
    .trim();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: `${cleanTitle} Popup Button Click`,
    popup_title: cleanTitle,
    button_name: data?.buttonText,
  });

  const message = data?.whatsappMessage;

  const encoded = encodeURIComponent(message);

  window.open(`https://wa.me/${PHONE}?text=${encoded}`, "_blank");
};

  return (
    <>
      <div className="pcs-overlay" onClick={onClose} />
      <div className="pcs-sheet">
        <button className="customModal-close" onClick={onClose}>✕</button>
        <div className="pcs-dragger" />

        <div className="pcs-header">
          <div className="pcs-image">
            <Image src={ConsultationPopupimg} alt="Help" width={110} height={110} />
          </div>
          <div className="pcs-content">
            <h2>
              {data?.title}
              <span>{data?.highlightText}</span>
            </h2>
            <p className="pcs-subtitle">{data?.subtitle}</p>
            <h4>{data?.description}</h4>
          </div>
        </div>

        <div className="pcs-features">
          {data?.features?.map((item, index) => (
            <div key={index} className="pcs-feature">
              <div className="pcs-icon">
                <Image src={tickIcon} alt="tick" width={20} height={20} />
              </div>
              <div>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            </div>
          ))}

          {/* ✅ onClick lagaya */}
          <button className="pcs-btn" onClick={openWhatsApp}>
            <Image src={whatsappIcon} alt="WhatsApp" width={20} height={20} />
            {data?.buttonText}
          </button>
        </div>

        <p className="pcs-footer">{data?.footerText}</p>
      </div>
    </>
  );
}