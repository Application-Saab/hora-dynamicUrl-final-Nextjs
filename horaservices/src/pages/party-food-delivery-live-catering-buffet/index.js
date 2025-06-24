import React, { useEffect, useState, useRef } from "react";
import "./party-food-delivery-live-catering-buffet.css";
import chefstanding from "../../assets/fooddelivery/chefstanding2.png";
import iconMap from "../../assets/fooddelivery/icon-map-food.png";
import Image from "next/image";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import leaptress from "../../assets/fooddelivery/leaptree.png";
import percentIcon from "../../assets/fooddelivery/percent_icon.png";
import carIcon from "../../assets/fooddelivery/car_icon.png";
import priceIcon from "../../assets/fooddelivery/price_icon.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import googleIcon from "../../assets/fooddelivery/google.png";
import instagramIcon from "../../assets/fooddelivery/instagram.png";
import Slider from "react-slick";
import video1 from "../../assets/fooddelivery/review1.mp4";
import video2 from "../../assets/fooddelivery/review2.mp4";
import video3 from "../../assets/fooddelivery/review3.mp4";

const FoodDelivery = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  const settings3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const settings1 = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const servicesData = [
    {
      id: 1,
      className: "chef-party",
      iconSrc: require("../../assets/fooddelivery/icon-map-food.png"),
      title: "Chef for party",
    },
    {
      id: 2,
      className: "bulk-delivery",
      iconSrc: require("../../assets/fooddelivery/icon-map-food.png"),
      title: "Bulk Food<br /> Delivery",
    },
    {
      id: 3,
      className: "live-catering",
      iconSrc: require("../../assets/fooddelivery/icon-map-food.png"),
      title: "Live Catering",
    },
  ];

  const carouselItems = [
    {
      id: 1,
      src: require("../../assets/fooddelivery/foodDeliverypackage.png"),
    }
    ,
    // {
    //   id: 2,
    //   src: require("../../assets/fooddelivery/foodDeliverypackage.png"),
    // },
    // {
    //   id: 3,
    //   src: require("../../assets/fooddelivery/foodDeliverypackage.png"),
    // },
  ];

  const liveCateringSlider = [
    {
      id: 1,
      src: require("../../assets/fooddelivery/Catering2.jpg"),
    },
    // {
    //   id: 2,
    //   src: require("../../assets/fooddelivery/Catering2.jpg"),
    // },
    // {
    //   id: 3,
    //   src: require("../../assets/fooddelivery/Catering3.svg"),
    // },
  ];

  const foodDeliverySlider = [
    {
      id: 1,
      src: require("../../assets/fooddelivery/chef_for_party_chef.png"),
    },
    // {
    //   id: 2,
    //   src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqmjn4jiUB-eG9ZFRNMC_OdGbW3smAC9NH3A&s",
    // },
    // {
    //   id: 3,
    //   src: "data:image/jpeg;base64,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",
    // },
  ];

  const menuItems = [
    {
      id: 1,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg_image6.PNG"),
      selectedItems: [
        {
          title: "Jeera Rice",
        },
        {
          title: "Bhature",
        }
      ]
    },
    {
      id: 2,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg_image7.PNG"),
    },
    {
      id: 3,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg_image8.PNG"),
    },
    {
      id: 4,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg_image9.PNG"),
    },
  ];

  const contactUsRedirection = (value) => {
    console.log('value', value);
    const message = `Hello I have some queries for ${value} and for party service`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/917338584828?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  const [isVegOnly, setIsVegOnly] = useState(false);

  const menuItems2 = [
    {
      id: 1,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/nonveg_image1.PNG"),
    },
    {
      id: 2,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/nonveg_image6_2.PNG"),
    },
    {
      id: 3,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/nonveg_image3.PNG"),
    },
    {
      id: 4,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/nonveg_image4.PNG"),
    },
  ];


  const menuItemsVegCaterning = [
    {
      id: 1,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg1.jpg"),
    },
    {
      id: 2,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg2.jpg"),
    },
    {
      id: 3,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg3.jpg"),
    },
    {
      id: 4,
      title: "ASIAN PARTY 2",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/veg4.jpg"),
    },
    
  ];

  const menuItemsNonVegCaterning = [
     {
      id: 1,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/Nonveg1.jpg"),
    },
    {
      id: 2,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/Nonveg2.jpg"),
    },
    {
      id: 3,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/Nonveg3.jpg"),
    },
    {
      id: 4,
      title: "ASIAN PARTY 1",
      description: "3 Starters + 5 Mains + 1 Dessert",
      price: "₹ 3,599/-",
      details: "(For 10 Guests)",
      imgSrc: require("../../assets/fooddelivery/Nonveg4.jpg"),
    },
    
   
  ];

  const steps = [
    {
      icon: percentIcon,
      title: "Your Content Goes Here",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      icon: carIcon,
      title: "Your Content Goes Here",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      icon: priceIcon,
      title: "Your Content Goes Here",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
  ];

  const reviews = [
    {
      image:
"https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png",
      name: "Rohit Khandelwal",
      rating: 5,
      description:
        "From start to finish, HORA exceeded all my expectations, since it was my first experience with them. Their vast menu options made it easy to cater to all my dietary preferences, and the decor designs were stunning. The ease of booking and seamless communication made the entire process smooth. My guests and I enjoyed party stress-free!",
    },
    {
      image: "https://randomuser.me/api/portraits/women/8.jpg",
      name: "Simran Gyanchandani",
      rating: 5,
      description:
        "Very good experience, hassle free. The continuous assistance by a dedicated Manager Bharat, takes care of everything. Be it decor, timing of food, additional supplies, anything . Just ask manager and all sorted. Would highly recommend HORA for all events.",
    },
    {
      image: "https://randomuser.me/api/portraits/men/9.jpg",
      name: "Rohan Malik",
      rating: 5,
      description: "Nice food and delivery was on time.",
    },
    {
      image: "https://randomuser.me/api/portraits/men/19.jpg",
      name: "Prem Chandwani",
      rating: 5,
      description:
        "We had our Engagement party done by Hora catering services... Their food quality and taste is just great and their price is also reasonable.... Recommended ..",
    },
    {
      image: "https://randomuser.me/api/portraits/women/27.jpg",
      name: "Nishma Sadrani",
      rating: 5,
      description:
        "Very professional caterers👨🍳, reached out to them through word of mouth! Good Food 🥣, Great service, decent hygiene standards and overall it was a good experience. Kudos to you guys 👏👏, keep up the good work👍!",
    },
    {
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      name: "anush tater",
      rating: 5,
      description:
        "We hired Hora for a housewarming party for a small group. From the time we started talking, the team was very clear and transparent on what they will do/ not do. On the day of the event, they showed up on time and were very professional about the way they set up. The most important thing, the food, was fantastic and the guests loved it.",
    },
    {
      image:
        "data:image/jpeg;base64,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",
      name: "Rupal Kothari",
      rating: 5,
      description:
        "One of the best North Indian caterer in Bangalore. I booked them for Engagement, food was very tasty. Another plus point is prices are very reasonable. Most importantly, they were on time, staff and management- both were professional and polite.",
    },
  ];

  const videos = [
    { src: video1, type: "video/mp4" },
    { src: video2, type: "video/mp4" },
    { src: video3, type: "video/mp4" },
  ];

  const handleToggle = () => {
    setIsVegOnly(!isVegOnly);
  };

  const filteredMenuItems = isVegOnly ? menuItems : menuItems2;

  const filteredMenuItemsCaterning = isVegOnly ? menuItemsVegCaterning : menuItemsNonVegCaterning;

  return (
    <>
      <div className="catering-container">
       
          <div className="services-top-section">
            <div className="page-width">

           
        <div className="services-icons">
          {servicesData.map((service) => (
            <div key={service.id} className="icon-item">
              <div className={`icon ${service.className}`}>
                <Image
                  src={service.iconSrc}
                  alt={`${service.title} Icon`}
                  width={30}
                  height={30}
                />
              </div>
              <p
                className="services-icons-text"
                dangerouslySetInnerHTML={{ __html: service.title }}
              ></p>
            </div>
          ))}
        </div>

        <div className="content-section">
          <Image src={chefstanding} alt="Chef" className="chef-image" />
          <div className="service-info">
            <p className="services-info-text">
              Reliable Service <br />
              Crafted by
            </p>
            <h2>expert chefs Value for Money Customized for you</h2>
          </div>
        </div>
        </div>
        </div>
        <div className="catering">

        <div className="carousel-container food-delivery">
            <div className="page-width">
          <Slider {...settings}>
            {carouselItems.map((item) => (
              <div key={item.id} className="carousel-item">
                <Image
                  src={item.src}
                  alt={item.title}
                  // className="carousel-image"
                  width={300}
                  height={220}
                />
              </div>
            ))}
          </Slider>
          <div className="bulk-food-delivery">
          <h2 className="title">Bulk Food Delivery</h2>
          <p className="description">
            {/* Quisque porttitor vitae vel amet neque scelerisque mattis.
            Consectetur nibh velit magna consectetur Leo. */}
            <ul>
              <li>Fresh & Hot food delivered at your location.</li>
              <li>Cooked by Professional Chefs..</li>
              <li>Includes disposable plates and water bottles. </li>
              <li>Custome your package from 100+ Dishes.</li>
            </ul>
             
          </p>
          <div className="button-container food-d">
            <a className="btn create-package-btn" href="https://horaservices.com/party-food-delivery-live-catering-buffet/party-food-delivery">
              Create your Package
            </a>
            <button className="btn whatsapp-btn" onClick={() => contactUsRedirection('food-delivery')}>Whatsapp</button>
          </div>
        </div>
        </div>
   </div>
   {/* <div className="matrix">
        </div> */}


       

        <div className="veg-filter-outer">
          <div className="page-width">
             <div className="veg-filter">
          <span className="veg-text">Veg Only</span>
          <label className="switch">
            <input type="checkbox" onChange={handleToggle} />
            <span className="slider round"></span>
          </label>
          <Image
            src={leaptress}
            alt="Veg Icon"
            className="veg-icon"
            width={10}
            height={10}
          />
        </div>
        </div>
        </div>

        <div className="menu-grid-outer">
          <div className="page-width">
          <div className="menu-grid">
  {filteredMenuItems.map((item) => (
    <div key={item.id} 
     className="menu-card"
    >
      <Image 
      
        src={item.imgSrc}
        alt={item.title}
        className="menu-image"
        width={100}
        height={100}
      />
     
    </div>
  ))}
</div>
</div>
</div>

{/* <span class="line"></span> */}

        {/* <div class="view-more-container"> */}
          {/* <span class="line"></span> */}
          
          {/* // class="view-more-button" */}
          {/* > */}
            {/* View More  */}
            {/* <span>&#9662;</span> */}
          {/* </button> */}
          {/* <span class="line"></span> */}
        {/* </div> */}

        {/* second section */}

        <div style={{ marginTop: "25px" }} className="carousel-container">
          <div className="page-width">
          <Slider {...settings}>
            {liveCateringSlider.map((item) => (
              <div key={item.id} className="carousel-item">
                <Image
                  src={item.src}
                  alt={item.title}
                  // className="carousel-image"
                  width={280}
                  height={180}
                />
              </div>
            ))}
          </Slider>
       

        <div className="bulk-food-delivery">
          <h2 className="title">Live Catering</h2>
          <p className="description">
            <ul>
              <li>Live catering with chafing dishes, tables, and waiters</li>
              <li>Food prepared and served by professional chefs and staff</li>
              <li>Customize your menu from 100+ dishes</li>
            </ul>
        
          </p>
          <div className="button-container food-d">
            <a className="btn create-package-btn" href="https://horaservices.com/party-food-delivery-live-catering-buffet/party-live-buffet-catering">
              Create your Package
            </a>
            <button className="btn whatsapp-btn" onClick={() => contactUsRedirection('live Catering')}>
  Whatsapp
</button>
          </div>
        </div>
        </div>
        </div>

        <div className="veg-filter-outer">
          <div className="page-width">
          <div className="veg-filter">
          <span className="veg-text">Veg Only</span>
          <label className="switch">
            <input type="checkbox"  onChange={handleToggle} />
            <span className="slider round"></span>
          </label>
          <Image
            src={leaptress}
            alt="Veg Icon"
            className="veg-icon"
            width={10}
            height={10}
          />
          </div>
          </div>
        </div>

        <div className="menu-grid-outer">
          <div className="page-width">
          <div className="menu-grid">
        {filteredMenuItemsCaterning.map((item) => (
            <div key={item.id} className="menu-card">
              {/* <h3 className="menu-title">{item.title}</h3>
              <p className="menu-description">{item.description}</p>
              <div class="price-banner">
                <span class="price">{item.price}</span>
              </div>
              <p className="menu-details">{item.details}</p> */}
              <Image
                src={item.imgSrc}
                alt={item.title}
                className="menu-image"
                width={10}
                height={10}
              />
              {/* <div className="menu-actions">
                <button className="customize-button">Customize</button>
                <button className="book-now-button">Book Now</button>
              </div> */}
            </div>
          ))}
        </div>
        </div>
          </div>
        {/* <div class="view-more-container">
          <span class="line"></span>
          <button class="view-more-button">
            View More <span>&#9662;</span>
          </button>
          <span class="line"></span>
        </div> */}

        {/* third section */}

        <div style={{ marginTop: "30px" }} className="carousel-container">
          <div className="page-width">
          <Slider {...settings}>
            {foodDeliverySlider.map((item) => (
              <div key={item.id} className="carousel-item">
                <Image
                  src={item.src}
                  alt={item.title}
                  // className="carousel-image"
                  width={280}
                  height={180}
                />
              </div>
            ))}
          </Slider>
       

        <div className="bulk-food-delivery">
          <h2 className="title">Chef For Party</h2>
          <p className="description">
            <ul>
              <li>
              HORA brings professional chefs to your kitchen
              </li>
              <li>They use your ingredients and utensils</li>
              <li>Experience 400 restaurant-style dishes.</li>
              <li>Affordable & customizable.</li>
              <li>Full hygiene control. </li>
            </ul>
        
          </p>
          <div className="button-container food-d">
            <a className="btn create-package-btn" href="https://horaservices.com/book-chef-cook-for-party">
              Create your Package
            </a>
            <button className="btn whatsapp-btn" onClick={() => contactUsRedirection('chef for party')}>
  Whatsapp
</button>
          </div>
        </div>
        </div>
        </div>

        {/* <div className="how-it-works">
          <h2 className="how-it-works-title">How it woks</h2>
          <p className="how-it-works-subtitle">
            Got questions? Our team is here to help. Contact us for quick and
            friendly support.
          </p>
          <div className="how-it-works-steps">
            {steps.map((step, index) => (
              <div className="step" key={index}>
                <div className="step-content">
                  <div className="step-icon">
                    <Image
                      src={step.icon}
                      alt="Step Icon"
                      className="icon-image"
                      width={10}
                      height={10}
                    />
                  </div>
                  <div className="step-text">
                    <h3 className="step-title">{step.title}</h3>
                  </div>
                </div>
                <p className="step-description">{step.description}</p>
                {index !== steps.length - 1 && <div class="dashed-line"></div>}
              </div>
            ))}
          </div>
        </div> */}

        <div class="review-section-outer">
          <div class="page-width">
        <div class="review-section">
          <span class="review-text">Customer Review</span>
          <div className="review-icons">
            <a
              href="https://www.google.com/search?q=hora+services+bangalore&rlz=1C1CHZN_enIN1127IN1127&oq=&gs_lcrp=EgZjaHJvbWUqCQgGEEUYOxjCAzIJCAAQRRg7GMIDMgkIARBFGDsYwgMyCQgCEEUYOxjCAzIJCAMQRRg7GMIDMgkIBBBFGDsYwgMyCQgFEEUYOxjCAzIJCAYQRRg7GMIDMgkIBxBFGDsYwgPSAQwxMTEwNjAxMGowajeoAgiwAgE&sourceid=chrome&ie=UTF-8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={googleIcon}
                alt="Google Icon"
                className="icon2"
                width={25}
                height={25}
              />
            </a>
            <a
              href="https://www.instagram.com/p/C_FnEI7s0sv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={instagramIcon}
                alt="Instagram Icon"
                className="icon2"
                width={25}
                height={25}
              />
            </a>
          </div>
        </div>

        <div className="carousel-container_review">
          <Slider {...settings3}>
            {reviews.map((review, index) => (
              <div key={index} className="review-card_review">
                <div className="review-header_review">
                  <Image
                    src={review.image}
                    alt={review.name}
                    // className="review-image_review"
                    width={280}
                  height={180}
                  />
                  <h3 className="review-name_review">{review.name}</h3>
                </div>
                <div className="review-rating_review">
                  {"⭐".repeat(review.rating)}
                </div>
                <p className="review-description_review">
                  {review.description}
                </p>
              </div>
            ))}
          </Slider>
        </div>
        </div>
        </div>
        {/* video secetion */}

        <div class="review-section-outer">
          <div class="page-width">
        <div
          style={{
            width: "100%",
            height: "auto",
          }}
          className="video-review"
        >
          <Slider {...settings2}>
            {videos.map((video, index) => (
              <div key={index}>
                <video
                  controls
                  style={{
                    width: "100%",
                  
                    objectFit: "cover",
                  }}
                >
                  <source src={video.src} type={video.type} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </Slider>
        </div>
        </div>
            </div>
            </div>
      </div>
    </>
  );
};

export default FoodDelivery;