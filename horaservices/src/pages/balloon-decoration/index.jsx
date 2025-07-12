import React, { useState, useRef } from "react";
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
import arrowIcon from "../../assets/arrow-down.png";
import CategoryTabs from "../../components/CategoryTabs.jsx";
import ReviewSection from "@/components/ReviewSection";
import allReviewsData from "@/utils/ReviewsData";
import SmallCardGrid from "@/components/SmallCardGrid";
import CategoryGrid from "@/components/CategoryGrid";
import BannerSlider from "@/components/BannerSlider";
import DecorGrid from "@/components/DecorGrid";
import ProductSliderSection from "@/components/ProductSliderSection";
import WhyHoraIMG from "../../assets/WhyHoraIMG.webp";
import DecorationBannerIMG from "../../assets/DecorationBannerIMG.jpg";
import decorCollageIMG from "../../assets/decorCollageIMG.jpg";
import whatApp from "../../assets/WhatAppBanner.webp";
import HappyBirthdayImg from "../../assets/HappyBirthdayIMG.png";
import BabyShowerImg from "../../assets/BabyShowerIMG.png";
import kidsBirthdayImg from "../../assets/KidsBirthdayIMG.png";
import BabyWelcomeImg from "../../assets/WelcomBabyIMG.png";
import PremiumDecorImg from "../../assets/PremiumDecorIMG.png";
import BacheloretteImg from "../../assets/BacheloretteIMG.png";
import HaldiMehandiImg from "../../assets/HaldiMehandiIMG.png";
import FirstNightImg from "../../assets/FirstNightIMG.png";
import AnniversaryImg from "../../assets/AnniversaryDecorIMG.png";
import DecorSlider from "@/components/DecorSlider";
import BabyShowerBannerIMG from "../../assets/BabyShowerBannerIMG.jpg";
import BrandBannerIMG from "../../assets/BrandBannerIMG.webp";
import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../assets/GoogleRatingIMG.png";
import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../assets/TpBrandsIMG.png";
import smallcardBackground from "../../assets/small-cardBackground.jpg";
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
  image: "/decorationwedding.png",
  title: "Wedding",
  description: "DECORATIONS",
  link: "balloon-decoration/wedding-decoration",
  catValue: "Wedding",
};

const smallCards = [
  {
    image: "/decorationhaldi-Mhendi.png",
    title: "Haldi-Mehandi",
    link: "balloon-decoration/haldi-mehendi-decoration",
    categoryName: "Haldi Mhendi",
    subCategory: "Haldi-Mehandi",
    catValue: "haldi-mehendi-decoration",
    imgAlt: "Haldi Mehendi Decoration",
  },
  {
    image: "/decorationBride-tobe.png",
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

const Decoration = ({ city, locality }) => {

  const [showMoreCards, setShowMoreCards] = useState(false);
  const smallCardRef = useRef(null); // 👈 ref for SmallCardGrid

  const router = useRouter();

  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  const hasCityPageParam = city ? true : false;


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
    { name: "premium Decor", image: PremiumDecorImg },
    { name: "Bachelorette", image: BacheloretteImg },
    { name: "Haldi Mehandi", image: HaldiMehandiImg },
    { name: "First Night", image: FirstNightImg },
    { name: "Anniversary", image: AnniversaryImg },
  ];

  return (
    <div className="dec-landing-page">
      {/* <div className="page-width"> */}
      <div className="top-slider">
        <BannerSlider images={bannerImages} />
      </div>
      {/* CIRCLE TABS */}
      <div className="category-tabs-outer">
        <CategoryTabs data={decCat} onSelect={openCatItems} city={city} hasCityPageParam={hasCityPageParam} locality={locality} />
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
            <Image src={arrowIcon} alt="Arrow Down" width={20} height={20} />
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
                  height={"auto"}
                />{" "}
                {/* ✅ IMAGE */}
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="whatApp">
        <Image
          src={whatApp}
          alt="WhatsApp-Banner"
          width={1200}
          height={400}
          className="whatsAppImage"
          priority
        />
      </section>


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
        title="Premium Decoration"
        viewAllLink="/balloon-decoration/premium-decoration"
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
        // discountAmount={972}
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

      <div className="brandBanner">
        <div className="page-width">
          <h2 className="brandBanner-heading">
            Excellence Backed by Happy Customers
          </h2>

          <div className="brandBanner-grid">
            {/* Card 1 */}
            <div className="brandBanner-card">
              <Image
                src={HappyCustomerIMG}
                alt="Happy Customers"
                width={60}
                height={60}
              />
              <p className="brandBanner-bold">1L+ HAPPY</p>
              <p className="brandBanner-sub">CUSTOMERS</p>
            </div>

            {/* Card 2 */}
            <div className="brandBanner-card">
              <Image
                src={GoogleRatingIMG}
                alt="Google Rating"
                width={60}
                height={60}
              />
              <p className="brandBanner-bold">4.8+ GOOGLE</p>
              <p className="brandBanner-sub">RATING</p>
            </div>

            {/* Card 3 */}
            <div className="brandBanner-card">
              <Image
                src={SocialMediaIMG}
                alt="Social Media"
                width={60}
                height={60}
              />
              <p className="brandBanner-bold">OUR</p>
              <p className="brandBanner-sub">SOCIAL MEDIA</p>
            </div>

            {/* Card 4 */}
            <div className="brandBanner-card">
              <Image
                src={TopBrandIMg}
                alt="Top Brands"
                width={60}
                height={60}
              />
              <p className="brandBanner-bold">TOP BRANDS</p>
              <p className="brandBanner-sub">PARTNERED</p>
            </div>
          </div>
        </div>
      </div>
      <ReviewSection allReviewsData={allReviewsData} />
    </div>
  );
};

export default Decoration;
