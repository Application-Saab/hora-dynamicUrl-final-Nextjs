// pages/[city]/photography-page/[catValue]/index.jsx

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

// Same helpers as CatValuePage (moment + discount)
const MOMENT_SLUG_TO_KEY = {
  "pre-wedding": "pre-wedding",
  "haldi-mehndi": "haldi-mahandi",
  wedding: "wedding",
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

const categoryToGallery = {
  "Engagement-Photography": {
    folderName: "engagement weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Wedding-Photography": {
    folderName: "Wedding",
    customerId: "6683e5d43e33c54c0ebde8f2",
  },
  "Anniversary-Photography": {
    folderName: "anniversary poses web link",
    customerId: "64137625549b58e3dc39a685",
  },
  "Birthday-Photography": {
    folderName: "Candid",
    customerId: "63edb239d680d47d95870fa0",
  },
  "House-warming-Photography": {
    folderName: "House warming weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Naming-ceremony-Photography": {
    folderName: "naming ceremony weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Baby-Shower-Photography": {
    folderName: "baby shower weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Bachelorette-Photography": {
    folderName: "bacherrolerate",
    customerId: "64137625549b58e3dc39a685",
  },
  "Maternity-Photography": {
    folderName: "maternity poses",
    customerId: "6683e5d43e33c54c0ebde8f2",
  },
  "New-Born-Baby-Photography": {
    folderName: "new born ",
    customerId: "64137625549b58e3dc39a685",
  },
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

  const citySlug = (city || query.city || "").toLowerCase();
  const finalCity = formatCityDisplay(citySlug) || null;
  const finalLocality = locality || query.locality || null;
  const finalCatValue = catValue || query.catValue || null;

  if (!citySlug || !finalCatValue) {
    return { notFound: true };
  }

  const effectiveCatValue =
    typeof finalCatValue === "string" && MOMENT_SLUG_TO_KEY[finalCatValue]
      ? "Wedding-Photography"
      : finalCatValue;

  const initialActiveMoment =
    typeof finalCatValue === "string" && MOMENT_SLUG_TO_KEY[finalCatValue]
      ? MOMENT_SLUG_TO_KEY[finalCatValue]
      : null;

  let catId = null;
  let products = [];
  let error = "";

  try {
    const catRes = await axiosApi.get(
      `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(effectiveCatValue)}`
    );
    catId = catRes.data?.data?._id || null;

    if (!catId) {
      error = "No category found";
    } else {
      const prodRes = await axiosApi.get(
        `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${catId}`
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

  const galleryData = categoryToGallery[effectiveCatValue] || null;

  return {
    props: {
      // CatValuePage ko yeh sab chahiye
      initialCatValue: finalCatValue,
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

  const city = citySlug
    ? formatCityDisplay(citySlug)
    : ssrCity || "";

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