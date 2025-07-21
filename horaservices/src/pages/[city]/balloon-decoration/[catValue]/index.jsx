import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM, API_SUCCESS_CODE } from '../../../../utils/apiconstants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Head from 'next/head';

import { getDecorationCatOrganizationSchema } from "../../../../utils/schema";
import '../../../../css/decoration.css';
import { setState } from '../../../../actions/action';
import { useDispatch } from 'react-redux';
import DecorationCatDescriptionData from "@/utils/decorationCatDescritionData";
import { useRouter } from "next/router";
import DecorationCatPage from "@/pages/balloon-decoration/[catValue]";


const DecorationCatCITYPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
    // let { city } = useParams();
    const [city, setCity] = useState('');
  const [catValue, setCatValue] = useState('');
  useEffect(() => {
    if (router.isReady) {
      const { catValue: queryCatValue, city: queryCity } = router.query;

      if (queryCatValue) {
        setCatValue(queryCatValue);
        //alert(`catValue: ${queryCatValue}`);
      }

      if (queryCity) {
        setCity(queryCity);
        ///alert(`city: ${queryCity}`);
      }
    }
    else {
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
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + subCategory);
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
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ITEM + catId);
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

 
  const PageTitle = (e) =>{
    if(catValue === "kids-birthday-decoration"){
      return `Kids Birthday Balloon Decoration in ${city} by Professionals Decorators, Starting at ₹1199`
    }
    else if(catValue === "birthday-decoration"){
      return `Birthday Balloon Decoration ${city} at Home by Professionals  Decorators, Starting at ₹1199`;
    }
    else if(catValue === "anniversary-decoration"){
      return `Anniversary Decorations in ${city} with Balloon & Rose Petals, Starting at ₹1199`;
    }
    else if(catValue === "first-night-decoration"){
      return `First Night Decorations in ${city} with Balloon & Rose Petals, Starting at ₹1199`;
    }
    else if(catValue === "baby-shower-decoration") {
      return `Baby Shower in ${city} with Latest Designs by Professionals  Decorators Starting at ₹1199`;
    }
    else if (catValue === "welcome-baby-decoration"){
      return `Baby Welcome Decoration in ${city} at home by Professionals  Decorators, Starting at ₹1199`;
    }
    else if (catValue === "haldi-mehendi-decoration"){
      return `Haldi Decoration in ${city} with Latest Designs starting at ₹3000`
    }
    else{
     return(`Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings in ${city} – Starting at ₹1199`)
    }
  }

  const getPageMetaDescription = () =>{
    if(catValue === "kids-birthday-decoration"){
      return "At Hora, 🎉Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠, under the sea 🌊, Baby Boss 👔, Barbie 💖, and cars 🚗. Explore detailed pricing and inclusions, and let our professional team bring your chosen design to life. Book your perfect party decor today! 🎈✨"
    }
    else if(catValue === "birthday-decoration"){
      return "At Hora, 🎈 Explore our wide range of balloon and flower decorations for birthday parties, featuring ring, sequin, wall, and room designs. Discover pricing and inclusions for every balloon color and variety. Customise your celebration and make it unforgettable with our stunning decor. Book your perfect party setup today! 🎉🌟";
    }
    else if(catValue === "anniversary-decoration"){
      return "🎉 Explore top-notch anniversary decoration designs and book directly from our website 💖. Find elegant and customizable decor options for your special event. Browse our selection to choose the perfect theme and make your anniversary memorable with seamless online booking. ✨"
    }
    else if(catValue === "first-night-decoration"){
      return "🌟 Explore our selection of elegant decoration designs for your first night event 💖. Choose from a variety of styles and themes, and book your perfect decor directly through our website. Make your special night unforgettable with seamless online booking and beautiful, personalised decorations. ✨"
    }
    else if (catValue === "haldi-mehendi-decoration"){
      return "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups, featuring traditional elements, colorful floral arrangements, and custom designs to make your event unforgettable. 🌸💛"
    }
    else{
     return("Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199")
    }
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
    <div style={{ backgroundColor: "#EDEDED" }} className="decCatPage">
    <Head>
      <title>{PageTitle(catValue)}</title>
      <meta name="description" content={getPageMetaDescription()} />
      <meta name="keywords" content="Balloon and Flower Decoration @999" />
      <meta property="og:title" content={PageTitle(catValue)} />
      <meta property="og:description" content={getPageMetaDescription()} />
      <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
      <script type="application/ld+json">{scriptTag}</script>
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />
      <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
      <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${catValue}`} />
      <meta property="og:type" content="website" />
    </Head>
    <DecorationCatPage/>
   </div>)}

export default DecorationCatCITYPage;