"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import "@/components/DecorSlider/DecorSlider.css";
import "./Similarboosterslider.css";

const BOOSTER_IMAGE_BASE_URL = "https://horaservices.com/api/uploads/";
const BOOSTER_CATEGORY_SLUG = "celebration-booster"; // ⚠️ confirm singular/plural matches your route

const getDiscountedDifference = (price) => {
  const numericPrice =
    parseFloat(price?.toString().replace(/[^0-9.-]+/g, "")) || 0;

  if (numericPrice <= 0) return 0;

  const discount = numericPrice < 3000 ? 20 : numericPrice <= 5000 ? 27 : 35;
  const discountedPrice = Math.floor(numericPrice * (1 - discount / 100));
  return Math.floor(numericPrice - discountedPrice);
};

const SimilarBoosterSlider = ({
  title = "",
  viewAllLink = "",
  data = [],
  showDiscount = false,
  city = "",
  locality = "",
  icon,
  sparkleIcon,
}) => {
  const router = useRouter();

  const handleCardClick = (item) => {
    if (!item) return;

    const rawSlug = item.slug || item.product_slug || item.name || item.title;
    if (!rawSlug) return;

    const productSlug = rawSlug
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Celebration Booster is a flat category — no subcategory nesting.
    // Route: /{city?}/{locality?}/celebration-booster/product/{slug}
    const pathname = window.location.pathname;
    const parts = pathname.split("/").filter(Boolean);

    const boosterSegment =
      parts.find((seg) => seg.toLowerCase().includes("celebration-booster")) ||
      BOOSTER_CATEGORY_SLUG;

    const boosterIndex = parts.indexOf(boosterSegment);
    const resolvedCity = city || (boosterIndex > 0 ? parts[0] : "");
    const resolvedLocality = locality || (boosterIndex > 1 ? parts[1] : "");

    const finalPath =
      resolvedCity && resolvedLocality
        ? `/${resolvedCity}/${resolvedLocality}/${BOOSTER_CATEGORY_SLUG}/product/${productSlug}`
        : resolvedCity
        ? `/${resolvedCity}/${BOOSTER_CATEGORY_SLUG}/product/${productSlug}`
        : `/${BOOSTER_CATEGORY_SLUG}/product/${productSlug}`;

    router.push(finalPath);
  };

  return (
    <section style={{ padding: "10px 0px 10px 10px" }}>
      {title && (
        <div className="similar-slide-decor-header">
          <Image src={sparkleIcon} alt="" className="similar-slide-decor-icon" />

          <h2>{title}</h2>

          <Image src={icon} alt="" className="similar-slide-decor-sparkle" />
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

            const imageUrl = item.Image
              ? item.Image
              : item.featured_image
              ? `${BOOSTER_IMAGE_BASE_URL}${item.featured_image}`
              : "/default.png";

            const titleText = item.title || item.name || "Celebration Booster";

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
                    <div className="similar-discount">₹{discountDiff} off</div>
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
                    <span className="similar-original">₹{originalPrice}</span>
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

export default SimilarBoosterSlider;