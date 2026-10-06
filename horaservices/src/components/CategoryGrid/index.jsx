"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import "./CategoryGrid.css";
import Dashes from "@/assets/Decordashes.svg";
import Heart from "@/assets/Decorheart.svg";
import DashesSmall from "@/assets/Decordashessmall.svg";

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

  // Only tracking (navigation <a href> se hogi)
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
        {/* wrapper = container-type (cqw units isi se bante hain) */}
        <div className="category-grid-wrap">
          <div className="category-grid">
            {cardsData.map((card, index) => {
              const href = buildCardPath(card);

              return (
                <a
                  key={index}
                  href={href}
                  className={`category-grid__card ${card.sizeClass || ""} ${card.extraClass || ""}`}
                  onClick={() => handleSliderViewMore(card)}
                  style={{ cursor: card.catValue ? "pointer" : "default" }}
                >
                  <div className="category-grid__image-wrapper">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 60vw, 400px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="category-grid__content">
                    {/* decorations */}
                    <Image
                      src={Dashes}
                      alt=""
                      aria-hidden="true"
                      unoptimized
                      className="category-grid__decor category-grid__decor--dash"
                    />
                    <Image
                      src={Heart}
                      alt=""
                      aria-hidden="true"
                      unoptimized
                      className="category-grid__decor category-grid__decor--heart"
                    />
                    <Image
                      src={DashesSmall}
                      alt=""
                      aria-hidden="true"
                      unoptimized
                      className="category-grid__decor category-grid__decor--dash-small"
                    />

                    <h3>{card.title}</h3>
                    {card.subtitle && <p>{card.subtitle}</p>}

                    {card.catValue && (
                      <span className="category-grid__button">View more →</span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;