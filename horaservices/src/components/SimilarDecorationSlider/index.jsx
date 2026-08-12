"use client";

import Image from "next/image";
import { useRouter,usePathname } from "next/navigation";
const getDiscountedDifference = (price) => {
  const numericPrice =
    parseFloat(price?.toString().replace(/[^0-9.-]+/g, "")) || 0;

  if (numericPrice <= 0) return 0;

  const discount = numericPrice < 3000 ? 20 : numericPrice <= 5000 ? 27 : 35;
  const discountedPrice = Math.floor(numericPrice * (1 - discount / 100));
  return Math.floor(numericPrice - discountedPrice);
};

const SimilarDecorationSlider = ({
  title = "",
  viewAllLink = "",
  data = [],
  showDiscount = false,
  city = "",
  locality = "",
  catValue = "", // ✅ MUST be slug like "baby-shower-decoration"
  icon,           // 🔑 naya prop
  sparkleIcon, 

}) => {
  const router = useRouter();
const pathname = usePathname();

const handleCardClick = (item) => {
  if (!item || !catValue) return;

  const rawSlug = item.slug || item.product_slug || item.name || item.title;
  if (!rawSlug) return;

  const productSlug = rawSlug
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);

  // Dynamic balloon segment
  const balloonSegment = parts.find((seg) =>
    seg.toLowerCase().startsWith("balloon-decoration")
  ) || "balloon-decoration";

  const balloonIndex = parts.indexOf(balloonSegment);

  const city = balloonIndex > 0 ? parts[0] : "";
  const locality = balloonIndex > 1 ? parts[1] : "";

  const finalPath = city && locality
    ? `/${city}/${locality}/${balloonSegment}/${catValue}/product/${productSlug}`
    : city
    ? `/${city}/${balloonSegment}/${catValue}/product/${productSlug}`
    : `/${balloonSegment}/${catValue}/product/${productSlug}`;

  router.push(finalPath);
};



  return (
     <section style={{ padding: "10px 0px 10px 10px"}}>
    {title && (
      <div className="similar-slide-decor-header">
        <Image
          src={sparkleIcon}
          alt=""
          className="similar-slide-decor-icon"
        />

        <h2>{title}</h2>

        <Image
          src={icon}
          alt=""
          className="similar-slide-decor-sparkle"
        />
      </div>
    )}

    {viewAllLink && (
      <span
        onClick={() => router.push(viewAllLink)}
        style={{ cursor: "pointer", color: "#0070f3" }}
      >
        View All
      </span>
    )}
      

      <div className="similar-scroll-wrapper">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item, index) => {
            const price =
              typeof item.price === "string"
                ? parseInt(item.price.replace(/[^\d]/g, "")) || 0
                : item.price || 0;

            const discountDiff = getDiscountedDifference(item.price);
            const originalPrice = price + discountDiff;

            const imageUrl =
  item.Image ||
  (item.featured_images?.[0]?.fileName
    ? `https://horaservices.com/api/uploads/compressed_webp/${
        item.featured_images[0].fileName.split(".")[0]
      }.webp`
    : "/default.png");

            const titleText = item.title || item.name || "Decoration";

            return (
              <div
                key={index}
                className="similar-card"
                onClick={() => handleCardClick(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="similar-img-wrapper">
  <Image
    src={imageUrl}
    alt={titleText}
    className="similar-img"
    fill
    sizes="(max-width:480px) 100vw"
  />


                  {showDiscount && discountDiff > 0 && (
                    <div className="similar-discount">
                      ₹{discountDiff} off
                    </div>
                  )}
                </div>

                <div className="similar-content">
                  <p className="similar-title">
                    {titleText.length > 20
                      ? `${titleText.slice(0, 20)}...`
                      : titleText}
                  </p>
                </div>

                <div className="similar-price-wrapper">
                  <span className="similar-price">₹{price}</span>
                  {showDiscount && (
                    <span className="similar-original">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ padding: "10px", color: "#888" }}>
            No items found
          </p>
        )}
      </div>
    </section>
  );
};

export default SimilarDecorationSlider;
