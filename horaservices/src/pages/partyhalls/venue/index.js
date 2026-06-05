import React, { useEffect, useLayoutEffect, useState } from "react";
import "./venue.css";
import InviteActions from "@/components/wonderland/common/InviteActions";
import CreateInviteModal from "@/components/wonderland/create-invite/CreateInviteModal";
import EventwallSection from "@/components/wonderland/event-wall/EventwallSection";
import { useRouter } from "next/router";
import useApi from "@/hooks/useApi";
import { GET_EVENT_BY_ID, GET_USER_BY_ID } from "@/utils/apiconstants";
import InvitePageFlashLoader from "@/components/wonderland/common/InvitePageFlashLoader";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import TemplateRenderer from "@/components/wonderland/common/TemplateRenderer";
import TemplatecardSkeleton from "@/components/wonderland/TemplateSkeleton/templatecardSkeleton";
import VenueFoodModal from "@/components/VenueFoodModal";
import VenueFoodCard from "@/components/VenueFoodCard";
import { getFoodPackagesByEventId } from "@/utils/venuedatalist/eventFoodPackages.js";
import TermsModal from "@/components/TermsModal";
import VenueAddressSection from "@/components/VenueCommon/VenueAddressSection";
import { getTermsByEventId } from "@/utils/venuedatalist/EventTerms";
import useRsvpStatus from "@/hooks/useRsvpStatus";

const PartyhallsInvitePage = () => {
  const router = useRouter();
  const { venueid: queryVenueId } = router.query;
  const [showTermsModal, setShowTermsModal] = useState(true);
  const venueTerms = getTermsByEventId(queryVenueId);
  console.log('%c [ venueTerms ]', 'font-size:13px; background:pink; color:#bf2c9f;', venueTerms)
  const [eventDetails, setEventDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false);
  const [showHostActionSection, setShowHostActionSection] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || "",
  );
  const [openCreateInviteModal, setOpenCreateInviteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pushRsvpClick, setPushRsvpClick] = useState(false);
  const [skipRsvpCheck, setSkipRsvpCheck] = useState(true);
  const {} = useRsvpStatus(queryVenueId, skipRsvpCheck);
  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();

  // Event ID ke hisaab se food packages
  const foodPackages = getFoodPackagesByEventId(queryVenueId);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;

      if (!queryVenueId && loggedinUserId) {
        setOpenCreateInviteModal(true);
      }
      if (queryVenueId && !loggedinUserId) {
        setShowGuestLoginModal(true);
      }
      setFullPageLoader(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [router.isReady, queryVenueId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchEventDetails = async () => {
      if (queryVenueId && loggedinUserId) {
        try {
          await fetchEventInvite(`${GET_EVENT_BY_ID}/${queryVenueId}`, "GET");
        } catch (err) {
          console.error("Error fetching event details:", err);
        }
      }
    };
    fetchEventDetails();
  }, [queryVenueId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchUserDetails = async () => {
      if (queryVenueId && loggedinUserId) {
        try {
          let resp = await fetchUserData(
            `${GET_USER_BY_ID}/${loggedinUserId}`,
            "GET",
          );
          setUserData(resp?.data);
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      }
    };
    fetchUserDetails();
  }, [queryVenueId, loggedinUserId]);

  useLayoutEffect(() => {
    if (eventData?.data) {
      setEventDetails(eventData.data);
      setFullPageLoader(false);
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
  console.log("loggedinUserId", loggedinUserId);

  useEffect(() => {
    const syncLoginState = () =>
      setLoggedinUserId(localStorage.getItem("userID") || "");
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  // Back button handler
  useEffect(() => {
    const anyModalOpen =
      selectedPackage || showGuestLoginModal || openCreateInviteModal;

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
      if (openCreateInviteModal) {
        window.history.pushState({ modalOpen: true }, "");
        setOpenCreateInviteModal(false);
        return;
      }
      router.back();
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [selectedPackage, showGuestLoginModal, openCreateInviteModal]);
  useEffect(() => {
    setTimeout(() => {
      if (eventDetails && eventDetails.userId === loggedinUserId) {
        setShowHostActionSection(true);
      } else {
        setShowHostActionSection(false);
      }
    }, 1000);
  }, [eventDetails, loggedinUserId]);
  if (fullPageLoader) return <InvitePageFlashLoader />;

  return (
    <>
      <div className="invite-page">
        <div className="invite-page-container">
          {/* Template */}
          <div className="invite-template-shell">
            {fetchEventLoading ? (
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
                isHost={eventDetails?.userId === loggedinUserId}
              />
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

          {/* InviteActions — sirf actual host ko */}
          {showHostActionSection && (
            <div className="invite-action-container">
              <InviteActions
                refetchInvite={() => refetchEventInvite()}
                eventData={eventDetails}
              />
            </div>
          )}

          {/* Food Packages */}
          {foodPackages.length > 0 && (
            <div
              className="whos-joining-container"
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <h2 className="wall-heading text-center m-0 p-0">Packages</h2>
              <div
                style={{
                  marginTop: "10px",
                  padding: "0 4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {foodPackages.map((item, index) => (
                  <VenueFoodCard
                    key={index}
                    item={item}
                    onView={() => setSelectedPackage(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {venueTerms && (
            <>
              <div
                className="terms-strip"
                onClick={() => setShowTermsModal(true)}
              >
                <div className="terms-blob" />
                <div className="terms-blob2" />
                <div className="terms-seal">
                  <svg viewBox="0 0 24 24" fill="none" width={20} height={20}>
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="terms-body">
                  <p className="terms-title">Terms &amp; Conditions</p>
                  <p className="terms-sub">Tap to read before booking</p>
                </div>
                <div className="terms-view-btn">View</div>
              </div>

              <TermsModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                venueId={queryVenueId}
              />
            </>
          )}
          {/* Celebration Wall */}
          <div className="event-wall-container">
            <h2 className="wall-heading text-center m-0 p-0">Explore Spaces</h2>
            <EventwallSection
              userData={userData}
              setPushRsvpClick={setPushRsvpClick}
              rsvpSubmitted={false}
              isHost={eventDetails?.userId === loggedinUserId}
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

      <CreateInviteModal
        isOpen={openCreateInviteModal}
        onClose={() => setOpenCreateInviteModal(false)}
        getRedirectRoute={(data) => ({
          pathname: "/partyhalls/venue",
          query: { venueid: data._id },
        })}
      />
      <LoginModal
        isOpen={showGuestLoginModal}
        onClose={() => setShowGuestLoginModal(false)}
      />
    </>
  );
};

export default PartyhallsInvitePage;
