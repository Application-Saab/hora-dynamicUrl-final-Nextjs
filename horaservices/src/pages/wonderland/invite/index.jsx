import React, { useState } from "react";
import "./invite.css";
import DefaultTemplate from "@/assets/NewDefaultTemplate.png";
// import InvitePageFlashLoader from "@/components/wonderland/common/InvitePageFlashLoader";
// import CreateInviteModal from "@/components/wonderland/create-invite/CreateInviteModal";
import InviteActions from "@/components/wonderland/common/InviteActions";
import WhosJoining from "@/components/wonderland/rsvp/WhosJoining";
import EventwallSection from "@/components/wonderland/event-wall/EventwallSection";

const InvitesPage = () => {
  // const [openCreateInviteModal, setOpenCreateInviteModal] = useState(true);

  return (
    // <InvitePageFlashLoader />
    // <CreateInviteModal
    //   isOpen={openCreateInviteModal}
    //   onClose={() => setOpenCreateInviteModal(false)}
    // />
    <div className="invite-page">
      <div className="invite-page-container">
        <img
          src={DefaultTemplate.src}
          alt="Default Invitation Template"
          className="default-invite-image"
        />
        <div className="invite-action-container">
          <InviteActions />
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
  );
};

export default InvitesPage;
