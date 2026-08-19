import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import "./venue/venue.css";
import { venueReviews } from "@/utils/veneureviews";
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";
import { useCity } from "@/utils/cityContext";
import VenueSearchBar from "@/components/Venue/Venuesearchbar";

const venuelandMainPage = () => {
  const router = useRouter();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    safeGetItem("isLoggedIn") === "true"
  );
  const [loggedinUserId, setLoggedinUserId] = useState(
    safeGetItem("userID") || ""
  );
  const [showHostLoginModal, setShowHostLoginModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState("Birthday");
  const [activeVenueType, setActiveVenueType] = useState("all");
  const [guestCapacity, setGuestCapacity] = useState("");
  const [searchText, setSearchText] = useState("");

  const { selectedCityName } = useCity();

  const hasRedirectedRef = useRef(false);

  useLayoutEffect(() => {
    let timer;

    if (isUserLoggedIn && loggedinUserId && !hasRedirectedRef.current) {
        const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const alreadyOnVenueList = /(^|\/)venue-list(\/|$)/.test(currentPath);

      if (alreadyOnVenueList) {
        hasRedirectedRef.current = true;
      } else {
        timer = setTimeout(() => {
          hasRedirectedRef.current = true;
          router.push(`/venue-list`);
        }, 2500);
      }
    }

    return () => clearTimeout(timer);
  }, [loggedinUserId, isUserLoggedIn]);

  useEffect(() => {
    const syncLoginState = () => {
      setIsUserLoggedIn(safeGetItem("isLoggedIn") === "true");
      setLoggedinUserId(safeGetItem("userID") || "");
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
          {/* <VenueCategories active={activeEvent} onSelect={setActiveEvent} /> */}
          <VenueSearchBar
            searchValue={searchText}
            onSearchChange={setSearchText}
            eventType={activeEvent}
            onEventTypeChange={setActiveEvent}
            guestCapacity={guestCapacity}
            onGuestCapacityChange={setGuestCapacity}
            onMoreFilterClick={() => {
              /* open your filter modal here */
            }}
          />
        </div>

        {/* <VenueBannertitle eventType={activeEvent} /> */}
        <VenueCircle active={activeVenueType} onSelect={setActiveVenueType} />

        {/* <VenueListHeader
          eventType={activeEvent}
          value={guestCapacity}
          onChange={setGuestCapacity}
        /> */}

        <VenueList
          eventType={activeEvent}
          venueType={activeVenueType}
          guestCapacity={guestCapacity}
          city={selectedCityName}
        />

        <VenueFeatures />

        <div
          style={{
            margin: "clamp(16px, calc((20 / 393) * 100vw), 24px) 0",
            maxWidth: "480px",
            background: "#F5F1F7",
          }}
        >
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