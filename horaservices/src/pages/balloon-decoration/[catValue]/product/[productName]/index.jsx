import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { MessageCircle, Plus, ArrowDown, ArrowUp } from "lucide-react";
import buynowImage from "../../../../../assets/experts.png";
import buynowImage1 from "../../../../../assets/secured.png";
import buynowImage2 from "../../../../../assets/service.png";
import checkImage from "../../../../../assets/tick.jpeg";
import "./Decorproduct.css"
import {
  getDecorationProductOrganizationSchema,
  getProductFAQSchemaProductDetails,
} from "../../../../../utils/schema";
import "../../../../../css/decoration.css";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../../../../../assets/new_logo_light.png";
import {
  BASE_URL,
  GET_DECORATION_BY_NAME,
  GET_DECORATION_CAT_ID,
} from "@/utils/apiconstants";
import axios from "axios";
import FAQSection from "@/components/FAQSection";
import faqData from "../../../../../utils/FaqData.json";
import Tabs from "../../../../../components/Tabs";
import addOnProductsData from "../../../../../utils/addOnProduct.json";
import CustomizeDecorBanner from "../../../../../assets/CustomizeDecorBanner.png"
import HowitWork from "../../../../../assets/howitwork.jpg"
import { useParams } from "next/navigation";
import Brand from "../../../../../assets/Brand.png"
import ExpertsDecoration from "../../../../../assets/ExpertsDecoration.png";
import SecureTransactions from "../../../../../assets/SecureTransactions.png";
import ServiceGuarantee from "../../../../../assets/ServiceGuarantee.png";
import { PremiumData } from "@/utils/DecorationData";
import CategoryTabs from "../../../../../components/CategoryTabs.jsx";
import { decCat } from "@/utils/decorationCategories";
import "../../../../../components/CategoryTabs.jsx/CategoryTabs.css"
import { themeFilters } from "@/utils/themeFilters";
import Candle from "../../../../../assets/candle.png";
import HappyBithday from "../../../../../assets/HappyBirthDay.png"
import Ballons from "../../../../../assets/Ballons.png"
import { ballonReview } from "@/utils/ReviewsData";
import AddonModal from "@/components/AddonModal";

import AdditionalServices from "@/components/AdditionalServices";

import BannerImage from "../../../../../assets/customised.webp";
import HappyCustomerIMG from "../../../../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../../../../assets/GoogleRatingIMG.png";
import SocialMediaIMG from "../../../../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../../../../assets/TpBrandsIMG.png";
import BrandBanner from "@/components/BrandBanner";
import UniversalDecorSlider from "@/components/UniversalDecorSlider";
import ReviewSlider from "@/components/ReviewSection";
import VideoTestimonial from "@/components/VideoTestimonial";
import VideoClint from "@/assets/ourclientvideo.mp4"

const SkeletonLoader = () => {
  return (
    <div
      className="skeleton-loader"
      style={{ maxWidth: "1200px", margin: "0 auto", backgroundColor: "white" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "20px",
          paddingBottom: "20px",
          position: "relative",
        }}
        className="decDetails"
      >
        <div
          style={{ width: "50%", textAlign: "center" }}
          className="decDetailsLeft"
        >
          <div
            style={{
              width: "80%",
              height: "300px",
              backgroundColor: "#f0f0f0",
              margin: "0 auto",
              position: "relative",
            }}
          />
        </div>
        <div
          style={{ width: "50%", paddingLeft: "20px", paddingRight: "50px" }}
          className="decDetailsRight"
        >
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "30px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "40%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "80%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "30px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "100%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "100%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
        </div>
      </div>
    </div>
  );
};

function DecorationCatDetails({ city, locality }) {
  const [selCat, setSelCat] = useState("");
  const [orderType, setOrderType] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const [product, setProduct] = useState("");
  const [apiProduct, setApiProduct] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [subCategory, setSubCategory] = useState("");
  const [catValue, setCatValue] = useState("");
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [loadingSP, setLoadingSP] = useState(false);
  const [sendCategoryId, setSendCategoryId] = useState("");
  const [passCategoryId, setPassCategoryId] = useState("");
  const [openProductUrl, setOpenProductUrl] = useState("");
  const [extraProduct, setExtraProduct] = useState([]);
  const pathname = usePathname(); // Gives you /balloon-decoration/KidsBirthday
  const searchParams = useSearchParams();
const [similarByPrice, setSimilarByPrice] = useState([]);
const [similarByName, setSimilarByName] = useState([]);

  const router = useRouter();
  const params = useParams();
  const customizationRef = useRef(null);
  const addonRef = useRef(null);
  const altTagCatValue = catValue.replace(/-/g, " ");
  const hasCityPageParam = city ? true : false;

  const brandItems = [
    { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
    { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
    { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
    { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
  ];
  console.log("Slider Data =>", similar);
 // 1️⃣ Set CatValue if coming from params (optional case)
useEffect(() => {
  if (params?.catValue) {
    setCatValue(params.catValue);
  }
}, [params]);

// 2️⃣ Get URL params when router is ready

const filterSimilarByPrice = (price, productsArray = [], excludeId) => {
  if (!price || !productsArray.length) return;

  const min = Math.floor(price / 1000) * 1000;
  const max = Math.ceil(price / 1000) * 1000 + 1000;

  const filtered = productsArray.filter(item => {
    const itemPrice = Number(item.price);
    return (
      itemPrice >= min &&
      itemPrice <= max &&
      item._id !== excludeId
    );
  });

  console.log(`Filtered by Rounded Range ${min} - ${max}:`, filtered);
  setSimilarByPrice(filtered);
};


const filterSimilarByName = (product, productsArray = [], excludeId) => {
  if (!product?.name || !productsArray.length) return;

  const firstWord = product.name.toLowerCase().split(/\s+/)[0];  // ✅ सिर्फ पहला word

  const filtered = productsArray.filter(item => {
    if (item._id === excludeId) return false;

    const itemName = item.name?.toLowerCase() || "";

    return itemName.includes(firstWord);
  });

  console.log("Filtered by Name =>", filtered);
  setSimilarByName(filtered);
};

useEffect(() => {
  if (router.isReady) {
    const { subCategory, catValue: urlCatValue, productName } = router.query;

    setSubCategory(subCategory || "");
    setCatValue(urlCatValue || "");
    setSendCategoryId(urlCatValue || "");   // ✅ Send for SubCatId

    if (productName) {
      const formattedProduct = productName.replace(/-/g, " ");
      setApiProduct(formattedProduct);  // ✅ Send for Product Fetch
    }
  }
}, [router.isReady, router.query]);


useEffect(() => {
  if (apiProduct) {
    fetchDecorationDetails();
  }
}, [apiProduct]);

const fetchDecorationDetails = async () => {
  try {
    const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${apiProduct}`;
    const response = await axios.get(url);
    const fetchedProduct = response.data.data[0];
    setProduct(fetchedProduct);
    setIsFetched(true);

    if (fetchedProduct?.price) {
      const discountDetails = getDiscountedPrice(fetchedProduct.price);
      setDiscountInfo(discountDetails);
    }

    setLoading(false);
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    setLoading(false);
  }
};



useEffect(() => {
  if (router.isReady && router.query.catValue) {
    const rawCatValue = router.query.catValue;
    setCatValue(rawCatValue); // For UI
    setSendCategoryId(rawCatValue); // For API calls
  }
}, [router.isReady, router.query.catValue]);


useEffect(() => {
  if (!router.isReady || !router.query.catValue) return;

  const rawCatValue = router.query.catValue;
  
  const mappedCat = getMappedCatValue(rawCatValue);  // ✅ Your map function
  
  setCatValue(rawCatValue);      // For showing on UI — can be slug like 'birthday-decoration'
  setSendCategoryId(mappedCat);  // For API calls — mapped to your DB slug

}, [router.isReady, router.query.catValue]);

useEffect(() => {
  if (product?.categoryId) {
    getCategoryProducts(product.categoryId);
    
  } else if (catValue) {
    getSubCatId(catValue);   
  }
}, [product, catValue]);

useEffect(() => {
  if (product?.price && similar.length > 0) {
    filterSimilarByPrice(product.price, similar, product._id);
       filterSimilarByName(product, similar, product._id);
  }
}, [product, similar]);

useEffect(() => {
  if (passCategoryId) {
    getCategoryProducts(passCategoryId);
  }
}, [passCategoryId]);


const getCategoryProducts = async (categoryId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/Decoration/searchByTag/v2/${categoryId}?page=1&priceFilter=all&sortBy=asc&theme=all&limit=500`
    );
    setSimilar(response.data.data || []);
  } catch (error) {
    console.error("Error fetching category products:", error.message);
  }
};

const getMappedCatValue = (slug) => {
  const map = {
    "birthday-decoration": "Birthday",
    "anniversary-decoration": "Anniversary",
    "haldi-mehendi-decoration": "Haldi-Mehandi",
    "first-night-decoration": "FirstNight",
    "baby-shower-decoration": "BabyShower",
    "welcome-baby-decoration": "WelcomeBaby",
    "premium-decoration": "PremiumDecoration",
    "bachelorette-decoration": "bachelorette",
  };
  return map[slug] || slug;  // If not mapped, return the same slug
};



useEffect(() => {
  if (sendCategoryId) {
    getSubCatId(sendCategoryId);
  }
}, [sendCategoryId]);

const getSubCatId = async (catSlug) => {
  try {
    const response = await axios.get(`${BASE_URL}${GET_DECORATION_CAT_ID}${catSlug}`);
    const categoryData = response.data.data;
    if (categoryData) {
      setPassCategoryId(categoryData._id);
      setOpenProductUrl(categoryData.name);
    } else {
      console.warn(`Sub Category Not Found for: ${catSlug}`);
    }
  } catch (error) {
    console.error("Error getting SubCat ID:", error.message);
  }
};



// 6️⃣ Category Navigation Click (Same as before)
const openCatItems = (item) => {
  const path = hasCityPageParam
    ? `/${city.toLowerCase()}/balloon-decoration/${item.catValue}`
    : `/balloon-decoration/${item.catValue}`;
  router.push(path);
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

    const discountedPrice =
      parseFloat(price) * (1 + parseFloat(discount) / 100); // Calculate the discounted price
    const discountDifference = Math.abs(parseFloat(price) - discountedPrice); // Get the absolute difference

    return { discount, discountedPrice, discountDifference }; // Return discount percentage, discounted price, and discount difference
  };

  const schemaOrg = getDecorationProductOrganizationSchema(product);
  const scriptTag = JSON.stringify(schemaOrg);
  const faqSchema = getProductFAQSchemaProductDetails(product);
  const faqScriptTag = JSON.stringify(faqSchema);
  const [isClient, setIsClient] = useState(false);

  const showAddOnmodal = () => {
    setIsModalOpen((prev) => !prev);
    setIsArrowDown((prev) => !prev);

    setTimeout(() => {
      addonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  
  const updateTotalAmount = () => {
    let newTotalAmount = Number(product.price);
    selectedAddOnProduct.forEach((item) => {
      newTotalAmount += item.price * itemQuantities[item.title];
    });
    setTotalAmount(newTotalAmount);
  };

  useEffect(() => {
    updateTotalAmount();
  }, [selectedAddOnProduct, itemQuantities, product.price]);

  const handleAddToCart = (item) => {
    const updatedSelectedAddOnProduct = [...selectedAddOnProduct];
    const existingItemIndex = updatedSelectedAddOnProduct.findIndex(
      (addonproductItem) => addonproductItem.title === item.title
    );

    if (existingItemIndex !== -1) {
      updatedSelectedAddOnProduct[existingItemIndex].quantity += 1;
    } else {
      updatedSelectedAddOnProduct.push({ ...item, quantity: 1 });
    }

    setSelectedAddOnProduct(updatedSelectedAddOnProduct);
    setItemQuantities({
      ...itemQuantities,
      [item.title]: (itemQuantities[item.title] || 0) + 1,
    });
    updateTotalAmount();
  };

  const handleRemoveFromCart = (item) => {
    const updatedSelectedAddOnProduct = [...selectedAddOnProduct];
    const existingItemIndex = updatedSelectedAddOnProduct.findIndex(
      (addonproductItem) => addonproductItem.title === item.title
    );

    if (existingItemIndex !== -1) {
      if (updatedSelectedAddOnProduct[existingItemIndex].quantity > 1) {
        updatedSelectedAddOnProduct[existingItemIndex].quantity -= 1;
      } else {
        updatedSelectedAddOnProduct.splice(existingItemIndex, 1);
      }
    }

    const updatedQuantities = { ...itemQuantities };

    if (updatedQuantities[item.title] > 1) {
      updatedQuantities[item.title] -= 1;
    } else {
      delete updatedQuantities[item.title];
    }

    setSelectedAddOnProduct(updatedSelectedAddOnProduct);
    setItemQuantities(updatedQuantities);
    updateTotalAmount();
  };

  const calculateTotalPrice = (productPrice) => {
    let totalPrice = Number(productPrice); // Ensure productPrice is a number
    selectedAddOnProduct.forEach((item) => {
      totalPrice += item.price * itemQuantities[item.title];
    });
    return totalPrice;
  };



  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);  // You already have this function

    setIsModalOpen(false);

    setTimeout(() => {
      customizationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };


  const handleCheckout = (subCategory, product, selectedAddOnProduct) => {
    const totalPrice = calculateTotalPrice(product.price); // ✅ Calculate total

    // ✅ Fire GTM event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "book_now_click",
      product_name: product.name,
    });

    // ✅ Redirect to /checkout with query params
    router.push({
      pathname: "/checkout",
      query: {
        from: window.location.pathname,
        subCategory,
        product: JSON.stringify(product),
        orderType: "decoration",
        catValue,
        selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
        itemQuantities: JSON.stringify(itemQuantities),
        totalAmount: totalPrice,
      },
    });
  };

  function addSpaces(subCategory) {
    let result = "";
    for (let i = 0; i < subCategory?.length; i++) {
      if (i !== 0 && subCategory[i] === subCategory[i].toUpperCase()) {
        result += " ";
      }
      result += subCategory[i];
    }
    setSelCat(result);
  }

  function getSubCategory(catValue) {
    if (catValue === "birthday-decoration") {
      return "Birthday";
    } else if (catValue === "anniversary-decoration") {
      return "Anniversary";
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

  useEffect(() => {
    addSpaces(subCategory);
  }, [subCategory]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) {
      return null;
    }
    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, " "); // Replace &# sequences with space
    const statements = withoutSpecialChars.split("<div>");
    const inclusionItems = statements.flatMap((statement) =>
      statement.split("-").filter((item) => item.trim() !== "")
    );
    const inclusionList = inclusionItems.map((item, index) => (
      <li key={index} className="inclusionstyle">
        <Image
          src={checkImage}
          alt="Info"
          style={{ height: 13, width: 13, marginRight: 10 }}
        />
        {item.trim()}
      </li>
    ));
    return (
      <div>
        <div
          style={{
            fontSize: "21px",
            borderBottom: "1px solid #e7eff9",
            marginBottom: "10px",
          }}
        >
          Inclusions
        </div>
        <ul>{inclusionList}</ul>
      </div>
    );
  };

 

  if (loading) {
    return <SkeletonLoader />; // Show skeleton loader while loading
  }

  return (
    <div className="App" style={{ backgroundColor: "white" }}>
      <Head>
        <title>Balloon and Flower Decoration @999</title>
        <meta
          name="description"
          content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations"
        />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta
          property="og:title"
          content="Balloon and Flower Decoration by Professional Decorators"
        />
        <meta
          property="og:description"
          content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations"
        />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <script type="application/ld+json">{scriptTag}</script>
        <script type="application/ld+json">{faqScriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        <meta
          property="og:url"
          content={`https://horaservices.com/balloon-decoration/${catValue}/product/${product.name}`}
        />
        <meta property="og:type" content="website" />
      </Head>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          className="decDetails"
        >
          <div
            className="decDetailsLeft"
          >
            <div

              className="decDetailsImage"
            >
              <div>
                <Image
                  src={
                    product?.featured_image
                      ? `https://horaservices.com/api/uploads/compressed_webp/${product.featured_image.split(".")[0]
                      }.webp`
                      : "/default-image.webp" // fallback image
                  }
                  alt={`balloon decoration ${altTagCatValue} ${product?.name || ""} ${product?.price || ""}`}
                  style={{ width: "100%", height: "auto" }}
                  width={300}
                  height={300}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 3,
                    right: 3,
                    borderRadius: "50%",
                    padding: 10,
                  }}
                >
                  <span
                    style={{
                      color: "rgba(157, 74, 147, 0.6)",
                      fontWeight: "600",
                    }}
                  >
                    <Image
                      src={logo}
                      style={{ width: "70px", height: "80px" }}
                      className="hora-watermark-image"
                    />
                  </span>
                </div>
              </div>
            </div>



          </div>
          <div
            className="decDetailsRight"
          >
            <div
              style={{
                padding: "10px",
              }}
            >
              <h2
                style={{
                  fontSize: "13px",
                  color: "#222",
                  margin: "5px 0 5px 0",
                  fontWeight: "500",
                }}
              >
                <a
                  style={{ color: "#9252AA", textDecoration: "none" }}
                  href="/"
                >
                  Home
                </a>
                {" > "}
                <a
                  style={{ color: "#9252AA", textDecoration: "none" }}
                  href={`/balloon-decoration/${catValue}`}
                >
                  {subCategory}
                </a>

                {" > "}
                <span>{product.name}</span>
              </h2>
              <h1
                style={{
                  fontSize: "16px",
                  color: "#222",
                  fontSize: "21px",
                  fontWeight: "#222",
                }}
              >
                {product.name}
              </h1>
              <div className="pro-details-price">
                <p
                  style={{
                    fontSize: "18px",
                    color: "#9252AA",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  ₹ {product.price}
                </p>
                <p
                  style={{
                    color: "#444",
                    fontWeight: "700",
                    fontSize: 18,
                    textAlign: "left",
                    margin: "10px 0px 7px",
                    textDecoration: "line-through",
                  }}
                >
                  ₹ {Math.floor(discountInfo?.discountedPrice)}
                </p>
                <div className="decorationdiscount-details">
                  ₹ {Math.floor(discountInfo?.discountDifference || 0)} {"off"}
                </div>
              </div>

              <div className='addon-prices' ref={customizationRef}>

                <div className="photodetails-inclusions">
                  {selectedAddOnProduct.length > 0 && (
                    <>
                      <label>Customisations</label>
                      <span onClick={showAddOnmodal} style={{ marginLeft: "6px", cursor: "pointer" }}>
                        < svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg" style={{ color: "rgb(146, 82, 170)", verticalAlign: "0px" }}><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" ></path></svg>
                      </span>
                      {selectedAddOnProduct.map((item, index) => (
                        <li key={index}>
                          <div className="itemline">
                            {index + 1}. {item.title} = ₹ {item.price} x {itemQuantities[item.title]} = ₹ {item.price * itemQuantities[item.title]}

                          </div>

                        </li>
                      ))}

                    </>
                  )}
                </div>
              </div>


            </div>



            <div
              style={{
                padding: "10px",
              }}
            >
              {getItemInclusion(product.inclusion)}

              <section className="custom-banner-section">
      <Image src={BannerImage} alt="Change Something Banner" className="custom-banner-image" />
    </section>

            </div>



            <AddonModal
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              addOnProducts={addOnProductsData.addOnProducts}
              itemQuantities={itemQuantities}
              onAdd={handleAddToCartAndScrollBack}
              onRemove={handleRemoveFromCart}
            />

            <div className="decorke-why-section">
              <h2 className="decorke-why-title">Why Hora Decoration</h2>

              <div className="decorke-why-features">
                <div className="decorke-why-item">
                  <Image src={ExpertsDecoration} alt="Experts Decoration" className="decorke-why-icon" />
                  <p className="decorke-why-text">EXPERTS<br />DECORATION</p>
                </div>
                <div className="decorke-why-item">
                  <Image src={SecureTransactions} alt="Secure Transactions" className="decorke-why-icon" />
                  <p className="decorke-why-text">SECURE<br />TRANSACTIONS</p>
                </div>
                <div className="decorke-why-item">
                  <Image src={ServiceGuarantee} alt="Service Guarantee" className="decorke-why-icon" />
                  <p className="decorke-why-text">100% SERVICE<br />GUARANTEED</p>
                </div>
              </div>
            </div>
            <UniversalDecorSlider
              title="Similar Decorations"
              data={similar}   // ✅ Fetched data pass karo
              showDiscount={true}
              imageSize={{ width: 120, height: 120 }}
              city={city}
              hasCityPageParam={hasCityPageParam}
              locality={locality}
              catValue={getMappedCatValue(router.query.catValue)}  // ✅ Use your map function here
 
            />
             {catValue?.toLowerCase() === "kidsbirthday" && (
              <div className="category-tabs-outer">
                <CategoryTabs
                  data={themeFilters.map((item) => ({
                    id: item.value,
                    name: item.label,
                    image: item.image,
                    value: item.value,
                    catValue: "KidsBirthday",
                  }))}
                  onSelect={(item) => openCatItems(item, themeFilter)}
                  city={city}
                  hasCityPageParam={hasCityPageParam}
                  locality={locality}
                  variant="grid"
                  catValue="KidsBirthday"
                />
              </div>
            )}

{similarByPrice.length > 0 && (
  <UniversalDecorSlider
    title="You May Also Like"
    data={similarByPrice}
    showDiscount={true}
    city={city}
    hasCityPageParam={hasCityPageParam}
    locality={locality}
    catValue={getMappedCatValue(router.query.catValue)}
  />
)}

{similarByName.length > 0 && (
  <UniversalDecorSlider
    data={similarByName}
    showDiscount={true}
    city={city}
    hasCityPageParam={hasCityPageParam}
    locality={locality}
    catValue={getMappedCatValue(router.query.catValue)}
  />
)}

           

            <div className="decorke-celebrate-banner">
              <Image
                src={HowitWork}
                alt="Customize Your Celebration"
                className="decorke-banner-img"
              />
            </div>

            <div className="media-section">
              <h2 className="media-heading">Hora in Media</h2>
              <div className="media-logos">
                <Image src={Brand} alt="Hora Featured Media" className="media-logos-img" />
              </div>
            </div>



      <VideoTestimonial videoSrc={VideoClint} />

<ReviewSlider reviews={ballonReview} title="Balloon Decoration Reviews" />




          
            <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />
          
           
               <AdditionalServices/>

            <div className="tab-section-details-productpage">
              <FAQSection faqData={faqData} />
            </div>


          </div>
        </div>


        <div className="confirm-button-wrapper">
          <p style={{ fontWeight: "bold", marginBottom: "0px", color: "black" }}>
            Total: ₹ {calculateTotalPrice(Number(product?.price))}
          </p>
          <button
            className="confirm-button"
            onClick={() => handleCheckout(subCategory, product, selectedAddOnProduct)}
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}

function ProductCard({ item, openProductUrl }) {
  const formattedName = item.name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .replace(/-+/g, "-");

  const productUrl = `https://horaservices.com/balloon-decoration/${openProductUrl}/product/${formattedName}`;

  return (
    <a
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          width: "180px",          // ✅ Same width
          height: "270px",         // ✅ Same height
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fff",
          padding: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.2s ease",
          cursor: "pointer",
        }}
      >
        <img
          src={`https://horaservices.com/api/uploads/compressed_webp/${item?.featured_image?.split(".")[0]
            }.webp`}
          alt={item.name}
          style={{
            width: "100%",
            height: "140px",
            objectFit: "cover",
            borderRadius: "6px"
          }}
        />
        <h3
          style={{
            fontSize: "0.9rem",
            marginTop: "10px",
            marginBottom: "6px",
            height: "2.5em", // force uniform text area height
            overflow: "hidden"
          }}
        >
          {item.name}
        </h3>
        <p style={{ fontWeight: "bold", fontSize: "1rem" }}>₹{item.price}</p>
      </div>
    </a>
  );
}

const badgeStyle = (color = "#1890ff") => ({
  backgroundColor: color,
  color: "#fff",
  fontSize: "0.8rem",
  padding: "4px 12px",
  borderRadius: "20px",
  fontWeight: "bold"
});

export default DecorationCatDetails;