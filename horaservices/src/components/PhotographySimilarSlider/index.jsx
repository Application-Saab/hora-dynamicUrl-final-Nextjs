"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import "./PhotographySimilarSlider.css";
import fallbackImg from "@/assets/fallback-image.png";
const getDiscountedDifference = (price) => {
  const numericPrice = parseFloat(price?.toString().replace(/[^0-9.-]+/g, "")) || 0;
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
  decCat = [],
  locality = "",
  catValue = "",
}) => {
  const router = useRouter();


 const slugify = (text) =>
  text.replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleViewMore = (work) => {
    const slug = slugify(work.name);
    const categorySlug = slugify(catValue || "photography");

    // Base path without city
    let path = `/photography-page/${categorySlug}/product/${slug}`;

    // Prepend city if this is a city-scoped page (matches your live URL structure)
    if (hasCityPageParam && city) {
      path = `/${slugify(city)}${path}`;
    }

    router.push({
      pathname: path,
      query: { id: work._id },
    });
  };

  return (
    <section  style={{
    padding: "10px",
     background: "#fbe6d3",
  }}>
      <div className="premium-slide-decor-header">
      {title && <h2>{title}</h2>}
        {viewAllLink && (
          <span onClick={() => handleViewMore(viewAllLink, title)}>
            <span style={{ cursor: "pointer", color: "#0070f3" }}>View All</span>
          </span>
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

            const titleText = item.title || item.name || "Decoration";

            return (
              <div
                key={index}
                className="photo-premium-card"
               onClick={() => handleViewMore(item)}

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
                    <div className="photo-premium-discount">₹{discountDifference} off</div>
                  )}
                </div>

                <div className="photo-premium-content">
                  <p className="photo-premium-title">{titleText}</p>
                </div>

                <div className="photo-premium-price-wrapper">
                  <span className="photo-premium-price">₹{price}</span>
                  {showDiscount && (
                    <span className="photo-premium-original">₹{originalPrice}</span>
                  )}
                </div>
              </div>
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