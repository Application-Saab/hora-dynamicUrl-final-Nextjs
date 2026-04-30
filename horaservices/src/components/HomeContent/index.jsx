"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import "@/app/home.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import sparkle from "@/assets/Home/sparkle.png"

import { usePathname } from "next/navigation";
import Decoration from "@/assets/Home/Decoration.webp";
import PhotoGraphy from "@/assets/Home/Photography.webp";
import ChefForParty from "@/assets/Home/ChefForParty.webp";
import BulkFoodDelivery from "@/assets/Home/BulkFoodDelivery.webp";
import Entertainment from "@/assets/Home/Entertainment.webp";
import LiveCatering from "@/assets/Home/LiveCatering.webp";
import Homevideo from '../../../public/assets/Homevideo.mp4';
import Photographybanner from '@/assets/Home/Photographybanner.webp'
import decorationbanner from '@/assets/Home/decorationbanner.webp'
import chefforparty from "@/assets/Home/chefforparty.webp"
import chef from '@/assets/Home/chef.webp'
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
      <h1 className="heading">
India’s One-Stop Party Services Platform
</h1>
      </div>

{/* CARD 1 - LEFT IMAGE */}

<div
  className="feature-card left-img"
  onClick={() => goTo("/balloon-decoration")}
  role="button"
  tabIndex={0}
>
  <Image src={decorationbanner} alt="balloon decoration for birthday party" className="card-bg-img" />
  <div className="card-content">
    <h2>DECORATION</h2>
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
  <Image src={Photographybanner} alt="professional event photography services" className="card-bg-img" />
  <div className="card-content">
    <h2>PHOTOGRAPHY</h2>
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
  <Image src={partyfood} alt="party food delivery and catering" className="card-bg-img" />
  <div className="card-content">
    <h2>PARTY FOOD</h2>
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
  <Image src={chefforparty} alt="chef for party at home in India" className="card-bg-img" />
  <div className="card-content">
    <h2>CHEF FOR PARTY</h2>
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
    alt=""
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
<ReviewSlider reviews={balloonreviews} title="What Our Customers Say About HORA" />
 <div className="services-container">
      {/* Card 1 */}
      <div className="service-card">
        <Image src={Decoration} alt="party decoration packages by HORA" className="service-card-image" />
        <h2>Decoration</h2>
        <p className="points">
           <Image src={sparkle} alt="" class="points-icon" />
          1000+ unique designs – Birthdays, Anniversaries, Baby showers,
          Weddings, and more!
        </p>
        <p className="points">
           <Image src={sparkle} alt="" class="points-icon" />
          Get your venue decorated in just 2 hours, indoors or outdoors.
        </p>
         <p className="points">
           <Image src={sparkle} alt="" class="points-icon" />
         Best prices, timely service, and support
        </p>
         <div className="package-wrapper">
        <button className="package-btn" onClick={() => goTo("/balloon-decoration")}>Explore Designs</button>
      </div>
      </div>

      {/* Card 2 */}
      <div className="service-card">
        <Image src={PhotoGraphy} alt="photography packages for parties and events" className="service-card-image" />
        <h2>Photography</h2>
       <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
         100+ Professional Photographers – Best prices, timely service,
          expert support.
        </p>
       <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
        Life time photo storage
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
         Best prices, timely service, and support
        </p>
         <div className="package-wrapper">
        <button className="package-btn"     onClick={() => goTo("/photography-page")}>Explore Packages</button>
      </div>
      </div>

      {/* Card 3 */}
      <div className="service-card">
        <Image src={chef} alt="private chef service for parties" className="service-card-image" />
        <h2>Chef for Party</h2>
         <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
        HORA brings professional chefs to your kitchen
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
         They use your ingredients and utensils
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
         Experience 400 restaurant-style dishes.
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
         Affordable & customizable.
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
       Full hygiene control.
        </p>
         <div className="package-wrapper">
        <button className="package-btn" onClick={() => goTo("/book-chef-cook-for-party")}>Explore Dishes</button>
        </div>
      </div>

      {/* Card 4 */}
      <div className="service-card">
        <Image src={BulkFoodDelivery} alt="bulk food delivery for parties" className="service-card-image"  />
        <h2>Bulk Food Delivery</h2>
         <p class="points">
           <Image src={sparkle} alt="" class="points-icon" />
Enjoy food delivery with Hora </p>
          <p class="points">
           <Image src={sparkle} alt="" class="points-icon" />
      Best prices , Timely service
        </p>
          <p class="points">
           <Image src={sparkle} alt="" class="points-icon" />
      Delicious taste
        </p>
          <p class="points">
           <Image src={sparkle} alt="" class="points-icon" />
         Good Packing
        </p>
          <p class="points">
           <Image src={sparkle} alt="" class="points-icon" />
      Guaranteed support
        </p>
        <div className="package-wrapper">
        <button className="package-btn"     onClick={() => goTo("/party-food-delivery-live-catering-buffet?type=bulkFood")}>Explore Packages</button>
     </div>
      </div>
          {/* Card 5 */}
      <div className="service-card">
        <Image src={Entertainment} alt="party entertainment services" className="service-card-image" />
        <h2>Entertainment</h2>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
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
        <Image src={LiveCatering} alt="live catering and buffet service" className="service-card-image" />
        <h2>Live Catering</h2>
         <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
       Best prices , Timely service
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
        Delicious taste
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
        Good packing
        </p>
          <p className="points">
           <Image src={sparkle} alt="" className="points-icon" />
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
