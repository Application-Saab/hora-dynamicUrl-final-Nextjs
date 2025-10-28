import Image from "next/image";
import { useRouter } from "next/router";
import "./photoGraphycard.css";

export default function PhotoGraphyCard({ 
  // src, title, subCategory 
  src,
  title,
  subCategory,
  city = "",
  locality = "",
  photoCat = [],
  hasCityPageParam = false,
}) {
  const router = useRouter();

  // ✅ Correctly pass the subCategory on click
const handleViewMore = () => {
  // find the clicked category from photoCat array
  const categoryItem = photoCat?.find(
    (cat) => cat.subCategory === subCategory || cat.name === subCategory
  );

  const finalSubCategory = categoryItem?.subCategory || subCategory;
  if (!finalSubCategory) return;


  let path = `/photography-page/${finalSubCategory}`;

  if (city && locality) {
    path = `/${city.toLowerCase()}/${locality.toLowerCase()}${path}`;
  } else if (city) {
    path = `/${city.toLowerCase()}${path}`;
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
    <div className="photo-card" onClick={handleViewMore} style={{ cursor: "pointer" }}>
      <div className="photo-imageWrapper">
        <Image src={src} alt={title} fill className="photo-image" priority />
        <div className="photo-imageOverlay"></div>
        <div className="photo-titleWrapper">
          <h3 className="photo-title">{title}</h3>
        </div>
      </div>
      <div className="photo-footer">
        <button className="photo-viewMore"    
         onClick={(e) => {
            e.stopPropagation(); 
            handleViewMore();
          }}>
          View more
        </button>
      </div>
    </div>
  );
}
