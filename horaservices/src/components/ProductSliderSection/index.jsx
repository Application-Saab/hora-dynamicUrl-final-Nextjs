"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import logo from "../../assets/new_logo_light.png";
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
  catValue,       // ✅ Pass sub-category slug like DecorSlider
  city = "",
  locality = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Extract main category slug from URL
  const categorySlug = getCategorySlugFromPath(pathname, city, locality);

  // Prepend city/locality to any path
  const formatPath = (path) => {
    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;
    return `${base}${path}`;
  };

  // Build 'View All' link
  const buildViewAllLink = () => {
    if (viewLink) return viewLink;
    return formatPath(`/${categorySlug}`);
  };

  // Handle product click
  const handleClick = (item) => {
    if (!item?.slug || !catValue) {
      console.warn("Missing slug or catValue", { item, catValue });
      return;
    }

    // Build product path like DecorSlider
    const path = formatPath(`/${categorySlug}/${catValue}/product/${item.slug}`);

    // Push GTM event
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

    router.push(path);
  };

  return (
    <div className="product-section-container">
      <div className="product-section-header">
        <h2 onClick={() => router.push(buildViewAllLink())}>{title}</h2>
        <Link href={buildViewAllLink()}>View All</Link>
      </div>

      <div className="product-section-grid">
        {data.map((item, index) =>
          item.isViewMore ? (
            <div key={index} className="product-section-view-more-card" />
          ) : (
            <div
              key={index}
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
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductSliderSection;
