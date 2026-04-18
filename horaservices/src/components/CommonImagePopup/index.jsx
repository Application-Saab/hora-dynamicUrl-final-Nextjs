"use client";
import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";

import Crossicon from "../../assets/Crossicon.svg";
import ArrowImg from "../../assets/arrow.svg";
import nextIcon from "../../assets/nextIcon.svg";

const PrevArrow = ({ className, onClick }) => (
  <div className={`${className} custom-arrow prev-arrow`} onClick={onClick}>
    <Image src={ArrowImg} alt="Back" width={30} height={30} />
  </div>
);

const NextArrow = ({ className, onClick }) => (
  <div className={`${className} custom-arrow next-arrow`} onClick={onClick}>
    <Image src={nextIcon} alt="Next" width={30} height={30} />
  </div>
);

const CommonImagePopup = ({
  images = [],
  selectedIndex,
  setSelectedIndex,
  onClose,
  renderActions, 
  renderFooter,
}) => {
  const actionMenuRef = useRef(null);

  useEffect(() => {
  const videos = document.querySelectorAll("video");

  videos.forEach((video, i) => {
    if (i === selectedIndex) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => (document.body.style.overflow = "");
  }, [selectedIndex]);

  if (selectedIndex === null || !images[selectedIndex]) return null;

  const sliderSettings = {
    dots: false,
    infinite: images.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    afterChange: (current) => setSelectedIndex(current),
  };

  return (
    <div className="popupOverlay" onClick={onClose}>
      <div className="popupContent" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="popupHeader">
          <div className="popupHeader-left">
            <button className="closeButton" onClick={onClose}>
              <Image src={Crossicon} alt="Close" width={18} height={18} />
            </button>
            <div className="image-index">
              {`${selectedIndex + 1} / ${images.length}`}
            </div>
          </div>

          {renderActions && renderActions(images[selectedIndex], selectedIndex)}
        </div>

        {/* SLIDER */}
        <div className="popupSliderWrapper">
          <Slider {...sliderSettings} initialSlide={selectedIndex}>
            {images.map((img, idx) => (
              <div key={img._id || idx} className="slick-slide-item">
                {img.type === "video" ? (
                  <video
                    src={img.originalUrl}
                    controls
                    autoPlay={idx === selectedIndex}
                    className="popupVideo"
                  />
                ) : (
                  <img
                    src={img.thumbnailImageUrl || img.originalUrl}
                    className="popupImage"
                    alt=""
                  />
                )}
              </div>
            ))}
          </Slider>
        </div>

        <div className="popupFooter">
          {renderFooter && renderFooter(images[selectedIndex], selectedIndex)}
        </div>
      </div>
    </div>
  );
};

export default CommonImagePopup;