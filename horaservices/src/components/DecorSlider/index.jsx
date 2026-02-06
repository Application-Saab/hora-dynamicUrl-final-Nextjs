

"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import "./DecorSlider.css";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";

const getDiscountedDifference = (price) => {
  const numeric = parseFloat(price?.replace(/[^0-9.-]+/g, ""));
  if (isNaN(numeric) || numeric < 0) return 0;

  const discount = numeric < 3000 ? 20 : numeric <= 5000 ? 27 : 35;
  const discounted = Math.floor(numeric * (1 - discount / 100));
  return Math.floor(numeric - discounted);
};

const DecorSlider = ({
  title,
  data = [],
  catValue, // ✅ MAIN HERO
  showDiscount = false,
  imageSize = { width: 120, height: 120 },
  city = "",
  locality = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const categorySlug = getCategorySlugFromPath(
    pathname,
    city,
    locality
  );

  const formatPath = (path) => {
    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;
    return `${base}${path}`;
  };

  const handleItemClick = (item) => {
    if (!item?.slug || !catValue) {
      console.warn("Missing slug or catValue", { item, catValue });
      return;
    }

    const path = formatPath(
      `/${categorySlug}/${catValue}/product/${item.slug}`
    );

    router.push(path);
  };

  return (
    <section className="premium-slide-decor">
      <div className="premium-slide-decor-header">
        <h2>{title}</h2>
      </div>

      <div className="premium-scroll-wrapper">
        {data.map((item, index) => {
          const discountDiff = getDiscountedDifference(item.price);
          const price =
            parseInt(item.price?.replace(/[^\d]/g, "")) || 0;

          return (
            <div
              key={index}
              className="premium-card"
              onClick={() => handleItemClick(item)}
            >
              <div className="premium-img-wrapper">
                <Image
                  src={item.Image}
                  alt={item.title}
                  width={imageSize.width}
                  height={imageSize.height}
                  className="premium-img"
                />

                {showDiscount && (
                  <div className="premium-discount">
                    ₹{discountDiff} off
                  </div>
                )}
              </div>

              <div className="premium-content">
                <p className="premium-title">
                  {item.title.length > 20
                    ? item.title.slice(0, 20) + "..."
                    : item.title}
                </p>
              </div>

              <div className="premium-price-wrapper">
                <span className="premium-price">{item.price}</span>
                {showDiscount && (
                  <span className="premium-original">
                    ₹{price + discountDiff}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DecorSlider;
