"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import "./CustomModal.css";
import BackArrow from "@/assets/BackArrowSvg.svg";

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
  // Lock background scroll
  useEffect(() => {
    let scrollY = 0;

    if (isOpen && disableBgScroll) {
      // Save current scroll position
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    }

    if (!isOpen && disableBgScroll) {
      // Restore scroll position
      const y = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, -parseInt(y || "0"));
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [isOpen, disableBgScroll]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (
      !disableBackdropClick &&
      e.target.classList.contains("common-custom-modal-backdrop")
    ) {
      onClose();
    }
  };

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
