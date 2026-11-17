import Head from "next/head";

import DecorationCityPage from "../../../components/Decoration/DecorationCityPage";

import {
  isValidCitySlug,
  getCityNameFromSlug,
} from "../../../utils/validCities";
import { getBalloonDecorationSeo } from "@/utils/balloonDecorationSeo";

export async function getServerSideProps(context) {
  const citySlug = context.params?.city?.toLowerCase();

  if (!isValidCitySlug(citySlug)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      city: getCityNameFromSlug(citySlug),
      citySlug,
    },
  };
}

export default function BalloonDecorationCityPage({
  city,
  citySlug,
}) {
  // SEO sheet copy for this city hub (falls back to the existing copy).
  const sheetSeo = getBalloonDecorationSeo({ city: citySlug });

  const pageTitle =
    sheetSeo?.title ||
    `HORA Decorations in ${city} | Balloon & Flower Decorations for Birthdays, Weddings, Baby Showers & More – Starting at ₹1199`;

  const pageDescription =
    sheetSeo?.description ||
    `Book balloon decoration at home in ${city} from Rs 1,499. Professional decorators for birthdays, weddings, baby showers & more. Same-day and midnight slots available.`;

  const canonicalUrl = `https://horaservices.com/${citySlug}/balloon-decoration`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "HORA Services",
    url: canonicalUrl,
    telephone: "+917338584828",
    priceRange: "₹1,499 - ₹39,999",
    description: pageDescription,
    areaServed: {
      "@type": "City",
      name: city,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "4566",
    },
    logo: "https://horaservices.com/api/uploads/logo-icon.png",
    image: "https://horaservices.com/api/uploads/attachment-1706520980436.png",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://horaservices.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Balloon Decoration",
        item: "https://horaservices.com/balloon-decoration",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content={pageDescription} />

        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph — og:title/description/url/type also emitted by
            Decoration.jsx; keeping them here ensures they appear early in
            the head and match the page title exactly */}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />

        {/* LocalBusiness schema — city-specific, most important for local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        {/* BreadcrumbList schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <DecorationCityPage
        city={city}
        citySlug={citySlug}
        locality={null}
      />
    </>
  );
}