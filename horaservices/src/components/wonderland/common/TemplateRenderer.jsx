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

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

/**
 * Check karo URL video hai ya nahi
 * blob: URLs bhi handle hoti hain (user-uploaded)
 * GIF bhi video ki tarah treat hogi (animated)
 */
const isVideoFile = (url = "") =>
  /\.(mp4|webm|ogg|mov|gif)(\?.*)?$/i.test(url) ||
  url.startsWith("blob:");

/**
 * S3 signed URLs mein already ? hota hai
 * Simple string concatenation URL tod deti hai
 * URL API se safely cache-bust karo
 */
const addCacheBust = (url = "") => {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("t", Date.now());
    return u.toString();
  } catch {
    // Relative URL ya invalid URL
    return `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
  }
};

/**
 * Error code ka human-readable reason
 */
const VIDEO_ERROR_MAP = {
  1: "MEDIA_ERR_ABORTED — Playback user ne cancel kiya",
  2: "MEDIA_ERR_NETWORK — Network problem ya URL galat hai",
  3: "MEDIA_ERR_DECODE  — File corrupt ya format unsupported",
  4: "MEDIA_ERR_SRC_NOT_SUPPORTED — MIME type browser support nahi karta",
};

function getResponsiveFontStyles(width, baseFontSize) {
  const size = getScreenSize(width);

  if (typeof baseFontSize === "object" && baseFontSize !== null) {
    return {
      fontSize:   baseFontSize[size] || defaultFontSizeMap[size].fontSize,
      lineHeight: baseFontSize[size] ? "auto" : defaultFontSizeMap[size].lineHeight,
      top:        defaultFontSizeMap[size].top,
    };
  }

  if (typeof baseFontSize === "string") {
    return { ...defaultFontSizeMap[size], fontSize: baseFontSize };
  }

  return defaultFontSizeMap[size];
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
const TemplateRenderer = ({
  fetchEventLoading,
  eventDetails,
  orderDetails,
  baseFontSize,
  isLandingPage = true,
  templatewrapperclass,
  isHost,
}) => {
  const textRef     = useRef(null);
  const templateRef = useRef(null);
  const videoRef    = useRef(null);

  const { width }            = useScreenSize();
  const { refetchChatRooms } = useChatStore();

  const [mediaUrl,          setMediaUrl]          = useState(DefaultTemplate.src);
  const [imageLoaded,       setImageLoaded]       = useState(false);
  const [videoLoaded,       setVideoLoaded]       = useState(false);
  const [videoError,        setVideoError]        = useState(false);
  const [templateSizeClass, setTemplateSizeClass] = useState("");
  const [hasPlayedOnce,     setHasPlayedOnce]     = useState(false);
  const [baseStyles,        setBaseStyles]        = useState(
    getResponsiveFontStyles(width, baseFontSize)
  );

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ── Font styles on resize ─────────────────────────────── */
  useEffect(() => {
    setBaseStyles(getResponsiveFontStyles(width, baseFontSize));
  }, [width, baseFontSize]);

  /* ── Resolve media URL ─────────────────────────────────── */
  useEffect(() => {
    const resolveMedia = async () => {
      /**
       * Server se aane wale sabhi possible fields
       * Priority order: video > image > host image
       */
      const serverMedia =
        orderDetails?.externalTemplateVideoUrl ||
        orderDetails?.externalTemplateImageUrl ||
        orderDetails?.Image ||
        orderDetails?.hostImage;

      // ── DEBUG: Full orderDetails dekho ──
      console.log("[TemplateRenderer] orderDetails:", {
        externalTemplateVideoUrl: orderDetails?.externalTemplateVideoUrl,
        externalTemplateImageUrl: orderDetails?.externalTemplateImageUrl,
        Image:                    orderDetails?.Image,
        hostImage:                orderDetails?.hostImage,
        resolved:                 serverMedia,
        isVideo:                  isVideoFile(serverMedia || ""),
      });

      /**
       * VIDEO FLOW
       * Server pe video URL hai — seedha use karo
       * Cache-bust safely (S3 signed URLs break na hon)
       */
      if (serverMedia && isVideoFile(serverMedia)) {
        const safeUrl = addCacheBust(serverMedia);

        console.log("[TemplateRenderer] Using VIDEO:", safeUrl);

        setMediaUrl(safeUrl);
        setImageLoaded(false);
        setVideoLoaded(false);
        setVideoError(false);
        return;
      }

      /**
       * IMAGE FLOW
       * Pehle IndexedDB mein locally saved image check karo
       */
      const localKey = `template_${
        eventDetails?._id || eventDetails?.eventId
      }`;

      const savedMedia = await getTemplate(localKey);

      if (savedMedia) {
        console.log("[TemplateRenderer] Using IndexedDB image:", localKey);

        setMediaUrl(savedMedia);
        setImageLoaded(false);
        setVideoLoaded(false);
        setVideoError(false);
        return;
      }

      /**
       * FALLBACK
       * Server image ya default template
       */
      const resolved = serverMedia || DefaultTemplate.src;

      console.log("[TemplateRenderer] Using image:", resolved);

      setMediaUrl(resolved);
      setImageLoaded(false);
      setVideoLoaded(false);
      setVideoError(false);
    };

    resolveMedia();
  }, [eventDetails, orderDetails]);

  /* ── Image load handler ────────────────────────────────── */
  const handleImageLoad = (e) => {
    const img   = e.target;
    const ratio = img.naturalWidth / img.naturalHeight;
    setTemplateSizeClass(
      ratio > 1.1 ? "share-small-template" : "share-large-template"
    );
    setImageLoaded(true);
  };

  /* ── Upload default template snapshot ─────────────────── */
  const handleDownload = async () => {
    if (!templateRef.current) return;

    const blob = await captureElementAsImage(templateRef.current, [
      ".hide-in-download",
    ]);
    if (!blob) return;

    const file = new File([blob], "invite_image.png", {
      type:         "image/png",
      lastModified: Date.now(),
    });

    const form = new FormData();
    form.append("image",  file);
    form.append("userId", eventDetails?.userId);

    try {
      await fetch(
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventDetails?._id}`,
        {
          method:  "PUT",
          headers: { Authorization: token || "" },
          body:    form,
        }
      );
      refetchChatRooms();
    } catch (err) {
      console.error("[TemplateRenderer] Upload failed:", err);
    }
  };

  /* ── Auto-upload default template ─────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !eventDetails?.externalTemplateImageUrl &&
        mediaUrl === DefaultTemplate.src &&
        isHost &&
        imageLoaded
      ) {
        handleDownload();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [eventDetails, mediaUrl, isHost, imageLoaded]);

  /* ── Video IntersectionObserver ────────────────────────── */
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
          } catch {
            // Autoplay blocked — silently ignore
          }
        } else {
          video.pause();
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [mediaUrl, hasPlayedOnce]);

  /* ── Derived flags ─────────────────────────────────────── */
  const isVideo           = isVideoFile(mediaUrl);
  const isDefaultTemplate = mediaUrl === DefaultTemplate.src;

  /* ── Video MIME type helper ────────────────────────────── */
  const getVideoMimeType = (url = "") => {
    if (url.includes(".mp4"))  return "video/mp4";
    if (url.includes(".webm")) return "video/webm";
    if (url.includes(".ogg"))  return "video/ogg";
    if (url.includes(".mov"))  return "video/quicktime";
    if (url.includes(".gif"))  return "image/gif";
    return "video/mp4"; // safe default
  };

  /* ─────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────── */
  return (
    <div
      className="default-template-wrapper"
      style={{
        paddingInline: !isLandingPage ? "25px" : "",
        textAlign:     "center",
      }}
    >
      {fetchEventLoading ? (
        /* ── Loading skeleton ── */
        <div className="placeholder-glow mb-4">
          <div
            className="placeholder w-100"
            style={{ height: "200px", borderRadius: "10px" }}
          />
        </div>
      ) : (
        <div
          className={`template-preview-container ${templatewrapperclass ?? ""} ${templateSizeClass}`}
          ref={templateRef}
          style={{
            position:     "relative",
            display:      "inline-block",
            width:        "100%",
            maxWidth:     "450px",
            borderRadius: "12px",
            overflow:     "hidden",
          }}
        >
          {/* ══════════════════════════════════════════════
              VIDEO
          ══════════════════════════════════════════════ */}
          {isVideo ? (
            <div
              className="video-wrapper"
              style={{
                width:        "100%",
                position:     "relative",
                borderRadius: "12px",
                overflow:     "hidden",
              }}
            >
              {/* Skeleton — jab tak video load nahi hoti */}
              {!videoLoaded && !videoError && (
                <TemplatecardSkeleton
                  width="100%"
                  height="100%"
                  borderRadius="12px"
                />
              )}

              {/* GIF — <img> tag se render karo, <video> se nahi */}
              {mediaUrl.toLowerCase().includes(".gif") ? (
                <img
                  src={mediaUrl}
                  alt="Invitation Template"
                  className="default-invite-video"
                  style={{
                    width:        "100%",
                    height:       "100%",
                    objectFit:    "cover",
                    borderRadius: "12px",
                    display:      "block",
                    visibility:   videoLoaded ? "visible" : "hidden",
                  }}
                  onLoad={() => {
                    setVideoLoaded(true);
                    setImageLoaded(true);
                  }}
                  onError={() => {
                    console.error("[TemplateRenderer] GIF load failed:", mediaUrl);
                    setVideoLoaded(true);
                    setVideoError(true);
                  }}
                />
              ) : (
                /* MP4 / WebM / OGG / MOV */
                <video
                  ref={videoRef}
                  loop
                  playsInline
                  muted
                  preload="auto"
                  className="default-invite-video"
                  style={{
                    width:        "100%",
                    height:       "100%",
                    objectFit:    "cover",
                    borderRadius: "12px",
                    display:      "block",
                    visibility:   videoLoaded ? "visible" : "hidden",
                  }}
                  onLoadedData={() => {
                    setVideoLoaded(true);
                    setImageLoaded(true);
                  }}
                  onCanPlay={() => {
                    setVideoLoaded(true);
                    setImageLoaded(true);
                  }}
                  onError={(e) => {
                    const vid = e.target;
                    const err = vid.error;

                    console.error("[TemplateRenderer] Video error:", {
                      code:    err?.code,
                      reason:  VIDEO_ERROR_MAP[err?.code] || "Unknown error",
                      message: err?.message,
                      src:     vid.currentSrc || vid.src,
                      networkState: vid.networkState,
                      readyState:   vid.readyState,
                    });

                    // Skeleton hatao, error state set karo
                    setVideoLoaded(true);
                    setVideoError(true);
                  }}
                >
                  {/**
                   * Explicit <source> — browser ko MIME type pata chalega
                   * Isse MEDIA_ERR_SRC_NOT_SUPPORTED kam hoti hai
                   */}
                  <source src={mediaUrl} type={getVideoMimeType(mediaUrl)} />
                </video>
              )}

              {/* Video error pe fallback image dikhao */}
              {videoError && (
                <img
                  src={
                    orderDetails?.externalTemplateImageUrl ||
                    orderDetails?.Image ||
                    DefaultTemplate.src
                  }
                  alt="Invitation Template"
                  style={{
                    width:        "100%",
                    height:       "auto",
                    objectFit:    "cover",
                    borderRadius: "12px",
                    display:      "block",
                  }}
                />
              )}
            </div>
          ) : (
            /* ══════════════════════════════════════════════
                IMAGE
            ══════════════════════════════════════════════ */
            <>
              {!imageLoaded && (
                <TemplatecardSkeleton
                  width="100%"
                  height="auto"
                  borderRadius="12px"
                />
              )}

              <img
                src={mediaUrl}
                alt="Invitation Template"
                className="default-invite-image"
                style={{
                  width:        "100%",
                  height:       "auto",
                  borderRadius: "12px",
                  objectFit:    "cover",
                  display:      "block",
                  visibility:   imageLoaded ? "visible" : "hidden",
                }}
                onLoad={handleImageLoad}
                onError={() => setImageLoaded(true)}
              />

              {/* Host name overlay — only on default template */}
              {isDefaultTemplate && eventDetails?.hostName && (
                <div
                  ref={textRef}
                  className="default-template-text"
                  style={{
                    position:      "absolute",
                    top:           baseStyles.top,
                    left:          "50%",
                    transform:     "translateX(-50%)",
                    fontSize:      baseStyles.fontSize,
                    lineHeight:    baseStyles.lineHeight,
                    fontWeight:    700,
                    color:         "#fff",
                    width:         "100%",
                    textAlign:     "center",
                    paddingInline: "20px",
                    pointerEvents: "auto",
                  }}
                >
                  {eventDetails?.hostName}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateRenderer;