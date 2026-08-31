import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

import Index from "@/pages/photography-page";
import cityData from "@/utils/cityData";
import { faqData } from "@/utils/photographyFAQData";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";

import PhotographyDescription from "@/components/PhotographyDescription";
import PhotographySEOKeywords from "@/components/PhotographySEOKeywords";
import FAQSection from "@/components/FAQSection";
import LocalitiesSection from "@/components/LocalitiesSection";

import "../../../app/homepage.css";

const STANDARD_PACKAGE_TAG_ID = "66c96b4e22ed47b72117e09a";

const getDiscountedPrice = (price = 0) => {
  const discountedPrice = price / 0.78;
  const discountDifference = discountedPrice - price;
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0);
  return {
    discount: Number(discount),
    discountedPrice: Math.round(discountedPrice),
    discountDifference: Math.round(discountDifference),
  };
};

function formatCityDisplay(slug) {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { city: cityParam } = context.params || {};
  const citySlug = (cityParam || "").toLowerCase();
  const city = formatCityDisplay(citySlug);

  // Invalid / missing city
  if (!citySlug) {
    return { notFound: true };
  }

  // Localities server pe
  const cityLocalitiesList =
    cityData[citySlug]?.cityLocalitiesList || [];

  // Packages (same as main photography page)
  let initialPackages = [];
  try {
    const res = await axiosApi.get(
      `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${STANDARD_PACKAGE_TAG_ID}`
    );
    initialPackages =
      res.data?.data?.map((item) => {
        const { discountedPrice, discountDifference } = getDiscountedPrice(
          item.price || 0
        );
        return { ...item, discountedPrice, discountDifference };
      }) || [];
  } catch (err) {
    console.error("SSR city photography packages error:", err.message);
    initialPackages = [];
  }

  return {
    props: {
      city,
      citySlug,
      cityLocalitiesList,
      initialPackages,
    },
  };
}

// ---------- Page ----------
const PhotographyCityPage = ({
  city: ssrCity,
  citySlug: ssrCitySlug,
  cityLocalitiesList: ssrLocalities,
  initialPackages,
}) => {
  const router = useRouter();

  // SSR city pehle se hai — client silent URL change ke liye sync bhi rakho
  const [citySlug, setCitySlug] = useState(ssrCitySlug || "");
  const [cityLocalitiesList, setCityLocalitiesList] = useState(
    ssrLocalities || []
  );

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const parts = window.location.pathname.split("/").filter(Boolean);
    const slug = (parts[0] || "").toLowerCase();
    setCitySlug(slug);
  }, []);

  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

  useEffect(() => {
    router.events.on("routeChangeComplete", syncCityFromUrl);
    return () => router.events.off("routeChangeComplete", syncCityFromUrl);
  }, [router.events, syncCityFromUrl]);

  useEffect(() => {
    window.addEventListener("city:changed", syncCityFromUrl);
    return () => window.removeEventListener("city:changed", syncCityFromUrl);
  }, [syncCityFromUrl]);

  useEffect(() => {
    window.addEventListener("popstate", syncCityFromUrl);
    return () => window.removeEventListener("popstate", syncCityFromUrl);
  }, [syncCityFromUrl]);

  // City change (silent / client nav) → localities update
  useEffect(() => {
    if (!citySlug) return;
    const localities = cityData[citySlug]?.cityLocalitiesList || [];
    setCityLocalitiesList(localities);
  }, [citySlug]);

  const city = citySlug
    ? formatCityDisplay(citySlug)
    : ssrCity || "";

  const localityHandleClick = (localityName) => {
    const formattedLocalityName = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();
    router.push({
      pathname: `/${city.toLowerCase()}/${formattedLocalityName}/photography-page`,
    });
  };

  // SSR pe city hamesha hogi — null return mat karo (SEO + hydration safe)
  if (!city) return null;

  return (
    <div>
      {/* Index = photography-page main component — city + packages props */}
      <Index
        city={city}
        locality={null}
        initialPackages={initialPackages}
      />

      <LocalitiesSection
        key={`main-${city}`}
        title={`${city} localities`}
        localities={cityLocalitiesList}
        handleClick={localityHandleClick}
      />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={faqData} />
      </div>

      <PhotographyDescription city={city} />
      <PhotographySEOKeywords city={city} />
    </div>
  );
};

export default PhotographyCityPage;