import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
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

  return (
    <DecorationCatPage
      city={city}
      locality={locality}
      catValue={catValue}
      initialCatalogueData={initialCatalogueData}
      initialCatId={initialCatId}
      initialHasMore={initialHasMore}
    />
  );
}

export default DecorationCatCityPage;
