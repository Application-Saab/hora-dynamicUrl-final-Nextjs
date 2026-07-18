"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./EventReminderPopup.css";
import plannerImage from "@/assets/Planner.webp";
import approachingImage from "@/assets/Approaching.webp";
import Image from "next/image";
// TODO: apna actual business WhatsApp number yahan daalo (country code ke saath, bina + ya 00)
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

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

/**
 * Props:
 * - isOpen, onClose
 * - variant: "approaching" | "planner"
 * - autoCloseMs: default 5000 (5 seconds)
 */
export default function EventReminderPopup({
  isOpen,
  onClose,
  variant = "approaching",
  autoCloseMs = 5000,
}) {
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
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.94 11.94 0 0012.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.86 11.86 0 005.63 1.43h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.36-8.43zM12.04 21.4a9.5 9.5 0 01-4.85-1.33l-.35-.21-3.8 1 1.02-3.7-.23-.38a9.5 9.5 0 01-1.46-5.05c0-5.25 4.28-9.53 9.53-9.53a9.47 9.47 0 016.75 2.8 9.47 9.47 0 012.79 6.74c0 5.26-4.27 9.53-9.53 9.53l-.02.13z" />
          </svg>
          Get Free Consultation
        </button>
      </div>
    </div>
  );
}