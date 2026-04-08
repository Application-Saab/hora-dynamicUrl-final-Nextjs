import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePopup.css";

export default function BirthdayCalendarPopup({ onClose }) {
  const [date, setDate] = useState(new Date());

  return (
    <div className="overlay">
      <div className="popup">
        
        {/* Close */}
        <span className="close" onClick={onClose}>✕</span>

        {/* Background */}
        <img src="/birthday-date.png" className="bg" />

        {/* Calendar */}
        <div className="calendar-box">
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            inline
          />
        </div>

      </div>
    </div>
  );
}