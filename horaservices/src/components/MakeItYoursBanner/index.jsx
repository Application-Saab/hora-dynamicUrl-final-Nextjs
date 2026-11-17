"use client";
import React from "react";
import Image from "next/image";
import "./makeItYoursBanner.css";
import customize from "@/assets/Customizetationbanner.webp";
import customiseIcon from "@/assets/customiselcon.webp";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
import { MARKETING_EVENTS, trackWhatsAppButtonClick } from "@/utils/marketingEvents";

const slugToText = (slug = "") =>
  String(slug).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

const slugToTitle = (slug = "") =>
  slugToText(slug).replace(/\b\w/g, (c) => c.toUpperCase());

const MakeItYoursBanner = ({
  phone = "7338584828",
  catValue = "",
  city = "",
  message,
}) => {
  // "first-night-decoration" -> "first night Decor"
  const catText = (slugToText(catValue) || "Decoration").replace(
    /\bdecoration\b/i,
    "Decor"
  );
  const cityText = slugToTitle(city);

  const finalMessage =
    message ||
    `Looking for a Custom ${catText}${cityText ? ` in ${cityText}` : ""}? Our support team is ready to help!`;

  const handleWhatsAppClick = () => {
    trackWhatsAppButtonClick(MARKETING_EVENTS.WHATSAPP_BUTTONS.MAKE_IT_YOURS_CUSTOMIZE_BANNER, {
      button_name: "Customize Design",
      button_type: "customize_design_decoration",
      page_path: window.location.pathname,
    });
    trackWAClicks();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Customization_WhatsApp_Button",
      eventCategory: "Product Page",
      eventAction: "WhatsApp Click",
      eventLabel: "Make It Yours Banner",
    });

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`,
      "_blank"
    );
  };

  return (
    <section
      className="makeItYoursBanner"
      onClick={handleWhatsAppClick}
      style={{ cursor: "pointer" }}
    >
      <Image
        src={customize}
        alt="Decoration-Banner"
        width={1200}
        height={400}
        className="makeItYoursBanner-img"
        priority
      />

      <button
        className="makeItYoursCta"
        onClick={(e) => {
          e.stopPropagation();
          handleWhatsAppClick();
        }}
      >
        <span className="makeItYourImg-icon">
          <Image src={customiseIcon} alt="Customize" width={25} height={25} />
        </span>

        <span className="makeItYoursCta-text">
          <span className="makeItYoursCta-title">Customize Design</span>
          <span className="makeItYoursCta-subtitle">Make it unique &amp; personal</span>
        </span>

        <span className="makeItYoursCta-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </section>
  );
};

export default MakeItYoursBanner;