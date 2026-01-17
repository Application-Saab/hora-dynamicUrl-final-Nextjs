import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useParams } from "react-router-dom";
import { getDecorationOrganizationSchema } from "../../utils/schema";
import { setState } from "../../actions/action";
import { useRouter } from "next/navigation";
import { decCat } from "@/utils/decorationCategories";
import Image from "next/image";
// import { useDispatch } from "react-redux";
import "./decoration.css";
import Link from "next/link";
import whypeople1 from "../../assets/whypeople1.jpg";
import whypeople2 from "../../assets/whypeople2.jpg";
import whypeople3 from "../../assets/whypeople3.jpg";
import whypeople4 from "../../assets/whypeople4.jpg";
import Banner1 from "../../assets/decbanner3.webp";
import Banner2 from "../../assets/decbanner2.webp";
import Banner3 from "../../assets/decbanner1.webp";
import Kidsbirthday from "../../assets/kidsBirthdayIMG.jpg";
import BabyWelcome from "../../assets/BabyWelcomeIMG.png";
import Anniversary from "../../assets/AnniversaryIMG.png";
import arrowIcon from "../../assets/arrow-down.svg";
import CategoryTabs from "@/components/CategoryTabs";
import ReviewSlider from "@/components/ReviewSection";
import {balloonreviews} from "@/utils/balloonReviews";
import SmallCardGrid from "@/components/SmallCardGrid";
import CategoryGrid from "@/components/CategoryGrid";
import BannerSlider from "@/components/BannerSlider";
import DecorGrid from "@/components/DecorGrid";
import ProductSliderSection from "@/components/ProductSliderSection";
import WhyHoraIMG from "../../assets/WhyHoraIMG.webp";
import DecorationBannerIMG from "../../assets/DecorationBannerIMG.webp";
import decorCollageIMG from "../../assets/decorCollageIMG.webp";
import whatApp from "../../assets/WhatAppBanner.webp";
import HappyBirthdayImg from "../../assets/HappyBirthdayIMG.png";
import BabyShowerImg from "../../assets/BabyShowerIMG.webp";
import kidsBirthdayImg from "../../assets/KidsBirthdayIMG.png";
import BabyWelcomeImg from "../../assets/WelcomBabyIMG.webp";
import PremiumDecorImg from "../../assets/PremiumDecorIMG.webp";
import BacheloretteImg from "../../assets/BacheloretteIMG.png";
import HaldiMehandiImg from "../../assets/HaldiMehandiIMG.webp";
import FirstNightImg from "../../assets/FirstNightIMG.webp";
import AnniversaryImg from "../../assets/AnniversaryDecorIMG.webp";
import DecorSlider from "@/components/DecorSlider";
import BabyShowerBannerIMG from "../../assets/BabyShowerBannerIMG.webp";
import BrandBannerIMG from "../../assets/BrandBannerIMG.webp";
import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../assets/TpBrandsIMG.png";
import BrandBanner from "@/components/BrandBanner";
import decorationWedding from "@/assets/decorationwedding.webp"
import decorationBridetobe from"@/assets/decorationBride-tobe.webp"
import decorationhaldi from "@/assets/decorationhaldi-Mhendi.webp"
import {
  birthdayData,
  haldiAndMehndiData,
  BabyShowerData,
  AnniversaryData,
  bacheloretteData,
  KidsBirthdayData,
  WelcomebabyData,
  PremiumData,
  BallonBData,
} from "../../utils/DecorationData.js";

const cardsData = [
  {
    image: Kidsbirthday,
    title: "Kids Birthday Decoration",
    subtitle: "EXPLORE 1000+ DESIGN",
    link: "balloon-decoration/kids-birthday-decoration",
    sizeClass: "category-grid__card--tall",
  },
  {
    image: BabyWelcome,
    title: "Baby Welcome",
    link: "balloon-decoration/welcome-baby-decoration",
    sizeClass: "category-grid__card--small",
  },
  {
    image: Anniversary,
    title: "Anniversary",
    link: "balloon-decoration/anniversary-decoration",
    sizeClass: "category-grid__card--small",
    catValue: "Anniversary",
  },
];

const largeCard = {
  image: decorationWedding,
  title: "Wedding",
  description: "DECORATIONS",
  link: "balloon-decoration/wedding-decoration",
  catValue: "Wedding",
};
const brandItems = [
  { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
  { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
  { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
  { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
];
const smallCards = [
  {
    image: decorationhaldi,
    title: "Haldi-Mehandi",
    link: "balloon-decoration/haldi-mehendi-decoration",
    categoryName: "Haldi Mhendi",
    subCategory: "Haldi-Mehandi",
    catValue: "haldi-mehendi-decoration",
    imgAlt: "Haldi Mehendi Decoration",
  },
  {
    image: decorationBridetobe,
    title: "Bride To-be",
    link: "balloon-decoration/bachelorette-decoration",
    categoryName: "bachelorette",
    subCategory: "bachelorette",
    catValue: "bachelorette-decoration",
    imgAlt: "Bride to be Decoration",
  },
];

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

const Decoration = ({ city, locality  }) => {

  const [showMoreCards, setShowMoreCards] = useState(false);
  const smallCardRef = useRef(null); // 👈 ref for SmallCardGrid

  const router = useRouter();

  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  const hasCityPageParam = city ? true : false;
  const buttonRefs = useRef([]);
  const [handStep, setHandStep] = useState(0);

  const handleWhatsApp = () => {
    const phoneNumber = "7338584828";
    const message = encodeURIComponent("I want to customize a decoration");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  const handleSeeMoreClick = () => {
    setShowMoreCards(true); // optional if hiding initially
    setTimeout(() => {
      smallCardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // small delay ensures it's rendered first
  };
  const openCatItems = (item) => {
    const path = hasCityPageParam
      ? `/${city.toLowerCase()}/balloon-decoration/${item.catValue}`
      : `/balloon-decoration/${item.catValue}`;
    router.push(path);
  };

  const openWahtsappRedirection = (catTitle) => {
    window.open(
      "https://wa.me/917338584828?text=Hello%20I%20have%20seen%20decoration%20design%20on%20your%20website.%20Please%20help%20me%20for%20more%20customization%20and%20more%20details.",
      "_blank"
    );
  };

  const bannerImages = [Banner1, Banner2, Banner3];

  const categories = [
    { name: "Birthday", image: HappyBirthdayImg },
    { name: "Baby Shower", image: BabyShowerImg },
    { name: "Kids Birthday", image: kidsBirthdayImg },
    { name: "Welcome Baby", image: BabyWelcomeImg },
    { name: "Big Celebration", image: PremiumDecorImg },
    { name: "Bachelorette", image: BacheloretteImg },
    { name: "Haldi Mehandi", image: HaldiMehandiImg },
    { name: "First Night", image: FirstNightImg },
    { name: "Anniversary", image: AnniversaryImg },
  ];
  // const features = [
  //   {
  //     anim: uploadAnim,
  //     title: "Upload Image",
  //     btn: "Upload Now",
  //     bg: "bgPurple",
  //     btnBg: "btnPurple",
  //   },
  //   {
  //     anim: thankyouAnim,
  //     title: "Thank You Note",
  //     btn: "Write Note",
  //     bg: "bgGreen",
  //     btnBg: "btnGreen",
  //   },
  //   {
  //     anim: giftAnim,
  //     title: "Lucky Draw",
  //     btn: "Spin Now",
  //     bg: "bgPink",
  //     btnBg: "btnPink",
  //   },
  // ];

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

        <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
        <meta
          property="og:description"
          content="🎉 Explore a wide range of stunning decoration designs for every event and party. Book your ideal design directly through our website for a seamless experience. Need help? Contact us at 7338584828."
        />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <meta property="og:image:alt" content="balloon decoration, birthday decoration, wedding decoration, baby shower decoration" />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
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
        <div className="page-width">
          <CategoryGrid cardsData={cardsData} city={city} locality={locality} />
        </div>
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
                {/* ✅ IMAGE */}
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <div className="whatsapp-support-box">
        <ul className="whatsapp-feature-list">
          <li> 🛠️  Easy Customize</li>
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
        viewAllLink="/balloon-decoration/premium-decoration"
        data={PremiumData}
        showDiscount={true}
        imageSize={{ width: 120, height: 120 }}
        city={city}
        hasCityPageParam={hasCityPageParam}
        decCat={decCat}
        locality={locality}
      />

      {/* <FeatureAnimation features={features} clickAnim={click} />
{buttonRefs.current[handStep] && (
  <video
    src="/hand-click.webm" // replace with your hand animation
    autoPlay
    loop
    muted
    playsInline
    className="floating-hand"
    style={{
      position: 'absolute',
      top: buttonRefs.current[handStep].getBoundingClientRect().top + window.scrollY - 20,
      left: buttonRefs.current[handStep].getBoundingClientRect().left + window.scrollX + 40,
      width: '40px',
      zIndex: 1000,
      pointerEvents: 'none',
    }}
  />
)} */}

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
        viewLink="/balloon-decoration/birthday-decoration"
        city={city}
        hasCityPageParam={hasCityPageParam}
        locality={locality}
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
              priority
            />
          </section>
        </div>
      </div>

      <DecorSlider
        title="Anniversary Decoration"
        viewAllLink="/balloon-decoration/anniversary-decoration"
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
        viewLink="/balloon-decoration/baby-shower-decoration"
        locality={locality}
      />

      <section className="BabyShowerBanner">
        <Image
          src={BrandBannerIMG}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>
      <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />

<ReviewSlider reviews={balloonreviews} title="Customer Reviews" />
    </div>
  );
};

export default Decoration;
