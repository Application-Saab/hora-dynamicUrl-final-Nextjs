"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import cityNameToSlug from "@/utils/cityNameToSlug";
import { BASE_URL } from "./apiconstants";
import { fetchWithError } from "./fetchWithError";
import { safeGetItem, safeSetItem } from "./safeStorage";

const CityContext = createContext({
  selectedCitySlug: "",
  selectedCityName: "",
  showCityModal: false,
  isCityDisabledRoute: false,
  isPillHiddenRoute: false,

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

const slugToCityName = {
  delhi: "Delhi",
  mumbai: "Mumbai",
  bengaluru: "Bengaluru",
  noida: "Noida",
  ghaziabad: "Ghaziabad",
  gurugram: "Gurgaon",
  faridabad: "Faridabad",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  kolkata: "Kolkata",
  lucknow: "Lucknow",
  kanpur: "Kanpur",
  indore: "Indore",
  surat: "Surat",
  bhopal: "Bhopal",
  goa: "Goa",
  pune: "Pune",
  others: "Others",
};

const CITY_ALLOWED_ROUTES = [
  "/balloon-decoration",
  "/photography-page",
  // "/book-chef-cook-for-party",
  // "/party-food-delivery-live-catering-buffet/party-food-delivery",
  // "/party-food-delivery-live-catering-buffet/party-live-buffet-catering",
  "/venue-list",
  // "/photo-gallery",
];

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

  return (
    p === "/" ||
    CITY_ALLOWED_ROUTES.some((route) => {
      if (p.startsWith(route)) return true;

      const localityPrefixed = new RegExp(`^/[^/]+${route}(?:/|$)`);
      return localityPrefixed.test(p);
    })
  );
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        visitorId,
        cityName,
      }),
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
    if (userId) params.append("userId", userId);
    if (visitorId) params.append("visitorId", visitorId);

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
  const nextPathname = usePathname();
  const router = useRouter();

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

      window.dispatchEvent(
        new CustomEvent("city:changed", {
          detail: { path: target },
        })
      );
    },
    [router]
  );

  const [selectedCitySlug, setSelectedCitySlug] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);

  const dbCityPromiseRef = useRef(null);
  const dbCityResolvedRef = useRef(undefined);

  useEffect(() => {
    dbCityPromiseRef.current = fetchCityFromServer().then((cityName) => {
      dbCityResolvedRef.current = cityName || null;
      return cityName;
    });
  }, []);

  const pathWithoutCity = stripAllCitySegments(pathname || "/");
  const isCityAllowedRoute = isRouteCityAllowed(pathWithoutCity);
  const isCityDisabledRoute = !isCityAllowedRoute;
  const isPillHiddenRoute = !isCityAllowedRoute;

  const injectCityIntoUrlIfAllowed = useCallback(
    (slug) => {
      if (!slug || slug === NOT_SELECTED) return;

      const currentPath = pathname || "/";

      if (currentPath.match(CITY_PATH_REGEX)) {
        return;
      }

      const stripped = stripAllCitySegments(currentPath);

      if (!isRouteCityAllowed(stripped)) return;

      const newPath = `/${slug}${stripped === "/" ? "" : stripped}`;

      if (newPath !== currentPath) {
        setUrlSilently(newPath, { replace: true });
      }
    },
    [pathname, setUrlSilently]
  );

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const match = pathname.match(CITY_PATH_REGEX);

    if (match && match[1]) {
      const citySlugFromUrl = match[1].toLowerCase();
      const restAfterFirstCity = pathname.slice(match[0].length);

      const cleanedRest = stripAllCitySegments(
        restAfterFirstCity.startsWith("/") ? restAfterFirstCity : "/" + restAfterFirstCity
      );

      const isStacked = restAfterFirstCity !== cleanedRest;
      const routeAllowsCity = isRouteCityAllowed(cleanedRest);

      if (!routeAllowsCity) {
        setUrlSilently(cleanedRest || "/", { replace: true });
      } else if (isStacked) {
        const canonicalPath = `/${citySlugFromUrl}${cleanedRest === "/" ? "" : cleanedRest}`;
        setUrlSilently(canonicalPath || "/", { replace: true });
      }

      setSelectedCitySlug(citySlugFromUrl);
      safeSetItem("selectedCity", citySlugFromUrl);
      setShowCityModal(false);

      return;
    }

    const savedSlug = localStorage.getItem("selectedCity");

    if (savedSlug && savedSlug !== NOT_SELECTED) {
      setSelectedCitySlug(savedSlug);
      setShowCityModal(false);
      injectCityIntoUrlIfAllowed(savedSlug);
      return;
    }

    let cancelled = false;

    const resolveCity = async () => {
      const cityName = await (dbCityPromiseRef.current || fetchCityFromServer());

      if (cancelled) {
        return;
      }

      if (cityName && cityName !== NOT_SELECTED) {
        const slug = cityNameToSlug[cityName] || cityName.toLowerCase();
        safeSetItem("selectedCity", slug);
        setSelectedCitySlug(slug);
        setShowCityModal(false);
        dbCityResolvedRef.current = cityName;
        injectCityIntoUrlIfAllowed(slug);

        return;
      }

      localStorage.setItem("selectedCity", NOT_SELECTED);
      setSelectedCitySlug(NOT_SELECTED);
      dbCityResolvedRef.current = NOT_SELECTED;

      await saveCityToServer(NOT_SELECTED);

      if (cancelled) {
        return;
      }

      setShowCityModal(!isCityDisabledRoute);
    };

    resolveCity();

    return () => {
      cancelled = true;
    };
  }, [pathname, isCityDisabledRoute, setUrlSilently, injectCityIntoUrlIfAllowed]);

  const selectCity = (cityName) => {
    setShowCityModal(false);

    if (!cityName) {
      localStorage.setItem("selectedCity", NOT_SELECTED);
      setSelectedCitySlug(NOT_SELECTED);
      dbCityResolvedRef.current = NOT_SELECTED;

      saveCityToServer(NOT_SELECTED);

      const restOfPath = stripAllCitySegments(pathname);
      setUrlSilently(restOfPath || "/");

      return;
    }

    const slug = cityNameToSlug[cityName] || cityName.toLowerCase();

    safeSetItem("selectedCity", slug);
    setSelectedCitySlug(slug);

    saveCityToServer(cityName);
    dbCityResolvedRef.current = cityName;

    const strippedPath = stripAllCitySegments(pathname);
    const restOfPath = strippedPath.replace(new RegExp(`^/${slug}(?=/|$)`, "i"), "") || "/";

    const routeAllowsCity = isRouteCityAllowed(strippedPath);

    setUrlSilently(
      routeAllowsCity ? `/${slug}${restOfPath === "/" ? "" : restOfPath}` : restOfPath
    );
  };

  const dismissCityModal = useCallback(async () => {
    const cityName =
      dbCityResolvedRef.current !== undefined
        ? dbCityResolvedRef.current
        : await (dbCityPromiseRef.current || fetchCityFromServer());

    if (cityName && cityName !== NOT_SELECTED) {
      const slug = cityNameToSlug[cityName] || cityName.toLowerCase();

      localStorage.setItem("selectedCity", slug);
      setSelectedCitySlug(slug);
      setShowCityModal(false);
      injectCityIntoUrlIfAllowed(slug);

      return;
    }

    localStorage.setItem("selectedCity", NOT_SELECTED);
    setSelectedCitySlug(NOT_SELECTED);
    dbCityResolvedRef.current = NOT_SELECTED;

    saveCityToServer(NOT_SELECTED);
    setShowCityModal(false);
  }, [injectCityIntoUrlIfAllowed]);

  const syncSelectedCity = useCallback((cityName) => {
    if (!cityName) return;

    const slug = cityNameToSlug[cityName] || cityName.toLowerCase();

    localStorage.setItem("selectedCity", slug);
    setSelectedCitySlug(slug);
    dbCityResolvedRef.current = cityName;

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
        isCityDisabledRoute,
        isPillHiddenRoute,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);