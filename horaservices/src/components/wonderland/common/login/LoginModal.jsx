"use client";
import React, { useEffect, useRef, useState } from "react";
import CustomButton from "../CustomButton";
import { useTimer } from "@/utils/useTimer";
import useApi from "@/hooks/useApi";
import axios from "axios";
import {
  GET_USER_BY_PHONE,
  OTP_GENERATE_END_POINT,
  OTP_VERIFY_ENDPOINT,
} from "@/utils/apiconstants";
import CustomModal from "../CustomModal";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState({});
  const [lastCheckedPhone, setLastCheckedPhone] = useState("");

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [error, setError] = useState({ name: "", phone: "" });
  const [showNameField, setShowNameField] = useState(false);

  const { time, resetTimer, isTimeUp } = useTimer(30);
  const { loading: sendOtpLoading, makeRequest } = useApi();
  const { loading: verifyOtpLoading, makeRequest: makeVerifyRequest } =
    useApi();
  const {
    makeRequest: fetchUserData,
    isFetched,
    loading: fetchUserDataLoading,
  } = useApi();

  const inputsRef = useRef([]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Validate phone input
  const handleChangePhone = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
      setError((prev) => ({
        ...prev,
        phone:
          value.length === 10
            ? ""
            : "Please enter a valid 10-digit mobile number",
      }));
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (phone.length === 10 && !isOtpSent && phone !== lastCheckedPhone) {
        setLastCheckedPhone(phone);
        try {
          let resp = await fetchUserData(
            `${GET_USER_BY_PHONE}/${phone}`,
            "GET",
          );
          setUserData(resp?.data);
          setName(resp?.data?.name || "");
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      }
    };
    fetchUserDetails();
  }, [phone]);

  useEffect(() => {
    if (phone.length < 10) {
      setShowNameField(false);
    }
    if (phone.length === 10) {
      setTimeout(() => {
        setShowNameField(!userData?.name && !fetchUserDataLoading && isFetched);
      }, 150);
    }
  }, [phone, userData, fetchUserDataLoading, isFetched]);

  // Send welcome WhatsApp message
  const sendWelcomeMessage = async (mobileNumber) => {
    if (!mobileNumber) return;
    let formattedNumber = mobileNumber.startsWith("+91")
      ? mobileNumber
      : "+91" + mobileNumber;

    const options = {
      method: "POST",
      url: "https://public.doubletick.io/whatsapp/message/template",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "key_wZpn79uTfV",
      },
      data: {
        messages: [
          {
            content: {
              language: "en",
              templateData: {
                header: {
                  type: "IMAGE",
                  mediaUrl:
                    "https://quickscale-template-media.s3.ap-south-1.amazonaws.com/org_FGdNfMoTi9/2a2f1b0c-63e0-4c3e-a0fb-7ba269f23014.jpeg",
                },
                body: { placeholders: ["Hora Services"] },
              },
              templateName: "happy_to_help_v2",
            },
            from: "+917338584828",
            to: formattedNumber,
          },
        ],
      },
    };

    try {
      const res = await axios.request(options);
      console.log("WhatsApp message sent:", res.data);
    } catch (err) {
      console.error("WhatsApp message error:", err);
    }
  };

  // Send OTP
  const sendOtp = async () => {
    let newError = { name: "", phone: "" };
    if (!name.trim()) newError.name = "Name is required";
    if (!phone) newError.phone = "Mobile number is required";
    if (phone && phone.length !== 10)
      newError.phone = "Please enter a valid 10-digit number";

    if (newError.name || newError.phone) {
      setError(newError);
      return;
    }

    try {
      const response = await makeRequest(OTP_GENERATE_END_POINT, "POST", {
        phone,
        name,
        role: "customer",
      });

      if (response.status === 200) {
        setIsOtpSent(true);
        resetTimer();
        setError({ name: "", phone: "" });
        setOtp(["", "", "", ""]);
        setOtpError("");
        setTimeout(() => inputsRef.current[0]?.focus(), 300);
      } else {
        setError({ ...newError, phone: "Failed to send OTP. Try again." });
      }
    } catch (err) {
      setError({ ...newError, phone: "Error sending OTP. Please retry." });
    }
  };

  // OTP input handlers
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Handle auto-fill (full 4-digit paste or SMS read)
    if (value.length === 4) {
      const splitOtp = value.replace(/\D/g, "").split("").slice(0, 4);
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
          next[index] = "";
        } else if (index > 0) {
          next[index - 1] = "";
          setTimeout(() => inputsRef.current[index - 1]?.focus(), 0);
        }
        return next;
      });
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (pasted.length === 0) return;

    const newOtp = pasted.split("").concat(Array(4 - pasted.length).fill(""));
    setOtp(newOtp);

    setTimeout(() => {
      inputsRef.current[Math.min(pasted.length - 1, 3)]?.focus();
    }, 0);
  };

  // Auto-read SMS OTP (Web OTP API)
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
          const digits = cred.code.replace(/\D/g, "").slice(0, 4).split("");
          setOtp(digits);
          setTimeout(() => inputsRef.current[3]?.focus(), 0);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [isOtpSent]);

  // Focus first OTP box when OTP screen shows
  useEffect(() => {
    if (isOtpSent) {
      setTimeout(() => inputsRef.current[0]?.focus(), 500);
    }
  }, [isOtpSent]);

  // Verify OTP
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      setOtpError("Please enter valid OTP");
      return;
    }

    try {
      const response = await makeVerifyRequest(OTP_VERIFY_ENDPOINT, "POST", {
        phone,
        otp: finalOtp,
        role: "customer",
      });

      if (response.status === 200) {
        const { token, data } = response;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("mobileNumber", phone);
        localStorage.setItem("token", token);
        localStorage.setItem("userID", data?._id);

        // sendWelcomeMessage(phone);

        setIsOtpSent(false);
        setOtp(["", "", "", ""]);
        setOtpError("");
        window.dispatchEvent(new Event("loginStateChange"));
        onClose();
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setOtp(["", "", "", ""]);
        setTimeout(() => inputsRef.current[0]?.focus(), 200);
      }
    } catch (err) {
      setOtpError("Error verifying OTP. Please try again.");
      setOtp(["", "", "", ""]);
      setTimeout(() => inputsRef.current[0]?.focus(), 200);
    }
  };

  const resendOtp = async () => {
    setOtp(["", "", "", ""]);
    setOtpError("");
    await sendOtp();
  };

  const handleClick = () => {
    if (!isOtpSent) {
      sendOtp();
    } else {
      verifyOtp();
    }
  };

  if (!isOpen) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      backdropClass="login-modal-backdrop"
      modalClass="login-modal-content"
      bodyClass="login-modal-body"
      disableBackdropClick={true}
      verticalCenter={false}
      body={
        <>
          <p className="login-modal-heading">Join The Celebration!</p>
          <p className="login-modal-subheading">
            Enter your mobile number to get started
          </p>

          <div className="d-flex flex-column w-100 login-input-ctn">
            {!isOtpSent ? (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Enter Number"
                    value={phone}
                    onChange={handleChangePhone}
                    className="login-input-field w-100"
                  />
                  {error.phone && (
                    <p className="login-modal-err-msg text-danger">
                      * {error.phone}
                    </p>
                  )}
                </div>
                {showNameField && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError((prev) => ({
                          ...prev,
                          name: e.target.value.trim()
                            ? ""
                            : "Name is required!",
                        }));
                      }}
                      className="login-input-field w-100"
                    />
                    {error.name && (
                      <p className="login-modal-err-msg text-danger">
                        * {error.name}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
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

                {/* Timer & Resend */}
                <div
                  className={`otp-bottom-row ${otpError ? "space-between" : "center-align"}`}
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
              </>
            )}
          </div>

          <div style={{ marginBlock: "37px" }}>
            <CustomButton
              title={!isOtpSent ? "Get OTP" : "Verify"}
              buttonClass="login-modal-btn"
              onClick={handleClick}
              disabled={
                sendOtpLoading ||
                verifyOtpLoading ||
                (isOtpSent && otp.join("").length !== 4)
              }
              loading={sendOtpLoading || verifyOtpLoading}
            />
          </div>
        </>
      }
    />
  );
};

export default LoginModal;
