"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import loginImage from "../assets/newlogo.svg";
import loginBgImage from "../assets/bgimage.webp";
import ArrowImg from "@/assets/arrowicon.svg";
import ArrowImgback from "@/assets/arrow.svg";
import axiosApi from "@/utils/axiosApi";
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";
import loginLine from "@/assets/loginline.svg";
import cityNameToSlug from "../utils/Citynametoslug.json";
import { useCity } from "@/utils/cityContext";

/* WhatsApp booking number (country code ke sath, bina + ke) */
const WHATSAPP_BOOKING_NUMBER = "917338584828";
const getWhatsAppBookingLink = (serviceName, cityName) => {
  const service = serviceName ? ` for ${serviceName}` : "";
  const city = cityName ? ` in ${cityName}` : "";
  const text = `Hi, give me offline booking support${service}${city}.`;

  return `https://wa.me/${WHATSAPP_BOOKING_NUMBER}?text=${encodeURIComponent(text)}`;
};

/* "kids-birthday-decoration" -> "kids birthday decoration" */
const slugToText = (slug = "") =>
  decodeURIComponent(slug).replace(/[-_+]+/g, " ").trim();

/* "bangalore" -> "Bangalore" (JSON se naam, nahi mila to capitalize) */
const slugToCityName = (slug = "") => {
  if (!slug) return "";
  const found = Object.entries(cityNameToSlug).find(
    ([, value]) => String(value).toLowerCase() === slug.toLowerCase(),
  );
  const name = found ? found[0] : slug;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/* Checkout route ke hisaab se readable naam (agar URL me category na ho)
   key = pathname se "-checkout" hataya hua, e.g. /book-chef-checkout -> "book-chef" */
const CHECKOUT_SERVICE_LABELS = {
  "book-chef": "chef booking",
  "party-food-delivery-live-catering-buffet": "party food delivery",
  photography: "photography",
};

/* Checkout URL se service + city nikalta hai
   Decoration:  from=/bangalore/balloon-decoration/kids-birthday-decoration/product/...  (catValue bhi aata hai)
   Photography: from=/bangalore/photography-page/baby-shower-photography/product/...     (catValue nahi aata)
   Food:        selectedDeliveryOption=party-food-delivery
   Chef:        sirf pathname (/book-chef-checkout) */
const getBookingContext = (searchParams, pathname = "") => {
  const from = searchParams?.get("from") || "";
  const pathParts = from.split("/").filter(Boolean);

  const citySlug = pathParts[0] || "";
  const isKnownCity = Object.values(cityNameToSlug)
    .map((v) => String(v).toLowerCase())
    .includes(citySlug.toLowerCase());

  /* from path: /city/section/category/product/name -> category 3rd segment hai */
  const categoryFromPath =
    pathParts[2] && pathParts[2].toLowerCase() !== "product" ? pathParts[2] : "";

  /* Pathname se: /book-chef-checkout -> "book-chef" -> label */
  const routeKey = (pathname || "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/-checkout$/i, "")
    .toLowerCase();
  const routeLabel =
    CHECKOUT_SERVICE_LABELS[routeKey] ||
    (routeKey && routeKey !== "checkout" ? routeKey : "");

  /* Pehla meaningful (non-empty, sirf number nahi) value lo.
     orderType me kabhi "2" jaisa number aata hai, isliye wo skip hota hai. */
  const candidates = [
    searchParams?.get("catValue"),
    categoryFromPath,
    searchParams?.get("subCategory"),
    searchParams?.get("selectedDeliveryOption"),
    searchParams?.get("selectedOption"),
    routeLabel,
    searchParams?.get("orderType"),
  ];
  const service =
    candidates.find((v) => v && !/^\d+$/.test(String(v).trim())) || "";

  return {
    service: slugToText(service),
    city: isKnownCity ? slugToCityName(citySlug) : "",
  };
};

/* ---------------- SMALL INLINE ICONS ---------------- */
const WhatsAppIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2zm0 18.1c-1.5 0-2.95-.4-4.2-1.15l-.3-.18-3.1.88.9-3.02-.2-.31A8.1 8.1 0 1 1 12.04 20.1zm4.45-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06a6.6 6.6 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.19 3.7.59.25 1.05.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="3" y="14" width="4" height="6" rx="1.5" />
    <rect x="17" y="14" width="4" height="6" rx="1.5" />
  </svg>
);

const OtpLogin = ({
  setIsModalOpen,
  fromCheckout = false,
  backIconHidden = false,
  extraVerifyData = {},
  serviceName = "",
  cityName = "",
}) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const pathname = usePathname();
  const visitorid = safeGetItem("VISITOR_ID");

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

  /* WhatsApp button sirf checkout page par dikhega */
  const isCheckoutPage = pathname?.includes("checkout") || fromCheckout;

  /* Dynamic WhatsApp link (service + city ke saath) */
  const searchParams = useSearchParams();
  const bookingContext = getBookingContext(searchParams, pathname);
  /* City: prop -> URL -> header me selected city (food checkout me URL me city nahi hoti) */
  const cityCtx = useCity();
  const whatsappLink = getWhatsAppBookingLink(
    serviceName || bookingContext.service,
    cityName || bookingContext.city || cityCtx?.selectedCityName || "",
  );

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
      setError("");
    }
  };

  /* ---------------- WHATSAPP WELCOME MESSAGE ----------------
     NOTE: API key frontend me nahi honi chahiye. Best: is call ko
     backend me move karo. Tab tak key .env.local se aayegi:
     NEXT_PUBLIC_DOUBLETICK_KEY=your_new_key
     (purani key rotate kar do, wo code me expose ho chuki hai)
  ------------------------------------------------------------ */
  const sendWelcomeMessage = async (mobile) => {
    const formatted = mobile.startsWith("+91") ? mobile : "+91" + mobile;

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
                      parameter: "https://horaservices.com/",
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_DOUBLETICK_KEY,
          },
        },
      );
    } catch (err) {
      console.error("WhatsApp error", err);
    }
  };

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
    if (mobileNumber.length !== 10) {
      setError("Mobile number must be 10 digits");
      return;
    }

    try {
      const payload = {
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

    // Full OTP autofill (Android / iOS)
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
          // digit hai -> sirf clear, focus wahi
          next[index] = "";
        } else if (index > 0) {
          // empty hai -> previous pe jao
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
      const payload = { userId, visitorId };
      await axiosApi.patch(BASE_URL + ASSIGN_USER_TO_TRACKINGS, payload, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.log("assignVisitorToUserId error", err);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
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
          otp: finalOtp,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      if (res.data.status === API_SUCCESS_CODE) {
        safeSetItem("isLoggedIn", "true");
        safeSetItem("mobileNumber", mobileNumber);
        safeSetItem("token", res.data.token);
        safeSetItem("refreshToken", res.data.refreshToken);
        safeSetItem("userID", res.data.data._id);
        sendWelcomeMessage(mobileNumber);
        assignVisitorToUserId(res.data.data._id, visitorid);

        window.dispatchEvent(new Event("loginStateChange"));

        setIsUserLoggedIn(true);
        setIsOtpSent(false);
        setOtp(["", "", "", ""]);
        setOtpError("");
      } else {
        setOtpError("Invalid OTP");
        setOtp(["", "", "", ""]);
        setTimeout(() => inputsRef.current[0]?.focus(), 200);
      }
    } catch {
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

    setOtp(pasted.split(""));

    setTimeout(() => {
      inputsRef.current[3]?.focus();
    }, 0);
  };

  /* ---------------- BACK BUTTON ---------------- */
  const handleBack = () => {
    // Success screen: sirf modal band karo (user login ho chuka hai)
    if (isUserLoggedIn) {
      setIsModalOpen(false);
      return;
    }

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
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (isOtpSent) {
      const t = setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isOtpSent]);

  // Web OTP API (Android Chrome SMS autofill)
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
          setOtp(cred.code.slice(0, 4).split(""));
          setTimeout(() => {
            inputsRef.current[3]?.focus();
          }, 0);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [isOtpSent]);

  const maskedNumber =
    mobileNumber.length === 10
      ? `${mobileNumber.slice(0, 2)}*****${mobileNumber.slice(-3)}`
      : mobileNumber;

  /* ---------------- UI ---------------- */
  return (
    <div className="login-popup-overlay">
      <div
        className={`login-card ${isUserLoggedIn ? "login-card--success" : ""}`}
      >
        <Image src={loginBgImage} alt="" className="login-bg-img" priority />

        {/* BACK BUTTON (login, OTP aur success, teeno screens par) */}
        {!backIconHidden && (
          <button
            type="button"
            className="login-back-btn"
            onClick={handleBack}
            aria-label="Go back"
          >
            <Image src={ArrowImgback} alt="" width={16} height={16} />
          </button>
        )}

        {!isUserLoggedIn ? (
          <div className="login-content">
            {/* HEADER */}
            <div className="login-header">
              <p className="login-welcome">Welcome to HORA</p>

              <h1 className="login-title">
                {isOtpSent ? (
                  <span
                    className="title-highlight"
                    style={{ "--login-line": `url(${loginLine.src})` }}
                  >
                    Verification
                  </span>
                ) : (
                  <>
                    Get{" "}
                    <span
                      className="title-highlight"
                      style={{ "--login-line": `url(${loginLine.src})` }}
                    >
                      Started
                    </span>
                  </>
                )}
              </h1>

              <p className="login-subtitle">
                {isOtpSent
                  ? "Check your phone we have sent you an OTP"
                  : isCheckoutPage
                    ? "Login with your mobile number or choose WhatsApp booking for quick support."
                    : "Login with your mobile number"}
              </p>
            </div>

            {/* MOBILE SCREEN */}
            {!isOtpSent && (
              <>
                <div className="login-mobile-input">
                  <div className="login-country-code">+91</div>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    placeholder="Enter Number"
                    className={`login-input ${error ? "input-error" : ""}`}
                  />
                </div>

                {error && <p className="input-error-text">{error}</p>}

                <button
                  type="button"
                  className="login-primary-btn"
                  onClick={sendOtp}
                >
                  Get OTP
                  <Image
                    src={ArrowImg}
                    alt=""
                    width={20}
                    height={20}
                    className="btn-arrow-img"
                  />
                </button>

                {/* WhatsApp: sirf checkout page par */}
                {isCheckoutPage && (
                  <>
                    <div className="login-or">
                      <span>OR</span>
                    </div>

                    <a
                      className="login-whatsapp-btn"
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon />
                      <span className="whatsapp-text">
                        <strong>Book On WhatsApp</strong>
                        <small>Quick booking . Instant support</small>
                      </span>

                      <Image
                        src={ArrowImg}
                        alt=""
                        width={22}
                        height={22}
                        className="btn-arrow-img whatsapp-arrow"
                      />
                    </a>
                  </>
                )}
              </>
            )}

            {/* OTP SCREEN */}
            {isOtpSent && (
              <>
                <p className="verify-text">
                  <span>(+91) {maskedNumber}</span>
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
                  className={`otp-bottom-row ${
                    otpError ? "space-between" : "center-align"
                  }`}
                >
                  {otpError && (
                    <span className="otp-error-text">{otpError}</span>
                  )}

                  {isTimeUp ? (
                    <span
                      className="resend-link"
                      role="button"
                      tabIndex={0}
                      onClick={resendOtp}
                      onKeyDown={(e) => e.key === "Enter" && resendOtp()}
                    >
                      Resend Code
                    </span>
                  ) : (
                    <span className="login-timer">
                      Resend Code in {time} Seconds
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="login-primary-btn"
                  onClick={verifyOtp}
                  disabled={otp.join("").length !== 4}
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

            {/* FOOTER TRUST ROW */}
            <div className="login-footer">
              <span>
                <ShieldIcon /> Secure Login
              </span>
              <i className="footer-divider" />
              <span>
                <BoltIcon /> Fast &amp; Easy
              </span>
              <i className="footer-divider" />
              <span>
                <HeadsetIcon /> 24/7 Support
              </span>
            </div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div className="login-content">
            <div className="success-message">
              <Image
                src={loginImage}
                alt="Logged in"
                className="success-image"
              />

              <h2
                className="success-title"
                style={{ "--login-line": `url(${loginLine.src})` }}
              >
                Welcome to Hora
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="login-primary-btn"
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

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpLogin;