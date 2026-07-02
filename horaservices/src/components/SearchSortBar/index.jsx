"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import "./SearchSortBar.css";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";

const sortOptions = [
  { id: "popularity", label: "Popularity" },
  { id: "newArrival", label: "New Arrival" },
  { id: "lowToHigh", label: "Price: Low To High" },
  { id: "highToLow", label: "Price: High To Low" },
];

function SortSheet({ isOpen, onClose, sortOption, onSelect }) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div className={`sort-overlay ${isOpen ? "sort-overlay-open" : ""}`} onClick={onClose}>
      <div className="sort-sheet-container">
        {isOpen && (
          <button
            type="button"
            className="sort-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="Close sort options"
          >
            <X size={22} strokeWidth={2.25} />
          </button>
        )}
        <div className={`sort-sheet ${isOpen ? "sort-sheet-open" : ""}`} onClick={(e) => e.stopPropagation()}>
          <h3 className="sort-title">Sort</h3>
          <hr className="sort-divider" />
          {sortOptions.map((opt) => {
            const isSelected = sortOption === opt.id;
            return (
              <div
                key={opt.id}
                className="sort-option-row"
                onClick={() => onSelect?.(opt.id)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
              >
                <span className={`sort-radio ${isSelected ? "sort-radio-selected" : ""}`} />
                <span className="sort-option-label">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
/**
 * Search dropdown — shows "Matching Categories" (theme suggestions, only present
 * on pages that have a searchCategoryList) and "Matching Products" (filtered
 * from already-fetched catalogue data by product name).
 */
function SearchDropdown({
  query,
  searchCategoryList,
  products,
  categoryType,
  onSelectCategory,
  onSelectProduct,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const matchingCategories = useMemo(() => {
    if (!normalizedQuery) return [];
    return (searchCategoryList || []).filter((c) =>
      c.label?.toLowerCase().includes(normalizedQuery)
    );
  }, [searchCategoryList, normalizedQuery]);

  const matchingProducts = useMemo(() => {
    if (!normalizedQuery) return [];
    return (products || []).filter((p) =>
      (p.name || p.product_name || "").toLowerCase().includes(normalizedQuery)
    );
  }, [products, normalizedQuery]);

  const CATEGORY_LIMIT = 3;
  const PRODUCT_LIMIT = 5;

  const visibleCategories = showAllCategories
    ? matchingCategories
    : matchingCategories.slice(0, CATEGORY_LIMIT);

  const visibleProducts = showAllProducts
    ? matchingProducts
    : matchingProducts.slice(0, PRODUCT_LIMIT);

  const hasNoResults = matchingCategories.length === 0 && matchingProducts.length === 0;

  const getProductThumb = (item) => {
    if (categoryType === "photography") {
      return item.featured_image
        ? `${COMPRESSED_WEBP_IMG_URL}${item.featured_image.split(".")[0]}.webp`
        : "";
    }

    return item.featured_images?.[0]?.fileName
      ? `${COMPRESSED_WEBP_IMG_URL}${item.featured_images[0].fileName.split(".")[0]}.webp`
      : "";
  };

  const getProductPrice = (p) => {
    const price = Number(p.price);
    if (!price) return "";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  if (hasNoResults) {
    return (
      <div className="search-dropdown">
        <div className="search-no-results">No results found for "{query}"</div>
      </div>
    );
  }

  return (
    <div className="search-dropdown">
      {matchingCategories.length > 0 && (
        <div className="search-section">
          <div className="search-section-header">
            <span>Matching Categories</span>
            {matchingCategories.length > CATEGORY_LIMIT && !showAllCategories && (
              <button
                type="button"
                className="search-view-all-btn"
                onClick={() => setShowAllCategories(true)}
              >
                View All
              </button>
            )}
          </div>

          {visibleCategories.map((cat) => (
            <div
              key={cat.id}
              className="search-category-row"
              onClick={() => onSelectCategory?.(cat)}
            >
              <div className="search-category-thumb">
                {cat.image && (
                  <Image src={cat.image} alt={cat.label} fill style={{ objectFit: "cover" }} />
                )}
              </div>
              <div className="search-category-info">
                <div className="search-category-name">{cat.label}</div>
              </div>
              <ChevronRight size={18} className="search-row-chevron" />
            </div>
          ))}
        </div>
      )}

      {matchingProducts.length > 0 && (
        <div className="search-section">
          <div className="search-section-header">
            <span>Matching Products</span>
          </div>

          {visibleProducts.map((product, idx) => {
            const thumb = getProductThumb(product);
            return (
              <div
                key={product._id || product.id || idx}
                className="search-product-row"
                onClick={() => onSelectProduct?.(product)}
              >
                <div className="search-product-thumb">
                  {thumb && (
                    <img
                      src={thumb}
                      alt={product.name || "product"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className="search-product-name">{product.name}</div>
                <div className="search-product-price">{getProductPrice(product)}</div>
              </div>
            );
          })}

          {matchingProducts.length > PRODUCT_LIMIT && !showAllProducts && (
            <button
              type="button"
              className="search-view-more-btn"
              onClick={() => setShowAllProducts(true)}
            >
              View More <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchSortBar({
  sortOption = "popularity",
  onSortChange,
  searchCategoryList = [],
  products = [],
  categoryType,
  onCategorySelect,
  onProductSelect,
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const wrapperRef = useRef(null);
  const topBarRef = useRef(null);
  const placeholderRef = useRef(null);

  // Fixed-on-scroll behavior
  useEffect(() => {
    const getTriggerOffset = () => {
      // Original position of the bar from the top of the document
      return placeholderRef.current
        ? placeholderRef.current.getBoundingClientRect().top + window.scrollY
        : 0;
    };

    let triggerOffset = getTriggerOffset();

    const handleScroll = () => {
      setIsFixed(window.scrollY > triggerOffset);
    };

    const handleResize = () => {
      triggerOffset = getTriggerOffset();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setIsDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSortSelect = (id) => {
    onSortChange?.(id);
    setIsSortOpen(false);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsDropdownOpen(value.trim().length > 0);
  };

  const handleCategoryClick = (cat) => {
    setIsDropdownOpen(false);
    setQuery("");
    onCategorySelect?.(cat);
  };

  const handleProductClick = (product) => {
    setIsDropdownOpen(false);
    setQuery("");
    onProductSelect?.(product);
  };

  return (
    <div className="search-sort-wrapper" ref={wrapperRef}>
      {/* Spacer — only takes up space once the bar goes fixed, prevents content jump */}
      <div
        ref={placeholderRef}
        className="search-sort-placeholder"
        style={{ height: isFixed ? topBarRef.current?.offsetHeight || 0 : 0 }}
      />

      <div
        className={`search-sort-top-bar ${isFixed ? "fixed" : ""}`}
        ref={topBarRef}
      >
        <div className="search-box">
          <Search className="search-icons" strokeWidth={2.25} />
          <input
            type="text"
            placeholder="Search Themes"
            className="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => query.trim().length > 0 && setIsDropdownOpen(true)}
          />
        </div>

        {isDropdownOpen && (
          <SearchDropdown
            query={query}
            searchCategoryList={searchCategoryList}
            products={products}
            categoryType={categoryType}
            onSelectCategory={handleCategoryClick}
            onSelectProduct={handleProductClick}
          />
        )}

        <button type="button" className="sort-btn" onClick={() => setIsSortOpen(true)}>
          <SlidersHorizontal className="sort-icon" strokeWidth={2} />
          Sort by
        </button>
      </div>

      <SortSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        sortOption={sortOption}
        onSelect={handleSortSelect}
      />
    </div>
  );
}
export { sortOptions };