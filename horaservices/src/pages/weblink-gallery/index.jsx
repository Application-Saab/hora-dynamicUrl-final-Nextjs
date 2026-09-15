"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import ThumbnailGallery from "./ThumbnailGallery";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { trackShareCapsuleClick } from "@/services/weblinkServices";
import { BASE_URL } from "@/utils/apiconstants";

const SITE = "https://horaservices.com";
const GALLERY_PATH = "/weblink-gallery"; // actual route confirm kar lo
// agar route /photo-gallery hai to yahan change karo

const PhotoGallery = () => {
  const [folderName, setFolderName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const searchParams = new URLSearchParams(window.location.search);
    const folder = searchParams.get("folderName") || "";
    const customer = searchParams.get("customerId") || "";

    setFolderName(folder);
    setCustomerId(customer);
  }, []);

  const buildCanonical = () => {
    if (!folderName || !customerId) {
      return `${SITE}${GALLERY_PATH}`;
    }
    const qs = new URLSearchParams({
      folderName,
      customerId,
    });
    return `${SITE}${GALLERY_PATH}?${qs.toString()}`;
  };

  const canonicalUrl = buildCanonical();
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
      linkToShare = `https://horaservices.com/weblink-gallery?folderName=${encodeURIComponent(
        folderName,
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

  if (!isClient) {
    return (
      <div className="photo-container">
        <Head>
          <title>Photo Gallery | HORA</title>
          <link rel="canonical" href={`${SITE}${GALLERY_PATH}`} />
        </Head>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="photo-container">
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <ThumbnailGallery
        folderName={folderName}
        customerId={customerId}
        handleShareicon={handleShareicon}
      />
    </div>
  );
};

export default PhotoGallery;
