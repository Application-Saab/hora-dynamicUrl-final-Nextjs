"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Slider from "react-slick";
import Image from 'next/image';

import './gallery.css';
import photogallryIcon from '../../assets/gallry-loading.gif';
import LazyImage from '../../components/LazyImage';
import PaginationControls from '../../components/PaginationControls';
import shareIcon from '../../assets/share-photo-icon.png';
import { BASE_URL } from "@/utils/apiconstants";

// ── Step 1: Ek image ka naturalWidth/Height fetch karo ──
const getImageDimensions = (url) =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 4, h: 3 }); // fallback landscape
    img.src = url;
  });

// ── Step 2: Justified Layout Algorithm ──
// Yeh function images ki list leta hai aur unhe rows mein pack karta hai
// Har row ki height aise set hoti hai ki row poori containerWidth fill kare
const buildJustifiedRows = (thumbnails, containerWidth, targetRowHeight = 150, gap = 4) => {
  const rows = [];
  let i = 0;

  while (i < thumbnails.length) {
    let j = i;
    let rowRatioSum = 0;

    while (j < thumbnails.length) {
      const ratio = (thumbnails[j].w || 4) / (thumbnails[j].h || 3);
      const gapsWidth = (j - i) * gap;
      const projectedWidth = (rowRatioSum + ratio) * targetRowHeight + gapsWidth;
      if (projectedWidth > containerWidth && j > i) break;
      rowRatioSum += ratio;
      j++;
    }

    const rowThumbs = thumbnails.slice(i, j);
    const totalGap = (rowThumbs.length - 1) * gap;
    const totalRatio = rowThumbs.reduce((sum, t) => sum + (t.w || 4) / (t.h || 3), 0);

    // ✅ Last row ko bhi full width fill karao — cap mat lagao
    const rowH = (containerWidth - totalGap) / totalRatio;

    rows.push(
      rowThumbs.map((thumb) => ({
        ...thumb,
        displayW: ((thumb.w || 4) / (thumb.h || 3)) * rowH,
        displayH: rowH,
      }))
    );

    i = j;
  }

  return rows;
};

const ThumbnailGallery = ({
  folderName,
  customerId,
  showInternalTitle = true,
  handleShareicon,
  banners = [],
  bannerInterval = 6,
}) => {
  const [allThumbnails, setAllThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isIOSMobile, setIsIOSMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(390);
  const galleryRef = useRef(null);

  // ── Container ki actual width track karo (resize pe bhi) ──
  useEffect(() => {
    const updateWidth = () => {
      if (galleryRef.current) {
        setContainerWidth(galleryRef.current.offsetWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    if (galleryRef.current) ro.observe(galleryRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const detectIOSMobile = () => {
      if (typeof navigator !== 'undefined') {
        return /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      }
      return false;
    };
    setIsIOSMobile(detectIOSMobile());
  }, []);

  const getItemsPerPage = useCallback(() => {
    if (typeof window === 'undefined') return 12;
    if (isIOSMobile) return window.innerWidth >= 400 ? 15 : 9;
    return window.innerWidth >= 768 ? 36 : 24;
  }, [isIOSMobile]);

  const [ITEMS_PER_PAGE, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    if (isIOSMobile) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isIOSMobile, getItemsPerPage]);

  // ── Step 3: Fetch thumbnails + background mein dimensions load karo ──
  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!folderName || !customerId) {
        setAllThumbnails([]);
        setLoading(false);
        setError("Folder name or customer ID is missing.");
        setCurrentPage(1);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`
        );
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorData}`);
        }
        const data = await response.json();

        // Pehle default ratio ke saath fast render karo
        const basicThumbnails = (data.thumbnails || []).map((thumb, index) => ({
          ...thumb,
          w: 4, h: 3, // default landscape ratio
          stableKey: thumb.id || thumb.uniqueKey || thumb.url || `thumb-gallery-${index}-${Date.now()}`,
        }));
        setAllThumbnails(basicThumbnails);
        setCurrentPage(1);
        setLoading(false);

        // Background mein actual dimensions fetch karo — ek ek karke
        // setAllThumbnails update hoti rahegi jaise jaise dimensions aati hain
        const withDimensions = await Promise.all(
          basicThumbnails.map(async (thumb) => {
            const { w, h } = await getImageDimensions(thumb.thumbnailImageUrl);
            return { ...thumb, w, h };
          })
        );
        setAllThumbnails(withDimensions);

      } catch (fetchError) {
        console.error("Fetch thumbnails error:", fetchError);
        setError(fetchError.message);
        setLoading(false);
      }
    };
    fetchThumbnails();
  }, [folderName, customerId]);

  const { currentThumbnailsOnPage, totalPages } = useMemo(() => {
    if (isIOSMobile) {
      const total = Math.ceil(allThumbnails.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return {
        currentThumbnailsOnPage: allThumbnails.slice(startIndex, endIndex),
        totalPages: total,
      };
    }
    return { currentThumbnailsOnPage: allThumbnails, totalPages: 1 };
  }, [allThumbnails, currentPage, ITEMS_PER_PAGE, isIOSMobile]);

  const handleImageClick = useCallback((globalIndex) => {
    if (globalIndex >= 0 && globalIndex < allThumbnails.length) {
      setSelectedIndex(globalIndex);
    }
  }, [allThumbnails.length]);

  const closePopup = useCallback(() => setSelectedIndex(null), []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
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

  // ── Step 4: Justified rows render karo ──
  const renderChunkedGallery = () => {
    const result = [];
    const total = currentThumbnailsOnPage.length;

    // Mobile pe chhoti row height, desktop pe badi
    const targetRowHeight = containerWidth < 500 ? 120 : 180;

    for (let chunkStart = 0; chunkStart < total; chunkStart += bannerInterval) {
      const chunkEnd = Math.min(chunkStart + bannerInterval, total);
      const chunk = currentThumbnailsOnPage.slice(chunkStart, chunkEnd);
      const chunkIndex = Math.floor(chunkStart / bannerInterval);

      // Iss chunk ke liye justified rows banao
      const rows = buildJustifiedRows(chunk, containerWidth, targetRowHeight, 4);

      result.push(
        <div key={`grid-${chunkIndex}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {rows.map((rowItems, rIdx) => (
  <div
    key={`row-${chunkIndex}-${rIdx}`}
    style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
  >
 {rowItems.map((thumbnail, itemIdx) => {
  const globalIndex = allThumbnails.findIndex(
    (t) => t.stableKey === thumbnail.stableKey
  );
  const isLast = itemIdx === rowItems.length - 1;
  return (
    <div
      key={thumbnail.stableKey}
      style={{
        flex: isLast ? '1 1 auto' : `0 0 ${Math.floor(thumbnail.displayW)}px`,
        height: `${Math.floor(thumbnail.displayH)}px`,
        overflow: 'hidden',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#e9ecef',
      }}
      onClick={() => handleImageClick(globalIndex)}
    >
      <LazyImage
        src={thumbnail.thumbnailImageUrl}
        alt={`Photo ${globalIndex + 1}`}
        wrapperClassName="smart-image-wrapper"
      />
    </div>
  );
})}
  </div>
))}
        </div>
      );

      const isLastChunk = chunkEnd >= total;
      if (!isLastChunk && banners[chunkIndex]) {
        result.push(
          <div key={`banner-${chunkIndex}`} style={{ width: '100%' }}>
            {banners[chunkIndex]}
          </div>
        );
      }
    }
    return result;
  };

  if (loading) {
    return (
      <div className="thumbnail-gallery-status d-flex justify-content-center">
        <Image src={photogallryIcon} alt="Loading..." width={100} height={100} priority />
      </div>
    );
  }
  if (error) {
    return <div className="thumbnail-gallery-status text-red-500" role="alert">Error: {error}</div>;
  }
  if (allThumbnails.length === 0 && !loading) {
    return <div className="thumbnail-gallery-status">No photos found in this gallery.</div>;
  }

  return (
    <div className="thumbnail-gallery" ref={galleryRef}>
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
        {isIOSMobile && totalPages > 1 && (
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

      {currentThumbnailsOnPage.length > 0
        ? renderChunkedGallery()
        : isIOSMobile && totalPages > 0 && (
            <div className="thumbnail-gallery-status">No photos on this page.</div>
          )
      }

      {selectedIndex !== null && allThumbnails[selectedIndex] && (
        <div className="popupOverlay" onClick={closePopup} role="dialog" aria-modal="true" aria-labelledby="popup-title">
          <div className="popupContent" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <span id="popup-title" className="image-index">
                {`${selectedIndex + 1} / ${allThumbnails.length}`}
              </span>
              <button className="closeButton" onClick={closePopup} aria-label="Close image viewer">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
                </svg>
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
          {showInternalTitle && <div className="gallery-title-container"></div>}
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