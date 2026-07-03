import React, { useState } from "react";
import { X, MapPin } from "lucide-react";
import "./PinCodeBottomSheet.css";

export default function PinCodeBottomSheet({ isOpen, onClose }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handlePinChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(digitsOnly);
    setError("");
    setStatus("");
  };

  const handleCheck = () => {
    if (pin.length !== 6) {
      setError("Please enter a valid 6-digit PIN code.");
      setStatus("");
      return;
    }
    setError("");
    setStatus("Checking availability…");
  };

  if (!isOpen) return null;

  return (
    <div className="pcs-device">
      <div className="pcs-overlay" onClick={onClose} />

      <button className="pcs-close-btn" onClick={onClose} aria-label="Close">
        <X size={16} strokeWidth={2.4} color="#1a1a1a" />
      </button>

      <div className="pcs-sheet">
        <div className="pcs-icon-badge">
          <MapPin size={28} strokeWidth={2} color="#9c4a8c" />
        </div>

        <h1>Enter Your PIN Code</h1>

        <p className="pcs-subtitle">
          Please enter your 6-digit PIN code to check availability in your
          area.
        </p>

        <input
          type="text"
          inputMode="numeric"
          value={pin}
          onChange={handlePinChange}
          placeholder="Type PIN CODE"
          maxLength={6}
          className={`pcs-pin-input ${error ? "pcs-input-error" : ""}`}
        />

        <p className="pcs-privacy-note">
          We use your PIN code only to show available services near you.
        </p>

        <button className="pcs-check-btn" onClick={handleCheck}>
          Check Availability
        </button>

        {(error || status) && (
          <p className={`pcs-message ${error ? "pcs-error" : "pcs-success"}`}>
            {error || status}
          </p>
        )}
      </div>
    </div>
  );
}