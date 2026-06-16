import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "@/components/wonderland/wonderland.css";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import TopBanner from "@/components/Venue/Topbanner";
import VenueCategories from "@/components/Venue/VenueCategories";
import venueTopBanner from "@/assets/venuelanding/Topbanner.webp";
import VenueBannertitle from "@/components/Venue/venuetitle";
import VenueCircle from "@/components/Venue/VenueCircle";
import VenueList from "@/components/venueCommon/InvitesListing";
import VenueListHeader from "@/components/Venue/VenueListHeader";
import VenueFeatures from "@/components/Venue/VenueFeatures";
import ReviewSlider from "@/components/ReviewSection";
import { balloonreviews } from "@/utils/balloonReviews";
import "./venue/venue.css"
const venuelandMainPage = () => {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || ""
  );
  const [showHostLoginModal, setShowHostLoginModal] = useState(false);
  const [activeEvent, setActiveEvent]         = useState("Birthday");
const [activeVenueType, setActiveVenueType] = useState("all");
const [guestCapacity, setGuestCapacity]     = useState("");
  useLayoutEffect(() => {
    let timer;
    if (isUserLoggedIn && loggedinUserId) {
      timer = setTimeout(() => {
        router.push(`/venue-list`);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [loggedinUserId, isUserLoggedIn]);



  useEffect(() => {
    const syncLoginState = () => {
      setIsUserLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  return (
    <>
      <div className="venue-container">
        <div style={{ position: "relative" }}>
          <TopBanner image={venueTopBanner} alt="Venue" />
          <VenueCategories
            active={activeEvent}
            onSelect={setActiveEvent} // ✅ category change parent ko batayega
          />
        </div>

        <VenueBannertitle eventType={activeEvent} />
<VenueCircle active={activeVenueType} onSelect={setActiveVenueType} />

<VenueListHeader
  eventType={activeEvent}
  value={guestCapacity}
  onChange={setGuestCapacity}
/>

<VenueList
  eventType={activeEvent}
  venueType={activeVenueType}
  guestCapacity={guestCapacity}
/>

<VenueFeatures/>
<div style={{ margin: " clamp(16px, calc((20 / 393) * 100vw), 24px) 0", maxWidth: "480px", background:"#F5F1F7" }}>
  <div className="trusted-heading">
    <h2 className="trusted-title">Trusted By Thousands</h2>
    <p className="trusted-subtitle">Real experiences From Happy Customers</p>
  </div>
  <ReviewSlider reviews={balloonreviews} />
</div>
      </div>

      <LoginModal
        isOpen={showHostLoginModal}
        onClose={() => {
          setShowHostLoginModal(false);
          router.replace("/venue-list");
        }}
      />
    </>
  );
};

export default venuelandMainPage;