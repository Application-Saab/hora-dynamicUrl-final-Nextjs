"use client";

import React, { useState } from "react";
import "./venueaddresssection.css";
import WatsappIcon from "../../assets/venue/check_availability_wa.svg";
import Image from "next/image";
import VenueAvailabilityModal from "../VenueCommon/VenueAvailabilityModal";
import VenueMapModal from "../VenueCommon/VenueMapModal";
import { MARKETING_EVENTS, trackWhatsAppButtonClick } from "@/utils/marketingEvents";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
const PHONE = "7338584828";
// GTM dataLayer push (inline helper — no extra file needed)
const pushToDataLayer = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

const VenueAddressSection = ({ eventData, userId, visitorId, pincode, hideDateAndTime, city }) => {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const venueName = eventData?.venueName;
  const address = eventData?.location;
  const mapLink = eventData?.googleMapLink;

  // Pre-filled WhatsApp message
  const buildWhatsappLink = () => {
    const cityName = eventData?.city || city || "";
    const message = `Hi, I liked your this venue, can you help me in booking process${
      cityName ? ` in ${cityName}` : ""
    }.`;

    return `https://wa.me/91${PHONE}?text=${encodeURIComponent(message)}`;
  };

  const whatsappLink = buildWhatsappLink();

  if (!venueName && !address) return null;

  // Common GTM payload
  const gtmPayload = {
    venue_id: eventData?._id || "",
    venue_name: venueName || "",
    venue_city: eventData?.city || city || "",
    venue_locality: eventData?.locality || "",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  };

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
              pushToDataLayer("check_availability_click", {
              ...gtmPayload,
              button_name: "Check Availability",
              button_type: "whatsapp",
              button_location: "venue_detail_address_section",
            });
            trackWhatsAppButtonClick(MARKETING_EVENTS.WHATSAPP_BUTTONS.CHECK_AVAILABILITY_VENUE_INNER, {
              button_name: "Check Availability",
              button_type: "check_availibility_venue_address_section",
              page_path: window.location.pathname,
            });
            e.stopPropagation();
            trackWAClicks();
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
              pushToDataLayer("view_map_click", {
                ...gtmPayload,
                button_name: "View on Map",
                map_link: mapLink,
              });
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