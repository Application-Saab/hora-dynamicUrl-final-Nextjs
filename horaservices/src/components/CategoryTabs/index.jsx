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
  catValue,
  heading,
  hasBg = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const formatPath = (path) => {
    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;
    return `${base}${path}`;
  };

  // GRID CLICK
  const GridhandleClick = (cat) => {
    if (!cat || !catValue) return;

    const ROOT_CATEGORY = "balloon-decoration";

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "theme_circle_clicked",
      themeName: cat.name,
      themeValue: cat.value,
      catValue,
      city: city || "default",
      locality: locality || "default",
    });

    const path = formatPath(
      `/${ROOT_CATEGORY}/${catValue}?theme=${encodeURIComponent(cat.value)}`
    );

    router.push(path);
  };

  // NORMAL CLICK
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

    const baseRoute = getCategorySlugFromPath(pathname, city, locality);
    const path = formatPath(`/${baseRoute}/${cat.catValue || catValue}`);

    router.push(path);
  };

  return (
    <div className={`category-tabs-outer ${hasBg ? "has-bg" : ""}`}>
      {heading && <h3 className="category-tabs-heading">{heading}</h3>}

      <div className="category-tabs-grid">
        {data
          .filter((cat) => cat.image)
          .map((cat) => (
            <button
              key={cat.id}
              className="category-tabs-card"
              onClick={() =>
                variant === "grid"
                  ? GridhandleClick(cat)
                  : handleClick(cat)
              }
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
  );
};

export default CategoryTabs;