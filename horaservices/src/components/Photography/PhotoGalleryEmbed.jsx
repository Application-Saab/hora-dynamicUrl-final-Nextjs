import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import ChatBanner from "@/components/PhotoGalleryPose/ChatBanner";
import PlanningCard from "@/components/PhotoGalleryPose/PlanningCard";
import CaptureMomentCard from "@/components/PhotoGalleryPose/CaptureMomentCard";
import TrustedPeopleCard from "@/components/PhotoGalleryPose/TrustedPeopleCard";
import LovePosesBanner from "@/components/PhotoGalleryPose/LovePosesBanner";
import WhyChooseHora from "@/components/PhotoGalleryPose/WhyChooseHora";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";

import Gift from "@/assets/poselink/Gift.svg";
import Planingbanner from "@/assets/poselink/planingbanner.webp";

import {
  getBannerConfig,
  getPlanningCardData,
  getTrustedCardData,
} from "@/utils/bannerConfig";
import { poseGridData } from "@/utils/poseGridData";
import { reviewsData } from "@/utils/poselinkreviews";
import { BASE_URL } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

const ThumbnailGalleryPhotography = dynamic(
  () => import("./ThumbnailGalleryPhotography"),
  { ssr: false, loading: () => null },
);

const WHATSAPP_NUMBER = "917338584828";

const PhotoGalleryEmbed = ({
  folderName,
  customerId,
  city: cityProp = null,
}) => {
  const router = useRouter();
  const [fetchedCity, setFetchedCity] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const city = (cityProp && String(cityProp).trim()) || fetchedCity;

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (cityProp) return;
    if (typeof window === "undefined") return;

    const userId = customerId || null;
    const visitorId = localStorage.getItem("VISITOR_ID") || null;
    if (!userId && !visitorId) return;

    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (visitorId) params.append("visitorId", visitorId);

    fetchWithError(`${BASE_URL}/api/event-dates/my-events?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        const userCity = json?.data?.cityName?.trim() || null;
        if (userCity) setFetchedCity(userCity);
      })
      .catch(() => {});
  }, [cityProp, customerId]);

  const bannerConfig = getBannerConfig(folderName) || {};
  const planningCardData = getPlanningCardData(folderName) || {};
  const trustedData = getTrustedCardData(folderName) || {};
  const categoryName =
    poseGridData.find((p) => p.folder?.trim() === folderName?.trim())?.title ||
    bannerConfig?.title ||
    "";

  const openWhatsApp = () => {
    const cityText = city ? ` for ${city}` : "";
    const categoryNameLower = categoryName?.toLowerCase() || "photography";
    const message = `Hi, I'm interested in your ${categoryNameLower} photography services. Please share your packages, pricing, and availability${cityText}.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const handleChatNow = () => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "chat_now_click",
        eventLabel: bannerConfig?.title || folderName || "unknown",
        folder_name: folderName || "unknown",
        customer_id: customerId || "guest",
      });
    }
    openWhatsApp();
  };

  const handleViewPackages = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBookNow = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleShareicon = async () => {
    const shareUrl = `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(
      folderName || "",
    )}&customerId=${customerId || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Photo Gallery",
          text: "Check out these photos!",
          url: shareUrl,
        });
      } catch (_) {}
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  if (!folderName || !customerId) return null;

  const galleryBanners = [
    <div key="planning">
      <PlanningCard
        title={planningCardData.title}
        description={planningCardData.description}
        buttonText="View Packages"
        image={Planingbanner}
        icon={Gift}
        onClick={handleViewPackages}
      />
    </div>,
    <div key="capture">
      <CaptureMomentCard price="24,000" onBookNow={handleBookNow} />
    </div>,
    <div key="trusted">
      <TrustedPeopleCard
        collageImage={trustedData.collageImage}
        title={trustedData.title}
        onClick={handleViewPackages}
      />
    </div>,
    <div key="love">
      <LovePosesBanner onClick={handleBookNow} />
    </div>,
    <div key="whychoose">
      <WhyChooseHora />
    </div>,
  ];

  return (
    <div
      className="photo-container photo-gallery-embed"
      style={{
        padding: "8px",
        maxWidth: "480px",
        margin: "auto",
        paddingBottom: "10px",
      }}
    >
      <ChatBanner
        title={planningCardData.chatTitle}
        onChatClick={handleChatNow}
      />

      {!hydrated && (
        <div className="ssr-banners-only" aria-hidden="true">
          <PlanningCard
            title={planningCardData.title}
            description={planningCardData.description}
            buttonText="View Packages"
            image={Planingbanner}
            icon={Gift}
            onClick={handleViewPackages}
          />
          <CaptureMomentCard price="24,000" onBookNow={handleBookNow} />
          <TrustedPeopleCard
            collageImage={trustedData.collageImage}
            title={trustedData.title}
            onClick={handleViewPackages}
          />
          <LovePosesBanner onClick={handleBookNow} />
          <WhyChooseHora />
        </div>
      )}

      <ThumbnailGalleryPhotography
        folderName={folderName}
        customerId={customerId}
        handleShareicon={handleShareicon}
        banners={galleryBanners}
        bannerInterval={6}
      />

      <GoogleReviewsCard reviews={reviewsData} />
    </div>
  );
};

export default PhotoGalleryEmbed;
