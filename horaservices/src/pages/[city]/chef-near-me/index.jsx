import React, { useState, useEffect } from "react";
import CreateOrder from "../book-chef-cook-for-party";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  BASE_URL,
  GET_CUISINE_ENDPOINT,
  API_SUCCESS_CODE,
  GET_MEAL_DISH_ENDPOINT,
} from "../../../utils/apiconstants";
import axiosApi from "@/utils/axiosApi";
import { getCityNameFromSlug, isValidCitySlug } from "@/utils/validCities";
import { ChefFAQS, ChefLocalitiesSection } from "@/components/ChefCookForParty/ChefLocalitiesSection";

const ChefCitypage = ({
  city: ssrCity = "",
  initialCuisines = [],
  initialMealList = [],
}) => {
  const [showButton, setShowButton] = useState(false);
  const [city, setCity] = useState(ssrCity || "");
  const openLink = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.hora",
      "_blank",
    );
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

  const router = useRouter();

  // Client-side navigation pe bhi city update ho jaye
  useEffect(() => {
    if (router.isReady) {
      const { city: queryCity } = router.query;
      if (queryCity) {
        setCity(queryCity);
      }
    }
  }, [router.isReady, router.query]);

  // SSR pe city props se aayega, isliye loading gate hata diya
  const displayCity = city || ssrCity || "";

  return (
    <>
      <Head>
        <title>
          {displayCity
            ? `HORA Chef Services in ${displayCity} | Hire Private Chef & Cook for Parties, Events & Home – Book Now`
            : `HORA Chef Services | Hire Private Chef & Cook for Parties, Events & Home – Book Now`}
        </title>

        <meta
          name="description"
          content={
            displayCity
              ? `🍽️ Book a Professional Chef in ${displayCity}! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for birthdays, house parties, weddings, corporate events & more. Starting at affordable prices.`
              : `🍽️ Book a Professional Chef Near You! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for birthdays, house parties, weddings, corporate events & more.`
          }
        />

        <meta
          name="keywords"
          content={
            displayCity
              ? `hire chef in ${displayCity}, book a cook in ${displayCity}, private chef ${displayCity}, personal chef ${displayCity}, chef for party ${displayCity}, catering services ${displayCity}, home chef ${displayCity}, cook near me ${displayCity}`
              : `hire chef, book a cook, private chef, personal chef, chef for party, catering services, home chef, cook near me`
          }
        />

        <meta
          property="og:title"
          content={
            displayCity
              ? `Hire Professional Chef & Cook in ${displayCity} | HORA Chef Services`
              : `Hire Professional Chef & Cook | HORA Chef Services`
          }
        />
        <meta
          property="og:description"
          content="🍽️ Explore a wide range of professional chef and cook services for every event and party. Book your ideal chef directly through our website for a seamless experience. Need help? Contact us at 7338584828."
        />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <meta
          property="og:image:alt"
          content="hire chef, private chef, cook for party, catering services, home chef"
        />
        <link
          rel="canonical"
          href={
            displayCity
              ? `https://horaservices.com/${displayCity.toLowerCase()}/book-chef-cook-for-party`
              : `https://horaservices.com/book-chef-cook-for-party`
          }
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
            displayCity
              ? `https://horaservices.com/${displayCity.toLowerCase()}/book-chef-cook-for-party`
              : `https://horaservices.com/book-chef-cook-for-party`
          }
        />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        {/* ★★★ CreateOrder ko SSR data props me pass kiya */}
        <CreateOrder
          initialCuisines={initialCuisines}
          initialMealList={initialMealList}
        />

        <section id="section6" className="sectionidsec">
          <div style={styles.pageWidth}>
          <ChefFAQS city={displayCity} />

          <ChefLocalitiesSection city={displayCity} />
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
                  data-city="Bangalore"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Bangalore</Link>
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
  const citySlug = context.params?.city?.toLowerCase() || context.query?.city || "";

  if (!isValidCitySlug(citySlug)) {
    return {
      notFound: true,
    };
  }

  let initialCuisines = [];
  let initialMealList = [];

  try {
    // 1. Cuisines fetch
    const cuisineRes = await axiosApi.post(
      BASE_URL + GET_CUISINE_ENDPOINT,
      { type: "cuisine" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (cuisineRes.status === API_SUCCESS_CODE) {
      initialCuisines = cuisineRes.data.data.configuration.map(
        ({ _id, name }) => [_id, name],
      );
    }

    // 2. Initial meals (first cuisine + default veg)
    if (initialCuisines.length > 0) {
      const firstCuisineId = initialCuisines[0][0];

      const mealRes = await axiosApi.post(
        BASE_URL + GET_MEAL_DISH_ENDPOINT,
        {
          cuisineId: [firstCuisineId],
          is_dish: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (mealRes.status === API_SUCCESS_CODE) {
        initialMealList = mealRes.data.data;
      }
    }
  } catch (error) {
    console.log("SSR Error Fetching Data:", error.message);
  }

  return {
    props: {
      city: getCityNameFromSlug(citySlug),
      initialCuisines,
      initialMealList,
    },
  };
}

export default ChefCitypage;
