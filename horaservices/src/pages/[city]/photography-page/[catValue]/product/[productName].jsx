// pages/[city]/photography-page/[catValue]/product/[productName]/index.jsx
// (ya jo bhi exact path hai)

import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

import ProductDetails from "@/pages/photography-page/[catValue]/product/[productName]";
import { BASE_URL, GET_ADDON_BY_ID } from "@/utils/apiconstants";
import axiosApi from "@/utils/axiosApi";

import "../../../../../app/homepage.css";

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

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { city, locality, catValue, productName } = context.params || {};
  const query = context.query || {};

  const citySlug = (city || query.city || "").toLowerCase();
  const finalCity = formatCityDisplay(citySlug) || null;
  const finalLocality = locality || query.locality || null;
  const finalCatValue = catValue || query.catValue || null;
  const productId = query.id || null;

  if (!citySlug) {
    return { notFound: true };
  }

  let work = null;
  let similarProducts = [];
  let addonData = [];
  let error = null;

  if (productId) {
    try {
      const res = await axiosApi.get(
        `${BASE_URL}/api/photography/details/${productId}`
      );
      const data = res.data?.data;

      if (data) {
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(Number(data.price));

        work = {
          ...data,
          discount,
          discountedPrice,
          discountDifference,
          advance_amount: Number(data.advance_amount || 0),
        };

        // Similar
        const tagId = data?.tag?.[0]?._id;
        if (tagId) {
          try {
            const similarRes = await axiosApi.get(
              `${BASE_URL}/api/photography/searchByTag/${tagId}`
            );
            similarProducts = (similarRes.data?.data || []).filter(
              (p) => p._id !== productId
            );
          } catch (e) {
            console.error("SSR similar fetch error:", e.message);
          }
        }

        // Addons
        const addonIds = data?.addons || [];
        if (addonIds.length > 0) {
          try {
            const q = new URLSearchParams();
            addonIds.forEach((id) => id && q.append("ids", id));
            if ([...q].length > 0) {
              const addonRes = await axiosApi.get(
                `${BASE_URL}${GET_ADDON_BY_ID}?${q.toString()}`
              );
              addonData = addonRes.data?.data || [];
            }
          } catch (e) {
            console.error("SSR addons fetch error:", e.message);
          }
        }
      } else {
        error = "No product found";
      }
    } catch (err) {
      console.error("SSR city product details error:", err.message);
      error = err.message;
    }
  }

  return {
    props: {
      initialWork: work,
      initialSimilar: similarProducts,
      initialAddons: addonData,
      productId: productId || null,
      city: finalCity,
      locality: finalLocality,
      catValue: finalCatValue,
      ssrError: error,
      citySlug,
      productName: productName || null,
    },
  };
}

// ---------- Page ----------
const PhotographyCityProductPage = (ssrProps) => {
  const router = useRouter();
  const {
    city: ssrCity,
    locality: ssrLocality,
    citySlug: ssrCitySlug,
    ...productProps
  } = ssrProps;

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

  // SSR pe city aati hai — pehle paint pe null mat dikhao
  if (!city) return null;

  return (
    <div>
      <ProductDetails
        initialWork={ssrProps.initialWork}
        initialSimilar={ssrProps.initialSimilar}
        initialAddons={ssrProps.initialAddons}
        productId={ssrProps.productId}
        city={city}
        locality={locality}
        catValue={ssrProps.catValue}
        ssrError={ssrProps.ssrError}
      />
    </div>
  );
};

export default PhotographyCityProductPage;