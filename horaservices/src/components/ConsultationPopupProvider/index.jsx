"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import PhotographyConsultationSheet from "../ConsultationPopup";

// ✅ Har category ka apna alag data — path ke hisaab se match hoga
const CATEGORY_POPUP_DATA = {
  "/balloon-decoration": {
    title: "Need A",
    highlightText: "Custom Decoration?",
    subtitle: "Can't find the perfect theme, colors, or setup?",
    description: "Tell us what you need, and we'll help create it just for you",
    features: [
      {
        title: "Custom Theme Setup",
        description: "Any theme, color, or style you want",
      },
      {
        title: "Budget-Friendly Options",
        description: "Great decorations that fit your budget",
      },
      {
        title: "Venue-Based Suggestions",
        description: " Ideas tailored to your event location",
      },
      {
        title: "Quick Price Estimate",
        description: " Get an estimated cost in minutes",
      },
    ],
    buttonText: "Get Free Consultation",
    footerText: "20000+ Events Planned Successfully..",
  },

  "/photography-page":  {
    title: "Confused About ",
    highlightText: "Photography Packages?",
    subtitle: "Not Sure What’s Included Or Which Package To Choose?",
    description: "We’ll Help You Find The Perfect Shoot — With Samples & Pricing",
    features: [
      {
        title: "Clear Package Breakdown",
        description: "Know hours, photos & edits included",
      },
      {
        title: "Real Sample Work",
        description: "See actual photos & videos first.",
      },
      {
        title: "Choose The Right Style",
        description: "Pick from candid, traditional or cinematic.",
      },
      {
        title: "Transparent Pricing",
        description: "Get an exact quote with no hidden costs.",
      },
    ],
    buttonText: "Get Free Consultation",
    footerText: "20000+ Events Planned Successfully..",
  },
};

const DELAY_MS = 60 * 1000; // 1 minute

export default function ConsultationPopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const timerStarted = useRef(false);
  const pathname = usePathname();

  const matchedKey = Object.keys(CATEGORY_POPUP_DATA).find((key) =>
    pathname?.startsWith(key)
  );

  const popupData = matchedKey ? CATEGORY_POPUP_DATA[matchedKey] : null;

  useEffect(() => {
    if (!popupData || !matchedKey) return;
    if (timerStarted.current) return;

    // ✅ Har category ka apna alag storage key
    const storageKey = `popup_shown_${matchedKey.replace("/", "")}`;
    // Example: "popup_shown_balloon-decoration", "popup_shown_photography-page"

    const alreadyShown = sessionStorage.getItem(storageKey);
    if (alreadyShown) return;

    timerStarted.current = true;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(storageKey, "true");
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [popupData, matchedKey]);
const handleClose = () => {
  setIsOpen(false);
  document.body.style.overflow = "";      // ← scroll wapas enable
};
  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";   // ← popup open hote hi scroll band
  }
  return () => {
    document.body.style.overflow = "";         // ← cleanup on unmount
  };
}, [isOpen]);
  return (
    <>
      {children}
      <PhotographyConsultationSheet
        isOpen={isOpen}
        onClose={handleClose}
        data={popupData}
      />
    </>
  );
}
