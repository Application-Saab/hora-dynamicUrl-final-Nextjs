import React, { useEffect, useState } from "react";
import CateringCard from "@/components/CateringCard";
import "@/components/CateringCard/catering.css";
import CateringBanner from "@/components/CateringBanner";
import CateringBannerImage from "@/assets/CateringBanner.webp";
import livebannerImage from "@/assets/livebanner.jpeg";
import bulkBannerImage from "@/assets/BulkBanner.webp"
import BrandBannerIMG from "@/assets/BrandBannerIMG.webp";
import CateringTabs from "@/components/CateringTabs";
import BrandBanner from "@/components/BrandBanner";
import HappyCustomerIMG from "@/assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "@/assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "@/assets/ourSocialmediaIMG.png";
import TopBrandIMg from "@/assets/TpBrandsIMG.png";
import { balloonreviews } from "@/utils/balloonReviews";
import ReviewSlider from "@/components/ReviewSection";
import VegToggle from "@/components/VegNonVegToggle";
import { BASE_URL, GET_MEAL_DISH_ENDPOINT } from "@/utils/apiconstants";
import CateringModal from "@/components/CateringModal";
import { useRouter } from "next/router";
import CardSkeleton from "@/components/CardSkeleton";

const brandItems = [
  { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
  { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
  { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
  { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
];
const FoodDelivery = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodType, setFoodType] = useState("veg");
  const [packageType, setPackageType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [mealTypes, setMealTypes] = useState([]);
  const [mealList, setMealList] = useState([]);
useEffect(() => {
  const handleBack = () => {
    if (selectedPackage) {
      setSelectedPackage(null); // 👈 modal close
    }
  };

  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, [selectedPackage]);
  useEffect(() => {
  if (!router.isReady) return;

  const type = router.query.type;

  setPackageType(type === "liveCatering" ? "liveCatering" : "bulkFood");
}, [router.isReady, router.query.type]);
  const handlePackageChange = (type) => {
    setPackageType(type);

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, type },
      },
      undefined,
      { shallow: true }
    );
  };
  const fetchMealTypes = async () => {
    try {
      const url = `${BASE_URL}${GET_MEAL_DISH_ENDPOINT}`;

      const requestData = {
        cuisineId: [],
        is_dish: foodType === "non-veg" ? 0 : 1,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();

      setMealList(result?.data || []);
      const formattedMeals = (result?.data || [])
        .filter(item => item?.mealObject?._id)
        .map(item => ({
          _id: item.mealObject._id,
          name: item.mealObject.name
        }));

      setMealTypes(formattedMeals);

    } catch (err) {
      console.log("Meal API Error:", err);
    }
  };
  // 🔥 Fetch Packages
  const fetchPackages = async () => {
    try {
      setLoading(true);

      let url = `${BASE_URL}/api/food-Package/getAllFoodPackageList?packageType=${packageType}`;

      if (foodType) {
        url += `&foodType=${foodType}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      setData(result?.data || []);
    } catch (error) {
      console.log("Package API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Effects
  useEffect(() => {
    fetchMealTypes();
  }, []);

 useEffect(() => {
  if (!packageType) return;

  fetchPackages();
}, [packageType, foodType]);
const handleCloseModal = () => {
  setSelectedPackage(null);
};
  return (
    <div className="catering-page">

      {/* Banner */}
      <CateringBanner image={CateringBannerImage} />

      {/* Tabs */}
      <CateringTabs onChange={handlePackageChange} />
      {/* Veg Toggle */}
      <VegToggle value={foodType} onChange={(type) => setFoodType(type)} />

      {/* 🔥 FIRST GRID */}
      <div className="catering-grid">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : data.length > 0 ? (
          data.slice(0, 4).map((item, index) => (
            <CateringCard
              key={index}
              item={item}
              image={
                item.image
                  ? `https://horaservices.com/api/uploads/${item.image}`
                  : "/default-image.webp"
              }
              title={item.title || item.name}
              price={item.price}
              oldPrice={item.oldPrice || item.actualPrice}
              dish={item.dish || item.dishCount}
             onView={() => { setSelectedPackage(item);
              window.history.pushState(null, "");}}
            />
          ))
        ) : (
          <p>No Packages Found</p>
        )}
      </div>

      {/* 🔥 BANNER (ALWAYS SHOW) */}
      <CateringBanner
        image={
          packageType === "liveCatering"
            ? livebannerImage
            : bulkBannerImage
        }
      />

      {/* 🔥 SECOND GRID */}
      {!loading && data.length > 4 && (
        <div className="catering-grid">
          {data.slice(4).map((item, index) => (
            <CateringCard
              key={index + 4}
              item={item}
              image={
                item.image
                  ? `https://horaservices.com/api/uploads/${item.image}`
                  : "/default-image.webp"
              }
              title={item.title || item.name}
              price={item.price}
              oldPrice={item.oldPrice || item.actualPrice}
              dish={item.dish || item.dishCount}
              onView={() => {
  setSelectedPackage(item);
  window.history.pushState(null, "");
}}
            />
          ))}
        </div>
      )}
      {selectedPackage && (
        <CateringModal
          data={selectedPackage}
          mealTypes={mealTypes}
         onClose={handleCloseModal}
          allDishes={mealList}
        />
      )}
      <CateringBanner image={BrandBannerIMG} />
      <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />
      <ReviewSlider reviews={balloonreviews} title="Customer Reviews" />

    </div>
  );
};

export default FoodDelivery;