// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/router";
// import ThumbnailGallery from "../../pages/photo-gallery/ThumbnailGallery";
// import ChatBanner from "@/components/PhotoGalleryPose/ChatBanner";
// import PlanningCard from "@/components/PhotoGalleryPose/PlanningCard";
// import CaptureMomentCard from "@/components/PhotoGalleryPose/CaptureMomentCard";
// import TrustedPeopleCard from "@/components/PhotoGalleryPose/TrustedPeopleCard";
// import LovePosesBanner from "@/components/PhotoGalleryPose/LovePosesBanner";
// import WhyChooseHora from "@/components/PhotoGalleryPose/WhyChooseHora";
// import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";

// import Gift from "@/assets/poselink/Gift.svg";
// import Planingbanner from "@/assets/poselink/planingbanner.webp";

// import {
//   getBannerConfig,
//   getPlanningCardData,
//   getTrustedCardData,
// } from "@/utils/bannerConfig";
// import { getWeblinkPhotosUrl } from "@/utils/Getphotocategoryurl.js";
// import { poseGridData } from "@/utils/poseGridData";
// import { reviewsData } from "@/utils/poselinkreviews";
// import { BASE_URL } from "@/utils/apiconstants";
// import { fetchWithError } from "@/utils/fetchWithError";

// const WHATSAPP_NUMBER = "917338584828";

// /**
//  * Embed-only Photo Gallery (CatValuePage / category SSR ke liye)
//  * Original page: pages/photo-gallery — usko mat chhedo
//  */
// const PhotoGalleryEmbed = ({
//   folderName,
//   customerId,
//   city: cityProp = null,
// }) => {
//   const router = useRouter();

//   const [fetchedCity, setFetchedCity] = useState(null);
//   const city = (cityProp && String(cityProp).trim()) || fetchedCity;

//   useEffect(() => {
//     if (cityProp) return;
//     if (typeof window === "undefined") return;

//     const userId = customerId || null;
//     const visitorId = localStorage.getItem("VISITOR_ID") || null;
//     if (!userId && !visitorId) return;

//     const params = new URLSearchParams();
//     if (userId) params.append("userId", userId);
//     if (visitorId) params.append("visitorId", visitorId);

//     fetchWithError(`${BASE_URL}/api/event-dates/my-events?${params.toString()}`)
//       .then((res) => res.json())
//       .then((json) => {
//         const userCity = json?.data?.cityName?.trim() || null;
//         if (userCity) setFetchedCity(userCity);
//       })
//       .catch(() => {});
//   }, [cityProp, customerId]);

//   const bannerConfig = getBannerConfig(folderName);
//   const planningCardData = getPlanningCardData(folderName);
//   const trustedData = getTrustedCardData(folderName);
//   const categoryUrl = getWeblinkPhotosUrl(folderName);
//   const categoryName =
//     poseGridData.find((p) => p.folder?.trim() === folderName?.trim())?.title ||
//     bannerConfig?.title ||
//     "";

//   const chatBannerRef = useRef(null);
//   const planningRef = useRef(null);
//   const captureRef = useRef(null);
//   const trustedRef = useRef(null);
//   const loveBannerRef = useRef(null);
//   const whyChooseRef = useRef(null);
//   const reviewsRef = useRef(null);

//   const lastViewedComponent = useRef("Chat Banner");
//   const lastScrollPercent = useRef(0);
//   const hasFired = useRef(false);

//   // Scroll depth (analytics only)
//   useEffect(() => {
//     let ticking = false;
//     const handleScroll = () => {
//       if (ticking) return;
//       ticking = true;
//       requestAnimationFrame(() => {
//         const totalHeight =
//           document.documentElement.scrollHeight - window.innerHeight;
//         lastScrollPercent.current =
//           totalHeight > 0
//             ? Math.round((window.scrollY / totalHeight) * 100)
//             : 0;
//         ticking = false;
//       });
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Visibility tracking (analytics)
//   useEffect(() => {
//     const components = [
//       { ref: chatBannerRef, label: "Chat Banner" },
//       { ref: planningRef, label: "Planning Card" },
//       { ref: captureRef, label: "Capture Moment Card" },
//       { ref: trustedRef, label: "Trusted People Card" },
//       { ref: loveBannerRef, label: "Love Poses Banner" },
//       { ref: whyChooseRef, label: "Why Choose Hora" },
//       { ref: reviewsRef, label: "Google Reviews" },
//     ];

//     const observers = components.map(({ ref, label }) => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) lastViewedComponent.current = label;
//         },
//         { threshold: 0.5 },
//       );
//       if (ref.current) observer.observe(ref.current);
//       return observer;
//     });

//     return () => observers.forEach((obs) => obs.disconnect());
//   }, []);

//   // scroll exit analytics
//   useEffect(() => {
//     const fireScrollExit = () => {
//       if (hasFired.current) return;
//       hasFired.current = true;
//       window.dataLayer = window.dataLayer || [];
//       window.dataLayer.push({
//         event: "user_scroll_exit",
//         eventLabel: lastViewedComponent.current,
//         scroll_position_pct: lastScrollPercent.current,
//         folder_name: folderName || "unknown",
//         customer_id: customerId || "guest",
//       });
//     };

//     const handleRouteComplete = () => {
//       setTimeout(() => {
//         hasFired.current = false;
//       }, 300);
//     };

//     window.addEventListener("beforeunload", fireScrollExit);
//     router.events.on("routeChangeStart", fireScrollExit);
//     router.events.on("routeChangeComplete", handleRouteComplete);

//     return () => {
//       window.removeEventListener("beforeunload", fireScrollExit);
//       router.events.off("routeChangeStart", fireScrollExit);
//       router.events.off("routeChangeComplete", handleRouteComplete);
//     };
//   }, [folderName, customerId, router.events]);

//   const openWhatsApp = () => {
//     const cityText = city ? ` for ${city}` : "";
//     const categoryNameLower = categoryName?.toLowerCase() || "photography";
//     const message = `Hi, I'm interested in your ${categoryNameLower} photography services. Please share your packages, pricing, and availability${cityText}.`;
//     window.open(
//       `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
//       "_blank",
//     );
//   };

//   const handleChatNow = () => {
//     window.dataLayer = window.dataLayer || [];
//     window.dataLayer.push({
//       event: "chat_now_click",
//       eventLabel: bannerConfig?.title || folderName || "unknown",
//       folder_name: folderName || "unknown",
//       customer_id: customerId || "guest",
//     });
//     openWhatsApp();
//   };

//   const handleViewPackages = () => {
//     window.dataLayer = window.dataLayer || [];
//     window.dataLayer.push({
//       event: "view_packages_click",
//       eventLabel: bannerConfig?.title || folderName || "unknown",
//       folder_name: folderName || "unknown",
//       customer_id: customerId || "guest",
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleBookNow = () => {
//     window.dataLayer = window.dataLayer || [];
//     window.dataLayer.push({
//       event: "book_now_click",
//       eventLabel: bannerConfig?.title || folderName || "unknown",
//       folder_name: folderName || "unknown",
//       customer_id: customerId || "guest",
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleShareicon = async () => {
//     const shareUrl = `https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(
//       folderName || "",
//     )}&customerId=${customerId || ""}`;

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Photo Gallery",
//           text: "Check out these photos!",
//           url: shareUrl,
//         });
//       } catch (_) {}
//     } else {
//       navigator.clipboard.writeText(shareUrl);
//       alert("Link copied to clipboard!");
//     }
//   };

//   // SSR / first paint: props nahi to kuch mat dikhao
//   if (!folderName || !customerId) return null;

//   const galleryBanners = [
//     <div ref={planningRef} key="planning">
//       <PlanningCard
//         title={planningCardData.title}
//         description={planningCardData.description}
//         buttonText="View Packages"
//         image={Planingbanner}
//         icon={Gift}
//         onClick={handleViewPackages}
//       />
//     </div>,
//     <div ref={captureRef} key="capture">
//       <CaptureMomentCard price="24,000" onBookNow={handleBookNow} />
//     </div>,
//     <div ref={trustedRef} key="trusted">
//       <TrustedPeopleCard
//         collageImage={trustedData.collageImage}
//         title={trustedData.title}
//         onClick={handleViewPackages}
//       />
//     </div>,
//     <div ref={loveBannerRef} key="love">
//       <LovePosesBanner onClick={handleBookNow} />
//     </div>,
//     <div ref={whyChooseRef} key="whychoose">
//       <WhyChooseHora />
//     </div>,
//   ];

//   return (
//     <div
//       className="photo-container photo-gallery-embed"
//       style={{
//         padding: "8px",
//         maxWidth: "480px",
//         margin: "auto",
//         paddingBottom: "10px",
//       }}
//     >
//       {/* Yeh block SSR HTML mein aayega jab folderName + customerId props se aayein */}
//       <div ref={chatBannerRef}>
//         <ChatBanner
//           title={planningCardData.chatTitle}
//           onChatClick={handleChatNow}
//         />
//       </div>

//       <ThumbnailGallery
//         folderName={folderName}
//         customerId={customerId}
//         handleShareicon={handleShareicon}
//         banners={galleryBanners}
//         bannerInterval={6}
//       />

//       <div ref={reviewsRef}>
//         <GoogleReviewsCard reviews={reviewsData} />
//       </div>
//     </div>
//   );
// };

// export default PhotoGalleryEmbed;

















import React, { useState, useEffect, useRef } from "react";
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
import { getWeblinkPhotosUrl } from "@/utils/Getphotocategoryurl.js";
import { poseGridData } from "@/utils/poseGridData";
import { reviewsData } from "@/utils/poselinkreviews";
import { BASE_URL } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

// ✅ Source mein nahi aayega — client only
const ThumbnailGallery = dynamic(
  () => import("../../pages/photo-gallery/ThumbnailGallery"),
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
  const city = (cityProp && String(cityProp).trim()) || fetchedCity;

  // client-only city fallback
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
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  // Props nahi → kuch mat dikhao
  if (!folderName || !customerId) return null;

  // Yeh banners ThumbnailGallery ko client pe milenge; SSR HTML mein alag se bhi dikhayenge
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
      {/* ========== SSR HTML (View Source mein dikhega) ========== */}
      <ChatBanner
        title={planningCardData.chatTitle}
        onChatClick={handleChatNow}
      />

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

      <GoogleReviewsCard reviews={reviewsData} />

      {/* ========== Client only — View Source mein nahi ========== */}
      <ThumbnailGallery
        folderName={folderName}
        customerId={customerId}
        handleShareicon={handleShareicon}
        banners={galleryBanners}
        bannerInterval={6}
      />
    </div>
  );
};

export default PhotoGalleryEmbed;