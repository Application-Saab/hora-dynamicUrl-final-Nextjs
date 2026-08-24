"use client";

import React from "react";
import "./VenueFoodCard.css";
import Image from "next/image";
import arrowImage from "@/assets/venuelanding/arrowpackage.svg"
const VenueFoodCard = ({ item, onView }) => {
  const hasNonVeg = item.packageItems?.some((pi) => pi.foodType === "non-veg");
  const hasVeg = item.packageItems?.some((pi) => pi.foodType === "veg");

  return (
    <div className="vfc-card" onClick={() => onView(item)}>
      <div className="vfc-row">

        {/* LEFT — IMAGE */}
        <div className="vfc-imgBox">
  
          <Image
            src={item?.packageImageUrl}
            alt={item.title}
            fill
            className="vfc-img"
          />
        </div>

        {/* RIGHT — BODY + FOOTER */}
        <div className="vfc-right">
          <div className="vfc-body">

            <h3 className="vfc-title">{item.title}</h3>

            {item.subTitle && (
              <p className="vfc-subtitle">{item.subTitle}</p>
            )}
<div className="divider"></div>
            {/* Veg / Non-veg legend */}
            <div className="vfc-legend">
              {hasVeg && (
                <span className="vfc-legendItem">
                  <span className="vfc-legendDot vfc-legendDot--veg" />
                  Veg Available
                </span>
              )}
              {hasNonVeg && (
                <span className="vfc-legendItem">
                  <span className="vfc-legendDot vfc-legendDot--nveg" />
                  Non-Veg Available
                </span>
              )}
            </div>

            {/* Price row */}
            <div className="vfc-priceRow">
          
              <span className="vfc-price">₹{item.actualPrice} </span>
              <span className="vfc-plusTax">/- Plus Taxes</span>
            </div>

          </div>

          {/* FOOTER — CTA */}
          <div className="vfc-footer">
            <button
              className="vfc-cta"
              onClick={(e) => {
                e.stopPropagation();
                onView(item);
              }}
            >
              View Menu &amp; Full Details
             <Image className=""
             src={arrowImage}/>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VenueFoodCard;