"use client";

import Image from "next/image";
import "./CategoryTabs.css";
import { useDecorationEvents } from "@/utils/decorationEvents";
import { useRouter } from "next/navigation";

const CategoryTabs = ({ data, city, hasCityPageParam, decCat, locality, variant = "grid",catValue ,heading, hasBg = false}) => {
 const router = useRouter();
  const { handleItemClick, openCatItems } = useDecorationEvents(
     city ,
    hasCityPageParam,
    decCat,
   locality,
  );
  
const GridhandleClick = (cat) => {
    window.dataLayer.push({
    event: "theme_circle_clicked",
    themeName: cat.name,
    themeValue: cat.value,
    catValue: catValue,
  });
     const cityPath = city ? `/${city}` : "";
    router.push(
    `${cityPath}/balloon-decoration/${catValue}?theme=${encodeURIComponent(cat.value)}`
  );
  };
  const handleClick = (cat) => {
    window.dataLayer.push({
   event: "circle_tabs_clicked",
    categoryName: cat.name,
    subCategory: cat.subCategory || "",
    catValue: cat.catValue || "",
    imgAlt: cat.imgAlt || "",
  });
    handleItemClick({
      title: cat.name,
      categoryName: cat.name,
      subCategory: cat.subCategory,
      catValue: cat.catValue,
      imgAlt: cat.imgAlt,
    });
    openCatItems(cat);
  };

  return variant === "grid" ? (
     <div className={`category-tabs-outer ${hasBg ? "has-bg" : ""}`}>
  {heading && (
    <h3 className="category-tabs-heading">{heading}</h3>
  )}

  <div className="category-tabs-grid">
    {data
      .filter((cat) => cat.image)
      .map((cat) => (
        <button
          key={cat.id}
          className="category-tabs-card"
          onClick={() => GridhandleClick(cat)}
        >
          <Image
            className="category-tabs-circle"
            src={cat.image}
            alt={cat.name}
            width={80}
            height={80}
          />
          <span className="category-tabs-title">{cat.name}</span>
        </button>
      ))}
  </div>
</div>
  ) : (
      <div className="category-tabs">
      {data
           .filter((cat) => cat.image)
        .slice(0, 9)
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
