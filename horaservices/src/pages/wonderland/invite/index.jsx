import React, { useEffect, useLayoutEffect, useState } from "react";
import "./invite.css";
import CreateInviteModal from "@/components/wonderland/create-invite/CreateInviteModal";
import InviteActions from "@/components/wonderland/common/InviteActions";
import WhosJoining from "@/components/wonderland/rsvp/WhosJoining";
import EventwallSection from "@/components/wonderland/event-wall/EventwallSection";
import { useRouter } from "next/router";
import useApi from "@/hooks/useApi";
import { GET_EVENT_BY_ID, GET_USER_BY_ID } from "@/utils/apiconstants";
import InvitePageFlashLoader from "@/components/wonderland/common/InvitePageFlashLoader";
import InviteAddressSection from "@/components/wonderland/common/InviteAddressSection";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import TemplateRenderer from "@/components/wonderland/common/TemplateRenderer";
import TemplatecardSkeleton from "@/components/wonderland/TemplateSkeleton/templatecardSkeleton";
import useRsvpStatus from "@/hooks/useRsvpStatus";
import VenueFoodModal from "@/components/VenueFoodModal";
import VenueFoodCard from "@/components/VenueFoodCard";

// ─── Dynamic food packages — event ID ke hisaab se ──────────────────────────
import { getFoodPackagesByEventId } from "@/utils/venuedatalist/eventFoodPackages.js";
// ────────────────────────────────────────────────────────────────────────────

const InvitesPage = () => {
  const router = useRouter();
  const { eventid: queryEventId, invenue } = router.query;

  const isVenueHost = invenue === "true";

  const [openCreateInviteModal, setOpenCreateInviteModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || "",
  );
  const [skipRsvpCheck, setSkipRsvpCheck] = useState(true);
  const [rsvpRefetch, setRsvpRefetch] = useState(0);
  const [showHostActionSection, setShowHostActionSection] = useState(false);
  const { rsvpSubmitted } = useRsvpStatus(
    queryEventId,
    skipRsvpCheck,
    rsvpRefetch,
  );
  const [pushRsvpClick, setPushRsvpClick] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();

  const isHost = eventDetails?.userId === loggedinUserId;

  // ─── Event ID ke hisaab se food packages ────────────────────────────────────
  const foodPackages = getFoodPackagesByEventId(queryEventId);
  // ────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;
      if (!queryEventId && loggedinUserId) setOpenCreateInviteModal(true);
      if (queryEventId && !loggedinUserId) setShowGuestLoginModal(true);
      setFullPageLoader(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [router.isReady, queryEventId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchEventDetails = async () => {
      if (queryEventId && loggedinUserId) {
        try {
          await fetchEventInvite(`${GET_EVENT_BY_ID}/${queryEventId}`, "GET");
        } catch (err) {
          console.error("Error fetching event details:", err);
        }
      }
    };
    fetchEventDetails();
  }, [queryEventId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchUserDetails = async () => {
      if (queryEventId && loggedinUserId) {
        try {
          let resp = await fetchUserData(`${GET_USER_BY_ID}/${loggedinUserId}`, "GET");
          setUserData(resp?.data);
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      }
    };
    fetchUserDetails();
  }, [queryEventId, loggedinUserId]);

  useLayoutEffect(() => {
    if (eventData?.data) {
      setEventDetails(eventData.data);
      setFullPageLoader(false);
    }
  }, [eventData]);

  useLayoutEffect(() => {
    if (eventDetails && loggedinUserId) {
      setSkipRsvpCheck(isHost ? true : false);
    }
  }, [eventDetails, loggedinUserId]);

  useEffect(() => {
    const syncLoginState = () => setLoggedinUserId(localStorage.getItem("userID") || "");
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowHostActionSection(eventDetails && isHost ? true : false);
    }, 1000);
  }, [eventDetails, loggedinUserId]);

// ─── selectedPackage ke liye back button handler ────────────────────────────
useEffect(() => {
  if (!isVenueHost) return;

  if (selectedPackage) {
    // Dummy state push karo taaki back press intercept ho sake
    window.history.pushState({ venueModal: true }, "");
  }

  const handleBack = (e) => {
    if (selectedPackage) {
      // Browser ko back jane se roko — sirf modal band karo
      window.history.pushState({ venueModal: true }, "");
      setSelectedPackage(null);
    }
  };

  window.addEventListener("popstate", handleBack);
  return () => window.removeEventListener("popstate", handleBack);
}, [selectedPackage, isVenueHost]);

  if (fullPageLoader) return <InvitePageFlashLoader />;

  // ─── VENUE FLOW ─────────────────────────────────────────────────────────────
  if (isVenueHost) {
    return (
      <>
        <div className="invite-page">
          <div className="invite-page-container">

            {/* Step 1: Template */}
            <div className="invite-template-shell">
              {fetchEventLoading ? (
                <TemplatecardSkeleton width="100%" height="200px" borderRadius="10px" />
              ) : (
                <TemplateRenderer
                  fetchEventLoading={fetchEventLoading}
                  eventDetails={eventDetails}
                  orderDetails={eventDetails}
                  isHost={true}
                />
              )}
            </div>

            {/* Step 2: Address + Google Map */}
            {(eventDetails?.location || eventDetails?.googleMapLink) && (
              <div className="invite-address-section">
                <InviteAddressSection eventData={eventDetails} hideDateAndTime={true} />
              </div>
            )}

            {/* Step 3: InviteActions — sirf actual host ko */}
            {isHost && (
              <div className="invite-action-container">
                <InviteActions
                  refetchInvite={() => refetchEventInvite()}
                  eventData={eventDetails}
                />
              </div>
            )}

            {/* Step 4: Food Packages — event ID ke hisaab se */}
            {foodPackages.length > 0 && (
              <div className="whos-joining-container" style={{ marginTop: "10px" }}>
                <p className="wall-heading text-center m-0 p-0">Food Packages</p>
                <div style={{ marginTop: "10px", padding: "0 4px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {foodPackages.map((item, index) => (
                    <VenueFoodCard
                      key={index}
                      item={item}
                    onView={() => {
  setSelectedPackage(item);
}}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Celebration Wall */}
            <div className="event-wall-container">
              <p className="wall-heading text-center m-0 p-0">Celebration Wall</p>
              <EventwallSection
                userData={userData}
                setPushRsvpClick={setPushRsvpClick}
                rsvpSubmitted={rsvpSubmitted}
                isHost={isHost}
                isVenueHost={true}
              />
            </div>

          </div>
        </div>

        {selectedPackage && (
          <VenueFoodModal
            data={selectedPackage}
            onClose={() => setSelectedPackage(null)}
          />
        )}

        <LoginModal
          isOpen={showGuestLoginModal}
          onClose={() => setShowGuestLoginModal(false)}
        />
      </>
    );
  }
  // ────────────────────────────────────────────────────────────────────────────

  // ─── NORMAL FLOW ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="invite-page">
        <div className="invite-page-container">
          <div className="invite-template-shell">
            {fetchEventLoading ? (
              <TemplatecardSkeleton width="100%" height="200px" borderRadius="10px" />
            ) : (
              <TemplateRenderer
                fetchEventLoading={fetchEventLoading}
                eventDetails={eventDetails}
                orderDetails={eventDetails}
                isHost={isHost}
              />
            )}
          </div>

          {((eventDetails && eventDetails?.eventDate) ||
            eventData?.location ||
            eventData?.googleMapLink ||
            eventData?.eventTime) && (
            <div className="invite-address-section">
              <InviteAddressSection eventData={eventDetails} />
            </div>
          )}

          {showHostActionSection && (
            <div className="invite-action-container">
              <InviteActions
                refetchInvite={() => refetchEventInvite()}
                eventData={eventDetails}
              />
            </div>
          )}

          <div
            className="whos-joining-container"
            style={{ marginTop: !showHostActionSection ? "10px" : "0px" }}
          >
            <WhosJoining
              isHost={isHost}
              userData={userData}
              loggedinUserId={loggedinUserId}
              rsvpSubmitted={rsvpSubmitted}
              setPushRsvpClick={setPushRsvpClick}
              pushRsvpClick={pushRsvpClick}
              onRsvpUpdate={() => setRsvpRefetch((prev) => prev + 1)}
            />
          </div>

          <div className="event-wall-container">
            <p className="wall-heading text-center m-0 p-0">Celebration Wall</p>
            <EventwallSection
              userData={userData}
              setPushRsvpClick={setPushRsvpClick}
              rsvpSubmitted={rsvpSubmitted}
              isHost={isHost}
            />
          </div>
        </div>
      </div>

      <CreateInviteModal
        isOpen={openCreateInviteModal}
        onClose={() => setOpenCreateInviteModal(false)}
      />
      <LoginModal
        isOpen={showGuestLoginModal}
        onClose={() => setShowGuestLoginModal(false)}
      />
    </>
  );
};

export default InvitesPage;
