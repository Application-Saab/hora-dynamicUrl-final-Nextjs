import React, { useEffect, useLayoutEffect, useState } from "react";
import "./invite.css";
import DefaultTemplate from "@/assets/NewDefaultTemplate.png";
import CreateInviteModal from "@/components/wonderland/create-invite/CreateInviteModal";
import InviteActions from "@/components/wonderland/common/InviteActions";
import WhosJoining from "@/components/wonderland/rsvp/WhosJoining";
import EventwallSection from "@/components/wonderland/event-wall/EventwallSection";
import { useRouter } from "next/router";
import useApi from "@/hooks/useApi";
import { GET_EVENT_BY_ID } from "@/utils/apiconstants";
import InvitePageFlashLoader from "@/components/wonderland/common/InvitePageFlashLoader";
import InviteAddressSection from "@/components/wonderland/common/InviteAddressSection";

const InvitesPage = () => {
  const router = useRouter();
  const { eventid: queryEventId } = router.query;
  const userId = localStorage.getItem("userID") || "";
  const [openCreateInviteModal, setOpenCreateInviteModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [fullPageLoader, setFullPageLoader] = useState(true);

  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;

      if (!queryEventId && userId) {
        setOpenCreateInviteModal(true);
        setFullPageLoader(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [router.isReady, queryEventId]);

  useLayoutEffect(() => {
    const fetchEventDetails = async () => {
      if (queryEventId) {
        try {
          await fetchEventInvite(`${GET_EVENT_BY_ID}/${queryEventId}`, "GET");
        } catch (err) {
          console.error("Error fetching event details:", err);
        }
      }
    };
    fetchEventDetails();
  }, [queryEventId]);

  useEffect(() => {
    if (eventData?.data) {
      setEventDetails(eventData.data);
      setFullPageLoader(false);
    }
  }, [eventData]);

  if (fullPageLoader) return <InvitePageFlashLoader />;

  return (
    <>
      <div className="invite-page">
        <div className="invite-page-container">
          <div className="default-template-wrapper">
            {!fetchEventLoading || eventDetails?.hostName ? (
              <>
                <img
                  src={DefaultTemplate.src}
                  alt="Default Invitation Template"
                  className="default-invite-image"
                />
                <div className="default-template-text w-100">
                  <p>{eventDetails?.hostName}</p>
                </div>{" "}
              </>
            ) : (
              <div className="placeholder-glow mb-4">
                <div
                  className="placeholder w-100"
                  style={{ height: "200px", borderRadius: "10px" }}
                ></div>
              </div>
            )}
          </div>

          {(eventDetails?.eventDate ||
            eventData?.location ||
            eventData?.googleMapLink ||
            eventData?.eventTime) && (
            <div className="invite-address-section">
              <InviteAddressSection eventData={eventDetails} />
            </div>
          )}

          <div className="invite-action-container">
            <InviteActions
              refetchInvite={() => refetchEventInvite()}
              eventData={eventDetails}
            />
          </div>
          <div className="whos-joining-container">
            <WhosJoining />
          </div>
          <div className="event-wall-container">
            <p className="wall-heading text-center">Celebration Wall</p>
            <EventwallSection />
          </div>
        </div>
      </div>
      <CreateInviteModal
        isOpen={openCreateInviteModal}
        onClose={() => setOpenCreateInviteModal(false)}
      />
    </>
  );
};

export default InvitesPage;
