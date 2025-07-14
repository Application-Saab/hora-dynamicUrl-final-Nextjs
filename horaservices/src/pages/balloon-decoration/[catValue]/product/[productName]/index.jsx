import React, { useState, useEffect, useRef } from "react";
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
import ExpertsDecoration from "../../../../../assets/ExpertsDecoration.png";
import SecureTransactions from "../../../../../assets/SecureTransactions.png";
import ServiceGuarantee from "../../../../../assets/ServiceGuarantee.png";
import { PremiumData } from "@/utils/DecorationData";
import DecorSlider from "@/components/DecorSlider";
import CategoryTabs from "../../../../../components/CategoryTabs.jsx";
import { decCat } from "@/utils/decorationCategories";
import "../../../../../components/CategoryTabs.jsx/CategoryTabs.css"
import { themeFilters } from "@/utils/themeFilters";

// Skeleton Loader Component

const SkeletonLoader = () => {
  return (
    <div
      className="skeleton-loader"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
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
  const router = useRouter();
  const [product, setProduct] = useState("");
  const [apiProduct, setApiProduct] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [subCategory, setSubCategory] = useState("");
  const [catValue, setCatValue] = useState("");
  const altTagCatValue = catValue.replace(/-/g, " ");
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [loading, setLoading] = useState(true); // Add a loading state
  const customizationRef = useRef(null);
  const addonRef = useRef(null);
  const [similar, setSimilar] = useState([]);
  const [expensive, setExpensive] = useState([]);
  const [loadingSP, setLoadingSP] = useState(false);
  const [sendCategoryId, setSendCategoryId] = useState("");
  const [passCategoryId, setPassCategoryId] = useState("");

  const [openProductUrl, setOpenProductUrl] = useState("");

  const [extraProduct, setExtraProduct] = useState([]);

  const hasCityPageParam = city ? true : false;




  // Use useEffect to handle router query
  useEffect(() => {
    if (router.isReady) {
      console.log("router.query:", router.query);
      const {
        subCategory: urlSubCategory,
        catValue: urlCatValue,
        productName,
      } = router.query;
      console.log("urlCatValue:", urlCatValue);
      setSendCategoryId(urlCatValue);
      const formattedProduct = productName
        ? productName.replace(/-/g, " ")
        : "";
      setApiProduct(formattedProduct);
      setSubCategory(urlSubCategory || "");
      setCatValue(urlCatValue || "");
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (sendCategoryId) {
      getSubCatId(sendCategoryId);
    }
  }, [sendCategoryId]);
 const openCatItems = (item) => {
    const path = hasCityPageParam
      ? `/${city.toLowerCase()}/balloon-decoration/${item.catValue}`
      : `/balloon-decoration/${item.catValue}`;
    router.push(path);
  };




  const getSubCatId = async (sendCategoryId) => {
    console.log(sendCategoryId, "sendCategoryId");
    try {
      const response = await axios.get(
        BASE_URL + GET_DECORATION_CAT_ID + sendCategoryId
      );
      console.log(response, "cafdsklfjds respones");
      console.log(response.data.data.name, "name response");
      setOpenProductUrl(response.data.data.name);
      const categoryId = response.data.data?._id;
      console.log("Category ID:", categoryId);
      setPassCategoryId(categoryId);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = "7338584828";
    const message = encodeURIComponent("I want to customize a decoration");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  useEffect(() => {
    if (apiProduct && !isFetched) {
      const fetchDecorationDetails = async () => {
        try {
          const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${apiProduct}`;
          const response = await axios.get(url);
          console.log("API Response:", response.data);

          // Assuming the product has a price property
          const fetchedProduct = response.data.data[0];
          setProduct(fetchedProduct);
          setSubCategory(getSubCategory(catValue || ""));
          console.log(fetchedProduct, "fetchedProduct");

          // Calculate discount info if price is available
          if (fetchedProduct && fetchedProduct.price) {
            const price = fetchedProduct.price;

            const discountDetails = getDiscountedPrice(price);
            setDiscountInfo(discountDetails);
          } else {
            console.error("Price is not available in the fetched product.");
          }

          setLoading(false); // Stop loading when data is fetched
        } catch (error) {
          console.error("Error:", error.message);
          setLoading(false); // Stop loading even if there is an error
        }
      };

      fetchDecorationDetails();
    }
  }, [apiProduct, catValue, isFetched]);

  console.log(product._id, "fetchedProductfetchedProduct");

  // similar product function
  const fetchSimilar = async () => {
    if (!product?._id || !passCategoryId) {
      console.log("Missing product ID or category ID");
      return;
    }

    if (loadingSP) return;
    setLoadingSP(true);

    try {
      const res = await axios.post(
        "http://fcaf-2409-40c4-274-21e9-e555-8915-6bd1-14ae.ngrok-free.app/get-similar",
        {
          product_id: product._id,
          themeFilterId: passCategoryId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Similar Products:", res.data.similar_products);
      console.log("Expensive Products:", res.data.expensive_products);
      console.log("extra product", res.data.extra_products);
      setSimilar(res.data.similar_products);
      setExpensive(res.data.expensive_products);
      setExtraProduct(res.data.extra_products);
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }

    setLoadingSP(false);
  };

  useEffect(() => {
    if (product?._id && passCategoryId) {
      fetchSimilar();
    }
  }, [product?._id, passCategoryId]);

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

  const handleContinue = () => {
    setIsModalOpen(false);
  };

  const handleButtonClick = (subCategory, product) => {
    handleCheckout(subCategory, product);

    setButtonClickCount(buttonClickCount + 1);
  };
  const handleAddOnClick = (subCategory, product) => {
    showAddOnmodal(subCategory, product);
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };




  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);  // You already have this function

    setIsModalOpen(false);

    setTimeout(() => {
      customizationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };
  //   const handleCheckout = (subCategory, product, selectedAddOnProduct) => {
  //     const stateData = {
  //       from: window.location.pathname,
  //       subCategory,
  //       product: JSON.stringify(product),
  //       orderType,
  //       catValue,
  //       selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
  //       itemQuantities: JSON.stringify(itemQuantities),
  //       totalAmount: totalAmount,
  //     };

  //   router.push({
  //     pathname: "/checkout",
  //     query: {
  //       from: window.location.pathname,
  //       subCategory,
  //       product: JSON.stringify(product),
  //       orderType: "decoration",
  //       catValue,
  //       selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
  //       itemQuantities: JSON.stringify(itemQuantities),
  //       totalAmount: totalPrice,
  //     },
  //   });
  // };



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

  // Function to generate a random number between min and max (inclusive)
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to generate a random rating between 4.1 to 4.8
  const getRandomRating = () => {
    return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
  };

  if (loading) {
    return <SkeletonLoader />; // Show skeleton loader while loading
  }

  return (
    <div className="App" style={{ backgroundColor: "#EDEDED" }}>
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
            <div
              style={{
                border: "1px solid rgb(220, 53, 69)",
                backgroundColor: "rgb(248, 215, 218)",
                margin: "13px auto 7px",
                padding: "10px 10px 11px 16px",
                borderRadius: 10,
                textAlign: "left",
              }}
              className="inclusiton-details desktop-view"
            >
              <p
                style={{ marginBottom: "0", fontWeight: "bold", fontSize: 12 }}
              >
                Note:
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  padding: 0,
                  fontWeight: "700",
                  fontSize: 12,
                  color: "#444",
                  fontWeight: 700,
                }}
              >
                *Balloons color can be changed as per your choice.*
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  padding: 0,
                  fontWeight: "700",
                  fontSize: 12,
                  color: "#444",
                  fontWeight: 700,
                }}
              >
                *Neon lights can be changed for the event (if included in the
                design).*
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  padding: 0,
                  fontWeight: "700",
                  fontSize: 12,
                  color: "#444",
                  fontWeight: 700,
                }}
              >
                *Age numbers and name are customizable (if included in the
                design).*
              </p>
            </div>


          </div>
          <div
            className="decDetailsRight"
          >
            <div
              style={{
                boxShadow: "0 1px 8px rgba(0,0,0,.18)",
                padding: "10px",
                marginBottom: "12px",
                backgroundColor: "#fff",
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
                boxShadow: "0 1px 8px rgba(0,0,0,.18)",
                padding: "10px",
                marginBottom: "12px",
                backgroundColor: "#fff",
              }}
            >
              {getItemInclusion(product.inclusion)}

              <div

                style={{
                  border: "1px solid rgb(157, 74, 147)",
                  backgroundColor: "rgb(239, 208, 235)",
                  margin: "13px 2px 7px",
                  padding: "7px 7px",
                  borderRadius: 10,
                  textAlign: "left",
                  margin: "10px auto",
                  width: "100%",
                }} className="inclusiton-details mobile-view"
              >
                <p
                  style={{
                    marginBottom: "0",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  Note:
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    padding: 0,
                    fontWeight: "700",
                    fontSize: 12,
                    color: "#444",
                    fontWeight: 700,
                  }}
                >
                  *Balloons color can be changed as per your choice.*
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    padding: 0,
                    fontWeight: "700",
                    fontSize: 12,
                    color: "#444",
                    fontWeight: 700,
                  }}
                >
                  *Neon lights can be changed for the event (if included in the
                  design).*
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    padding: 0,
                    fontWeight: "700",
                    fontSize: 12,
                    color: "#444",
                    fontWeight: 700,
                  }}
                >
                  *Age numbers and name are customizable (if included in the
                  design).*
                </p>
              </div>
            </div>



            <div className="modal-top-box11" ref={addonRef}>
              <h2 className="select-heading-sec">Add Extra Features</h2>
            </div>


            <div className="modal-overlay11" onClick={() => setIsModalOpen(false)} style={{ maxHeight: "400px", overflowY: "scroll", padding: "10px", backgroundColor: "#FFFAF0", margin: "auto" }}>
              <div className="modal-content`11" onClick={(e) => e.stopPropagation()} style={{ marginTop: "10px" }}>
                {/* <button className="modal-close11" onClick={() => setIsModalOpen(false)}>×</button> */}

                <div className="modal-middle-box 11">
                  <div className="modalcard-container">

                    {addOnProductsData?.addOnProducts?.map((item, index) => (
                      <div key={index} className="modalcard">
                        <img
                          // style={{ width: "120px", height: "120px" }}
                          src={item.image}
                          alt={item.title}
                          className="model-image"
                        />
                        <h3>{item.title}</h3>
                        <p className="Addon-description">{item.description}</p>

                        <div className="price-container">
                          <span className="price">
                            {typeof item.price === "number" ? `₹${item.price}` : "Included"}
                          </span>
                          {typeof item.price === "number" && (
                            itemQuantities[item.title] ? (
                              <div className="quantitycontrols">
                                <button onClick={() => handleRemoveFromCart(item)} className="quantitybutton">-</button>
                                <span className="qunatity-title">{itemQuantities[item.title]}</span>
                                <button onClick={() => handleAddToCart(item)} className="quantitybutton">+</button>
                              </div>
                            ) : (
                              // <button onClick={() => handleAddToCart(item)} className="addbutton">Add</button>
                              <button onClick={() => handleAddToCartAndScrollBack(item)} className="addbutton">Add</button>

                            )
                          )}
                        </div>

                      </div>
                    ))}


                  </div>
                </div>

              </div>
            </div>
            {/* <div className="decorke-celebrate-banner">
  <Image
    src={CustomizeDecorBanner}
    alt="Customize Your Celebration"
    className="decorke-banner-img"
  />
</div> */}
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
 <DecorSlider
        title="Premium Decoration"
        viewAllLink="/balloon-decoration/premium-decoration"
        data={PremiumData}
        showDiscount={true}
        imageSize={{ width: 120, height: 120 }}
        city={city}
        hasCityPageParam={hasCityPageParam}
        // decCat={decCat}
        locality={locality}
      />

  <div className="category-tabs-outer">
<CategoryTabs
  data={themeFilters.map((item) => ({
    id: item.value,
    name: item.label,
    image: `/themes/${item.value}.jpg`,
    catValue: "KidsBirthday",   // Always navigate to KidsBirthday with theme
  }))}
  onSelect={(item) => openCatItems(item, themeFilter)}
  city={city}
  hasCityPageParam={hasCityPageParam}
  locality={locality}
  variant="grid"
/>



      </div>
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

// function ProductCard({ item, openProductUrl }) {
//   const formattedName = item.name
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-zA-Z0-9\-]/g, "")
//     .replace(/-+/g, "-");

//   const productUrl = `https://horaservices.com/balloon-decoration/${openProductUrl}/product/${formattedName}`;

//   return (
//     <a
//       href={productUrl}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{ textDecoration: "none", color: "inherit" }}
//     >
//       <div
//         style={{
//           width: "180px",          // ✅ Same width
//           height: "270px",         // ✅ Same height
//           border: "1px solid #ddd",
//           borderRadius: "10px",
//           background: "#fff",
//           padding: "10px",
//           boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           transition: "transform 0.2s ease",
//           cursor: "pointer",
//         }}
//       >
//         <img
//           src={`https://horaservices.com/api/uploads/compressed_webp/${item?.featured_image?.split(".")[0]
//             }.webp`}
//           alt={item.name}
//           style={{
//             width: "100%",
//             height: "140px",
//             objectFit: "cover",
//             borderRadius: "6px"
//           }}
//         />
//         <h3
//           style={{
//             fontSize: "0.9rem",
//             marginTop: "10px",
//             marginBottom: "6px",
//             height: "2.5em", // force uniform text area height
//             overflow: "hidden"
//           }}
//         >
//           {item.name}
//         </h3>
//         <p style={{ fontWeight: "bold", fontSize: "1rem" }}>₹{item.price}</p>
//       </div>
//     </a>
//   );
// }

const styles = {
  Buttonstyle: {
    border: "2px solid rgb(157, 74, 147)",
    backgroundColor: "rgb(157, 74, 147)",
    color: "#fff",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // margin: "23px auto 14px",
    width: "93%",
  },
};



const scrollContainerStyle = {
  display: "flex",
  overflowX: "auto",
  gap: "16px",
  // paddingBottom: "12px",
  scrollSnapType: "x mandatory"
};

const productCardWrapperStyle = {
  flex: "0 0 auto",
  scrollSnapAlign: "start"
};

const sectionHeadingStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "3rem",
  // marginBottom: "1rem",
  // paddingBottom: "0.5rem",
  borderBottom: "2px solid #eee"
};

const badgeStyle = (color = "#1890ff") => ({
  backgroundColor: color,
  color: "#fff",
  fontSize: "0.8rem",
  padding: "4px 12px",
  borderRadius: "20px",
  fontWeight: "bold"
});

export default DecorationCatDetails;