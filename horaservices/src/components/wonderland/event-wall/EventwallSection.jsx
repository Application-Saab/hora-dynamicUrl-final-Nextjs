"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { processImagesWithHeight } from "@/utils/eventWallHelpers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../pages/weblink-gallery/gallery.css";
import { IoCloseSharp } from "react-icons/io5";
const EventwallSection = ({
  userData,
  rsvpSubmitted,
  setPushRsvpClick,
  isHost,
}) => {
  const router = useRouter();
  const { eventid } = router.query;
  const { makeRequest: createPost } = useApi();
  const { makeRequest: getAllPosts } = useApi();
  const userId = localStorage.getItem("userID") || userData?._id;
  const [allImages, setAllImages] = useState([]);
  const imagesRef = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const isVideoFile = (url = "") => /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(url);
  const [imageNumber, setImageNumber] = useState(0);

  useEffect(() => {
    imagesRef.current = allImages;
  }, [allImages]);

  const pauseAllVideos = () => {
    const videos = document.querySelectorAll('.popupContent video');
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  };

  const playActiveVideo = () => {
    const activeVideo = document.querySelector('.slick-current video');
    if (!activeVideo) return;

    activeVideo.currentTime = 0;

    const playWhenReady = () => {
      activeVideo.play().catch(console.error);
    };

    if (activeVideo.readyState >= 2) {
      playWhenReady();
    } else {
      activeVideo.addEventListener('loadeddata', playWhenReady, { once: true });
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: allImages.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,

    beforeChange: (_, next) => {
      pauseAllVideos();
      setImageNumber(next + 1);
    },

    afterChange: () => {
      playActiveVideo();
    },
  };

  const MAX_PARALLEL_UPLOADS = 5;
  let activeUploads = 0;
  let uploadQueue = [];

  useEffect(() => {
    async function loadEventPosts() {
      if (!eventid) return;

      const draftBase64 = localStorage.getItem(
        `thankyou-note-draft-${eventid}`,
      );
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

  useEffect(() => {
    if (!eventid) return;

    const handleRouteChange = (url) => {
      const nextPathname = new URL(url, window.location.origin).pathname;

      const isCurrentlyInvite = router.pathname.includes("/invite");
      const isNextInvite = nextPathname.includes("/invite");

      // If leaving the invite page
      if (isCurrentlyInvite && !isNextInvite) {
        localStorage.removeItem(`thankyou-note-draft-${eventid}`);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [eventid, router.pathname]);

  const updateProgress = (id, percent) => {
    setAllImages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress: percent } : item,
      ),
    );
  };

  const updateStatus = (id, status) => {
    setAllImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const updateUploadedUrls = async (id, postUrl, thumbnailUrl) => {
    const current = imagesRef.current;

    if (!Array.isArray(current) || current.length === 0) return;

    const updatedList = current.map((item) =>
      item.id === id ? { ...item, postUrl, postWebpUrl: thumbnailUrl } : item,
    );

    // UI updates immediately
    setAllImages(updatedList);

    const processed = await processImagesWithHeight(updatedList);

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
          (percent) => updateProgress(id, percent),
        );
      } else {
        uploadResult = await uploadImage(
          file,
          userId,
          eventid,
          "self-upload",
          (percent) => updateProgress(id, percent),
        );
      }

      if (!uploadResult.success) {
        updateStatus(id, "error");
        return;
      }

      await updateUploadedUrls(
        id,
        uploadResult.originalUrl,
        uploadResult.thumbnailUrl,
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

  useEffect(() => {
    if (selectedIndex !== null) {
      setImageNumber(selectedIndex + 1);
      // Slight delay to ensure slider is mounted and classes are applied
      setTimeout(() => {
        playActiveVideo();
      }, 0);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) {
      pauseAllVideos();
    }
  }, [selectedIndex]);

  return (
    <>
      <div className="event-wall-action-ctn">
        {actionButtons.map(({ label, icon, onClick }, index) => (
          index !== 1 &&
          <button
            key={index}
            className={`event-wall-action-btn event-wall-action-btn-${index}`}
            onClick={() => {
              isHost
                ? onClick()
                : rsvpSubmitted
                  ? onClick()
                  : setPushRsvpClick(true);
            }}
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
        {allImages.length === 0 || (!rsvpSubmitted && !isHost) ? (
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
                    const isLoading = !thumbnail?.postWebpUrl && thumbnail.status !== "done";

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
                      onClick={() => setSelectedIndex(indexOnPage)}
                    >
                      <EventwallGalleryItem
                        isVideo={isVideo}
                        indexOnPage={indexOnPage}
                        fullVideoSrc={thumbnail?.postUrl}
                        progress={thumbnail?.progress}
                        postType={thumbnail?.postType}
                        id={thumbnail?._id}
                        previewSrc={isLoading ? thumbnail.localPreview : thumbnail.postWebpUrl}
                        imageUrl={isLoading ? thumbnail.localPreview : thumbnail.postWebpUrl}
                        isEventWall={true}
                      />
                    </div>
                  );
                })}
              </div>
              {selectedIndex !== null && allImages[selectedIndex] && (
                <div
                  className="popupOverlay"
                  onClick={() => setSelectedIndex(null)}
                  role="dialog"
                  aria-modal="true"
                  style={{zIndex: 9999}}
                >
                  <div
                    className="popupContent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="popupHeader">
                      <span className="image-index">
                        {`${imageNumber} / ${allImages.length}`}
                      </span>

                      <button
                        className="closeButton"
                        onClick={() => setSelectedIndex(null)}
                        aria-label="Close"
                      >
                        <IoCloseSharp size={24} color="#fff" />
                      </button>
                    </div>

                    {/* Slider */}
                    <Slider
                      {...sliderSettings}
                      initialSlide={selectedIndex}
                      key={`eventwall-slider-${selectedIndex}`}
                    >
                      {allImages.map((item, idx) => {
                        const isLoading = !item.postWebpUrl && item.status !== "done";
                        const mediaUrl = isLoading ? item.localPreview : item.postWebpUrl;
                        const isVideo = item.isVideo || isVideoFile(mediaUrl);

                        return (
                          <div
                            key={item._id || idx}
                            className="slick-slide-item"
                          >
                            {isVideo ? (
                              <video
                                src={isLoading ? item.localPreview : item.postUrl}
                                controls
                                playsInline
                                muted={false}
                                preload="auto"
                                style={{
                                  maxHeight: "80vh",
                                  width: "100%",
                                  objectFit: "contain",
                                  background: "#000",
                                }}
                              />
                            ) : (
                              <img
                                src={mediaUrl}
                                alt={`Media ${idx + 1}`}
                                style={{
                                  maxHeight: "80vh",
                                  width: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventwallSection;