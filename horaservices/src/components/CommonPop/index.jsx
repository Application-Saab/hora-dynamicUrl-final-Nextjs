"use client";
import backarrow from "../../assets/backarrow.svg";
import React from "react";
import "./commonpop.css";
import Image from "next/image";

const CommonPopup = ({
  isOpen,
  onClose,
  title = "Create New Folder",
  children,       // 👈 andar ka dynamic content
  buttonText = "Create",
  onSubmit,
  showButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        
        {/* Header */}
      <div className="popup-header">
  <Image
    src={backarrow}
    alt="Back"
    width={24}
    height={24}
    className="login-back-icon"
    onClick={onClose}
  />

  <h2>{title}</h2>
</div>


        {/* Dynamic Content */}
        <div className="popup-body">
          {children}
        </div>

        {/* Footer */}
        {showButton && (
            <div className="pop-btn-container">
            <button className="popup-btn" onClick={onSubmit}>
            {buttonText}
            </button>
            </div>
          
        )}
      </div>
    </div>
  );
};

export default CommonPopup;
