"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import "./CategoryTabs.css";

const CategoryTabs = ({
  data,
  city = "",
  locality = "",
  variant = "grid",
  catValue,
  heading,
  hasBg = false,
  icon,
  fireIcon,
}) => {
  const pathname = usePathname();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Build path with city + locality
  const formatPath = (path) => {
    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;
    return `${base}${path}`;
  };

  // ===== Grid variant click (for tracking only) =====
  const GridhandleClick = (cat) => {
    if (!cat || !catValue) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "theme_circle_clicked",
      themeName: cat.name,
      themeValue: cat.value,
      catValue,
      city: city || "default",
      locality: locality || "default",
    });
  };

  // ===== Circle tabs click (for tracking only) =====
  const handleClick = (cat) => {
    if (!cat) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "circle_tabs_clicked",
      categoryName: cat.name,
      subCategory: cat.subCategory || "",
      catValue: cat.catValue || "",
      imgAlt: cat.imgAlt || "",
      city: city || "default",
      locality: locality || "default",
    });
  };

  const getGridHref = (cat) => {
    if (!cat || !catValue) return "#";
    const baseRoute = getCategorySlugFromPath(pathname, city, locality);
    return formatPath(`/${baseRoute}/${catValue}/${cat.value}`);
  };

  // Helper to get href for Circle tabs variant
  const getCircleHref = (cat) => {
    if (!cat) return "#";
    const baseRoute = getCategorySlugFromPath(pathname, city, locality);
    return formatPath(`/${baseRoute}/${cat.catValue || catValue}`);
  };

  // ---- Scroll helpers (grid variant only) ----
  const updateArrowVisibility = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 4);
  }, []);

  const scrollByAmount = (amount) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (variant !== "grid") return;
    const el = scrollRef.current;
    if (!el) return;

    updateArrowVisibility();

    el.addEventListener("scroll", updateArrowVisibility, { passive: true });
    window.addEventListener("resize", updateArrowVisibility);

    return () => {
      el.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, [variant, data, updateArrowVisibility]);

  return variant === "grid" ? (
    <div className={`category-tabs-outer ${hasBg ? "has-bg" : ""}`}>
      {heading && (
        <div className="category-slide-header">
          {fireIcon && (
            <Image
              src={fireIcon}
              alt=""
              className="category-slide-decor-icon"
              width={40}
              height={40}
            />
          )}

          <h3 className="category-tabs-heading">{heading}</h3>

          {icon && (
            <Image
              src={icon}
              alt=""
              className="category-slide-decor-sparkle"
              width={26}
              height={26}
            />
          )}
        </div>
      )}

      <div className="category-tabs-slider-wrap">
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            className="category-tabs-arrow category-tabs-arrow-left"
            onClick={() => scrollByAmount(-160)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className="category-tabs-grid" ref={scrollRef}>
          {data
            .filter((cat) => cat.image)
            .map((cat) => (
              <a
                key={cat.id}
                type="button"
                href={getGridHref(cat)}
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
              </a>
            ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll right"
            className="category-tabs-arrow category-tabs-arrow-right"
            onClick={() => scrollByAmount(160)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="ctabs-wrap" role="list">
      {data
        .filter((cat) => cat.image)
        .slice(0, 14)
        .map((cat) => (
          <a
            key={cat.id}
            type="button"
            href={getCircleHref(cat)}
            className="ctabs-btn"
            role="listitem"
            onClick={() => handleClick(cat)}
          >
            <div
              className="ctabs-circle"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <span className="ctabs-label">{cat.name}</span>
          </a>
        ))}
    </div>
  );
};

export default CategoryTabs;
