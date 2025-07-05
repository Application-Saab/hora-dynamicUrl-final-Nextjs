"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import ThumbnailGallery from './ThumbnailGallery'; // Import the ThumbnailGallery component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import shareIcon from '../../assets/share-photo-icon.png'
import OtpLoginPopup from '../../components/OtpLoginPopup';

const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get('folderName');
  const customerId = urlParams.get('customerId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State for login status
  const router = useRouter();

  console.log(folderName, "foldrenmae");
  console.log(customerId, "customerId");

  useEffect(() => {
  if (!folderName || !customerId) return;

  const start = Date.now();

  // 1️⃣ Push visit event (no userId)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "photo_gallery_visit",
    folderName,
    customerId,
    timestamp: new Date().toISOString(),
  });

  console.log(window.dataLayer, "dataLayer");

  // 2️⃣ Push time spent event
  const handleUnload = () => {
    const duration = Math.floor((Date.now() - start) / 1000);
    window.dataLayer.push({
      event: "photo_gallery_time_spent",
      folderName,
      customerId,
      duration,
      timestamp: new Date().toISOString(),
    });
  };

  console.log(window.dataLayer, "dataLayer on unload");

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, [folderName, customerId]);

  

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

  return (
    <div className="photo-container p-3">
  

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
