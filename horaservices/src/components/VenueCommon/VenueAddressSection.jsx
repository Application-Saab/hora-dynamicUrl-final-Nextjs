import React, { useState } from "react";
import DirectionsImage from "@/assets/wonderland/addressLocationIcon.svg";
import Image from "next/image";
import AlertIcon from "@/assets/wonderland/AlertIcon.svg";
import ErrorPopup from "@/components/common/ErrorPopup";
import "./VenueAddressSection.css";

const VenueAddressSection = ({ eventData }) => {
  const [openLocationAlertModal, setOpenLocationAlertModal] = useState(false);

  const handleLocationClick = () => {
    const mapLink = eventData?.googleMapLink;
    if (!mapLink) {
      setOpenLocationAlertModal(true);
      return;
    }
    window.open(mapLink, "_blank");
  };

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-start"
        style={{ gap: "30px", marginTop: "9px" }}
      >
        {/* LEFT — Venue Name + Address */}
        <div className="vas-info">
          {eventData?.hostName && (
            <h1 className="vas-venue-name">{eventData.hostName
}</h1>
          )}
          {eventData?.location && (
            <p className="vas-address">{eventData.location}</p>
          )}
        </div>

        {/* RIGHT — Direction (same as Wonderland) */}
        <div className="d-flex align-items-center" style={{ marginLeft: "-30px" }}>
          <div className="direction-ctn">
            <img
              src="/assets/wonderland/MapGraphImage.png"
              alt="Location Map Graphic"
              className="direction-bg-img"
            />
          </div>
          <div
            className="d-flex justify-content-center align-items-center flex-column direction-icon-ctn"
            onClick={handleLocationClick}
          >
            <Image
              src={DirectionsImage}
              alt="directions"
              className="address-direction-image"
            />
            <span>Directions</span>
          </div>
        </div>
      </div>

      <ErrorPopup
        isOpen={openLocationAlertModal}
        onClose={() => setOpenLocationAlertModal(false)}
        heading="Location Missing"
        message="Map location is not available"
        buttonLabel="OK"
        icon={AlertIcon}
      />
    </>
  );
};

export default VenueAddressSection;
