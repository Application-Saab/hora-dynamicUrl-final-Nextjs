"use client";

import Image from "next/image";
import "./CategoryTabs.css";

const CategoryTabs = ({ data, onSelect }) => {
  return (
    <div className="category-tabs">
      {data.map((cat) => (
        <button
          key={cat.id}
          className="category-tabs__button"
          onClick={() => onSelect(cat)}
        >
          {cat.image ? (
            <Image
              src={cat.image}
              alt={cat.imgAlt || cat.name}
              width={60}
              height={60}
              className="category-tabs__icon"
            />
          ) : (
            <div className="category-tabs__no-image">No Image</div>
          )}
          <span className="category-tabs__label">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
