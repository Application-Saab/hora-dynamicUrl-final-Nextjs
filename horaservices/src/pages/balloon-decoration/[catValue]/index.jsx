"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import React from 'react';

import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
  API_SUCCESS_CODE,
} from "../../../utils/apiconstants";
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
import customize from "../../../assets/Customizetationbanner.webp";
import DidyouKnow from "../../../assets/didyouknow.jpg";
import makeItMemorable from "../../../assets/makeitmemorable.png";
import steps from "../../../assets/steps.webp";
import makeitmemorablebanner from "../../../assets/makeitmemorablebanner.png";
import googleRating from "../../../assets/goglerating.png";
import Gurantee from "../../../assets/gurantee.jpg";
import ontime from "../../../assets/ontime.png"
import CategoryTabs from "@/components/CategoryTabs/index.jsx";
import CardSkeleton from "@/components/CardSkeleton";
import HighPriceProduct from "@/components/Highpriceproduct";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import SeoHead from "@/utils/SeoHead";
import ThemeSelector from "@/components/Themeselector";
import SearchSortBar from "@/components/SearchSortBar";
import DecorationBanner from "@/components/CategoryDecorationBanner";

import EventDateBanner from "@/components/Eventdatebanner";
import axiosApi from "@/utils/axiosApi";
import MakeItYoursBanner from "@/components/MakeItYoursBanner";
import { getPageCache, setPageCache } from "@/utils/scrollDataCache";

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
  const [isPaginating, setIsPaginating] = useState(false); // 👈 naya
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [discountDifference, setDiscountDifference] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogueData, setCatalogueData] = useState([]);
  const [defaultCatalogueData, setDefaultCatalogueData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [themeFilter, setThemeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);
  const searchParams = useSearchParams();
  const selectedTheme = searchParams.get("theme");
  const isThemePage = !!selectedTheme;

  // ---- Price-range theme selector state (Budget / Value / Photogenic / Stage) ----
  const [selectedPriceTheme, setSelectedPriceTheme] = useState(null); // { id, label, priceRange, ... } | null

  // ================= CACHE-FIRST BACK-NAVIGATION SUPPORT =================
  // Jab user product-detail (alag route) se BACK karke is page par aata
  // hai, yeh component pura REMOUNT hota hai — saara state khali ho jaata
  // hai. Isse bachne ke liye ek module-level in-memory cache use karte
  // hain (utils/pageDataCache.js): mount hote hi pehle cache check karo,
  // agar mile to turant wahi data dikhao — koi naya API call nahi.
  //
  // `hasHydratedFromCache` ek REF hai (state nahi), taaki isko set/read
  // karna re-render trigger na kare. Iska use "abhi jo catId/currentPage
  // set hua hai woh CACHE se aaya hai, isliye usse trigger hone wale
  // fetch effects ko is baar SKIP karna hai" — yeh batane ke liye hota hai.
  const hasHydratedFromCache = useRef(false);

  const handleSelectPriceTheme = (theme) => {
    setSelectedPriceTheme(theme); // theme = null clears the filter, otherwise the full theme object

    // Ek time par sirf EK filter active rahega: ya toh CategoryTabs wala
    // theme (jaise Cocomelon) ya phir ye price-range segmentation
    // (Budget Friendly / Value For Money / Photogenic / Stage).
    if (theme) {
      setThemeFilter("all");

      // `theme` yahan URL ka ek query-string value nahi, balki dynamic
      // route ka path SEGMENT hai (…/[catValue]/[theme]). Isliye query
      // object se hataya nahi ja sakta (router.replace with the same
      // bracketed pathname throws an interpolation error). Agar hum
      // abhi kisi themed URL par khade hain, to seedha non-themed base
      // listing URL par navigate kar dete hain.
      if (router.query?.theme && catValue) {
        const categorySlug = getCategorySlugFromPath(pathname, city, locality);

        let base = "";
        if (city) base += `/${city.toLowerCase()}`;
        if (locality) base += `/${locality.toLowerCase()}`;

        const basePath = `${base}/${categorySlug}/${catValue}`;
        router.push(basePath);
      }
    }
  };

  // Only show the price-range theme selector on these two category pages
  const isPriceThemeSelectorPage =
    catValue?.toLowerCase() === "kids-birthday-decoration" ||
    catValue?.toLowerCase() === "birthday-decoration";

  const isPriceThemeActive = !!selectedPriceTheme;

  // ---- Sort state (New Arrival / Popularity / Price Low-High / Price High-Low) ----
  const [sortOption, setSortOption] = useState("popularity");

  const handleSortChange = (id) => {
    // User ne khud filter badla — ab yeh ek GENUINE fresh query hai,
    // cache-hydration skip-guard ko force-clear kar dete hain taaki
    // niche wala effect zaroor fresh-fetch kare.
    hasHydratedFromCache.current = false;
    setSortOption(id);
  };

  // ---- Search: whether a free-text search is currently active ----
  const isSearchActive = !!searchQuery.trim();

  // Search box (e.g. "barbie") -> forwarded to the API as `search`.
  // Jab search active ho jaye, baaki filters (theme tabs, price-range theme,
  // sort) ko reset kar dete hain taaki search sirf naam/tag se match kare,
  // kisi pehle se lage filtered subset ke upar nahi.
  const handleSearchChange = (query) => {
    const trimmed = query?.trim() || "";
    hasHydratedFromCache.current = false; // genuine user action
    setSearchQuery(trimmed);

    if (trimmed) {
      setThemeFilter("all");
      setSortOption("popularity");
      setSelectedPriceTheme(null);
    }
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

  // Search tracking ke liye — apni actual redux auth slice ke naam se adjust kar lena
  const { userId } = useSelector((state) => state.auth || {});

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomRating = () => {
    return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
  };

  useEffect(() => {
    // Price-range segmentation (Budget/Value/Photogenic/Stage) aur
    // CategoryTabs theme (jaise Cocomelon) ek saath active nahi ho sakte.
    // Agar price-range theme already selected hai, to URL ke ?theme= ko
    // ignore kar dete hain taaki dono filter combine na ho jayein.
    if (selectedPriceTheme) return;

    if (theme) {
      setThemeFilter(theme);
    } else {
      setThemeFilter("all");
    }
  }, [theme, selectedPriceTheme]);

  // ================= CACHE-FIRST: subCategory resolve hote hi check karo =================
  useEffect(() => {
    addSpaces(subCategory);

    if (!subCategory) return;

    const cacheKey = `decorcat:${router.asPath}`;
    const cached = getPageCache(cacheKey);

    if (cached) {
      // Cache mila — turant hydrate karo, koi API call nahi.
      // Data ke saath-saath jo bhi FILTER laga hua tha (sort/search/
      // price-theme) woh bhi restore karo — taaki back aane par filter
      // reset na ho, aur content exactly waisa hi rahe (isse global
      // scroll-restore bhi sahi position pe automatically pahunch jaata
      // hai, kyunki content ki height match karti hai).
      setCatId(cached.data.catId);
      setCatalogueData(cached.data.catalogueData);
      setDefaultCatalogueData(cached.data.defaultCatalogueData);
      setCurrentPage(cached.data.currentPage);
      setHasMore(cached.data.hasMore);
      setSortOption(cached.data.sortOption || "popularity");
      setSearchQuery(cached.data.searchQuery || "");
      setSelectedPriceTheme(cached.data.selectedPriceTheme || null);
      setLoading(false);
      setIsInitialLoad(false);
      hasHydratedFromCache.current = true;
       if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("page-content-ready"));
  }
      return; // getSubCatId API call bhi skip
    }

    getSubCatId(subCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategory, router.asPath]);

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

  useEffect(() => {
    if (loading || isPaginating || !hasMore) return;

    const timer = setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading, isPaginating, hasMore]);


  // ================= currentPage change => fetch that page =================
  // Guard: agar yeh currentPage abhi-abhi CACHE se hydrate hua tha (page 1
  // nahi tha), to iska fetch mat karo — data already cache mein tha.
  // Yeh flag "consume-once" hai: pehli baar check karke turant clear kar
  // dete hain, taaki agla genuine auto-pagination increment normally chale.
  useEffect(() => {
    if (hasHydratedFromCache.current) {
      // Is pass mein skip — lekin flag ko yahin se clear NAHI karte,
      // kyunki neeche wala catId-effect bhi isी pass mein isi flag ko
      // check karta hai. Flag ek alag "reset" effect (sabse niche
      // declare kiya gaya, dono ke BAAD) clear karega — taaki dono
      // effects isi ek hydration-pass mein sahi se skip ho jayein.
      return;
    }
    if (catValue && currentPage !== 1) {
      getSubCatItems(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (catValue) {
      const content = DecorationCatDescriptionData[catValue] || [];
      setCurrentCategoryContent(content);
    }
  }, [catValue]);

  // Reset the price-range theme filter whenever the category GENUINELY
  // changes (user browsed from one category to another). Yeh effect
  // catValue ke pehli baar populate hone par (mount, "" -> actual value)
  // fire NAHI hona chahiye — warna cache se hydrate kiya hua
  // selectedPriceTheme turant wipe ho jaata hai aur user ko lagta hai
  // "filter hat gaya".
  const prevCatValueRef = useRef("");
  useEffect(() => {
    const prevCatValue = prevCatValueRef.current;
    prevCatValueRef.current = catValue;

    const isGenuineCategorySwitch =
      prevCatValue && catValue && prevCatValue !== catValue;

    if (isGenuineCategorySwitch) {
      setSelectedPriceTheme(null);
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

  const getSubCatId = async (subCategory) => {
    try {
      const response = await axiosApi.get(
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

  // Re-fetch page 1 whenever anything that changes the *query* (as opposed to
  // just the page number) changes: category, theme, sort order, the
  // price-range theme (Budget/Value/Photogenic/Stage), or a text search.
  useEffect(() => {
    if (!catId) return;

    if (hasHydratedFromCache.current) {
      // Is initial hydration-pass mein fresh-fetch mat karo — data
      // cache se already aa chuka hai. (Flag "reset" effect neeche
      // clear karega, isliye future genuine filter-changes normally
      // is effect ko fresh-fetch ke liye trigger karenge.)
      return;
    }

    setCatalogueData([]);
    setCurrentPage(1);
    getSubCatItems(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId, themeFilter, sortOption, selectedPriceTheme, searchQuery]);

  // ================= Hydration-flag reset =================
  // Yeh effect deliberately sabse NEECHE (baad mein) declare kiya gaya hai
  // — React effects ko component ke andar unki declaration-order mein hi
  // run karta hai. Isliye jab bhi cache-hydrate effect state update karta
  // hai (catId/currentPage badalte hain), upar wale dono fetch-effects
  // pehle apna check kar lete hain (flag abhi true hai => skip), aur
  // sabse AAKHRI mein yeh effect flag ko false kar deta hai — taaki agli
  // baar jab koi GENUINE change ho (naya filter, naya category), tab yeh
  // stale "true" flag galti se kisi zaroori fetch ko skip na kar de.
  useEffect(() => {
    if (hasHydratedFromCache.current) {
      hasHydratedFromCache.current = false;
    }
  });

const getSubCatItems = async (page) => {
    if (!catId) return;

    try {
      // Page 1 (fresh filter/theme/search/category change) => poora
      // skeleton dikhao. Page 2+ (auto-pagination) => purane products
      // hide na ho, sirf niche ek chhota loader dikhega.
      if (page === 1) {
        setLoading(true);
      } else {
        setIsPaginating(true);
      }

      const params = new URLSearchParams();
      params.set("limit", "30");
      params.set("page", String(page));

      if (sortOption === "newArrival") {
        params.set("sortBy", "newArrival");
      } else if (sortOption === "lowToHigh") {
        params.set("sortBy", "lowToHigh");
      } else if (sortOption === "highToLow") {
        params.set("sortBy", "highToLow");
      }

      if (themeFilter && themeFilter !== "all") {
        params.set("theme", themeFilter);
      }

      if (selectedPriceTheme?.priceRange) {
        const { min, max } = selectedPriceTheme.priceRange;
        if (min !== undefined && min !== null) params.set("minPrice", String(min));
        if (max !== undefined && max !== null) params.set("maxPrice", String(max));
      }

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const apiUrl = `${BASE_URL + GET_DECORATION_CAT_ITEM}v3/${catId}?${params.toString()}`;

      const response = await axiosApi.get(apiUrl);
      if (response.status === API_SUCCESS_CODE) {
        const decoratedData = response.data.data.map((item) => {
          const numericPrice = Number(item.price);
          const { discount, discountedPrice, discountDifference } = getDiscountedPrice(numericPrice);
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

        setCatalogueData((prevData) => {
          const updated = page === 1 ? decoratedData : [...prevData, ...decoratedData];

          // Jo bhi CURRENT state hai (chahe filter/sort/search laga ho ya
          // na ho) usko cache karte hain — taaki product-detail se back
          // aane par bilkul WAHI view (filter + data + scroll-matching
          // height) turant restore ho jaaye.
          setPageCache(`decorcat:${router.asPath}`, {
            catId,
            catalogueData: updated,
            defaultCatalogueData: searchQuery ? defaultCatalogueData : updated,
            currentPage: page,
            hasMore: page < response.data.pagination.totalPages,
            sortOption,
            searchQuery,
            selectedPriceTheme,
          });

          return updated;
        });

        if (!searchQuery) {
          setDefaultCatalogueData((prevData) =>
            page === 1 ? decoratedData : [...prevData, ...decoratedData]
          );
        }
        setHasMore(page < response.data.pagination.totalPages);
      }
    } catch (error) {
      // 👇 NAYA: error ho jaaye tab bhi page-1 ke case mein event fire karo,
      // warna page hamesha ke liye hidden reh jaayega (sirf safety-net
      // timer se hi reveal hoga, jo 1500ms baad hai)
      if (page === 1 && typeof window !== "undefined") {
        window.dispatchEvent(new Event("page-content-ready"));
      }
    } finally {
      if (page === 1) {
        setLoading(false);

        // 👇 NAYA: page-1 ka data successfully aa gaya, ab _app.tsx ko
        // batao reveal karne ke liye
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("page-content-ready"));
        }
      } else {
        setIsPaginating(false);
      }
      setIsInitialLoad(false);
    }
  };
  
  function trimText(text) {
    if (text.length > 60) {
      return text.slice(0, 60) + "...";
    }
    return text;
  }

  const normalizeCatValue = (val) => {
    if (!val) return "";
    return val.toLowerCase().replace(/ /g, "-");
  };

  const normalizedCat = normalizeCatValue(catValue);

  const shouldHideBanner = (name) => {
    const hideFor = ["wedding", "haldi-mehendi-decoration"];
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

    // CategoryTabs se koi theme (jaise Cocomelon) select ho raha hai —
    // isliye price-range segmentation (Budget/Value/Photogenic/Stage)
    // clear kar dete hain, dono ek saath active nahi rehne chahiye.
    hasHydratedFromCache.current = false; // genuine navigation/user action
    setSelectedPriceTheme(null);

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

  // Sorting and price-range filtering now happen server-side (sortBy /
  // minPrice / maxPrice query params in getSubCatItems), so `catalogueData`
  // arriving from the API is already in the right order and already
  // restricted to the selected price range.
  const sortedCatalogueData = catalogueData;
  const priceThemeFilteredData = catalogueData;

  const shouldShowSearchBar =
    isPriceThemeSelectorPage ||
    catValue?.toLowerCase() === "naming-ceremony-decoration";

  const highPriceProducts = sortedCatalogueData.filter((item) => Number(item.price) > 11000);

  // Small reusable skeleton block used whenever we're (re)fetching after a
  // filter/theme/sort/search change, so the UI never has to guess "empty" vs
  // "still loading" — it always knows which one it is.
  const FilterLoadingSkeleton = () => (
    <div className="skeleton-wrapper">
      {Array.from({ length: 6 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
  const handleWhatsAppClick = () => {
    const PHONE = "7338584828";
    const message = `Looking for a Custom Decoration? Our support team is ready to help!`;

    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };
  return (
    <div className="decCatPage">
      <SeoHead
        catValue={normalizedCat}
        city={city}
        locality={locality}
        theme={theme}
      />

      {isInitialLoad && loading ? (
        <div className="skeleton-wrapper">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {!isThemePage && (
            <>
              <section >
                <DecorationBanner category={normalizedCat} />
              </section>
              <SearchSortBar
                sortOption={sortOption}
                onSortChange={handleSortChange}
                searchCategoryList={searchCategoryList}
                products={sortedCatalogueData}
                onCategorySelect={(item) => openCatItems(item, themeFilter)}
                onProductSelect={handleViewDetails}
                onSearchChange={handleSearchChange}
                userId={userId}
              />

              {/* Price-range theme cards — SIRF birthday & kids-birthday-decoration pe,
                  aur search active hote hi hide ho jate hain */}
              {isPriceThemeSelectorPage && !isSearchActive && (
                <ThemeSelector
                  onSelectTheme={handleSelectPriceTheme}
                  selectedThemeId={selectedPriceTheme?.id || null}
                />
              )}
              {catValue?.toLowerCase() === "kids-birthday-decoration" && !isSearchActive && (
                <div className="category-tabs-container">
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

              {catValue?.toLowerCase() === "naming-ceremony-decoration" && !isSearchActive && (
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
              <EventDateBanner userId={userId} />
              {(isPriceThemeActive || isSearchActive) ? (

                <>
                  {loading ? (
                    <FilterLoadingSkeleton />
                  ) : priceThemeFilteredData.length > 0 ? (
                    <ProductGrid
                      data={priceThemeFilteredData}
                      onCardClick={handleViewDetails}
                      catValue={catValue}
                    />
                  ) : isSearchActive ? (
                    // Koi search result nahi mila — piche default list dikhayenge, blank nahi
                    defaultCatalogueData.length > 0 ? (
                      <ProductGrid
                        data={defaultCatalogueData}
                        onCardClick={handleViewDetails}
                        catValue={catValue}
                      />
                    ) : null
                  ) : (
                    <div className="noProductsWrapper">
                      <h2>No products found in this price range</h2>
                    </div>
                  )}
                </>
              ) : loading ? (
                // ---- No filter/search active, but a re-fetch is in flight
                // (e.g. theme tab switch, sort change) — show skeleton
                // instead of flashing "No products found" for an instant. ----
                <FilterLoadingSkeleton />
              ) : sortedCatalogueData.length === 0 ? (
                // ---- Category ke paas abhi koi product nahi (filter/search ki wajah se nahi) ----
                <div className="noProductsWrapper">
                  <h2>No products found</h2>
                </div>
              ) : (
                // ---- DEFAULT LAYOUT: banners interspersed with product grids ----
                <>
                  <ProductGrid data={sortedCatalogueData.slice(0, 4)} onCardClick={handleViewDetails} catValue={catValue} />

                  <HighPriceProduct
                    data={highPriceProducts.slice(0, 1)}
                    onCardClick={handleViewDetails}
                  />
                  <MakeItYoursBanner />
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

          {/* Grouped "load more" section — skipped while a price-range filter
              OR a search is active, to avoid showing the full catalogue
              underneath the filtered/search results */}
          {!isPriceThemeActive && !isSearchActive &&
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
          {isPaginating && (
            <div className="skeleton-wrapper" style={{ marginTop: "12px" }}>
              <CardSkeleton />
              <CardSkeleton />
            </div>
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