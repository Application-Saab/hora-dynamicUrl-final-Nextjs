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
  console.log(
    "%c [ allImages ]-26",
    "font-size:13px; background:pink; color:#bf2c9f;",
    allImages
  );

  const MAX_PARALLEL_UPLOADS = 5;
  let activeUploads = 0;
  let uploadQueue = [];

  // Measure height of thumbnail/local image
  function measureImageHeight(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img.height);
      img.onerror = () => resolve(0);
    });
  }

  // Reorder — Tallest image → Big block (pos 3)
  function reorderByHeight(items) {
    const result = [];

    for (let i = 0; i < items.length; i += 6) {
      const chunk = items.slice(i, i + 6);

      if (chunk.length < 6) {
        result.push(...chunk);
        continue;
      }

      const tallest = [...chunk].sort((a, b) => b.height - a.height)[0];

      const arranged = [];
      chunk.forEach((img) => {
        if (img === tallest) return;
        arranged.push(img);
      });

      arranged.splice(3, 0, tallest);
      result.push(...arranged);
    }

    return result;
  }

  // Measure heights + reorder
  async function processImagesWithHeight(list) {
    const enriched = await Promise.all(
      list?.map(async (item) => ({
        ...item,
        height: await measureImageHeight(
          item?.postWebpUrl || item?.postUrl || item?.localPreview
        ),
      }))
    );

    return reorderByHeight(enriched);
  }

  useEffect(() => {
    async function loadEventPosts() {
      if (!eventid) return;

      const draftBase64 = localStorage.getItem("thankyou-note-draft");
      let draftItem = null;

      if (draftBase64) {
        draftItem = {
          id: "draft-temp",
          file: null,
          localPreview: draftBase64,
          isVideo: false,
          progress: 0,
          status: "draft",
          postUrl: null,
          postWebpUrl: null,
          postType: "thankYouNote",
        };
      }

      const cached = getCachedEvent(eventid);
      let merged = cached ? [...cached] : [];

      if (draftItem) merged = [draftItem, ...merged];

      // measure height + reorder
      setAllImages(await processImagesWithHeight(merged));

      const resp = await getAllPosts(`${GET_ALL_POSTS}/${eventid}`, "GET");

      if (resp.data) {
        let fresh = [...resp.data];
        if (draftItem) fresh = [draftItem, ...fresh];

        const processed = await processImagesWithHeight(fresh);

        setAllImages(processed);
        cacheEvent(eventid, resp.data);
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

  const updateUploadedUrls = async (id, postUrl, thumbnailUrl) => {
    let updatedList;

    // update URLs synchronously
    setAllImages((prev) => {
      updatedList = prev.map((item) =>
        item.id === id ? { ...item, postUrl, postWebpUrl: thumbnailUrl } : item
      );
      return updatedList;
    });

    // reorder asynchronously using height
    const processed = await processImagesWithHeight(updatedList);

    // finally update reordered list
    setAllImages(processed);
  };

  const handleUploadPictureClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);

      const tempItems = files.map((file) => ({
        id: Math.random().toString(36).substring(2),
        file,
        localPreview: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video"),
        progress: 0,
        status: "queued",
        postUrl: null,
        postWebpUrl: null,
        postType: "selfUploaded",
      }));

      // instantly show + reorder
      setAllImages(await processImagesWithHeight([...tempItems, ...allImages]));

      uploadQueue.push(...tempItems);
      for (let i = 0; i < MAX_PARALLEL_UPLOADS; i++) processNextUpload();
    };

    input.click();
  };

  async function handleSingleUpload(tempItem) {
    const { file, id, isVideo } = tempItem;

    try {
      updateStatus(id, "uploading");

      let uploadResult;

      if (isVideo) {
        uploadResult = await uploadVideo(
          file,
          userId,
          eventid,
          "self-upload",
          (percent) => updateProgress(id, percent)
        );
      } else {
        uploadResult = await uploadImage(
          file,
          userId,
          eventid,
          "self-upload",
          (percent) => updateProgress(id, percent)
        );
      }

      if (!uploadResult.success) {
        updateStatus(id, "error");
        return;
      }

      await updateUploadedUrls(
        id,
        uploadResult.originalUrl,
        uploadResult.thumbnailUrl
      );

      await createPost(`${CREATE_NEW_POST}/${eventid}`, "POST", {
        postById: userId,
        postByName: userData?.name || "Guest",
        postType: "selfUploaded",
        postUrl: uploadResult.originalUrl,
        postKey: uploadResult.originalKey,
        postWebpUrl: uploadResult.thumbnailUrl,
        postWebpKey: uploadResult.thumbnailKey,
      });

      updateStatus(id, "done");
    } catch (err) {
      console.error(err);
      updateStatus(id, "error");
    }
  }

  async function processNextUpload() {
    if (activeUploads >= MAX_PARALLEL_UPLOADS) return;
    if (uploadQueue.length === 0) return;

    activeUploads++;
    const nextItem = uploadQueue.shift();

    await handleSingleUpload(nextItem);

    activeUploads--;
    processNextUpload();
  }

  useEffect(() => {
    const clear = () => {
      clearAllEventCache();
      localStorage.removeItem("thankyou-note-draft");
    };

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
                    thumbnail.postUrl?.match(/\.(mp4|mov|avi|mkv)$/i) ||
                    thumbnail.isVideo;

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
