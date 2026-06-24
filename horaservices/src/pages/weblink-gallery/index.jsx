"use client";
import React from "react";
import ThumbnailGallery from './ThumbnailGallery'; // Import the ThumbnailGallery component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { trackShareCapsuleClick } from "@/services/weblinkServices";
import { BASE_URL } from "@/utils/apiconstants";

const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get('folderName');
  const customerId = urlParams.get('customerId');


  const handleShareicon = async (mainFolderId, shortCode) => {

    await trackShareCapsuleClick(mainFolderId);

    let linkToShare = "";

    if (shortCode) {
      linkToShare = `${BASE_URL}/eventcapsule/share/${shortCode}`;
    } else {
      linkToShare = `https://horaservices.com/weblink-gallery?folderName=${encodeURIComponent(folderName)
        .replace(/%20/g, "%2520")}&customerId=${customerId}`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Photo Gallery",
          text: "Check out these photos!",
          url: linkToShare,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(linkToShare);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="photo-container">
      <ThumbnailGallery folderName={folderName} customerId={customerId} handleShareicon={(id, shortCode) => handleShareicon(id, shortCode)} />
    </div>
  );
};

export default PhotoGallery;
