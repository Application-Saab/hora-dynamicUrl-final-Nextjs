"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import ThumbnailGallery from './ThumbnailGallery'; // Import the ThumbnailGallery component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get('folderName');
  const customerId = urlParams.get('customerId');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const fromPage = urlParams.get('from'); // Get the 'from' query param (last visited page)

  // Check login status and redirect if not logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus !== "true") {
      router.push({
        pathname: '/login',
        query: {
          from:window.location.pathname,
          folderName: folderName || "", // Ensure folderName is defined
          customerId: customerId || "",
        }
      });
    } else {
      setIsLoggedIn(loggedInStatus === "true");
    }
  }, []);

  // Handle the redirect after successful login
  useEffect(() => {
    if (isLoggedIn && fromPage) {
      router.push(fromPage); // Redirect to the stored page after login
    }
  }, [isLoggedIn, fromPage, router]);

  return (
    <div className="container py-2" >
      {/* <h2 className="title">Project Thumbnails</h2> */}
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
