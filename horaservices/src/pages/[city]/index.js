"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import cityData from "@/utils/cityData";
import LocalitiesSection from "@/components/LocalitiesSection";
import HomeContent from "@/components/HomeContent";

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
      {/* Same main home UI */}
      <HomeContent />

      {/* Localities for this city */}
      <LocalitiesSection
        title={`${city.charAt(0).toUpperCase() + city.slice(1)} Localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
    </>
  );
}
