"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import cityNameToSlug from "@/utils/Citynametoslug.json";
import { BASE_URL } from "./apiconstants";
import { fetchWithError } from "./fetchWithError";
import { safeGetItem, safeSetItem } from "./safeStorage";

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

// Flag jo batayega ki user-city (tracking) API call life-time me ek baar ho chuki hai ya nahi.
// Isse refresh par dubara call nahi hoga. YE PURA FLOW ROUTE-INDEPENDENT HAI — jaisa tha waisa hi.
const CITY_API_DONE_FLAG = "cityApiCallDone";

// City URL/pill/modal logic SIRF venue-list ke liye active hai.
// Tracking API is se koi lena dena nahi rakhti — wo har page par apna kaam karti hai.
const CITY_ALLOWED_ROUTES = ["/venue-list"];

const slugToCityName = {
  delhi: "Delhi",
  mumbai: "Mumbai",
  bangalore: "Bangalore",
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

  return CITY_ALLOWED_ROUTES.some((route) => {
    const exactRegex = new RegExp(`^${route}/?$`, "i");
    return exactRegex.test(p);
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

  // Lazy-init: agar localStorage mein pehle se city save hai, to usse turant
  // pick karo — isse refresh par modal ek pal ke liye bhi flash/khulta nahi.
  const [selectedCitySlug, setSelectedCitySlug] = useState(() => {
    if (typeof window === "undefined") return "";
    return safeGetItem("selectedCity") || "";
  });

  const [showCityModal, setShowCityModal] = useState(false);

  // Batata hai ki tracking flow (background city-resolve) apna kaam kar chuka
  // hai ya nahi. Isse pehle URL-inject/modal-open decide nahi karenge — warna
  // refresh par galat waqt par modal flash ho sakta hai.
  const [citySourceReady, setCitySourceReady] = useState(false);

  /* ============================================================
   * TRACKING FLOW — BILKUL WAISA HI, ROUTE-CHECK KE BINA
   * (isko hath mat lagao, ye jaisa tha waisa hi chal raha hai)
   * ============================================================ */
  useEffect(() => {
    // Agar pehle hi (kisi bhi previous load/refresh me) API call ho chuki hai,
    // to sirf saved slug (agar hai) restore karo aur dubara API mat maaro.
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
        // Response NOT_SELECTED bhi ho, tab bhi ek baar POST call karni hai.
        safeSetItem("selectedCity", NOT_SELECTED);
        setSelectedCitySlug(NOT_SELECTED);
        await saveCityToServer(NOT_SELECTED);
      }

      // Ab flag set kar do — isse aage kabhi bhi (refresh pe bhi) dubara call nahi hogi.
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
    if (!pathname) return;

    if (!isPillVisibleRoute) {
      setShowCityModal(false);
      return;
    }

    // Case 1: URL mein pehle se city hai (e.g. /delhi/venue-list) — usi ko source of truth maano.
    const match = pathname.match(CITY_PATH_REGEX);
    if (match && match[1]) {
      const citySlugFromUrl = match[1].toLowerCase();
      setSelectedCitySlug(citySlugFromUrl);
      safeSetItem("selectedCity", citySlugFromUrl);
      setShowCityModal(false);
      return;
    }

    // Case 2: URL mein city nahi hai. Jab tak tracking flow apna resolve
    // complete na kar le, kuch mat karo (na modal, na redirect) — warna
    // refresh par galat waqt par modal flash ho sakta hai.
    if (!citySourceReady) return;

    // Case 3: City pata hai (localStorage/state se) — URL mein silently inject karo.
    if (selectedCitySlug && selectedCitySlug !== NOT_SELECTED) {
      const stripped = stripAllCitySegments(pathname);
      const newPath = `/${selectedCitySlug}${stripped === "/" ? "" : stripped}`;

      if (newPath !== pathname) {
        setUrlSilently(newPath, { replace: true });
      }
      setShowCityModal(false);
      return;
    }

    // Case 4: City pata hi nahi hai — user se poochna padega.
    setShowCityModal(true);
  }, [pathname, isPillVisibleRoute, citySourceReady, selectedCitySlug, setUrlSilently]);

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
      safeSetItem("selectedCity", slug);
      setSelectedCitySlug(slug);
      saveCityToServer(cityName);

      const strippedPath = stripAllCitySegments(pathname);
      const newPath = `/${slug}${strippedPath === "/" ? "" : strippedPath}`;
      setUrlSilently(newPath);
    },
    [pathname, setUrlSilently]
  );

  const dismissCityModal = useCallback(() => {
    setShowCityModal(false);
  }, []);

  // For places (e.g. Footer city links) that navigate via a plain <Link>
  // straight to a specific city+page URL. This only keeps the selected-city
  // state/localStorage/API in sync — it does NOT touch the URL.
  const syncSelectedCity = useCallback((cityName) => {
    if (!cityName) return;

    const slug = cityNameToSlug[cityName] || cityName.toLowerCase();
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