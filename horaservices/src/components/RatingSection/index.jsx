import React, { useState } from "react";
import "./rating.css";
import angryImg from "@/assets/review/angry.svg";
import neutralImg from "@/assets/review/neutral.svg";
import loveImg from "@/assets/review/love.svg";
import Image from "next/image";
const Ratingsection  = ({orderId, onSubmitSuccess, setSelectedRating ,setCouponCode}) => {
    const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState(null);
const [message, setMessage] = useState("");
  const handleSelect = (value) => {
    setSelected(value);
    setSelectedRating(value); 
  };
const handleSubmit = async () => {
  if (!selected || message.trim() === "") return;

  let ratingValue = [];

  if (selected === "low") ratingValue = ["1-6"];
  if (selected === "mid") ratingValue = ["7-8"];
  if (selected === "high") ratingValue = ["9-10"];

  try {
    const res = await fetch(
      "https://horaservices.com:3000/api/order/add-rating-reviews",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          rating: ratingValue,
          reviews: message,
        }),
      }
    );

    const data = await res.json();

    if (!data.error) {

      if (selected === "low") {
        setCouponCode(data?.data?.couponCode || "HLLM5263");
      }

      setShowPopup(true); // ⭐ har rating par popup

      onSubmitSuccess();
    }

  } catch (error) {
    console.error("Submit Error:", error);
  }
};
  return (
    <div className="review-card">
      <h2>Rate Your Experience</h2>
      <p className="sub-text">
        Your valuable feedback helps us improve our services
      </p>

      {/* Emoji Section */}
    <div className="emoji-row">
  <div
    className={`emoji-box ${selected === "low" ? "active" : ""}`}
    onClick={() => handleSelect("low")}
  >
    <Image
      src={angryImg}
      alt="Low Rating"
      width={35}
      height={35}
        className="emoji-img"
    />
  </div>

  <div
    className={`emoji-box ${selected === "mid" ? "active" : ""}`}
    onClick={() => handleSelect("mid")}
  >
    <Image
      src={neutralImg}
      alt="Mid Rating"
      width={35}
      height={35}
     className="emoji-img"
    />
  </div>

  <div
    className={`emoji-box ${selected === "high" ? "active" : ""}`}
    onClick={() => handleSelect("high")}
  >
    <Image
      src={loveImg}
      alt="High Rating"
      width={35}
      height={35}
        className="emoji-img"
    />
  </div>
</div>

      {/* Range Buttons */}
      <div className="range-row">
        <button
          className={selected === "low" ? "active-btn" : ""}
          onClick={() => handleSelect("low")}
        >
          1 - 6
        </button>

        <button
          className={selected === "mid" ? "active-btn" : ""}
          onClick={() => handleSelect("mid")}
        >
          7 - 8
        </button>

        <button
          className={selected === "high" ? "active-btn" : ""}
          onClick={() => handleSelect("high")}
        >
          9 - 10
        </button>
      </div>

      {/* Message Box (Open on any selection) */}
    

   
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
{showPopup && (
  <div className="review-popup-overlay">
    <div className="review-popup-card">
 <button 
        className="popup-close-btn"
        onClick={() => setShowPopup(false)}
      >
        ✕
      </button>

      <Image
        src={
          selected === "low"
            ? angryImg
            : selected === "mid"
            ? neutralImg
            : loveImg
        }
        alt="rating"
        className="emojiImage"
      />

      <p className="rating-text">
        Rating : {selected === "low" ? "1 - 6" : selected === "mid" ? "7 - 8" : "9 - 10"}
      </p>

      <h3 className="cardheadding">Thanks for your feedback!</h3>

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