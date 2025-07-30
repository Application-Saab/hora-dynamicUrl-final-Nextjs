import React from "react";

// Local formatDate function
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
    <div className="overlay-content bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-4 max-w-2xl w-full text-center">
      <h1 className="invitation-title text-3xl font-bold mb-4">
        YOU’RE INVITED
      </h1>

      <div className="profile-container flex justify-center mb-4">
        <div className="profile-image w-36 h-36 rounded-full overflow-hidden border-4 border-pink-300 shadow-md">
          <img
            src={`https://horaservices.com/api/uploads/${orderDetails.Image}`}
            alt={orderDetails.Name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <h2 className="subtitle text-2xl font-semibold text-pink-600 mb-2">
        {orderDetails.Name || "Someone Special"}’s{" "}
        {orderDetails["Event Type"] || "Celebration"} Celebration
      </h2>

      <p className="event-info text-gray-700 mb-1">
        📅 {formatDate(orderDetails.Date)} at 🕒 {orderDetails.Time}
      </p>

      <p className="event-info text-gray-700 mb-4">
        📍 Venue:{" "}
        <span className="venue-highlight font-medium text-pink-600">
          {orderDetails.Address || "Venue Details"}
        </span>
      </p>

      <button className="explore-btn" onClick={handleClick}>
        ✏️ Explore Invite Templates
      </button>
    </div>
  );
};

export default FinalInviteDisplay;
