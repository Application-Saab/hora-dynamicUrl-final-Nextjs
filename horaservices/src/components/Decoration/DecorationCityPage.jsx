import SectionDescription from "@/components/Description";
import LocalitiesSection from "@/components/LocalitiesSection";
import Decoration from "@/components/Decoration/Decoration";
import { decorationCityFAQData } from "@/utils/DecorationCityFAQ";
import { decorationCityDescription } from "@/utils/DecorationDescription";
import { DecorationSEOKeywords } from "@/utils/GetSEOKeywords";
import { decCat } from "@/utils/decorationCategories";
import cityData from "@/utils/cityData";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import "../../css/decoration.css";
import FAQSection from "@/components/FAQSection";

// URL ke pehle segment se city slug nikalo, jaise "/hyderabad/balloon-decoration" -> "hyderabad"
function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

function DecorationCityPage({ city: serverCity, citySlug: serverCitySlug, locality }) {
  const router = useRouter();
  const { catValue } = router.query;

  // Yeh state hamesha ASLI browser URL se derive hoti hai — chahe
  // navigation Next.js router.push se hua ho, ya CityContext ke
  // window.history.pushState (silent URL change) se — dono cases handle honge.
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

  // Pehla mount — SSR/hydration ke baad turant sync karo
  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

  // Jab Next.js Pages Router khud se route change kare (Link click, router.push)
  useEffect(() => {
    router.events.on("routeChangeComplete", syncCityFromUrl);
    return () => router.events.off("routeChangeComplete", syncCityFromUrl);
  }, [router.events, syncCityFromUrl]);

  // Jab CityContext silently URL change kare (city popup se select karne par)
  useEffect(() => {
    window.addEventListener("city:changed", syncCityFromUrl);
    return () => window.removeEventListener("city:changed", syncCityFromUrl);
  }, [syncCityFromUrl]);

  // Browser back/forward button
  useEffect(() => {
    window.addEventListener("popstate", syncCityFromUrl);
    return () => window.removeEventListener("popstate", syncCityFromUrl);
  }, [syncCityFromUrl]);

  // const city = citySlug
  //   ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
  //   : "";

  const formattedCatValue = catValue?.toLowerCase();

  const cityDecorationFAQ = decorationCityFAQData(city);
  const cityDescription = decorationCityDescription(city);

  const decorationCategory = decCat.map((item) => ({
    name: `${item.catValue} in ${city}`,
    slug: item.slug || item.catValue.toLowerCase().replace(/\s+/g, "-"),
    image: item.image,
    imgAlt: item.imgAlt,
  }));

  const localities =
    cityData[city?.toLowerCase()]?.cityLocalitiesList || [];

  const localityHandleClick = (localityName) => {
    const formattedLocalityName = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();
    router.push(
      `/${city.toLowerCase()}/${formattedLocalityName}/balloon-decoration`
    );
  };

  const handleCategoryClick = (slug) => {
    router.push(`/${city.toLowerCase()}/balloon-decoration/${slug}`);
  };

  // Pehle render (city abhi resolve nahi hui) mein kuch mat dikhao —
  // isse purani/galat city ka flash nahi dikhega
  // if (!city) return null;

  return (
    <>
      <Decoration city={city} locality={locality} />

      {/* key={city} lagane se React is section ko city change hote hi
          poori tarah remount karega — stale render kabhi nahi dikhega */}
      <LocalitiesSection
        key={`main-${city}`}
        title={`${city} localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={cityDecorationFAQ} />
      </div>

      <SectionDescription paragraphs={cityDescription} />

      <LocalitiesSection
        key={`cat-${city}`}
        title={`Explore Other Decoration Category In ${city}`}
        localities={decorationCategory}
        city={city}
        handleClick={handleCategoryClick}
      />

      <div className="my-4 container">
        <DecorationSEOKeywords city={city} />
      </div>
    </>
  );
}

export default DecorationCityPage;