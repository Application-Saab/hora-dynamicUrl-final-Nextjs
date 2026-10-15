"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import smallcardBackground from "@/assets/small-cardBackground.webp";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import "./SmallCardGrid.css";

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="55%" height="55%" aria-hidden="true">
    <path
      d="M9 5l7 7-7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SmallCardGrid = ({ city = "", locality = "", decCat = [], categories = [] }) => {
  const pathname = usePathname();
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Normalize string for matching
  const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

  // Build route using city, locality, categorySlug, and card catValue
  const buildCardPath = (item) => {
    if (!item?.catValue) return "/";

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);

    let path = "";
    if (city) path += `/${city.toLowerCase()}`;
    if (locality) path += `/${locality.toLowerCase()}`;

    path += `/${categorySlug}/${item.catValue.replace(/\s+/g, "-")}`;

    return path;
  };

  // Only tracking (navigation <a href> se hogi)
  const handleClick = (item) => {
    const matchedCat = decCat.find(
      (cat) => normalize(cat.catValue) === normalize(item.catValue)
    );

    if (!matchedCat) {
      console.warn("No matching category in decCat for:", item.catValue);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_item_clicked",
      event_category: "SmallCardGrid",
      title: item.name,
      categoryName: matchedCat.name || "N/A",
      subCategory: matchedCat.subCategory || "N/A",
      catValue: matchedCat.catValue || "N/A",
      imgAlt: matchedCat.imgAlt || "N/A",
      city: city || "default",
      locality: locality || "default",
    });
  };

  // Arrow visibility
  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [categories]);

  const scrollByPage = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="small-card-grid-outer">
        <div className="small-card-slider">
          <div className="small-card-viewport">
            <div
              className="small-card-grid"
              ref={scrollerRef}
              onScroll={updateArrows}
            >
              {categories.map((item, index) => (
                <a
                  key={index}
                  href={buildCardPath(item)}
                  className="small-card-wrapper"
                  onClick={() => handleClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="small-card"
                    style={{ backgroundImage: `url(${smallcardBackground.src})` }}
                  >
                    <div className="small-card__img">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 600px) 24vw, 150px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <p className="small-card-name">{item.name}</p>
                </a>
              ))}
            </div>

            {/* arrows: har row ke card ke beech mein */}
            {[1, 2].map((row) => (
              <span key={row}>
                {canPrev && (
                  <button
                    type="button"
                    aria-label="Previous"
                    className={`small-card-arrow small-card-arrow--prev small-card-arrow--row${row}`}
                    onClick={() => scrollByPage(-1)}
                  >
                    <ChevronIcon />
                  </button>
                )}
                {canNext && (
                  <button
                    type="button"
                    aria-label="Next"
                    className={`small-card-arrow small-card-arrow--next small-card-arrow--row${row}`}
                    onClick={() => scrollByPage(1)}
                  >
                    <ChevronIcon />
                  </button>
                )}
              </span>
            ))}
          </div>
      </div>
    </div>
  );
};

export default SmallCardGrid;
