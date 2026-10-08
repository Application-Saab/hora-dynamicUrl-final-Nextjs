import React, { useState, useRef, useMemo } from "react";
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
import Banner1 from "../../assets/decbanner3.webp";
import Banner2 from "../../assets/decbanner2.webp";
import Banner3 from "../../assets/decbanner1.webp";
import Kidsbirthday from "../../assets/kidsBirthdayIMG.webp";
import BabyWelcome from "../../assets/BabyWelcomeIMG.webp";
import Anniversary from "../../assets/AnniversaryIMG.webp";
import arrowIcon from "../../assets/arrow-down.svg";
import CategoryTabs from "@/components/CategoryTabs";
import { balloonreviewsproduct } from "@/utils/balloonReviews";
import SmallCardGrid from "@/components/SmallCardGrid";
import CategoryGrid from "@/components/CategoryGrid";
import DecorGrid from "@/components/DecorGrid";
import WhyHoraIMG from "../../assets/WhyHoraIMG.webp";
import DecorationBannerIMG from "../../assets/DecorationBannerIMG.webp";
import decorCollageIMG from "../../assets/decorCollageIMG.webp";
import HappyBirthdayImg from "../../assets/HappyBirthdayImg.png";
import BabyShowerImg from "../../assets/BabyShowerIMG.webp";
import kidsBirthdayImg from "../../assets/KidsBirthdayIMG.png";
import BabyWelcomeImg from "../../assets/WelcomBabyIMG.webp";
import PremiumDecorImg from "../../assets/PremiumDecorIMG.webp";
import BacheloretteImg from "../../assets/BacheloretteIMG.png";
import HaldiMehandiImg from "../../assets/HaldiMehandiIMG.webp";
import FirstNightImg from "../../assets/FirstNightIMG.webp";
import AnniversaryImg from "../../assets/AnniversaryDecorIMG.webp";
import BabyShowerBannerIMG from "../../assets/BabyShowerBannerIMG.webp";
import BrandBannerIMG from "../../assets/BrandBannerIMG.webp";
import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../assets/TpBrandsIMG.png";
import BrandBanner from "@/components/BrandBanner";
import decorationWedding from "@/assets/decorationwedding.webp";
import decorationBridetobe from "@/assets/decorationBride-tobe.webp";
import decorationhaldi from "@/assets/decorationhaldi-Mhendi.webp";
import Engagementdecoration from "@/assets/engament.webp";
import bannerImg from "@/assets/Banner.webp";
import whatsappbanner from "@/assets/Whatsaap_banner.webp";
import weddingBannerImg from "@/assets/Wedding_banner.webp";
import PremiumBannerImg from "@/assets/priumum_banner.webp";
import BirthdayBannerImg from "@/assets/Birthday_magical_banner.webp";
import Decorationseodata from "@/utils/Decorationseodata.json";
import haldiImg from "@/assets/trending-haldi.webp";
import mehandiImg from "@/assets/trending-mehandi.webp";
import mandapImg from "@/assets/trending-mandap.webp";
import carImg from "@/assets/trending-wedding-car.webp";
import receptionImg from "@/assets/trending-reception.webp";
import sangeetImg from "@/assets/trending-sangeet.webp";
import engagementImg from "@/assets/trending-engagement.webp";
import firstNightImg from "@/assets/trending-first-night.webp";
import weddingBg from "@/assets/weddingbackground_image.webp";
import { CalendarHeart, Flower2, Camera, Sparkles, PartyPopper, Star } from "lucide-react";
import anniversaryBg from "@/assets/Anniversaary.webp";   // pink background
import firstNightBg from "@/assets/Firts_night.webp";     // purple background
import anniversaryPhoto from "@/assets/Anniversaary.webp";   // apni photo
import firstNightPhoto from "@/assets/Firts_night.webp"; 
import coupleBgBanner from "@/assets/COUPLE_CELEBRATIONS_Bg_banner.webp";
const BannerSlider = dynamic(() => import("@/components/BannerSlider"));
const DecorSlider = dynamic(() => import("@/components/DecorSlider"));
const ProductSliderSection = dynamic(
  () => import("@/components/ProductSliderSection"),
);
const ReviewSlider = dynamic(() => import("@/components/ReviewSection"));
import {
  birthdayData,
  BabyShowerData,
  AnniversaryData,
  PremiumData,
} from "../../utils/DecorationData.js";
// import { usePathname } from "next/navigation";
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
import annaprashanPhoto from "@/assets/annaprashan.webp";
import babyShowerIcon from "@/assets/baby-shower-icon.webp";
import babyWelcomeIcon from "@/assets/baby-welcome-icon.webp";
import namingIcon from "@/assets/naming-ceremony-icon.webp";
import annaprashanIcon from "@/assets/annaprashan-icon.webp";

const stats = [
  {
    icon: whypeople1,
    number: "20k",
    label: "Balloon Designs In Stock",
  },
  {
    icon: whypeople2,
    number: "45+",
    label: "Decorations Themes",
  },
  {
    icon: whypeople3,
    number: "15M",
    label: "Satisfied Customers",
  },
  {
    icon: whypeople4,
    number: "10k",
    label: "Completed Decoration",
  },
];

const categories = [
  {
    name: "Birthday",
    image: HappyBirthdayImg,
    catValue: "birthday-decoration",
  },
  {
    name: "Baby Shower",
    image: BabyShowerImg,
    catValue: "baby-shower-decoration",
  },
  {
    name: "Kids Birthday",
    image: kidsBirthdayImg,
    catValue: "kids-birthday-decoration",
  },
  {
    name: "Welcome Baby",
    image: BabyWelcomeImg,
    catValue: "welcome-baby-decoration",
  },
  {
    name: "Stage Decoration",
    image: PremiumDecorImg,
    catValue: "premium-decoration",
  },
  {
    name: "Bachelorette",
    image: BacheloretteImg,
    catValue: "bachelorette-decoration",
  },
  {
    name: "Haldi Mehandi",
    image: HaldiMehandiImg,
    catValue: "haldi-mehendi-decoration",
  },
  {
    name: "First Night",
    image: FirstNightImg,
    catValue: "first-night-decoration",
  },
  {
    name: "Anniversary",
    image: AnniversaryImg,
    catValue: "anniversary-decoration",
  },
];
const brandItems = [
  {
    img: HappyCustomerIMG,
    alt: "Happy Customers",
    bold: "1L+ HAPPY",
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

const Decoration = ({ city, locality }) => {
  const smallCardRef = useRef(null);
  const router = useRouter();

  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  const hasCityPageParam = city ? true : false;
  const pathname = router.asPath;
const [sortOption, setSortOption] = useState("popularity");

// Dropdown mein category par click ka URL (CategoryGrid jaisa hi)
const getCategoryHref = (cat) => {
  let path = "";
  if (city) path += `/${city.toLowerCase()}`;
  if (locality) path += `/${locality.toLowerCase()}`;
  return `${path}/${categorySlug}/${cat.catValue}`;
};
// Search dropdown aur typewriter placeholder isi list se chalte hain
const searchCategoryList = categories.map((c) => ({
  id: c.catValue,
  label: c.name,
  image: c.image,
  catValue: c.catValue,
}));
  const categorySlug = useMemo(
    () => getCategorySlugFromPath(pathname, city, locality),
    [pathname, city, locality],
  );
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

  const smallCards = [
    {
      image: decorationhaldi,
      title: "Haldi-Mehandi",
      link: `/${categorySlug}/haldi-mehendi-decoration`,
      categoryName: "Haldi Mhendi",
      subCategory: "Haldi-Mehandi",
      catValue: "haldi-mehendi-decoration",
      imgAlt: "Haldi Mehendi Decoration",
    },
    {
      image: decorationBridetobe,
      title: "Bride To-be",
      link: `/${categorySlug}/bachelorette-decoration`,
      categoryName: "bachelorette",
      subCategory: "bachelorette",
      catValue: "bachelorette-decoration",
      imgAlt: "Bride to be Decoration",
    },
    {
      image: Engagementdecoration,
      title: "Engagement",
      link: `/${categorySlug}/engagement-decoration`,
      categoryName: "engagement",
      subCategory: "engagement",
      catValue: "engagement-decoration",
      imgAlt: "Engagement Decoration",
    },
  ];

  const largeCard = {
    image: decorationWedding,
    title: "Wedding",
    description: "DECORATIONS",
    link: `/${categorySlug}/wedding-decoration`,
    catValue: "Wedding",
  };

  const handleWhatsApp = () => {
    trackWAClicks();
    const phoneNumber = "7338584828";
    const message = encodeURIComponent("I want to customize a decoration");
    if (typeof window !== "undefined") {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    }
  };
  const handleSeeMoreClick = () => {
    setTimeout(() => {
      smallCardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // small delay ensures it's rendered first
  };
  const reviewsRef = useRef(null);
  const openCatItems = (item) => {
    if (!item?.catValue) return;

    const path = hasCityPageParam
      ? `/${city.toLowerCase()}/${categorySlug}/${item.catValue}`
      : `/${categorySlug}/${item.catValue}`;

    router.push(path);
  };

  const bannerImages = [Banner1, Banner2, Banner3];

  const SITE = "https://horaservices.com";
  const slugify = (val) =>
    String(val || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const citySlug = city ? slugify(city) : "";
  const localitySlug = locality ? slugify(locality) : "";

  const canonicalUrl =
    citySlug && localitySlug
      ? `${SITE}/${citySlug}/${localitySlug}/balloon-decoration`
      : citySlug
        ? `${SITE}/${citySlug}/balloon-decoration`
        : `${SITE}/balloon-decoration`;

  /* ------------------------------------------------------------------
   * PER-CITY SEO COPY (from SEO-WORK-DECORATION-LANDING)
   * Title/description har city ke liye custom.
   * ------------------------------------------------------------------ */

  const pageSeo = city
    ? citySeoData[city.toLowerCase()] || defaultSeo
    : defaultSeo;
const weddingCollections = [
  { title: "Haldi Decoration",      image: haldiImg,     catValue: "haldi-mehendi-decoration" },
  { title: "Mehandi Decoration",    image: mehandiImg,   catValue: "mehendi-decoration" },
  { title: "Mandap Decoration",     image: mandapImg,    catValue: "mandap-decoration" },
  { title: "Wedding Car Decoration", image: carImg,      catValue: "wedding-car-decoration" },
  { title: "Reception Decoration",  image: receptionImg, catValue: "reception-decoration" },
  { title: "Sangeet Decoration",    image: sangeetImg,   catValue: "sangeet-decoration" },
  { title: "Engagement Decoration", image: engagementImg, catValue: "engagement-decoration" },
  { title: "First Night Decoration", image: firstNightImg, catValue: "first-night-decoration" },
];
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

        {/* ✅ CANONICAL — city+locality aware */}
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

        {/* ✅ og:url = same as canonical */}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">{scriptTag}</script>
      </Head>

      <div className="top-slider">
       <Banner
  image={bannerImg}
  alt="Your Celebrations, Our Commitment"
  border="1px solid #97538C"   // yahan se border bheja
/>
<SearchSortBar
  sortOption={sortOption}
  onSortChange={setSortOption}
  searchCategoryList={searchCategoryList}
  products={[]}
  categoryType="decoration"
  getCategoryHref={getCategoryHref}
  getProductHref={() => "#"}
/>
         </div>
      {/* CIRCLE TABS */}
     <div ref={smallCardRef}>
        <SmallCardGrid
          city={city}
          hasCityPageParam={hasCityPageParam}
          decCat={decCat}
          categories={categories}
          locality={locality}
        />
      </div>

      <div className="CategoryGrid-outer">
        <CategoryGrid cardsData={cardsData} city={city} locality={locality} />
      </div>
<section className="wed-sec">
  {/* background image */}
  <div className="wed-sec__bg" aria-hidden="true">
    <Image
      src={weddingBg}
      alt=""
      sizes="(max-width: 768px) 100vw, 600px"
      className="wed-sec__bg-img"
    />
  </div>

  <div className="wed-sec__inner">
    {/* heading */}
    <div className="wed-sec__head">
      <p className="wed-sec__eyebrow">♥ Your Dream Wedding</p>
      <h2 className="wed-sec__title">Starts Here</h2>
      <p className="wed-sec__subtitle">
        Beautiful decoration for every wedding celebration
      </p>
    </div>

    {/* ye dono background ke upar aayenge */}
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

    <Banner
  image={whatsappbanner}
  alt="Your Celebrations, Our Commitment"
  border="1px solid #599911"   // yahan se border bheja
/>
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
                />{" "}
                {/* IMAGE */}
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

         <Banner
  image={PremiumBannerImg}
  alt="Your Celebrations, Our Commitment"
  border="none"   // yahan se border bheja
/>

      <DecorSlider
        title="Big Celebration"
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

        <Banner
  image={BirthdayBannerImg}
  alt="Your Celebrations, Our Commitment"
  border="none"   // yahan se border bheja
/>

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
  {/* background image */}
  <div className="couple-sec__bg" aria-hidden="true">
    <Image
      src={coupleBgBanner}
      alt=""
      sizes="(max-width: 768px) 100vw, 600px"
      className="couple-sec__bg-img"
    />
  </div>

  <div className="couple-sec__inner">
    {/* heading */}
    <div className="couple-sec__head">
      <p className="couple-sec__eyebrow">Made for beautiful Moments</p>
      <h2 className="couple-sec__title">Couple Celebrations</h2>
      <p className="couple-sec__subtitle">
        Decorations that make your bond even more special
      </p>
    </div>

    {/* ye dono background ke upar aayenge */}
    <CelebrationCard
      bg={anniversaryBg}
      photo={anniversaryPhoto}
      imageSide="left"
      title="Anniversary"
      subtitle="Celebrate the beautiful journey of love together"
      accent="#c4405f"
      titleColor="#c4405f"
      featuresBoxed
      href={`/${categorySlug}/anniversary-decoration`}
      features={[
        { icon: <CalendarHeart size="100%" strokeWidth={1.6} />, label: "Romantic Setups" },
        { icon: <Flower2 size="100%" strokeWidth={1.6} />,       label: "Elegant Decor" },
        { icon: <Camera size="100%" strokeWidth={1.6} />,        label: "Picture Perfect" },
      ]}
    />

    <CelebrationCard
      bg={firstNightBg}
      photo={firstNightPhoto}
      imageSide="right"
      title="First Night"
      titleIcon={<Star size="100%" strokeWidth={1.6} />}
      subtitle="Begin your new chapter with love & romance"
      accent="#7a4fb0"
      titleColor="#6a3fa0"
      href={`/${categorySlug}/first-night-decoration`}
      features={[
        { icon: <Sparkles size="100%" strokeWidth={1.6} />,    label: "Romantic Ambience" },
        { icon: <Flower2 size="100%" strokeWidth={1.6} />,     label: "Beautiful Decor" },
        { icon: <PartyPopper size="100%" strokeWidth={1.6} />, label: "Memorable Moment" },
      ]}
    />
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
      <div ref={reviewsRef} style={{ margin: " 10px 0px" }}>
        <GoogleReviewsCard reviews={balloonreviewsproduct} />
      </div>
    </div>
  );
};

export default Decoration;