import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import { getCategoryContent } from "@/utils/Decorationcategorycontent";
import { decorationCityFAQData } from "@/utils/DecorationCityFAQ";
import { CityDecorationlandingPage } from "@/utils/CityDecorationlanding";
import { getCityCategoryLanding } from "@/utils/Citycategorydecorationlanding";
import {
  getThemeIntro,
  getThemeFaqs,
  getThemeFaqSchema,
  getThemeLabel,
  getThemeLinks,
} from "@/utils/themePageContent";
import CityDecorationlanding from "./cityDecorationlanding";
import ThemeLinks from "./ThemeLinks";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

function DecorationCatCityPage({
  city: serverCity,
  citySlug: serverCitySlug,
  locality,
  catValue,
  theme = null,                          // SSR-safe theme slug, e.g. "mermaid"
  initialCatalogueData,
  initialCatId,
  initialHasMore,
  isDirectProductPage = false,
  categorySlug = "balloon-decoration",   // override for wedding-decoration pages
}) {
  const router = useRouter();

  const [citySlug, setCitySlug] = useState(serverCitySlug || "");
  const [city, setCity] = useState(serverCity || "");

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;

    const newSlug = getCitySlugFromPath(window.location.pathname);

    if (newSlug && newSlug !== citySlug) {
      setCitySlug(newSlug);
      setCity(newSlug.charAt(0).toUpperCase() + newSlug.slice(1));
    }
  }, [citySlug]);

  // Pehla mount — SSR/hydration ke baad turant sync
  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

  // Next.js router se route change (Link click, router.push)
  useEffect(() => {
    router.events.on("routeChangeComplete", syncCityFromUrl);

    return () => {
      router.events.off("routeChangeComplete", syncCityFromUrl);
    };
  }, [router.events, syncCityFromUrl]);

  // CityContext ka silent URL change (city popup)
  useEffect(() => {
    window.addEventListener("city:changed", syncCityFromUrl);

    return () => {
      window.removeEventListener("city:changed", syncCityFromUrl);
    };
  }, [syncCityFromUrl]);

  // Browser back / forward
  useEffect(() => {
    window.addEventListener("popstate", syncCityFromUrl);

    return () => {
      window.removeEventListener("popstate", syncCityFromUrl);
    };
  }, [syncCityFromUrl]);

  // Category-wise content
  const categoryContent = getCategoryContent(catValue);

  // Category + City wise landing content (Birthday in Mumbai, etc.)
  const catLandingData = getCityCategoryLanding(catValue, city);

  // City-wise FAQ — pehle category+city, warna general city landing wali
  const cityFaqs =
    catLandingData?.faqs ||
    CityDecorationlandingPage[city?.toLowerCase()]?.faqs ||
    [];

  // General FAQ
  const generalFaqs = decorationCityFAQData();

  /* Theme pages (/[city]/balloon-decoration/[catValue]/[theme]) previously
     rendered exactly the same body copy as their parent category page, which
     is why Search Console reported them as "Duplicate, Google chose different
     canonical than user" and canonicalised them onto the parent. The theme
     intro and the theme FAQs below are the per-theme content that makes each
     one a distinct page. Both are null/empty on a plain category page, so
     that page is unchanged. */
  const themeIntro = getThemeIntro(theme, catValue, city);
  const themeFaqs = getThemeFaqs(theme, catValue, city);
  const themeLabel = theme ? getThemeLabel(theme) : "";
  const themeFaqSchema = getThemeFaqSchema(themeFaqs);

  // Theme FAQs first, then city FAQ + general FAQ
  const cityDecorationFAQ = [...themeFaqs, ...cityFaqs, ...generalFaqs];

  const descriptionTitle = themeLabel
    ? `About ${themeLabel} Decoration${city ? ` in ${city}` : ""}`
    : "Description";

  /* Descriptive in-body links to the sibling theme pages. The image pill
     carousel already links to them, but with one-word anchor text — Search
     Console showed a theme page's only referring page being another theme
     page. Links are built from the SSR-safe city/locality slugs so they are
     present in the server-rendered HTML. */
  const themeLinks = getThemeLinks({
    catValue,
    city: serverCity || city,
    citySlug: serverCitySlug,
    localitySlug: locality,
    currentTheme: theme,
    parentCategory: categorySlug,
  });

  const themeLinksHeading = `${theme ? "Other" : "Popular"} Themes${
    city ? ` in ${city}` : ""
  }`;

  return (
    <>
      {themeFaqSchema && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(themeFaqSchema),
            }}
          />
        </Head>
      )}

      {/* Pass serverCity (SSR-safe, from getServerSideProps context.params)
          as a separate prop so DecorationCatPage can hand it to SeoHead.
          The city useState value is empty at SSR time — Googlebot sees blank
          meta tags when SeoHead uses it. */}
      <DecorationCatPage
        city={city}
        serverCity={serverCity}
        locality={locality}
        catValue={catValue}
        serverTheme={theme}
        initialCatalogueData={initialCatalogueData}
        initialCatId={initialCatId}
        initialHasMore={initialHasMore}
        isDirectProductPage={isDirectProductPage}
        categorySlug={categorySlug}
      />

      {/* key lagane se city ya category change hote hi section remount hoga,
          stale content kabhi nahi dikhega */}
      {catLandingData && (
        <CityDecorationlanding
          key={`${catValue}-${city}`}
          data={catLandingData}
        />
      )}

      {(categoryContent || themeIntro) && (
        <SectionDescription
          title={descriptionTitle}
          intro={themeIntro}
          sections={categoryContent ? categoryContent.description : []}
        />
      )}

      <ThemeLinks links={themeLinks} heading={themeLinksHeading} />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={cityDecorationFAQ} />
      </div>
    </>
  );
}

export default DecorationCatCityPage;