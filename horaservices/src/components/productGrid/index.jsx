import React from "react";
import Image from "next/image";
import logo from "../../assets/new_logo_light.png";
import "./productGrid.css";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";
const ProductGrid = ({ data = [], onCardClick, categoryType  }) => {
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

  {/* ✅ Design Type Badge */}
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
  src={
    item.featured_images?.[0]?.fileName
      ? `${COMPRESSED_WEBP_IMG_URL}${item.featured_images[0].fileName.split(".")[0]}.webp`
      : "/fallback-image.png"
  }
  alt={`balloon decoration ${item.name}`}
  className="decImage"
  width={300}
  height={300}
/>

  <div className="watermark">
    <Image src={logo} alt="logo" width={28} height={28} />
  </div>

</div>

            <div className="cardContent">
                    <p className="productname">
            {categoryType === "photography"
              ? item.name
              : item.name.length > 15
              ? `${item.name.slice(0, 15)}...`
              : item.name}
             </p>
              <div className="priceRatingRow">
                {/* <div className="priceBlock">
                  <p className="PRice">₹{item.price}</p>
                  <p className="discountedPrice">₹{Math.floor(item.discountedPrice)}</p>
                </div> */}
                <div className="priceBlock">
  <p className="finalPrice">₹{item.price}</p>
  <p className="oldPrice">₹{Math.floor(item.discountedPrice)}</p>

  <div className="discountBottom">
    ₹ {item.discountDifference?.toFixed(0)} off
  </div>
</div>

                <p className="customization">Customization Available</p>
                <p className="viewMore">View More</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductGrid;
