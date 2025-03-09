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
import { getHomeOrganizationSchema } from "@/utils/schema";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
// import styles from "../../app/page.module.css";
import "../../../app/globals.css";
import Slider from "react-slick";

import DecorationIcon from "../../../assets/decoration_icon.webp";
import PhotographyIcon from "../../../assets/photography_icon.webp";
import FoodIcon from "../../../assets/food_icon.png";
import decorationbanner from "../../../assets/decoration-home-banner.jpg";
// import EntertainmentIcon from "../../assets/enter_icon.png";
import "../../../app/homepage.css";
import cityData from "../../../utils/cityData";
// import bannerSvgImage from '@/assets/banner-home-bg.svg';
import bannerDecorationImage from '../../../assets/service-decoration.png';
import bannerChefImage from '@/assets/chef-home-banner.png';
import bannerHospitalityImage from '@/assets/hospitality.png';
import bannerReturnGiftImage from '@/assets/return-gift-banner-home.png';
import liveCateringImage from '@/assets/live-buffet-service.png';
import bannerFoodDeliveryImage from '@/assets/food-delivery-home-banner.png';
import Celebrate1Image from '@/assets/Birthday&Celebration.png';
import Celebrate2Image from '@/assets/corporate-party.png';
import Celebrate3Image from '@/assets/house-party.png';
import Celebrate4Image from '@/assets/wedding-event.png';
import Celebrate5Image from '@/assets/gathering.png';
import Celebrate6Image from '@/assets/kids-event.png';
import gurugram from "../../../assets/gurugram.webp";
import chennai from "../../../assets/Chennai.webp";
import jaipur from "../../../assets/jaipur.webp";
import Horaservices from "@/components/HoraServices";
import FAQs from "@/components/FAQs"
import { transform } from "next/dist/build/swc";
const ChefCitypage = () => {
    const [showButton, setShowButton] = useState(false);
    const [city, setCity] = useState("");
    const cityInUppercase = city.toUpperCase();
    const normalizedCity = city ? city.toLowerCase() : '';
    const openLink = () => {
        window.open("https://play.google.com/store/apps/details?id=com.hora", "_blank");
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

    const handleLocalityClick = (localityName) => {
        const formattedLocalityName = formatLocalityName(localityName);

        router.push({
            pathname: `/${normalizedCity}/${formattedLocalityName}`,
        });
    };
    const formatLocalityName = (name) => {
        return name.replace(/\s+/g, '-').toLowerCase();
    };
    const router = useRouter();
    // const  city  = router.query.city;
    // const city = router.asPath.split('/')[1];

    useEffect(() => {
        if (router.isReady) {
            const { city } = router.query;
            setCity(city);
        }
    }, [router.isReady, router.query]);

    if (!router.isReady) {
        return <div>Loading...</div>;
    }

    return (<>
<div className="page-width">
        <div className="party-services">
            {/* <h1 className="banner-heading">All Party Services on One Platform</h1> */}
            <div className="chef-banner" style={styles.bannerChef}>

                <div className="banner-text" style={styles.bannerText}>
                    <h2 className="banner-insideHeading">Private Chef in {city}</h2>
                    <button className="hire-now">Hire Now</button>
                </div>
                <div className="banner-img" style={styles.bannerImg}>
                    <Image src={"../assets/single-chef-banner.jpg"} alt='chef banner'
                        width={1200}
                        height={300}
                       
                        className="banner-chef"
                    />
                </div>
            </div>
        </div>
            
            {/* hora food decore photo servies */ }
            <Horaservices city={city} />
            


            {/* locality box */}
            <div className="localities-box">
                <h2 className="city-heading">
                    {city ? city.charAt(0).toUpperCase() + city.slice(1) : "City"} Areas
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

            <section id="section7" class="sectionidsec">
                <div style={styles.pageWidth}>

                    <div id="how-it-works" style={styles.howItWorksSection}>
                        <h2 style={styles.sectionHeader}>How It Works</h2>
                        <ul style={styles.howItWorksList}>
                            <li>👨‍🍳 Chef arrives at Home</li>
                            <li>🥘 Prepares dishes using your Ingredients and Appliances</li>
                            <li>🧼 Cleans Kitchen after the service and leaves</li>
                        </ul>



                    </div>
                </div>
            </section>
            <div id="FAQs" class="sectionidsec">
                <div style={styles.pageWidth}>
                    <FAQs city={city} />

                </div>
            </div>
            <div class="des-city-area">
                <h2 className="heading-purple" >Description</h2>
                <p id="city-description">
                    Book professional Cooks and Chefs in {cityInUppercase} for House Parties, Birthday Parties, Special Breakfast, Lunch and Dinner at Home. Hire trained and verified personal Chefs and Cooks near you for a private dining experience at home with the best cooks and chef services at home.
                </p>
            </div>
            <p id="city-seo-content" style={{ fontSize: "5px", margin: "20px 0 20px " }}>
                Online chef for hire in {city}, Chef in {city}, Best caterers for small parties in  {city},
                 Best home-made cooking service in  {city}, Mini party caterers in  {city}, Book a chef in  {city},
                  Book a cook in  {city}, Book a private chef in  {city}, Book a private cook in  {city}, 
                  Book a trained verified cook near you in  {city}, Bookacook in  {city}, Caterers for small parties in  {city},
                   Top caterers in  {city}, Chef for a party in  {city}, Catering services in  {city}, Chef at home service in  {city},
                    Chef for a day in  {city}, Chef for a night in  {city}, Chef for hire in  {city}, Chef cooking at my home in  {city},
                     Chef near me in  {city}, Chef on demand in  {city}, Chef required at home in  {city}, Chefs for hire in  {city}, 
                     Chefs for home in  {city}, Hire a private chef in  {city}, Chefs on hire in  {city}, Cook chef near me in  {city},
                      Cook at home services in  {city}, Cook for a day in  {city}, Cook for a night in  {city}, Cook for one day in  {city}, 
                      Cook for a party in  {city}, Cook service near me in  {city}, Cook home services in  {city}, Cook near me in  {city}, 
                      Cook on demand in  {city}, Cook on hire near me in  {city}, Cook required at home in  {city}, Cooking as a service in {city}, 
                      Cooking maids near me in  {city}, Cooking services near me in  {city}, Cooks for hire in  {city}, Cooks for home in  {city}, 
                      Cooks near me in  {city}, Cooks on hire in  {city}, Domestic cook near me in  {city}, Find a chef in  {city},
                       Find a cook in  {city}, Hire a chef in  {city}, Hire a chef for a day in  {city}, Hire personal chef in  {city}, Hire a chef for home in  {city}, Hire a chef near me in  {city}, Take a Chef in  {city}, Hire a cook in  {city}, Hire a cook at home in  {city}, Hire a cook for home in  {city}, Hire a cook near me in  {city}, Hire a personal chef for a night in  {city}, Hire a personal cook in  {city}, Hire a professional chef in  {city}, Hire chef at home in  {city}, Hire cook near me in  {city}, Hire cook online in  {city}, Hire private chef in  {city}, Hire someone to cook for you in  {city}, Hiring a personal chef in  {city}, Home caterers in  {city}, Home chef near me in  {city}, Home cook near me in  {city}, Home cooking service in  {city}, Home cooking service near me in  {city}, Home party catering in  {city}, House chef near me in  {city}, House cook near me in  {city}, In-home cooking service in  {city}, In-house cooking service in  {city}, Local chefs for hire in  {city}, Looking for chef in  {city}, Looking for cook in  {city}, Mini caterers in  {city}, Need a chef in  {city}, Need a cook in  {city}, Online cook service in  {city}, Party caterers in  {city}, Personal chef in  {city}, Personal chefs for hire near me in  {city}, Personal Cook in  {city}, Personal cook near me in  {city}, Private chef in  {city}, Private chef hire in  {city}, Private chef near me in  {city}, Private chef services near me in  {city}, Private cook in  {city}, Private cook for hire in  {city}, Private personal chef in  {city}, Professional chef for hire in  {city}, Top rated chefs in  {city}, Top rated cooks in  {city}, Want to hire a cook in  {city}
            </p>

        </div>
        </>);
}

const styles = {
    bannerChef:{
position :"relative"
    },
    bannerText:{
position:"absolute",
top:"50%",
right:"11%",
transform:"translate(-11% , -50%) "
    },
    bannerImg: {
        color: "transparent",
        width: "100%",
        height: "300px",
        objectPosition: "bottom 10px right 20px",
        filter: "brightness(0.5)",
    },
    bgImg: {
        backgroundSize: "cover",
        paddingTop: "110px",
        paddingBottom: "30px",
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
    },
    howItWorksSection: { marginTop: '40px', textAlign: 'center' },
    howItWorksList: { listStyleType: 'none', padding: 0, fontSize: '18px', lineHeight: '2' }
};

export default ChefCitypage;
