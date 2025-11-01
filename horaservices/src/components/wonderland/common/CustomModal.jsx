"use client";
import React from "react";
import Image from "next/image";
import "./CustomModal.css";

const CustomModal = ({
  isOpen = false,
  onClose = () => {},
  title = "",
  showHeader = true,
  headerIcon = null,
  showCloseButton = true,
  body = null,
  footer = null,
  modalClass = "",
  bodyClass = "",
  backdropClass = "",
  disableBackdropClick = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (
      !disableBackdropClick &&
      e.target.classList.contains("custom-modal-backdrop")
    ) {
      onClose();
    }
  };

  return (
    <div
      className={`custom-modal-backdrop d-flex justify-content-center align-items-center ${backdropClass}`}
      onClick={handleBackdropClick}
    >
      <div className={`custom-modal-content ${modalClass}`}>
        {/* ---------- Header ---------- */}
        {showHeader && (
          <div className="custom-modal-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              {headerIcon && (
                <Image
                  src={headerIcon}
                  alt="Header Icon"
                  width={24}
                  height={24}
                  className="modal-header-icon"
                />
              )}
              {title && <h2 className="modal-title m-0">{title}</h2>}
            </div>

            {showCloseButton && (
              <button className="modal-close-btn" onClick={onClose}>
                ✕
              </button>
            )}
          </div>
        )}

        {/* ---------- Body ---------- */}
        <div className={`custom-modal-body ${bodyClass}`}>{body}</div>

        {/* ---------- Footer (optional) ---------- */}
        {footer && <div className="custom-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default CustomModal;
