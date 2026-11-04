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
import FAQSection from "../FAQSection";
import TermsModal from "./TermsModal";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
import {
  MARKETING_EVENTS,
  trackWhatsAppButtonClick,
} from "@/utils/marketingEvents";
import HeadPhoneIcon from "../../assets/venue/calling_headphone_icon.svg";
import WatsappIcon from "../../assets/venue/check_availability_wa.svg";
import Image from "next/image";

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
  console.log(
    "%c [ eventDetails ]",
    "font-size:13px; background:pink; color:#bf2c9f;",
    eventDetails,
  );
  const [venuePackages, setVenuePackages] = useState(initialPackages || []);
  console.log(
    "%c [ venuePackages ]",
    "font-size:13px; background:pink; color:#bf2c9f;",
    venuePackages,
  );
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
  const [openTerms, setOpenTerms] = useState(false);
  const [open, setOpen] = useState(false);

  const intro = eventDetails?.description || "";
  const words = intro ? intro.split(" ") : [];
  const firstLine = words?.slice(0, 8).join(" ");
  const restText = words?.slice(8).join(" ");

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
    trackWhatsAppButtonClick(
      MARKETING_EVENTS.WHATSAPP_BUTTONS.VENUE_ENQUIRE_NOW_BTN,
      {
        button_name: "Enquire Now",
        button_type: "enquire_now_venue",
        page_path: window.location.pathname,
      },
    );
    trackWAClicks();
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
        <div
          className="invite-page-container"
          style={{ paddingInline: "4.5px" }}
        >
          {/* Template / Banner */}
          <div
            className="invite-template-shell"
            style={{
              position: "relative",
              marginTop: "9px",
              marginBottom: "0px",
              paddingBottom: "0px",
            }}
          >
            {fetchEventLoading && !eventDetails ? (
              <TemplatecardSkeleton
                width="100%"
                height="200px"
                borderRadius="11px"
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
            <div className="venue-address-section">
              <VenueAddressSection
                eventData={eventDetails}
                hideDateAndTime={true}
              />
            </div>
          )}

          {venuePackages.length > 0 && (
            <div className="packages-container">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
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

          {eventDetails?.termsAndConditionsHtml && (
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "4px",
              }}
            >
              <button
                className="view-terms-btn"
                type="button"
                onClick={() => setOpenTerms(true)}
              >
                Terms & Condition
              </button>
            </div>
          )}
          <VenueHighlights venueDetails={eventDetails} />
          {eventDetails?.description && (
            <div className="cc-accordion">
              <button
                className={`cc-acc-btn ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
              >
                <span className="cc-acc-preview">
                  {firstLine}
                  {!open && "…"}
                </span>
                <span className={`cc-acc-icon ${open ? "open" : ""}`}>
                  <svg viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              <div className={`cc-acc-body ${open ? "open" : ""}`}>
                <p className="cc-acc-text">{restText}</p>
              </div>
            </div>
          )}

          <div className="chat-banner-ctn-venue">
            {/* Left: Icon + Text Group */}
            <div className="venue-chat-left">
              <div className="calling-wrapper">
                <Image
                  src={HeadPhoneIcon}
                  alt="Support"
                  height={18}
                  width={18}
                  className="calling-icon-img"
                />
              </div>
              <div className="venue-chat-text-wrap">
                <h3 className="venue-chat-banner-title">
                  Have a special request ?
                </h3>
                <p className="venue-chat-banner-subtitle">
                  Our team is here to help you plan the perfect event.
                </p>
              </div>
            </div>

            {/* Right: WhatsApp Button */}
            <button type="button" className="venue-chat-banner-wa-btn">
              <Image
                src={WatsappIcon}
                alt="WA"
                className="wa-img-venue-chat-banner"
              />
              <span>Check Availability</span>
            </button>
          </div>

          <div className="venue-wall-container">
            <VenueWallSection
              userData={userData}
              setPushRsvpClick={setPushRsvpClick}
              rsvpSubmitted={false}
              isHost={eventDetails?.userId === loggedinUserId}
              isVenueHost={true}
              venueImageUrl={eventDetails?.venueImageUrl}
            />
          </div>
          {eventDetails?.faqs?.length > 0 && (
            <FAQSection faqData={eventDetails?.faqs} />
          )}
        </div>
      </div>

      {selectedPackage && (
        <VenueFoodModal
          data={selectedPackage}
          onClose={closeModal}
          categories={venueCategories}
        />
      )}

      <TermsModal
        show={openTerms}
        onHide={() => setOpenTerms(false)}
        htmlContent={eventDetails?.termsAndConditionsHtml}
      />

      <LoginModal
        isOpen={showGuestLoginModal}
        onClose={() => setShowGuestLoginModal(false)}
      />
    </>
  );
};

export default VenuePage;
