import React, { useState, useRef, useMemo, useEffect } from "react";
import Head from "next/head";
import { getDecorationOrganizationSchema } from "../../utils/schema";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { decCat } from "@/utils/decorationCategories";
import Image from "next/image";
import "./Decoration.css";
import whypeople1 from "../../assets/whypeople1.jpg";
import whypeople2 from "../../assets/whypeople2.jpg";
import whypeople3 from "../../assets/whypeople3.jpg";
import whypeople4 from "../../assets/whypeople4.jpg";
import Kidsbirthday from "../../assets/kidsBirthdayIMG.webp";
import BabyWelcome from "../../assets/BabyWelcomeIMG.webp";
import Anniversary from "../../assets/AnniversaryIMG.webp";
import { balloonreviewsproduct } from "@/utils/balloonReviews";
import SmallCardGrid from "@/components/SmallCardGrid";
import CategoryGrid from "@/components/CategoryGrid";
import decorCollageIMG from "../../assets/decorCollageIMG.webp";
import BrandBannerIMG from "../../assets/BrandBannerIMG.webp";
import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../assets/TpBrandsIMG.png";
import BrandBanner from "@/components/BrandBanner";
import whatsappbanner from "@/assets/Whatsaap_banner.webp";
import weddingBannerImg from "@/assets/Wedding_banner.webp";
import Decorationseodata from "@/utils/Decorationseodata.json";
import DecorationBanner from "@/components/CategoryDecorationBanner";
import { getBalloonDecorationH1 } from "@/utils/balloonDecorationH1";
import { getBalloonDecorationSeo } from "@/utils/balloonDecorationSeo";
import haldiImg from "@/assets/trending-haldi.webp";
import mehandiImg from "@/assets/trending-mehandi.webp";
import mandapImg from "@/assets/trending-mandap.webp";
import carImg from "@/assets/trending-wedding-car.webp";
import receptionImg from "@/assets/trending-reception.webp";
import sangeetImg from "@/assets/trending-sangeet.webp";
import engagementImg from "@/assets/trending-engagement.webp";
import firstNightImg from "@/assets/trending-first-night.webp";
import weddingBg from "@/assets/weddingbackground_image.webp";
import anniversaryBg from "@/assets/Anniversaary.webp";
import firstNightBg from "@/assets/Firts_night.webp";
import anniversaryPhoto from "@/assets/AnniversaaryImage.webp";
import firstNightPhoto from "@/assets/FirstnightImage.webp";
import coupleBgBanner from "@/assets/COUPLE_CELEBRATIONS_Bg_banner.webp";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import elegantDecor from "@/assets/elegant-decor.svg";
import perfectPicture from "@/assets/perfect-picture.svg";
import romanticSetup from "@/assets/romantic-setup.svg";
import anniversaryDivider from "@/assets/divider-heart.svg";
import beautifulDecor from "@/assets/beautiful-decor.svg";
import romanticAmbience from "@/assets/romantic-ambience.svg";
import memorableMoment from "@/assets/memorable-moment.svg";
import firstNightDivider from "@/assets/divider-nightheart.svg";
import {
  birthdayData,
  BabyShowerData,
  AnniversaryData,
  PremiumData,
} from "../../utils/DecorationData.js";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import Banner from "@/components/Banner";
import SearchSortBar from "../SearchSortBar";
import WeddingBanner from "../WeddingBanner";
import TrendingSlider from "../TrendingSlider";
import CelebrationCard from "../CelebrationCard";
import BabyCelebrationCard from "../BabyCelebrationCard";
import babyBgBanner from "@/assets/baby-bg-banner.webp";
import babyShowerPhoto from "@/assets/baby-shower.webp";
import babyWelcomePhoto from "@/assets/baby-welcome.webp";
import namingPhoto from "@/assets/naming-ceremony.webp";
import annaprashanPhoto from "@/assets/Annaprashan.webp";
import babyShowerIcon from "@/assets/baby-shower-icon.webp";
import babyWelcomeIcon from "@/assets/baby-welcome-icon.webp";
import namingIcon from "@/assets/naming-ceremony-icon.webp";
import annaprashanIcon from "@/assets/annaprashan-icon.webp";
import HoraBanner from "../DecorationLandingTopbanner";
import BirthdayBanner from "../Birthdaybanner";
import BirthdayMagicalBanner from "../Birthdaymagicalbanner";
import { smallCardCategories } from "@/utils/smallCardCategories";

/* ---- GLOBAL SEARCH imports ---- */
import axiosApi from "@/utils/axiosApi";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
} from "@/utils/apiconstants";
import { NamingCeremonyThemes, themeFilters } from "@/utils/themeFilters";

const DecorSlider = dynamic(() => import("@/components/DecorSlider"));
const ProductSliderSection = dynamic(
  () => import("@/components/ProductSliderSection"),
);

const stats = [
  { icon: whypeople1, number: "20k", label: "Balloon Designs In Stock" },
  { icon: whypeople2, number: "45+", label: "Decorations Themes" },
  { icon: whypeople3, number: "15M", label: "Satisfied Customers" },
  { icon: whypeople4, number: "10k", label: "Completed Decoration" },
];

const brandItems = [
  { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
  { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
  { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
  { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
];

const slugify = (val) =>
  String(val || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

/* ------------------------------------------------------------------ *
 * GLOBAL SEARCH DATA (module level => sirf ek baar banta hai)
 * ------------------------------------------------------------------ */
const toTitle = (s) =>
  String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

// decCat me duplicate, trailing space, capital `Image` aur uppercase catValue
// ho sakte hain -- sab yahan saaf ho jaate hain.
const SEARCH_CATEGORIES = (() => {
  const seen = new Set();
  return decCat.reduce((acc, c) => {
    const catValue = String(c.catValue || "").trim().toLowerCase();
    if (!catValue || seen.has(catValue)) return acc;
    seen.add(catValue);
    acc.push({
      name: toTitle(c.name),
      catValue,
      subCategory: String(c.subCategory || "").trim(),
      image: String(c.image || c.Image || "").trim(),
    });
    return acc;
  }, []);
})();

const SEARCH_THEMES = [
  ...themeFilters.map((t) => ({ ...t, cat: "kids-birthday-decoration" })),
  ...NamingCeremonyThemes.map((t) => ({
    ...t,
    cat: "naming-ceremony-decoration",
  })),
];

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

const Decoration = ({ city, locality }) => {
  const smallCardRef = useRef(null);
  const router = useRouter();

  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  const hasCityPageParam = city ? true : false;
  const pathname = router.asPath;

  const categorySlug = useMemo(
    () => getCategorySlugFromPath(pathname, city, locality),
    [pathname, city, locality],
  );

  // ---- ssr-deployment-latest se ----
  // Page H1 from the SEO sheet (main page + city hubs); null elsewhere.
  const sheetH1 = getBalloonDecorationH1(pathname);
  const [sortOption, setSortOption] = useState("popularity");

  // Dropdown mein category par click ka URL (CategoryGrid jaisa hi)
  const getSsrCategoryHref = (cat) => {
    let path = "";
    if (city) path += `/${city.toLowerCase()}`;
    if (locality) path += `/${locality.toLowerCase()}`;
    return `${path}/${categorySlug}/${cat.catValue}`;
  };

  // Search dropdown aur typewriter placeholder isi list se chalte hain
  const ssrSearchCategoryList = smallCardCategories.map((c) => ({
    id: c.catValue,
    label: c.name,
    image: c.image,
    catValue: c.catValue,
  }));

  /* ---------------- GLOBAL SEARCH ---------------- */
  const searchBase = `${city ? "/" + String(city).toLowerCase() : ""}${
    locality ? "/" + String(locality).toLowerCase() : ""
  }/${categorySlug}`;

  // Category + Theme list (local data, turant match hoti hai)
  const searchCategoryList = useMemo(() => {
    const localImages = smallCardCategories.reduce((m, c) => {
      m[c.catValue] = c.image;
      return m;
    }, {});

    const cats = SEARCH_CATEGORIES.map((c) => ({
      id: `cat-${c.catValue}`,
      kind: "category",
      label: c.name,
      image: c.image || localImages[c.catValue] || undefined,
      href: `${searchBase}/${c.catValue}`,
    }));

    const themes = SEARCH_THEMES.map((t) => {
      const value = String(t.value).trim();
      return {
        id: `theme-${t.cat}-${value}`,
        kind: "theme",
        label: `${String(t.label).trim()} Theme`,
        image: t.image,
        href: `${searchBase}/${t.cat}/${value}`,
      };
    });

    return [...cats, ...themes];
  }, [searchBase]);

  // Products: backend se live (debounced)
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
      // jo categories typed word se match karti hain wo pehle, max 8
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

    const slug =
      p.slug ||
      p.product_slug ||
      (p.name ? slugify(p.name) : "");
    if (!slug) return "#";

    // Direct product page: /balloon-decoration/product/slug
    return `/${categorySlug}/product/${slug}`;
  };

  const openSearchCategory = (item) => {
    if (item?.href) router.push(item.href);
  };

  // Enter dabane par: sabse relevant category ke search page par
  const handleSearchSubmit = (q) => {
    const text = String(q || "").trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const catValue =
      searchProducts[0]?._catValue ||
      SEARCH_CATEGORIES.find((c) =>
        `${c.name} ${c.catValue}`.toLowerCase().includes(lower),
      )?.catValue ||
      "birthday-decoration";
    router.push(`${searchBase}/${catValue}?search=${encodeURIComponent(text)}`);
  };

  const { citySeoData, defaultSeo } = Decorationseodata;

  const cardsData = [
    {
      image: Kidsbirthday,
      title: "Kids Birthday Decoration",
      subtitle: "EXPLORE 1000+ DESIGN",
      catValue: "kids-birthday-decoration",
      link: `/${categorySlug}/kids-birthday-decoration`,
      sizeClass: "category-grid__card--tall",
    },
    {
      image: BabyWelcome,
      title: "Baby Welcome Decoration",
      catValue: "welcome-baby-decoration",
      link: `/${categorySlug}/welcome-baby-decoration`,
      sizeClass: "category-grid__card--small",
    },
    {
      image: Anniversary,
      title: "Anniversary Decoration",
      catValue: "anniversary-decoration",
      link: `/${categorySlug}/anniversary-decoration`,
      sizeClass: "category-grid__card--small",
    },
  ];

  const reviewsRef = useRef(null);

  const SITE = "https://horaservices.com";
  const citySlug = city ? slugify(city) : "";
  const localitySlug = locality ? slugify(locality) : "";

  const canonicalUrl =
    citySlug && localitySlug
      ? `${SITE}/${citySlug}/${localitySlug}/balloon-decoration`
      : citySlug
        ? `${SITE}/${citySlug}/balloon-decoration`
        : `${SITE}/balloon-decoration`;

  // SEO sheet copy (main page + city hubs) takes priority; cities/localities
  // not in the sheet keep the existing per-city copy.
  const pageSeo =
    getBalloonDecorationSeo({ city, locality }) ||
    (city ? citySeoData[city.toLowerCase()] || defaultSeo : defaultSeo);

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

  // City ka naam sundar format mein (e.g. "bangalore" -> "Bangalore")
  const cityName = city
    ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    : "";

  const waMessage = cityName
    ? `Hi, how can we help in your balloon decor services for ${cityName}`
    : "Hi, how can we help in your balloon decor services";

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
              ? `balloon decoration in ${locality}, ${city}, birthday decoration, wedding decoration, baby shower decoration`
              : city
                ? `balloon decoration in ${city}, birthday decoration, wedding decoration, baby shower decoration`
                : `birthday decoration, anniversary decoration, party themes decorations, balloon room decoration`
          }
        />

        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />

        <meta
          property="og:title"
          content="Balloon and Flower Decorations by Professional Decorators"
        />
        <meta
          property="og:description"
          content="🎉 Explore a wide range of stunning decoration designs for every event and party. Book your ideal design directly through our website for a seamless experience. Need help? Contact us at 7338584828."
        />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <meta
          property="og:image:alt"
          content="balloon decoration, birthday decoration, wedding decoration, baby shower decoration"
        />

        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">{scriptTag}</script>
      </Head>

      <div className="top-slider">
        <div className="page-width">
          <HoraBanner />
        </div>

        {/* GLOBAL SEARCH: category + theme + product */}
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
      {sheetH1 && <DecorationBanner title={sheetH1} />}
      {/* CIRCLE TABS */}
      <div ref={smallCardRef}>
        <SmallCardGrid
          city={city}
          hasCityPageParam={hasCityPageParam}
          decCat={decCat}
          categories={smallCardCategories}
          locality={locality}
        />
      </div>

      <div className="CategoryGrid-outer">
        <CategoryGrid cardsData={cardsData} city={city} locality={locality} />
      </div>

      <section className="wed-sec">
        <div className="wed-sec__bg" aria-hidden="true">
          <Image
            src={weddingBg}
            alt=""
            sizes="(max-width: 768px) 100vw, 600px"
            className="wed-sec__bg-img"
          />
        </div>

        <div className="wed-sec__inner">
          <div className="wed-sec__head">
            <p className="wed-sec__eyebrow">
              <svg
                className="wed-sec__heart"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Your Dream Wedding</span>
            </p>
            <h2 className="wed-sec__title">Starts Here</h2>
            <p className="wed-sec__subtitle">
              Beautiful decoration for every wedding celebration
            </p>
          </div>

          <WeddingBanner
            image={weddingBannerImg}
            href={`/${categorySlug}/wedding-decoration`}
          />

          <TrendingSlider
            title="Trending Wedding Collections"
            data={weddingCollections}
            city={city}
            locality={locality}
          />
        </div>
      </section>

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

      {/* <DecorGrid
        largeCard={largeCard}
        smallCards={smallCards}
        city={city}
        hasCityPageParam={hasCityPageParam}
        decCat={decCat}
        locality={locality}
      /> */}

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

      <div className="page-width">
        <BirthdayBanner href={`/${categorySlug}/birthday-decoration`} />
      </div>

      <DecorSlider
        title="Premium Birthday Decorations"
        catValue="premium-decoration"
        viewAllLink={`/${categorySlug}/premium-decoration`}
        data={PremiumData}
        showDiscount={true}
        imageSize={{ width: 120, height: 120 }}
        city={city}
        hasCityPageParam={hasCityPageParam}
        decCat={decCat}
        locality={locality}
      />

      <div className="page-width">
        <BirthdayMagicalBanner href={`/${categorySlug}/birthday-decoration`} />
      </div>

      <ProductSliderSection
        title="Birthday Decoration"
        data={birthdayData}
        viewLink={`/${categorySlug}/birthday-decoration`}
        city={city}
        hasCityPageParam={hasCityPageParam}
        locality={locality}
        catValue="birthday-decoration"
      />

      <div className="decorationBanner-outer">
        <div className="collage-heading">
          Capturing Elegance in Every Celebration
        </div>
        <div className="page-width">
          <section className="decorationCollageBanner">
            <Image
              src={decorCollageIMG}
              alt="Decoration-Banner"
              width={"100%"}
              height={"auto"}
              className="decorationCollageBanner-image"
            />
          </section>
        </div>
      </div>

      <section className="couple-sec">
        <div className="couple-sec__bg" aria-hidden="true">
          <Image
            src={coupleBgBanner}
            alt=""
            sizes="(max-width: 768px) 100vw, 600px"
            className="couple-sec__bg-img"
          />
        </div>

        <div className="couple-sec__inner">
          <div className="couple-sec__head">
            <p className="couple-sec__eyebrow">Made for beautiful Moments</p>
            <h2 className="couple-sec__title">Couple Celebrations</h2>
            <p className="couple-sec__subtitle">
              Decorations that make your bond even more special
            </p>
          </div>

          <div className="Couple-Celebrations-box">
            <CelebrationCard
              href={`/${categorySlug}/anniversary-decoration`}
              bg={anniversaryBg}
              photo={anniversaryPhoto}
              photoAlt="Anniversary decoration"
              imageSide="left"
              title="Anniversary"
              subtitle="Celebrate your love with a beautiful setup."
              accent="#c4405f"
              titleColor="#c4405f"
              divider={anniversaryDivider}
              features={[
                { icon: elegantDecor, label: "Elegant Decor" },
                { icon: perfectPicture, label: "Perfect Picture" },
                { icon: romanticSetup, label: "Romantic Setup" },
              ]}
            />

            <CelebrationCard
              href={`/${categorySlug}/first-night-decoration`}
              bg={firstNightBg}
              photo={firstNightPhoto}
              photoAlt="First night decoration"
              imageSide="right"
              title="First Night"
              subtitle="Make your first night truly special."
              accent="#764C9E"
              titleColor="#764C9E"
              divider={firstNightDivider}
              features={[
                { icon: beautifulDecor, label: "Beautiful Decor" },
                { icon: romanticAmbience, label: "Romantic Ambience" },
                { icon: memorableMoment, label: "Memorable Moment" },
              ]}
            />
          </div>
        </div>
      </section>

      <DecorSlider
        title="Anniversary Decoration"
        catValue="anniversary-decoration"
        viewAllLink={`/${categorySlug}/anniversary-decoration`}
        data={AnniversaryData}
        showDiscount={true}
        imageSize={{ width: 120, height: 120 }}
        city={city}
        locality={locality}
        hasCityPageParam={hasCityPageParam}
        viewAllText="View All Anniversary  Decoration"
      />

      <section className="baby-sec">
        <div className="baby-sec__bg" aria-hidden="true">
          <Image
            src={babyBgBanner}
            alt=""
            sizes="(max-width: 768px) 100vw, 600px"
            className="baby-sec__bg-img"
          />
        </div>

        <div className="baby-sec__inner">
          <div className="baby-sec__head">
            <p className="baby-sec__eyebrow">Celebrate the joy of</p>
            <h2 className="baby-sec__title">Baby Celebrations</h2>
            <p className="baby-sec__subtitle">
              Beautiful setups for your little one&apos;s special moments
            </p>
          </div>

          <div className="baby-sec__grid">
            <BabyCelebrationCard
              image={babyShowerPhoto}
              icon={babyShowerIcon}
              title="Baby Shower"
              subtitle="Celebrate the upcoming arrival"
              color="#9b59c4"
              href={`/${categorySlug}/baby-shower-decoration`}
            />
            <BabyCelebrationCard
              image={babyWelcomePhoto}
              icon={babyWelcomeIcon}
              title="Baby Welcome"
              subtitle="Welcome your little bundle of joy"
              color="#e48f8f"
              href={`/${categorySlug}/welcome-baby-decoration`}
            />
            <BabyCelebrationCard
              image={namingPhoto}
              icon={namingIcon}
              title="Naming Ceremony"
              subtitle="Celebrate the upcoming arrival"
              color="#25a99a"
              href={`/${categorySlug}/naming-ceremony-decoration`}
            />
            <BabyCelebrationCard
              image={annaprashanPhoto}
              icon={annaprashanIcon}
              title="Annaprashan Ceremony"
              subtitle="Welcome your little bundle of joy"
              color="#e8a23a"
              href={`/${categorySlug}/annaprashan-decoration`}
            />
          </div>
        </div>
      </section>

      <ProductSliderSection
        title="Babyshower Decoration"
        data={BabyShowerData}
        viewLink={`/${categorySlug}/baby-shower-decoration`}
        locality={locality}
        hasCityPageParam={hasCityPageParam}
        catValue="baby-shower-decoration"
        city={city}
      />

      <section className="BabyShowerBanner">
        <Image
          src={BrandBannerIMG}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
        />
      </section>

      <BrandBanner
        title="Excellence Backed by Happy Customers"
        items={brandItems}
      />

      <div ref={reviewsRef} style={{ margin: "10px 0px" }}>
        <GoogleReviewsCard reviews={balloonreviewsproduct} />
      </div>
    </div>
  );
};

export default Decoration;