import React from "react";
import Image from "next/image";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";
const CateringCard = ({item, image, title, price, oldPrice, dish,onView }) => {
  const dishCount = item?.packageItems?.length ?? item?.dish ?? item?.dishCount ?? 0;


  return (
    <div className="catering-card">
      <img src={image} alt={title} className="catering-img" />

      <div className="catering-content">
     <div className="title-row">
          <h3 className="catering-title">{title}</h3>

          <Image
            src={
              item?.foodType?.toLowerCase() === "veg"
                ? vegIcon
                : nonVegIcon
            }
            alt="food type"
            className="fooddot"
          />
        </div>
        <div className="price-row">
          <span className="price">₹{price}/-</span>
          <span className="old-price">₹{oldPrice}</span>
        <span className="dish">Dish{"{"}{dishCount}{"}"}</span>
        </div>

        <p className="custom-text">Customization Available</p>

       <button className="view-btn" onClick={() => onView(item)}>
          View More
        </button>
      </div>
    </div>
  );
};

export default CateringCard;