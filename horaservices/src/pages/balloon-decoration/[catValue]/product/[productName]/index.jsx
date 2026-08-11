"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import checkImage from "../../../../../assets/tick.svg";
import "./Decorproduct.css"
import {
  getDecorationProductOrganizationSchema,
  getProductFAQSchemaProductDetails,
} from "../../../../../utils/schema";

import {
  filterSimilarProducts,
  filterLevelUpProducts,
  getMappedCatValue
} from "../../../../../utils/similarProductUtils";
import "../../../../../css/decoration.css";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../../../../../assets/new_logo_light.png";
import {
  BASE_URL,
  GET_DECORATION_BY_NAME,
  GET_DECORATION_CAT_ID,
  GET_ADDON_BY_ID,
  COMPRESSED_WEBP_IMG_URL,
} from "@/utils/apiconstants";
import FAQSection from "@/components/FAQSection";
import faqData from "../../../../../utils/faqData.json";
import Tabs from "../../../../../components/Tabs";
import addOnProductsData from "../../../../../utils/addOnProduct.json";
import HowitWork from "../../../../../assets/howitwork.jpg"
import { useParams } from "next/navigation";
import Brand from "../../../../../assets/Brand.png"

import { PremiumData } from "@/utils/DecorationData";
import CategoryTabs from "../../../../../components/CategoryTabs/index.jsx";
import { decCat } from "@/utils/decorationCategories";
import "../../../../../components/CategoryTabs/CategoryTabs.css"
import { themeFilters } from "@/utils/themeFilters";
import { allReviewsData } from "@/utils/ReviewsData";
import AddonModal from "@/components/AddonModal";
import AdditionalServices from "@/components/AdditionalServices";
import ShareIcon from "@/assets/shareIcon.svg";
import BannerImage from "../../../../../assets/customised.jpg";
import HappyCustomerIMG from "../../../../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../../../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../../../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../../../../assets/TpBrandsIMG.png";
import BrandBanner from "@/components/BrandBanner";
import SimilarDecorationSlider from "@/components/SimilarDecorationSlider";
import ReviewSlider from "@/components/ReviewSection";
import VideoTestimonial from "@/components/VideoTestimonial";
import VideoClint from "@/assets/ourclientvideo.mp4"
import pencil from "@/assets/pencil.svg";
import AddOnsList from "@/components/AddOnsList";
import fallbackImg from "@/assets/fallback-image.png";
import { fetchWithError } from "@/utils/fetchWithError";
import axiosApi from "@/utils/axiosApi";
import MakeItYoursBanner from "@/components/MakeItYoursBanner";
import SimiliarThemes from "@/assets/SimilarThemes.svg";
import StarIcon from "@/assets/Staricon.svg";
import fireIcon from "@/assets/fireIcon.svg";
import hearticon from "@/assets/hearticon.svg";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import { reviewsData } from "@/utils/poselinkreviews";

import ActionButtons from "@/components/Actionbuttons";
import WhyHoraSection from "@/components/WhyHoraSection";
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
          style={{
            width: "80%",
            height: "300px",
            backgroundColor: "#f0f0f0",
            margin: "0 auto",
            position: "relative",
          }}
        />

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
  const pathname = usePathname(); // Gives you /balloon-decoration/KidsBirthday
  const [allProducts, setAllProducts] = useState([]);
const [similarByTheme, setSimilarByTheme] = useState([]);
const [levelUp1000, setLevelUp1000] = useState([]);
const [levelUp2000, setLevelUp2000] = useState([]);
  const [addonIds, setAddonIds] = useState([]);
  const [addonData, setAddonData] = useState([]);


  const router = useRouter();
  const params = useParams();
  const customizationRef = useRef(null);
  const similarRef = useRef(null);
  const addonRef = useRef(null);
  const altTagCatValue = catValue.replace(/-/g, " ");
  const hasCityPageParam = city ? true : false;
  const cityName = params?.city;
  const reviewsRef    = useRef(null);
  const brandItems = [
    { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+HAPPY ", sub: "CUSTOMERS" },
    { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
    { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
    { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
  ];
useEffect(() => {
    if (router.isReady) {
      const { subCategory, catValue: urlCatValue, productName } = router.query;

      setSubCategory(subCategory || "");
      setCatValue(urlCatValue || "");
      setSendCategoryId(urlCatValue || "");

  if (productName) {
  const formattedProduct = productName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  setApiProduct(formattedProduct);
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
    const tryFetch = async (name) => {
      const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${encodeURIComponent(
        name
      )}`;

      const response = await axiosApi.get(url);

      if (response?.data?.error) return null;

      return response?.data?.data?.[0] || null;
    };

    // 1️⃣ Pehle exact name try karo
    let fetchedProduct = await tryFetch(apiProduct);

    // 2️⃣ Agar nahi mila aur "And" present hai tab "&" try karo
    if (!fetchedProduct && /\bAnd\b/i.test(apiProduct)) {
      const withAmpersand = apiProduct.replace(/\bAnd\b/gi, "&");
      fetchedProduct = await tryFetch(withAmpersand);
    }

    if (!fetchedProduct) {
      console.warn("Product not found:", apiProduct);
      setLoading(false);
      return;
    }

    setProduct(fetchedProduct);
    setIsFetched(true);

    if (fetchedProduct?.price) {
      setDiscountInfo(getDiscountedPrice(fetchedProduct.price));
    }
    setAddonIds(fetchedProduct?.addons)

    setLoading(false);
  } catch (error) {
    console.error("Error fetching:", error);
    setLoading(false);
  }
};
useEffect(() => {
  if (!router.isReady) return;

  const { subCategory, catValue: urlCatValue, productName } = router.query;

  // Category slug
  if (urlCatValue) {
    setCatValue(urlCatValue);

    const mappedCat = getMappedCatValue(urlCatValue);
    setSendCategoryId(mappedCat);
  }

  // Sub category
  if (subCategory) {
    setSubCategory(subCategory);
  }

  // Product name
if (productName) {
  const formattedProduct = productName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  setApiProduct(formattedProduct);
}

}, [router.isReady]);

  useEffect(() => {
    if (product?.categoryId) {
      getCategoryProducts(product.categoryId);

    } else if (catValue) {
      getSubCatId(catValue);
    }
  }, [product, catValue]);


 useEffect(() => {
  if (passCategoryId) {
    getCategoryProducts(passCategoryId);
  }
}, [passCategoryId]);



const getCategoryProducts = async (categoryId) => {
  try {
    const response = await axiosApi.get(
      `${BASE_URL}/api/Decoration/searchByTag/v2/${categoryId}?page=1&priceFilter=all&sortBy=asc&theme=all&limit=500`
    );

    setAllProducts(response.data.data || []);

  } catch (error) {
    console.error("Error fetching category products:", error.message);
  }
};


useEffect(() => {

  if (product && allProducts.length > 0) {

    const similar = filterSimilarProducts(
      product,
      allProducts,
      themeFilters
    );

    setSimilarByTheme(similar);

  }

}, [product, allProducts]);
 useEffect(() => {
    if (!router.isReady || !router.query.catValue) return;

    const rawCatValue = router.query.catValue;

    const mappedCat = getMappedCatValue(rawCatValue);  // ✅ Your map function

    setCatValue(rawCatValue);      // For showing on UI — can be slug like 'birthday-decoration'
    setSendCategoryId(mappedCat);  // For API calls — mapped to your DB slug

  }, [router.isReady, router.query.catValue]);

useEffect(() => {

  if (product?.price && allProducts.length > 0) {

    const { level1, level2 } = filterLevelUpProducts(
      product.price,
      allProducts,
      product._id
    );

    setLevelUp1000(level1);
    setLevelUp2000(level2);

  }

}, [product, allProducts]);


  useEffect(() => {
    if (sendCategoryId) {
      getSubCatId(sendCategoryId);
    }
  }, [sendCategoryId]);

  const getSubCatId = async (catSlug) => {
    try {
      const response = await axiosApi.get(`${BASE_URL}${GET_DECORATION_CAT_ID}${catSlug}`);
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

// naya useEffect: jab product load ho jaye, saved addons restore karo
useEffect(() => {
  if (!product?._id) return;
  try {
    const saved = sessionStorage.getItem(`addons_${product._id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedAddOnProduct(parsed.selectedAddOnProduct || []);
      setItemQuantities(parsed.itemQuantities || {});
    }
  } catch (e) {
    console.error("Error restoring addons:", e);
  }
}, [product?._id]);

// jab bhi addons change ho, save karo
useEffect(() => {
  if (!product?._id) return;
  try {
    sessionStorage.setItem(
      `addons_${product._id}`,
      JSON.stringify({ selectedAddOnProduct, itemQuantities })
    );
  } catch (e) {
    console.error("Error saving addons:", e);
  }
}, [selectedAddOnProduct, itemQuantities, product?._id]);

  // 6️⃣ Category Navigation Click (Same as before)
  const openCatItems = (item) => {
    const catSlug = item.catSlug || getCatSlugFromValue(item.catValue);

    let path = "";

    if (city && locality) {
      path = `/${city.toLowerCase()}/${locality.toLowerCase()}/balloon-decoration/${catSlug}`;
    } else if (city) {
      path = `/${city.toLowerCase()}/balloon-decoration/${catSlug}`;
    } else {
      path = `/balloon-decoration/${catSlug}`;
    }

    // ✅ theme query preserve
    if (item.value) {
      path += `?theme=${encodeURIComponent(item.value)}`;
    }

    router.push(path);
  };


  const handleCustomise = (type, cityName) => {
    const messages = {
      "kids-birthday-decoration": "Hi, I want to customize a kids birthday decoration design, can you help me",
      "birthday-decoration": "Hi, I want to customize a birthday decoration design, can you help me",
      "anniversary-decoration": "Hi, I want to customize an anniversary decoration design, can you help me",
      "baby-shower-decoration": "Hi, I want to customize a baby shower decoration design, can you help me",
      "welcome-baby-decoration": "Hi, I want to customize a baby welcome decoration design, can you help me",
      "first-night-decoration": "Hi, I want to customize a first night decoration design, can you help me",
      "premium-decoration": "Hi, I want to customize a premium decoration design, can you help me",
      "haldi-mehendi-decoration": "Hi, I want to customize a haldi & mehendi decoration design, can you help me",
      "wedding-decoration": "Hi, I want to customize a wedding decoration design, can you help me",
      "bachelorette-decoration": "Hi, I want to customize a bachelorette decoration design, can you help me"
    };

    const phoneNumber = "917338584828";

    let message = messages[type] || "Hi, I want to customize a decoration design, can you help me";

    if (cityName) {
      message += ` for ${cityName}!`;
    } else {
      message += "!";
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Customization_WhatsApp_Button",
      eventCategory: "Product Page",
      eventAction: "WhatsApp Click",
      eventLabel: "Customization WhatsApp Button"
    });

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
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

const generateSlug = (name) => {
  return name
    ?.toLowerCase()
    .trim()
    .replace(/&/g, "and")        // ← yeh add karo & → and
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
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
          slug: product.slug || generateSlug(product.name),
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

  
  const handleShare = () => {
    const cleanUrl = window.location.origin + window.location.pathname;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: cleanUrl,
      });
    } else {
      navigator.clipboard.writeText(cleanUrl);
      alert("Link copied!");
    }
  };
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
 
    return (
   <div className="inclusion-sections">
  <div className="inclusion-heading">Inclusions</div>

  <ul className="inclusion-list">
    {inclusionItems.map((item, index) => (
      <li className="inclusionstyle" key={index}>
        <Image
          src={checkImage}
          alt="check"
          className="inclusion-check"
        />

        <span className="inclusion-text">
          {item.trim()}
        </span>
      </li>
    ))}
  </ul>
</div>
    );
  };

  useEffect(() => {
    if (!addonIds || addonIds.length === 0) return; // wait until addonIds is available

    const getAddons = async () => {
      try {
        const query = new URLSearchParams();
        addonIds.forEach(id => {
          if (id) query.append("ids", id);
        });

        if ([...query].length === 0) return; // no valid IDs

        const url = `${BASE_URL}${GET_ADDON_BY_ID}?${query.toString()}`;
        const response = await fetchWithError(url);
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.message || "Failed to fetch addons");
        }

        setAddonData(data.data || []);
      } catch (error) {
        console.error("Error fetching addons:", error);
      }
    };

    getAddons();
  }, [addonIds]);

 const kidsCategories = ["kids-birthday-decoration", "kidsbirthday"];
  if (loading) {
    return <SkeletonLoader />; // Show skeleton loader while loading
  }

  return (
    <div className="App" style={{ backgroundColor: "white" }}>
      <Head>
  <title>
    {locality && cityName
      ? `${product?.name} | ${catValue.replace(/-/g, " ")} in ${locality}, ${cityName}`
      : cityName
      ? `${product?.name} | ${catValue.replace(/-/g, " ")} in ${cityName}`
      : `${product?.name} | ${catValue.replace(/-/g, " ")}`}
  </title>

  <meta
    name="description"
    content={
      locality && cityName
        ? `${product?.name} from Hora Services – Stunning ${catValue.replace(/-/g, " ")} decoration starting at just ₹999 in ${locality}, ${cityName}. Perfect for birthdays, anniversaries, baby showers & more!`
        : cityName
        ? `${product?.name} from Hora Services – Stunning ${catValue.replace(/-/g, " ")} decoration starting at just ₹999 in ${cityName}. Perfect for birthdays, anniversaries, baby showers & more!`
        : `${product?.name} from Hora Services – Beautiful ${catValue.replace(/-/g, " ")} decoration starting at just ₹999. Book for birthdays, anniversaries, weddings & more!`
    }
  />

  <meta
    name="keywords"
    content={
      locality && cityName
        ? `${product?.name}, ${catValue.replace(/-/g, " ")} in ${locality} ${cityName}, balloon decoration in ${locality} ${cityName}, ${product?.name} decoration price`
        : cityName
        ? `${product?.name}, ${catValue.replace(/-/g, " ")} in ${cityName}, balloon decoration in ${cityName}, ${product?.name} decoration price`
        : `${product?.name}, ${catValue.replace(/-/g, " ")}, balloon decoration, ${product?.name} decoration price`
    }
  />

  <meta
    property="og:title"
    content={
      locality && cityName
        ? `${product?.name} | ${catValue.replace(/-/g, " ")} in ${locality}, ${cityName} by Hora Services`
        : cityName
        ? `${product?.name} | ${catValue.replace(/-/g, " ")} in ${cityName} by Hora Services`
        : `${product?.name} | ${catValue.replace(/-/g, " ")} by Hora Services`
    }
  />
  <meta
    property="og:description"
    content={
      locality && cityName
        ? `Book ${product?.name} decoration in ${locality}, ${cityName} by Hora Services. Explore ${catValue.replace(/-/g, " ")} designs for birthdays, anniversaries, baby showers & more.`
        : `Book ${product?.name} decoration by Hora Services. Explore ${catValue.replace(/-/g, " ")} designs for birthdays, anniversaries, baby showers & more.`
    }
  />
  <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
  <meta property="og:image:alt" content={`${product?.name}, ${catValue.replace(/-/g, " ")} decoration`} />

  <script type="application/ld+json">{scriptTag}</script>
  <script type="application/ld+json">{faqScriptTag}</script>

  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />
  <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />

  <meta
    property="og:url"
    content={
      locality && cityName
        ? `https://horaservices.com/${cityName}/${locality}/balloon-decoration/${catValue}/product/${product?.name?.replace(/\s+/g, "-")}`
        : cityName
        ? `https://horaservices.com/${cityName}/balloon-decoration/${catValue}/product/${product?.name?.replace(/\s+/g, "-")}`
        : `https://horaservices.com/balloon-decoration/${catValue}/product/${product?.name?.replace(/\s+/g, "-")}`
    }
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

            <div>
              <Image
  src={
    product?.featured_images?.[0]?.fileName
      ? `${COMPRESSED_WEBP_IMG_URL}${product.featured_images[0].fileName.split(".")[0]}.webp`
      : fallbackImg
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
                    alt="Hora Services"
                    className="hora-watermark-image"
                  />
                </span>
              </div>
            </div>




          </div>
          <div
            className="decDetailsRight"
          >
         <div
              style={{
                padding: "clamp(8px, 2.5vw, 10px) clamp(8px, 2.5vw, 10px) 0"
              }}
            >
              <div className="breadcrumb-row">
                <h2 className="breadcrumb-text">
                  <a className="breadcrumb-link" href="/">
                    Home
                  </a>
                  {" > "}
                  <a
                    className="breadcrumb-link"
                    href={`/balloon-decoration/${catValue}`}
                  >
                    {catValue.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </a>
                  {" > "}
                </h2>
              </div>

              <h1 className="product-title">
                {product.name}
              </h1>

             
              <div className="price-share-row">
                <div className="pro-details-price">
                  <p className="product-price">
                    ₹ {product.price}
                  </p>
                  <p className="product-old-price">
                    ₹ {Math.floor(discountInfo?.discountedPrice)}
                  </p>
                  <div className="product-discount">
                    ₹ {Math.floor(discountInfo?.discountDifference || 0)} off
                  </div>
                </div>
                <div className="share-btn" onClick={handleShare}>
                  <Image
                    src={ShareIcon}
                    alt="share"
                    className="share-icon-img"
                  />
                </div>
              </div>

              {/* 🎨 Two action buttons row - Customize Design + View Similar */}
        <ActionButtons
  product={product}
  catValue={catValue}
  cityName={cityName}
  similarRef={similarRef}
  handleCustomise={handleCustomise}
/>
              <div className='addon-container' ref={customizationRef}>
                <AddOnsList
                  selectedAddOnProduct={selectedAddOnProduct}
                  itemQuantities={itemQuantities}
                  showAddOnmodal={showAddOnmodal}
                  pencil={pencil}
                />
              </div>

            </div>
            <div
              style={{
                padding: "0px 10px;",
              }}
            >
              {getItemInclusion(product.inclusion)}


<MakeItYoursBanner/>
            </div>


           <div ref={addonRef}>
            <AddonModal
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              addOnProducts={addonData}
              itemQuantities={itemQuantities}
              onAdd={handleAddToCartAndScrollBack}
              onRemove={handleRemoveFromCart}
            />
            </div>
          
            <div ref={similarRef}>
              <SimilarDecorationSlider
                title="Similar Decorations"
                data={similarByTheme}  
                showDiscount={true}
                imageSize={{ width: 120, height: 120 }}
                city={city}
                hasCityPageParam={hasCityPageParam}
                locality={locality}
                catValue={router.query.catValue} 
                  icon={StarIcon}
                  sparkleIcon={SimiliarThemes}
                   
              />
            </div>
          

{kidsCategories.includes(catValue?.toLowerCase()) && (
              
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
                  catValue="KidsBirthday"
                  heading="Other Popular Themes"
                  hasBg={true}
                  icon={StarIcon}
                  fireIcon={fireIcon}
                />
              </div>
            )}

            {levelUp1000.length > 0 && (
              <SimilarDecorationSlider
                title="You May Also Like This"
                data={levelUp1000}
                showDiscount={true}
                city={city}
                hasCityPageParam={hasCityPageParam}
                locality={locality}
                catValue={router.query.catValue}   // 🔑 SLUG ONLY
                 icon={StarIcon}
                  sparkleIcon={hearticon}
                   
              />
            )}

            {levelUp2000.length > 0 && (
              <SimilarDecorationSlider
                data={levelUp2000}
                showDiscount={true}
                city={city}
                hasCityPageParam={hasCityPageParam}
                locality={locality}
                catValue={router.query.catValue}   // 🔑 SLUG ONLY
              
              />
            )}

 
               <WhyHoraSection/>
  
          <div ref={reviewsRef}>
        <GoogleReviewsCard reviews={reviewsData} />
      </div>
            <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />
  <VideoTestimonial videoSrc={VideoClint} />

              <div className="decorke-celebrate-banner">
              <Image
                src={HowitWork}
                alt="Customize Your Celebration"
                className="decorke-banner-img"
              />
            </div>
            <AdditionalServices />

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



export default DecorationCatDetails;