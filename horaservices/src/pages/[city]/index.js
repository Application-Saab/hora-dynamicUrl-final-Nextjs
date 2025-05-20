"use client";
import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  PAYMENT_STATUS,
  UPDATE_ORDER_STATUS,
} from "../../utils/apiconstants";
import axios from "axios";
import whatsppicon from "../../assets/whatsapp-icon.png";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Slider from 'react-slick';
import DecorationIcon from '../../assets/decoration_icon.webp';
import '../../app/custom.css'
import cityData from '../../utils/cityData';
import { HeroBanner } from "@/app/components/HeroBanner";
import { SEOHead } from "@/app/components/SEOHead";
import { FoodSection } from "@/app/components/FoodSection";
import ServiceSection from "@/app/components/ServiceSection";
import { CategorySection } from "@/app/components/CategorySection";
import LocalitiesSection from "@/component/LocalitiesSection";
import CustomerReview from "@/app/components/CustomerReview";

export default function Home() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [city, setCity] = useState(null);


  useEffect(() => {
    if (router.isReady) {

      const { city } = router.query;
      if (city) {
        setCity(city);
      } else {
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



  const celebrateslidersettings = {
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
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
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };





  const celebrateData = [
    {
      id: 1,
      title: 'Birthday and Anniversary',
      imageUrl: require('../../assets/homepage_Celebrate1.png'),
      imgAlt: 'Birthday and Anniversary celebration',
      link: "https://horaservices.com/balloon-decoration/birthday-decoration",
    },
    {
      id: 2,
      title: 'House Parties',
      imageUrl: require('../../assets/homepage_Celebrate2.png'),
      imgAlt: 'House parties celebration',
    },
    {
      id: 3,
      title: 'Corporate Events',
      imageUrl: require('../../assets/homepage_Celebrate3.png'),
      imgAlt: 'Corporate events celebration',
    },
    {
      id: 4,
      title: 'Wedding Events',
      imageUrl: require('../../assets/homepage_Celebrate4.png'),
      imgAlt: 'Wedding events celebration',
    },
    {
      id: 5,
      title: 'Gatherings',
      imageUrl: require('../../assets/homepage_Celebrate5.png'),
      imgAlt: 'Gatherings celebration',
    },
    {
      id: 6,
      title: 'Kids Events',
      imageUrl: require('../../assets/homepage_Celebrate6.png'),
      imgAlt: 'Kids events celebration',
    },
  ];


  const openDecorationPage = () => {
    router.push(`/${city}/balloon-decoration`);
  };


  const hasCityPageParam = city ? true : false;

  // If city parameter is missing
  if (!hasCityPageParam) {
    return <div>Please select a city first.</div>;
  }

  const handleTitleClick = (title, link) => {
    // Trigger GTM event when the user clicks on the title
    router.push(`/${city}/${link}`);
  };

  const localities =
    cityData[city?.toLocaleLowerCase()]?.cityLocalitiesList || [];
  const localityHandleClick = (localityName) => {
    const formattedLocalityName = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();
    router.push({
      pathname: `/${city.toLowerCase()}/${formattedLocalityName}`,
    });
  };
  return (
    <>
      <SEOHead />
      <HeroBanner openDecorationPage={openDecorationPage} />
      <FoodSection handleTitleClick={handleTitleClick} />
      <ServiceSection />
      <CategorySection />
      <LocalitiesSection
        title={`${city} localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
      <div className="celebrate-container sec-container mt-3">
        <h1 className="h3 text-purple fw-bold display-5 mb-0">Celebrate With Us
          <Image src={DecorationIcon} alt="Entertainment Icon" height={40} width={40} className="service-icon" />
        </h1>
        <p className="celebrate-subtitle">You can easily search for what category of item you want to order.</p>
        <div className="categories-cards">
          <Slider {...celebrateslidersettings}>
            {celebrateData.map(category => (
              <div key={category.id} className="categories-card">
                <a href={category.link} rel="noopener noreferrer">
                  <Image src={category.imageUrl} alt={category.title} className="categories-image" />
                </a>
                <p className="categories-title">{category.title}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <CustomerReview />
      <div>
        <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
          <Image className='whatappicon' src={whatsppicon} alt="WhatsApp Icon" />
        </Link>
      </div>
    </>
  );
}