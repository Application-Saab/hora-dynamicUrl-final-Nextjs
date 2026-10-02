"use client";

import React, { useState } from "react";
import Image from "next/image";
import loginBgImage from "@/assets/bgimage.webp";
import logoutImage from "@/assets/newlogo.svg";
import ArrowImgback from "@/assets/arrow.svg";
import ArrowImg from "@/assets/arrowicon.svg";
import successImage from "@/assets/newlogo.svg";
import loginLine from "@/assets/loginline.svg";


/* Design classes in dono files se aati hain.
   Path apne folder ke hisaab se adjust karo. */
import "../components/login.css"
import "./logoutmodal.css";

const LogoutModal = ({ isOpen, onClose, onLogoutConfirm }) => {
  const [step, setStep] = useState("confirm"); // confirm | success

  if (!isOpen) return null;

  const handleConfirm = () => {
    setStep("success");
    onLogoutConfirm?.();
  };

  const handleClose = () => {
    setStep("confirm");
    onClose();
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-card login-card--success">
        <Image
          src={loginBgImage}
          alt=""
          fill
          className="login-bg-img"
          priority
        />

        {/* BACK BUTTON (sirf confirm step par) */}
        {step === "confirm" && (
          <button
            type="button"
            className="login-back-btn"
            onClick={handleClose}
            aria-label="Go back"
          >
            <Image src={ArrowImgback} alt="" width={16} height={16} />
          </button>
        )}

        <div className="login-content">
          <div className="success-message">
            {step === "confirm" && (
              <>
                <Image
                  src={logoutImage}
                  alt="Hora"
                  className="logout-image"
                />

                <h2 className="logout-title">
                  Confirm{" "}
                  <span
                    className="logout-title-highlight"
                    style={{ "--login-line": `url(${loginLine.src})` }}
                  >
                    Logout
                  </span>
                </h2>

                <p className="logout-subtitle">Are you sure want to logout</p>

                <button
                  type="button"
                  className="login-primary-btn"
                  onClick={handleConfirm}
                >
                  CONTINUE
                  <Image
                    src={ArrowImg}
                    alt=""
                    width={20}
                    height={20}
                    className="btn-arrow-img"
                  />
                </button>
              </>
            )}

            {step === "success" && (
              <>
                <Image
                  src={successImage}
                  alt="Success"
                  className="logout-image"
                />

                <h2 className="logout-title">Logout Successfully</h2>

                <button
                  type="button"
                  className="login-primary-btn"
                  onClick={handleClose}
                >
                  OK
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;