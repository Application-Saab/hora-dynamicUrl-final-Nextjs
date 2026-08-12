import Image from "next/image";
import { useRouter } from "next/router";
import "./photoGraphycard.css";
import React from "react";

const PhotoGraphyCard = ({
  src,
  title,
  subCategory,
  city ,
  locality = "",
  photoCat = [],
  hasCityPageParam = false,
}) => {
  const router = useRouter();

const handleViewMore = () => {
  const categoryItem = photoCat?.find(
    (cat) => cat.subCategory === subCategory || cat.name === subCategory
  );

  const finalSubCategory = categoryItem?.subCategory || subCategory;
  if (!finalSubCategory) return;
const citySlug = city
  ?.toLowerCase()
  ?.replace(/\s+/g, "-");
  
const localitySlug = locality
  ?.toLowerCase()
  ?.replace(/\s+/g, "-");
  let path = `/photography-page/${finalSubCategory}`;


  if (citySlug && localitySlug) {
    path = `/${citySlug}/${localitySlug}${path}`;
  } else if (citySlug) {
    path = `/${citySlug}${path}`;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: hasCityPageParam
      ? "title_and_viewmore_photography_citypage_clicked"
      : "title_and_viewmore_photography_page_clicked",
    categoryName: categoryItem?.name || subCategory,
    subCategory: finalSubCategory,
    catValue: categoryItem?.catValue || "",
    imgAlt: categoryItem?.imgAlt || "",
    city: city || "default",
    locality: locality || "default",
  });
  router.push(path);
};
  return (
  <div className="photo-card"onClick={handleViewMore} style={{ cursor: "pointer" }}>
      <div className="photo-imageWrapper">
        <Image src={src} alt={title} fill className="photo-image" priority />
        <div className="photo-imageOverlay"></div>
        <div className="photo-titleWrapper">
          <h2 className="photo-title">{title}</h2>
        </div>
      </div>
      <div className="photo-footer">
        <button className="photo-viewMore" type="button">
          View more
        </button>
      </div>
    </div>
  );
}

export default React.memo(PhotoGraphyCard);
