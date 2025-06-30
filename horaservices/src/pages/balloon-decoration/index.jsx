import React from "react";
import Head from 'next/head';
import { useParams } from "react-router-dom";
import { getDecorationOrganizationSchema } from '../../utils/schema';
// import { setState } from '../../actions/action';
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { useDispatch } from "react-redux";
import './decoration.css'

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
import WhyHoraIMG from "../../assets/WhyHoraIMG.png";
import HappyBirthdayImg from "../../assets/HappyBirthdayImg.png"
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
    link: "/birthday",
    sizeClass: "category-grid__card--tall",
  },
  {
    image: BabyWelcome,
    title: "Baby Welcome",
    link: "/baby-welcome",
    sizeClass: "category-grid__card--small",
  },
  {
    image: Anniversary,
    title: "Anniversary",
    link: "/anniversary",
    sizeClass: "category-grid__card--small",
  },
];


const largeCard = {
  image: "/decorationwedding.png",
  title: "Wedding",
  description: "EXPLORE 1000+ DESIGN",
  points: ["EXPERTISE", "CARE", "TECHNOLOGY"],
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



  const getDiscountedPrice = (price) => {
    // Trim and remove currency symbol
    price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters

    // Check if the price is a valid number
    if (isNaN(price) || price < 0) {
      return { error: "Please enter a valid price." };
    }

    let discount;

    // Determine the discount percentage based on the item price
    if (price < 3000) {
      discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
    } else {
      discount = 35; // 35% discount for prices above 5000
    }

    const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
    const discountDifference = price - discountedPrice; // Difference in original and discounted price

    return Math.floor(discountedPrice); // Return both discount percentage and discounted price
  };


  const getDiscountedDifference = (price) => {
    // Trim and remove currency symbol
    price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters

    // Check if the price is a valid number
    if (isNaN(price) || price < 0) {
      return { error: "Please enter a valid price." };
    }

    let discount;

    // Determine the discount percentage based on the item price
    if (price < 3000) {
      discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
    } else {
      discount = 35; // 35% discount for prices above 5000
    }
    const discountedPrice = Math.floor(price * (1 - discount / 100)); // Calculate the discounted price and round down
    const discountDifference = Math.floor(price - discountedPrice); // Difference in original and discounted price, rounded down

    return discountDifference; // Return both discount percentage and discounted price
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
    { name: "Happy Birthday", image: HappyBirthdayImg  },
    { name: "Baby Shower", image: HappyBirthdayImg  },
    { name: "Kids Birthday", image: HappyBirthdayImg  },
    { name: "Welcome Baby", image: HappyBirthdayImg },
    { name: "Premium Decor..", image: HappyBirthdayImg  },
    { name: "Bachelorette", image: HappyBirthdayImg  },
    { name: "Haldi & Mehandi", image: HappyBirthdayImg },
    { name: "First Night", image: HappyBirthdayImg },
    { name: "Anniversary", image: HappyBirthdayImg },
  ];


  return (

    <div className="dec-landing-page">
      <div className="page-width">

        <BannerSlider images={bannerImages} height={400} autoplayDelay={2500} />

        {/* CIRCLE TABS */}
        <div className="category-tabs">
          <CategoryTabs data={decCatTab.decCatTabdata} onSelect={openCatItems} />
        </div>

        <CategoryGrid cardsData={cardsData} />




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
          <h2>Why People Love Us</h2>
          <div className="stats-line-container">
            {stats.map((item, index) => (
              <div key={index} className="stat-item">
                <Image src={item.icon} alt={item.label} width={60} height={60} /> {/* ✅ IMAGE */}
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="small-card-grid">
          {categories.map((item, index) => (
            <div key={index} className="small-card-wrapper">
              <div className="small-card">
                <Image src={item.image} alt={item.name} />
              </div>
              <p className="small-card-name">{item.name}</p>
            </div>
          ))}
        </div>
        
        <section className="why-choose-hora">
  <Image src={WhyHoraIMG}alt="Why Choose Hora" className="why-choose-image" />
</section>



      </div>
    </div>
  );


};


export default Decoration;
