import React from "react";
import "./cateringModal.css";

const CateringModal = ({ data, onClose }) => {
  if (!data) return null;

  const items = data.packageItems || [];

  return (
     <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modaltitle">
          {data.name} <span className="veg-dot"></span>
        </h2>
        <p className="min-order">Minimum order starts from 10 people</p>
        <div className="dish-list">
          {items.map((dish, i) => (
            <div key={i} className="dish-row">
              <img
                src={`https://horaservices.com/api/uploads/${dish.image}`}
                alt={dish.name}
              />
              <span className="dishname">{dish.name}</span>
            </div>
          ))}
        </div>

        <div className="price-row-bottom">
          <span>Total Price</span>
          <span>₹{data.price}/-</span>
        </div>

        <div className="btn-row">
          <button className="outline-btn">Order Now</button>
          <button className="filled-btn">Customize Package</button>
        </div>
      </div>
    </div>
  );
};

export default CateringModal;