import { useEffect, useRef, useState } from "react";
import DefaultTemplate from "@/assets/NewDefaultTemplate.png";
import useScreenSize from "@/hooks/useScreenSize";
import { mobileBreakPoints } from "@/utils/constants";

const TemplateRenderer = ({
  fetchEventLoading,
  eventDetails,
  baseFontSize,
  isLandingPage = true,
}) => {
  const textRef = useRef(null);
  const [dynamicFontSize, setDynamicFontSize] = useState("");
  const { width } = useScreenSize();

  // Define base font-size + line-height dynamically based on screen size
  const getBaseFontStyles = () => {
    // If baseFontSize is an object (responsive values)
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

    // If baseFontSize is a simple string (single size)
    if (typeof baseFontSize === "string") {
      return {
        fontSize: baseFontSize,
        lineHeight: "40px",
        top: "40%",
      };
    }

    // Default fallback sizes (when no prop is passed)
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

  // Update styles on width or prop change
  useEffect(() => {
    setBaseStyles(getBaseFontStyles());
  }, [width, baseFontSize]);

  // ✨ Adjust font-size based on text length
  useEffect(() => {
    if (!eventDetails?.hostName) return;

    const baseFontRem = parseFloat(baseStyles.fontSize);
    if (eventDetails.hostName.length <= 14) {
      setDynamicFontSize((baseFontRem + 0.5).toFixed(2) + "rem");
    } else {
      setDynamicFontSize(baseStyles.fontSize);
    }
  }, [eventDetails?.hostName, baseStyles]);

  return (
    <div
      className="default-template-wrapper"
      style={{ paddingInline: !isLandingPage ? "25px" : "" }}
    >
      {!fetchEventLoading || eventDetails?.hostName ? (
        <>
          <img
            src={DefaultTemplate.src}
            alt="Default Invitation Template"
            className="default-invite-image"
          />
          <div
            ref={textRef}
            className={`default-template-text w-100`}
            style={{
              fontSize: dynamicFontSize,
              lineHeight: baseStyles.lineHeight,
              top: baseStyles.top,
              paddingInline: !isLandingPage ? "45px" : "20"
            }}
          >
            <p>{eventDetails?.hostName}</p>
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
