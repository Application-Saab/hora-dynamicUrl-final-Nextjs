// src/components/PaginationControls.js
"use client";
import React from 'react';
import './pagination.css'; // Assuming CSS is imported by ThumbnailGallery or globally
import flowerImg from '@/assets/flower.png';         // 👈 apne actual asset path se adjust kar lena
import sparkleImg from '@/assets/sparkle-group.svg'; // 👈 apne actual asset path se adjust kar lena

const WINDOW_SIZE = 5; // Figma reference: hamesha 5 numbers ek saath dikhte hain

const PaginationControls = ({ currentPage, totalPages, onPageChange, inline = false }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };
  const handlePageClick = (pageNumber) => { onPageChange(pageNumber); };

  // ── Sliding window of WINDOW_SIZE consecutive numbers, no ellipsis, no jump-to-last ──
  const windowSize = Math.min(WINDOW_SIZE, totalPages);
  let startPage = currentPage - Math.floor(windowSize / 2);
  startPage = Math.max(1, startPage);
  startPage = Math.min(startPage, totalPages - windowSize + 1);
  const endPage = startPage + windowSize - 1;

  const pageNumberButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumberButtons.push(
      <button
        key={i}
        onClick={() => handlePageClick(i)}
        className={`pagination-number ${currentPage === i ? 'active' : ''}`}
        aria-current={currentPage === i ? 'page' : undefined}
        aria-label={`Go to page ${i}`}
      >
        {i}
      </button>
    );
  }

  const flowerSrc  = flowerImg.src  || flowerImg;
  const sparkleSrc = sparkleImg.src || sparkleImg;

  return (
    <nav className={`pagination-container ${inline ? 'inline' : ''}`} aria-label="Gallery pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
      <div className="pagination-controls-main">
        {/* Prev arrow with flower image + sparkle asset */}
        <div className="pagination-nav-wrap prev-wrap">
          <img src={sparkleSrc} alt="" className="sparkle-img sparkle-left" aria-hidden="true" />
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="pagination-arrow prev"
            aria-label="Go to previous page"
          >
            <img src={flowerSrc} alt="" className="pagination-flower-img" aria-hidden="true" />
            <span className="arrow-glyph">&lsaquo;</span>
          </button>
        </div>

        <div className="pagination-numbers-scrollable">
          {pageNumberButtons}
        </div>

        {/* Next arrow with flower image + sparkle asset */}
        <div className="pagination-nav-wrap next-wrap">
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="pagination-arrow next"
            aria-label="Go to next page"
          >
            <img src={flowerSrc} alt="" className="pagination-flower-img" aria-hidden="true" />
            <span className="arrow-glyph">&rsaquo;</span>
          </button>
          <img src={sparkleSrc} alt="" className="sparkle-img sparkle-right" aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
};

export default React.memo(PaginationControls);