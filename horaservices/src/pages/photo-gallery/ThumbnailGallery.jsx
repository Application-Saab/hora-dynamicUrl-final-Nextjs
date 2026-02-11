// ThumbnailGallery.js
"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Slider from "react-slick";
import Image from 'next/image';

import './gallery.css'; // Ensure this path is correct
import photogallryIcon from '../../assets/gallry-loading.gif'; // Ensure path is correct
import PaginationControls from '../../components/PaginationControls'; // Ensure path is correct
import shareIcon from '../../assets/share-photo-icon.png'; // Ensure path is correct
import EventwallGalleryItem from "@/components/wonderland/event-wall/EventwallGalleryItem";
import HeaderCards from "@/components/Gallery/HeaderCards";
import OtpLogin from "@/components/OtpLoginPopup";
import ArrowImg from '../../assets/arrow.svg'
import nextIcon from '../../assets/nextIcon.svg'
import multiGroup from '../../assets/multiGroup.svg'
import plusVector from '../../assets/plusVector.svg'
import downloadVector from '../../assets/downloadVector.svg'
import shareVector from '../../assets/shareVector.svg'
import deleteVector from '../../assets/deleteVector.svg'
import CommonPopup from "@/components/CommonPop";
import HeaderCardsFlashLoader from "@/components/Gallery/HeaderCardsFlashLoader";


// If you use slick-carousel's CSS, ensure they are imported (e.g., in a global CSS file or _app.js)
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

const ThumbnailGallery = ({ folderName, customerId, showInternalTitle = true, handleShareicon }) => {
  const [allThumbnails, setAllThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isIOSMobile, setIsIOSMobile] = useState(false);
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


  useEffect(() => {
    if (matchedKeys?.length > 0 || myPhotosFolder?.length > 0) {
      setIsEditing(false);
    }
  }, [matchedKeys.length > 0]);



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

  const alreadyAssignedFolders = currentImage?.folderIds || [];

  const visibleThumbnails = useMemo(() => {

    if (!isActualMyPhotos) {
      //  EDIT MODE: sari images dikhao
      if (isEditing) {
        return allThumbnails;
      }
    }

    // when searching
    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {
      return allThumbnails.filter(img => matchedKeys.includes(img.thumbnailKey));
    }

    // My Photos tab normal flow
    if (isMyPhotosTabActive && myPhotosFolder) {
      return allThumbnails.filter(img => img.folderIds?.includes(myPhotosFolder._id));
    }

    // Subfolder flow
    if (activeSubFolderId) {
      return allThumbnails.filter(img => img.folderIds?.includes(activeSubFolderId));
    }

    // Default All tab
    return allThumbnails;
  }, [allThumbnails, matchedKeys, activeTab, isMyPhotosTabActive, isSearchActive, myPhotosFolder, activeSubFolderId, isEditing]);


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

      if (activeTab !== "my-photos") {
        if (ids.length === 0) {
          setIsEditing(true);
        }
      }

      setSelectedImages(ids);
      setInitialSubfolderImages(ids);
    }
  }, [activeSubFolderId, allThumbnails]);




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
      return window.innerWidth >= 400 ? 15 : 9; // Example: more items on larger iPhones
    }
    return window.innerWidth >= 768 ? 36 : 24; // Fallback for general calculation (though UI is hidden)

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


  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!folderName || !customerId) {
        setAllThumbnails([]); setLoading(false); setError("Folder name or customer ID is missing."); setCurrentPage(1); return;
      }
      setLoading(true); setError(null);
      try {
        const response = await fetch(`https://horaservices.com:3000/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`);
        if (!response.ok) { const errorData = await response.text(); throw new Error(`API Error: ${response.status} - ${errorData}`); }
        const data = await response.json();
        setSubFolders(data.folder?.subFolders || []);
        const fetchedThumbnails = (data.thumbnails || [])

          .filter(thumb => !thumb.url?.includes("subfolder_"))
          .map((thumb, index) => ({ ...thumb, stableKey: thumb.id || thumb.uniqueKey || thumb.url || `thumb-gallery-${index}-${Date.now()}` }));
        setAllThumbnails(fetchedThumbnails); setCurrentPage(1);
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


  // Adjust currentThumbnailsOnPage and totalPages based on isIOSMobile
  const { currentThumbnailsOnPage, totalPages } = useMemo(() => {
    if (isIOSMobile) {
      const total = Math.ceil(allThumbnails.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const currentItems = allThumbnails.slice(startIndex, endIndex);
      return { currentThumbnailsOnPage: currentItems, totalPages: total };
    } else {
      // Not iOS mobile: show all thumbnails, no pagination UI
      return { currentThumbnailsOnPage: allThumbnails, totalPages: 1 };
    }
  }, [allThumbnails, currentPage, ITEMS_PER_PAGE, isIOSMobile]);

  // const handleImageClick = useCallback((indexInDisplayedList) => {
  //   let originalIndex;
  //   if (isIOSMobile) {
  //     originalIndex = (currentPage - 1) * ITEMS_PER_PAGE + indexInDisplayedList;
  //   } else {
  //     originalIndex = indexInDisplayedList; // Index is direct from allThumbnails
  //   }

  //   if (originalIndex >= 0 && originalIndex < allThumbnails.length) {
  //     setSelectedIndex(originalIndex);
  //   }
  // }, [currentPage, ITEMS_PER_PAGE, allThumbnails.length, isIOSMobile]);

  const handleImageClick = useCallback((indexInDisplayedList) => {
    setSelectedIndex(indexInDisplayedList);
  }, []);


  const closePopup = useCallback(() => {
    setSelectedIndex(null);
  }, []);

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

    await fetch("https://horaservices.com:3000/api/internal/assign-to-subfolder", {
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
        <div className={`gallery-header ${showInternalTitle ? 'with-title' : 'no-title'}`}>
          <div className="gallery-header">
            <div className="gallery-header-content">
              {typeof handleShareicon === 'function' && (
                <Image
                  src={shareIcon}
                  alt="Share"
                  className="gallery-share-icon"
                  onClick={handleShareicon}
                  width={22}
                  height={22}
                />
              )}
            </div>
          </div>

          {/* Conditional Pagination Rendering */}
          {isIOSMobile && totalPages > 1 && (
            <div className="gallery-pagination-container">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                inline={true} // Keep compact style
              />
            </div>
          )}
        </div>


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



          {!loading && activeTab === "all" && !isActualMyPhotos && (
            <button
              className="add-new-btn"
              onClick={() => addMoreImagesRef.current?.click()}
            >
              <span className="add-icon">+</span>
              <span>Add New Images</span>
            </button>

          )}
        </div>
        {/* Hidden file input – Add More Images */}
        <input
          type="file"
          id="addMoreImagesInput"
          ref={addMoreImagesRef}
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            try {
              const formData = new FormData();

              files.forEach((file) => {
                formData.append("images", file);
              });

              // extra fields (agar chahiye)
              formData.append("folderName", folderName);
              formData.append("customerId", localUserId);
              formData.append("phoneNo", localPhoneNumber);


              const res = await fetch(
                "http://13.60.32.239:3000/upload-multiple",
                {
                  method: "POST",
                  body: formData,
                }
              );

              if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
              }

              const data = await res.json();

              if (data?.images?.length) {
                const newThumbnails = data.images.map((img, index) => ({
                  _id: img.imageId,
                  type: "image",
                  originalUrl: img.imageUrl,
                  thumbnailImageUrl: img.thumbnailUrl,
                  folderIds: [],
                  stableKey: `new-upload-${img.imageId}-${Date.now()}-${index}`,
                }));

                setAllThumbnails(prev => [...newThumbnails, ...prev]);
              }

              setIsEditing(false);



            } catch (err) {
              console.error("Upload failed:", err);
              alert("Image upload failed");
            } finally {
              e.target.value = "";
            }
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
{!loading && isStreamSearching && isActualMyPhotos && matchedKeys.length === 0 && (
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
          onClick={() => handleImageClick(indexOnPage)}
        >
          <div className="image-wrapper" style={{ position: "relative" }}>
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

{/* ================= IOS EMPTY PAGE CASE ================= */}
{!loading &&
  !isStreamSearching &&
  isIOSMobile &&
  totalPages > 0 &&
  visibleThumbnails.length === 0 && (
    <div className="thumbnail-gallery-status">No photos on this page.</div>
)}


          {selectedIndex !== null && popupImages[selectedIndex] && (
            <div className="popupOverlay" onClick={closePopup} role="dialog" aria-modal="true" aria-labelledby="popup-title">
              <div className="popupContent" onClick={(e) => e.stopPropagation()}>
                <div className="popupHeader">
                  <div className="popupHeader-left">
                    <button className="closeButton" onClick={closePopup} aria-label="Close image viewer">
                      <Image
                        src={ArrowImg}
                        alt="Back"
                        width={18}
                        height={18}
                        className=""
                        onClick={closePopup}
                      />
                    </button>
                    <div id="popup-title" className="image-index">
                      {`${selectedIndex + 1} / ${popupImages.length}`}
                    </div>
                  </div>
                  <div>
                    {typeof handleShareicon === 'function' && (
                      <div style={{ position: "relative" }}>
                        <Image
                          src={multiGroup}
                          alt="More"
                          width={22}
                          height={22}
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowActionMenu(prev => !prev)}
                        />

                        {showActionMenu && (
                          <div className="action-menu">
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
                              <Image src={plusVector} width={16} height={16} />
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
                                <Image src={downloadVector} width={16} height={16} />
                                <span>Download</span>
                              </div>
                            )}

                            <div
                              onClick={handleShareicon}
                              className="action-item flex gallery-share-icon">
                              <Image
                                src={shareVector} width={16} height={16} />
                              <span>Share</span>
                            </div>

                            <div
                              className="action-item flex"
                              onClick={async () => {
                                const currentImage = allThumbnails[selectedIndex];
                                if (!currentImage?._id) return;

                                // Confirm deletion (optional)
                                if (!window.confirm("Are you sure you want to delete this image?")) return;

                                try {
                                  // Call your API to delete the image
                                  const res = await fetch(`http://13.60.32.239:3000/delete-image/${currentImage._id}`, {
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

                                } catch (err) {
                                  console.error("Delete failed:", err);
                                  alert("Failed to delete image");
                                }
                              }}
                            >
                              <Image src={deleteVector} width={16} height={16} />
                              <span>Delete</span>
                            </div>
                          </div>
                        )}
                      </div>

                    )}
                  </div>
                </div>
                <div className="popupSliderWrapper">
                  <Slider
                    {...sliderSettings}
                    initialSlide={selectedIndex}
                    key={`slick-slider-${selectedIndex}-${allThumbnails[selectedIndex]?.stableKey}`}
                  >
                    {popupImages.map((thumb, idx) => {
                      const isVideo = thumb.type === "video";

                      return (
                        <div key={thumb.stableKey || idx} className="slick-slide-item">
                          {isVideo ? (
                            <video
                              src={thumb.originalUrl}
                              controls
                              autoPlay
                              muted
                              playsInline
                              className="popupVideo"
                            />
                          ) : (
                            <img
                              src={thumb.thumbnailImageUrl || thumb.originalUrl}
                              alt={`Enlarged ${idx + 1}`}
                              className="popupImage"
                            />
                          )}

                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </div>
            </div>
          )}

          <div className={`gallery-header ${showInternalTitle ? 'with-title' : 'no-title'}`}>
            <div className="gallery-header-content">
              {totalPages > 0 && (
                <div className="gallery-pagination-container">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    inline={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <CommonPopup
        isOpen={showAddToFolderPopup}
        onClose={() => {
          setShowAddToFolderPopup(false);
        }}
        popupHeight="420"
        title="Add to Folder"
        buttonContent={subFolders.length === 0 ? "Create Folder" : "Add Now"}
        disabled={subFolders.length === 0 ? false : JSON.stringify(folderSelection) === JSON.stringify(initialPopupFolders)}
        onSubmit={() => {
          if (subFolders.length === 0) {
            setPendingAssignImageId(currentImage?._id);

            setShowAddToFolderPopup(false);
            setShowCreateFolderPopup(true);
            return;
          }

          // Normal "Add Now" flow
          if (!currentImage?._id) return;

          const toAdd = folderSelection.filter(id => !initialPopupFolders.includes(id));
          const toRemove = initialPopupFolders.filter(id => !folderSelection.includes(id));

          fetch("https://horaservices.com:3000/api/internal/assign-to-subfolder", {
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
        }}
      >
        <div
          className="add-folder-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {subFolders.length > 0 ? (
            subFolders.filter(sf => sf.type !== "my_photos")
              .map(sf => {
                const isAlreadyAdded = alreadyAssignedFolders.includes(sf._id);
                return (
                  <label key={sf._id} className="folder-checkbox-row">
                    <div className="folder-info">
                      <div className="folder-dp">
                        {sf.folderDp ? (
                          <img src={sf.folderDp.thumbnailUrl} alt={sf.folderName} />
                        ) : (
                          <span>{sf.folderName.charAt(0)}</span>
                        )}
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
              <div className="no-subfolder-text">No subfolder found</div>
              <div className="sub-text-empty">You don’t have any folder yet.</div>
            </div>
          )}
        </div>
      </CommonPopup>

      {!isLogin && isLoginOpen && <OtpLogin setIsModalOpen={setIsLoginOpen} backIconHidden={true} />}

    </div>
  );
};

export default ThumbnailGallery;