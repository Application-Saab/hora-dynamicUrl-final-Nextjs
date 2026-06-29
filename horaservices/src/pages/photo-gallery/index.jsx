"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import ThumbnailGallery from './ThumbnailGallery';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TopBanner from "@/components/PhotoGalleryPose/TopBanner";
import ChatBanner from "@/components/PhotoGalleryPose/ChatBanner";
import PlanningCard from "@/components/PhotoGalleryPose/PlanningCard";
import PhotogalleryCTA from "@/components/PhotoGalleryPose/PhotogalleryCTA";
import CaptureMomentCard from "@/components/PhotoGalleryPose/CaptureMomentCard";
import TrustedPeopleCard from "@/components/PhotoGalleryPose/TrustedPeopleCard";
import LovePosesBanner from "@/components/PhotoGalleryPose/LovePosesBanner";
import WhyChooseHora from "@/components/PhotoGalleryPose/WhyChooseHora";
import InstagramGalleryCTA from "@/components/PhotoGalleryPose/InstagramGalleryCTA";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import Gift from "@/assets/poselink/Gift.svg";
import Planingbanner from "@/assets/poselink/planingbanner.webp";
import image1 from "@/assets/poselink/image1.jpeg";
import image2 from "@/assets/poselink/image2.jpeg";
import collageImage from "@/assets/poselink/collageImage.webp";
import trustimage from "@/assets/poselink/trustedimage.webp";
import { getBannerConfig, getPlanningCardData, getTrustedCardData } from "@/utils/bannerConfig";
import { getPhotoCategoryUrl } from "@/utils/Getphotocategoryurl.js";
import { reviewsData } from "@/utils/poselinkreviews";
import Head from "next/head";

const PhotoGallery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const folderName = urlParams.get('folderName');
  const customerId = urlParams.get('customerId');
  const router = useRouter();

  const bannerConfig     = getBannerConfig(folderName);
  const planningCardData = getPlanningCardData(folderName);
  const trustedData      = getTrustedCardData(folderName);
  const categoryUrl      = getPhotoCategoryUrl(folderName);

  // ==============================
  // REFS
  // ==============================
  const topBannerRef  = useRef(null);
  const chatBannerRef = useRef(null);
  const planningRef   = useRef(null);
  const captureRef    = useRef(null);
  const trustedRef    = useRef(null);
  const loveBannerRef = useRef(null);
  const whyChooseRef  = useRef(null);
  const reviewsRef    = useRef(null);
  const bottomCTARef  = useRef(null);

  const lastViewedComponent = useRef("Top Banner");
  const lastScrollPercent   = useRef(0);
  const hasFired            = useRef(false);

  // ==============================
  // 1. SCROLL DEPTH TRACKER
  // ==============================
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        lastScrollPercent.current = totalHeight > 0
          ? Math.round((window.scrollY / totalHeight) * 100)
          : 0;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ==============================
  // 2. COMPONENT VISIBILITY TRACKER
  // ==============================
  useEffect(() => {
    const components = [
      { ref: topBannerRef,  label: "Top Banner" },
      { ref: chatBannerRef, label: "Chat Banner" },
      { ref: planningRef,   label: "Planning Card" },
      { ref: captureRef,    label: "Capture Moment Card" },
      { ref: trustedRef,    label: "Trusted People Card" },
      { ref: loveBannerRef, label: "Love Poses Banner" },
      { ref: whyChooseRef,  label: "Why Choose Hora" },
      { ref: reviewsRef,    label: "Google Reviews" },
      { ref: bottomCTARef,  label: "Bottom Book Now CTA" },
    ];

    const observers = components.map(({ ref, label }) => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          lastViewedComponent.current = label;
        }
      }, { threshold: 0.5 });

      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  // ==============================
  // 3. user_scroll_exit EVENT
  // ==============================
  useEffect(() => {

    const fireScrollExit = () => {
      if (hasFired.current) return;
      hasFired.current = true;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "user_scroll_exit",
        eventLabel: lastViewedComponent.current,
        scroll_position_pct: lastScrollPercent.current,
        folder_name: folderName || "unknown",
        customer_id: customerId || "guest",
      });
    };

    const handlePopState = () => {
      if (hasFired.current) return;
      hasFired.current = true;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "user_scroll_exit",
        eventLabel: lastViewedComponent.current,
        scroll_position_pct: lastScrollPercent.current,
        folder_name: folderName || "unknown",
        customer_id: customerId || "guest",
      });
    };

    const handleRouteComplete = () => {
      setTimeout(() => { hasFired.current = false; }, 300);
    };

    window.addEventListener("beforeunload", fireScrollExit);
    window.addEventListener("popstate", handlePopState);
    router.events.on("routeChangeStart", fireScrollExit);
    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      window.removeEventListener("beforeunload", fireScrollExit);
      window.removeEventListener("popstate", handlePopState);
      router.events.off("routeChangeStart", fireScrollExit);
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, [folderName, customerId]);

  // ==============================
  // BUTTON HANDLERS WITH GTM EVENTS
  // ==============================

  const handleChatNow = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "chat_now_click",
      eventLabel: bannerConfig.title || folderName || "unknown",
      folder_name: folderName || "unknown",
      customer_id: customerId || "guest",
      last_component_seen: lastViewedComponent.current,
      scroll_position_pct: lastScrollPercent.current,
    });

    window.open(
      `https://wa.me/7338584828?text=${encodeURIComponent(
        "Hi, I'm interested in your photography services. Please share your packages, pricing, and availability."
      )}`,
      "_blank"
    );
  };

  const handleViewPackages = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_packages_click",
      eventLabel: bannerConfig.title || folderName || "unknown",
      folder_name: folderName || "unknown",
      customer_id: customerId || "guest",
      last_component_seen: lastViewedComponent.current,
      scroll_position_pct: lastScrollPercent.current,
    });

    router.push(categoryUrl);
  };

  const handleBookNow = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "book_now_click",
      eventLabel: bannerConfig.title || folderName || "unknown",
      folder_name: folderName || "unknown",
      customer_id: customerId || "guest",
      last_component_seen: lastViewedComponent.current,
      scroll_position_pct: lastScrollPercent.current,
    });

    router.push(categoryUrl);
  };

  // ==============================
  // SHARE ICON
  // ==============================
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

  // ==============================
  // BANNER DATA
  // ==============================
  const bannerData = {
    title: planningCardData.title,
    description: planningCardData.description,
    buttonText: "View Packages",
    image: Planingbanner,
    icon: Gift,
    redirectUrl: categoryUrl,
  };

  const galleryBanners = [
    <div ref={planningRef} key="planning">
      <PlanningCard
        title={bannerData.title}
        description={bannerData.description}
        buttonText={bannerData.buttonText}
        image={bannerData.image}
        icon={bannerData.icon}
        onClick={handleViewPackages}
      />
    </div>,
    <div ref={captureRef} key="capture">
      <CaptureMomentCard
        price="24,000"
        onBookNow={handleBookNow}
      />
    </div>,
    <div ref={trustedRef} key="trusted">
      <TrustedPeopleCard
        collageImage={collageImage}
        title={trustedData.title}
        onClick={handleViewPackages}
      />
    </div>,
    <div ref={loveBannerRef} key="love">
      <LovePosesBanner
        onClick={handleBookNow}
      />
    </div>,
    <div ref={whyChooseRef} key="whychoose">
      <WhyChooseHora />
    </div>,
  ];

  // ==============================
  // RENDER
  // ==============================
  return (
    <div
      className="photo-container"
      style={{ padding: "8px", maxWidth: "480px", margin: "auto", paddingBottom: "10px" }}
    >
      <Head>
        <title>
          {bannerConfig.title
            ? `${bannerConfig.title} Poses & Photography Ideas | Book Photographer | HORA`
            : `Professional Photography Poses & Ideas | Book Photographer | HORA`}
        </title>
        <meta
          name="description"
          content={
            bannerConfig.title
              ? `Explore 2500+ ${bannerConfig.title} poses and book the best photographer for your ${bannerConfig.title} event. Trusted by 10,000+ people. 100+ expert photographers. Book HORA now.`
              : `Explore 2500+ photography poses for weddings, birthdays, maternity & more. Book expert photographers across India. Trusted by 10,000+ people. Book HORA now.`
          }
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="canonical"
          href={
            folderName
              ? `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(folderName)}`
              : `https://horaservices.com/photo-gallery`
          }
        />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" />
        <meta
          property="og:title"
          content={
            bannerConfig.title
              ? `${bannerConfig.title} Poses & Photography Ideas | HORA`
              : `Professional Photography Poses & Ideas | HORA`
          }
        />
        <meta
          property="og:description"
          content={
            bannerConfig.title
              ? `Book photographers for ${bannerConfig.title} events. 2500+ pose ideas, 100+ expert photographers.`
              : `Book photographers for weddings, birthdays & events across India.`
          }
        />
        <meta
          property="og:url"
          content={
            folderName
              ? `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(folderName)}`
              : `https://horaservices.com/photo-gallery`
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={bannerConfig.backgroundImage || "https://horaservices.com/api/uploads/attachment-1711520474508.png"}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            bannerConfig.title
              ? `${bannerConfig.title} Poses & Photography Ideas | HORA`
              : `Professional Photography Poses & Ideas | HORA`
          }
        />
        <meta
          name="twitter:description"
          content={
            bannerConfig.title
              ? `${bannerConfig.title} photography poses & booking. Trusted by 10,000+ people.`
              : `Photography poses & booking for all events across India.`
          }
        />
        <meta
          name="twitter:image"
          content={bannerConfig.backgroundImage || "https://horaservices.com/api/uploads/attachment-1711520474508.png"}
        />
      </Head>

      {/* Top Banner */}
      <div ref={topBannerRef}>
        <TopBanner
          backgroundImage={bannerConfig.backgroundImage}
          highlightText={bannerConfig.highlightText}
          title={bannerConfig.title}
          description={bannerConfig.description}
          ctaText={bannerConfig.ctaText}
          onCtaClick={handleViewPackages}
        />
      </div>

      {/* Chat Banner */}
      <div ref={chatBannerRef}>
        <ChatBanner
          title={planningCardData.chatTitle}
          onChatClick={handleChatNow}
        />
      </div>

      {/* Thumbnail Gallery */}
      <ThumbnailGallery
        folderName={folderName}
        customerId={customerId}
        handleShareicon={handleShareicon}
        banners={galleryBanners}
        bannerInterval={6}
      />

      {/* Google Reviews */}
      <div ref={reviewsRef}>
        <GoogleReviewsCard reviews={reviewsData} />
      </div>

      {/* Sticky Bottom CTA */}
      <div
        ref={bottomCTARef}
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "480px",
          zIndex: 99,
          backgroundColor: "#fff",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <PhotogalleryCTA
          image1={image1}
          image2={image2}
          onBookNow={handleBookNow}
        />
      </div>
    </div>
  );
};

export default PhotoGallery;