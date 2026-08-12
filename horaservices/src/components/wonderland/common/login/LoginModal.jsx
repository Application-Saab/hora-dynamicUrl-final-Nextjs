"use client";
import React, { useEffect, useRef, useState } from "react";
import CustomButton from "../CustomButton";
import { useTimer } from "@/utils/useTimer";
import useApi from "@/hooks/useApi";
import {
  ASSIGN_USER_TO_TRACKINGS,
  BASE_URL,
  GET_USER_BY_PHONE,
  OTP_GENERATE_END_POINT,
  OTP_VERIFY_ENDPOINT,
} from "@/utils/apiconstants";
import CustomModal from "../CustomModal";
import { usePathname } from "next/navigation";
import { useUserDetailsStore } from "@/hooks/UserDetailsContext";
import axiosApi from "@/utils/axiosApi";
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";

const LoginModal = ({
  isOpen,
  onClose,
  fromCapsule = false,
  onlyOTP = false,
  setIsVerifiedOTP,
  template = "happy_to_help_v2",
  link = null,
  bgColor = "login-modal-content",
  frompanel = "false",
}) => {
  const modalRef = useRef(null);
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState({});
  const [lastCheckedPhone, setLastCheckedPhone] = useState("");

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [error, setError] = useState({ name: "", phone: "" });
  const [showNameField, setShowNameField] = useState(false);
  const { userDetails } = useUserDetailsStore();

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
  const visitorid = safeGetItem("VISITOR_ID")

  const isWonderlandInternational = pathname?.startsWith(
    "/wonderlandinternational",
  );

  // Auto send OTP when onlyOTP mode is enabled
  useEffect(() => {
    if (!isOpen || !onlyOTP) return;

    const storedPhone = safeGetItem("mobileNumber");

    if (!storedPhone) return;

    setPhone(storedPhone);

    const triggerOtp = async () => {
      try {
        const response = await makeRequest(OTP_GENERATE_END_POINT, "POST", {
          phone: storedPhone,
          name: userDetails?.name || "",
          role: "customer",
          fromWonderland: true,
          fromCapsule: fromCapsule,
          fromWonderlandInternational: isWonderlandInternational,
        });

        if (response.status === 200) {
          setIsOtpSent(true);

          resetTimer();

          setOtp(["", "", "", ""]);
          setOtpError("");

          setTimeout(() => {
            inputsRef.current[0]?.focus();
          }, 300);
        }
      } catch (err) {
        console.log("Auto OTP send failed", err);
      }
    };

    triggerOtp();
  }, [isOpen, onlyOTP]);

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
    let value = e.target.value;

    // Remove spaces
    value = value.replace(/\s/g, "");
    if (isWonderlandInternational) {
      if (/^\d*$/.test(value)) {
        setPhone(value);

        setError((prev) => ({
          ...prev,
          phone: value.length > 0 ? "" : "Mobile number is required",
        }));
      }

      return;
    }

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
    const delayDebounce = setTimeout(async () => {
      if (isWonderlandInternational) {
        if (phone.length >= 4 && !isOtpSent && phone !== lastCheckedPhone) {
          setLastCheckedPhone(phone);

          try {
            let resp = await fetchUserData(
              `${GET_USER_BY_PHONE}/${phone}?isWonderlandInternational=${isWonderlandInternational}`,
              "GET",
            );

            setUserData(resp?.data || {});
            setName(resp?.data?.name || "");
          } catch (err) {
            console.error("Error fetching user details:", err);
          }
        }

        return;
      }

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
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [phone]);

  useEffect(() => {
    if (isWonderlandInternational) {
      if (phone.length < 4) {
        setShowNameField(false);
        return;
      }

      setTimeout(() => {
        setShowNameField(!userData?.name && !fetchUserDataLoading && isFetched);
      }, 150);

      return;
    }

    if (phone.length < 10) {
      setShowNameField(false);
    }

    if (phone.length === 10) {
      setTimeout(() => {
        setShowNameField(!userData?.name && !fetchUserDataLoading && isFetched);
      }, 150);
    }
  }, [
    phone,
    userData,
    fetchUserDataLoading,
    isFetched,
    isWonderlandInternational,
  ]);

  // Send welcome WhatsApp message
  const sendWelcomeMessage = async (mobileNumber, link) => {
    if (!mobileNumber) return false;

    const formattedNumber = mobileNumber.toString().startsWith("+91")
      ? mobileNumber.toString()
      : `+91${mobileNumber}`;

    const options = {
      method: "POST",
      url: "https://public.doubletick.io/whatsapp/message/template",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization:
          "key_fHOm5tEzbfSWRbC29LoZkYd0vpqaU7B22Q2iSL2vgawcN3k0D75iXNSPRen3ie7Qj3L7C6r5EhH4lLYeL1dCtPj9WyQ9wPm2abK1wltW8bYXVR5xvjLfPeQgfRld3ws1lkkRduX6tfrHbmYnbhbYnau3HSfJAylSmBso4m5qjO7vm4YjbhtqMbdkNK2EoNPXqM5SdxThyeGvSlvoA8JCVhGvL98yrocJJ7JfhBasgsEnN7qArGvPdsswdhys",
      },
      data: {
        messages: [
          {
            from: "+917338584828",
            to: formattedNumber,
            content: {
              templateName: "guest_login_2",
              language: "en",
              templateData: {
                body: {
                  placeholders: [link],
                },
              },
            },
          },
        ],
      },
    };

    try {
      const res = await axiosApi.request(options);

      return true;
    } catch (err) {
      console.log("MESSAGE:", err?.message);

      return false;
    }
  };

  const sendWelcomeMessageWonderland = async (mobileNumber) => {
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
        Authorization:
          "key_fHOm5tEzbfSWRbC29LoZkYd0vpqaU7B22Q2iSL2vgawcN3k0D75iXNSPRen3ie7Qj3L7C6r5EhH4lLYeL1dCtPj9WyQ9wPm2abK1wltW8bYXVR5xvjLfPeQgfRld3ws1lkkRduX6tfrHbmYnbhbYnau3HSfJAylSmBso4m5qjO7vm4YjbhtqMbdkNK2EoNPXqM5SdxThyeGvSlvoA8JCVhGvL98yrocJJ7JfhBasgsEnN7qArGvPdsswdhys",
      },
      data: {
        messages: [
          {
            content: {
              language: "en",
              templateData: {
                header: {
                  type: "VIDEO",
                  mediaUrl:
                    "https://data-storage.doubletick.io/org_FGdNfMoTi9/templates/55a8ba99-834e-4f1d-a05b-8ed466cd043a.mp4",
                  filename: "55a8ba99-834e-4f1d-a05b-8ed466cd043a.mp4",
                },
                body: { placeholders: [] },
              },
              templateName: "smart_invite_reminer_1",
            },
            from: "+917338584828",
            to: formattedNumber,
          },
        ],
      },
    };

    try {
      const res = await axiosApi.request(options);
      console.log("WhatsApp message sent:", res.data);
    } catch (err) {
      console.error("WhatsApp message error:", err);
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
        visitorId,
      };
      await axios.patch(
        BASE_URL + ASSIGN_USER_TO_TRACKINGS,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.log(
        "%c [ error ]",
        "font-size:13px; background:pink; color:#bf2c9f;",
        error,
      );
    }
  };

  // Send OTP
  const sendOtp = async () => {
    let newError = { name: "", phone: "" };

    if (!name.trim()) newError.name = "Name is required";
    if (!phone) newError.phone = "Mobile number is required";

    if (!isWonderlandInternational && phone && phone.length !== 10) {
      newError.phone = "Please enter a valid 10-digit number";
    }

    if (newError.name || newError.phone) {
      setError(newError);
      return;
    }

    try {
      const response = await makeRequest(OTP_GENERATE_END_POINT, "POST", {
        phone,
        name,
        role: "customer",
        fromWonderland: true,
        fromCapsule: fromCapsule,
        fromWonderlandInternational: isWonderlandInternational,
      });

      if (response.status === 200 && isWonderlandInternational) {
        const generatedOtp = response?.otp?.toString();

        if (!generatedOtp) {
          setError({
            ...newError,
            phone: "OTP generation failed",
          });
          return;
        }

        try {
          const verifyResponse = await makeVerifyRequest(
            OTP_VERIFY_ENDPOINT,
            "POST",
            {
              phone,
              otp: generatedOtp,
              role: "customer",
            },
          );

          if (verifyResponse.status === 200) {
            const { token, data } = verifyResponse;

            safeSetItem("isLoggedIn", "true");
            safeSetItem("mobileNumber", phone);
            safeSetItem("token", token);
            safeSetItem("userID", data?._id);
            assignVisitorToUserId(data?._id, visitorid);

            if (fromCapsule) {
              sendWelcomeMessage(phone, link);
            }

            if (!fromCapsule && !isWonderlandInternational) {
              sendWelcomeMessageWonderland(phone);
            }

            window.dispatchEvent(new Event("loginStateChange"));

            onClose();
          } else {
            setError({
              ...newError,
              phone: "Login failed. Please try again.",
            });
          }
        } catch (verifyErr) {
          console.log("Silent verify error", verifyErr);

          setError({
            ...newError,
            phone: "Verification failed. Please retry.",
          });
        }

        return;
      }
      if (response.status === 200) {
        setIsOtpSent(true);

        resetTimer();

        setError({
          name: "",
          phone: "",
        });

        setOtp(["", "", "", ""]);
        setOtpError("");

        setTimeout(() => {
          inputsRef.current[0]?.focus();
        }, 300);
      } else {
        setError({
          ...newError,
          phone: "Failed to send OTP. Try again.",
        });
      }
    } catch (err) {
      console.log(err);

      setError({
        ...newError,
        phone: "Error sending OTP. Please retry.",
      });
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
        safeSetItem("isLoggedIn", "true");
        safeSetItem("mobileNumber", phone);
        safeSetItem("token", token);
        safeSetItem("userID", data?._id);
        safeSetItem("userName", data?.name);

        if (fromCapsule) {
          sendWelcomeMessage(phone, link);
        }

        if (!fromCapsule && !isWonderlandInternational) {
          sendWelcomeMessageWonderland(phone);
        }

        onlyOTP && setIsVerifiedOTP(true);
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
    if (!isOtpSent && !onlyOTP) {
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
      modalClass={bgColor}
      bodyClass="login-modal-body"
      disableBackdropClick={true}
      verticalCenter={false}
      body={
        <>
          <p className="login-modal-heading">
            {onlyOTP ? "Access Your Locker" : "Join The Celebration!"}
          </p>
          <p className="login-modal-subheading">
            {onlyOTP
              ? `Enter OTP sent to your number xxxx${phone?.slice(-4)}`
              : "Enter your mobile number to get started"}
          </p>

          <div className="d-flex flex-column w-100 login-input-ctn">
            {(!isOtpSent && !onlyOTP) || isWonderlandInternational ? (
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
              // title={
              //   isWonderlandInternational
              //     ? "Continue"
              //     : !isOtpSent
              //       ? "Get OTP"
              //       : "Verify"
              // }
              title={
                isWonderlandInternational
                  ? "Continue"
                  : !isOtpSent && !onlyOTP
                    ? "Get OTP"
                    : "Verify"
              }
              buttonClass="login-modal-btn"
              onClick={handleClick}
              disabled={
                sendOtpLoading ||
                verifyOtpLoading ||
                (!isWonderlandInternational &&
                  isOtpSent &&
                  otp.join("").length !== 4)
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
