

"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import {
  BASE_URL,
  OTP_GENERATE_END_POINT,
  API_SUCCESS_CODE,
  OTP_VERIFY_ENDPOINT,
} from "../utils/apiconstants";
import "./login.css";
import { useTimer } from "../utils/useTimer";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import loginImage from "../assets/successimage.png";
import loginBgImage from "../assets/bgimage.svg";
import ArrowImg from "../assets/arrow.svg";
const OtpLogin = ({ setIsModalOpen }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");

  const { time, resetTimer ,isTimeUp} = useTimer(30);
  const inputsRef = useRef([]);

  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- MOBILE INPUT ---------------- */
const handleMobileNumberChange = (e) => {
  const value = e.target.value;
  if (/^\d{0,10}$/.test(value)) {
    setMobileNumber(value);
    setError(""); // typing ke time error clear
  }
};


  /* ---------------- WHATSAPP MESSAGE (OLD) ---------------- */
  const sendWelcomeMessage = async (mobile) => {
    let formatted = mobile.startsWith("+91") ? mobile : "+91" + mobile;

    try {
      await axios.post(
        "https://public.doubletick.io/whatsapp/message/template",
        {
          messages: [
            {
              from: "+917338584828",
              to: formatted,
              content: {
                templateName: "happy_to_help_v2",
                language: "en",
                templateData: {
                  header: {
                    type: "IMAGE",
                    mediaUrl:
                      "https://quickscale-template-media.s3.ap-south-1.amazonaws.com/org_FGdNfMoTi9/2a2f1b0c-63e0-4c3e-a0fb-7ba269f23014.jpeg",
                  },
                  body: { placeholders: ["Hora Services"] },
                },
              },
            },
          ],
        },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: "key_wZpn79uTfV",
          },
        }
      );
    } catch (err) {
      console.error("WhatsApp error", err);
    }
  };

  /* ---------------- SEND OTP (OLD LOGIC) ---------------- */
 const sendOtp = async () => {
  if (mobileNumber.length !== 10) {
    setError("Mobile number must be 10 digits");
    return;
  }

  try {
    const res = await axios.post(
      BASE_URL + OTP_GENERATE_END_POINT,
      {
        phone: mobileNumber,
        role: "customer",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.data.status === API_SUCCESS_CODE) {
      setIsOtpSent(true);
      setError("");
      setOtp(["", "", "", ""]);

      setOtpError("");
      resetTimer();
      setTimeout(() => inputsRef.current[0]?.focus(), 300);
    } else {
      setError("Failed to send OTP");
    }
  } catch {
    setError("Error sending OTP");
  }
};

  /* ---------------- OTP INPUT (BOX UI) ---------------- */
const handleOtpChange = (e, index) => {
  const value = e.target.value.replace(/\D/g, "");

  setOtp((prev) => {
    const next = [...prev];

    // 🔥 agar blank hua → sirf clear
    if (value === "") {
      next[index] = "";
      return next;
    }

    // 🔥 sirf last digit lo
    next[index] = value[value.length - 1];
    return next;
  });

  // 🔥 forward focus only when digit typed
  if (value && index < 3) {
    inputsRef.current[index + 1]?.focus();
  }
};



const handleKeyDown = (e, index) => {
  if (e.key === "Backspace") {
    setOtp((prev) => {
      const next = [...prev];

      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        setTimeout(() => {
          inputsRef.current[index - 1]?.focus();
        }, 0);
      }

      return next;
    });
  }
};





  /* ---------------- VERIFY OTP (OLD LOGIC) ---------------- */
const verifyOtp = async () => {
    const finalOtp = otp.join("");

  if (otp.length !== 4) {
    setOtpError("Please enter valid OTP");
    return;
  }

  try {
    const res = await axios.post(
      BASE_URL + OTP_VERIFY_ENDPOINT,
      {
        phone: mobileNumber,
        role: "customer",
      otp: otp.join(""),

      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.data.status === API_SUCCESS_CODE) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("mobileNumber", mobileNumber);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userID", res.data.data._id);

      window.dispatchEvent(new Event("loginStateChange"));

      setIsUserLoggedIn(true);
      setIsOtpSent(false);
    setOtp(["", "", "", ""]);
;
      setOtpError("");

    } else {
      // 🔥 WRONG OTP
      setOtpError("Invalid OTP");
    setOtp(["", "", "", ""]);

      setTimeout(() => inputsRef.current[0]?.focus(), 200);
    }
  } catch {
    // 🔥 API FAIL / WRONG OTP
    setOtpError("Invalid OTP");
  setOtp(["", "", "", ""]);

    setTimeout(() => inputsRef.current[0]?.focus(), 200);
  }
};


  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
   setOtp(["", "", "", ""]);

    setOtpError("");
    await sendOtp();
  };
const handleBeforeInput = (e, index) => {
  const data = e.data;

  if (!/^\d$/.test(data)) {
    e.preventDefault();
    return;
  }

  e.preventDefault();

  setOtp((prev) => {
    const next = [...prev];
    next[index] = data;
    return next;
  });

  if (index < 3) {
    inputsRef.current[index + 1]?.focus();
  }
};

  /* ---------------- UI ---------------- */
  return (
    <div className="login-popup-overlay">
      <div className="login-card">
  <Image
    src={loginBgImage}
    alt="bg"
    className="login-bg-img"
  />

        {!isUserLoggedIn ? (
          <>
            {/* HEADER */}
            <Image
  src={ArrowImg}
  alt="Back"
  width={24}
  height={24}
  className="login-back-icon"
  onClick={() => {
    if (isOtpSent) {
      setIsOtpSent(false);
      setOtp(["", "", "", ""]);
      setOtpError("");
    } else {
      setIsModalOpen(false);
    }
  }}
/>
              <div className="login-content">
                
            <div className="login-header">
      {/* <AiOutlineArrowLeft
  className="login-back-icon"
  onClick={() => {
    if (isOtpSent) {
      // 🔁 OTP → Get Started
      setIsOtpSent(false);
      setOtp(["", "", "", ""]);
      setOtpError("");
    } else {
      // ❌ Get Started → Close Modal
      setIsModalOpen(false);
    }
  }}
/> */}


              <h1 className="login-title">
                {isOtpSent ? "Verification" : "Get Started"}
              </h1>
              <p className="login-subtitle">
                {isOtpSent
                  ? "Check your phone we have sent you an OTP"
                  : "Login with your mobile number"}
              </p>
            </div>

            {/* MOBILE SCREEN */}
            {!isOtpSent && (
              <>
              <div className="login-mobile-input ">
  <div className="login-country-code">+91</div>

  <input
    type="text"
    value={mobileNumber}
    onChange={handleMobileNumberChange}
    placeholder="Enter your Number"
    className="login-input"
  />
</div>

                {error && <p className="input-error-text">{error}</p>}

                <button className="login-primary-btn" onClick={sendOtp}>
                  Get OTP
                </button>
              </>
            )}

            {/* OTP SCREEN */}
           {/* OTP SCREEN */}
{isOtpSent && (
  <>
    <p className="verify-text">
      OTP sent to <span>(+91) {mobileNumber}</span>
    </p>

    <div
      className={`otp-box-wrapper ${otpError ? "otp-error" : ""}`}
    >
{[0, 1, 2, 3].map((i) => (
  <input
    key={i}
    ref={(el) => (inputsRef.current[i] = el)}
    className="otp-box"
    value={otp[i]}
    type="tel"
    inputMode="numeric"
    autoComplete="one-time-code"
    maxLength={1}
    onChange={(e) => handleOtpChange(e, i)}
    onKeyDown={(e) => handleKeyDown(e, i)}
  />
))}



    </div>
 <div
  className={`otp-bottom-row ${
    otpError ? "space-between" : "center-align"
  }`}
>
  {otpError && (
    <span className="otp-error-text">{otpError}</span>
  )}

  {isTimeUp ? (
    <span className="resend-link" onClick={resendOtp}>
      Resend Code
    </span>
  ) : (
    <span className="login-timer">
      Resend Code in {time} Seconds
    </span>
  )}
</div>



<button className="login-primary-btn" onClick={verifyOtp} disabled={otp.length !== 4} > LOGIN </button>
  </>
)}

        
        </div>  </>
        ) : (
          /* ✅ SUCCESS SCREEN */

           <div className="login-content">
          <div className="success-message">
            <Image src={loginImage} alt="success" className="success-image"/>
            <p>Welcome To Hora </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="login-primary-btn"
            >
              CONTINUE
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpLogin;
