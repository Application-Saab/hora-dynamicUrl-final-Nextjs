import React, { useState, useEffect } from "react";
import bannerSvgImage from "../../../../../public/assets/banner-home-bg.svg";
import bannerDecorationImage from "../../../../assets/service-decoration.png";
import bannerChefImage from "../../../../assets/chef-home-banner.png";
import bannerHospitalityImage from "../../../../assets/hospitality.png";
import bannerReturnGiftImage from "../../../../assets/return-gift-banner-home.png";
import bannerFoodDeliveryImage from "../../../../assets/food-delivery-home-banner.png";
import Celebrate1Image from "../../../../assets/Birthday&Celebration.png";
import Celebrate2Image from "../../../../assets/corporate-party.png";
import Celebrate3Image from "../../../../assets/house-party.png";
import Celebrate4Image from "../../../../assets/wedding-event.png";
import Celebrate5Image from "../../../../assets/gathering.png";
import Celebrate6Image from "../../../../assets/kids-event.png";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import "../../../../app/homepage.css";
import cityData from "../../../../utils/cityData";

const ChefCitypage = ({
  city: ssrCity = "",
  locality: ssrLocality = "",
  cityLocalitiesList: ssrCityLocalitiesList = [],
}) => {
  const router = useRouter();

  const [showButton, setShowButton] = useState(false);
  const [city, setCity] = useState(ssrCity || "");
  const [locality, setLocality] = useState(ssrLocality || "");
  const [cityLocalitiesList, setCityLocalitiesList] = useState(
    ssrCityLocalitiesList || []
  );

  const openLink = () => {
    if (typeof window !== "undefined") {
      window.open(
        "https://play.google.com/store/apps/details?id=com.hora",
        "_blank"
      );
    }
  };

  useEffect(() => {
    setShowButton(window.innerWidth > 800);
    function handleResize() {
      setShowButton(window.innerWidth > 800);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Client-side navigation pe bhi update
  useEffect(() => {
    if (router.isReady) {
      const { city: queryCity, locality: queryLocality } = router.query;
      if (queryCity) {
        setCity(queryCity);
        const normalized = queryCity.toLowerCase();
        const localities = cityData[normalized]?.cityLocalitiesList || [];
        setCityLocalitiesList(localities);
      }
      if (queryLocality) {
        setLocality(queryLocality);
      }
    }
  }, [router.isReady, router.query]);

  const formatLocalityName = (name) => {
    return name.replace(/\s+/g, "-").toLowerCase();
  };

  const displayCity = city || ssrCity || "";
  const displayLocality = locality || ssrLocality || "";
  const normalizedCity = displayCity ? displayCity.toLowerCase() : "";
  const hasCityPageParam = !!displayCity;

  const handleClick = (localityName) => {
    const formattedLocalityName = formatLocalityName(localityName);
    router.push(`/${normalizedCity}/${formattedLocalityName}/chef-near-me`);
  };

  if (!hasCityPageParam) {
    return <div>Please select a city first.</div>;
  }

  return (
    <>
      <Head>
        <title>
          {displayCity && displayLocality
            ? `HORA Chef Services in ${displayLocality}, ${displayCity} | Hire Private Chef & Cook Near You – Book Now`
            : displayCity
            ? `HORA Chef Services in ${displayCity} | Hire Private Chef & Cook for Parties – Book Now`
            : `HORA Chef Services | Hire Private Chef & Cook – Book Now`}
        </title>

        <meta
          name="description"
          content={
            displayCity && displayLocality
              ? `🍽️ Book a Professional Chef in ${displayLocality}, ${displayCity}! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks near you for birthdays, house parties, weddings & more.`
              : displayCity
              ? `🍽️ Book a Professional Chef in ${displayCity}! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for parties, weddings & more.`
              : `🍽️ Book a Professional Chef Near You! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for any event.`
          }
        />

        <meta
          name="keywords"
          content={
            displayCity && displayLocality
              ? `chef near me in ${displayLocality} ${displayCity}, hire chef in ${displayLocality}, cook for party ${displayLocality} ${displayCity}, private chef ${displayLocality}, catering ${displayLocality} ${displayCity}`
              : displayCity
              ? `hire chef in ${displayCity}, private chef ${displayCity}, cook near me ${displayCity}, catering services ${displayCity}`
              : `hire chef, private chef, cook near me, catering services`
          }
        />

        <meta
          property="og:title"
          content={
            displayCity && displayLocality
              ? `Hire Chef & Cook in ${displayLocality}, ${displayCity} | HORA Chef Services`
              : `Hire Chef & Cook | HORA Chef Services`
          }
        />
        <meta
          property="og:description"
          content="🍽️ Book professional chefs and cooks for your event. Contact us at 7338584828."
        />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <meta
          property="og:image:alt"
          content="hire chef near me, private chef, cook for party"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        <meta
          property="og:url"
          content={
            displayCity && displayLocality
              ? `https://horaservices.com/${displayCity.toLowerCase()}/${displayLocality.toLowerCase()}/chef-near-me`
              : displayCity
              ? `https://horaservices.com/${displayCity.toLowerCase()}/book-chef-cook-for-party`
              : `https://horaservices.com/book-chef-cook-for-party`
          }
        />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <div style={styles.homebanner} className="homebanner citypage">
          <div
            style={{
              ...styles.bgImg,
              backgroundImage: `url(${bannerSvgImage.src})`,
            }}
            className="bgImg"
          >
            <div style={styles.pageWidth}>
              <div style={styles.textContainer} className="textContainerhome">
                <h1 style={{ fontSize: "40px", fontWeight: "500", margin: "0" }}>
                  {"Simplifying and Enhancing celebrations."}
                </h1>
                <h2
                  style={{
                    fontSize: "72px",
                    fontWeight: "900",
                    margin: "0 0 10px",
                    lineHeight: "77px",
                    margin: "0px 0 10px",
                    padding: "3px 14% 5px 14%",
                    textTransform: "uppercase",
                  }}
                >
                  {"ALL PARTY SERVICES IN YOUR "}
                  {displayCity}
                </h2>
              </div>
            </div>
            <div style={styles.bannerBottomSec} className="bannerBottomSec">
              <div
                style={styles.bannerDecorationImage}
                className="bannerDecorationImage"
              >
                <Link
                  href={`/${displayCity}/balloon-decoration`}
                  style={{ textDecoration: "none" }}
                >
                  <Image
                    src={bannerDecorationImage}
                    alt="Decoration Near me"
                    style={{ height: "auto" }}
                  />
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: "normal",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Decoration
                  </h2>
                </Link>
              </div>
              <div
                style={styles.bannerDecorationImage}
                className="bannerDecorationImage"
              >
                <Link
                  href={`/${displayCity}/book-chef-cook-for-party`}
                  style={{ textDecoration: "none" }}
                >
                  <Image
                    src={bannerChefImage}
                    alt="Chef Near me"
                    style={{ height: "auto" }}
                  />
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "normal",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Hire Chef
                  </h2>
                </Link>
              </div>
              <div
                style={styles.bannerDecorationImage}
                className="bannerDecorationImage"
              >
                <Link href="/" style={{ textDecoration: "none" }}>
                  <Image
                    src={bannerReturnGiftImage}
                    alt="Return Gift Near me"
                    style={{ height: "auto" }}
                  />
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "normal",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Gift & Party Supplies
                  </h2>
                </Link>
              </div>
              <div
                style={styles.bannerDecorationImage}
                className="bannerDecorationImage"
              >
                <Link href="/" style={{ textDecoration: "none" }}>
                  <Image
                    src={bannerFoodDeliveryImage}
                    alt="Food Delivery Near me"
                    style={{ height: "auto" }}
                  />
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "normal",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Food Delivery
                  </h2>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.celebrateWithUs} className="celebrateWithUs">
          <div style={{ padding: "0 6%" }}>
            <h3
              style={{
                fontSize: "70px",
                fontWeight: "bold",
                color: "#E6756B",
                margin: "35px 0 20px",
                textAlign: "center",
              }}
            >
              CELEBRATE WITH US
            </h3>
            <div style={styles.celebrateBottomSec} className="celebrateBottomSec">
              <div style={styles.celebrateBox} className="celebrateBox">
                <Image
                  src={Celebrate1Image}
                  alt="Birthday and Anniversary"
                  style={styles.celebrateDecorationImage}
                  className="celebrateDecorationImage"
                />
                <h3
                  style={{
                    fontSize: "16px",
                    color: "#0f0f0f",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "7px 0 20px 0",
                  }}
                >
                  {"Birthday and Anniversary"}
                </h3>
              </div>
              <div style={styles.celebrateBox} className="celebrateBox">
                <Image
                  src={Celebrate2Image}
                  alt="House Parties"
                  style={styles.celebrateDecorationImage}
                  className="celebrateDecorationImage"
                />
                <h3
                  style={{
                    fontSize: "16px",
                    color: "#0f0f0f",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "7px 0 20px 0",
                  }}
                >
                  {"House Parties"}
                </h3>
              </div>
              <div style={styles.celebrateBox} className="celebrateBox">
                <Image
                  src={Celebrate3Image}
                  alt="Corporate Events"
                  style={styles.celebrateDecorationImage}
                  className="celebrateDecorationImage"
                />
                <h3
                  style={{
                    fontSize: "16px",
                    color: "#0f0f0f",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "7px 0 20px 0",
                  }}
                >
                  {"Corporate Events"}
                </h3>
              </div>
              <div style={styles.celebrateBox} className="celebrateBox">
                <Image
                  src={Celebrate4Image}
                  alt="Wedding Events"
                  style={styles.celebrateDecorationImage}
                  className="celebrateDecorationImage"
                />
                <h3
                  style={{
                    fontSize: "16px",
                    color: "#0f0f0f",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "7px 0 20px 0",
                  }}
                >
                  {"Wedding Events"}
                </h3>
              </div>
              <div style={styles.celebrateBox} className="celebrateBox">
                <Image
                  src={Celebrate5Image}
                  alt="Gatherings"
                  style={styles.celebrateDecorationImage}
                  className="celebrateDecorationImage"
                />
                <h3
                  style={{
                    fontSize: "16px",
                    color: "#0f0f0f",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "7px 0 20px 0",
                  }}
                >
                  {"Gatherings"}
                </h3>
              </div>
              <div style={styles.celebrateBox} className="celebrateBox">
                <Image
                  src={Celebrate6Image}
                  alt="Kids Events"
                  style={styles.celebrateDecorationImage}
                  className="celebrateDecorationImage"
                />
                <h3
                  style={{
                    fontSize: "16px",
                    color: "#0f0f0f",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "7px 0 20px 0",
                  }}
                >
                  {"Kids Events"}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <section id="section6" className="sectionidsec">
          <div style={styles.pageWidth}>
            <div id="faqQ">
              <div>
                <h1
                  style={{
                    fontSize: "70px",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "#E6756B",
                    margin: "35px 0 0px",
                    textAlign: "center",
                  }}
                >
                  Faq
                </h1>
              </div>
              <div>
                <strong>
                  1: How can I hire an online chef for my event in{" "}
                  {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Hiring an online chef in {displayCity.toUpperCase()} is
                  easy!
                </p>
                <p>
                  A: Visit our website or download our app and place the order
                  by selecting your dish, number of people, date, and time of
                  the event to secure their services for your event.
                </p>
              </div>
              <div>
                <strong>
                  2: What makes your catering services the best for small
                  parties in {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Our catering services in {displayCity.toUpperCase()} are
                  tailored for small parties , We offer personalized options to
                  make your event unforgettable.
                </p>
              </div>
              <div>
                <strong>
                  3: Can I book a private chef for a day or night in{" "}
                  {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Absolutely! Our private chefs are available for hire in{" "}
                  {displayCity.toUpperCase()}, ensuring a unique dining
                  experience for any occasion.
                </p>
              </div>
              <div>
                <strong>
                  4: How do I find a trained verified cook near me in{" "}
                  {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Finding a trained verified cook near you is simple. Enter
                  your location on our platform, and choose from a list of
                  dishes, number of people, date and time of event.
                </p>
              </div>
              <div>
                <strong>
                  5: Is Book a cook in {displayCity.toUpperCase()} suitable for
                  last-minute chef bookings?
                </strong>
                <p>
                  A: Yes, our platform allows for convenient and quick bookings,
                  you can book the order 24 hours in advance.
                </p>
              </div>
              <div>
                <strong>
                  6: What sets your chefs for hire in{" "}
                  {displayCity.toUpperCase()} apart from others?
                </strong>
                <p>
                  A: Our chefs in {displayCity.toUpperCase()} are not only
                  skilled but also verified, ensuring a high standard of service
                  and culinary expertise.
                </p>
              </div>
              <div>
                <strong>
                  7: Can I hire a cook at home for a special occasion in{" "}
                  {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Certainly! Explore our selection of cooks available for
                  hire at home in {displayCity.toUpperCase()} to make your event
                  memorable.
                </p>
              </div>
              <div>
                <strong>
                  8: How do I take a chef in {displayCity.toUpperCase()} for a
                  personalized cooking experience?
                </strong>
                <p>
                  A: Taking a chef in {displayCity.toUpperCase()} is simple.
                  Choose a chef, specify your preferences, and enjoy a
                  personalized cooking experience in the comfort of your home.
                </p>
              </div>
              <div>
                <strong>
                  9: Are your party caterers in {displayCity.toUpperCase()}{" "}
                  suitable for both small and large events?
                </strong>
                <p>
                  A: Yes, our party caterers in {displayCity.toUpperCase()}{" "}
                  cater to a variety of events, from intimate gatherings to
                  larger celebrations.
                </p>
              </div>
              <div>
                <strong>
                  10: Can I hire a professional chef for a night in{" "}
                  {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Absolutely! Explore our options to hire a professional chef
                  for a night in {displayCity.toUpperCase()} and create a
                  culinary experience to remember.
                </p>
              </div>
              <div>
                <strong>
                  11: Is it possible to hire someone to cook for me in{" "}
                  {displayCity.toUpperCase()} regularly?
                </strong>
                <p>
                  A: Yes, you can hire a cook near you in{" "}
                  {displayCity.toUpperCase()} for regular cooking services.
                  Choose a cook that fits your preferences and schedule.
                </p>
              </div>
              <div>
                <strong>
                  12: What is the process for hiring a private personal chef in{" "}
                  {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Hiring a private personal chef is easy. Browse through our
                  profiles, select your preferred chef, and book their services
                  for a personalized culinary experience.
                </p>
              </div>
              <div>
                <strong>
                  13: : How can I find the best home caterers in{" "}
                  {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: Finding the best home caterers in{" "}
                  {displayCity.toUpperCase()} is simple with our platform.
                  Explore our options and choose the one that suits your needs.
                </p>
              </div>
              <div>
                <strong>
                  14: Do you have top-rated cooks in {displayCity.toUpperCase()}{" "}
                  available for hire?
                </strong>
                <p>
                  A: Yes, we have a selection of top-rated cooks in{" "}
                  {displayCity.toUpperCase()} available for hire. Explore their
                  profiles and book the one that meets your requirements.
                </p>
              </div>
              <div>
                <strong>
                  15: Can I hire a chef at home in {displayCity.toUpperCase()}{" "}
                  for a cooking demonstration?
                </strong>
                <p>
                  A: Absolutely! Hire a chef at home in{" "}
                  {displayCity.toUpperCase()} for a cooking demonstration and
                  learn culinary skills from a professional.
                </p>
              </div>
              <div>
                <strong>
                  16: What is the difference between a private chef and a
                  personal cook in {displayCity.toUpperCase()}?
                </strong>
                <p>
                  A: A private chef typically offers a more personalized and
                  upscale dining experience, while a personal cook provides
                  regular cooking services. Choose based on your specific needs.
                </p>
              </div>
              <div>
                <strong>
                  17: Can I hire cooks on demand in {displayCity.toUpperCase()}{" "}
                  for last-minute gatherings?
                </strong>
                <p>
                  A: Yes, our platform allows you to hire cooks on demand in{" "}
                  {displayCity.toUpperCase()}, making it convenient for
                  spontaneous events.
                </p>
              </div>
              <div>
                <strong>
                  18: How can I find local chefs for hire in{" "}
                  {displayCity.toUpperCase()} for a regional cuisine?
                </strong>
                <p>
                  A: Finding local chefs for hire in {displayCity.toUpperCase()}{" "}
                  is easy. Specify your cuisine preferences, and our platform
                  will display chefs with expertise in that cuisine.
                </p>
              </div>
              <div>
                <strong>
                  19: Are there cooking maids near me in{" "}
                  {displayCity.toUpperCase()} available for hire?
                </strong>
                <p>
                  A: Yes, you can find cooking maids near you in{" "}
                  {displayCity.toUpperCase()} available for hire. Explore their
                  profiles and choose the one that suits your needs.
                </p>
              </div>
              <div>
                <strong>
                  20: Can I hire a personal chef for a night in{" "}
                  {displayCity.toUpperCase()} for a romantic dinner?
                </strong>
                <p>
                  A: Certainly! Hire a personal chef for a night in{" "}
                  {displayCity.toUpperCase()} and create a romantic dining
                  experience in the comfort of your home
                </p>
              </div>
              <div>
                <strong>
                  21: How do I hire a cook online in {displayCity.toUpperCase()}{" "}
                  for virtual cooking sessions?
                </strong>
                <p>
                  A: Hiring a cook online in {displayCity.toUpperCase()} for
                  virtual cooking sessions is simple. Browse through available
                  cooks, choose one, and arrange for an online cooking session.
                </p>
              </div>
              <div>
                <strong>
                  22: : What makes your home cooking service in{" "}
                  {displayCity.toUpperCase()} unique?
                </strong>
                <p>
                  A: Our home cooking service in {displayCity.toUpperCase()} is
                  unique due to our diverse selection of trained and verified
                  cooks, ensuring a high-quality culinary experience
                </p>
              </div>
              <div>
                <strong>
                  23: Can I book mini caterers in {displayCity.toUpperCase()}{" "}
                  for a small family gathering?
                </strong>
                <p>
                  A: Absolutely! Our mini caterers in{" "}
                  {displayCity.toUpperCase()} are perfect for small family
                  gatherings, providing a customized and delightful culinary
                  experience.
                </p>
              </div>
              <div>
                <strong>
                  24: How do I hire a private cook for home in{" "}
                  {displayCity.toUpperCase()} for regular meals?
                </strong>
                <p>
                  A: Hiring a private cook for home in{" "}
                  {displayCity.toUpperCase()} for regular meals is easy. Choose
                  a cook that fits your preferences and schedule for consistent
                  cooking services.
                </p>
              </div>
              <div>
                <strong>
                  25: Are your private chef services near me in{" "}
                  {displayCity.toUpperCase()} available for special dietary
                  requirements?
                </strong>
                <p>
                  A: Yes, our private chef services near you in{" "}
                  {displayCity.toUpperCase()} are customizable to accommodate
                  special dietary requirements. Discuss your needs with the
                  selected chef to ensure a tailored culinary experience.
                </p>
              </div>
            </div>

            <p
              id="city-area-title"
              style={{
                fontSize: "70px",
                textTransform: "uppercase",
                fontWeight: "bold",
                color: "#E6756B",
                margin: "35px 0 2px",
                textAlign: "center",
              }}
            >
              Serving all Areas in {displayCity}
            </p>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                color: "#E6756B",
                margin: "2px 0 2px",
                textAlign: "center",
              }}
            >
              All localities are here
            </p>

            <div className="localities-box">
              <h1 className="city-heading">
                {displayCity
                  ? displayCity.charAt(0).toUpperCase() + displayCity.slice(1)
                  : "City"}{" "}
                Localities
              </h1>
              <ul className="localities-list">
                {cityLocalitiesList.length > 0 ? (
                  cityLocalitiesList.map((loc, index) => (
                    <li key={index} className="locality-item">
                      <button
                        onClick={() => handleClick(loc.name)}
                        className="locality-button"
                      >
                        {loc.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <div className="no-localities">
                    No localities found for this city.
                  </div>
                )}
              </ul>
            </div>
          </div>
        </section>

        <section id="section7" className="sectionidsec">
          <div style={styles.pageWidth}>
            <p
              style={{
                fontSize: "70px",
                textTransform: "uppercase",
                fontWeight: "bold",
                color: "#E6756B",
                margin: "35px 0 2px",
                textAlign: "center",
              }}
              className="other-cities"
            >
              Other Cities
            </p>
            <div className="tab-inner">
              <ul style={{ listStyle: "none", padding: "20px 20px" }}>
                <li
                  className="city-link"
                  data-city="Delhi"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Delhi</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Gurugram"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Gurugram</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Ghaziabad"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Ghaziabad</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Faridabad"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Faridabad</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Noida"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Noida</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Bengaluru"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Bengaluru</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Hyderabad"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Hyderabad</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Mumbai"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Mumbai</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Indore"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Indore</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Chennai"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Chennai</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Pune"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Pune</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Surat"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Surat</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Bhopal"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Bhopal</Link>
                </li>
                <li
                  className="city-link"
                  data-city="kanpur"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Kanpur</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Lucknow"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Lucknow</Link>
                </li>
                <li
                  className="city-link"
                  data-city="kolkata"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Kolkata</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Goa"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Goa</Link>
                </li>
              </ul>

              <div id="city-content">
                <div className="des-city-area">
                  <h1
                    style={{
                      fontSize: "70px",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: "#E6756B",
                      margin: "35px 0 0px",
                      textAlign: "center",
                    }}
                  >
                    Description
                  </h1>
                  <p id="city-description">
                    Book professional Cooks and Chefs in {displayCity} for House
                    Parties, Birthday Parties, Special Breakfast, Lunch and
                    Dinner at Home. Hire trained and verified personal Chefs and
                    Cooks near you for a private dining experience at home with
                    the best cooks and chef services at home.
                  </p>
                </div>
              </div>
            </div>
            <p
              id="city-seo-content"
              style={{ fontSize: "5px", margin: "20px 0 20px " }}
            >
              Online chef for hire in {displayCity}, Chef in {displayCity}, Best
              caterers for small parties in {displayCity}, Best home-made
              cooking service in {displayCity}, Mini party caterers in{" "}
              {displayCity}, Book a chef in {displayCity}, Book a cook in{" "}
              {displayCity}, Book a private chef in {displayCity}, Book a
              private cook in {displayCity}, Book a trained verified cook near
              you in {displayCity}, Bookacook in {displayCity}, Caterers for
              small parties in {displayCity}, Top caterers in {displayCity},
              Chef for a party in {displayCity}, Catering services in{" "}
              {displayCity}, Chef at home service in {displayCity}, Chef for a
              day in {displayCity}, Chef for a night in {displayCity}, Chef for
              hire in {displayCity}, Chef cooking at my home in {displayCity},
              Chef near me in {displayCity}, Chef on demand in {displayCity},
              Chef required at home in {displayCity}, Chefs for hire in{" "}
              {displayCity}, Chefs for home in {displayCity}, Hire a private
              chef in {displayCity}, Chefs on hire in {displayCity}, Cook chef
              near me in {displayCity}, Cook at home services in {displayCity},
              Cook for a day in {displayCity}, Cook for a night in {displayCity}
              , Cook for one day in {displayCity}, Cook for a party in{" "}
              {displayCity}, Cook service near me in {displayCity}, Cook home
              services in {displayCity}, Cook near me in {displayCity}, Cook on
              demand in {displayCity}, Cook on hire near me in {displayCity},
              Cook required at home in {displayCity}, Cooking as a service in{" "}
              {displayCity}, Cooking maids near me in {displayCity}, Cooking
              services near me in {displayCity}, Cooks for hire in {displayCity}
              , Cooks for home in {displayCity}, Cooks near me in {displayCity},
              Cooks on hire in {displayCity}, Domestic cook near me in{" "}
              {displayCity}, Find a chef in {displayCity}, Find a cook in{" "}
              {displayCity}, Hire a chef in {displayCity}, Hire a chef for a day
              in {displayCity}, Hire personal chef in {displayCity}, Hire a chef
              for home in {displayCity}, Hire a chef near me in {displayCity},
              Take a Chef in {displayCity}, Hire a cook in {displayCity}, Hire a
              cook at home in {displayCity}, Hire a cook for home in{" "}
              {displayCity}, Hire a cook near me in {displayCity}, Hire a
              personal chef for a night in {displayCity}, Hire a personal cook
              in {displayCity}, Hire a professional chef in {displayCity}, Hire
              chef at home in {displayCity}, Hire cook near me in {displayCity},
              Hire cook online in {displayCity}, Hire private chef in{" "}
              {displayCity}, Hire someone to cook for you in {displayCity},
              Hiring a personal chef in {displayCity}, Home caterers in{" "}
              {displayCity}, Home chef near me in {displayCity}, Home cook near
              me in {displayCity}, Home cooking service in {displayCity}, Home
              cooking service near me in {displayCity}, Home party catering in{" "}
              {displayCity}, House chef near me in {displayCity}, House cook
              near me in {displayCity}, In-home cooking service in {displayCity}
              , In-house cooking service in {displayCity}, Local chefs for hire
              in {displayCity}, Looking for chef in {displayCity}, Looking for
              cook in {displayCity}, Mini caterers in {displayCity}, Need a chef
              in {displayCity}, Need a cook in {displayCity}, Online cook
              service in {displayCity}, Party caterers in {displayCity},
              Personal chef in {displayCity}, Personal chefs for hire near me in{" "}
              {displayCity}, Personal Cook in {displayCity}, Personal cook near
              me in {displayCity}, Private chef in {displayCity}, Private chef
              hire in {displayCity}, Private chef near me in {displayCity},
              Private chef services near me in {displayCity}, Private cook in{" "}
              {displayCity}, Private cook for hire in {displayCity}, Private
              personal chef in {displayCity}, Professional chef for hire in{" "}
              {displayCity}, Top rated chefs in {displayCity}, Top rated cooks
              in {displayCity}, Want to hire a cook in {displayCity}
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

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
  textContainer: {
    textAlign: "center",
    color: "white",
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
};

// ====================== SSR ======================
export async function getServerSideProps(context) {
  const city =
    context.params?.city ||
    context.query?.city ||
    "";
  const locality =
    context.params?.locality ||
    context.query?.locality ||
    "";

  const normalizedCity = city ? city.toLowerCase() : "";
  const cityLocalitiesList =
    (normalizedCity && cityData[normalizedCity]?.cityLocalitiesList) || [];

  return {
    props: {
      city,
      locality,
      cityLocalitiesList,
    },
  };
}

export default ChefCitypage;