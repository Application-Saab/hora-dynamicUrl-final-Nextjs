import Head from "next/head";
import {
  categoryBannerMap,
  normalizeCatValue,
} from "@/pages/photography-page/[catValue]/index.jsx";
export function SeoMain({ city, locality, scriptTag }) {
  return (
    <Head>
      <title>
        {locality && city
          ? `Photographers in ${locality}, ${city} for All Events | Book Online | HORA`
          : city
          ? `Photographers in ${city} for All Events | Book Online | HORA`
          : `Professional Photographers for All Events | Book Online | HORA`}
      </title>

      <meta
        name="description"
        content={
          locality && city
            ? `Book professional photographers in ${locality}, ${city} for birthdays, weddings, baby showers & more. 100+ photographers. Lifetime photo storage. Book HORA now.`
            : city
            ? `Book professional photographers in ${city} for birthdays, weddings, baby showers & more. 100+ photographers. Lifetime photo storage. Book HORA now.`
            : `Book professional photographers for birthdays, anniversaries, weddings, maternity, baby showers & more. 100+ photographers across India. Lifetime photo storage. Book HORA now.`
        }
      />

      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />

      <link
        rel="canonical"
        href={
          locality && city
            ? `https://horaservices.com/${city}/${locality}/photography-page`
            : city
            ? `https://horaservices.com/${city}/photography-page`
            : `https://horaservices.com/photography-page`
        }
      />

      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
      />

      <meta
        property="og:title"
        content={
          locality && city
            ? `Photographers in ${locality}, ${city} | HORA`
            : city
            ? `Photographers in ${city} | HORA`
            : `Professional Photographers for All Events | HORA`
        }
      />

      <meta
        property="og:description"
        content={
          locality && city
            ? `Book photographers in ${locality}, ${city} for birthdays, weddings and events.`
            : city
            ? `Book photographers in ${city} for birthdays, weddings and events.`
            : `Book photographers for birthdays, weddings & events across India.`
        }
      />

      <meta
        property="og:url"
        content={
          locality && city
            ? `https://horaservices.com/${city}/${locality}/photography-page`
            : city
            ? `https://horaservices.com/${city}/photography-page`
            : `https://horaservices.com/photography-page`
        }
      />

      <meta property="og:type" content="website" />

      <meta
        property="og:image"
        content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
      />

      <meta name="twitter:card" content="summary_large_image" />

      <meta
        name="twitter:title"
        content={
          locality && city
            ? `Photographers in ${locality}, ${city} | HORA`
            : city
            ? `Photographers in ${city} | HORA`
            : `Professional Photographers | HORA`
        }
      />

      <meta
        name="twitter:description"
        content={
          locality && city
            ? `Photography services in ${locality}, ${city}.`
            : city
            ? `Photography services in ${city}.`
            : `Hire photographers for birthdays, weddings & events.`
        }
      />

      <meta
        name="twitter:image"
        content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
      />

      {scriptTag}
    </Head>
  );
}

export function SeoCategory({
  city,
  locality,
  catValue,
  seoData,
}) {
  const seo = seoData?.[catValue] || {};

  const safeCat = catValue ? catValue.replace(/-/g, " ") : "";
  const safeDesc = seo?.description || "";

  const citySlug = city?.toLowerCase()?.replace(/\s+/g, "-");
  const localitySlug = locality?.toLowerCase()?.replace(/\s+/g, "-");

  const title =
    locality && city
      ? `${safeCat} Photography in ${locality}, ${city} | Book Online | HORA`
      : city
      ? `${safeCat} Photography in ${city} | Book Online | HORA`
      : seo?.title || `${safeCat} Photography | HORA`;

  const description =
    locality && city
      ? `Book professional ${safeCat.toLowerCase()} photography in ${locality}, ${city} for birthdays, weddings, baby showers, anniversaries and special events. Trusted photographers with HORA.`
      : city
      ? `Book professional ${safeCat.toLowerCase()} photography in ${city} for birthdays, weddings, baby showers, anniversaries and special events. Trusted photographers with HORA.`
      : safeDesc;

  const url =
    localitySlug && citySlug
      ? `https://horaservices.com/${citySlug}/${localitySlug}/photography/${catValue}`
      : citySlug
      ? `https://horaservices.com/${citySlug}/photography/${catValue}`
      : `https://horaservices.com/photography/${catValue}`;

  const normalizedCat = normalizeCatValue(catValue);

  const bannerToShow =
    categoryBannerMap[normalizedCat] ||
    categoryBannerMap["default"];

  const bannerUrl = bannerToShow?.src || "";

  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={bannerUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={bannerUrl} />

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
              url: "https://horaservices.com",
            },
            areaServed: {
              "@type": locality && city ? "Place" : city ? "City" : "Country",
              name:
                locality && city
                  ? `${locality}, ${city}`
                  : city || "India",
            },
            image: [bannerUrl],
          }),
        }}
      />
    </Head>
  );
}


export function SeoWork({
  city,
  locality,
  work,
  scriptTag,
}) {
  const title =
    locality && city
      ? `${work?.name} Photography in ${locality}, ${city} | Starting at ₹3500 | HORA`
      : city
      ? `${work?.name} Photography in ${city} | Starting at ₹3500 | HORA`
      : `${work?.name} Photography | Starting at ₹3500 | HORA`;

  const description =
    locality && city
      ? `Book professional ${work?.name} photography in ${locality}, ${city} for birthdays, weddings, baby showers, maternity shoots, anniversaries and special events.`
      : city
      ? `Book professional ${work?.name} photography in ${city} for birthdays, weddings, baby showers, maternity shoots, anniversaries and special events.`
      : `Book professional ${work?.name} photography services across India for all occasions.`;

  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
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
