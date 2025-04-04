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

  // useEffect(() => {
  //   // Check localStorage or a cookie for login status, or call an API
  //   const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true'; // Check login status
  //   setIsLoggedIn(loggedInStatus); // Update state based on login status
  //   if (!loggedInStatus) {
  //     setIsModalOpen(true); // Open modal if not logged in
  //   }
  //   setLoading(false); // Done with loading
  // }, []); // Run once when component mounts

  // useEffect(() => {
  //   // If logged in, close the modal
  //   if (isLoggedIn) {
  //     setIsModalOpen(false);
  //   }
  // }, [isLoggedIn]); // This will run when `isLoggedIn` state changes


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
    <div className="photo-container">
      <div className="photo-galary-header">
        <h2 className="title">Your Photos</h2>
        <Image
          src={shareIcon}
          alt="Info"
          style={{ height: 20, width: 20, marginRight: 10, cursor: 'pointer' }}
          onClick={handleShareicon}
        />
      </div>

      {/* {isLoggedIn ? (
        folderName && customerId ? (
          <ThumbnailGallery folderName={folderName} customerId={customerId} />
        ) : (
          <p>Please provide the folder and customer ID in the URL.</p>
        )
      ) : (
        isModalOpen && <OtpLoginPopup setIsModalOpen={setIsModalOpen} />
      )} */}
                <ThumbnailGallery folderName={folderName} customerId={customerId} />

    </div>
  );
};

export default PhotoGallery;
