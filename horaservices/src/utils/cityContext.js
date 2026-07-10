
"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import cityNameToSlug from "@/utils/cityNameToSlug";

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
});

const CITY_LIST = [...new Set(Object.values(cityNameToSlug))]; // dedupe slugs, e.g. "bengaluru" and "gurugram" appear twice
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
};

const CITY_POPUP_EXCLUDED_ROUTES = [
  "/balloon-decoration",
  "/photography-page",
  "/book-chef-cook-for-party",
  "/party-food-delivery-live-catering-buffet/party-food-delivery",
  "/party-food-delivery-live-catering-buffet/party-live-buffet-catering",
  "/aboutus",
  "/contactus",
];

const CITY_PILL_HIDDEN_ROUTES = ["/photo-gallery"];

const stripAllCitySegments = (path) => {
  let result = path || "/";
  let match;
  while ((match = result.match(CITY_PATH_REGEX))) {
    result = result.slice(match[0].length);
    if (!result.startsWith("/")) result = "/" + result;
  }
  return result;
};

export const CityProvider = ({ children }) => {
  const nextPathname = usePathname();

  const [pathname, setPathname] = useState(nextPathname || "/");

  useEffect(() => {
    if (nextPathname) setPathname(nextPathname);
  }, [nextPathname]);

  // Browser back/forward button dabane par bhi sync rahe
  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // ✅ Native URL update helper — router.push/replace ki jagah ye use hoga
  const setUrlSilently = useCallback((newPath, { replace = false } = {}) => {
    if (typeof window === "undefined") return;
    if (replace) {
      window.history.replaceState(window.history.state, "", newPath);
    } else {
      window.history.pushState({ ...window.history.state }, "", newPath);
    }
    setPathname(newPath);
    // ✅ IMPORTANT: window.history.pushState/replaceState se Next.js ka
    // Pages Router (useRouter().query wala) ko pata NAHI chalta ki
    // navigation hua hai — router.query stale reh jaata hai.
    // Isliye ek custom event dispatch karo. Pages Router ke pages
    // (jaise pages/[city]/balloon-decoration/index.jsx) ise listen
    // karke apni local city-state ko URL se manually re-sync kar sakte hain.
    window.dispatchEvent(new CustomEvent("city:changed", { detail: { path: newPath } }));
  }, []);

  const [selectedCitySlug, setSelectedCitySlug] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);

  const pathWithoutCity = stripAllCitySegments(pathname || "/");

  const isCityDisabledRoute = CITY_POPUP_EXCLUDED_ROUTES.some((route) =>
    pathWithoutCity.startsWith(route)
  );

  const isPillHiddenRoute = CITY_PILL_HIDDEN_ROUTES.some((route) =>
    pathWithoutCity.startsWith(route)
  );

  useEffect(() => {
    if (!pathname) return;

    const match = pathname.match(CITY_PATH_REGEX);
    if (match && match[1]) {
      const citySlugFromUrl = match[1].toLowerCase();

      const restAfterFirstCity = pathname.slice(match[0].length);
      const cleanedRest = stripAllCitySegments(
        restAfterFirstCity.startsWith("/") ? restAfterFirstCity : "/" + restAfterFirstCity
      );
      const isStacked = restAfterFirstCity !== cleanedRest;

      if (isStacked) {
        const canonicalPath = `/${citySlugFromUrl}${cleanedRest === "/" ? "" : cleanedRest}`;
        // ✅ router.replace() ki jagah silent replaceState — URL clean ho jayega,
        // koi naya route-fetch/hang trigger nahi hoga
        setUrlSilently(canonicalPath || "/", { replace: true });
      }

      setSelectedCitySlug(citySlugFromUrl);
      localStorage.setItem("selectedCity", citySlugFromUrl);
      setShowCityModal(false);
      return;
    }

    const savedSlug = localStorage.getItem("selectedCity");
    if (savedSlug) {
      setSelectedCitySlug(savedSlug);
      setShowCityModal(false);
      return;
    }

    setSelectedCitySlug("");
    setShowCityModal(!isCityDisabledRoute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isCityDisabledRoute]);

  const selectCity = (cityName) => {
    setShowCityModal(false);

    if (!cityName || cityName === "Others") {
      localStorage.removeItem("selectedCity");
      setSelectedCitySlug("");
      const restOfPath = stripAllCitySegments(pathname);
      // ✅ router.push() ki jagah silent pushState
      setUrlSilently(restOfPath || "/");
      return;
    }

    const slug = cityNameToSlug[cityName] || cityName.toLowerCase();

    localStorage.setItem("selectedCity", slug);
    setSelectedCitySlug(slug);

    const restOfPath = stripAllCitySegments(pathname);
    // ✅ router.push() ki jagah silent pushState — URL turant update hoga,
    // page hang/blank nahi hoga, aur "page not found" bhi nahi aayega
    // kyunki hum Next.js se koi naya route resolve karne ko keh hi nahi rahe
    setUrlSilently(`/${slug}${restOfPath === "/" ? "" : restOfPath}`);
  };

  const selectedCityName = slugToCityName[selectedCitySlug] || "";

  return (
    <CityContext.Provider
      value={{
        selectedCitySlug,
        selectedCityName,
        showCityModal,
        setShowCityModal,
        selectCity,
        isCityDisabledRoute,
        isPillHiddenRoute,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);