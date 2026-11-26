"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import "./productGrid.css";
import fallbackImg from "@/assets/fallback-image.png";
import CustomizationModal from "../CustomizationModal";
import ArrowIcon from "../../assets/decor_grid_arrow_icon.svg";
import { videoPlaybackManager } from "@/utils/videoPlaybackManager";
import { isVideoEntry, PRIORITY_DESIGN_TYPES, resolveMediaUrl } from "@/utils/DecorationGridHelpers";

// Individual Card Component to manage Video aspect ratio & Carousel state independently
const ProductCard = ({ item, href, onCardClick, isPhotography, catValue }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isShortVideo, setIsShortVideo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  const uniqueCardId = useId();
  const sliderRef = useRef(null);
  const cardMediaRef = useRef(null);
  const mainVideoRef = useRef(null);
  const mirrorVideoRef = useRef(null);

  // Detect Media
  const videoEntry = React.useMemo(() => {
    if (
      typeof item.featured_image === "string" &&
      isVideoEntry(item.featured_image)
    ) {
      return item.featured_image;
    }
    if (Array.isArray(item.featured_images)) {
      const found = item.featured_images.find((m) => isVideoEntry(m));
      if (found) return found;
    }
    return null;
  }, [item]);

  const hasVideo = Boolean(videoEntry);
  const resolvedVideoUrl = hasVideo ? resolveMediaUrl(videoEntry) : null;

  // Register video card with 100% visibility threshold (0.98)
  useEffect(() => {
    if (!hasVideo || !cardMediaRef.current) return;
    const cardId = `grid-${item._id}-${uniqueCardId}`;

    videoPlaybackManager.register(
      cardId,
      cardMediaRef.current,
      0.98,
      setShouldPlayVideo,
    );

    return () => videoPlaybackManager.unregister(cardId);
  }, [hasVideo, item._id, uniqueCardId]);

  // Play / Pause & Reset based on active turn
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

  const handleVideoEnded = () => {
    const cardId = `grid-${item._id}-${uniqueCardId}`;
    videoPlaybackManager.notifyEnded(cardId);
  };

  // Collect all images if not a video
  const imageList = React.useMemo(() => {
    if (hasVideo) return [];
    const list = [];

    if (Array.isArray(item.featured_image) && item.featured_image.length > 0) {
      item.featured_image.forEach((img) => {
        const url = resolveMediaUrl(img);
        if (url) list.push(url);
      });
    } else if (
      Array.isArray(item.featured_images) &&
      item.featured_images.length > 0
    ) {
      item.featured_images.forEach((img) => {
        const url = resolveMediaUrl(img);
        if (url) list.push(url);
      });
    } else if (item.featured_image && typeof item.featured_image === "string") {
      const url = resolveMediaUrl(item.featured_image);
      if (url) list.push(url);
    }

    return list.length > 0 ? list : [fallbackImg];
  }, [item, hasVideo]);

  const isMultipleImages = !hasVideo && imageList.length > 1;

  const handleVideoMetadata = (e) => {
    const video = e.target;
    const container = cardMediaRef.current;
    if (!video || !container) return;

    const containerWidth = container.clientWidth || 180;
    const containerHeight = container.clientHeight || 280;

    const renderedVideoHeight =
      (video.videoHeight / video.videoWidth) * containerWidth;

    if (renderedVideoHeight < containerHeight - 5) {
      setIsShortVideo(true);
    } else {
      setIsShortVideo(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    if (!isMultipleImages || isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % imageList.length;
        if (sliderRef.current) {
          sliderRef.current.scrollTo({
            left: next * sliderRef.current.clientWidth,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 2800); // Auto scroll every 2.8 seconds

    return () => clearInterval(interval);
  }, [isMultipleImages, imageList.length, isPaused]);

  // Manual Swipe Scroll Sync for Indicators
  const handleManualScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeSlide && index < imageList.length) {
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
    if (!item.designType) return null;
    const activeKeys = Array.isArray(item.designType)
      ? item.designType.map((k) => String(k).trim().toLowerCase())
      : Object.keys(item.designType)
          .filter((k) => item.designType[k] === true)
          .map((k) => k.trim().toLowerCase());

    if (activeKeys.length === 0) return null;

    const matched = PRIORITY_DESIGN_TYPES.find((priorityItem) =>
      priorityItem.aliases.some((alias) => activeKeys.includes(alias)),
    );

    if (!matched) return null;

    return <div className="designTypeBadge">On {matched.label}</div>;
  };

  // Video card layout
  if (hasVideo) {
    return (
      <a
        href={href}
        className="imageContainer videoCardMode"
        onClick={() => onCardClick?.(item)}
      >
        <div className="videoFullWrapper" ref={cardMediaRef}>
          {renderBadges()}

          {/* Blured Video */}
          {isShortVideo && (
            <video
              ref={mirrorVideoRef}
              src={resolvedVideoUrl}
              className="videoMirrorBg"
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          )}

          {/* Main Video */}
          <video
            ref={mainVideoRef}
            src={resolvedVideoUrl}
            className={isShortVideo ? "videoContainMain" : "videoCoverMain"}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={handleVideoMetadata}
            onEnded={handleVideoEnded}
          />

          {/* Bottom Gradient Overlay Content */}
          <div className="videoOverlayContent">
            <p className="productname videoTitle">
              {item.name.length > 16
                ? `${item.name.slice(0, 16)}...`
                : item.name}
            </p>

            <div className="priceBlock videoPriceBlock">
              <p className="finalPrice videoFinalPrice">₹{item.price}</p>
              <p className="oldPrice videoOldPrice">
                ₹{Math.floor(item.discountedPrice)}
              </p>
              <div className="discountBottom">
                <p>₹{item.discountDifference?.toFixed(0)} off</p>
              </div>
            </div>

            <div className="videoViewMoreWrap">
              <span className="videoViewMoreText">View More</span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Single and multi image corousel
  return (
    <a
      href={href}
      className="imageContainer"
      onClick={() => onCardClick?.(item)}
    >
      <div
        className="imageWrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {renderBadges()}

        {isMultipleImages ? (
          <>
            {/* Swiper container */}
            <div
              className="carouselTrack"
              ref={sliderRef}
              onScroll={handleManualScroll}
            >
              {imageList.map((imgSrc, idx) => (
                <div className="carouselSlide" key={idx}>
                  <Image
                    src={imgSrc}
                    alt={`${item.name} - ${idx + 1}${
                      catValue
                        ? ` – ${catValue.replace(/-/g, " ")} by HORA`
                        : " – decoration by HORA"
                    }`}
                    className="decImage"
                    width={300}
                    height={300}
                  />
                </div>
              ))}
            </div>

            {/* Swiper Indicator */}
            <div
              className="swiperIndicators"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Slide ${idx + 1}`}
                  className={`swiperDot ${activeSlide === idx ? "active" : ""}`}
                  onClick={(e) => handleDotClick(e, idx)}
                />
              ))}
            </div>
          </>
        ) : (
          /* Single Image */
          <Image
            src={imageList[0]}
            alt={`${item.name}${
              catValue
                ? ` – ${catValue.replace(/-/g, " ")} by HORA`
                : " – decoration by HORA"
            }`}
            className="decImage"
            width={300}
            height={300}
          />
        )}
      </div>

      {/* Bottom White Card Content */}
      <div className="card-content-wrapper">
        <div className="cardContent">
          <p className="productname">
            {isPhotography
              ? item.name
              : item.name.length > 16
                ? `${item.name.slice(0, 16)}...`
                : item.name}
          </p>

          <div className="priceBlock">
            <p className="finalPrice">₹{item.price}</p>
            <p className="oldPrice">₹{Math.floor(item.discountedPrice)}</p>
            <div className="discountBottom">
              <p>₹{item.discountDifference?.toFixed(0)} off</p>
            </div>
          </div>

          {isPhotography ? (
            <>
              <p className="customization">Customization Available</p>
              <p className="viewMore">View More</p>
            </>
          ) : (
            <div className="viewMoreRow">
              <p className="viewMore">View More</p>
              <div className="viewMoreArrow">
                <Image src={ArrowIcon} alt="View More" className="" />
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

const ProductGrid = ({
  data = [],
  onCardClick,
  getHref,
  categoryType,
  catValue,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const isPhotography = categoryType === "photography";

  return (
    <div className="decContainer">
      {data.length > 0 &&
        data.map((item) => {
          const href = getHref?.(item) || "#";
          return (
            <ProductCard
              key={item._id}
              item={item}
              href={href}
              onCardClick={onCardClick}
              isPhotography={isPhotography}
              catValue={catValue}
            />
          );
        })}

      {!isPhotography && (
        <CustomizationModal
          product={selectedItem}
          catValue={catValue}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          image={
            selectedItem ? resolveMediaUrl(selectedItem.featured_image) : null
          }
        />
      )}
    </div>
  );
};

export default ProductGrid;
