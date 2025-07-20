import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
// import "../../../css/decoration.css";
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
import steps from "../../../assets/steps.jpg";
import makeitmemorablebanner from "../../../assets/makeitmemorablebanner.jpg";
import googleRating from "../../../assets/goglerating.png";
import Gurantee from "../../../assets/gurantee.jpg";
import ontime from "../../../assets/ontime.png"
import CategoryTabs from "@/components/CategoryTabs.jsx";
import birthdayBanner from "@/assets/categories/BIRTHDAY.webp";
import premiumBanner from "@/assets/categories/PREMIUMDECORATION.webp";
import kidsBanner from "@/assets/categories/KIDSDECORATION.Webp"
import welcomeBanner from "@/assets/categories/WELCOMEBABY.webp"
import babyshowerBanner from "@/assets/categories/BABYSHOWWER.webp"
import anniversaryBanner from "@/assets/categories/ANNVERSARY.webp"
import firstNightBanner from "@/assets/categories/FIRSTNIGHT.webp"
const DecorationCatPage = ({ locality }) => {
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
  const containerRef = useRef(null);
  //   const { catValue } = useParams();
  const [selCat, setSelCat] = useState("");
  const [catId, setCatId] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [currentCategoryContent, setCurrentCategoryContent] = useState(
    DecorationCatDescriptionData[catValue]
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
    console.log(DecorationCatDescriptionData[catValue]);
    //console.log("useEffect6")
    if (catValue) {
      setCatalogueData([]);
      setCurrentPage(1);
      getSubCatItems(1); // explicitly fetch again
      if (!currentCategoryContent) {
        setCurrentCategoryContent(DecorationCatDescriptionData[catValue]);
      }
    }
  }, [catValue, priceFilter, themeFilter]);

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
const categoryBannerMap = {
  "birthday-decoration": birthdayBanner,
  "premium-decoration": premiumBanner,
  // "haldi-decoration": haldiBanner,
  // "mehndi-decoration": haldiBanner,
  "kids-birthday-decoration": kidsBanner,
  "welcome-baby-decoration":welcomeBanner,
  "baby-shower-decoration":babyshowerBanner,
  "anniversary-decoration":anniversaryBanner,
  "first-night-decoration":firstNightBanner,
  // fallback/default
  // default: customize,
};
  function trimText(text) {
    if (text.length > 60) {
      return text.slice(0, 60) + "...";
    }
    return text;
  }
  // const normalizeCatValue = (val) => {
  //   return val?.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  // };
  const normalizeCatValue = (val) => {
  return val?.toLowerCase().replace(/ /g, "-");
};


  const normalizedCat = normalizeCatValue(catValue);
  const bannerToShow = categoryBannerMap[normalizedCat] || categoryBannerMap["default"];
  const PageTitle = (cat) => {
    if (cat === "kids-birthday" || cat === "kids-birthday-decoration") {
      return "Kids' Birthday Balloon Decoration by Professionals Decorators, Starting at ₹1199";
    } else if (cat === "birthday-decoration" || cat === "birthday") {
      return "Birthday Balloon Decoration at Home by Professionals Decorators, Starting at ₹1199";
    } else if (cat === "anniversary-decoration" || cat === "anniversary") {
      return "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199";
    } else if (cat === "first-night-decoration" || cat === "first-night") {
      return "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199";
    } else if (cat === "baby-shower-decoration" || cat === "baby-shower") {
      return "Baby Shower with Latest Designs by Professionals Decorators Starting at ₹1199";
    } else if (cat === "welcome-baby-decoration" || cat === "WelcomeBaby") {
      return "Baby Welcome Decoration at home by Professionals Decorators, Starting at ₹1199";
    } else if (cat === "haldi-mehendi-decoration" || cat === "haldi-mehandi") {
      return "Haldi Decoration with Latest Designs starting at ₹3000";
    } else if (cat === "bachelorette" || cat === "bachelorette") {
      return "Bachelorette Decoration with Latest Designs starting at ₹3000";
    } else if (cat === "premium-decoration" || cat === "premium-decoration") {
      return "Premium-Decoration with Latest Designs starting at ₹3000";
    } else {
      return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
    }
  };

  const getPageMetaDescription = (cat) => {
    if (cat === "kids-birthday" || cat === "kids-birthday-decoration") {
      return "At Hora, 🎉Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠, under the sea 🌊, Baby Boss 👔, Barbie 💖, and cars 🚗. Explore detailed pricing and inclusions, and let our professional team bring your chosen design to life. Book your perfect party decor today! 🎈✨";
    } else if (cat === "birthday-decoration" || cat === "birthday") {
      return "At Hora, 🎈 Explore our wide range of balloon and flower decorations for birthday parties, featuring ring, sequin, wall, and room designs. Discover pricing and inclusions for every balloon color and variety. Customise your celebration and make it unforgettable with our stunning decor. Book your perfect party setup today! 🎉🌟";
    } else if (cat === "anniversary-decoration" || cat === "anniversary") {
      return "🎉 Explore top-notch anniversary decoration designs and book directly from our website 💖. Find elegant and customizable decor options for your special event. Browse our selection to choose the perfect theme and make your anniversary memorable with seamless online booking. ✨";
    } else if (cat === "first-night-decoration" || cat === "first-night") {
      return "🌟 Explore our selection of elegant decoration designs for your first night event 💖. Choose from a variety of styles and themes, and book your perfect decor directly through our website. Make your special night unforgettable with seamless online booking and beautiful, personalised decorations. ✨";
    } else if (cat === "baby-shower-decoration" || cat === "baby-shower") {
      return "Celebrate the joy of motherhood with our beautiful Baby Shower decoration setups! 👶💐 Explore unique themes, elegant backdrops, and customizable balloon designs. Book online for professional setup and an unforgettable experience. 🌸🎈";
    } else if (cat === "welcome-baby-decoration" || cat === "WelcomeBaby") {
      return "Welcome your newborn with adorable and heartwarming balloon decorations! 🍼🎉 Explore our curated designs perfect for celebrating the arrival of your little one. Book your baby welcome decor with ease and joy. 💖👶";
    } else if (cat === "haldi-mehendi-decoration" || cat === "haldi-mehandi") {
      return "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups, featuring traditional elements, colorful floral arrangements, and custom designs to make your event unforgettable. 🌸💛";
    } else {
      return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199. Book online for themed decorations with flowers, lights, backdrops & more. Available across major cities. 🎈💐";
    }
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className="decCatPage">
      <Head>
        <title>{PageTitle(normalizedCat)}</title>
        <meta name="description" content={getPageMetaDescription(normalizedCat)} />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content={PageTitle(normalizedCat)} />
        <meta property="og:description" content={getPageMetaDescription(normalizedCat)} />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${normalizedCat}`} />
        <meta property="og:type" content="website" />
      </Head>
      {!loading && (
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
      )}
         {!loading && (
    <div>
        {catValue?.toLowerCase() === "kids-birthday-decoration" && (
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
                </div>
         )}
      <ProductGrid data={catalogueData.slice(0, 4)} loading={loading} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} />
      {!loading && (
      <FilterBar
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
      />
      )}
      {!loading && (
      <section className="decorationBanner">
        <Image
          src={customize}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>
)}
      <ProductGrid data={catalogueData.slice(4, 10)} loading={loading} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} />
     {!loading && (
      <section className="decorationBanner">
        <Image
          src={DidyouKnow}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>
     )}
      <ProductGrid data={catalogueData.slice(10, 14)} loading={loading} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} />
      {!loading && (
      <section className="decorationBanner">
        <Image
          src={makeItMemorable}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>
      )}
       <ProductGrid data={catalogueData.slice(14, 20)} loading={loading} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} />
 {!loading && (
 <section className="decorationBanner">
        <Image
          src={steps}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>
 )}
        <ProductGrid data={catalogueData.slice(20, 26)} loading={loading} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} />
 {!loading && (
 <section className="decorationBanner">
        <Image
          src={makeitmemorablebanner}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>
 )}
       <ProductGrid data={catalogueData.slice(26, 32)} loading={loading} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} />
  {!loading && (
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
  )}
        <ProductGrid data={catalogueData.slice(32)} loading={loading} onCardClick={(item) => handleViewDetails(subCategory, catValue, item)} />
    </div>
  );

};



export default DecorationCatPage;
