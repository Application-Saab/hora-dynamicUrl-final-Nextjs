
"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
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

  // 🔹 FIXED NAVIGATION
  const path = formatPath(
    `/${ROOT_CATEGORY}/${catValue}?theme=${encodeURIComponent(cat.value)}`
  );

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
    const path = formatPath(
      `/${baseRoute}/${cat.catValue || catValue}`
    );
    router.push(path);
  };

  return variant === "grid" ? (
    <div className={`category-tabs-outer ${hasBg ? "has-bg" : ""}`}>
      {heading && <h3 className="category-tabs-heading">{heading}</h3>}

      <div className="category-tabs-grid">
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
