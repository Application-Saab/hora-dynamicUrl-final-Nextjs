"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import cityNameToSlug from "@/utils/cityNameToSlug";
import { BASE_URL } from "./apiconstants";
import { fetchWithError } from "./fetchWithError";
import { safeGetItem, safeSetItem } from "./safeStorage";

const CityContext = createContext({
  selectedCitySlug: "",
  selectedCityName: "",
});

const NOT_SELECTED = "NOT_SELECTED";

// Flag jo batayega ki user-city API call life-time me ek baar ho chuki hai ya nahi.
// Isse refresh par dubara call nahi hoga.
const CITY_API_DONE_FLAG = "cityApiCallDone";

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
  const [selectedCitySlug, setSelectedCitySlug] = useState("");

  useEffect(() => {
    // Agar pehle hi (kisi bhi previous load/refresh me) API call ho chuki hai,
    // to sirf saved slug (agar hai) restore karo aur dubara API mat maaro.
    const alreadyDone = safeGetItem(CITY_API_DONE_FLAG);
    if (alreadyDone) {
      const savedSlug = safeGetItem("selectedCity");
      if (savedSlug && savedSlug !== NOT_SELECTED) {
        setSelectedCitySlug(savedSlug);
      }
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
    };

    resolveCityOnce();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCityName = slugToCityName[selectedCitySlug] || "";

  return (
    <CityContext.Provider value={{ selectedCitySlug, selectedCityName }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);