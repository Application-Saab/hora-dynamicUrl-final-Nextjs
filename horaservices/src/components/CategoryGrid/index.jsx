"use client";

import Image from "next/image";
import "./CategoryGrid.css";
import { useDecorationEvents } from "../../utils/decorationEvents";
import { decCat } from "@/utils/decorationCategories";

const CategoryGrid = ({ cardsData, city, locality }) => {
  const hasCityPageParam = !!city;
  const { handleSliderViewMore } = useDecorationEvents(
    city,
    hasCityPageParam,
    decCat,
    locality
  );

  return (
    <div className="CategoryGrid-outer">
      <div className="page-width">
        <div className="category-grid">
          {cardsData.map((card, index) => (
            <div
              key={index}
              className={`category-grid__card ${card.sizeClass} ${card.extraClass || ""}`}
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

                {card.link && (
                  <button
                    className="category-grid__button"
                    onClick={() => handleSliderViewMore(card.link, card.title)}
                  >
                    View All
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
