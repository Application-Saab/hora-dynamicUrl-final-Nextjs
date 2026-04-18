import React from "react";
import "./VenueFoodCard.css";

const VenueFoodCard = ({ item, onView }) => {
  return (
    <div className="vfc-card" onClick={() => onView(item)}>
      <div className="vfc-left">
        <h3 className="vfc-title">{item.name}</h3>
        {item.subtitle && <p className="vfc-subtitle">{item.subtitle}</p>}
        <span className="vfc-tag">{item.tag}</span>
      </div>

      <div className="vfc-right">
        <span className="vfc-price">{item.price}</span>
        <button className="vfc-btn">View Menu</button>
      </div>
    </div>
  );
};

export default VenueFoodCard;
