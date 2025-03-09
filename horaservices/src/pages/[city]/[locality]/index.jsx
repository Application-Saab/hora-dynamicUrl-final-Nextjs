"use client";
import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  PAYMENT,
  PAYMENT_STATUS,
  API_SUCCESS_CODE,
  UPDATE_ORDER_STATUS,
} from "../../../utils/apiconstants";
import axios from "axios";
import Head from 'next/head';
// import { useNavigate , Link, useLocation } from 'react-router-dom'; // Import useNavigate
import whatsppicon from "../../../assets/whatsapp-icon.png";
import { getHomeOrganizationSchema } from "../../../utils/schema";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import '../../../app/globals.css';
import Slider from 'react-slick';
import '../../../app/homepage.css';
import CustomerReviewsSection from '@/components/CustomerReviewsSection';
import WhatAreYouIntoSection from "@/components/WhatAreYouIntoSection";
import CelebrateWithUsSection from "@/components/CelebrateWithUsSection";
import Horaservices from "@/components/HoraServices";
// remove later
// import homepage_entertainment1 from '../../../assets/homepage_entertainment1.png';
// import homepage_entertainment2 from '../../../assets/homepage_entertainment2.png';
// import homepage_entertainment3 from '../../../assets/homepage_entertainment3.png';
// import homepage_entertainment4 from '../../../assets/homepage_entertainment4.png';

export default function Home() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [city, setCity] = useState(null);
  const photographyUrl = () => {
    window.open(
      'https://api.whatsapp.com/send?phone=+917338584828&text=I%20wanted%20to%20know%20about%2C%20photography',
      '_blank'
    );
  }
  const schemaOrg = getHomeOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const { locality } = router.query;

  useEffect(() => {
    if (router.isReady) {
      const { city } = router.query;
      if (city) {
        setCity(city);
      } else {
        console.log('City is undefined');
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    setShowButton(window.innerWidth > 800);
    function handleResize() {
      setShowButton(window.innerWidth > 800);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const checkPaymentStatus = async (transactionId) => {
      try {
        const storedUserID = await localStorage.getItem("userID");
        const apiUrl = BASE_URL + PAYMENT_STATUS + "/" + transactionId;

        const response = await axios.post(
          apiUrl,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.message) {
          const message = response.data.message;

          if (message === "PAYMENT_SUCCESS") {
            const url = BASE_URL + UPDATE_ORDER_STATUS;

            const token = await localStorage.getItem("token");

            const requestData = {
              status: 1,
              _id: transactionId,
            };

            const response = await axios.post(url, requestData, {
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
            });

            router.push("/Success");
          } else {
            router.push("/Failure");
          }
        } else {
          console.log("API response does not contain a message field");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        throw error; // Rethrow the error for the caller to handle
      }
    };

    const queryParams = new URLSearchParams(window.location.search);
    const transactionId = queryParams.get("transaction")

    if (transactionId) {
      checkPaymentStatus(transactionId);
    }
  }, [router]);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const homeslidersettings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true, // Enables the fade effect
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const slides = [
    {
      image: "https://horaservices.com/api/uploads/homepage_slider1.webp",
      title: 'Decoration at your step',
      description: 'Transform your space with our expert decorators',
      imgAlt: 'Decoration services at your step',
      link: "/balloon-decoration"
    },
    {
      image: "https://horaservices.com/api/uploads/homepage_slider2.webp",
      title: 'Party Food Delivery',
      description: 'Delicious food for all your party needs',
      imgAlt: 'Party food delivery service',
      link: "/party-food-delivery-live-catering-buffet/party-food-delivery"
    },
    {
      image: "https://horaservices.com/api/uploads/homepage_slider3.webp",
      title: 'Live Cooking at Spot',
      description: 'Book top-notch performers for your event',
      imgAlt: 'Live cooking at event location',
      link: "/party-food-delivery-live-catering-buffet/party-live-buffet-catering"
    }
  ];

  const openSliderLink = (link, city, locality) => {
    if (link) {
      window.location.href = `/${city}/${locality}/${link}`; // Redirects to the provided link
      //window.location.href = link; // Redirects to the provided link
    }
  };



  return (
    <>
     
        <Head>
          <title>Hora Services</title>
          <meta name="description" content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" />
          <meta name="keywords" content="Balloon and Flower Decoration @999" />
          <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
          <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
          <meta property="og:description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
          <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
          <script type="application/ld+json">{scriptTag}</script>
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Hora Services" />
          <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
          <meta property="og:url" content="https://horaservices.com/balloon-decoration" />
          <meta property="og:type" content="website" />
        </Head>
        <div className="page-width">
        <div className="party-services homeslider">
        <h1 className="banner-heading">All Party Services on One Platform</h1>
        <div className="home-slider-inner">       
            <Slider {...homeslidersettings}>
              {slides.map((slide, index) => (
                <div key={index} className="slide-container">
                  <Image src={slide.image} alt={slide.title}
                    width={1200}
                    height={400}
                    //  objectFit="cover" 
                    layout="responsive"
                    className="responsive-image"
                  />
                  <div className="carousel-content slide-content">
                    <h2 className="banner-insideHeading slide-title">{slide.title}</h2>
                    <button className="slide-button book-now" onClick={() => openSliderLink(slide.link, city, locality)}>book Now</button>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

        </div>

        {/* hora food decore photo servies */}
        <Horaservices city={city} locality={locality} />
        {/* what are you into ?*/}
        <WhatAreYouIntoSection city={city} locality={locality} />


        {/* CelebrateWithUsSection */}
        <CelebrateWithUsSection />

        {/* <CustomerReviewSection /> */}
        <CustomerReviewsSection />

      </div>
      <div>
        <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
          <Image className='whatappicon' src={whatsppicon} alt="WhatsApp Icon" />
        </Link>
      </div>
    </>
  );
}