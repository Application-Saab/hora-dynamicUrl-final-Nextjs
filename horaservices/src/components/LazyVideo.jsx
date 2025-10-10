"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import "./LazyVideo.css"; // Add styling separately

const LazyVideo = ({ previewSrc, fullVideoSrc, className, wrapperClassName }) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 300px 0px" }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !fullVideoSrc) return;
    const video = document.createElement("video");
    video.src = fullVideoSrc;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const dur = video.duration;
      if (!isNaN(dur)) setDuration(formatDuration(dur));
    };
  }, [isInView, fullVideoSrc]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div ref={wrapperRef} className={`lazy-video-wrapper ${wrapperClassName || ""}`}>
      {isInView && (
        <video
          src={previewSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={`lazy-video-element ${className || ""} ${
            isLoaded ? "loaded" : "loading"
          }`}
          onLoadedData={() => setIsLoaded(true)}
        />
      )}

      {/* Spinner while video is loading */}
      {isInView && !isLoaded && (
        <div className="lazy-video-spinner-container">
          <div className="lazy-video-spinner"></div>
        </div>
      )}

      {/* Duration + play overlay */}
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
