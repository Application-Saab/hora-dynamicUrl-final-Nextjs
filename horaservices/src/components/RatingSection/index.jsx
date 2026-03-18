import React, { useState } from "react";
import "./rating.css";
import Image from "next/image";

import { BASE_URL, ADD_RATING_REVIEWS } from "@/utils/apiconstants";
import { ratingConfig } from "@/utils/ratingConfig";

const Ratingsection = ({
  orderId,
  onSubmitSuccess,
  setSelectedRating,
  setCouponCode,
}) => {

  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const handleSelect = (key) => {
    setSelected(key);
    setSelectedRating(key);
  };

  const handleSubmit = async () => {

    if (!selected || message.trim() === "") return;

    const selectedConfig = ratingConfig.find(
      (item) => item.key === selected
    );

    try {

      const res = await fetch(`${BASE_URL}${ADD_RATING_REVIEWS}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          rating: selectedConfig.value,
          reviews: message,
        }),
      });

      const data = await res.json();

      if (!data.error) {

        if (selected === "low") {
          setCouponCode(data?.data?.couponCode || "HLLM5263");
        }

        setShowPopup(true);
        onSubmitSuccess();
      }

    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const selectedConfig = ratingConfig.find(
    (item) => item.key === selected
  );

  return (

    <div className="review-card">

      <h2>Rate Your Experience</h2>

      <p className="sub-text">
        Your valuable feedback helps us improve our services
      </p>

      {/* Emoji Section */}

      <div className="emoji-row">

        {ratingConfig.map((item) => (

          <div
            key={item.key}
            className={`emoji-box ${selected === item.key ? "active" : ""}`}
            onClick={() => handleSelect(item.key)}
          >

            <Image
              src={item.emoji}
              alt={item.label}
              width={35}
              height={35}
              className="emoji-img"
            />

          </div>

        ))}

      </div>

      {/* Rating Buttons */}

      <div className="range-row">

        {ratingConfig.map((item) => (

          <button
            key={item.key}
            className={selected === item.key ? "active-btn" : ""}
            onClick={() => handleSelect(item.key)}
          >
            {item.label}
          </button>

        ))}

      </div>

      {/* Message */}

      {selected && (

        <textarea
          placeholder="Describe your experience"
          className="message-box"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

      )}

      <button
        className="submit-btn"
        disabled={!selected || message.trim() === ""}
        onClick={handleSubmit}
      >
        Submit
      </button>

      {/* Popup */}

      {showPopup && selectedConfig && (

        <div className="review-popup-overlay">

          <div className="review-popup-card">

            <button
              className="popup-close-btn"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>

            <Image
              src={selectedConfig.emoji}
              alt="rating"
              width={60}
              height={60}
              className="emojiImage"
            />

            <p className="rating-text">
              Rating : {selectedConfig.label}
            </p>

            <h3 className="cardheadding">
              Thanks for your feedback!
            </h3>

            <p className="popup-desc">
              We’re so glad you’re enjoying HORA.
              Please take a few seconds to rate us
              in the App Store - it would mean a lot!
            </p>

          </div>

        </div>

      )}

    </div>

  );
};

export default Ratingsection;