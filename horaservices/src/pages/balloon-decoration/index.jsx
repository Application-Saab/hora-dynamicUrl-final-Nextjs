import React, { useState, useEffect } from "react";
import Head from 'next/head';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios';
import { useParams } from "react-router-dom";
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM } from '../../utils/apiconstants';
import { getDecorationOrganizationSchema } from '../../utils/schema';
import { setState } from '../../actions/action';
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from '../../assets/new_logo_light.png';
import { useDispatch } from "react-redux";
import '../../css/decoration.css';
import '../../components/DecorationLandingSlider/decorationladingslider.css';
import DecorationLandingSlider from '../../components/DecorationLandingSlider';
import HaldiImage from '../../assets/HaldiImage.png';
import MehendiImage from '../../assets/MehendiImage.png';
import BacheloretteImage from '../../assets/Bachelorette.jpg';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import decorationLandingWhatsapp from '../../assets/wahtsapp-decoration-redirection.jpeg';
import 'slick-carousel/slick/slick-theme.css';
import dec1 from '../../assets/dec1.png';
import dec2 from '../../assets/dec3.png';
import decorationVideo from "../../assets/decorationVideo.mp4"
import CategoryTabs from "../../components/CategoryTabs.jsx"
import { decCat } from "../../utils/decorationCategories.js"
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



const Decoration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const navigate = useNavigate();
  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  let { city } = useParams();
  const hasCityPageParam = city ? true : false;


  const openCatItems = (item) => {
    dispatch(setState(item.subCategory, item.imgAlt));
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







  return (
    <div className="category-section">
      <div className="video-banner">
        <video
          src={decorationVideo}
          autoPlay
          muted
          loop
          playsInline
          className="video-player"
        />
      </div>
      {/* CIRCLE TABS */}
      <div className="category-tabs">
        <CategoryTabs data={decCat} onSelect={openCatItems} />

      </div>

      {/* CATEGORY CARDS */}

      <div className="custom-grid-container">
        {/* Left Tall Card */}

        <div className="tall-card">
          <div className="image-wrapper">
            <Image
              src={birthdayData[0].Image}
              alt="Birthday"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="card-content">
            <h3>Birthday</h3>
            <p>EXPLORE 1000+ DESIGN</p>
            <button>View More</button>
          </div>
        </div>

        {/* Right Stack of Two Cards */}
        <div className="right-stack">
          {/* First Small Card */}
          <div className="small-card">
            <div className="image-wrapper small">
              <Image
                src={BabyShowerData[0].Image}
                alt="Baby Shower"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="card-content">
              <h3>Baby Shower</h3>
              <button>View More</button>
            </div>
          </div>

          {/* Second Small Card */}
          <div className="small-card">
            <div className="image-wrapper small">
              <Image
                src={AnniversaryData[0].Image}
                alt="Anniversary"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="card-content">
              <h3>Anniversary</h3>
              <button>View More</button>
            </div>
          </div>
        </div>

      </div>



      {/* SEE MORE BUTTON */}
      <div className="see-more-container">
        <button className="see-more-btn" onClick={openWahtsappRedirection}>
          See More ↓
        </button>
      </div>

      <div class="decor-wrapper">
        <div class="card-grid">

          <div class="large-card">
            <img src="/decorationwedding.png" alt="Wedding" class="large-img" />
            <div class="large-content">
              <h3>Wedding</h3>
              <button class="view-btn">View more</button>
            </div>
          </div>
          <div class="second-container">
            <div class="second-card">
              <div class="second-image-box">
                <img
                  src="/decorationhaldi-Mhendi.png"
                  alt="Haldi Mhendi"
                />
              </div>
              <h4 class="second-label">Haldi Mhendi</h4>
            </div>

            <div class="second-card">
              <div class="second-image-box">
                <img src="/decorationBride-tobe.png" alt="Bride To-be" />
              </div>
              <h4 class="second-label">Bride To-be</h4>
            </div>
          </div>

        </div>
      </div>

    </div>
  );


};


export default Decoration;
