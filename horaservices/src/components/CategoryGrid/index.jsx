"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import "./CategoryGrid.css";

const CategoryGrid = ({ cardsData = [], city = "", locality = "" }) => {
  const pathname = usePathname();

  // Build full path using city + locality + categorySlug + card.catValue
  const buildCardPath = (card) => {
    if (!card?.catValue) return "/";

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);

    let path = "";
    if (city) path += `/${city.toLowerCase()}`;
    if (locality) path += `/${locality.toLowerCase()}`;

    path += `/${categorySlug}/${card.catValue.replace(/\s+/g, "-")}`;

    return path;
  };

  // Only tracking (navigation ab <a href> se hogi)
  const handleSliderViewMore = (card) => {
    if (!card?.catValue) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: city
        ? "slider_view_all_citypage_clicked"
        : "slider_view_all_clicked",
      viewAllTitle: card.title,
      catValue: card.catValue,
      city: city || "default",
      locality: locality || "default",
    });
  };

  return (
    <div className="CategoryGrid-outer">
      <div className="page-width">
        <div className="category-grid">
          {cardsData.map((card, index) => {
            const href = buildCardPath(card);

            return (
              <a
                key={index}
                type="button"
                href={href}
                className={`category-grid__card ${card.sizeClass} ${card.extraClass || ""}`}
                onClick={() => handleSliderViewMore(card)}
                style={{ cursor: card.catValue ? "pointer" : "default" }}
              >
                <div className="category-grid__image-wrapper">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={300}
                    height={200}
                    style={{ objectFit: "cover", width: "100%", height: "auto" }}
                  />
                </div>

                <div className="category-grid__content">
                  <h3>{card.title}</h3>
                  {card.subtitle && <p>{card.subtitle}</p>}

                  {card.catValue && (
                    <span className="category-grid__button">View More</span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
