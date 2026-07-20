"use client";
import { useEffect, useRef, useState } from "react";
import DefaultTemplate from "@/assets/wonderland/NewDefaultTemplate.png";
import useScreenSize from "@/hooks/useScreenSize";
import TemplatecardSkeleton from "../TemplateSkeleton/templatecardSkeleton";
import { getScreenSize, defaultFontSizeMap } from "@/utils/constants";
import { getTemplate } from "@/utils/indexedDB";
import { captureElementAsImage } from "@/utils/captureElementAsImage";
import { BASE_URL } from "@/utils/apiconstants";
import { useChatStore } from "@/hooks/ChatContext";
import { fetchWithError } from "@/utils/fetchWithError";

const TemplateRenderer = ({
  fetchEventLoading,
  eventDetails,
  orderDetails,
  baseFontSize,
  isLandingPage = true,
  templatewrapperclass,
  isHost,
  isVenue = false,
  frompanel
}) => {
  const textRef = useRef(null);
  const templateRef = useRef(null);
  const [dynamicFontSize, setDynamicFontSize] = useState("");
  const { width } = useScreenSize();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [templateSizeClass, setTemplateSizeClass] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { refetchChatRooms } = useChatStore();
  const videoRef = useRef(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const isVideoFile = (url = "") => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };
  const getResponsiveFontStyles = () => {
    const size = getScreenSize(width);

    if (typeof baseFontSize === "object" && baseFontSize !== null) {
      return {
        fontSize: baseFontSize[size] || defaultFontSizeMap[size].fontSize,

        lineHeight: baseFontSize[size]
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

  // const [imageUrl, setImageUrl] = useState(DefaultTemplate.src);
  const [mediaUrl, setMediaUrl] = useState(DefaultTemplate.src);

  useEffect(() => {
    const localKey = `template_${eventDetails?._id || eventDetails?.eventId}`;

    const fetchImage = async () => {
      const savedImage = await getTemplate(localKey); // Fetch from IndexedDB
      if (savedImage) {
        setMediaUrl(savedImage);
      } else {
        if (!isVenue) {
          setMediaUrl(
            eventDetails?.externalTemplateVideoUrl ||
              eventDetails?.externalTemplateImageUrl ||
              eventDetails?.Image ||
              eventDetails?.hostImage ||
              DefaultTemplate.src,
          );
        } else if (isVenue) {
          setMediaUrl(eventDetails?.venueImageUrl || DefaultTemplate.src);
        }
      }
    };

    fetchImage();
  }, [eventDetails]);

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

  const handleDownload = async () => {
    if (!templateRef.current) return;
    const blob = await captureElementAsImage(templateRef.current, [
      ".hide-in-download",
    ]);

    if (!blob) {
      return;
    }

    // Convert blob to file
    const file = new File([blob], `invite_image.png`, {
      type: "image/png",
      lastModified: Date.now(),
    });

    const reader = new FileReader();
    reader.onloadend = async () => {};
    reader.readAsDataURL(blob);

    const form = new FormData();
    form.append("image", file);
    form.append("userId", eventDetails?.userId);

    let url = isVenue
      ? `${BASE_URL}/api/party-venue/venue-banner-image/${eventDetails?._id}`
      : `${BASE_URL}/api/customer/event/event-invites/external-template/${eventDetails?._id}`;
      
    try {
      await fetchWithError(url, {
        method: "PUT",
        headers: { Authorization: token || "" },
        body: form,
      });
      refetchChatRooms();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (!isVenue) {
        if (
          !eventDetails?.externalTemplateImageUrl &&
          mediaUrl === DefaultTemplate.src &&
          (isHost || frompanel == 'true') &&
          imageLoaded
        ) {
          handleDownload();
        }
      } else if (isVenue) {
        console.log('%c [ isVenue ]', 'font-size:13px; background:pink; color:#bf2c9f;', isVenue)
        if (
          !eventDetails?.venueImageUrl &&
          mediaUrl === DefaultTemplate.src &&
          isHost &&
          imageLoaded
        ) {
          handleDownload();
        }
      }
    }, 2500);
  }, [eventDetails, mediaUrl, isHost, imageLoaded]);

  useEffect(() => {
    if (!isVideoFile(mediaUrl)) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          try {
            await video.play();

            if (!hasPlayedOnce) {
              setTimeout(() => {
                video.muted = false;
                setHasPlayedOnce(true);
              }, 400);
            }
          } catch (err) {
            // autoplay failed silently
          }
        } else {
          video.pause();
        }
      },
      {
        threshold: [0.5],
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [mediaUrl, hasPlayedOnce]);

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
            ref={templateRef}
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
              <TemplatecardSkeleton
                width="100%"
                height="auto"
                borderRadius="12px"
              />
            )}

            {isVideoFile(mediaUrl) ? (
              <div
                className="video-wrapper"
                style={{
                  height: "420px",
                  width: "100%",
                }}
              >
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  loop
                  preload="metadata"
                  className="default-invite-video"
                  onLoadedData={() => setImageLoaded(true)}
                />
              </div>
            ) : (
              <img
                src={mediaUrl}
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
            )}

            {!isVideoFile(mediaUrl) &&
              mediaUrl === DefaultTemplate.src &&
              (eventDetails?.hostName || eventDetails?.venueName) && (
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
                  {eventDetails?.hostName || eventDetails?.venueName}
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
