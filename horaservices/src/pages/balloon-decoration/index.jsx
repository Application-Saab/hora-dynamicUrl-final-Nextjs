import React, { useState } from "react";
import Head from 'next/head';
import { useParams } from "react-router-dom";
import { getDecorationOrganizationSchema } from '../../utils/schema';
import { setState } from '../../actions/action';
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { useDispatch } from "react-redux";
import './decoration.css'
import Link from "next/link";
import whypeople1 from "../../assets/whypeople1.jpg"
import whypeople2 from '../../assets/whypeople2.jpg';
import whypeople3 from '../../assets/whypeople3.jpg';
import whypeople4 from '../../assets/whypeople4.jpg';
import Banner1 from "../../assets/decBanner1.png"
import Banner2 from "../../assets/decBanner1.png"
import Banner3 from "../../assets/decBanner1.png"
import Kidsbirthday from "../../assets/kidsBirthdayIMG.jpg"
import BabyWelcome from "../../assets/BabyWelcomeIMG.png"
import Anniversary from "../../assets/AnniversaryIMG.png"
import arrowIcon from "../../assets/arrow-down.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import decCatTab from "../../utils/categoriesTabData.json"
import CategoryTabs from "../../components/CategoryTabs.jsx"
import CategoryGrid from "@/components/CategoryGrid";
import BannerSlider from "@/components/BannerSlider";
import DecorGrid from "@/components/DecorGrid";
import ProductSliderSection from "@/components/ProductSliderSection"
import WhyHoraIMG from "../../assets/WhyHoraIMG.png";
import DecorationBannerIMG from "../../assets/DecorationBannerIMG.jpg"
import whatApp from "../../assets/WhatAppBanner.png";
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

import {
  birthdayData,
  haldiAndMehndiData,
  BabyShowerData,
  AnniversaryData,
  bacheloretteData,
  KidsBirthdayData,
  WelcomebabyData,
  PremiumData,
  BallonBData
} from "../../utils/DecorationData.js" // adjust the path based on your file structure


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
    link: "balloon-decoration/baby-welcome",
    sizeClass: "category-grid__card--small",
  },
  {
    image: Anniversary,
    title: "Anniversary",
    link: "balloon-decoration/anniversary",
    sizeClass: "category-grid__card--small",
  },
];


const largeCard = {
  image: "/decorationwedding.png",
  title: "Wedding",
  description: "DECORATIONS",

  link: "/wedding-decor",
};
const smallCards = [
  {
    image: "/decorationhaldi-Mhendi.png",
    title: "Haldi Mhendi",
  },
  {
    image: "/decorationBride-tobe.png",
    title: "Bride To-be",
  },
];
const stats = [
  {
    icon: whypeople1,
    number: '20k',
    label: 'Balloon Designs In Stock',
  },
  {
    icon: whypeople2,
    number: '45+',
    label: 'Decorations Themes',
  },
  {
    icon: whypeople3,
    number: '15M',
    label: 'Satisfied Customers',
  },
  {
    icon: whypeople4,
    number: '10k',
    label: 'Completed Decoration',
  },
];

const Decoration = () => {
  // const dispatch = useDispatch();
  const [decCat, setDecCat] = useState([
    { id: '2', image: "https://horaservices.com/api/uploads/compressed_images/Birthday_dec_cat.webp", name: 'Birthday', subCategory: "Birthday", catValue: "birthday-decoration", imgAlt: "A Gorgeous Candy Birthday Decoration Surprise!" },
    { id: '3', image: "https://horaservices.com/api/uploads/compressed_images/first_night_cat_dec.webp", name: 'First Night', subCategory: "FirstNight", catValue: "first-night-decoration", imgAlt: "Add extra happiness quotient to your wedding night with our exclusive décor package" },
    { id: '4', image: "https://horaservices.com/api/uploads/compressed_images/aniversary_Cat_Dec.webp", name: 'Anniversary', subCategory: "Anniversary", catValue: "anniversary-decoration", imgAlt: "Immerse yourself in a world of romance with our mesmerizing anniversary decorations." },
    { id: '5', image: "https://horaservices.com/api/uploads/compressed_images/kids_birthday_decoration.webp", name: 'Kids Birthday', subCategory: "KidsBirthday", catValue: "kids-birthday-decoration", imgAlt: "Flutter into a world of whimsy with our exclusive Whimsical Flutter-themed Welcome Baby Decorations." },
    { id: '6', image: "https://horaservices.com/api/uploads/compressed_images/baby-shower-dec-cat.webp", name: 'Baby Shower', subCategory: "BabyShower", catValue: "baby-shower-decoration", imgAlt: "Celebrate the transformation into motherhood with Our Gilded Baby Shower Decorations." },
    { id: '7', image: "https://horaservices.com/api/uploads/compressed_images/welcome_baby_dec.webp", name: 'Welcome Baby', subCategory: "WelcomeBaby", catValue: "welcome-baby-decoration", imgAlt: "A Pastel Theme Oh Baby Decor for your Baby Shower Celebrations!" },
    { id: '8', image: "https://horaservices.com/api/uploads/compressed_images/preminumdecor.webp	", name: 'premium Decoration', subCategory: "PremiumDecoration", catValue: "premium-decoration", imgAlt: "Birthday party decoration ideas for adults" },
    { id: '9', image: "https://horaservices.com/api/uploads/compressed_images/Balloon-B-new.webp", name: 'Ballon Bouquets', subCategory: "BallonBouquets", catValue: "balloon-bouquets-decoration", imgAlt: "Balloon Bouquet" },
    { id: '10', Image: "", name: "Haldi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Haldi Event" },
    { id: '11', Image: "", name: "Mehendi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Mehendi Event" },
    { id: '11', Image: "", name: "Bachelorette Decoration", subCategory: "bachelorette", catValue: "bachelorette-decoration", imgAlt: "Bachelorette" },
    { id: '11', Image: "", name: "proposal decorations", subCategory: "Proposal-Decoration", catValue: "Proposal-Decorations", imgAlt: "proposal decorations" },
  ]);
  const router = useRouter();
  // const navigate = useNavigate();
  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  let { city } = useParams();
  const hasCityPageParam = city ? true : false;


  const openCatItems = (item) => {
    // dispatch(setState(item.subCategory, item.imgAlt));
    if (hasCityPageParam) {
      router.push(`/${city}/balloon-decoration/${item.catValue}`);
    }
    else {
      router.push(`/balloon-decoration/${item.catValue}`);
    }
  };

  const openWahtsappRedirection = (catTitle) => {
    window.open('https://wa.me/917338584828?text=Hello%20I%20have%20seen%20decoration%20design%20on%20your%20website.%20Please%20help%20me%20for%20more%20customization%20and%20more%20details.', '_blank');
  }

  const handleViewMore = (category) => {
    const categoryItem = decCat.find(cat => cat.subCategory === category);
    console.log('Category Item:', categoryItem);
    if (categoryItem) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "title_and_viewmore_decoration_page_clicked",
        categoryName: categoryItem.name,
        subCategory: categoryItem.subCategory,
        catValue: categoryItem.catValue,
        imgAlt: categoryItem.imgAlt,
      });
      openCatItems(categoryItem);
    } else {
      console.log('No matching category item found.');
    }
  };



  const handleSliderViewMore = (link, city) => {
    if (city) {
      router.push(`/${city}/${link}`);
    }
    else {
      router.push(`/${link}`);
    }

  }

  const handleItemClick = (item) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'decoration_item_clicked',
      event_category: 'SliderSection',
      event_label: item.title,
      categoryName: item.categoryName,
      subCategory: item.subCategory,
      catValue: item.catValue,
      imgAlt: item.imgAlt
    });

    let lastEvent = window.dataLayer[window.dataLayer.length - 1];

  };


  const bannerImages = [
    Banner1,
    Banner2,
    Banner3,
  ];

  const categories = [
    { name: "Happy Birthday", image: HappyBirthdayImg },
    { name: "Baby Shower", image: BabyShowerImg },
    { name: "Kids Birthday", image: kidsBirthdayImg },
    { name: "Welcome Baby", image: BabyWelcomeImg },
    { name: "Premium Decor..", image: PremiumDecorImg },
    { name: "Bachelorette", image: BacheloretteImg },
    { name: "Haldi & Mehandi", image: HaldiMehandiImg },
    { name: "First Night", image: FirstNightImg },
    { name: "Anniversary", image: AnniversaryImg },
  ];


  return (

    <div className="dec-landing-page">
      {/* <div className="page-width"> */}
      <div className="top-slider">
        <div className="page-width">
          <BannerSlider images={bannerImages} />
        </div>
      </div>
      {/* CIRCLE TABS */}
      <div className="category-tabs">
        <CategoryTabs data={decCatTab.decCatTabdata} onSelect={openCatItems} />
      </div>

      <div className="CategoryGrid-outer">
        <div className="page-width">
          <CategoryGrid cardsData={cardsData} />
        </div>
      </div>


      {/* SEE MORE BUTTON */}
      <div className="see-more-container">
        <button className="see-more-btn" onClick={openWahtsappRedirection}>
          <span>SEE MORE</span>
          <span className="arrow-icon">
            <Image src={arrowIcon} alt="Arrow Down" width={16} height={16} />
          </span>
        </button>
      </div>

      <DecorGrid largeCard={largeCard} smallCards={smallCards} />

      <section className="why-people-love-us">
        <div className="page-width">
          <h2>Why People Love Us</h2>
          <div className="stats-line-container">
            {stats.map((item, index) => (
              <div key={index} className="stat-item">
                <Image src={item.icon} alt={item.label} width={70} height={'auto'} /> {/* ✅ IMAGE */}
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
      <div className="small-card-grid-outer">
        <div className="page-width">
          <div className="small-card-grid">
            {categories.map((item, index) => (
              <div key={index} className="small-card-wrapper">
                <div className="small-card">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                </div>
                <p className="small-card-name">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
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
        discountAmount={972}
        imageSize={{ width: 120, height: 120 }}
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
      />
      {/* </div> */}
    </div>
  );


};


export default Decoration;
