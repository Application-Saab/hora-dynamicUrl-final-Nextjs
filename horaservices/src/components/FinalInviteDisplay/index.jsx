

import React from "react";
import "./finalInvteDisplay.css";
import Head from "next/head";
import imageBackground from "@/assets/imageBackground.jpg";
const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const FinalInviteDisplay = ({ orderDetails, handleClick, isHost }) => {
  if (!orderDetails) return <p>Loading...</p>;

 

  return (

    <div className="invite-wrapper">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Aclonica&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="invite-card">
        <h2 className="invite-heading party-title">It's Time To Party!</h2>

        <div className="cake-image-wrapper">
          <img src={orderDetails.Image} alt="Cake" className="cake-image" />
        </div>

        <h3 className="invite-title highlight-title">
          {orderDetails.Name || "Someone"}’s{" "}
          {orderDetails["Event Type"] || "Birthday"}
        </h3>

      

<div className="event-info-wrapper">
  <div className="event-details">
    <div className="event-line">📅 Date : {formatDate(orderDetails.Date)}</div>
    <div className="event-line">⏰ Time : {orderDetails.Time}</div>
  </div>
  <div className="event-address">{orderDetails.Address}</div>
</div>



       
      </div>
     
    </div>

  );
};

export default FinalInviteDisplay;
