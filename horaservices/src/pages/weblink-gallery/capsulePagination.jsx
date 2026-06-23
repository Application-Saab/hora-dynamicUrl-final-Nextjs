import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pagesPerView = 5;

  const startPage =
    Math.floor((currentPage - 1) / pagesPerView) *
      pagesPerView +
    1;

  const visiblePages = Array.from(
    {
      length: Math.min(
        pagesPerView,
        totalPages - startPage + 1
      ),
    },
    (_, i) => startPage + i
  );

const handleNext = () => {
  if (currentPage < totalPages) {
    onPageChange(currentPage + 1);
  }
};

const handlePrev = () => {
  if (currentPage > 1) {
    onPageChange(currentPage - 1);
  }
};

  return (
    <div
       style={{
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "10px 0px",
  }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          border: "1px solid #0000000D",
          boxShadow: "0 4px 16px rgba(0,0,0,.06)",
          borderRadius: "999px",
          padding: "8px 10px",
          gap: "14px",
          width: "fit-content",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={{
            border: "none",
            background: "transparent",
            opacity: currentPage === 1 ? 0.4 : 1,
            cursor:
              currentPage === 1
                ? "not-allowed"
                : "pointer",
          }}
        >
          <ChevronLeft color="#000" size={24} />
        </button>

        <div
          style={{
            display: "flex",
            gap: "9px",
            alignItems: "center",
          }}
        >
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border:
                  currentPage === page
                    ? "1px solid #9b4f92"
                    : "1px solid #0000001F",
                background:
                  currentPage === page
                    ? "#9b4f92"
                    : "#fff",
                color:
                  currentPage === page
                    ? "#fff"
                    : "#3A415C",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{
            border: "none",
            background: "transparent",
            opacity:
              currentPage === totalPages
                ? 0.4
                : 1,
            cursor:
              currentPage === totalPages
                ? "not-allowed"
                : "pointer",
          }}
        >
          <ChevronRight color="#000" size={24} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PaginationControls);