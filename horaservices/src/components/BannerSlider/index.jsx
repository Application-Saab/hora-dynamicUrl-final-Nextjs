'use client';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './BannerSlider.css';

const BannerSlider = ({ images = [] }) => {
  return (
    <div className="banner-slider-container">
     
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={false}
        loop={false}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Image
              src={img}
              alt={`Banner ${index + 1}`}
              width={1500}
              height={180}
              quality={100}
              loading="eager"
              className="banner-image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      </div>

  );
};

export default BannerSlider;
