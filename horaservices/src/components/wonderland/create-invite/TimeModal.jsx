import React, { useEffect, useRef, useState } from "react";
import "./CreateInviteModal.css";

const TimeModal = ({ show, onClose, selectedTime, setSelectedTime }) => {
  const modalRef = useRef(null);

  const [hour, setHour] = useState(6);
  const [minute, setMinute] = useState(30);
  const [second, setSecond] = useState(0);
  const [period, setPeriod] = useState("PM");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!show) return null;

  const handleSave = () => {
    const formatted = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}:${String(second).padStart(2, "0")} ${period}`;
    setSelectedTime(formatted);
    onClose();
  };

  const Wheel = ({ range, value, setValue }) => (
    <div className="wheel">
      {range.map((num) => (
        <div
          key={num}
          className={`wheel-item ${num === value ? "wheel-item-active" : ""}`}
          onClick={() => setValue(num)}
        >
          {String(num).padStart(2, "0")}
        </div>
      ))}
    </div>
  );

  return (
    <div className="custom-modal-backdrop">
      <div ref={modalRef} className="custom-time-modal">
        <h3 className="time-modal-title">Set time</h3>

        <div className="time-wheel-container">
          <Wheel
            range={[...Array(12).keys()].map((i) => i + 1)}
            value={hour}
            setValue={setHour}
          />
          <span className="colon">:</span>
          <Wheel
            range={[...Array(60).keys()]}
            value={minute}
            setValue={setMinute}
          />
          <span className="colon">:</span>
          <Wheel
            range={[...Array(60).keys()]}
            value={second}
            setValue={setSecond}
          />
          <div className="ampm-toggle">
            <div
              className={`ampm-option ${period === "AM" ? "active" : ""}`}
              onClick={() => setPeriod("AM")}
            >
              AM
            </div>
            <div
              className={`ampm-option ${period === "PM" ? "active" : ""}`}
              onClick={() => setPeriod("PM")}
            >
              PM
            </div>
          </div>
        </div>

        <div className="time-modal-actions">
          <button className="cancel-btn w-100" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn w-100" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeModal;
