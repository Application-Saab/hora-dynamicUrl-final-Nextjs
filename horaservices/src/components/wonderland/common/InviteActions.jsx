import React, { useState } from "react";
import ExploreTemplateIcon from "@/assets/ExploreTemplateIcon.svg";
import ShareInviteIcon from "@/assets/ShareInviteIcon.svg";
import AddDetailsIcon from "@/assets/AddDetailsIcon.svg";
import AddDetailsModal from "../create-invite/AddDetailsModal";

const actions = [
  {
    id: 1,
    title: "Explore Templates",
    icon: "ExploreTemplateIcon",
  },
  {
    id: 2,
    title: "Share Invitation",
    icon: "ShareInviteIcon",
  },
  {
    id: 3,
    title: "Add Details",
    icon: "AddDetailsIcon",
  },
];

const InviteActions = ({ eventData, refetchInvite }) => {
  const [openAddDetailsModal, setOpenAddDetailsModal] = useState(false);
  const handleClick = (actionId) => {
    // Handle action based on actionId
    if (actionId === 3) {
      setOpenAddDetailsModal(true);
    }
  };

  return (
    <>
      {actions.map((action) => (
        <div
          key={action.id}
          className="action-item-icon-wrapper"
          onClick={() => handleClick(action.id)}
        >
          <div className="invite-action-item">
            <img
              src={
                action.icon === "ExploreTemplateIcon"
                  ? ExploreTemplateIcon.src
                  : action.icon === "ShareInviteIcon"
                  ? ShareInviteIcon.src
                  : AddDetailsIcon.src
              }
              alt={action.title}
              className="invite-action-icon"
              width={action.icon === "AddDetailsIcon" ? "20px" : "19px"}
              height={
                action.icon === "AddDetailsIcon"
                  ? "25px"
                  : action.icon === "ShareInviteIcon"
                  ? "19px"
                  : "16.5px"
              }
            />
          </div>
          <p className="invite-action-text">
            {action.title.split(" ")[0]} <br /> {action.title.split(" ")[1]}
          </p>
        </div>
      ))}
      <AddDetailsModal
        eventData={eventData}
        isOpen={openAddDetailsModal}
        refetchInvite={() => refetchInvite()}
        onClose={() => setOpenAddDetailsModal(false)}
      />
    </>
  );
};

export default InviteActions;
