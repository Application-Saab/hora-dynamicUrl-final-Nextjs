"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NotesButtonIcon from "@/assets/wonderland/NotesButtonIcon.svg";
import PostBadgeButtonIcon from "@/assets/wonderland/PostBadgeButtonIcon.svg";
import GalleryButtonIcon from "@/assets/wonderland/GalleryButtonIcon.svg";
import NopostCamera from "@/assets/wonderland/NopostCamera.svg";
import { uploadImage, uploadVideo } from "@/utils/handleMediaUpload";
import useApi from "@/hooks/useApi";
import { CREATE_NEW_POST, GET_ALL_POSTS } from "@/utils/apiconstants";
import {
  cacheEvent,
  clearAllEventCache,
  getCachedEvent,
} from "@/utils/eventCache";
import "../../common/EventLazyImage.css";
import EventwallGalleryItem from "./EventwallGalleryItem";
import UploadPhotoModal from "./UploadPhotoModal";

const EventwallSection = ({ userData }) => {
  const router = useRouter();
  const { eventid } = router.query;
  const { makeRequest: createPost } = useApi();
  const { makeRequest: getAllPosts } = useApi();
  const userId = localStorage.getItem("userID") || userData?._id;
  const [allImages, setAllImages] = useState([]);
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
 
  let activeUploads = 0;
  let uploadQueue = [];

  useEffect(() => {
    async function loadEventPosts() {
      if (!eventid) return;

      // Try cache first
      const cached = getCachedEvent(eventid);
      if (cached) {
        setAllImages(cached);
      }

      // Get fresh data from API (for new posts only)
      const resp = await getAllPosts(`${GET_ALL_POSTS}/${eventid}`, "GET");

      if (resp.data) {
        // Only update cache if new data exists
        if (JSON.stringify(resp.data) !== JSON.stringify(cached)) {
          setAllImages(resp.data);
          cacheEvent(eventid, resp.data);
        }
      }
    }

    loadEventPosts();
  }, [eventid]);

  useEffect(() => {
    const clear = () => clearAllEventCache();
    window.addEventListener("beforeunload", clear);
    return () => window.removeEventListener("beforeunload", clear);
  }, []);

  const actionButtons = [
    {
      label: "Notes",
      icon: NotesButtonIcon.src,
      onClick: () =>
        router.push(`/wonderland/Thankyou-note?eventid=${eventid}`),
    },
    {
      label: "Post Badge",
      icon: PostBadgeButtonIcon.src,
      onClick: () => console.log("Post Badge clicked"),
    },
    {
      label: "Upload Pictures",
      icon: GalleryButtonIcon.src,
      // onClick: handleUploadPictureClick,
      onClick: () => setShowUploadPhotoModal(true),
    },
  ];

  function getBlockType(index) {
    const pos = index % 6;
    if (pos === 0 || pos === 1 || pos === 2) return "small";
    if (pos === 3) return "big";
    if (pos === 4) return "small-right-top";
    if (pos === 5) return "small-right-bottom";
  }

  return (
    <>
      <div className="event-wall-action-ctn">
        {actionButtons.map(({ label, icon, onClick }, index) => (
          <button
            key={index}
            className={`event-wall-action-btn event-wall-action-btn-${index}`}
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
              <img src={NopostCamera.src} alt="No Post Camera" className="" />
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
          <div style={{ position: "relative", marginTop: "auto" }}>
            <div
              style={{
                margin: "20px auto",
              }}
            >
              <div className="event-image-grid">
                {allImages?.map((thumbnail, indexOnPage) => {
                  const type = getBlockType(indexOnPage);
                  const isVideo =
                    thumbnail.postUrl?.match(/\.(mp4|mov|avi|mkv)$/i);

                  return (
                    <div
                      key={thumbnail._id || indexOnPage}
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        backgroundColor: "transparent",
                        display: "grid",
                      }}
                      className={`grid-item ${type}`}
                      
                    >
                      <EventwallGalleryItem
                        isVideo={isVideo}
                        thumbnail={thumbnail}
                        indexOnPage={indexOnPage}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <UploadPhotoModal
        isOpen={showUploadPhotoModal}
        onClose={() => setShowUploadPhotoModal(false)}
        eventid={eventid}
        userId={userId}
        userData={userData}
        setAllImages={setAllImages}
      />
    </>
  );
};

export default EventwallSection;
