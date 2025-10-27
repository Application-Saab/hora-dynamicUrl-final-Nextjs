import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setState } from "@/actions/action";
import "./photoGraphyCardgrid.css";

export default function PhotoGraphyCard({
  src,
  title,
  subCategory,
  city = "",
  locality = "",
  photoCat = [],
  hasCityPageParam = false,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ Format path (adds city & locality if available)
  const formatPath = (path) => {
    let basePath = "";
    if (city) basePath += `/${city.toLowerCase()}`;
    if (locality) basePath += `/${locality.toLowerCase()}`;
    return `${basePath}${path}`;
  };

  // ✅ View more handler
 
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
    <div className="cardgrid">
      <div className="imageWrappergrid ">
        <Image src={src} alt={title} fill className="photograpghy-image" priority />
        <div className="imageOverlaygrid"></div>
        <div className="titleWrappergrid ">
          <h3 className="titlegrid ">{title}</h3>
        </div>
      </div>
      <div className="footergrid">
        <button className="viewMoregrid " onClick={handleViewMore}>
          View more
        </button>
      </div>
    </div>
  );
}
