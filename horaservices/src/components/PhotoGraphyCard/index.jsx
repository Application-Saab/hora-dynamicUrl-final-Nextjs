import Image from "next/image";
import "./photoGraphycard.css";
import React from "react";
import arrowImg from "@/assets/arrowicon.svg";
const PhotoGraphyCard = ({
  src,
  title,
  subCategory,
  city,
  locality = "",
  photoCat = [],
  hasCityPageParam = false,
}) => {
  const categoryItem = photoCat?.find(
    (cat) => cat.subCategory === subCategory || cat.name === subCategory
  );

  const finalSubCategory = categoryItem?.subCategory || subCategory;
  const slug = categoryItem?.slug;

  const getHref = () => {
    if (!slug) return "#";

    const citySlug = city?.toLowerCase()?.replace(/\s+/g, "-");
    const localitySlug = locality?.toLowerCase()?.replace(/\s+/g, "-");

    let path = `/photography/${slug}`;

    if (citySlug && localitySlug) {
      path = `/${citySlug}/${localitySlug}${path}`;
    } else if (citySlug) {
      path = `/${citySlug}${path}`;
    }

    return path;
  };

  const handleClick = () => {
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
  };

  return (
    <a href={getHref()} className="photo-card" onClick={handleClick}>
      <div className="photo-imageWrapper">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 33vw, 200px"
          className="photo-image"
          priority
        />
      </div>

      <div className="photo-body">
        <h2 className="photo-title">{title}</h2>

        <span className="photo-viewMore">
          View more
          <Image
            src={arrowImg}
            alt=""
            width={14}
            height={14}
            className="photo-arrowImg"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
};

export default React.memo(PhotoGraphyCard);