import React, { useEffect, useState } from "react";
import DateIcon from "@/assets/wonderland/CalendarGradientIcon.svg";
import TimeIcon from "@/assets/wonderland/TimeGradientIcon.svg";
import LocationIcon from "@/assets/wonderland/LocationGradientIcon.svg";
import MapIcon from "@/assets/wonderland/MapGradientIcon.svg";
import Image from "next/image";
import useApi from "@/hooks/useApi";
import { UPDATE_EVENT_BY_ID } from "@/utils/apiconstants";
import CalendarModal from "./CalendarModal";
import TimeModal from "./TimeModal";
import CustomButton from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import { safeGetItem } from "@/utils/safeStorage";

const AddDetailsModal = ({ eventData, isOpen, onClose, refetchInvite }) => {
  if (!isOpen) return null;
  const { loading, makeRequest } = useApi();
  const userId = safeGetItem("userID");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    eventData?.eventDate ? new Date(eventData?.eventDate) : "",
  );
  const [selectedTime, setSelectedTime] = useState(eventData?.eventTime || "");
  const [formData, setFormData] = useState({
    hostName: eventData?.hostName || "",
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
          userId: eventData?.userId,
          ...formData,
        },
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
      <CustomModal
        isOpen={isOpen}
        onClose={() => onClose()}
        title="Add Event Details"
        verticalCenter={false}
        bodyClass="add-details-modal-body"
        modalClass="add-details-modal-content"
        backdropClass={showCalendarModal || showTimeModal ? "d-none" : ""}
        body={
          <>
            <div className="input-group custom-input-grop-add-details">
              <span
                className="input-group-text add-details-input-addon"
                id="basic-addon1"
              >
                <Image src={DateIcon} alt="event name" />
              </span>
              <textarea
                name="hostName"
                className="form-control add-details-input"
                placeholder="Occasion Name"
                value={formData.hostName}
                onChange={handleChange}
                rows={1}
                style={{
                  resize: "none",
                  overflow: "hidden",
                }}
                onInput={(e) => {
                  e.target.style.height = "55px";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              ></textarea>
            </div>
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
              <textarea
                name="location"
                className="form-control add-details-input"
                placeholder="Address"
                value={formData.location}
                onChange={handleChange}
                rows={1}
                style={{
                  resize: "none",
                  overflow: "hidden",
                }}
                onInput={(e) => {
                  e.target.style.height = "55px";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              ></textarea>
            </div>
            <div className="input-group custom-input-grop-add-details">
              <span
                className="input-group-text add-details-input-addon"
                id="basic-addon1"
              >
                <Image src={MapIcon} alt="image" />
              </span>
              <textarea
                name="googleMapLink"
                className="form-control add-details-input"
                placeholder="Google Map"
                value={formData?.googleMapLink}
                onChange={handleChange}
                rows={1}
                style={{
                  resize: "none",
                  overflow: "hidden",
                }}
                onInput={(e) => {
                  e.target.style.height = "55px";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              ></textarea>
            </div>
            <div className="d-flex justify-content-center mt-1">
              <CustomButton
                title={"Submit"}
                loading={loading}
                onClick={handleSubmit}
                buttonClass="add-details-submit"
                disabled={!formData.eventDate}
              />
            </div>
          </>
        }
      />

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
