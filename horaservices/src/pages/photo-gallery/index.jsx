"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import ThumbnailGallery from './ThumbnailGallery'; // Import the ThumbnailGallery component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import shareIcon from '../../assets/share-photo-icon.png'
import OtpLoginPopup from '../../components/OtpLoginPopup';
import TopBanner from "@/components/PhotoGalleryPose/TopBanner";
import ChatBanner from "@/components/PhotoGalleryPose/ChatBanner";
import PlanningCard from "@/components/PhotoGalleryPose/PlanningCard";
import PhotogalleryCTA from "@/components/PhotoGalleryPose/PhotogalleryCTA";
import CaptureMomentCard from "@/components/PhotoGalleryPose/CaptureMomentCard";
import TrustedPeopleCard from "@/components/PhotoGalleryPose/TrustedPeopleCard";
import LovePosesBanner from "@/components/PhotoGalleryPose/LovePosesBanner";
import WhyChooseHora from "@/components/PhotoGalleryPose/WhyChooseHora";

const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get('folderName');
  const customerId = urlParams.get('customerId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State for login status
  const router = useRouter();

  

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
  image: "/images/package-box.webp",
  icon: "/images/gift-icon.webp",
  redirectUrl: "/photography",
};
  return (
    <div className="photo-container ">
  
    <TopBanner/>
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
  image1="/poses/pose1.webp"
  image2="/poses/pose2.webp"
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
      {/* {isLoggedIn ? (
        folderName && customerId ? (
          <ThumbnailGallery folderName={folderName} customerId={customerId} />
        ) : (
          <p>Please provide the folder and customer ID in the URL.</p>
        )
      ) : (
        isModalOpen && <OtpLoginPopup setIsModalOpen={setIsModalOpen} />
      )} */}
                <ThumbnailGallery folderName={folderName} customerId={customerId} handleShareicon={handleShareicon} />

    </div>
  );
};

export default PhotoGallery;
