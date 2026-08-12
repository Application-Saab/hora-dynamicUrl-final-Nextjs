"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import smallcardBackground from "@/assets/small-cardBackground.png";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import "./SmallCardGrid.css";

const SmallCardGrid = ({ city = "", locality = "", decCat = [], categories = [] }) => {
  const router = useRouter();
  const pathname = usePathname();

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

  const handleClick = (item) => {
const matchedCat = decCat.find(
  (cat) => normalize(cat.catValue) === normalize(item.catValue)
);


  if (!matchedCat) {
  console.warn("No matching category in decCat for:", item.catValue);
  return;
}


    // 🔹 GTM / dataLayer event
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

    // ✅ Navigate
    router.push(buildCardPath(item));
  };

  return (
    <div className="small-card-grid-outer">
      <div className="page-width">
        <div className="small-card-grid">
          {categories.map((item, index) => (
            <div
              key={index}
              className="small-card-wrapper"
              onClick={() => handleClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="small-card"
                style={{
                  backgroundImage: `url(${smallcardBackground.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                />
              </div>
              <p className="small-card-name">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmallCardGrid;
