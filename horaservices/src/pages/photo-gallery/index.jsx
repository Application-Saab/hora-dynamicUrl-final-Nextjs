"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ThumbnailGallery from "./ThumbnailGallery"; // Import the ThumbnailGallery component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import shareIcon from "../../assets/share-photo-icon.png";

const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get("folderName");
  const customerId = urlParams.get("customerId");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const fromPage = urlParams.get("from"); // Get the 'from' query param (last visited page)

  // Check login status and redirect if not logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");

    if (loggedInStatus !== "true") {
      const currentUrl = new URL(window.location.href); // Get full URL
      const folderName = currentUrl.searchParams.get("folderName") || "";
      const customerId = currentUrl.searchParams.get("customerId") || "";

      console.log("Redirecting to login with:", { folderName, customerId });

      router.push({
        pathname: "/login",
        query: {
          from: window.location.pathname,
          folderName,
          customerId,
        },
      });
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  // // Handle the redirect after successful login
  useEffect(() => {
    if (isLoggedIn && fromPage) {
      const urlParams = new URLSearchParams(window.location.search);
      const folderName = urlParams.get("folderName") || "";
      const customerId = urlParams.get("customerId") || "";

      console.log("Redirecting back to:", fromPage, folderName, customerId);

      router.push({
        pathname: fromPage,
        query: { folderName, customerId },
      });
    }
  }, [isLoggedIn, fromPage, router]);

  const handleShareicon = async () => {
    const shareUrl = `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(
      folderName
    )}&customerId=${customerId}`;
    // http://localhost:3000/photo-gallery?folderName=testing+2&customerId=63edb239d680d47d95870fa0
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
      <div class="photo-galary-header">
        <h2 className="title">Your Photos</h2>
        <Image
          src={shareIcon}
          alt="Info"
          style={{ height: 20, width: 20, marginRight: 10, cursor: "pointer" }}
          onClick={handleShareicon}
        />
      </div>
      {isLoggedIn ? (
        folderName && customerId ? (
          <ThumbnailGallery folderName={folderName} customerId={customerId} />
        ) : (
          <p>Please provide the folder and customer ID in the URL.</p>
        )
      ) : (
        <p>Loading or redirecting...</p>
      )}
    </div>
  );
};

export default PhotoGallery;
