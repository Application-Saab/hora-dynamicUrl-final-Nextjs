"use client";
import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  PAYMENT,
  PAYMENT_STATUS,
  API_SUCCESS_CODE,
  UPDATE_ORDER_STATUS,
} from "../utils/apiconstants";
import axios from "axios";
import whatsppicon from "../assets/whatsapp-icon.png";
import { getHomeOrganizationSchema } from "../utils/schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import './globals.css';
import Slider from 'react-slick';
import { sendGTMEvent } from '@next/third-parties/google';
import decorationbanner from '../assets/decoration-home-banner-web.webp'
import './homepage.css'
import CustomerReviewsSection from '@/components/CustomerReviewsSection';
import WhatAreYouIntoSection from "@/components/WhatAreYouIntoSection";
import Horaservices from "@/components/HoraServices";
export default function Home() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);  
  const schemaOrg = getHomeOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

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

  const handleTitleClick = (title) => {
    // Trigger GTM event when the user clicks on the title
    sendGTMEvent('event', 'titleClicked', { value: title });
  }


  const openSliderLink = (link, title) => {
    sendGTMEvent('event', 'homePageSliderClicked', { value: title });
    window.location.href = "/balloon-decoration"; // Redirects to the provided link
  };


  return (
    <>
      <head>
        <title>HORA : One-Stop Party Planning: Customise, Create, Book</title>
        <meta name="description" content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨" />
        <meta name="keywords" content="Personal chef, private chef to cook in home in India, home chef, book a cook near you, chef at home, Private cook in Mumbai, Book a cook for home near you, Hire Chef in Bangalore, Private Chef in Delhi, Catering service, balloon, decoration, celebration, party, birthday, anniversary, decorator, candle light dinner,  surprises, couples, bouquets , online caterers, catering services, best caterers, birthday party catering, birthday caterers, party catering, home catering, corporate catering, caterers for small parties, wedding caterers" />

        <meta property="og:title" content="HORA : One-Stop Party Planning: Customise, Create, Book" />
        <meta property="og:description" content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨" />

        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1711520474508.png" />
        <meta property="og:image:alt" content="Elegant balloon decoration setup by Hora Decorations" />

        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706459457063.png" />
        <meta property="og:image:alt" content="Beautiful floral arrangement for events by Hora Decorations" />

        <meta property="og:image" content="  https://horaservices.com/api/uploads/homepage_whatareu4.webp" />
        <meta property="og:image:alt" content="Beautiful food for events by Hora Caterers" />

        <meta property="og:image" content="https://horaservices.com/api/uploads/homepage_whatareu2.webp" />
        <meta property="og:image:alt" content="best food and chef for parties by Hora Kitchen" />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <meta property="og:url" content="https://horaservices.com" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <meta property="og:type" content="website" />
      </head>
      <div className="page-width">
        <div className="party-services homeslider">
          <h1 className="banner-heading">All Party Services on One Platform</h1>
          <div className="home-slider-inner">
            <div className="slide-container" onClick={() => openSliderLink()}>
              <Image src={decorationbanner} alt="Decoration services, Balloon decoration , decoration for birthday party"
                width={1200}
                height={400}
                className="responsive-image"
                loading="eager"
              />
            </div>

          </div>

        </div>

        {/* hora food decore photo servies */}
        <Horaservices />
        {/* what are you into ?*/}
        <WhatAreYouIntoSection />

        {/* <CustomerReviewSection /> */}
        <CustomerReviewsSection />

      </div>
      <div>
        <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
          <Image className='whatappicon' src={whatsppicon} alt="WhatsApp Icon"
            onClick={() => {
              dataLayer.push({
                'event': 'homepage_whatsapp_click',
                'page_url': '/homepage',
                'page_title': 'This is home page WhatsApp click'
              });
            }} />
        </Link>
      </div>
    </>
  );
}
// dnt deleet with event code
{/* <div className="food-container sec-container">
          <h1 className="food-title">
            <span>Food</span>
            <span><Image src={FoodIcon} alt="Food Icon" className="food-icon" /></span>
          </h1>
          <div className="food-cards desktop">
            {foodData.map(item => (
              <div key={item.id} className="food-card">
                <a href={item.link} className="food-card-link"
                  onClick={() => {
                    const eventName = item.title.replace(/\s+/g, "") + "Click";
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: eventName,
                      itemTitle: item.title,
                      itemLink: item.link,
                    });
                    localStorage(window.dataLayer, "lkdjfldsf");
                    handleTitleClick(item.title);
                  }}>
                  <Image src={item.image} alt={item.title} className="food-image" width={200} height={100} />
                  <p className="food-card-title" onClick={() => handleTitleClick(item.title)}>{item.title}</p>
                </a>
              </div>
            ))}
          </div>

          <div className="food-cards mobile">
            {foodData.slice(0, 1).map(item => (
              <div key={item.id} className="food-card left-side">
                <a
                  href={item.link}
                  className="food-card-link"
                  onClick={() => {
                    const eventName = item.title.replace(/\s+/g, "") + "Click";
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: eventName,
                      itemTitle: item.title,
                      itemLink: item.link,
                    });
                    localStorage(window.dataLayer, "lkdjfldsf");
                    handleTitleClick(item.title);
                  }}
                >
                  <Image src={item.image} alt={item.title} className="food-image" width={200} height={100} />
                  <p className="food-card-title" onClick={() => handleTitleClick(item.title)}>{item.title}</p>
                </a>
              </div>
            ))}

            <div className="food-card  right-side">
              {foodData.slice(1, 3).map(item => (
                <div key={item.id} className="food-card right-card">
                  <a href={item.link} className="food-card-link">
                    <Image src={item.image} alt={item.title} className="food-image" width={200} height={100} />
                    <p className="food-card-title" onClick={() => handleTitleClick(item.title)}>{item.title}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
        <div className="dec-photo-con sec-container">
          <div className="service">
            <div className="service-header">
              <h2 className='services-h2'>
                Photography
                <Image src={PhotographyIcon} alt="Photography Icon" className="service-icon" />
              </h2>
            </div>
            <div className="service-image-container">
              <Image src="https://horaservices.com/api/uploads/homepage_photography.webp" alt="Photography" className="service-image" width={200} height={100} />
              <button className="book-now2" id="home-phtography-sec-sec"
                onClick={() => {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: 'photography_button_click',  // Custom event name
                    photography_button_id: 'photography_button',  // Custom parameter name with another value
                  });
                  photographyUrl();
                }}
              >Book Now</button>
            </div>
          </div>
          <div className="service decoration">
            <div className="service-header">
              <h2 className='services-h2'>
                Decoration
                <Image src={DecorationIcon} alt="Decoration Icon" className="service-icon" />
              </h2>
            </div>
            <div className="service-image-container">
              <Image src="https://horaservices.com/api/uploads/homepage_decoration.webp" alt="Decoration" className="service-image" width={200} height={100} />
              <button className="book-now2" id="home-decoration-sec"
                onClick={() => {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: 'decoration_button_click',  // Custom event name
                    custom_button_id: 'decoration_button',  // Custom parameter name with your chosen value
                  });
                  window.location.href = '/balloon-decoration';
                }}
              >Book Now</button>
            </div>
          </div>

        </div> */}