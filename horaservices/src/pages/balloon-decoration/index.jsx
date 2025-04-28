import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
} from "../../utils/apiconstants";
import { setState } from "../../actions/action";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import "./slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryGrid from "./components/CategoryGrid";
import DecorationSection from "./components/DecorationSection";
import DecorationGridBlock from "./components/DecorationGridBlock";
import {
  AnniversaryData,
  BabyShowerData,
  DecorationCategories,
  KidsBirthdayData,
  PremiumData,
  WelcomebabyData,
  bacheloretteData,
  birthdayData,
  firstNightData,
  haldiAndMehndiData,
} from "@/util/DecorationMockData";
import DecorationSliderBlock from "./components/DecorationSliderBlock";
import DecorationSkeletonPage from "@/component/Placeholder/DecorationSkeletonPage";
import SeoHead from "./components/SeoHead";

const DecorationPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // 👈 add loading state

  useEffect(() => {
    // fake loading simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 50);

    return () => clearTimeout(timer); // clean up
  }, []);

  let { city } = useParams();
  const hasCityPageParam = city ? true : false;

  const openCatItems = (item) => {
    dispatch(setState(item.subCategory, item.imgAlt));
    if (hasCityPageParam) {
      router.push(`/${city}/balloon-decoration/${item.catValue}`);
    } else {
      router.push(`/balloon-decoration/${item.catValue}`);
    }
  };

  const handleViewMore = (category) => {
    const categoryItem = DecorationCategories.find(
      (cat) => cat.subCategory === category
    );
    console.log("Category Item:", categoryItem);
    if (categoryItem) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "title_and_viewmore_decoration_page_clicked",
        categoryName: categoryItem.name||"N/A",
        subCategory: categoryItem.subCategory||"N/A",
        catValue: categoryItem.catValue||"N/A",
        imgAlt: categoryItem.imgAlt||"N/A",
      });
      console.log('gmt working')
      openCatItems(categoryItem);
    } else {
      console.log("No matching category item found.");
    }
  };

  const handleSliderViewMore = (link, city) => {
    if (city) {
      router.push(`/${city}/${link}`);
    } else {
      router.push(`/${link}`);
    }
  };

  const handleItemClick = (item) => {
    // Ensure window.dataLayer is defined
    window.dataLayer = window.dataLayer || [];
    // Check if item has all necessary properties before pushing
    if (item && item.title && item.category) {
      window.dataLayer.push({
        event: "decoration_item_clicked",
        event_category: "SliderSection",
        event_label: item.title,
        categoryName: item.category||"N/A",
        subCategory: item.subCategory || "N/A", 
        catValue: item.catValue || "N/A", 
        imgAlt: item.imgAlt || "N/A", 
      });
  
      // Optionally, log the last event pushed to dataLayer for debugging
      let lastEvent = window.dataLayer[window.dataLayer.length - 1];
      console.log("Last Event:", lastEvent);
    } else {
      console.error("Item is missing required properties for event tracking");
    }
  };
  

  const decorationSections = [
    {
      title: "Kids Birthday Decoration",
      data: KidsBirthdayData,
      viewLink: "KidsBirthday",
      category: "KidsBirthday",
      component: "grid",
    },
    {
      title: "Birthday Decoration",
      data: birthdayData,
      category: "Birthday",
      component: "slider",
    },
    {
      title: "First Night Decoration",
      data: firstNightData,
      category: "FirstNight",
      component: "grid",
    },
    {
      title: "Anniversary Decoration",
      data: AnniversaryData,
      viewLink: "Anniversary",
      category:"Anniversary",
      component: "slider",
    },
    {
      title: "Haldi & Mehndi Decoration",
      data: haldiAndMehndiData,
      category: "Haldi-Mehandi",
      component: "grid",
    },
    {
      title: "Welcome Baby",
      data: WelcomebabyData,
      category: "WelcomeBaby",
      component: "slider",
    },
    {
      title: "Baby Shower",
      data: BabyShowerData,
      category: "BabyShower",
      component: "grid",
    },
    {
      title: "Premium Decors",
      data: PremiumData,
      category: "PremiumDecoration",
      component: "slider",
    },
    {
      title: "Bachelorette Decoration",
      data: bacheloretteData,
      viewLink: "bachelorette",
      category: "Bachelorette",
      component: "grid",
    },
  ];

  return (
    <>
      {loading ? (
        <div className="container py-3">
          <DecorationSkeletonPage />
        </div>
      ) : (
        <div className="container py-3">
          <SeoHead/>
          <CategoryGrid
            categories={DecorationCategories}
            openCatItems={openCatItems}
          />

          {decorationSections.map((section, index) => (
            <DecorationSection
              key={index}
              title={section.title}
              data={section.data}
              handleViewMore={handleViewMore}
              viewLink={section.viewLink}
              category={section.category}
              handleItemClick={handleItemClick}
            >
              {section.component === "grid" ? (
                <DecorationGridBlock
                  title={section.title}
                  data={section.data}
                  handleSliderViewMore={handleSliderViewMore}
                  handleViewMore={handleViewMore}
                />
              ) : (
                <DecorationSliderBlock
                  title={section.title}
                  data={section.data}
                  handleSliderViewMore={handleSliderViewMore}
                />
              )}
            </DecorationSection>
          ))}
        </div>
      )}
    </>
  );
};

// Fetching the data at build time
export async function getStaticProps() {
  try {
    const catalogueData = await Promise.all(
      DecorationCategories.map(async (item) => {
        const response = await axios.get(
          BASE_URL + GET_DECORATION_CAT_ID + item.subCategory
        );
        const categoryId = response.data.data._id;
        const result = await axios.get(
          BASE_URL + GET_DECORATION_CAT_ITEM + categoryId
        );
        return {
          ...item,
          data: result.data.data,
        };
      })
    );

    return {
      props: {
        catalogueData,
      },
    };
  } catch (error) {
    console.log("Error fetching data:", error.message);
    return {
      props: {
        catalogueData: [],
      },
    };
  }
}

export default DecorationPage;
