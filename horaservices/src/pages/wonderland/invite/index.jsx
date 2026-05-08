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
    localStorage.getItem("userID") || ""
  );
  const [skipRsvpCheck, setSkipRsvpCheck] = useState(true);
  const [rsvpRefetch, setRsvpRefetch] = useState(0);
  const [showHostActionSection, setShowHostActionSection] = useState(false);
  const [pushRsvpClick, setPushRsvpClick] = useState(false);

  const { rsvpSubmitted } = useRsvpStatus(queryEventId, skipRsvpCheck, rsvpRefetch);

  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();

  const { makeRequest: fetchUserData } = useApi();

  const isHost = eventDetails?.userId === loggedinUserId;

  // ─── Router ready + auth redirect ─────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;
      if (!queryEventId && loggedinUserId) setOpenCreateInviteModal(true);
      if (queryEventId && !loggedinUserId) setShowGuestLoginModal(true);
      setFullPageLoader(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [router.isReady, queryEventId, loggedinUserId]);

  // ─── Fetch event details ───────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!queryEventId || !loggedinUserId) return;

    const fetchEventDetails = async () => {
      try {
        await fetchEventInvite(`${GET_EVENT_BY_ID}/${queryEventId}`, "GET");
      } catch (err) {
        console.error("Error fetching event details:", err);
      }
    };

    fetchEventDetails();
  }, [queryEventId, loggedinUserId]);

  // ─── Fetch user details ────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!queryEventId || !loggedinUserId) return;

    const fetchUserDetails = async () => {
      try {
        const resp = await fetchUserData(`${GET_USER_BY_ID}/${loggedinUserId}`, "GET");
        setUserData(resp?.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [queryEventId, loggedinUserId]);

  // ─── Set event details from API response ──────────────────────────────────
  useLayoutEffect(() => {
    if (eventData?.data) {
      setEventDetails(eventData.data);
      setFullPageLoader(false);
    }
  }, [eventData]);

  // ─── RSVP check skip logic ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!eventDetails || !loggedinUserId) return;
    setSkipRsvpCheck(eventDetails.userId === loggedinUserId);
  }, [eventDetails, loggedinUserId]);

  // ─── Listen for login state changes (cross-tab + same-tab) ────────────────
  useEffect(() => {
    const syncLoginState = () => {
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  // ─── Host action section visibility ───────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHostActionSection(isHost);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isHost]);

  if (fullPageLoader) return <InvitePageFlashLoader />;

  const hasAddressInfo =
    eventDetails?.eventDate ||
    eventData?.location ||
    eventData?.googleMapLink ||
    eventData?.eventTime;

  return (
    <>
      <div className="invite-page">
        <div className="invite-page-container">

          {/* ── Template (image or video) ── */}
          <div className="invite-template-shell">
            <TemplateRenderer
              fetchEventLoading={fetchEventLoading}
              eventDetails={eventDetails}
              orderDetails={eventDetails}
              isHost={isHost}
            />
          </div>

          {/* ── Address / Location ── */}
          {hasAddressInfo && (
            <div className="invite-address-section">
              <InviteAddressSection eventData={eventDetails} />
            </div>
          )}

          {/* ── Host Actions ── */}
          {showHostActionSection && (
            <div className="invite-action-container">
              <InviteActions
                refetchInvite={() => refetchEventInvite()}
                eventData={eventDetails}
              />
            </div>
          )}

          {/* ── Who's Joining ── */}
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

          {/* ── Celebration Wall ── */}
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
