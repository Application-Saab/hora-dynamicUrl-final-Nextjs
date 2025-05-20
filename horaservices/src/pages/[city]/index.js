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
import Head from "next/head";
import Success from '../../pages/Success';
import Failure from '../../pages/Failure';
// import { useNavigate , Link, useLocation } from 'react-router-dom'; // Import useNavigate
import whatsppicon from "../../assets/whatsapp-icon.png";
import { getHomeOrganizationSchema } from "../../utils/schema";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "../../app/page.module.css";
import '../../app/globals.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DecorationIcon from '../../assets/decoration_icon.webp';
import PhotographyIcon from '../../assets/photography_icon.webp';
import FoodIcon from '../../assets/food_icon.png';
import EntertainmentIcon from '../../assets/enter_icon.png';
import '../../app/homepage.css'
import cityData from '../../utils/cityData';
import decorationbanner from '../../assets/decoration-home-banner.jpg';

export default function Home() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [city, setCity] = useState(null);

  const photographyUrl = () =>{
    window.open(
      'https://api.whatsapp.com/send?phone=+917338584828&text=I%20wanted%20to%20know%20about%2C%20photography',
      '_blank'
    );
  }
  const schemaOrg = getHomeOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

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



  

  const foodData = [
    {
      id: 1,
      image: "https://horaservices.com/api/uploads/homepage_food1.webp",
      title: "Bulk Food Delivery",
      imgAlt: "Bulk food delivery service",
      link: "/party-food-delivery-live-catering-buffet/party-food-delivery"
    },
    {
      id: 2,
      image: "https://horaservices.com/api/uploads/homepage_food2.webp",
      title: "Chef For Party",
      imgAlt: "Chef cooking for a party",
      link: "/book-chef-cook-for-party"
    },
    {
      id: 3,
      image: "https://horaservices.com/api/uploads/homepage_food3.webp",
      title: "Live Catering",
      imgAlt: "Live catering service at an event",
      link: "/party-food-delivery-live-catering-buffet/party-live-buffet-catering"
    },
  ];

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

  const whereAreYouData = [
    {
      id: 1,
      title: 'Decoration',
      link: '/balloon-decoration',
      imageUrl: "https://horaservices.com/api/uploads/homepage_whatareu1.webp",
      imgAlt: 'Event decoration service',
      points: [
        '✨Choose from 1000+ unique designs for any Event - Birthdays, Anniversaries, Baby showers, Weddings, and more!',
        '✨Get your venue decorated in just 2 hours, indoors or outdoors.',
        '✨Best prices, timely service, and support',
        '✨ 4.8 ⭐ Rating...',
      ],
    },
    {
      id: 2,
      title: 'Chef For Party',
      link: '/book-chef-cook-for-party',
      imageUrl: "https://horaservices.com/api/uploads/homepage_whatareu2.webp",
      imgAlt: 'Chef services for party events',
      points: [
        " ✨ HORA brings professional chefs to your kitchen",
        '✨ They use your ingredients and utensils 🍳',
        '✨ Experience 400 restaurant-style dishes. 🍲',
        '✨ Affordable & customizable. 💰',
        '✨ Full hygiene control. 🧼',
        '✨ 4.8 ⭐ Rating...',
      ],
    },
    {
      id: 3,
      title: 'Food Delivery',
      link: '/party-food-delivery-live-catering-buffet/party-food-delivery',
      imageUrl: "https://horaservices.com/api/uploads/homepage_whatareu3.webp",
      imgAlt: 'Food delivery services for events',
      points: [
        '✨🎉 Enjoy food delivery with',
        '✨ Best prices , Timely service',
        '✨ Delicious taste',
        '✨ Good packing',
        '✨ Guaranteed support',
        '✨ 4.8 ⭐ Rating...',
      ],
    },
    {
      id: 4,
      title: 'Live Catering',
      link: '/party-food-delivery-live-catering-buffet/party-live-buffet-catering',
      imageUrl: "https://horaservices.com/api/uploads/homepage_whatareu4.webp",
      imgAlt: 'Live Catering services',
      points: [
        '🎉 Enjoy the full buffet/ Catering setup with hot and fresh food cooked by professional chefs starting @300 per plate ',
        '✨ Best prices , Timely service',
        '✨ Delicious taste',
        '✨ Good packing',
        '✨ Guaranteed support',
        '✨ 4.8 ⭐ Rating...',
      ],
    },
    {
      id: 5,
      title: 'Entertainment',
      link: '/',
      imageUrl: "https://horaservices.com/api/uploads/homepage_whatareu5.webp",
      imgAlt: 'Event food delivery services',
      points: [
        '✨ Make your event unforgettable by engaging your guests! ✨ Choose from over 10 amazing services:',
        '🎨 Tattoo Artist',
        '🎩 Magician',
        '🎉 Party Host',
        '🐻 Mascot ',
        '🌿 Mehandi',
        '💅 Nail Art ..and so much more!'
      ],
    },
  ];

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

  const CustomerReview = [
    {
      id: 1,
      name: "hemant singh",
      image: "https://play-lh.googleusercontent.com/a-/ALV-UjU_D6MAIAmJm4BrWTwjmEUcdUPXGbQOutY3YUmEfozjR0EDCDlbfQ=s32-rw",
      imgAlt: 'hemant singh review',
      rating: 5,
      review: "HORA have experienced and trained staff.  they effortlessly executed my event with grace. The food was not only delicious but also elegantly presented, leaving my guests raving about the taste and variety.",
    },
    {
      id: 2,
      name: "SANDIP RAI",
      image: "https://play-lh.googleusercontent.com/a/ACg8ocJ3rwU_SQsSWbLiTYa9DsB3xjuM1Qa2oUzyowa6bka5AsXukg=s32-rw-mo",
      imgAlt: 'SANDIP RAI review',
      rating: 5,
      review: "The decoration was so good and magical.I booked this decoration for my lil ones bday and I was very happy the way the canopy was set up and decorated by Sandeep from Hora. Greate Job!!"
    },
    {
      id: 3,
      name: "Ashu Tiwari",
      image: "https://play-lh.googleusercontent.com/a-/ALV-UjWDqzjOJ19p-lbksp72dtFtEozrxlyX3-grQi0fSoiFSm8RrR9H=s32-rw",
      imgAlt: 'Ashu Tiwari review',
      rating: 5,
      review: "Food was too good . I mean all dishes were good and quantity was good .every guest appreciated the taste and love it so much.Will definitely recommend to anyone looking for food services"
    },
    {
      id: 4,
      name: "Vijeta Sunda",
      image: "https://play-lh.googleusercontent.com/a-/ALV-UjVFRB3pRXxtJgvV6QWB7tLW9JFDG-QiY8oHr22n_pQIQJaN_WD87w=s32-rw",
      imgAlt: 'Vijeta Sunda review',
      rating: 4,
      review: "What a delightful experience we had..I'm so grateful for sending me the best Chef Vipin Kumar Arya who was so so experienced and skilled and dedicated...we had a party of 25people and he made it so easy for me and all"
    },
    {
      id: 5,
      name: "Sneha",
      image: "https://play-lh.googleusercontent.com/a-/ALV-UjWYlq3OV6In6sCw_X91EexqX7q9FdazSyOJ-ROxRw63-BEbUnuB_A=s32-rw",
      imgAlt: 'Jerome Bell review repeated',
      rating: 4,
      review: "The decorations were festive and vibrant, creating the perfect atmosphere for our celebration. Their professionalism and creativity were top-notch.. Very Good and amazing suppport"
    },
  ];



  const openSliderLink = (city) => {
      window.location.href = `/${city}/balloon-decoration`; // Redirects to the provided link

  };

  const formatLocalityName = (name) => {
    return name.replace(/\s+/g, '-').toLowerCase();
  };

   const normalizedCity = city ? city.toLowerCase() : '';
  

   const hasCityPageParam = city ? true : false;


   const [cityLocalitiesList, setCityLocalitiesList] = useState([]);

   useEffect(() => {

     if (normalizedCity) {
       const localities = cityData[normalizedCity]?.cityLocalitiesList || [];

       setCityLocalitiesList(localities);
     }
   }, [normalizedCity]);

   const handleClick = (localityName) => {
    const formattedLocalityName = formatLocalityName(localityName);

    router.push({
      pathname: `/${normalizedCity}/${formattedLocalityName}`, 
    });
  };



   // If city parameter is missing
   if (!hasCityPageParam) {
     return <div>Please select a city first.</div>;
   }



  return (
    <>
      <div className="page-width">
       
           <div className="party-services homeslider">
            <h1 className="party-title">All party services on one platform</h1>
       <div className="home-slider-inner">
       <div className="slide-container" onClick={() => openSliderLink(city)}>
                 <Image src={decorationbanner} alt="Decoration services, Balloon decoration , decoration for birthday party"
                  width={1200} 
                  height={400} 
                  className="responsive-image"
                  />
               </div>
       
           </div>
       
           </div>
        <div className="food-container sec-container">
          <h1 className="food-title">
            <span>Food</span>
            <span><Image src={FoodIcon} alt="Food Icon" className="food-icon" /></span>
          </h1>
          <div className="food-cards desktop">
            {foodData.map(item => (
              <div key={item.id} className="food-card">
                <a href={`${city}/${item.link}`} className="food-card-link">
                  <Image src={item.image} alt={item.title} className="food-image" width={200} height={100} />
                  <p className="food-card-title">{item.title}</p>
                </a>
              </div>
            ))}
          </div>

          <div className="food-cards mobile">
            {foodData.slice(0, 1).map(item => (
              <div key={item.id} className="food-card left-side">
                <a href={`${city}/${item.link}`} className="food-card-link">
                  <Image src={item.image} alt={item.title} className="food-image" width={200} height={100} />
                  <p className="food-card-title">{item.title}</p>
                </a>
              </div>
            ))}

            <div className="food-card  right-side">
              {foodData.slice(1, 3).map(item => (
                <div key={item.id} className="food-card right-card">
                  <a href={`${city}/${item.link}`} className="food-card-link">
                    <Image src={item.image} alt={item.title} className="food-image" width={200} height={100} />
                    <p className="food-card-title">{item.title}</p>
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
                Decoration
                <Image src={DecorationIcon} alt="Decoration Icon" className="service-icon" />
              </h2>
            </div>
            <div className="service-image-container">
              <Image src="https://horaservices.com/api/uploads/homepage_decoration.webp" alt="Decoration" className="service-image" width={200} height={100} />
              <button className="book-now2" onClick={() => window.location.href = `${city}/balloon-decoration`} >Book Now</button>
            </div>
          </div>
          <div className="service">
            <div className="service-header">
              <h2 className='services-h2'>
                Photography
                <Image src={PhotographyIcon} alt="Photography Icon" className="service-icon" />
              </h2>
            </div>
            <div className="service-image-container">
              <Image src="https://horaservices.com/api/uploads/homepage_photography.webp" alt="Photography" className="service-image" width={200} height={100} />
              <button className="book-now2" onClick={photographyUrl} >Book Now</button>

            </div>
          </div>
        </div>

        {/* <div className="entertainment-container sec-container">
  <h1 className="entertainment-header">
    Entertainment 
    <Image src={EntertainmentIcon} alt="Entertainment Icon" className="food-icon" />
  </h1>
  <div className="entertainment-grid">
    {EntertainmentData.map(category => (
      <div key={category.id} className="category-card">
        <a href={category.link} rel="noopener noreferrer">
          <div className="category-image-wrapper">
            <Image src={category.imageUrl} alt={category.title} className="category-image" />
            <p className="category-title">{category.title}</p>
          </div>
        </a>
      </div>
    ))}
  </div>
  </div> */}
        <div className="entertainment-container where-are-you-sec sec-container">
          <h1 className="entertainment-header-whatAre">
            What are you <span className="pink-text">into?</span>
          </h1>

          <h3 className='services-h3'>We offer a variety of services , differing in the total value of needed.</h3>
          <div className="categoriesCard-container">
            {whereAreYouData.map(category => (
              <div key={category.id} className="categoriesCard-card">
                <a href={`${city}/${category.link}`} rel="noopener noreferrer">
                  <div className="categoriesCard-image-wrapper">
                    <Image src={category.imageUrl} alt={category.title} className="categoriesCard-image" width={200} height={100} />
                  </div>
                </a>
                <div className="what-are-sec">
                  <p className="categoriesCard-title">{category.title}</p>
                  <ul className="categoriesCard-points">
                    {category.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                  <a href={`${city}/${category.link}`} className="categoriesCard-explore-more" >
                    Explore More
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="localities-box">
        <h1 className="city-heading">
        {city ? city.charAt(0).toUpperCase() + city.slice(1) : "City"} Localities
        </h1>
        <ul className="localities-list">
      
        {cityLocalitiesList.length > 0 ? (
        cityLocalitiesList.map((locality, index) => (
          <li key={index} className="locality-item">
            <button onClick={() => handleClick(locality.name)} className="locality-button">
              {locality.name}
            </button>
          </li>
        ))
        ) : (
        <div className="no-localities">No localities found for this city.</div>
        )}
        </ul>
        </div>

        <div className="celebrate-container sec-container">
          <h1 className="celebrate-title">Celebrate With Us
            <Image src={DecorationIcon} alt="Entertainment Icon" className="service-icon" />
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

        <div className="customer-review-container sec-container">
          <h2 className='customer-review-h2'>Customer Review</h2>
          <Slider {...settings}  >
            {CustomerReview.map(({ id, name, image, rating, review }) => (
              <div key={id} className="review-card">
                <div className="review-header">
                  <Image src={image} alt={name} className="review-image" width={100} height={100} />
                  <div>
                    <h3 className="review-name">{name}</h3>
                    <div className="review-rating">{"⭐".repeat(rating)}</div>
                  </div>
                </div>
                <p className="review-text">{review}</p>
              </div>
            ))}
          </Slider>
        </div>


      </div>
      <div>
        <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
          <Image className='whatappicon' src={whatsppicon} alt="WhatsApp Icon" />
        </Link>
      </div>
    </>
  );
}