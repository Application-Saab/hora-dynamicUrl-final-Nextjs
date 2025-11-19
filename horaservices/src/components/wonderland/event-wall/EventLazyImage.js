"use client";
import React, { useState, useEffect, useRef } from "react";

const EventLazyImage = ({
  src,
  alt,
  className,
  onClick,
  progress,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const currentRef = wrapperRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        rootMargin: "0px 0px 300px 0px",
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className='event-masonry-item'
      onClick={onClick}
      style={{
        backgroundColor: isLoaded ? "#FFFFFF" : "#e9ecef",
      }}
    >
      {/* Render img tag only when in view to start loading */}
      {isInView && (
        <>
          <img
            src={src}
            alt={alt}
            className={`event-lazy-image-actual-img ${className || ""} ${
              isLoaded ? "loaded" : "loading"
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setIsLoaded(true);
              console.warn(`Failed to load image: ${src}`);
            }}
          />
          {progress && (
            <div className="lazy-image-progress-overlay">{progress}</div>
          )}
        </>
      )}

      {/* Spinner overlay: shown when in view but image not yet loaded (or failed) */}
      {isInView && !isLoaded && (
        <div className="event-lazy-image-spinner-container">
          <div className="event-lazy-image-spinner-animation"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(EventLazyImage);
