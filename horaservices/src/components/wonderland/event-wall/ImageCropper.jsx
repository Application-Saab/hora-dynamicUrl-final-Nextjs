import React from "react";
import CustomModal from "../common/CustomModal";
import Slider from "react-slick";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCropper = ({ isOpen, onClose, selectedImages }) => {
  if (!isOpen) return null;

  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 400,
    slidesToShow: 5, // 5 images in a row
    slidesToScroll: 2,
    swipeToSlide: true,
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      verticalCenter={false}
      body={
        <div style={{ padding: "10px" }}>
          <Slider {...settings}>
            {selectedImages.map((item, index) => (
              <div key={index} style={{ padding: "5px" }}>
                <Image
                  src={item.localPreview}
                  alt={`img-${index}`}
                  width={50}
                  height={50}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      }
    />
  );
};

export default ImageCropper;
