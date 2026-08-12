import React, { useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CustomModal from "../common/CustomModal";

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
    <CustomModal
      isOpen={show}
      onClose={onClose}
      showHeader={false}
      verticalCenter={false}
      modalClass="calendar-modal-body"
      bodyClass="p-0"
      body={
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          defaultValue={new Date()}
          calendarType="gregory"
          prev2Label={null}
          next2Label={null}
          className="dark-calendar"
        />
      }
    />
  );
};

export default CalendarModal;
