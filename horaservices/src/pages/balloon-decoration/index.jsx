import React, { useState, useEffect } from "react";
import Head from 'next/head';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { useParams } from "react-router-dom";
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM } from '../../utils/apiconstants';
import { getDecorationOrganizationSchema } from '../../utils/schema';
import { setState } from '../../actions/action';
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from '../../assets/new_logo_light.png.png';
import { useDispatch } from "react-redux";
import '../../css/decoration.css';
import '../../components/DecorationLandingSlider/decorationladingslider.css';
import DecorationLandingSlider from '../../components/DecorationLandingSlider';
import decorationCategoryData from "./decorationConstant";


  const categories = [
    { title: "Kids Birthday Decoration", data: decorationCategoryData.KidsBirthdayData, viewLink: "KidsBirthday" },
    { title: "Birthday Decoration", data: decorationCategoryData.birthdayData, viewLink: "Birthday" },
    { title: "Haldi & Mehndi Decoration", data: decorationCategoryData.haldiAndMehndiData, viewLink: "Haldi-Mehandi" },
    { title: "Baby Shower", data: decorationCategoryData.BabyShowerData, viewLink: "BabyShower" },
    { title: "First Night Decoration", data: decorationCategoryData.firstNightData, viewLink: "FirstNight" },
    { title: "Anniversary Decoration", data: decorationCategoryData.AnniversaryData, viewLink: "Anniversary" },
    { title: "Bachelorette Decoration", data: decorationCategoryData.bacheloretteData, viewLink: "Bachelorette" },
    { title: "Welcome Baby Decoration", data: decorationCategoryData.WelcomebabyData, viewLink: "WelcomeBaby" },
    { title: "Premium Decoration", data: decorationCategoryData.PremiumData, viewLink: "Premium" },
    { title: "Balloon Bouquet Decoration", data: decorationCategoryData.BallonBData, viewLink: "BalloonBouquet" },
  ];
  
  
const decCat = [
  { id: '2', image: "https://horaservices.com/api/uploads/Birthday_dec_cat.webp", name: 'Birthday', subCategory: "Birthday", catValue: "birthday-decoration", imgAlt: "A Gorgeous Candy Birthday Decoration Surprise!" },
  { id: '3', image: "https://horaservices.com/api/uploads/first_night_cat_dec.webp", name: 'First Night', subCategory: "FirstNight", catValue: "first-night-decoration", imgAlt: "Add extra happiness quotient to your wedding night with our exclusive décor package" },
  { id: '4', image: "https://horaservices.com/api/uploads/aniversary_Cat_Dec.webp", name: 'Anniversary', subCategory: "Anniversary", catValue: "anniversary-decoration", imgAlt: "Immerse yourself in a world of romance with our mesmerizing anniversary decorations." },
  { id: '5', image: "https://horaservices.com/api/uploads/kids_birthday_decoration.webp", name: 'Kids Birthday', subCategory: "KidsBirthday", catValue: "kids-birthday-decoration", imgAlt: "Flutter into a world of whimsy with our exclusive Whimsical Flutter-themed Welcome Baby Decorations." },
  { id: '6', image: "https://horaservices.com/api/uploads/baby-shower-dec-cat.webp", name: 'Baby Shower', subCategory: "BabyShower", catValue: "baby-shower-decoration", imgAlt: "Celebrate the transformation into motherhood with Our Gilded Baby Shower Decorations." },
  { id: '7', image: "https://horaservices.com/api/uploads/welcome_baby_dec.webp", name: 'Welcome Baby', subCategory: "WelcomeBaby", catValue: "welcome-baby-decoration", imgAlt: "A Pastel Theme Oh Baby Decor for your Baby Shower Celebrations!" },
  { id: '8', image: "https://horaservices.com/api/uploads/preminumdecor.webp	", name: 'premium Decoration', subCategory: "PremiumDecoration", catValue: "premium-decoration", imgAlt: "Birthday party decoration ideas for adults" },
  { id: '9', image: "https://horaservices.com/api/uploads/Balloon-B-new.webp", name: 'Ballon Bouquets', subCategory: "BallonBouquets", catValue: "balloon-bouquets-decoration", imgAlt: "Balloon Bouquet" },
  { id: '10', Image: "", name: "Haldi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Haldi Event" },
  { id: '11', Image: "", name: "Mehendi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Mehendi Event" },
  { id: '12', Image: "", name: "Bachelorette Decoration", subCategory: "bachelorette", catValue: "bachelorette-decoration", imgAlt: "Bachelorette" },
  { id: '13', Image: "", name: "proposal decorations", subCategory: "Proposal-Decoration", catValue: "Proposal-Decorations", imgAlt: "proposal decorations" },

];

const Decoration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const navigate = useNavigate();
  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  let { city } = useParams();
  const hasCityPageParam = city ? true : false;


  const openCatItems = (item) => {
    // sendGTMEvent('event', 'titleClicked', { value: `/balloon-decoration/${item.catValue}` });
    dispatch(setState(item.subCategory, item.imgAlt));
    if (hasCityPageParam) {
      router.push(`/${city}/balloon-decoration/${item.catValue}`);
    }
    else {
      router.push(`/balloon-decoration/${item.catValue}`);
    }
  };

  const openWahtsappRedirection = (catTitle) => {
    window.open('https://wa.me/917338584828?text=Hello%20I%20have%20seen%20decoration%20design%20on%20your%20website.%20Please%20help%20me%20for%20more%20customization%20and%20more%20details.', '_blank');
  }

  const handleViewMore = (category) => {
    const categoryItem = decCat.find(cat => cat.subCategory === category);
    console.log('Category Item:', categoryItem);
    if (categoryItem) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "title_and_viewmore_decoration_page_clicked",
        categoryName: categoryItem.name,
        subCategory: categoryItem.subCategory,
        catValue: categoryItem.catValue,
        imgAlt: categoryItem.imgAlt,
      });
      openCatItems(categoryItem);
    } else {
      console.log('No matching category item found.');
    }
  };

 
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

    return Math.floor(discountedPrice); // Return both discount percentage and discounted price
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

    return discountDifference; // Return both discount percentage and discounted price
  };



  const handleItemClick = (item) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'decoration_item_clicked',
      event_category: 'SliderSection',
      event_label: item.title,
      categoryName: item.categoryName,
      subCategory: item.subCategory,
      catValue: item.catValue,
      imgAlt: item.imgAlt
    });

    let lastEvent = window.dataLayer[window.dataLayer.length - 1];

  };


  const SliderSection = ({ title, data, handleViewMore, viewLink }) => (
    <div className="slider-container dec-grid-section">
      {/* <div className="slider-header">
        <h2 onClick={() => handleViewMore(viewLink)} style={{ cursor: "pointer" }}>{title}</h2>
        <button className="viewbtn btn btn-primary" onClick={() => handleViewMore(viewLink)}>View More</button>
      </div> */}
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
                  <div className="button-whatspp-decoration-cta">
                    <p>Customize ?? </p>
                    <div >
                      <button className="button-sec" onClick={() => openWahtsappRedirection(item.title)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle icon-cta">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>Chat with Us</button>
                    </div>
                  </div>

                  <div className="button-chatus-decoration-cta">
                    <p >800 Plus design</p>
                    <div >
                      <button className="button-sec" onClick={() => handleViewMore(viewLink)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style={{ fill: 'rgb(166, 115, 185)' }}>
                          <path d="M3 12c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zM3 7c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1zM3 17c0-.55.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1z" />
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
                      <Image src={logo} style={{ width: "70px", height: "80px" }} className="hora-watermark-image" alt='logo'/>
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

      <div className="decContainerSec decPage">
        {decCat
          .filter(item => item.image) // Filter out items without images
          .map((item, index) => (
            <div key={index} className="imageContainer">
              <a href={item.link}>
                <Image
                  src={item.image}
                  className="decCatimage"
                  alt={item.imgAlt}
                  loading="eager"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];

                    window.dataLayer.push({
                      event: 'categoryClick',
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
      {categories.map((category, index) => (
        <div key={index} className="slider-container">
            <div className="slider-header">
             
             <h2 
               onClick={() => handleViewMore(category.viewLink)} 
               style={{ cursor: "pointer" }}
             >
               {category.title}
             </h2>
             <button
               className="viewbtn btn btn-primary"
               onClick={() => handleViewMore(category.viewLink)}
             >
               View More
             </button>
           </div>

          {/* For categories like "Haldi & Mehndi", we use DecorationLandingSlider */}
          {category.title === "Haldi & Mehndi Decoration" || category.title === "First Night Decoration" ? (<>
          
            <DecorationLandingSlider 
              data={category.data} 
              category={category.viewLink} 
            />
          </>) : (
            <SliderSection 
              title={category.title} 
              data={category.data} 
              handleViewMore={handleViewMore} 
              viewLink={category.viewLink} 
            />
          )}
        </div>
      ))}
    </div>
    </div>
  );
};

// Fetching the data at build time
export async function getStaticProps() {
  try {
    const catalogueData = await Promise.all(decCat.map(async (item) => {
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + item.subCategory);
      const categoryId = response.data.data._id;
      const result = await axios.get(BASE_URL + GET_DECORATION_CAT_ITEM + categoryId);
      return {
        ...item,
        data: result.data.data,
      };
    }));

    return {
      props: {
        catalogueData,
      },
    };
  } catch (error) {
    console.log("Error fetching data:", error.message);
    return {
      props: {
        catalogueData: [],
      },
    };
  }
}

export default Decoration;
