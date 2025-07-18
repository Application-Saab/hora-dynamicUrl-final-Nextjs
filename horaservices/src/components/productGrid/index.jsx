import React from "react";
import Image from "next/image";
import logo from "../../assets/new_logo_light.png";

const ProductGrid = ({ data = [], onCardClick, loading, skeletonCount = 4 }) => {
  return (
    <div className="decContainer">
      {data.length > 0 ? (
        <>
          {data.map((item, index) => (
            <div
              key={item._id}
              className="imageContainer"
              onClick={() => onCardClick?.(item)}
            >
              <div className="imageWrapper">
                <Image
                  src={`https://horaservices.com/api/uploads/compressed_webp/${item.featured_image?.split(".")[0]}.webp`}
                  alt={`balloon decoration ${item.name} ${item.price}`}
                  className="decImage"
                  width={300}
                  height={300}
                />
                <div className="watermark">
                  <Image src={logo} alt="logo" width={70} height={70} />
                </div>
                <div className="discountLabel">
                  ₹ {item.discountDifference.toFixed(0)} off
                </div>
              </div>
              <div className="cardContent">
                <p className="productName">{item.name}</p>
                <div className="priceRatingRow">
                  <div className="priceBlock">
                    <p className="price">₹{item.price}</p>
                    <p className="discountedPrice">₹{Math.floor(item.discountedPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : loading ? (
        Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="imageContainer">
            <div className="cardSkeleton" /> {/* Or import <CardSkeleton /> */}
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductGrid;
