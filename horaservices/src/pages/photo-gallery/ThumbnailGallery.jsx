// ThumbnailGallery.js
"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Slider from "react-slick";
import Image from 'next/image';

import './gallery.css';
import photogallryIcon from '../../assets/gallry-loading.gif';
import LazyImage from '../../components/LazyImage';
import PaginationControls from '../../components/PaginationControls';
import shareIcon from '../../assets/share-photo-icon.png'
// import './pagination.css';

// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

const ITEMS_PER_PAGE = 24; // Increased from 12 for more items per page

const ThumbnailGallery = ({ folderName, customerId, showInternalTitle = true, handleShareicon }) => { // Prop to control internal title
  const [allThumbnails, setAllThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Debugging: Log when selectedIndex changes
    // console.log("[State Update] selectedIndex:", selectedIndex);
  }, [selectedIndex]);

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
        const fetchedThumbnails = (data.thumbnails || []).map((thumb, index) => ({ ...thumb, stableKey: thumb.id || thumb.uniqueKey || thumb.url || `thumb-gallery-${index}-${Date.now()}` }));
        setAllThumbnails(fetchedThumbnails); setCurrentPage(1);
      } catch (fetchError) {
        console.error("Fetch thumbnails error:", fetchError); setError(fetchError.message);
      } finally { setLoading(false); }
    };
    fetchThumbnails();
  }, [folderName, customerId]);

  const { currentThumbnailsOnPage, totalPages } = useMemo(() => {
    const total = Math.ceil(allThumbnails.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = allThumbnails.slice(startIndex, endIndex);
    return { currentThumbnailsOnPage: currentItems, totalPages: total };
  }, [allThumbnails, currentPage]);

  const handleImageClick = useCallback((indexOnPage) => {
    const originalIndex = (currentPage - 1) * ITEMS_PER_PAGE + indexOnPage;
    // console.log(`[Image Click] indexOnPage=${indexOnPage}, currentPage=${currentPage}, originalIndex=${originalIndex}`);
    if (originalIndex >= 0 && originalIndex < allThumbnails.length) {
      setSelectedIndex(originalIndex);
    } else {
      // console.warn("[Image Click] Calculated originalIndex is out of bounds:", originalIndex);
    }
  }, [currentPage, allThumbnails.length]);

  const closePopup = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    const galleryHeader = document.querySelector('.gallery-header'); // Try to scroll to header
    if (galleryHeader) {
      galleryHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    return <div className="thumbnail-gallery-status"><Image src={photogallryIcon} alt="Loading..." width={70} height={70} priority /></div>;
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
  <div className="gallery-header-content">
    {showInternalTitle && (
      <div className="gallery-title-container">
        <h1 className="gallery-title">Your Photos</h1>
        <Image
          src={shareIcon}
          alt="Info"
          style={{ height: 20, width: 20, marginLeft: 10, cursor: 'pointer' }}
          onClick={handleShareicon}
        />
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

      {currentThumbnailsOnPage.length > 0 ? (
        <div className="masonryGrid">
          {currentThumbnailsOnPage.map((thumbnail, indexOnPage) => (
            <LazyImage
              key={thumbnail.stableKey}
              src={thumbnail.url}
              alt={`Photo ${(currentPage - 1) * ITEMS_PER_PAGE + indexOnPage + 1}`}
              wrapperClassName="masonry-item"
              onClick={() => handleImageClick(indexOnPage)}
            />
          ))}
        </div>
      ) : (
        totalPages > 0 && <div className="thumbnail-gallery-status">No photos on this page.</div>
      )}

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
          {totalPages > 0 && (
      <div className="gallery-pagination-container m-3">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          inline={true}
        />
      </div>
    )}
    </div>
  );
};

export default ThumbnailGallery;