import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import React from 'react';

import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
  API_SUCCESS_CODE,
} from "../../../utils/apiconstants";
import axios from "axios";
import { useSelector } from "react-redux";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { getDecorationCatOrganizationSchema } from "../../../utils/schema";
import { setState } from "../../../actions/action";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../assets/new_logo_light.png";
import DecorationCatDescriptionData from "@/utils/decorationCatDescritionData";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { themeFilters } from "@/utils/themeFilters";
import "./catvaluedecor.css"
import ProductGrid from "@/components/productGrid";
import FilterBar from "@/components/FilterBar";
import customize from "../../../assets/customize.jpg";
import DidyouKnow from "../../../assets/didyouknow.jpg";
import makeItMemorable from "../../../assets/makeitmemorable.png";
import steps from "../../../assets/steps.webp";
import makeitmemorablebanner from "../../../assets/makeitmemorablebanner.png";
import googleRating from "../../../assets/goglerating.png";
import Gurantee from "../../../assets/gurantee.jpg";
import ontime from "../../../assets/ontime.png"
import CategoryTabs from "@/components/CategoryTabs/index.jsx";
import birthdayBanner from "@/assets/categories/BIRTHDAY.webp";
import premiumBanner from "@/assets/categories/PREMIUMDECORATION.webp";
import kidsBanner from "@/assets/categories/KIDSDECORATION.Webp"
import welcomeBanner from "@/assets/categories/WELCOMEBABY.webp"
import babyshowerBanner from "@/assets/categories/BABYSHOWWER.webp"
import anniversaryBanner from "@/assets/categories/ANNVERSARY.webp"
import firstNightBanner from "@/assets/categories/FIRSTNIGHT.webp";
import haldimehndiBanner from "@/assets/categories/HALDIMEHNDIBANNER.webp";
import WeddingBanner from "@/assets/categories/WeddingBanner.webp";
import BacheloretteBanner from "@/assets/categories/BacheloretteBanner.webp"
import { useDecorationEvents } from "@/utils/decorationEvents";
import { decCat } from "@/utils/decorationCategories";
import CardSkeleton from "@/components/CardSkeleton";
import HighPriceProduct from "@/components/Highpriceproduct";
const DecorationCatPage = ({ locality }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [city, setCity] = useState("");
  const [catValue, setCatValue] = useState("");
  useEffect(() => {
    if (router.isReady) {
      const { catValue: queryCatValue, city: queryCity } = router.query;

      if (queryCatValue) {
        setCatValue(queryCatValue);
      }

      if (queryCity) {
        setCity(queryCity);

      }
    } else {
      const path = window.location.pathname;
      const parts = path.split("/");
      const dynamicValue = parts[2];
      setCatValue(dynamicValue);
    }
  }, [router.isReady, router.query]);
  const altTagCatValue = catValue.replace(/-/g, " ");
  const [orderType, setOrderType] = useState(1);
  const hasCityPageParam = city ? true : false;
  const containerRef = useRef(null);
  //   const { catValue } = useParams();
  const [selCat, setSelCat] = useState("");
  const [catId, setCatId] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [currentCategoryContent, setCurrentCategoryContent] = useState(
    DecorationCatDescriptionData[catValue] || []
  );
  const { theme } = router.query;
  const [loading, setLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(0); // State for the discount percentage
  const [discountedPrice, setDiscountedPrice] = useState(0); // State for the discounted price
  const [discountDifference, setDiscountDifference] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogueData, setCatalogueData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered container index
  //   const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState("all"); // Default: Show all
  const [themeFilter, setThemeFilter] = useState("all"); // Default: Show all
  const [sortFilter, setSortFilter] = useState("asc");
  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);
  const searchParams = useSearchParams();
  const selectedTheme = searchParams.get("theme");
  const isThemePage = !!selectedTheme;
  const { handleViewDetails } = useDecorationEvents(city, hasCityPageParam, decCat, locality, orderType);


  function getSubCategory(catValue) {
    if (!catValue) {
      const path = window.location.pathname; // e.g., /balloon-decoration/kids-birthday-decoration
      const parts = path.split("/"); // Split by '/'
      const dynamicValue = parts[2];
      return dynamicValue;
    }

    if (catValue === "birthday-decoration") {
      return "Birthday";
    } else if (catValue === "anniversary-decoration") {
      return "Anniversary";
    } else if (catValue === "haldi-mehendi-decoration") {
      return "Haldi-Mehandi";
    } else if (catValue === "first-night-decoration") {
      return "FirstNight";
    } else if (catValue === "baby-shower-decoration") {
      return "BabyShower";
    } else if (catValue === "welcome-baby-decoration") {
      return "WelcomeBaby";
    } else if (catValue === "premium-decoration") {
      return "PremiumDecoration";
    } else if (catValue === "bachelorette-decoration") {
      return "bachelorette";
    } else {
      const parts = catValue.split("-"); // Split by hyphens
      return parts
        .slice(0, 2) // Take only the first two parts
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ) // Capitalize each part
        .join(""); // Join parts together without spaces
    }
  }

  const { subCategory: stateSubCategory, imgAlt: stateImgAlt } = useSelector(
    (state) => state.state || {}
  );
  const subCategory = getSubCategory(catValue) || stateSubCategory;
  const imgAlt = stateImgAlt || "default alt text"; // Replace with a default alt text if needed
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to generate a random rating between 4.1 to 4.8
  const getRandomRating = () => {
    return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
  };
  useEffect(() => {
    if (theme) {
      setThemeFilter(theme); // This sets the theme dropdown based on URL
    } else {
      setThemeFilter("all");
    }
  }, [theme]);
  useEffect(() => {
    //console.log("useEffect1")
    addSpaces(subCategory);
    getSubCatId(subCategory);
  }, [subCategory]);

  useEffect(() => {
    //console.log("useEffect2")
    const handleStickyScroll = () => {
      const filterElement = document.querySelector(".filterdropdown");
      if (filterElement) {
        filterElement.classList.toggle("sticky", window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleStickyScroll);
    return () => window.removeEventListener("scroll", handleStickyScroll);
  }, []);



  const sentinelRef = useRef(null);

  useEffect(() => {
    if (loading || !hasMore) return;

    // Adjust rootMargin based on screen size
    const isMobile = window.innerWidth <= 768;
    const rootMargin = isMobile ? "400px" : "1000px";

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: 0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [loading, hasMore]);

  // Fetch more data when page increases
  useEffect(() => {
    //console.log("UseEffect4")
    if (catValue && currentPage !== 1) {
      getSubCatItems(currentPage);
    }
  }, [currentPage]);



  // Filter change
  useEffect(() => {
    if (catValue) {
      setCatalogueData([]);
      setCurrentPage(1);
      getSubCatItems(1);
    }
  }, [catValue, priceFilter, themeFilter]);

  useEffect(() => {
    if (catValue) {
      const content = DecorationCatDescriptionData[catValue] || [];
      console.log("Setting category content for", catValue, content);
      setCurrentCategoryContent(content);
    }
  }, [catValue]);

  function addSpaces(subCategory) {
    let result = "";
    for (let i = 0; i < subCategory.length; i++) {
      if (i !== 0 && subCategory[i] === subCategory[i].toUpperCase()) {
        result += " ";
      }
      result += subCategory[i];
    }

    setSelCat(result);
  }

  console.log(subCategory, "subCategory");
  const getSubCatId = async (subCategory) => {
    try {
      const response = await axios.get(
        BASE_URL + GET_DECORATION_CAT_ID + subCategory
      );
      const categoryId = response.data.data?._id;
      console.log("Category ID:", categoryId);
      if (categoryId) {
        setCatId(categoryId); // ✅ only this
        // remove setCatValue(subCategory)
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };


  const getDiscountedPrice = (price) => {
    let discount;
    if (price < 3000) {
      discount = 20;
    } else if (price >= 3000 && price <= 5000) {
      discount = 27;
    } else {
      discount = 35;
    }

    const discountedPrice = price * (1 + discount / 100);
    const discountDifference = Math.abs(price - discountedPrice);
    return { discount, discountedPrice, discountDifference };
  };

  useEffect(() => {
    if (catId) {
      getSubCatItems(1);
    }
  }, [catId, themeFilter, priceFilter]);

  // console.log("catId22", catId);
  const getSubCatItems = async (page) => {
    // console.log("catId11", catId);
    if (!catId) return;

    try {
      setLoading(true);

      let newPriceFilter = priceFilter;
      let newSortFilter = "asc";

      if (priceFilter === "lowToHigh") {
        newPriceFilter = "";
        newSortFilter = "asc";
      } else if (priceFilter === "highToLow") {
        newPriceFilter = "";
        newSortFilter = "desc";
      }

      const apiUrl = `${BASE_URL + GET_DECORATION_CAT_ITEM
        }v2/${catId}?limit=1000&priceFilter=${newPriceFilter}&sortBy=${newSortFilter}&theme=${themeFilter}`;


      const response = await axios.get(apiUrl);

      if (response.status === API_SUCCESS_CODE) {
        const decoratedData = response.data.data.map((item) => {
          const { discount, discountedPrice, discountDifference } =
            getDiscountedPrice(item.price);
          return {
            ...item,
            rating: getRandomRating(),
            userCount: getRandomNumber(20, 500),
            discountPercentage: discount,
            discountedPrice,
            discountDifference,
          };
        });
        console.log(decoratedData);
        setCatalogueData((prevData) =>
          page === 1 ? decoratedData : [...prevData, ...decoratedData]
        );
        setHasMore(page < response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error Fetching Data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryBannerMap = {
    "birthday-decoration": birthdayBanner,
    "premium-decoration": premiumBanner,
    "kids-birthday-decoration": kidsBanner,
    "welcome-baby-decoration": welcomeBanner,
    "baby-shower-decoration": babyshowerBanner,
    "anniversary-decoration": anniversaryBanner,
    "first-night-decoration": firstNightBanner,
    "haldi-mehendi-decoration": haldimehndiBanner,
    "Wedding": WeddingBanner,
    "bachelorette-decoration": BacheloretteBanner
  };
  function trimText(text) {
    if (text.length > 60) {
      return text.slice(0, 60) + "...";
    }
    return text;
  }

  const normalizeCatValue = (val) => {
    if (!val) return "";

    // Check if exact match (case-sensitive) exists in the map
    const exactMatch = Object.keys(categoryBannerMap).find(
      (key) => key.toLowerCase() === val.toLowerCase()
    );

    return exactMatch || val.toLowerCase().replace(/ /g, "-");
  };

  const normalizedCat = normalizeCatValue(catValue);
  const bannerToShow = categoryBannerMap[normalizedCat] || categoryBannerMap["default"];

  const shouldHideBanner = (name) => {
    const hideFor = ["Wedding", "haldi-mehendi-decoration"]; // jinke liye hide karna hai
    return hideFor.includes(normalizedCat) && ["makeItMemorable", "DidyouKnow", "makeitmemorablebanner"].includes(name);
  };


   const PageTitle = (catValue, city, theme) => {
    let baseTitle;

    if (catValue === "kids-birthday-decoration") {
      baseTitle = city
        ? `Kids Birthday Balloon Decoration in ${city} by Professional Decorators, Starting at ₹1199`
        : "Kids' Birthday Balloon Decoration by Professional Decorators, Starting at ₹1199";
    } else if (catValue === "birthday-decoration") {
      baseTitle = city
        ? `Birthday Balloon Decoration in ${city} at Home by Professional Decorators, Starting at ₹1199`
        : "Birthday Balloon Decoration at Home by Professional Decorators, Starting at ₹1199";
    } else if (catValue === "anniversary-decoration") {
      baseTitle = city
        ? `Anniversary Decorations in ${city} with Balloon & Rose Petals, Starting at ₹1199`
        : "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199";
    } else if (catValue === "first-night-decoration") {
      baseTitle = city
        ? `First Night Decorations in ${city} with Balloon & Rose Petals, Starting at ₹1199`
        : "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199";
    } else if (catValue === "baby-shower-decoration") {
      baseTitle = city
        ? `Baby Shower in ${city} with Latest Designs by Professional Decorators, Starting at ₹1199`
        : "Baby Shower with Latest Designs by Professional Decorators, Starting at ₹1199";
    } else if (catValue === "welcome-baby-decoration") {
      baseTitle = city
        ? `Baby Welcome Decoration in ${city} at Home by Professional Decorators, Starting at ₹1199`
        : "Baby Welcome Decoration at Home by Professional Decorators, Starting at ₹1199";
    } else if (catValue === "haldi-mehendi-decoration") {
      baseTitle = city
        ? `Haldi Decoration in ${city} with Latest Designs, Starting at ₹3000`
        : "Haldi Decoration with Latest Designs, Starting at ₹3000";
    } else {
      baseTitle = city
        ? `Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings in ${city} – Starting at ₹1199`
        : "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
    }
    return theme ? `HORA Decorations - <${theme}> - ${baseTitle}` : baseTitle;
  };

  const getPageMetaDescription = (catValue, city) => {
    if (catValue === "kids-birthday-decoration") {
      return city
        ? `At Hora in ${city}, 🎉 Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠️, Baby Boss 👔, Barbie 💖, and cars 🚗. Book your perfect party decor today! 🎈✨`
        : "At Hora, 🎉 Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠️, Baby Boss 👔, Barbie 💖, and cars 🚗. Book your perfect party decor today! 🎈✨";
    }
    if (catValue === "birthday-decoration") {
      return city
        ? `Celebrate birthdays in ${city} with balloon & flower decorations by professional decorators. Customize your party and make it unforgettable! 🎉`
        : "Celebrate birthdays with balloon & flower decorations by professional decorators. Customize your party and make it unforgettable! 🎉";
    }
    if (catValue === "anniversary-decoration") {
      return city
        ? `Make your anniversary in ${city} magical with elegant balloon & rose petal decorations. Book directly online! 💖`
        : "Make your anniversary magical with elegant balloon & rose petal decorations. Book directly online! 💖";
    }
    if (catValue === "haldi-mehendi-decoration") {
      return city
        ? `Brighten up your Haldi ceremony in ${city} with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups.`
        : "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups.";
    }
    // default description
    return city
      ? `Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings in ${city} – Starting at ₹1199`
      : "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
  };



  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };


const highPriceProducts = catalogueData.filter(item => item.price > 11000);

console.log("highPriceProducts",highPriceProducts);

  return (
    <div className="decCatPage">
      <Head>
        <title>{PageTitle(normalizedCat, city, theme)}</title>
        <meta name="description" content={getPageMetaDescription(normalizedCat, city)} />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content={PageTitle(normalizedCat, city)} />
        <meta property="og:description" content={getPageMetaDescription(normalizedCat, city)} />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${normalizedCat}`} />
        <meta property="og:type" content="website" />
      </Head>

      {loading ? (
        <div className="skeleton-wrapper">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {!isThemePage && (
            <>
              <section className="decorationBanner">
                <Image
                  src={bannerToShow}
                  alt="Decoration Banner"
                  width={1200}
                  height={400}
                  className="decorationBanner-image"
                  priority
                />
              </section>

              {catValue?.toLowerCase() === "kids-birthday-decoration" && (
                <div className="category-tabs-outer">
                  <CategoryTabs
                    data={themeFilters.map((item) => ({
                      id: item.value,
                      name: item.label,
                      image: item.image,
                      value: item.value,
                      catValue: "kids-birthday-decoration",
                    }))}
                    onSelect={(item) => openCatItems(item, themeFilter)}
                    city={city}
                    hasCityPageParam={hasCityPageParam}
                    locality={locality}
                    variant="grid"
                    catValue="kids-birthday-decoration"
                  />
                </div>
              )}

              <ProductGrid data={catalogueData.slice(0, 4)} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} catValue={catValue} />
 
<HighPriceProduct 
  data={highPriceProducts.slice(0, 1)} 
  onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} 
/>
              <div className="filterBar">
                <FilterBar priceFilter={priceFilter} setPriceFilter={setPriceFilter} />
              </div>
              <section className="decorationBanner">
                <Image src={customize} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
              </section>

              <ProductGrid data={catalogueData.slice(4, 10)} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} catValue={catValue} />
         
<HighPriceProduct 
  data={highPriceProducts.slice(1, 2)} 
  onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} 
/>
              {!shouldHideBanner("DidyouKnow") && (
                <section className="decorationBanner">
                  <Image src={DidyouKnow} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                </section>
              )}

              <ProductGrid data={catalogueData.slice(10, 14)} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} catValue={catValue} />
       <HighPriceProduct
data={highPriceProducts.slice(2, 3)}
  onCardClick={(item) => handleViewDetails(subCategory, catValue, item)}
/>
              {!shouldHideBanner("makeItMemorable") && (
                <section className="decorationBanner">
                  <Image src={makeItMemorable} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                </section>
              )}

              <ProductGrid data={catalogueData.slice(14, 20)} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} catValue={catValue} />
     <HighPriceProduct
data={highPriceProducts.slice(3, 4)} 
  onCardClick={(item) => handleViewDetails(subCategory, catValue, item)}
/>
              <section className="decorationBanner">
                <Image src={steps} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
              </section>

              <ProductGrid data={catalogueData.slice(20, 26)} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} catValue={catValue} />
                <HighPriceProduct
 data={highPriceProducts.slice(4, 5)}
  onCardClick={(item) => handleViewDetails(subCategory, catValue, item)}
/>
              {!shouldHideBanner("makeitmemorablebanner") && (
                <section className="decorationBanner">
                  <Image src={makeitmemorablebanner} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                </section>
              )}

              <ProductGrid data={catalogueData.slice(26, 32)} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} catValue={catValue} />
                 <HighPriceProduct
 data={highPriceProducts.slice(5, 6)}
  onCardClick={(item) => handleViewDetails(subCategory, catValue, item)}
/>
              <div className="highlight-wrapper">
                <h3 className="highlight-title">Excellence Backed by Happy Customers</h3>
                <div className="highlight-cards">
                  <div className="highlight-card">
                    <Image src={googleRating} alt="Google Rating" width={60} height={60} />
                    <p>4.7+ GOOGLE RATING</p>
                  </div>
                  <div className="highlight-card">
                    <Image src={ontime} alt="On Time Completion" width={60} height={60} />
                    <p>ON TIME COMPLETION</p>
                  </div>
                  <div className="highlight-card">
                    <Image src={Gurantee} alt="100% Full Fill Guarantee" width={60} height={60} />
                    <p>100% FULL FILL GUARANTEE</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <ProductGrid
            data={catalogueData.slice(isThemePage ? 0 : 32)}
            onCardClick={(item) => handleViewDetails(subCategory, catValue, item)}
            catValue={catValue}
          />
           <HighPriceProduct
 data={highPriceProducts.slice(6, 7)}
  onCardClick={(item) => handleViewDetails(subCategory, catValue, item)}
/>

          <div className="category-content">
            {Array.isArray(currentCategoryContent) && currentCategoryContent.length > 0 && (
              <>
                {currentCategoryContent
                  .slice(0, showAll ? currentCategoryContent.length : 2)
                  .map((item, index) => (
                    <div key={index} className="category-item">
                      <h1>{item.title}</h1>
                      <div
                        className="item-content"
                        dangerouslySetInnerHTML={{ __html: item.htmlContent }}
                      />
                    </div>
                  ))}
                {currentCategoryContent.length > 2 && (
                  <button onClick={toggleShowAll} className="toggle-btn">
                    {showAll ? 'See Less' : 'See More'}
                  </button>
                )}
              </>
            )}
          </div>
      
        </>
      )}
    </div>
  );


}



export default DecorationCatPage;
