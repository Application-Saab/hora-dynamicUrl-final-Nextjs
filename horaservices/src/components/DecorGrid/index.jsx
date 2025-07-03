"use client";

import Image from "next/image";
import "./DecorGrid.css";
import { useDecorationEvents } from "@/utils/decorationEvents";

const DecorGrid = ({ largeCard, smallCards, city, hasCityPageParam, decCat }) => {
  const { handleItemClick, openCatItems } = useDecorationEvents(city, hasCityPageParam, decCat);

  // Helper to normalize strings for better matching
  const normalize = (str) => str?.toLowerCase().replace(/[\s\-]+/g, "").trim();

  const handleClick = (card) => {
    const matched = decCat.find((cat) =>
      normalize(cat.name) === normalize(card.title) ||
      normalize(cat.subCategory) === normalize(card.title) ||
      normalize(cat.catValue) === normalize(card.link) ||
      normalize(card.title).includes(normalize(cat.name)) ||
      normalize(cat.name).includes(normalize(card.title))
    );

    if (!matched) {
      console.warn("No matching category in decCat for:", card.title);
      return;
    }

    const eventData = {
      title: card.title,
      categoryName: matched.name || "N/A",
      subCategory: matched.subCategory || "N/A",
      catValue: matched.catValue || "N/A",
      imgAlt: matched.imgAlt || "N/A",
    };

    handleItemClick(eventData);
    openCatItems(matched);
  };

  return (
    <div className="decor-grid-wrapper">
      <div className="decor-card-grid">
        {/* Large Card */}
        <div className="decor-large-card">
          <div className="decor-large-image-box">
            <Image
              src={largeCard.image}
              alt={largeCard.title}
              width={150}
              height={160}
              className="decor-large-img"
            />
          </div>
          <div className="decor-large-content">
            <h3 className="decor-large-title">{largeCard.title}</h3>
            <p className="decor-large-subtitle">{largeCard.description}</p>
            <button className="decor-view-btn" onClick={() => handleClick(largeCard)}>
              View more
            </button>
          </div>
        </div>

        {/* Small Cards */}
        <div className="decor-small-cards-container">
          {smallCards.map((card, index) => (
            <div
              key={index}
              className="decor-small-card-wrapper"
              onClick={() => handleClick(card)}
              style={{ cursor: "pointer" }}
            >
              <div className="decor-small-card">
                <div className="decor-small-img-box">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={400}
                    height={100}
                    className="decor-small-img"
                  />
                </div>
                <h4 className="decor-small-label">{card.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecorGrid;
