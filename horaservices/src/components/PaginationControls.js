// src/components/PaginationControls.js
"use client";
import React from 'react';
// Assuming CSS is imported by ThumbnailGallery or globally

const PaginationControls = ({ currentPage, totalPages, onPageChange, inline = false }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };
  const handlePageClick = (pageNumber) => { onPageChange(pageNumber); };

  const pageNumberButtons = [];
  const pageRangeDisplayed = 1; 

  // Logic for generating pageNumberButtons (same as your previous robust version)
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumberButtons.push(<button key={i} onClick={() => handlePageClick(i)} className={`pagination-number ${currentPage === i ? 'active' : ''}`} aria-current={currentPage === i ? 'page' : undefined} aria-label={`Go to page ${i}`}>{i}</button>);
    }
  } else {
    pageNumberButtons.push(<button key={1} onClick={() => handlePageClick(1)} className={`pagination-number ${currentPage === 1 ? 'active' : ''}`} aria-current={currentPage === 1 ? 'page' : undefined} aria-label="Go to page 1">1</button>);
    if (currentPage > pageRangeDisplayed + 2) { pageNumberButtons.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>); }
    let startPage = Math.max(2, currentPage - pageRangeDisplayed);
    let endPage = Math.min(totalPages - 1, currentPage + pageRangeDisplayed);
    if (currentPage <= pageRangeDisplayed + 1) { endPage = Math.min(totalPages - 1, 1 + (pageRangeDisplayed * 2)); }
    if (currentPage >= totalPages - pageRangeDisplayed) { startPage = Math.max(2, totalPages - (pageRangeDisplayed * 2)); }
    for (let i = startPage; i <= endPage; i++) { pageNumberButtons.push(<button key={i} onClick={() => handlePageClick(i)} className={`pagination-number ${currentPage === i ? 'active' : ''}`} aria-current={currentPage === i ? 'page' : undefined} aria-label={`Go to page ${i}`}>{i}</button>); }
    if (currentPage < totalPages - pageRangeDisplayed - 1) { pageNumberButtons.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>); }
    pageNumberButtons.push(<button key={totalPages} onClick={() => handlePageClick(totalPages)} className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`} aria-current={currentPage === totalPages ? 'page' : undefined} aria-label={`Go to page ${totalPages}`}>{totalPages}</button>);
  }


  return (
    <nav className={`pagination-container ${inline ? 'inline' : ''}`} aria-label="Gallery pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
      <div className="pagination-controls-main">
        <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination-arrow prev" aria-label="Go to previous page">&laquo;</button>
        <div className="pagination-numbers-scrollable">
          {pageNumberButtons}
        </div>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination-arrow next" aria-label="Go to next page">&raquo;</button>
      </div>
    </nav>
  );
};

export default React.memo(PaginationControls);