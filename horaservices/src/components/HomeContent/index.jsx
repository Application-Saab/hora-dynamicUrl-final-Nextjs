"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import "@/app/home.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import sparkle from "@/assets/Home/sparkle.png"

import { usePathname } from "next/navigation";
import Decoration from "@/assets/Home/Decoration.svg";
import PhotoGraphy from "@/assets/Home/Photography.svg";
import ChefForParty from "@/assets/Home/ChefForParty.svg";
import BulkFoodDelivery from "@/assets/Home/BulkFoodDelivery.svg";
import Entertainment from "@/assets/Home/Entertainment.svg";
import LiveCatering from "@/assets/Home/LiveCatering.svg";
import Homevideo from '../../../public/assets/Homevideo.mp4';
import Photographybanner from '@/assets/Home/Photographybanner.webp'
import decorationbanner from '@/assets/Home/decorationbanner.webp'
import chefforparty from "@/assets/Home/chefforparty.webp"
import partyfood from "@/assets/Home/partyfood.webp"
import photo1 from "@/assets/Home/photo1.svg"
import photo2 from "@/assets/Home/photo2.svg"
import photo3 from "@/assets/Home/photo3.svg"
import ReviewSlider from "@/components/ReviewSection";
import { balloonreviews } from "@/utils/balloonReviews";
import { openWhatsApp } from "@/utils/WhatsAppRedirection";

export default function HomeContent() {
const router = useRouter();

const pathname = usePathname();

// break URL into parts
const segments = pathname?.split("/")?.filter(Boolean) || [];

const city = segments[0] || null;
const locality = segments[1] || null;
const formatName = (value) =>
  value
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const goTo = (path) => {
  if (city && locality) {
    router.push(`/${city}/${locality}${path}`);
  } else if (city) {
    router.push(`/${city}${path}`);
  } else {
    router.push(path);
  }
};
const handleEntertainmentWhatsApp = () => {
  let locationText = "";

  if (city && locality) {
    locationText = ` in ${formatName(locality)}, ${formatName(city)}`;
  } else if (city) {
    locationText = ` in ${formatName(city)}`;
  }

  const message = `Hi, I’m interested in your Entertainment services${locationText}. Please share details.`;

  openWhatsApp(undefined, message);
};




const handleContactClick = () => {
  window.open(
    "https://wa.me/917338584828?text=Hi%2C%20I%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20decoration%20services.",
    "_blank"
  );
};


  return (
    <div className="home-wrapper">
 
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
      <h2 className="heading">
  <Image
    src={sparkle}
    alt="icon"
    className="heading-icon"
  />
  What are you into?
</h2>

        <p>Choose what you need. We'll handle the rest</p>
      </div>

{/* CARD 1 - LEFT IMAGE */}

<div
  className="feature-card left-img"
  onClick={() => goTo("/balloon-decoration")}
  role="button"
  tabIndex={0}
>
  <Image src={decorationbanner} alt="Decoration" className="card-bg-img" />
  <div className="card-content">
    <h3>DECORATION</h3>
    <button
      onClick={(e) => {
        goTo("/balloon-decoration");
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
  onClick={() => goTo("/photography-page")}
>
  <Image src={Photographybanner} alt="Photography" className="card-bg-img" />
  <div className="card-content">
    <h3>PHOTOGRAPHY</h3>
    <button
      onClick={(e) => {
     
       goTo("/photography-page")
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
    goTo("/party-food-delivery-live-catering-buffet")
  }
>
  <Image src={partyfood} alt="Party Food" className="card-bg-img" />
  <div className="card-content">
    <h3>PARTY FOOD</h3>
    <button
      onClick={(e) => {
       goTo("/party-food-delivery-live-catering-buffet/party-food-delivery")
      
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
  onClick={() => goTo("/book-chef-cook-for-party")}
 
>
  <Image src={chefforparty} alt="Chef" className="card-bg-img" />
  <div className="card-content">
    <h3>CHEF FOR PARTY</h3>
    <button
      onClick={(e) => {
        goTo("/book-chef-cook-for-party");
      }}
    >
      Explore Dishes
    </button>
  </div>
</div>

<div className="why-hora">
    <h2 className="why-title">
  <Image
    src={sparkle}
    alt="icon"
    className="heading-icon"
  />
 Why Choose HORA?
</h2>
  
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
        <p className="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
          1000+ unique designs – Birthdays, Anniversaries, Baby showers,
          Weddings, and more!
        </p>
        <p className="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
          Get your venue decorated in just 2 hours, indoors or outdoors.
        </p>
         <p className="points">
           <Image src={sparkle} alt="icon" class="points-icon" />
         Best prices, timely service, and support
        </p>
         <div className="package-wrapper">
        <button className="package-btn" onClick={() => goTo("/balloon-decoration")}>Explore Designs</button>
      </div>
      </div>

      {/* Card 2 */}
      <div className="service-card">
        <Image src={PhotoGraphy} alt="Photography" className="service-card-image" />
        <h3>Photography</h3>
       <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
         100+ Professional Photographers – Best prices, timely service,
          expert support.
        </p>
       <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
        Life time photo storage
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
         Best prices, timely service, and support
        </p>
         <div className="package-wrapper">
        <button className="package-btn"     onClick={() => goTo("/photography-page")}>Explore Packages</button>
      </div>
      </div>

      {/* Card 3 */}
      <div className="service-card">
        <Image src={ChefForParty} alt="Chef for Party" className="service-card-image" />
        <h3>Chef for Party</h3>
         <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
        HORA brings professional chefs to your kitchen
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
         They use your ingredients and utensils
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
         Experience 400 restaurant-style dishes.
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
         Affordable & customizable.
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
       Full hygiene control.
        </p>
         <div className="package-wrapper">
        <button className="package-btn" onClick={() => goTo("/book-chef-cook-for-party")}>Explore Dishes</button>
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
        <button className="package-btn"     onClick={() => goTo("/party-food-delivery-live-catering-buffet?type=bulkFood")}>Explore Packages</button>
     </div>
      </div>
          {/* Card 5 */}
      <div className="service-card">
        <Image src={Entertainment} alt="Bulk Food Delivery" className="service-card-image" />
        <h3>Entertainment</h3>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
     Make your event unforgettable by engaging your guests! ✨ Choose from over 10 amazing services
        </p>
        <p>
          🎨 Tattoo Artist , 🎩 Magician, 🎉 Party Host
        </p>
        <p>
          🐻 Mascot , 🌿 Mehandi , 💅 Nail Art ..and so much more!
        </p>
        <div className="package-wrapper">
        <button
  className="package-btn"
 onClick={handleEntertainmentWhatsApp}
>
  Explore More..
</button>

      </div>
      </div>
          {/* Card 6 */}
          <div className="service-card">
        <Image src={LiveCatering} alt="Bulk Food Delivery" className="service-card-image" />
        <h3>Live Catering</h3>
         <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
       Best prices , Timely service
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
        Delicious taste
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
        Good packing
        </p>
          <p className="points">
           <Image src={sparkle} alt="icon" className="points-icon" />
         Guaranteed support
        </p>
        <div className="package-wrapper">
        <button className="package-btn"     onClick={() => goTo("/party-food-delivery-live-catering-buffet?type=liveCatering")}>Explore Packages</button>
     </div>
      </div>
    </div>
    </div>
  );


}
