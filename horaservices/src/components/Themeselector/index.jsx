"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import "./Themeselector.css";
import budgetfriendly from "@/assets/themeselector/budget-friendly.webp";
import valueformoney from "@/assets/themeselector/value-for-money.webp";
import photogenicdecoration from "@/assets/themeselector/photogenic-decoration.webp";
import stagedecoration from "@/assets/themeselector/stage-decoration.webp";
import budgetfriendlyBg from "@/assets/themeselector/budgetfriendlyBg.webp";
import valueformoneyBg from "@/assets/themeselector/valueformoneyBg.webp";
import photogenicdecorationBg from "@/assets/themeselector/photogenicdecorationBg.webp";
import stagedecorationBg from "@/assets/themeselector/stagedecorationBg.webp";
import Image from "next/image";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";

const themes = [
  {
    id: "budget",
    label: "Budget Friendly",
    image: budgetfriendly,
    bgImage: budgetfriendlyBg,
    width: "clamp(53px, 16.5vw, 79px)",
    height: "clamp(40px, 12.5vw, 60px)",
    gap: "clamp(10px, 3.05vw, 15px)",
    priceRange: { min: 0, max: 4000 },
    accentColor: "#C77DBF",
  },
  {
    id: "value",
    label: "Value For Money",
    image: valueformoney,
    bgImage: valueformoneyBg,
    width: "clamp(46px, 14.2vw, 68px)",
    height: "clamp(48px, 15vw, 72px)",
    gap: "clamp(11px, 3.56vw, 17px)",
    priceRange: { min: 4200, max: 7000 },
    accentColor: "#7C6CF2",
  },
  {
    id: "photogenic",
    label: "Photogenic Decoration",
    image: photogenicdecoration,
    bgImage: photogenicdecorationBg,
    width: "clamp(64px, 20.1vw, 96px)",
    height: "clamp(43px, 13.5vw, 64px)",
    gap: "clamp(8px, 2.5vw, 12px)",
    priceRange: { min: 7001, max: 12000 },
    accentColor: "#D4A93A",
  },
  {
    id: "stage",
    label: "Stage Decoration",
    image: stagedecoration,
    bgImage: stagedecorationBg,
    width: "clamp(106px, 33.08vw, 159px)",
    height: "clamp(41px, 13vw, 62px)",
    gap: "clamp(-10px, -2.04vw, -7px)",
    priceRange: { min: 12001, max: Infinity },
    accentColor: "#E8698A",
  },
];

const sortOptions = [
  { id: "popularity", label: "Popularity" },
  { id: "newArrival", label: "New Arrival" },
  { id: "lowToHigh", label: "Price: Low To High" },
  { id: "highToLow", label: "Price: High To Low" },
];

function ThemeCard({ theme, isActive, onSelect }) {

  return (
    <button
      type="button"
      onClick={() => onSelect?.(theme)}
      className={`theme-card ${isActive ? "theme-card-active" : ""}`}
      aria-pressed={isActive}
      style={{ "--card-accent": theme.accentColor }}
    >
      <Image src={theme.bgImage} alt="" fill priority className="theme-card-bg" />
      <div className="theme-card-overlay" style={{ "--card-gap": theme.gap }}>
        <h3 className="theme-card-label">{theme.label}</h3>
        <div className="theme-card-art">
          <Image
            src={theme.image}
            alt={theme.label}
            className="theme-card-img"
            style={{ width: theme.width, height: theme.height }}
          />
        </div>
        <span className="theme-card-chevron">
          <ChevronRight
            className={`theme-card-chevron-icon ${isActive ? "theme-card-chevron-icon-active" : ""}`}
          />
        </span>
      </div>
    </button>
  );
}

function SortSheet({ isOpen, onClose, sortOption, onSelect }) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div className={`sort-overlay ${isOpen ? "sort-overlay-open" : ""}`} onClick={onClose}>
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
      : fallbackImg;
  }

  return item.featured_images?.[0]?.fileName
    ? `${COMPRESSED_WEBP_IMG_URL}${item.featured_images[0].fileName.split(".")[0]}.webp`
    : fallbackImg;
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

          {visibleProducts.map((product, idx) => (
            <div
              key={product._id || product.id || idx}
              className="search-product-row"
              onClick={() => onSelectProduct?.(product)}
            >
              <div className="search-product-thumb">
                {getProductThumb(product) && (
                  <img
                    src={getProductThumb(product)}
                    alt={product.name || "product"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="search-product-name">{product.name}</div>
              <div className="search-product-price">{getProductPrice(product)}</div>
            </div>
          ))}

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

/**
 * ThemeSelector
 *
 * Props:
 * - onSelectTheme(theme | null): price-range card selection (Budget/Value/Photogenic/Stage)
 * - selectedThemeId: currently active price-range theme id
 * - sortOption / onSortChange: sort bottom sheet state
 * - showThemeGrid: whether to render the 4 price-range cards (default true)
 * - searchCategoryList: [{id,label,image,value}] — theme suggestions for "Matching Categories"
 * - products: catalogue array to search "Matching Products" against
 * - onCategorySelect(item): called when a matching category row is clicked
 * - onProductSelect(item): called when a matching product row is clicked
 */
export default function ThemeSelector({
  onSelectTheme,
  selectedThemeId,
  sortOption = "popularity",
  onSortChange,
  showThemeGrid = true,
  searchCategoryList = [],
  products = [],
  onCategorySelect,
   categoryType,
  onProductSelect,
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const topBarRef = useRef(null);
useEffect(() => {
  const handleScroll = () => {
    if (topBarRef.current) {
      topBarRef.current.classList.toggle("sticky", window.scrollY > 100);
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
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

  const handleSelect = (theme) => {
    if (selectedThemeId === theme.id) {
      onSelectTheme?.(null);
    } else {
      onSelectTheme?.(theme);
    }
  };

  const handleSortSelect = (id) => {
    onSortChange?.(id);
    setIsSortOpen(false);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsDropdownOpen(value.trim().length > 0);
  };

  const handleClearQuery = () => {
    setQuery("");
    setIsDropdownOpen(false);
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
    <div className="theme-selector-wrapper" ref={searchBoxRef}>
      <div className="theme-top-bar" ref={topBarRef}>
        <div className="theme-search-box">
          <Search className="theme-search-icon" strokeWidth={2.25} />
          <input
            type="text"
            placeholder="Search Themes"
            className="theme-search-input"
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
        <button type="button" className="theme-sort-btn" onClick={() => setIsSortOpen(true)}>
          <SlidersHorizontal className="theme-sort-icon" strokeWidth={2} />
          Sort by
        </button>
      </div>

      {showThemeGrid && (
        <div className="theme-grid">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={selectedThemeId === theme.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <SortSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        sortOption={sortOption}
        onSelect={handleSortSelect}
      />
    </div>
  );
}

export { themes, sortOptions };