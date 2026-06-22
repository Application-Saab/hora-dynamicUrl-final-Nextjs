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
import CitySelector from "@/components/Venue/CitySelector";
import "./venue/venue.css";
import { venueReviews } from "@/utils/veneureviews";

const venuelandMainPage = () => {
  const router = useRouter();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || ""
  );
  const [showHostLoginModal, setShowHostLoginModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState("Birthday");
  const [activeVenueType, setActiveVenueType] = useState("all");
  const [guestCapacity, setGuestCapacity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);

useEffect(() => {
  if (!router.isReady) return;

  const queryCity = router.query.city;

  if (queryCity) {
    setSelectedCity(queryCity);
    sessionStorage.setItem("selectedCity", queryCity);
  } else {
    const savedCity = sessionStorage.getItem("selectedCity") || "";
    setSelectedCity(savedCity);
  }
}, [router.isReady, router.query.city]);

 useEffect(() => {
  const alreadyShown = sessionStorage.getItem("cityModalShown");
  const savedCity = sessionStorage.getItem("selectedCity");

  if (!alreadyShown && !savedCity) {
    const timer = setTimeout(() => {
      setShowCityModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }
}, []);


 const handleCitySelect = (city) => {
  const selected = city === "Others" ? "" : city;

  setSelectedCity(selected);
  setShowCityModal(false);

  sessionStorage.setItem("cityModalShown", "true");
  sessionStorage.setItem("selectedCity", selected);

  const newQuery = { ...router.query };

  if (selected) {
    newQuery.city = selected;
  } else {
    delete newQuery.city;
  }

  router.replace(
    {
      pathname: router.pathname,
      query: newQuery,
    },
    undefined,
    { shallow: true }
  );
};
  // login hone pe redirect
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
      {showCityModal && (
        <CitySelector onSelect={handleCitySelect} />
      )}

      <div className="venue-container">
        <div style={{ position: "relative" }}>
          <TopBanner image={venueTopBanner} alt="Venue" />
          <VenueCategories
            active={activeEvent}
            onSelect={setActiveEvent}
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
          city={selectedCity}
        />

        <VenueFeatures />

        <div style={{ margin: "clamp(16px, calc((20 / 393) * 100vw), 24px) 0", maxWidth: "480px", background: "#F5F1F7" }}>
          <div className="trusted-heading">
            <h2 className="trusted-title">Trusted By Thousands</h2>
            <p className="trusted-subtitle">Real experiences From Happy Customers</p>
          </div>
          <ReviewSlider reviews={venueReviews} />
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