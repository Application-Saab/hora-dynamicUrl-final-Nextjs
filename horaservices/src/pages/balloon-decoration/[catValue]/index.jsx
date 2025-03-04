import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
  API_SUCCESS_CODE,
} from "../../../utils/apiconstants";
import axios from "axios";
import { useSelector } from "react-redux";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { CardSkeleton } from "../../../components/CardSkeleton";
import { getDecorationCatOrganizationSchema } from "../../../utils/schema";
import "../../../css/decoration.css";
import { setState } from "../../../actions/action";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../assets/new_logo_light.png";
import DecorationCatDescriptionData from "@/utils/decorationCatDescritionData";

const DecorationCatPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  //   let { city } = useParams();
  const [city, setCity] = useState("");
  const [catValue, setCatValue] = useState("");

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
    } else {
      const path = window.location.pathname; // e.g., /balloon-decoration/kids-birthday-decoration
      const parts = path.split("/"); // Split by '/'
      const dynamicValue = parts[2];

      setCatValue(dynamicValue);
    }
  }, [router.isReady, router.query]);

  const altTagCatValue = catValue.replace(/-/g, " ");
  const [orderType, setOrderType] = useState(1);
  const hasCityPageParam = city ? true : false;
  //   const { catValue } = useParams();
  const [selCat, setSelCat] = useState("");
  const [catId, setCatId] = useState("");
  const [showAll, setShowAll] = useState(false);
  const currentCategoryContent = DecorationCatDescriptionData[catValue] || [];
  const [loading, setLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(0); // State for the discount percentage
  const [discountedPrice, setDiscountedPrice] = useState(0); // State for the discounted price
  const [discountDifference, setDiscountDifference] = useState(0);
  const [catalogueData, setCatalogueData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered container index
  //   const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState("all"); // Default: Show all
  const [themeFilter, setThemeFilter] = useState("all"); // Default: Show all
  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);

  const themeFilters = [
    { label: "Select Theme", value: "all" },
    { label: "Astronaut space theme", value: "Astronaut-space" },
    { label: "Avengers theme", value: "Avengers" },
    { label: "Boss baby theme", value: "Boss" },
    { label: "Baby shark theme", value: "shark" },
    { label: "Barbie theme", value: "Barbie" },
    { label: "Cocomelon Theme", value: "Cocomelon" },
    { label: "Car Theme", value: "car" },
    { label: "Circus Theme", value: "Circus" },
    { label: "Dinosaur Theme", value: "Dinosaur" },
    { label: "Elsa Theme", value: "Elsa" },
    { label: "Flamingo Theme", value: "Flamingo" },
    { label: "Jungle Theme", value: "Jungle" },
    { label: "Kitty Theme", value: "Kitty" },
    { label: "Lion King", value: "Lion" },
    { label: "Mickey Mouse Theme", value: "Mickey-Mouse" },
    { label: "Mickey and Minnie Theme", value: "Mickey-Minnie" },
    { label: "Minecraft Theme", value: "Minecraft" },
    { label: "Mermaid Theme", value: "Mermaid" },
    { label: "Pokemon and Pikachu theme", value: "Pikachu-Pokemon" },
    { label: "Princess Theme", value: "Princess" },
    { label: "Panda Theme", value: "Panda" },
    { label: "Traffic Theme", value: "Traffic" },
    { label: "Super dogs theme", value: "dogs" },
    { label: "Super Hero theme", value: "Hero" },
    { label: "Sport Football theme", value: "Football" },
    { label: "Unicorn Theme", value: "Unicorn" },
  ];

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

  // UseSelector to get state from Redux
  const { subCategory: stateSubCategory, imgAlt: stateImgAlt } = useSelector(
    (state) => state.state || {}
  );
  // Determine the value for subCategory and imgAlt
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
    addSpaces(subCategory);
    getSubCatId(subCategory); // Fetch category ID based on the selected subcategory
    window.addEventListener("scroll", handleScroll); // Add scroll event listener

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, [subCategory]);

  const handleScroll = () => {
    const filterElement = document.querySelector(".filterdropdown");
    if (filterElement) {
      if (window.scrollY > 50) {
        filterElement.classList.add("sticky");
      } else {
        filterElement.classList.remove("sticky");
      }
    }
  };

  const filteredData = catalogueData.filter((item) => {
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
      const formattedThemeFilter = themeFilter.toLowerCase().split("-")[0];
      const formattedItemName = item.name.toLowerCase().split("-")[0];
      themeCondition = formattedItemName.includes(formattedThemeFilter);
    }

    // Return true if both conditions are met
    return priceCondition && themeCondition;
  });

  // Apply sorting
  const sortedData = filteredData.sort((a, b) => {
    if (priceFilter === "lowToHigh") {
      return a.price - b.price;
    } else if (priceFilter === "highToLow") {
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
      const response = await axios.get(
        BASE_URL + GET_DECORATION_CAT_ID + subCategory
      );
      console.log(response, "response");
      const categoryId = response.data.data?._id;
      console.log(categoryId,"categoryid");
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
    const discountDifference = Math.abs(price - discountedPrice);
    return { discount, discountedPrice, discountDifference }; // Return both discount percentage and discounted price
  };

  const getSubCatItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        BASE_URL + GET_DECORATION_CAT_ITEM + catId
      );
      if (response.status === API_SUCCESS_CODE) {
        const decoratedData = response.data.data.map((item) => {
          const { discount, discountedPrice, discountDifference } =
            getDiscountedPrice(item.price); // Destructure the return value
          return {
            ...item,
            rating: getRandomRating(),
            userCount: getRandomNumber(20, 500),
            discountPercentage: discount, // Add discount percentage
            discountedPrice: discountedPrice, // Add discounted price
            discountDifference: discountDifference,
          };
        });
        setCatalogueData(decoratedData);
      }
    } catch (error) {
      console.log("Error Fetching Data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (subCategory, catValue, product) => {
    const productName = product.name.replace(/ /g, "-");
    dispatch(setState(subCategory, orderType, catValue, product));
    if (hasCityPageParam) {
      router.push(
        `/${city}/balloon-decoration/${catValue}/product/${productName}`
      );
    } else {
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
      return text.slice(0, 60) + "...";
    }
    return text;
  }

  const PageTitle = (e) => {
    if (catValue === "kids-birthday-decoration") {
      return "Kids' Birthday Balloon Decoration by Professionals Decorators, Starting at ₹1199";
    } else if (catValue === "birthday-decoration") {
      return "Birthday Balloon Decoration at Home by Professionals  Decorators, Starting at ₹1199";
    } else if (catValue === "anniversary-decoration") {
      return "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199";
    } else if (catValue === "first-night-decoration") {
      return "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199";
    } else if (catValue === "baby-shower-decoration") {
      return "Baby Shower with Latest Designs by Professionals  Decorators Starting at ₹1199";
    } else if (catValue === "welcome-baby-decoration") {
      return "Baby Welcome Decoration at home by Professionals  Decorators, Starting at ₹1199";
    } else if (catValue === "haldi-mehendi-decoration") {
      return "Haldi Decoration with Latest Designs starting at ₹3000";
    } else {
      return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
    }
  };

  const getPageMetaDescription = () => {
    if (catValue === "kids-birthday-decoration") {
      return "At Hora, 🎉Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠, under the sea 🌊, Baby Boss 👔, Barbie 💖, and cars 🚗. Explore detailed pricing and inclusions, and let our professional team bring your chosen design to life. Book your perfect party decor today! 🎈✨";
    } else if (catValue === "birthday-decoration") {
      return "At Hora, 🎈 Explore our wide range of balloon and flower decorations for birthday parties, featuring ring, sequin, wall, and room designs. Discover pricing and inclusions for every balloon color and variety. Customise your celebration and make it unforgettable with our stunning decor. Book your perfect party setup today! 🎉🌟";
    } else if (catValue === "anniversary-decoration") {
      return "🎉 Explore top-notch anniversary decoration designs and book directly from our website 💖. Find elegant and customizable decor options for your special event. Browse our selection to choose the perfect theme and make your anniversary memorable with seamless online booking. ✨";
    } else if (catValue === "first-night-decoration") {
      return "🌟 Explore our selection of elegant decoration designs for your first night event 💖. Choose from a variety of styles and themes, and book your perfect decor directly through our website. Make your special night unforgettable with seamless online booking and beautiful, personalised decorations. ✨";
    } else if (catValue === "haldi-mehendi-decoration") {
      return "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups, featuring traditional elements, colorful floral arrangements, and custom designs to make your event unforgettable. 🌸💛";
    } else {
      return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
    }
  };

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

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div style={{ backgroundColor: "#EDEDED" }} className="decCatPage">
      <Head>
        <title>{PageTitle(catValue)}</title>
        <meta name="description" content={getPageMetaDescription()} />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content={PageTitle(catValue)} />
        <meta property="og:description" content={getPageMetaDescription()} />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        <meta
          property="og:url"
          content={`https://horaservices.com/balloon-decoration/${catValue}`}
        />
        <meta property="og:type" content="website" />
      </Head>
      <>
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: "0px" }}>
            <h1
              style={{
                fontSize: "16px",
                color: "#000",
                padding: "14px 0 0",
                color: "#9252AA",
              }}
            >
              {selCat} {"Balloon Decoration"}{" "}
            </h1>
            <p
              style={{ padding: "0px 0px 16px", margin: "0px" }}
              className="subheading"
            >
              {trimText(
                "Balloon Decoration and Room Decoration Services for Anniversary, Birthdays, Kids Parties, Baby Showers and more!"
              )}
            </p>
            <div className="filterdropdown d-flex flex-row flex-lg-row align-items-center justify-content-center gap-3">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                style={{
                  fontSize: "16px",
                  color: "rgb(157, 74, 147)",
                  padding: "7px 10px",
                  borderWidth: 1,
                  borderColor: "rgb(157, 74, 147)",
                  borderRadius: "5px",
                  marginLeft: "5px",
                }}
              >
                <option value="all">Sort By: Price</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="under2000">Under ₹ 2000</option>
                <option value="2000to5000">₹ 2000 - ₹ 5000</option>
                <option value="above5000">Above ₹ 5000</option>
              </select>

              {/* Theme filter */}
              {selCat === "Kids Birthday" ? (
                <select
                  value={themeFilter}
                  onChange={(e) => setThemeFilter(e.target.value)}
                  style={{
                    fontSize: "16px",
                    color: "rgb(157, 74, 147)",
                    padding: "7px 10px",
                    borderWidth: 1,
                    borderColor: "rgb(157, 74, 147)",
                    borderRadius: "5px",
                    marginLeft: "5px",
                  }}
                >
                  {themeFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          </div>
        </div>
        <div
         style={styles.decContainer} className="decContainer"
        >
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div
                className="decimagecontainer"
                key={index}
                style={styles.imageContainer}
              >
                <CardSkeleton />
              </div>
            ))
          ) : sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <div
                key={item._id}
                style={{
                  ...styles.imageContainer,
                  cursor: "pointer",
                  ...(hoveredIndex === index && styles.zoomedContainer), // Apply zoom effect when hovered
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleViewDetails(subCategory, catValue, item)}
                className="decimagecontainer"
              >
                <div style={{ position: "relative" }}>
                  <Image
                    src={`https://horaservices.com/api/uploads/compressed_images/${item?.featured_image}`}
                    alt={`balloon decoration ${altTagCatValue} ${item.name} ${item.price}`}
                    style={styles.decCatimage}
                    width={300}
                    height={300}
                  />
                  {/* Watermark */}
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
                  <div className="decorationdiscount">
                    ₹ {item.discountDifference.toFixed(0)} {"off"}
                  </div>
                </div>
                {/* End of Watermark */}
                <div className="px-2 py-2">
                  <p
                    style={{
                      marginHorizontal: 3,
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "16px",
                      marginTop: "4px",
                      color: "#9252AA",

                      lineHeight: "18px",
                      marginBottom: "0px",
                      textAlign: "left",
                    }}
                    className="pro_name"
                  >
                    {item.name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "top",
                    }}
                    className="pri_details"
                  >
                    <div
                      style={{
                        alignItems: "left",
                        justifyContent: "space-between",
                        display: "flex",
                      }}
                      className="pro_price"
                    >
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: 15,
                          color: "#9252AA",
                          textAlign: "left",
                          margin: "10px 10px 7px 0",
                        }}
                      >
                        ₹{item.price}{" "}
                      </p>
                      <p
                        style={{
                          color: "#444",
                          fontWeight: "700",
                          fontSize: 15,
                          textAlign: "left",
                          margin: "10px 0px 7px",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{Math.floor(item.discountedPrice.toFixed(2))}
                      </p>
                    </div>
                    <div className="d-flex align-items-center rating-sec">
                      <p
                        className="m-0 p-0"
                        style={{
                          fontWeight: "500",
                          fontSize: 17,
                          margin: "0px",
                          color: "#9252AA",
                        }}
                      >
                        {item.rating}
                        <span
                          className="px-1 m-0 py-0 img-fluid"
                          style={{ color: "#ffc107" }}
                        >
                          <FontAwesomeIcon
                            style={{ margin: 0, height: "14px" }}
                            icon={faStar}
                          />
                        </span>
                      </p>
                      <p
                        style={{
                          color: "#9252AA",
                          fontWeight: "600",
                          fontSize: 17,
                          margin: "0px",
                          padding: "0 0 0 2px",
                        }}
                      >
                        ({item.userCount})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: "center", width: "100%", padding: "20px 0" }}
            >
              <span>Reach out to our support team for this</span>
              <span style={{ marginLeft: "10px" }}>
                <Link
                  className="conactus"
                  href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services"
                  target="_blank"
                >
                  Click here
                </Link>
              </span>
            </div>
          )}

          {/* <div>
          {
          filteredData.map((item, index) => (
          <url key={index}>
          <loc>
          {`https://horaservices.com/balloon-decoration/${catValue}/product/${item.name.replace(/ /g, "-")}`}
          </loc>
          <priority>1.00</priority>
          </url>
          ))
          }
          </div> */}
        </div>

        <div className="category-content">
          {currentCategoryContent.length > 0 ? (
            currentCategoryContent
              .slice(0, showAll ? currentCategoryContent.length : 2)
              .map((item, index) => (
                <div key={index} className="category-item">
                  <h1>{item.title}</h1>
                  <div
                    className="item-content"
                    dangerouslySetInnerHTML={{ __html: item.htmlContent }}
                  />
                </div>
              ))
          ) : (
            <p className="no-content-message">
              No content available for this category.
            </p>
          )}
          {currentCategoryContent.length > 2 && (
            <button onClick={toggleShowAll} className="toggle-btn">
              {showAll ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </>
    </div>
  );
};

const styles = {
  decContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: 'center',
    display: "inline-flex",
    flexWrap: "wrap",
    padding: "1% 1% 0",
  },
  decCatimage: {
    width: "100%",
    height: "300px",
    borderRadius: "5px",
    objectFit: "cover",
  },
  imageContainer: {
    position: "relative",
    width: "270px",
    backgroundColor: "#fff",
    marginBottom: 40,
    boxShadow: "0 6px 16px 0 rgba(0,0,0,.14)",
    borderRadius: "5px",
    transition: "transform 0.3s ease-in-out", // Smooth transition effect for zoom
    margin: "10px 12px 20px",
    padding: "4px 4px 10px",
  },
  zoomedContainer: {
    transform: "scale(1.1)", // Scale the container by 10% on hover
  },
  itemName: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
    color: "#444",
    padding: "10px",
  },
  priceContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    fontSize: "17px",
    fontWeight: "500",
    color: "#444",
    margin: "0",
  },
};

export default DecorationCatPage;
