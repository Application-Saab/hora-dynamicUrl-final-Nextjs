"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import PhotographyConsultationSheet from "../ConsultationPopup";
import PinCodeBottomSheet from "../PinCodeBottomSheet"; // ✅ apna sahi path daalo

const CATEGORY_POPUP_DATA = {
  "/balloon-decoration": {
    title: "Need A",
    highlightText: "Custom Decoration?",
    subtitle: "Can't find the perfect theme, colors, or setup?",
    description: "Tell us what you need, and we'll help create it just for you",
    features: [
      { title: "Custom Theme Setup", description: "Any theme, color, or style you want" },
      { title: "Budget-Friendly Options", description: "Great decorations that fit your budget" },
      { title: "Venue-Based Suggestions", description: " Ideas tailored to your event location" },
      { title: "Quick Price Estimate", description: " Get an estimated cost in minutes" },
    ],
    buttonText: "Get Free Consultation",
    footerText: "20000+ Events Planned Successfully..",
    whatsappMessage: "Hi! I need help finding the decoration I'm looking for. Can you assist me?",
  },

  "/photography-page": {
    title: "Confused About ",
    highlightText: "Photography Packages?",
    subtitle: "Not Sure What’s Included Or Which Package To Choose?",
    description: "We’ll Help You Find The Perfect Shoot — With Samples & Pricing",
    features: [
      { title: "Clear Package Breakdown", description: "Know hours, photos & edits included" },
      { title: "Real Sample Work", description: "See actual photos & videos first." },
      { title: "Choose The Right Style", description: "Pick from candid, traditional or cinematic." },
      { title: "Transparent Pricing", description: "Get an exact quote with no hidden costs." },
    ],
    buttonText: "Get Free Consultation",
    footerText: "20000+ Events Planned Successfully..",
    whatsappMessage: "Hi! I need help deciding the photography package I'm looking for. Can you assist me?",
  },
};

const PIN_DELAY_MS = 30 * 1000;      // ✅ 30 sec — PIN popup
const CONSULTATION_DELAY_MS = 60 * 1000; // 1 min — Consultation popup

export default function ConsultationPopupProvider({ children }) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);

  const consultationTimerStarted = useRef(false);
  const pinTimerStarted = useRef(false);

  const pathname = usePathname();

  const matchedKey = Object.keys(CATEGORY_POPUP_DATA).find((key) =>
    pathname?.startsWith(key)
  );
  const popupData = matchedKey ? CATEGORY_POPUP_DATA[matchedKey] : null;

  // ✅ PIN popup — 30 sec
  useEffect(() => {
    if (!matchedKey) return;
    if (pinTimerStarted.current) return;

    const storageKey = `pin_popup_shown_${matchedKey.replace("/", "")}`;
    const alreadyShown = sessionStorage.getItem(storageKey);
    if (alreadyShown) return;

    pinTimerStarted.current = true;

    const timer = setTimeout(() => {
      setIsPinOpen(true);
      sessionStorage.setItem(storageKey, "true");
    }, PIN_DELAY_MS);

    return () => clearTimeout(timer);
  }, [matchedKey]);

  // ✅ Consultation popup — 60 sec
  useEffect(() => {
    if (!popupData || !matchedKey) return;
    if (consultationTimerStarted.current) return;

    const storageKey = `popup_shown_${matchedKey.replace("/", "")}`;
    const alreadyShown = sessionStorage.getItem(storageKey);
    if (alreadyShown) return;

    consultationTimerStarted.current = true;

    const timer = setTimeout(() => {
      setIsConsultationOpen(true);
      sessionStorage.setItem(storageKey, "true");
    }, CONSULTATION_DELAY_MS);

    return () => clearTimeout(timer);
  }, [popupData, matchedKey]);

  const handleConsultationClose = () => {
    setIsConsultationOpen(false);
  };

  const handlePinClose = () => {
    setIsPinOpen(false);
  };

  // ✅ Dono popups mein se koi bhi open ho, scroll lock rahe
  useEffect(() => {
    if (isConsultationOpen || isPinOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isConsultationOpen, isPinOpen]);

  return (
    <>
      {children}

      <PinCodeBottomSheet isOpen={isPinOpen} onClose={handlePinClose} />

      <PhotographyConsultationSheet
        isOpen={isConsultationOpen}
        onClose={handleConsultationClose}
        data={popupData}
      />
    </>
  );
}