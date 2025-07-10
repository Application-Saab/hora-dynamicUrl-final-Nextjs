"use client";
import Image from "next/image";
import Link from "next/link";
import "./DecorSlider.css";
import { useDecorationEvents } from "@/utils/decorationEvents";

const getDiscountedDifference = (price) => {
  price = parseFloat(price.replace(/[^0-9.-]+/g, ''));
  if (isNaN(price) || price < 0) return 0;

  let discount;
  if (price < 3000) discount = 20;
  else if (price <= 5000) discount = 27;
  else discount = 35;

  const discountedPrice = Math.floor(price * (1 - discount / 100));
  return Math.floor(price - discountedPrice);
};

const DecorSlider = ({
  title,
  viewAllLink,
  data,
  showDiscount = false,
  imageSize = { width: 120, height: 120 },
  city,
  hasCityPageParam,
  decCat,
}) => {
  const { handleSliderViewMore, handleItemClick } = useDecorationEvents(
    city,
    hasCityPageParam,
    decCat
  );

  // Helper to build city-aware link
  const buildCityLink = (link) => {
    if (!link) return "#";
    if (hasCityPageParam && city) {
      return `/${city.toLowerCase()}${link.startsWith("/") ? link : `/${link}`}`;
    }
    return link;
  };

  return (
    <section className="premium-slide-decor">
      <div className="premium-slide-decor-header">
        <h2>{title}</h2>
        <span onClick={() => handleSliderViewMore(viewAllLink, title)}>
          <Link href={buildCityLink(viewAllLink)}>View All</Link>
        </span>
      </div>

      <div className="premium-scroll-wrapper">
        {data.map((item, index) => {
          const numericPrice = parseInt(item.price.replace("₹", "")) || 0;
          const discountDifference = getDiscountedDifference(item.price);
          const originalPrice = numericPrice + discountDifference;
          const link = buildCityLink(item.link);

          return (
            <Link
              href={link}
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
                  <div className="premium-discount">₹{discountDifference} off</div>
                )}
              </div>
              <div className="premium-content">
                <p className="premium-title">{item.title}</p>
                <div className="premium-price-wrapper">
                  <span className="premium-price">{item.price}</span>
                  {showDiscount && (
                    <span className="premium-original">₹{originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DecorSlider;
