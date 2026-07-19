"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import PhotographyConsultationSheet from "../ConsultationPopup";
import { safeGetSessionItem, safeSetSessionItem } from "@/utils/safeStorage";
import { useDateGate } from "@/utils/dateGateContext";

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
    whatsappMessage: "Hi! I need help finding the decoration I'm looking for. Can you assist me?",
  },

  "/photography-page": {
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
    whatsappMessage: "Hi! I need help deciding the photography package I'm looking for. Can you assist me?",
  },
};

// ✅ Filhaal ye consultation popup sirf balloon-decoration path pe hi
// chalega. Future me kisi aur path ko enable karna ho to bas yaha
// add kar dena (e.g. "/photography-page" bhi allow karna ho to).
const ALLOWED_POPUP_PATHS = ["/balloon-decoration"];

const DELAY_MS = 2 * 60 * 1000; // 2 minutes

export default function ConsultationPopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const timerStarted = useRef(false);
  const pathname = usePathname();
  const { dateResolved } = useDateGate();

  const matchedKey = Object.keys(CATEGORY_POPUP_DATA).find((key) =>
    pathname?.startsWith(key)
  );

  // ✅ Sirf allowed path (abhi sirf balloon-decoration) par hi data milega,
  // baaki sab jagah ye popup completely disabled rahega
  const popupData =
    matchedKey && ALLOWED_POPUP_PATHS.includes(matchedKey)
      ? CATEGORY_POPUP_DATA[matchedKey]
      : null;

  useEffect(() => {
    if (!popupData || !matchedKey) return;

    // ✅ Jab tak date-sheet resolve nahi hoti (user ne response diya ya
    // popup close kiya), tab tak consultation popup ka timer start hi
    // mat karo — ye timer restart bhi ho sakta hai jab dateResolved
    // false se true hoga
    if (!dateResolved) return;

    if (timerStarted.current) return;

    const storageKey = `popup_shown_${matchedKey.replace("/", "")}`;
    const alreadyShown = safeGetSessionItem(storageKey);
    if (alreadyShown) return;

    timerStarted.current = true;

    const timer = setTimeout(() => {
      setIsOpen(true);
      safeSetSessionItem(storageKey, "true");
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [popupData, matchedKey, dateResolved]);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = ""; // scroll wapas enable
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // popup open hote hi scroll band
    }
    return () => {
      document.body.style.overflow = ""; // cleanup on unmount
    };
  }, [isOpen]);

  if (!popupData) {
    // ✅ Allowed path nahi hai -> sirf children render karo, popup bilkul mat mount karo
    return <>{children}</>;
  }

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