import React, { useState } from "react";
import NotesButtonIcon from "@/assets/NotesButtonIcon.svg";
import PostBadgeButtonIcon from "@/assets/PostBadgeButtonIcon.svg";
import GalleryButtonIcon from "@/assets/GalleryButtonIcon.svg";

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
          <p
            className="text-center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              color: "#666666",
            }}
          >
            No posts yet. Be the first to post on the celebration wall!
          </p>
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
