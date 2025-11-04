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

  // Lock background scroll
  useEffect(() => {
    if (show) {
      // store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      // restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [show]);

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
