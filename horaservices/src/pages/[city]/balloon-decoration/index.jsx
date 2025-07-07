import React, { useState, useEffect } from "react";
import Head from 'next/head';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "react-router-dom";
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM } from '../../../utils/apiconstants';
import DecorationLandingSlider from  '../../../components/DecorationLandingSlider';
import getFAQs from "@/components/JsonData/faqData";
import getCityParagraphs from "@/components/JsonData/cityParagraphs";
import { getDecorationOrganizationSchema, getProductFAQSchema } from '../../../utils/schema';
import { setState } from '../../../actions/action';
import { useRouter } from "next/router";
import Image from "next/image";
import logo from '../../../assets/new_logo_light.png';
import { useDispatch } from "react-redux";
import '../../../css/decoration.css'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from "next/link";
import cityData from '../../../utils/cityData';
import '../../../app/homepage.css'
import Decoration from "@/pages/balloon-decoration";
const DecorationCity = () => {


const dispatch = useDispatch();
const router = useRouter();
let { city } = router.query;
if (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1);
}
const schemaOrg = getDecorationOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);
const faqSchema = getProductFAQSchema(city);
const faqSchemaScriptTag = JSON.stringify(faqSchema);
const questions = getFAQs(city);
const paragraphs = getCityParagraphs(city)
const hasCityPageParam = city ? true : false;
const [catalogueData, setCatalogueData] = useState([]);
const [activeIndex, setActiveIndex] = useState(null);
const [showMore, setShowMore] = useState(false);




     const openWahtsappRedirection = (catTitle) =>{
      window.open('https://wa.me/917338584828?text=Hello%20I%20have%20seen%20decoration%20design%20on%20your%20website.%20Please%20help%20me%20for%20more%20customization%20and%20more%20details.', '_blank');
     }

     const formatLocalityName = (name) => {
      return name.replace(/\s+/g, '-').toLowerCase();
    };
  
     const normalizedCity = city ? city.toLowerCase() : '';
  
    
  
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
       pathname: `/${normalizedCity}/${formattedLocalityName}/balloon-decoration`, 
     });
   };
 
  

         const toggleFAQ = (index) => {
            setActiveIndex(activeIndex === index ? null : index);
          };

     
    
       


    function capitalizeCity(city) {
      return city.charAt(0).toUpperCase() + city.slice(1);
  }



    

    return (
      <div className="decoration-city-page-sec">
      <Head>
            <title>
    {city
      ? `HORA Decorations in ${city} | Balloon & Flower Decorations for Birthdays, Weddings, Baby Showers & More – Starting at ₹1199`
      : `HORA Decorations : Professional Balloons & Flowers Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199`}
  </title> 
   <meta
    name="description"
    content={
      city
        ? `📸 Capture Every Moment in ${city}! ✨ Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉 in ${city}, our professional photographers are here to make your moments look as magical as they felt.`
        : `📸 Capture Every Moment, Forever! ✨ Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt.`
    }
  />    
     <meta name="keywords" content="birthday decoration, anniversary decoration, party themes decorations, candlelight dinners, welcome baby decoration, baby shower decoration, first night decorations, haldi decoration, mehndi decoration, balloon room decoration, birthday decorators near me" />
          <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
          <meta property="og:description" content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" />
          <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
          <meta property="og:image:alt" content="birthday decoration, anniversary decoration, party themes decorations, candlelight dinners, welcome baby decoration, baby shower decoration, first night decorations, haldi decoration, mehndi decoration, balloon room decoration, birthday decorators near me" />
          <script type="application/ld+json">{scriptTag}</script>  
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Hora Services" />
          <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
          <meta property="og:url" content="https://horaservices.com/balloon-decoration" />
          <meta property="og:type" content="website" />
      </Head>
     

<Decoration/>





    <div className="localities-box decration">
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


{/* faq */}
<div className="faq-container citypage">
    <div className="page-width">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      {questions.map((item, index) => (
        <div key={index} className="faq-item">
          <h3 className="faq-question" onClick={() => toggleFAQ(index)}>
            {item.question}
            <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
          </h3>
          {activeIndex === index && <p className="faq-answer">{item.answer}</p>}
        </div>
      ))}
</div>
</div>

<div className="description-city">
    <div className="page-width">
<h1 style={{
      fontSize: "24px",
      textTransform: "capitalize",
      fontWeight: "bold",
      color: "rgb(157, 74, 147)",
      margin: "11px  0px 20px",
      textAlign: "left",
      letterSpacing: "1.5px",
      borderBottom:"1px solid #cfcbcb",
      padding:"0 0 6px 0",
    }}>
      Description
    </h1>

      <div id="city-description" style={{ fontSize: "14px"}}>
        {paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>
      </div>
</div>

<section id="section7" class="sectionidsec">
    <div className="page-width">
                <div>
                    <p 
                    style={{
                      fontSize: "24px",
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      color: "rgb(157, 74, 147)",
                      margin: "32px 0 0px",
                      borderBottom:"1px solid #cfcbcb",
                    }}
                    className="other-cities">
                        Explore Other Decoration Category In {city}
                        </p>
                    <div class="tab-inner">
                        <ul className="citylisting">
                            <li className="city-link" data-city={city} >
                                <Link href="/balloon-decoration">Birthday Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Gurugram">
                                <Link href="/balloon-decoration">Baby Shower Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Ghaziabad">
                                <Link href="/balloon-decoration">Baby Welcome Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Faridabad">
                                <Link href="/balloon-decoration">First Night Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Noida">
                                <Link href="balloon-decoration">Kids Birthday Decoration in  {city}</Link>
                            </li>
                            <li className="city-link" data-city="Bengaluru">
                                <Link href="/balloon-decoration">Anniversary Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Hyderabad">
                                <Link href="/balloon-decoration">Candle Light Dinner in  {city}</Link>
                            </li>
                            <li className="city-link" data-city="Mumbai">
                                <Link href="/balloon-decoration">Car Decoration in  {city}</Link>
                            </li>
                            <li className="city-link" data-city="Indore">
                                <Link href="/balloon-decoration">Naming Ceremony Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Chennai" >
                                <Link href="/balloon-decoration">Terrace Decoration in{city}</Link>
                            </li>
                            <li className="city-link" data-city="Pune" >
                                <Link href="/balloon-decoration">Proposal Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Surat">
                                <Link href="/balloon-decoration">Bride-to-be Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Bhopal" >
                                <Link href="/balloon-decoration">Cabana Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="kanpur">
                                <Link href="/balloon-decoration">Haldi Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="Lucknow">
                                <Link href="/balloon-decoration">Balloon Decoration in {city}</Link>
                            </li>
                            <li className="city-link" data-city="kolkata">
                                <Link href="/balloon-decoration" >Office Decoration in  {city}</Link>
                            </li>
                            <li className="city-link" data-city="Goa">

                                <Link href="/balloon-decoration">Engagement Ring Platter in {city}</Link>
                            </li>
                        </ul>

                    </div>
                    <p id="city-seo-content" style={{ fontSize: "5px", margin: "20px 0 20px " }}>

                        Online balloon decoration in {city}, Online decoration in {city}, Online balloon decorators in {city}, Online decorator in {city}; top balloon decorator in {city}; top balloon decorator in {city}; Excellent birthday party balloon decoration in {city}; event organising companies in {city}; beautiful theme balloon balloon decoration in {city}; beautiful theme flower balloon decoration in {city}; Hire balloon decoration at home in {city}; Best balloon decoration in {city}, Best decoration in {city}, Best balloon decorator in {city}; Best decorator in {city}; Balloon decoration at home in {city}; Balloon decorator at home in {city}; Best Balloon decorator at home in {city}; Best Balloon decoration at home in {city}; Professional balloon decoration services in {city}; Room Balloon Decoration; Hall Decoration; Large Decorations, Premium Decorations; Room decoration designs; Home Decoration; Stage decoration; Venue decoration; Best Room Balloon Decoration; Best Hall Decoration; Best Large Decorations, Best Premium Decorations; Best Room decoration designs; Best Home Decoration; Best Stage decoration; Best Venue decoration;
                        Same-day bookings for Birthday Decoration at Home in {city}; Same-day bookings for Anniversary Decoration at Home in {city}; Same-day bookings for Birthday Decoration at in {city}. Same-day bookings for Baby shower Decoration at Home in {city}; Same-day bookings for Car Decoration at Home in {city}; Same-day bookings for first night Decoration at Home in {city}; Same-day bookings for welcome baby Decoration at Home in {city}
                        Jungle Theme Decoration design, Jungle Theme Decorator near me; Jungle theme decoration under 1500; Jungle theme decoration under 5000; Jungle theme decoration under 10000; Jungle Theme balloon Decoration design; Jungle Theme balloon Decorator near me; Princess or Barbie Theme Decoration design, Princess or Barbie Theme Decorator near me; Princess or Barbie theme decoration under 1500; Princess or Barbie theme decoration under 5000; Jungle theme decoration under 10000; Princess or Barbie Theme balloon Decoration design; Princess or Barbie Theme balloon Decorator near me; Unicorn Theme Decoration design, Unicorn Theme Decorator near me; Unicorn theme decoration under 1500; Unicorn theme decoration under 5000; Unicorn theme decoration under 10000; Unicorn Theme balloon Decoration design; Unicorn Theme balloon Decorator near me; Space Theme Decoration design, Space Theme Decorator near me; Space theme decoration under 1500; Space theme decoration under 5000; Space theme decoration under 10000; Space Theme balloon Decoration design; Space Theme balloon Decorator near me;

                        First birthday decoration; Second year birthday decoration, 5th year birthday decoration, 10th Birthday decoration; Anniversary Balloon Decoration in Bangalore; Kids birthday decoration; Birthday decoration; Decoration starting 1200 Rs; Budget-friendly suggestions for 1st Birthday Party Decorations; Budget-friendly suggestions for 2nd Birthday Party Decorations; Budget-friendly suggestions for 5th Birthday Party Decorations; Budget-friendly suggestions for 10th Birthday Party Decorations; Best balloon decorator for small parties in {city}, Best balloon decoration for small parties in {city}; Mini Decoration in {city},
                        Book a decorator in {city}, Book a decoration in {city}, Book a balloon decorator in {city}, Book a flower decoration in {city}, Book a balloon decoration in {city}, Book a flower decorator in {city}; Book a trained verified decorator near you in {city}, Bookadecortor in {city},
                        Decoration for small parties in {city}, Top Decorator in {city}, Decoration services in {city}, Decorator at home service in {city}, Decorator for a night in {city}, Decoration for a night in {city}, Decorator for hire in {city}, Decoration at my home in {city}, Decorator near me in {city}, Balloon Decorator near me in {city}, Flower Decorator near me in {city}, Decoration service near me in {city}, Balloon Decoration service near me in {city}, Flower Decoration service near me in {city}, Birthday Decoration service near me in {city}, Anniversary decoration service near me in {city}, baby shower Decoration service near me in {city}, Baby welome Decoration service near me in {city}; Simple birthday decoration at home; Simple birthday decoration in {city};

                        Balloon Decoration for small parties in {city}, Top balloon Decorator in {city}, balloon Decoration services in {city}, balloon Decorator at home service in {city}, balloon Decorator for a night in {city}, Decorator for hire in {city}, balloon Decoration at my home in {city}, balloon Decorator near me in {city}, Balloon Decoration near me in {city}, Flower Decorator near me in {city}, Decoration service near me in {city}, Balloon Decoration service near me in {city}, Flower Decoration service near me in {city}, Birthday Decoration service near me in {city}, Anniversary decoration service near me in {city}, baby shower Decoration service near me in {city}, Baby welome Decoration service near me in {city}; balloon decoration for birthday at home in {city};
                        balloon decoration ideas; Astronaut Space Theme balloon decoration; Avenger Space Theme balloon decoration; Boss Baby Theme balloon decoration; Baby Shark Theme balloon decoration; Barbie Theme balloon decoration; Cocomelon Theme balloon decoration; Car Theme balloon decoration; Circus Theme balloon decoration; Dinosaur Theme balloon decoration; Jungle Theme balloon decoration; Kitty Theme balloon decoration; Lion Theme balloon decoration; Mickey Mouse Theme balloon decoration; Minecraft Theme balloon decoration; Mermail Theme balloon decoration; Pokemon Theme balloon decoration; Princess Theme balloon decoration; Panda Theme balloon decoration; Traffic Theme balloon decoration; Super Dog Theme balloon decoration; Unicorn Theme balloon decoration                    </p>
                </div>
                </div>


            </section>

</div>




    );    
};


export default DecorationCity;
