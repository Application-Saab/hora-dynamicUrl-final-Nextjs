import React from "react";
import "./VenueFoodModal.css";
import Image from "next/image";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";

const VenueFoodModal = ({ data, onClose }) => {
  if (!data) return null;

  const { includes } = data;

  return (
    <div className="vfm-overlay" onClick={onClose}>
      <div className="vfm-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="vfm-header">
          <h2 className="vfm-title">{data.name}</h2>
          {data.subtitle && <p className="vfm-subtitle">{data.subtitle}</p>}
          <button className="vfm-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="vfm-divider" />

        {/* Price */}
        <div className="vfm-price-row">
          <span className="vfm-price-label">Price per person</span>
          <span className="vfm-price-value">{data.price} &nbsp;All Inclusive</span>
        </div>

        <div className="vfm-divider" />

        {/* Scrollable content */}
        <div className="vfm-dish-list">

          {/* Appetisers */}
          {includes?.appetisers && (
            <div className="vfm-group">
              <h4 className="vfm-group-heading">
                APPETISERS
                {includes.appetisers.note && (
                  <span className="vfm-note"> — {includes.appetisers.note}</span>
                )}
              </h4>

              {/* Veg */}
              {includes.appetisers.veg?.length > 0 && (
                <div className="vfm-sub-group">
                  <p className="vfm-sub-heading">
                    <Image src={vegIcon} alt="veg" width={14} height={14} />
                    Vegetarian
                  </p>
                  {includes.appetisers.veg.map((item, i) => (
                    <div key={i} className="vfm-dish-row">
                      <span className="vfm-dot veg">●</span>
                      <span className="vfm-dish-name">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Non-Veg */}
              {includes.appetisers.nonVeg?.length > 0 && (
                <div className="vfm-sub-group">
                  <p className="vfm-sub-heading">
                    <Image src={nonVegIcon} alt="non-veg" width={14} height={14} />
                    Non-Vegetarian
                  </p>
                  {includes.appetisers.nonVeg.map((item, i) => (
                    <div key={i} className="vfm-dish-row">
                      <span className="vfm-dot nonveg">●</span>
                      <span className="vfm-dish-name">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Course */}
          {includes?.mainCourse && (
            <div className="vfm-group">
              <h4 className="vfm-group-heading">
                MAIN COURSE
                {includes.mainCourse.note && (
                  <span className="vfm-note"> — {includes.mainCourse.note}</span>
                )}
              </h4>
              {includes.mainCourse.items?.map((item, i) => (
                <div key={i} className="vfm-dish-row">
                  <span className="vfm-dot veg">●</span>
                  <span className="vfm-dish-name">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Beverage */}
          {includes?.beverage?.length > 0 && (
            <div className="vfm-group">
              <h4 className="vfm-group-heading">BEVERAGE</h4>
              {includes.beverage.map((item, i) => (
                <div key={i} className="vfm-dish-row">
                  <span className="vfm-dot beverage">●</span>
                  <span className="vfm-dish-name">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Desserts */}
          {includes?.desserts?.length > 0 && (
            <div className="vfm-group">
              <h4 className="vfm-group-heading">DESSERTS</h4>
              {includes.desserts.map((item, i) => (
                <div key={i} className="vfm-dish-row">
                  <span className="vfm-dot dessert">●</span>
                  <span className="vfm-dish-name">{item}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VenueFoodModal;
