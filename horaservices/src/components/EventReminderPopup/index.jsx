"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./EventReminderPopup.css";
import plannerImage from "@/assets/Planner.webp";
import approachingImage from "@/assets/Approaching.webp";
import Image from "next/image";
import whatsappIcon from "@/assets/whatsapp-icon.svg";
const WHATSAPP_NUMBER = "7338584828";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll"; // 👈 naya import

const VARIANTS = {
  approaching: {
     image: approachingImage,
    illustrationClass: "erp-illustration-approaching",
    title: "Your Event is Approaching!",
    description:
      "Only 3 to 4 days are left for your event date. Connect with our customer support team to ensure everything is arranged on time.",
    whatsappMessage:
      "Hi! My event is approaching soon, I need help with the arrangements.",
  },
  planner: {
     image: plannerImage,
    illustrationClass: "erp-illustration-planner",
    title: "You're a Great Planner!",
    description:
      "Planning ahead is the secret to a perfect event. You're on the right track! 🎉",
    whatsappMessage:
      "Hi! I've planned my event in advance, can you guide me on next steps?",
  },
};


export default function EventReminderPopup({
  isOpen,
  onClose,
  variant = "approaching",
  autoCloseMs = 5000,
}) {
    useLockBodyScroll(isOpen);
  // ✅ 5 second baad khud close ho jaaye
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const config = VARIANTS[variant] || VARIANTS.approaching;

  const handleWhatsAppClick = () => {
    const encodedMsg = encodeURIComponent(config.whatsappMessage);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, "_blank");
  };

  return (
    <div className="erp-overlay" onClick={onClose}>
      <div className="erp-card" onClick={(e) => e.stopPropagation()}>
        <button className="erp-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} strokeWidth={2.4} />
        </button>

     <Image
  src={config.image}
  alt={config.title}
  className="erp-illustration"
/>
        <h2 className="erp-title">{config.title}</h2>
        <p className="erp-description">{config.description}</p>

        <button className="erp-whatsapp-btn" onClick={handleWhatsAppClick}>
        
            <Image src={whatsappIcon} alt="WhatsApp" width={20} height={20} />
          Get Free Consultation
        </button>
      </div>
    </div>
  );
}