import Image from "next/image";
import { useRouter } from "next/navigation";
import "./photoGraphyCardgrid.css";
import React from "react";
import arrowImg from "@/assets/arrowicon.svg"
const PhotoGraphyCard = ({
  src,
  title,
  subCategory,
  city = "",
  locality = "",
  photoCat = [],
}) => {
  const router = useRouter();

  const handleViewMore = () => {
    const categoryItem = photoCat?.find(
      (cat) => cat.subCategory === subCategory || cat.name === subCategory
    );

    const finalSubCategory = categoryItem?.subCategory || subCategory;
    const slug = categoryItem?.slug;

    if (!finalSubCategory || !slug) return;

    const citySlug = city?.toLowerCase();
    const localitySlug = locality?.toLowerCase();

    let path = `/photography/${slug}`;

    if (citySlug && localitySlug) {
      path = `/${citySlug}/${localitySlug}${path}`;
    } else if (citySlug) {
      path = `/${citySlug}${path}`;
    }

    const isCityPage = Boolean(citySlug);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: isCityPage
        ? "title_and_viewmore_photography_citypage_clicked"
        : "title_and_viewmore_photography_page_clicked",
      categoryName: categoryItem?.name || subCategory,
      subCategory: finalSubCategory,
      catValue: categoryItem?.catValue ?? "",
      imgAlt: categoryItem?.imgAlt ?? "",
      city: citySlug || "default",
      locality: localitySlug || "default",
    });

    router.push(path);
  };

  return (
    <div className="cardgrid" onClick={handleViewMore}>
      <div className="imageWrappergrid">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 45vw, 220px"
          className="photograpghy-image"
          priority
        />
      </div>

      <div className="bodygrid">
        <h2 className="titlegrid">{title}</h2>

        <button className="viewMoregrid" type="button">
          View more
          <Image
            src={arrowImg}
            alt=""
            width={14}
            height={14}
            className="arrowImggrid"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PhotoGraphyCard);