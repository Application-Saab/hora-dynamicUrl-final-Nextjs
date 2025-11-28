
"use client";
import { useEffect, useRef, useState } from "react";
import DefaultTemplate from "@/assets/wonderland/NewDefaultTemplate.png";
import useScreenSize from "@/hooks/useScreenSize";
import TemplatecardSkeleton from "../TemplateSkeleton/templatecardSkeleton";
import { mobileBreakPoints } from "@/utils/constants";

const TemplateRenderer = ({
  fetchEventLoading,
  eventDetails,
  orderDetails,
  baseFontSize,
  isLandingPage = true,
  templatewrapperclass,
  enableHeightOverride = false,
}) => {
  const textRef = useRef(null);
  const [dynamicFontSize, setDynamicFontSize] = useState("");
  const { width } = useScreenSize();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [templateSizeClass, setTemplateSizeClass] = useState(""); // ADD

  const getBaseFontStyles = () => {
    if (typeof baseFontSize === "object" && baseFontSize !== null) {
      if (width >= mobileBreakPoints?.medium) {
        return {
          fontSize: baseFontSize.large || "2.5rem",
          lineHeight: baseFontSize.large ? "40px" : "45px",
          top: "38%",
        };
      } else if (width >= mobileBreakPoints?.small) {
        return {
          fontSize: baseFontSize.medium || "2rem",
          lineHeight: baseFontSize.medium ? "34px" : "42px",
          top: "40%",
        };
      } else {
        return {
          fontSize: baseFontSize.small || "1.7rem",
          lineHeight: baseFontSize.small ? "25px" : "34px",
          top: "42%",
        };
      }
    }

    if (typeof baseFontSize === "string")
      return { fontSize: baseFontSize, lineHeight: "40px", top: "40%" };

    if (width >= mobileBreakPoints?.medium) {
      return {
        fontSize: "2.5rem",
        lineHeight: "45px",
        top: "38%",
      };
    } else if (width >= mobileBreakPoints?.small) {
      return {
        fontSize: "2rem",
        lineHeight: "42px",
        top: "40%",
      };
    } else {
      return {
        fontSize: "1.7rem",
        lineHeight: "34px",
        top: "42%",
      };
    }
  };

  const [baseStyles, setBaseStyles] = useState(getBaseFontStyles());

  useEffect(() => {
    setBaseStyles(getBaseFontStyles());
  }, [width, baseFontSize]);

  useEffect(() => {
    if (!eventDetails?.hostName) return;
    const baseFontRem = parseFloat(baseStyles.fontSize);
    if (eventDetails.hostName.length <= 14)
      setDynamicFontSize((baseFontRem + 0.5).toFixed(2) + "rem");
    else setDynamicFontSize(baseStyles.fontSize);
  }, [eventDetails?.hostName, baseStyles]);

  const localKey = `localTemplateImage_${eventDetails?._id || eventDetails?.eventId}`;

  const imageUrl =
    localStorage.getItem(localKey) ||
    orderDetails?.externalTemplateImageUrl ||
    orderDetails?.Image ||
    orderDetails?.hostImage ||
    DefaultTemplate.src;

  const handleImageLoad = (e) => {
    const img = e.target;
    const ratio = img.naturalWidth / img.naturalHeight;

    if (ratio > 1.1) {
      setTemplateSizeClass("share-small-template");
    } else {
      setTemplateSizeClass("share-large-template");
    }
    setImageLoaded(true);
  };

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
            className={`template-preview-container ${templatewrapperclass} ${templateSizeClass}`}
            style={{
              position: "relative",
              display: "inline-block",
              width: "100%",
              maxWidth: "450px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {!imageLoaded && (
              <TemplatecardSkeleton width="100%" height="auto" borderRadius="12px" />
            )}

            <img
              src={imageUrl}
              alt="Invitation Template"
              className="default-invite-image"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                objectFit: "cover",
                visibility: imageLoaded ? "visible" : "hidden",
              }}
              onLoad={handleImageLoad}
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
                  width: "100%",
                  textAlign: "center",
                  paddingInline: "20px",
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
