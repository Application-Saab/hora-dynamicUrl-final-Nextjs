import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CreateInviteModal.css";

const CalendarModal = ({ show, onClose, selectedDate, setSelectedDate }) => {
  const modalRef = useRef(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="custom-modal-backdrop">
      <div
        ref={modalRef}
        className="custom-modal-content"
        style={{
          backgroundColor: "transparent",
        }}
      >
        <div className="modal-body-custom">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            defaultValue={new Date()}
            calendarType="gregory"
            prev2Label={null}
            next2Label={null}
            className="dark-calendar"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
