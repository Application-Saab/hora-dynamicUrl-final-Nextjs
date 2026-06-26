import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ExploreTemplateIcon from "@/assets/wonderland/ExploreTemplateIcon.svg";
import ShareInviteIcon from "@/assets/wonderland/ShareInviteIcon.svg";
import AddDetailsIcon from "@/assets/wonderland/AddDetailsIcon.svg";
import AddDetailsModal from "../create-invite/AddDetailsModal";
import ShareInviteModal from "./ShareInviteModal";
import { usePathname } from "next/navigation";
import useApi from "@/hooks/useApi";
import { GENERATE_SHARE_CODE } from "@/utils/apiconstants";

const actions = [
  {
    id: 1,
    title: "Invitation Templates",
    icon: "ExploreTemplateIcon",
  },
  {
    id: 2,
    title: "Share Invitation",
    icon: "ShareInviteIcon",
  },
  {
    id: 3,
    title: "Event Details",
    icon: "AddDetailsIcon",
  },
];

const InviteActions = ({ eventData, refetchInvite, frompanel }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { eventid } = router.query;
  const [openAddDetailsModal, setOpenAddDetailsModal] = useState(false);
  const [openShareInviteModal, setOpenShareInviteModal] = useState(false);
  const { makeRequest } = useApi();
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderlandinternational",
  );
  const generatingRef = useRef(false);

  const handleClick = (actionId) => {
    if (actionId === 1) {
      if (isWonderlandInternational) {
        if (frompanel == "true") {
          router.push(
            `/wonderlandinternational/templates?eventid=${eventid}&frompanel=true`,
          );
        }
        router.push(`/wonderlandinternational/templates?eventid=${eventid}`);
      } else {
        if (frompanel == "true") {
          router.push(
            `/wonderland/templates?eventid=${eventid}&frompanel=true`,
          );
        }
        router.push(`/wonderland/templates?eventid=${eventid}`);
      }
      return;
    }

    if (actionId === 2) {
      setOpenShareInviteModal(true);
    }
    if (actionId === 3) {
      setOpenAddDetailsModal(true);
    }
  };

  const handleCreateShareCode = async (retryCount = 0) => {
    if (!eventid) return;
    if (generatingRef.current) return;
    try {
      generatingRef.current = true;

      const resp = await makeRequest(
        `${GENERATE_SHARE_CODE}/${eventid}`,
        "POST",
        {
          fromInternational: isWonderlandInternational ? "YES" : "NO",
        },
      );

      if (resp?.data) {
        refetchInvite();
      }
    } catch (err) {
      console.error("Generate share code error:", err);

      // Retry max 3 times
      if (retryCount < 3) {
        const retryDelay = (retryCount + 1) * 2000;

        setTimeout(() => {
          generatingRef.current = false;

          handleCreateShareCode(retryCount + 1);
        }, retryDelay);

        return;
      }
    }

    generatingRef.current = false;
  };

  useEffect(() => {
    if (!eventid) return;

    if (eventData?.shortCode) return;

    handleCreateShareCode();
  }, [eventData?.shortCode, eventid]);

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

      <ShareInviteModal
        eventData={eventData}
        isOpen={openShareInviteModal}
        onClose={() => setOpenShareInviteModal(false)}
      />
    </>
  );
};

export default InviteActions;
