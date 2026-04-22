// ThumbnailGallery.js
"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from 'next/image';
import './gallery.css'; // Ensure this path is correct
import { BASE_URL } from "@/utils/apiconstants";
import EventwallGalleryItem from "@/components/wonderland/event-wall/EventwallGalleryItem";
import HeaderCards from "@/components/Gallery/HeaderCards";
import OtpLogin from "@/components/OtpLoginPopup";
import share from '../../assets/share.svg'
import multiGroup from '../../assets/multiGroup.svg'
import plusVector from '../../assets/plusVector.svg'
import downloadVector from '../../assets/downloadVector.svg'
import shareVector from '../../assets/shareVector.svg'
import deleteVector from '../../assets/DeleteVector.svg'
import CommonPopup from "@/components/CommonPop";
import HeaderCardsFlashLoader from "@/components/Gallery/HeaderCardsFlashLoader";
import user2 from "../../assets/user2.svg";
import { MEDIA_WORKER_URL } from "../../utils/apiconstants";
import CommonImagePopup from "@/components/CommonImagePopup";
import refreshIcon from '../../assets/refreshIcon.svg';
import checkWithBoard from '../../assets/checkWithBoard.svg';
import unLike from '../../assets/unLike.svg';
import whiteShareIcon from '../../assets/whiteShareIcon.svg';
import LikeFill from '../../assets/LikedFill.svg';
import like from '../../assets/like.svg'
import {
  uploadMediaWeblink,
  getPendingUploads,
  updateQueueItem,
  removeFromQueue,
  addToQueue,
} from "@/utils/handleMediaUpload";
import {
  deleteFromOPFS,
  getFileFromOPFS,
  getPreviewFromOPFS,
  processImagesWithHeight,
  saveFileToOPFS,
} from "@/utils/eventWallHelpers";
import {
  cacheEvent,
  clearAllEventCache,
  getCachedEvent,
} from "@/utils/eventCache";
import useApi from "@/hooks/useApi";


const ThumbnailGallery = ({ folderName, customerId, showInternalTitle = true, handleShareicon }) => {
  const [allThumbnails, setAllThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false)
  const [subFolders, setSubFolders] = useState([]);
  const [activeSubFolderId, setActiveSubFolderId] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [initialSubfolderImages, setInitialSubfolderImages] = useState([]);
  const addMoreImagesRef = useRef(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [number, setNumber] = useState("");
  const [showAddToFolderPopup, setShowAddToFolderPopup] = useState(false);
  const [folderSelection, setFolderSelection] = useState([]);
  const [initialPopupFolders, setInitialPopupFolders] = useState([]);
  const [showCreateFolderPopup, setShowCreateFolderPopup] = useState(false);
  const [pendingAssignImageId, setPendingAssignImageId] = useState(null);
  const [localPhoneNumber, setLocalPhoneNumber] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [matchedKeys, setMatchedKeys] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const isMyPhotosTab = subFolders.find(sf => sf._id === activeTab)?.type === "my_photos";
  const isSearchMode = isSearching && matchedKeys.length > 0;
  const [isActualMyPhotos, setIsActualMyPhotos] = useState(false);
  const myPhotosFolder = subFolders.find(sf => sf.type === "my_photos");
  const isMyPhotosTabActive = activeTab === (myPhotosFolder?._id || "my-photos");
  const isSearchActive = isMyPhotosTabActive && isSearching;
  const [isStreamSearching, setIsStremSearching] = useState(false);
  const [rawPhoneNumber, setRawPhoneNumber] = useState(null);
  const actionMenuRef = useRef(null);
  const [mainFolderId, setMainFolderId] = useState(null);
  const [isRefreshShow, setIsRefreshShow] = useState(false);
  const [isEditingDP, setIsEditingDP] = useState(false);
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [likedImages, setLikedImages] = useState({});
  const { makeRequest: getAllPosts } = useApi();
  const [totalPages, setTotalPages] = useState(1);
  



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

  useEffect(() => {
    if (matchedKeys?.length > 0 || myPhotosFolder?.length > 0) {
      setIsEditing(false);
    }
  }, [matchedKeys.length > 0]);


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

  const handleAddToFolderSubmit = () => {
    if (usableFolders.length === 0) {
      setPendingAssignImageId(currentImage?._id);

      setShowAddToFolderPopup(false);
      setShowCreateFolderPopup(true);
      return;
    }

    if (!currentImage?._id) return;

    const toAdd = folderSelection.filter(id => !initialPopupFolders.includes(id));
    const toRemove = initialPopupFolders.filter(id => !folderSelection.includes(id));

    fetch(`${BASE_URL}/api/internal/assign-to-subfolder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subFolderId: folderSelection,
        addImageIds: toAdd.length ? [currentImage._id] : [],
        removeImageIds: toRemove.length ? [currentImage._id] : [],
      }),
    }).then(() => {
      setAllThumbnails(prev =>
        prev.map(img =>
          img._id === currentImage._id
            ? { ...img, folderIds: folderSelection }
            : img
        )
      );
      setShowAddToFolderPopup(false);
      setIsEditing(false);
    });
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (loggedIn === "true") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      setIsLoginOpen(true);
    }

    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const mobileNumber = localStorage.getItem("mobileNumber");
    const userId = localStorage.getItem("userID")
    setLocalPhoneNumber(mobileNumber)
    setLocalUserId(userId)
  }, []);

  const handleSelectImage = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(prev => prev.filter(item => item !== id));
    } else {
      setSelectedImages(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);
  const popupImages = useMemo(() => {
    if (!activeSubFolderId) return allThumbnails;

    return allThumbnails.filter(img =>
      img.folderIds?.includes(activeSubFolderId)
    );
  }, [allThumbnails, activeSubFolderId]);


  const currentImage = selectedIndex !== null
    ? popupImages[selectedIndex]
    : null;

  const visibleThumbnails = useMemo(() => {
    const normalize = (val) => (val || "").trim().toLowerCase();

    if (!isActualMyPhotos) {
      if (isEditing) {
        return allThumbnails;
      }
    }
    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {

      const normalizedKeys = matchedKeys.map(normalize);

      return allThumbnails.filter(img => {
        if (img.type !== "image") return false;

        return normalizedKeys.includes(normalize(img.thumbnailKey));
      });
    }


    // if (matchedKeys.length > 0 && ((isMyPhotosTabActive || isSearchActive))) {
    //   return allThumbnails.filter(img => matchedKeys.includes(img.thumbnailKey));
    // }

    if (isMyPhotosTabActive && myPhotosFolder) {
      return allThumbnails.filter(img => img.folderIds?.includes(myPhotosFolder._id));
    }

    if (activeSubFolderId) {
      return allThumbnails.filter(img => img.folderIds?.includes(activeSubFolderId));
    }

    return allThumbnails;
  }, [allThumbnails, matchedKeys, activeTab, isMyPhotosTabActive, isSearchActive, myPhotosFolder, activeSubFolderId, isEditing]);

  const usableFolders = subFolders.filter(sf => sf.type !== "my_photos");

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

  useEffect(() => {
    if (activeSubFolderId) {
      const ids = allThumbnails
        .filter(img => img.folderIds?.includes(activeSubFolderId))
        .map(img => img._id);

      setSelectedImages(ids);
      setInitialSubfolderImages(ids);
    }
  }, [activeSubFolderId, allThumbnails]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!folderName || !customerId) {
        setAllThumbnails([]); setLoading(false); setError("Folder name or customer ID is missing."); return;
      }
      setLoading(true); setError(null);
      try {
        const response = await fetch(`${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`);
        if (!response.ok) { const errorData = await response.text(); throw new Error(`API Error: ${response.status} - ${errorData}`); }
        const data = await response.json();
        setSubFolders(data.folders[0]?.subFolders || []);
        setMainFolderId(data?.folders[0]?._id || null)
        const fetchedThumbnails = (data.thumbnails || [])

          .map((thumb, index) => ({ ...thumb, stableKey: thumb.id || thumb.uniqueKey || thumb.url || `thumb-gallery-${index}-${Date.now()}` }));
        setAllThumbnails(fetchedThumbnails);
      } catch (fetchError) {
        console.error("Fetch thumbnails error:", fetchError); setError(fetchError.message);
      } finally { setLoading(false); }
    };
    fetchThumbnails();
  }, [folderName, customerId]);


  useEffect(() => {
    if (!localUserId || allThumbnails.length === 0) return;

    const initialLikes = {};

    allThumbnails.forEach(img => {
      initialLikes[img._id] = img.likedBy?.some(id => String(id) === String(localUserId));
    });

    setLikedImages(initialLikes);
  }, [allThumbnails, localUserId]);



  const handleSubFolderCreated = (newSubFolder) => {
    setSubFolders(prev => [...prev, newSubFolder]);
  };
  const activateNewSubFolderEditMode = (folderId) => {
    setActiveSubFolderId(folderId);
    if (activeTab !== "my-photos") {
      setIsEditing(true);
    }
    setSelectedImages([]);
    setInitialSubfolderImages([]);
  };

  const handleImageClick = useCallback((indexInDisplayedList) => {
    setSelectedIndex(indexInDisplayedList);
  }, []);


  const closePopup = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleSearchResults = (matches) => {
    if (!Array.isArray(matches)) return;
    const keys = matches.map(m => m?.file);
    setMatchedKeys(keys);
    setIsSearching(true);
  };

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


  const handleSave = async () => {
    const toAdd = selectedImages.filter(
      id => !initialSubfolderImages.includes(id)
    );

    const toRemove = initialSubfolderImages.filter(
      id => !selectedImages.includes(id)
    );

    await fetch(`${BASE_URL}/api/internal/assign-to-subfolder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subFolderId: activeSubFolderId,
        addImageIds: toAdd,
        removeImageIds: toRemove,
      }),
    });

    setAllThumbnails(prev =>
      prev.map(img => {
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
              id => id !== activeSubFolderId
            ),
          };
        }

        return img;
      })
    );

    setInitialSubfolderImages(selectedImages);
    setIsEditing(false);
  };

  const formatPhoneNumber = (num) => {
    if (!num) return "N/A";

    const str = num.toString();
    if (str.length < 4) return "N/A";

    const last4 = str.slice(-4);
    return `91+ XXXXXX${last4}`;
  };

  useEffect(() => {
    if (selectedIndex !== null && popupImages[selectedIndex]) {
      setRawPhoneNumber(popupImages[selectedIndex]?.orderByName)
      setNumber(formatPhoneNumber(popupImages[selectedIndex]?.orderByName));
    }
  }, [selectedIndex, popupImages]);



  function getBlockType(index) {
    const pos = index % 6;

    if (pos === 0 || pos === 1 || pos === 2) return "small";
    if (pos === 3) return "big";
    if (pos === 4) return "small-right-top";
    if (pos === 5) return "small-right-bottom";
  }
    const updateProgress = (id, percent) => {
    setAllThumbnails((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress: percent } : item,
      ),
    );
  };

  const updateStatus = (id, status) => {
    setAllThumbnails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  async function loadEventPosts(pageToLoad = 1) {
    if (!customerId) return;

    const draftBase64 = localStorage.getItem(`thankyou-note-draft-${customerId}`);

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
      const cached = getCachedEvent(customerId);
      if (cached) {
        let merged = draftItem ? [draftItem, ...cached] : cached;
        setAllThumbnails(await processImagesWithHeight(merged));
      }
    }

    const resp = await getAllPosts(
      `${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`,
      "GET",
    );
console.log("resp-------------",resp)
    if (resp?.thumbnails) {
      let fresh = [...resp.thumbnails];

      if (draftItem && pageToLoad === 1) {
        fresh = [draftItem, ...fresh];
      }

      const processed = await processImagesWithHeight(fresh);

      // if (isIOSMobile) {
      //   setAllThumbnails(processed);
      // } else {
        setAllThumbnails((prev) => {
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
      // }

      // setTotalPages(resp.data.totalPages);

      if (pageToLoad === 1) {
        cacheEvent(customerId, resp.thumbnails);
      }
    }
  }
  async function processUploadQueue() {
    if (!customerId) return;

    let pending = await getPendingUploads(customerId);

    // reset stuck uploads
    for (const item of pending) {
      if (item.status === "uploading") {
        await updateQueueItem(item.id, { status: "queued" });
      }
    }

    pending = await getPendingUploads(customerId);

    for (const item of pending) {
      if (item.status === "done") continue;

      try {
        await updateQueueItem(item.id, { status: "uploading" });

        const file = await getFileFromOPFS(
          customerId,
          item.id,
          item.mimeType,
          item.fileName,
        );

        const posts = await uploadMediaWeblink(
          [file],
          folderName,     
          customerId,     
          localPhoneNumber,        
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
        await deleteFromOPFS(customerId, item.id);
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
  const MAX_FILES = 10;

  const handleAddMoreClick = async () => {
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
          eventId: customerId,
          fileName: file.name,
          mimeType: file.type,
          isVideo,
          status: "queued",
          progress: 0,
          retryCount: 0,
          createdAt: now,
        };

        // 1. OPFS save
        const saved = await saveFileToOPFS(file, customerId, id);
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
        setAllThumbnails((prev) => [...processed, ...prev]);
      }

      // Trigger upload
      processUploadQueue();
    };

    input.click();
  };

  useEffect(() => {
    if (!customerId) return;

    const init = async () => {
      const cached = getCachedEvent(customerId);
      if (cached) {
        let merged = [];
        const draftBase64 = localStorage.getItem(
          `thankyou-note-draft-${customerId}`,
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
        setAllThumbnails(merged.length ? [...merged, ...processed] : processed);
      }

      // B. Pending uploads check & resume
      const pending = await getPendingUploads(customerId);
      if (pending.length > 0) {
        const existingIds = new Set(allThumbnails.map((i) => i.id));
        const toShow = pending.filter((p) => !existingIds.has(p.id));

        if (toShow.length > 0) {
          const tempItems = await Promise.all(
            toShow.map(async (p) => {
              const preview = await getPreviewFromOPFS(
                customerId,
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

          setAllThumbnails((prev) => {
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
  }, [customerId]);

  if (error) {
    return <div className="thumbnail-gallery-status text-red-500" role="alert">Error: {error}</div>;
  }
  if (allThumbnails.length === 0 && !loading) {
    return <div className="thumbnail-gallery-status">No photos found in this gallery.</div>;
  }
  if (!authChecked) {
    return null;
  }

  const handleSubFolderSelect = (id) => {
    setActiveSubFolderId(id);

    setSelectedImages([]);

    if (activeTab !== "my-photos") {
      setIsEditing(false);

      setActiveTab(id ?? "all");
    }
  };

  const handleLikeToggle = async (imageId) => {
    const userId = localUserId;

    const isCurrentlyLiked = likedImages[imageId];

    setLikedImages(prev => ({
      ...prev,
      [imageId]: !isCurrentlyLiked,
    }));

    setAllThumbnails(prev =>
      prev.map(img => {
        if (img._id === imageId) {
          let updatedLikedBy = [...(img.likedBy || [])];

          if (isCurrentlyLiked) {
            updatedLikedBy = updatedLikedBy.filter(
              id => String(id) !== String(userId)
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
      })
    );

    try {
      await fetch(`https://horaservices.com/api/internal/toggle-like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageIds: [imageId],
          userId,
        }),
      });
    } catch (error) {
      console.error(error);

      setLikedImages(prev => ({
        ...prev,
        [imageId]: isCurrentlyLiked,
      }));

      setAllThumbnails(prev =>
        prev.map(img => {
          if (img._id === imageId) {
            let updatedLikedBy = [...(img.likedBy || [])];

            if (!isCurrentlyLiked) {
              updatedLikedBy = updatedLikedBy.filter(
                id => String(id) !== String(userId)
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
        })
      );
    }
  };

  return (
    <div className="thumbnail-gallery">
      <div>
        {loading ?
          <HeaderCardsFlashLoader />
          :
          <HeaderCards
            folderName={folderName}
            customerId={customerId}
            setIsSearching={setIsSearching}
            onSearchResults={handleSearchResults}
            subFolders={subFolders}
            onSelectSubFolder={handleSubFolderSelect}
            onSubFolderCreated={handleSubFolderCreated}
            onNewFolderActivate={activateNewSubFolderEditMode}

            showCreateFolderPopup={showCreateFolderPopup}
            setShowCreateFolderPopup={setShowCreateFolderPopup}

            pendingAssignImageId={pendingAssignImageId}
            setPendingAssignImageId={setPendingAssignImageId}
            setAllThumbnails={setAllThumbnails}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSearching={isSearching}

            setIsActualMyPhotos={setIsActualMyPhotos}
            setIsStremSearching={setIsStremSearching}

            mainFolderId={mainFolderId}

            setSubFolders={setSubFolders}
            setIsRefreshShow={setIsRefreshShow}
            isEditingDP={isEditingDP}
            setIsEditingDP={setIsEditingDP}

            showCameraPopup={showCameraPopup}
            setShowCameraPopup={setShowCameraPopup}

            capturedImage={capturedImage}
            setCapturedImage={setCapturedImage}
          />
        }
        <div>

          <div>
            {activeTab !== "my-photos" &&
              <div>
                {!isMyPhotosTab && activeSubFolderId && !isEditing && (
                  <div className="buttons-container">
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
                  </div>
                )}

                {!isMyPhotosTab && activeSubFolderId && isEditing && (
                  <button
                    className="save-image-btn"
                    onClick={handleSave}
                    disabled={!hasChanges}
                    style={{
                      opacity: !hasChanges ? 0.75 : 1,
                      cursor: !hasChanges ? "not-allowed" : "pointer",
                    }}
                  >
                    <span className="save-icon">
                      <Image
                        src={checkWithBoard}
                        alt="share"
                        height={13}
                        width={11}
                      />
                    </span>
                    <span>Save Photos To Album</span>
                  </button>
                )}
              </div>
            }
          </div>



          {!loading && activeTab === "all" && (
            <div className="buttons-container">
              <button
                className="add-new-btn"
                // onClick={() => addMoreImagesRef.current?.click()}
                onClick={handleAddMoreClick}
              >
                <span className="add-icon">+</span>
                <span>Add New Photos</span>
              </button>
              <button
                className="share-capsule-btn"
                onClick={handleShareicon}
              >
                <span className="">
                  {typeof handleShareicon === 'function' && (
                    <Image
                      src={share}
                      alt="share"
                    />
                  )}
                </span>
                <span>Share Event Capsule</span>
              </button>
            </div>

          )}

          {isRefreshShow && (
            <div className="buttons-container">
              <button
                className="refresh-image-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  setIsEditingDP(true);
                  setIsActualMyPhotos(true);
                  setIsSearching(false);
                  handleSearchResults([]);
                  setCapturedImage(null);
                  setShowCameraPopup(true);
                  setIsRefreshShow(true);
                }}
              >
                <span className="refresh-icon">
                  {typeof handleShareicon === 'function' && (
                    <Image
                      src={refreshIcon}
                      alt="share"
                      height={12}
                      width={14}
                    />
                  )}
                </span>
                <span>Refresh</span>
              </button>
            </div>
          )}
        </div>
        {/* Hidden file input – Add More Images */}
        {/* <input 
          type="file"
          id="addMoreImagesInput"
          ref={addMoreImagesRef}
          multiple
          accept="image/*,video/*"
          style={{ display: "none" }}
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const timestamp = Date.now();
            const tempThumbnails = files.map((file, index) => {
              const objectUrl = URL.createObjectURL(file);

              return {
                _id: `temp-${timestamp}-${index}`,
                file,
                type: file.type.startsWith("video") ? "video" : "image",
                originalUrl: objectUrl,
                thumbnailImageUrl: file.type.startsWith("image") ? objectUrl : null,
                videoClipUrl: file.type.startsWith("video") ? objectUrl : null,
                isTemp: true,
                uploading: true,
                uploaded: false,
                orderByName: localPhoneNumber,
              };
            });
            setAllThumbnails(prev => [...tempThumbnails, ...prev]);

            await Promise.all(
              tempThumbnails.map(async (temp) => {
                const formData = new FormData();

                files.forEach((file) => {
  formData.append("files", file);
});

                formData.append("folderName", folderName);
                formData.append("customerId", localUserId);
                formData.append("phoneNo", localPhoneNumber);

                try {
                  const res = await fetch(
                    `${MEDIA_WORKER_URL}/upload`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  const data = await res.json();

                  const img = data?.files?.[0];

                  if (img) {
                    const newThumb = {
                      _id: String(img.imageId),
                      type: img.videoUrl ? "video" : "image",
                      originalUrl: img.imageUrl || img.videoUrl,
                      thumbnailImageUrl: img.thumbnailUrl || null,
                      videoClipUrl: img.clipUrl || null,
                      isTemp: true,
                      uploading: false,
                      uploaded: true,
                      orderByName: localPhoneNumber,
                    };
                    setAllThumbnails(prev =>
                      prev.map(item => {
                        if (item._id === temp._id) {
                          return {
                            ...newThumb,
                            folderIds: item.folderIds || [],
                          };
                        }
                        return item;
                      })
                    );

                    setSelectedIndex(prevIndex => {
                      if (prevIndex === null) return prevIndex;
                      return prevIndex;
                    });

                    setTimeout(() => {
                      setAllThumbnails(prev =>
                        prev.map(item =>
                          item._id === newThumb._id
                            ? { ...item, isTemp: false }
                            : item
                        )
                      );
                    }, 2000);

                  }

                  URL.revokeObjectURL(temp.originalUrl);

                } catch (err) {
                  console.error("Upload failed:", err);
                  alert("Image upload failed");
                  setAllThumbnails(prev =>
                    prev.filter(item => item._id !== temp._id)
                  );
                }
              })
            );

            e.target.value = "";
          }}
        /> */}


        <div>
          {/* ================= LOADING SKELETON ================= */}
          {loading && (
            <div className="gallery-image-grid">
              {[...Array(6)].map((_, index) => {
                const type = getBlockType(index);
                return (
                  <div key={index} className={`grid-item ${type}`}>
                    <div className="event-masonry-item">
                      <div className="event-lazy-image-spinner-container placeholder-glow">
                        <div className="placeholder w-100 h-100"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= SEARCHING STATE ================= */}
          {!loading && isStreamSearching && isSearching && isActualMyPhotos && matchedKeys.length === 0 && (
            <>
              <div className="thumbnail-gallery-status">Searching Photos.... </div>
              <div className="gallery-image-grid">
                {[...Array(6)].map((_, index) => {
                  const type = getBlockType(index);
                  return (
                    <div key={index} className={`grid-item ${type}`}>
                      <div className="event-masonry-item">
                        <div className="event-lazy-image-spinner-container placeholder-glow">
                          <div className="placeholder w-100 h-100"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ================= NO SEARCH RESULT ================= */}
          {!loading &&
            !isStreamSearching &&
            isActualMyPhotos &&
            visibleThumbnails.length === 0 && (
              <div className="thumbnail-gallery-status">No images found</div>
            )}

          {/* ================= MAIN IMAGE GRID ================= */}
          {!loading && visibleThumbnails.length > 0 && (
            <div className="event-image-grid">
              {visibleThumbnails.map((thumbnail, indexOnPage) => {
                const type = getBlockType(indexOnPage);
                const hasAnyLike = (thumbnail.likedBy?.length || 0) > 0;
                return (
                  <div
                    key={thumbnail.stableKey || indexOnPage}
                    className={`grid-item ${type}`}
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: "transparent",
                      display: "grid",
                    }}
                    onClick={() => {
                      if (isEditing) {
                        handleSelectImage(thumbnail._id);
                      } else {
                        handleImageClick(indexOnPage);
                      }
                    }}
                  >
                    <div className="image-wrapper" style={{ position: "relative" }}>
                      {!isEditing && hasAnyLike && (
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "8px",
                            zIndex: 10,
                          }}
                        >
                          <Image
                            src={LikeFill}
                            alt="liked"
                            width={16}
                            height={16}
                          />
                        </div>
                      )}

                      {isEditing &&
                        !isSearchMode &&
                        activeSubFolderId &&
                        !isActualMyPhotos && (
                          <input
                            type="checkbox"
                            className="image-checkbox"
                            checked={selectedImages.includes(thumbnail._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedImages((prev) => [...prev, thumbnail._id]);
                              } else {
                                setSelectedImages((prev) =>
                                  prev.filter((id) => id !== thumbnail._id)
                                );
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}

                      <EventwallGalleryItem
                        isVideo={thumbnail.type === "video"}
                        indexOnPage={indexOnPage}
                        isLoading={thumbnail.isTemp && thumbnail.uploading}
                        id={thumbnail._id}
                        imageUrl={
                          thumbnail.type === "image"
                            ? thumbnail.thumbnailImageUrl || thumbnail.originalUrl
                            : null
                        }
                        previewSrc={
                          thumbnail.type === "video" ? thumbnail.videoClipUrl : null
                        }
                        fullVideoSrc={
                          thumbnail.type === "video" ? thumbnail.originalUrl : null
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <CommonPopup
        isOpen={showAddToFolderPopup}
        onClose={() => {
          setShowAddToFolderPopup(false);
        }}
        popupHeight={usableFolders.length === 0 ? "269" : ""}
        title="Add to Folder"
        titleFontSize="22px"
        buttonContent={usableFolders.length === 0 ? null : "Add Now"}
        disabled={JSON.stringify(folderSelection) === JSON.stringify(initialPopupFolders)}
        onSubmit={handleAddToFolderSubmit}
        containerClass=""
      >
        <div
          className="add-folder-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {usableFolders.length > 0 ? (
            usableFolders?.map(sf => {
              return (
                <label key={sf._id} className="folder-checkbox-row">
                  <div className="folder-info">
                    <div className={`${sf.folderDp?.thumbnailUrl ? 'folder-dp' : 'default-folder-dp'}`}>
                      <img src={sf?.folderDp?.thumbnailUrl || user2?.src} alt={sf.folderName} />
                    </div>
                    <span className="folder-name">{sf.folderName}</span>
                  </div>
                  <input
                    type="checkbox"
                    className="popup-checkbox"
                    checked={folderSelection.includes(sf._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFolderSelection(prev => [...prev, sf._id]);
                      } else {
                        setFolderSelection(prev =>
                          prev.filter(id => id !== sf._id)
                        );
                      }
                    }}
                  />
                </label>
              );
            })
          ) : (
            <div className="emptyFolder-container">
              <div className="no-subfolder-text">No Folders Found</div>
              <div className="sub-text-empty">You don’t have any folder yet.</div>
              <div className="pop-btn-container">
                <button
                  className="popup-btn emptyFolder-popup-btn"
                  onClick={handleAddToFolderSubmit}
                >
                  Create Folder
                </button>
              </div>
            </div>
          )}
        </div>
      </CommonPopup>

      <CommonImagePopup
        images={popupImages}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onClose={closePopup}
        renderActions={(currentImage, index) => (
          <div>
            <div style={{ position: "relative" }}>
              <Image
                src={multiGroup}
                alt="More"
                width={25}
                height={25}
                onClick={() => setShowActionMenu(prev => !prev)}
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
                        setFolderSelection(currentImage.folderIds || []);
                        setInitialPopupFolders(currentImage.folderIds || []);
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
                          const current = allThumbnails[selectedIndex];
                          downloadFile(current.originalUrl);
                          setShowActionMenu(false);
                        }}
                      >
                        <Image src={downloadVector} width={15} height={15} />
                        <span>Download</span>
                      </div>
                    )}

                    <div
                      onClick={() => {
                        const current = allThumbnails[selectedIndex];
                        if (!current) return;
                        handleImageShare(current?.originalUrl);
                        setShowActionMenu(false);
                      }} className="action-item flex gallery-share-icon">
                      <Image
                        src={shareVector} width={13} height={14} />
                      <span>Share</span>
                    </div>
                    {String(rawPhoneNumber) === String(localPhoneNumber) &&
                      <div
                        className="action-item flex"
                        onClick={async () => {
                          const currentImage = allThumbnails[selectedIndex];
                          if (!currentImage?._id) return;

                          if (!window.confirm("Are you sure you want to delete this image?")) return;

                          try {
                            const res = await fetch(`${MEDIA_WORKER_URL}/delete-image/${currentImage._id}`, {
                              method: "DELETE",
                            });

                            if (!res.ok) {
                              const err = await res.text();
                              throw new Error(err);
                            }

                            setAllThumbnails(prev => {
                              const newList = prev.filter(img => img._id !== currentImage._id);
                              if (newList.length === 0) {
                                setSelectedIndex(null);
                              } else if (selectedIndex >= newList.length) {
                                setSelectedIndex(newList.length - 1);
                              } else {
                                setSelectedIndex(selectedIndex);
                              }
                              return newList;
                            });

                            setShowActionMenu(false);

                          } catch (err) {
                            console.error("Delete failed:", err);
                            alert("Failed to delete image");
                          }
                        }}
                      >
                        <Image src={deleteVector} width={13} height={17} />
                        <span>Delete</span>
                      </div>
                    }
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
                    handleImageShare(currentImage?.originalUrl);
                  }}
                />
              </div>
            </div>
          );
        }}
      />

      {!isLogin && isLoginOpen && <OtpLogin setIsModalOpen={setIsLoginOpen} backIconHidden={true} />}

    </div>
  );
};

export default ThumbnailGallery;