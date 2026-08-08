import React, { useState, useRef, useMemo } from "react";
import Head from "next/head";
import { getDecorationOrganizationSchema } from "../../utils/schema";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { decCat } from "@/utils/decorationCategories";
import Image from "next/image";
import "./decoration.css";
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
import { balloonreviews } from "@/utils/balloonReviews";
import SmallCardGrid from "@/components/SmallCardGrid";
import CategoryGrid from "@/components/CategoryGrid";
import DecorGrid from "@/components/DecorGrid";
import WhyHoraIMG from "../../assets/WhyHoraIMG.webp";
import DecorationBannerIMG from "../../assets/DecorationBannerIMG.webp";
import decorCollageIMG from "../../assets/decorCollageIMG.webp";
import HappyBirthdayImg from "../../assets/HappyBirthdayIMG.png";
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
// const ReviewSlider = dynamic(() => import("@/components/ReviewSection"), {
//   ssr: false,
// });

// const BannerSlider = dynamic(() => import("@/components/BannerSlider"), {
//   ssr: false,
// });

// const DecorSlider = dynamic(() => import("@/components/DecorSlider"), {
//   ssr: false,
// });

// const ProductSliderSection = dynamic(
//   () => import("@/components/ProductSliderSection"),
//   { ssr: false },
// );
const BannerSlider = dynamic(() => import("@/components/BannerSlider"));
const DecorSlider = dynamic(() => import("@/components/DecorSlider"));
const ProductSliderSection = dynamic(() => import("@/components/ProductSliderSection"));
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

  const categorySlug = useMemo(
    () => getCategorySlugFromPath(pathname, city, locality),
    [pathname, city, locality],
  );

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
      title: "Baby Welcome",
      catValue: "welcome-baby-decoration",
      link: `/${categorySlug}/welcome-baby-decoration`,
      sizeClass: "category-grid__card--small",
    },
    {
      image: Anniversary,
      title: "Anniversary",
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
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  const handleSeeMoreClick = () => {
    setTimeout(() => {
      smallCardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // small delay ensures it's rendered first
  };

  const openCatItems = (item) => {
    if (!item?.catValue) return;

    const categorySlug = categorySlug;

    const path = hasCityPageParam
      ? `/${city.toLowerCase()}/${categorySlug}/${item.catValue}`
      : `/${categorySlug}/${item.catValue}`;

    router.push(path);
  };

  const bannerImages = [Banner1, Banner2, Banner3];

  return (
    <div className="dec-landing-page">
      <Head>
        <title>
          {city && locality
            ? `HORA Decorations in ${locality}, ${city} | Balloon & Flower Decorations for Birthdays, Weddings, Baby Showers & More – Starting at ₹1199`
            : city
              ? `HORA Decorations in ${city} | Balloon & Flower Decorations for Birthdays, Weddings, Baby Showers & More – Starting at ₹1199`
              : `HORA Decorations : Professional Balloons & Flowers Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199`}
        </title>

        <meta
          name="description"
          content={
            city && locality
              ? `📸 Capture Every Moment in ${locality}, ${city}! ✨ HORA Decorations makes every celebration magical. Book your perfect Balloon & Flower decorations for birthdays, weddings, baby showers, and more.`
              : city
                ? `📸 Capture Every Moment in ${city}! ✨ HORA Decorations — Professional Balloon & Flower decorators for birthdays, weddings, baby showers & more.`
                : `📸 Capture Every Moment, Forever! ✨ HORA Decorations — Professional Balloon & Flower decorators for birthdays, parties, weddings & more.`
          }
        />

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

        <meta
          property="og:title"
          content="Balloon and Flower Decoration by Professional Decorators"
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
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        <meta
          property="og:url"
          content={
            city && locality
              ? `https://horaservices.com/${city.toLowerCase()}/${locality.toLowerCase()}/balloon-decoration`
              : city
                ? `https://horaservices.com/${city.toLowerCase()}/balloon-decoration`
                : `https://horaservices.com/balloon-decoration`
          }
        />
        <meta property="og:type" content="website" />
      </Head>

      <div className="top-slider">
        <BannerSlider images={bannerImages} showSeeMore={true} />
      </div>
      {/* CIRCLE TABS */}
      <div className="category-tabs-outer">
        <CategoryTabs
          data={decCat}
          onSelect={openCatItems}
          city={city}
          hasCityPageParam={hasCityPageParam}
          locality={locality}
          variant="circle"
        />
      </div>

      <div className="CategoryGrid-outer">
        <CategoryGrid cardsData={cardsData} city={city} locality={locality} />
      </div>

      {/* SEE MORE BUTTON */}
      <div className="see-more-container">
        <button className="see-more-btn" onClick={handleSeeMoreClick}>
          <span>SEE MORE</span>
          <span className="arrow-icondecoration">
            <Image src={arrowIcon} alt="Arrow Down" width={30} height={30} />
          </span>
        </button>
      </div>

      <DecorGrid
        largeCard={largeCard}
        smallCards={smallCards}
        city={city}
        hasCityPageParam={hasCityPageParam}
        decCat={decCat}
        locality={locality}
      />

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

      <div className="whatsapp-support-box">
        <ul className="whatsapp-feature-list">
          <li> 🛠️ Easy Customize</li>
          <li>💬 Customer Support</li>
        </ul>
        <button onClick={handleWhatsApp} className="whatsapp-btn">
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png"
            alt="WhatsApp"
          />
          Chat Now on WhatsApp
        </button>
      </div>

      <div ref={smallCardRef}>
        <SmallCardGrid
          city={city}
          hasCityPageParam={hasCityPageParam}
          decCat={decCat}
          categories={categories}
          locality={locality}
        />
      </div>

      <section className="why-choose-hora">
        <Image
          src={WhyHoraIMG}
          alt="Why Choose Hora"
          width={1200}
          height={400}
          className="why-choose-image"
          priority
        />
      </section>

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

      <section className="decorationBanner">
        <Image
          src={DecorationBannerIMG}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>

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

      <section className="BabyShowerBanner">
        <Image
          src={BabyShowerBannerIMG}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
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

      <ReviewSlider reviews={balloonreviews} title="Customer Reviews" />
    </div>
  );
};

export default Decoration;
