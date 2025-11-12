import React, { useEffect, useRef, useState } from "react";
import "./LoginModal.css";
import CustomButton from "../CustomButton";
import { useTimer } from "@/utils/useTimer";
import useApi from "@/hooks/useApi";
import axios from "axios";
import {
  OTP_GENERATE_END_POINT,
  OTP_VERIFY_ENDPOINT,
} from "@/utils/apiconstants";
import CustomModal from "../CustomModal";

const LoginModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [error, setError] = useState({ name: "", phone: "" });

  const { time, resetTimer } = useTimer(30);
  console.log(
    "%c [ time ]-23",
    "font-size:13px; background:pink; color:#bf2c9f;",
    time
  );
  const { loading: sendOtpLoading, makeRequest } = useApi();
  const { loading: verifyOtpLoading, makeRequest: makeVerifyRequest } =
    useApi();

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
      } else {
        setError({ ...newError, phone: "Failed to send OTP. Try again." });
      }
    } catch (err) {
      setError({ ...newError, phone: "Error sending OTP. Please retry." });
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }
    try {
      const response = await makeVerifyRequest(OTP_VERIFY_ENDPOINT, "POST", {
        phone,
        otp,
        role: "customer",
      });

      if (response.status === 200) {
        const { token, data } = response;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("mobileNumber", phone);
        localStorage.setItem("token", token);
        localStorage.setItem("userID", data?._id);

        sendWelcomeMessage(phone);

        setIsOtpSent(false);
        setOtp("");
        setPhone("");
        setName("");
        setOtpError("");
        window.dispatchEvent(new Event("loginStateChange"));
        onClose();
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (err) {
      setOtpError("Error verifying OTP. Please try again.");
    }
  };

  const resendOtp = async () => {
    setOtp("");
    setOtpError("");
    await sendOtp();
  };

  const handleClick = () => {
    if (!isOtpSent) {
      sendOtp();
    } else if (isOtpSent) {
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
                    placeholder="Enter Your Name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError((prev) => ({
                        ...prev,
                        name:
                          e.target.value.length > 0 ? "" : "Name is required!",
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
                <div>
                  <input
                    type="text"
                    placeholder="Enter Number"
                    name="phone"
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
              </>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="login-input-field w-100"
                />
                {/* Otp Error */}
                {otpError && (
                  <p className="login-modal-err-msg text-danger m-1">
                    * {otpError}
                  </p>
                )}

                {/* Timer & Resend Logic */}
                {!otpError && (
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    {time > 0 ? (
                      <p className="login-modal-timer-txt">
                        Resend OTP in {time} sec
                      </p>
                    ) : (
                      <p
                        className="mt-3"
                        style={{ color: "#572381", cursor: "pointer" }}
                        onClick={resendOtp}
                      >
                        Resend OTP
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginBlock: "37px" }}>
            <CustomButton
              title={!isOtpSent ? "Get OTP" : "Verify"}
              buttonClass="login-modal-btn"
              onClick={handleClick}
              disabled={sendOtpLoading || verifyOtpLoading}
              loading={sendOtpLoading || verifyOtpLoading}
            />
          </div>
        </>
      }
    />
  );
};

export default LoginModal;
