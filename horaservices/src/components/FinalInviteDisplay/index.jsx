import React from "react";
import "./finalInvteDisplay.css";

const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const FinalInviteDisplay = ({ orderDetails, handleClick }) => {
  if (!orderDetails) return <p>Loading...</p>;

  return (
    <div className="invite-wrapper">
      <div className="invite-card">
        <h2 className="invite-heading">YOU‘RE INVITED</h2>

        <div className="cake-image-wrapper">
          <img
            src={orderDetails.Image} // ✅ Expecting base64 format here
            alt="Cake"
            className="cake-image"
          />
        </div>

        <h3 className="invite-title">
          {orderDetails.Name || "Someone"}‘S{" "}
          {orderDetails["Event Type"] || "Birthday"} CELEBRATION
        </h3>

        <p className="invite-detail">
          <span>📅</span> DATE : {formatDate(orderDetails.Date)}
        </p>

        <p className="invite-detail">
          <span>⏰</span> TIME : {orderDetails.Time}
        </p>

        <p className="invite-detail">
          <span>📍</span> <strong>Home</strong> ({orderDetails.Address || "Venue"})
        </p>

        <button className="invite-btn" onClick={handleClick}>
          📩 Explore Invites templates
        </button>
      </div>
    </div>
  );
};

export default FinalInviteDisplay;
