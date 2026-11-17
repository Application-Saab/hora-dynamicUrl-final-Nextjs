"use client";

import React from "react";
import "./VenueFoodCard.css";
import Image from "next/image";
import arrowImage from "../../assets/venue/right_arrow_icon.svg";
import VegIcon from "../../assets/venue/veg_icon.svg";
import NonVegIcon from "../../assets/venue/non_veg_icon.svg";

// GTM dataLayer push (inline helper — no extra file needed)
const pushToDataLayer = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

const VenueFoodCard = ({ item, onView }) => {
  const packageItems = item?.packageItems || [];

  const hasVeg = packageItems.some(
    (pkgItem) => pkgItem?.itemId?.foodType?.toLowerCase() === "veg",
  );

  const hasNonVeg = packageItems.some(
    (pkgItem) =>
      pkgItem?.itemId?.foodType?.toLowerCase() === "non-veg" ||
      pkgItem?.itemId?.foodType?.toLowerCase() === "non veg",
  );
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
        <div className="vfc-imgBox">
          <Image
            src={item?.packageImageUrl}
            alt={item.title}
            fill
            className="vfc-img"
          />
        </div>

        <div className="vfc-right">
          <div className="vfc-body">
            <div className="vfc-titleRow">
              <h3 className="vfc-title">{item.title}</h3>
              {hasVeg && !hasNonVeg ? (
                <Image src={VegIcon} alt="Veg" height={15} width={15} />
              ) : (
                <Image src={NonVegIcon} alt="Non-Veg" height={15} width={15} />
              )}
            </div>

            {item.subTitle && <p className="vfc-subtitle">{item.subTitle}</p>}

            {item?.packageFeatures?.length > 0 && (
              <div className="vfc-features-row">
                {item.packageFeatures.map((feature, index) => (
                  <div key={index} className="vfc-feature">
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="vfc-priceRow">
              <span className="vfc-price">
                ₹{item?.discountedPrice || item?.actualPrice}
                <span className="price-closer-icon">/-</span>{" "}
              </span>
              <span className="vfc-plusTax"> Plus Taxes</span>
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
              View Menu
              <Image height={14} width={8} alt="arrow" src={arrowImage} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueFoodCard;
