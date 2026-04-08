// ThumbnailGallery.js
"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Slider from "react-slick";
import Image from 'next/image';

import './gallery.css'; // Ensure this path is correct
import photogallryIcon from '../../assets/gallry-loading.gif'; // Ensure path is correct
import LazyImage from '../../components/LazyImage';            // Ensure path is correct
import PaginationControls from '../../components/PaginationControls'; // Ensure path is correct
import shareIcon from '../../assets/share-photo-icon.png'; // Ensure path is correct
import { BASE_URL } from "@/utils/apiconstants";

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
        const response = await fetch(`${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`);
        if (!response.ok) { const errorData = await response.text(); throw new Error(`API Error: ${response.status} - ${errorData}`); }
        const data = await response.json();
        const fetchedThumbnails = (data.thumbnails || []).map((thumb, index) => ({ ...thumb, stableKey: thumb.id || thumb.uniqueKey || thumb.url || `thumb-gallery-${index}-${Date.now()}` }));
        setAllThumbnails(fetchedThumbnails); setCurrentPage(1);
      } catch (fetchError) {
        console.error("Fetch thumbnails error:", fetchError); setError(fetchError.message);
      } finally { setLoading(false); }
    };
    fetchThumbnails();
  }, [folderName, customerId]);

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

  const handleImageClick = useCallback((indexInDisplayedList) => {
    let originalIndex;
    if (isIOSMobile) {
      originalIndex = (currentPage - 1) * ITEMS_PER_PAGE + indexInDisplayedList;
    } else {
      originalIndex = indexInDisplayedList; // Index is direct from allThumbnails
    }
    
    if (originalIndex >= 0 && originalIndex < allThumbnails.length) {
      setSelectedIndex(originalIndex);
    }
  }, [currentPage, ITEMS_PER_PAGE, allThumbnails.length, isIOSMobile]);

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
    adaptiveHeight: true,
  }), [allThumbnails.length]);

  if (loading) {
    return <div className="thumbnail-gallery-status d-flex justify-content-center"><Image src={photogallryIcon} alt="Loading..." width={100} height={100} priority /></div>;
 }
  if (error) {
    return <div className="thumbnail-gallery-status text-red-500" role="alert">Error: {error}</div>;
  }
  if (allThumbnails.length === 0 && !loading) {
    return <div className="thumbnail-gallery-status">No photos found in this gallery.</div>;
  }

  return (
    <div className="thumbnail-gallery">
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
    

      {currentThumbnailsOnPage.length > 0 ? (
        <div className="masonryGrid">
          {currentThumbnailsOnPage.map((thumbnail, indexOnPage) => (
            <LazyImage
              key={thumbnail._id}
              src={thumbnail.thumbnailImageUrl}
              alt={`Photo ${isIOSMobile ? ((currentPage - 1) * ITEMS_PER_PAGE + indexOnPage + 1) : (indexOnPage + 1)}`}
              wrapperClassName="masonry-item"
              onClick={() => handleImageClick(indexOnPage)}
            />
          ))}
        </div>
      ) : (
        // Show message if on iOS and current page is empty (shouldn't happen with correct totalPages logic)
        // Or if allThumbnails is genuinely empty after loading.
        isIOSMobile && totalPages > 0 && <div className="thumbnail-gallery-status">No photos on this page.</div>
      )}

      {/* Popup/Modal remains the same, using allThumbnails and original selectedIndex */}
      {selectedIndex !== null && allThumbnails[selectedIndex] && (
        <div className="popupOverlay" onClick={closePopup} role="dialog" aria-modal="true" aria-labelledby="popup-title">
          <div className="popupContent" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <span id="popup-title" className="image-index">
                {`${selectedIndex + 1} / ${allThumbnails.length}`}
              </span>
              <button className="closeButton" onClick={closePopup} aria-label="Close image viewer">
                <svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"></path></svg>
              </button>
            </div>
            <Slider
              {...sliderSettings}
              initialSlide={selectedIndex}
              key={`slick-slider-${selectedIndex}-${allThumbnails[selectedIndex]?.stableKey}`}
            >
              {allThumbnails.map((thumb, idx) => (
                <div key={thumb.stableKey || `slide-gallery-${idx}`} className="slick-slide-item">
                  <img
                    src={thumb.originalUrl || thumb.url}
                    alt={`Enlarged photo ${idx + 1}`}
                    className="popupImage"
                  />
                </div>
              ))}
            </Slider>
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
  );
};

export default ThumbnailGallery;