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
  isDirectProductPage = false,
  activeValue,
  rows = 1, // 1 = single row (default) | 2 = two-row circle grid
}) => {
  const pathname = usePathname();
  const scrollRef = useRef(null);
  const itemRefs = useRef({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isMultiRow = variant === "grid" && rows > 1;

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
    let path;

    if (isDirectProductPage) {
      if (city) {
        path = `/${city}/balloon-decoration/${cat.catValue}/${cat.value}`;
      } else {
        path = `/balloon-decoration/${cat.catValue}/${cat.value}`;
      }
    } else {
      const baseRoute = getCategorySlugFromPath(pathname, city, locality);
      path = formatPath(`/${baseRoute}/${catValue}/${cat.value}`);
    }
    return path;
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
    const delta = isMultiRow ? Math.sign(amount) * el.clientWidth * 0.8 : amount;
    el.scrollBy({ left: delta, behavior: "smooth" });
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
  }, [variant, data, rows, updateArrowVisibility]);

  useEffect(() => {
    if (variant !== "grid" || !activeValue) return;
    const el = itemRefs.current[activeValue];
    if (el && isMultiRow) {
      // page ko vertical scroll kiye bina active circle ko beech mein laao
      const sc = scrollRef.current;
      if (sc) {
        sc.scrollLeft = el.offsetLeft - (sc.clientWidth - el.offsetWidth) / 2;
        updateArrowVisibility();
      }
    } else if (el) {
      el.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeValue, variant, data]);

  // ================= 2-ROW CIRCLE GRID (rows={2}) =================
  if (isMultiRow) {
    const items = data.filter((cat) => cat.image);

    return (
      <div className="ctm-slider">
        <div className="ctm-viewport">
          <div className="ctm-grid" ref={scrollRef}>
            {items.map((cat) => {
              const isActive = !!activeValue && cat.value === activeValue;
              return (
                <a
                  key={cat.id}
                  ref={(el) => {
                    itemRefs.current[cat.value] = el;
                  }}
                  href={getGridHref(cat)}
                  className={`ctm-item${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => GridhandleClick(cat)}
                >
                  <div className="ctm-circle">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 600px) 24vw, 150px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <p className="ctm-name">{cat.name}</p>
                </a>
              );
            })}
          </div>

          {/* arrows: har row ke circle ke beech mein */}
          {[1, 2].map((row) => (
            <span key={row}>
              {canScrollLeft && (
                <button
                  type="button"
                  aria-label="Previous"
                  className={`ctm-arrow ctm-arrow--prev ctm-arrow--row${row}`}
                  onClick={() => scrollByAmount(-1)}
                >
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
                </button>
              )}
              {canScrollRight && (
                <button
                  type="button"
                  aria-label="Next"
                  className={`ctm-arrow ctm-arrow--next ctm-arrow--row${row}`}
                  onClick={() => scrollByAmount(1)}
                >
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
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

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
            .map((cat) => {
              const isActive = !!activeValue && cat.value === activeValue;
              return (
                <a
                  key={cat.id}
                  ref={(el) => {
                    itemRefs.current[cat.value] = el;
                  }}
                  type="button"
                  href={getGridHref(cat)}
                  className={`category-tabs-card${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
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
              );
            })}
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
        .map((cat) => {
          const isActive = !!activeValue && cat.value === activeValue;
          return (
            <a
              key={cat.id}
              ref={(el) => {
                itemRefs.current[cat.value] = el;
              }}
              type="button"
              href={getCircleHref(cat)}
              className={`ctabs-btn${isActive ? " is-active" : ""}`}
              role="listitem"
              aria-current={isActive ? "true" : undefined}
              onClick={() => handleClick(cat)}
            >
              <div
                className="ctabs-circle"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <span className="ctabs-label">{cat.name}</span>
            </a>
          );
        })}
    </div>
  );
};

export default CategoryTabs;