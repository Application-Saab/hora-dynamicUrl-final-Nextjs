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

const InvitesPage = () => {
  const router = useRouter();
  const { eventid: queryEventId } = router.query;
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
  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;

      if (!queryEventId && loggedinUserId) {
        setOpenCreateInviteModal(true);
      }
      if (queryEventId && !loggedinUserId) {
        setShowGuestLoginModal(true);
      }
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
            "GET",
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

  useLayoutEffect(() => {
    if (eventDetails && loggedinUserId) {
      if (eventDetails?.userId === loggedinUserId) {
        setSkipRsvpCheck(true);
      } else {
        setSkipRsvpCheck(false);
      }
    }
  }, [eventDetails, loggedinUserId]);

  // Listen local storage changes for login state
  useEffect(() => {
    const syncLoginState = () => {
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);

    // Sync on same tab login without change page
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

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
          <div className="whos-joining-container" style={{marginTop: !showHostActionSection ? '10px' : '0px'}}>
            <WhosJoining
              isHost={eventDetails?.userId === loggedinUserId}
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
              isHost={eventDetails?.userId === loggedinUserId}
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
