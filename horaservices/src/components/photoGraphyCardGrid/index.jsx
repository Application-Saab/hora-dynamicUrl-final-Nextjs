import Image from "next/image";
import { useRouter } from "next/navigation";
import "./photoGraphyCardgrid.css";

export default function PhotoGraphyCard({
  src,
  title,
  subCategory,
  city = "",
  locality = "",
  photoCat = [],
}) {
  const router = useRouter();

  const handleViewMore = () => {
    const categoryItem = photoCat?.find(
      (cat) => cat.subCategory === subCategory || cat.name === subCategory
    );

    const finalSubCategory = categoryItem?.subCategory || subCategory;
    if (!finalSubCategory) return;

    const citySlug = city?.toLowerCase();
    const localitySlug = locality?.toLowerCase();

    let path = `/photography-page/${finalSubCategory}`;

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
          className="photograpghy-image"
          priority
        />
        <div className="imageOverlaygrid" />
        <div className="titleWrappergrid">
          <h3 className="titlegrid">{title}</h3>
        </div>
      </div>

      <div className="footergrid">
        <button className="viewMoregrid" type="button">
          View more
        </button>
      </div>
    </div>
  );
}
