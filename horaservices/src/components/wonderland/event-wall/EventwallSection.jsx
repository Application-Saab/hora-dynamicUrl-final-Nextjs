"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import NotesButtonIcon from "@/assets/wonderland/NotesButtonIcon.svg";
import PostBadgeButtonIcon from "@/assets/wonderland/PostBadgeButtonIcon.svg";
import GalleryButtonIcon from "@/assets/wonderland/GalleryButtonIcon.svg";
import NopostCamera from "@/assets/wonderland/NopostCamera.svg";
import multiGroup from "@/assets/multiGroup.svg";
import plusVector from "@/assets/plusVector.svg";
import downloadVector from "@/assets/downloadVector.svg";
import shareVector from "@/assets/shareVector.svg";
import deleteVector from "@/assets/DeleteVector.svg";
import whiteShareIcon from "@/assets/whiteShareIcon.svg";
import unLike from "@/assets/unLike.svg";
import like from "@/assets/like.svg";
import {
  uploadMedia,
  getPendingUploads,
  updateQueueItem,
  removeFromQueue,
  addToQueue,
} from "@/utils/handleMediaUpload";
import useApi from "@/hooks/useApi";
import {
  BASE_URL,
  ASSIGN_TO_EVENT_SUBFOLDER,
  DELETE_EVENT_POST,
  EVENT_POST_LIKE_UNLIKE,
  GET_EVENT_BY_ID,
  GET_ALL_POSTS,
  LIKED_POST_BY_EVENT_AND_USERID,
} from "@/utils/apiconstants";
import "../../common/EventLazyImage.css";
import EventWallHeaderTabs from "./EventWallHeaderTabs";
import {
  deleteFromOPFS,
  getFileFromOPFS,
  getPreviewFromOPFS,
  processImagesWithHeight,
  saveFileToOPFS,
} from "@/utils/eventWallHelpers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../pages/weblink-gallery/gallery.css";
import ImageGrid from "@/components/image-galleries/ImageGrid";
import CommonImagePopup from "@/components/CommonImagePopup";
import AddToFolderPopup from "@/components/image-galleries/AddToFolderPopup";
import Image from "next/image";
const EventwallSection = ({
  userData,
  rsvpSubmitted,
  setPushRsvpClick,
  isHost,
}) => {
  const router = useRouter();
  const { eventid } = router.query;
  const { makeRequest: getAllPosts } = useApi();
  const { makeRequest: getAllLikes } = useApi();
  const { makeRequest: getEventInvite } = useApi();
  const userId = localStorage.getItem("userID") || userData?._id;
  const [allImages, setAllImages] = useState([]);
  console.log('%c [ allImages ]-68', 'font-size:13px; background:pink; color:#bf2c9f;', allImages)
  const imagesRef = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [initialSubfolderImages, setInitialSubfolderImages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isStreamSearching, setIsStreamSearching] = useState(false);
  const [matchedKeys, setMatchedKeys] = useState([]);
  const [myPhotoSearchResults, setMyPhotoSearchResults] = useState([]);
  const [activeSubFolderId, setActiveSubFolderId] = useState(null);
  const [isActualMyPhotos, setIsActualMyPhotos] = useState(false);
  const isSearchMode = isSearching && matchedKeys.length > 0;
  const isVideoFile = (url = "") => /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(url);
  const [imageNumber, setImageNumber] = useState(0);
  const [isIOSMobile, setIsIOSMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [subFolders, setSubFolders] = useState([]);
  const myPhotosFolder = subFolders.find((sf) => sf.type === "my_photos");
  const isMyPhotosTabActive =
    activeTab === (myPhotosFolder?._id || "my-photos");
  const isMyPhotosTab =
    subFolders.find((sf) => sf._id === activeTab)?.type === "my_photos";
  const isSearchActive = isMyPhotosTabActive && isSearching;
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [number, setNumber] = useState("");
  const [showAddToFolderPopup, setShowAddToFolderPopup] = useState(false);
  const [folderSelection, setFolderSelection] = useState([]);
  const [initialPopupFolders, setInitialPopupFolders] = useState([]);
  const [showCreateFolderPopup, setShowCreateFolderPopup] = useState(false);
  const [localPhoneNumber, setLocalPhoneNumber] = useState(
    localStorage.getItem("mobileNumber") || "",
  );
  const [rawPhoneNumber, setRawPhoneNumber] = useState(null);
  const [likedImages, setLikedImages] = useState({});

  const actionMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setShowActionMenu(false);
      }
    };

    if (showActionMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionMenu]);

  const currentImages = allImages;

  const otherFolders = useMemo(
    () => subFolders.filter((sf) => sf.type === "others"),
    [subFolders],
  );

  const hasChanges = useMemo(() => {
    if (!activeSubFolderId) return false;
    if (selectedImages.length !== initialSubfolderImages.length) return true;

    const setA = new Set(selectedImages);
    const setB = new Set(initialSubfolderImages);

    for (let id of setA) {
      if (!setB.has(id)) return true;
    }
    return false;
  }, [selectedImages, initialSubfolderImages, activeSubFolderId]);

  const handleSearchResults = useCallback((events = []) => {
    const normalize = (v) => (v || "").trim();
    const keys = (events || [])
      .filter((e) => e?.type === "match")
      .map((e) => e?.key || e?.postWebpKey || e?.s3Key)
      .map(normalize)
      .filter(Boolean);
    setMatchedKeys(keys);
    setMyPhotoSearchResults(keys);
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const isIOS = /iPhone|iPod/.test(navigator.userAgent);
      setIsIOSMobile(isIOS);
    }
  }, []);

  useEffect(() => {
    imagesRef.current = allImages;
  }, [allImages]);

  useEffect(() => {
    if (!userId || allImages.length === 0) return;

    const fetchLikes = async () => {
      const initialLikes = {};
      const resp = await getAllLikes(
        `${LIKED_POST_BY_EVENT_AND_USERID}/${eventid}/${userId}`,
        "GET",
      );

      resp?.posts?.forEach((post) => {
        initialLikes[post._id] = true;
      });

      setLikedImages(initialLikes);
    };
    fetchLikes();
  }, [allImages, userId]);

  useEffect(() => {
    if (!eventid) return;
    const loadFolders = async () => {
      try {
        const resp = await getEventInvite(
          `${GET_EVENT_BY_ID}/${eventid}`,
          "GET",
        );
        const folders = resp?.data?.subFolders || [];
        setSubFolders(Array.isArray(folders) ? folders : []);
      } catch (e) {
        console.error("Failed to load event subfolders", e);
      }
    };
    loadFolders();
  }, [eventid]);

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

  async function loadEventPosts() {
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

    const resp = await getAllPosts(`${GET_ALL_POSTS}/${eventid}`, "GET");

    if (resp?.data?.posts) {
      let fresh = [...resp.data.posts];

      if (draftItem) {
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
    }
  }

  useEffect(() => {
    if (!eventid) return;

    const init = async () => {
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
      await loadEventPosts();
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
          item.id,
        );

        const post = posts[0];

        await updateUploadedUrls(item.id, post.postUrl, post.postWebpUrl);
        updateStatus(item.id, "done");

        await removeFromQueue(item.id);
        await deleteFromOPFS(eventid, item.id, item.fileName);
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
    if (!activeSubFolderId) {
      setSelectedImages([]);
      setInitialSubfolderImages([]);
      return;
    }

    const ids = allImages
      .filter((img) => img.folderIds?.includes(activeSubFolderId))
      .map((img) => img._id)
      .filter(Boolean);

    setSelectedImages(ids);
    setInitialSubfolderImages(ids);
  }, [activeSubFolderId, allImages]);

  const handleSelectImage = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedImages((prev) => [...prev, id]);
    }
  };

  const handleImageClick = useCallback((indexInDisplayedList) => {
    setSelectedIndex(indexInDisplayedList);
  }, []);

  const closePopup = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const visibleThumbnails = useMemo(() => {
    const normalize = (val) => (val || "").trim().toLowerCase();

    if (!isActualMyPhotos) {
      if (isEditing) {
        return allImages;
      }
    }
    
    // Use myPhotoSearchResults for real-time search filtering
    if (isActualMyPhotos && myPhotoSearchResults.length > 0) {
      return allImages.filter((img) =>
        myPhotoSearchResults.includes(img.postWebpKey)
      );
    }

    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {
      const normalizedKeys = matchedKeys.map(normalize);

      return allImages.filter((img) => {
        if (img.type !== "image") return false;

        return normalizedKeys.includes(normalize(img.postWebpKey));
      });
    }

    if (matchedKeys.length > 0 && ((isMyPhotosTabActive || isSearchActive))) {
      return allImages.filter(img => matchedKeys.includes(img.postWebpKey));
    }

    if (isMyPhotosTabActive && myPhotosFolder) {
      return allImages.filter((img) =>
        img.folderIds?.includes(myPhotosFolder._id),
      );
    }

    if (activeSubFolderId) {
      return allImages.filter((img) =>
        img.folderIds?.includes(activeSubFolderId),
      );
    }

    return allImages;
  }, [
    allImages,
    matchedKeys,
    activeTab,
    isMyPhotosTabActive,
    isSearchActive,
    myPhotosFolder,
    activeSubFolderId,
    isEditing,
    isActualMyPhotos,
    myPhotoSearchResults,
  ]);

  const popupImages = useMemo(() => {
    if (!activeSubFolderId) return allImages;

    return allImages.filter((img) =>
      img.folderIds?.includes(activeSubFolderId),
    );
  }, [allImages, activeSubFolderId]);

  const downloadFile = async (url) => {
    const fileWithExt = url.split("/").pop();

    const parts = fileWithExt.split("-");
    const ext = parts.pop();
    const filename = parts.join("-") + "." + ext;
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "downloaded-image.jpg";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleImageShare = async (imageUrl) => {
    if (!imageUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Photo",
          text: "Check out this photo!",
          url: imageUrl,
        });
      } catch (error) {
        console.error("Error sharing image:", error);
      }
    } else {
      await navigator.clipboard.writeText(imageUrl);
      alert("Image link copied!");
    }
  };

  const handleSubFolderSelect = (id) => {
    setActiveSubFolderId(id);
    setSelectedImages([]);
    setInitialSubfolderImages([]);
    setIsEditing(false);
    setActiveTab(id ?? "all");
    setIsSearching(false);
    setMatchedKeys([]);
    setMyPhotoSearchResults([]);
  };

  const saveAssignToSubfolder = async ({
    subFolderId,
    addImageIds = [],
    removeImageIds = [],
  }) => {
    const res = await fetch(`${BASE_URL}${ASSIGN_TO_EVENT_SUBFOLDER}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subFolderId, addImageIds, removeImageIds }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Failed to update folder");
    return data;
  };

  const handleSaveAlbum = async () => {
    if (!activeSubFolderId) return;

    const toAdd = selectedImages.filter(
      (id) => !initialSubfolderImages.includes(id),
    );
    const toRemove = initialSubfolderImages.filter(
      (id) => !selectedImages.includes(id),
    );

    try {
      await saveAssignToSubfolder({
        subFolderId: activeSubFolderId,
        addImageIds: toAdd,
        removeImageIds: toRemove,
      });

      setAllImages((prev) =>
        prev.map((img) => {
          if (toAdd.includes(img._id)) {
            return {
              ...img,
              folderIds: [...(img.folderIds || []), activeSubFolderId],
            };
          }

          if (toRemove.includes(img._id)) {
            return {
              ...img,
              folderIds: (img.folderIds || []).filter(
                (fid) => fid !== activeSubFolderId,
              ),
            };
          }

          return img;
        }),
      );

      setInitialSubfolderImages(selectedImages);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to save album");
    }
  };

  const handleSaveAddToFolder = async () => {
    const current = allImages?.[selectedIndex];
    if (!current?._id) {
      setShowAddToFolderPopup(false);
      return;
    }

    const before = new Set(initialPopupFolders || []);
    const after = new Set(folderSelection || []);

    const addTo = [...after].filter((x) => !before.has(x));
    const removeFrom = [...before].filter((x) => !after.has(x));

    try {
      const addCalls = addTo.map((subFolderId) =>
        saveAssignToSubfolder({ subFolderId, addImageIds: [current._id] }),
      );
      const removeCalls = removeFrom.map((subFolderId) =>
        saveAssignToSubfolder({ subFolderId, removeImageIds: [current._id] }),
      );
      await Promise.all([...addCalls, ...removeCalls]);

      setAllImages((prev) =>
        prev.map((img) =>
          img._id === current._id ? { ...img, folderIds: [...after] } : img,
        ),
      );
      setShowAddToFolderPopup(false);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to update folder");
    }
  };

  const handleDeletePost = async () => {
    const current = allImages?.[selectedIndex];
    if (!current?._id) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    // Optimistic remove
    const toDeleteId = current._id;
    setAllImages((prev) => prev.filter((img) => img._id !== toDeleteId));
    setShowActionMenu(false);

    try {
      const res = await fetch(`${BASE_URL}${DELETE_EVENT_POST}/${toDeleteId}`, {
        method: "POST",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Delete failed");
      }
      setSelectedIndex((idx) => {
        if (idx === null) return idx;
        return 0;
      });
    } catch (e) {
      console.error(e);
      alert("Failed to delete post");
      // fallback: reload posts
      loadEventPosts();
    }
  };

  const handleLikeToggle = async (imageId) => {
    const isCurrentlyLiked = likedImages[imageId];

    setLikedImages((prev) => ({
      ...prev,
      [imageId]: !isCurrentlyLiked,
    }));

    setAllImages((prev) =>
      prev.map((img) => {
        if (img._id === imageId) {
          let updatedLikedBy = [...(img.likedBy || [])];

          if (isCurrentlyLiked) {
            updatedLikedBy = updatedLikedBy.filter(
              (id) => String(id) !== String(userId),
            );
          } else {
            updatedLikedBy = [...updatedLikedBy, userId];
          }

          return {
            ...img,
            likedBy: updatedLikedBy,
          };
        }
        return img;
      }),
    );

    try {
      await fetch(`${BASE_URL}${EVENT_POST_LIKE_UNLIKE}/${imageId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likedById: userId,
          likedByName: userData?.name || "Guest",
        }),
      });
    } catch (error) {
      console.error(error);

      setLikedImages((prev) => ({
        ...prev,
        [imageId]: isCurrentlyLiked,
      }));

      setAllImages((prev) =>
        prev.map((img) => {
          if (img._id === imageId) {
            let updatedLikedBy = [...(img.likedBy || [])];

            if (!isCurrentlyLiked) {
              updatedLikedBy = updatedLikedBy.filter(
                (id) => String(id) !== String(userId),
              );
            } else {
              updatedLikedBy = [...updatedLikedBy, userId];
            }

            return {
              ...img,
              likedBy: updatedLikedBy,
            };
          }
          return img;
        }),
      );
    }
  };

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
              <EventWallHeaderTabs
                eventId={eventid}
                subFolders={subFolders}
                setSubFolders={setSubFolders}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onSelectSubFolder={handleSubFolderSelect}
                setIsSearching={setIsSearching}
                onSearchResults={handleSearchResults}
                setIsStreamSearching={setIsStreamSearching}
                setMatchedKeys={setMatchedKeys}
                setIsActualMyPhotos={setIsActualMyPhotos}
                showCreateFolderPopup={showCreateFolderPopup}
                setShowCreateFolderPopup={setShowCreateFolderPopup}
              />

              {activeTab !== "all" && !isMyPhotosTab && activeSubFolderId && (
                <div className="buttons-container">
                  {!isEditing ? (
                    <button
                      className="add-new-btn"
                      onClick={() => {
                        setSelectedImages(initialSubfolderImages);
                        setIsEditing(true);
                      }}
                    >
                      <span className="add-icon">+</span>
                      <span>Add Photos To Album</span>
                    </button>
                  ) : (
                    <button
                      className="save-image-btn"
                      onClick={handleSaveAlbum}
                      disabled={!hasChanges}
                      style={{
                        opacity: !hasChanges ? 0.75 : 1,
                        cursor: !hasChanges ? "not-allowed" : "pointer",
                      }}
                    >
                      <span>Save Photos To Album</span>
                    </button>
                  )}
                </div>
              )}

              {/* <div className="event-image-grid">
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
                        setSelectedIndex(indexOnPage);
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
              </div> */}

              <ImageGrid
                data={visibleThumbnails}
                loading={false}
                isEventWall={true}
                handleSelectImage={handleSelectImage}
                handleImageClick={handleImageClick}
                isEditing={isEditing}
                isSearchMode={isSearchMode}
                activeSubFolderId={activeSubFolderId}
                isActualMyPhotos={isActualMyPhotos}
                selectedImages={selectedImages}
              />

              <CommonImagePopup
                images={popupImages}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onClose={closePopup}
                isEventWall={true}
                renderActions={(currentImage, index) => (
                  <div>
                    <div style={{ position: "relative" }}>
                      <Image
                        src={multiGroup}
                        alt="More"
                        width={25}
                        height={25}
                        onClick={() => setShowActionMenu((prev) => !prev)}
                      />

                      {showActionMenu && (
                        <div className="action-menu" ref={actionMenuRef}>
                          <div className="action-item">
                            <strong>Shared by:</strong>
                            <p>{number}</p>
                          </div>

                          <div className="action-inner-container">
                            <div
                              className="action-item flex"
                              onClick={() => {
                                if (!currentImage) return;
                                setFolderSelection(
                                  currentImage.folderIds || [],
                                );
                                setInitialPopupFolders(
                                  currentImage.folderIds || [],
                                );
                                setShowAddToFolderPopup(true);
                                setShowActionMenu(false);
                              }}
                            >
                              <Image src={plusVector} width={19} height={15} />
                              <span>Add to Folder</span>
                            </div>
                            {currentImage?.type !== "video" && (
                              <div
                                className="action-item flex"
                                onClick={() => {
                                  const current = allImages[selectedIndex];
                                  downloadFile(current.postUrl);
                                  setShowActionMenu(false);
                                }}
                              >
                                <Image
                                  src={downloadVector}
                                  width={15}
                                  height={15}
                                />
                                <span>Download</span>
                              </div>
                            )}

                            <div
                              onClick={() => {
                                const current = allImages[selectedIndex];
                                if (!current) return;
                                handleImageShare(current?.postUrl);
                                setShowActionMenu(false);
                              }}
                              className="action-item flex gallery-share-icon"
                            >
                              <Image src={shareVector} width={13} height={14} />
                              <span>Share</span>
                            </div>
                            {(isHost ||
                              String(currentImage?.postById) ===
                                String(userId)) && (
                              <div
                                className="action-item flex"
                                onClick={handleDeletePost}
                              >
                                <Image
                                  src={deleteVector}
                                  width={13}
                                  height={17}
                                />
                                <span>Delete</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                renderFooter={(currentImage, index) => {
                  const imageId = currentImage?._id;

                  const isLiked = likedImages[imageId];

                  return (
                    <div className="imagepopup-footer">
                      <div>
                        <Image
                          src={isLiked ? like : unLike}
                          alt="Like"
                          width={30}
                          height={32}
                          style={{ filter: "none", cursor: "pointer" }}
                          onClick={() => handleLikeToggle(imageId)}
                        />
                      </div>

                      <div>
                        <Image
                          src={whiteShareIcon}
                          alt="Share"
                          width={30}
                          height={32}
                          style={{ filter: "none", cursor: "pointer" }}
                          onClick={() => {
                            if (!currentImage) return;
                            handleImageShare(currentImage?.postUrl);
                          }}
                        />
                      </div>
                    </div>
                  );
                }}
              />

              <AddToFolderPopup
                isOpen={showAddToFolderPopup}
                onClose={() => setShowAddToFolderPopup(false)}
                folders={otherFolders}
                folderSelection={folderSelection}
                setFolderSelection={setFolderSelection}
                initialSelection={initialPopupFolders}
                onSubmit={() => {
                  if (otherFolders.length === 0) {
                    setShowAddToFolderPopup(false);
                    setShowCreateFolderPopup(true);
                    return;
                  }
                  handleSaveAddToFolder();
                }}
                onCreateFolder={() => {
                  setShowAddToFolderPopup(false);
                  setShowCreateFolderPopup(true);
                }}
                style={{ zIndex: 100001 }}
              />

              {/* {selectedIndex !== null && allImages[selectedIndex] && (
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
              )} */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventwallSection;
