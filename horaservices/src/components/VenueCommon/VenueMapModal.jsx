"use client";

import React from "react";
import "./venumapmodal.css";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import LocationIcon from '../../assets/venue/locality_filter_popup_map.svg';
import Image from "next/image";

export default function VenueMapModal({ isOpen, onClose, eventData }) {
  useLockBodyScroll(isOpen);

  if (!isOpen || !eventData) return null;

  const venueName = eventData?.venueName || "Venue";
  const address = eventData?.location || "";
  const googleMapLink = eventData?.googleMapLink || "";

  // Free Google Maps Embed Query URL generate karna
  // Venue name aur full address ko encode karke exact location point ho jati hai
  const searchQuery = encodeURIComponent(
    `${venueName}${address ? `, ${address}` : ""}`
  );
  const embedUrl = `https://maps.google.com/maps?q=${searchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="vmm-overlay" onClick={onClose}>
      <div className="vmm-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vmm-header">
          <h3 className="vmm-title">Venue Location</h3>
          <button
            type="button"
            className="vmm-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Map Frame Container */}
        <div className="vmm-map-container">
          <iframe
            title="Venue Location Map"
            src={embedUrl}
            className="vmm-iframe"
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* Footer Info Box */}
        <div className="vmm-info-row">
          <div className="vmm-pin-circle">
            <Image src={LocationIcon} alt="Location Pin" className="location-img" width={15} height={15} />
          </div>
          <div className="vmm-text-block">
            <h4 className="vmm-venue-name">{venueName}</h4>
            {address && <p className="vmm-address">{address}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}