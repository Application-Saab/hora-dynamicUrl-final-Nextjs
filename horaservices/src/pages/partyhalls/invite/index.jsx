import React, { useEffect, useLayoutEffect, useState } from "react";
import "./invite.css";
import InviteActions from "@/components/wonderland/common/InviteActions";
import CreateInviteModal from "@/components/wonderland/create-invite/CreateInviteModal";
import EventwallSection from "@/components/wonderland/event-wall/EventwallSection";
import { useRouter } from "next/router";
import useApi from "@/hooks/useApi";
import { GET_EVENT_BY_ID, GET_USER_BY_ID } from "@/utils/apiconstants";
import InvitePageFlashLoader from "@/components/wonderland/common/InvitePageFlashLoader";
import InviteAddressSection from "@/components/wonderland/common/InviteAddressSection";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import TemplateRenderer from "@/components/wonderland/common/TemplateRenderer";
import TemplatecardSkeleton from "@/components/wonderland/TemplateSkeleton/templatecardSkeleton";
import VenueFoodModal from "@/components/VenueFoodModal";
import VenueFoodCard from "@/components/VenueFoodCard";
import { getFoodPackagesByEventId } from "@/utils/venuedatalist/eventFoodPackages.js";

const PartyhallsInvitePage = () => {
  const router = useRouter();
  const { eventid: queryEventId } = router.query;

  const [eventDetails, setEventDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || ""
  );
  const [openCreateInviteModal, setOpenCreateInviteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pushRsvpClick, setPushRsvpClick] = useState(false);

  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();

  const isHost = eventDetails?.userId === loggedinUserId;

  // Event ID ke hisaab se food packages
  const foodPackages = getFoodPackagesByEventId(queryEventId);

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
          let resp = await fetchUserData(
            `${GET_USER_BY_ID}/${loggedinUserId}`,
            "GET"
          );
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
    const anyModalOpen = selectedPackage || showGuestLoginModal || openCreateInviteModal;

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
                isHost={true}
              />
            )}
          </div>

          {/* Address + Google Map — date/time hide */}
          {(eventDetails?.location || eventDetails?.googleMapLink) && (
            <div className="invite-address-section">
              <InviteAddressSection
                eventData={eventDetails}
                hideDateAndTime={true}
              />
            </div>
          )}

          {/* InviteActions — sirf actual host ko */}
          {isHost && (
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
              style={{ marginTop: "10px" }}
            >
              <p className="wall-heading text-center m-0 p-0">Packages</p>
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

          {/* Celebration Wall */}
          <div className="event-wall-container">
            <p className="wall-heading text-center m-0 p-0">Gallery</p>
            <EventwallSection
              userData={userData}
              setPushRsvpClick={setPushRsvpClick}
              rsvpSubmitted={false}
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

export default PartyhallsInvitePage;
