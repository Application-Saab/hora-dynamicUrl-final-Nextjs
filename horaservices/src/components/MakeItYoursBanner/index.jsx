"use client";
import React from "react";
import Image from "next/image";
import "./MakeItYoursBanner.css";
import customize from "@/assets/Customizetationbanner.webp";
import customiseIcon from "@/assets/customiselcon.webp";
const MakeItYoursBanner = ({  phone = "7338584828",  }) => {
  const handleWhatsAppClick = () => {
    const PHONE = phone;
    const text = `Looking for a Custom Decoration? Our support team is ready to help!`;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Customization_WhatsApp_Button",
      eventCategory: "Product Page",
      eventAction: "WhatsApp Click",
      eventLabel: "Make It Yours Banner",
    });

    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`,
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
          e.stopPropagation(); // parent click dobara na fire ho
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