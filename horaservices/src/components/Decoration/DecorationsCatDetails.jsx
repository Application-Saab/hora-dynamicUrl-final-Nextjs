// import React, { useState, useRef, useMemo, useEffect } from "react";
// import Head from "next/head";
// import { getDecorationOrganizationSchema } from "../../utils/schema";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/router";
// import { decCat } from "@/utils/decorationCategories";
// import Image from "next/image";
// import "./Decoration.css";
// import whypeople1 from "../../assets/whypeople1.jpg";
// import whypeople2 from "../../assets/whypeople2.jpg";
// import whypeople3 from "../../assets/whypeople3.jpg";
// import whypeople4 from "../../assets/whypeople4.jpg";
// import Kidsbirthday from "../../assets/kidsBirthdayIMG.webp";
// import BabyWelcome from "../../assets/BabyWelcomeIMG.webp";
// import Anniversary from "../../assets/AnniversaryIMG.webp";
// import { balloonreviewsproduct } from "@/utils/balloonReviews";
// import SmallCardGrid from "@/components/SmallCardGrid";
// import CategoryGrid from "@/components/CategoryGrid";
// import decorCollageIMG from "../../assets/decorCollageIMG.webp";
// import BrandBannerIMG from "../../assets/BrandBannerIMG.webp";
// import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
// import GoogleRatingIMG from "../../assets/GoogleRatingIMG4.png";
// import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
// import TopBrandIMg from "../../assets/TpBrandsIMG.png";
// import BrandBanner from "@/components/BrandBanner";
// import whatsappbanner from "@/assets/Whatsaap_banner.webp";
// import weddingBannerImg from "@/assets/Wedding_banner.webp";
// import Decorationseodata from "@/utils/Decorationseodata.json";
// import DecorationBanner from "@/components/CategoryDecorationBanner";
// import { getBalloonDecorationH1 } from "@/utils/balloonDecorationH1";
// import { getBalloonDecorationSeo } from "@/utils/balloonDecorationSeo";
// import haldiImg from "@/assets/trending-haldi.webp";
// import mehandiImg from "@/assets/trending-mehandi.webp";
// import mandapImg from "@/assets/trending-mandap.webp";
// import carImg from "@/assets/trending-wedding-car.webp";
// import receptionImg from "@/assets/trending-reception.webp";
// import sangeetImg from "@/assets/trending-sangeet.webp";
// import engagementImg from "@/assets/trending-engagement.webp";
// import firstNightImg from "@/assets/trending-first-night.webp";
// import weddingBg from "@/assets/weddingbackground_image.webp";
// import anniversaryBg from "@/assets/Anniversaary.webp";
// import firstNightBg from "@/assets/Firts_night.webp";
// import anniversaryPhoto from "@/assets/AnniversaaryImage.webp";
// import firstNightPhoto from "@/assets/FirstnightImage.webp";
// import coupleBgBanner from "@/assets/COUPLE_CELEBRATIONS_Bg_banner.webp";
// import whatsappIcon from "@/assets/whatsapp-icon.png";
// import elegantDecor from "@/assets/elegant-decor.svg";
// import perfectPicture from "@/assets/perfect-picture.svg";
// import romanticSetup from "@/assets/romantic-setup.svg";
// import anniversaryDivider from "@/assets/divider-heart.svg";
// import beautifulDecor from "@/assets/beautiful-decor.svg";
// import romanticAmbience from "@/assets/romantic-ambience.svg";
// import memorableMoment from "@/assets/memorable-moment.svg";
// import firstNightDivider from "@/assets/divider-nightheart.svg";
// import {
//   birthdayData,
//   BabyShowerData,
//   AnniversaryData,
//   PremiumData,
// } from "../../utils/DecorationData.js";
// import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
// import { trackWAClicks } from "@/utils/storeWhatsappClicks";
// import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
// import Banner from "@/components/Banner";
// import SearchSortBar from "../SearchSortBar";
// import WeddingBanner from "../WeddingBanner";
// import TrendingSlider from "../TrendingSlider";
// import CelebrationCard from "../CelebrationCard";
// import BabyCelebrationCard from "../BabyCelebrationCard";
// import babyBgBanner from "@/assets/baby-bg-banner.webp";
// import babyShowerPhoto from "@/assets/baby-shower.webp";
// import babyWelcomePhoto from "@/assets/baby-welcome.webp";
// import namingPhoto from "@/assets/naming-ceremony.webp";
// import annaprashanPhoto from "@/assets/Annaprashan.webp";
// import babyShowerIcon from "@/assets/baby-shower-icon.webp";
// import babyWelcomeIcon from "@/assets/baby-welcome-icon.webp";
// import namingIcon from "@/assets/naming-ceremony-icon.webp";
// import annaprashanIcon from "@/assets/annaprashan-icon.webp";
// import HoraBanner from "../DecorationLandingTopbanner";
// import BirthdayBanner from "../Birthdaybanner";
// import BirthdayMagicalBanner from "../Birthdaymagicalbanner";
// import { smallCardCategories } from "@/utils/smallCardCategories";

// /* ---- GLOBAL SEARCH imports ---- */
// import axiosApi from "@/utils/axiosApi";
// import {
//   BASE_URL,
//   GET_DECORATION_CAT_ID,
//   GET_DECORATION_CAT_ITEM,
// } from "@/utils/apiconstants";
// import { NamingCeremonyThemes, themeFilters } from "@/utils/themeFilters";

// const DecorSlider = dynamic(() => import("@/components/DecorSlider"));
// const ProductSliderSection = dynamic(
//   () => import("@/components/ProductSliderSection"),
// );

// const stats = [
//   { icon: whypeople1, number: "20k", label: "Balloon Designs In Stock" },
//   { icon: whypeople2, number: "45+", label: "Decorations Themes" },
//   { icon: whypeople3, number: "15M", label: "Satisfied Customers" },
//   { icon: whypeople4, number: "10k", label: "Completed Decoration" },
// ];

// const brandItems = [
//   { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
//   { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
//   { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
//   { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
// ];

// const slugify = (val) =>
//   String(val || "")
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "-");

// /* ------------------------------------------------------------------ *
//  * GLOBAL SEARCH DATA (module level => sirf ek baar banta hai)
//  * ------------------------------------------------------------------ */
// const toTitle = (s) =>
//   String(s || "")
//     .trim()
//     .replace(/\s+/g, " ")
//     .replace(/\b\w/g, (m) => m.toUpperCase());

// // decCat me duplicate, trailing space, capital `Image` aur uppercase catValue
// // ho sakte hain -- sab yahan saaf ho jaate hain.
// const SEARCH_CATEGORIES = (() => {
//   const seen = new Set();
//   return decCat.reduce((acc, c) => {
//     const catValue = String(c.catValue || "").trim().toLowerCase();
//     if (!catValue || seen.has(catValue)) return acc;
//     seen.add(catValue);
//     acc.push({
//       name: toTitle(c.name),
//       catValue,
//       subCategory: String(c.subCategory || "").trim(),
//       image: String(c.image || c.Image || "").trim(),
//     });
//     return acc;
//   }, []);
// })();

// const SEARCH_THEMES = [
//   ...themeFilters.map((t) => ({ ...t, cat: "kids-birthday-decoration" })),
//   ...NamingCeremonyThemes.map((t) => ({
//     ...t,
//     cat: "naming-ceremony-decoration",
//   })),
// ];

// // category ki id ek baar fetch hoti hai, phir cache
// const catIdCache = {};
// const getCatId = async (c) => {
//   if (catIdCache[c.catValue]) return catIdCache[c.catValue];
//   if (!c.subCategory) return null;
//   try {
//     const res = await axiosApi.get(
//       BASE_URL + GET_DECORATION_CAT_ID + c.subCategory,
//     );
//     const id = res.data?.data?._id || null;
//     if (id) catIdCache[c.catValue] = id;
//     return id;
//   } catch {
//     return null;
//   }
// };

// const Decoration = ({ city, locality }) => {
//   const smallCardRef = useRef(null);
//   const router = useRouter();

//   const schemaOrg = getDecorationOrganizationSchema();
//   const scriptTag = JSON.stringify(schemaOrg);

//   const hasCityPageParam = city ? true : false;
//   const pathname = router.asPath;

//   const categorySlug = useMemo(
//     () => getCategorySlugFromPath(pathname, city, locality),
//     [pathname, city, locality],
//   );

//   // ---- ssr-deployment-latest se ----
//   // Page H1 from the SEO sheet (main page + city hubs); null elsewhere.
//   const sheetH1 = getBalloonDecorationH1(pathname);
//   const [sortOption, setSortOption] = useState("popularity");

//   // Dropdown mein category par click ka URL (CategoryGrid jaisa hi)
//   const getSsrCategoryHref = (cat) => {
//     let path = "";
//     if (city) path += `/${city.toLowerCase()}`;
//     if (locality) path += `/${locality.toLowerCase()}`;
//     return `${path}/${categorySlug}/${cat.catValue}`;
//   };

//   // Search dropdown aur typewriter placeholder isi list se chalte hain
//   const ssrSearchCategoryList = smallCardCategories.map((c) => ({
//     id: c.catValue,
//     label: c.name,
//     image: c.image,
//     catValue: c.catValue,
//   }));

//   /* ---------------- GLOBAL SEARCH ---------------- */
//   const searchBase = `${city ? "/" + String(city).toLowerCase() : ""}${
//     locality ? "/" + String(locality).toLowerCase() : ""
//   }/${categorySlug}`;

//   // Category + Theme list (local data, turant match hoti hai)
//   const searchCategoryList = useMemo(() => {
//     const localImages = smallCardCategories.reduce((m, c) => {
//       m[c.catValue] = c.image;
//       return m;
//     }, {});

//     const cats = SEARCH_CATEGORIES.map((c) => ({
//       id: `cat-${c.catValue}`,
//       kind: "category",
//       label: c.name,
//       image: c.image || localImages[c.catValue] || undefined,
//       href: `${searchBase}/${c.catValue}`,
//     }));

//     const themes = SEARCH_THEMES.map((t) => {
//       const value = String(t.value).trim();
//       return {
//         id: `theme-${t.cat}-${value}`,
//         kind: "theme",
//         label: `${String(t.label).trim()} Theme`,
//         image: t.image,
//         href: `${searchBase}/${t.cat}/${value}`,
//       };
//     });

//     return [...cats, ...themes];
//   }, [searchBase]);

//   // Products: backend se live (debounced)
//   const [searchProducts, setSearchProducts] = useState([]);
//   const searchReq = useRef(0);
//   const searchTimer = useRef(null);
//   useEffect(() => () => clearTimeout(searchTimer.current), []);

//   const handleQueryChange = (value) => {
//     const term = String(value || "").trim();
//     clearTimeout(searchTimer.current);
//     const id = ++searchReq.current;

//     if (term.length < 2) {
//       setSearchProducts([]);
//       return;
//     }

//     searchTimer.current = setTimeout(async () => {
//       const t = term.toLowerCase();
//       // jo categories typed word se match karti hain wo pehle, max 8
//       const cats = [...SEARCH_CATEGORIES]
//         .sort((a, b) => {
//           const sa = `${a.name} ${a.catValue}`.toLowerCase().includes(t) ? 0 : 1;
//           const sb = `${b.name} ${b.catValue}`.toLowerCase().includes(t) ? 0 : 1;
//           return sa - sb;
//         })
//         .slice(0, 8);

//       const results = await Promise.allSettled(
//         cats.map(async (c) => {
//           const catId = await getCatId(c);
//           if (!catId) return [];
//           const url = `${BASE_URL + GET_DECORATION_CAT_ITEM}v3/${catId}?limit=6&page=1&search=${encodeURIComponent(term)}`;
//           const res = await axiosApi.get(url);
//           return (res.data?.data || []).map((p) => ({
//             ...p,
//             _catValue: c.catValue,
//           }));
//         }),
//       );

//       if (id !== searchReq.current) return; // purani request ignore
//       setSearchProducts(
//         results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])),
//       );
//     }, 300);
//   };

//   const getCategoryHref = (item) => item?.href || "#";

//   const getProductHref = (p) => {
//     if (!p) return "#";

//     const slug =
//       p.slug ||
//       p.product_slug ||
//       (p.name ? slugify(p.name) : "");
//     if (!slug) return "#";

//     // Direct product page: /balloon-decoration/product/slug
//     return `/${categorySlug}/product/${slug}`;
//   };

//   const openSearchCategory = (item) => {
//     if (item?.href) router.push(item.href);
//   };

//   // Enter dabane par: sabse relevant category ke search page par
//   const handleSearchSubmit = (q) => {
//     const text = String(q || "").trim();
//     if (!text) return;
//     const lower = text.toLowerCase();
//     const catValue =
//       searchProducts[0]?._catValue ||
//       SEARCH_CATEGORIES.find((c) =>
//         `${c.name} ${c.catValue}`.toLowerCase().includes(lower),
//       )?.catValue ||
//       "birthday-decoration";
//     router.push(`${searchBase}/${catValue}?search=${encodeURIComponent(text)}`);
//   };

//   const { citySeoData, defaultSeo } = Decorationseodata;

//   const cardsData = [
//     {
//       image: Kidsbirthday,
//       title: "Kids Birthday Decoration",
//       subtitle: "EXPLORE 1000+ DESIGN",
//       catValue: "kids-birthday-decoration",
//       link: `/${categorySlug}/kids-birthday-decoration`,
//       sizeClass: "category-grid__card--tall",
//     },
//     {
//       image: BabyWelcome,
//       title: "Baby Welcome Decoration",
//       catValue: "welcome-baby-decoration",
//       link: `/${categorySlug}/welcome-baby-decoration`,
//       sizeClass: "category-grid__card--small",
//     },
//     {
//       image: Anniversary,
//       title: "Anniversary Decoration",
//       catValue: "anniversary-decoration",
//       link: `/${categorySlug}/anniversary-decoration`,
//       sizeClass: "category-grid__card--small",
//     },
//   ];

//   const reviewsRef = useRef(null);

//   const SITE = "https://horaservices.com";
//   const citySlug = city ? slugify(city) : "";
//   const localitySlug = locality ? slugify(locality) : "";

//   const canonicalUrl =
//     citySlug && localitySlug
//       ? `${SITE}/${citySlug}/${localitySlug}/balloon-decoration`
//       : citySlug
//         ? `${SITE}/${citySlug}/balloon-decoration`
//         : `${SITE}/balloon-decoration`;

//   // SEO sheet copy (main page + city hubs) takes priority; cities/localities
//   // not in the sheet keep the existing per-city copy.
//   const pageSeo =
//     getBalloonDecorationSeo({ city, locality }) ||
//     (city ? citySeoData[city.toLowerCase()] || defaultSeo : defaultSeo);

//   const weddingCollections = [
//     { title: "Haldi Decoration", image: haldiImg, catValue: "haldi-decoration" },
//     { title: "Mehandi Decoration", image: mehandiImg, catValue: "mehendi-decoration" },
//     { title: "Mandap Decoration", image: mandapImg, catValue: "mandap-decoration" },
//     { title: "Wedding Car Decoration", image: carImg, catValue: "wedding-car-decoration" },
//     { title: "Reception Decoration", image: receptionImg, catValue: "reception-decoration" },
//     { title: "Sangeet Decoration", image: sangeetImg, catValue: "sangeet-decoration" },
//     { title: "Engagement Decoration", image: engagementImg, catValue: "engagement-decoration" },
//     { title: "First Night Decoration", image: firstNightImg, catValue: "first-night-decoration" },
//   ];

//   // City ka naam sundar format mein (e.g. "bangalore" -> "Bangalore")
//   const cityName = city
//     ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
//     : "";

//   const waMessage = cityName
//     ? `Hi, how can we help in your balloon decor services for ${cityName}`
//     : "Hi, how can we help in your balloon decor services";

//   const waLink = `https://wa.me/917338584828?text=${encodeURIComponent(waMessage)}`;

//   return (
//     <div className="dec-landing-page">
//       <Head>
//         <title>{pageSeo.title}</title>

//         <meta name="description" content={pageSeo.description} />

//         <meta
//           name="keywords"
//           content={
//             city && locality
//               ? `balloon decoration in ${locality}, ${city}, birthday decoration, wedding decoration, baby shower decoration`
//               : city
//                 ? `balloon decoration in ${city}, birthday decoration, wedding decoration, baby shower decoration`
//                 : `birthday decoration, anniversary decoration, party themes decorations, balloon room decoration`
//           }
//         />

//         <link rel="canonical" href={canonicalUrl} />

//         <meta name="robots" content="index, follow" />
//         <meta name="author" content="Hora Services" />
//         <link
//           rel="icon"
//           href="https://horaservices.com/api/uploads/logo-icon.png"
//           type="image/x-icon"
//         />

//         <meta
//           property="og:title"
//           content="Balloon and Flower Decorations by Professional Decorators"
//         />
//         <meta
//           property="og:description"
//           content="🎉 Explore a wide range of stunning decoration designs for every event and party. Book your ideal design directly through our website for a seamless experience. Need help? Contact us at 7338584828."
//         />
//         <meta
//           property="og:image"
//           content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
//         />
//         <meta
//           property="og:image:alt"
//           content="balloon decoration, birthday decoration, wedding decoration, baby shower decoration"
//         />

//         <meta property="og:url" content={canonicalUrl} />
//         <meta property="og:type" content="website" />

//         <script type="application/ld+json">{scriptTag}</script>
//       </Head>

//       <div className="top-slider">
//         <div className="page-width">
//           <HoraBanner />
//         </div>

//         {/* GLOBAL SEARCH: category + theme + product */}
//         <SearchSortBar
//           searchCategoryList={searchCategoryList}
//           products={searchProducts}
//           categoryType="decoration"
//           onCategorySelect={openSearchCategory}
//           onQueryChange={handleQueryChange}
//           onSubmitSearch={handleSearchSubmit}
//           getCategoryHref={getCategoryHref}
//           getProductHref={getProductHref}
//           showSort={false}
//         />
//       </div>
//       {sheetH1 && <DecorationBanner title={sheetH1} />}
//       {/* CIRCLE TABS */}
//       <div ref={smallCardRef}>
//         <SmallCardGrid
//           city={city}
//           hasCityPageParam={hasCityPageParam}
//           decCat={decCat}
//           categories={smallCardCategories}
//           locality={locality}
//         />
//       </div>

//       <div className="CategoryGrid-outer">
//         <CategoryGrid cardsData={cardsData} city={city} locality={locality} />
//       </div>

//       <section className="wed-sec">
//         <div className="wed-sec__bg" aria-hidden="true">
//           <Image
//             src={weddingBg}
//             alt=""
//             sizes="(max-width: 768px) 100vw, 600px"
//             className="wed-sec__bg-img"
//           />
//         </div>

//         <div className="wed-sec__inner">
//           <div className="wed-sec__head">
//             <p className="wed-sec__eyebrow">
//               <svg
//                 className="wed-sec__heart"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 aria-hidden="true"
//               >
//                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//               </svg>
//               <span>Your Dream Wedding</span>
//             </p>
//             <h2 className="wed-sec__title">Starts Here</h2>
//             <p className="wed-sec__subtitle">
//               Beautiful decoration for every wedding celebration
//             </p>
//           </div>

//           <WeddingBanner
//             image={weddingBannerImg}
//             href={`/${categorySlug}/wedding-decoration`}
//           />

//           <TrendingSlider
//             title="Trending Wedding Collections"
//             data={weddingCollections}
//             city={city}
//             locality={locality}
//           />
//         </div>
//       </section>

//       <a
//         className="wa-banner"
//         href={waLink}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Chat now on WhatsApp"
//         onClick={trackWAClicks}
//       >
//         <Banner
//           image={whatsappbanner}
//           alt="Your Celebrations, Our Commitment"
//           border="1px solid #599911"
//         />

//         <span className="wa-banner__btn">
//           <Image
//             src={whatsappIcon}
//             alt=""
//             aria-hidden="true"
//             width={24}
//             height={24}
//             className="wa-banner__icon"
//           />
//           <span>Chat Now on WhatsApp</span>
//         </span>
//       </a>

//       {/* <DecorGrid
//         largeCard={largeCard}
//         smallCards={smallCards}
//         city={city}
//         hasCityPageParam={hasCityPageParam}
//         decCat={decCat}
//         locality={locality}
//       /> */}

//       <section className="why-people-love-us">
//         <div className="page-width">
//           <h2>Why People Love Us</h2>
//           <div className="stats-line-container">
//             {stats.map((item, index) => (
//               <div key={index} className="stat-item">
//                 <Image
//                   src={item.icon}
//                   alt={item.label}
//                   width={70}
//                   height={50}
//                 />
//                 <h3>{item.number}</h3>
//                 <p>{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <div className="page-width">
//         <BirthdayBanner href={`/${categorySlug}/birthday-decoration`} />
//       </div>

//       <DecorSlider
//         title="Premium Birthday Decorations"
//         catValue="premium-decoration"
//         viewAllLink={`/${categorySlug}/premium-decoration`}
//         data={PremiumData}
//         showDiscount={true}
//         imageSize={{ width: 120, height: 120 }}
//         city={city}
//         hasCityPageParam={hasCityPageParam}
//         decCat={decCat}
//         locality={locality}
//       />

//       <div className="page-width">
//         <BirthdayMagicalBanner href={`/${categorySlug}/birthday-decoration`} />
//       </div>

//       <ProductSliderSection
//         title="Birthday Decoration"
//         data={birthdayData}
//         viewLink={`/${categorySlug}/birthday-decoration`}
//         city={city}
//         hasCityPageParam={hasCityPageParam}
//         locality={locality}
//         catValue="birthday-decoration"
//       />

//       <div className="decorationBanner-outer">
//         <div className="collage-heading">
//           Capturing Elegance in Every Celebration
//         </div>
//         <div className="page-width">
//           <section className="decorationCollageBanner">
//             <Image
//               src={decorCollageIMG}
//               alt="Decoration-Banner"
//               width={"100%"}
//               height={"auto"}
//               className="decorationCollageBanner-image"
//             />
//           </section>
//         </div>
//       </div>

//       <section className="couple-sec">
//         <div className="couple-sec__bg" aria-hidden="true">
//           <Image
//             src={coupleBgBanner}
//             alt=""
//             sizes="(max-width: 768px) 100vw, 600px"
//             className="couple-sec__bg-img"
//           />
//         </div>

//         <div className="couple-sec__inner">
//           <div className="couple-sec__head">
//             <p className="couple-sec__eyebrow">Made for beautiful Moments</p>
//             <h2 className="couple-sec__title">Couple Celebrations</h2>
//             <p className="couple-sec__subtitle">
//               Decorations that make your bond even more special
//             </p>
//           </div>

//           <div className="Couple-Celebrations-box">
//             <CelebrationCard
//               href={`/${categorySlug}/anniversary-decoration`}
//               bg={anniversaryBg}
//               photo={anniversaryPhoto}
//               photoAlt="Anniversary decoration"
//               imageSide="left"
//               title="Anniversary"
//               subtitle="Celebrate your love with a beautiful setup."
//               accent="#c4405f"
//               titleColor="#c4405f"
//               divider={anniversaryDivider}
//               features={[
//                 { icon: elegantDecor, label: "Elegant Decor" },
//                 { icon: perfectPicture, label: "Perfect Picture" },
//                 { icon: romanticSetup, label: "Romantic Setup" },
//               ]}
//             />

//             <CelebrationCard
//               href={`/${categorySlug}/first-night-decoration`}
//               bg={firstNightBg}
//               photo={firstNightPhoto}
//               photoAlt="First night decoration"
//               imageSide="right"
//               title="First Night"
//               subtitle="Make your first night truly special."
//               accent="#764C9E"
//               titleColor="#764C9E"
//               divider={firstNightDivider}
//               features={[
//                 { icon: beautifulDecor, label: "Beautiful Decor" },
//                 { icon: romanticAmbience, label: "Romantic Ambience" },
//                 { icon: memorableMoment, label: "Memorable Moment" },
//               ]}
//             />
//           </div>
//         </div>
//       </section>

//       <DecorSlider
//         title="Anniversary Decoration"
//         catValue="anniversary-decoration"
//         viewAllLink={`/${categorySlug}/anniversary-decoration`}
//         data={AnniversaryData}
//         showDiscount={true}
//         imageSize={{ width: 120, height: 120 }}
//         city={city}
//         locality={locality}
//         hasCityPageParam={hasCityPageParam}
//         viewAllText="View All Anniversary  Decoration"
//       />

//       <section className="baby-sec">
//         <div className="baby-sec__bg" aria-hidden="true">
//           <Image
//             src={babyBgBanner}
//             alt=""
//             sizes="(max-width: 768px) 100vw, 600px"
//             className="baby-sec__bg-img"
//           />
//         </div>

//         <div className="baby-sec__inner">
//           <div className="baby-sec__head">
//             <p className="baby-sec__eyebrow">Celebrate the joy of</p>
//             <h2 className="baby-sec__title">Baby Celebrations</h2>
//             <p className="baby-sec__subtitle">
//               Beautiful setups for your little one&apos;s special moments
//             </p>
//           </div>

//           <div className="baby-sec__grid">
//             <BabyCelebrationCard
//               image={babyShowerPhoto}
//               icon={babyShowerIcon}
//               title="Baby Shower"
//               subtitle="Celebrate the upcoming arrival"
//               color="#9b59c4"
//               href={`/${categorySlug}/baby-shower-decoration`}
//             />
//             <BabyCelebrationCard
//               image={babyWelcomePhoto}
//               icon={babyWelcomeIcon}
//               title="Baby Welcome"
//               subtitle="Welcome your little bundle of joy"
//               color="#e48f8f"
//               href={`/${categorySlug}/welcome-baby-decoration`}
//             />
//             <BabyCelebrationCard
//               image={namingPhoto}
//               icon={namingIcon}
//               title="Naming Ceremony"
//               subtitle="Celebrate the upcoming arrival"
//               color="#25a99a"
//               href={`/${categorySlug}/naming-ceremony-decoration`}
//             />
//             <BabyCelebrationCard
//               image={annaprashanPhoto}
//               icon={annaprashanIcon}
//               title="Annaprashan Ceremony"
//               subtitle="Welcome your little bundle of joy"
//               color="#e8a23a"
//               href={`/${categorySlug}/annaprashan-decoration`}
//             />
//           </div>
//         </div>
//       </section>

//       <ProductSliderSection
//         title="Babyshower Decoration"
//         data={BabyShowerData}
//         viewLink={`/${categorySlug}/baby-shower-decoration`}
//         locality={locality}
//         hasCityPageParam={hasCityPageParam}
//         catValue="baby-shower-decoration"
//         city={city}
//       />

//       <section className="BabyShowerBanner">
//         <Image
//           src={BrandBannerIMG}
//           alt="Decoration-Banner"
//           width={1200}
//           height={400}
//           className="decorationBanner-image"
//         />
//       </section>

//       <BrandBanner
//         title="Excellence Backed by Happy Customers"
//         items={brandItems}
//       />

//       <div ref={reviewsRef} style={{ margin: "10px 0px" }}>
//         <GoogleReviewsCard reviews={balloonreviewsproduct} />
//       </div>
//     </div>
//   );
// };

// export default Decoration;

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import checkImage from "@/assets/tick.svg";
import logo from "@/assets/new_logo_light.png";
import HowitWork from "@/assets/howitwork.jpg";
import HappyCustomerIMG from "@/assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "@/assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "@/assets/ourSocialmediaIMG.png";
import TopBrandIMg from "@/assets/TpBrandsIMG.png";
import ShareIcon from "@/assets/shareIcon.svg";
import pencil from "@/assets/pencil.svg";
import SimiliarThemes from "@/assets/SimilarThemes.svg";
import StarIcon from "@/assets/StarIcon.svg";
import fireIcon from "@/assets/fireIcon.svg";
import hearticon from "@/assets/hearticon.svg";
import fallbackImg from "@/assets/fallback-image.png";
import VideoClint from "@/assets/ourclientvideo.mp4";

import "../../pages/balloon-decoration/[catValue]/product/[productName]/Decorproduct.css";
import "@/css/decoration.css";
import "@/components/CategoryTabs/CategoryTabs.css";

import {
  getDecorationProductOrganizationSchema,
  getProductFAQSchemaProductDetails,
} from "@/utils/schema";
import {
  filterSimilarProducts,
  filterLevelUpProducts,
  getMappedCatValue,
  getCategoryNameToSlug,
} from "@/utils/similarProductUtils";
import {
  BASE_URL,
  GET_DECORATION_BY_NAME,
  GET_ADDON_BY_ID,
  COMPRESSED_WEBP_IMG_URL,
} from "@/utils/apiconstants";
import { CATEGORY_CONFIG, resolveCategorySlug } from "@/utils/Categoryconfig";
import FAQSection from "@/components/FAQSection";
import faqData from "@/utils/faqData.json";
import CategoryTabs from "@/components/CategoryTabs/index.jsx";
import { themeFilters } from "@/utils/themeFilters";
import AddonModal from "@/components/AddonModal";
import AdditionalServices from "@/components/AdditionalServices";
import BrandBanner from "@/components/BrandBanner";
import SimilarDecorationSlider from "@/components/SimilarDecorationSlider";
import VideoTestimonial from "@/components/VideoTestimonial";
import AddOnsList from "@/components/AddOnsList";
import { fetchWithError } from "@/utils/fetchWithError";
import axiosApi from "@/utils/axiosApi";
import MakeItYoursBanner from "@/components/MakeItYoursBanner";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import { balloonreviewsproduct } from "@/utils/balloonReviews";
import ActionButtons from "@/components/Actionbuttons";
import WhyHoraSection from "@/components/WhyHoraSection";
import { useCity } from "@/utils/cityContext";
import WhatsAppIcon from "@/app/WhatsAppIconGtm";
import { ProductPageLoader } from "../PageLoaders/ProductPageLoader";

// Category-wise reviews. Wedding ke reviews ready ho jayein to yahan add kar do.
const REVIEWS_BY_CATEGORY = {
  "balloon-decoration": balloonreviewsproduct,
  // wedding: weddingreviewsproduct,
};

// ---------- helpers ----------
const getDiscountedPrice = (price) => {
  let discount;
  if (price < 3000) discount = 20;
  else if (price >= 3000 && price <= 5000) discount = 27;
  else discount = 35;

  const discountedPrice = parseFloat(price) * (1 + parseFloat(discount) / 100);
  const discountDifference = Math.abs(parseFloat(price) - discountedPrice);
  return { discount, discountedPrice, discountDifference };
};

const generateSlug = (name) =>
  name
    ?.toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const formatProductName = (productName) => {
  if (!productName) return "";
  return productName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const toTitleCase = (str = "") =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// ---------- Component (NO getServerSideProps here) ----------
function DecorationsCatDetails({
  initialProduct = null,
  initialCatValue = "",
  initialSubCategory = "",
  initialAllProducts = [],
  initialAddonData = [],
  city = null,
  locality = null,
  initialCategoryDetaiils: ssrCategoryDetails = null,
  isDirectProductPage = false,
  // "balloon-decoration" ya "wedding". Prop na mile to URL se auto-detect hoga.
  categorySlug: categorySlugProp,
  // SSR-safe product slug from context.params — use for canonical URL so
  // Googlebot doesn't see a broken canonical without the product name.
  productNameFromUrl = null,
}) {
  const { selectedCitySlug, selectedCityName } = useCity();
  const router = useRouter();
  const categorySlug = resolveCategorySlug(categorySlugProp, router.asPath);
  const categoryConfig =
    CATEGORY_CONFIG[categorySlug] || CATEGORY_CONFIG["balloon-decoration"];

  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [catValue, setCatValue] = useState(initialCatValue || "");
  const [subCategory, setSubCategory] = useState(initialSubCategory || "");
  const [apiProduct, setApiProduct] = useState(
    initialProduct?.name || formatProductName(router.query?.productName),
  );

  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [discountInfo, setDiscountInfo] = useState(
    initialProduct?.price ? getDiscountedPrice(initialProduct.price) : null,
  );
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [sendCategoryId, setSendCategoryId] = useState(initialCatValue || "");
  const [passCategoryId, setPassCategoryId] = useState(ssrCategoryDetails);
  const [allProducts, setAllProducts] = useState(initialAllProducts || []);
  const [addonIds, setAddonIds] = useState(initialProduct?.addons || []);
  const [addonData, setAddonData] = useState(initialAddonData || []);
  const [selCat, setSelCat] = useState("");

  const [similarByTheme, setSimilarByTheme] = useState(() => {
    if (initialProduct && initialAllProducts?.length) {
      return filterSimilarProducts(
        initialProduct,
        initialAllProducts,
        themeFilters,
      );
    }
    return [];
  });

  const [levelUp1000, setLevelUp1000] = useState(() => {
    if (initialProduct?.price && initialAllProducts?.length) {
      const { level1 } = filterLevelUpProducts(
        initialProduct.price,
        initialAllProducts,
        initialProduct._id,
      );
      return level1;
    }
    return [];
  });

  const [levelUp2000, setLevelUp2000] = useState(() => {
    if (initialProduct?.price && initialAllProducts?.length) {
      const { level2 } = filterLevelUpProducts(
        initialProduct.price,
        initialAllProducts,
        initialProduct._id,
      );
      return level2;
    }
    return [];
  });

  const customizationRef = useRef(null);
  const similarRef = useRef(null);
  const addonRef = useRef(null);
  const reviewsRef = useRef(null);

  // "balloon-decoration" -> "balloon decoration", "wedding" -> "wedding"
  const categoryLabel = categorySlug.replace(/-/g, " ");
  // Direct URL par catValue khali ho sakta hai, to categoryLabel use karo
  const catLabel = catValue ? catValue.replace(/-/g, " ") : categoryLabel;
  // Meta description me "decoration" alag se likha hai, isliye double word hatao
  const catLabelShort = catLabel.replace(/\s*decoration$/i, "").trim();

  const altTagCatValue = (catValue || "").replace(/-/g, " ");
  const kidsCategories = ["kids-birthday-decoration", "kidsbirthday"];

  const brandItems = [
    {
      img: HappyCustomerIMG,
      alt: "Happy Customers",
      bold: "1L+HAPPY ",
      sub: "CUSTOMERS",
    },
    {
      img: GoogleRatingIMG,
      alt: "Google Rating",
      bold: "4.8+ GOOGLE",
      sub: "RATING",
    },
    {
      img: SocialMediaIMG,
      alt: "Social Media",
      bold: "OUR",
      sub: "SOCIAL MEDIA",
    },
    {
      img: TopBrandIMg,
      alt: "Top Brands",
      bold: "TOP BRANDS",
      sub: "PARTNERED",
    },
  ];

  // Client-side route change
  useEffect(() => {
    if (!router.isReady) return;

    const { catValue: urlCat, subCategory: urlSub, productName } = router.query;

    if (urlCat) {
      setSendCategoryId(getMappedCatValue(urlCat));
    }
    if (urlSub) setSubCategory(urlSub);

    if (productName) {
      setApiProduct(formatProductName(productName));
    }
  }, [router.isReady, router.query]);

  // Client fetch only when product name changes (SSR already hai to skip)
  useEffect(() => {
    if (!apiProduct) return;
    if (
      product?.name &&
      product.name.toLowerCase() === apiProduct.toLowerCase()
    ) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const tryFetch = async (name) => {
          const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${encodeURIComponent(name)}`;
          const res = await axiosApi.get(url);
          if (res?.data?.error) return null;
          return res?.data?.data?.[0] || null;
        };

        let fetched = await tryFetch(apiProduct);
        if (!fetched && /\bAnd\b/i.test(apiProduct)) {
          fetched = await tryFetch(apiProduct.replace(/\bAnd\b/gi, "&"));
        }
        const tagId = fetched?.tag?.[0];
        if (tagId) {
          try {
            const categoryResp = await axiosApi.get(
              `${BASE_URL}/api/photography/categoryNameByTagId/${tagId}`,
            );
            setPassCategoryId(categoryResp.data?.data || []);
            setCatValue(getCategoryNameToSlug(categoryResp?.data?.data?.name));
          } catch (e) {
            console.error("SSR categoryResp:", e.message);
          }
        }

        if (!fetched) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(fetched);
        if (fetched.price) setDiscountInfo(getDiscountedPrice(fetched.price));
        setAddonIds(fetched.addons || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [apiProduct]);

  // Category products — SSR data ho to skip
  useEffect(() => {
    if (initialAllProducts?.length) return;
    if (product?.categoryId) getCategoryProducts(product.categoryId);
  }, [product, catValue]);

  useEffect(() => {
    if (passCategoryId) getCategoryProducts(passCategoryId?._id);
  }, [passCategoryId]);

  const getCategoryProducts = async (categoryId) => {
    try {
      const res = await axiosApi.get(
        `${BASE_URL}/api/Decoration/searchByTag/v2/${categoryId}?page=1&priceFilter=all&sortBy=asc&theme=all&limit=500`,
      );
      setAllProducts(res.data.data || []);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    if (product && allProducts.length > 0) {
      setSimilarByTheme(
        filterSimilarProducts(product, allProducts, themeFilters),
      );
    }
  }, [product, allProducts]);

  useEffect(() => {
    if (product?.price && allProducts.length > 0) {
      const { level1, level2 } = filterLevelUpProducts(
        product.price,
        allProducts,
        product._id,
      );
      setLevelUp1000(level1);
      setLevelUp2000(level2);
    }
  }, [product, allProducts]);

  // Addons persist
  useEffect(() => {
    if (!product?._id) return;
    try {
      const saved = sessionStorage.getItem(`addons_${product._id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedAddOnProduct(parsed.selectedAddOnProduct || []);
        setItemQuantities(parsed.itemQuantities || {});
      }
    } catch (e) {}
  }, [product?._id]);

  useEffect(() => {
    if (!product?._id) return;
    try {
      sessionStorage.setItem(
        `addons_${product._id}`,
        JSON.stringify({ selectedAddOnProduct, itemQuantities }),
      );
    } catch (e) {}
  }, [selectedAddOnProduct, itemQuantities, product?._id]);

  // Fetch addon details — SSR data ho to skip
  useEffect(() => {
    if (initialAddonData?.length) return;
    if (!addonIds?.length) return;

    const getAddons = async () => {
      try {
        const q = new URLSearchParams();
        addonIds.forEach((id) => id && q.append("ids", id));
        if (![...q].length) return;
        const res = await fetchWithError(`${BASE_URL}${GET_ADDON_BY_ID}?${q}`);
        const data = await res.json();
        if (res.ok && !data.error) setAddonData(data.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    getAddons();
  }, [addonIds]);

  useEffect(() => {
    if (!subCategory) return;
    let result = "";
    for (let i = 0; i < subCategory.length; i++) {
      if (i !== 0 && subCategory[i] === subCategory[i].toUpperCase())
        result += " ";
      result += subCategory[i];
    }
    setSelCat(result);
  }, [subCategory]);

  // ---------- handlers ----------
  const openCatItems = (item) => {
    const catSlug = item.catSlug || item.catValue || "kids-birthday-decoration";
    // categorySlug (balloon-decoration / wedding) use hoga
    let path = `/${categorySlug}/${catSlug}`;
    if (item.value) path += `?theme=${encodeURIComponent(item.value)}`;
    router.push(path);
  };

  const handleCustomise = (type) => {
    const messages = {
      "kids-birthday-decoration":
        "Hi, I want to customize a kids birthday decoration design, can you help me",
      "birthday-decoration":
        "Hi, I want to customize a birthday decoration design, can you help me",
      "anniversary-decoration":
        "Hi, I want to customize an anniversary decoration design, can you help me",
      "baby-shower-decoration":
        "Hi, I want to customize a baby shower decoration design, can you help me",
      "welcome-baby-decoration":
        "Hi, I want to customize a baby welcome decoration design, can you help me",
      "first-night-decoration":
        "Hi, I want to customize a first night decoration design, can you help me",
      "premium-decoration":
        "Hi, I want to customize a premium decoration design, can you help me",
      "haldi-mehendi-decoration":
        "Hi, I want to customize a haldi & mehendi decoration design, can you help me",
      "wedding-decoration":
        "Hi, I want to customize a wedding decoration design, can you help me",
      "bachelorette-decoration":
        "Hi, I want to customize a bachelorette decoration design, can you help me",
    };
    const phoneNumber = "917338584828";
    const message =
      (messages[type] ||
        "Hi, I want to customize a decoration design, can you help me") + "!";

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Customization_WhatsApp_Button",
      eventCategory: "Product Page",
      eventAction: "WhatsApp Click",
      eventLabel: "Customization WhatsApp Button",
    });

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const showAddOnmodal = () => {
    setIsModalOpen((p) => !p);
    setIsArrowDown((p) => !p);
    setTimeout(
      () =>
        addonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      100,
    );
  };

  const updateTotalAmount = () => {
    let total = Number(product?.price || 0);
    selectedAddOnProduct.forEach((item) => {
      total += item.price * (itemQuantities[item.title] || 0);
    });
    setTotalAmount(total);
  };

  useEffect(() => {
    if (product?.price) updateTotalAmount();
  }, [selectedAddOnProduct, itemQuantities, product?.price]);

  const handleAddToCart = (item) => {
    const updated = [...selectedAddOnProduct];
    const idx = updated.findIndex((a) => a.title === item.title);
    if (idx !== -1) updated[idx].quantity += 1;
    else updated.push({ ...item, quantity: 1 });

    setSelectedAddOnProduct(updated);
    setItemQuantities({
      ...itemQuantities,
      [item.title]: (itemQuantities[item.title] || 0) + 1,
    });
  };

  const handleRemoveFromCart = (item) => {
    const updated = [...selectedAddOnProduct];
    const idx = updated.findIndex((a) => a.title === item.title);
    if (idx !== -1) {
      if (updated[idx].quantity > 1) updated[idx].quantity -= 1;
      else updated.splice(idx, 1);
    }
    const qty = { ...itemQuantities };
    if (qty[item.title] > 1) qty[item.title] -= 1;
    else delete qty[item.title];

    setSelectedAddOnProduct(updated);
    setItemQuantities(qty);
  };

  const calculateTotalPrice = (price) => {
    let total = Number(price || 0);
    selectedAddOnProduct.forEach((item) => {
      total += item.price * (itemQuantities[item.title] || 0);
    });
    return total;
  };

  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);
    setIsModalOpen(false);
    setTimeout(() => {
      customizationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  const handleCheckout = () => {
    const totalPrice = calculateTotalPrice(product?.price);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "continue_button_product_detail_page",
      product_name: product?.name,
    });

    const selectedAddonSort = selectedAddOnProduct?.map((item) => ({
      id: item?._id,
      quantity: item?.quantity,
    }));

    router.push({
      pathname: "/checkout",
      query: {
        productid: product?._id,
        selectedaddonids: JSON.stringify(selectedAddonSort),
        totalAmount: totalPrice,
      },
    });
  };

const handleShare = () => {
  const cleanUrl = window.location.origin + window.location.pathname;

  // GTM Event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "product-details_page_share_clicked",
    product_name: product?.name || "Hora Services",
    share_url: cleanUrl,
    share_method: navigator.share ? "native_share" : "copy_link",
    page_path: window.location.pathname,
  });

  if (navigator.share) {
    navigator.share({
      title: product?.name || "Hora Services",
      url: cleanUrl,
    }).catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    });
  } else {
    navigator.clipboard.writeText(cleanUrl)
      .then(() => alert("Link copied!"))
      .catch(() => alert("Unable to copy link"));
  }
};

  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || !inclusion.length) return null;
    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, "");
    const withoutSpecial = withoutTags.replace(/&#[^;]*;/g, " ");
    const items = withoutSpecial
      .split("<div>")
      .flatMap((s) => s.split("-").filter((i) => i.trim()));

    return (
      <div className="inclusion-sections">
        <div className="inclusion-heading">Inclusions</div>
        <ul className="inclusion-list">
          {items.map((item, i) => (
            <li className="inclusionstyle" key={i}>
              <Image src={checkImage} alt="check" className="inclusion-check" />
              <span className="inclusion-text">{item.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const schemaOrg = getDecorationProductOrganizationSchema(product || {});
  const scriptTag = JSON.stringify(schemaOrg);
  const faqSchema = getProductFAQSchemaProductDetails(product || {});
  const faqScriptTag = JSON.stringify(faqSchema);

  if (loading && !product) {
    return <ProductPageLoader />;
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 1200, margin: "40px auto", textAlign: "center" }}>
        <h1>Product not found</h1>
        <p>This design is not found. Please try another design.</p>
      </div>
    );
  }

  const SITE = "https://horaservices.com";

  const slugify = (val) =>
    String(val || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

  // city and locality props come from getServerSideProps — always SSR-safe.
  const cityFromUrl = city || null;
  const localityFromUrl = locality || null;

  // productNameFromUrl from context.params is SSR-safe.
  // router.query?.productName is empty at SSR time → broken canonical for Googlebot.
  const productSlug =
    productNameFromUrl ||
    product?.slug ||
    generateSlug(product?.name) ||
    "";

  const buildProductCanonical = () => {
    const parts = [];
    if (cityFromUrl) parts.push(slugify(cityFromUrl));
    if (localityFromUrl) parts.push(slugify(localityFromUrl));
    parts.push(categorySlug);
    parts.push("product");
    if (productSlug) parts.push(productSlug);
    return `${SITE}/${parts.filter(Boolean).join("/")}`;
  };

  const canonicalUrl = buildProductCanonical();

  // Breadcrumb: catValue ho to /<categorySlug>/<catValue>, warna sirf /<categorySlug>
  const breadcrumbHref = `/${categorySlug}${catValue ? `/${catValue}` : ""}`;
  const breadcrumbText = toTitleCase(catValue || categorySlug);

  const metaDescription = `${product?.name || "Decoration"} from Hora Services – Beautiful ${catLabelShort} decoration${categoryConfig.startingPrice
      ? ` starting at just ₹${categoryConfig.startingPrice}`
      : ""
  }. Book for birthdays, anniversaries, weddings & more!`;

  const reviewsForCategory =
    REVIEWS_BY_CATEGORY[categorySlug] || balloonreviewsproduct;
  const DEFAULT_OG_IMAGE =
    "https://horaservices.com/api/uploads/attachment-1706520980436.png";

  const toAbsolute = (u) => (u.startsWith("http") ? u : `${SITE}${u}`);

  const featuredFileName = product?.featured_images?.[0]?.fileName;

  const ogImage = featuredFileName
    ? toAbsolute(
      `${COMPRESSED_WEBP_IMG_URL}${featuredFileName.split(".")[0]}.webp`,
    )
    : DEFAULT_OG_IMAGE;

  const seoTitle = `${product?.name || ""} | ${catLabel}`;
  const ogTitle = `${product?.name || ""} | ${catLabel} by Hora Services`;
  const ogDescription = `Book ${product?.name || ""} decoration by Hora Services. Explore ${catLabelShort} designs for birthdays, anniversaries, baby showers & more.`;
  return (
    <>
      <div className="App" style={{ backgroundColor: "white" }}>
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={metaDescription} />
          <meta
            name="keywords"
            content={`${product?.name || ""}, ${catLabel}, ${categoryLabel}, ${product?.name || ""} decoration price`}
          />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Hora Services" />

          <link rel="canonical" href={canonicalUrl} />
          <link
            rel="icon"
            href="https://horaservices.com/api/uploads/logo-icon.png"
            type="image/x-icon"
          />

          {/* Open Graph */}
          <meta property="og:title" content={ogTitle} />
          <meta property="og:description" content={ogDescription} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:alt" content={product?.name || "Hora Services"} />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={ogTitle} />
          <meta name="twitter:description" content={ogDescription} />
          <meta name="twitter:image" content={ogImage} />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: scriptTag }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: faqScriptTag }}
          />
        </Head>

        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="decDetails">
            <div className="decDetailsLeft">
              <div style={{ position: "relative" }}>
                <Image
                  src={
                    product?.featured_images?.[0]?.fileName
                      ? `${COMPRESSED_WEBP_IMG_URL}${product.featured_images[0].fileName.split(".")[0]}.webp`
                      : fallbackImg
                  }
                  alt={`${categoryLabel} ${altTagCatValue} ${product?.name || ""} ${product?.price || ""}`}
                  style={{ width: "100%", height: "auto" }}
                  width={300}
                  height={300}
                  priority
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 3,
                    right: 3,
                    borderRadius: "50%",
                    padding: 10,
                  }}
                >
                  <Image
                    src={logo}
                    alt="Hora Services"
                    className="hora-watermark-image"
                  />
                </div>
              </div>
            </div>

            <div className="decDetailsRight">
              <div
                style={{
                  padding: "clamp(8px, 2.5vw, 10px) clamp(8px, 2.5vw, 10px) 0",
                }}
              >
                <div className="breadcrumb-row">
                  <h2 className="breadcrumb-text">
                    <a className="breadcrumb-link" href="/">
                      Home
                    </a>
                    {" > "}
                    <a className="breadcrumb-link" href={breadcrumbHref}>
                      {breadcrumbText}
                    </a>
                    {" > "}
                  </h2>
                </div>

                <h1 className="product-title">{product?.name}</h1>

                <div className="price-share-row">
                  <div className="pro-details-price">
                    <p className="product-price">₹ {product?.price ?? 0}</p>
                    <p className="product-old-price">
                      ₹ {Math.floor(discountInfo?.discountedPrice || 0)}
                    </p>
                    <div className="product-discount">
                      ₹ {Math.floor(discountInfo?.discountDifference || 0)} off
                    </div>
                  </div>
                  <div className="share-btn" onClick={handleShare}>
                    <Image
                      src={ShareIcon}
                      alt="share"
                      className="share-icon-img"
                    />
                  </div>
                </div>

                <ActionButtons
                  product={product}
                  catValue={catValue}
                  cityName={selectedCitySlug}
                  similarRef={similarRef}
                  handleCustomise={handleCustomise}
                />

                <div className="addon-container" ref={customizationRef}>
                  <AddOnsList
                    selectedAddOnProduct={selectedAddOnProduct}
                    itemQuantities={itemQuantities}
                    showAddOnmodal={showAddOnmodal}
                    pencil={pencil}
                  />
                </div>
              </div>

              <div
                style={{
                  padding:
                    "clamp(8px, 2.5vw, 10px) clamp(8px, 2.5vw, 10px) 0px",
                }}
              >
                {getItemInclusion(product?.inclusion)}
              </div>

              <MakeItYoursBanner />

              <div ref={addonRef}>
                <AddonModal
                  isOpen={isModalOpen}
                  setIsOpen={setIsModalOpen}
                  addOnProducts={addonData}
                  itemQuantities={itemQuantities}
                  onAdd={handleAddToCartAndScrollBack}
                  onRemove={handleRemoveFromCart}
                />
              </div>

              <div ref={similarRef}>
                <SimilarDecorationSlider
                  title="Similar Decorations"
                  data={similarByTheme}
                  showDiscount={true}
                  imageSize={{ width: 120, height: 120 }}
                  city={selectedCitySlug}
                  locality={locality}
                  catValue={catValue}
                  icon={StarIcon}
                  sparkleIcon={SimiliarThemes}
                  isDirectProductPage={isDirectProductPage}
                  categorySlug={categorySlug}
                />
              </div>

              {kidsCategories.includes(catValue?.toLowerCase()) && (
                <div className="category-tabs-outer">
                  <CategoryTabs
                    data={themeFilters.map((item) => ({
                      id: item.value,
                      name: item.label,
                      image: item.image,
                      value: item.value,
                      catValue: "kids-birthday-decoration",
                    }))}
                    onSelect={openCatItems}
                    city={selectedCitySlug}
                    hasCityPageParam={!!selectedCitySlug}
                    locality={locality}
                    variant="grid"
                    catValue="kids-birthday-decoration"
                    heading="Other Popular Themes"
                    hasBg={true}
                    icon={StarIcon}
                    fireIcon={fireIcon}
                    isDirectProductPage={isDirectProductPage}
                  />
                </div>
              )}

              {levelUp1000.length > 0 && (
                <SimilarDecorationSlider
                  title="You May Also Like This"
                  data={levelUp1000}
                  showDiscount={true}
                  city={selectedCitySlug}
                  locality={locality}
                  catValue={catValue}
                  icon={StarIcon}
                  sparkleIcon={hearticon}
                  isDirectProductPage={isDirectProductPage}
                  categorySlug={categorySlug}
                />
              )}

              {levelUp2000.length > 0 && (
                <SimilarDecorationSlider
                  data={levelUp2000}
                  showDiscount={true}
                  city={selectedCitySlug}
                  locality={locality}
                  catValue={catValue}
                  isDirectProductPage={isDirectProductPage}
                  categorySlug={categorySlug}
                />
              )}

              <WhyHoraSection />

              <div ref={reviewsRef}>
                <GoogleReviewsCard reviews={reviewsForCategory} />
              </div>

              <BrandBanner
                title="Excellence Backed by Happy Customers"
                items={brandItems}
              />
              <VideoTestimonial videoSrc={VideoClint} />

              <div className="decorke-celebrate-banner">
                <Image
                  src={HowitWork}
                  alt="Customize Your Celebration"
                  className="decorke-banner-img"
                />
              </div>

              <AdditionalServices />

              <div className="tab-section-details-productpage">
                <FAQSection faqData={faqData} />
              </div>
            </div>
          </div>

          <div className="confirm-button-wrapper">
            <p style={{ fontWeight: "bold", marginBottom: 0, color: "black" }}>
              Total: ₹ {calculateTotalPrice(Number(product?.price || 0))}
            </p>
            <button className="confirm-button" onClick={handleCheckout}>
              Continue
            </button>
          </div>
        </div>
      </div>
      <div className="whatsapp-container">
        <WhatsAppIcon
          router={router}
          categorySlug={getCategoryNameToSlug(passCategoryId?.name) || ""}
          citySlugProduct={selectedCityName}
        />
      </div>
    </>
  );
}

export default DecorationsCatDetails;