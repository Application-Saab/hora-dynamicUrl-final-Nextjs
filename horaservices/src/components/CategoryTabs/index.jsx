
"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import "./CategoryTabs.css";

const CategoryTabs = ({
  data,
  city = "",
  locality = "",
  variant = "grid",
  catValue, // sub-category slug
  heading,
  hasBg = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef(null);
  // const autoScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Build path with city + locality
  const formatPath = (path) => {
    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;
    return `${base}${path}`;
  };

  const GridhandleClick = (cat) => {
    if (!cat || !catValue) return;

    const ROOT_CATEGORY = "balloon-decoration";

    // 🔹 GTM / dataLayer (same as before)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "theme_circle_clicked",
      themeName: cat.name,
      themeValue: cat.value,
      catValue,
      city: city || "default",
      locality: locality || "default",
    });

    // theme value ke aage "-decoration" add karo
    const themeSlug = `${cat.value}-theme-decoration`;

    const path = formatPath(`/${ROOT_CATEGORY}/${catValue}/${themeSlug}`);

    router.push(path);
  };

  const handleClick = (cat) => {
    if (!cat) return;

    // 🔹 GTM / dataLayer
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

    // 🔹 Navigate
    const baseRoute = getCategorySlugFromPath(pathname, city, locality);
    const path = formatPath(`/${baseRoute}/${cat.catValue || catValue}`);
    router.push(path);
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

  // const stopAutoScroll = () => {
  //   if (autoScrollRef.current) {
  //     clearInterval(autoScrollRef.current);
  //     autoScrollRef.current = null;
  //   }
  // };

  // const startAutoScroll = useCallback(() => {
  //   stopAutoScroll();
  //   const el = scrollRef.current;
  //   if (!el) return;

  //   autoScrollRef.current = setInterval(() => {
  //     const node = scrollRef.current;
  //     if (!node) return;

  //     const maxScrollLeft = node.scrollWidth - node.clientWidth;

  //     // Agar end tak pahunch gaye to wapas start par chale jao
  //     if (node.scrollLeft >= maxScrollLeft - 4) {
  //       node.scrollTo({ left: 0, behavior: "smooth" });
  //     } else {
  //       node.scrollBy({ left: 90, behavior: "smooth" }); // slow, small step
  //     }
  //   }, 2800); // speed kam — har ~2.8s me ek chhota step
  // }, []);

  useEffect(() => {
    if (variant !== "grid") return;
    const el = scrollRef.current;
    if (!el) return;

    updateArrowVisibility();
    // startAutoScroll();

    el.addEventListener("scroll", updateArrowVisibility, { passive: true });
    window.addEventListener("resize", updateArrowVisibility);

    return () => {
      // stopAutoScroll();
      el.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, [variant, data, updateArrowVisibility]);

  return variant === "grid" ? (
    <div className={`category-tabs-outer ${hasBg ? "has-bg" : ""}`}>
      {heading && <h3 className="category-tabs-heading">{heading}</h3>}

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

        <div
          className="category-tabs-grid"
          ref={scrollRef}
          // onMouseEnter={stopAutoScroll}
          // onMouseLeave={startAutoScroll}
          // onTouchStart={stopAutoScroll}
          // onTouchEnd={startAutoScroll}
        >
          {data
            .filter((cat) => cat.image)
            .map((cat) => (
              <button
                key={cat.id}
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
              </button>
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
        .slice(0, 13)
        .map((cat) => (
          <button
            key={cat.id}
            className="ctabs-btn"
            role="listitem"
            onClick={() => handleClick(cat)}
          >
            <div
              className="ctabs-circle"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <span className="ctabs-label">{cat.name}</span>
          </button>
        ))}
    </div>
  );
};

export default CategoryTabs;
