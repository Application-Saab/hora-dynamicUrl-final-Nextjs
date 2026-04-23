"use client";

import React from "react";
import "./TermsModal.css";
import { getTermsByEventId } from "@/utils/venuedatalist/EventTerms.js";


const TermsModal = ({ isOpen, onClose, eventId }) => {
  if (!isOpen) return null;

  const terms = getTermsByEventId(eventId);
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
