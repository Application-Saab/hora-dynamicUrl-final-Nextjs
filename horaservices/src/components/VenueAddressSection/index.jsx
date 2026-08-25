"use client";

import React from "react";
import "./venueaddresssection.css";

const PHONE = "7338584828";

const VenueAddressSection = ({ eventData, hideDateAndTime }) => {
  const venueName = eventData?.venueName;
  const address = eventData?.location; // location = full address string in your API
  const mapLink = eventData?.googleMapLink;

  // 👇 NEW — pre-filled WhatsApp message
  const buildWhatsappLink = () => {
    const name = venueName || "this venue";
    const lines = [
      `Hi, I'm interested in *${name}*.`,
      address ? `Address: ${address}` : null,
      "",
      "Please share more details and availability.",
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/91${PHONE}?text=${message}`;
  };

  const whatsappLink = buildWhatsappLink();

  if (!venueName && !address) return null;

  return (
    <div className="vas-card">
      {/* LEFT — Pin avatar */}
      <div className="vas-pinAvatar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C7.86 2 4.5 5.36 4.5 9.5C4.5 15.25 12 22 12 22C12 22 19.5 15.25 19.5 9.5C19.5 5.36 16.14 2 12 2Z"
            fill="#fff"
          />
          <circle cx="12" cy="9.5" r="2.5" fill="#8c4a9e" />
        </svg>
      </div>

      {/* MIDDLE — Venue name + address */}
      <div className="vas-info">
        {venueName && <h4 className="vas-venueName">{venueName}</h4>}
        {address && <p className="vas-address">{address}</p>}
      </div>

      {/* RIGHT — Action buttons */}
      <div className="vas-actions">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="vas-btn vas-btn--whatsapp"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.68 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.84 19.01L7.54 18.83L4.42 19.65L5.26 16.61L5.06 16.29C4.24 14.98 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.32 4.53 17.87 6.08C19.42 7.64 20.29 9.71 20.28 11.91C20.28 16.45 16.58 20.15 12.04 20.15Z" />
            <path d="M9.1 7.5C8.92 7.1 8.73 7.09 8.56 7.08C8.42 7.08 8.26 7.08 8.1 7.08C7.94 7.08 7.68 7.14 7.46 7.38C7.24 7.62 6.62 8.2 6.62 9.38C6.62 10.56 7.48 11.7 7.6 11.86C7.72 12.02 9.26 14.5 11.7 15.47C13.73 16.28 14.15 16.12 14.59 16.08C15.03 16.04 16 15.5 16.2 14.94C16.4 14.38 16.4 13.9 16.34 13.8C16.28 13.7 16.12 13.64 15.88 13.52C15.64 13.4 14.46 12.82 14.24 12.74C14.02 12.66 13.86 12.62 13.7 12.86C13.54 13.1 13.08 13.64 12.94 13.8C12.8 13.96 12.66 13.98 12.42 13.86C12.18 13.74 11.4 13.48 10.48 12.66C9.76 12.02 9.28 11.24 9.14 11C9 10.76 9.12 10.63 9.24 10.51C9.35 10.4 9.48 10.22 9.6 10.08C9.72 9.94 9.76 9.84 9.84 9.68C9.92 9.52 9.88 9.38 9.82 9.26C9.76 9.14 9.3 7.95 9.1 7.5Z" />
          </svg>
          Chat on WhatsApp
        </a>
        {mapLink && (
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="vas-btn vas-btn--map"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 3L3 6v15l6-3l6 3l6-3V3l-6 3l-6-3z" strokeLinejoin="round" />
              <path d="M9 3v15M15 6v15" strokeLinejoin="round" />
            </svg>
            View on Map
          </a>
        )}
      </div>
    </div>
  );
};

export default VenueAddressSection;