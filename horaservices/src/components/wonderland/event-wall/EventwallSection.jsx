import React, { useState } from "react";
import NotesButtonIcon from "@/assets/NotesButtonIcon.svg";
import PostBadgeButtonIcon from "@/assets/PostBadgeButtonIcon.svg";
import GalleryButtonIcon from "@/assets/GalleryButtonIcon.svg";
import NopostCamera from "@/assets/NopostCamera.svg";

const EventwallSection = () => {
  const [allImages, setAllImages] = useState([]);
  return (
    <>
      <div className="event-wall-action-ctn">
        <button className="event-wall-action-btn">
          <img
            src={NotesButtonIcon.src}
            alt="Notes Button Icon"
            className="event-wall-action-icon me-1"
            height="18px"
            width="16px"
          />
          Notes
        </button>
        <button className="event-wall-action-btn">
          <img
            src={PostBadgeButtonIcon.src}
            alt="Notes Button Icon"
            className="event-wall-action-icon me-1"
            height="18px"
            width="16px"
          />
          Post Badge
        </button>
        <button className="event-wall-action-btn">
          <img
            src={GalleryButtonIcon.src}
            alt="Notes Button Icon"
            className="event-wall-action-icon me-1"
            height="18px"
            width="16px"
          />
          Upload Pictures
        </button>
      </div>
      <div>
        {allImages.length === 0 ? (
          <div className="eventwall-nopost-ctn mt-5">
            <div className="nopost-box d-flex justify-content-center align-items-center flex-column">
              <img
                src={NopostCamera.src}
                alt="No Post Camera"
                className="mb-3"
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
