import { useState, useEffect, useCallback } from 'react'
import './photo.css'
import Head from "next/head";
import Image from 'next/image'
import axios from 'axios';
import { useRouter } from 'next/router';
import { getPhotographyOrganizationSchema } from "../../utils/schema";
import pose1 from "@/assets/poseimages/pose1.png"
import pose2 from "@/assets/poseimages/pose2.png"
import pose3 from "@/assets/poseimages/pose3.jpg"
import pose4 from "@/assets/poseimages/pose4.jpg"
import pose5 from "@/assets/poseimages/pose5.jpg"
import pose6 from "@/assets/poseimages/pose6.jpg"
import pose7 from "@/assets/poseimages/pose7.png"
import pose8 from "@/assets/poseimages/pose8.png"
import pose9 from "@/assets/poseimages/pose9.jpg"
import pose10 from "@/assets/poseimages/pose10.jpg"
import pose11 from "@/assets/poseimages/pose11.png"
import pose12 from "@/assets/poseimages/pose12.jpg"
import pose13 from "@/assets/poseimages/pose13.png"
import pose14 from "@/assets/poseimages/pose14.jpg"
import pose15 from "@/assets/poseimages/pose15.jpg"
import PhotoBanner from "../../assets/PhotoBanner.webp"
import Banner1 from "../../assets/banner1.webp"
import Banner2 from "../../assets/Banner2.webp"
import Banner3 from "../../assets/banner3.webp"

import photo1 from "@/assets/cardphoto/photo1.jpg"
import photo2 from "@/assets/cardphoto/photo2.jpg"
import photo3 from "@/assets/cardphoto/photo3.jpg"
import photo4 from "@/assets/cardphoto/photo4.jpg"
import photo5 from "@/assets/cardphoto/photo5.jpg"
import photo6 from "@/assets/cardphoto/photo6.jpg"
import photo7 from "@/assets/cardphoto/photo7.jpg"
import photo8 from "@/assets/cardphoto/photo8.jpg"
import photo9 from "@/assets/cardphoto/photo9.jpg"
import photo10 from "@/assets/cardphoto/photo10.png"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import google from "../../assets/google.jpg";
import PhotoGraphyCard from '@/components/PhotoGraphyCard';
import PhotoGraphyCardgrid from '@/components/photoGraphyCardGrid';
import PhotographysliderSection from '@/components/photographysliderSection';
import {photoCat}  from "@/utils/photoCategories.js";
const index = () => {

  const router = useRouter();


 
const firePoseClickEvent = (poseCategory) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "pose_card_click",   
    eventCategory: "pose_click",
    eventAction: "click",
    eventLabel: poseCategory,   
  });
};

  const bannerImages = [
    Banner1,
    Banner2,
    Banner3,
  ];

  const reviews = [
    {
      text: "Service is very good. We really liked every service. We took decoration photography and food service. Decoration done in 1hr. Photographer reached 20min before. Food delivered 30min before. Everything happened before time and was perfect.",
      author: "Saravani A"
    },
    {
      text: "All the service provided by HORA including decoration and photography done by Mr. Naveen kumar were up to the mark. Thankyou so much for making our baby shower program memorable. Would definitely recommend for decoration and photography.",
      author: "Shilpa Raha"
    },
    {
      text: "The Best Services! I never knew or heard about them, just tried to take photography services n booked it. Especially, The photographer Mr. Devendra! Such a down to earth, friendly n professional men. I was so happy about his services n behaviour!! If you wanna try... Close you eyes n book them!! Highly recommend!",
      author: "Umesh K"
    },
    {
      text: "Hora makes our life easy in simple partying.. it's great I found Hora... Every service team is excellent in doing there jobs. Mr Mitesh photography did his job ",
      author: "Anusha Battiprolu"
    }
  ];
  
const cards = [
  { src: photo1, title: "Birthday Photography" },
  { src: photo2, title: "Anniversary Photography" },
  { src: photo3, title: "House warming Photography" },
  { src: photo4, title: "Naming ceremony Photography" },
  { src: photo5, title: "Bachelorette Photography" },
  { src: photo6, title: "Baby Shower Photography" },
];
const cardsgrid = [
  { src: photo7, title: "Engagement Photography" },
  { src: photo8, title: "Wedding Photography" },
  { src: photo9, title: "Maternity Photography" },
  { src: photo10, title: "New Born Baby Photography" },
];
  return (
    <>
      <div>
  
        <div className="party-services homeslider">
          <div className="image-banner-slider">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop={true}
            >
              {bannerImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image src={img} alt={`Banner ${index + 1}`} layout="responsive"
                    width={1200}
                    height={400}
                    quality={100}
                     loading="eager"
                    className="banner-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

   <div className="gridContainer">
  {photoCat.slice(0, 6).map((item) => (
    <PhotoGraphyCard
      key={item.id}
      src={item.image}
      title={item.name}
      subCategory={item.subCategory}
    />
  ))}
</div>

    
      
         {/* <PhotographysliderSection
        title="Standard Packages"
        tagId="66c96b2a22ed47b72117e089" 
      /> */}


    <div className="gridContainersec">
  {photoCat.slice(6, 10).map((item) => (
    <PhotoGraphyCardgrid
      key={item.id}
      src={item.image}
      title={item.name}
      subCategory={item.subCategory}
    />
  ))}
</div>

      
        <div class="suggested-poses">
          <div class="suggested-poses-section">
            <Image src={PhotoBanner} alt="Camera Holding" class="suggested-img" />
            <div class="text-overlay">
              <h2 class="pose-title">Suggested Poses</h2>
              <p class="pose-subtitle">Perfect for a relaxed and friendly vibe</p>
            </div>
          </div>
        </div>




        <div class="poses">

          <div class="pose-grid">
           <a
  href="https://horaservices.com/photo-gallery?folderName=Wedding&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Wedding")}
>
  <Image src={pose1} alt="Wedding" />
  <div className="TextBackground"><p>Wedding</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=maternity%20poses&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Maternity")}
>
  <Image src={pose2} alt="Maternity" />
  <div className="TextBackground"><p>Maternity</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=birthday%20poses&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Birthday")}
>
  <Image src={pose3} alt="Birthday" />
  <div className="TextBackground"><p>Birthday</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=pre%20wedding&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Pre-Wedding")}
>
  <Image src={pose4} alt="Pre-Wedding" />
  <div className="TextBackground"><p>Pre-Wedding</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=HaldiandMehendi&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Haldi/Mehndi")}
>
  <Image src={pose5} alt="HaldiMehndi" />
  <div className="TextBackground"><p>Haldi/Mehndi</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Babyshower")}
>
  <Image src={pose6} alt="Baby Shower" />
  <div className="TextBackground"><p>Babyshower</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Naming Ceremony")}
>
  <Image src={pose7} alt="Naming Ceremony" />
  <div className="TextBackground"><p>Naming Ceremony</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Couple shoot")}
>
  <Image src={pose8} alt="Couple shoot" />
  <div className="TextBackground"><p>Couple shoot</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("New Born Baby")}
>
  <Image src={pose9} alt="New Born Baby" />
  <div className="TextBackground"><p>New Born Baby</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Engagement")}
>
  <Image src={pose10} alt="Engagementr" />
  <div className="TextBackground"><p>Engagement</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Anniversary")}
>
  <Image src={pose11} alt="Anniversary" />
  <div className="TextBackground"><p>Anniversary</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("House warming")}
>
  <Image src={pose12} alt="House warming" />
  <div className="TextBackground"><p>House warming</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Bachelorate")}
>
  <Image src={pose13} alt="Bachelorate" />
  <div className="TextBackground"><p>Bachelorate</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Corporate")}
>
  <Image src={pose14} alt="Corporate" />
  <div className="TextBackground"><p>Corporate</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Model shoot")}
>
  <Image src={pose15} alt="Model shoot" />
  <div className="TextBackground"><p>Model shoot</p></div>
</a>

          </div>
        </div>

        <div class="trust-section">
          <h2 class="Trust-header" >Why People Trust Us <span>♥</span></h2>

          <div className="review">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              loop={true}
              spaceBetween={20}
              slidesPerView={1}
            >
              {reviews.map(({ text, author }, idx) => (
                <SwiperSlide key={idx}>
                  <p className="trust-subtitle">{author}</p>
                  <p className="review-text">{text}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>



  

          <div class="stats-grid">
            <div class="stat-box">
              <div class="rating-row">
                <Image src={google} alt="Google Icon" class="icon" />
                <strong>4.8</strong>
              </div>
              <p class="Text-google">Google Rating</p>
            </div>

            <div class="stat-box">
              <div class="photoD">
                <strong >50L+</strong>
                <div class="photos-title">Photos Delivered</div>
              </div>
            </div>

            <div class="stat-box full">
              <p><strong>15K+</strong><span class="highlight"> Happy Customers</span></p>
            </div>
          </div>
        </div>



   

      </div>
    </>
  );
};

export default index;