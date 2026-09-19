import Head from "next/head";
import HomeContent from "@/components/HomeContent";

import {
  validateCityLocality,
  slugifyLocality,
} from "@/utils/validCities";

export async function getServerSideProps({ params }) {
  const citySlug = params?.city?.toLowerCase();
  const localitySlug = params?.locality?.toLowerCase();

  const validation = validateCityLocality(
    citySlug,
    localitySlug
  );

  // Invalid city OR invalid locality => 404
  if (!validation.valid) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      citySlug: validation.citySlug,
      cityName: validation.cityName,
      localitySlug: validation.localitySlug,
    },
  };
}

export default function LocalityPage({
  citySlug,
  cityName,
  localitySlug,
}) {
  const localityName = localitySlug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  return (
    <>
      <Head>
        <title>
          {`${localityName}, ${cityName} | Balloon Decoration, Catering & Photography | HORA`}
        </title>

        <meta
          name="description"
          content={`Book balloon decoration, catering, photography, chef at home and party services in ${localityName}, ${cityName}. Verified vendors, affordable packages and easy booking with HORA.`}
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href={`https://horaservices.com/${citySlug}/${localitySlug}`}
        />

        <meta
          property="og:title"
          content={`${localityName}, ${cityName} | Party Services | HORA`}
        />

        <meta
          property="og:description"
          content={`Professional decoration, catering and photography services in ${localityName}, ${cityName}.`}
        />

        <meta
          property="og:url"
          content={`https://horaservices.com/${citySlug}/${localitySlug}`}
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />
      </Head>

      <HomeContent />
    </>
  );
}