import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import "@/components/wonderland/wonderland.css";
import TopBanner from "@/components/Venue/Topbanner";
import venueTopBanner from "@/assets/venuelanding/Topbanner.webp";
import VenueCircle from "@/components/Venue/VenueCircle";
import VenueList from "./InvitesListing";
import VenueFeatures from "@/components/Venue/VenueFeatures";
import "@/pages/venue-list/venue/venue.css";
import { useCity } from "@/utils/cityContext";
import { safeGetItem } from "@/utils/safeStorage";
import VenueSearchBar from "@/components/Venue/Venuesearchbar";
import Head from "next/head";
import { venueData } from "@/utils/venueCircleData.js";
import EventDateBanner from "../Eventdatebanner";

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
  const visitorId = safeGetItem("VISITOR_ID");

  const { city: queryCity, venueCat: queryVenueCat } = router.query; // venue -> venueCat
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

  // URL ke venue slug ko activeVenueType ke saath sync karo
  useEffect(() => {
    if (!router.isReady) return;

    if (!queryVenueCat) {
      setActiveVenueType("all");
      return;
    }

    const matched = venueData.find((v) => v.slug === queryVenueCat);
    setActiveVenueType(matched ? matched.id : "all");
  }, [queryVenueCat, router.isReady]);

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

  const SITE = "https://horaservices.com";
  const OG_IMAGE = `${SITE}/_next/static/media/Topbanner.939f3a16.webp`;

  // Canonical: /{city}/venue-list or /{city}/venue-list/{cat}
  const canonicalUrl = (() => {
    const cityPart = rawCitySlug ? `/${rawCitySlug}` : "";
    const catPart =
      selectedVenueCategory && selectedVenueCategory.id !== "all"
        ? `/${selectedVenueCategory.slug}`
        : "";
    return `${SITE}${cityPart}/venue-list${catPart}`;
  })();

  // H1 label for the page
  const h1Label = cityForSEO
    ? `${categoryLabel ? `${categoryLabel} ` : ""}Party Venues in ${cityForSEO}`
    : `${categoryLabel ? `${categoryLabel} ` : ""}Party Venues Near You`;

  // JSON-LD: WebSite (root) + BreadcrumbList
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    {
      "@type": "ListItem",
      position: 2,
      name: `${cityForSEO || ""}${cityForSEO ? " " : ""}Party Venues`,
      item: rawCitySlug ? `${SITE}/${rawCitySlug}/venue-list` : `${SITE}/venue-list`,
    },
  ];
  if (selectedVenueCategory && selectedVenueCategory.id !== "all") {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: categoryLabel,
      item: canonicalUrl,
    });
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

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
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="HORA" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:site" content="@horaservices" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <div className="venue-container">
        {/* Visually hidden H1 — for SEO; visible heading is inside the banner */}
        <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          {h1Label}
        </h1>

        <div style={{ position: "relative" }}>
          <TopBanner
            image={venueTopBanner}
            alt={cityForSEO
              ? `${categoryLabel ? `${categoryLabel} ` : ""}Party venues in ${cityForSEO} — book birthday, anniversary & event venues on HORA`
              : "Party venues near you — book birthday, anniversary & event venues on HORA"}
          />
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

        <VenueCircle
          active={activeVenueType}
          onSelect={setActiveVenueType}
          citySlug={rawCitySlug}
        />

        <EventDateBanner userId={loggedinUserId} visitorId={visitorId} />
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

        {/* H2 for SEO — section heading visible on page */}
        <h2 style={{ fontSize: "18px", fontWeight: "600", padding: "12px 16px 4px", margin: 0, color: "#222" }}>
          {cityForSEO
            ? `Why Book ${categoryLabel ? `a ${categoryLabel} ` : ""}Venue in ${cityForSEO} with HORA`
            : `Why Book Your${categoryLabel ? ` ${categoryLabel}` : ""} Venue with HORA`}
        </h2>

        <VenueFeatures />
      </div>
    </>
  );
};

export default VenuelandMainPage;
