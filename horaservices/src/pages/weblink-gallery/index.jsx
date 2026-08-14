// "use client";
// import React from "react";
// import ThumbnailGallery from './ThumbnailGallery'; // Import the ThumbnailGallery component
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { trackShareCapsuleClick } from "@/services/weblinkServices";
// import { BASE_URL } from "@/utils/apiconstants";

// const PhotoGallery = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const folderName = urlParams.get('folderName');
//   const customerId = urlParams.get('customerId');


//   const handleShareicon = async (mainFolderId, shortCode) => {

//     await trackShareCapsuleClick(mainFolderId);

//     let linkToShare = "";

//     if (shortCode) {
//       linkToShare = `${BASE_URL}/eventcapsule/share/${shortCode}`;
//     } else {
//       linkToShare = `https://horaservices.com/weblink-gallery?folderName=${encodeURIComponent(folderName)
//         .replace(/%20/g, "%2520")}&customerId=${customerId}`;
//     }

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Photo Gallery",
//           text: "Check out these photos!",
//           url: linkToShare,
//         });
//       } catch (error) {
//         console.error("Error sharing:", error);
//       }
//     } else {
//       navigator.clipboard.writeText(linkToShare);
//       alert("Link copied to clipboard!");
//     }
//   };

//   return (
//     <div className="photo-container">
//       <ThumbnailGallery folderName={folderName} customerId={customerId} handleShareicon={(id, shortCode) => handleShareicon(id, shortCode)} />
//     </div>
//   );
// };

// export default PhotoGallery;









"use client";

import React, { useEffect, useState } from "react";
import ThumbnailGallery from "./ThumbnailGallery";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { trackShareCapsuleClick } from "@/services/weblinkServices";
import { BASE_URL } from "@/utils/apiconstants";

const PhotoGallery = () => {
  const [folderName, setFolderName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Component is now running in browser
    setIsClient(true);

    const searchParams = new URLSearchParams(window.location.search);

    const folder = searchParams.get("folderName") || "";
    const customer = searchParams.get("customerId") || "";

    setFolderName(folder);
    setCustomerId(customer);
  }, []);

  const handleShareicon = async (mainFolderId, shortCode) => {
    try {
      await trackShareCapsuleClick(mainFolderId);
    } catch (error) {
      console.error("Error tracking share click:", error);
    }

    let linkToShare = "";

    if (shortCode) {
      linkToShare = `${BASE_URL}/eventcapsule/share/${shortCode}`;
    } else {
      linkToShare =
        `https://horaservices.com/weblink-gallery?folderName=${encodeURIComponent(
          folderName
        ).replace(/%20/g, "%2520")}&customerId=${customerId}`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Photo Gallery",
          text: "Check out these photos!",
          url: linkToShare,
        });
      } catch (error) {
        // User cancelling native share also comes here.
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(linkToShare);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying link:", error);
        alert("Unable to copy link. Please copy it manually.");
      }
    }
  };

  // Prevent rendering browser-dependent content during SSR
  if (!isClient) {
    return (
      <div className="photo-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="photo-container">
      <ThumbnailGallery
        folderName={folderName}
        customerId={customerId}
        handleShareicon={handleShareicon}
      />
    </div>
  );
};

export default PhotoGallery;