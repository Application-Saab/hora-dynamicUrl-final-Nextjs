"use client";

import Image from "next/image";
import "./CategoryTabs.css";
import { useDecorationEvents } from "@/utils/decorationEvents";

const CategoryTabs = ({ data, city, hasCityPageParam, decCat, locality }) => {
  const { handleItemClick, openCatItems } = useDecorationEvents(
    city,
    hasCityPageParam,
    decCat,
    locality
  );

  const handleClick = (cat) => {
    handleItemClick({
      title: cat.name,
      categoryName: cat.name,
      subCategory: cat.subCategory,
      catValue: cat.catValue,
      imgAlt: cat.imgAlt,
    });

    openCatItems(cat);
  };

  return (
    <div className="category-tabs">
      {data
        .filter((cat) => cat.image && cat.image.trim() !== "")
        .slice(0, 7)
        .map((cat) => (
          <button
            key={cat.id}
            className="category-tabs__button"
            onClick={() => handleClick(cat)}
          >
            <div
              className="category-tabs__circle"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <span className="category-tabs__circle-label">{cat.name}</span>
            </div>
          </button>
        ))}
    </div>
  );
};

export default CategoryTabs;
