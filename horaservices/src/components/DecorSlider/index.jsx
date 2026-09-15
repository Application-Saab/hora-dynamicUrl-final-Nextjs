"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
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
  catValue,
  showDiscount = false,
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

  const getItemHref = (item) => {
    if (!item?.slug || !catValue) return "#";
    return formatPath(`/${categorySlug}/${catValue}/product/${item.slug}`);
  };

  return (
    <section className="premium-slide-decor">
      <div className="premium-slide-decor-header">
        <h2>{title}</h2>
      </div>

      <div className="premium-scroll-wrapper">
        {data.map((item, index) => {
          const discountDiff = getDiscountedDifference(item.price);
          const price = parseInt(item.price?.replace(/[^\d]/g, "")) || 0;

          return (
            <a
              key={index}
              type="button"
              href={getItemHref(item)}
              className="premium-card"
            >
              <div className="premium-img-wrapper">
                <Image
                  src={item.Image}
                  alt={item.title}
                  className="premium-img"
                  fill
                  sizes="(max-width:480px) 100vw"
                />

                {showDiscount && (
                  <div className="premium-discount">₹{discountDiff} off</div>
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
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default DecorSlider;