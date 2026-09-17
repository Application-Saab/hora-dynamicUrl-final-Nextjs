"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../assets/new_logo_light.png";
import "./ProductSliderSection.css";
import { decCat } from "@/utils/decorationCategories";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";

const getDiscountedPrice = (price) => {
  const p = parseFloat(price.replace(/[^0-9.-]+/g, "")) || 0;
  const discount = p < 3000 ? 20 : p <= 5000 ? 27 : 35;
  return Math.floor(p * (1 + discount / 100));
};

const getDiscountedDifference = (price) => {
  const p = parseFloat(price.replace(/[^0-9.-]+/g, "")) || 0;
  const discount = p < 3000 ? 20 : p <= 5000 ? 27 : 35;
  const discountedPrice = p * (1 - discount / 100);
  return Math.floor(p - discountedPrice);
};

const ProductSliderSection = ({
  title,
  data = [],
  viewLink = "",
  catValue,
  city = "",
  locality = "",
}) => {
  const pathname = usePathname();

  const categorySlug = getCategorySlugFromPath(pathname, city, locality);

  const formatPath = (path) => {
    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;
    return `${base}${path}`;
  };

  const buildViewAllLink = () => {
    if (viewLink) return viewLink;
    return formatPath(`/${categorySlug}`);
  };

  const getProductHref = (item) => {
    if (!item?.slug || !catValue) return "#";
    return formatPath(`/${categorySlug}/${catValue}/product/${item.slug}`);
  };

  // Only tracking (navigation ab <a href> se hogi)
  const handleClick = (item) => {
    if (!item?.slug || !catValue) {
      console.warn("Missing slug or catValue", { item, catValue });
      return;
    }

    const matchedCat = decCat.find(
      (cat) =>
        cat.catValue?.toLowerCase() === categorySlug.toLowerCase() ||
        cat.name.toLowerCase() === item.title.toLowerCase()
    );

    const eventData = {
      title: item.title,
      categoryName: matchedCat?.name || item.title,
      subCategory: matchedCat?.subCategory || "unknown",
      catValue: matchedCat?.catValue || categorySlug || "unknown",
      imgAlt: matchedCat?.imgAlt || "",
      price: item.price,
      city: city || "default",
      locality: locality || "",
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_item_clicked",
      event_category: "SliderSection",
      ...eventData,
    });
  };

  return (
    <div className="product-section-container">
      <div className="product-section-header">
        <Link href={buildViewAllLink()}>
          <h2>{title}</h2>
        </Link>
        <Link href={buildViewAllLink()}>View All</Link>
      </div>

      <div className="product-section-grid">
        {data.map((item, index) =>
          item.isViewMore ? (
            <div key={index} className="product-section-view-more-card" />
          ) : (
            <a
              key={index}
              type="button"
              href={getProductHref(item)}
              className="product-section-card"
              onClick={() => handleClick(item)}
            >
              <div className="product-section-image-wrapper">
                <Image
                  src={item.Image || "/placeholder.png"}
                  alt={item.title}
                  width={700}
                  height={200}
                  className="product-section-image"
                />
                <div className="product-section-watermark">
                  <Image src={logo} alt="hora watermark" width={70} height={80} />
                </div>
              </div>

              <div className="product-section-discount-badge">
                ₹{getDiscountedDifference(item.price)} off
              </div>

              <div className="product-section-details">
                <h3>{item.title}</h3>
                <div className="product-section-price">
                  <p className="product-section-price-current">{item.price}</p>
                  <p className="product-section-price-original">
                    ₹{getDiscountedPrice(item.price)}
                  </p>
                </div>
              </div>
            </a>
          )
        )}
      </div>
    </div>
  );
};

export default ProductSliderSection;