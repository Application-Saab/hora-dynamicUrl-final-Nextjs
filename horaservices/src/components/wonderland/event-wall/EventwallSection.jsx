"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import NotesButtonIcon from "@/assets/wonderland/NotesButtonIcon.svg";
import PostBadgeButtonIcon from "@/assets/wonderland/PostBadgeButtonIcon.svg";
import GalleryButtonIcon from "@/assets/wonderland/GalleryButtonIcon.svg";
import NopostCamera from "@/assets/wonderland/NopostCamera.svg";
import {
  uploadMedia,
  getPendingUploads,
  updateQueueItem,
  removeFromQueue,
  addToQueue,
} from "@/utils/handleMediaUpload";
import useApi from "@/hooks/useApi";
import { GET_ALL_POSTS } from "@/utils/apiconstants";
import {
  cacheEvent,
  clearAllEventCache,
  getCachedEvent,
} from "@/utils/eventCache";
import "../../common/EventLazyImage.css";
import { EventwallGalleryItemWonderland } from "./EventwallGalleryItem";
import {
  deleteFromOPFS,
  getFileFromOPFS,
  getPreviewFromOPFS,
  processImagesWithHeight,
  saveFileToOPFS,
} from "@/utils/eventWallHelpers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../pages/photo-gallery/gallery.css";
import { IoCloseSharp } from "react-icons/io5";
import PaginationControls from "@/components/PaginationControls";
const EventwallSection = ({
  userData,
  rsvpSubmitted,
  setPushRsvpClick,
  isHost,
  isVenueHost = false, // NEW — venue flow ke liye
}) => {
  const router = useRouter();
  const { eventid } = router.query;
  const { makeRequest: getAllPosts } = useApi();
  const userId = localStorage.getItem("userID") || userData?._id;
  const [allImages, setAllImages] = useState([]);
  const imagesRef = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const isVideoFile = (url = "") => /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(url);
  const [imageNumber, setImageNumber] = useState(0);
    const canShowActionButtons = isVenueHost
    ? isHost
    : isHost || rsvpSubmitted;
   const canSeeImages = isVenueHost ? true : isHost || rsvpSubmitted;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 25;
  const [isIOSMobile, setIsIOSMobile] = useState(false);

  const currentImages = allImages;

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const isIOS = /iPhone|iPod/.test(navigator.userAgent);
      setIsIOSMobile(isIOS);
    }
  }, []);

  useEffect(() => {
    imagesRef.current = allImages;
  }, [allImages]);

  const pauseAllVideos = () => {
    const videos = document.querySelectorAll(".popupContent video");
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  };

  const playActiveVideo = () => {
    const activeVideo = document.querySelector(".slick-current video");
    if (!activeVideo) return;

    activeVideo.currentTime = 0;

    const playWhenReady = () => {
      activeVideo.play().catch(console.error);
    };

    if (activeVideo.readyState >= 2) {
      playWhenReady();
    } else {
      activeVideo.addEventListener("loadeddata", playWhenReady, { once: true });
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

  async function loadEventPosts(pageToLoad = 1) {
    if (!eventid) return;

    const draftBase64 = localStorage.getItem(`thankyou-note-draft-${eventid}`);

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

    // Show cache instantly (only page 1)
    if (pageToLoad === 1) {
      const cached = getCachedEvent(eventid);
      if (cached) {
        let merged = draftItem ? [draftItem, ...cached] : cached;
        setAllImages(await processImagesWithHeight(merged));
      }
    }

    const resp = await getAllPosts(
      `${GET_ALL_POSTS}/${eventid}?page=${pageToLoad}&limit=${ITEMS_PER_PAGE}`,
      "GET",
    );

    if (resp?.data?.posts) {
      let fresh = [...resp.data.posts];

      if (draftItem && pageToLoad === 1) {
        fresh = [draftItem, ...fresh];
      }

      const processed = await processImagesWithHeight(fresh);

      if (isIOSMobile) {
        setAllImages(processed);
      } else {
        setAllImages((prev) => {
          const pendingItems = prev.filter((item) =>
            ["queued", "uploading", "failed"].includes(item.status),
          );

          const oldBackendItems = prev.filter(
            (item) => !["queued", "uploading", "failed"].includes(item.status),
          );

          const newBackendItems = processed;

          const existingUrls = new Set(
            oldBackendItems.map((item) => item.postUrl),
          );

          const mergedBackend = [
            ...oldBackendItems,
            ...newBackendItems.filter(
              (item) => !existingUrls.has(item.postUrl),
            ),
          ];

          return [...pendingItems, ...mergedBackend];
        });
      }

      setTotalPages(resp.data.totalPages);

      if (pageToLoad === 1) {
        cacheEvent(eventid, resp.data.posts);
      }
    }
  }

  useEffect(() => {
    if (!eventid) return;

    const init = async () => {
      const cached = getCachedEvent(eventid);
      if (cached) {
        let merged = [];
        const draftBase64 = localStorage.getItem(
          `thankyou-note-draft-${eventid}`,
        );
        if (draftBase64) {
          merged.push({
            id: "draft-temp",
            localPreview: draftBase64,
            isVideo: false,
            status: "draft",
            postType: "thankYouNote",
          });
        }
        const processed = await processImagesWithHeight(cached);
        setAllImages(merged.length ? [...merged, ...processed] : processed);
      }

      // B. Pending uploads check & resume
      const pending = await getPendingUploads(eventid);
      if (pending.length > 0) {
        const existingIds = new Set(allImages.map((i) => i.id));
        const toShow = pending.filter((p) => !existingIds.has(p.id));

        if (toShow.length > 0) {
          const tempItems = await Promise.all(
            toShow.map(async (p) => {
              const preview = await getPreviewFromOPFS(
                eventid,
                p.id,
                p.fileName,
              );
              return {
                id: p.id,
                localPreview: preview,
                isVideo: p.isVideo,
                status: p.status,
                progress: p.progress || 0,
                postType: "selfUploaded",
              };
            }),
          );
          const processed = await processImagesWithHeight(tempItems);

          setAllImages((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));

            const newItems = processed.filter((i) => !existingIds.has(i.id));

            return [...newItems, ...prev];
          });
        }

        // Start uploading failed/queued ones
        processUploadQueue(true); // silent = true if you want no extra UI flash
      }

      // C. Fresh load from backend (page 1)
      await loadEventPosts(1);
    };

    init();
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
  const MAX_FILES = 10;

  async function processUploadQueue() {
    if (!eventid) return;

    let pending = await getPendingUploads(eventid);

    // reset stuck uploads
    for (const item of pending) {
      if (item.status === "uploading") {
        await updateQueueItem(item.id, { status: "queued" });
      }
    }

    pending = await getPendingUploads(eventid);

    for (const item of pending) {
      if (item.status === "done") continue;

      try {
        await updateQueueItem(item.id, { status: "uploading" });

        const file = await getFileFromOPFS(
          eventid,
          item.id,
          item.mimeType,
          item.fileName,
        );

        const posts = await uploadMedia(
          [file],
          userId,
          userData?.name || "Guest",
          eventid,
          (percent) => {
            updateProgress(item.id, percent);
            updateQueueItem(item.id, { progress: percent });
          },
          item.id
        );

        const post = posts[0];

        await updateUploadedUrls(item.id, post.postUrl, post.postWebpUrl);
        updateStatus(item.id, "done");

        await removeFromQueue(item.id);
        await deleteFromOPFS(eventid, item.id);
      } catch (err) {
        const newRetry = (item.retryCount || 0) + 1;
        const status = newRetry > 5 ? "failed" : "queued";

        await updateQueueItem(item.id, {
          status,
          retryCount: newRetry,
        });

        updateStatus(item.id, status);
      }
    }
  }

  const handleUploadPictureClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > MAX_FILES) {
        alert(`Maximum ${MAX_FILES} files allowed at once.`);
        return;
      }

      const optimisticItems = [];
      const now = Date.now();

      for (const file of files) {
        const id = crypto.randomUUID();
        const isVideo = file.type.startsWith("video/");
        const localPreview = URL.createObjectURL(file);

        const queueItem = {
          id,
          eventId: eventid,
          fileName: file.name,
          mimeType: file.type,
          isVideo,
          status: "queued",
          progress: 0,
          retryCount: 0,
          createdAt: now,
        };

        // 1. OPFS save
        const saved = await saveFileToOPFS(file, eventid, id);
        if (!saved) {
          console.warn("Could not save to OPFS, skipping optimistic UI");
          continue;
        }

        // 2. IndexedDB queue
        await addToQueue(queueItem);

        // 3. Optimistic UI item
        optimisticItems.push({
          id,
          localPreview,
          isVideo,
          progress: 0,
          status: "queued",
          postType: "selfUploaded",
        });
      }

      if (optimisticItems.length > 0) {
        const processed = await processImagesWithHeight(optimisticItems);
        setAllImages((prev) => [...processed, ...prev]);
      }

      // Trigger upload
      processUploadQueue();
    };

    input.click();
  };

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

  useEffect(() => {
    if (isIOSMobile) return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loadingMore &&
        currentPage < totalPages
      ) {
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadEventPosts(nextPage).finally(() => {
          setLoadingMore(false);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, totalPages, loadingMore, isIOSMobile]);

  return (
    <>
     {canShowActionButtons && (
      <div className="event-wall-action-ctn">
        {actionButtons.map(
          ({ label, icon, onClick }, index) =>
            index !== 1 && (
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
            ),
        )}
      </div>
 )}
      <div>
        {allImages.length === 0 || !canSeeImages ? (
          <div className="eventwall-nopost-ctn">
            <div className="nopost-box d-flex justify-content-center align-items-center flex-column">
              <img src={NopostCamera.src} alt="No Post Camera" className="" />
              <p className="line-1">
                No memories here yet! Be the First to share.
              </p>
              <p className="line-2">
                Everyone can upload photos & videos from the event!
              </p>
              <p className="line-2 line-3">Let's fill this wall with joy!</p>
            </div>
          </div>
        ) : (
          <div style={{ position: "relative", marginTop: "auto" }}>
            <div
              style={{
                margin: "20px auto",
              }}
            >
              {isIOSMobile && totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  inline={true}
                />
              )}
              <div className="event-image-grid">
                {currentImages?.map((thumbnail, indexOnPage) => {
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
                      onClick={() => {
                        const originalIndex = isIOSMobile
                          ? (currentPage - 1) * ITEMS_PER_PAGE + indexOnPage
                          : indexOnPage;

                        setSelectedIndex(originalIndex);
                      }}
                    >
                      <EventwallGalleryItemWonderland
                        isVideo={isVideo}
                        thumbnail={thumbnail}
                        indexOnPage={indexOnPage}
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
                  style={{ zIndex: 9999 }}
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
                        const isLoading =
                          !item.postWebpUrl && item.status !== "done";
                        const mediaUrl = isLoading
                          ? item.localPreview
                          : item.postWebpUrl;
                        const isVideo = item.isVideo || isVideoFile(mediaUrl);

                        return (
                          <div
                            key={item._id || idx}
                            className="slick-slide-item"
                          >
                            {isVideo ? (
                              <video
                                src={
                                  isLoading ? item.localPreview : item.postUrl
                                }
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
