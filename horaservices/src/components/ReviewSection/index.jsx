// import React, { useEffect, useRef } from 'react';
// import allReviewsData from '@/utils/ReviewsData';
// import './ReviewSection.css';




import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
 import allReviewsData from '@/utils/ReviewsData';
import './ReviewSection.css';



import "swiper/css";


const getStars = (rating) => {
  const filled = Array(rating).fill(<span className="star filled">★</span>);
  const blank = Array(5 - rating).fill(<span className="star blank">★</span>);
  return [...filled, ...blank];
};

const ReviewSlider = () => {
  return (
    <div className="review-section">
      <h2 className="review-heading">Customer Review</h2>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000 }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
      >
        {allReviewsData.map((review, idx) => (
          <SwiperSlide key={idx}>
            <div className="review-card final-card">
              <div className="top-row">
                <img src={review.avatar} className="avatar-circle" alt={review.name} />
                <div className="top-info">
                  <div className="review-name-mono">{review.name}</div>
                  <div className="review-stars">{getStars(review.rating)}</div>
                </div>
              </div>
              <div className="review-text-block">{review.text}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
