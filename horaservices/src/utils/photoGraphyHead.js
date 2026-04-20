import Head from "next/head";
import {
  categoryBannerMap,
  normalizeCatValue,
} from "@/pages/photography-page/[catValue]/index.jsx";
export function SeoMain({ city, scriptTag }) {
  return (
   <Head>
  {/* Title (within 60 chars) */}
<title>
  {city
    ? `Photographers in ${city} for All Events | Book Online | HORA`
    : `Professional Photographers for All Events | Book Online | HORA`}
</title>
  {/* Meta Description */}
  <meta
  name="description"
  content={
    city
      ? `Book professional photographers in ${city} for birthdays, weddings, baby showers & more. 100+ photographers. Lifetime photo storage. Book HORA now.`
      : `Book professional photographers for birthdays, anniversaries, weddings, maternity, baby showers & more. 100+ photographers across India. Lifetime photo storage. Book HORA now.`
  }
/>

  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />

  {/* Canonical */}
  <link rel="canonical" href="https://horaservices.com/photography-page" />

  {/* Favicon */}
  <link
    rel="icon"
    href="https://horaservices.com/api/uploads/logo-icon.png"
  />

  {/* Open Graph */}
  <meta
    property="og:title"
    content="Professional Photographers for All Events | HORA"
  />
  <meta
    property="og:description"
    content="Book photographers for birthdays, weddings & events across India."
  />
  <meta
    property="og:url"
    content="https://horaservices.com/photography-page"
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:image"
    content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
  />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Professional Photographers | HORA"
  />
  <meta
    name="twitter:description"
    content="Hire photographers for birthdays, weddings & events."
  />
  <meta
    name="twitter:image"
    content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
  />

  {/* Schema - Service */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Professional Event Photography Services",
        provider: {
          "@type": "Organization",
          name: "HORA",
          url: "https://horaservices.com/",
          logo: "https://horaservices.com/api/uploads/logo-icon.png",
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        description:
          "Professional photographers for birthdays, weddings, baby showers and corporate events across India.",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "100",
        },
      }),
    }}
  />

  {/* Schema - WebPage */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Photography Services",
        url: "https://horaservices.com/photography-page",
        description:
          "Book professional photographers for events across India.",
      }),
    }}
  />


</Head>
  );
}

export function SeoCategory({ city, catValue, seoData }) {
  const seo = seoData?.[catValue] || {};

  // ✅ SAFE values
  const safeCat = catValue ? catValue.replace(/-/g, " ") : "";
  const safeDesc = seo?.description || "";

  const citySlug = city?.toLowerCase()?.replace(/\s+/g, "-");

  const formattedCity = city ? `in ${city}` : "in India";

  // ✅ Title
  const title = city
    ? `${safeCat} in ${city} | Book Photographer | HORA`
    : seo?.title || `${safeCat} Photography | HORA`;

  // ✅ Description
  const description = city
    ? safeDesc
      ? safeDesc.replace(
          "Book",
          `Book ${safeCat.toLowerCase()} in ${city}. Book`
        )
      : `Book ${safeCat.toLowerCase()} photography in ${city}.`
    : safeDesc;

  // ✅ URL
  const url = citySlug
    ? `https://horaservices.com/${citySlug}/photography/${catValue}`
    : `https://horaservices.com/photography/${catValue}`;

  // ✅ Banner Image (IMPORTANT 🔥)
  const normalizedCat = normalizeCatValue(catValue);

  const bannerToShow =
    categoryBannerMap[normalizedCat] ||
    categoryBannerMap["default"];

  const bannerUrl = bannerToShow?.src || "";

  return (
    <Head>
      {/* ✅ Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* ✅ Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={bannerUrl} />

      {/* ✅ Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={bannerUrl} />

      {/* ✅ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${safeCat} ${formattedCity}`,
            description: description,
            areaServed: {
              "@type": city ? "City" : "Country",
              name: city || "India",
            },
            provider: {
              "@type": "Organization",
              name: "HORA",
              url: "https://horaservices.com",
            },
            image: [bannerUrl],
          }),
        }}
      />
    </Head>
  );
}


export function SeoWork({ city, work, scriptTag }) {
  return (
    <Head>
      <title>
        {city
         ? `HORA Photography ${city} ${work.name} by Professionals Photographer, Starting at ₹3500`
            : `HORA Photography ${work.name} by Professionals Photographer, Starting at ₹3500`}
      </title>

      <meta
        name="description"
        content={
          city
            ? `📸 Capture Every Moment, Forever! ✨ Welcome to HORA ${city} ${work?.name} — where every click tells your story! 😊 Weddings, Baby Shoots, Birthdays, and more — our professional photographers make your memories magical.`
            : `📸 Capture Every Moment, Forever! ✨ Welcome to HORA ${work?.name} — where every click tells your story! 😊 Weddings, Baby Shoots, Birthdays, and more — our professional photographers make your memories magical.`
        }
      />

      <MetaCommon scriptTag={scriptTag} />
    </Head>
  );
}

function MetaCommon({ scriptTag }) {
  const keywords = `couple photoshoot, romantic photoshoot for couples, pre wedding photoshoot, pre wedding photography, couple pre wedding photography, candid pre wedding shoot, pre bridal photography, pre wedding shoot price, pre wedding shoot in bangalore, 
    couples photography, maternity photoshoot, maternity photoshoot near me, maternity photo sessions, maternity photoshoot in bangalore, maternity couple photoshoot, mother to be photoshoot, maternity shoot near me, pregnancy photoshoot near me, 
    pregnancy photo shoot, photography in pregnancy, pregnant women photoshoot, motherhood photoshoot, pregnant ladies photoshoot, couple pregnancy photoshoot, seemantham photoshoot, pregnancy photoshoot in bangalore, newborn photography, infant photography,
     baby photography near me, newborn photography near me, newborn photoshoot, infant photographers near me, newborn portraits near me, newborn family photoshoot, family photography with newborn, cake smash photoshoot, first birthday cake smash photoshoot, 
     engagement photo shoot, engagement photoshoot, engagement couple photography, engagement photography, wedding photographer, wedding photographer near me, wedding photoshoot, photographer wedding, candid wedding photography, marriage photoshoot, post wedding photoshoot, 
     bridal photoshoot, traditional photography, wedding photographers in bangalore, marriage photographers in bangalore, birthday photoshoot, first birthday photoshoot, pre birthday photoshoot, birthday celebration photoshoot, birthday photo session, 18th photoshoot, 
     birthday party photographer, event photography, photoshoot for wedding anniversary, anniversary photoshoot, candid photography, cinematic photography, fashion photography, model photography, black and white photography, landscape photography, portrait photography, 
     photographers near me, professional photographer near me, professional photographer, freelance photographer, best photographers near me, photoshoot near me, photographer in bangalore, photography in bangalore, bangalore photoshoot, photography services"
          `;

  return (
    <>
      <meta name="keywords" content={keywords} />
      <meta
        property="og:title"
        content="HORA Photography : Professional photography for all events"
      />
      <meta
        property="og:description"
        content="Professional event photography for weddings, birthdays, baby showers, and more. Book today for stunning, affordable memories — starting at just ₹3500!"
      />
      <meta
        property="og:image"
        content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
      />
      <meta
        property="og:url"
        content="https://horaservices.com/photography"
      />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />
      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
        type="image/x-icon"
      />
      {scriptTag && (
        <script type="application/ld+json">{scriptTag}</script>
      )}
    </>
  );
}
