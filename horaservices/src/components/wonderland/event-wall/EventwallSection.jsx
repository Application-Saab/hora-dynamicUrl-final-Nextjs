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

const EventwallSection = ({ userData }) => {
  const router = useRouter();
  const { eventid } = router.query;
  const { makeRequest: createPost } = useApi();
  const { makeRequest: getAllPosts } = useApi();
  const userId = localStorage.getItem("userID") || userData?._id;
  const [allImages, setAllImages] = useState([]);

  const MAX_PARALLEL_UPLOADS = 5;
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

  const updateProgress = (id, percent) => {
    setAllImages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress: percent } : item
      )
    );
  };

  const updateStatus = (id, status) => {
    setAllImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const updateUploadedUrls = (id, postUrl, thumbnailUrl) => {
    setAllImages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, postUrl, postWebpUrl: thumbnailUrl } : item
      )
    );
  };

  const handleUploadPictureClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);

      const tempItems = files.map((file) => {
        const isVideo = file.type.startsWith("video");
        const localPreview = URL.createObjectURL(file);

        return {
          id: Math.random().toString(36).substring(2),
          file,
          localPreview,
          isVideo,
          progress: 0,
          status: "queued",
          postUrl: null,
          postWebpUrl: null,
        };
      });

      // Show instantly
      setAllImages((prev) => [...tempItems, ...prev]);

      // Add to queue
      uploadQueue.push(...tempItems);

      // Start 5 parallel workers
      for (let i = 0; i < MAX_PARALLEL_UPLOADS; i++) {
        processNextUpload();
      }
    };

    input.click();
  };

  async function handleSingleUpload(tempItem) {
    const { file, id, isVideo } = tempItem;

    try {
      updateStatus(id, "uploading");

      let uploadResult;

      if (isVideo) {
        uploadResult = await uploadVideo(file, userId, eventid, 'self-upload', (percent) =>
          updateProgress(id, percent)
        );
      } else {
        uploadResult = await uploadImage(file, userId, eventid, 'self-upload', (percent) =>
          updateProgress(id, percent)
        );
      }

      if (!uploadResult.success) {
        updateStatus(id, "error");
        return;
      }

      updateUploadedUrls(
        id,
        uploadResult.originalUrl,
        uploadResult.thumbnailUrl
      );

      // Create DB post
      const postPayload = {
        postById: userId,
        postByName: userData?.name || "Guest",
        postType: "selfUploaded",
        postUrl: uploadResult.originalUrl,
        postKey: uploadResult.originalKey,
        postWebpUrl: uploadResult.thumbnailUrl,
        postWebpKey: uploadResult.thumbnailKey,
      };

      await createPost(`${CREATE_NEW_POST}/${eventid}`, "POST", postPayload);

      updateStatus(id, "done");
    } catch (err) {
      console.error(err);
      updateStatus(id, "error");
    }
  }

  async function processNextUpload() {
    if (activeUploads >= MAX_PARALLEL_UPLOADS) return;
    if (uploadQueue.length === 0) return;

    const nextItem = uploadQueue.shift();
    activeUploads++;

    handleSingleUpload(nextItem).finally(() => {
      activeUploads--;
      processNextUpload();
    });
  }

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
      onClick: handleUploadPictureClick,
    },
  ];

  useEffect(() => {
    const clear = () => clearAllEventCache();
    window.addEventListener("beforeunload", clear);
    return () => window.removeEventListener("beforeunload", clear);
  }, []);

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
    </>
  );
};

export default EventwallSection;
