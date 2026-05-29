import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationUI({
  currentPage,
  setCurrentPage,
  totalPages,
}) {

  const pagesPerView = 5;

  const startPage =
    Math.floor((currentPage - 1) / pagesPerView) * pagesPerView + 1;

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
    if (startPage + pagesPerView <= totalPages) {
      setCurrentPage(startPage + pagesPerView);
    }
  };

  const handlePrev = () => {
    if (startPage > 1) {
      setCurrentPage(Math.max(1, startPage - pagesPerView));
    }
  };

  return (
    <div
      style={{
        // maxWidth: "425px",
        margin: "0 auto",
        paddingLeft: "max(12px, calc((100vw - 320px) * 0.08))",
        paddingRight: "max(12px, calc((100vw - 320px) * 0.08))",
        paddingBottom: "10px",
        boxSizing: "border-box",
        // width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          border: "1px solid #0000000D",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          borderRadius: "999px",
          padding: "8px 10px",
          boxSizing: "border-box",
          gap: "14px",
          overflow: "hidden",
        }}
      >
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={startPage === 1}
          style={{
            width: "28px",
            height: "28px",
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: startPage === 1 ? "not-allowed" : "pointer",
            flexShrink: 0,
            opacity: startPage === 1 ? 0.4 : 1,
          }}
        >
          <ChevronLeft
            size={24}
            strokeWidth={2.5}
            color="black"
          />
        </button>

        {/* Numbers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                width: "31.62px",
                height: "31.62px",
                minWidth: "31.62px",
                minHeight: "31.62px",
                borderRadius: "50%",
                border:
                  currentPage === page
                    ? "1px solid #9b4f92"
                    : "1px solid #0000001F",
                background:
                  currentPage === page
                    ? "#9b4f92"
                    : "#ffffff",
                color:
                  currentPage === page
                    ? "#ffffff"
                    : "#3A415C",
                fontSize: "15.18px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "0.2s",
                padding: 0,
                flexShrink: 0,
              }}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={startPage + pagesPerView > totalPages}
          style={{
            width: "28px",
            height: "28px",
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:
              startPage + pagesPerView > totalPages
                ? "not-allowed"
                : "pointer",
            flexShrink: 0,
            opacity:
              startPage + pagesPerView > totalPages
                ? 0.4
                : 1,
          }}
        >
          <ChevronRight
            size={24}
            strokeWidth={2.5}
            color="black"
          />
        </button>
      </div>
    </div>
  );
}