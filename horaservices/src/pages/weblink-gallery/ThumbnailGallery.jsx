// ThumbnailGallery.js
"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from 'next/image';
import './gallery.css'; // Ensure this path is correct
import { BASE_URL } from "@/utils/apiconstants";
import EventwallGalleryItem from "@/components/wonderland/event-wall/EventwallGalleryItem";
import HeaderCards from "@/components/Gallery/HeaderCards";
import OtpLogin from "@/components/OtpLoginPopup";
import ArrowImg from '../../assets/arrow.svg'
import share from '../../assets/share.svg'
import nextIcon from '../../assets/nextIcon.svg'
import multiGroup from '../../assets/multiGroup.svg'
import plusVector from '../../assets/plusVector.svg'
import downloadVector from '../../assets/downloadVector.svg'
import shareVector from '../../assets/shareVector.svg'
import deleteVector from '../../assets/deleteVector.svg'
import CommonPopup from "@/components/CommonPop";
import HeaderCardsFlashLoader from "@/components/Gallery/HeaderCardsFlashLoader";
import user2 from "../../assets/user2.svg";
import { MEDIA_WORKER_URL } from "../../utils/apiconstants";
import CommonImagePopup from "@/components/CommonImagePopup";


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

  const PrevArrow = ({ className, style, onClick }) => {
    return (
      <div
        className={`${className} custom-arrow prev-arrow`}
        style={{ ...style }}
        onClick={onClick}
      >
        <Image
          src={ArrowImg}
          alt="Back"
          width={30}
          height={30}
          className=""
        />
      </div>
    );
  };

  const NextArrow = ({ className, style, onClick }) => {
    return (
      <div
        className={`${className} custom-arrow next-arrow`}
        style={{ ...style }}
        onClick={onClick}
      >
        <Image
          src={nextIcon}
          alt="next"
          width={30}
          height={30}
          className=""
        />
      </div>
    );
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

    if (!isActualMyPhotos) {
      if (isEditing) {
        return allThumbnails;
      }
    }

    if (matchedKeys.length > 0 && ((isMyPhotosTabActive || isSearchActive))) {
      return allThumbnails.filter(img => matchedKeys.includes(img.thumbnailKey));
    }

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

  const sliderSettings = useMemo(() => ({
    dots: false,
    infinite: allThumbnails.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: 'ondemand',
    adaptiveHeight: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,

    afterChange: (current) => {
      setSelectedIndex(current);
      setShowActionMenu(false);
    },
  }), [allThumbnails.length]);

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

  if (error) {
    return <div className="thumbnail-gallery-status text-red-500" role="alert">Error: {error}</div>;
  }
  if (allThumbnails.length === 0 && !loading) {
    return <div className="thumbnail-gallery-status">No photos found in this gallery.</div>;
  }
  if (!authChecked) {
    return null;
  }



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
            onSelectSubFolder={(id) => {
              setActiveSubFolderId(id);
              setSelectedImages([]);
              if (activeTab !== "my-photos") {
                setIsEditing(false)
                setActiveTab(id ?? "all");
              }
            }}
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
          />
        }
        <div>

          <div>
            {activeTab !== "my-photos" &&
              <div>
                {!isMyPhotosTab && activeSubFolderId && !isEditing && (
                  <button
                    className="edit-image-btn"
                    onClick={() => {
                      setSelectedImages(initialSubfolderImages);
                      setIsEditing(true);
                    }}
                  >
                    <span className="edit-plus">+</span>
                    <span>Edit</span>
                  </button>
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
                    Save
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

                formData.append("files", temp.file);

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
                    // const newThumb = {
                    //   _id: img.imageId || Date.now(),
                    //   type: img.videoUrl ? "video" : "image",
                    //   originalUrl: img.imageUrl || img.videoUrl,
                    //   thumbnailImageUrl: img.thumbnailUrl || null,
                    //   videoClipUrl: img.clipUrl || null,
                    // };
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
                    // onClick={() => handleImageClick(indexOnPage)}
                    onClick={() => {
                      if (isEditing) {
                        handleSelectImage(thumbnail._id);
                      } else {
                        handleImageClick(indexOnPage);
                      }
                    }}
                  >
                    <div className="image-wrapper" style={{ position: "relative" }}>
                      {thumbnail.isTemp && (
                        <div
                          className={`upload-badge ${thumbnail.uploading ? "uploading" : "uploaded"
                            }`}
                        >
                          {thumbnail.uploading ? "Uploading..." : "Uploaded"}
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
        popupHeight="420"
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
              className="popup-btn"
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
                width={22}
                height={22}
                onClick={() => setShowActionMenu(prev => !prev)}
              />

              {showActionMenu && (
                <div className="action-menu" ref={actionMenuRef}>
                  <div className="action-item">
                    <strong>Shared by:</strong>
                    <p>{number}</p>
                  </div>

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
                    <Image src={plusVector} width={11} height={11} />
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
                      <Image src={downloadVector} width={11} height={11} />
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
                      src={shareVector} width={11} height={11} />
                    <span>Share</span>
                  </div>
                  {String(rawPhoneNumber) === String(localPhoneNumber) &&
                    <div
                      className="action-item flex"
                      onClick={async () => {
                        const currentImage = allThumbnails[selectedIndex];
                        if (!currentImage?._id) return;

                        // Confirm deletion (optional)
                        if (!window.confirm("Are you sure you want to delete this image?")) return;

                        try {
                          // Call your API to delete the image
                          const res = await fetch(`${MEDIA_WORKER_URL}/delete-image/${currentImage._id}`, {
                            method: "DELETE",
                          });

                          if (!res.ok) {
                            const err = await res.text();
                            throw new Error(err);
                          }

                          // Remove the image locally
                          setAllThumbnails(prev => {
                            const newList = prev.filter(img => img._id !== currentImage._id);
                            // Adjust selectedIndex
                            if (newList.length === 0) {
                              setSelectedIndex(null); // no more images → close popup
                            } else if (selectedIndex >= newList.length) {
                              setSelectedIndex(newList.length - 1); // deleted last image → move to previous
                            } else {
                              setSelectedIndex(selectedIndex); // else stay on current index → next image shifts automatically
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
                      <Image src={deleteVector} width={11} height={11} />
                      <span>Delete</span>
                    </div>
                  }
                </div>
              )}
            </div>
          </div>
        )}
      />

      {!isLogin && isLoginOpen && <OtpLogin setIsModalOpen={setIsLoginOpen} backIconHidden={true} />}

    </div>
  );
};

export default ThumbnailGallery;