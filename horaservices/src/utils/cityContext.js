"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import cityNameToSlug from "@/utils/Citynametoslug.json";
import { BASE_URL } from "./apiconstants";
import { fetchWithError } from "./fetchWithError";
import { safeGetItem, safeSetItem } from "./safeStorage";
import { slugToCityName } from "./validCities";
import { CITY_ROUTES } from "./routeConfig";
import { gtmPush, GTM_EVENTS } from "@/utils/citygtm";

const CityContext = createContext({
  selectedCitySlug: "",
  selectedCityName: "",
  showCityModal: false,
  isPillVisibleRoute: false,
  setShowCityModal: () => {
    console.warn("useCity() called outside <CityProvider> — wrap this component in CityProvider.");
  },
  selectCity: () => {
    console.warn("useCity() called outside <CityProvider> — wrap this component in CityProvider.");
  },
  dismissCityModal: () => {
    console.warn("useCity() called outside <CityProvider> — wrap this component in CityProvider.");
  },
  syncSelectedCity: () => {
    console.warn("useCity() called outside <CityProvider> — wrap this component in CityProvider.");
  },
});

const NOT_SELECTED = "NOT_SELECTED";
const CITY_LIST = [...new Set(Object.values(cityNameToSlug))];
const CITY_PATH_REGEX = new RegExp(`^/(${CITY_LIST.join("|")})(?=/|$)`, "i");

// Tracking (user-city) API lifetime me sirf ek baar. Route-independent.
const CITY_API_DONE_FLAG = "cityApiCallDone";

// City URL/pill/modal logic SIRF venue-list ke liye active.
const CITY_OPTIONAL_CHILD_ROUTES = [
  "/chef-near-me",
  "/photography/product",
  "/balloon-decoration/product",
];

const isCityOptionalChildRoute = (pathname) => {
  if (!pathname) return false;

  const cleanPath = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");

  return CITY_OPTIONAL_CHILD_ROUTES.some((baseRoute) => {
    const normalizedBaseRoute = baseRoute.replace(/\/+$/, "");
    return cleanPath.startsWith(`${normalizedBaseRoute}/`);
  });
};

const stripAllCitySegments = (path) => {
  let result = path || "/";
  let match;

  while ((match = result.match(CITY_PATH_REGEX))) {
    result = result.slice(match[0].length);
    if (!result.startsWith("/")) {
      result = "/" + result;
    }
  }

  return result;
};

const isRouteCityAllowed = (strippedPath) => {
  const p = strippedPath || "/";

  return CITY_ROUTES.some((route) => {
    const prefixRegex = new RegExp(`^${route}(/.*)?$`, "i");
    return prefixRegex.test(p);
  });
};

const getOrCreateVisitorId = () => {
  if (typeof window === "undefined") return "";
  let visitorId = safeGetItem("VISITOR_ID");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    safeSetItem("VISITOR_ID", visitorId);
  }
  return visitorId;
};

const saveCityToServer = async (cityName) => {
  try {
    const userId = safeGetItem("userID") || "";
    const visitorId = getOrCreateVisitorId();

    await fetchWithError(`${BASE_URL}/api/event-dates/user-city`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, visitorId, cityName }),
    });
  } catch (err) {
    console.error("Failed to save city to server:", err);
  }
};

const extractCityNameFromMyEvents = (json) => {
  if (!json) return null;

  const data = json.data ?? json;

  if (data?.cityName) return data.cityName;
  if (data?.user?.cityName) return data.user.cityName;
  if (data?.userDetails?.cityName) return data.userDetails.cityName;
  if (data?.city) return data.city;

  const events = data?.eventDates;
  if (Array.isArray(events) && events.length > 0) {
    const withCity = events.find((ev) => ev?.cityName || ev?.city);
    if (withCity) return withCity.cityName || withCity.city;
  }

  return null;
};

const fetchCityFromServer = async () => {
  try {
    const userId = safeGetItem("userID") || "";
    const visitorId = getOrCreateVisitorId();

    if (!userId && !visitorId) {
      return null;
    }

    const params = new URLSearchParams();
    if (userId) {
      params.append("userId", userId);
    } else {
      params.append("visitorId", visitorId);
    } 

    const res = await fetchWithError(`${BASE_URL}/api/event-dates/my-events?${params.toString()}`);

    if (!res.ok) {
      return null;
    }

    const json = await res.json();

    if (json?.error) {
      console.warn("my-events returned an error while resolving city:", json.message);
      return null;
    }

    return extractCityNameFromMyEvents(json);
  } catch (err) {
    console.error("Failed to fetch city from server:", err);
    return null;
  }
};

export const CityProvider = ({ children }) => {
  const router = useRouter();
  const nextPathname = usePathname();

  const [pathname, setPathname] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return nextPathname || "/";
  });

  useEffect(() => {
    if (!nextPathname) return;
    setPathname(nextPathname);
  }, [nextPathname]);

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const setUrlSilently = useCallback(
    (newPath, { replace = false } = {}) => {
      const target = newPath || "/";
      const navigate = replace ? router.replace : router.push;
      navigate(target, { scroll: false });
    },
    [router]
  );

  const [selectedCitySlug, setSelectedCitySlug] = useState("");

  useEffect(() => {
    const saved = safeGetItem("selectedCity") || "";
    if (saved) setSelectedCitySlug(saved);
  }, []);

  const [showCityModal, setShowCityModal] = useState(false);
  const [citySourceReady, setCitySourceReady] = useState(false);

  /* ============================================================
   * TRACKING FLOW — logic wahi hai, sirf GTM push add hua hai
   * ============================================================ */
  useEffect(() => {
    const alreadyDone = safeGetItem(CITY_API_DONE_FLAG);
    if (alreadyDone) {
      const savedSlug = safeGetItem("selectedCity");
      if (savedSlug && savedSlug !== NOT_SELECTED) {
        setSelectedCitySlug(savedSlug);
      }
      setCitySourceReady(true);
      return;
    }

    let cancelled = false;

    const resolveCityOnce = async () => {
      const cityName = await fetchCityFromServer();

      if (cancelled) return;

      if (cityName && cityName !== NOT_SELECTED) {
        const slug = cityNameToSlug[cityName] || cityName.toLowerCase();
        safeSetItem("selectedCity", slug);
        setSelectedCitySlug(slug);
      } else {
        safeSetItem("selectedCity", NOT_SELECTED);
        setSelectedCitySlug(NOT_SELECTED);
        await saveCityToServer(NOT_SELECTED);
      }

      safeSetItem(CITY_API_DONE_FLAG, "true");

      if (!cancelled) setCitySourceReady(true);
    };

    resolveCityOnce();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ============================================================
   * UI + URL LAYER — SIRF venue-list PAR ACTIVE
   * Tracking flow se independent hai, usko touch nahi karta.
   * ============================================================ */
  const pathWithoutCity = stripAllCitySegments(pathname || "/");
  const isPillVisibleRoute = isRouteCityAllowed(pathWithoutCity);

  useEffect(() => {
    const handlePathCity = async () => {
      if (!pathname) return;

    // ============================================================
    // CITY OPTIONAL CHILD ROUTE
    // Example:
    // /chef-near-me/order-details
    //
    // Is route ko city ke sath force nahi karna hai.
    // ============================================================
    if (isCityOptionalChildRoute(pathname)) {
      setShowCityModal(false);
      return;
    }

    const match = pathname.match(CITY_PATH_REGEX);

    if (!isPillVisibleRoute) {
      setShowCityModal(false);

      // GUARD 1: city already in URL on a disallowed route — strip ONLY
      // the city segment, keep the rest of the current page exactly as is.
      // if (match) {
      //   const restOfCurrentPage = pathname.slice(match[0].length);
      //   const cleanedPath = restOfCurrentPage.startsWith("/")
      //     ? restOfCurrentPage
      //     : "/" + restOfCurrentPage;

      //   if (cleanedPath && cleanedPath !== pathname) {
      //     setUrlSilently(cleanedPath, { replace: true });
      //   }
      // }
      return;
    }

    // Case 1: URL me city hai — wahi source of truth.
    if (match && match[1]) {
      const citySlugFromUrl = match[1].toLowerCase();
      setSelectedCitySlug(citySlugFromUrl);
      safeSetItem("selectedCity", citySlugFromUrl);
      await saveCityToServer(citySlugFromUrl);
      setShowCityModal(false);
      return;
    }

    // Case 2: tracking flow abhi resolve ho raha hai.
    if (!citySourceReady) return;

    // Case 3: city pata hai — URL me silently inject.
    if (selectedCitySlug && selectedCitySlug !== NOT_SELECTED) {
      const stripped = stripAllCitySegments(pathname);
      const newPath = `/${selectedCitySlug}${stripped === "/" ? "" : stripped}`;

      if (newPath !== pathname) {
        setUrlSilently(newPath, { replace: true });
      }
      setShowCityModal(false);
      return;
    }

    // Case 4: city pata nahi — modal kholo.
    setShowCityModal(true);
    }
    handlePathCity();
  }, [pathname, isPillVisibleRoute, citySourceReady, selectedCitySlug, setUrlSilently]);

  // GTM: modal sirf tab count ho jab sach me khule (false -> true transition).
  useEffect(() => {
    if (!showCityModal) return;
    gtmPush(GTM_EVENTS.CITY_MODAL_VIEW, {
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }, [showCityModal]);

  const selectCity = useCallback(
    (cityName) => {
      setShowCityModal(false);

      if (!cityName) {
        safeSetItem("selectedCity", NOT_SELECTED);
        setSelectedCitySlug(NOT_SELECTED);
        saveCityToServer(NOT_SELECTED);

        const restOfPath = stripAllCitySegments(pathname);
        setUrlSilently(restOfPath || "/");
        return;
      }

      const slug = cityNameToSlug[cityName] || cityName.toLowerCase();

      gtmPush(GTM_EVENTS.CITY_SELECTED, {
        city_name: cityName,
        city_slug: slug,
        source: "modal",
        page_path: pathname,
      });

      safeSetItem("selectedCity", slug);
      setSelectedCitySlug(slug);
      saveCityToServer(cityName);

      const strippedPath = stripAllCitySegments(pathname);

      if (isRouteCityAllowed(strippedPath)) {
        const newPath = `/${slug}${strippedPath === "/" ? "" : strippedPath}`;
        setUrlSilently(newPath);
      }
    },
    [pathname, setUrlSilently]
  );

  const dismissCityModal = useCallback(() => {
    setShowCityModal(false);
  }, []);

  // Footer city links ke liye: URL ko touch nahi karta, sirf state/storage/API sync.
  const syncSelectedCity = useCallback((cityName) => {
    if (!cityName) return;

    const slug = cityNameToSlug[cityName] || cityName.toLowerCase();

    gtmPush(GTM_EVENTS.CITY_SELECTED, {
      city_name: cityName,
      city_slug: slug,
      source: "footer",
    });

    safeSetItem("selectedCity", slug);
    setSelectedCitySlug(slug);
    saveCityToServer(cityName);
  }, []);

  const selectedCityName = slugToCityName[selectedCitySlug] || "";

  return (
    <CityContext.Provider
      value={{
        selectedCitySlug,
        selectedCityName,
        showCityModal,
        setShowCityModal,
        selectCity,
        dismissCityModal,
        syncSelectedCity,
        isPillVisibleRoute,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);