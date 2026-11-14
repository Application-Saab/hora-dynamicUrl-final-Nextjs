"use client";

import React from "react";
import "./VenueFoodCard.css";
import Image from "next/image";
import arrowImage from "@/assets/venuelanding/arrowpackage.svg";

// GTM dataLayer push (inline helper — no extra file needed)
const pushToDataLayer = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

const VenueFoodCard = ({ item, onView }) => {
  const hasNonVeg = item.packageItems?.some((pi) => pi.foodType === "non-veg");
  const hasVeg = item.packageItems?.some((pi) => pi.foodType === "veg");

  const trackViewMenu = (clickSource) => {
    pushToDataLayer("view_menu_click", {
      package_id: item?._id || "",
      package_title: item?.title || "",
      package_price: item?.actualPrice || null,
      venue_id: item?.venueId || "",
      button_name: "View Menu & Full Details",
      click_source: clickSource, // "card" ya "button"
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  return (
    <div
      className="vfc-card"
      onClick={() => {
        trackViewMenu("card");
        onView(item);
      }}
    >
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

            {item.subTitle && <p className="vfc-subtitle">{item.subTitle}</p>}
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
                trackViewMenu("button");
                onView(item);
              }}
            >
              View Menu &amp; Full Details
              <Image className="" src={arrowImage} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueFoodCard;