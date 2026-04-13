"use client";
import React from "react";
import "./commonpop.css";
import Image from "next/image";
import backarrow from "../../assets/backarrow.svg";


const CommonPopup = ({
  isOpen,
  onClose,
  title = "Create New Folder",
  children,
  buttonText = "Create",
  onSubmit,
  showButton = true,
  buttonContent,
  disabled = false,
  popupHeight = 356,
  titleFontSize = "clamp(18px, 4.5vw, 22px)", 
}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container"
        style={{ height: `${popupHeight}px` }}
      >

        {/* Header */}
        <div className="popup-header">
          <Image
            src={backarrow}
            alt="Back"
            width={0}
            height={0}
            className="popup-back-icon"
            onClick={onClose}
          />

          <h2 style={{ fontSize: titleFontSize }} className="popup-title">
            {title}
          </h2>
        </div>


        {/* Dynamic Content */}
        <div className="popup-body">
          {children}
        </div>

        {/* Footer */}
        {showButton && (
          <div className="pop-btn-container">
            <button
              className="popup-btn"
              onClick={onSubmit}
              disabled={disabled}
              style={{
                backgroundColor: disabled ? '#918D91' : '',
                opacity: disabled ? 0.75 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}

            >
              {buttonContent || buttonText}
            </button>
          </div>

        )}
      </div>
    </div>
  );
};

export default CommonPopup;
