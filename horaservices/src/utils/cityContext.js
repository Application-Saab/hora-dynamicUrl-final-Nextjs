"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import cityNameToSlug from "@/utils/cityNameToSlug";
import { BASE_URL } from "./apiconstants";

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

const CITY_ALLOWED_ROUTES = [
  "/balloon-decoration",
  "/photography-page",
  "/book-chef-cook-for-party",
  "/party-food-delivery-live-catering-buffet/party-food-delivery",
  "/party-food-delivery-live-catering-buffet/party-live-buffet-catering",
  "/aboutus",
  "/contactus",
  "/venue-list",
  "/photo-gallery",
];


const stripAllCitySegments = (path) => {
  let result = path || "/";
  let match;
  while ((match = result.match(CITY_PATH_REGEX))) {
    result = result.slice(match[0].length);
    if (!result.startsWith("/")) result = "/" + result;
  }
  return result;
};

// ✅ App me kahin aur (tracking script) VISITOR_ID (uppercase) already set kar raha hai —
// isi key ko reuse karo, alag "visitorId" key mat banao warna do sources of truth ban jayenge
const getOrCreateVisitorId = () => {
  if (typeof window === "undefined") return "";
  let visitorId = localStorage.getItem("VISITOR_ID");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("VISITOR_ID", visitorId);
  }
  return visitorId;
};

// ✅ City select hote hi DB me save — fire-and-forget, UI block nahi hoga
const saveCityToServer = async (cityName) => {
  try {
    const userId = localStorage.getItem("userID") || "";
    const visitorId = getOrCreateVisitorId();

    await fetch(`${BASE_URL}/api/event-dates/user-city`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, visitorId, cityName }),
    });
  } catch (err) {
    // ✅ API fail ho jaye to bhi user experience kharab nahi hona chahiye
    console.error("Failed to save city to server:", err);
  }
};

// ✅ localStorage me city na mile to DB se try karo (returning user, naya device/browser)
// ASSUMPTION: response shape { cityName: "Bengaluru" } — apne actual API response ke
// hisaab se neeche "data?.cityName" wali line adjust kar lena
const fetchCityFromServer = async () => {
  try {
    const userId = localStorage.getItem("userID") || "";
    const visitorId = getOrCreateVisitorId();

    // dono na hon to DB me record milne ka koi chance nahi — call hi mat karo
    if (!userId && !visitorId) return null;

    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (visitorId) params.append("visitorId", visitorId);

    const res = await fetch(`${BASE_URL}/api/event-dates/user-city?${params.toString()}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data?.cityName || null;
  } catch (err) {
    console.error("Failed to fetch city from server:", err);
    return null;
  }
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

  // ✅ Sirf allowed list wale routes par hi city feature "on" hai.
  // Home route ("/") ko alag se exact-match check kiya hai — agar "/" ko
  // CITY_ALLOWED_ROUTES array mein startsWith ke saath daalte to HAR route
  // match ho jaata (kyunki har path "/" se hi shuru hota hai).
// ✅ Sirf allowed list wale routes par hi city feature "on" hai.
// Home route ("/") ko alag se exact-match check kiya hai — agar "/" ko
// CITY_ALLOWED_ROUTES array mein startsWith ke saath daalte to HAR route
// match ho jaata (kyunki har path "/" se hi shuru hota hai).
const isCityAllowedRoute =
  pathWithoutCity === "/" ||
  CITY_ALLOWED_ROUTES.some((route) => {
    if (pathWithoutCity.startsWith(route)) return true;
    const localityPrefixed = new RegExp(`^/[^/]+${route}(?:/|$)`);
    return localityPrefixed.test(pathWithoutCity);
  });
  // Baaki sab jagah dono hidden — allowed na ho to disabled/hidden true
  const isCityDisabledRoute = !isCityAllowedRoute;
  const isPillHiddenRoute = !isCityAllowedRoute;

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

    // ✅ localStorage khaali hai — DB me pehle se koi city saved hai kya, wo check karo
    // (naya device/browser ya cache clear hone ke case me useful)
    let cancelled = false;

    fetchCityFromServer().then((cityName) => {
      if (cancelled) return;

      if (cityName) {
        const slug = cityNameToSlug[cityName] || cityName.toLowerCase();
        localStorage.setItem("selectedCity", slug);
        setSelectedCitySlug(slug);
        setShowCityModal(false);
      } else {
        setSelectedCitySlug("");
        setShowCityModal(!isCityDisabledRoute);
      }
    });

    return () => {
      cancelled = true;
    };
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

    // ✅ localStorage ke saath-saath DB me bhi city save karo (fire-and-forget)
    saveCityToServer(cityName);

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