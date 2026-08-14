"use client";
import React, { useState, useEffect } from "react";
// import { useLocation } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { useParams } from "react-router-dom";
import bannerSvgImage from '../../../../../public/assets/banner-home-bg.svg';
import bannerDecorationImage from '../../../../assets/service-decoration.png';
import bannerChefImage from '../../../../assets/chef-home-banner.png';
import bannerHospitalityImage from '../../../../assets/hospitality.png';
import bannerReturnGiftImage from '../../../../assets/return-gift-banner-home.png';
// import bannerEntertainmentImage from '../../../../assets/entertainment-banner-home.png';
import bannerFoodDeliveryImage from '../../../../assets/food-delivery-home-banner.png';
import Celebrate1Image from '../../../../assets/Birthday&Celebration.png';
import Celebrate2Image from '../../../../assets/corporate-party.png';
import Celebrate3Image from '../../../../assets/house-party.png';
import Celebrate4Image from '../../../../assets/wedding-event.png';
import Celebrate5Image from '../../../../assets/gathering.png';
import Celebrate6Image from '../../../../assets/kids-event.png';
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import '../../../../app/homepage.css';

import cityData from '../../../../utils/cityData';


const ChefCitypage = () => {
    
    const router = useRouter();
   
const { locality } = router.query;

    const [showButton, setShowButton] = useState(false);
    const [city, setCity] = useState("");
    const openLink = () => {
        if (typeof window !== "undefined") {
            window.open("https://play.google.com/store/apps/details?id=com.hora", "_blank");
        }
    };

    

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

    // const  city  = router.query.city;
    // const city = router.asPath.split('/')[1];

    useEffect(() => {
        if (router.isReady) {
            const { city } = router.query;
            setCity(city);
        }
    }, [router.isReady, router.query]);



 
    const formatLocalityName = (name) => {
        return name.replace(/\s+/g, '-').toLowerCase();
      };
      
       // Normalize city parameter
       const normalizedCity = city ? city.toLowerCase() : '';

       
       // Determine if the city parameter exists
       const hasCityPageParam = city ? true : false;
     
       // State to hold the city localities list
       const [cityLocalitiesList, setCityLocalitiesList] = useState([]);
     
       // Fetch city localities when city changes
       useEffect(() => {
         if (normalizedCity) {
           const localities = cityData[normalizedCity]?.cityLocalitiesList || [];
           setCityLocalitiesList(localities);
         }
       }, [normalizedCity]);
     
       const handleClick = (localityName) => {
        const formattedLocalityName = formatLocalityName(localityName);
        router.push(`/${normalizedCity}/${formattedLocalityName}/chef-near-me`);
      };
     
       // If city parameter is missing
       if (!hasCityPageParam) {
         return <div>Please select a city first.</div>;
       }
     
         if (!router.isReady) {
        return <div>Loading...</div>;
    }
    
       
    return (
        <>
        <Head>
  <title>
    {city && locality
      ? `HORA Chef Services in ${locality}, ${city} | Hire Private Chef & Cook Near You – Book Now`
      : city
        ? `HORA Chef Services in ${city} | Hire Private Chef & Cook for Parties – Book Now`
        : `HORA Chef Services | Hire Private Chef & Cook – Book Now`}
  </title>

  <meta
    name="description"
    content={
      city && locality
        ? `🍽️ Book a Professional Chef in ${locality}, ${city}! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks near you for birthdays, house parties, weddings & more.`
        : city
          ? `🍽️ Book a Professional Chef in ${city}! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for parties, weddings & more.`
          : `🍽️ Book a Professional Chef Near You! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for any event.`
    }
  />

  <meta
    name="keywords"
    content={
      city && locality
        ? `chef near me in ${locality} ${city}, hire chef in ${locality}, cook for party ${locality} ${city}, private chef ${locality}, catering ${locality} ${city}`
        : city
          ? `hire chef in ${city}, private chef ${city}, cook near me ${city}, catering services ${city}`
          : `hire chef, private chef, cook near me, catering services`
    }
  />

  <meta
    property="og:title"
    content={
      city && locality
        ? `Hire Chef & Cook in ${locality}, ${city} | HORA Chef Services`
        : `Hire Chef & Cook | HORA Chef Services`
    }
  />
  <meta
    property="og:description"
    content="🍽️ Book professional chefs and cooks for your event. Contact us at 7338584828."
  />
  <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
  <meta property="og:image:alt" content="hire chef near me, private chef, cook for party" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />
  <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
  <meta
    property="og:url"
    content={
      city && locality
        ? `https://horaservices.com/${city.toLowerCase()}/${locality.toLowerCase()}/chef-near-me`
        : city
          ? `https://horaservices.com/${city.toLowerCase()}/book-chef-cook-for-party`
          : `https://horaservices.com/book-chef-cook-for-party`
    }
  />
  <meta property="og:type" content="website" />
</Head>
        <div>
            <div style={styles.homebanner} className="homebanner citypage">
                <div style={{ ...styles.bgImg, backgroundImage: `url(${bannerSvgImage.src})` }} className="bgImg">
                    <div style={styles.pageWidth}>
                        <div style={styles.textContainer} className="textContainerhome">
                            <h1 style={{ fontSize: "40px", fontWeight: "500", margin: "0" }}>{"Simplifying and Enhancing celebrations."}</h1>
                            <h2 style={{ fontSize: "72px", fontWeight: "900", margin: "0 0 10px", lineHeight: "77px", margin: "0px 0 10px", padding: "3px 14% 5px 14%", textTransform: "uppercase" }}>{"ALL PARTY SERVICES IN YOUR "}{city}</h2>
                        </div>
                    </div>
                    <div style={styles.bannerBottomSec} className="bannerBottomSec">
                        <div style={styles.bannerDecorationImage} className="bannerDecorationImage">
                            <Link href={`/${city}/balloon-decoration`} style={{ textDecoration: "none" }}>
                                <Image src={bannerDecorationImage} alt="Decoration Near me" style={{ height: "auto" }} />
                                <h2 style={{ fontSize: "16px", fontWeight: "normal", color: "#fff", textAlign: "center" }}>Decoration</h2>
                            </Link>
                        </div>
                        <div style={styles.bannerDecorationImage} className="bannerDecorationImage">
                            <Link href={`/${city}/book-chef-cook-for-party`} style={{ textDecoration: "none" }}>
                                <Image src={bannerChefImage} alt="Chef Near me" style={{ height: "auto" }} />
                                <h2 style={{ fontSize: "18px", fontWeight: "normal", color: "#fff", textAlign: "center" }}>Hire Chef</h2>
                            </Link>
                        </div>
                        <div style={styles.bannerDecorationImage} className="bannerDecorationImage">
                            <Link href="/" style={{ textDecoration: "none" }}>
                                <Image src={bannerReturnGiftImage} alt="Return Gift Near me" style={{ height: "auto" }} />
                                <h2 style={{ fontSize: "18px", fontWeight: "normal", color: "#fff", textAlign: "center" }}>Gift & Party Supplies</h2>
                            </Link>
                        </div>
                        {/* <div style={styles.bannerDecorationImage} className="bannerDecorationImage">
                            <Link href="/" style={{ textDecoration: "none" }}>
                                <Image src={bannerEntertainmentImage} alt="Entertainment Near me" style={{ height: "auto" }} />
                                <h2 style={{ fontSize: "18px", fontWeight: "normal", color: "#fff", textAlign: "center" }}>Entertainment</h2>
                            </Link>
                        </div> */}
                        <div style={styles.bannerDecorationImage} className="bannerDecorationImage">
                            <Link href="/" style={{ textDecoration: "none" }}>
                                <Image src={bannerFoodDeliveryImage} alt="Food Delivery Near me" style={{ height: "auto" }} />
                                <h2 style={{ fontSize: "18px", fontWeight: "normal", color: "#fff", textAlign: "center" }}>Food Delivery</h2>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div style={styles.celebrateWithUs} className="celebrateWithUs">
                <div style={{ padding: "0 6%" }}>
                    <h3 style={{ fontSize: "70px", fontWeight: "bold", color: "#E6756B", margin: "35px 0 20px", textAlign: "center" }}>CELEBRATE WITH US</h3>
                    <div style={styles.celebrateBottomSec} className="celebrateBottomSec">
                        <div style={styles.celebrateBox} className="celebrateBox">
                            <Image src={Celebrate1Image} alt="Birthday and Anniversary" style={styles.celebrateDecorationImage} className="celebrateDecorationImage" />
                            <h3 style={{ fontSize: "16px", color: "#0f0f0f", fontWeight: "600", textAlign: "center", margin: "7px 0 20px 0" }}>{'Birthday and Anniversary'}</h3>
                        </div>
                        <div style={styles.celebrateBox} className="celebrateBox">
                            <Image src={Celebrate2Image} alt="House Parties" style={styles.celebrateDecorationImage} className="celebrateDecorationImage" />
                            <h3 style={{ fontSize: "16px", color: "#0f0f0f", fontWeight: "600", textAlign: "center", margin: "7px 0 20px 0" }}>{'House Parties'}</h3>
                        </div>
                        <div style={styles.celebrateBox} className="celebrateBox">
                            <Image src={Celebrate3Image} alt="Corporate Events" style={styles.celebrateDecorationImage} className="celebrateDecorationImage" />
                            <h3 style={{ fontSize: "16px", color: "#0f0f0f", fontWeight: "600", textAlign: "center", margin: "7px 0 20px 0" }}>{'Corporate Events'}</h3>
                        </div>
                        <div style={styles.celebrateBox} className="celebrateBox">
                            <Image src={Celebrate4Image} alt="Wedding Events" style={styles.celebrateDecorationImage} className="celebrateDecorationImage" />
                            <h3 style={{ fontSize: "16px", color: "#0f0f0f", fontWeight: "600", textAlign: "center", margin: "7px 0 20px 0" }}>{'Wedding Events'}</h3>
                        </div>
                        <div style={styles.celebrateBox} className="celebrateBox">
                            <Image src={Celebrate5Image} alt="Gatherings" style={styles.celebrateDecorationImage} className="celebrateDecorationImage" />
                            <h3 style={{ fontSize: "16px", color: "#0f0f0f", fontWeight: "600", textAlign: "center", margin: "7px 0 20px 0" }}>{'Gatherings'}</h3>
                        </div>
                        <div style={styles.celebrateBox} className="celebrateBox">
                            <Image src={Celebrate6Image} alt="Kids Events" style={styles.celebrateDecorationImage} className="celebrateDecorationImage" />
                            <h3 style={{ fontSize: "16px", color: "#0f0f0f", fontWeight: "600", textAlign: "center", margin: "7px 0 20px 0" }}>{'Kids Events'}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <section id="section6" class="sectionidsec">
                <div style={styles.pageWidth}>
                    <div id="faqQ">
                        <div>
                            <h1 style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 0px", textAlign: "center" }}>Faq</h1>
                        </div>
                        <div>
                            <strong>1: How can I hire an online chef for my event in {city.toUpperCase()}?</strong>
                            <p>A: Hiring an online chef in {city.toUpperCase()} is easy!</p>
                            <p>A: Visit our website or download our app and place the order by selecting your dish, number of people, date, and time of the event to secure their services for your event.</p>
                        </div>
                        <div>
                            <strong>2: What makes your catering services the best for small parties in {city.toUpperCase()}?</strong>
                            <p>A: Our catering services in {city.toUpperCase()} are tailored for small parties , We offer personalized options to make your event unforgettable.</p>
                        </div>
                        <div>
                            <strong>3: Can I book a private chef for a day or night in {city.toUpperCase()}?</strong>
                            <p>A: Absolutely! Our private chefs are available for hire in {city.toUpperCase()}, ensuring a unique dining experience for any occasion.</p>
                        </div>
                        <div>
                            <strong>4: How do I find a trained verified cook near me in {city.toUpperCase()}?</strong>
                            <p>A: Finding a trained verified cook near you is simple. Enter your location on our platform, and choose from a list of dishes, number of people, date and time of event.</p>
                        </div>
                        <div>
                            <strong>5: Is Book a cook in {city.toUpperCase()} suitable for last-minute chef bookings?</strong>
                            <p>A: Yes, our platform allows for convenient and quick bookings, you can book the order 24 hours in advance.</p>
                        </div>
                        <div>
                            <strong>6: What sets your chefs for hire in {city.toUpperCase()} apart from others?</strong>
                            <p>A: Our chefs in {city.toUpperCase()} are not only skilled but also verified, ensuring a high standard of service and culinary expertise.</p>
                        </div>
                        <div>
                            <strong>7: Can I hire a cook at home for a special occasion in {city.toUpperCase()}?</strong>
                            <p>A: Certainly! Explore our selection of cooks available for hire at home in {city.toUpperCase()} to make your event memorable.</p>
                        </div>
                        <div>
                            <strong>8: How do I take a chef in {city.toUpperCase()} for a personalized cooking experience?</strong>
                            <p>A: Taking a chef in {city.toUpperCase()} is simple. Choose a chef, specify your preferences, and enjoy a personalized cooking experience in the comfort of your home.</p>
                        </div>
                        <div>
                            <strong>9: Are your party caterers in {city.toUpperCase()} suitable for both small and large events?</strong>
                            <p>A: Yes, our party caterers in {city.toUpperCase()} cater to a variety of events, from intimate gatherings to larger celebrations.</p>
                        </div>
                        <div>
                            <strong>10: Can I hire a professional chef for a night in {city.toUpperCase()}?</strong>
                            <p>A: Absolutely! Explore our options to hire a professional chef for a night in {city.toUpperCase()} and create a culinary experience to remember.</p>
                        </div>
                        <div>
                            <strong>11: Is it possible to hire someone to cook for me in {city.toUpperCase()} regularly?</strong>
                            <p>A: Yes, you can hire a cook near you in {city.toUpperCase()} for regular cooking services. Choose a cook that fits your preferences and schedule.</p>
                        </div>
                        <div>
                            <strong>12: What is the process for hiring a private personal chef in {city.toUpperCase()}?</strong>
                            <p>A: Hiring a private personal chef is easy. Browse through our profiles, select your preferred chef, and book their services for a personalized culinary experience.</p>
                        </div>
                        <div>
                            <strong>13: : How can I find the best home caterers in {city.toUpperCase()}?</strong>
                            <p>A: Finding the best home caterers in {city.toUpperCase()} is simple with our platform. Explore our options and choose the one that suits your needs.</p>
                        </div>
                        <div>
                            <strong>14: Do you have top-rated cooks in {city.toUpperCase()} available for hire?</strong>
                            <p>A: Yes, we have a selection of top-rated cooks in {city.toUpperCase()} available for hire. Explore their profiles and book the one that meets your requirements.</p>
                        </div>
                        <div>
                            <strong>15: Can I hire a chef at home in {city.toUpperCase()} for a cooking demonstration?</strong>
                            <p>A: Absolutely! Hire a chef at home in {city.toUpperCase()} for a cooking demonstration and learn culinary skills from a professional.</p>
                        </div>
                        <div>
                            <strong>16: What is the difference between a private chef and a personal cook in {city.toUpperCase()}?</strong>
                            <p>A: A private chef typically offers a more personalized and upscale dining experience, while a personal cook provides regular cooking services. Choose based on your specific needs.</p>
                        </div>
                        <div>
                            <strong>17: Can I hire cooks on demand in {city.toUpperCase()} for last-minute gatherings?</strong>
                            <p>A: Yes, our platform allows you to hire cooks on demand in {city.toUpperCase()}, making it convenient for spontaneous events.</p>
                        </div>
                        <div>
                            <strong>18: How can I find local chefs for hire in {city.toUpperCase()} for a regional cuisine?</strong>
                            <p>A: Finding local chefs for hire in {city.toUpperCase()} is easy. Specify your cuisine preferences, and our platform will display chefs with expertise in that cuisine.</p>
                        </div>
                        <div>
                            <strong>19: Are there cooking maids near me in {city.toUpperCase()} available for hire?</strong>
                            <p>A: Yes, you can find cooking maids near you in {city.toUpperCase()} available for hire. Explore their profiles and choose the one that suits your needs.</p>
                        </div>
                        <div>
                            <strong>20: Can I hire a personal chef for a night in {city.toUpperCase()} for a romantic dinner?</strong>
                            <p>A: Certainly! Hire a personal chef for a night in {city.toUpperCase()} and create a romantic dining experience in the comfort of your home</p>
                        </div>
                        <div>
                            <strong>21: How do I hire a cook online in {city.toUpperCase()} for virtual cooking sessions?</strong>
                            <p>A: Hiring a cook online in {city.toUpperCase()} for virtual cooking sessions is simple. Browse through available cooks, choose one, and arrange for an online cooking session.</p>
                        </div>
                        <div>
                            <strong>22: : What makes your home cooking service in {city.toUpperCase()} unique?</strong>
                            <p>A: Our home cooking service in {city.toUpperCase()} is unique due to our diverse selection of trained and verified cooks, ensuring a high-quality culinary experience</p>
                        </div>
                        <div>
                            <strong>23: Can I book mini caterers in {city.toUpperCase()} for a small family gathering?</strong>
                            <p>A: Absolutely! Our mini caterers in {city.toUpperCase()} are perfect for small family gatherings, providing a customized and delightful culinary experience.</p>
                        </div>
                        <div>
                            <strong>24: How do I hire a private cook for home in {city.toUpperCase()} for regular meals?</strong>
                            <p>A: Hiring a private cook for home in {city.toUpperCase()} for regular meals is easy. Choose a cook that fits your preferences and schedule for consistent cooking services.</p>
                        </div>
                        <div>
                            <strong>25: Are your private chef services near me in {city.toUpperCase()} available for special dietary requirements?</strong>
                            <p>A: Yes, our private chef services near you in {city.toUpperCase()} are customizable to accommodate special dietary requirements. Discuss your needs with the selected chef to ensure a tailored culinary experience.</p>
                        </div>
                    </div>
                    <p id="city-area-title" style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 2px", textAlign: "center" }}>Serving all Areas in {city}</p>
                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#E6756B", margin: "2px 0 2px", textAlign: "center" }}>All localities are here</p>

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


                    {/* <div id="city-area-list">
                        <ul style={{ listStyle: "none", padding: "20px 0" }}>
                            {cityData[city]?.cityLocalitiesList.map((item) => {
                                return (
                                    <li style={{ padding: "0 10px", display: "inline-block" }}><a href="/">{item.name}</a></li>
                                )
                            })}
                        </ul>
                    </div> */}

                </div>
            </section>
            <section id="section7" class="sectionidsec">
                <div style={styles.pageWidth}>
                    <p style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 2px", textAlign: "center" }} className="other-cities">Other Cities</p>
                    <div class="tab-inner">
                        <ul style={{ listStyle: "none", padding: "20px 20px" }}>
                            <li className="city-link" data-city="Delhi" style={{ padding: "0 10px", display: "inline-block" }} >
                                <Link href="#">Delhi</Link>
                            </li>
                            <li className="city-link" data-city="Gurugram" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Gurugram</Link>
                            </li>
                            <li className="city-link" data-city="Ghaziabad" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Ghaziabad</Link>
                            </li>
                            <li className="city-link" data-city="Faridabad" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Faridabad</Link>
                            </li>
                            <li className="city-link" data-city="Noida" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Noida</Link>
                            </li>
                            <li className="city-link" data-city="Bengaluru" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Bengaluru</Link>
                            </li>
                            <li className="city-link" data-city="Hyderabad" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Hyderabad</Link>
                            </li>
                            <li className="city-link" data-city="Mumbai" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Mumbai</Link>
                            </li>
                            <li className="city-link" data-city="Indore" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Indore</Link>
                            </li>
                            <li className="city-link" data-city="Chennai" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Chennai</Link>
                            </li>
                            <li className="city-link" data-city="Pune" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Pune</Link>
                            </li>
                            <li className="city-link" data-city="Surat" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Surat</Link>
                            </li>
                            <li className="city-link" data-city="Bhopal" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Bhopal</Link>
                            </li>
                            <li className="city-link" data-city="kanpur" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Kanpur</Link>
                            </li>
                            <li className="city-link" data-city="Lucknow" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Lucknow</Link>
                            </li>
                            <li className="city-link" data-city="kolkata" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Kolkata</Link>
                            </li>
                            <li className="city-link" data-city="Goa" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Goa</Link>
                            </li>
                        </ul>

                        <div id="city-content">
                            <div class="des-city-area">
                                <h1 style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 0px", textAlign: "center" }}>Description</h1>
                                <p id="city-description">
                                    Book professional Cooks and Chefs in {city} for House Parties, Birthday Parties, Special Breakfast, Lunch and Dinner at Home. Hire trained and verified personal Chefs and Cooks near you for a private dining experience at home with the best cooks and chef services at home.
                                </p>
                            </div>
                        </div>
                    </div>
                    <p id="city-seo-content" style={{ fontSize: "5px", margin: "20px 0 20px " }}>
                        Online chef for hire in {city}, Chef in {city}, Best caterers for small parties in  {city}, Best home-made cooking service in  {city}, Mini party caterers in  {city}, Book a chef in  {city}, Book a cook in  {city}, Book a private chef in  {city}, Book a private cook in  {city}, Book a trained verified cook near you in  {city}, Bookacook in  {city}, Caterers for small parties in  {city}, Top caterers in  {city}, Chef for a party in  {city}, Catering services in  {city}, Chef at home service in  {city}, Chef for a day in  {city}, Chef for a night in  {city}, Chef for hire in  {city}, Chef cooking at my home in  {city}, Chef near me in  {city}, Chef on demand in  {city}, Chef required at home in  {city}, Chefs for hire in  {city}, Chefs for home in  {city}, Hire a private chef in  {city}, Chefs on hire in  {city}, Cook chef near me in  {city}, Cook at home services in  {city}, Cook for a day in  {city}, Cook for a night in  {city}, Cook for one day in  {city}, Cook for a party in  {city}, Cook service near me in  {city}, Cook home services in  {city}, Cook near me in  {city}, Cook on demand in  {city}, Cook on hire near me in  {city}, Cook required at home in  {city}, Cooking as a service in {city}, Cooking maids near me in  {city}, Cooking services near me in  {city}, Cooks for hire in  {city}, Cooks for home in  {city}, Cooks near me in  {city}, Cooks on hire in  {city}, Domestic cook near me in  {city}, Find a chef in  {city}, Find a cook in  {city}, Hire a chef in  {city}, Hire a chef for a day in  {city}, Hire personal chef in  {city}, Hire a chef for home in  {city}, Hire a chef near me in  {city}, Take a Chef in  {city}, Hire a cook in  {city}, Hire a cook at home in  {city}, Hire a cook for home in  {city}, Hire a cook near me in  {city}, Hire a personal chef for a night in  {city}, Hire a personal cook in  {city}, Hire a professional chef in  {city}, Hire chef at home in  {city}, Hire cook near me in  {city}, Hire cook online in  {city}, Hire private chef in  {city}, Hire someone to cook for you in  {city}, Hiring a personal chef in  {city}, Home caterers in  {city}, Home chef near me in  {city}, Home cook near me in  {city}, Home cooking service in  {city}, Home cooking service near me in  {city}, Home party catering in  {city}, House chef near me in  {city}, House cook near me in  {city}, In-home cooking service in  {city}, In-house cooking service in  {city}, Local chefs for hire in  {city}, Looking for chef in  {city}, Looking for cook in  {city}, Mini caterers in  {city}, Need a chef in  {city}, Need a cook in  {city}, Online cook service in  {city}, Party caterers in  {city}, Personal chef in  {city}, Personal chefs for hire near me in  {city}, Personal Cook in  {city}, Personal cook near me in  {city}, Private chef in  {city}, Private chef hire in  {city}, Private chef near me in  {city}, Private chef services near me in  {city}, Private cook in  {city}, Private cook for hire in  {city}, Private personal chef in  {city}, Professional chef for hire in  {city}, Top rated chefs in  {city}, Top rated cooks in  {city}, Want to hire a cook in  {city}
                    </p>
                </div>
            </section>
        </div>
        </>
    );
}

const styles = {
    homebanner: {
        marginTop: "-76px",
    },
    pageWidth: {
        maxWidth: "100%",
        width: "1200px",
        margin: "0 auto",
    },
    bgImg: {
        backgroundSize: "cover",
        paddingTop: "110px",
        paddingBottom: "30px",
    },
    pageWidth: {
        maxWidth: "100%",
        width: "1200px",
        margin: "0 auto",
    },
    textContainer: {
        textAlign: "center",
        color: "white", // Adjust text color as needed
        margin: "0 0 70px 0",
    },
    bannerBottomSec: {
        display: "flex",
        justifyContent: "center",
        alignItems: "top",
        flexDirection: "row",
        padding: "0px 6%",
        margin: "0 auto",
        flexWrap: "wrap",
    },
    celebrateBottomSec: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "row",
        margin: "0 auto",
        flexWrap: "wrap",
    },
    celebrateBox: {
        margin: "0 1%",
        width: "20%",
    },
    bannerDecorationImage: {
        margin: "0 1%",
        width: "14%",
    },
    serviceSec: {
        backgroundColor: "rgba(230, 117, 107, 0.2)",
        borderRadius: "59px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "60px",
        marginBottom: "50px",
    },
    serviceSecRight: {
        width: "53%",
    },
    serviceSecLeft: {
        width: "40%",
    }

};

export default ChefCitypage;