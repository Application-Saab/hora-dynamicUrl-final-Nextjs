import Image from "next/image";
import { FaInstagram, FaPlay } from "react-icons/fa";
import video from "@/assets/poselink/video.mp4"
import { useRef, useState } from "react";

const reels = [
  {
    video:
      video,
      
    views: "8.7K",
  },
  {
    video:
     video,
    views: "12K",
  },
  {
    video:
     video,
    views: "5.4K",
  },
];
const InstagramGalleryCTA = ({
    
  title = "Real Events on Instagram",
  subtitle = "See our recent photography & happy moments",
  buttonText = "Follow Us",
  viewMoreText = "View More on Instagram",

  onFollow,
  onViewMore,
}) => {

const videoRefs = useRef([]);
const [playingIndex, setPlayingIndex] = useState(null);
const handlePlay = (index) => {
  const video = videoRefs.current[index];

  if (!video) return;

  if (video.paused) {
    video.play();
    setPlayingIndex(index);
  } else {
    video.pause();
    setPlayingIndex(null);
  }
};
  return (
    <div className="ig-card">
      {/* Header */}
      <div className="ig-header">
        <div className="ig-header-left">
          <div className="ig-icon-wrap">
            <FaInstagram className="ig-icon" />
          </div>

          <div>
            <h3 className="ig-title">{title}</h3>
            <p className="ig-subtitle">{subtitle}</p>
          </div>
        </div>

        <button className="ig-follow-btn" onClick={onFollow}>
          {buttonText}
        </button>
      </div>

      {/* Gallery */}
     <div className="ig-gallery">
  {reels.map((item, index) => (
    <div key={index} className="ig-gallery-item">
      <video
        ref={(el) => (videoRefs.current[index] = el)}
        src={item.video}
        className="ig-video"
        muted
        playsInline
        preload="metadata"
        onEnded={() => setPlayingIndex(null)}
      />

      {playingIndex !== index && (
        <button
          className="ig-play"
          onClick={() => handlePlay(index)}
        >
          <FaPlay />
        </button>
      )}

      <span className="ig-views">
        ▶ {item.views}
      </span>
    </div>
  ))}
</div>

      {/* Footer Button */}
      <button className="ig-view-btn" onClick={onViewMore}>
        <FaInstagram />
        {viewMoreText}
        <span>›</span>
      </button>
    </div>
  );
};

export default InstagramGalleryCTA;