"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import ImageGallery from '../poses-gallery/ImageGallery'; // Import the ThumbnailGallery component
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
                <ImageGallery folderName={folderName} customerId={customerId} handleShareicon={handleShareicon} />

    </div>
  );
};

export default PhotoGallery;
