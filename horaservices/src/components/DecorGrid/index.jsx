"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import "./DecorGrid.css";
import { useDecorationEvents } from "@/utils/decorationEvents";

const DecorGrid = ({ largeCard, smallCards, city, hasCityPageParam, decCat ,locality}) => {
  const router = useRouter();
  const { handleItemClick, openCatItems } = useDecorationEvents(city, hasCityPageParam, decCat ,locality);


  const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

 const handleClick = (card) => {
  const matched = decCat.find(
    (cat) => normalize(cat.catValue) === normalize(card.catValue)
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

  handleItemClick(eventData);      // ✅ Push GTM event
  openCatItems(matched);           // ✅ Correct dynamic routing
};


  return (
    <div className="decor-grid-wrapper">
      <div className="decor-card-grid">
        {/* 🔶 Large Card */}
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

        {/* 🔹 Small Cards */}
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

              </div>
              <h4 className="decor-small-label">{card.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecorGrid;
