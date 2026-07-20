// components/SwiperOptimized.js
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function SwiperOptimized({ banners }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: true }}
      loop
    //   className="mySwiper"
    >
      {banners.map((img, i) => (
        <SwiperSlide key={i}>
          <Image
            src={img}
            alt={`Banner ${i + 1}`}
            width={1200}
            height={400}
            quality={85}
            priority={i === 0}
            sizes="100vw"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}