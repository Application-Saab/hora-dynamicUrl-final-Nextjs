import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import "@/components/wonderland/wonderland.css";
import TopBanner from "@/components/Venue/Topbanner";
import venueTopBanner from "@/assets/venuelanding/Topbanner.webp";
import VenueCircle from "@/components/Venue/VenueCircle";
import VenueList from "./InvitesListing";
import VenueFeatures from "@/components/Venue/VenueFeatures";
import "@/pages/venue-list/venue/venue.css";
import Link from "next/link";
import { useCity } from "@/utils/cityContext";
import { safeGetItem } from "@/utils/safeStorage";
import VenueSearchBar from "@/components/Venue/Venuesearchbar";
import Head from "next/head";
import { venueData } from "@/utils/venueCircleData.js";
import EventDateBanner from "../Eventdatebanner";
import FAQSection from "@/components/FAQSection";

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
  const [introOpen, setIntroOpen] = useState(false);
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

  // Split intro for accordion preview (first 8 words shown, rest in body)
  const introWords = introText.split(" ");
  const introFirstLine = introWords.slice(0, 8).join(" ");
  const introRestText = introWords.slice(8).join(" ");

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

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "HORA Services",
    url: canonicalUrl,
    telephone: "+917338584828",
    priceRange: "₹999 - ₹39,999",
    description: pageDescription,
    ...(cityForSEO
      ? {
          areaServed: { "@type": "City", name: cityForSEO },
          address: {
            "@type": "PostalAddress",
            addressLocality: cityForSEO,
            addressCountry: "IN",
          },
        }
      : {}),
    logo: "https://horaservices.com/api/uploads/logo-icon.png",
    image: "https://horaservices.com/api/uploads/attachment-1706520980436.png",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "4566",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: { "@type": "Person", name: "Priya S." },
        reviewBody: "HORA made it so easy to find and book the perfect birthday venue. Great selection and transparent pricing!",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4",
          bestRating: "5",
        },
        author: { "@type": "Person", name: "Rahul M." },
        reviewBody: "Booked a poolside venue for our anniversary through HORA. The process was smooth and the venue was exactly as described.",
      },
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
      <EventDateBanner userId={userId} visitorId={visitorId} />

        {/* Intro accordion — thin content fix, same pattern as photography pages */}
        <div style={{ margin: "8px 16px 0" }}>
          <div className="cc-accordion">
            <button
              className={`cc-acc-btn ${introOpen ? "open" : ""}`}
              onClick={() => setIntroOpen(!introOpen)}
            >
              <span className="cc-acc-preview">
                {introFirstLine}
                {!introOpen && "…"}
              </span>
              <span className={`cc-acc-icon ${introOpen ? "open" : ""}`}>
                <svg viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div className={`cc-acc-body ${introOpen ? "open" : ""}`}>
              <p className="cc-acc-text">{introRestText}</p>
            </div>
          </div>
        </div>

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

        {/* FAQ Section */}
        <FAQSection
          faqData={faqs.map(({ q, a }) => ({ question: q, answer: a }))}
          heading="Frequently Asked Questions"
        />

        {/* Venue blog cross-link */}
        <div style={{ padding: "12px 16px 24px" }}>
          <Link
            href="/blog/venue"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              background: "#faf5fd",
              border: "1px solid #e8d5f0",
              borderRadius: "10px",
              padding: "12px 14px",
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1 }}>🏛️</span>
            <span style={{ flex: 1 }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#97538c", display: "block", lineHeight: "1.4" }}>
                Party venue tips &amp; booking guides
              </span>
              <span style={{ fontSize: "12px", color: "#888", marginTop: "2px", display: "block" }}>
                How to choose a venue, what to check and real cost estimates for 2026.
              </span>
            </span>
            <span style={{ fontSize: "14px", color: "#97538c", fontWeight: 500 }}>→</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default VenuelandMainPage;
