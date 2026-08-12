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
import deleteVector from "@/assets/deleteVector.svg";
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
  GET_ALL_VENUE_IMAGES,
  GET_VENUE_DETAILS_BY_ID,
} from "@/utils/apiconstants";
import VenueWallHeaderTabs from "./VenueWallHeaderTabs";
import {
  deleteFromOPFS,
  getFileFromOPFS,
  getPreviewFromOPFS,
  processImagesWithHeight,
  saveFileToOPFS,
} from "@/utils/eventWallHelpers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageGrid from "@/components/image-galleries/ImageGrid";
import CommonImagePopup from "@/components/CommonImagePopup";
import AddToFolderPopup from "@/components/image-galleries/AddToFolderPopup";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { fetchWithError } from "@/utils/fetchWithError";
import { safeGetItem } from "@/utils/safeStorage";
const VenueWallSection = ({
  userData,
  rsvpSubmitted,
  setPushRsvpClick,
  isHost,
    venueImageUrl, 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { venueid } = router.query;
  const { makeRequest: getAllPosts } = useApi();
  const { makeRequest: getAllLikes } = useApi();
  const { makeRequest: getEventInvite } = useApi();
  const userId = safeGetItem("userID") || userData?._id;
  const [allImages, setAllImages] = useState([]);
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
      safeGetItem("mobileNumber") || "",
  );
  const [rawPhoneNumber, setRawPhoneNumber] = useState(null);
  const [likedImages, setLikedImages] = useState({});
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderlandinternational",
  );

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
    () => subFolders.filter((sf) => sf.category === "custom"),
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
  if (!userId || !venueid) return;

  const fetchLikes = async () => {
    try {
      const initialLikes = {};

      const resp = await getAllLikes(
        `${LIKED_POST_BY_EVENT_AND_USERID}/${venueid}/${userId}`,
        "GET",
      );

      resp?.posts?.forEach((post) => {
        initialLikes[post._id] = true;
      });

      setLikedImages((prev) => ({
        ...prev,
        ...initialLikes,
      }));
    } catch (error) {
      console.error("Failed to fetching likes", error);
    }
  };

  fetchLikes();
}, [venueid, userId]);

  useEffect(() => {
    if (!venueid) return;
    const loadFolders = async () => {
      try {
        const resp = await getEventInvite(
            `${GET_VENUE_DETAILS_BY_ID}/${venueid}`,
            "GET",
        );
        console.log('%c [ resp subfolder ]', 'font-size:13px; background:pink; color:#bf2c9f;', resp)
        const folders = resp?.data?.subFolders || [];
        console.log('%c [ folders ]', 'font-size:13px; background:pink; color:#bf2c9f;', folders)
        setSubFolders(Array.isArray(folders) ? folders : []);
      } catch (e) {
        console.error("Failed to load event subfolders", e);
      }
    };
    loadFolders();
  }, [venueid]);

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

  async function loadEventPosts() {
    if (!venueid) return;
    const resp = await getAllPosts(`${GET_ALL_VENUE_IMAGES}/${venueid}`, "GET");
    console.log('%c [ resp ]', 'font-size:13px; background:pink; color:#bf2c9f;', resp)

    if (resp?.data) {
      let fresh = [...resp.data];
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
    if (!venueid) return;

    const init = async () => {
      // B. Pending uploads check & resume
      const pending = await getPendingUploads(venueid);
      if (pending.length > 0) {
        const existingIds = new Set(allImages.map((i) => i.id));
        const toShow = pending.filter((p) => !existingIds.has(p.id));

        if (toShow.length > 0) {
          const tempItems = await Promise.all(
            toShow.map(async (p) => {
              const preview = await getPreviewFromOPFS(
                venueid,
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
  }, [venueid]);

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

  const updateUploadedUrls = async (id, postUrl, thumbnailUrl, imageId) => {
    const current = imagesRef.current;

    if (!Array.isArray(current) || current.length === 0) return;

    const updatedList = current.map((item) =>
      item.id === id ? { ...item, postUrl, postWebpUrl: thumbnailUrl, _id : imageId } : item,
    );

    // UI updates immediately
    setAllImages(updatedList);

    const processed = await processImagesWithHeight(updatedList);

    setAllImages(processed);
  };
  const MAX_FILES = 10;

  async function processUploadQueue() {
    if (!venueid) return;

    let pending = await getPendingUploads(venueid);
    // reset stuck uploads
    for (const item of pending) {
      if (item.status === "uploading") {
        await updateQueueItem(item.id, { status: "queued" });
      }
    }

    pending = await getPendingUploads(venueid);

    for (const item of pending) {
      if (item.status === "done") continue;

      try {
        await updateQueueItem(item.id, { status: "uploading" });

        const file = await getFileFromOPFS(
          venueid,
          item.id,
          item.mimeType,
          item.fileName,
        );

        const posts = await uploadMedia(
          [file],
          userId,
          userData?.name || "Guest",
          venueid,
          (percent) => {
            updateProgress(item.id, percent);
            updateQueueItem(item.id, { progress: percent });
          },
          item.id,
          item.postType,
          item.folder,
        );

        const post = posts[0];
        await updateUploadedUrls(item.id, post.postUrl, post.postWebpUrl, post?._id);
        updateStatus(item.id, "done");

        await removeFromQueue(item.id);
        await deleteFromOPFS(venueid, item.id, item.fileName);
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
          eventId: venueid,
          fileName: file.name,
          mimeType: file.type,
          isVideo,
          status: "queued",
          progress: 0,
          retryCount: 0,
          createdAt: now,
          postType: "selfUploaded",
          folder: "self-upload",
        };

        // 1. OPFS save
        const saved = await saveFileToOPFS(file, venueid, id);
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
          folder: "self-upload",
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

  const actionButtons = [
    {
      label: "Notes",
      icon: NotesButtonIcon.src,
      onClick: () =>
        router.push(
          `${isWonderlandInternational ? "/wonderlandinternational" : "/wonderland"}/Thankyou-note?eventid=${venueid}`,
        ),
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
        myPhotoSearchResults.includes(img.postWebpKey),
      );
    }

    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {
      const normalizedKeys = matchedKeys.map(normalize);

      return allImages.filter((img) => {
        if (img.type !== "image") return false;

        return normalizedKeys.includes(normalize(img.postWebpKey));
      });
    }

    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {
      return allImages.filter((img) => matchedKeys.includes(img.postWebpKey));
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
      const response = await fetchWithError(url, { mode: "cors" });
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
    const res = await fetchWithError(`${BASE_URL}${ASSIGN_TO_EVENT_SUBFOLDER}`, {
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
      const res = await fetchWithError(`${BASE_URL}${DELETE_EVENT_POST}/${toDeleteId}`, {
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

          const currentCount = parseInt(img?.likeCounts) || 0;

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
            likeCounts: isCurrentlyLiked
              ? Math.max(currentCount - 1, 0)
              : currentCount + 1,
          };
        }

        return img;
      }),
    );

    try {
      await fetchWithError(`${BASE_URL}${EVENT_POST_LIKE_UNLIKE}/${imageId}/like`, {
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
      {/* <div className="event-wall-action-ctn">
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
      </div> */}

      <div>
        {allImages.length === 0  ? (
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
                margin: "10px auto",
              }}
            >
              <VenueWallHeaderTabs
                eventId={venueid}
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
                 venueImageUrl={venueImageUrl}
              />

              {/* {activeTab !== "all" && !isMyPhotosTab && activeSubFolderId && (
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
              )} */}

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
                setSelectedImages={setSelectedImages}
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
                            <p>{currentImage?.postByName || "Unknown User"}</p>
                          </div>

                          <div className="action-inner-container">
                            {/* <div
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
                            </div> */}
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
                            {/* {(isHost ||
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
                            )} */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                renderFooter={(currentImage, index) => {
                  const imageId = currentImage?._id;
                  // const isLiked = likedImages[imageId];
                  return (
                    <div className="imagepopup-footer">
                      {/* <div>
                        <Image
                          src={isLiked ? like : unLike}
                          alt="Like"
                          width={30}
                          height={32}
                          style={{ filter: "none", cursor: "pointer" }}
                          onClick={() => handleLikeToggle(imageId)}
                        />
                      </div> */}

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
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VenueWallSection;
