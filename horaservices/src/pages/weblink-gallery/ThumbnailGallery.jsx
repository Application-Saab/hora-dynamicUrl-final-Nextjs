// ThumbnailGallery.js
"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import axios from "axios";
import "./gallery.css"; // Ensure this path is correct
import { BASE_URL } from "@/utils/apiconstants";
import HeaderCards from "@/components/Gallery/HeaderCards";
import OtpLogin from "@/components/OtpLoginPopup";
import share from "../../assets/share.svg";
import multiGroup from "../../assets/multiGroup.svg";
import plusVector from "../../assets/plusVector.svg";
import downloadVector from "../../assets/downloadVector.svg";
import shareVector from "../../assets/shareVector.svg";
import deleteVector from "../../assets/DeleteVector.svg";
import HeaderCardsFlashLoader from "@/components/Gallery/HeaderCardsFlashLoader";
import user2 from "../../assets/user2.svg";
import { MEDIA_WORKER_URL } from "../../utils/apiconstants";
import CommonImagePopup from "@/components/CommonImagePopup";
import refreshIcon from "../../assets/refreshIcon.svg";
import checkWithBoard from "../../assets/checkWithBoard.svg";
import unLike from "../../assets/unLike.svg";
import whiteShareIcon from "../../assets/whiteShareIcon.svg";
import like from "../../assets/like.svg";
import { createPendingUploadsDb } from "@/utils/pendingUploadsDb";
import ImageGrid from "@/components/image-galleries/ImageGrid";
import AddToFolderPopup from "@/components/image-galleries/AddToFolderPopup";
import {
  deleteFromOPFS,
  getFileFromOPFS,
  getPreviewFromOPFS,
  saveFileToOPFS,
} from "@/utils/opfsUploadStore";

const WEBLINK_OPFS_ROOT_DIR = "weblink-temp-uploads";
const weblinkUploadsDb = createPendingUploadsDb({
  dbName: "WeblinkGalleryUploads",
  storeName: "pending",
  version: 1,
  indexes: [
    { name: "galleryKey", keyPath: "galleryKey" },
    { name: "status", keyPath: "status" },
  ],
});

const ThumbnailGallery = ({
  folderName,
  customerId,
  showInternalTitle = true,
  handleShareicon,
}) => {
  const [allThumbnails, setAllThumbnails] = useState([]);
  console.log('%c [ allThumbnails ]-59', 'font-size:13px; background:pink; color:#bf2c9f;', allThumbnails)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
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
  const isMyPhotosTab =
    subFolders.find((sf) => sf._id === activeTab)?.type === "my_photos";
  const isSearchMode = isSearching && matchedKeys.length > 0;
  const [isActualMyPhotos, setIsActualMyPhotos] = useState(false);
  console.log('%c [ isActualMyPhotos ]-87', 'font-size:13px; background:pink; color:#bf2c9f;', isActualMyPhotos)
  const myPhotosFolder = subFolders.find((sf) => sf.type === "my_photos");
  const isMyPhotosTabActive =
    activeTab === (myPhotosFolder?._id || "my-photos");
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
  const uploadingRef = useRef(false);
  const galleryKey = useMemo(
    () => `${folderName || ""}__${customerId || ""}`,
    [folderName, customerId],
  );

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
    if (matchedKeys?.length > 0 || myPhotosFolder) {
      setIsEditing(false);
    }
  }, [matchedKeys, myPhotosFolder]);

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

  const handleAddToFolderSubmit = async () => {
    if (usableFolders.length === 0) {
      setPendingAssignImageId(currentImage?._id);

      setShowAddToFolderPopup(false);
      setShowCreateFolderPopup(true);
      return;
    }

    if (!currentImage?._id) return;

    const toAdd = folderSelection.filter(
      (id) => !initialPopupFolders.includes(id),
    );
    const toRemove = initialPopupFolders.filter(
      (id) => !folderSelection.includes(id),
    );

    fetch(`${BASE_URL}/api/internal/assign-to-subfolder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subFolderId: folderSelection,
        addImageIds: toAdd.length ? [currentImage._id] : [],
        removeImageIds: toRemove.length ? [currentImage._id] : [],
      }),
    }).then(() => {
      setAllThumbnails((prev) =>
        prev.map((img) =>
          img._id === currentImage._id
            ? { ...img, folderIds: folderSelection }
            : img,
        ),
      );

      setShowAddToFolderPopup(false);
      setIsEditing(false);

    } catch (error) {
      console.error(error);
    }

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
    const userId = localStorage.getItem("userID");
    setLocalPhoneNumber(mobileNumber);
    setLocalUserId(userId);
  }, []);

  const handleSelectImage = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedImages((prev) => [...prev, id]);
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

    return allThumbnails.filter((img) =>
      img.folderIds?.includes(activeSubFolderId),
    );
  }, [allThumbnails, activeSubFolderId]);

  const currentImage =
    selectedIndex !== null ? popupImages[selectedIndex] : null;

  const visibleThumbnails = useMemo(() => {
    const normalize = (val) => (val || "").trim().toLowerCase();
    
    if (!isActualMyPhotos) {
      if (isEditing) {
        return allThumbnails;
      }
    }
    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {
      const normalizedKeys = matchedKeys.map(normalize);

      return allThumbnails.filter((img) => {
        if (img.type !== "image") return false;

        return normalizedKeys.includes(normalize(img.thumbnailKey));
      });
    }

    if (matchedKeys.length > 0 && ((isMyPhotosTabActive || isSearchActive))) {
      return allThumbnails.filter(img => matchedKeys.includes(img.thumbnailKey));
    }

    if (isMyPhotosTabActive && myPhotosFolder) {
      return allThumbnails.filter((img) =>
        img.folderIds?.includes(myPhotosFolder._id),
      );
    }
    
    if (activeSubFolderId) {
      return allThumbnails.filter((img) =>
        img.folderIds?.includes(activeSubFolderId),
    );
  }
  
  return allThumbnails;
}, [
  allThumbnails,
    matchedKeys,
    activeTab,
    isMyPhotosTabActive,
    isSearchActive,
    myPhotosFolder,
    activeSubFolderId,
    isEditing,
  ]);
  console.log('%c [ matchedKeys ]-277', 'font-size:13px; background:pink; color:#bf2c9f;', matchedKeys)
  console.log('%c [ visibleThumbnails ]-240', 'font-size:13px; background:pink; color:#bf2c9f;', visibleThumbnails)

  const usableFolders = subFolders.filter((sf) => sf.type !== "my_photos");

  useEffect(() => {
    if (activeSubFolderId) {
      const ids = allThumbnails
        .filter((img) => img.folderIds?.includes(activeSubFolderId))
        .map((img) => img._id);

      setSelectedImages(ids);
      setInitialSubfolderImages(ids);
    }
  }, [activeSubFolderId, allThumbnails]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!folderName || !customerId) {
        setAllThumbnails([]);
        setLoading(false);
        setError("Folder name or customer ID is missing.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`,
        );
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorData}`);
        }
        const data = await response.json();
        setSubFolders(data.folders[0]?.subFolders || []);
        setMainFolderId(data?.folders[0]?._id || null);
        const fetchedThumbnails = (data.thumbnails || []).map(
          (thumb, index) => ({
            ...thumb,
            stableKey:
              thumb.id ||
              thumb.uniqueKey ||
              thumb.url ||
              `thumb-gallery-${index}-${Date.now()}`,
          }),
        );
        setAllThumbnails(fetchedThumbnails);
      } catch (fetchError) {
        console.error("Fetch thumbnails error:", fetchError);
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };
    fetchThumbnails();
  }, [folderName, customerId]);

  useEffect(() => {
    if (!localUserId || allThumbnails.length === 0) return;

    const initialLikes = {};

    allThumbnails.forEach((img) => {
      initialLikes[img._id] = img.likedBy?.some(
        (id) => String(id) === String(localUserId),
      );
    });

    setLikedImages(initialLikes);
  }, [allThumbnails, localUserId]);

  const handleSubFolderCreated = (newSubFolder) => {
    setSubFolders((prev) => [...prev, newSubFolder]);
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
    console.log('%c [ matches ]-402', 'font-size:13px; background:pink; color:#bf2c9f;', matches)
    if (!Array.isArray(matches)) return;
    const keys = matches.map((m) => m?.file);
    setMatchedKeys(keys);
    setIsSearching(true);
    setMyPhotoSearchResults(keys);
  }, []);

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
      (id) => !initialSubfolderImages.includes(id),
    );

    const toRemove = initialSubfolderImages.filter(
      (id) => !selectedImages.includes(id),
    );

    try {
      await assignToSubfolder({
        subFolderId: activeSubFolderId,
        addImageIds: toAdd,
        removeImageIds: toRemove,
      });

    setAllThumbnails((prev) =>
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
              (id) => id !== activeSubFolderId,
            ),
          };
        }

        return img;
      }),
    );

      setInitialSubfolderImages(selectedImages);
      setIsEditing(false);

    } catch (error) {
      console.error(error);
    }
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
      setRawPhoneNumber(popupImages[selectedIndex]?.orderByName);
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

  const mapUploadResponseToThumb = useCallback(
    (doc) => {
      if (!doc) return null;

      const id = String(doc._id || doc.imageId || doc.id || "");
      const type =
        doc.type ||
        (doc.videoUrl || doc.videoClipUrl || doc.clipUrl ? "video" : "image");

      const originalUrl = doc.originalUrl || doc.imageUrl || doc.videoUrl || "";
      const thumbnailImageUrl =
        doc.thumbnailImageUrl || doc.thumbnailUrl || doc.postWebpUrl || null;
      const videoClipUrl = doc.videoClipUrl || doc.clipUrl || null;

      if (!id || !originalUrl) return null;

      return {
        _id: id,
        type,
        originalUrl,
        thumbnailImageUrl,
        videoClipUrl,
        isTemp: false,
        uploading: false,
        uploaded: true,
        orderByName: localPhoneNumber,
      };
    },
    [localPhoneNumber],
  );

  const upsertPendingUploadsIntoUI = useCallback(async () => {
    if (!folderName || !customerId) return;

    const pending = await weblinkUploadsDb.getAllFromIndex(
      "galleryKey",
      galleryKey,
    );
    if (!pending?.length) return;

    const tempItems = await Promise.all(
      pending.map(async (p) => {
        const preview = await getPreviewFromOPFS({
          rootDir: WEBLINK_OPFS_ROOT_DIR,
          key: p.opfsKey,
          fileName: p.fileName,
        });

        return {
          _id: p.id,
          type: p.isVideo ? "video" : "image",
          originalUrl: preview,
          thumbnailImageUrl: p.isVideo ? null : preview,
          videoClipUrl: p.isVideo ? preview : null,
          isTemp: true,
          uploading: p.status === "uploading" || p.status === "queued",
          uploaded: false,
          orderByName: localPhoneNumber,
          progress: p.progress || 0,
        };
      }),
    );

    setAllThumbnails((prev) => {
      const existing = new Set(prev.map((t) => String(t._id)));
      const toAdd = tempItems.filter(
        (t) => t._id && !existing.has(String(t._id)),
      );
      return toAdd.length ? [...toAdd, ...prev] : prev;
    });
  }, [customerId, folderName, galleryKey, localPhoneNumber]);

  const processWeblinkUploadQueue = useCallback(async () => {
    if (!folderName || !customerId) return;
    if (uploadingRef.current) return;

    uploadingRef.current = true;
    try {
      let pending = await weblinkUploadsDb.getAllFromIndex(
        "galleryKey",
        galleryKey,
      );

      for (const item of pending) {
        if (item.status === "uploading") {
          await weblinkUploadsDb.update(item.id, { status: "queued" });
        }
      }

      pending = await weblinkUploadsDb.getAllFromIndex(
        "galleryKey",
        galleryKey,
      );

      for (const item of pending) {
        if (item.status === "done") continue;

        try {
          await weblinkUploadsDb.update(item.id, { status: "uploading" });
          setAllThumbnails((prev) =>
            prev.map((t) =>
              String(t._id) === String(item.id)
                ? { ...t, uploading: true, progress: 0 }
                : t,
            ),
          );

          const file = await getFileFromOPFS({
            rootDir: WEBLINK_OPFS_ROOT_DIR,
            key: item.opfsKey,
            mimeType: item.mimeType,
            fileName: item.fileName,
          });

          const formData = new FormData();
          formData.append("files", file);
          formData.append("folderName", folderName);
          formData.append("customerId", localUserId || customerId);
          formData.append("phoneNo", localPhoneNumber || "");
          formData.append("isWeblink", "true");
          formData.append("fileId", item.id);

          const res = await axios.post(`${MEDIA_WORKER_URL}/upload`, formData, {
            onUploadProgress: (p) => {
              const percent = p.total
                ? Math.round((p.loaded * 100) / p.total)
                : 0;
              setAllThumbnails((prev) =>
                prev.map((t) =>
                  String(t._id) === String(item.id)
                    ? { ...t, progress: percent }
                    : t,
                ),
              );
              weblinkUploadsDb.update(item.id, { progress: percent });
            },
          });

          const uploadedDoc = Array.isArray(res?.data?.files)
            ? res.data.files[0]
            : res?.data?.files?.[0] || res?.data?.files;

          const mapped = mapUploadResponseToThumb(uploadedDoc);
          if (!mapped) throw new Error("Unexpected upload response");

          setAllThumbnails((prev) =>
            prev.map((t) => {
              if (String(t._id) !== String(item.id)) return t;
              return { ...mapped, folderIds: t.folderIds || [] };
            }),
          );

          await weblinkUploadsDb.remove(item.id);
          await deleteFromOPFS({
            rootDir: WEBLINK_OPFS_ROOT_DIR,
            key: item.opfsKey,
          });
        } catch (err) {
          const newRetry = (item.retryCount || 0) + 1;
          const status = newRetry > 5 ? "failed" : "queued";

          await weblinkUploadsDb.update(item.id, {
            status,
            retryCount: newRetry,
            progress: 0,
          });

          setAllThumbnails((prev) =>
            prev.map((t) =>
              String(t._id) === String(item.id)
                ? { ...t, uploading: false, progress: 0 }
                : t,
            ),
          );
        }
      }
    } finally {
      uploadingRef.current = false;
    }
  }, [
    customerId,
    folderName,
    galleryKey,
    localPhoneNumber,
    localUserId,
    mapUploadResponseToThumb,
  ]);
  useEffect(() => {
    if (!folderName || !customerId) return;
    upsertPendingUploadsIntoUI().finally(() => processWeblinkUploadQueue());
  }, [
    customerId,
    folderName,
    galleryKey,
    upsertPendingUploadsIntoUI,
    processWeblinkUploadQueue,
  ]);

  if (error) {
    return (
      <div className="thumbnail-gallery-status text-red-500" role="alert">
        Error: {error}
      </div>
    );
  }
  if (allThumbnails.length === 0 && !loading) {
    return (
      <div className="thumbnail-gallery-status">
        No photos found in this gallery.
      </div>
    );
  }
  if (!authChecked) {
    return null;
  }

  const handleSubFolderSelect = (id) => {
    setActiveSubFolderId(id);
    setSelectedImages([]);

    setIsSearching(false);
    setMyPhotoSearchResults([]);

    if (activeTab !== "my-photos") {
      setIsEditing(false);
      setActiveTab(id ?? "all");
    }
  };

  const handleLikeToggle = async (imageId) => {
    const userId = localUserId;

    const isCurrentlyLiked = likedImages[imageId];

    setLikedImages((prev) => ({
      ...prev,
      [imageId]: !isCurrentlyLiked,
    }));

    setAllThumbnails((prev) =>
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

      setLikedImages((prev) => ({
        ...prev,
        [imageId]: isCurrentlyLiked,
      }));

      setAllThumbnails((prev) =>
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
    <div className="thumbnail-gallery">
      <div>
        {loading ? (
          <HeaderCardsFlashLoader />
        ) : (
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
            matchedKeys={matchedKeys}
          />
        )}
        <div>
          <div>
            {activeTab !== "my-photos" && (
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
            )}
          </div>

          {!loading && activeTab === "all" && (
            <div className="buttons-container">
              <button
                className="add-new-btn"
                onClick={() => addMoreImagesRef.current?.click()}
              >
                <span className="add-icon">+</span>
                <span>Add New Photos</span>
              </button>
              <button className="share-capsule-btn" onClick={handleShareicon}>
                <span className="">
                  {typeof handleShareicon === "function" && (
                    <Image src={share} alt="share" />
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
                  {typeof handleShareicon === "function" && (
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
        <input
          type="file"
          id="addMoreImagesInput"
          ref={addMoreImagesRef}
          multiple
          accept="image/*,video/*"
          style={{ display: "none" }}
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            if (!files.length) return;

            if (!folderName || !customerId) {
              alert("Missing folderName/customerId");
              return;
            }

            const now = Date.now();

            const optimistic = [];

            for (const file of files) {
              const id = crypto.randomUUID();
              const isVideo = file.type.startsWith("video/");
              const localPreview = URL.createObjectURL(file);

              const saved = await saveFileToOPFS({
                rootDir: WEBLINK_OPFS_ROOT_DIR,
                prefix: galleryKey,
                id,
                file,
              });

              if (!saved.ok || !saved.key) {
                URL.revokeObjectURL(localPreview);
                continue;
              }

              await weblinkUploadsDb.add({
                id,
                galleryKey,
                folderName,
                customerId,
                phoneNo: localPhoneNumber || "",
                fileName: file.name,
                mimeType: file.type,
                isVideo,
                status: "queued",
                progress: 0,
                retryCount: 0,
                createdAt: now,
                opfsKey: saved.key,
              });

              optimistic.push({
                _id: id,
                type: isVideo ? "video" : "image",
                originalUrl: localPreview,
                thumbnailImageUrl: isVideo ? null : localPreview,
                videoClipUrl: isVideo ? localPreview : null,
                isTemp: true,
                uploading: true,
                uploaded: false,
                orderByName: localPhoneNumber,
                progress: 0,
              });
            }

            if (optimistic.length) {
              setAllThumbnails((prev) => [...optimistic, ...prev]);
              processWeblinkUploadQueue();
            }

            e.target.value = "";
          }}
        />

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
          {!loading &&
            isStreamSearching &&
            isSearching &&
            isActualMyPhotos &&
            matchedKeys.length === 0 && (
              <>
                <div className="thumbnail-gallery-status">
                  Searching Photos....{" "}
                </div>
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
          {(visibleThumbnails.length === 0 && activeSubFolderId) && (
            <div className="weblink-emptyFolder-container">
              <Image
                src={emptyFolder}
                alt="no images select"
              />
              <p className="label">No Photos Yet!</p>
              <p className="sub-label" style={{ color: "#8F939C" }}>Start adding photos to build your album</p>
            </div>
          )}

            {console.log("visibleThumbnails inside returned code", visibleThumbnails )}

          {/* ================= MAIN IMAGE GRID ================= */}
          <ImageGrid
            data={visibleThumbnails}
            loading={loading}
            isEventWall={false}
            handleSelectImage={handleSelectImage}
            handleImageClick={handleImageClick}
            isEditing={isEditing}
            isSearchMode={isSearchMode}
            activeSubFolderId={activeSubFolderId}
            isActualMyPhotos={isActualMyPhotos}
            selectedImages={selectedImages}
          />
        </div>
      </div>

      <AddToFolderPopup
        isOpen={showAddToFolderPopup}
        onClose={() => setShowAddToFolderPopup(false)}
        folders={usableFolders}
        folderSelection={folderSelection}
        setFolderSelection={setFolderSelection}
        initialSelection={initialPopupFolders}
        onSubmit={handleAddToFolderSubmit}
        onCreateFolder={handleAddToFolderSubmit}
        style={{ zIndex: 100001 }}
      />

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
                          const current = popupImages[selectedIndex];
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
                        const current = popupImages[selectedIndex];
                        if (!current) return;
                        handleImageShare(current?.originalUrl);
                        setShowActionMenu(false);
                      }}
                      className="action-item flex gallery-share-icon"
                    >
                      <Image src={shareVector} width={13} height={14} />
                      <span>Share</span>
                    </div>
                    {String(rawPhoneNumber) === String(localPhoneNumber) && (
                      <div
                        className="action-item flex"
                        onClick={async () => {
                          const currentImage = popupImages[selectedIndex];
                          if (!currentImage?._id) return;

                          if (
                            !window.confirm(
                              "Are you sure you want to delete this image?",
                            )
                          )
                            return;

                          try {
                            const res = await fetch(
                              `${MEDIA_WORKER_URL}/delete-image/${currentImage._id}`,
                              {
                                method: "DELETE",
                              },
                            );

                            if (!res.ok) {
                              const err = await res.text();
                              throw new Error(err);
                            }

                            setAllThumbnails((prev) => {
                              const newList = prev.filter(
                                (img) => img._id !== currentImage._id,
                              );
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
                    handleImageShare(currentImage?.originalUrl);
                  }}
                />
              </div>
            </div>
          );
        }}
      />

      {!isLogin && isLoginOpen && (
        <OtpLogin setIsModalOpen={setIsLoginOpen} backIconHidden={true} />
      )}
    </div>
  );
};

export default ThumbnailGallery;
