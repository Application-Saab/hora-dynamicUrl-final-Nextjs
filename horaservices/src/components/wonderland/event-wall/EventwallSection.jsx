// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/router";
// import NotesButtonIcon from "@/assets/wonderland/NotesButtonIcon.svg";
// import PostBadgeButtonIcon from "@/assets/wonderland/PostBadgeButtonIcon.svg";
// import GalleryButtonIcon from "@/assets/wonderland/GalleryButtonIcon.svg";
// import NopostCamera from "@/assets/wonderland/NopostCamera.svg";
// import { uploadImage, uploadVideo } from "@/utils/handleMediaUpload";
// import useApi from "@/hooks/useApi";
// import { CREATE_NEW_POST, GET_ALL_POSTS } from "@/utils/apiconstants";
// import {
//   cacheEvent,
//   clearAllEventCache,
//   getCachedEvent,
// } from "@/utils/eventCache";
// import "../../common/EventLazyImage.css";
// import EventwallGalleryItem from "./EventwallGalleryItem";
// import { processImagesWithHeight } from "@/utils/eventWallHelpers";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../../../pages/photo-gallery/gallery.css";
// import { IoCloseSharp } from "react-icons/io5";
// import PaginationControls from "@/components/PaginationControls";
// const EventwallSection = ({
//   userData,
//   rsvpSubmitted,
//   setPushRsvpClick,
//   isHost,
// }) => {
//   const router = useRouter();
//   const { eventid } = router.query;
//   const { makeRequest: createPost } = useApi();
//   const { makeRequest: getAllPosts } = useApi();
//   const userId = localStorage.getItem("userID") || userData?._id;
//   const [allImages, setAllImages] = useState([]);
//   const imagesRef = useRef([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const isVideoFile = (url = "") => /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(url);
//   const [imageNumber, setImageNumber] = useState(0);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const ITEMS_PER_PAGE = 25;
//   const [isIOSMobile, setIsIOSMobile] = useState(false);

//   const currentImages = allImages; // backend pagination now

//   useEffect(() => {
//     if (typeof navigator !== "undefined") {
//       const isIOS = /iPhone|iPod/.test(navigator.userAgent);
//       setIsIOSMobile(isIOS);
//     }
//   }, []);

//   useEffect(() => {
//     imagesRef.current = allImages;
//   }, [allImages]);

//   const pauseAllVideos = () => {
//     const videos = document.querySelectorAll(".popupContent video");
//     videos.forEach((video) => {
//       video.pause();
//       video.currentTime = 0;
//     });
//   };

//   const playActiveVideo = () => {
//     const activeVideo = document.querySelector(".slick-current video");
//     if (!activeVideo) return;

//     activeVideo.currentTime = 0;

//     const playWhenReady = () => {
//       activeVideo.play().catch(console.error);
//     };

//     if (activeVideo.readyState >= 2) {
//       playWhenReady();
//     } else {
//       activeVideo.addEventListener("loadeddata", playWhenReady, { once: true });
//     }
//   };

//   const sliderSettings = {
//     dots: false,
//     infinite: allImages.length > 1,
//     speed: 300,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     adaptiveHeight: true,

//     beforeChange: (_, next) => {
//       pauseAllVideos();
//       setImageNumber(next + 1);
//     },

//     afterChange: () => {
//       playActiveVideo();
//     },
//   };

//   const MAX_PARALLEL_UPLOADS = 5;
//   let activeUploads = 0;
//   let uploadQueue = [];

// async function loadEventPosts(pageToLoad = 1) {
//   if (!eventid) return;

//   const draftBase64 = localStorage.getItem(
//     `thankyou-note-draft-${eventid}`
//   );

//   let draftItem = null;

//   if (draftBase64) {
//     draftItem = {
//       id: "draft-temp",
//       file: null,
//       localPreview: draftBase64,
//       isVideo: false,
//       progress: 0,
//       status: "draft",
//       postUrl: null,
//       postWebpUrl: null,
//       postType: "thankYouNote",
//     };
//   }

//   // ✅ Show cache instantly (only page 1)
//   if (pageToLoad === 1) {
//     const cached = getCachedEvent(eventid);
//     if (cached) {
//       let merged = draftItem ? [draftItem, ...cached] : cached;
//       setAllImages(await processImagesWithHeight(merged));
//     }
//   }

//   const resp = await getAllPosts(
//     `${GET_ALL_POSTS}/${eventid}?page=${pageToLoad}&limit=${ITEMS_PER_PAGE}`,
//     "GET"
//   );

//   if (resp?.data?.posts) {
//     let fresh = [...resp.data.posts];

//     if (draftItem && pageToLoad === 1) {
//       fresh = [draftItem, ...fresh];
//     }

//     const processed = await processImagesWithHeight(fresh);

//     if (isIOSMobile) {
//       // 🍎 iOS → replace page
//       setAllImages(processed);
//     } else {
//       // 🤖 other → append for infinite scroll
//       setAllImages((prev) =>
//         pageToLoad === 1 ? processed : [...prev, ...processed]
//       );
//     }

//     setTotalPages(resp.data.totalPages);

//     if (pageToLoad === 1) {
//       cacheEvent(eventid, resp.data.posts);
//     }
//   }
// }

//   // useEffect(() => {
//   //   async function loadEventPosts() {
//   //     if (!eventid) return;

//   //     const draftBase64 = localStorage.getItem(
//   //       `thankyou-note-draft-${eventid}`,
//   //     );
//   //     let draftItem = null;

//   //     if (draftBase64) {
//   //       draftItem = {
//   //         id: "draft-temp",
//   //         file: null,
//   //         localPreview: draftBase64,
//   //         isVideo: false,
//   //         progress: 0,
//   //         status: "draft",
//   //         postUrl: null,
//   //         postWebpUrl: null,
//   //         postType: "thankYouNote",
//   //       };
//   //     }

//   //     const cached = getCachedEvent(eventid);
//   //     let merged = cached ? [...cached] : [];

//   //     if (draftItem) merged = [draftItem, ...merged];

//   //     // measure height + reorder
//   //     setAllImages(await processImagesWithHeight(merged));

//   //     const resp = await getAllPosts(`${GET_ALL_POSTS}/${eventid}`, "GET");

//   //     if (resp.data.posts) {
//   //       let fresh = [...resp.data.posts];
//   //       if (draftItem) fresh = [draftItem, ...fresh];

//   //       const processed = await processImagesWithHeight(fresh);

//   //       setAllImages(processed);
//   //       cacheEvent(eventid, resp.data.posts);
//   //     }
//   //   }

//   //   loadEventPosts();
//   // }, [eventid]);

// useEffect(() => {
//   if (!eventid) return;
//   loadEventPosts(1);
// }, [eventid]);

//   useEffect(() => {
//     if (!eventid) return;

//     const handleRouteChange = (url) => {
//       const nextPathname = new URL(url, window.location.origin).pathname;

//       const isCurrentlyInvite = router.pathname.includes("/invite");
//       const isNextInvite = nextPathname.includes("/invite");

//       // If leaving the invite page
//       if (isCurrentlyInvite && !isNextInvite) {
//         localStorage.removeItem(`thankyou-note-draft-${eventid}`);
//       }
//     };

//     router.events.on("routeChangeStart", handleRouteChange);

//     return () => {
//       router.events.off("routeChangeStart", handleRouteChange);
//     };
//   }, [eventid, router.pathname]);

//   const updateProgress = (id, percent) => {
//     setAllImages((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, progress: percent } : item,
//       ),
//     );
//   };

//   const updateStatus = (id, status) => {
//     setAllImages((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, status } : item)),
//     );
//   };

//   const updateUploadedUrls = async (id, postUrl, thumbnailUrl) => {
//     const current = imagesRef.current;

//     if (!Array.isArray(current) || current.length === 0) return;

//     const updatedList = current.map((item) =>
//       item.id === id ? { ...item, postUrl, postWebpUrl: thumbnailUrl } : item,
//     );

//     // UI updates immediately
//     setAllImages(updatedList);

//     const processed = await processImagesWithHeight(updatedList);

//     setAllImages(processed);
//   };

//   const handleUploadPictureClick = async () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*,video/*";
//     input.multiple = true;

//     input.onchange = async (e) => {
//       const files = Array.from(e.target.files);

//       const tempItems = files.map((file) => ({
//         id: Math.random().toString(36).substring(2),
//         file,
//         localPreview: URL.createObjectURL(file),
//         isVideo: file.type.startsWith("video"),
//         progress: 0,
//         status: "queued",
//         postUrl: null,
//         postWebpUrl: null,
//         postType: "selfUploaded",
//       }));

//       // instantly show + reorder
//       setAllImages(await processImagesWithHeight([...tempItems, ...allImages]));

//       uploadQueue.push(...tempItems);
//       for (let i = 0; i < MAX_PARALLEL_UPLOADS; i++) processNextUpload();
//     };

//     input.click();
//   };

//   async function handleSingleUpload(tempItem) {
//     const { file, id, isVideo } = tempItem;

//     try {
//       updateStatus(id, "uploading");
//       let uploadResult;
//       if (isVideo) {
//         uploadResult = await uploadVideo(
//           file,
//           userId,
//           eventid,
//           "self-upload",
//           (percent) => updateProgress(id, percent),
//         );
//       } else {
//         uploadResult = await uploadImage(
//           file,
//           userId,
//           eventid,
//           "self-upload",
//           (percent) => updateProgress(id, percent),
//         );
//       }

//       if (!uploadResult.success) {
//         updateStatus(id, "error");
//         return;
//       }

//       await updateUploadedUrls(
//         id,
//         uploadResult.originalUrl,
//         uploadResult.thumbnailUrl,
//       );

//       await createPost(`${CREATE_NEW_POST}/${eventid}`, "POST", {
//         postById: userId,
//         postByName: userData?.name || "Guest",
//         postType: "selfUploaded",
//         postUrl: uploadResult.originalUrl,
//         postKey: uploadResult.originalKey,
//         postWebpUrl: uploadResult.thumbnailUrl,
//         postWebpKey: uploadResult.thumbnailKey,
//       });

//       updateStatus(id, "done");
//     } catch (err) {
//       console.error(err);
//       updateStatus(id, "error");
//     }
//   }

//   async function processNextUpload() {
//     if (activeUploads >= MAX_PARALLEL_UPLOADS) return;
//     if (uploadQueue.length === 0) return;

//     activeUploads++;
//     const nextItem = uploadQueue.shift();

//     await handleSingleUpload(nextItem);

//     activeUploads--;
//     processNextUpload();
//   }

//   useEffect(() => {
//     const clear = () => {
//       clearAllEventCache();
//       localStorage.removeItem("thankyou-note-draft");
//     };

//     window.addEventListener("beforeunload", clear);
//     return () => window.removeEventListener("beforeunload", clear);
//   }, []);

//   function getBlockType(index) {
//     const pos = index % 6;

//     if (pos === 0 || pos === 1 || pos === 2) return "small";
//     if (pos === 3) return "big";
//     if (pos === 4) return "small-right-top";
//     if (pos === 5) return "small-right-bottom";
//   }

//   const actionButtons = [
//     {
//       label: "Notes",
//       icon: NotesButtonIcon.src,
//       onClick: () =>
//         router.push(`/wonderland/Thankyou-note?eventid=${eventid}`),
//     },
//     {
//       label: "Post Badge",
//       icon: PostBadgeButtonIcon.src,
//       onClick: () => console.log("Post Badge clicked"),
//     },
//     {
//       label: "Upload Pictures",
//       icon: GalleryButtonIcon.src,
//       onClick: handleUploadPictureClick,
//     },
//   ];

//   useEffect(() => {
//     if (selectedIndex !== null) {
//       setImageNumber(selectedIndex + 1);
//       // Slight delay to ensure slider is mounted and classes are applied
//       setTimeout(() => {
//         playActiveVideo();
//       }, 0);
//     }
//   }, [selectedIndex]);

//   useEffect(() => {
//     if (selectedIndex === null) {
//       pauseAllVideos();
//     }
//   }, [selectedIndex]);

//   useEffect(() => {
//     if (isIOSMobile) return;

//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//           document.body.offsetHeight - 300 &&
//         !loadingMore &&
//         currentPage < totalPages
//       ) {
//         setLoadingMore(true);
//         const nextPage = currentPage + 1;
//         setCurrentPage(nextPage);
//         loadEventPosts(nextPage).finally(() => {
//           setLoadingMore(false);
//         });
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [currentPage, totalPages, loadingMore, isIOSMobile]);

//   return (
//     <>
//       <div className="event-wall-action-ctn">
//         {actionButtons.map(
//           ({ label, icon, onClick }, index) =>
//             index !== 1 && (
//               <button
//                 key={index}
//                 className={`event-wall-action-btn event-wall-action-btn-${index}`}
//                 onClick={() => {
//                   isHost
//                     ? onClick()
//                     : rsvpSubmitted
//                       ? onClick()
//                       : setPushRsvpClick(true);
//                 }}
//               >
//                 <img
//                   src={icon}
//                   alt={`${label} Icon`}
//                   className="event-wall-action-icon me-1"
//                   height="18px"
//                   width="16px"
//                 />
//                 {label}
//               </button>
//             ),
//         )}
//       </div>

//       <div>
//         {allImages.length === 0 || (!rsvpSubmitted && !isHost) ? (
//           <div className="eventwall-nopost-ctn">
//             <div className="nopost-box d-flex justify-content-center align-items-center flex-column">
//               <img src={NopostCamera.src} alt="No Post Camera" className="" />
//               <p className="line-1">
//                 No memories here yet! Be the First to share.
//               </p>
//               <p className="line-2">
//                 Everyone can upload photos & videos from the event!
//               </p>
//               <p className="line-2 line-3">Let’s fill this wall with joy!</p>
//             </div>
//           </div>
//         ) : (
//           <div style={{ position: "relative", marginTop: "auto" }}>
//             <div
//               style={{
//                 margin: "20px auto",
//               }}
//             >
//               {isIOSMobile && totalPages > 1 && (
//                 <PaginationControls
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={(page) => {
//                     setCurrentPage(page);
//                     window.scrollTo({ top: 0, behavior: "smooth" });
//                   }}
//                   inline={true}
//                 />
//               )}
//               <div className="event-image-grid">
//                 {currentImages?.map((thumbnail, indexOnPage) => {
//                   const type = getBlockType(indexOnPage);
//                   const isVideo =
//                     thumbnail.postUrl?.match(/\.(mp4|mov|avi|mkv)$/i) ||
//                     thumbnail.isVideo;

//                   return (
//                     <div
//                       key={thumbnail._id || indexOnPage}
//                       style={{
//                         cursor: "pointer",
//                         position: "relative",
//                         backgroundColor: "transparent",
//                         display: "grid",
//                       }}
//                       className={`grid-item ${type}`}
//                       // onClick={() => setSelectedIndex(indexOnPage)}
//                       onClick={() => {
//                         const originalIndex = isIOSMobile
//                           ? (currentPage - 1) * ITEMS_PER_PAGE + indexOnPage
//                           : indexOnPage;

//                         setSelectedIndex(originalIndex);
//                       }}
//                     >
//                       <EventwallGalleryItem
//                         isVideo={isVideo}
//                         thumbnail={thumbnail}
//                         indexOnPage={indexOnPage}
//                       />
//                     </div>
//                   );
//                 })}
//               </div>
//               {selectedIndex !== null && allImages[selectedIndex] && (
//                 <div
//                   className="popupOverlay"
//                   onClick={() => setSelectedIndex(null)}
//                   role="dialog"
//                   aria-modal="true"
//                   style={{ zIndex: 9999 }}
//                 >
//                   <div
//                     className="popupContent"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     {/* Header */}
//                     <div className="popupHeader">
//                       <span className="image-index">
//                         {`${imageNumber} / ${allImages.length}`}
//                       </span>

//                       <button
//                         className="closeButton"
//                         onClick={() => setSelectedIndex(null)}
//                         aria-label="Close"
//                       >
//                         <IoCloseSharp size={24} color="#fff" />
//                       </button>
//                     </div>

//                     {/* Slider */}
//                     <Slider
//                       {...sliderSettings}
//                       initialSlide={selectedIndex}
//                       key={`eventwall-slider-${selectedIndex}`}
//                     >
//                       {allImages.map((item, idx) => {
//                         const isLoading =
//                           !item.postWebpUrl && item.status !== "done";
//                         const mediaUrl = isLoading
//                           ? item.localPreview
//                           : item.postWebpUrl;
//                         const isVideo = item.isVideo || isVideoFile(mediaUrl);

//                         return (
//                           <div
//                             key={item._id || idx}
//                             className="slick-slide-item"
//                           >
//                             {isVideo ? (
//                               <video
//                                 src={
//                                   isLoading ? item.localPreview : item.postUrl
//                                 }
//                                 controls
//                                 playsInline
//                                 muted={false}
//                                 preload="auto"
//                                 style={{
//                                   maxHeight: "80vh",
//                                   width: "100%",
//                                   objectFit: "contain",
//                                   background: "#000",
//                                 }}
//                               />
//                             ) : (
//                               <img
//                                 src={mediaUrl}
//                                 alt={`Media ${idx + 1}`}
//                                 style={{
//                                   maxHeight: "80vh",
//                                   width: "100%",
//                                   objectFit: "contain",
//                                 }}
//                               />
//                             )}
//                           </div>
//                         );
//                       })}
//                     </Slider>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default EventwallSection;



















// EventwallSection.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import NotesButtonIcon from "@/assets/wonderland/NotesButtonIcon.svg";
import PostBadgeButtonIcon from "@/assets/wonderland/PostBadgeButtonIcon.svg";
import GalleryButtonIcon from "@/assets/wonderland/GalleryButtonIcon.svg";
import NopostCamera from "@/assets/wonderland/NopostCamera.svg";
import { uploadImage, uploadVideo, uploadMedia, getPendingUploads, updateQueueItem, removeFromQueue, addToQueue } from "@/utils/handleMediaUpload";
import useApi from "@/hooks/useApi";
import { CREATE_NEW_POST, GET_ALL_POSTS } from "@/utils/apiconstants";
import {
  cacheEvent,
  clearAllEventCache,
  getCachedEvent,
} from "@/utils/eventCache";
import "../../common/EventLazyImage.css";
import EventwallGalleryItem from "./EventwallGalleryItem";
import { deleteFromOPFS, getFileFromOPFS, processImagesWithHeight, saveFileToOPFS } from "@/utils/eventWallHelpers";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 25;
  const [isIOSMobile, setIsIOSMobile] = useState(false);

  const currentImages = allImages; // backend pagination now

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

  const MAX_PARALLEL_UPLOADS = 5;
  let activeUploads = 0;
  let uploadQueue = [];

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

    // ✅ Show cache instantly (only page 1)
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
        // 🍎 iOS → replace page
        setAllImages(processed);
      } else {
        // 🤖 other → append for infinite scroll
        setAllImages((prev) =>
          pageToLoad === 1 ? processed : [...prev, ...processed],
        );
      }

      setTotalPages(resp.data.totalPages);

      if (pageToLoad === 1) {
        cacheEvent(eventid, resp.data.posts);
      }
    }
  }

  // useEffect(() => {
  //   async function loadEventPosts() {
  //     if (!eventid) return;

  //     const draftBase64 = localStorage.getItem(
  //       `thankyou-note-draft-${eventid}`,
  //     );
  //     let draftItem = null;

  //     if (draftBase64) {
  //       draftItem = {
  //         id: "draft-temp",
  //         file: null,
  //         localPreview: draftBase64,
  //         isVideo: false,
  //         progress: 0,
  //         status: "draft",
  //         postUrl: null,
  //         postWebpUrl: null,
  //         postType: "thankYouNote",
  //       };
  //     }

  //     const cached = getCachedEvent(eventid);
  //     let merged = cached ? [...cached] : [];

  //     if (draftItem) merged = [draftItem, ...merged];

  //     // measure height + reorder
  //     setAllImages(await processImagesWithHeight(merged));

  //     const resp = await getAllPosts(`${GET_ALL_POSTS}/${eventid}`, "GET");

  //     if (resp.data.posts) {
  //       let fresh = [...resp.data.posts];
  //       if (draftItem) fresh = [draftItem, ...fresh];

  //       const processed = await processImagesWithHeight(fresh);

  //       setAllImages(processed);
  //       cacheEvent(eventid, resp.data.posts);
  //     }
  //   }

  //   loadEventPosts();
  // }, [eventid]);

  // useEffect(() => {
  //   if (!eventid) return;
  //   loadEventPosts(1);
  // }, [eventid]);


  useEffect(() => {
  if (!eventid) return;

  const init = async () => {
    // A. Pehle cache se fast load (committed posts)
    const cached = getCachedEvent(eventid);
    if (cached) {
      let merged = [];
      const draftBase64 = localStorage.getItem(`thankyou-note-draft-${eventid}`);
      if (draftBase64) {
        merged.push({
          id: 'draft-temp',
          localPreview: draftBase64,
          isVideo: false,
          status: 'draft',
          postType: 'thankYouNote',
        });
      }
      const processed = await processImagesWithHeight(cached);
      setAllImages(merged.length ? [...merged, ...processed] : processed);
    }

    // B. Pending uploads check & resume
    const pending = await getPendingUploads(eventid);
    if (pending.length > 0) {
      // Show missing ones optimistically (without preview if refresh)
      const existingIds = new Set(allImages.map(i => i.id));
      const toShow = pending.filter(p => !existingIds.has(p.id));

      if (toShow.length > 0) {
        const tempItems = toShow.map(p => ({
          id: p.id,
          localPreview: null,           // refresh pe preview nahi banta
          isVideo: p.isVideo,
          status: p.status,
          progress: p.progress || 0,
          postType: 'selfUploaded',
        }));

        const processed = await processImagesWithHeight(tempItems);
        setAllImages(prev => [...processed, ...prev]);
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

  // const handleUploadPictureClick = async () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*,video/*";
  //   input.multiple = true;

  //   input.onchange = async (e) => {
  //     const files = Array.from(e.target.files);

  //     const tempItems = files.map((file) => ({
  //       id: Math.random().toString(36).substring(2),
  //       file,
  //       localPreview: URL.createObjectURL(file),
  //       isVideo: file.type.startsWith("video"),
  //       progress: 0,
  //       status: "queued",
  //       postUrl: null,
  //       postWebpUrl: null,
  //       postType: "selfUploaded",
  //     }));

  //     // instantly show + reorder
  //     setAllImages(await processImagesWithHeight([...tempItems, ...allImages]));

  //     uploadQueue.push(...tempItems);
  //     for (let i = 0; i < MAX_PARALLEL_UPLOADS; i++) processNextUpload();
  //   };

  //   input.click();
  // };

  const MAX_FILES = 10;

  // const handleUploadPictureClick = async () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*,video/*";
  //   input.multiple = true;

  //   input.onchange = async (e) => {
  //     const files = Array.from(e.target.files);

  //     // ✅ LIMIT CHECK
  //     if (files.length > MAX_FILES) {
  //       alert(`You can upload maximum ${MAX_FILES} files at once.`);
  //       return;
  //     }

  //     const tempItems = files.map((file) => ({
  //       id: Math.random().toString(36).substring(2),
  //       file,
  //       localPreview: URL.createObjectURL(file),
  //       isVideo: file.type.startsWith("video"),
  //       progress: 0,
  //       status: "queued",
  //       postUrl: null,
  //       postWebpUrl: null,
  //       postType: "selfUploaded",
  //     }));

  //     // instantly show + reorder
  //     setAllImages(await processImagesWithHeight([...tempItems, ...allImages]));

  //     uploadQueue.push(...tempItems);
  //     for (let i = 0; i < MAX_PARALLEL_UPLOADS; i++) processNextUpload();
  //   };

  //   input.click();
  // };


  async function processUploadQueue(silent = false) {
  if (!eventid) return;

  const pending = await getPendingUploads(eventid);
  if (pending.length === 0) return;

  for (const item of pending) {
    if (['done', 'uploading'].includes(item.status)) continue;

    try {
      await updateQueueItem(item.id, { status: 'uploading' });

      const file = await getFileFromOPFS(eventid, item.id);

      const posts = await uploadMedia(
        [file],
        userId,
        userData?.name || 'Guest',
        eventid,
        (percent) => {
          // UI + DB progress
          updateProgress(item.id, percent);
          updateQueueItem(item.id, { progress: percent });
        }
      );

      if (!posts?.length) throw new Error('No post returned');

      const post = posts[0];
      await updateUploadedUrls(item.id, post.postUrl, post.postWebpUrl);
      updateStatus(item.id, 'done');

      // Cleanup
      await removeFromQueue(item.id);
      await deleteFromOPFS(eventid, item.id);

    } catch (err) {
      console.error('Upload failed:', item.id, err);
      const newRetry = (item.retryCount || 0) + 1;
      const status = newRetry > 5 ? 'failed' : 'queued'; // retry max 5 baar

      await updateQueueItem(item.id, {
        status,
        retryCount: newRetry,
        errorMessage: err.message?.slice(0, 200),
      });

      updateStatus(item.id, status);
    }
  }
}



  const handleUploadPictureClick = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
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
      const id = crypto.randomUUID(); // ya Date.now() + Math.random()
      const isVideo = file.type.startsWith('video/');
      const localPreview = URL.createObjectURL(file);

      const queueItem = {
        id,
        eventId : eventid,
        fileName: file.name,
        mimeType: file.type,
        isVideo,
        status: 'queued',
        progress: 0,
        retryCount: 0,
        createdAt: now,
        // optional: size: file.size, lastModified: file.lastModified
      };

      // 1. OPFS save
      const saved = await saveFileToOPFS(file, eventid, id);
      if (!saved) {
        console.warn('Could not save to OPFS, skipping optimistic UI');
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
        status: 'queued',
        postType: 'selfUploaded',
        // height etc baad mein measure hoga
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




  // async function handleSingleUpload(tempItem) {
  //   const { file, id, isVideo } = tempItem;

  //   try {
  //     updateStatus(id, "uploading");

  //     let uploadResult;

  //     if (isVideo) {
  //       uploadResult = await uploadVideo(
  //         file,
  //         userId,
  //         eventid,
  //         "self-upload",
  //         (percent) => updateProgress(id, percent),
  //       );
  //     } else {
  //       uploadResult = await uploadImage(
  //         file,
  //         userId,
  //         eventid,
  //         "self-upload",
  //         (percent) => updateProgress(id, percent),
  //       );
  //     }

  //     if (!uploadResult.success) {
  //       updateStatus(id, "error");
  //       return;
  //     }

  //     await updateUploadedUrls(
  //       id,
  //       uploadResult.originalUrl,
  //       uploadResult.thumbnailUrl,
  //     );

  //     await createPost(`${CREATE_NEW_POST}/${eventid}`, "POST", {
  //       postById: userId,
  //       postByName: userData?.name || "Guest",
  //       postType: "selfUploaded",
  //       postUrl: uploadResult.originalUrl,
  //       postKey: uploadResult.originalKey,
  //       postWebpUrl: uploadResult.thumbnailUrl,
  //       postWebpKey: uploadResult.thumbnailKey,
  //     });

  //     updateStatus(id, "done");
  //   } catch (err) {
  //     console.error(err);
  //     updateStatus(id, "error");
  //   }
  // }

  async function handleSingleUpload(tempItem) {
  const { file, id } = tempItem;

  try {
    updateStatus(id, "uploading");

    const posts = await uploadMedia(
      [file],
      userId,
      userData?.name || "Guest",
      eventid,
      (percent) => updateProgress(id, percent)
    );

    const post = posts[0];

    await updateUploadedUrls(
      id,
      post.postUrl,
      post.postWebpUrl
    );

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
      <div className="event-wall-action-ctn">
        {actionButtons.map(
          ({ label, icon, onClick }, index) =>
            index !== 1 && (
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
            ),
        )}
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
                      // onClick={() => setSelectedIndex(indexOnPage)}
                      onClick={() => {
                        const originalIndex = isIOSMobile
                          ? (currentPage - 1) * ITEMS_PER_PAGE + indexOnPage
                          : indexOnPage;

                        setSelectedIndex(originalIndex);
                      }}
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
