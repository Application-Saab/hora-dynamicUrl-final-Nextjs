"use client";
import backarrow from "../../assets/backarrow.svg";
import React from "react";
import "./commonpop.css";
import Image from "next/image";

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
            width={24}
            height={24}
            className="popup-back-icon"
            onClick={onClose}
          />

          <h2 className="popup-title">
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
