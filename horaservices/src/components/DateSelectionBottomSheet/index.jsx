import React, { useState } from "react";
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import "./DateSelectionBottomSheet.css";
import Image from "next/image";
import calendarBgimage from "@/assets/calendarBgimage.png"
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function DateSelectionBottomSheet({ isOpen, onClose, onConfirm }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(selectedDate);
    onClose();
  };

  // ---- Calendar grid build ----
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const isSelected = (day) =>
    day &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  // "Monday, 17 May 2026" style -> tweak to match "Monday , 17 May 2026"
  const [weekdayPart, ...rest] = formattedSelectedDate.split(", ");
  const displayDate = `${weekdayPart} , ${rest.join(", ")}`;

  return (
    <div className="dsb-device">
      <div className="dsb-overlay" onClick={onClose} />

      <button className="dsb-close-btn" onClick={onClose} aria-label="Close">
        <X size={16} strokeWidth={2.4} color="#1a1a1a" />
      </button>

      <div className="dsb-sheet">
<div className="dsb-header">
 
  <Image src={calendarBgimage} alt="" className="dsb-header-bg" />
  <div className="dsb-header-text">
    <h1>Select Event Date</h1>
    <p className="dsb-subtitle">
      Choose the date of your event to check availability.
    </p>
  </div>
</div>

        <div className="dsb-calendar-card">
          <div className="dsb-month-nav">
            <button
              className="dsb-nav-btn"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={20} strokeWidth={2.4} />
            </button>
            <span className="dsb-month-label">
              {MONTH_NAMES[viewMonth].toUpperCase()}
            </span>
            <button
              className="dsb-nav-btn"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={20} strokeWidth={2.4} />
            </button>
          </div>

          <div className="dsb-day-names">
            {DAY_NAMES.map((d) => (
              <span key={d} className="dsb-day-name">
                {d}
              </span>
            ))}
          </div>

          <div className="dsb-days-grid">
            {calendarCells.map((day, idx) =>
              day === null ? (
                <span key={`empty-${idx}`} className="dsb-day-cell dsb-day-empty" />
              ) : (
                <button
                  key={day}
                  className={`dsb-day-cell ${isSelected(day) ? "dsb-day-selected" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="dsb-footer">
        <div className="dsb-footer-left">
          <div className="dsb-footer-icon">
            <CalendarIcon size={18} strokeWidth={2} color="#7c3aad" />
          </div>
          <div>
            <p className="dsb-footer-label">Selected Date</p>
            <p className="dsb-footer-date">{displayDate}</p>
          </div>
        </div>
        <button className="dsb-confirm-btn" onClick={handleConfirm}>
          Confirm Date
        </button>
      </div>
    </div>
  );
}