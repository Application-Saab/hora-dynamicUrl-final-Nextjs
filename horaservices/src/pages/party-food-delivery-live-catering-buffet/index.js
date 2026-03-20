import React, { useEffect, useState } from "react";
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
import VegToggle from "@/components/VegNonVegToggle";
import { BASE_URL } from "@/utils/apiconstants";

const brandItems = [
  { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
  { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
  { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
  { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
];
const FoodDelivery = () => {
   const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodType, setFoodType] = useState(""); // veg / non-veg
const [packageType, setPackageType] = useState("bulkFood");
  // ✅ API CALL
 const fetchPackages = async (type = packageType, food = "") => {
  try {
    setLoading(true);

    let url = `${BASE_URL}/api/food-Package/getAllFoodPackageList?packageType=${type}`;

    if (food) {
      url += `&foodType=${food}`;
    }

    const res = await fetch(url);
    const result = await res.json();

    setData(result?.data || []);
  } catch (error) {
    console.log("Error:", error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchPackages(packageType, foodType);
}, [packageType, foodType]);

  return (
    <div className="catering-page">
 <CateringBanner image={CateringBannerImage} />
 <CateringTabs onChange={(type) => setPackageType(type)} />
      {/* Toggle Buttons */}
  <VegToggle onChange={(type) => setFoodType(type)} />
      {/* Card Grid */}
    <div className="catering-grid">
        {loading ? (
          <p>Loading...</p>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <CateringCard
              key={index}
         image={
  item.image
    ? `https://horaservices.com/api/uploads/${item.image}`
    : "/default-image.webp"
}
              title={item.title || item.name}
              price={item.price}
              oldPrice={item.oldPrice || item.actualPrice}
              dish={item.dish || item.dishCount}
            />
          ))
        ) : (
          <p>No Packages Found</p>
        )}
      </div>
 <CateringBanner image={livebannerImage} />
 <CateringBanner image={BrandBannerIMG} />
 <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />
<ReviewSlider reviews={balloonreviews} title="Customer Reviews" />
    </div>

  );
};

export default FoodDelivery;