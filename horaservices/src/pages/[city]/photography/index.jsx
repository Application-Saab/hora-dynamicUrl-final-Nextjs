import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

import PhotographyLanding, {
  STANDARD_PACKAGE_TAG_ID,
} from "@/components/PhotographyLanding";
import cityData from "@/utils/cityData";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";
import seoData from "@/utils/photographyseodata.json";

import FAQSection from "@/components/FAQSection";
import SectionDescription from "@/components/Description";
import LocalitiesSection from "@/components/LocalitiesSection";
import PhotographyCityLanding from "@/components/photographyseoCommon/PhotographyCityLanding";

import "../../../app/homepage.css";
import { getCityNameFromSlug, isValidCitySlug } from "@/utils/validCities";
import { photographyDescription } from "@/utils/Photographydescriptionlanding";
import { photographyFAQData } from "@/utils/Photographyfaqdatalanding";
import { CityPhotographyLandingPage } from "@/utils/Cityphotographylandingpage";

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

// "/hyderabad/photography" -> "hyderabad"
function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return (parts[0] || "").toLowerCase();
}

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const citySlug = (context.params?.city || "").toLowerCase();

  if (!isValidCitySlug(citySlug)) {
    return { notFound: true };
  }

  const city = getCityNameFromSlug(citySlug);

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

  return { props: { city, citySlug, initialPackages } };
}

// ---------- Page ----------
const PhotographyCityPage = ({
  city: ssrCity,
  citySlug: ssrCitySlug,
  initialPackages,
}) => {
  const router = useRouter();

  const [citySlug, setCitySlug] = useState(ssrCitySlug || "");
  const [city, setCity] = useState(ssrCity || "");

  const seo = seoData.citySeoData[citySlug] || seoData.defaultSeo;

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const newSlug = getCitySlugFromPath(window.location.pathname);

    if (newSlug && newSlug !== citySlug) {
      setCitySlug(newSlug);
      setCity(formatCityDisplay(newSlug));
    }
  }, [citySlug]);

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

  // Ek city ka data (ya undefined)
  const cityLanding = CityPhotographyLandingPage[citySlug];

  // City FAQ pehle, phir general FAQ
  const cityFaqs = cityLanding?.faqs || [];
  const generalFaqs = photographyFAQData();
  const cityPhotographyFAQ = [...cityFaqs, ...generalFaqs];

  const localities = cityData[citySlug]?.cityLocalitiesList || [];

  const localityHandleClick = (localityName) => {
    const formattedLocalityName = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();
    router.push(`/${citySlug}/${formattedLocalityName}/photography`);
  };

  if (!city) return null;

  const pageUrl = `https://horaservices.com/${citySlug}/photography`;

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Head>

      <PhotographyLanding
        city={city}
        locality={null}
        initialPackages={initialPackages}
      />

      <LocalitiesSection
        key={`main-${city}`}
        title={`${city} localities`}
        localities={localities}
        handleClick={localityHandleClick}
        citySlug={citySlug}
        href="/photography"
      />

      <PhotographyCityLanding key={`landing-${city}`} data={cityLanding} />

      <SectionDescription sections={photographyDescription} />

      <div className="tab-section-details-productpage">
        <FAQSection
          faqData={cityPhotographyFAQ}
          heading={cityLanding?.faqHeading || "FAQ"}
        />
      </div>
    </>
  );
};

export default PhotographyCityPage;