"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import cityData from "@/utils/cityData";
import LocalitiesSection from "@/components/LocalitiesSection";
import HomeContent from "@/components/HomeContent";
import Head from "next/head";


function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

export default function CityPage() {
  const router = useRouter();

  const [citySlug, setCitySlug] = useState("");

  const syncCityFromUrl = useCallback((overridePathname) => {
    if (typeof window === "undefined") return;
    const path = overridePathname || window.location.pathname;
    setCitySlug(getCitySlugFromPath(path));
  }, []);


  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);


  useEffect(() => {
    const handleCityChanged = (e) => syncCityFromUrl(e?.detail?.path);
    window.addEventListener("city:changed", handleCityChanged);
    return () => window.removeEventListener("city:changed", handleCityChanged);
  }, [syncCityFromUrl]);


  useEffect(() => {
    const handlePopState = () => syncCityFromUrl();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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

   
      <LocalitiesSection
        key={city}
        title={`${city} Localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
    </>
  );
}