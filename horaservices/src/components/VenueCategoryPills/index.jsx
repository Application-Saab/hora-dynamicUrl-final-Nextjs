import React from "react";
import tagIcon from "@/assets/venuelanding/tagIcon.svg";
import Image from "next/image";
const VenueCategoryPills = ({ categories = [] }) => {
  const list = Array.isArray(categories) ? categories : [];
  if (!list.length) return null;

  return (
    <div className="venue-category-row">
      <div className="venue-category-home">
        <svg viewBox="0 0 24 24" width="12.16" height="12" fill="none">
          <path
            d="M3 11.5L12 4l9 7.5M5.5 10v9a1 1 0 001 1h4v-6h3v6h4a1 1 0 001-1v-9"
            stroke="#7B2D8E"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="venue-category-scroll">
        {list.map((cat, i) => {
          const label = typeof cat === "string" ? cat.replace(/["]/g, "") : cat?.name || cat?.categoryName;
          if (!label) return null;
          return (
            <span className="venue-category-pill" key={cat._id || i}>
              <Image src={tagIcon} alt="Tag" className="pill-cat-img" width={12} height={12} />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default VenueCategoryPills;