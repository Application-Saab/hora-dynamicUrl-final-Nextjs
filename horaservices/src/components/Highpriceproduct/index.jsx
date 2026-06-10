import React from "react";
import Image from "next/image";

import "./highpriceproduct.css";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";

const HighPriceProduct = ({ data, onCardClick }) => {
  if (!data || data.length === 0) return null;

  const highest = data.reduce((prev, curr) =>
    curr.price > prev.price ? curr : prev,
    data[0]);

  const designKey =
    highest.designType &&
    Object.keys(highest.designType).find(
      key => highest.designType[key] === true
    );

  return (
    <div className="highdecContainer">
      <div
        className="highPriceCard"
        onClick={() => onCardClick?.(highest)}
      >
        <div className="highPriceImageWrapper">

          {/* ✅ DESIGN TYPE TOP LEFT */}
          {designKey && (
            <div className="highDesignBadge">
              On {designKey}
            </div>
          )}

          <Image
            src={
              highest.featured_images?.[0]?.fileName
                ? `${COMPRESSED_WEBP_IMG_URL}${highest.featured_images[0].fileName.split(".")[0]}.webp`
                : "/fallback-image.png"
            }
            alt={highest.name}
            className="highPriceImage"
          />
        </div>

        <div className="highPriceContent">

         <p className="highproductName">
            {highest.name.length > 25 ? `${highest.name.slice(0, 25)}...` : highest.name}
          </p>

       <div className="highpriceRow">
  <span className="highdiscountedPrice">
  ₹{highest.price}
  </span>

  <span className="highoriginalPrice">
  ₹{Math.floor(highest.discountedPrice)}
  </span>

 
    <span className="highdiscountBadge">
           ₹ {highest.discountDifference.toFixed(0)} off
    </span>
 
</div>


          <p className="highcustomization">
            Customization Available
          </p>

          <p className="highviewMore">
            View more
          </p>

        </div>
      </div>
    </div>
  );
};



export default HighPriceProduct;
