"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, SlidersHorizontal, ChevronRight, X, Check } from "lucide-react";
import Image from "next/image";
import "./SearchSortBar.css";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import { trackSearch } from "@/utils/track";
import { useRouter } from "next/router";
import searchIcon from "@/assets/searchbar.svg";
import closeIcon from "@/assets/sortbar.svg";

const sortOptions = [
  { id: "popularity", label: "Popularity" },
  { id: "newArrival", label: "New Arrival" },
  { id: "lowToHigh", label: "Price: Low To High" },
  { id: "highToLow", label: "Price: High To Low" },
];
const designTypeOptions = [
  { id: "wall", label: "Wall", apiValue: "Wall" },
  { id: "ring", label: "Ring", apiValue: "Ring" },
  { id: "ringFlex", label: "Ring + Flex", apiValue: "Ring + Flex" },
  { id: "sequined", label: "Sequined", apiValue: "Sequined" },
  { id: "uShape", label: "UShape", apiValue: "UShape" },
  { id: "squareStand", label: "Square Stand", apiValue: "Square Stand" },
  { id: "roomDecor", label: "Room Decor", apiValue: "Room Decor" },
  { id: "cradle", label: "Cradle", apiValue: "Cradle" },
  { id: "flex", label: "Flex", apiValue: "Flex" },
  { id: "artificialFlower", label: "Artificial Flower", apiValue: "Artificial Flower" },
  { id: "realFlower", label: "Real Flower", apiValue: "Real Flower" },
];

// ---- Typewriter placeholder ke liye tuning values ----
const TYPE_SPEED = 90; // har character type hone ki speed (ms)
const DELETE_SPEED = 45; // har character delete hone ki speed (ms)
const PAUSE_AFTER_TYPE = 1300; // word poora type hone ke baad kitni der ruke (ms)
const PAUSE_AFTER_DELETE = 300; // word poora delete hone ke baad next word se pehle pause (ms)
const DEFAULT_PLACEHOLDER = "Search Themes";
const DEFAULT_SORT = "popularity"; // default sort jispe reset hoga

function SortSheet({
  isOpen,
  onClose,
  sortOption,
  designTypes = [],
  onApply,
  sortList = sortOptions,
  designOptions = designTypeOptions,
}) {
  const [mounted, setMounted] = useState(false);
  // Draft: user Apply dabane tak changes sirf sheet ke andar rehte hain
  const [draftSort, setDraftSort] = useState(sortOption);
  const [draftDesigns, setDraftDesigns] = useState(designTypes);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sheet khulte hi current applied values se draft reset karo
  useEffect(() => {
    if (isOpen) {
      setDraftSort(sortOption);
      setDraftDesigns(designTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useLockBodyScroll(isOpen && mounted);

  // Server + pehla client render dono pe null → hydration match
  if (!mounted) return null;

  const toggleDesign = (id) =>
    setDraftDesigns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleClear = () => {
    setDraftSort(DEFAULT_SORT);
    setDraftDesigns([]);
  };

  return createPortal(
    <div
      className={`sort-overlay ${isOpen ? "sort-overlay-open" : ""}`}
      onClick={onClose}
    >
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
        <div
          className={`sort-sheet ${isOpen ? "sort-sheet-open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="sort-title">Sort &amp; Filter</h3>
          <hr className="sort-divider" />

          {/* Sirf ye hissa scroll hoga; title upar aur buttons neeche fixed */}
          <div className="sort-options-list">
            <div className="sort-section-title">Sort By</div>
            {sortList.map((opt) => {
              const isSelected = draftSort === opt.id;
              return (
                <div
                  key={opt.id}
                  className="sort-option-row"
                  onClick={() => setDraftSort(opt.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                >
                  <span
                    className={`sort-radio ${isSelected ? "sort-radio-selected" : ""}`}
                  />
                  <span className="sort-option-label">{opt.label}</span>
                </div>
              );
            })}

            <hr className="sort-divider sort-section-divider" />

            <div className="sort-section-title">Design Type</div>
            <div className="sort-section-sub">Select one or more designs</div>
            {designOptions.map((opt) => {
              const isSelected = draftDesigns.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className="sort-option-row"
                  onClick={() => toggleDesign(opt.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                >
                  <span
                    className={`sort-checkbox ${isSelected ? "sort-checkbox-selected" : ""}`}
                  >
                    {isSelected && <Check size={13} strokeWidth={3.5} />}
                  </span>
                  <span className="sort-option-label">{opt.label}</span>
                </div>
              );
            })}
          </div>

          <div className="sort-footer">
            <button
              type="button"
              className="sort-clear-btn"
              onClick={handleClear}
            >
              Clear all
            </button>
            <button
              type="button"
              className="sort-apply-btn"
              onClick={() =>
                onApply?.({ sortOption: draftSort, designTypes: draftDesigns })
              }
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function SearchDropdown({
  query,
  searchCategoryList,
  products,
  categoryType,
  onSelectCategory,
  onSelectProduct,
  getProductHref,
  getCategoryHref,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const matchingCategories = useMemo(() => {
    if (!normalizedQuery) return [];
    const matched = (searchCategoryList || []).filter((c) =>
      c.label?.toLowerCase().includes(normalizedQuery),
    );
    const starts = (c) =>
      c.label.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
    const byStart = (a, b) => starts(a) - starts(b);

    const themes = matched.filter((c) => c.kind === "theme").sort(byStart);
    const others = matched.filter((c) => c.kind !== "theme").sort(byStart);

    const out = [];
    while (themes.length || others.length) {
      if (others.length) out.push(others.shift());
      if (themes.length) out.push(themes.shift());
    }
    return out;
  }, [searchCategoryList, normalizedQuery]);

  const matchingProducts = useMemo(() => {
    if (!normalizedQuery) return [];
    return (products || []).filter((p) =>
      (p.name || p.product_name || "").toLowerCase().includes(normalizedQuery),
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

  const hasNoResults =
    matchingCategories.length === 0 && matchingProducts.length === 0;

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
            {matchingCategories.length > CATEGORY_LIMIT &&
              !showAllCategories && (
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
            <a
              key={cat.id}
              type="button"
              href={getCategoryHref?.(cat) || "#"}
              className="search-category-row"
              onClick={() => {
                // tracking + close dropdown + filter reset parent handle karega
                onSelectCategory?.(cat);
              }}
            >
              <div className="search-category-thumb">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="search-category-info">
                <div className="search-category-name">{cat.label}</div>
              </div>
              <ChevronRight size={18} className="search-row-chevron" />
            </a>
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
              <a
                key={product._id || product.id || idx}
                type="button"
                href={getProductHref?.(product) || "#"}
                className="search-product-row"
                onClick={() => onSelectProduct?.(product)}
              >
                <div className="search-product-thumb">
                  {thumb && (
                    <img
                      src={thumb}
                      alt={product.name || "product"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div className="search-product-name">{product.name}</div>
                <div className="search-product-price">
                  {getProductPrice(product)}
                </div>
              </a>
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
  sortOption = DEFAULT_SORT,
  onSortChange,
  searchCategoryList = [],
  products = [],
  categoryType,
  onCategorySelect,
  onProductSelect,
  onSearchChange,
  getProductHref,
  getCategoryHref,
  userId = null,
  showSort = true, // false => "Sort by" button aur Sort sheet dono nahi dikhenge
  initialQuery = "",
  designTypes = [],
  onApplyFilters, // ({ sortOption, designTypes }) => void  (ek saath apply)
  onQueryChange, // (value) => void  -- har keystroke par (global search ke liye)
  onSubmitSearch, 
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(DEFAULT_PLACEHOLDER);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const topBarRef = useRef(null);
  const placeholderRef = useRef(null);
  const route = useRouter();

  const pathname = route.asPath;

  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

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

  // Fixed-on-scroll behavior
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
    trackSearch({ searchTerm: trimmed, userId, pageName: pathname });
  }, [onSearchChange, userId, pathname]);

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

  const handleApply = ({ sortOption: nextSort, designTypes: nextDesigns }) => {
    const sortChanged = nextSort !== sortOption;
    const designChanged = nextDesigns.join(",") !== designTypes.join(",");

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];

      if (sortChanged) {
        const selectedOption = sortOptions.find((opt) => opt.id === nextSort);
        window.dataLayer.push({
          event: `sort_by_${nextSort}`,
          sort_id: nextSort,
          sort_label: selectedOption?.label || "",
        });
      }

      if (designChanged) {
        window.dataLayer.push({
          event: "design_type_filter",
          design_type_ids: nextDesigns.join(","),
          design_type_labels: nextDesigns
            .map((id) => designTypeOptions.find((o) => o.id === id)?.label)
            .filter(Boolean)
            .join(","),
        });
      }
    }

    if (onApplyFilters) {
      onApplyFilters({ sortOption: nextSort, designTypes: nextDesigns });
    } else if (sortChanged) {
      // purane pages (jahan sirf onSortChange diya hai) ke liye
      onSortChange?.(nextSort);
    }
    setIsSortOpen(false);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsDropdownOpen(value.trim().length > 0);
    onQueryChange?.(value); // NEW: parent ko har keystroke par batao
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const typed = e.currentTarget.value.trim(); // NEW: blur se pehle value le lo
      commitSearch();
      setIsDropdownOpen(false);
      e.currentTarget.blur();
      onSubmitSearch?.(typed); // NEW
    }
  };

  // Category ya product select hone ke baad ka common cleanup
  const closeAndResetAfterSelect = () => {
    setIsDropdownOpen(false);
    setQuery("");
    onSearchChange?.("");
    onQueryChange?.(""); // NEW: parent ka query bhi clear

    // NOTE: Filters yahan reset nahi karte. Category/product ke href mein
    // filters ka query nahi jaata, to naye URL par parent ka URL->state sync
    // filters ko apne aap default kar deta hai (extra router.replace / race nahi).

    // Sort sheet khuli ho to band
    setIsSortOpen(false);
  };

  const handleCategoryClick = (cat) => {
    trackSearch({
      searchTerm: query,
      clickedItemId: null,
      clickedTitle: cat.label,
      clickedType: "category",
      userId,
      pageName: pathname,
    });
    closeAndResetAfterSelect();
    onCategorySelect?.(cat);
  };

  const handleProductClick = (product) => {
    trackSearch({
      searchTerm: query,
      clickedItemId: product._id || product.id,
      clickedTitle: product.name,
      clickedType: "product",
      userId,
      pageName: pathname,
    });
    closeAndResetAfterSelect();
    onProductSelect?.(product);
  };

  return (
    <div className="search-sort-wrapper" ref={wrapperRef}>
      <div
        ref={placeholderRef}
        className="search-sort-placeholder"
        style={{ height: isFixed ? topBarRef.current?.offsetHeight || 0 : 0 }}
      />
      <div
        className={`search-sort-top-bar ${isFixed ? "fixed" : ""} ${
          showSort ? "" : "search-sort-top-bar--no-sort"
        }`}
        ref={topBarRef}
      >
        <div className="search-box">
          <Image src={searchIcon} alt="Search" className="search-icons" />
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
            getProductHref={getProductHref}
            getCategoryHref={getCategoryHref}
          />
        )}

        {showSort && (
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
            <Image src={closeIcon} alt="Close" className="sort-close-icon" />
            Sort by
          </button>
        )}
      </div>

      {showSort && (
        <SortSheet
          isOpen={isSortOpen}
          onClose={() => setIsSortOpen(false)}
          sortOption={sortOption}
          designTypes={designTypes}
          onApply={handleApply}
        />
      )}
    </div>
  );
}

export { sortOptions, designTypeOptions };