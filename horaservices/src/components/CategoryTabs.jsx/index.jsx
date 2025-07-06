"use client";

import Image from "next/image";
import "./CategoryTabs.css";
import { useDecorationEvents } from "@/utils/decorationEvents"; // correct path

const CategoryTabs = ({ data, onSelect, city, hasCityPageParam, decCat }) => {
  const { handleItemClick } = useDecorationEvents(
    city,
    hasCityPageParam,
    decCat
  );

  const handleClick = (cat) => {
    handleItemClick({
      title: cat.name,
      categoryName: cat.name,
      subCategory: cat.subCategory,
      catValue: cat.catValue,
      imgAlt: cat.imgAlt,
    });

    onSelect(cat);
  };

  return (
    // <div className="category-tabs">
    //   {data.map((cat) => (
    //     <button
    //       key={cat.id}
    //       className="category-tabs__button"
    //       onClick={() => handleClick(cat)}
    //     >
    //       {cat.image ? (
    //         <Image
    //           src={cat.image}
    //           alt={cat.imgAlt || cat.name}
    //           width={50}
    //           height={50}
    //           className="category-tabs__icon"
    //         />
    //       ) : (
    //         <div className="category-tabs__no-image">No Image</div>
    //       )}
    //       <span className="category-tabs__label">{cat.name}</span>
    //     </button>
    //   ))}
    // </div>
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
