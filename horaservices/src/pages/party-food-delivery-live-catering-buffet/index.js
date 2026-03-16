import React from "react";
import CateringCard from "@/components/CateringCard";
import "@/components/CateringCard/catering.css";
import CateringBanner from "@/components/CateringBanner";
import CateringBannerImage from "@/assets/CateringBanner.jpeg";
import livebannerImage from "@/assets/livebanner.jpeg";
import BrandBannerIMG from "@/assets/BrandBannerIMG.webp";
import CateringTabs from "@/components/CateringTabs";
import BrandBanner from "@/components/BrandBanner";
import HappyCustomerIMG from "@/assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "@/assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "@/assets/ourSocialmediaIMG.png";
import TopBrandIMg from "@/assets/TpBrandsIMG.png";
import {balloonreviews} from "@/utils/balloonReviews";
import ReviewSlider from "@/components/ReviewSection";
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
const brandItems = [
  { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
  { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
  { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
  { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
];
const FoodDelivery = () => {
  return (
    <div className="catering-page">
 <CateringBanner image={CateringBannerImage} />
 <CateringTabs />
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
 <CateringBanner image={livebannerImage} />
 <CateringBanner image={BrandBannerIMG} />
 <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />
<ReviewSlider reviews={balloonreviews} title="Customer Reviews" />
    </div>

  );
};

export default FoodDelivery;