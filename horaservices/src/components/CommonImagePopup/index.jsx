"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import ArrowImg from "../../assets/arrow.svg";
import nextIcon from "../../assets/nextIcon.svg";
import Image from "next/image";
import Crossicon from "../../assets/Crossicon.svg";
import "./commonPopup.css";

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
  renderActions,
  onClose,
  renderFooter,
  isEventWall = false,
}) => {
  const sliderRef = useRef(null);
  const [imageNumber, setImageNumber] = useState(0);
  const activeVideoRef = useRef(null);

  // 1. वर्चुअल स्लाइड्स का डेटा तैयार करें (ताकि DOM में केवल 3 आइटम्स रहें)
  const virtualSlides = React.useMemo(() => {
    if (selectedIndex === null || !images.length) return [];
    return images
      .map((item, idx) => {
        const isVisible = Math.abs(idx - selectedIndex) <= 1;
        if (!isVisible) return null;
        return { item, originalIndex: idx };
      })
      .filter(Boolean);
  }, [images, selectedIndex]);

  // वर्चुअल स्लाइड्स एरे के अंदर वर्तमान एक्टिव स्लाइड का इंडेक्स खोजना
  const currentVirtualIndex = React.useMemo(() => {
    return virtualSlides.findIndex(slide => slide.originalIndex === selectedIndex);
  }, [virtualSlides, selectedIndex]);

  // 2. स्लाइडर सेटिंग्स (जिसमें वर्चुअल स्लाइड्स का सही इस्तेमाल हो रहा है)
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 250,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (current, next) => {
      // स्लाइड बदलने से पहले पुराने वीडियो को पॉज करें
      if (activeVideoRef.current) {
        try { activeVideoRef.current.pause(); } catch (e) { }
      }
      const targetSlide = virtualSlides[next];
      if (targetSlide) {
        setImageNumber(targetSlide.originalIndex + 1);
        setSelectedIndex(targetSlide.originalIndex);
      }
    },
  };

  // 3. बॉडी स्क्रॉल लॉक करने और पहली बार ओपन होने पर सही इमेज नंबर सेट करने के लिए
  useEffect(() => {
    if (selectedIndex !== null) {
      setImageNumber(selectedIndex + 1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (activeVideoRef.current) {
        try { activeVideoRef.current.pause(); } catch (e) { }
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  if (selectedIndex === null || !images[selectedIndex]) return null;

  return (
    <div
      className="popupOverlay"
      onClick={() => setSelectedIndex(null)}
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 999 }}
    >
      <div className="popupContent" onClick={(e) => e.stopPropagation()}>
        <div className="popupHeader">
          <div className="popupHeader-left">
            <button className="closeButton" onClick={onClose}>
              <Image src={Crossicon} alt="Close" width={18} height={18} />
            </button>
            <div className="image-index">
              {`${imageNumber} / ${images.length}`}
            </div>
          </div>

          {renderActions && renderActions(images[selectedIndex], selectedIndex)}
        </div>

        {/* Slider */}
        <div className="popupSliderWrapper">
          <Slider
            {...sliderSettings}
            initialSlide={currentVirtualIndex >= 0 ? currentVirtualIndex : 0}
            key={`eventwall-slider-${selectedIndex}`}
            ref={sliderRef}
          >
            {virtualSlides.map(({ item, originalIndex }) => {
              const isVideo = item.type === "video";
              const isActive = originalIndex === selectedIndex;

              return (
                <div key={item._id || originalIndex} className="slick-slide-item">
                  {isVideo ? (
                    <video
                      ref={(el) => { if (isActive) activeVideoRef.current = el; }}
                      src={isEventWall ? item?.postUrl : item.originalUrl}
                      controls
                      playsInline
                      preload="metadata"
                      autoPlay={isActive}
                      muted={false}
                      style={{ maxHeight: "80vh", width: "100%", objectFit: "contain", background: "#000" }}
                    />
                  ) : (
                    <img
                      src={isEventWall ? item?.postWebpUrl || item?.postUrl : item.thumbnailImageUrl || item.originalUrl}
                      loading="eager"
                      alt={`Media ${originalIndex + 1}`}
                      style={{ maxHeight: "80vh", width: "100%", objectFit: "contain" }}
                    />
                  )}
                </div>
              );
            })}
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