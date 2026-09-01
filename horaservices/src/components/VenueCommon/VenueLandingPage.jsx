import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import "@/components/wonderland/wonderland.css";
import TopBanner from "@/components/Venue/Topbanner";
import venueTopBanner from "@/assets/venuelanding/Topbanner.webp";
import VenueCircle from "@/components/Venue/VenueCircle";
import VenueList from "@/components/venueCommon/InvitesListing";
import VenueFeatures from "@/components/Venue/VenueFeatures";
import "@/pages/venue-list/venue/venue.css";
import { useCity } from "@/utils/cityContext";
import { safeGetItem } from "@/utils/safeStorage";
import VenueSearchBar from "@/components/Venue/Venuesearchbar";
import Head from "next/head";
import { venueData } from "@/utils/venueCircleData.js";

function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "venue-list") return "";
  return parts[0] || "";
}

const VenuelandMainPage = ({
  city: propCity = null,
  citySlug: propCitySlug = null,
  initialVenues = null,
  initialEventType = "Birthday",
  initialVenueType = "all",
}) => {
  const router = useRouter();
  const { selectedCityName } = useCity();
  const { city: queryCity } = router.query;

  const [pathCitySlug, setPathCitySlug] = useState(propCitySlug || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathCitySlug(getCitySlugFromPath(window.location.pathname));
    }
  }, [router.asPath]);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState("");
  const [activeEvent, setActiveEvent] = useState(initialEventType);
  const [activeVenueType, setActiveVenueType] = useState(initialVenueType);
  const [guestCapacity, setGuestCapacity] = useState("");
  const [searchText, setSearchText] = useState("");
  const hasRedirectedRef = useRef(false);

  // Login state — client only (hydration safe)
  useEffect(() => {
    setIsUserLoggedIn(safeGetItem("isLoggedIn") === "true");
    setLoggedinUserId(safeGetItem("userID") || "");
  }, []);

  // Priority: SSR prop > query > path > context
  const rawCitySlug = propCitySlug || queryCity || pathCitySlug || "";
  const cityForSEO = propCity
    ? propCity
    : rawCitySlug
    ? rawCitySlug.charAt(0).toUpperCase() + rawCitySlug.slice(1)
    : selectedCityName;

  const selectedVenueCategory = venueData.find((v) => v.id === activeVenueType);
  const categoryLabel =
    selectedVenueCategory && selectedVenueCategory.id !== "all"
      ? selectedVenueCategory.label
      : "";

  const pageTitle = cityForSEO
    ? `HORA - ${categoryLabel ? `${categoryLabel} ` : ""}Party Venues in ${cityForSEO} | Prices, Packages & Photos`
    : `HORA - ${categoryLabel ? `${categoryLabel} ` : ""}Party Venues Near You | Prices, Packages & Photos`;

  const pageDescription = cityForSEO
    ? `Explore the best ${categoryLabel ? `${categoryLabel.toLowerCase()} ` : ""}venues in ${cityForSEO} for birthdays, anniversaries, baby showers, kitty parties & more. Compare packages, prices and photos, and book online.`
    : `Explore the best ${categoryLabel ? `${categoryLabel.toLowerCase()} ` : ""}venues near you for birthdays, anniversaries, baby showers, kitty parties & more. Compare packages, prices and photos, and book online.`;

  useLayoutEffect(() => {
    let timer;
    if (isUserLoggedIn && loggedinUserId && !hasRedirectedRef.current) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const alreadyOnVenueList = /(^|\/)venue-list(\/|$)/.test(currentPath);
      if (alreadyOnVenueList) {
        hasRedirectedRef.current = true;
      } else {
        timer = setTimeout(() => {
          hasRedirectedRef.current = true;
          router.push(`/venue-list`);
        }, 2500);
      }
    }
    return () => clearTimeout(timer);
  }, [loggedinUserId, isUserLoggedIn]);

  useEffect(() => {
    const syncLoginState = () => {
      setIsUserLoggedIn(safeGetItem("isLoggedIn") === "true");
      setLoggedinUserId(safeGetItem("userID") || "");
    };
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={venueTopBanner.src || venueTopBanner}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <div className="venue-container">
        <div style={{ position: "relative" }}>
          <TopBanner image={venueTopBanner} alt="Venue" />
          <VenueSearchBar
            searchValue={searchText}
            onSearchChange={setSearchText}
            eventType={activeEvent}
            onEventTypeChange={setActiveEvent}
            guestCapacity={guestCapacity}
            onGuestCapacityChange={setGuestCapacity}
            onMoreFilterClick={() => {}}
          />
        </div>

        <VenueCircle active={activeVenueType} onSelect={setActiveVenueType} />

        <VenueList
          eventType={activeEvent}
          venueType={activeVenueType}
          guestCapacity={guestCapacity}
          city={cityForSEO}
          search={searchText}
          initialVenues={
            // Sirf tab use karo jab filters abhi default SSR wale hain
            activeEvent === initialEventType &&
            activeVenueType === initialVenueType &&
            !guestCapacity
              ? initialVenues
              : null
          }
        />

        <VenueFeatures />
      </div>
    </>
  );
};

export default VenuelandMainPage;