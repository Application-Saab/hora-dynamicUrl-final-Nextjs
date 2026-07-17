import Index from "@/pages/photography-page";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import cityData from "@/utils/cityData";
import "@/app/homepage.css";
import CatValuePage from "@/pages/photography-page/[catValue]";

// URL ke pehle segment se city slug nikalo, jaise "/hyderabad/photography-page/..." -> "hyderabad"
function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

const PhotographyCityPage = () => {
  const router = useRouter();
  let { locality } = router.query;

  // Yeh state hamesha ASLI browser URL se derive hoti hai — chahe
  // navigation Next.js router.push se hua ho, ya CityContext ke
  // window.history.pushState (silent URL change) se — dono cases handle honge.
  const [citySlug, setCitySlug] = useState("");

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    setCitySlug(getCitySlugFromPath(window.location.pathname));
  }, []);

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

  const city = citySlug
    ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
    : "";

  const normalizedCity = city ? city.toLowerCase() : "";

  // const localityHandleClick = (localityName) => {
  //   const formattedLocalityName = localityName
  //     .replace(/\s+/g, "-")
  //     .toLowerCase();
  //   router.push({
  //     pathname: `/${city.toLowerCase()}/${formattedLocalityName}/photography-page`,
  //   });
  // };

  useEffect(() => {
    if (normalizedCity) {
      const localities = cityData[normalizedCity]?.cityLocalitiesList || [];
    }
  }, [normalizedCity]);

  // Pehle render (city abhi resolve nahi hui) mein kuch mat dikhao —
  // isse purani/galat city ka flash nahi dikhega
  if (!city) return null;

  return (
    <div >
      <CatValuePage city={city} locality={locality} />
    </div>
  );
};

export default PhotographyCityPage;