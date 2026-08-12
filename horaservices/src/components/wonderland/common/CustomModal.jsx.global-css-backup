"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import "./CustomModal.css";
import BackArrow from "@/assets/wonderland/BackArrowSvg.svg";

const CustomModal = ({
  isOpen = false,
  onClose = () => {},
  title = "",
  body = null,
  modalClass = "",
  bodyClass = "",
  backdropClass = "",
  footer = null,
  showHeader = true,
  headerIcon = null,
  disableBackdropClick = false,
  showCloseButton = false,
  verticalCenter = true,
  disableBgScroll = true,
}) => {
  // Helper function for clean reset
  const resetBodyScrollStyles = () =>
    Object.assign(document.body.style, {
      position: "",
      top: "",
      left: "",
      right: "",
      overflow: "",
      width: "",
    });

  useEffect(() => {
    let scrollY = 0;

    if (isOpen && disableBgScroll) {
      scrollY = window.scrollY;

      Object.assign(document.body.style, {
        position: "fixed",
        top: `-${scrollY}px`,
        left: "0",
        right: "0",
        overflow: "hidden",
        width: "100%",
      });
    }

    if (!isOpen && disableBgScroll) {
      const y = document.body.style.top;
      resetBodyScrollStyles();
      window.scrollTo(0, -parseInt(y || "0"));
    }

    // Cleanup on unmount
    return () => resetBodyScrollStyles();
  }, [isOpen, disableBgScroll]);

  const handleBackdropClick = (e) => {
    if (
      !disableBackdropClick &&
      e.target.classList.contains("common-custom-modal-backdrop")
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div
      className={`common-custom-modal-backdrop ${
        verticalCenter && "align-items-center p-0"
      }  ${backdropClass}`}
      onClick={handleBackdropClick}
    >
      <div className={`common-custom-modal-content ${modalClass}`}>
        {/* ---------- Header ---------- */}
        {showHeader && (
          <div className="common-custom-modal-header d-flex align-items-center justify-content-between">
            <Image
              src={headerIcon || BackArrow}
              alt="Header Icon"
              width={24}
              height={24}
              className="common-modal-header-icon"
              onClick={onClose}
            />
            {title && <h2 className="common-modal-title m-0 p-0">{title}</h2>}

            {showCloseButton && (
              <button className="common-modal-close-btn" onClick={onClose}>
                ✕
              </button>
            )}
          </div>
        )}

        {/* ---------- Body ---------- */}
        <div className={`common-custom-modal-body ${bodyClass}`}>{body}</div>

        {/* ---------- Footer (optional) ---------- */}
        {footer && <div className="common-custom-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default CustomModal;
