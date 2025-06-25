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
  { id: '2', image: "https://horaservices.com/api/uploads/compressed_images/Birthday_dec_cat.webp", name: 'Birthday', subCategory: "Birthday", catValue: "birthday-decoration", imgAlt: "A Gorgeous Candy Birthday Decoration Surprise!" },
  { id: '3', image: "https://horaservices.com/api/uploads/compressed_images/first_night_cat_dec.webp", name: 'First Night', subCategory: "FirstNight", catValue: "first-night-decoration", imgAlt: "Add extra happiness quotient to your wedding night with our exclusive décor package" },
  { id: '4', image: "https://horaservices.com/api/uploads/compressed_images/aniversary_Cat_Dec.webp", name: 'Anniversary', subCategory: "Anniversary", catValue: "anniversary-decoration", imgAlt: "Immerse yourself in a world of romance with our mesmerizing anniversary decorations." },
  { id: '5', image: "https://horaservices.com/api/uploads/compressed_images/kids_birthday_decoration.webp", name: 'Kids Birthday', subCategory: "KidsBirthday", catValue: "kids-birthday-decoration", imgAlt: "Flutter into a world of whimsy with our exclusive Whimsical Flutter-themed Welcome Baby Decorations." },
  { id: '6', image: "https://horaservices.com/api/uploads/compressed_images/baby-shower-dec-cat.webp", name: 'Baby Shower', subCategory: "BabyShower", catValue: "baby-shower-decoration", imgAlt: "Celebrate the transformation into motherhood with Our Gilded Baby Shower Decorations." },
  { id: '7', image: "https://horaservices.com/api/uploads/compressed_images/welcome_baby_dec.webp", name: 'Welcome Baby', subCategory: "WelcomeBaby", catValue: "welcome-baby-decoration", imgAlt: "A Pastel Theme Oh Baby Decor for your Baby Shower Celebrations!" },
  { id: '8', image: "https://horaservices.com/api/uploads/compressed_images/preminumdecor.webp	", name: 'premium Decoration', subCategory: "PremiumDecoration", catValue: "premium-decoration", imgAlt: "Birthday party decoration ideas for adults" },
  { id: '9', image: "https://horaservices.com/api/uploads/compressed_images/Balloon-B-new.webp", name: 'Ballon Bouquets', subCategory: "BallonBouquets", catValue: "balloon-bouquets-decoration", imgAlt: "Balloon Bouquet" },
  {id: '10', Image: "", name: "Haldi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Haldi Event"},  
  {id: '11', Image: "", name: "Mehendi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Mehendi Event"},
  {id: '11', Image: "", name: "Bachelorette Decoration", subCategory: "bachelorette", catValue: "bachelorette-decoration", imgAlt: "Bachelorette"},
  {id: '11', Image: "", name: "proposal decorations", subCategory: "Proposal-Decoration", catValue: "Proposal-Decorations", imgAlt: "proposal decorations"},
     ]);


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

         const openCatItems = (item) => {
            // dispatch(setState(item.subCategory, item.imgAlt));
            if (hasCityPageParam) {
                router.push(`/${city}/balloon-decoration/${item.catValue}`);
            }
        };
    
        const handleViewMore = (category) => {
          const categoryItem = decCat.find((cat) => cat.subCategory === category);
      
          if (categoryItem) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "title_and_viewmore_decoration_citypage_clicked", 
              categoryName: categoryItem.name,
              subCategory: categoryItem.subCategory,
              catValue: categoryItem.catValue, 
              imgAlt: categoryItem.imgAlt,
            });
            openCatItems(categoryItem); 
          } else {
            console.log("No matching category item found.");
          }
        };
    
       const birthdayData = [
           {
             Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1705585784757.png',
             title: 'Blushing Celebration Birthday Decor',
             price: '₹1930',
             rating: 4.7,
             link:"/balloon-decoration/birthday-decoration/product/Blushing-Celebration-Birthday-Decor",
           },
           {
           Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711727911194.png',
           title: 'Delightful White & Golden Decoration',
           price: '₹5441',
           rating: 4.6,
           link:"/balloon-decoration/birthday-decoration/product/Delightful-White-&-Golden-Decoration",
           },
           {
             Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1725181762865.png',
             title: 'Maroon White Birthday Decor',
             price: '₹2843',
             rating: 4.1,
             link:"/balloon-decoration/birthday-decoration/product/Maroon-White-Birthday-Decor",
           },
           {
             Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711568028341.png',
             title: 'Birthday Party at Home Black & White',
             price: '₹2339',
             rating: 4.4,
             link:"/balloon-decoration/birthday-decoration/product/Birthday-Party-at-Home-Black-&-White",
           },
           {
             Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706520980436.png',
             title: 'Classic Attractive Decoration',
             price: '₹7604',
             rating: 4.7,
             link:"/balloon-decoration/birthday-decoration/product/Classic-Attractive-Decoration",
           },
           // {
           //   Image: 'https://horaservices.com/api/uploads/attachment-1725541669342.png',
           //   title: 'Purple Pink n Gold Shimmer Decor',
           //   price: '₹7290',
           //   rating: 4.8,
           //   link:"/balloon-decoration/birthday-decoration/product/Purple-Pink-n-Gold-Shimmer-Decor",
           // },
           {
             Image: '',
             title: '',
             price: '',
             rating: '',
             link:"/balloon-decoration/kids-birthday-decoration/product/Mermaid-Sea-Shell-Shore-Decor",
             isViewMore:true,
           },
         ];
         
         
         const firstNightData = [
             {
               Image: 'https://horaservices.com/api/uploads/attachment-1712942470417.png',
               title: 'Bed Decor With Love Moment',
               price: '₹2808',
               rating: 4.5,
               link:"/balloon-decoration/first-night-decoration/product/Bed-Decor-With-Love-Moment-",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713196298004.png',
               title: 'Heart Room With Decor Rose Petal',
               price: '₹6669',
               rating: 4.5,
               link:"/balloon-decoration/first-night-decoration/product/Heart-Room-With-Decor-Rose-Petal--",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713195839177.png',
               title: 'First Night With Rose Decoration',
               price: '₹1837',
               rating: 4.5,
               link:"/balloon-decoration/first-night-decoration/product/First-Night-With-Rose-Decoration",
             },
     
             // {
             //   Image: '',  // No image for this slide
             //   title: 'View more from First Night Decorations',
             //   price: '',  // No price
             //   rating: '',  // No rating
             //   link: "/balloon-decoration/first-night-decoration",  // Link to the full section
             //   isViewMore: true  // Flag to indicate it's a "View more" slide
             // },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706470671060.png',
               title: 'Romantic Wedding Room Decor',
               price: '₹1738',
               rating: 4.3,
               link:"/balloon-decoration/first-night-decoration/product/Romantic-Wedding-Room-Decor",
             },
           
           ];
         
         
           const haldiAndMehndiData = [
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1723290555708.png',
               title: 'Haldi Decoration Ring Look',
               price: '₹16473',
               rating: 4.6,
               link:"/balloon-decoration/haldi-mehendi-decoration/product/Haldi-Decoration-Ring-Look",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1722693437219.png',
               title: 'Mehendi Decoration Green Style',
               price: '₹14580',
               rating: 4.6,
               link:"/balloon-decoration/haldi-mehendi-decoration/product/Mehendi-Decoration-Green-Style",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1723209813542.png',
               title: 'Mehendi Decoration Look Yellow',
               price: '₹7722',
               rating: 4.6,
               link:"/balloon-decoration/haldi-mehendi-decoration/product/Mehendi-Decoration-Look-Yellow",
             },
             // {
             //   Image: '',  // No image for this slide
             //   title: 'View more from Haldi Mehandi Decorations',
             //   price: '',  // No price
             //   rating: '',  // No rating
             //   link: "/balloon-decoration/haldi-mehendi-decoration ",  // Link to the full section
             //   isViewMore: true  // Flag to indicate it's a "View more" slide
             // },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1723290772620.png',
               title: 'Haldi Decoration Stage',
               price: '₹16286',
               rating: 4.3,
               link:"/balloon-decoration/haldi-mehendi-decoration/product/Haldi-Decoration-Stage",
             },
           ];
         
         
           const AnniversaryData = [
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706461267921.png',
               title: 'Lavender Rose Extravaganza Anniversary Decor',
               price: '₹3509',
               rating: 4.6,
               link:"/balloon-decoration/anniversary-decoration/product/Lavender-Rose-Extravaganza-Anniversary-Decor",
             },
            {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706460114319.png',
               title: 'White & Gold Enchantment Anniversary Decoration',
               price: '₹2924',
               rating: 4.2,
               link:"/balloon-decoration/anniversary-decoration/product/White-&-Gold-Enchantment-Anniversary-Decoration",
             },
            {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713965416898.png',
               title: 'Anniversary Decoration With Ring Shape',
               price: '₹4972',
               rating: 4.5,
               link:"/balloon-decoration/anniversary-decoration/product/Anniversary-Decoration-With-Ring-Shape",
             },
            {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1725953653670.png',
               title: 'Rose and Gold Heaven Balloon Decor',
               price: '₹9770',
               rating: 4.5,
               link:"/balloon-decoration/anniversary-decoration/product/Rose-and-Gold-Heaven-Balloon-Decor",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713189291302.png',
               title: 'Bed Decoration For First Night',
               price: '₹3323',
               rating: 4.0,
               link:"/balloon-decoration/anniversary-decoration/product/Bed-Decoration-For-First-Night",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1718046543520.png',
               title: 'Floral Anniversary Decor',
               price: '₹5148',
               rating: 4.5,
               link:"/balloon-decoration/anniversary-decoration/product/Floral-Anniversary-Decor",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1725951536862.png',
               title: 'Golden n White Petals Balloon decor',
               price: '₹3358',
               rating: 4.8,
               link:"/balloon-decoration/anniversary-decoration/product/Golden-n-White-Petals-Balloon-decor",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/wahtsapp-decoration-redirection.jpeg',
               title: '',
               price: '',
               rating: '',
               link:"/balloon-decoration/kids-birthday-decoration/product/Mermaid-Sea-Shell-Shore-Decor",
               isViewMore:true,
             },
          
           ];
     
           const bacheloretteData = [
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1724160189321.png',
               title: 'Pastel Bride to be Decoration',
               price: '₹2715',
               rating: 4.7,
               link:"/balloon-decoration/bachelorette-decoration/product/Pastel-Bride-to-be-Decoration",
             },
       {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1724162849757.png',
               title: 'Classy Bachelorette Wall',
               price: '₹2188',
               rating: 4.0,
               link:"/balloon-decoration/bachelorette-decoration/product/Classy-Bachelorette-Wall",
             },
       
       {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1724161735052.png',
               title: 'Bachelorette Ring Backdrop',
               price: '₹3834',
               rating: 4.0,
               link:"/balloon-decoration/bachelorette-decoration/product/Bachelorette-Ring-Backdrop",
             },
       {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1724415811393.png',
               title: 'Bride to be Balloon Arch',
               price: '₹2796',
               rating: 4.0,
               link:"/balloon-decoration/bachelorette-decoration/product/Bride-to-be-Balloon-Arch",
             },
       ];
     
           const KidsBirthdayData = [
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1705948416594.png',
               title: 'Minnie Mouse Theme Decoration',
               price: '₹1812',
               rating: 4.5,
               link:"/balloon-decoration/kids-birthday-decoration/product/Minnie-Mouse-Theme-Decoration",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713198322285.png',
               title: 'Cocomelon Theme For Birthday Kids',
               price: '₹2887',
               rating: 4.5,
               link:"/balloon-decoration/kids-birthday-decoration/product/Cocomelon-Theme-For-Birthday-Kids",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706464928126.png',
               title: 'Mickey Ring Birthday Decoration',
               price: '₹3158',
               rating: 4.6,
               link:"/balloon-decoration/kids-birthday-decoration/product/Mickey-Ring-Birthday-Decoration",
             },
            {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711527333610.png',
               title: 'Cocomelon theme With Shining Balloons',
               price: '₹7687',
               rating: 4.4,
               link:"/balloon-decoration/kids-birthday-decoration/product/Cocomelon-theme-With-Shining-Balloons",
             },
            {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711535459259.png',
               title: 'Mermaid Theme Birthday Ring Decor',
               price: '₹7019',
               rating: 4.3,
               link:"/balloon-decoration/kids-birthday-decoration/product/Mermaid-Theme-Birthday-Ring-Decor",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1726057785648.png',
               title: 'Mermaid Sea Shell Shore Decor',
               price: '₹2293',
               rating: 4.4,
               link:"/balloon-decoration/kids-birthday-decoration/product/Mermaid-Sea-Shell-Shore-Decor",
             },
             {
               Image: 'https://horaservices.com/api/uploads/compressed_images/wahtsapp-decoration-redirection.jpeg',
               title: '',
               price: '',
               rating: '',
               link:"/balloon-decoration/kids-birthday-decoration/product/Mermaid-Sea-Shell-Shore-Decor",
               isViewMore:true,
             },
             ];
           
     
           
             const BabyShowerData= [
               {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713010630004.png',
                 title: 'Oh Baby Decor With Baby Feet',
                 price: '₹3510',
                 rating: 4.2,
                 link:"/balloon-decoration/baby-shower-decoration/product/Oh-Baby-Decor-With-Baby-Feet",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1705598937315.png',
                 title: 'Golden, Pink and Blue Baby Shower',
                 price: '₹2690',
                 rating: 4.5,
                 link:"/balloon-decoration/baby-shower-decoration/product/Golden,-Pink-and-Blue-Baby-Shower",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711536118870.png',
                 title: 'Rosy Whispers Baby Shower',
                 price: '₹7161',
                 rating: 4.2,
                 link:"/balloon-decoration/baby-shower-decoration/product/Rosy-Whispers-Baby-Shower",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713379165376.png',
                 title: 'Oh Baby With Green Decoration',
                 price: '₹7336',
                 rating: 4.8,
                 link:"/balloon-decoration/baby-shower-decoration/product/Oh-Baby-With-Green-Decoration",
               },
               {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/wahtsapp-decoration-redirection.jpeg',
                 title: '',
                 price: '',
                 rating: '',
                 link:"/balloon-decoration/kids-birthday-decoration/product/Mermaid-Sea-Shell-Shore-Decor",
                 isViewMore:true,
               },
               // {
               //   Image: 'https://horaservices.com/api/uploads/attachment-1726062561916.png',
               //   title: 'Teddys wonderLand pink deocr',
               //   price: '₹6329',
               //   rating: 4.5,
               //   link:"/balloon-decoration/baby-shower-decoration/product/Teddy%27s-Wonderland-Pink-Decor",
               // },
               
             ];
           
             const WelcomebabyData= [
               {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713382130916.png',
                 title: 'Welcome Baby By Teddy Theme',
                 price: '₹4856',
                 rating: 4.8,
                 link:"/balloon-decoration/welcome-baby-decoration/product/Welcome-Baby-By-Teddy-Theme",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713010968590.png',
                 title: 'Light Baby Decoration',
                 price: '₹4388',
                 rating: 4.5,
                 link:"/balloon-decoration/welcome-baby-decoration/product/Light-Baby-Decoration-",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706471168212.png',
                 title: 'Pastel Theme Baby Welcome',
                 price: '₹2447',
                 rating: 4.7,
                 link:"/balloon-decoration/welcome-baby-decoration/product/Pastel-Theme-Baby-Welcome",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706471308375.png',
                 title: 'Pink Theme Welcome Baby',
                 price: '₹2422',
                 rating: 4.2,
                 link:"/balloon-decoration/welcome-baby-decoration/product/Pink-Theme-Welcome-Baby",
               },
               // {
               //   Image: '',  // No image for this slide
               //   title: 'View more from Welcome Baby Decorations',
               //   price: '',  // No price
               //   rating: '',  // No rating
               //   link: "/balloon-decoration/welcome-baby-decoration",  // Link to the full section
               //   isViewMore: true  // Flag to indicate it's a "View more" slide
               // },
               {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711599827419.png',
                 title: 'Golden & Pink Theme Baby Welcome',
                 price: '₹3041',
                 rating: 4.8,
                 link:"/balloon-decoration/welcome-baby-decoration/product/Golden-&-Pink-Theme-Baby-Welcome",
               },
             ];
           
             const PremiumData= [
               {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1713005111181.png',
                 title: 'Birthday Decor With Cocomelon Setup',
                 price: '₹10261',
                 rating: 4.4,
                 link:"/balloon-decoration/premium-decoration/product/Birthday-Decor-With-Cocomelon-Setup",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1712938054361.png',
                 title: 'Boy & Girl Baby Shower Theme',
                 price: '₹8950',
                 rating: 4.6,
                 link:"/balloon-decoration/premium-decoration/product/Boy-&-Girl-Baby-Shower-Theme",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1706463835447.png',
                 title: 'Multi Balloon Round Ring',
                 price: '₹5464',
                 rating: 4.7,
                 link:"/balloon-decoration/premium-decoration/product/Multi-Balloon-Round-Ring",
               },
           
               {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711528712533.png',
                 title: 'Unicorn Theme Birthday Surprise',
                 price: '₹8657',
                 rating: 4.6,
                 link:"/balloon-decoration/premium-decoration/product/Unicorn-Theme-Birthday-Surprise",
               },
                
             ];
             
             const BallonBData= [
               {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1705949316251.png',
                 title: 'I Love You Balloon Bouquet',
                 price: '₹1944',
                 rating: 4.3,
                 link:"/balloon-decoration/balloon-bouquets-decoration",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1705949583322.png',
                 title: 'LOVE Balloon Bouquet',
                 price: '₹1350',
                 rating: 4.6,
                 link:"/balloon-decoration/balloon-bouquets-decoration",
               },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1711542379923.png',
                 title: 'Barbie Balloon Bouquet',
                 price: '₹1450',
                 rating: 4.1,
                 link:"/balloon-decoration/balloon-bouquets-decoration",
               },
               // {
               //   Image: '',  // No image for this slide
               //   title: 'View more from Ballon Bouquet',
               //   price: '',  // No price
               //   rating: '',  // No rating
               //   link: "/balloon-decoration/kids-birthday-decoration",  // Link to the full section
               //   isViewMore: true  // Flag to indicate it's a "View more" slide
               // },
              {
                 Image: 'https://horaservices.com/api/uploads/compressed_images/attachment-1712305355842.png',
                 title: 'Baby Shark Bouquet',
                 price: '₹1420',
                 rating: 4.5,
                 link:"/balloon-decoration/balloon-bouquets-decoration",
               },
               
             ];
     
     
    

            const getDiscountedPrice = (price) => {
              // Trim and remove currency symbol
              price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters
            
              // Check if the price is a valid number
              if (isNaN(price) || price < 0) {
                  return { error: "Please enter a valid price." };
              }
            
              let discount;
            
              // Determine the discount percentage based on the item price
              if (price < 3000) {
                  discount = 20; // 20% discount
              } else if (price >= 3000 && price <= 5000) {
                  discount = 27; // 27% discount
              } else {
                  discount = 35; // 35% discount for prices above 5000
              }
            
              const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
              const discountDifference = price - discountedPrice; // Difference in original and discounted price
            
              return  Math.floor(discountedPrice) ; // Return both discount percentage and discounted price
            };
            
            
            const getDiscountedDifference = (price) => {
              // Trim and remove currency symbol
              price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters
            
              // Check if the price is a valid number
              if (isNaN(price) || price < 0) {
                  return { error: "Please enter a valid price." };
              }
            
              let discount;
            
              // Determine the discount percentage based on the item price
              if (price < 3000) {
                  discount = 20; // 20% discount
              } else if (price >= 3000 && price <= 5000) {
                  discount = 27; // 27% discount
              } else {
                  discount = 35; // 35% discount for prices above 5000
              }
              const discountedPrice = Math.floor(price * (1 - discount / 100)); // Calculate the discounted price and round down
              const discountDifference = Math.floor(price - discountedPrice); // Difference in original and discounted price, rounded down
            
              return  discountDifference ; // Return both discount percentage and discounted price
            };
            
            const handleSliderViewMore = (link , city) =>{
              if(city){
                router.push(`/${city}/${link}`); 
              }
              else{
                router.push(`/${link}`);
              }
            
            }

    function capitalizeCity(city) {
      return city.charAt(0).toUpperCase() + city.slice(1);
  }


  const SliderSection = ({ title, data, handleViewMore , viewLink }) => (
    <div className="slider-container dec-grid-section">
      <div className="slider-header">
        <h2 onClick={() => handleViewMore(viewLink)} style={{ cursor: "pointer" }}>{title}</h2>
        <button className="viewbtn btn btn-primary" onClick={() => handleViewMore(viewLink)}>View More</button>
      </div>
      <div className="slider-container slider-decoration-inner decoration-item-grid">
      {data.map((item, index) => {
    if (item.isViewMore) {
    return (
      <a 
      key={index} 
      className="view-more-slide slider-item" 
      // onClick={() => openWahtsappRedirection(item.title)}
      >
      <div className="view-more-chatwith-us">
        <div class="button-whatspp-decoration-cta">
        <p>Customize ?? </p>
        <div >
        <button class="button-sec" onClick={() => openWahtsappRedirection(item.title)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle icon-cta">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>Chat with Us</button>
        </div>
        </div>
       
        <div class="button-chatus-decoration-cta">
        <p >800 Plus design</p>
        <div >
        <button className="button-sec" onClick={() => handleViewMore(viewLink)}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style={{ fill: 'rgb(166, 115, 185)' }}>
  <path d="M3 12c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zM3 7c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zM3 17c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1z"/>
</svg>
View More
</button>
        </div>
        </div>
       
      </div>
    
      </a>
    );
    } else {
    return (
    <a key={index} className="slider-item" href={item.link} onClick={() => handleItemClick(item)}>
    <div style={{ position: "relative" }}>
    <Image 
      src={item.Image} 
      alt={item.title} 
      className="slider-image" 
      width={200} 
      height={250} 
    />
    <div style={{ position: "absolute", bottom: 3, right: 3, borderRadius: "50%", padding: 10 }}>
      <span style={{ color: "rgba(157, 74, 147, 0.6)", fontWeight: "600" }}>
        <Image src={logo} style={{ width: "70px", height: "80px" }} className="hora-watermark-image" />
      </span>
    </div>
    </div>
    <div className="decorationdiscount">
    ₹{getDiscountedDifference(item.price)} {'off'}
    </div>
    <div className="slider-item-details">
    <h3>{item.title}</h3>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "top" }} className='pri_details'>
      <div style={{ display: "flex", alignItems: 'left', justifyContent: 'space-between' }} className='pro_price'>
        <p style={{ fontWeight: '700', fontSize: 15, color: '#9252AA', textAlign: "left", margin: "10px 10px 7px 0" }}>
          {item.price}
        </p>
        <p style={{ color: '#444', fontWeight: '700', fontSize: 15, textAlign: "left", margin: "10px 0px 7px", textDecoration: 'line-through' }}>
          ₹{getDiscountedPrice(item.price)}
        </p>
      </div>
    </div>
    </div>
    </a>
    );
    }
    })}

      </div>
    </div>
    );
    

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
onClick={() => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'categoryClick_citypage',  
    categoryName: item.name,  
    subCategory: item.subCategory, 
    catValue: item.catValue, 
    imageAlt: item.imgAlt,
    itemLink: item.link,  
  });
  openCatItems(item);
}}
width={300}
height={300}
/>
</a>

</div>
))}
</div>


<div className="page-width decorationlanding-slider">


<SliderSection 
  title="Kids Birthday Decoration" 
  data={KidsBirthdayData} 
  handleViewMore={handleViewMore}  
  viewLink={'KidsBirthday'} 
/>

<SliderSection title="Birthday Decoration" data={birthdayData} handleViewMore={handleViewMore}  viewLink={'Birthday'}  />
    

<div className="slider-container">
  <div className="slider-header">
    <h2  onClick={() => handleViewMore("Haldi-Mehandi")} style={{ cursor:"pointer"}}>Haldi & Mehndi Decoration</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("Haldi-Mehandi")}
    >
    View More
    </button>
    </div>
    <div>
    <DecorationLandingSlider data={haldiAndMehndiData} category="haldi-mehandi"  />
    </div>
 
</div>
    
<SliderSection title="Baby Shower" data={BabyShowerData} handleViewMore={handleViewMore} viewLink={'BabyShower'} />

<div className="slider-container">
  <div className="slider-header">
    <h2  onClick={() => handleViewMore("FirstNight")} style={{ cursor:"pointer"}}>First Night Decoration</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("FirstNight")}
    >
    View More
    </button>
    </div>
  <div>
  <DecorationLandingSlider data={firstNightData} category="Birthday" />

  </div>
</div>

<SliderSection title="Anniversary Decoration" data={AnniversaryData} handleViewMore={handleViewMore} viewLink={'Anniversary'}/>

<div className="slider-container">
  <div className="slider-header">
    <h2  onClick={() => handleViewMore("WelcomeBaby")} style={{ cursor:"pointer"}}>Welcome baby</h2>
    <button 
    className="viewbtn  btn btn-primary" 
    onClick={() => handleViewMore("WelcomeBaby")}
    >
    View More
    </button>
    </div>
  <DecorationLandingSlider data={WelcomebabyData} category="WelcomeBaby"  />
</div>
<SliderSection title="Premium Decors" data={PremiumData} handleViewMore={handleViewMore} viewLink={'PremiumDecoration'} />
<SliderSection title="Bachelorette Decoration" data={bacheloretteData} handleViewMore={handleViewMore} viewLink={'bachelorette'} />
 



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



</div>
    );    
};


export default Decoration;
