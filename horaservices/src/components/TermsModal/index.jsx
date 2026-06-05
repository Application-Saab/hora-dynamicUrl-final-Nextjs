"use client";

import React from "react";
import "./TermsModal.css";
import { getTermsByEventId } from "@/utils/venuedatalist/EventTerms.js";

const TermsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  // const terms = getTermsByEventId(eventId); // now returns array

  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tm-header">
          <h2 className="tm-title">Terms & Conditions</h2>
          <button className="tm-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* <div className="tm-body">

          {terms?.map((section, index) => (
            <React.Fragment key={index}>

              <div className="tm-section">
                <div className="tm-section-header">
                  <span className="tm-icon">{section.icon || "📄"}</span>
                  <h3 className="tm-section-title">{section.title}</h3>
                </div>

                <ul className="tm-list">
                  {section.points.map((item, i) => (
                    <li key={i} className="tm-list-item">
                      <span className="tm-bullet">◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {index !== terms.length - 1 && <div className="tm-divider" />}

            </React.Fragment>
          ))}

        </div> */}

        <div
          className="tm-body"
          dangerouslySetInnerHTML={{
            __html:
              data || "<p>No Terms Available</p>",
          }}
        />

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
