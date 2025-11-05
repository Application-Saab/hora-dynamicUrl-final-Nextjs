import React, { useEffect, useRef, useState } from "react";
import "./LoginModal.css";
import CustomButton from "../CustomButton";
import { useTimer } from "@/utils/useTimer";
import useApi from "@/hooks/useApi";
import { OTP_GENERATE_END_POINT } from "@/utils/apiconstants";

const LoginModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  console.log(
    "%c [ phone ]-12",
    "font-size:13px; background:pink; color:#bf2c9f;",
    phone
  );
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { time, isTimeUp, resetTimer } = useTimer(30);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const { data, makeRequest } = useApi();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle mobile number input change
  const handleChangePhone = (e) => {
    const value = e.target.value;
    console.log('%c [ value ]-40', 'font-size:13px; background:pink; color:#bf2c9f;', value)
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
      setError("Please enter a valid mobile number");
    }

    // Reset error message if mobile number length is correct
    if (value.length === 10) {
      setError("");
    }
  };

  // Function to send the WhatsApp message
  const sendWelcomeMessage = async (mobileNumber) => {
    let formattedMobileNumber = mobileNumber;

    // Ensure the mobile number starts with '+91'
    if (!formattedMobileNumber.startsWith("+91")) {
      formattedMobileNumber = "+91" + formattedMobileNumber;
    }

    // Remove any extra spaces or special characters
    formattedMobileNumber = formattedMobileNumber.replace(/\s+/g, "");

    const options = {
      method: "POST",
      url: "https://public.doubletick.io/whatsapp/message/template",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "key_wZpn79uTfV", // Keep this secure in backend
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
                body: { placeholders: ["Hora Services"] }, // Use dynamic placeholders if needed
              },
              templateName: "happy_to_help_v2",
            },
            from: "+917338584828",
            to: formattedMobileNumber, // Send to the formatted mobile number
          },
        ],
      },
    };

    try {
      const response = await axios.request(options);
      console.log("WhatsApp message response:", response.data);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  };

  // Function to send OTP
  const sendOtp = async () => {
    alert("Hello");
    if (!phone) {
      setError("Mobile number is required.");
      return;
    }

    try {
      const response = await makeRequest(`${OTP_GENERATE_END_POINT}`, "POST", {
        phone,
        name,
        role: "customer",
      });

      if (response.data.status === 200) {
        setIsOtpSent(true);
        setError("");
        resetTimer();
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Error sending OTP. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-backdrop">
      <div ref={modalRef} className="login-modal-content w-100">
        <div className="login-modal-body-custom">
          <p className="login-modal-heading">Join The Celebration!</p>
          <p className="login-modal-subheading">
            Enter your mobile number to get started
          </p>
          <div className="d-flex flex-column px-4 w-100 gap-3">
            <div>
              <input
                type="text"
                placeholder="Enter Your Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                className="login-input-field w-100"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter Number"
                name="phone"
                onChange={handleChangePhone}
                className="login-input-field w-100"
              />
            </div>
          </div>
          <div style={{ marginBlock: "37px" }}>
            <CustomButton
              title="Get OTP"
              buttonClass="login-modal-btn"
              onClick={() => {
                !isOtpSent && sendOtp();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
