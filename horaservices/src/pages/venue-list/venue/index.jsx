import React, { useEffect, useLayoutEffect, useState } from "react";
import "./venue.css";
import InviteActions from "@/components/wonderland/common/InviteActions";
import VenueWallSection from "@/components/wonderland/event-wall/VenueWallSection";
import { useRouter } from "next/router";
import useApi from "@/hooks/useApi";
import {
  GET_USER_BY_ID,
  GET_VENUE_DETAILS_BY_ID,
  GET_VENUE_PACKAGES_BY_VENUE_ID,
  GET_VENUE_CATEGORIES_LIST,
} from "@/utils/apiconstants";
import InvitePageFlashLoader from "@/components/wonderland/common/InvitePageFlashLoader";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import TemplateRenderer from "@/components/wonderland/common/TemplateRenderer";
import TemplatecardSkeleton from "@/components/wonderland/TemplateSkeleton/templatecardSkeleton";
import VenueFoodModal from "@/components/VenueFoodModal";
import VenueFoodCard from "@/components/VenueFoodCard";
import TermsModal from "@/components/TermsModal";
import useRsvpStatus from "@/hooks/useRsvpStatus";
import { safeGetItem } from "@/utils/safeStorage";
import VenueAddressSection from "@/components/VenueAddressSection";
import VenueHighlights from "@/components/VenueHighlights";
import VenueCategoryPills from "@/components/VenueCategoryPills";
import { getPageCache, setPageCache } from "@/utils/scrollDataCache";
import VenueNameOverlay from "@/components/VenueNameOverlay";
import Head from "next/head";

const VenuePage = () => {
  const router = useRouter();
  const { venueid: queryVenueId, city } = router.query;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false);
  const [showHostActionSection, setShowHostActionSection] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState(
    safeGetItem("userID") || "",
  );
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pushRsvpClick, setPushRsvpClick] = useState(false);
  const [skipRsvpCheck, setSkipRsvpCheck] = useState(true);
  const [venuePackages, setVenuePackages] = useState([]);
  const [venueCategories, setVenueCategories] = useState([]);
  const {} = useRsvpStatus(queryVenueId, skipRsvpCheck);
  const { data, loading } = useApi(
    `${GET_VENUE_CATEGORIES_LIST}`,
    "get",
  );
  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();
  const { makeRequest: fetchVenuePackages } = useApi();
  const { guests, parking, rooms, halls: hallsParam } = router.query;

  const venueForHighlights = eventDetails
    ? {
        ...eventDetails,
        guestCapacity: eventDetails.guestCapacity || guests,
        isParkingAvailable: eventDetails.isParkingAvailable ?? (parking === "1"),
        totalRoomsAvailable: eventDetails.totalRoomsAvailable || Number(rooms) || 0,
        hallType: eventDetails.hallType || (hallsParam ? JSON.parse(hallsParam) : []),
      }
    : null;

  // SEO title/description/canonical (city-aware)
  const cityDisplay = city
    ? city.charAt(0).toUpperCase() + city.slice(1)
    : "";

  const venueLocationLabel = eventDetails?.location || cityDisplay;

  const venueTitle = eventDetails?.venueName
    ? `${eventDetails.venueName}${venueLocationLabel ? `, ${venueLocationLabel}` : ""} — Book Now`
    : "Venue Details & Booking";

  const venueDescription = eventDetails?.venueName
    ? `Book ${eventDetails.venueName}${venueLocationLabel ? ` in ${venueLocationLabel}` : ""} for your next event. Check packages, guest capacity & real photos.`
    : "View venue packages, capacity, and photos for your next event.";

  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href.split("?")[0] : "";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;

      if (queryVenueId && !loggedinUserId) {
        setShowGuestLoginModal(true);
      }
      setFullPageLoader(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [router.isReady, queryVenueId, loggedinUserId]);

  useEffect(() => {
    const cached = getPageCache("venue-categories");
    if (cached) {
      setVenueCategories(cached.data);
    }
  }, []);

  useEffect(() => {
    if (data?.data) {
      setVenueCategories(data.data);
      setPageCache("venue-categories", data.data);
    }
  }, [data]);

  useLayoutEffect(() => {
    const fetchEventDetails = async () => {
      if (!queryVenueId || !loggedinUserId) return;

      const cacheKey = `venue-details-${queryVenueId}`;
      const cached = getPageCache(cacheKey);

      if (cached) {
        setEventDetails(cached.data);
        setFullPageLoader(false);
        if (!cached.isStale) return;
      }

      try {
        await fetchEventInvite(
          `${GET_VENUE_DETAILS_BY_ID}/${queryVenueId}`,
          "GET",
        );
      } catch (err) {
        console.error("Error fetching event details:", err);
      }
    };
    fetchEventDetails();
  }, [queryVenueId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchUserDetails = async () => {
      if (!queryVenueId || !loggedinUserId) return;

      const cacheKey = `venue-user-${loggedinUserId}`;
      const cached = getPageCache(cacheKey);

      if (cached) {
        setUserData(cached.data);
        if (!cached.isStale) return;
      }

      try {
        let resp = await fetchUserData(
          `${GET_USER_BY_ID}/${loggedinUserId}`,
          "GET",
        );
        setUserData(resp?.data);
        setPageCache(cacheKey, resp?.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, [queryVenueId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchVenuePackage = async () => {
      if (!queryVenueId || !loggedinUserId) return;

      const cacheKey = `venue-packages-${queryVenueId}`;
      const cached = getPageCache(cacheKey);

      if (cached) {
        setVenuePackages(cached.data);
        if (!cached.isStale) return;
      }

      try {
        let resp = await fetchVenuePackages(
          `${GET_VENUE_PACKAGES_BY_VENUE_ID}/${queryVenueId}`,
          "GET",
        );
        setVenuePackages(resp?.data);
        setPageCache(cacheKey, resp?.data);
      } catch (err) {
        console.error("Error fetching venue packages:", err);
      }
    };
    fetchVenuePackage();
  }, [queryVenueId, loggedinUserId]);

  useLayoutEffect(() => {
    if (eventData?.data) {
      setEventDetails(eventData.data);
      setFullPageLoader(false);
      if (queryVenueId) {
        setPageCache(`venue-details-${queryVenueId}`, eventData.data);
      }
    }
  }, [eventData]);

  useLayoutEffect(() => {
    if (eventDetails && loggedinUserId) {
      if (eventDetails?.userId === loggedinUserId) {
        setSkipRsvpCheck(true);
      } else {
        setSkipRsvpCheck(false);
      }
    }
  }, [eventDetails, loggedinUserId]);

  useEffect(() => {
    const syncLoginState = () =>
      setLoggedinUserId(safeGetItem("userID") || "");
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  // Back button handler
  useEffect(() => {
    const anyModalOpen = selectedPackage || showGuestLoginModal;

    if (anyModalOpen) {
      window.history.pushState({ modalOpen: true }, "");
    }

    const handleBack = () => {
      if (selectedPackage) {
        window.history.pushState({ modalOpen: true }, "");
        setSelectedPackage(null);
        return;
      }
      if (showGuestLoginModal) {
        window.history.pushState({ modalOpen: true }, "");
        setShowGuestLoginModal(false);
        return;
      }
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [selectedPackage, showGuestLoginModal]);

  useEffect(() => {
    setTimeout(() => {
      if (eventDetails && eventDetails?.userId === loggedinUserId) {
        setShowHostActionSection(true);
      } else {
        setShowHostActionSection(false);
      }
    }, 1000);
  }, [eventDetails, loggedinUserId]);
const PHONE = "7338584828"; 

const handleEnquire = () => {
  const venueName = eventDetails?.venueName || "this venue";
  const location = eventDetails?.city || eventDetails?.location || "";
  const capacity = eventDetails?.guestCapacity;
  const price = eventDetails?.startingPrice;

  const message = `Hi, I'm interested in *${venueName}*${location ? ` (${location})` : ""}.
${capacity ? `Guest Capacity: ${capacity}` : ""}
${price ? `Starting Price: ₹${price}/plate` : ""}

Please share more details and availability.`;

  const encodedMessage = encodeURIComponent(message.trim());
  window.open(`https://wa.me/91${PHONE}?text=${encodedMessage}`, "_blank");
};
  if (fullPageLoader) return <InvitePageFlashLoader />;

  return (
    <>
      <Head>
        <title>{venueTitle}</title>
        <meta name="description" content={venueDescription} />
        <meta name="robots" content="index, follow" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        <meta property="og:title" content={venueTitle} />
        <meta property="og:description" content={venueDescription} />
        <meta property="og:type" content="place" />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {eventDetails?.venueImageUrl && (
          <meta property="og:image" content={eventDetails.venueImageUrl} />
        )}
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={venueTitle} />
        <meta name="twitter:description" content={venueDescription} />
        {eventDetails?.venueImageUrl && (
          <meta name="twitter:image" content={eventDetails.venueImageUrl} />
        )}
      </Head>

      <div className="invite-page">
        <div className="invite-page-container">
          {/* Template */}
          <div
            className="invite-template-shell"
            style={{ position: "relative", marginTop: "12px" }}
          >
            {fetchEventLoading ? (
              <TemplatecardSkeleton
                width="100%"
                height="200px"
                borderRadius="10px"
              />
            ) : (
              <>
                <TemplateRenderer
                  fetchEventLoading={fetchEventLoading}
                  eventDetails={eventDetails}
                  orderDetails={eventDetails}
                  isHost={true}
                  isVenue={true}
                />
                <VenueNameOverlay venueName={eventDetails?.venueName} />
              </>
            )}
          </div>

          {/* Address + Google Map — date/time hide */}
          {(eventDetails?.location || eventDetails?.googleMapLink) && (
            <div className="invite-address-section">
              <VenueAddressSection
                eventData={eventDetails}
                hideDateAndTime={true}
              />
            </div>
          )}

          {/* Food Packages */}
          {venuePackages.length > 0 && (
            <div
              className="whos-joining-container"
              style={{
                marginTop: "clamp(3px, 1.27vw, 5px)",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  marginTop: "10px",
                  padding: "0 4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {venuePackages.map((item, index) => (
                  <VenueFoodCard
                    key={index}
                    item={item}
                    onView={() => setSelectedPackage(item)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="venue-tax-note">
            <span className="venue-tax-line" />
            <span className="venue-tax-text">* Included All Plus Taxes *</span>
            <span className="venue-tax-line" />
          </div>
          <div className="enquire-card">
           <VenueHighlights venue={venueForHighlights} onEnquire={handleEnquire} />
            <VenueCategoryPills categories={eventDetails?.venueType} />
          </div>

          {/* Celebration Wall */}
          <div className="event-wall-container">
            <h2 className="wall-heading mt-2 p-0" style={{ textAlign: "left" }}>
              Explore Spaces
            </h2>
            <VenueWallSection
              userData={userData}
              setPushRsvpClick={setPushRsvpClick}
              rsvpSubmitted={false}
              isHost={eventDetails?.userId === loggedinUserId}
              isVenueHost={true}
              venueImageUrl={eventDetails?.venueImageUrl}
            />
          </div>
        </div>
      </div>

      {selectedPackage && (
        <VenueFoodModal
          data={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          categories={venueCategories}
        />
      )}

      <LoginModal
        isOpen={showGuestLoginModal}
        onClose={() => setShowGuestLoginModal(false)}
      />
    </>
  );
};

export default VenuePage;