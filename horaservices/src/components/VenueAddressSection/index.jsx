"use client";

import React, { useState } from "react";
import "./venueaddresssection.css";
import WatsappIcon from "../../assets/venue/check_availability_wa.svg";
import Image from "next/image";
import VenueAvailabilityModal from "../VenueCommon/VenueAvailabilityModal";
import VenueMapModal from "../VenueCommon/VenueMapModal";

const VenueAddressSection = ({ eventData, userId, visitorId, pincode }) => {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false); // 👈 Map modal state

  const venueName = eventData?.venueName;
  const address = eventData?.location;

  if (!venueName && !address) return null;

  return (
    <>
      <div className="vas-card">
        {/* Venue Name & Address */}
        <div className="vas-info">
          {venueName && <h4 className="vas-venueName">{venueName}</h4>}
          {address && <p className="vas-address">{address}</p>}
        </div>

        {/* Action Buttons */}
        <div className="vas-actions">
          <button
            type="button"
            className="vas-btn vas-btn--whatsapp"
            onClick={(e) => {
              e.stopPropagation();
              setShowAvailabilityModal(true);
            }}
          >
            <Image src={WatsappIcon} alt="WhatsApp" width={15.79} height={15.87} />
            Check Availability
          </button>

          {/* View on Map Button -> Opens Modal */}
          <button
            type="button"
            className="vas-btn vas-btn--map"
            onClick={(e) => {
              e.stopPropagation();
              setShowMapModal(true);
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M9 3L3 6v15l6-3l6 3l6-3V3l-6 3l-6-3z" strokeLinejoin="round" />
              <path d="M9 3v15M15 6v15" strokeLinejoin="round" />
            </svg>
            View on Map
          </button>
        </div>
      </div>

      {/* Availability Calendar Popup */}
      <VenueAvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        eventData={eventData}
        userId={userId}
        visitorId={visitorId}
        pincode={pincode}
      />

      {/* View on Map Popup */}
      <VenueMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        eventData={eventData}
      />
    </>
  );
};

export default VenueAddressSection;