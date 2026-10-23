"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import ThumbnailGallery from "./ThumbnailGallery";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const SITE = "https://horaservices.com";
const GALLERY_PATH = "/category-capsule"; 


const PhotoGallery = () => {
  const [galleryId, setGalleryId] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const searchParams = new URLSearchParams(window.location.search);
    const galleryId = searchParams.get("galleryId") || "";

    setGalleryId(galleryId);
  }, []);

  const buildCanonical = () => {
    return `${SITE}${GALLERY_PATH}}`;
  };

  const canonicalUrl = buildCanonical();


  if (!isClient) {
    return (
      <div className="photo-container">
        <Head>
          <title>Photo Gallery | HORA</title>
          <link rel="canonical" href={`${SITE}${GALLERY_PATH}`} />
        </Head>
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
        galleryId={galleryId}
      />
    </div>
  );
};

export default PhotoGallery;
