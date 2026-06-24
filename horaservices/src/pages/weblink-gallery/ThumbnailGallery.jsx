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
import { assignToSubfolder, getImagesbyFolderName, trackActivity, trackGalleryView, trackFolderClick, trackDevice, createSubfolder } from "@/services/weblinkServices";
import { downloadFile } from "@/utils/downloadFile";
import emptyFolder from '../../assets/emptyFolder.svg';
import { filterThumbnails } from "@/utils/filterThumbnails";
import PaginationControls from "./capsulePagination";
import { IoIosCloudDone } from "react-icons/io";
import Lock from '../../assets/Lock.svg'
import lockerBannerimage from '../../assets/lockerBanner.svg'
import LockerPopup from "@/components/image-galleries/LockerPopup";

import {
  deleteFromOPFS,
  getFileFromOPFS,
  getPreviewFromOPFS,
  saveFileToOPFS,
} from "@/utils/opfsUploadStore";
import capsuleTopBanner from "../../assets/capsuleTopBanner.svg";
import guest from "../../assets/guest.svg";
import GuestBanner from "../../assets/GuestBanner.svg";
import FolderBanner from "../../assets/FolderBanner.svg";
import FaceRecognitionBanner from "../../assets/FaceRecognitionBanner.svg";
import MyPhotos2 from '../../assets/MyPhotos2.svg';
import imageBox from "../../assets/imageBox.png";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import ArrowImg from "../../assets/backarrow.svg";

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
  const prevLoginOpenRef = useRef(isLoginOpen);
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
  const [isPrivateFolder, setIsPrivateFolder] = useState(false);
  const isMyPhotosTab =
    subFolders.find((sf) => sf._id === activeTab)?.type === "my_photos";
  const isSearchMode = isSearching && matchedKeys.length > 0;
  const [isActualMyPhotos, setIsActualMyPhotos] = useState(false);
  console.log('%c [ isActualMyPhotos ]-87', 'font-size:13px; background:pink; color:#bf2c9f;', isActualMyPhotos)
  const myPhotosFolder = subFolders.find((sf) => sf.type === "my_photos");
  const privateLocker = useMemo(
    () =>
      subFolders.find(
        (sf) =>
          sf.type === "others" &&
          // sf.userId === localUserId &&
          sf.isLocker === true,
      ),
    [subFolders, localUserId],
  );
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
  const [myPhotoSearchResults, setMyPhotoSearchResults] = useState([]);
  const [viewedBy, setViewedBy] = useState([]);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestData, setGuestData] = useState([]);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const buttonsRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isIOSMobile, setIsIOSMobile] = useState(false);
  const [deviceTracking, setDeviceTracking] = useState(null);
  const [isAddingToLocker, setIsAddingToLocker] = useState(false);
  const [showLockerPopup, setShowLockerPopup] = useState(false);
const [pendingLockerImage, setPendingLockerImage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "Image downloaded successfully",
  });


 const snackbarTimeout = useRef(null);

const showSnackbar = (message) => {
  setSnackbar({
    show: true,
    message,
  });

  if (snackbarTimeout.current) {
    clearTimeout(snackbarTimeout.current);
  }

  snackbarTimeout.current = setTimeout(() => {
    setSnackbar({
      show: false,
      message: "",
    });
  }, 5000);
};


  // iOS Mobile Detection
  useEffect(() => {
    const detectIOSMobile = () => {
      if (typeof navigator !== 'undefined') {
        // Basic check for iPhone, iPad, iPod.
        // iPadOS 13+ might report as 'MacIntel' but will have touch capabilities.
        // For "iOS mobile", we primarily care about iPhone/iPod. iPads might be considered tablets.
        // Sticking to a simpler check for 'iPhone' or 'iPod' for "mobile" specificity.
        return /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      }
      return false;
    };
    setIsIOSMobile(detectIOSMobile());
  }, []);

  // Dynamic ITEMS_PER_PAGE (will primarily affect iOS mobile due to conditional pagination)
  const getItemsPerPage = useCallback(() => {
    if (typeof window === 'undefined') return 12; // Default for SSR or if window is not available
    // For iOS mobile, a smaller number might be better, e.g. 12-15.
    // For other devices (where pagination is hidden), this number doesn't directly limit display
    // but affects the `totalPages` calculation if we were to show it.
    // Let's adjust: more items for wider screens if pagination *were* shown.
    // If only for iOS mobile, maybe a fixed number like 12 or 15 is fine.
    // Given the new requirement, this dynamic ITEMS_PER_PAGE is mostly for iOS.
    if (isIOSMobile) {
      return 24; // Example: more items on larger iPhones
    }
    return 24; // Fallback for general calculation (though UI is hidden)

  }, [isIOSMobile]); // Re-evaluate if isIOSMobile changes (though it won't after mount)


  const [ITEMS_PER_PAGE, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    if (isIOSMobile) { // Only listen to resize for ITEMS_PER_PAGE if on iOS mobile
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isIOSMobile, getItemsPerPage]);

  const getInitial = (guest) => {
    const name =
      guest.name ||
      guest.firstName ||
      guest.phone ||
      "";

    return name.trim().charAt(0).toUpperCase();
  };

  const getColor = (id) => {
    const colors = ["#ED9D58", "#C689BF", "#7EBDCB", "#EEBE5C", "#6BB266"];
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

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


  const handleImageShare = async (imageUrl, id) => {
    if (!imageUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Photo",
          text: "Check out this photo!",
          url: imageUrl,
        });
        trackActivity(id, "share");
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

    }).catch((error) => {
      console.error(error);
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


  useEffect(() => {
    const pushTrap = () => {
      if (!window.history.state?.exitTrap) {
        window.history.pushState({ exitTrap: true }, "", window.location.href);
      }
    };

    pushTrap();

    const handlePopState = () => {
      if (selectedIndex !== null) {
        setSelectedIndex(null);
        pushTrap();
        return;
      }

      if (showCameraPopup) {
        setShowCameraPopup(false);
        pushTrap();
        return;
      }

      if (showCreateFolderPopup) {
        setShowCreateFolderPopup(false);
        pushTrap();
        return;
      }

      if (showGuestModal) {
        setShowGuestModal(false);
        pushTrap();
        return;
      }

      const exitPopupShown =
        sessionStorage.getItem("exitPopupShown") === "true";

      if (exitPopupShown) {
        window.history.back();
        return;
      }

      if (!showExitPopup) {
        setShowExitPopup(true);
        pushTrap();
      } else {
        window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    selectedIndex,
    showCameraPopup,
    showCreateFolderPopup,
    showGuestModal,
    showExitPopup,
  ]);

  const closeExitPopup = () => {
    setShowExitPopup(false);
    sessionStorage.setItem("exitPopupShown", "true");
  };


  useEffect(() => {
    if (!localUserId) return;

    const alreadyExists = guestData.some(
      (guest) => String(guest._id) === String(localUserId)
    );

    if (alreadyExists) return;

    const currentGuest = {
      _id: localUserId,
      name: localStorage.getItem("userName") || "",
      phone: localPhoneNumber || "",
      avatar: "",
    };

    setGuestData((prev) => [currentGuest, ...prev]);

    setViewedBy((prev) => {
      if (prev.includes(localUserId)) return prev;
      return [localUserId, ...prev];
    });
  }, [localUserId, localPhoneNumber]);

  const visibleThumbnails = useMemo(() => {
    const normalize = (val) => {
  return String(val ?? "").trim().toLowerCase();
};

    const lockerId = privateLocker?._id;

    const isLockerImage = (img) =>
  lockerId && img.folderIds?.includes(lockerId);

    if (!isActualMyPhotos) {
      if (isEditing) {
        return allThumbnails.filter((img) => !isLockerImage(img));
      }
    }
    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {
      const normalizedKeys = matchedKeys.map(normalize);

      return allThumbnails.filter((img) => {
        if (img.type !== "image") return false;

        return normalizedKeys.includes(normalize(img.thumbnailKey));
      });
    }

    if (lockerId && activeTab === lockerId) {
      return allThumbnails.filter((img) => img.folderIds?.includes(lockerId));
    }

    if (activeSubFolderId && activeSubFolderId !== lockerId) {
  return allThumbnails.filter(
    (img) =>
      img.folderIds?.includes(activeSubFolderId) &&
      !isLockerImage(img)
  );
}

    if (activeTab === "all" && lockerId) {
      return allThumbnails.filter((img) => !img.folderIds?.includes(lockerId));
    }


    if (matchedKeys.length > 0 && ((isMyPhotosTabActive || isSearchActive))) {
      return allThumbnails.filter(img => matchedKeys.includes(img.thumbnailKey));
    }

    if (isMyPhotosTabActive && myPhotosFolder) {
  return allThumbnails.filter(
    (img) =>
      img.folderIds?.includes(myPhotosFolder._id) &&
      !isLockerImage(img)
  );
}

    if (activeSubFolderId) {
  return allThumbnails.filter(
    (img) =>
      img.folderIds?.includes(activeSubFolderId) &&
      !isLockerImage(img)
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
    isActualMyPhotos,
    privateLocker,
  ]);

  const popupImages = useMemo(() => {
  return visibleThumbnails;
}, [visibleThumbnails]); 

  const currentImage =
    selectedIndex !== null ? popupImages[selectedIndex] : null;


  console.log('%c [ matchedKeys ]-277', 'font-size:13px; background:pink; color:#bf2c9f;', matchedKeys)
  console.log('%c [ visibleThumbnails ]-240', 'font-size:13px; background:pink; color:#bf2c9f;', visibleThumbnails)

  const usableFolders = subFolders.filter(
    (sf) => sf.type !== "my_photos" && !sf.isLocker,
  );

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
        setAllThumbnails([]); setLoading(false); setError("Folder name or customer ID is missing."); return;
      }
      setLoading(true); setError(null);
      try {
        const data = await getImagesbyFolderName({
          folderName,
          customerId,
        });
        setSubFolders(data?.folders[0]?.subFolders || []);
        setMainFolderId(data?.folders[0]?._id || null)
        setViewedBy(data?.folders[0]?.viewedBy || []);
        setGuestData(data?.folders[0]?.guestDetails || []);
        setDeviceTracking(data?.folders[0]?.deviceTracking || []);
        const fetchedThumbnails = (data.thumbnails || [])

          .map((thumb, index) => ({ ...thumb, stableKey: thumb._id || index }));
        setAllThumbnails(fetchedThumbnails);
      } catch (fetchError) {
        console.error("Fetch thumbnails error:", fetchError); setError(fetchError.message);
      } finally { setLoading(false); }
    };
    fetchThumbnails();
  }, [folderName, customerId]);

  // Adjust currentThumbnailsOnPage and totalPages based on isIOSMobile
  const { currentThumbnailsOnPage, totalPages } = useMemo(() => {
    if (isIOSMobile) {
      const total = Math.ceil(visibleThumbnails.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const currentItems = visibleThumbnails.slice(startIndex, endIndex);
      return { currentThumbnailsOnPage: currentItems, totalPages: total };
    } else {
      // Not iOS mobile: show all thumbnails, no pagination UI
      return { currentThumbnailsOnPage: visibleThumbnails, totalPages: 1 };
    }
  }, [visibleThumbnails, currentPage, ITEMS_PER_PAGE, isIOSMobile]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of gallery header after a short delay to allow UI to update
    setTimeout(() => {
      const galleryHeader = document.querySelector('.gallery-header');
      if (galleryHeader) {
        galleryHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  useEffect(() => {
    const handleLoginChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      const userId = localStorage.getItem("userID");

      if (loggedIn === "true" && userId) {
        setIsLogin(true);
        setLocalUserId(userId);
        setIsLoginOpen(false);
      }
    };

    window.addEventListener("loginStateChange", handleLoginChange);

    return () => {
      window.removeEventListener("loginStateChange", handleLoginChange);
    };
  }, []);
  useEffect(() => {
    if (!buttonsRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingBtn(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(buttonsRef.current);

    return () => observer.disconnect();
  }, [loading]);


  useEffect(() => {
    if (!mainFolderId || !localUserId) return;
    const params = new URLSearchParams(window.location.search);
    const fromPanel = params.get("fromPanel");

    // Agar panel se aaya hai toh API mat call karo
    if (fromPanel === "true") return;

    const isAlreadyViewed = viewedBy?.some(
      (id) => String(id) === String(localUserId)
    );


    if (!isAlreadyViewed) {
      trackGalleryView(localUserId, mainFolderId);
    }
  }, [mainFolderId, localUserId, viewedBy, customerId]);

  useEffect(() => {
  if (!mainFolderId || !localUserId || deviceTracking.length >= 2) return;

  const params = new URLSearchParams(window.location.search);
    const fromPanel = params.get("fromPanel");

    if (fromPanel === "true") return;

  const sessionKey = `tracked_device_${mainFolderId}_${localUserId}`;

  if (sessionStorage.getItem(sessionKey)) return;

    const getDeviceType = () => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return "ios";
    }
    }
    
    return "android";
  };

  trackDevice({
    mainFolderId,
    userId: localUserId,
    deviceType: getDeviceType(),
  })
    .then(() => {
      sessionStorage.setItem(sessionKey, "true");
    })
    .catch((err) => {
      console.error("Device tracking failed:", err);
    });
}, [mainFolderId, localUserId]);

  useEffect(() => {
    const logClick = async () => {
      const sessionKey = `tracked_folder_${mainFolderId}`;
      const alreadyTracked = sessionStorage.getItem(sessionKey);

      if (!alreadyTracked && mainFolderId) {
        try {
          await trackFolderClick(mainFolderId);

          sessionStorage.setItem(sessionKey, "true");

          console.log("Click tracked and session flag set!");
        } catch (err) {
          console.log("Tracking failed. Session flag not set, will retry on refresh.", err);
        }
      }
    };

    logClick();
  }, [mainFolderId]);


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

const currentUrl =
  typeof window !== "undefined" ? window.location.href : "";


  const handleSubFolderSelect = (id) => {
    setCurrentPage(1);
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

  const pageOffset = isIOSMobile
    ? (currentPage - 1) * ITEMS_PER_PAGE
    : 0;

  const thumbnailsToRender = isIOSMobile
    ? currentThumbnailsOnPage
    : visibleThumbnails;


  const first18Images = thumbnailsToRender.slice(0, 18);
  const remainingImages = thumbnailsToRender.slice(18);

  const chunkArray = (array, size) => {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }

    return chunks;
  };

  const imageChunks = chunkArray(first18Images, 6);

  const handleCreateFolderBannerClick = () => {
    setShowCreateFolderPopup(true);
    setIsActualMyPhotos(false);
    setIsRefreshShow(false);
  };


  const assignImageToLockerExclusive = async (
    imageId,
    lockerId,
    previousFolderIds = [],
  ) => {
    const newFolderIds = [lockerId];
    const toAdd = newFolderIds.filter((id) => !previousFolderIds.includes(id));
    const toRemove = previousFolderIds.filter(
      (id) => !newFolderIds.includes(id),
    );

    await fetch(`${BASE_URL}/api/internal/assign-to-subfolder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subFolderId: newFolderIds,
        addImageIds: toAdd.length ? [imageId] : [],
        removeImageIds: toRemove.length ? [imageId] : [],
      }),
    });

    setAllThumbnails((prev) =>
      prev.map((img) =>
        img._id === imageId ? { ...img, folderIds: newFolderIds } : img,
      ),
    );
  };

  const ensurePrivateLocker = async () => {
    if (privateLocker) return privateLocker;

    const fd = new FormData();
    fd.append("folderName", folderName);
    fd.append("subFolderName", "My Locker");
    fd.append("type", "others");
    fd.append("userId", localUserId);
    fd.append("customerId", customerId);
    fd.append("phoneNo", localPhoneNumber);
    fd.append("isLocker", "true");

    const data = await createSubfolder(fd);
    const created = data.subFolder;
    handleSubFolderCreated(created);
    return created;
  };

const handleAddToLocker = async (imgData) => {
  if (!imgData?._id || !localUserId || isAddingToLocker) return;

  const previousFolderIds = imgData.folderIds || [];
  const existingLockerId = privateLocker?._id;

  if (
    existingLockerId &&
    previousFolderIds.length === 1 &&
    previousFolderIds[0] === existingLockerId
  ) {
    return;
  }

  const lockerAlreadyExists = !!privateLocker;

  setIsAddingToLocker(true);

  try {
    const locker = await ensurePrivateLocker();

    await assignImageToLockerExclusive(
      imgData._id,
      locker._id,
      previousFolderIds
    );

    // FIRST TIME locker create hua
    if (!lockerAlreadyExists) {
      setSelectedIndex(null);
      setShowActionMenu(false);
      return;
    }

    // Locker pehle se tha
    const isLastImage =
      selectedIndex >= popupImages.length - 1;

    if (popupImages.length <= 1) {
      setSelectedIndex(null);
    } else if (isLastImage) {
      setSelectedIndex(selectedIndex - 1);
    } else {
      setSelectedIndex(selectedIndex);
    }

    setShowActionMenu(false);
  } catch (err) {
    console.error("Add to locker failed:", err);
    alert("Failed to add image to locker");
  } finally {
    setIsAddingToLocker(false);
  }
};

  const handleDownloadImage = async (currentImage) => {
    try {
      trackActivity(currentImage?._id, "download");
      setShowActionMenu(false);
      await downloadFile(currentImage?.originalUrl);
      showSnackbar("Image downloaded successfully");
    } catch (err) {
      showSnackbar("Download failed");
    }
  };


  const lockerBanner = (
  <div className="locker-banner" key="locker-banner">
    <div className="">
      <Image
        src={lockerBannerimage.src} // apni new image
        alt="LockerBanner"
        width={150}
        height={58}
        className="banner-side-image"
      />
    </div>
  </div>
);

  const banners = [
    <div className="custom-banner" key="banner-2">
      <div className="banner-left">
        <Image
          src={GuestBanner.src}
          alt="GuestBanner"
          width={150}
          height={58}
          className="banner-side-image"
        />
      </div>

      <div className="banner-right">
        <button
          onClick={() => handleShareicon(mainFolderId)}
          className="banner-btn">
          <span><Image src={share} alt="share" height={10} width={11} /></span>
          <span>Share Event</span>
        </button>
      </div>
    </div>,

    <div className="custom-banner" key="banner-1">
      <div className="banner-left">
        <Image
          src={FaceRecognitionBanner.src}
          alt="FaceRecognitionBanner"
          width={150}
          height={58}
          className="banner-side-image"
        />
      </div>

      <div className="banner-right">
        <button
          onClick={() => {
            setIsActualMyPhotos(true)
            setShowCameraPopup(true)
            setIsRefreshShow(false)
          }}
          className="banner-btn">
          <span><Image src={MyPhotos2} alt="share" height={13} width={13} /></span>
          <span>My Photos</span>
        </button>
      </div>
    </div>,

    <div className="custom-banner" key="banner-3">
      <div className="banner-left">
        <Image
          src={FolderBanner.src}
          alt="FolderBanner"
          width={120}
          height={58}
          className="banner-side-image"
        />
      </div>

      <div className="banner-right">
        <button
          onClick={handleCreateFolderBannerClick}
          className="banner-btn">
          Create Folder
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="thumbnail-gallery">

      <div className="">
        {loading ? (
          <HeaderCardsFlashLoader />
        ) : (
          <>
            {console.log("LOADING STATE:", loading)}
            {console.log("ALL THUMBNAILS LENGTH:", allThumbnails.length)}
            {console.log("VISIBLE THUMBNAILS LENGTH:", visibleThumbnails?.length)}
            <div>
              <Image
                src={capsuleTopBanner}
                alt="banner"
                className="top-banner-image"
              />
              <div className="thumbnail-gallery-content">
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
                  setIsPrivateFolder={setIsPrivateFolder}
                />
              </div>
            </div>
          </>
        )}
        <div className="thumbnail-gallery-content">

          <div>
            <div>
              {(activeTab !== "my-photos" && privateLocker?._id !== activeTab) && (
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
            {console.log("------------------------------------BUTTON DEBUG → loading:", loading, "activeTab:", activeTab)}
            {!loading && (activeTab === "all" || activeTab === privateLocker?._id) && (
              <div ref={buttonsRef} className="buttons-container">
                <button
                  className="add-photo-btn"
                  onClick={() => addMoreImagesRef.current?.click()}
                >
                  <span className="add-photo-icon">+</span>
                  <span>Add Photos</span>
                </button>
                <button className="share-capsule-btn" onClick={() => handleShareicon(mainFolderId)}>
                  <span className="">
                    {typeof handleShareicon === "function" && (
                      <Image src={share} alt="share" height={13} width={14} />
                    )}
                  </span>
                  <span>Share Event Capsule</span>
                </button>
                <button
                  onClick={() => setShowGuestModal(true)}
                  className="guest-btn">
                  <span className="">
                    <Image src={guest} alt="guest" height={13} width={17} />
                  </span>
                  <span className="guest-text"> <span className="guest-count">{viewedBy.length}</span> <span>Guests Joined</span></span>
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
            {(visibleThumbnails.length === 0 && activeSubFolderId && !isStreamSearching && !isSearching) && (
              <div className="weblink-emptyFolder-container">
                <Image
                  src={emptyFolder}
                  alt="no images select"
                />
                <p className="label">No Photos Yet!</p>
                <p className="sub-label" style={{ color: "#8F939C" }}>Start adding photos to build your album</p>
              </div>
            )}

            {console.log("visibleThumbnails inside returned code", visibleThumbnails)}

            {/* ================= MAIN IMAGE GRID ================= */}
            <div style={{ minHeight: "500px" }}>
                {isPrivateFolder && lockerBanner}
              {imageChunks.map((chunk, index) => (
                <React.Fragment key={index}>
                  <ImageGrid
                    data={chunk}
                    loading={loading}
                    isEventWall={false}
                    handleSelectImage={handleSelectImage}
                    handleImageClick={(indexOnPage) =>
                      handleImageClick(pageOffset + index * 6 + indexOnPage)
                    }
                    isEditing={isEditing}
                    isSearchMode={isSearchMode}
                    activeSubFolderId={activeSubFolderId}
                    isActualMyPhotos={isActualMyPhotos}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                  />
                {!isPrivateFolder &&
                (!isIOSMobile || currentPage === 1) &&
                banners[index]}
                </React.Fragment>
              ))}

              {remainingImages.length > 0 && (
                <ImageGrid
                  data={remainingImages}
                  loading={loading}
                  isEventWall={false}
                  handleSelectImage={handleSelectImage}
                  handleImageClick={(indexOnPage) =>
                    handleImageClick(pageOffset + 18 + indexOnPage)
                  }
                  isEditing={isEditing}
                  isSearchMode={isSearchMode}
                  activeSubFolderId={activeSubFolderId}
                  isActualMyPhotos={isActualMyPhotos}
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                />
              )}
            </div>
          </div>
        </div>

        <div className={`}`}>
          <div className="">
            {showInternalTitle && (
              <div>
                {/* <h1 className="gallery-title">Your Photos</h1> */}
                {/* <Image
                src={shareIcon}
                alt="Info"
                style={{ height: 20, width: 20, marginLeft: 10, cursor: 'pointer' }}
                onClick={handleShareicon}
              /> */}
              </div>
            )}

            {/* Conditional Pagination Rendering */}
            {isIOSMobile && totalPages > 1 && (
              <div className="">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  inline={true} // Keep compact style
                />
              </div>
            )}
          </div>
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
        style={{ zIndex: 9999 }}
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
                          handleDownloadImage(current);
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
                        handleImageShare(current?.originalUrl, current?._id);
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


      console.log("isPrivateFolder ---------------", isPrivateFolder)



          const isLiked = likedImages[imageId];
// && currentImage?.orderById === customerId
          return (
            <div className="imagepopup-footer">
              <div className="imagepopup-footer-left">
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
                    handleImageShare(currentImage?.originalUrl, currentImage?._id);
                  }}
                />
              </div>
              </div>

               {(localUserId === customerId && !isPrivateFolder ) && (
                <div>
                  <button
                    className="add-locker-btn"
                    onClick={() => {
  if (!privateLocker) {
    setPendingLockerImage(currentImage);
    setShowLockerPopup(true);
    return;
  }

  handleAddToLocker(currentImage);
}}
                    disabled={isAddingToLocker}
                >
                  <span className="add-locker-icon">
                    <img src={Lock.src} alt="" />
                  </span>
                  <span>{isAddingToLocker ? "Adding..." : "Add To Locker"}</span>
                </button>
              </div>)}
            </div>
          );
        }}
      />


      {showExitPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <span
              className="close-btn"
              onClick={closeExitPopup}
            >
              &times;
            </span>

            <div className="image-container">
              <Image
                src={imageBox}
                alt="Event Box Illustration"
                className="popup-img"
              />
            </div>

            <div className="content">
              <h2 className="title">
                Don't let any guest miss out!
              </h2>

              <p className="description">
                Forget manual sharing! Give every guest instant access
                to relive all the event's best moments.
              </p>
            </div>

            <div className="share-btn-container">
              <button
                className="share-btn"
                onClick={() => handleShareicon(mainFolderId)}
              >
                <span><Image src={share} alt="share" height={15} width={16} /></span>
                <span> Share Event Capsule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuestModal && (
        <div className="guest-modal-overlay">
          <div className="guest-modal-container">
            <div>
              {/* Header Section */}
              <div className="modal-header">
                <div>
                  <button
                    onClick={() => setShowGuestModal(false)}
                    className="back-button">
                    <Image
                      src={ArrowImg}
                      alt="Back"
                      width={24}
                      height={24}
                      className="login-back-icon"
                    />
                  </button>
                </div>
                <div className="modal-title">Guests Joined</div>
              </div>

              {/* List Section */}
              <div className="list-container">
                <div className="list-content">
                  {guestData.map((guest) => {
                    const hasAvatar = guest?.avatar && guest?.avatar?.trim() !== "";

                    return (
                      <div key={guest._id} className="guest-row">

                        {/* Avatar Section */}
                        {hasAvatar ? (
                          <img
                            src={guest.avatar}
                            alt="avatar"
                            className="avatar-img"
                          />
                        ) : (
                          <div
                            className="avatar-fallback"
                            style={{ backgroundColor: getColor(guest._id) }}
                          >
                            {getInitial(guest)}
                          </div>
                        )}

                        {/* Info */}
                        <div className="guest-info">
                          <span>
                            {guest.name ||
                              guest.firstName ||
                              formatPhoneNumber(guest?.phone)}
                          </span>
                          <hr className="divider" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer Section */}
            <div className="footer-container">
              <div className="modal-footer">
                <div className="total-badge">{guestData?.length} Total Joined</div>
              </div>
            </div>
          </div>
        </div>
      )}


      {(showFloatingBtn && !showGuestModal && !showExitPopup && selectedIndex == null && !showAddToFolderPopup && !showCameraPopup && !showCreateFolderPopup && !isLoginOpen && isLogin && !showLockerPopup)  && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "45px",
            transform: "translateX(-50%)",
            zIndex: 11111111,
          }}
        >
          <button
            className="share-capsule-btn2"
            onClick={() => handleShareicon(mainFolderId)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Image src={whiteShareIcon} alt="share" height={13} width={14} />
            <span>Share Event Capsule</span>
          </button>
        </div>
      )}

      {snackbar.show && (
        <div className="custom-snackbar">
          <span>
            <IoIosCloudDone color="green" size={30} />
          </span>
          {snackbar.message}
        </div>
      )}

      {showLockerPopup && (
  <LockerPopup
    onClose={() => {
      setShowLockerPopup(false);
      setPendingLockerImage(null);
    }}
    onMoveToLocker={async () => {
      try {
        setShowLockerPopup(false);

        if (pendingLockerImage) {
          await handleAddToLocker(pendingLockerImage);
        }

        setPendingLockerImage(null);
      } catch (err) {
        console.error(err);
      }
    }}
  />
)}

      <LoginModal
        isOpen={isLoginOpen && !isLogin}
        onClose={() => setIsLoginOpen(false)}
        fromCapsule={true}
        template="guest_login_2"
        link={currentUrl}
      />


    </div>
  );
};

export default ThumbnailGallery;