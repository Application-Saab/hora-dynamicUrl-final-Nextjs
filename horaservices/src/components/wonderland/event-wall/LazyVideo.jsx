"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import "./LazyVideo.css";

const LazyVideo = ({ previewSrc, fullVideoSrc, className, wrapperClassName, isEventWall = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(null);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  // Format video duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // only play video when it’s visible
  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
     if (entry.isIntersecting) {
        console.log("Playing video:", fullVideoSrc);
        currentVideo.play().catch(() => {});
      } else {
        console.log("Paused video:", fullVideoSrc);
        currentVideo.pause();
      }

      },
      {
        threshold: 0.9, // Play only when 90% visible
      }
    );

    observer.observe(currentVideo);

    return () => {
      if (currentVideo) observer.unobserve(currentVideo);
    };
  }, []);

  // ✅ Load video metadata (duration)
  useEffect(() => {
    if (!fullVideoSrc) return;
    const video = document.createElement("video");
    video.src = fullVideoSrc;
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const dur = video.duration;
      if (!isNaN(dur)) setDuration(formatDuration(dur));
    };
  }, [fullVideoSrc]);

  return (
    <div 
    ref={wrapperRef} 
    className={`lazy-video-wrapper ${wrapperClassName || ""}`}
    style={{backgroundColor: isEventWall && (isLoaded ? "#FFFFFF" : "#e9ecef")}}
    >
      <video
        ref={videoRef}
        src={previewSrc}
        loop
        muted
        playsInline
        preload="metadata"
        className={`lazy-video-element ${className || ""} ${
          isLoaded ? "loaded" : "loading"
        }`}
        onLoadedData={() => setIsLoaded(true)}
      />

      {/* Spinner while loading */}
      {!isLoaded && (
        <div className="lazy-video-spinner-container">
          <div className="lazy-video-spinner"></div>
        </div>
      )}

      {/* Overlay with duration + play icon */}
      {isLoaded && duration && (
        <div className="lazy-video-overlay">
          <span className="lazy-video-duration">{duration}</span>
          <FaPlayCircle className="lazy-video-play-icon" />
        </div>
      )}
    </div>
  );
};

export default React.memo(LazyVideo);
