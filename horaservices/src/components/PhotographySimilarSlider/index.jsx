"use client";

import Image from "next/image";
import "./PhotographySimilarSlider.css";
import fallbackImg from "@/assets/fallback-image.png";

const getDiscountedDifference = (price) => {
  const numericPrice =
    parseFloat(price?.toString().replace(/[^0-9.-]+/g, "")) || 0;
  if (numericPrice <= 0) return 0;
  const discount = numericPrice < 3000 ? 20 : numericPrice <= 5000 ? 27 : 35;
  const discountedPrice = Math.floor(numericPrice * (1 - discount / 100));
  return Math.floor(numericPrice - discountedPrice);
};

const PhotographySimilarSlider = ({
  title = "",
  viewAllLink = "",
  data = [],
  showDiscount = false,
  imageSize = { width: 120, height: 120 },
  city = "",
  hasCityPageParam = false,
  locality = "",
  catValue = "",
}) => {
  const slugify = (text) =>
    String(text || "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const getCardHref = (work) => {
    if (!work?.name) return "#";

    const slug = slugify(work.name);
    const categorySlug = slugify(catValue || "photography");

    let path = `/photography-page/${categorySlug}/product/${slug}`;

    if (hasCityPageParam && city) {
      const citySlug = slugify(city);
      if (locality) {
        path = `/${citySlug}/${slugify(locality)}${path}`;
      } else {
        path = `/${citySlug}${path}`;
      }
    }

    if (work._id) return `${path}?id=${work._id}`;
    return path;
  };

  return (
    <section
      style={{
        padding: "10px",
        background: "#fbe6d3",
      }}
    >
      <div className="premium-slide-decor-header">
        {title && <h2>{title}</h2>}
        {viewAllLink && (
          <a
            type="button"
            href={viewAllLink}
            style={{ cursor: "pointer", color: "#0070f3" }}
          >
            View All
          </a>
        )}
      </div>

      <div className="premium-scroll-wrapper">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item, index) => {
            const price =
              typeof item.price === "string"
                ? parseInt(item.price.replace(/[^\d]/g, "")) || 0
                : item.price || 0;

            const discountDifference = getDiscountedDifference(item.price);
            const originalPrice = price + discountDifference;

            const imageUrl =
              item.Image ||
              (item.featured_image
                ? `https://horaservices.com/api/uploads/compressed_webp/${
                    item.featured_image.split(".")[0]
                  }.webp`
                : fallbackImg);

            const titleText = item.title || item.name || "Photography";

            return (
              <a
                key={item._id || index}
                type="button"
                href={getCardHref(item)}
                className="photo-premium-card"
                style={{ cursor: "pointer" }}
              >
                <div className="photo-premium-img-wrapper">
                  <Image
                    src={imageUrl}
                    alt={titleText}
                    width={imageSize.width}
                    height={imageSize.height}
                    className="photo-premium-img"
                  />
                  {showDiscount && discountDifference > 0 && (
                    <div className="photo-premium-discount">
                      ₹{discountDifference} off
                    </div>
                  )}
                </div>

                <div className="photo-premium-content">
                  <p className="photo-premium-title">{titleText}</p>
                </div>

                <div className="photo-premium-price-wrapper">
                  <span className="photo-premium-price">₹{price}</span>
                  {showDiscount && (
                    <span className="photo-premium-original">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
              </a>
            );
          })
        ) : (
          <p style={{ padding: "10px", color: "#888" }}>No items found</p>
        )}
      </div>
    </section>
  );
};

export default PhotographySimilarSlider;