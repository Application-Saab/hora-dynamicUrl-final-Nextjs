import React, { useEffect, useRef } from "react";
import './EventInvitation.css';

const MediaViewer = ({ media }) => {
  const videoRef = useRef(null);
  const isVideo = /\.(mp4|mov|avi|mkv)$/i.test(media?.imageUrl);
  console.log('%c [ media?.imageUrl ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', media?.imageUrl)

  // Optimize video playback
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const videoEl = videoRef.current;
      videoEl.load();
      videoEl.play().catch(() => {});
      return () => {
        videoEl.pause();
        videoEl.src = "";
      };
    }
  }, [media, isVideo]);

  if (isVideo) {
    return (
      <video
        key={media?.imageUrl}
        ref={videoRef}
        controls
        autoPlay
        playsInline
        preload="none"
        decoding="async"
        className="lightbox-img"
        style={{
          maxWidth: "100%",
          borderRadius: "12px",
          background: "#000",
          objectFit: "contain",
        }}
      >
        <source src={media?.imageUrl} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <img
      loading="lazy"
      src={media?.webpUrl || media?.imageUrl}
      alt="Preview"
      className="lightbox-img"
      style={{
        maxWidth: "100%",
        borderRadius: "12px",
        objectFit: "contain",
      }}
    />
  );
};

export default MediaViewer;
