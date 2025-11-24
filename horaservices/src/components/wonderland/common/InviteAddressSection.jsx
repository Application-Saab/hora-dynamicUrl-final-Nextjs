import { formateDateInDMDFormat } from "@/utils/dateFormatters";
import React, { useState } from "react";
import DirectionsImage from "@/assets/wonderland/addressLocationIcon.svg";
import Image from "next/image";
import AlertIcon from "@/assets/wonderland/AlertIcon.svg";
const LocationAlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="custom-modal-backdrop justify-content-center align-items-center">
        <div className="custom-modal-content">
          <div className="modal-header-custom">
            <Image src={AlertIcon} height={24} width={27} />
            <h2 className="modal-title-custom">Missing Location</h2>
          </div>

          <div className="modal-body-custom">
            <h3 className="location-modal-question-text mb-4">
              Map location is not available{" "}
            </h3>
            <button className="submit-button-custom" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const InviteAddressSection = ({ eventData }) => {
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
        <div className="address-part-ctn">
          {(eventData?.eventDate || eventData?.eventTime) && (
            <span className="date-time-text">
              {eventData?.eventDate &&
                formateDateInDMDFormat(eventData?.eventDate)}
              <span className="ms-2">
                {eventData?.eventTime && `@ ${eventData?.eventTime}`}
              </span>
            </span>
          )}
          {eventData?.location && (
            <span className="address-text">{eventData?.location}</span>
          )}
        </div>
        <div
          className="d-flex align-items-center"
          style={{ marginLeft: "-30px" }}
        >
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
      <LocationAlertModal
        isOpen={openLocationAlertModal}
        onClose={() => setOpenLocationAlertModal(false)}
      />
    </>
  );
};

export default InviteAddressSection;
