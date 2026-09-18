import { useRouter } from "next/router";
import Head from "next/head";

import cityData from "@/utils/cityData";
import {
  isValidCitySlug,
  getCityNameFromSlug,
} from "@/utils/validCities";

import LocalitiesSection from "@/components/LocalitiesSection";
import HomeContent from "@/components/HomeContent";

export async function getServerSideProps({ params }) {
  const citySlug = params?.city?.toLowerCase();

  // Invalid city => 404
  if (!isValidCitySlug(citySlug)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      citySlug,
      cityName: getCityNameFromSlug(citySlug),
    },
  };
}

export default function CityPage({ citySlug, cityName }) {
  const router = useRouter();

  const localities = cityData[citySlug]?.cityLocalitiesList || [];

  const localityHandleClick = (localityName) => {
    const formattedLocality = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();

    router.push(`/${citySlug}/${formattedLocality}`);
  };

  return (
    <>
      <Head>
        <title>
          {`Party Services in ${cityName} | Decoration, Catering, Photography & More | HORA`}
        </title>

        <meta
          name="description"
          content={`Book party decoration, catering, photography, chef at home, live catering, birthday decoration, anniversary decoration and event services in ${cityName}. Verified vendors, 1000+ designs & easy booking with HORA.`}
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href={`https://horaservices.com/${citySlug}`}
        />

        <meta
          property="og:title"
          content={`Party Services in ${cityName} | Decoration, Catering & More | HORA`}
        />

        <meta
          property="og:description"
          content={`Book decoration, catering, photography and chef services in ${cityName} for birthdays, anniversaries and special events.`}
        />

        <meta
          property="og:url"
          content={`https://horaservices.com/${citySlug}`}
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content={`Party Services in ${cityName} | HORA`}
        />

        <meta
          name="twitter:description"
          content={`Book decoration, catering, photography and chef services in ${cityName}.`}
        />
      </Head>

      <HomeContent />

      <LocalitiesSection
        key={citySlug}
        title={`${cityName} Localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
    </>
  );
}