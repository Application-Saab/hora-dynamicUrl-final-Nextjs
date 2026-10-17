import { useEffect, useState, useRef, useMemo } from "react";
import React from "react";

import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
  API_SUCCESS_CODE,
} from "../../utils/apiconstants";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  getSubCategory,
  getDiscountedPrice,
  getRandomNumber,
  getRandomRating,
} from "@/utils/decorationCatHelpers";
import { NamingCeremonyThemes, themeFilters } from "@/utils/themeFilters";
import "@/pages/balloon-decoration/[catValue]/catvaluedecor.css";
import ProductGrid from "@/components/productGrid";
import FilterBar from "@/components/FilterBar";
import DidyouKnow from "../../assets/didyouknow.jpg";
import makeItMemorable from "../../assets/makeitmemorable.png";
import steps from "../../assets/steps.webp";
import makeitmemorablebanner from "../../assets/makeitmemorablebanner.png";
import googleRating from "../../assets/goglerating.png";
import Gurantee from "../../assets/gurantee.jpg";
import ontime from "../../assets/ontime.png";
import CategoryTabs from "@/components/CategoryTabs/index.jsx";
import CardSkeleton from "@/components/CardSkeleton";
import HighPriceProduct from "@/components/Highpriceproduct";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import SeoHead from "@/utils/SeoHead";
// `themes` bhi import karo (URL ke priceTheme=budget se theme object nikalne ke liye)
import ThemeSelector, { themes as priceThemes } from "@/components/Themeselector";
// ✅ sortOptions bhi import kiya (chip ka label dikhane ke liye)
import SearchSortBar, {
  designTypeOptions,
  sortOptions,
} from "@/components/SearchSortBar";
import DecorationBanner from "@/components/CategoryDecorationBanner";
import DecorationCatDescriptionData, {
  buildCityLinksHtml,
  buildThemeLinksHtml,
} from "@/utils/decorationCatDescritionData";
import EventDateBanner from "@/components/Eventdatebanner";
import axiosApi from "@/utils/axiosApi";
import MakeItYoursBanner from "@/components/MakeItYoursBanner";
import { getPageCache, setPageCache } from "@/utils/scrollDataCache";
import { X } from "lucide-react";

const PRICE_SORTS = ["newArrival", "lowToHigh", "highToLow"];
const VALID_SORTS = [...PRICE_SORTS];

// Backend param: designType=Wall  (multiple => "Wall,Ring")
// Agar backend multiple values repeat karke leta hai (designType=Wall&designType=Ring)
// to DESIGN_TYPE_MODE = "repeat" kar do.
const DESIGN_TYPE_PARAM_NAME = "designType";
const DESIGN_TYPE_MODE = "comma"; // "comma" | "repeat"

const getQueryValue = (query, lowerKey, legacyKey) => {
  const v = query?.[lowerKey] ?? query?.[legacyKey];
  return typeof v === "string" ? v : "";
};

const parseFiltersFromQuery = (query = {}) => {
  const rawSort = getQueryValue(query, "sortby", "sortBy").toLowerCase();
  const sortOption =
    VALID_SORTS.find((id) => id.toLowerCase() === rawSort) || "popularity";

  const search = getQueryValue(query, "search", "search").trim();

  const rawPriceTheme = getQueryValue(
    query,
    "pricetheme",
    "priceTheme",
  ).toLowerCase();
  const priceTheme =
    priceThemes.find((t) => String(t.id).toLowerCase() === rawPriceTheme) ||
    null;

  // "wall,ring" -> ["wall", "ring"] (URL ki lowercase value se internal id)
  const rawDesign = getQueryValue(query, "designtype", "designType");
  const designTypes = [
    ...new Set(
      rawDesign
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean)
        .map((v) => designTypeOptions.find((o) => o.id.toLowerCase() === v)?.id)
        .filter(Boolean),
    ),
  ];

  return { sortOption, search, priceTheme, designTypes };
};

// Cache key FILTERS se banti hai, router.asPath se nahi.
const buildCacheKey = (path, sort, priceThemeId, search, designTypes = []) =>
  `decorcat:${path}|sort=${sort || "popularity"}|price=${priceThemeId || ""}|search=${search || ""}|design=${designTypes.join(",")}`;

const DecorationCatPage = ({
  city: cityProp = "",
  locality = null,
  catValue: catValueProp = "",
  initialCatalogueData = [],
  initialCatId = "",
  initialHasMore = false,
  isDirectProductPage = false,
}) => {
  const router = useRouter();
  const pathname = router.asPath.split("?")[0];

  // URL se initial filters nikalo
  const urlFilters = parseFiltersFromQuery(router.query);
  const hasUrlFilters =
    urlFilters.sortOption !== "popularity" ||
    !!urlFilters.search ||
    !!urlFilters.priceTheme ||
    urlFilters.designTypes.length > 0;

  // Agar URL mein filter hai to SSR ka (unfiltered) data skip nahi karna
  const skipInitialFetch = useRef(
    initialCatalogueData.length > 0 && !hasUrlFilters,
  );

  const [city, setCity] = useState(cityProp || "");
  const [catValue, setCatValue] = useState(catValueProp || "");

  useEffect(() => {
    if (catValueProp) {
      setCatValue(catValueProp);
    } else if (router.isReady && router.query.catValue) {
      setCatValue(router.query.catValue);
    }

    if (cityProp) {
      setCity(cityProp);
    } else if (router.isReady && router.query.city) {
      setCity(String(router.query.city));
    }
  }, [router.isReady, router.query, catValueProp, cityProp]);

  const buildProcessedContent = (catVal, citySlug) => {
    const content = DecorationCatDescriptionData[catVal] || [];
    return content.map((item) => {
      let html = item.htmlContent;
      if (html?.includes("{{CITY_LINKS}}")) {
        html = html.replace(
          "{{CITY_LINKS}}",
          buildCityLinksHtml(catVal, citySlug),
        );
      }
      if (html?.includes("{{THEME_LINKS}}")) {
        html = html.replace(
          "{{THEME_LINKS}}",
          buildThemeLinksHtml(catVal, citySlug),
        );
      }
      return html === item.htmlContent ? item : { ...item, htmlContent: html };
    });
  };
  const hasCityPageParam = !!city;
  const [selCat, setSelCat] = useState("");
  const [catId, setCatId] = useState(initialCatId || "");
  const [showAll, setShowAll] = useState(false);
  const [currentCategoryContent, setCurrentCategoryContent] = useState(
    buildProcessedContent(
      catValueProp || catValue,
      (cityProp || "").toLowerCase(),
    ),
  );
  const { theme } = router.query;
  const hasInitialData = initialCatalogueData.length > 0;
  const [loading, setLoading] = useState(!hasInitialData);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(!hasInitialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogueData, setCatalogueData] = useState(initialCatalogueData);
  const [defaultCatalogueData, setDefaultCatalogueData] =
    useState(initialCatalogueData);
  const [hasMore, setHasMore] = useState(
    hasInitialData ? initialHasMore : true,
  );
  const [themeFilter, setThemeFilter] = useState("all");
  // ✅ CHANGE 5: initial value URL se aayegi (pehle "" thi)
  const [searchQuery, setSearchQuery] = useState(urlFilters.search);
  const selectedTheme = router.query.themes;
  const isThemePage = !!selectedTheme;

  // ✅ NEW: [theme] route (jaise /kids-birthday-decoration/hero) par search/sort bar
  // aur price selector nahi dikhana. isThemePage ko nahi badla kyunki wo neeche
  // products ki slicing/layout bhi control karta hai.
  const isThemeRoute = !!theme || isThemePage;

  // ---- Price-range theme selector state (Budget / Value / Photogenic / Stage) ----
  // ✅ CHANGE 6: initial value URL se aayegi (pehle null thi)
  const [selectedPriceTheme, setSelectedPriceTheme] = useState(
    urlFilters.priceTheme,
  );

  // ================= CACHE-FIRST BACK-NAVIGATION SUPPORT =================
  const hasHydratedFromCache = useRef(false);

  // URL ke query params update karne ka helper
  // shallow: true => getServerSideProps dobara nahi chalega, page reload nahi hoga.
  // Value null/""/undefined ho to param URL se hat jata hai.
  const updateQueryParams = (updates) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Key aur value dono lowercase. Purani camelCase keys
    // (sortBy/priceTheme/designType) URL se hata dete hain.
    Object.entries(updates).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== key) params.delete(key);

      const isEmpty =
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        params.delete(lowerKey);
      } else {
        const str = Array.isArray(value) ? value.join(",") : String(value);
        params.set(lowerKey, str.toLowerCase());
      }
    });

    const qs = params.toString().replace(/%2C/gi, ",");
    const newUrl = `${url.pathname}${qs ? `?${qs}` : ""}`;

    router.replace(newUrl, undefined, { shallow: true, scroll: false });
  };

  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;

    const url = new URL(window.location.href);
    let changed = false;

    ["sortBy", "priceTheme", "designType"].forEach((key) => {
      const value = url.searchParams.get(key);
      if (value === null) return;

      const lowerKey = key.toLowerCase();
      url.searchParams.delete(key);
      if (!url.searchParams.has(lowerKey)) {
        url.searchParams.set(lowerKey, value.toLowerCase());
      }
      changed = true;
    });

    if (changed) {
      const qs = url.searchParams.toString().replace(/%2C/gi, ",");
      router.replace(`${url.pathname}${qs ? `?${qs}` : ""}`, undefined, {
        shallow: true,
        scroll: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    router.query.sortBy,
    router.query.priceTheme,
    router.query.designType,
  ]);

  // Themed URL (…/kids-birthday-decoration/hero) par bhi user usi URL par rehta hai.
  // Sirf query add/remove hoti hai: /hero -> /hero?priceTheme=value
  const handleSelectPriceTheme = (theme) => {
    hasHydratedFromCache.current = false; // genuine user action
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      if (theme) {
        window.dataLayer.push({
          event: `price_theme_${String(theme.id).toLowerCase()}`,
          price_theme_id: theme.id,
          price_theme_label: theme.label || theme.name || theme.title || "",
          page_path: pathname,
        });
      } else {
        window.dataLayer.push({
          event: "price_theme_clear",
          page_path: pathname,
        });
      }
    }

    setSelectedPriceTheme(theme); // null = clear
    updateQueryParams({ priceTheme: theme ? theme.id : null });
  };

  // Only show the price-range theme selector on these two category pages
  const isPriceThemeSelectorPage =
    catValue?.toLowerCase() === "kids-birthday-decoration" ||
    catValue?.toLowerCase() === "birthday-decoration";

  const isPriceThemeActive = !!selectedPriceTheme;

  // ---- Sort state ----
  const [sortOption, setSortOption] = useState(urlFilters.sortOption);

  // ---- Design Type filter (multi-select: wall, ring, ...) ----
  const [designTypes, setDesignTypes] = useState(urlFilters.designTypes);
  const designTypesKey = designTypes.join(",");

  // Sort & Filter sheet ka "Apply" — sort + design type EK saath, EK hi URL update
  const handleSortFilterApply = ({
    sortOption: nextSort,
    designTypes: nextDesigns,
  }) => {
    hasHydratedFromCache.current = false;
    setSortOption(nextSort);
    setDesignTypes(nextDesigns);
    updateQueryParams({
      sortBy: nextSort === "popularity" ? null : nextSort,
      designType: nextDesigns,
    });
  };

  // ✅ Chips ke handlers: sirf wahi filter hatta hai jis par × dabaya
  const removeSortFilter = () => {
    hasHydratedFromCache.current = false;
    setSortOption("popularity");
    updateQueryParams({ sortBy: null });
  };

  const removeDesignFilter = (id) => {
    hasHydratedFromCache.current = false;
    const next = designTypes.filter((d) => d !== id);
    setDesignTypes(next);
    updateQueryParams({ designType: next });
  };

  const clearAllFilters = () => {
    hasHydratedFromCache.current = false;
    setSortOption("popularity");
    setDesignTypes([]);
    setSelectedPriceTheme(null);
    updateQueryParams({ sortBy: null, designType: null, priceTheme: null });
  };

  // ---- Search: whether a free-text search is currently active ----
  const isSearchActive = !isThemeRoute && !!searchQuery.trim();

  const handleSearchChange = (query) => {
    const trimmed = query?.trim() || "";
    hasHydratedFromCache.current = false; // genuine user action
    setSearchQuery(trimmed);

    if (trimmed) {
      setThemeFilter("all");
      setSortOption("popularity");
      setSelectedPriceTheme(null);
      setDesignTypes([]);
      // search URL mein, baaki filters URL se clear
      updateQueryParams({
        search: trimmed,
        sortBy: null,
        priceTheme: null,
        designType: null,
      });
    } else {
      updateQueryParams({ search: null });
    }
  };

  // ---- Search: "Matching Categories" source ----
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

  const { subCategory: stateSubCategory } = useSelector(
    (state) => state.state || {},
  );
  const subCategory = getSubCategory(catValue) || stateSubCategory;

  const { userId } = useSelector((state) => state.auth || {});
  const [visitorId, setVisitorId] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setVisitorId(localStorage.getItem("VISITOR_ID") || null);
    }
  }, []);

  // URL -> STATE sync (refresh, shared link, browser back/forward)
  useEffect(() => {
    if (!router.isReady) return;

    const next = parseFiltersFromQuery(router.query);

    setSortOption((prev) => (prev === next.sortOption ? prev : next.sortOption));
    setSearchQuery((prev) =>
      prev.toLowerCase() === next.search.toLowerCase() ? prev : next.search,
    );
    setSelectedPriceTheme((prev) =>
      prev?.id === next.priceTheme?.id ? prev : next.priceTheme,
    );
    setDesignTypes((prev) =>
      prev.join(",") === next.designTypes.join(",") ? prev : next.designTypes,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.isReady,
    router.query.sortby,
    router.query.sortBy,
    router.query.search,
    router.query.pricetheme,
    router.query.priceTheme,
    router.query.designtype,
    router.query.designType,
  ]);

  // URL ka [theme] (jaise "hero") hamesha apply hoga, price theme ke saath bhi.
  useEffect(() => {
    if (theme) {
      setThemeFilter(theme);
    } else {
      setThemeFilter("all");
    }
  }, [theme]);

  // initialCatId change hone par (naya SSR data) state reset karo
  const prevInitialCatIdRef = useRef(initialCatId);
  useEffect(() => {
    if (initialCatId && initialCatId !== prevInitialCatIdRef.current) {
      prevInitialCatIdRef.current = initialCatId;

      setCatId(initialCatId);
      setCatalogueData(initialCatalogueData);
      setDefaultCatalogueData(initialCatalogueData);
      setHasMore(initialCatalogueData.length > 0 ? initialHasMore : true);

      const hasFreshData = initialCatalogueData.length > 0;
      skipInitialFetch.current = hasFreshData && !hasUrlFilters;
      setLoading(!hasFreshData);
      setIsInitialLoad(!hasFreshData);

      setCurrentPage(1);
      hasHydratedFromCache.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCatId, initialCatalogueData, initialHasMore]);

  // ================= CACHE-FIRST: subCategory resolve hote hi check karo =================
  useEffect(() => {
    addSpaces(subCategory);
    if (!subCategory) return;

    const urlF = parseFiltersFromQuery(router.query);
    const cacheKey = buildCacheKey(
      pathname,
      urlF.sortOption,
      urlF.priceTheme?.id,
      urlF.search,
      urlF.designTypes,
    );
    const cached = getPageCache(cacheKey);

    if (cached) {
      setCatId(cached.data.catId);
      setCatalogueData(cached.data.catalogueData);
      setDefaultCatalogueData(cached.data.defaultCatalogueData);
      setCurrentPage(cached.data.currentPage);
      setHasMore(cached.data.hasMore);
      setSortOption(cached.data.sortOption || "popularity");
      setSearchQuery(cached.data.searchQuery || "");
      setSelectedPriceTheme(cached.data.selectedPriceTheme || null);
      setDesignTypes(cached.data.designTypes || []);
      setLoading(false);
      setIsInitialLoad(false);
      hasHydratedFromCache.current = true;
      skipInitialFetch.current = false;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("page-content-ready"));
      }
      return; // getSubCatId API call bhi skip
    }

    if (!initialCatId) {
      getSubCatId(subCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategory, router.asPath, initialCatId]);

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

  useEffect(() => {
    if (!catId) return;

    if (hasHydratedFromCache.current) {
      return;
    }

    // SSR se data aa chuka hai aur abhi koi filter change nahi hua
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      setLoading(false);
      setIsInitialLoad(false);
      return;
    }

    setCurrentPage(1);
    getSubCatItems(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId, themeFilter, sortOption, selectedPriceTheme, searchQuery, designTypesKey]);

  // ================= currentPage change => fetch that page =================
  useEffect(() => {
    if (hasHydratedFromCache.current) {
      return;
    }
    if (catValue && currentPage !== 1) {
      getSubCatItems(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (catValue) {
      setCurrentCategoryContent(
        buildProcessedContent(catValue, (city || "").toLowerCase()),
      );
    }
  }, [catValue, city]);

  // Category GENUINELY change ho to price-range theme reset karo
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

  useEffect(() => {
    if (hasHydratedFromCache.current) {
      hasHydratedFromCache.current = false;
    }
  });

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

  const getSubCatId = async (subCategory) => {
    try {
      const response = await axiosApi.get(
        BASE_URL + GET_DECORATION_CAT_ID + subCategory,
      );

      const categoryId = response.data.data?._id;

      if (categoryId) {
        setCatId(categoryId);
      } else {
        console.error(
          "getSubCatId: no _id in response for",
          subCategory,
          response?.data,
        );
      }
    } catch (error) {
      console.error(
        "getSubCatId failed for",
        subCategory,
        error?.response?.status,
        error?.message,
      );
    }
  };

  const getDiscountedPriceLocal = getDiscountedPrice;

  const getSubCatItems = async (page) => {
    if (!catId) return;

    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsPaginating(true);
      }

      const params = new URLSearchParams();
      params.set("limit", "30");
      params.set("page", String(page));

      if (PRICE_SORTS.includes(sortOption)) {
        params.set("sortBy", sortOption);
      }

      // Design Type: designType=Wall  (multiple => "Wall,Ring")
      if (designTypes.length > 0) {
        const apiValues = designTypes
          .map((id) => designTypeOptions.find((o) => o.id === id)?.apiValue)
          .filter(Boolean);

        if (DESIGN_TYPE_MODE === "repeat") {
          apiValues.forEach((v) => params.append(DESIGN_TYPE_PARAM_NAME, v));
        } else if (apiValues.length) {
          params.set(DESIGN_TYPE_PARAM_NAME, apiValues.join(","));
        }
      }

      if (themeFilter && themeFilter !== "all") {
        params.set("theme", themeFilter);
      }

      if (selectedPriceTheme?.priceRange) {
        const { min, max } = selectedPriceTheme.priceRange;
        if (min !== undefined && min !== null)
          params.set("minPrice", String(min));
        if (max !== undefined && max !== null)
          params.set("maxPrice", String(max));
      }

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const apiUrl = `${BASE_URL + GET_DECORATION_CAT_ITEM}v3/${catId}?${params.toString()}`;

      const response = await axiosApi.get(apiUrl);
      if (response.status === API_SUCCESS_CODE) {
        const decoratedData = response.data.data.map((item) => {
          const numericPrice = Number(item.price);
          const { discount, discountedPrice, discountDifference } =
            getDiscountedPriceLocal(numericPrice);
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
          const updated =
            page === 1 ? decoratedData : [...prevData, ...decoratedData];

          setPageCache(
            buildCacheKey(
              pathname,
              sortOption,
              selectedPriceTheme?.id,
              searchQuery,
              designTypes,
            ),
            {
              catId,
              catalogueData: updated,
              defaultCatalogueData: searchQuery
                ? defaultCatalogueData
                : updated,
              currentPage: page,
              hasMore: page < response.data.pagination.totalPages,
              sortOption,
              searchQuery,
              selectedPriceTheme,
              designTypes,
            },
          );

          return updated;
        });

        if (!searchQuery) {
          setDefaultCatalogueData((prevData) =>
            page === 1 ? decoratedData : [...prevData, ...decoratedData],
          );
        }
        setHasMore(page < response.data.pagination.totalPages);
      }
    } catch (error) {
      if (page === 1 && typeof window !== "undefined") {
        window.dispatchEvent(new Event("page-content-ready"));
      }
    } finally {
      if (page === 1) {
        setLoading(false);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("page-content-ready"));
        }
      } else {
        setIsPaginating(false);
      }
      setIsInitialLoad(false);
    }
  };

  const normalizeCatValue = (val) => {
    if (!val) return "";
    return val.toLowerCase().replace(/ /g, "-");
  };

  const normalizedCat = normalizeCatValue(catValue);

  const shouldHideBanner = (name) => {
    const hideFor = ["wedding", "haldi-mehendi-decoration"];
    return (
      hideFor.includes(normalizedCat) &&
      ["makeItMemorable", "DidyouKnow", "makeitmemorablebanner"].includes(name)
    );
  };

  const buildBasePath = () => {
    let base = "";
    if (city) base += `/${city.toLowerCase()}`;
    if (locality) base += `/${locality.toLowerCase()}`;
    return base;
  };

  // Real product URL for <a href>
  const getProductHref = (item) => {
    if (!item) return "#";
    const productSlug =
      item.slug ||
      item.product_slug ||
      (item.name ? item.name.toLowerCase().replace(/\s+/g, "-") : "");

    if (!productSlug || !catValue) return "#";

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);

    if (!categorySlug) return "#";
    if (isDirectProductPage) {
      return `/${categorySlug}/product/${productSlug}`;
    } else {
      return `${buildBasePath()}/${categorySlug}/${catValue}/product/${productSlug}`;
    }
  };

  const getCategoryHref = (item) => {
    if (!item?.value || !catValue) return "#";
    const categorySlug = getCategorySlugFromPath(pathname, city, locality);
    // Search se jaate waqt filters carry nahi hote, isliye query string nahi
    return `${buildBasePath()}/${categorySlug}/${catValue}/${item.value}`;
  };

  // Tracking only — navigation <a href> se hogi
  const handleViewDetails = (item) => {
    if (!item) return;
    // optional GTM yahan
  };

  const openCatItems = (item) => {
    if (!item?.value || !catValue) return;

    hasHydratedFromCache.current = false;
    // Theme page par filters carry nahi hote (URL clean rehta hai)

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);
    const finalPath = `${buildBasePath()}/${categorySlug}/${catValue}/${item.value}`;
    router.push(finalPath);
  };

  // Search dropdown se category select: filters carry nahi honge
  const openSearchCategory = (item) => {
    if (!item?.value || !catValue) return;

    hasHydratedFromCache.current = false;

    const categorySlug = getCategorySlugFromPath(pathname, city, locality);
    const finalPath = `${buildBasePath()}/${categorySlug}/${catValue}/${item.value}`;
    router.push(finalPath);
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const sortedCatalogueData = catalogueData;
  const priceThemeFilteredData = catalogueData;

  const highPriceProducts = sortedCatalogueData.filter(
    (item) => Number(item.price) > 11000,
  );

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
      "_blank",
    );
  };

  // ✅ Active filter chips: price + sort + har design type
 // ✅ Active filter chips: price + sort + har design type
const activeChips = [];

if (selectedPriceTheme) {
  activeChips.push({
    key: "price",
    label:
      selectedPriceTheme.label ||
      selectedPriceTheme.name ||
      selectedPriceTheme.title,
    onRemove: () => handleSelectPriceTheme(null),
  });
}

if (sortOption !== "popularity") {
  activeChips.push({
    key: "sort",
    label: sortOptions.find((o) => o.id === sortOption)?.label || sortOption,
    onRemove: removeSortFilter,
  });
}

designTypes.forEach((id) => {
  activeChips.push({
    key: `design-${id}`,
    label: designTypeOptions.find((o) => o.id === id)?.label || id,
    onRemove: () => removeDesignFilter(id),
  });
});

// ✅ Upar ki row mein kitne chips fit honge (width naap kar)
const wrapRef = useRef(null);
const clearRef = useRef(null);
const measureRef = useRef(null);
const [topCount, setTopCount] = useState(1);

const chipsKey = activeChips.map((c) => `${c.key}:${c.label}`).join("|");

useEffect(() => {
  const compute = () => {
    const wrap = wrapRef.current;
    const measure = measureRef.current;
    if (!wrap || !measure) return;

    const GAP = 8;
    const clearW =
      activeChips.length > 1 ? (clearRef.current?.offsetWidth || 90) + 12 : 0;
    const cs = getComputedStyle(wrap);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const available = wrap.clientWidth - padX - clearW;
    const widths = Array.from(measure.children).map((el) => el.offsetWidth);

    let used = 0;
    let count = 0;
    for (const w of widths) {
      const next = used + (count ? GAP : 0) + w;
      if (next > available) break;
      used = next;
      count++;
    }
    setTopCount(Math.max(1, count)); // kam se kam 1 chip upar
  };

  compute();
  window.addEventListener("resize", compute);
  return () => window.removeEventListener("resize", compute);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [chipsKey, loading, isInitialLoad, isSearchActive, isThemeRoute]);

const topChips = activeChips.slice(0, topCount);      // ✅ topCount use karo
const bottomChips = activeChips.slice(topCount);      // ✅

const renderChip = (chip) => (
  <span key={chip.key} className="active-filter-chip">
    {chip.label}
    <button
      type="button"
      className="active-filter-chip__close"
      aria-label={`Remove ${chip.label}`}
      onClick={chip.onRemove}
    >
      <X size={16} strokeWidth={2.5} />
    </button>
  </span>
);
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
              <section>
                <DecorationBanner category={normalizedCat} />
              </section>

              {/* Theme route (/hero etc.) par search/sort bar aur price selector nahi */}
              {!isThemeRoute && (
                <>
                  <SearchSortBar
                    sortOption={sortOption}
                    designTypes={designTypes}
                    onApplyFilters={handleSortFilterApply}
                    searchCategoryList={searchCategoryList}
                    products={sortedCatalogueData}
                    onCategorySelect={openSearchCategory}
                    onProductSelect={handleViewDetails}
                    onSearchChange={handleSearchChange}
                    getProductHref={getProductHref}
                    getCategoryHref={getCategoryHref}
                    userId={userId}
                    initialQuery={searchQuery}
                  />

                  {/* ✅ Active filter chips (price + sort + design types) */}
             {activeChips.length > 0 && !isSearchActive && (
  <div className="active-filter-wrap" ref={wrapRef}>
    {/* Sirf naapne ke liye, user ko dikhta nahi */}
    <div className="active-filter-measure" ref={measureRef} aria-hidden="true">
      {activeChips.map((chip) => (
        <span key={chip.key} className="active-filter-chip">
          {chip.label}
          <span className="active-filter-chip__close">
            <X size={16} strokeWidth={2.5} />
          </span>
        </span>
      ))}
    </div>

    <div className="active-filter-top">
      <div className="active-filter-top-chips">
        {topChips.map(renderChip)}
      </div>

      {activeChips.length > 1 && (
        <button
          type="button"
          className="active-filter-clear"
          onClick={clearAllFilters}
          ref={clearRef}
        >
          Clear All
        </button>
      )}
    </div>

    {bottomChips.length > 0 && (
      <div className="active-filter-scroll">
        {bottomChips.map(renderChip)}
      </div>
    )}
  </div>
)}               
   {isPriceThemeSelectorPage && !isSearchActive && (
                    <ThemeSelector
                      onSelectTheme={handleSelectPriceTheme}
                      selectedThemeId={selectedPriceTheme?.id || null}
                    />
                  )}
                </>
              )}

              {catValue?.toLowerCase() === "kids-birthday-decoration" &&
                !isSearchActive && (
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
                      activeValue={themeFilter}
                    />
                  </div>
                )}

              {catValue?.toLowerCase() === "naming-ceremony-decoration" &&
                !isSearchActive && (
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
                      activeValue={themeFilter}
                    />
                  </div>
                )}
              <EventDateBanner userId={userId} visitorId={visitorId} />

              {isPriceThemeActive || isSearchActive ? (
                <>
                  {loading ? (
                    <FilterLoadingSkeleton />
                  ) : priceThemeFilteredData.length > 0 ? (
                    <ProductGrid
                      data={priceThemeFilteredData}
                      onCardClick={handleViewDetails}
                      getHref={getProductHref}
                      catValue={catValue}
                      isDirectProductPage={isDirectProductPage}
                    />
                  ) : isSearchActive ? (
                    defaultCatalogueData.length > 0 ? (
                      <ProductGrid
                        data={defaultCatalogueData}
                        onCardClick={handleViewDetails}
                        getHref={getProductHref}
                        catValue={catValue}
                        isDirectProductPage={isDirectProductPage}
                      />
                    ) : null
                  ) : (
                    <div className="noProductsWrapper">
                      <h2>No products found in this price range</h2>
                    </div>
                  )}
                </>
              ) : loading ? (
                <FilterLoadingSkeleton />
              ) : sortedCatalogueData.length === 0 ? (
                <div className="noProductsWrapper">
                  <h2>No products found</h2>
                </div>
              ) : (
                <>
                  <ProductGrid
                    data={sortedCatalogueData.slice(0, 4)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                    catValue={catValue}
                    isDirectProductPage={isDirectProductPage}
                  />

                  <HighPriceProduct
                    data={highPriceProducts.slice(0, 1)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                  />
                  <MakeItYoursBanner />
                  <ProductGrid
                    data={sortedCatalogueData.slice(4, 10)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                    catValue={catValue}
                    isDirectProductPage={isDirectProductPage}
                  />

                  <HighPriceProduct
                    data={highPriceProducts.slice(1, 2)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                  />
                  {!shouldHideBanner("DidyouKnow") && (
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

                  <ProductGrid
                    data={sortedCatalogueData.slice(10, 14)}
                    onCardClick={handleViewDetails}
                    catValue={catValue}
                    getHref={getProductHref}
                    isDirectProductPage={isDirectProductPage}
                  />
                  <HighPriceProduct
                    data={highPriceProducts.slice(2, 3)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                  />
                  {!shouldHideBanner("makeItMemorable") && (
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

                  <ProductGrid
                    data={sortedCatalogueData.slice(14, 20)}
                    onCardClick={handleViewDetails}
                    catValue={catValue}
                    getHref={getProductHref}
                    isDirectProductPage={isDirectProductPage}
                  />
                  <HighPriceProduct
                    data={highPriceProducts.slice(3, 4)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                  />
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

                  <ProductGrid
                    data={sortedCatalogueData.slice(20, 26)}
                    onCardClick={handleViewDetails}
                    catValue={catValue}
                    getHref={getProductHref}
                    isDirectProductPage={isDirectProductPage}
                  />
                  <HighPriceProduct
                    data={highPriceProducts.slice(4, 5)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                  />
                  {!shouldHideBanner("makeitmemorablebanner") && (
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

                  <ProductGrid
                    data={sortedCatalogueData.slice(26, 32)}
                    onCardClick={handleViewDetails}
                    catValue={catValue}
                    getHref={getProductHref}
                    isDirectProductPage={isDirectProductPage}
                  />
                  <HighPriceProduct
                    data={highPriceProducts.slice(5, 6)}
                    onCardClick={handleViewDetails}
                    getHref={getProductHref}
                  />
                  <div className="highlight-wrapper">
                    <h3 className="highlight-title">
                      Excellence Backed by Happy Customers
                    </h3>
                    <div className="highlight-cards">
                      <div className="highlight-card">
                        <Image
                          src={googleRating}
                          alt="Google Rating"
                          width={60}
                          height={60}
                        />
                        <p>4.7+ GOOGLE RATING</p>
                      </div>
                      <div className="highlight-card">
                        <Image
                          src={ontime}
                          alt="On Time Completion"
                          width={60}
                          height={60}
                        />
                        <p>ON TIME COMPLETION</p>
                      </div>
                      <div className="highlight-card">
                        <Image
                          src={Gurantee}
                          alt="100% Full Fill Guarantee"
                          width={60}
                          height={60}
                        />
                        <p>100% FULL FILL GUARANTEE</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {!isPriceThemeActive &&
            !isSearchActive &&
            Array.from(
              {
                length: Math.ceil(
                  sortedCatalogueData.slice(isThemePage ? 0 : 32).length / 6,
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
                      getHref={getProductHref}
                      isDirectProductPage={isDirectProductPage}
                    />

                    {!isThemePage && highPriceProducts[highPriceIndex] && (
                      <HighPriceProduct
                        data={highPriceProducts.slice(
                          highPriceIndex,
                          highPriceIndex + 1,
                        )}
                        onCardClick={handleViewDetails}
                        getHref={getProductHref}
                      />
                    )}
                  </React.Fragment>
                );
              },
            )}
          {isPaginating && (
            <div className="skeleton-wrapper" style={{ marginTop: "12px" }}>
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}

          <div className="category-content">
            {Array.isArray(currentCategoryContent) &&
              currentCategoryContent.length > 0 && (
                <>
                  {currentCategoryContent.map((item, index) => (
                    <div
                      key={index}
                      className={`category-item ${!showAll && index >= 2 ? "category-item--hidden" : ""
                        }`}
                    >
                      <h1>{item.title}</h1>
                      <div
                        className="item-content"
                        dangerouslySetInnerHTML={{ __html: item.htmlContent }}
                      />
                    </div>
                  ))}

                  {currentCategoryContent.length > 2 && (
                    <button onClick={toggleShowAll} className="toggle-btn">
                      {showAll ? "See Less" : "See More"}
                    </button>
                  )}
                </>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default DecorationCatPage;