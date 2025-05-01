import DecorationCard from "@/component/Cards/DecorationCard/DecorationCard";
import React from "react";
import Slider from "react-slick";

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
    <div className="container">
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
    </div>
  );
};

export default DecorationSliderBlock;
