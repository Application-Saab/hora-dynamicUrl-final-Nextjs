"use client";
import { useEffect, useRef, useState } from "react";
import DefaultTemplate from "@/assets/NewDefaultTemplate.png";
import useScreenSize from "@/hooks/useScreenSize";

const TemplateRenderer = ({
  fetchEventLoading,
  eventDetails,
  orderDetails,
  baseFontSize,
  isLandingPage = true,
}) => {
  const textRef = useRef(null);
  const [dynamicFontSize, setDynamicFontSize] = useState("");
  const { width } = useScreenSize();

  // 🧩 Get base font style dynamically
  const getBaseFontStyles = () => {
    if (typeof baseFontSize === "object" && baseFontSize !== null) {
      if (width >= 390)
        return { fontSize: baseFontSize.large || "2.5rem", lineHeight: "40px", top: "38%" };
      else if (width >= 360)
        return { fontSize: baseFontSize.medium || "2rem", lineHeight: "34px", top: "40%" };
      else return { fontSize: baseFontSize.small || "1.7rem", lineHeight: "30px", top: "42%" };
    }

    if (typeof baseFontSize === "string")
      return { fontSize: baseFontSize, lineHeight: "40px", top: "40%" };

    if (width >= 390) return { fontSize: "2.5rem", lineHeight: "45px", top: "38%" };
    else if (width >= 360) return { fontSize: "2rem", lineHeight: "42px", top: "40%" };
    else return { fontSize: "1.7rem", lineHeight: "34px", top: "42%" };
  };

  const [baseStyles, setBaseStyles] = useState(getBaseFontStyles());

  useEffect(() => {
    setBaseStyles(getBaseFontStyles());
  }, [width, baseFontSize]);

  // ✨ Adjust font size for shorter/longer names
  useEffect(() => {
    if (!eventDetails?.hostName) return;
    const baseFontRem = parseFloat(baseStyles.fontSize);
    if (eventDetails.hostName.length <= 14)
      setDynamicFontSize((baseFontRem + 0.5).toFixed(2) + "rem");
    else setDynamicFontSize(baseStyles.fontSize);
  }, [eventDetails?.hostName, baseStyles]);

const imageUrl =
  orderDetails?.externalTemplateImageUrl ||
  orderDetails?.Image ||
  orderDetails?.hostImage ||
  orderDetails?.imageUrl ||
  DefaultTemplate.src;

  return (
    <div
      className="default-template-wrapper"
      style={{
        paddingInline: !isLandingPage ? "25px" : "",
        textAlign: "center",
      }}
    >
      {!fetchEventLoading ? (
        <>
          <div
            className="template-preview-container"
            style={{
              position: "relative",
              display: "inline-block",
              width: "100%",
              maxWidth: "450px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* 🖼️ Render template image */}
            <img
              src={imageUrl}
              alt="Invitation Template"
              className="default-invite-image"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />

         
{imageUrl === DefaultTemplate.src && eventDetails?.hostName && (
  <div
    ref={textRef}
    className="default-template-text"
    style={{
      position: "absolute",
      top: baseStyles.top,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: dynamicFontSize,
      lineHeight: baseStyles.lineHeight,
      fontWeight: 700,
      color: "#fff",
      textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
      width: "100%",
      textAlign: "center",
      paddingInline: "20px",
      fontFamily: "'Great Vibes', cursive",
      pointerEvents: "auto",
    }}
  >
    {eventDetails?.hostName}
  </div>
)}

          </div>
        </>
      ) : (
        <div className="placeholder-glow mb-4">
          <div
            className="placeholder w-100"
            style={{ height: "200px", borderRadius: "10px" }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TemplateRenderer;
