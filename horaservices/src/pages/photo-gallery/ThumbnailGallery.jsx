"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Slider from "react-slick";
import Image from 'next/image';

import './gallery.css';
import photogallryIcon from '../../assets/gallry-loading.gif';
import LazyImage from '../../components/LazyImage';
import PaginationControls from '../../components/PaginationControls';
import { BASE_URL } from "@/utils/apiconstants";

const getImageDimensions = (url) =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload  = () => resolve({ w: img.naturalWidth,  h: img.naturalHeight });
    img.onerror = () => resolve({ w: 4, h: 3 });
    img.src = url;
  });

// ── Justified Layout ──
// cw        = container pixel width (integer)
// targetH   = approximate row height
// gap       = px gap between images
const buildJustifiedRows = (thumbs, cw, targetH, gap) => {
  const rows = [];
  let i = 0;

  while (i < thumbs.length) {
    let j = i;
    let ratioSum = 0;

    // Kitni images ek row mein fit hongi
    while (j < thumbs.length) {
      const r = thumbs[j].w / thumbs[j].h;
      const projected = (ratioSum + r) * targetH + (j - i) * gap;
      if (projected > cw && j > i) break;
      ratioSum += r;
      j++;
    }

    const row     = thumbs.slice(i, j);
    const gaps    = (row.length - 1) * gap;
    const total_r = row.reduce((s, t) => s + t.w / t.h, 0);
    // Exact height so row fills cw perfectly
    const rowH    = Math.floor((cw - gaps) / total_r);

    let used = 0;
    const sized = row.map((t, idx) => {
      const isLast = idx === row.length - 1;
      const w = isLast
        ? cw - gaps - used          // remaining pixels → no gap on right
        : Math.floor((t.w / t.h) * rowH);
      if (!isLast) used += w;
      return { ...t, displayW: w, displayH: rowH };
    });

    rows.push(sized);
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
  const [allThumbnails,  setAllThumbnails]  = useState([]);

  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [selectedIndex,  setSelectedIndex]  = useState(null);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [isIOSMobile,    setIsIOSMobile]    = useState(false);
  const [cw,             setCw]             = useState(320); // default 320, update hoga measure se
  const galleryRef = useRef(null);

  // ── Container width — actual rendered px ──
  useEffect(() => {
    const measure = () => {
      // ✅ clientWidth = scrollbar exclude, actual content area
      const screenW = document.documentElement.clientWidth;
      const w = Math.min(screenW, 480);
      setCw(w);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined')
      setIsIOSMobile(/iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
  }, []);

  const getItemsPerPage = useCallback(() => {
    if (typeof window === 'undefined') return 12;
    if (isIOSMobile) return window.innerWidth >= 400 ? 15 : 9;
    return window.innerWidth >= 768 ? 36 : 24;
  }, [isIOSMobile]);

  const [ITEMS_PER_PAGE, setItemsPerPage] = useState(getItemsPerPage());
  useEffect(() => {
    const fn = () => setItemsPerPage(getItemsPerPage());
    if (isIOSMobile) { window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }
  }, [isIOSMobile, getItemsPerPage]);

  // ── Fetch thumbnails ──
  useEffect(() => {
    const fetch_ = async () => {
      if (!folderName || !customerId) {
        setAllThumbnails([]); setLoading(false);
        setError("Folder name or customer ID missing."); return;
      }
      setLoading(true); setError(null);
      try {
        const res  = await fetch(`${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();

        // Step 1 — default 4:3 se fast render
        const basic = (data.thumbnails || []).map((t, i) => ({
          ...t,
          w: 4, h: 3,
          stableKey: t.id || t.uniqueKey || t.url || `t-${i}`,
        }));
        setAllThumbnails(basic);
        setCurrentPage(1);
        setLoading(false);

        // Step 2 — actual dims background mein load karo
        const withDims = await Promise.all(
          basic.map(async (t) => {
            const { w, h } = await getImageDimensions(t.thumbnailImageUrl);
            return { ...t, w, h };
          })
        );
        setAllThumbnails(withDims);
      } catch (e) {
        console.error(e); setError(e.message); setLoading(false);
      }
    };
    fetch_();
  }, [folderName, customerId]);

  const { currentThumbnailsOnPage, totalPages } = useMemo(() => {
    if (isIOSMobile) {
      const total = Math.ceil(allThumbnails.length / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return { currentThumbnailsOnPage: allThumbnails.slice(start, start + ITEMS_PER_PAGE), totalPages: total };
    }
    return { currentThumbnailsOnPage: allThumbnails, totalPages: 1 };
  }, [allThumbnails, currentPage, ITEMS_PER_PAGE, isIOSMobile]);

  const handleImageClick = useCallback((i) => {
    if (i >= 0 && i < allThumbnails.length) setSelectedIndex(i);
  }, [allThumbnails.length]);

  const closePopup = useCallback(() => setSelectedIndex(null), []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setTimeout(() => {
      const el = document.querySelector('.gallery-header');
      (el ? el.scrollIntoView({ behavior:'smooth', block:'start' }) : window.scrollTo({ top:0, behavior:'smooth' }));
    }, 100);
  }, []);

  const sliderSettings = useMemo(() => ({
    dots: false, infinite: allThumbnails.length > 1,
    speed: 300, slidesToShow: 1, slidesToScroll: 1,
    lazyLoad: 'ondemand', adaptiveHeight: true,
  }), [allThumbnails.length]);

  // ── Grid render ──
  const renderGallery = () => {
    // ✅ galleryRef ki actual width lo — ye sabse accurate hai
    const actualW = galleryRef.current
      ? Math.floor(galleryRef.current.getBoundingClientRect().width)
      : cw;
    const effectiveCw = actualW > 0 ? Math.min(actualW, 480) : cw;
    if (!effectiveCw || effectiveCw < 10) return null;

    const gap = 3;

    // ✅ targetRowHeight — 320-480px ke liye tuned
    // Chhota value = zyada images per row (cramped)
    // Bada value = kam images per row (spacious)
    let targetH;
    if      (effectiveCw <= 360) targetH = 120;
    else if (effectiveCw <= 480) targetH = 140;
    else if (effectiveCw <= 768) targetH = 170;
    else                         targetH = 210;

    const allRows = buildJustifiedRows(currentThumbnailsOnPage, effectiveCw, targetH, gap);

    const result = [];
    let bannerIdx  = 0;
    let imgCount   = 0;

   allRows.forEach((rowItems, rIdx) => {

  // Row render
  result.push(
    <div key={`r-${rIdx}`} style={{ display: 'flex', gap: `${gap}px`, marginBottom: `${gap}px`, width: `${effectiveCw}px`, overflow: 'hidden' }}>
      {rowItems.map((thumb) => {
        const gi = allThumbnails.findIndex(t => t.stableKey === thumb.stableKey);
        return (
          <div key={thumb.stableKey} onClick={() => handleImageClick(gi)}
            style={{ width: `${thumb.displayW}px`, height: `${thumb.displayH}px`, flexShrink: 0, overflow: 'hidden', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#e9ecef', position: 'relative' }}>
            <LazyImage src={thumb.thumbnailImageUrl} alt={`Photo ${gi + 1}`} wrapperClassName="smart-image-wrapper" />
          </div>
        );
      })}
    </div>
  );

  // Count update
  imgCount += rowItems.length;

  // Banner check
  if (imgCount >= bannerInterval * (bannerIdx + 1) && banners[bannerIdx]) {
    result.push(
      <div key={`b-${bannerIdx}`} style={{ width: `${effectiveCw}px`, marginBottom: `${gap}px` }}>
        {banners[bannerIdx]}
      </div>
    );
    bannerIdx++;
  }

}); // ✅ forEach yahan khatam

// ✅ while loop BAHAR — forEach ke baad
while (bannerIdx < banners.length) {
  result.push(
    <div key={`b-end-${bannerIdx}`} style={{ width: `${effectiveCw}px`, marginBottom: `${gap}px` }}>
      {banners[bannerIdx]}
    </div>
  );
  bannerIdx++;
}

return result;
  };

  if (loading) return (
    <div className="thumbnail-gallery-status d-flex justify-content-center">
      <Image src={photogallryIcon} alt="Loading..." width={100} height={100} priority />
    </div>
  );
  if (error)                           return <div className="thumbnail-gallery-status text-red-500">Error: {error}</div>;
  if (!loading && !allThumbnails.length) return <div className="thumbnail-gallery-status">No photos found.</div>;

  return (
    <div
      ref={galleryRef}
      style={{ width: '100%', overflow: 'hidden', boxSizing: 'border-box', display: 'block' }}
    >
      {/* Top pagination iOS */}
      {isIOSMobile && totalPages > 1 && (
        <div className="gallery-pagination-container" style={{ padding: '8px' }}>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} inline />
        </div>
      )}

      {/* Grid */}
      {currentThumbnailsOnPage.length > 0 ? renderGallery() : null}

      {/* Popup */}
      {selectedIndex !== null && allThumbnails[selectedIndex] && (
        <div className="popupOverlay" onClick={closePopup} role="dialog" aria-modal="true">
          <div className="popupContent" onClick={e => e.stopPropagation()}>
            <div className="popupHeader">
              <span className="image-index">{selectedIndex + 1} / {allThumbnails.length}</span>
              <button className="closeButton" onClick={closePopup} aria-label="Close">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                </svg>
              </button>
            </div>
            <Slider {...sliderSettings} initialSlide={selectedIndex} key={`sl-${selectedIndex}`}>
              {allThumbnails.map((t, i) => (
                <div key={t.stableKey || i}>
                  <img src={t.originalUrl || t.url} alt={`Photo ${i+1}`} className="popupImage" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="gallery-header">
          <div className="gallery-header-content">
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} inline />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGallery;