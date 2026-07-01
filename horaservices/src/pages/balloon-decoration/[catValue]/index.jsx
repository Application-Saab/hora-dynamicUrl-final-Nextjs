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
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../assets/new_logo_light.png";
import DecorationCatDescriptionData from "@/utils/decorationCatDescritionData";
import { NamingCeremonyThemes, themeFilters } from "@/utils/themeFilters";
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
import BacheloretteBanner from "@/assets/categories/BacheloretteBanner.webp";
import NamingCeremonyBanner from "@/assets/categories/NamingCeremonyBanner.webp";
import HouseWarming from "@/assets/categories/HouseWarming.webp";
import PetAnimalBanner from "@/assets/categories/petanimal.webp";
import showroomBanner from "@/assets/categories/showroom.webp"; 
import festivalBanner from "@/assets/categories/festivals.webp";
import carDecoration from "@/assets/categories/car.webp";
import Engagementdecoration from "@/assets/categories/Engagementdecoration.webp";
import { decCat } from "@/utils/decorationCategories";
import CardSkeleton from "@/components/CardSkeleton";
import HighPriceProduct from "@/components/Highpriceproduct";
import NationPride from "@/assets/categories/NationPride.jpeg";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import SeoHead from "@/utils/SeoHead";
import ThemeSelector from "@/components/Themeselector";

const DecorationCatPage = ({ locality }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
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
  const [selCat, setSelCat] = useState("");
  const [catId, setCatId] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [currentCategoryContent, setCurrentCategoryContent] = useState(
    DecorationCatDescriptionData[catValue] || []
  );
  const { theme } = router.query;
  const [loading, setLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [discountDifference, setDiscountDifference] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogueData, setCatalogueData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("asc");
  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);
  const searchParams = useSearchParams();
  const selectedTheme = searchParams.get("theme");
  const isThemePage = !!selectedTheme;

  // ---- Price-range theme selector state (Budget / Value / Photogenic / Stage) ----
  const [selectedPriceTheme, setSelectedPriceTheme] = useState(null); // { id, label, priceRange, ... } | null

  const handleSelectPriceTheme = (theme) => {
    setSelectedPriceTheme(theme); // theme = null clears the filter, otherwise the full theme object
  };

  // Only show the price-range theme selector on these two category pages
  const isPriceThemeSelectorPage =
    catValue?.toLowerCase() === "kids-birthday-decoration" ||
    catValue?.toLowerCase() === "birthday-decoration";

  const isPriceThemeActive = !!selectedPriceTheme;

  // ---- Sort state (New Arrival / Popularity / Price Low-High / Price High-Low) ----
  const [sortOption, setSortOption] = useState("popularity");

  const handleSortChange = (id) => {
    setSortOption(id);
  };

  // ---- Search: "Matching Categories" source ----
  // Theme-category suggestions only exist for these two category pages
  // (they're the only ones with a defined set of theme filters).
  const searchCategoryList = useMemo(() => {
    const lowerCatValue = catValue?.toLowerCase();

    if (lowerCatValue === "kids-birthday-decoration") {
      return themeFilters.map((item) => ({
        id: item.value,
        label: item.label,
        image: item.image,
        value: item.value,
      }));
    }

    if (lowerCatValue === "naming-ceremony-decoration") {
      return NamingCeremonyThemes.map((item) => ({
        id: item.value,
        label: item.label,
        image: item.image,
        value: item.value,
      }));
    }

    return [];
  }, [catValue]);

  function getSubCategory(catValue) {
    if (!catValue) {
      const path = window.location.pathname;
      const parts = path.split("/");
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
    } else if (catValue === "naming-ceremony-decoration") {
      return "NamingCeremony";
    } else if (catValue === "coorporate-showrooms-decoration") {
      return "Coorporateshowrooms"
    } else if (catValue === "car-decoration") {
      return "CarDecoration"
    } else if (catValue === "festivals-decoration") {
      return "Festivals"
    } else if (catValue === "pet-animals-decoration") {
      return "PetAnimalsDecoration";
    } else if (catValue === "engagement-decoration") {
      return "Engagementdecoration"
    } else {
      const parts = catValue.split("-");
      return parts
        .slice(0, 2)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join("");
    }
  }

  const { subCategory: stateSubCategory, imgAlt: stateImgAlt } = useSelector(
    (state) => state.state || {}
  );
  const subCategory = getSubCategory(catValue) || stateSubCategory;
  const imgAlt = stateImgAlt || "default alt text";

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomRating = () => {
    return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
  };

  useEffect(() => {
    if (theme) {
      setThemeFilter(theme);
    } else {
      setThemeFilter("all");
    }
  }, [theme]);

  useEffect(() => {
    addSpaces(subCategory);
    getSubCatId(subCategory);
  }, [subCategory]);

  useEffect(() => {
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

  useEffect(() => {
    if (catValue && currentPage !== 1) {
      getSubCatItems(currentPage);
    }
  }, [currentPage]);

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
      setCurrentCategoryContent(content);
    }
  }, [catValue]);

  // Reset the price-range theme filter whenever the category changes
  useEffect(() => {
    setSelectedPriceTheme(null);
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

  const getSubCatId = async (subCategory) => {
    try {
      const response = await axios.get(
        BASE_URL + GET_DECORATION_CAT_ID + subCategory
      );
      const categoryId = response.data.data?._id;

      if (categoryId) {
        setCatId(categoryId);
      }
    } catch (error) {

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

  const getSubCatItems = async (page) => {
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
          // Normalize price to a Number so range comparisons (>=, <=) work reliably
          const numericPrice = Number(item.price);
          const { discount, discountedPrice, discountDifference } =
            getDiscountedPrice(numericPrice);
          return {
            ...item,
            price: numericPrice,
            rating: getRandomRating(),
            userCount: getRandomNumber(20, 500),
            discountPercentage: discount,
            discountedPrice,
            discountDifference,
          };
        });

        setCatalogueData((prevData) =>
          page === 1 ? decoratedData : [...prevData, ...decoratedData]
        );
        setHasMore(page < response.data.pagination.totalPages);
      }
    } catch (error) {
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
    "bachelorette-decoration": BacheloretteBanner,
    "naming-ceremony-decoration": NamingCeremonyBanner,
    "Nation-Pride-decoration": NationPride,
    "House-Warming-decoration": HouseWarming,
    "coorporate-showrooms-decoration": showroomBanner,
    "festivals-decoration": festivalBanner,
    "car-decoration": carDecoration,
    "pet-animals-decoration": PetAnimalBanner,
    "engagement-decoration": Engagementdecoration,
  };

  function trimText(text) {
    if (text.length > 60) {
      return text.slice(0, 60) + "...";
    }
    return text;
  }

  const normalizeCatValue = (val) => {
    if (!val) return "";

    const exactMatch = Object.keys(categoryBannerMap).find(
      (key) => key.toLowerCase() === val.toLowerCase()
    );

    return exactMatch || val.toLowerCase().replace(/ /g, "-");
  };

  const normalizedCat = normalizeCatValue(catValue);
  const bannerToShow = categoryBannerMap[normalizedCat] || categoryBannerMap["default"];

  const shouldHideBanner = (name) => {
    const hideFor = ["Wedding", "haldi-mehendi-decoration"];
    return hideFor.includes(normalizedCat) && ["makeItMemorable", "DidyouKnow", "makeitmemorablebanner"].includes(name);
  };

  const handleViewDetails = (item) => {
    if (!item?.slug && !item?.product_slug && !item?.name) return;

    const productSlug =
      item.slug ||
      item.product_slug ||
      item.name.toLowerCase().replace(/\s+/g, "-");

    const categorySlug = getCategorySlugFromPath(
      pathname,
      city,
      locality
    );

    if (!categorySlug || !catValue) {
      console.warn("Missing categorySlug or catValue", {
        categorySlug,
        catValue,
      });
      return;
    }

    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;

    const finalPath = `${base}/${categorySlug}/${catValue}/product/${productSlug}`;

    router.push(finalPath);
  };

  // Navigates to the themed variant of the current category page (?theme=...).
  // Used by CategoryTabs (kids-birthday / naming-ceremony) and by the
  // "Matching Categories" results in the search dropdown.
  const openCatItems = (item) => {
    if (!item?.value || !catValue) return;

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);

    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;

   const finalPath = `${base}/${categorySlug}/${catValue}/${item.value}`;
    router.push(finalPath);
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // ---- Sorting ----
  // Field names match the actual API response:
  // - creation date lives inside featured_images[0].createdAt
  // - popularity comes from the top-level "popularity_score" field
  const sortedCatalogueData = useMemo(() => {
    const data = [...catalogueData];

    switch (sortOption) {
      case "newArrival":
        // Latest products first — descending by creation date.
        return data.sort((a, b) => {
          const dateA = new Date(
            a.featured_images?.[0]?.createdAt || a.createdAt || a.created_at || 0
          ).getTime();
          const dateB = new Date(
            b.featured_images?.[0]?.createdAt || b.createdAt || b.created_at || 0
          ).getTime();
          return dateB - dateA;
        });

     case "popularity":
  // Descending order — highest popularity_score first.
  return data.sort((a, b) => {
    const scoreA = Number(a.popularity_score ?? a.popularityScore ?? 0);
    const scoreB = Number(b.popularity_score ?? b.popularityScore ?? 0);
    return scoreB - scoreA;
  });

      case "lowToHigh":
        return data.sort((a, b) => Number(a.price) - Number(b.price));

      case "highToLow":
        return data.sort((a, b) => Number(b.price) - Number(a.price));

      default:
        return data;
    }
  }, [catalogueData, sortOption]);
const shouldShowSearchBar =
  isPriceThemeSelectorPage ||
  catValue?.toLowerCase() === "naming-ceremony-decoration";
  // ---- Price-range filtering derived data (built on top of the sorted list) ----
  const priceThemeFilteredData = useMemo(() => {
    if (!selectedPriceTheme) return sortedCatalogueData;
    const { min, max } = selectedPriceTheme.priceRange;
    return sortedCatalogueData.filter((item) => {
      const price = Number(item.price);
      return price >= min && price <= max;
    });
  }, [sortedCatalogueData, selectedPriceTheme]);

  const highPriceProducts = sortedCatalogueData.filter((item) => Number(item.price) > 11000);

  return (
    <div className="decCatPage">
      <SeoHead
        catValue={normalizedCat}
        city={city}
        locality={locality}
        theme={theme}
      />

      {loading ? (
        <div className="skeleton-wrapper">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : catalogueData.length === 0 ? (
        <div className="noProductsWrapper">
          <h2>No products found</h2>
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
         {shouldShowSearchBar && (
  <ThemeSelector
    onSelectTheme={handleSelectPriceTheme}
    selectedThemeId={selectedPriceTheme?.id || null}
    sortOption={sortOption}
    onSortChange={handleSortChange}
    showThemeGrid={isPriceThemeSelectorPage}
    searchCategoryList={searchCategoryList}
    products={sortedCatalogueData}
    onCategorySelect={(item) => openCatItems(item, themeFilter)}
    onProductSelect={handleViewDetails}
    
  />
)}
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

              {catValue?.toLowerCase() === "naming-ceremony-decoration" && (
                <div className="category-tabs-outer">
                  <CategoryTabs
                    data={NamingCeremonyThemes.map((item) => ({
                      id: item.value,
                      name: item.label,
                      image: item.image,
                      value: item.value,
                      catValue: "naming-ceremony-decoration",
                    }))}
                    onSelect={(item) => openCatItems(item, themeFilter)}
                    city={city}
                    hasCityPageParam={hasCityPageParam}
                    locality={locality}
                    variant="grid"
                    catValue="naming-ceremony-decoration"
                  />
                </div>
              )}

              {/* Price-range Theme Selector: only on birthday & kids-birthday pages */}
   

              {isPriceThemeActive ? (
                // ---- PRICE-RANGE FILTER ACTIVE: show only the matching products ----
                <>
                  {priceThemeFilteredData.length > 0 ? (
                    <ProductGrid
                      data={priceThemeFilteredData}
                      onCardClick={handleViewDetails}
                      catValue={catValue}
                    />
                  ) : (
                    <div className="noProductsWrapper">
                      <h2>No products found in this price range</h2>
                    </div>
                  )}
                </>
              ) : (
                // ---- DEFAULT LAYOUT: banners interspersed with product grids ----
                <>
                  <ProductGrid data={sortedCatalogueData.slice(0, 4)} onCardClick={handleViewDetails} catValue={catValue} />

                  <HighPriceProduct
                    data={highPriceProducts.slice(0, 1)}
                    onCardClick={handleViewDetails}
                  />
                  <div className="filterBar">
                    <div className="filterBarInner">
                      <FilterBar priceFilter={priceFilter} setPriceFilter={setPriceFilter} />
                    </div>
                  </div>
                  <section className="decorationBanner">
                    <Image src={customize} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                  </section>

                  <ProductGrid data={sortedCatalogueData.slice(4, 10)} onCardClick={handleViewDetails} catValue={catValue} />

                  <HighPriceProduct
                    data={highPriceProducts.slice(1, 2)}
                    onCardClick={handleViewDetails}
                  />
                  {!shouldHideBanner("DidyouKnow") && (
                    <section className="decorationBanner">
                      <Image src={DidyouKnow} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                    </section>
                  )}

                  <ProductGrid data={sortedCatalogueData.slice(10, 14)} onCardClick={handleViewDetails} catValue={catValue} />
                  <HighPriceProduct
                    data={highPriceProducts.slice(2, 3)}
                    onCardClick={handleViewDetails}
                  />
                  {!shouldHideBanner("makeItMemorable") && (
                    <section className="decorationBanner">
                      <Image src={makeItMemorable} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                    </section>
                  )}

                  <ProductGrid data={sortedCatalogueData.slice(14, 20)} onCardClick={handleViewDetails} catValue={catValue} />
                  <HighPriceProduct
                    data={highPriceProducts.slice(3, 4)}
                    onCardClick={handleViewDetails}
                  />
                  <section className="decorationBanner">
                    <Image src={steps} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                  </section>

                  <ProductGrid data={sortedCatalogueData.slice(20, 26)} onCardClick={handleViewDetails} catValue={catValue} />
                  <HighPriceProduct
                    data={highPriceProducts.slice(4, 5)}
                    onCardClick={handleViewDetails}
                  />
                  {!shouldHideBanner("makeitmemorablebanner") && (
                    <section className="decorationBanner">
                      <Image src={makeitmemorablebanner} alt="Decoration-Banner" width={1200} height={400} className="decorationBanner-image" priority />
                    </section>
                  )}

                  <ProductGrid data={sortedCatalogueData.slice(26, 32)} onCardClick={handleViewDetails} catValue={catValue} />
                  <HighPriceProduct
                    data={highPriceProducts.slice(5, 6)}
                    onCardClick={handleViewDetails}
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
            </>
          )}

          {/* Grouped "load more" section — skipped while a price-range filter is active
              to avoid showing the full catalogue underneath the filtered results */}
          {!isPriceThemeActive &&
            Array.from(
              {
                length: Math.ceil(
                  sortedCatalogueData.slice(isThemePage ? 0 : 32).length / 6
                ),
              },
              (_, groupIndex) => {
                const start = (isThemePage ? 0 : 32) + groupIndex * 6;
                const end = start + 6;
                const groupProducts = sortedCatalogueData.slice(start, end);

                const highPriceIndex = groupIndex + 6;

                return (
                  <React.Fragment key={groupIndex}>
                    <ProductGrid
                      data={groupProducts}
                      onCardClick={handleViewDetails}
                      catValue={catValue}
                    />

                    {!isThemePage && highPriceProducts[highPriceIndex] && (
                      <HighPriceProduct
                        data={highPriceProducts.slice(
                          highPriceIndex,
                          highPriceIndex + 1
                        )}
                        onCardClick={handleViewDetails}
                      />
                    )}
                  </React.Fragment>
                );
              }
            )}

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