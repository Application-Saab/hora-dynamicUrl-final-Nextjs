import React, { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM, API_SUCCESS_CODE } from '../../../../utils/apiconstants'
import { useSelector } from 'react-redux';
import Head from 'next/head';

import { getDecorationCatOrganizationSchema } from "../../../../utils/schema";
import '../../../../css/decoration.css';
import { setState } from '../../../../actions/action';
import { useDispatch } from 'react-redux';
import DecorationCatDescriptionData from "@/utils/decorationCatDescritionData";
import { useRouter } from "next/router";
import DecorationCatPage from "@/pages/balloon-decoration/[catValue]";
import axiosApi from "@/utils/axiosApi";

// URL ke pehle segment se city slug nikalo, jaise "/hyderabad/balloon-decoration/..." -> "hyderabad"
function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

const DecorationCatCITYPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  let { locality } = router.query;

  // Yeh state hamesha ASLI browser URL se derive hoti hai — chahe
  // navigation Next.js router.push se hua ho, ya CityContext ke
  // window.history.pushState (silent URL change) se — dono cases handle honge.
  const [citySlug, setCitySlug] = useState("");
  const [catValue, setCatValue] = useState('');

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    setCitySlug(getCitySlugFromPath(window.location.pathname));
  }, []);

  // Pehla mount — SSR/hydration ke baad turant sync karo
  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

  // Jab Next.js Pages Router khud se route change kare (Link click, router.push)
  useEffect(() => {
    router.events.on("routeChangeComplete", syncCityFromUrl);
    return () => router.events.off("routeChangeComplete", syncCityFromUrl);
  }, [router.events, syncCityFromUrl]);

  // Jab CityContext silently URL change kare (city popup se select karne par)
  useEffect(() => {
    window.addEventListener("city:changed", syncCityFromUrl);
    return () => window.removeEventListener("city:changed", syncCityFromUrl);
  }, [syncCityFromUrl]);

  // Browser back/forward button
  useEffect(() => {
    window.addEventListener("popstate", syncCityFromUrl);
    return () => window.removeEventListener("popstate", syncCityFromUrl);
  }, [syncCityFromUrl]);

  const city = citySlug
    ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
    : "";

  // catValue router.query se (ya fallback me path se)
  useEffect(() => {
    if (router.isReady) {
      const { catValue: queryCatValue } = router.query;
      if (queryCatValue) {
        setCatValue(queryCatValue);
      }
    } else {
      const path = window.location.pathname; // e.g., /balloon-decoration/kids-birthday-decoration
      const parts = path.split('/'); // Split by '/'
      const dynamicValue = parts[2];

      setCatValue(dynamicValue);
    }
  }, [router.isReady, router.query]);

  const altTagCatValue = catValue.replace(/-/g, ' ');
  const [orderType, setOrderType] = useState(1);
  const hasCityPageParam = city ? true : false;
  //   const { catValue } = useParams();
  const [selCat, setSelCat] = useState("");
  const [catId, setCatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(0); // State for the discount percentage
  const [discountedPrice, setDiscountedPrice] = useState(0); // State for the discounted price
  const [discountDifference , setDiscountDifference] = useState(0)
  const [catalogueData, setCatalogueData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered container index
  //   const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState("all"); // Default: Show all
  const [themeFilter, setThemeFilter] = useState("all"); // Default: Show all
  const [showAll, setShowAll] = useState(false);
  const currentCategoryContent = DecorationCatDescriptionData[catValue] || [];
  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);
  const themeFilters = [
    { label: 'Select Theme', value: 'all' },
    { label: 'Astronaut space theme', value: 'Astronaut-space' },
    { label: 'Avengers theme', value: 'Avengers' },
    { label: 'Boss baby theme', value: 'Boss' },
    { label: 'Baby shark theme', value: 'shark' },
    { label: 'Barbie theme', value: 'Barbie' },
    { label: 'Cocomelon Theme', value: 'Cocomelon' },
    { label: 'Car Theme', value: 'car' },
    { label: 'Circus Theme', value: 'Circus' },
    { label: 'Dinosaur Theme', value: 'Dinosaur' },
    { label: 'Elsa Theme', value: 'Elsa' },
    { label: 'Flamingo Theme', value: 'Flamingo' },
    { label: 'Jungle Theme', value: 'Jungle' },
    { label: 'Kitty Theme', value: 'Kitty' },
    { label: 'Lion King', value: 'Lion' },
    { label: 'Mickey Mouse Theme', value: 'Mickey-Mouse' },
    { label: 'Mickey and Minnie Theme', value: 'Mickey-Minnie' },
    { label: 'Minecraft Theme', value: 'Minecraft' },
    { label: 'Mermaid Theme', value: 'Mermaid' },
    { label: 'Pokemon and Pikachu theme', value: 'Pikachu-Pokemon' },
    { label: 'Princess Theme', value: 'Princess' },
    { label: 'Panda Theme', value: 'Panda' },
    { label: 'Traffic Theme', value: 'Traffic' },
    { label: 'Super dogs theme', value: 'dogs' },
    { label: 'Super Hero theme', value: 'Hero' },
    { label: 'Sport Football theme', value: 'Football' },
    { label: 'Unicorn Theme', value: 'Unicorn' },
  ];
  function getSubCategory(catValue) {
    if (!catValue){
      
      const path = window.location.pathname; // e.g., /balloon-decoration/kids-birthday-decoration
      const parts = path.split('/'); // Split by '/'
      const dynamicValue = parts[2];
      return dynamicValue
    }
    if (catValue === 'birthday-decoration') {
      return 'Birthday';
    } else if (catValue === 'anniversary-decoration') {
      return 'Anniversary';
    } else {
      const parts = catValue.split('-'); // Split by hyphens
      return parts.slice(0, 2) // Take only the first two parts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
        .join(''); // Join parts together without spaces
    }
  }

  // UseSelector to get state from Redux
  // const { subCategory: stateSubCategory, imgAlt: stateImgAlt } = useSelector((state) => state.state || {});
  // Determine the value for subCategory and imgAlt
  // const subCategory = getSubCategory(catValue) || stateSubCategory  ;
  const subCategory = getSubCategory(catValue)
  // const imgAlt = stateImgAlt || 'default alt text'; // Replace with a default alt text if needed
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to generate a random rating between 4.1 to 4.8
  const getRandomRating = () => {
    return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
  };


  useEffect(() => {
    addSpaces(subCategory);
    getSubCatId(subCategory); // Fetch category ID based on the selected subcategory
    window.addEventListener('scroll', handleScroll); // Add scroll event listener

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
    };
  }, [subCategory]);

  const handleScroll = () => {
    const filterElement = document.querySelector('.filterdropdown');
    if (filterElement) {
      if (window.scrollY > 50) {
        filterElement.classList.add('sticky');
      } else {
        filterElement.classList.remove('sticky');
      }
    }
  };
  const filteredData = catalogueData.filter(item => {
    let priceCondition = true;
    let themeCondition = true;
  
    // Filter by price
    if (priceFilter === "under2000") {
      priceCondition = item.price < 2000;
    } else if (priceFilter === "2000to5000") {
      priceCondition = item.price >= 2000 && item.price <= 5000;
    } else if (priceFilter === "above5000") {
      priceCondition = item.price > 5000;
    }
  
    // Filter by theme
    if (themeFilter !== "all") {
      const formattedThemeFilter = themeFilter.toLowerCase().split('-')[0];
      const formattedItemName = item.name.toLowerCase().split('-')[0];
      themeCondition = formattedItemName.includes(formattedThemeFilter);
    }
  
    // Return true if both conditions are met
    return priceCondition && themeCondition;
  });

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };
  
  // Apply sorting
  const sortedData = filteredData.sort((a, b) => {
    if (priceFilter === 'lowToHigh') {
      return a.price - b.price;
    } else if (priceFilter === 'highToLow') {
      return b.price - a.price;
    }
    return 0; // Default sort (no sorting)
  });
  

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

  const getSubCatId = async (subCategory) => {
    try {
      const response = await axiosApi.get(BASE_URL + GET_DECORATION_CAT_ID + subCategory);
      const categoryId = response.data.data?._id;
      setCatId(categoryId);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const getDiscountedPrice = (price) => {
    let discount;

    // Determine the discount percentage based on the item price
    if (price < 3000) {
        discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
        discount = 27; // 27% discount
    } else {
        discount = 35; // 35% discount for prices above 5000
    }

    const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
    const discountDifference =   Math.abs(price - discountedPrice);;
    return { discount, discountedPrice , discountDifference }; // Return both discount percentage and discounted price
};


  const getSubCatItems = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get(BASE_URL + GET_DECORATION_CAT_ITEM + catId);
      if (response.status === API_SUCCESS_CODE) {
        const decoratedData = response.data.data.map(item => {
          const { discount, discountedPrice , discountDifference} = getDiscountedPrice(item.price); // Destructure the return value
          return {
              ...item,
              rating: getRandomRating(),
              userCount: getRandomNumber(20, 500),
              discountPercentage: discount, // Add discount percentage
              discountedPrice: discountedPrice ,// Add discounted price
              discountDifference: discountDifference
          };
      });
        setCatalogueData(decoratedData);
      }
    } catch (error) {
      console.log('Error Fetching Data:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleViewDetails = (subCategory, catValue, product) => {
    const productName = product.name.replace(/ /g, "-");
    dispatch(setState(subCategory, orderType, catValue, product));
    if (hasCityPageParam) {
      router.push(`/${city}/balloon-decoration/${catValue}/product/${productName}`);
    }
    else {
      router.push(`/balloon-decoration/${catValue}/product/${productName}`);
    }
  };

  useEffect(() => {
    if (catId) {
      getSubCatItems();
    }
  }, [catId]);

  function trimText(text) {
    if (text.length > 60) {
      return text.slice(0, 60) + '...';
    }
    return text;
  }



   // Set themeFilter based on query parameter when component mounts or query changes
   useEffect(() => {
    if (router.isReady) {
      const theme = router.query.theme || "all";
      setThemeFilter(theme);
    }
  }, [router.isReady, router.query.theme]);

   // Update URL whenever the themeFilter changes
   useEffect(() => {
    if (themeFilter !== "all") {
      router.push(
        {
          pathname: router.pathname, // Current page path
          query: { ...router.query, theme: themeFilter }, // Add or update the theme in the query
        },
        undefined,
        { shallow: true } // Prevents full page reload
      );
    }
  }, [themeFilter]);


  return (
    <div className="decCatPage">
    <DecorationCatPage city={city} locality={locality}/>
   </div>)}

export default DecorationCatCITYPage;