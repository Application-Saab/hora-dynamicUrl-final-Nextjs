"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import fallbackImg from "@/assets/fallback-image.png";
import "./highpriceproduct.css";
import CustomizationModal from "../CustomizationModal";
import ArrowIcon from "../../assets/decor_grid_arrow_icon.svg";
import { videoPlaybackManager } from "@/utils/videoPlaybackManager";
import { isVideoEntry, PRIORITY_DESIGN_TYPES, resolveMediaUrl } from "@/utils/DecorationGridHelpers";

const HighPriceProduct = ({ data, onCardClick, getHref, catValue }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isShortVideo, setIsShortVideo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const uniqueHighCardId = React.useId();
  const mainVideoRef = useRef(null);
  const mirrorVideoRef = useRef(null);

  const sliderRef = useRef(null);
  const cardMediaRef = useRef(null);

  const highest = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.reduce(
      (prev, curr) => (Number(curr.price) > Number(prev.price) ? curr : prev),
      data[0],
    );
  }, [data]);

  // Extract videos & images from featured_images
  const { videos, images } = useMemo(() => {
    if (!highest) return { videos: [], images: [fallbackImg] };

    const vids = [];
    const imgs = [];

    const legacyVid = highest.video || highest.featured_video;
    if (legacyVid) {
      const vUrl = resolveMediaUrl(legacyVid);
      if (vUrl) vids.push(vUrl);
    }

    const rawList =
      Array.isArray(highest.featured_images) &&
      highest.featured_images.length > 0
        ? highest.featured_images
        : highest.featured_image
          ? Array.isArray(highest.featured_image)
            ? highest.featured_image
            : [highest.featured_image]
          : [];

    rawList.forEach((entry) => {
      const url = resolveMediaUrl(entry);
      if (!url) return;
      if (isVideoEntry(entry)) {
        if (!vids.includes(url)) vids.push(url);
      } else {
        imgs.push(url);
      }
    });

    return {
      videos: vids,
      images: imgs.length > 0 ? imgs : [fallbackImg],
    };
  }, [highest]);

  const hasVideo = videos.length > 0;
  const isMultipleImages = !hasVideo && images.length > 1;

  useEffect(() => {
    setActiveSlide(0);
    setIsShortVideo(false);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [highest?._id]);

  // Register video card with 75% visibility threshold (0.75)
  useEffect(() => {
    if (!hasVideo || !highest?._id || !cardMediaRef.current) return;
    const cardId = `high-${highest._id}-${uniqueHighCardId}`;

    videoPlaybackManager.register(
      cardId,
      cardMediaRef.current,
      0.75,
      setShouldPlayVideo,
    );

    return () => videoPlaybackManager.unregister(cardId);
  }, [hasVideo, highest?._id, uniqueHighCardId]);

  // Control Play/Pause on active turn
  useEffect(() => {
    if (!hasVideo) return;
    const mainVid = mainVideoRef.current;
    const mirrorVid = mirrorVideoRef.current;

    if (shouldPlayVideo) {
      if (mainVid) {
        mainVid.currentTime = 0;
        mainVid.play().catch(() => {});
      }
      if (mirrorVid) {
        mirrorVid.currentTime = 0;
        mirrorVid.play().catch(() => {});
      }
    } else {
      if (mainVid) {
        mainVid.pause();
        mainVid.currentTime = 0;
      }
      if (mirrorVid) {
        mirrorVid.pause();
        mirrorVid.currentTime = 0;
      }
    }
  }, [shouldPlayVideo, hasVideo, isShortVideo]);

  const handleHighVideoEnded = () => {
    const cardId = `high-${highest._id}-${uniqueHighCardId}`;
    videoPlaybackManager.notifyEnded(cardId);
  };

  // Auto-Scroll X-Axis for Multiple Images
  useEffect(() => {
    if (!isMultipleImages || isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % images.length;
        if (sliderRef.current) {
          sliderRef.current.scrollTo({
            left: next * sliderRef.current.clientWidth,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isMultipleImages, images.length, isPaused]);

  if (!highest) return null;

  const handleVideoMetadata = (e) => {
    const video = e.target;
    const container = cardMediaRef.current;
    if (!video || !container || !video.videoWidth) return;

    const containerWidth = container.clientWidth || 379;
    const containerHeight = container.clientHeight || 430;
    const renderedVideoHeight =
      (video.videoHeight / video.videoWidth) * containerWidth;

    setIsShortVideo(renderedVideoHeight < containerHeight - 5);
  };

  const handleManualScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeSlide && index < images.length) {
        setActiveSlide(index);
      }
    }
  };

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSlide(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: index * sliderRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const renderBadges = () => {
    if (!highest?.designType) return null;

    const activeKeys = Array.isArray(highest.designType)
      ? highest.designType.map((k) => String(k).trim().toLowerCase())
      : Object.keys(highest.designType)
          .filter((k) => highest.designType[k] === true)
          .map((k) => k.trim().toLowerCase());

    if (activeKeys.length === 0) return null;

    const matched = PRIORITY_DESIGN_TYPES.find((priorityItem) =>
      priorityItem.aliases.some((alias) => activeKeys.includes(alias)),
    );

    if (!matched) return null;

    return <div className="highDesignBadge">On {matched.label}</div>;
  };

  const href = getHref?.(highest) || "#";
  const displayName =
    highest.name?.length > 26
      ? `${highest.name.slice(0, 26)}...`
      : highest.name;

  // Video Cards
  if (hasVideo) {
    const primaryVideoUrl = videos[0];

    return (
      <div className="highdecContainer">
        <a
          href={href}
          className="highPriceCard highVideoCardMode"
          onClick={() => onCardClick?.(highest)}
        >
          <div className="highVideoFullWrapper" ref={cardMediaRef}>
            {renderBadges()}

            {isShortVideo && (
              <video
                ref={mirrorVideoRef}
                src={primaryVideoUrl}
                className="highVideoMirrorBg"
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            )}

            <video
              ref={mainVideoRef}
              src={primaryVideoUrl}
              className={
                isShortVideo ? "highVideoContainMain" : "highVideoCoverMain"
              }
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={handleVideoMetadata}
              onEnded={handleHighVideoEnded}
            />

            <div className="highVideoOverlayContent">
              <p className="highproductName highVideoTitle">{displayName}</p>

              <div className="highpriceRow highVideoPriceRow">
                <p className="highdiscountedPrice highVideoFinalPrice">
                  ₹{highest.price}
                </p>
                {highest.discountedPrice && (
                  <p className="highoriginalPrice highVideoOldPrice">
                    ₹{Math.floor(highest.discountedPrice)}
                  </p>
                )}
                {highest.discountDifference > 0 && (
                  <div className="highdiscountBadge">
                    <p>₹{highest.discountDifference?.toFixed(0)} off</p>
                  </div>
                )}
              </div>

              <div className="highVideoViewMoreWrap">
                <span className="highVideoViewMoreText">View More</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }

  // Single or multi image card
  return (
    <div className="highdecContainer">
      <a
        href={href}
        className="highPriceCard"
        onClick={() => onCardClick?.(highest)}
      >
        <div
          className="highPriceImageWrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {renderBadges()}

          {isMultipleImages ? (
            <>
              <div
                className="highCarouselTrack"
                ref={sliderRef}
                onScroll={handleManualScroll}
              >
                {images.map((imgSrc, idx) => (
                  <div className="highCarouselSlide" key={idx}>
                    <Image
                      src={imgSrc}
                      alt={`${highest.name} - ${idx + 1}${
                        catValue
                          ? ` – ${catValue.replace(/-/g, " ")} by HORA`
                          : " – decoration by HORA"
                      }`}
                      className="highPriceImage"
                      width={600}
                      height={600}
                    />
                  </div>
                ))}
              </div>

              <div
                className="highSwiperIndicators"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Slide ${idx + 1}`}
                    className={`highSwiperDot ${
                      activeSlide === idx ? "active" : ""
                    }`}
                    onClick={(e) => handleDotClick(e, idx)}
                  />
                ))}
              </div>
            </>
          ) : (
            <Image
              src={images[0]}
              alt={`${highest.name}${
                catValue
                  ? ` – ${catValue.replace(/-/g, " ")} by HORA`
                  : " – decoration by HORA"
              }`}
              className="highPriceImage"
              width={600}
              height={600}
            />
          )}
        </div>

        {/* Overlapping White Content Card */}
        <div className="highCardContentWrapper">
          <div className="highPriceContent">
            <p className="highproductName">{displayName}</p>

            <div className="highpriceRow">
              <p className="highdiscountedPrice">₹{highest.price}</p>
              {highest.discountedPrice && (
                <p className="highoriginalPrice">
                  ₹{Math.floor(highest.discountedPrice)}
                </p>
              )}
              {highest.discountDifference > 0 && (
                <div className="highdiscountBadge">
                  <p>₹{highest.discountDifference?.toFixed(0)} off</p>
                </div>
              )}
            </div>

            <div className="highviewMoreRow">
              <p className="highviewMore">View More</p>
              <div className="highviewMoreArrow">
                <Image src={ArrowIcon} alt="View More" className="view-img" />
              </div>
            </div>
          </div>
        </div>
      </a>

      <CustomizationModal
        product={selectedItem}
        catValue={catValue}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        image={selectedItem ? resolveMediaUrl(images[0]) : null}
      />
    </div>
  );
};

export default HighPriceProduct;
