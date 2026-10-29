import React, { useState, useRef, useMemo, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import "@/pages/balloon-decoration/decoration.css"; // same CSS reuse (page-width, wa-banner, why-people-love-us...)

import { getDecorationOrganizationSchema } from "../../utils/schema";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
import axiosApi from "@/utils/axiosApi";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
} from "@/utils/apiconstants";

import HoraBanner from "@/components/DecorationLandingTopbanner";
import SearchSortBar from "@/components/SearchSortBar";
import TrendingSlider from "@/components/TrendingSlider";
import Banner from "@/components/Banner";

/* ---- assets ---- */
import whypeople1 from "../../assets/whypeople1.jpg";
import whypeople2 from "../../assets/whypeople2.jpg";
import whypeople3 from "../../assets/whypeople3.jpg";
import whypeople4 from "../../assets/whypeople4.jpg";
import whatsappbanner from "@/assets/Whatsaap_banner.webp";
import whatsappIcon from "@/assets/whatsapp-icon.png";

// TODO: apni flower images yahan import karo
import haldiImg from "@/assets/trending-haldi.webp";
import mehandiImg from "@/assets/trending-mehandi.webp";
import mandapImg from "@/assets/trending-mandap.webp";
import carImg from "@/assets/trending-wedding-car.webp";
import receptionImg from "@/assets/trending-reception.webp";
import sangeetImg from "@/assets/trending-sangeet.webp";
import engagementImg from "@/assets/trending-engagement.webp";
import firstNightImg from "@/assets/trending-first-night.webp";

/* ------------------------------------------------------------------ *
 * DATA (module level => ek hi baar banta hai)
 * ------------------------------------------------------------------ */

// Why People Love Us stats
const stats = [
  { icon: whypeople1, number: "20k", label: "Flower Designs In Stock" },
  { icon: whypeople2, number: "45+", label: "Decorations Themes" },
  { icon: whypeople3, number: "15M", label: "Satisfied Customers" },
  { icon: whypeople4, number: "10k", label: "Completed Decoration" },
];

// Trending Flower Collections (TrendingSlider ko jaayega)
 const weddingCollections = [
    { title: "Haldi Decoration", image: haldiImg, catValue: "haldi-decoration" },
    { title: "Mehandi Decoration", image: mehandiImg, catValue: "mehendi-decoration" },
    { title: "Mandap Decoration", image: mandapImg, catValue: "mandap-decoration" },
    { title: "Wedding Car Decoration", image: carImg, catValue: "wedding-car-decoration" },
    { title: "Reception Decoration", image: receptionImg, catValue: "reception-decoration" },
    { title: "Sangeet Decoration", image: sangeetImg, catValue: "sangeet-decoration" },
    { title: "Engagement Decoration", image: engagementImg, catValue: "engagement-decoration" },
    { title: "First Night Decoration", image: firstNightImg, catValue: "first-night-decoration" },
  ];

// Search ke liye flower categories (TODO: subCategory = backend wali value)
const SEARCH_CATEGORIES = weddingCollections.map((c) => ({
  name: c.title,
  catValue: c.catValue,
  subCategory: c.title,
  image: c.image,
}));

const slugify = (val) =>
  String(val || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

// category ki id ek baar fetch hoti hai, phir cache
const catIdCache = {};
const getCatId = async (c) => {
  if (catIdCache[c.catValue]) return catIdCache[c.catValue];
  if (!c.subCategory) return null;
  try {
    const res = await axiosApi.get(
      BASE_URL + GET_DECORATION_CAT_ID + c.subCategory,
    );
    const id = res.data?.data?._id || null;
    if (id) catIdCache[c.catValue] = id;
    return id;
  } catch {
    return null;
  }
};

const SITE = "https://horaservices.com";

const FlowerDecoration = ({ city, locality }) => {
  const router = useRouter();
  const pathname = router.asPath;

  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  const categorySlug = useMemo(
    () => getCategorySlugFromPath(pathname, city, locality),
    [pathname, city, locality],
  );

  /* ---------------- GLOBAL SEARCH ---------------- */
  const searchBase = `${city ? "/" + String(city).toLowerCase() : ""}${
    locality ? "/" + String(locality).toLowerCase() : ""
  }/${categorySlug}`;

  const searchCategoryList = useMemo(
    () =>
      SEARCH_CATEGORIES.map((c) => ({
        id: `cat-${c.catValue}`,
        kind: "category",
        label: c.name,
        image: c.image,
        href: `${searchBase}/${c.catValue}`,
      })),
    [searchBase],
  );

  const [searchProducts, setSearchProducts] = useState([]);
  const searchReq = useRef(0);
  const searchTimer = useRef(null);
  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const handleQueryChange = (value) => {
    const term = String(value || "").trim();
    clearTimeout(searchTimer.current);
    const id = ++searchReq.current;

    if (term.length < 2) {
      setSearchProducts([]);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      const t = term.toLowerCase();
      const cats = [...SEARCH_CATEGORIES]
        .sort((a, b) => {
          const sa = `${a.name} ${a.catValue}`.toLowerCase().includes(t) ? 0 : 1;
          const sb = `${b.name} ${b.catValue}`.toLowerCase().includes(t) ? 0 : 1;
          return sa - sb;
        })
        .slice(0, 8);

      const results = await Promise.allSettled(
        cats.map(async (c) => {
          const catId = await getCatId(c);
          if (!catId) return [];
          const url = `${BASE_URL + GET_DECORATION_CAT_ITEM}v3/${catId}?limit=6&page=1&search=${encodeURIComponent(term)}`;
          const res = await axiosApi.get(url);
          return (res.data?.data || []).map((p) => ({
            ...p,
            _catValue: c.catValue,
          }));
        }),
      );

      if (id !== searchReq.current) return; // purani request ignore
      setSearchProducts(
        results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])),
      );
    }, 300);
  };

  const getCategoryHref = (item) => item?.href || "#";

  const getProductHref = (p) => {
    if (!p) return "#";
    const slug = p.slug || p.product_slug || (p.name ? slugify(p.name) : "");
    if (!slug) return "#";
    return `/${categorySlug}/product/${slug}`;
  };

  const openSearchCategory = (item) => {
    if (item?.href) router.push(item.href);
  };

  const handleSearchSubmit = (q) => {
    const text = String(q || "").trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const catValue =
      searchProducts[0]?._catValue ||
      SEARCH_CATEGORIES.find((c) =>
        `${c.name} ${c.catValue}`.toLowerCase().includes(lower),
      )?.catValue ||
      "stage-flower-decoration";
    router.push(`${searchBase}/${catValue}?search=${encodeURIComponent(text)}`);
  };
  /* ---------------- /GLOBAL SEARCH ---------------- */

  /* ---------------- SEO ---------------- */
  const citySlug = city ? slugify(city) : "";
  const localitySlug = locality ? slugify(locality) : "";

  const canonicalUrl =
    citySlug && localitySlug
      ? `${SITE}/${citySlug}/${localitySlug}/flower-decoration`
      : citySlug
        ? `${SITE}/${citySlug}/flower-decoration`
        : `${SITE}/flower-decoration`;

  const cityName = city
    ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    : "";

  // TODO: apna SEO copy yahan daalo
  const pageSeo = {
    title: cityName
      ? `Flower Decoration in ${cityName} | Wedding, Birthday & Event Flower Decorators`
      : "Flower Decoration | Wedding, Birthday & Event Flower Decorators",
    description: cityName
      ? `Book fresh flower decoration in ${cityName} for weddings, birthdays, anniversaries and more. Browse designs and book online with Hora Services.`
      : "Book fresh flower decoration for weddings, birthdays, anniversaries and more. Browse designs and book online with Hora Services.",
  };

  /* ---------------- WhatsApp ---------------- */
  const waMessage = cityName
    ? `Hi, how can we help in your flower decor services for ${cityName}`
    : "Hi, how can we help in your flower decor services";
  const waLink = `https://wa.me/917338584828?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="dec-landing-page">
      <Head>
        <title>{pageSeo.title}</title>
        <meta name="description" content={pageSeo.description} />
        <meta
          name="keywords"
          content={
            city && locality
              ? `flower decoration in ${locality}, ${city}, wedding flower decoration, stage flower decoration`
              : city
                ? `flower decoration in ${city}, wedding flower decoration, stage flower decoration`
                : `flower decoration, wedding flower decoration, stage flower decoration, car flower decoration`
          }
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <meta property="og:title" content={pageSeo.title} />
        <meta property="og:description" content={pageSeo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{scriptTag}</script>
      </Head>

      {/* ===== TOP: banner + global search ===== */}
      <div className="top-slider">
        <div className="page-width">
          <HoraBanner />
        </div>

        <SearchSortBar
          searchCategoryList={searchCategoryList}
          products={searchProducts}
          categoryType="decoration"
          onCategorySelect={openSearchCategory}
          onQueryChange={handleQueryChange}
          onSubmitSearch={handleSearchSubmit}
          getCategoryHref={getCategoryHref}
          getProductHref={getProductHref}
          showSort={false}
        />
      </div>

      {/* ===== Trending Flower Collections ===== */}
      <TrendingSlider
        title="Trending Flower Collections"
        data={weddingCollections}
        city={city}
        locality={locality}
        categorySlug="flower-decoration"
      />

      {/* ===== WhatsApp banner ===== */}
      <a
        className="wa-banner"
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat now on WhatsApp"
        onClick={trackWAClicks}
      >
        <Banner
          image={whatsappbanner}
          alt="Your Celebrations, Our Commitment"
          border="1px solid #599911"
        />

        <span className="wa-banner__btn">
          <Image
            src={whatsappIcon}
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            className="wa-banner__icon"
          />
          <span>Chat Now on WhatsApp</span>
        </span>
      </a>

      {/* ===== Why People Love Us ===== */}
      <section className="why-people-love-us">
        <div className="page-width">
          <h2>Why People Love Us</h2>
          <div className="stats-line-container">
            {stats.map((item, index) => (
              <div key={index} className="stat-item">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={70}
                  height={50}
                />
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlowerDecoration;