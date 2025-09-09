import React from "react";
import Image from "next/image";
import logo from "../../assets/new_logo_light.png";
import "./highpriceproduct.css";
import { useEffect } from "react";

const HighPriceProduct = ({ data, onCardClick }) => {
  if (!data || data.length === 0) return null;

  const highest = data.reduce((prev, curr) =>
    curr.price > prev.price ? curr : prev,
    data[0]
  );

  return (
    <div className="highdecContainer">
      <div className="highPriceCard" onClick={() => onCardClick?.(highest)}>
        <div className="highPriceImageWrapper">
          <Image
            src={`https://horaservices.com/api/uploads/compressed_webp/${highest.featured_image?.split(".")[0]}.webp`}
            alt={highest.name}
            width={700}
            height={250}
            className="highPriceImage"
          />
          <div className="highdiscountBadge">
            ₹ {highest.discountDifference.toFixed(0)} off
          </div>
        </div>

        <div className="highPriceContent">
          <p className="highproductName">
            {highest.name.length > 25 ? `${highest.name.slice(0, 25)}...` : highest.name}
          </p>
          <div className="highpriceRow">
            <p className="highdiscountedPrice">₹{highest.price}</p>
            <p className="highoriginalPrice">₹{Math.floor(highest.discountedPrice)}</p>
          </div>
          <p className="highcustomization">Customization Available</p>
          <p className="highviewMore">View More</p>
        </div>
      </div>
    </div>
  );
};

export default HighPriceProduct