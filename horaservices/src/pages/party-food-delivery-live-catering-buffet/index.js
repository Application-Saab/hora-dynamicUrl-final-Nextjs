import React from "react";
import CateringCard from "@/components/CateringCard";
import "@/components/CateringCard/catering.css";
import CateringBanner from "@/components/CateringBanner";
import CateringBannerImage from "@/assets/CateringBanner.jpg";
const data = [
  {
    image: "/images/catering1.jpg",
    title: "Value Bites",
    price: "385",
    oldPrice: "15195",
    dish: "9",
  },
  {
    image: "/images/catering2.jpg",
    title: "The Complete Spread",
    price: "470",
    oldPrice: "15195",
    dish: "10",
  },
  {
    image: "/images/catering3.jpg",
    title: "Kids snack Party Birthday",
    price: "490",
    oldPrice: "15195",
    dish: "6",
  },
  {
    image: "/images/catering4.jpg",
    title: "Cocktail Party",
    price: "520",
    oldPrice: "15195",
    dish: "8",
  },
];

const FoodDelivery = () => {
  return (
    <div className="catering-page">
 <CateringBanner image={CateringBannerImage} />
      {/* Toggle Buttons */}
      <div className="veg-toggle">
        <button className="veg-btn active">Only Veg</button>
        <button className="veg-btn">Non-Veg</button>
      </div>

      {/* Card Grid */}
      <div className="catering-grid">
        {data.map((item, index) => (
          <CateringCard key={index} {...item} />
        ))}
      </div>

    </div>
  );
};

export default FoodDelivery;