"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import ThumbnailGallery from './ThumbnailGallery';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TopBanner from "@/components/PhotoGalleryPose/TopBanner";
import ChatBanner from "@/components/PhotoGalleryPose/ChatBanner";
import PlanningCard from "@/components/PhotoGalleryPose/PlanningCard";
import PhotogalleryCTA from "@/components/PhotoGalleryPose/PhotogalleryCTA";
import CaptureMomentCard from "@/components/PhotoGalleryPose/CaptureMomentCard";
import TrustedPeopleCard from "@/components/PhotoGalleryPose/TrustedPeopleCard";
import LovePosesBanner from "@/components/PhotoGalleryPose/LovePosesBanner";
import WhyChooseHora from "@/components/PhotoGalleryPose/WhyChooseHora";
import InstagramGalleryCTA from "@/components/PhotoGalleryPose/InstagramGalleryCTA";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import Gift from "@/assets/poselink/Gift.svg";
import Planingbanner from "@/assets/poselink/planingbanner.webp";
import image1 from "@/assets/poselink/image1.jpeg";
import image2 from "@/assets/poselink/image2.jpeg";
import collageImage from "@/assets/poselink/collageImage.webp"
import trustimage from "@/assets/poselink/trustedimage.webp";
import { getBannerConfig, getPlanningCardData, getTrustedCardData } from "@/utils/bannerConfig";
import { getPhotoCategoryUrl } from "@/utils/Getphotocategoryurl.js"; 
import { reviewsData } from "@/utils/poselinkreviews";
import Head from "next/head";

const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get('folderName');
  const customerId = urlParams.get('customerId');
  const router = useRouter();

  const bannerConfig = getBannerConfig(folderName);
    const planningCardData = getPlanningCardData(folderName);
 const trustedData = getTrustedCardData(folderName); 

  // ✅ Ek baar calculate karo — sabhi buttons isko use karenge
  const categoryUrl = getPhotoCategoryUrl(folderName);

  const handleShareicon = async () => {
    const shareUrl = `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(folderName)
      .replace(/%20/g, "%2520")}&customerId=${customerId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Photo Gallery",
          text: "Check out these photos!",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };
const bannerData = {
    title: planningCardData.title,           // ✅ dynamic — "Planning Wedding?" etc.
    description: planningCardData.description, // ✅ dynamic
    buttonText: "View Packages",
    image: Planingbanner,
    icon: Gift,
    redirectUrl: categoryUrl,
  };

  const galleryBanners = [
    <PlanningCard
      key="planning"
      title={bannerData.title}
      description={bannerData.description}
      buttonText={bannerData.buttonText}
      image={bannerData.image}
      icon={bannerData.icon}
      onClick={() => router.push(categoryUrl)} 
    />,
    <CaptureMomentCard
      key="capture"
      price="24,000"
      onBookNow={() => router.push(categoryUrl)} 
    />,
    <TrustedPeopleCard
  key="trusted"
  collageImage={collageImage}
  title={trustedData.title}
  onClick={() => router.push(categoryUrl)}
/>,
    <LovePosesBanner
      key="love"
      onClick={() => router.push(categoryUrl)} 
    />,
    <WhyChooseHora key="whychoose" />,
  
  ];

  return (
    <div className="photo-container" style={{ padding: "8px", maxWidth: "480px", margin: "auto", paddingBottom: "10px" }}>
 <Head>
  <title>
    {bannerConfig.title
      ? `${bannerConfig.title} Poses & Photography Ideas | Book Photographer | HORA`
      : `Professional Photography Poses & Ideas | Book Photographer | HORA`}
  </title>

  <meta
    name="description"
    content={
      bannerConfig.title
        ? `Explore 2500+ ${bannerConfig.title} poses and book the best photographer for your ${bannerConfig.title} event. Trusted by 10,000+ people. 100+ expert photographers. Book HORA now.`
        : `Explore 2500+ photography poses for weddings, birthdays, maternity & more. Book expert photographers across India. Trusted by 10,000+ people. Book HORA now.`
    }
  />

  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />

  <link
    rel="canonical"
    href={
      folderName
        ? `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(folderName)}`
        : `https://horaservices.com/photo-gallery`
    }
  />

  <link
    rel="icon"
    href="https://horaservices.com/api/uploads/logo-icon.png"
  />

  <meta
    property="og:title"
    content={
      bannerConfig.title
        ? `${bannerConfig.title} Poses & Photography Ideas | HORA`
        : `Professional Photography Poses & Ideas | HORA`
    }
  />

  <meta
    property="og:description"
    content={
      bannerConfig.title
        ? `Book photographers for ${bannerConfig.title} events. 2500+ pose ideas, 100+ expert photographers.`
        : `Book photographers for weddings, birthdays & events across India.`
    }
  />

  <meta
    property="og:url"
    content={
      folderName
        ? `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(folderName)}`
        : `https://horaservices.com/photo-gallery`
    }
  />

  <meta property="og:type" content="website" />

  <meta
    property="og:image"
    content={bannerConfig.backgroundImage || "https://horaservices.com/api/uploads/attachment-1711520474508.png"}
  />

  <meta name="twitter:card" content="summary_large_image" />

  <meta
    name="twitter:title"
    content={
      bannerConfig.title
        ? `${bannerConfig.title} Poses & Photography Ideas | HORA`
        : `Professional Photography Poses & Ideas | HORA`
    }
  />

  <meta
    name="twitter:description"
    content={
      bannerConfig.title
        ? `${bannerConfig.title} photography poses & booking. Trusted by 10,000+ people.`
        : `Photography poses & booking for all events across India.`
    }
  />

  <meta
    name="twitter:image"
    content={bannerConfig.backgroundImage || "https://horaservices.com/api/uploads/attachment-1711520474508.png"}
  />
</Head>
      <TopBanner
        backgroundImage={bannerConfig.backgroundImage}
        highlightText={bannerConfig.highlightText}
        title={bannerConfig.title}
        description={bannerConfig.description}
        ctaText={bannerConfig.ctaText}
        onCtaClick={() => router.push(categoryUrl)} // ✅ dynamic
      />

     <ChatBanner
  title={planningCardData.chatTitle}
  onChatClick={() =>
    window.open(
      `https://wa.me/7338584828?text=${encodeURIComponent(
        "Hi, I'm interested in your photography services. Please share your packages, pricing, and availability."
      )}`,
      "_blank"
    )
  }
/>

      <ThumbnailGallery
        folderName={folderName}
        customerId={customerId}
        handleShareicon={handleShareicon}
        banners={galleryBanners}
        bannerInterval={6}
      />
 {/* <InstagramGalleryCTA
      key="instagram"
      onFollow={() => window.open("https://instagram.com")}
      onViewMore={() => window.open("https://instagram.com")}
    />, */}

   <GoogleReviewsCard reviews={reviewsData} />
 
      {/* ✅ Sticky bottom CTA */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        zIndex: 99,
        backgroundColor: "#fff",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}>
        <PhotogalleryCTA
          image1={image1}
          image2={image2}
          onBookNow={() => router.push(categoryUrl)} // ✅ dynamic
        />
      </div>

    </div>
  );
};

export default PhotoGallery;