import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import { getCategoryContent } from "@/utils/Decorationcategorycontent";
import { decorationCityFAQData } from "@/utils/DecorationCityFAQ";
import { CityDecorationlandingPage } from "@/utils/CityDecorationlanding";
import { getCityCategoryLanding } from "@/utils/Citycategorydecorationlanding";
import CityDecorationlanding from "./cityDecorationlanding";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";

const SITE = "https://horaservices.com";
const DEFAULT_OG_IMAGE = `${SITE}/api/uploads/attachment-1706520980436.png`;

// Human-readable label for each catValue slug
const CAT_LABELS = {
  "kids-birthday-decoration": "Kids Birthday Decoration",
  "birthday-decoration": "Birthday Decoration",
  "anniversary-decoration": "Anniversary Decoration",
  "welcome-baby-decoration": "Welcome Baby Decoration",
  "baby-shower-decoration": "Baby Shower Decoration",
  "naming-ceremony-decoration": "Naming Ceremony Decoration",
  "mandap-decoration": "Mandap Decoration",
  "wedding-decoration": "Wedding Decoration",
  "wedding": "Wedding Decoration",
  "engagement-decoration": "Engagement Decoration",
  "farewell-decoration": "Farewell Decoration",
  "boss": "Boss Baby Theme Decoration",
};

function getCatLabel(catValue) {
  if (!catValue) return "Decoration";
  return CAT_LABELS[catValue.toLowerCase()] ||
    catValue.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Detect whether the page is under balloon-decoration or wedding-decoration
function getCategorySlug(pathname) {
  if (!pathname) return "balloon-decoration";
  if (pathname.includes("/wedding-decoration/")) return "wedding-decoration";
  return "balloon-decoration";
}

function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

function DecorationCatCityPage({
  city: serverCity,
  citySlug: serverCitySlug,
  locality,
  catValue,
  initialCatalogueData,
  initialCatId,
  initialHasMore,
  isDirectProductPage = false
}) {
  const router = useRouter();

  const [citySlug, setCitySlug] = useState(serverCitySlug || "");
  const [city, setCity] = useState(serverCity || "");

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;

    const newSlug = getCitySlugFromPath(window.location.pathname);

    if (newSlug && newSlug !== citySlug) {
      setCitySlug(newSlug);
      setCity(newSlug.charAt(0).toUpperCase() + newSlug.slice(1));
    }
  }, [citySlug]);

  // Pehla mount — SSR/hydration ke baad turant sync
  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

  // Next.js router se route change (Link click, router.push)
  useEffect(() => {
    router.events.on("routeChangeComplete", syncCityFromUrl);

    return () => {
      router.events.off("routeChangeComplete", syncCityFromUrl);
    };
  }, [router.events, syncCityFromUrl]);

  // CityContext ka silent URL change (city popup)
  useEffect(() => {
    window.addEventListener("city:changed", syncCityFromUrl);

    return () => {
      window.removeEventListener("city:changed", syncCityFromUrl);
    };
  }, [syncCityFromUrl]);

  // Browser back / forward
  useEffect(() => {
    window.addEventListener("popstate", syncCityFromUrl);

    return () => {
      window.removeEventListener("popstate", syncCityFromUrl);
    };
  }, [syncCityFromUrl]);

  // Category-wise content
  const categoryContent = getCategoryContent(catValue);

  // Category + City wise landing content (Birthday in Mumbai, etc.)
  const catLandingData = getCityCategoryLanding(catValue, city);

  // City-wise FAQ — pehle category+city, warna general city landing wali
  const cityFaqs =
    catLandingData?.faqs ||
    CityDecorationlandingPage[city?.toLowerCase()]?.faqs ||
    [];

  // General FAQ
  const generalFaqs = decorationCityFAQData();

  // City FAQ + General FAQ
  const cityDecorationFAQ = [...cityFaqs, ...generalFaqs];

  // ── SSR-safe SEO ──────────────────────────────────────────────────────────
  // Use serverCity / serverCitySlug directly from props — never useState values,
  // because useState + useEffect run only in the browser and Googlebot sees an
  // empty string for city when those are used inside <Head>.
  const catLabel = getCatLabel(catValue);
  const cityLabel = serverCity || "";
  const canonicalCitySlug = serverCitySlug || "";

  // Detect parent category from URL (SSR-safe via router.asPath which is
  // populated server-side in Next.js Pages Router)
  const asPath = router.asPath || "";
  const parentCategory = getCategorySlug(asPath);

  const canonicalUrl = canonicalCitySlug
    ? `${SITE}/${canonicalCitySlug}/${parentCategory}/${catValue}`
    : `${SITE}/${parentCategory}/${catValue}`;

  const seoTitle = cityLabel
    ? `${catLabel} in ${cityLabel} | Book from ₹1,499 – HORA`
    : `${catLabel} | Book from ₹1,499 – HORA`;

  const metaDescription = cityLabel
    ? `Book ${catLabel.toLowerCase()} at home in ${cityLabel} from ₹1,499. Professional setup with balloons & flowers. Same-day slots available. HORA Services.`
    : `Book ${catLabel.toLowerCase()} at home from ₹1,499. Professional setup with balloons & flowers. Same-day slots available. HORA Services.`;

  const ogDescription = cityLabel
    ? `Explore ${catLabel.toLowerCase()} designs in ${cityLabel}. Verified decorators, fixed pricing from ₹1,499. Book online – HORA Services.`
    : `Explore ${catLabel.toLowerCase()} designs. Verified decorators, fixed pricing from ₹1,499. Book online – HORA Services.`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:alt" content={`${catLabel} by HORA Services`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Head>

      <DecorationCatPage
        city={city}
        locality={locality}
        catValue={catValue}
        initialCatalogueData={initialCatalogueData}
        initialCatId={initialCatId}
        initialHasMore={initialHasMore}
        isDirectProductPage = {isDirectProductPage}
      />

      {/* key lagane se city ya category change hote hi section remount hoga,
          stale content kabhi nahi dikhega */}
      {catLandingData && (
        <CityDecorationlanding
          key={`${catValue}-${city}`}
          data={catLandingData}
        />
      )}

      {categoryContent && (
        <SectionDescription sections={categoryContent.description} />
      )}

      <div className="tab-section-details-productpage">
        <FAQSection faqData={cityDecorationFAQ} />
      </div>
    </>
  );
}

export default DecorationCatCityPage;