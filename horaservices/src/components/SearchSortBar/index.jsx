"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import { trackSearch } from "@/utils/track";
import { useRouter } from "next/router";
import searchIcon from "@/assets/searchbar.svg"
import closeIcon from "@/assets/sortbar.svg"
const sortOptions = [
  { id: "popularity", label: "Popularity" },
  { id: "newArrival", label: "New Arrival" },
  { id: "lowToHigh", label: "Price: Low To High" },
  { id: "highToLow", label: "Price: High To Low" },
];

// ---- Typewriter placeholder ke liye tuning values ----
const TYPE_SPEED = 90;          // har character type hone ki speed (ms)
const DELETE_SPEED = 45;        // har character delete hone ki speed (ms)
const PAUSE_AFTER_TYPE = 1300;  // word poora type hone ke baad kitni der ruke (ms)
const PAUSE_AFTER_DELETE = 300; // word poora delete hone ke baad next word se pehle pause (ms)
const DEFAULT_PLACEHOLDER = "Search Themes";

function SortSheet({ isOpen, onClose, sortOption, onSelect }) {
  // Sort sheet open hote hi background scroll lock ho jayega
  useLockBodyScroll(isOpen);

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
  onSearchChange,
  userId = null,
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(DEFAULT_PLACEHOLDER);
  const [isFocused, setIsFocused] = useState(false); // input focus/blur track karne ke liye
  const wrapperRef = useRef(null);
  const topBarRef = useRef(null);
  const placeholderRef = useRef(null);
  const route = useRouter();

  const pathname = route.asPath;
 
  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  // ---- Typewriter placeholder words (searchCategoryList ke labels se) ----
  const typewriterWords = useMemo(() => {
    const words = (searchCategoryList || [])
      .map((c) => c.label?.trim())
      .filter(Boolean);
    return words.length ? words : [DEFAULT_PLACEHOLDER];
  }, [searchCategoryList]);

 useEffect(() => {
    if (query.trim().length > 0 || isFocused) {
     return;
    }

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId;

    const tick = () => {
      const currentWord = typewriterWords[wordIdx % typewriterWords.length];

      if (!isDeleting) {
        charIdx++;
        setPlaceholderText(currentWord.slice(0, charIdx));

        if (charIdx === currentWord.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, PAUSE_AFTER_TYPE);
          return;
        }
        timeoutId = setTimeout(tick, TYPE_SPEED);
      } else {
        charIdx--;
        setPlaceholderText(currentWord.slice(0, charIdx));

        if (charIdx === 0) {
          isDeleting = false;
          wordIdx++;
          timeoutId = setTimeout(tick, PAUSE_AFTER_DELETE);
          return;
        }
        timeoutId = setTimeout(tick, DELETE_SPEED);
      }
    };

    timeoutId = setTimeout(tick, 400);

    return () => clearTimeout(timeoutId);
  }, [typewriterWords, query, isFocused]);

  // Fixed-on-scroll behavior (unchanged) ...
  useEffect(() => {
    const getTriggerOffset = () =>
      placeholderRef.current
        ? placeholderRef.current.getBoundingClientRect().top + window.scrollY
        : 0;

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

  const commitSearch = useCallback(() => {
    const trimmed = queryRef.current.trim();
    onSearchChange?.(trimmed);
    trackSearch({ searchTerm: trimmed, userId, pageName : pathname });
  }, [onSearchChange, userId]);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen((prev) => {
          if (prev) commitSearch();
          return false;
        });
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") {
        setIsDropdownOpen((prev) => {
          if (prev) commitSearch();
          return false;
        });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [commitSearch]);

  const handleSortSelect = (id) => {
    const selectedOption = sortOptions.find((opt) => opt.id === id);
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: `sort_by_${id}`,
        sort_id: id,
        sort_label: selectedOption?.label || "",
      });
    }
    onSortChange?.(id);
    setIsSortOpen(false);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsDropdownOpen(value.trim().length > 0);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      commitSearch();
      setIsDropdownOpen(false);
      e.currentTarget.blur();
    }
  };

const handleCategoryClick = (cat) => {
  trackSearch({
    searchTerm: query,
    clickedItemId: null, 
    clickedTitle: cat.label,
    clickedType: "category",
    userId,
    pageName: pathname
  });
  setIsDropdownOpen(false);
  setQuery("");
  onSearchChange?.("");
  onCategorySelect?.(cat);
};

  const handleProductClick = (product) => {
    trackSearch({
      searchTerm: query,
      clickedItemId: product._id || product.id,
      clickedTitle: product.name,
      clickedType: "product",
      userId,
      pageName : pathname
    });
    setIsDropdownOpen(false);
    setQuery("");
    onSearchChange?.("");
    onProductSelect?.(product);
  };

  return (
    <div className="search-sort-wrapper" ref={wrapperRef}>
      <div
        ref={placeholderRef}
        className="search-sort-placeholder"
        style={{ height: isFixed ? topBarRef.current?.offsetHeight || 0 : 0 }}
      />
      <div className={`search-sort-top-bar ${isFixed ? "fixed" : ""}`} ref={topBarRef}>
        <div className="search-box">
       <Image
  src={searchIcon}
  alt="Search"
  className="search-icons"
/>
          <input
            type="text"
            placeholder={placeholderText}
            className="search-input"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => {
              setIsFocused(true); // focus hote hi animation ruk jayega
              setPlaceholderText(""); // aur placeholder turant blank ho jayega
              if (query.trim().length > 0) setIsDropdownOpen(true);
            }}
            onBlur={() => setIsFocused(false)} // blur hote hi wapas chalu ho jayega
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

        <button
          type="button"
          className="sort-btn"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ event: "sort_sheet_open" });
            }
            setIsSortOpen(true);
          }}
        >
             <Image
  src={closeIcon}
  alt="Close"
  className="sort-close-icon"
/>
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