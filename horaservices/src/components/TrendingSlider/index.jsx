"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import "./TrendingSlider.css";

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

const GoArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="75%" height="75%" aria-hidden="true">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrendingSlider = ({
  title = "Trending Wedding Collections",
  data = [],
  city = "",
  locality = "",
}) => {
  const pathname = usePathname();
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // item.link diya ho to wahi, warna city/locality/categorySlug/catValue se bana lo
  const buildPath = (item) => {
    if (item?.link) return item.link;
    if (!item?.catValue) return "/";

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);

    let path = "";
    if (city) path += `/${city.toLowerCase()}`;
    if (locality) path += `/${locality.toLowerCase()}`;

    return `${path}/${categorySlug}/${item.catValue.replace(/\s+/g, "-")}`;
  };

  const handleClick = (item) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "trending_collection_clicked",
      sectionTitle: title,
      title: item.title,
      catValue: item.catValue || "N/A",
      city: city || "default",
      locality: locality || "default",
    });
  };

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
  }, [data]);

  const scrollByPage = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!data.length) return null;

  return (
    <section className="trend-outer">
        <div className="trend-container">
          <div className="trend-viewport">
            <h2 className="trend-title">{title}</h2>

            <div className="trend-slider">
              <div
                className="trend-grid"
                ref={scrollerRef}
                onScroll={updateArrows}
              >
                {data.map((item, index) => (
                  <a
                    key={item.catValue || index}
                    href={buildPath(item)}
                    className="trend-card"
                    onClick={() => handleClick(item)}
                  >
                    <div className="trend-card__img">
                      <Image
                        src={item.image}
                        alt={item.alt || item.title}
                        fill
                        sizes="(max-width: 600px) 30vw, 180px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="trend-card__foot">
                      <span className="trend-card__name">{item.title}</span>
                      <span className="trend-card__go">
                        <GoArrowIcon />
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* scroll arrows: har row ki image ke beech mein */}
              {[1, 2].map((row) => (
                <span key={row}>
                  {canPrev && (
                    <button
                      type="button"
                      aria-label="Previous"
                      className={`trend-arrow trend-arrow--prev trend-arrow--row${row}`}
                      onClick={() => scrollByPage(-1)}
                    >
                      <ChevronIcon />
                    </button>
                  )}
                  {canNext && (
                    <button
                      type="button"
                      aria-label="Next"
                      className={`trend-arrow trend-arrow--next trend-arrow--row${row}`}
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
    </section>
  );
};

export default TrendingSlider;