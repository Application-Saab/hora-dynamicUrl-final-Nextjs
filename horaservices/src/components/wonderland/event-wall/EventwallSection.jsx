import React, { useState } from "react";
import { useRouter } from "next/router";
import NotesButtonIcon from "@/assets/NotesButtonIcon.svg";
import PostBadgeButtonIcon from "@/assets/PostBadgeButtonIcon.svg";
import GalleryButtonIcon from "@/assets/GalleryButtonIcon.svg";
import NopostCamera from "@/assets/NopostCamera.svg";

const EventwallSection = () => {
  const [allImages, setAllImages] = useState([]);

 const router = useRouter()
    const { eventid } = router.query;
  const actionButtons = [
     {
      label: "Notes",
      icon: NotesButtonIcon.src,
      onClick: () => router.push(`/wonderland/Thankyou-note?eventid=${eventid}`),
    },
    {
      label: "Post Badge",
      icon: PostBadgeButtonIcon.src,
      onClick: () => console.log("Post Badge clicked"),
    },
    {
      label: "Upload Pictures",
      icon: GalleryButtonIcon.src,
      onClick: () => console.log("Upload Pictures clicked"),
    },
  ];

  return (
    <>
      <div className="event-wall-action-ctn">
        {actionButtons.map(({ label, icon, onClick }, index) => (
          <button
            key={index}
            className="event-wall-action-btn"
            onClick={onClick}
          >
            <img
              src={icon}
              alt={`${label} Icon`}
              className="event-wall-action-icon me-1"
              height="18px"
              width="16px"
            />
            {label}
          </button>
        ))}
      </div>

      <div>
        {allImages.length === 0 ? (
          <div className="eventwall-nopost-ctn">
            <div className="nopost-box d-flex justify-content-center align-items-center flex-column">
              <img
                src={NopostCamera.src}
                alt="No Post Camera"
                className=""
              />
              <p className="line-1">
                No memories here yet! Be the First to share.
              </p>
              <p className="line-2">
                Everyone can upload photos & videos from the event!
              </p>
              <p className="line-2 line-3">Let’s fill this wall with joy!</p>
            </div>
          </div>
        ) : (
          <div className="event-wall-images-grid">
            {allImages.map((imageSrc, index) => (
              <img
                key={index}
                src={imageSrc}
                alt={`Event Wall Post ${index + 1}`}
                className="event-wall-image"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EventwallSection;
