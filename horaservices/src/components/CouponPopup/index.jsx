import React from "react";
import Image from "next/image";
import topBg from "@/assets/review/top-bg.svg";
import couponBg from "@/assets/review/coupon-bg.svg";
import giftIcon from "@/assets/review/gift_box.svg";
import smallBg from "@/assets/review/small-bg.svg";
import finalImage from "@/assets/review/final_image.svg";
import instagramIcon from "@/assets/review/instagram.svg";
import googleIcon from "@/assets/review/google.svg";

import { ratingConfig } from "@/utils/ratingConfig";
import ReviewButton from "@/components/ReviewButton";

import "./coupon.css";

const CouponPopup = ({ selectedRating, couponCode }) => {

  const selectedConfig = ratingConfig.find(
    (item) => item.key === selectedRating
  );

  const handleInstagramReview = () => {
    window.open("https://www.instagram.com/horaservices/", "_blank");
  };

  const handleGoogleReview = () => {
    window.open("https://g.page/r/CaXMITOTBZzAEAE/review", "_blank");
  };

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

          {ratingConfig.map((rate) => (

            <div
              key={rate.key}
              className={`rate-pill ${
                selectedRating === rate.key ? "active" : ""
              }`}
            >

              <Image
                src={rate.emoji}
                alt={rate.label}
                className="rate-img"
              />

              <span>{rate.label}</span>

            </div>

          ))}

        </div>

        {/* COUPON SECTION */}

        {/* LOW RATING 1-6 */}

        {selectedRating === "low" && (

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
                <h2>{couponCode}</h2>
              </div>

              <div className="tc-text">

                <p>T&C -</p>
                <p>Min order value - 2000</p>
                <p>Max order value - 5000</p>

                <p>
                  If you cancel order, refund value will not include discount value,
                  i.e. amount you paid after discount will only be refunded.
                </p>

              </div>

            </div>

          </div>

        )}

        {/* MID RATING 7-8 */}

        {selectedRating === "mid" && (

          <div className="smallimageCard">

            <Image
              src={smallBg}
              alt="background"
              className="smallcardimage"
            />

            <div className="smalloverlayText">
              Ooh, we have still not reached the mark!!
            </div>

          </div>

        )}

        {/* HIGH RATING 9-10 */}

        {selectedRating === "high" && (

          <div className="cardimageCard">

            <div className="imagecard">

              <Image
                src={finalImage}
                alt="background"
              />

            </div>

            <div className="cardoverlayContent">

              <div className="cardgiftIcon">

                <Image
                  src={giftIcon}
                  className="gift-icon"
                  alt="gift"
                />

              </div>

              <h2>
                Unlock Discount Coupon for your Next Order!
              </h2>

              <p>
                Just share a screenshot of your review with us or
                collaborate with us on Instagram.
              </p>

              <div className="buttonGroup">

                <ReviewButton
                  icon={instagramIcon}
                  text="Review on Instagram"
                  onClick={handleInstagramReview}
                  className="instaBtn"
                />

                <ReviewButton
                  icon={googleIcon}
                  text="Review on Google"
                  onClick={handleGoogleReview}
                  className="googleBtn"
                />

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default CouponPopup;