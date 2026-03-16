import React from "react";
import "./catering.css";

const CateringCard = ({ image, title, price, oldPrice, dish }) => {
  return (
    <div className="catering-card">
      <img src={image} alt={title} className="catering-img" />

      <div className="catering-content">
        <h3 className="catering-title">{title}</h3>

        <div className="price-row">
          <span className="price">₹{price}/-</span>
          <span className="old-price">₹{oldPrice}</span>
          <span className="dish">Dish ({dish})</span>
        </div>

        <p className="custom-text">Customization Available</p>

        <button className="view-btn">View More</button>
      </div>
    </div>
  );
};

export default CateringCard;