"use client";

import Image from "next/image";
import "./topbanner.css";
import { FaHeart } from "react-icons/fa";

const TopBanner = ({
  backgroundImage,
  highlightText,
  title,
  description,
   avatarImages = [
    "https://i.pravatar.cc/40?img=1",
    "https://i.pravatar.cc/40?img=2",
    "https://i.pravatar.cc/40?img=3",
    "https://i.pravatar.cc/40?img=4",
  ],
 socialProofText = "Loved by 10,000+ couples ❤️",
  ctaText,
  onCtaClick,
}) => {
  return (
    <section className="card-containor">
      <div className="hero-inner">
        {/* Left: text content */}
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">{highlightText}</span>
            <span className="hero-title-text">{title} Poses</span>
          </h1>

          <p className="hero-description">{description}</p>

          <div className="hero-social-proof">
            <div className="hero-avatar-group">
              {avatarImages.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt="customer avatar"
                  width={32}
                  height={32}
                  className="hero-avatar"
                  style={{ zIndex: avatarImages.length - i }}
                />
              ))}
            </div>

           <span className="hero-social-proof-text">


    Loved by 10,000+ couples <FaHeart className="heart-icon" />

  {/* <Image
    src={starIcon}
    alt="Star"
    width={12}
    height={12}
    className="hero-icon"
  /> */}
</span>
          </div>

          <button className="hero-cta-button" onClick={onCtaClick}>
            <svg
              className="hero-camera-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            {ctaText}
          </button>
        </div>

        {/* Right: background image */}
        <div className="hero-image-wrap">
          <Image
            src={backgroundImage}
            alt="hero background"
            fill
            className="hero-image"
            priority
          />
          <div className="hero-image-fade" />
        </div>
      </div>
    </section>
  );
};

export default TopBanner;