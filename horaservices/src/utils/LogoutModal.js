import React, { useState } from "react";
import Image from "next/image";
import loginBgImage from "@/assets/bgimage.svg";
import logoutImage from "@/assets/logouticon.svg";
import ArrowImg from "@/assets/arrow.svg";
import successImage from "@/assets/sucesslogin.svg";

const LogoutModal = ({ isOpen, onClose, onLogoutConfirm }) => {
  const [step, setStep] = useState("confirm"); // confirm | success

  if (!isOpen) return null;

const handleConfirm = () => {
  setStep("success");
  onLogoutConfirm();
};

  return (
  <div className="logout-overlay">
  <div className="logout-card">
    <Image
      src={loginBgImage}
      alt="bg"
      fill
      className="logout-bg-img"
    />

    
    {step === "confirm" && (
      <Image
        src={ArrowImg}
        alt="Back"
        width={24}
        height={24}
        className="logout-back-icon"
        onClick={onClose}
      />
    )}

    <div className="logout-content">
      {step === "confirm" && (
        <>
          <Image src={logoutImage} alt="logout"className="logout-icon"/>
          <h2>Confirm Logout</h2>
          <p>Are you sure want to logout?</p>

          <button className="logout-primary-btn" onClick={handleConfirm}>
            CONTINUE
          </button>

        </>
      )}

    {step === "success" && (
  <>
    <div className="logout-success-circle">
      <div className="logout-success-inner">
        <Image
          src={successImage}
          alt="success"
          width={40}
          height={40}
          className="logout-success-img"
        />
      </div>
    </div>

    <h2 className="logout-success-title">Logout Successfully</h2>

   <button
  className="logout-primary-btn"
  onClick={() => {
    setStep("confirm");
    onClose();        // ✅ user ke click par hi close
  }}
>
  Ok
</button>

  </>
)}

    </div>
  </div>
</div>

  );
};

export default LogoutModal;
