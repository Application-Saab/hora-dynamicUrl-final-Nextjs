"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import cityData from "@/utils/cityData";
import LocalitiesSection from "@/components/LocalitiesSection";
import HomeContent from "@/components/HomeContent";
import Head from "next/head";

// URL ke pehle segment se city slug nikalo, jaise "/hyderabad" -> "hyderabad"
function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

export default function CityPage() {
  const router = useRouter();

  // ✅ Yeh state hamesha ASLI browser URL se derive hoti hai — chahe
  // navigation Next.js router.push se hua ho, ya CityContext ke
  // window.history.pushState (silent URL change) se — dono cases handle honge.
  // useParams() yahan reliable nahi tha kyunki CityProvider silent pushState
  // karta hai jise App Router track nahi karta, isliye params.city stale reh jaata tha.
  const [citySlug, setCitySlug] = useState("");

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    setCitySlug(getCitySlugFromPath(window.location.pathname));
  }, []);

  // Pehla mount — hydration ke baad turant sync karo
  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

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

  const normalizedCity = citySlug.toLowerCase();
  const city = citySlug
    ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
    : "";

  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    if (normalizedCity && cityData[normalizedCity]) {
      setLocalities(cityData[normalizedCity].cityLocalitiesList || []);
    } else {
      setLocalities([]);
    }
  }, [normalizedCity]);

  const localityHandleClick = (localityName) => {
    const formattedLocality = localityName.replace(/\s+/g, "-").toLowerCase();
    router.push(`/${normalizedCity}/${formattedLocality}`);
  };

  // ✅ Pehle render (city abhi resolve nahi hui) mein kuch mat dikhao —
  // isse purani/galat city ka flash nahi dikhega
  if (!city) return null;

  return (
    <>
      <Head>
        <title>
          {`Party Services in ${city} | Decoration, Catering, Photography & More | HORA`}
        </title>

        <meta
          name="description"
          content={`Book party decoration, catering, photography, chef at home, live catering, birthday decoration, anniversary decoration and event services in ${city}. Verified vendors, 1000+ designs & easy booking with HORA.`}
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href={`https://horaservices.com/${normalizedCity}`}
        />

        <meta
          property="og:title"
          content={`Party Services in ${city} | Decoration, Catering & More | HORA`}
        />

        <meta
          property="og:description"
          content={`Book decoration, catering, photography and chef services in ${city} for birthdays, anniversaries and special events.`}
        />

        <meta
          property="og:url"
          content={`https://horaservices.com/${normalizedCity}`}
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content={`Party Services in ${city} | HORA`}
        />

        <meta
          name="twitter:description"
          content={`Book decoration, catering, photography and chef services in ${city}.`}
        />
      </Head>

      <HomeContent />

      {/* key={city} lagane se React is section ko city change hote hi
          poori tarah remount karega — stale render kabhi nahi dikhega */}
      <LocalitiesSection
        key={city}
        title={`${city} Localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
    </>
  );
}