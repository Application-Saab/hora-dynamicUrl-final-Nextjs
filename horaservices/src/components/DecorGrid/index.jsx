"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
const DecorGrid = ({ largeCard, smallCards, city = "", locality = "", decCat = [] }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Normalize string for matching
  const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

  // Build route using city, locality, categorySlug, and card catValue
  const buildCardPath = (card) => {
    if (!card?.catValue) return "/";

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);

    let path = "";
    if (city) path += `/${city.toLowerCase()}`;
    if (locality) path += `/${locality.toLowerCase()}`;

    path += `/${categorySlug}/${card.catValue.replace(/\s+/g, "-")}`;

    return path;
  };

  const handleClick = (card) => {
    const matched = decCat.find(
      (cat) => normalize(cat.catValue) === normalize(card.catValue)
    );

    if (!matched) {
      console.warn("No matching category in decCat for:", card.title);
      return;
    }

    // 🔹 GTM / dataLayer event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_item_clicked",
      event_category: "DecorGrid",
      title: card.title,
      categoryName: matched.name || "N/A",
      subCategory: matched.subCategory || "N/A",
      catValue: matched.catValue || "N/A",
      imgAlt: matched.imgAlt || "N/A",
      city: city || "default",
      locality: locality || "default",
    });

    // ✅ Navigate
    router.push(buildCardPath(card));
  };

  return (
    <div className="decor-grid-wrapper">
      <div className="decor-card-grid">
        <h4 className="decorke-wedding-heading">Your Dream Wedding Starts Here</h4>

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
                    height={120}
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
