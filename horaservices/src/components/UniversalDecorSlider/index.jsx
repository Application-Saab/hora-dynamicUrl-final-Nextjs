"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import "@/components/DecorSlider/DecorSlider.css";
import { useDecorationEvents } from "@/utils/decorationEvents";

const getDiscountedDifference = (price) => {
  const numericPrice = parseFloat(price?.toString().replace(/[^0-9.-]+/g, "")) || 0;
  if (numericPrice <= 0) return 0;
  const discount = numericPrice < 3000 ? 20 : numericPrice <= 5000 ? 27 : 35;
  const discountedPrice = Math.floor(numericPrice * (1 - discount / 100));
  return Math.floor(numericPrice - discountedPrice);
};

const UniversalDecorSlider = ({
  title = "",
  viewAllLink = "",
  data = [],
  showDiscount = false,
  imageSize = { width: 120, height: 120 },
  city = "",
  hasCityPageParam = false,
  decCat = [],
  locality = "",
  catValue =""
}) => {
  const router = useRouter();
  const { handleSliderViewMore, handleItemClick } = useDecorationEvents(
    city,
    hasCityPageParam,
    decCat,
    locality
  );

  const handleCardClick = (item) => {
  console.log("Item Clicked =>", item);


  const productName = encodeURIComponent(
    (item.name || item.title || "").replace(/\s+/g, "-").toLowerCase()
  );

  if (!catValue || !productName) {
    console.warn("Missing catValue or productName", { catValue, productName });
    return;
  }

  let path = "";
  if (city && locality) {
    path = `/${city.toLowerCase()}/${locality.toLowerCase()}/balloon-decoration/${catValue}/product/${productName}`;
  } else if (city) {
    path = `/${city.toLowerCase()}/balloon-decoration/${catValue}/product/${productName}`;
  } else {
    path = `/balloon-decoration/${catValue}/product/${productName}`;
  }

  console.log("Navigating to =>", path);
  handleItemClick(item);
  router.push(path);
};


  return (
    <section  style={{
    padding: '10px',
     background: "#fbe6d3",
    // borderRadius: '12px',
    // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }}>
      <div className="premium-slide-decor-header">
      {title && <h2>{title}</h2>}
        {viewAllLink && (
          <span onClick={() => handleSliderViewMore(viewAllLink, title)}>
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
                : "/default.png");

            const titleText = item.title || item.name || "Decoration";

            return (
              <div
                key={index}
                className="premium-card"
                onClick={() => handleCardClick(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="premium-img-wrapper">
                  <Image
                    src={imageUrl}
                    alt={titleText}
                    width={imageSize.width}
                    height={imageSize.height}
                    className="premium-img"
                  />
                  {showDiscount && discountDifference > 0 && (
                    <div className="premium-discount">₹{discountDifference} off</div>
                  )}
                </div>

                <div className="premium-content">
                  <p className="premium-title">
                    {titleText.length > 20 ? `${titleText.slice(0, 20)}...` : titleText}
                  </p>
                </div>

                <div className="premium-price-wrapper">
                  <span className="premium-price">₹{price}</span>
                  {showDiscount && (
                    <span className="premium-original">₹{originalPrice}</span>
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

export default UniversalDecorSlider;
