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

  return (
    <>
      <DecorationCatPage
        city={city}
        locality={locality}
        catValue={catValue}
        initialCatalogueData={initialCatalogueData}
        initialCatId={initialCatId}
        initialHasMore={initialHasMore}
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