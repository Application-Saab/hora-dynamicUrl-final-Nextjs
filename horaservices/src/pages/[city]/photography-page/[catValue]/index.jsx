import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

import CatValuePage from "@/pages/photography-page/[catValue]";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_PHOTOGRAPHY_BY_TAG,
} from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";

import "../../../../app/homepage.css";
import { isValidPhotographyCategorySlug } from "@/utils/routeConfig";
import { categoryToWeblinkFolderName } from "@/utils/photoCategories";

// Same helpers as CatValuePage (moment + discount)
const MOMENT_SLUG_TO_KEY = {
  "pre-wedding": "pre-wedding",
  "haldi-mehndi": "haldi-mahandi",
  "wedding": "wedding",
};

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

function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

// ---------- SSR (is route ke liye — CatValuePage ka GSSP yahan nahi chalta) ----------
export async function getServerSideProps(context) {
  const { city, locality, catValue } = context.params || {};
  const query = context.query || {};

  if(!isValidPhotographyCategorySlug(catValue)) {
    return { notFound: true };
  }

  const citySlug = (city || query.city || "").toLowerCase();
  const finalCity = formatCityDisplay(citySlug) || null;
  const finalLocality = locality || query.locality || null;
  const finalCatValue = catValue || query.catValue || null;

  if (!citySlug || !finalCatValue) {
    return { notFound: true };
  }

  const categoryForApi = {
    "engagement-photography": "Engagement-Photography",
    "wedding-photography": "Wedding-Photography",
    "anniversary-photography": "Anniversary-Photography",
    "birthday-photography": "Birthday-Photography",
    "house-warming-photography": "House-warming-Photography",
    "naming-ceremony-photography": "Naming-ceremony-Photography",
    "baby-shower-photography": "Baby-Shower-Photography",
    "bachelorette-photography": "Bachelorette-Photography",
    "maternity-photography": "Maternity-Photography",
    "new-born-baby-photography": "New-Born-Baby-Photography",
    "pre-wedding": "Wedding-Photography",
    "haldi-mehndi": "Wedding-Photography",
    "wedding": "Wedding-Photography",
    "corporate-photography":"Corporate-Photography",
    "welcome-baby-photography":"Welcome-Baby-Photography"
  };

  function capitalizeHyphenatedString(str) {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  const result = capitalizeHyphenatedString(finalCatValue);
  const apiCategory = categoryForApi[finalCatValue];
  const effectiveCatValueApi =
    typeof apiCategory === "string" && MOMENT_SLUG_TO_KEY[apiCategory]
      ? "wedding-photography"
      : apiCategory;

  const effectiveCatValue =
    typeof result === "string" && MOMENT_SLUG_TO_KEY[result]
      ? "wedding-photography"
      : result;

  const initialActiveMoment =
    typeof result === "string" && MOMENT_SLUG_TO_KEY[result]
      ? MOMENT_SLUG_TO_KEY[result]
      : null;

  let catId = null;
  let products = [];
  let error = "";

  try {
    const catRes = await axiosApi.get(
      `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(effectiveCatValueApi)}`,
    );
    catId = catRes.data?.data?._id || null;
    if (!catId) {
      error = "No category found";
    } else {
      const prodRes = await axiosApi.get(
        `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${catId}`,
      );
      const data = prodRes.data?.data || [];
      products = data.map((item) => {
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(item.price || 0);
        return { ...item, discount, discountedPrice, discountDifference };
      });
    }
  } catch (err) {
    console.error("SSR city category page error:", err.message);
    error = "Failed to fetch category / products";
    products = [];
  }

  const galleryData = categoryToWeblinkFolderName[effectiveCatValue] || null;

  return {
    props: {
      // CatValuePage ko yeh sab chahiye
      initialCatValue: result,
      effectiveCatValue: effectiveCatValue || null,
      city: finalCity,
      locality: finalLocality,
      initialCatId: catId,
      initialProducts: products,
      initialGalleryData: galleryData,
      initialActiveMoment,
      ssrError: error,
      // city sync ke liye
      citySlug,
    },
  };
}

// ---------- Page ----------
const PhotographyCityCatPage = (ssrProps) => {
  const router = useRouter();
  const {
    city: ssrCity,
    locality: ssrLocality,
    citySlug: ssrCitySlug,
    ...catValueProps
  } = ssrProps;

  // Silent city change (popup / history) ke liye client sync
  const [citySlug, setCitySlug] = useState(ssrCitySlug || "");

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    setCitySlug(getCitySlugFromPath(window.location.pathname));
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

  const city = citySlug ? formatCityDisplay(citySlug) : ssrCity || "";

  const locality = ssrLocality || router.query.locality || null;

  // SSR pe city hamesha aati hai — null return mat karo (SEO)
  if (!city) return null;

  return (
    <div>
      <CatValuePage
        {...catValueProps}
        city={city}
        locality={locality}
        // ensure products etc. still passed
        initialCatValue={ssrProps.initialCatValue}
        effectiveCatValue={ssrProps.effectiveCatValue}
        initialCatId={ssrProps.initialCatId}
        initialProducts={ssrProps.initialProducts}
        initialGalleryData={ssrProps.initialGalleryData}
        initialActiveMoment={ssrProps.initialActiveMoment}
        ssrError={ssrProps.ssrError}
      />
    </div>
  );
};

export default PhotographyCityCatPage;
