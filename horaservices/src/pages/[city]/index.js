"use client";
import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  PAYMENT,
  PAYMENT_STATUS,
  API_SUCCESS_CODE,
  UPDATE_ORDER_STATUS,
} from "../../utils/apiconstants";
import axios from "axios";
// import { useNavigate , Link, useLocation } from 'react-router-dom'; // Import useNavigate
import whatsppicon from "../../assets/whatsapp-icon.png";
import { getHomeOrganizationSchema } from "@/utils/schema";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "../../app/page.module.css";
import '../../app/globals.css';
import Slider from 'react-slick';
import '../../app/homepage.css'
import cityData from '../../utils/cityData';
import decorationbanner from '../../assets/decoration-home-banner.jpg';
import CustomerReviewsSection from '@/components/CustomerReviewsSection';
import WhatAreYouIntoSection from "@/components/WhatAreYouIntoSection";
import CelebrateWithUsSection from "@/components/CelebrateWithUsSection";
import Horaservices from "@/components/HoraServices";

export default function Home() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [city, setCity] = useState(null);
  const schemaOrg = getHomeOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const normalizedCity = city ? city.toLowerCase() : '';
  const hasCityPageParam = city ? true : false;
  const [cityLocalitiesList, setCityLocalitiesList] = useState([]);


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


  // const EntertainmentData = [
  //   {
  //     id: 1,
  //     title: 'Tattoo Artist',
  //     imageUrl: homepage_entertainment1,
  //     link: '#',
  //     imgAlt: 'Tattoo artist providing services at an event'
  //   },
  //   {
  //     id: 2,
  //     title: 'Magician',
  //     imageUrl: homepage_entertainment2,
  //     link: '#',
  //     imgAlt: 'Magician performing at an event'
  //   },
  //   {
  //     id: 3,
  //     title: 'Party Host',
  //     imageUrl: homepage_entertainment3,
  //     link: '#',
  //     imgAlt: 'Party host engaging with guests'
  //   },
  //   {
  //     id: 4,
  //     title: 'Mascot',
  //     imageUrl: homepage_entertainment4,
  //     link: '#',
  //     imgAlt: 'Mascot character entertaining at an event'
  //   },
  // ];

  const openSliderLink = (link, city) => {
    if (link) {
      window.location.href = `/${city}/${link}`; // Redirects to the provided link
      //window.location.href = link; // Redirects to the provided link
    }
  };

  const handleLocalityClick = (localityName) => {
    const formattedLocalityName = formatLocalityName(localityName);

    router.push({
      pathname: `/${normalizedCity}/${formattedLocalityName}`,
    });
  };
  const formatLocalityName = (name) => {
    return name.replace(/\s+/g, '-').toLowerCase();
  };

  useEffect(() => {

    if (normalizedCity) {
      const localities = cityData[normalizedCity]?.cityLocalitiesList || [];

      setCityLocalitiesList(localities);
    }
  }, [normalizedCity]);

  // If city parameter is missing
  if (!hasCityPageParam) {
    return <div>Please select a city first.</div>;
  }
  

  return (
    <>
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
        <Horaservices city={city} />
        {/* what are you into ?*/}
        <WhatAreYouIntoSection city={city} />

        {/* locality box */}
        <div className="localities-box">
          <h2 className="heading-purple">
            {city ? city.charAt(0).toUpperCase() + city.slice(1) : "City"} Localities
          </h2>

          <ul className="localities-list">
            {cityData[city]?.cityLocalitiesList?.length > 0 ? (
              cityData[city].cityLocalitiesList.map((locality, index) => (
                <li key={index} onClick={() => handleLocalityClick(locality.name)} className="locality-item">
                  <span className="locality-button">{locality.name}</span>
                </li>
              ))
            ) : (
              <div className="no-localities">No localities found for this city.</div>
            )}
          </ul>

        </div>


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