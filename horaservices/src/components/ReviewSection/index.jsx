import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "./ReviewSection.css";
import "swiper/css";

const getStars = (rating) => {
  const filled = Array(rating).fill(<span className="star filled">★</span>);
  const blank = Array(5 - rating).fill(<span className="star blank">★</span>);
  return [...filled, ...blank];
};

const getAvatarSrc = (avatar) => {
  if (!avatar) return null;
  if (typeof avatar === "string") return avatar;
  if (typeof avatar === "object" && avatar.src) return avatar.src;
  return null;
};

const ReviewSlider = ({ reviews = [], title = "" }) => {
  return (
    <div className="review-section">
      <h2 className="review-heading">{title}</h2>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000 }}
        loop={true}
        spaceBetween={6}
        slidesPerView={1.85}
        centeredSlides={true}
      >
        {reviews.map((review, idx) => {
          const avatarSrc = getAvatarSrc(review.avatar);
          return (
            <SwiperSlide key={idx}>
              <div className="review-card final-card">
                <div className="top-row">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      className="avatar-circle"
                      alt={review.name}
                    />
                  ) : (
                    <div className="avatar-circle avatar-initial">
                      {review.initial || review.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="top-info">
                    <div className="review-name-mono">{review.name}</div>
                    <div className="review-stars">{getStars(review.rating)}</div>
                  </div>
                </div>
                <div className="review-text-block">{review.text}</div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default React.memo(ReviewSlider);