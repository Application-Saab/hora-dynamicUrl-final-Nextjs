import React, { useState } from "react";
import Image from "next/image";
import logo from "../../assets/new_logo_light.png";
import fallbackImg from "@/assets/fallback-image.png";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";
import CustomizationModal from "../CustomizationModal";
import customizationIcon from "@/assets/customizatiton/Custmaizationicon.webp";

const ProductGrid = ({ data = [], onCardClick, categoryType, catValue }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const isPhotography = categoryType === "photography";

const getImageUrl = (item) => {
    let fileName = null;

    if (item.featured_image && typeof item.featured_image === "string") {
      fileName = item.featured_image;
    } else if (Array.isArray(item.featured_image) && item.featured_image.length > 0) {
      fileName = item.featured_image[0]?.fileName || item.featured_image[0];
    } else if (item.featured_images?.[0]?.fileName) {
      fileName = item.featured_images[0].fileName;
    }

    if (!fileName) return fallbackImg;

    // Already a full URL (e.g. celebration boosters serve raw uploads
    // directly, not through the compressed-webp CDN) — use as-is.
    if (/^https?:\/\//i.test(fileName)) {
      return fileName;
    }

    return `${COMPRESSED_WEBP_IMG_URL}${fileName.split(".")[0]}.webp`;
  };
  return (
    <div className="decContainer">
      {data.length > 0 &&
        data.map((item) => (
          <div
            key={item._id}
            className="imageContainer"
            onClick={() => onCardClick?.(item)}
          >
            <div className="imageWrapper">
              {item.designType &&
                Object.keys(item.designType).map(
                  (key) =>
                    item.designType[key] && (
                      <div key={key} className="designTypeBadge">
                        On {key}
                      </div>
                    )
                )}

              <Image
                src={getImageUrl(item)}
                alt={`balloon decoration ${item.name}`}
                className="decImage"
                width={300}
                height={300}
              />

              <div className="watermark">
                <Image
                  src={logo}
                  alt="logo"
                  width={isPhotography ? 28 : 18}
                  height={isPhotography ? 28 : 18}
                />
              </div>
            </div>

            <div className="cardContent">
              <p className="productname">
                {isPhotography
                  ? item.name
                  : item.name.length > 15
                  ? `${item.name.slice(0, 15)}...`
                  : item.name}
              </p>

              <div className="priceBlock">
                <p className="finalPrice">₹{item.price}</p>
                <p className="oldPrice">₹{Math.floor(item.discountedPrice)}</p>
                <div className="discountBottom">
                  ₹{item.discountDifference?.toFixed(0)} off
                </div>
              </div>

              {isPhotography ? (
                <>
                  <p className="customization">Customization Available</p>
                  <p className="viewMore">View More</p>
                </>
              ) : (
                <>
                  <div
                    className="customizationBox"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                  >
                    <span className="customizationIcon">
                      <Image
                        src={customizationIcon}
                        alt="Customization"
                        width={18}
                        height={18}
                      />
                    </span>
                    <div className="customizationTextWrap">
                      <p className="customizationTitle">
                        Customization Available
                      </p>
                      <p className="customizationSub">
                        Personalize it your way
                      </p>
                    </div>
                    <span className="customizationChevron">&gt;</span>
                  </div>

                  <hr className="cardDivider" />

                  <div className="viewMoreRow">
                    <p className="viewMore">View More</p>
                    <div className="viewMoreArrow">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="#fff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

      {!isPhotography && (
        <CustomizationModal
          product={selectedItem}
          catValue={catValue}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          image={selectedItem ? getImageUrl(selectedItem) : null}
        />
      )}
    </div>
  );
};

export default ProductGrid;