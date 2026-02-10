"use client";
import React, { useState, useEffect } from "react";
import {
BASE_URL,
PAYMENT_STATUS,
UPDATE_ORDER_STATUS,
} from "../utils/apiconstants";
import axios from "axios";
import { getHomeOrganizationSchema } from "../utils/schema";
import { useRouter } from "next/navigation";
import Image from "next/image";

import "./home.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import sparkle from "@/assets/Home/sparkle.png"
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Decoration from "@/assets/Home/Decoration.svg";
import PhotoGraphy from "@/assets/Home/Photography.svg";
import ChefForParty from "@/assets/Home/ChefForParty.svg";
import BulkFoodDelivery from "@/assets/Home/BulkFoodDelivery.svg";
import Entertainment from "@/assets/Home/Entertainment.svg";
import LiveCatering from "@/assets/Home/LiveCatering.svg";
import Homevideo from '@/assets/Home/HomeVideo.mp4';
import Photographybanner from '@/assets/Home/Photographybanner.jpg'
import decorationbanner from '@/assets/Home/decorationbanner.jpg'
import chefforparty from "@/assets/Home/chefforparty.jpg"
import partyfood from "@/assets/Home/partyfood.jpg"
import photo1 from "@/assets/Home/photo1.svg"
import photo2 from "@/assets/Home/photo2.svg"
import photo3 from "@/assets/Home/photo3.svg"
import ReviewSlider from "@/components/ReviewSection";
import { balloonreviews } from "@/utils/balloonReviews";
export default function Home() {
const router = useRouter();
const pathname = usePathname();
// useEffect(() => {
//   const blockContextMenu = (e) => e.preventDefault();
//   const blockKeys = (e) => {
//     const key = e.key.toLowerCase();
//     if (
//       e.ctrlKey && (key === 'u' || key === 's') || // Ctrl+U, Ctrl+S
//       (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'c')) || // Ctrl+Shift+I, C
//       key === 'f12'
//     ) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//   };
//   const blockDrag = (e) => e.preventDefault();

//   document.addEventListener("contextmenu", blockContextMenu);
//   document.addEventListener("keydown", blockKeys);
//   document.addEventListener("dragstart", blockDrag);

//   return () => {
//     document.removeEventListener("contextmenu", blockContextMenu);
//     document.removeEventListener("keydown", blockKeys);
//     document.removeEventListener("dragstart", blockDrag);
//   };
// }, []);

//  useEffect(() => {
//     const blockContextMenu = (e) => e.preventDefault();
//     const blockKeys = (e) => {
//       const key = e.key;
//       const combo = `${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${key}`;

//       const blockedCombos = ["F12", "Ctrl+Shift+I", "Ctrl+U", "Ctrl+Shift+C", "Ctrl+S"];
//       if (blockedCombos.includes(key) || blockedCombos.includes(combo)) {
//         e.preventDefault();
//       }
//     };

//     document.addEventListener("contextmenu", blockContextMenu);
//     document.addEventListener("keydown", blockKeys);

//     return () => {
//       document.removeEventListener("contextmenu", blockContextMenu);
//       document.removeEventListener("keydown", blockKeys);
//     };
//   }, []);

  // ✅ Disable image dragging & text selection
  // useEffect(() => {
  //   const style = document.createElement('style');
  //   style.innerHTML = `
  //     * {
  //       -webkit-user-select: none !important;
  //       -moz-user-select: none !important;
  //       -ms-user-select: none !important;
  //       user-select: none !important;
  //       -webkit-touch-callout: none !important;
  //     }
  //     img {
  //       pointer-events: none !important;
  //       -webkit-user-drag: none !important;
  //     }
  //   `;
  //   document.head.appendChild(style);
  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);

useEffect(() => {
  // Google Tag Manager script for GTM
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
    console.log('GTM Script Loaded'); // Debugging log
  })(window,document,'script','dataLayer','GTM-K3SCKLTZ');
}, []);

 useLayoutEffect(() => {
    // reset any scroll lock
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.overflow = "";

    // force scroll to top
    window.scrollTo(0, 0);

    console.log("scrolling page");
  }, [pathname]);
const photographyUrl = () =>{
  window.open(
    'https://api.whatsapp.com/send?phone=917338584828&text=I%20wanted%20to%20know%20about%2C%20photography',
    '_blank'
  );
}
const schemaOrg = getHomeOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);


useEffect(() => {
const checkPaymentStatus = async (transactionId) => {
  try {
    const storedUserID = await localStorage.getItem("userID");
    const apiUrl = BASE_URL + PAYMENT_STATUS + "/" + transactionId;

    const response = await axios.post(
      apiUrl,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.message) {
      const message = response.data.message;

      if (message === "PAYMENT_SUCCESS") {
        const url = BASE_URL + UPDATE_ORDER_STATUS;

        const token = await localStorage.getItem("token");

        const requestData = {
          status: 1,
          _id: transactionId,
        };

        const response = await axios.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        });

        router.push("/Success");
      } else {
        router.push("/Failure");
      }
    } else {
      console.log("API response does not contain a message field");
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

const queryParams = new URLSearchParams(window.location.search);
const transactionId = queryParams.get("transaction")
if(transactionId) {
      router.replace(`/?transaction=${transactionId}`)
    }

if (transactionId) {
  checkPaymentStatus(transactionId);
}
}, [router]);
const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

 

  const handleTitleClick = (title) => {
    // Trigger GTM event when the user clicks on the title
    sendGTMEvent('event', 'titleClicked', { value: title });
  }




const handleContactClick = () => {
  window.open(
    "https://wa.me/917338584828?text=Hi%2C%20I%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20decoration%20services.",
    "_blank"
  );
};


  return (
    <div className="home-wrapper">
 <head>
    <title>HORA : One-Stop Party Planning: Customise, Create, Book</title>
    <meta name="description" content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨" />
    <meta name="keywords" content="Personal chef, private chef to cook in home in India, home chef, book a cook near you, chef at home, Private cook in Mumbai, Book a cook for home near you, Hire Chef in Bangalore, Private Chef in Delhi, Catering service, balloon, decoration, celebration, party, birthday, anniversary, decorator, candle light dinner,  surprises, couples, bouquets , online caterers, catering services, best caterers, birthday party catering, birthday caterers, party catering, home catering, corporate catering, caterers for small parties, wedding caterers" />

    <meta property="og:title" content="HORA : One-Stop Party Planning: Customise, Create, Book" />
    <meta property="og:description" content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨" />
    
    <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1711520474508.png" />
    <meta property="og:image:alt" content="Elegant balloon decoration setup by Hora Decorations" />

    <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706459457063.png" />
    <meta property="og:image:alt" content="Beautiful floral arrangement for events by Hora Decorations" />

    <meta property="og:image" content="  https://horaservices.com/api/uploads/homepage_whatareu4.webp" />
    <meta property="og:image:alt" content="Beautiful food for events by Hora Caterers" />

    <meta property="og:image" content="https://horaservices.com/api/uploads/homepage_whatareu2.webp" />
    <meta property="og:image:alt" content="best food and chef for parties by Hora Kitchen" />
    <script type="application/ld+json">{scriptTag}</script>
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Hora Services" />
    <meta property="og:url" content="https://horaservices.com" />
    <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
    <meta property="og:type" content="website" />
</head>
      {/* TOP BANNER */}
      <div className="top-banner">
      <video
        src={Homevideo}
        autoPlay
        muted
        loop
        playsInline
        className="top-banner-video"
      />
    </div>

      {/* HEADING */}
      <div className="section-heading">
      <h2 class="heading">
  <Image
    src={sparkle}
    alt="icon"
    class="heading-icon"
  />
  What are you into?
</h2>

        <p>Choose what you need. We'll handle the rest</p>
      </div>

{/* CARD 1 - LEFT IMAGE */}

<div
  className="feature-card left-img"
  onClick={() => router.push("/balloon-decoration")}
  role="button"
  tabIndex={0}
>
  <Image src={decorationbanner} alt="Decoration" className="card-bg-img" />
  <div className="card-content">
    <h3>DECORATION</h3>
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push("/balloon-decoration");
      }}
    >
      Explore Designs
    </button>
  </div>
</div>

{/* CARD 2 - RIGHT IMAGE */}

<div
  className="feature-card right-img"
  role="button"
  tabIndex={0}
  onClick={() => router.push("/photography-page")}
  onKeyDown={(e) => e.key === "Enter" && router.push("/photography-page")}
>
  <Image src={Photographybanner} alt="Photography" className="card-bg-img" />
  <div className="card-content">
    <h3>PHOTOGRAPHY</h3>
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push("/photography-page");
      }}
    >
      Explore Packages
    </button>
  </div>
</div>
{/* CARD 3 - LEFT IMAGE */}

<div
  className="feature-card left-img"
  role="button"
  tabIndex={0}
  onClick={() =>
    router.push("/party-food-delivery-live-catering-buffet/party-food-delivery")
  }
  onKeyDown={(e) =>
    e.key === "Enter" &&
    router.push(
      "/party-food-delivery-live-catering-buffet/party-food-delivery"
    )
  }
>
  <Image src={partyfood} alt="Party Food" className="card-bg-img" />
  <div className="card-content">
    <h3>PARTY FOOD</h3>
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push(
          "/party-food-delivery-live-catering-buffet/party-food-delivery"
        );
      }}
    >
      Explore Packages
    </button>
  </div>
</div>
{/* CARD 4 - RIGHT IMAGE */}
<div
  className="feature-card right-img"
  role="button"
  tabIndex={0}
  onClick={() => router.push("/book-chef-cook-for-party")}
  onKeyDown={(e) =>
    e.key === "Enter" && router.push("/book-chef-cook-for-party")
  }
>
  <Image src={chefforparty} alt="Chef" className="card-bg-img" />
  <div className="card-content">
    <h3>CHEF FOR PARTY</h3>
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push("/book-chef-cook-for-party");
      }}
    >
      Explore Dishes
    </button>
  </div>
</div>

<div className="why-hora">
  <h2 className="why-title">✨ Why Choose HORA?</h2>

  <div className="why-cards">
    <div className="why-card">
      <Image src={photo1} alt="One Stop Solution" />
      <p>One-Stop Solution</p>
    </div>

    <div className="why-card">
      <Image src={photo2} alt="Affordable Package" />
      <p>Affordable Package</p>
    </div>

    <div className="why-card">
      <Image src={photo3} alt="Trusted Professional" />
      <p>Trusted Professional</p>
    </div>
  </div>
</div>
<div className="btn-wrapper">
  <button className="contact-btn" onClick={handleContactClick} >
    Contact Us
  </button>
</div>
<ReviewSlider reviews={balloonreviews} title="Customer Reviews" />
 <div className="services-container">
      {/* Card 1 */}
      <div className="service-card">
        <Image src={Decoration} alt="Decoration" className="service-card-image" />
        <h3>Decoration</h3>
        <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
          1000+ unique designs – Birthdays, Anniversaries, Baby showers,
          Weddings, and more!
        </p>
        <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
          Get your venue decorated in just 2 hours, indoors or outdoors.
        </p>
         <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         Best prices, timely service, and support
        </p>
         <div className="package-wrapper">
        <button className="package-btn" onClick={() => router.push("/balloon-decoration")}>Explore Designs</button>
      </div>
      </div>

      {/* Card 2 */}
      <div className="service-card">
        <Image src={PhotoGraphy} alt="Photography" className="service-card-image" />
        <h3>Photography</h3>
       <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         100+ Professional Photographers – Best prices, timely service,
          expert support.
        </p>
       <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
        Life time photo storage
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         Best prices, timely service, and support
        </p>
         <div className="package-wrapper">
        <button className="package-btn"     onClick={() => router.push("/photography-page")}>Explore Packages</button>
      </div>
      </div>

      {/* Card 3 */}
      <div className="service-card">
        <Image src={ChefForParty} alt="Chef for Party" className="service-card-image" />
        <h3>Chef for Party</h3>
         <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
        HORA brings professional chefs to your kitchen
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         They use your ingredients and utensils
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         Experience 400 restaurant-style dishes.
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         Affordable & customizable.
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
       Full hygiene control.
        </p>
         <div className="package-wrapper">
        <button className="package-btn">Explore Dishes</button>
        </div>
      </div>

      {/* Card 4 */}
      <div className="service-card">
        <Image src={BulkFoodDelivery} alt="Bulk Food Delivery" className="service-card-image"  />
        <h3>Bulk Food Delivery</h3>
         <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
Enjoy food delivery with Hora </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
      Best prices , Timely service
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
      Delicious taste
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         Good Packing
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
      Guaranteed support
        </p>
        <div className="package-wrapper">
        <button className="package-btn"     onClick={() => router.push("/party-food-delivery-live-catering-buffet/party-food-delivery")}>Explore Packages</button>
     </div>
      </div>
          {/* Card 5 */}
      <div className="service-card">
        <Image src={Entertainment} alt="Bulk Food Delivery" className="service-card-image" />
        <h3>Entertainment</h3>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
     Make your event unforgettable by engaging your guests! ✨ Choose from over 10 amazing services
        </p>
        <p>
          🎨 Tattoo Artist , 🎩 Magician, 🎉 Party Host
        </p>
        <p>
          🐻 Mascot , 🌿 Mehandi , 💅 Nail Art ..and so much more!
        </p>
        <div className="package-wrapper">
        <button className="package-btn"   onClick={() => router.push("/balloon-decoration")}> Explore  More..</button>
      </div>
      </div>
          {/* Card 6 */}
          <div className="service-card">
        <Image src={LiveCatering} alt="Bulk Food Delivery" className="service-card-image" />
        <h3>Live Catering</h3>
         <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
       Best prices , Timely service
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
        Delicious taste
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
        Good packing
        </p>
          <p class="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         Guaranteed support
        </p>
        <div className="package-wrapper">
        <button className="package-btn"     onClick={() => router.push("/party-food-delivery-live-catering-buffet/party-live-buffet-catering")}>Explore Packages</button>
     </div>
      </div>
    </div>
    </div>
  );


}
