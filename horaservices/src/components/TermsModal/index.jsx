"use client";

import React from "react";
import "./TermsModal.css";

const TERMS_DATA = {
  default: {
    kids: [
      "Below 5 yrs — Non chargeable",
      "5 to 10 yrs — Half charge",
      "Above 10 yrs — Count as an adult",
    ],
    billing: [
      "Billing will be done at the agreed rate for the guaranteed number of guests or the actual number of guests present, whichever is higher. The minimum guarantee, once confirmed, cannot be reduced.",
      "The quoted rates are applicable exclusively for the above-mentioned event and shall not be valid for future events.",
      "Food will be prepared for up to 110% of the guaranteed number of guests.",
    ],
    payment: [
      "A 50% advance payment is required at least to confirm the booking.",
      "The remaining 50% balance must be settled before the event.",
      "Any additional charges (if applicable) must be settled immediately after the event by cash, UPI or credit card.",
      "Should you have any questions or require further clarification, please do not hesitate to reach out to me. I am more than happy to assist you.",
    ],
  },
};

const TermsModal = ({ isOpen, onClose, eventId }) => {
  if (!isOpen) return null;

  // Future mein eventId se alag terms load kar sakte ho
  const terms = TERMS_DATA[eventId] || TERMS_DATA.default;

  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm-sheet" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="tm-header">
          <h2 className="tm-title">Terms &amp; Conditions</h2>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        <div className="tm-body">

          {/* Kids Policy */}
          <div className="tm-section">
            <div className="tm-section-header">
              <span className="tm-icon">👶</span>
              <h3 className="tm-section-title">Kids Policy</h3>
            </div>
            <ul className="tm-list">
              {terms.kids.map((item, i) => (
                <li key={i} className="tm-list-item">
                  <span className="tm-bullet">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="tm-divider" />

          {/* Billing Instructions */}
          <div className="tm-section">
            <div className="tm-section-header">
              <span className="tm-icon">🧾</span>
              <h3 className="tm-section-title">Billing Instructions</h3>
            </div>
            <ul className="tm-list">
              {terms.billing.map((item, i) => (
                <li key={i} className="tm-list-item">
                  <span className="tm-bullet tm-bullet--gold">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="tm-divider" />

          {/* Payment Terms */}
          <div className="tm-section">
            <div className="tm-section-header">
              <span className="tm-icon">💳</span>
              <h3 className="tm-section-title">Confirmation &amp; Payment Terms</h3>
            </div>
            <ul className="tm-list">
              {terms.payment.map((item, i) => (
                <li key={i} className="tm-list-item">
                  <span className="tm-bullet tm-bullet--gold">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="tm-footer">
          <button className="tm-accept-btn" onClick={onClose}>
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;
