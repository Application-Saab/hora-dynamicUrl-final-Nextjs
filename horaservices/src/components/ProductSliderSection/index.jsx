"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import logo from "../../assets/new_logo_light.png";
import "./ProductSliderSection.css";
import { decCat } from "@/utils/decorationCategories";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";

/* ---------------- Price Utility ---------------- */
const getPriceDetails = (price) => {
  const p = parseFloat(price?.toString().replace(/[^0-9.-]+/g, "")) || 0;

  let discount;

  if (p < 3000) discount = 20;
  else if (p <= 5000) discount = 27;
  else discount = 35;

  const originalPrice = Math.floor(p * (1 + discount / 100));
  const discountDifference = originalPrice - p;

  return {
    discount,
    originalPrice,
    discountDifference,
  };
};

const ProductSliderSection = ({
  title,
  data = [],
  viewLink = "",
  catValue,
  city = "",
  locality = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const categorySlug = getCategorySlugFromPath(pathname, city, locality);

  /* -------- Format URL -------- */
  const formatPath = (path) => {
    let base = "";

    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;

    return `${base}${path}`;
  };

  /* -------- View All Link -------- */
  const buildViewAllLink = () => {
    if (viewLink) return viewLink;
    return formatPath(`/${categorySlug}`);
  };

  /* -------- Product Click -------- */
  const handleClick = (item) => {
    if (!item?.slug || !catValue) return;

    const path = formatPath(
      `/${categorySlug}/${catValue}/product/${item.slug}`
    );

    const matchedCat = decCat.find(
      (cat) =>
        cat.catValue?.toLowerCase() === categorySlug?.toLowerCase() ||
        cat.name?.toLowerCase() === item.title?.toLowerCase()
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

    router.push(path);
  };

  return (
    <div className="product-section-container">
      
      {/* Header */}
      <div className="product-section-header">
        <h2 onClick={() => router.push(buildViewAllLink())}>{title}</h2>
        <Link href={buildViewAllLink()}>View All</Link>
      </div>

      {/* Product Grid */}
      <div className="product-section-grid">
        {data.map((item, index) => {
          const priceInfo = getPriceDetails(item.price);

          if (item.isViewMore) {
            return (
              <div key={index} className="product-section-view-more-card" />
            );
          }

          return (
            <div
              key={index}
              className="product-section-card"
              onClick={() => handleClick(item)}
            >
              
              {/* Image */}
              <div className="product-section-image-wrapper">
                <Image
                  src={item.Image || "/placeholder.png"}
                  alt={item.title}
                  width={700}
                  height={200}
                  className="product-section-image"
                />

                <div className="product-section-watermark">
                  <Image
                    src={logo}
                    alt="hora watermark"
                    width={70}
                    height={80}
                  />
                </div>
              </div>

              {/* Discount Badge */}
              <div className="product-section-discount-badge">
                ₹{priceInfo.discountDifference} off
              </div>

              {/* Details */}
              <div className="product-section-details">
                <h3>{item.title}</h3>

                <div className="product-section-price">
                  
                  {/* Current Price */}
                  <p className="product-section-price-current">
                    {item.price}
                  </p>

                  {/* Original Price */}
                  <p className="product-section-price-original">
                    ₹{priceInfo.originalPrice}
                  </p>

                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSliderSection;