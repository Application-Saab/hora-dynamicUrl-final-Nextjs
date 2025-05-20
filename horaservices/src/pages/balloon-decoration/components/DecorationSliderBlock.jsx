import DecorationCard from "@/component/Cards/DecorationCard/DecorationCard";
import dynamic from "next/dynamic";
import React from "react";
const Slider = dynamic(() => import('react-slick'), { ssr: false });
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";


const DecorationSliderBlock = ({
  data,
  handleSliderViewMore,
}) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, dots: true },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true },
      },
    ],
  };

  return (
      <Slider {...sliderSettings} className="slider-decoration">
        {data.map((item, index) => (
          <div key={index} className="p-2">
            <DecorationCard
              item={item}
              onClick={() => {
                handleSliderViewMore(item.link);
              }}
            />
          </div>
        ))}
      </Slider>
  );
};

export default DecorationSliderBlock;
