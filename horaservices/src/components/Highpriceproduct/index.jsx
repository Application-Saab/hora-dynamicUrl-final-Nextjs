import React, { useState } from "react";
import Image from "next/image";
import fallbackImg from "@/assets/fallback-image.png";
import "./highpriceproduct.css";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";
import CustomizationModal from "../CustomizationModal";
import customizationIcon from "@/assets/customizatiton/Custmaizationicon.webp";

const HighPriceProduct = ({ data, onCardClick, catValue }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!data || data.length === 0) return null;

  const highest = data.reduce(
    (prev, curr) => (curr.price > prev.price ? curr : prev),
    data[0]
  );

  const designKey =
    highest.designType &&
    Object.keys(highest.designType).find(
      (key) => highest.designType[key] === true
    );

  const getImageUrl = (item) =>
    item.featured_images?.[0]?.fileName
      ? `${COMPRESSED_WEBP_IMG_URL}${item.featured_images[0].fileName.split(".")[0]}.webp`
      : "/fallback-image.png";

  return (
    <div className="highdecContainer">
      <div className="highPriceCard" onClick={() => onCardClick?.(highest)}>
        <div className="highPriceImageWrapper">
          {designKey && (
            <div className="highDesignBadge">On {designKey}</div>
          )}

        <Image
  src={
    highest.featured_images?.[0]?.fileName
      ? `${COMPRESSED_WEBP_IMG_URL}${highest.featured_images[0].fileName.split(".")[0]}.webp`
      : fallbackImg
  }
  alt={highest.name}
  className="highPriceImage"
  width={300}
  height={300}
/>
        </div>

        <div className="highPriceContent">
          <p className="highproductName">
            {highest.name.length > 25
              ? `${highest.name.slice(0, 25)}...`
              : highest.name}
          </p>

          <div className="highpriceRow">
            <span className="highdiscountedPrice">₹{highest.price}</span>
            <span className="highoriginalPrice">
              ₹{Math.floor(highest.discountedPrice)}
            </span>
            <span className="highdiscountBadge">
              ₹{highest.discountDifference.toFixed(0)} off
            </span>
          </div>

          <div
            className="highcustomizationBox"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(highest);
            }}
          >
            <span className="highcustomizationIcon">
              <Image
                src={customizationIcon}
                alt="Customization"
                width={18}
                height={18}
              />
            </span>
            <div className="highcustomizationTextWrap">
              <p className="highcustomizationTitle">
                Customization Available
              </p>
              <p className="highcustomizationSub">Personalize it your way</p>
            </div>
            <span className="highcustomizationChevron">&gt;</span>
          </div>

          <hr className="highcardDivider" />

          <div className="highviewMoreRow">
            <p className="highviewMore">View more</p>
            <div className="highviewMoreArrow">
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
        </div>
      </div>

      <CustomizationModal
        product={selectedItem}
        catValue={catValue}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        image={selectedItem ? getImageUrl(selectedItem) : null}
      />
    </div>
  );
};

export default HighPriceProduct;