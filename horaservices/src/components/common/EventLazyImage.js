"use client";

import React, { useState, useEffect, useRef } from "react";

const EventLazyImage = ({
  src,
  alt,
  className,
  onClick,
  progress,
  postType,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const currentRef = wrapperRef.current;

    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        // Image viewport ke 200px pehle/baad DOM me aayegi
        rootMargin: "200px 0px 200px 0px",
        threshold: 0,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoadDone = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={wrapperRef}
      className="event-masonry-item"
      onClick={onClick}
      style={{
        backgroundColor: isLoaded ? "#FFFFFF" : "#e9ecef",
      }}
    >
      {isInView && (
        <>
          <img
            src={src}
            alt={alt}
            decoding="async"
            loading="lazy"
            className={`event - lazy - image - actual - img ${
  className || ""
} ${ isLoaded ? "loaded" : "loading" } `}
            style={{
              objectFit:
                postType === "thankYouNote" ? "fill" : "cover",
            }}
            onLoad={handleLoadDone}
            onError={() => {
              handleLoadDone();
              console.warn(`Failed to load image: ${ src } `);
            }}
          />

          {progress && (
            <div className="lazy-image-progress-overlay">
              {progress}
            </div>
          )}
        </>
      )}

      {isInView && !isLoaded && (
        <div className="event-lazy-image-spinner-container placeholder-glow p-1">
          <div className="placeholder w-100 h-100"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(EventLazyImage);