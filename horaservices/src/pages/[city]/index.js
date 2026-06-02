"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import cityData from "@/utils/cityData";
import LocalitiesSection from "@/components/LocalitiesSection";
import HomeContent from "@/components/HomeContent";
import Head from "next/head";

export default function CityPage() {
  const params = useParams();
  const router = useRouter();

  // City slug
  const city = params?.city || "";
  const normalizedCity = city.toLowerCase();

  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    if (normalizedCity && cityData[normalizedCity]) {
      setLocalities(cityData[normalizedCity].cityLocalitiesList || []);
    }
  }, [normalizedCity]);

  const localityHandleClick = (localityName) => {
    const formattedLocality = localityName.replace(/\s+/g, "-").toLowerCase();
    router.push(`/${normalizedCity}/${formattedLocality}`);
  };

  return (
    <>
  <Head>
    <title>
      {`Party Services in ${
        city.charAt(0).toUpperCase() + city.slice(1)
      } | Decoration, Catering, Photography & More | HORA`}
    </title>

    <meta
      name="description"
      content={`Book party decoration, catering, photography, chef at home, live catering, birthday decoration, anniversary decoration and event services in ${
        city.charAt(0).toUpperCase() + city.slice(1)
      }. Verified vendors, 1000+ designs & easy booking with HORA.`}
    />

    <meta name="robots" content="index,follow" />

    <link
      rel="canonical"
      href={`https://horaservices.com/${normalizedCity}`}
    />

    <meta
      property="og:title"
      content={`Party Services in ${
        city.charAt(0).toUpperCase() + city.slice(1)
      } | Decoration, Catering & More | HORA`}
    />

    <meta
      property="og:description"
      content={`Book decoration, catering, photography and chef services in ${
        city.charAt(0).toUpperCase() + city.slice(1)
      } for birthdays, anniversaries and special events.`}
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
      content={`Party Services in ${
        city.charAt(0).toUpperCase() + city.slice(1)
      } | HORA`}
    />

    <meta
      name="twitter:description"
      content={`Book decoration, catering, photography and chef services in ${
        city.charAt(0).toUpperCase() + city.slice(1)
      }.`}
    />
  </Head>

  <HomeContent />

  <LocalitiesSection
    title={`${city.charAt(0).toUpperCase() + city.slice(1)} Localities`}
    localities={localities}
    handleClick={localityHandleClick}
  />
</>
  );
}
