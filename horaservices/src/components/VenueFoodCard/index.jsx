"use client";

import React from "react";
import "./VenueFoodCard.css";
import Image from "next/image";

const VenueFoodCard = ({ item, onView }) => {
  return (
    <div className="vfc-card" onClick={() => onView(item)}>

      {/* HORIZONTAL ROW: image left + content right */}
      <div className="vfc-row">

        {/* LEFT — IMAGE */}
        <div className="vfc-imgBox">
          {item.discountedPrice && (
            <span className="vfc-discount">🔥 {item.discountedPrice}</span>
          )}
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

            {/* Veg / Non-veg tag */}
            {/* <span className={`vfc-tag vfc-tag--${item.type}`}>
              <span className={`vfc-dot vfc-dot--${item.type}`} />
              {item.typeLabel}
            </span> */}

            {/* Title */}
            <h3 className="vfc-title">{item.title}</h3>

            {/* Price row */}
            <div className="vfc-priceRow">
              {item.actualPrice && (
                <span className="vfc-origPrice">{item.actualPrice}</span>
              )}
              <span className="vfc-price">{item.discountedPrice}</span>
              {item.tag && (
              <span className="vfc-inclusive">✦ {item.tag}</span>
            )}
            </div>

            {/* All Inclusive pill */}
          

            {/* Subtitle */}
            {item.subTitle && (
              <p className="vfc-subtitle">{item.subTitle}</p>
            )}

          </div>

          {/* FOOTER */}
          <div className="vfc-footer">
            <button
              className="vfc-link"
              onClick={(e) => {
                e.stopPropagation();
                onView(item);
              }}
            >
              View Menu
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default VenueFoodCard;
