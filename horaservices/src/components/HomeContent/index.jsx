"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import "@/app/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import sparkle from "@/assets/Home/sparkle.png";

import { usePathname } from "next/navigation";
import Decoration from "@/assets/Home/Decoration.webp";
import PhotoGraphy from "@/assets/Home/Photography.webp";
import BulkFoodDelivery from "@/assets/Home/BulkFoodDelivery.webp";
import Entertainment from "@/assets/Home/Entertainment.webp";
import LiveCatering from "@/assets/Home/LiveCatering.webp";
import Homevideo from "../../../public/assets/Homevideo.mp4";
import Photographybanner from "@/assets/Home/Photographybanner.webp";
import decorationbanner from "@/assets/Home/decorationbanner.webp";
import chefforparty from "@/assets/Home/chefforparty.webp";
import chef from "@/assets/Home/chef.webp";
import partyfood from "@/assets/Home/partyfood.webp";
import photo1 from "@/assets/Home/photo1.svg";
import photo2 from "@/assets/Home/photo2.svg";
import photo3 from "@/assets/Home/photo3.svg";
// import ReviewSlider from "@/components/ReviewSection";
import { balloonreviews } from "@/utils/balloonReviews";
import { openWhatsApp } from "@/utils/WhatsAppRedirection";
import HomeBanner from "../HomePageComponent/HomeBanner";
import InviteCard from "../HomePageComponent/invitecardbanner";
import PlanningCategories from "../HomePageComponent/Planningcategories";
import VenueFinder from "../HomePageComponent/Venuefinder";
import EventHub from "../HomePageComponent/EventHub";

const ReviewSlider = dynamic(() => import("@/components/ReviewSection"), {
  ssr: false,
  loading: () => <div></div>,
});

// Centralize the localStorage key name here to avoid future case-mismatch bugs
const STORAGE_KEYS = {
  USER_ID: "userID", // NOTE: capital "ID" - matches what's actually stored on login
};

export default function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();

  // ---- LOGIN STATE ----
  const [loggedinUserId, setLoggedinUserId] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (storedUserId) {
      setLoggedinUserId(storedUserId);
      setIsUserLoggedIn(true);
    }
  }, []);
  // ----------------------

  const { city, locality } = useMemo(() => {
    const segments = pathname?.split("/")?.filter(Boolean) || [];

    return {
      city: segments[0] || null,
      locality: segments[1] || null,
    };
  }, [pathname]);

  const formatName = useCallback(
    (value) =>
      value
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    [],
  );

  const goTo = useCallback(
    (path) => {
      if (city && locality) {
        router.push(`/${city}/${locality}${path}`);
      } else if (city) {
        router.push(`/${city}${path}`);
      } else {
        router.push(path);
      }
    },
    [city, locality, router],
  );

  const handleEntertainmentWhatsApp = useCallback(() => {
    let locationText = "";

    if (city && locality) {
      locationText = ` in ${formatName(locality)}, ${formatName(city)}`;
    } else if (city) {
      locationText = ` in ${formatName(city)}`;
    }

    const message = `Hi, I’m interested in your Entertainment services${locationText}. Please share details.`;

    openWhatsApp(undefined, message);
  }, [city, locality, formatName]);

  const handleContactClick = useCallback(() => {
    window.open(
      "https://wa.me/917338584828?text=Hi%2C%20I%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20decoration%20services.",
      "_blank",
    );
  }, []);

  return (
    <div className="home-wrapper">
      {/* TOP BANNER */}
      <HomeBanner />
<InviteCard />

{isUserLoggedIn && loggedinUserId && (
  <EventHub userId={loggedinUserId} />
)}
<div  style={!isUserLoggedIn ? { marginTop: "10px" } : undefined}>
<PlanningCategories
/>
</div>
<VenueFinder />
   </div>
  );
}