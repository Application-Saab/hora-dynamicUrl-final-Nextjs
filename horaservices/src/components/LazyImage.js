// components/LazyImage.js (create this new file)
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // If you want to use Next/Image for placeholders or even the main image

// A simple placeholder, you can customize this or use a small base64 encoded image
const Placeholder = ({ style }) => (
  <div
    style={{
      backgroundColor: '#e0e0e0', // Light gray
      width: '100%',
      paddingTop: '100%', // Maintains a 1:1 aspect ratio, adjust as needed
      ...style,
    }}
  />
);

const LazyImage = ({ src, alt, className, onClick, placeholderStyle }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // Important: unobserve after it's in view
        }
      },
      {
        rootMargin: '0px 0px 200px 0px', // Load 200px before it enters the viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(imgRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const effectiveClassName = `lazy-image ${className || ''} ${isLoaded ? 'loaded' : 'loading'}`;

  return (
    <div ref={imgRef} className="lazy-image-wrapper" onClick={onClick}>
      {isInView ? (
        <img
          src={src}
          alt={alt}
          className={effectiveClassName}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <Placeholder style={placeholderStyle} />
      )}
    </div>
  );
};

// Memoize LazyImage to prevent unnecessary re-renders if props haven't changed
export default React.memo(LazyImage);