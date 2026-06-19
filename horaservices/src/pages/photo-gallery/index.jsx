"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import ThumbnailGallery from './ThumbnailGallery';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import shareIcon from '../../assets/share-photo-icon.png';
import OtpLoginPopup from '../../components/OtpLoginPopup';
import TopBanner from "@/components/PhotoGalleryPose/TopBanner";
import ChatBanner from "@/components/PhotoGalleryPose/ChatBanner";
import PlanningCard from "@/components/PhotoGalleryPose/PlanningCard";
import PhotogalleryCTA from "@/components/PhotoGalleryPose/PhotogalleryCTA";
import CaptureMomentCard from "@/components/PhotoGalleryPose/CaptureMomentCard";
import TrustedPeopleCard from "@/components/PhotoGalleryPose/TrustedPeopleCard";
import LovePosesBanner from "@/components/PhotoGalleryPose/LovePosesBanner";
import WhyChooseHora from "@/components/PhotoGalleryPose/WhyChooseHora";
import Gift from "@/assets/poselink/Gift.svg";
import Planingbanner from "@/assets/poselink/planingbanner.webp";
import image1 from "@/assets/poselink/image1.jpeg";
import image2 from "@/assets/poselink/image2.jpeg";
import { getBannerConfig } from "@/utils/bannerConfig"; // ✅ alag file se
import InstagramGalleryCTA from "@/components/PhotoGalleryPose/InstagramGalleryCTA";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import review1 from "@/assets/poselink/wedding-bg.webp";
import review2 from "@/assets/poselink/maternity-bg.webp";
import review3 from "@/assets/poselink/birthday-bg.webp";
const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get('folderName');
  const customerId = urlParams.get('customerId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // ✅ Ek line mein poora config — backgroundImage dynamic, baaki fixed
  const bannerConfig = getBannerConfig(folderName);

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
    title: "Planning wedding?",
    description: "See photography packages curated for your big day.",
    buttonText: "View Packages",
    image: Planingbanner,
    icon: Gift,
    redirectUrl: "/photography",
  };

  return (
    <div className="photo-container ">

      <TopBanner
        backgroundImage={bannerConfig.backgroundImage}
        highlightText={bannerConfig.highlightText}
        title={bannerConfig.title}
        description={bannerConfig.description}
        ctaText={bannerConfig.ctaText}
        onCtaClick={() => router.push(bannerConfig.ctaUrl)}
      />

      <ChatBanner
        onChatClick={() => {
          window.open(
            "https://wa.me/919999999999",
            "_blank"
          );
        }}
      />

      <PlanningCard
        title={bannerData.title}
        description={bannerData.description}
        buttonText={bannerData.buttonText}
        image={bannerData.image}
        icon={bannerData.icon}
        onClick={() => router.push(bannerData.redirectUrl)}
      />

      <PhotogalleryCTA
        image1={image1}
        image2={image2}
        onBookNow={() => router.push("/photography")}
      />

      <CaptureMomentCard
        price="24,000"
        onBookNow={() => console.log("book")}
      />

      <TrustedPeopleCard
        collageImage="/images/photo-collage.webp"
        onClick={() => router.push("/photography")}
      />

      <LovePosesBanner
        onClick={() => router.push("/photography")}
      /> 

      <WhyChooseHora />

     

      <ThumbnailGallery folderName={folderName} customerId={customerId} handleShareicon={handleShareicon} />
<InstagramGalleryCTA
 
  onFollow={() => window.open("https://instagram.com")}
  onViewMore={() => window.open("https://instagram.com")}
/>
<GoogleReviewsCard
  reviews={[
    {
      image: review1,
      name: "Mohit Sharma",
      review:
        "You guy did a very great job in preparing everything so quick and making my event happen!",
    },
    {
      image: review2,
      name: "Mohit Sharma",
      review:
        "You guy did a very great job in preparing everything so quick and making my event happen!",
    },
    {
      image: review3,
      name: "Mohit Sharma",
      review:
        "You guy did a very great job in preparing everything so quick and making my event happen!",
    },
  ]}
/>
    </div>
  );
};

export default PhotoGallery;