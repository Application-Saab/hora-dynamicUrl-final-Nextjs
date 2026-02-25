import React from "react";
import Image from "next/image";
import topBg from "@/assets/review/top-bg.svg";      // top wali image
import couponBg from "@/assets/review/coupon-bg.svg"; // bottom wali image
import giftIcon from "@/assets/review/gift_box.svg";      // gift icon
import angryImg from "@/assets/review/angry.png";
import neutralImg from "@/assets/review/neutral.png";
import loveImg from "@/assets/review/love.png";
import "./coupon.css";
const CouponPopup = ({ selectedRating }) => {
  
  return (
<div className="coupon-wrapper">
  <div className="coupon-card">
        {/* TOP SECTION */}
        <div className="coupon-top">
          <Image
            src={topBg}
            alt="top bg"
            fill
            className="bg-img"
          />

          <div className="top-content">
            <h2>🎁 Your Feedback Matters</h2>
            <p>Your valuable feedback helps us improve our services</p>
          </div>
        </div>

        {/* RATING ROW */}
  
      <div className="rating-row">
          <div className={`rate-pill ${selectedRating === 1 ? "active" : ""}`}>
            <Image src={angryImg} alt="low" className="rate-img" />
            <span>1 - 6</span>
          </div>

          <div className={`rate-pill ${selectedRating === 2 ? "active" : ""}`}>
            <Image src={neutralImg} alt="mid" className="rate-img" />
            <span>7 - 8</span>
          </div>

          <div className={`rate-pill ${selectedRating === 3 ? "active" : ""}`}>
            <Image src={loveImg} alt="high" className="rate-img" />
            <span>9 - 10</span>
          </div>
        </div>

        {/* COUPON SECTION */}
        <div className="coupon-bottom">
          <Image
            src={couponBg}
            alt="coupon bg"
            fill
            className="bg-img"
          />

          <div className="bottom-content">

            <Image
              src={giftIcon}
              alt="gift"
             className="gift-icon"
            />

            <h3>
              Additional <span>20% OFF</span> on your next order
            </h3>

            <div className="coupon-code-box">
              <p>Coupon Code</p>
              <h2>HLLM5263</h2>
            </div>

            <div className="tc-text">
              <p>T&C -</p>
              <p>Min order value - 2000</p>
              <p>Max order value - 5000</p>
              <p>
                If you cancel order, refund value will not include discount value, i.e. amt you paid after discount will only be refunded.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CouponPopup;