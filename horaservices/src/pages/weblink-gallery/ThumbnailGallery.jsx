// ThumbnailGallery.js
"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from 'next/image';
import './gallery.css'; // Ensure this path is correct
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
import { assignToSubfolder, getImagesbyFolderName, getSubFolders } from "@/services/weblinkServices";
import { downloadFile } from "@/utils/downloadFile";
import emptyFolder from '../../assets/emptyFolder.svg';
import { filterThumbnails } from "@/utils/filterThumbnails";


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
  const isSearchMode = isSearching;
  const [isActualMyPhotos, setIsActualMyPhotos] = useState(false);
  const myPhotosFolder = subFolders.find(sf => sf.type === "my_photos");
  const isMyPhotosTabActive = activeTab === (myPhotosFolder?._id || "my-photos");
  const isSearchActive = isSearching;
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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);



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

    const toAdd = folderSelection.filter(id => !initialPopupFolders.includes(id));
    const toRemove = initialPopupFolders.filter(id => !folderSelection.includes(id));
    try {
      await assignToSubfolder({
        subFolderId: folderSelection,
        addImageIds: toAdd.length ? [currentImage._id] : [],
        removeImageIds: toRemove.length ? [currentImage._id] : [],
      });

      setAllThumbnails(prev =>
        prev.map(img =>
          img._id === currentImage._id
            ? { ...img, folderIds: folderSelection }
            : img
        )
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

  const popupImages = allThumbnails;


  const currentImage = selectedIndex !== null
    ? popupImages[selectedIndex]
    : null;

  const visibleThumbnails = useMemo(() => {
    return filterThumbnails({
      allThumbnails,
      matchedKeys,
      isMyPhotosTabActive,
      isSearchActive,
      activeSubFolderId,
      isEditing,
      isActualMyPhotos,
    });
  }, [allThumbnails, matchedKeys, activeTab, isMyPhotosTabActive, isSearchActive, isActualMyPhotos, activeSubFolderId, isEditing]);

  const finalThumbnails =
    isActualMyPhotos && myPhotoSearchResults.length > 0
      ? allThumbnails.filter(img =>
        myPhotoSearchResults.includes(img.thumbnailKey)
      )
      : visibleThumbnails;

  const usableFolders = subFolders.filter(sf => sf.type !== "my_photos");

  useEffect(() => {
    const ids = allThumbnails.map(img => img._id);
    setSelectedImages(ids);
    setInitialSubfolderImages(ids);
  }, [allThumbnails]);


  useEffect(() => {
    setPage(1);
    setAllThumbnails([]);
    setHasMore(true);
  }, [folderName, customerId, activeSubFolderId]);

useEffect(() => {
  const fetchThumbnails = async () => {
    if (!folderName || !customerId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getImagesbyFolderName({
        folderName,
        customerId,
        activeSubFolderId,
        page,
        pageSize,
      });

      const fetchedThumbnails = data.thumbnails || [];

      setAllThumbnails(prev => {
        const existingIds = new Set(prev.map(item => item._id));
        const newItems = fetchedThumbnails.filter(
          item => !existingIds.has(item._id)
        );
        return [...prev, ...newItems];
      });

      if (fetchedThumbnails.length < pageSize) {
        setHasMore(false);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false); 
    }
  };

  fetchThumbnails();
}, [folderName, customerId, page]);


  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingMore || loading || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 200) {
        setIsFetchingMore(true);
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore, isFetchingMore]);


  useEffect(() => {
    const fetchFolders = async () => {
      if (!folderName) return;

      setHeaderLoading(true);

      try {
        const data = await getSubFolders({ folderName });


        setSubFolders(data?.folder?.subFolders || []);
        setMainFolderId(data.folder?._id || null);

      } catch (err) {
        console.error("Folder fetch error:", err);
      }
      finally {
        setHeaderLoading(false);
      }
    };

    fetchFolders();
  }, [folderName]);


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

  const handleSearchResults = useCallback((matches) => {
    const keys = matches.map(m => m?.file);
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
      id => !initialSubfolderImages.includes(id)
    );

    const toRemove = initialSubfolderImages.filter(
      id => !selectedImages.includes(id)
    );

    try {
      await assignToSubfolder({
        subFolderId: activeSubFolderId,
        addImageIds: toAdd,
        removeImageIds: toRemove,
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

  if (error) {
    return <div className="thumbnail-gallery-status text-red-500" role="alert">Error: {error}</div>;
  }
  if (!authChecked) {
    return null;
  }

  const handleSubFolderSelect = async (id) => {
    setActiveSubFolderId(id);
    setSelectedImages([]);

    setIsSearching(false);
    setMyPhotoSearchResults([]);

    if (activeTab !== "my-photos") {
      setIsEditing(false);
      setActiveTab(id ?? "all");
    }

    try {
      setLoading(true);

      const data = await getImagesbyFolderName({
        folderName,
        customerId,
        subFolderId: id,
      });

      const fetchedThumbnails = (data.thumbnails || []).map((thumb, index) => ({
        ...thumb,
        stableKey:
          thumb._id ||
          thumb.originalKey ||
          `thumb-${index}-${Date.now()}`,
      }));

      setAllThumbnails(fetchedThumbnails);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
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
        {headerLoading ?
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
            matchedKeys={matchedKeys}
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
                onClick={() => addMoreImagesRef.current?.click()}
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
        <input
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
                      _id: img._id,
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

          {/* ================= MAIN IMAGE GRID ================= */}
          {!loading && finalThumbnails.length > 0 && (
            <div className="event-image-grid">
              {finalThumbnails.map((thumbnail, indexOnPage) => {
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

          {isFetchingMore && (
            <div style={{ textAlign: "center", padding: "10px" }}>
              Loading more images...
            </div>
          )}
        </div>

      </div>

      <CommonPopup
        isOpen={showAddToFolderPopup}
        onClose={() => {
          setShowAddToFolderPopup(false);
        }}
        popupHeight={usableFolders.length === 0 ? "269" : "435"}
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
                      }} className="action-item flex gallery-share-icon">
                      <Image
                        src={shareVector} width={13} height={14} />
                      <span>Share</span>
                    </div>
                    {String(rawPhoneNumber) === String(localPhoneNumber) &&
                      <div
                        className="action-item flex"
                        onClick={async () => {
                          const currentImage = popupImages[selectedIndex];
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