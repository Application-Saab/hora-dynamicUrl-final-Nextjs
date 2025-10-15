// components/LazyImage.js
"use client";
import React, { useState, useEffect, useRef } from 'react';

// Placeholder component is now minimal, mostly for semantic grouping if needed during render.
// The visual placeholder (background, min-height) is handled by CSS on the wrapper.
const Placeholder = () => null; // Or <div className="lazy-image-placeholder-visual-cue"></div> if specific styling needed

const LazyImage = ({
  src,
  alt,
  className, // For the <img> tag
  wrapperClassName, // For the main div wrapper of this component (.masonry-item)
  onClick,
  isEventWall = false
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
          // No need to unobserve immediately if we want to show placeholder again if it scrolls out and back in
          // For simple lazy load, unobserving is fine:
          if (currentRef) { // Check ref again before unobserving
            observer.unobserve(currentRef);
          }
        }
      },
      {
        rootMargin: '0px 0px 300px 0px', // Start loading 300px before viewport
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
      className={`lazy-image-container-wrapper ${wrapperClassName || ''}`} // This is the .masonry-item
      onClick={onClick}
      style={{backgroundColor: isEventWall && (isLoaded ? "#FFFFFF" : "#e9ecef")}}
    >
      {/* Render img tag only when in view to start loading */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image-actual-img ${className || ''} ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true); // Consider it "handled" to remove spinner
            console.warn(`Failed to load image: ${src}`);
            // Optionally, you could set a 'broken-image' class here
          }}
        />
      )}

      {/* Spinner overlay: shown when in view but image not yet loaded (or failed) */}
      {isInView && !isLoaded && (
        <div className="lazy-image-spinner-container">
          <div className="lazy-image-spinner-animation"></div>
        </div>
      )}
      
      {/* If not in view, the .masonry-item's min-height and background act as placeholder */}
      {/* {!isInView && <Placeholder />} */}
    </div>
  );
};

export default React.memo(LazyImage);