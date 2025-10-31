import React, { useEffect, useState } from "react";
import BackArrow from "@/assets/BackArrowSvg.svg";
import DateIcon from "@/assets/wonderland/CalendarGradientIcon.svg";
import TimeIcon from "@/assets/wonderland/TimeGradientIcon.svg";
import LocationIcon from "@/assets/wonderland/LocationGradientIcon.svg";
import MapIcon from "@/assets/wonderland/MapGradientIcon.svg";
import Image from "next/image";
import "./CreateInviteModal.css";
import useApi from "@/hooks/useApi";
import { UPDATE_EVENT_BY_ID } from "@/utils/apiconstants";
import CalendarModal from "./CalendarModal";
import TimeModal from "./TimeModal";
import CustomButton from "../common/CustomButton";

const AddDetailsModal = ({ eventData, isOpen, onClose, refetchInvite }) => {
  if (!isOpen) return null;
  const { loading, makeRequest } = useApi();
  const userId = localStorage.getItem("userID");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    eventData?.eventDate ? new Date(eventData?.eventDate) : ""
  );
  const [selectedTime, setSelectedTime] = useState(eventData?.eventTime || "");
  const [formData, setFormData] = useState({
    eventDate: selectedDate,
    eventTime: eventData?.eventTime || "",
    location: eventData?.location || "",
    googleMapLink: eventData?.googleMapLink || "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      eventDate: selectedDate,
      eventTime: selectedTime,
    }));
  }, [selectedDate, selectedTime]);

  const handleSubmit = async () => {
    if (!userId) return;
    try {
      let resp = await makeRequest(
        `${UPDATE_EVENT_BY_ID}/${eventData?._id}`,
        "PUT",
        {
          userId: userId,
          ...formData,
        }
      );
      if (resp?.data) {
        refetchInvite();
        onClose();
      }
    } catch (err) {
      console.error("Error rejecting content:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="custom-modal-backdrop">
        <div className="custom-modal-content">
          <div className="modal-header-custom">
            <Image
              src={BackArrow}
              height={25}
              width={15}
              onClick={onClose}
              alt="back"
            />
            <h2 className="modal-title-custom">Add Event Details</h2>
          </div>

          <div className="modal-body-custom">
            <div className="adddetails-input-group">
              <button
                type="button"
                className="add-details-date-btn w-100"
                onClick={() => setShowCalendarModal(true)}
              >
                <Image src={DateIcon} alt="date icon" />{" "}
                {selectedDate ? formatDate(formData?.eventDate) : "Date"}
              </button>
              <button
                type="button"
                className="add-details-date-btn w-100"
                onClick={() => setShowTimeModal(true)}
              >
                <Image src={TimeIcon} alt="time icon" />
                {formData?.eventTime ? formData?.eventTime : "Time"}
              </button>
            </div>
            <div className="input-group custom-input-grop-add-details">
              <span
                className="input-group-text add-details-input-addon"
                id="basic-addon1"
              >
                <Image src={LocationIcon} alt="location" />
              </span>
              <input
                type="text"
                name="location"
                className="form-control add-details-input"
                placeholder="Address"
                aria-label="Address"
                aria-describedby="basic-addon1"
                value={formData?.location}
                onChange={handleChange}
              />
            </div>
            <div className="input-group custom-input-grop-add-details">
              <span
                className="input-group-text add-details-input-addon"
                id="basic-addon1"
              >
                <Image src={MapIcon} alt="image" />
              </span>
              <input
                type="text"
                name="googleMapLink"
                className="form-control add-details-input"
                placeholder="Google Map"
                aria-label="Google Map"
                aria-describedby="basic-addon1"
                value={formData?.googleMapLink}
                onChange={handleChange}
              />
            </div>

            <CustomButton
              title={"Submit"}
              loading={loading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>

      <CalendarModal
        show={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <TimeModal
        show={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
    </>
  );
};

export default AddDetailsModal;
