
import React from "react";
import "./VenueFoodCard.css";
import Image from "next/image";

const VenueFoodCard = ({ item, onView }) => {
  return (
    <div className="vfc-card">
      <div className="vfc-row">

        {/* IMAGE */}
        <div className="vfc-imgBox">
          <Image
            src={item.image}
            alt={item.name}
            className="vfc-img"
          />
        </div>

        {/* LEFT */}
        <div className="vfc-left">
          <h3 className="vfc-title">{item.name}</h3>

          {item.subtitle && (
            <p className="vfc-subtitle">{item.subtitle}</p>
          )}
        </div>

        {/* RIGHT */}
       <div className="vfc-right">
  <div className="vfc-priceBox">
    <span className="vfc-price">{item.price}</span>
    <span className="vfc-inclusive">{item.tag}</span>
  </div>

  <button
    className="vfc-link"
    onClick={() => onView(item)}
  >
    View Menu →
  </button>
</div>

      </div>
    </div>
  );
};

export default VenueFoodCard;