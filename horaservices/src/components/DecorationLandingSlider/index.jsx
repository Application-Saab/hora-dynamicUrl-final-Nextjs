import React from 'react';
import Slider from 'react-slick';
import './decorationladingslider.css';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import logo from '../../assets/new_logo_light.png';
import "./decorationladingslider.css";
import ballonDecorationCategoryData from "@/utils/ballonDecorationCategoryData.js";
const DecorationLandingComponent = ({ city, locality }) => {
  const router = useRouter();

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1, dots: true } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1, arrows: true } },
      { breakpoint: 568, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true } },
      { breakpoint: 400, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true } },
    ],
  };

  const navigateTo = (link) => {
    if (city && locality) {
      router.push(`/${city}/${locality}/balloon-decoration/${link}`);
    } else if (city) {
      router.push(`/${city}/balloon-decoration/${link}`);
    } else {
      router.push(`/balloon-decoration/${link}`);
    }
  };

  // const openCatItems = (item) => {
  //   dispatch(setState(item.subCategory, item.imgAlt));
  //   if (hasCityPageParam) {
  //     router.push(`/${city}/${locality}/balloon-decoration/${item.catValue}`);
  //   }
  //   else {
  //     router.push(`/balloon-decoration/${item.catValue}`);
  //   }
  // }


  const getDiscountedPrice = (price) => {
    price = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (isNaN(price) || price < 0) return 0;
    let discount = price < 3000 ? 20 : price <= 5000 ? 27 : 35;
    return Math.floor(price * (1 + discount / 100));
  };

  const getDiscountDifference = (price) => {
    price = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (isNaN(price) || price < 0) return 0;
    let discount = price < 3000 ? 20 : price <= 5000 ? 27 : 35;
    return Math.floor(price - price * (1 - discount / 100));
  };
  const categories = [
    { title: "Kids Birthday Decoration", data: ballonDecorationCategoryData.KidsBirthdayData, viewLink: "kids-birthday-decoration" },
    { title: "Birthday Decoration", data: ballonDecorationCategoryData.birthdayData, viewLink: "birthday-decoration" },
    { title: "Haldi & Mehndi Decoration", data: ballonDecorationCategoryData.haldiAndMehndiData, viewLink: "haldi-mehendi-decoration" },
    { title: "Baby Shower", data: ballonDecorationCategoryData.BabyShowerData, viewLink: "baby-shower-decoration" },
    { title: "First Night Decoration", data: ballonDecorationCategoryData.firstNightData, viewLink: "first-night-decoration" },
    { title: "Anniversary Decoration", data: ballonDecorationCategoryData.AnniversaryData, viewLink: "anniversary-decoration" },
    { title: "Bachelorette Decoration", data: ballonDecorationCategoryData.bacheloretteData, viewLink: "bachelorette-decoration" },
    { title: "Welcome Baby Decoration", data: ballonDecorationCategoryData.WelcomebabyData, viewLink: "welcome-baby-decoration" },
    { title: "Premium Decoration", data: ballonDecorationCategoryData.PremiumData, viewLink: "premium-decorationPremium" },
    { title: "Balloon Bouquet Decoration", data: ballonDecorationCategoryData.BallonBData, viewLink: "balloon-bouquets-decoration" },
  ];

  // const getDiscountedPrice = (price) => {
  //   // Trim and remove currency symbol
  //   price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters

  //   // Check if the price is a valid number
  //   if (isNaN(price) || price < 0) {
  //     return { error: "Please enter a valid price." };
  //   }

  //   let discount;

  //   // Determine the discount percentage based on the item price
  //   if (price < 3000) {
  //     discount = 20; // 20% discount
  //   } else if (price >= 3000 && price <= 5000) {
  //     discount = 27; // 27% discount
  //   } else {
  //     discount = 35; // 35% discount for prices above 5000
  //   }

  //   const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
  //   const discountDifference = price - discountedPrice; // Difference in original and discounted price

  //   return Math.floor(discountedPrice); // Return both discount percentage and discounted price
  // };


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


  return (<>
    <div className="decorationLanding-category">
      {categories.map((category, index) => (
        <div key={index} className="slider-container">
          <div className="category-header" onClick={() => navigateTo(category.viewLink)} >
            <h2 className="heading-purple" style={{ cursor: "pointer" }}>
              {category.title}
            </h2>
            <button className="decoreCategory-viewBtn" >
              View More
            </button>
          </div>
          
            {category.title === "Haldi & Mehndi Decoration" || category.title === "First Night Decoration" ? (
              
              <Slider {...sliderSettings}>
                {category.data.map((item, idx) => (
                 
                  <div key={idx} className="inSlider-items">
                    {item.isViewMore ? (
                      <div className="view-more-slide" onClick={() => navigateTo(item.link)}>
                        <h3 style={{ textAlign: 'center', cursor: 'pointer' }}>{item.title}</h3>
                      </div>
                    ) : (
                      <div onClick={() => navigateTo(item.link)} style={{ position: "relative" }}>
                        <Image src={item.Image} alt={item.title} className="slider-image" width={200} height={250} />
                        <div className="decorationdiscount">₹{getDiscountDifference(item.price)} off</div>
                        <div className="category-prod-details">
                          <h3 className='category-prodName'>{item.title}</h3>
                          <div className='pri_details'>
                            <p className='prodPrice'>{item.price}</p>
                            <p className='discountedPrice'>
                              ₹{getDiscountedPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Slider>
             
            ) : (<>
            <div className="category-prod-cards">
              {category.data.map((item, idx) => (
                <a key={idx} className="inGrid-items" href={item.link} onClick={() => handleItemClick(item)}>
                  <Image src={item.Image} alt={item.title} className="slider-image" width={200} height={250} />
                  <div className="decorationdiscount">₹{getDiscountDifference(item.price)} off</div>
                  <div className="category-prod-details">
                    <h3 className='category-prodName'>{item.title}</h3>
                    <div className='pri_details'>
                      <p className='prodPrice'>
                        {item.price}
                      </p>
                      <p className='discountedPrice'>
                        ₹{getDiscountedPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </a>
              )
              )}
              </div>
            </>)}
        
        </div>
      ))}
    </div>
  </>
  );
};

export default DecorationLandingComponent;
