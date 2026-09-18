import Head from "next/head";
import {
  normalizeCatValue,
} from "@/pages/photography-page/[catValue]/index.jsx";
import { photographyCategoryPageTopBannerHeading } from "./photoCategories";

const SITE = "https://horaservices.com";

const slugify = (val) =>
  String(val || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

export function buildPhotographyCanonical({
  city,
  locality,
  catValue,
  productName,
  productId,
  includeId = false,
} = {}) {
  const parts = [];

  const citySlug = city ? slugify(city) : "";
  const localitySlug = locality ? slugify(locality) : "";

  if (citySlug) parts.push(citySlug);
  if (localitySlug) parts.push(localitySlug);

  parts.push("photography-page");

  if (catValue) parts.push(catValue);

  if (productName) {
    parts.push("product");
    parts.push(productName);
  }

  let path = "/" + parts.filter(Boolean).join("/");

  if (includeId && productId) {
    path += `?id=${encodeURIComponent(productId)}`;
  }

  return `${SITE}${path}`;
}

// ---------- MAIN ( /photography-page ) ----------
export function SeoMain({ city, locality, scriptTag }) {
  const canonical = buildPhotographyCanonical({ city, locality });

  const title =
    locality && city
      ? `Photographers in ${locality}, ${city} for All Events | Book Online | HORA`
      : city
        ? `Photographers in ${city} for All Events | Book Online | HORA`
        : `Professional Photographers for All Events | Book Online | HORA`;

  const description =
    locality && city
      ? `Book professional photographers in ${locality}, ${city} for birthdays, weddings, baby showers & more. 100+ photographers. Lifetime photo storage. Book HORA now.`
      : city
        ? `Book professional photographers in ${city} for birthdays, weddings, baby showers & more. 100+ photographers. Lifetime photo storage. Book HORA now.`
        : `Book professional photographers for birthdays, anniversaries, weddings, maternity, baby showers & more. 100+ photographers across India. Lifetime photo storage. Book HORA now.`;

  const ogTitle =
    locality && city
      ? `Photographers in ${locality}, ${city} | HORA`
      : city
        ? `Photographers in ${city} | HORA`
        : `Professional Photographers for All Events | HORA`;

  const ogDescription =
    locality && city
      ? `Book photographers in ${locality}, ${city} for birthdays, weddings and events.`
      : city
        ? `Book photographers in ${city} for birthdays, weddings and events.`
        : `Book photographers for birthdays, weddings & events across India.`;

  const twitterTitle =
    locality && city
      ? `Photographers in ${locality}, ${city} | HORA`
      : city
        ? `Photographers in ${city} | HORA`
        : `Professional Photographers | HORA`;

  const twitterDescription =
    locality && city
      ? `Photography services in ${locality}, ${city}.`
      : city
        ? `Photography services in ${city}.`
        : `Hire photographers for birthdays, weddings & events.`;

  const ogImage =
    "https://horaservices.com/api/uploads/attachment-1711520474508.png";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />

      <link rel="canonical" href={canonical} />
      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
        type="image/x-icon"
      />

      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={ogImage} />

      {scriptTag && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof scriptTag === "string" ? scriptTag : JSON.stringify(scriptTag),
          }}
        />
      )}
    </Head>
  );
}

// ---------- CATEGORY ( /photography-page/[catValue] ) ----------
export function SeoCategory({ city, locality, catValue, seoData, scriptTag }) {
  const seo = seoData?.[catValue] || {};
  const safeCat = catValue ? catValue.replace(/-/g, " ") : "";
  const safeDesc = seo?.description || "";

  const canonical = buildPhotographyCanonical({
    city,
    locality,
    catValue,
  });

  const title =
    locality && city
      ? `${safeCat} in ${locality}, ${city} | Book Online | HORA`
      : city
        ? `${safeCat} in ${city} | Book Online | HORA`
        : seo?.title || `${safeCat} Photography | HORA`;

  const description =
    locality && city
      ? `Book professional ${safeCat.toLowerCase()} photography in ${locality}, ${city} for birthdays, weddings, baby showers, anniversaries and special events. Trusted photographers with HORA.`
      : city
        ? `Book professional ${safeCat.toLowerCase()} photography in ${city} for birthdays, weddings, baby showers, anniversaries and special events. Trusted photographers with HORA.`
        : safeDesc;

  const normalizedCat = normalizeCatValue(catValue);
  const bannerToShow =
    photographyCategoryPageTopBannerHeading[normalizedCat] || photographyCategoryPageTopBannerHeading["default"];
  const bannerUrl = bannerToShow?.src || bannerToShow || "";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />

      <link rel="canonical" href={canonical} />
      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
        type="image/x-icon"
      />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      {bannerUrl ? <meta property="og:image" content={bannerUrl} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {bannerUrl ? <meta name="twitter:image" content={bannerUrl} /> : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name:
              locality && city
                ? `${safeCat} Photography in ${locality}, ${city}`
                : city
                  ? `${safeCat} Photography in ${city}`
                  : `${safeCat} Photography`,
            description,
            provider: {
              "@type": "Organization",
              name: "HORA",
              url: SITE,
            },
            areaServed: {
              "@type": locality && city ? "Place" : city ? "City" : "Country",
              name:
                locality && city
                  ? `${locality}, ${city}`
                  : city || "India",
            },
            ...(bannerUrl ? { image: [bannerUrl] } : {}),
            url: canonical,
          }),
        }}
      />

      {scriptTag && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof scriptTag === "string" ? scriptTag : JSON.stringify(scriptTag),
          }}
        />
      )}
    </Head>
  );
}

export function SeoWork({
  city,
  locality,
  work,
  catValue,
  productName,
  scriptTag,
}) {
  const title =
    locality && city
      ? `${work?.name} in ${locality}, ${city} | Starting at ₹3500 | HORA`
      : city
        ? `${work?.name} in ${city} | Starting at ₹3500 | HORA`
        : `${work?.name} | Starting at ₹3500 | HORA`;

  const description =
    locality && city
      ? `Book professional ${work?.name} photography in ${locality}, ${city} for birthdays, weddings, baby showers, maternity shoots, anniversaries and special events.`
      : city
        ? `Book professional ${work?.name} photography in ${city} for birthdays, weddings, baby showers, maternity shoots, anniversaries and special events.`
        : `Book professional ${work?.name} photography services across India for all occasions.`;

  const slug =
    productName ||
    work?.slug ||
    String(work?.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Product content currently loads by id → includeId: true
  // When you switch to slug-only fetch, set includeId: false
  const canonical = buildPhotographyCanonical({
    city,
    locality,
    catValue,
    productName: slug,
    productId: work?._id,
    includeId: true,
  });

  const ogImage = work?.featured_image
    ? `https://horaservices.com/api/uploads/compressed_webp/${
        String(work.featured_image).split(".")[0]
      }.webp`
    : "https://horaservices.com/api/uploads/attachment-1706520980436.png";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />

      <link rel="canonical" href={canonical} />
      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
        type="image/x-icon"
      />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {scriptTag && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof scriptTag === "string" ? scriptTag : JSON.stringify(scriptTag),
          }}
        />
      )}
    </Head>
  );
}