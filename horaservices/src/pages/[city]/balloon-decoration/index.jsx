import React, { useState, useEffect } from "react";
import Head from 'next/head';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM } from '../../../utils/apiconstants';
import DecorationLandingSlider from  '../../../components/DecorationLandingSlider';
import getFAQs from "@/components/JsonData/faqData";
import getCityParagraphs from "@/components/JsonData/cityParagraphs";
import { getDecorationOrganizationSchema, getProductFAQSchema } from '../../../utils/schema';
import { setState } from '../../../actions/action';
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch } from "react-redux";
import '../../../css/decoration.css'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from "next/link";

const Decoration = () => {
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
const [decCat, setDecCat] = useState([
  { id: '2', image: "https://horaservices.com/api/uploads/Birthday_dec_cat.webp", name: 'Birthday', subCategory: "Birthday", catValue: "birthday-decoration", imgAlt: "A Gorgeous Candy Birthday Decoration Surprise!" },
  { id: '3', image: "https://horaservices.com/api/uploads/first_night_cat_dec.webp", name: 'First Night', subCategory: "FirstNight", catValue: "first-night-decoration", imgAlt: "Add extra happiness quotient to your wedding night with our exclusive décor package" },
  { id: '4', image: "https://horaservices.com/api/uploads/aniversary_Cat_Dec.webp", name: 'Anniversary', subCategory: "Anniversary", catValue: "anniversary-decoration", imgAlt: "Immerse yourself in a world of romance with our mesmerizing anniversary decorations." },
  { id: '5', image: "https://horaservices.com/api/uploads/kids_birthday_decoration.webp", name: 'Kids Birthday', subCategory: "KidsBirthday", catValue: "kids-birthday-decoration", imgAlt: "Flutter into a world of whimsy with our exclusive Whimsical Flutter-themed Welcome Baby Decorations." },
  { id: '6', image: "https://horaservices.com/api/uploads/baby-shower-dec-cat.webp", name: 'Baby Shower', subCategory: "BabyShower", catValue: "baby-shower-decoration", imgAlt: "Celebrate the transformation into motherhood with Our Gilded Baby Shower Decorations." },
  { id: '7', image: "https://horaservices.com/api/uploads/welcome_baby_dec.webp", name: 'Welcome Baby', subCategory: "WelcomeBaby", catValue: "welcome-baby-decoration", imgAlt: "A Pastel Theme Oh Baby Decor for your Baby Shower Celebrations!" },
  { id: '8', image: "https://horaservices.com/api/uploads/preminumdecor.webp	", name: 'premium Decoration', subCategory: "PremiumDecoration", catValue: "premium-decoration", imgAlt: "Birthday party decoration ideas for adults" },
  { id: '9', image: "https://horaservices.com/api/uploads/Balloon-B-new.webp", name: 'Ballon Bouquets', subCategory: "BallonBouquets", catValue: "balloon-bouquets-decoration", imgAlt: "Balloon Bouquet" },
  {id: '10', Image: "", name: "Haldi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Haldi Event"},  
  {id: '11', Image: "", name: "Mehendi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Mehendi Event"},
  {id: '11', Image: "", name: "Bachelorette Decoration", subCategory: "bachelorette", catValue: "bachelorette-decoration", imgAlt: "Bachelorette"},
  {id: '11', Image: "", name: "proposal decorations", subCategory: "Proposal-Decoration", catValue: "Proposal-Decorations", imgAlt: "proposal decorations"},
     ]);

         const toggleFAQ = (index) => {
            setActiveIndex(activeIndex === index ? null : index);
          };

         const openCatItems = (item) => {
            dispatch(setState(item.subCategory, item.imgAlt));
            if (hasCityPageParam) {
                router.push(`/${city}/balloon-decoration/${item.catValue}`);
            }
            else {
                router.push(`/balloon-decoration/${item.catValue}`);
            }
        };
    
        const handleViewMore = (category) => {
            const categoryItem = decCat.find(cat => cat.subCategory === category);
            console.log('Category Item:', categoryItem); 
            if (categoryItem) {
                openCatItems(categoryItem);
            } else {
                console.log('No matching category item found.');
            }
        };
    
        const birthdayData = [ 
            {
              Image: 'https://horaservices.com/api/uploads/attachment-1705579946309.png',
              title: 'Simple Room Decoration',
              price: '₹1199',
              rating: 4.7,
              link:"/balloon-decoration/birthday-decoration",
            },
            {
            Image: 'https://horaservices.com/api/uploads/attachment-1711601912449.png',
            title: 'Elegant Vibes Happy Birthday',
            price: '₹3500',
            rating: 4.6,
            link:"balloon-decoration/birthday-decoration",
            },
            {
              Image: 'https://horaservices.com/api/uploads/attachment-1706464222384.png',
              title: 'Golden & Silver Ring Decoration',
              price: '₹3000',
              rating: 4.1,
              link:"/balloon-decoration/birthday-decoration",
            },
            {
              Image: 'https://horaservices.com/api/uploads/attachment-1706463835447.png',
              title: 'Multi Balloon Round Ring',
              price: '₹4670',
              rating: 4.4,
              link:"/balloon-decoration/birthday-decoration",
            },
          ];
          
          
          const firstNightData = [
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1705582807178.png',
                title: 'Romantic Heart Balloon',
                price: '₹1429',
                rating: 4.5,
                link:"/balloon-decoration/first-night-decoration/product/Romantic-Heart-Balloon-Decoration",
              },
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1706470026330.png',
                title: 'Wedding Night Room Decoration',
                price: '₹1900',
                rating: 4.5,
                link:"/balloon-decoration/first-night-decoration/product/Wedding-Night-Room-Decoration",
              },
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1706470815566.png',
                title: 'Wedding Night Decoration',
                price: '₹2250',
                rating: 4.5,
                link:"/balloon-decoration/first-night-decoration/product/Wedding-Night-Decoration",
              },
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1711614540709.png',
                title: 'Lightning With Heart Room Decor',
                price: '₹1450',
                rating: 4.3,
                link:"/balloon-decoration/first-night-decoration/product/Lightning-With-Heart-Room-Decor",
              },
            ];
          
          
            const haldiAndMehndiData = [
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1722688345222.png',
                title: 'Mehendi Decoration Green Look',
                price: '₹16200',
                rating: 4.6,
                link:"/balloon-decoration/haldi-mehendi-decoration",
              },
              {
                  Image: 'https://horaservices.com/api/uploads/attachment-1722692831708.png',
                title: 'Haldi With Green Backdrop',
                price: '₹9680',
                rating: 4.5,
                link:"/balloon-decoration/haldi-mehendi-decoration",
              },
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1722935098782.png',
                title: 'Mehendi Decoration Look',
                price: '₹17200',
                rating: 4.6,
                link:"/balloon-decoration/haldi-mehendi-decoration",
              },
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1722969484208.png',
                title: 'Mehendi With Orange Theme',
                price: '₹7000',
                rating: 4.6,
                link:"/balloon-decoration/haldi-mehendi-decoration",
              },
            ];
          
          
            const AnniversaryData = [
              {
                Image: 'https://horaservices.com/api/uploads/attachment-1705947179768.png',
                title: 'Roseate Radiance Anniversary Decor',
                price: '₹1999',
                rating: 4.6,
                link:"/balloon-decoration/anniversary-decoration",
              },
             {
                Image: 'https://horaservices.com/api/uploads/attachment-1706442984306.png',
                title: 'Love You Room Decor',
                price: '₹1250',
                rating: 4.2,
                link:"/balloon-decoration/anniversary-decoration",
              },
             {
                Image: 'https://horaservices.com/api/uploads/attachment-1706443182006.png',
                title: 'Rose Gold Anniversary Decor',
                price: '₹1599',
                rating: 4.5,
                link:"/balloon-decoration/anniversary-decoration",
              },
             {
                Image: 'https://horaservices.com/api/uploads/attachment-1706459807177.png',
                title: 'Canopy Red Heart Decor',
                price: '₹4286',
                rating: 4.5,
                link:"/balloon-decoration/anniversary-decoration",
              },
            ];
    
            const KidsBirthdayData = [
                {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705948416594.png',
                  title: 'Minnie Mouse Theme Decor',
                  price: '₹1549',
                  rating: 4.6,
                  link:"/balloon-decoration/kids-birthday-decoration/product/Minnie-Mouse-Theme-Decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705948813744.png',
                  title: 'Unicorn Backdrop Decor',
                  price: '₹4399',
                  rating: 4.4,
                  link:"/balloon-decoration/kids-birthday-decoration/product/Unicorn-Backdrop-Decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1706520101383.png',
                  title: 'Multi color Birthday Balloon',
                  price: '₹1299',
                  rating: 4.3,
                  link:"/balloon-decoration/kids-birthday-decoration/product/Multi-color-Birthday-Balloon-Decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1706810405540.png',
                  title: 'Cute and Simple Birthday Decor',
                  price: '₹2299',
                  rating: 4.7,
                  link:"/balloon-decoration/kids-birthday-decoration/product/Cute-and-Simple-Birthday-Decoration",
                },
              ];
            
            
              const BabyShowerData= [
                {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705598818463.png',
                  title: 'Cloudy Theme Baby Shower',
                  price: '₹1899',
                  rating: 4.2,
                  link:"/balloon-decoration/baby-shower-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705598937315.png',
                  title: 'Golden, Pink and Blue Baby Shower',
                  price: '₹2299',
                  rating: 4.5,
                  link:"/balloon-decoration/baby-shower-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705599152481.png',
                  title: 'Baby Pink Baby Shower',
                  price: '₹2700',
                  rating: 4.2,
                  link:"/balloon-decoration/baby-shower-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1711520474508.png',
                  title: 'OH BABY Light Decoration',
                  price: '₹3399',
                  rating: 4.8,
                  link:"/balloon-decoration/baby-shower-decoration",
                },
              ];
            
              const WelcomebabyData= [
                {
                  Image: 'https://horaservices.com/api/uploads/attachment-1706471308375.png',
                  title: 'Pink Theme Welcome Baby',
                  price: '₹2070',
                  rating: 4.8,
                  link:"/balloon-decoration/welcome-baby-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1706471595779.png',
                  title: 'Blue Theme Welcome Baby Boy',
                  price: '₹1899',
                  rating: 4.5,
                  link:"/balloon-decoration/welcome-baby-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1711458529679.png',
                  title: 'Oh Baby Classy Decoration',
                  price: '₹2999',
                  rating: 4.7,
                  link:"/balloon-decoration/welcome-baby-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1711555526222.png',
                  title: 'Welcome Baby Decoration',
                  price: '₹1899',
                  rating: 4.2,
                  link:"/balloon-decoration/welcome-baby-decoration",
                },
              ];
            
              const PremiumData= [
                {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705586477880.png',
                  title: 'Open Area Birthday Decoration',
                  price: '₹6999',
                  rating: 4.4,
                  link:"/balloon-decoration/premium-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1706528142518.png',
                  title: 'Canopy Birthday Decoration',
                  price: '₹4999',
                  rating: 4.6,
                  link:"/balloon-decoration/premium-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1706534258221.png',
                  title: 'Multi-Colored Baby Shower',
                  price: '₹6120',
                  rating: 4.7,
                  link:"/balloon-decoration/premium-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1711540983547.png',
                  title: 'Car Theme With Mickey Mouse',
                  price: '₹6235',
                  rating: 4.6,
                  link:"/balloon-decoration/premium-decoration",
                },
              ];
              
              const BallonBData= [
                {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705949316251.png',
                  title: 'I Love You Balloon Bouquet',
                  price: '₹1800',
                  rating: 4.3,
                  link:"/balloon-decoration/balloon-bouquets-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1705949583322.png',
                  title: 'LOVE Balloon Bouquet',
                  price: '₹1350',
                  rating: 4.6,
                  link:"/balloon-decoration/balloon-bouquets-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1711542379923.png',
                  title: 'Barbie Balloon Bouquet',
                  price: '₹1450',
                  rating: 4.1,
                  link:"/balloon-decoration/balloon-bouquets-decoration",
                },
               {
                  Image: 'https://horaservices.com/api/uploads/attachment-1712305355842.png',
                  title: 'Baby Shark Bouquet',
                  price: '₹1420',
                  rating: 4.5,
                  link:"/balloon-decoration/balloon-bouquets-decoration",
                },
              ];
            

    const getCatData = async (subCategory) => {
        try {
            const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + subCategory);
            const categoryId = response.data.data._id;
            const result = await axios.get(BASE_URL + GET_DECORATION_CAT_ITEM + categoryId);
            setCatalogueData(result.data.data);
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    useEffect(() => {
        decCat.forEach((item) => {
            getCatData(item.subCategory); // Fetch catalogue data for each subcategory
        });
    }, []);

    function capitalizeCity(city) {
      return city.charAt(0).toUpperCase() + city.slice(1);
  }


    return (
        <div className="decoration-city-page-sec">
        <Head>
        <title>HORA Decorations in {city}: Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199</title>
        <meta name="description" content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
        <meta property="og:description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <script type="application/ld+json">{scriptTag}</script>
        <script type="application/ld+json">{faqSchemaScriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <meta property="og:url" content="https://horaservices.com/balloon-decoration" />
        <meta property="og:type" content="website" />
      </Head>
<div  className="decContainerSec decPage">
    {decCat
    .filter(item => item.image) // Filter out items without images
    .map((item, index) => (
    <div key={index} className="imageContainer">
    <a href={item.link}>
    <Image
    src={item.image}
    className="decCatimage"
    alt={item.imgAlt}
    onClick={() => openCatItems(item)}
    width={300}
    height={300}
    />
    </a>

    </div>
    ))}
</div>
<div className="page-width decorationlanding-slider">
<div className="slider-container">
  <div className="slider-header">
    <h2>Kids Birthday Decoration</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("KidsBirthday")}
    >
    View More
    </button>
    </div>
  <DecorationLandingSlider data={KidsBirthdayData} category="KidsBirthday" handleViewMore={handleViewMore} />
</div>
    
<div className="slider-container">
  <div className="slider-header">
    <h2>First Night Decoration</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("FirstNight")}
    >
    View More
    </button>
    </div>
  <div>
  <div className="slider-container slider-decoration-inner decoration-item-grid">
    {firstNightData.map((item, index) => (
        <a key={index} className="slider-item" href={item.link}> 
        <Image 
        src={item.Image} 
        alt={item.title} 
        className="slider-image"
        width={200}
        height={250}
        />

        <div className="slider-item-details">
        <h3>{item.title}</h3>
        <div style={{ justifyContent:"space-between" , alignItems:"center" , display:"flex" , flexDirection:"row"}}>
        <p style={{ color: "#9252AA", fontWeight: 'bold', fontSize: '17px' , margin:"0" }}>{item.price}</p>
        <p style={{ fontSize: '17px', color: 'rgb(146, 82, 170)' }}>  {/* Adjust the font size as needed */}
        {item.rating}
        <FontAwesomeIcon 
        style={{ 
        marginBottom: '2px',
        marginLeft: '8px',  /* Adjust the margin as needed */
        height: "14px", 
        color: "#ffc107" 
        }} 
        icon={faStar} 
        />
        </p>
        </div>

        </div>


        </a>
    ))}
</div>
  </div>
</div>
<div className="slider-container ">
    <div className="slider-header">
    <h2>Birthday Decoration</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("Birthday")}
    >
    View More
    </button>
    </div>
    <DecorationLandingSlider data={birthdayData} category="Birthday" handleViewMore={handleViewMore} />
    </div>
<div className="slider-container">
  <div className="slider-header">
    <h2>Haldi & Mehndi Decoration</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("Haldi-Mehandi")}
    >
    View More
    </button>
    </div>
    <div>
    <div className="slider-container slider-decoration-inner decoration-item-grid">
    {haldiAndMehndiData.map((item, index) => (
        <a key={index} className="slider-item" href={item.link}>
        <Image 
        src={item.Image} 
        alt={item.title} 
        className="slider-image"
        width={200}
        height={250}
        />

        <div className="slider-item-details">
        <h3>{item.title}</h3>
        <div style={{ justifyContent:"space-between" , alignItems:"center" , display:"flex" , flexDirection:"row"}}>
        <p style={{ color: "#9252AA", fontSize: '17px' , fontWeight:"bold", margin:"0" }}>{item.price}</p>
        <p style={{ fontSize: '17px', color: 'rgb(146, 82, 170)' }}>  {/* Adjust the font size as needed */}
        {item.rating}
        <FontAwesomeIcon 
        style={{ 
        marginBottom: '2px',
        marginLeft: '8px',  /* Adjust the margin as needed */
        height: "14px", 
        color: "#ffc107" 
        }} 
        icon={faStar} 
        />
        </p>
        </div>
        </div>
        </a>
    ))}
</div>
    </div>
 
</div>
<div className="slider-container">
  <div className="slider-header">
    <h2>Anniversary Decoration</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("Anniversary")}
    >
    View More
    </button>
    </div>

  <DecorationLandingSlider data={AnniversaryData} category="Anniversary" handleViewMore={handleViewMore} />
</div>
<div className="slider-container">
  <div className="slider-header">
    <h2>Baby Shower</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("BabyShower")}
    >
    View More
    </button>
    </div>
  <div className="slider-container slider-decoration-inner decoration-item-grid">
    {BabyShowerData.map((item, index) => (
        <a key={index} className="slider-item" href={item.link}>
        <Image 
        src={item.Image} 
        alt={item.title} 
        className="slider-image"
        width={200}
        height={250}
        />

        <div className="slider-item-details">
        <h3>{item.title}</h3>
        <div style={{ justifyContent:"space-between" , alignItems:"center" , display:"flex" , flexDirection:"row"}}>
        <p style={{ color: "#9252AA", fontWeight: 'bold', fontSize: '17px' , margin:"0" }}>{item.price}</p>
        <p style={{ fontSize: '17px', color: 'rgb(146, 82, 170)' }}>  {/* Adjust the font size as needed */}
        {item.rating}
        <FontAwesomeIcon 
        style={{ 
        marginBottom: '2px',
        marginLeft: '8px',  /* Adjust the margin as needed */
        height: "14px", 
        color: "#ffc107" 
        }} 
        icon={faStar} 
        />
        </p>
        </div>
        </div>
        </a>
    ))}
</div>
</div>
<div className="slider-container">
  <div className="slider-header">
    <h2>Welcome baby</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("WelcomeBaby")}
    >
    View More
    </button>
    </div>
  <DecorationLandingSlider data={WelcomebabyData} category="WelcomeBaby" handleViewMore={handleViewMore} />
</div>
<div className="slider-container">
  <div className="slider-header">
    <h2>Premium Decors</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("PremiumDecoration")}
    >
    View More
    </button>
    </div>
  <div className="slider-container slider-decoration-inner decoration-item-grid">
    {PremiumData.map((item, index) => (
        <a key={index} className="slider-item" href={item.link}>
        <Image 
        src={item.Image} 
        alt={item.title} 
        className="slider-image"
        width={200}
        height={250}
        />

        <div className="slider-item-details">
        <h3>{item.title}</h3>
        <div style={{ justifyContent:"space-between" , alignItems:"center" , display:"flex" , flexDirection:"row"}}>
        <p style={{ color: "#9252AA", fontWeight: 'bold', fontSize: '17px' , margin:"0" }}>{item.price}</p>
        <p style={{ fontSize: '17px', color: 'rgb(146, 82, 170)' }}>  {/* Adjust the font size as needed */}
        {item.rating}
        <FontAwesomeIcon 
        style={{ 
        marginBottom: '2px',
        marginLeft: '8px',  /* Adjust the margin as needed */
        height: "14px", 
        color: "#ffc107" 
        }} 
        icon={faStar} 
        />
        </p>
        </div>
        </div>
        </a>
    ))}
</div>
</div>
<div className="slider-container">
  <div className="slider-header">
    <h2>Ballon Bouquets</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("BallonBouquets")}
    >
    View More
    </button>
    </div>
  <DecorationLandingSlider data={BallonBData} category="BallonBouquets" handleViewMore={handleViewMore} />
</div>
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


export default Decoration;
