import React, { useEffect, useRef, useState } from "react";
import "./CreateInviteModal.css";
import CustomModal from "../common/CustomModal";

const TimeModal = ({ show, onClose, selectedTime, setSelectedTime }) => {
  const modalRef = useRef(null);
  const [hour, setHour] = useState(6);
  const [minute, setMinute] = useState(30);
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

  // Set wheel to selectedTime when modal opens
  useEffect(() => {
    if (show && selectedTime) {
      const [time, per] = selectedTime.split(" ");
      const [h, m] = time.split(":");
      setHour(parseInt(h, 10));
      setMinute(parseInt(m, 10));
      setPeriod(per);
    }
  }, [show, selectedTime]);

  if (!show) return null;

  const handleSave = () => {
    const formatted = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")} ${period}`;
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
    <CustomModal
      isOpen={show}
      onClose={onClose}
      verticalCenter={false}
      showHeader={false}
      modalClass="calendar-modal-body"
      bodyClass="p-0"
      body={
        <>
      <div ref={modalRef} className="custom-time-modal">
         <h3 className="time-modal-title">Set time</h3>

         <div className="time-wheel-container my-5">
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
           <Wheel range={["AM", "PM"]} value={period} setValue={setPeriod} />
         </div>

         <div className="time-modal-actions mt-5">
           <button className="cancel-btn w-100" onClick={onClose}>
             Cancel
           </button>
           <button className="save-btn w-100" onClick={handleSave}>
             Save
           </button>
         </div>
      </div>
        </>
      }
    />
  );
};

export default TimeModal;
