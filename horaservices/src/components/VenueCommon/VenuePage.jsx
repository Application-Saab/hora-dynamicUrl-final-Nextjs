import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import "../../pages/venue-list/venue/venue.css";
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
import useRsvpStatus from "@/hooks/useRsvpStatus";
import { safeGetItem } from "@/utils/safeStorage";
import VenueAddressSection from "@/components/VenueAddressSection";
import VenueHighlights from "@/components/VenueHighlights";
import VenueCategoryPills from "@/components/VenueCategoryPills";
import { getPageCache, setPageCache } from "@/utils/scrollDataCache";
import VenueNameOverlay from "@/components/VenueNameOverlay";
import Head from "next/head";

const VenuePage = ({
  city: propCity = null,
  initialEventDetails = null,
  initialPackages = null,
  initialCategories = null,
  venueId: propVenueId = null,
}) => {
  const router = useRouter();
  const { venueid: queryVenueId, city: queryCity } = router.query;
  const venueId = queryVenueId || propVenueId;

  // SSR data ko seedha state mein daalo
  const [eventDetails, setEventDetails] = useState(initialEventDetails);
  const [venuePackages, setVenuePackages] = useState(initialPackages || []);
  const [venueCategories, setVenueCategories] = useState(
    initialCategories || [],
  );
  const [userData, setUserData] = useState({});
  const [fullPageLoader, setFullPageLoader] = useState(
    !initialEventDetails && !(initialPackages?.length > 0),
  );
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false);
  const [showHostActionSection, setShowHostActionSection] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pushRsvpClick, setPushRsvpClick] = useState(false);
  const [skipRsvpCheck, setSkipRsvpCheck] = useState(true);

  const {} = useRsvpStatus(venueId, skipRsvpCheck);
  const { data } = useApi(`${GET_VENUE_CATEGORIES_LIST}`, "get");
  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();
  const { makeRequest: fetchVenuePackages } = useApi();

  const { guests, parking, rooms, halls: hallsParam } = router.query;

  const venueForHighlights = eventDetails
    ? {
        ...eventDetails,
        guestCapacity: eventDetails.guestCapacity || guests,
        isParkingAvailable: eventDetails.isParkingAvailable ?? parking === "1",
        totalRoomsAvailable:
          eventDetails.totalRoomsAvailable || Number(rooms) || 0,
        hallType:
          eventDetails.hallType || (hallsParam ? JSON.parse(hallsParam) : []),
      }
    : null;

  const city =
    propCity ||
    (queryCity ? queryCity.charAt(0).toUpperCase() + queryCity.slice(1) : "");

  const venueLocationLabel = eventDetails?.location || city;

  const venueTitle = eventDetails?.venueName
    ? `${eventDetails.venueName}${
        venueLocationLabel ? `, ${venueLocationLabel}` : ""
      } — Book Now`
    : "Venue Details & Booking";

  const venueDescription = eventDetails?.venueName
    ? `Book ${eventDetails.venueName}${
        venueLocationLabel ? ` in ${venueLocationLabel}` : ""
      } for your next event. Check packages, guest capacity & real photos.`
    : "View venue packages, capacity, and photos for your next event.";

  const SITE = "https://horaservices.com";

  const slugify = (val) =>
    String(val || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const citySlug = propCity
    ? slugify(propCity)
    : queryCity
      ? slugify(queryCity)
      : "";

  const idForCanonical =
    (typeof venueId === "string" && venueId) ||
    (Array.isArray(venueId) ? venueId[0] : "") ||
    "";

  const canonicalUrl = (() => {
    const path = citySlug
      ? `${SITE}/${citySlug}/venue-list/venue`
      : `${SITE}/venue-list/venue`;
    if (!idForCanonical) return path;
    return `${path}?venueid=${encodeURIComponent(idForCanonical)}`;
  })();

  // ----- Auth (client only) -----
  useEffect(() => {
    const id = safeGetItem("userID") || "";
    setLoggedinUserId(id);
    setAuthReady(true);
  }, []);

  useEffect(() => {
    const syncLoginState = () => {
      const id = safeGetItem("userID") || "";
      setLoggedinUserId(id);
      if (id) setShowGuestLoginModal(false);
    };
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  useEffect(() => {
    if (!router.isReady || !authReady) return;
    if (venueId && !loggedinUserId) {
      setShowGuestLoginModal(true);
    } else {
      setShowGuestLoginModal(false);
    }
    // Loader hamesha band kar do jab tak SSR data hai
    setFullPageLoader(false);
  }, [router.isReady, authReady, venueId, loggedinUserId]);

  // ----- Categories -----
  useEffect(() => {
    if (initialCategories?.length) return;
    const cached = getPageCache("venue-categories");
    if (cached) setVenueCategories(cached.data);
  }, [initialCategories]);

  useEffect(() => {
    if (data?.data) {
      setVenueCategories(data.data);
      setPageCache("venue-categories", data.data);
    }
  }, [data]);

  // ----- Client-side refresh (logged-in users) -----
  useLayoutEffect(() => {
    if (!venueId || !loggedinUserId) return;

    const cacheKey = `venue-details-${venueId}`;
    const cached = getPageCache(cacheKey);
    if (cached) {
      setEventDetails(cached.data);
      if (!cached.isStale) return;
    }

    fetchEventInvite(`${GET_VENUE_DETAILS_BY_ID}/${venueId}`, "GET").catch(
      (err) => console.error("Error fetching event details:", err),
    );
  }, [venueId, loggedinUserId]);

  useLayoutEffect(() => {
    if (!venueId || !loggedinUserId) return;

    const cacheKey = `venue-user-${loggedinUserId}`;
    const cached = getPageCache(cacheKey);
    if (cached) {
      setUserData(cached.data);
      if (!cached.isStale) return;
    }

    fetchUserData(`${GET_USER_BY_ID}/${loggedinUserId}`, "GET")
      .then((resp) => {
        setUserData(resp?.data);
        setPageCache(cacheKey, resp?.data);
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, [venueId, loggedinUserId]);

  useLayoutEffect(() => {
    if (!venueId || !loggedinUserId) return;
    if (initialPackages?.length) return; // already have SSR data

    const cacheKey = `venue-packages-${venueId}`;
    const cached = getPageCache(cacheKey);
    if (cached) {
      setVenuePackages(cached.data);
      if (!cached.isStale) return;
    }

    fetchVenuePackages(`${GET_VENUE_PACKAGES_BY_VENUE_ID}/${venueId}`, "GET")
      .then((resp) => {
        setVenuePackages(resp?.data || []);
        setPageCache(cacheKey, resp?.data);
      })
      .catch((err) => console.error("Error fetching venue packages:", err));
  }, [venueId, loggedinUserId]);

  useLayoutEffect(() => {
    if (eventData?.data) {
      setEventDetails(eventData.data);
      setFullPageLoader(false);
      if (venueId) setPageCache(`venue-details-${venueId}`, eventData.data);
    }
  }, [eventData]);

  useLayoutEffect(() => {
    if (eventDetails && loggedinUserId) {
      setSkipRsvpCheck(eventDetails?.userId === loggedinUserId);
    }
  }, [eventDetails, loggedinUserId]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (eventDetails && eventDetails?.userId === loggedinUserId) {
        setShowHostActionSection(true);
      } else {
        setShowHostActionSection(false);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [eventDetails, loggedinUserId]);

  // Modal history handling
  const modalHistoryPushedRef = useRef(false);

  useEffect(() => {
    const anyModalOpen = !!(selectedPackage || showGuestLoginModal);
    if (anyModalOpen && !modalHistoryPushedRef.current) {
      window.history.pushState({ modalOpen: true }, "");
      modalHistoryPushedRef.current = true;
    }
  }, [selectedPackage, showGuestLoginModal]);

  useEffect(() => {
    const handlePopState = () => {
      if (modalHistoryPushedRef.current) {
        modalHistoryPushedRef.current = false;
        setSelectedPackage(null);
        setShowGuestLoginModal(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const closeModal = () => {
    if (modalHistoryPushedRef.current) {
      window.history.back();
    } else {
      setSelectedPackage(null);
      setShowGuestLoginModal(false);
    }
  };

  const PHONE = "7338584828";

  const handleEnquire = () => {
    const venueName = eventDetails?.venueName || "this venue";
    const location = eventDetails?.city || eventDetails?.location || "";
    const capacity = eventDetails?.guestCapacity;
    const price = eventDetails?.startingPrice;

    const message = `Hi, I'm interested in *${venueName}*${
      location ? ` (${location})` : ""
    }.
${capacity ? `Guest Capacity: ${capacity}` : ""}
${price ? `Starting Price: ₹${price}/plate` : ""}

Please share more details and availability.`;

    window.open(
      `https://wa.me/91${PHONE}?text=${encodeURIComponent(message.trim())}`,
      "_blank",
    );
  };

  // Sirf tab full loader jab kuch bhi data na ho
  if (fullPageLoader && !eventDetails && venuePackages.length === 0) {
    return <InvitePageFlashLoader />;
  }

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
          {/* Template / Banner */}
          <div
            className="invite-template-shell"
            style={{ position: "relative", marginTop: "12px" }}
          >
            {fetchEventLoading && !eventDetails ? (
              <TemplatecardSkeleton
                width="100%"
                height="200px"
                borderRadius="10px"
              />
            ) : (
              <TemplateRenderer
                fetchEventLoading={fetchEventLoading}
                eventDetails={eventDetails}
                orderDetails={eventDetails}
                isHost={true}
                isVenue={true}
                topBannerOverlayContent={
                  <VenueNameOverlay venueName={eventDetails?.venueName} />
                }
              />
            )}
          </div>

          {/* Address - SSR se aayega agar data hai */}
          {(eventDetails?.location || eventDetails?.googleMapLink) && (
            <div className="invite-address-section">
              <VenueAddressSection
                eventData={eventDetails}
                hideDateAndTime={true}
              />
            </div>
          )}

          {/* PACKAGES - yeh ab page source mein full HTML ke saath aayega */}
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
                {venuePackages.map((item) => (
                  <VenueFoodCard
                    key={item._id || item.title}
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

          {/* Highlights + Categories */}
          <div className="enquire-card">
            <VenueHighlights
              venue={venueForHighlights}
              onEnquire={handleEnquire}
            />
            <VenueCategoryPills categories={eventDetails?.venueType} />
          </div>

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
          onClose={closeModal}
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
