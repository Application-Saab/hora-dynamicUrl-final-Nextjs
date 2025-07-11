"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/new_logo_light.png";
import "./ProductSliderSection.css";
import { useDecorationEvents } from "@/utils/decorationEvents";
import { decCat } from "@/utils/decorationCategories";

const getDiscountedPrice = (price) => {
  price = parseFloat(price.replace(/[^0-9.-]+/g, ''));
  if (isNaN(price) || price < 0) return 0;

  let discount;
  if (price < 3000) discount = 20;
  else if (price <= 5000) discount = 27;
  else discount = 35;

  return Math.floor(price * (1 + discount / 100));
};

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

const ProductSliderSection = ({ title, data, viewLink, city, hasCityPageParam, locality }) => {
  const { handleSliderViewMore, handleItemClick } = useDecorationEvents(
    city,
    hasCityPageParam,
    decCat,
    locality
  );

  const buildCityLink = (link) => {
    if (!link) return "#";
    const base = link.startsWith("/") ? link : `/${link}`;
    if (city && locality) return `/${city.toLowerCase()}/${locality.toLowerCase()}${base}`;
    if (city && hasCityPageParam) return `/${city.toLowerCase()}${base}`;
    return base;
  };

  return (
    <div className="product-section-container">
      {/* === Header === */}
      <div className="product-section-header">
        <h2 onClick={() => handleSliderViewMore(viewLink, title)}>{title}</h2>
        <Link href={buildCityLink(viewLink)}>View All</Link>
      </div>

      {/* === Cards === */}
      <div className="product-section-grid">
        {data.map((item, index) =>
          item.isViewMore ? (
            <a key={index} className="product-section-view-more-card"></a>
          ) : (
            <a
              key={index}
              className="product-section-card"
              href={buildCityLink(item.link)}
              onClick={() => handleItemClick(item)}
            >
              <div className="product-section-image-wrapper">
                <Image
                  src={item.Image}
                  alt={item.title}
                  className="product-section-image"
                  layout="responsive"
                  width={700}
                  height={475}
                />
                <div className="product-section-watermark">
                  <Image
                    src={logo}
                    alt="hora watermark"
                    width={70}
                    height={80}
                    className="product-section-watermark-img"
                  />
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
            </a>
          )
        )}
      </div>
    </div>
  );
};

export default ProductSliderSection;
