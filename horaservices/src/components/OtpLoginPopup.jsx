"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BASE_URL,
  OTP_GENERATE_END_POINT,
  API_SUCCESS_CODE,
  OTP_VERIFY_ENDPOINT,
  ASSIGN_USER_TO_TRACKINGS,
} from "../utils/apiconstants";
import "./login.css";
import { useTimer } from "../utils/useTimer";
import Image from "next/image";
import loginImage from "../assets/sucesslogin.svg";
import loginBgImage from "../assets/bgimage.svg";
import ArrowImg from "../assets/arrow.svg";
import axiosApi from "@/utils/axiosApi";
import { safeSetItem } from "@/utils/safeStorage";

const OtpLogin = ({ setIsModalOpen, fromCheckout = false, backIconHidden = false, extraVerifyData = {} }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const pathname = usePathname();
  const visitorid = safeGetItem("VISITOR_ID")
  const isWonderland =
    pathname === "/wonderland" ||
    pathname === "/wonderland/create-invite-template" ||
    pathname === "/templates" ||
    pathname?.startsWith("/chat") ||
    pathname === "/about" ||
    pathname === "/accounts" ||
    pathname === "/services" ||
    pathname === "/wonderland/invite";

  const isWonderlandPath = pathname?.startsWith("/wonderland") || isWonderland;
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");

  const { time, resetTimer, isTimeUp } = useTimer(30);
  const inputsRef = useRef([]);
  const router = useRouter();
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
      await axiosApi.post(
        "https://public.doubletick.io/whatsapp/message/template",
        {
          messages: [
            {
              from: "+917338584828",
              to: formatted,
              content: {
                templateName: "happy_to_help_v4",
                language: "en",
                templateData: {
                  header: {
                    type: "IMAGE",
                    mediaUrl:
                      "https://quickscale-template-media.s3.ap-south-1.amazonaws.com/org_FGdNfMoTi9/2a2f1b0c-63e0-4c3e-a0fb-7ba269f23014.jpeg",
                  },
                  body: { placeholders: ["Hora Services"] },
                  buttons: [
                    {
                      type: "URL",
                      parameter: "https://horaservices.com/"
                    }
                  ]
                },
              },
            },
          ],
        },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: "key_fHOm5tEzbfSWRbC29LoZkYd0vpqaU7B22Q2iSL2vgawcN3k0D75iXNSPRen3ie7Qj3L7C6r5EhH4lLYeL1dCtPj9WyQ9wPm2abK1wltW8bYXVR5xvjLfPeQgfRld3ws1lkkRduX6tfrHbmYnbhbYnau3HSfJAylSmBso4m5qjO7vm4YjbhtqMbdkNK2EoNPXqM5SdxThyeGvSlvoA8JCVhGvL98yrocJJ7JfhBasgsEnN7qArGvPdsswdhys",
          },
        },
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
      let payload = {
        phone: mobileNumber,
        role: "customer",
        fromWonderland: isWonderlandPath ? true : false,
        ...extraVerifyData,
      };
      const res = await axiosApi.post(BASE_URL + OTP_GENERATE_END_POINT, payload, {
        headers: { "Content-Type": "application/json" },
      });

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
    const value = e.target.value;

    // 🔥 FULL OTP autofill case (Android / iOS)
    if (value.length === 4) {
      const splitOtp = value.split("").slice(0, 4);
      setOtp(splitOtp);
      inputsRef.current[3]?.focus();
      return;
    }

    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    setOtpError("");

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      setOtp((prev) => {
        const next = [...prev];

        if (next[index]) {
          // 🔥 digit hai → sirf clear, focus wahi
          next[index] = "";
        } else if (index > 0) {
          // 🔥 empty hai → previous pe jao
          next[index - 1] = "";
          setTimeout(() => {
            inputsRef.current[index - 1]?.focus();
          }, 0);
        }

        return next;
      });
    }
  };

  const assignVisitorToUserId = async (userId, visitorId) => {
    if (!userId || !visitorId) {
      console.log("userId and visitorId are required");
      return;
    }

    try {
      let payload = {
        userId,
        visitorId
      };
      const res = await axiosApi.patch(BASE_URL + ASSIGN_USER_TO_TRACKINGS, payload, {
        headers: { "Content-Type": "application/json" },
      });
    } catch(error) {
      console.log('%c [ error ]', 'font-size:13px; background:pink; color:#bf2c9f;', error)
    }
  };

  /* ---------------- VERIFY OTP (OLD LOGIC) ---------------- */
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      setOtpError("Please enter valid OTP");
      return;
    }
    try {
      const res = await axiosApi.post(
        BASE_URL + OTP_VERIFY_ENDPOINT,
        {
          phone: mobileNumber,
          role: "customer",
          otp: otp.join(""),
        },
        { headers: { "Content-Type": "application/json" } },
      );

      if (res.data.status === API_SUCCESS_CODE) {
        safeSetItem("isLoggedIn", "true");
        safeSetItem("mobileNumber", mobileNumber);
        safeSetItem("token", res.data.token);
        safeSetItem("userID", res.data.data._id);
        sendWelcomeMessage(mobileNumber);
        assignVisitorToUserId(res.data.data._id, visitorid)

        window.dispatchEvent(new Event("loginStateChange"));

        setIsUserLoggedIn(true);
        setIsOtpSent(false);
        setOtp(["", "", "", ""]);
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

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pasted.length < 4) return;

    const newOtp = pasted.split("");

    setOtp(newOtp);

    // 🔥 last box pe focus
    setTimeout(() => {
      inputsRef.current[3]?.focus();
    }, 0);
  };

  useEffect(() => {
    if (isOtpSent) {
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 500);
    }
  }, [isOtpSent]);
  useEffect(() => {
    if (!isOtpSent) return;

    if (!("OTPCredential" in window)) return;

    const controller = new AbortController();

    navigator.credentials
      .get({
        otp: { transport: ["sms"] },
        signal: controller.signal,
      })
      .then((cred) => {
        if (cred?.code) {
          const digits = cred.code.slice(0, 4).split("");
          setOtp(digits);

          // 🔥 last box focus
          setTimeout(() => {
            inputsRef.current[3]?.focus();
          }, 0);
        }
      })
      .catch(() => { });

    return () => controller.abort();
  }, [isOtpSent]);

  /* ---------------- UI ---------------- */
  return (
    <div className="login-popup-overlay">
      <div className="login-card">
        <Image src={loginBgImage} alt="bg" className="login-bg-img" />

        {!isUserLoggedIn ? (
          <>
            {/* HEADER */}
            {!backIconHidden &&
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
    return;
  }

  setIsModalOpen(false);
  if (fromCheckout) {
    router.back();
  }
}}

            />
}
            <div className="login-content">
              <div className="login-header">
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
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        onChange={(e) => handleOtpChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={handleOtpPaste}
                      />
                    ))}
                  </div>
                  <div
                    className={`otp-bottom-row ${otpError ? "space-between" : "center-align"
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

                  <button
                    className="login-primary-btn"
                    onClick={verifyOtp}
                    disabled={otp.join("").length !== 4}
                  >
                    LOGIN
                  </button>
                </>
              )}
            </div>{" "}
          </>
        ) : (
          /* ✅ SUCCESS SCREEN */

          <div className="login-content">
            <div className="success-message">
              <Image src={loginImage} alt="success" className="success-image" />
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
