
"use client";
import { useEffect, useRef, useState } from "react";
import DefaultTemplate from "@/assets/wonderland/NewDefaultTemplate.png";
import useScreenSize from "@/hooks/useScreenSize";
import TemplatecardSkeleton from "../TemplateSkeleton/templatecardSkeleton";
import { getScreenSize,defaultFontSizeMap} from "@/utils/constants";
import { getTemplate } from "@/utils/indexedDB";

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

  const getResponsiveFontStyles = () => {
  const size = getScreenSize(width);

  if (typeof baseFontSize === "object" && baseFontSize !== null) {
    return {
      fontSize:
        baseFontSize[size] ||
        defaultFontSizeMap[size].fontSize,

      lineHeight:
        baseFontSize[size]
          ? "auto"
          : defaultFontSizeMap[size].lineHeight,

      top: defaultFontSizeMap[size].top,
    };
  }

  if (typeof baseFontSize === "string") {
    return {
      ...defaultFontSizeMap[size],
      fontSize: baseFontSize,
    };
  }

  return defaultFontSizeMap[size];
};


const [baseStyles, setBaseStyles] = useState(getResponsiveFontStyles());


  useEffect(() => {
   setBaseStyles(getResponsiveFontStyles());

  }, [width, baseFontSize]);

const [imageUrl, setImageUrl] = useState(DefaultTemplate.src);

useEffect(() => {
  const localKey = `template_${eventDetails?._id || eventDetails?.eventId}`;

  const fetchImage = async () => {
    const savedImage = await getTemplate(localKey); // Fetch from IndexedDB
    if (savedImage) {
      setImageUrl(savedImage);
    } else {
      setImageUrl(
        orderDetails?.externalTemplateImageUrl ||
        orderDetails?.Image ||
        orderDetails?.hostImage ||
        DefaultTemplate.src
      );
    }
  };

  fetchImage();
}, [eventDetails, orderDetails]);



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
                  fontSize: baseStyles.fontSize,
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
