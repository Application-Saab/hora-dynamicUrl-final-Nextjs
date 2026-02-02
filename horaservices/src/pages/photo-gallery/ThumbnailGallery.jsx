// ThumbnailGallery.js
"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Slider from "react-slick";
import Image from 'next/image';

import './gallery.css'; // Ensure this path is correct
import photogallryIcon from '../../assets/gallry-loading.gif'; // Ensure path is correct
import LazyImage from '../../components/LazyImage';            // Ensure path is correct
import PaginationControls from '../../components/PaginationControls'; // Ensure path is correct
import shareIcon from '../../assets/share-photo-icon.png'; // Ensure path is correct
import EventwallGalleryItem from "@/components/wonderland/event-wall/EventwallGalleryItem";
import HeaderCards from "@/components/Gallery/HeaderCards";
import OtpLogin from "@/components/OtpLoginPopup";
import ArrowImg from '../../assets/arrow.svg'
import download from '../../assets/download.svg'
import deleteIcon from '../../assets/deleteIcon.svg'
import nextIcon from '../../assets/nextIcon.svg'
import shareIcon2 from '../../assets/shareIcon.svg'


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
  const [phoneNo, setPhoneNo] = useState('')
  const [subFolders, setSubFolders] = useState([]);
  const [activeSubFolderId, setActiveSubFolderId] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [initialSubfolderImages, setInitialSubfolderImages] = useState([]);
  const addMoreImagesRef = useRef(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);


  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (loggedIn === "true") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      setIsLoginOpen(true);
    }

    setAuthChecked(true); // ✅ auth check complete
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



  const visibleThumbnails = useMemo(() => {
    // All tab
    if (!activeSubFolderId) return allThumbnails;

    // Edit mode → ALL images dikhengi
    if (isEditing) return allThumbnails;

    // Normal view → sirf subfolder images
    return allThumbnails.filter(
      img => img.folderIds?.includes(activeSubFolderId)
    );
  }, [allThumbnails, activeSubFolderId, isEditing]);


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

      if (ids.length === 0) {
        setIsEditing(true);
      }

      setSelectedImages(ids);          // current checked
      setInitialSubfolderImages(ids);  // original state
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
        setPhoneNo(data.thumbnails?.[0]?.phoneNo || "")
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
    setIsEditing(true);
    setSelectedImages([]);          // empty selection
    setInitialSubfolderImages([]);  // mark as new folder
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
    },
  }), [allThumbnails.length]);


  const handleSearchResults = (match) => {
    setAllThumbnails((prev) =>
      prev.map((thumb) =>
        thumb.key === match.key
          ? { ...thumb, faceId: match.faceId }
          : thumb
      )
    )
  }
  const hasChanges = useMemo(() => {
    if (!activeSubFolderId) return false;

    // compare current vs initial
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
        // ADD
        if (toAdd.includes(img._id)) {
          return {
            ...img,
            folderIds: [...(img.folderIds || []), activeSubFolderId],
          };
        }

        // REMOVE
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



  function getBlockType(index) {
    const pos = index % 6;

    if (pos === 0 || pos === 1 || pos === 2) return "small";
    if (pos === 3) return "big";
    if (pos === 4) return "small-right-top";
    if (pos === 5) return "small-right-bottom";
  }

  if (loading) {
    return <div className="thumbnail-gallery-status d-flex justify-content-center"><Image src={photogallryIcon} alt="Loading..." width={100} height={100} priority /></div>;
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
      {!isLogin && isLoginOpen ? (
        <OtpLogin
          setIsModalOpen={setIsLoginOpen}
          backIconHidden={true}
        />
      ) : (
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

          <HeaderCards
            folderName={folderName}
            customerId={customerId}
            setIsSearching={setIsSearching}
            onSearchResults={handleSearchResults}
            phoneNo={phoneNo}
            subFolders={subFolders}
            onSelectSubFolder={(id) => {
              setActiveSubFolderId(id);
              setSelectedImages([]); // reset selection
              setIsEditing(false)
            }}
            onSubFolderCreated={handleSubFolderCreated}
            onNewFolderActivate={activateNewSubFolderEditMode}
          />

          <div style={{ paddingInline: "7px", display: "flex", gap: "10px" }}>
            {activeSubFolderId && !isEditing && (
              <button
                className="edit-image-btn"
                onClick={() => setIsEditing(true)}
              >
                <span className="edit-plus">+</span>
                <span>Edit</span>
              </button>
            )}

            {activeSubFolderId && isEditing && (
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


            {!activeSubFolderId && (
              <button
                className="add-new-btn"
                onClick={() => addMoreImagesRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "500",
                    lineHeight: "1",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: '4px',
                  }}
                >
                  +
                </span>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Add New Images
                </span>
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

              console.log("Selected images:", files);

              try {
                const formData = new FormData();

                files.forEach((file) => {
                  formData.append("images", file);
                });

                // extra fields (agar chahiye)
                formData.append("folderName", folderName);
                formData.append("customerId", customerId);
                formData.append("phoneNo", phoneNo);


                const res = await fetch(
                  "http://localhost:4000/upload-multiple",
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
                console.log("Upload success:", data);

                if (data?.images?.length) {
                  const newThumbnails = data.images.map((img, index) => ({
                    _id: img.imageId,
                    type: "image",
                    originalUrl: img.imageUrl,
                    thumbnailImageUrl: img.thumbnailUrl,
                    folderIds: [], // 👈 newly uploaded → not in any subfolder
                    stableKey: `new-upload-${img.imageId}-${Date.now()}-${index}`,
                  }));

                  setAllThumbnails(prev => [...newThumbnails, ...prev]);
                }

                setIsEditing(false);



              } catch (err) {
                console.error("Upload failed:", err);
                alert("Image upload failed");
              } finally {
                // same file dobara select ho sake
                e.target.value = "";
              }
            }}
          />





          {/* Show Searching text */}
          {isSearching ?
            <div style={{ color: '#534E4E' }}>Searching photos...</div>
            :
            <div style={{ paddingInline: '7px' }}>
              {visibleThumbnails.length > 0 ? (
                <div style={{ position: "relative", marginTop: "auto" }}>
                  <div style={{ margin: "10px auto" }}>
                    <div className="event-image-grid">
                      {visibleThumbnails.map((thumbnail, indexOnPage) => {
                        const type = getBlockType(indexOnPage);
                        const isVideo = thumbnail.type === "video" || (thumbnail.url?.match(/\.(mp4|mov|avi|mkv)$/i));
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
                                handleImageClick(indexOnPage);
                            }}
                          >
                            <div className="image-wrapper" style={{ position: 'relative' }}>
                              {isEditing && activeSubFolderId && (
                                <input
                                  type="checkbox"
                                  className="image-checkbox"
                                  checked={selectedImages.includes(thumbnail._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedImages(prev => [...prev, thumbnail._id]);
                                    } else {
                                      setSelectedImages(prev =>
                                        prev.filter(id => id !== thumbnail._id)
                                      );
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()} // prevent popup
                                />
                              )}

                              <EventwallGalleryItem
                                isVideo={thumbnail.type === "video"}
                                indexOnPage={indexOnPage}
                                id={thumbnail._id}

                                // IMAGE
                                imageUrl={
                                  thumbnail.type === "image"
                                    ? (thumbnail.thumbnailImageUrl || thumbnail.originalUrl)
                                    : null
                                }

                                // VIDEO
                                previewSrc={
                                  thumbnail.type === "video"
                                    ? thumbnail.videoClipUrl
                                    : null
                                }

                                fullVideoSrc={
                                  thumbnail.type === "video"
                                    ? thumbnail.originalUrl
                                    : null
                                }
                              />

                            </div>
                          </div>

                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Show message if on iOS and current page is empty (shouldn't happen with correct totalPages logic)
                // Or if allThumbnails is genuinely empty after loading.
                isIOSMobile && totalPages > 0 && <div className="thumbnail-gallery-status">No photos on this page.</div>
              )}

              {/* Popup/Modal remains the same, using allThumbnails and original selectedIndex */}
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
                          <Image
                            src={shareIcon2}
                            alt="Share"
                            className="gallery-share-icon"
                            onClick={handleShareicon}
                            width={22}
                            height={22}
                          />
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
                    <div className="popup-footer">
                      <div
                        onClick={() => {
                          const current = allThumbnails[selectedIndex];
                          if (!current?.originalUrl) return;

                          downloadFile(
                            current.originalUrl,
                            `hora_file_${selectedIndex + 1}`
                          );
                        }}
                      >
                        <Image src={download} alt="Download" width={20} height={20} />
                      </div>

                      <div>
                        <button className="popup-addbtn">+ Add to</button>
                      </div>
                      <div>
                        <Image
                          src={deleteIcon}
                          alt="Back"
                          width={20}
                          height={20}
                          className=""
                          onClick={async () => {
                            const currentImage = allThumbnails[selectedIndex];
                            if (!currentImage?._id) return;

                            // Confirm deletion (optional)
                            if (!window.confirm("Are you sure you want to delete this image?")) return;

                            try {
                              // Call your API to delete the image
                              const res = await fetch(`http://localhost:4000/delete-image/${currentImage._id}`, {
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

                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className={`gallery-header ${showInternalTitle ? 'with-title' : 'no-title'}`}>
                <div className="gallery-header-content">
                  {showInternalTitle && (
                    <div className="gallery-title-container">
                      {/* <h1 className="gallery-title">Your Photos</h1> */}
                      {/* <Image
          src={shareIcon}
          alt="Info"
          style={{ height: 20, width: 20, marginLeft: 10, cursor: 'pointer' }}
          onClick={handleShareicon}
        /> */}
                    </div>
                  )}

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
          }
        </div>
      )
      }


    </div>
  );
};

export default ThumbnailGallery;