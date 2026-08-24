import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
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
// import ReviewSlider from "@/components/ReviewSection";
import "@/pages/venue-list/venue/venue.css";
// import { venueReviews } from "@/utils/veneureviews";
import { safeGetItem } from "@/utils/safeStorage";
import VenueSearchBar from "@/components/Venue/Venuesearchbar";

function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

function VenuelandCityPage() {
  const router = useRouter();

  const [citySlug, setCitySlug] = useState("");

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    setCitySlug(getCitySlugFromPath(window.location.pathname));
  }, []);

  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

  useEffect(() => {
    router.events.on("routeChangeComplete", syncCityFromUrl);
    return () => router.events.off("routeChangeComplete", syncCityFromUrl);
  }, [router.events, syncCityFromUrl]);

  useEffect(() => {
    window.addEventListener("city:changed", syncCityFromUrl);
    return () => window.removeEventListener("city:changed", syncCityFromUrl);
  }, [syncCityFromUrl]);

  useEffect(() => {
    window.addEventListener("popstate", syncCityFromUrl);
    return () => window.removeEventListener("popstate", syncCityFromUrl);
  }, [syncCityFromUrl]);

  const city = citySlug
    ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
    : "";

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

  const hasRedirectedRef = useRef(false);

  useLayoutEffect(() => {
    if (isUserLoggedIn && loggedinUserId && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
    }
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

  if (!city) return null;

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
          city={city}
          search={searchText}
        />

        <VenueFeatures />

        {/* <div
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
        </div> */}
      </div>

      <LoginModal
        isOpen={showHostLoginModal}
        onClose={() => {
          setShowHostLoginModal(false);
          router.replace(`/${citySlug}/venue-list`);
        }}
      />
    </>
  );
}

export default VenuelandCityPage;