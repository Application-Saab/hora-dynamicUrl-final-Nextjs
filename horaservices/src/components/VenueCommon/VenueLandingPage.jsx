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

  // --- Intro paragraph (thin-content fix) ---
  const introText = (() => {
    const cat = categoryLabel ? categoryLabel.toLowerCase() : "party venue";
    const city = cityForSEO || "your city";
    if (categoryLabel && cityForSEO) {
      return `Looking for the perfect ${cat} in ${city}? HORA brings you a curated list of the best ${cat.toLowerCase()} venues for birthdays, anniversaries, baby showers, kitty parties, and corporate events. Browse verified venues with real photos, transparent pricing, and instant booking — all in one place.`;
    }
    if (categoryLabel) {
      return `Explore HORA's handpicked selection of ${cat} venues near you. Whether you're planning a birthday bash, an anniversary dinner, or a corporate event, our verified ${cat} venues offer the best packages, prices, and photos — book online in minutes.`;
    }
    if (cityForSEO) {
      return `Discover the best party venues in ${city} on HORA. From banquet halls and rooftops to poolside spots and farmhouses, compare packages, check real photos, and book your ideal birthday or event venue online — hassle-free.`;
    }
    return `Find and book the best party venues near you on HORA. Compare banquet halls, rooftops, poolside venues, farmhouses, and more. Browse verified listings with photos, packages, and prices — and book your next birthday or event in minutes.`;
  })();

  // --- FAQ data (dynamic by city + category) ---
  const faqs = (() => {
    const cat = categoryLabel || "party venue";
    const catL = cat.toLowerCase();
    const city = cityForSEO || "your city";
    return [
      {
        q: `How do I book a ${catL} in ${city} on HORA?`,
        a: `Booking a ${catL} in ${city} through HORA is simple. Browse the listing, select your preferred venue, choose a date and package, and confirm your booking online in minutes. Our team is available 24/7 to assist you.`,
      },
      {
        q: `What is the average cost of a ${catL} in ${city}?`,
        a: `The cost of a ${catL} in ${city} varies depending on the venue size, location, amenities, and package selected. HORA lists venues across all budgets with transparent pricing — no hidden charges. Use the filters to find options that fit your budget.`,
      },
      {
        q: `Can I visit the venue before booking?`,
        a: `Yes! All venues listed on HORA are personally verified. You can request a site visit through the venue's listing page, or contact our support team to arrange a walkthrough before you confirm your booking.`,
      },
      {
        q: `What events can I host at a ${catL} in ${city}?`,
        a: `${cat} venues in ${city} on HORA are ideal for birthdays, anniversaries, baby showers, kitty parties, bachelorette parties, corporate events, and family get-togethers. Many venues also offer customised décor and catering packages.`,
      },
      {
        q: `Does HORA offer any price guarantee?`,
        a: `Yes. HORA offers a Best Price Guarantee — if you find the same venue at a lower price elsewhere, we'll match it. All listed prices are inclusive of taxes with no surprise fees at checkout.`,
      },
    ];
  })();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <div className="venue-container">
        {/* Visually hidden H1 — for SEO; visible heading is inside the banner */}
        <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          {h1Label}
        </h1>

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

        <VenueCircle
          active={activeVenueType}
          onSelect={setActiveVenueType}
          citySlug={rawCitySlug}
        />

        {/* Intro paragraph — thin content fix */}
        <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6", padding: "8px 16px 0", margin: 0 }}>
          {introText}
        </p>

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

        <VenueFeatures />

        {/* FAQ Section */}
        <section style={{ padding: "24px 16px 32px", maxWidth: "800px", margin: "0 auto" }} aria-label="Frequently Asked Questions">
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#111" }}>
            Frequently Asked Questions
          </h2>
          {faqs.map(({ q, a }, i) => (
            <details key={i} style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "12px", marginBottom: "12px" }}>
              <summary style={{ fontSize: "15px", fontWeight: "600", color: "#222", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {q}
                <span style={{ fontSize: "18px", color: "#888", marginLeft: "8px", flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.65", marginTop: "8px", marginBottom: 0 }}>
                {a}
              </p>
            </details>
          ))}
        </section>
      </div>
    </>
  );
};

export default VenuelandMainPage;
