import React, { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import "./DateNotificationBanner.css";
import dateIllustration from "@/assets/dateIllustration.svg";
// "1" wala calendar icon (Image 2 jaisa)
function CalendarOneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="3" stroke="#703dbe" strokeWidth="1.8" />
      <path d="M3 9.5h18" stroke="#703dbe" strokeWidth="1.8" />
      <path d="M8 2.5v4M16 2.5v4" stroke="#703dbe" strokeWidth="1.8" strokeLinecap="round" />
      <text
        x="12"
        y="17.4"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fill="#703dbe"
        fontFamily="Inter, sans-serif"
      >
        1
      </text>
    </svg>
  );
}

export default function DateNotificationBanner({
  onClick,
  onClose,
  onTimeout,
  durationMs = 8000,
  illustration = dateIllustration,
}) {
  useEffect(() => {
    const t = setTimeout(() => onTimeout?.(), durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs]);

  return (
    <div className="dnb-wrap">
      <div
        className="dnb-banner"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick?.();
        }}
      >
        <div className="dnb-icon">
          <CalendarOneIcon />
        </div>

        <div className="dnb-text">
          <p className="dnb-title">Event date not selected yet!</p>
          <p className="dnb-subtitle">You can set your event date anytime.</p>
        </div>

       {illustration && (
  <Image
    src={illustration}
    alt=""
    className="dnb-illustration"
    priority
  />
)}

        <button
          type="button"
          className="dnb-close"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          <X size={16} strokeWidth={2.4} color="#703dbe" />
        </button>

        <div className="dnb-progress-track">
          <div
            className="dnb-progress-bar"
            style={{ animationDuration: `${durationMs}ms` }}
          />
        </div>
      </div>
    </div>
  );
}