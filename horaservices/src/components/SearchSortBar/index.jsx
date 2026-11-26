"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, X, Check } from "lucide-react";
import Image from "next/image";
import "./SearchSortBar.css";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import { trackSearch } from "@/utils/track";
import { useRouter } from "next/router";
import searchIcon from "@/assets/searchbar.svg";
import closeIcon from "@/assets/sortbar.svg";
import { rankItems, parseSearchQuery } from "@/utils/searchRelated";

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
  { id: "onWall", label: "On Wall", apiValue: "On Wall" },
  { id: "personalizedFlexOnWall", label: "Personalized Flex On Wall", apiValue: "Personalized Flex On Wall" },
  { id: "onRing", label: "On Ring", apiValue: "On Ring" },
  { id: "ringPersonalizedFlex", label: "Ring + Personalised Flex", apiValue: "Ring + Personalised Flex" },
  { id: "sequinsDesign", label: "Sequins Design", apiValue: "Sequins Design" },
  { id: "uShapeStand", label: "U Shape Stand", apiValue: "U Shape Stand" },
  { id: "uStandPersonalizedFlex", label: "U stand + Personalized flex", apiValue: "U stand + Personalized flex" },
  { id: "uShapeWoodenStand", label: "U Shape Wooden stand", apiValue: "U Shape Wooden stand" },
  { id: "canopy", label: "Canopy", apiValue: "Canopy" },
  { id: "personalizedFlexOnStand", label: "Personalized Flex on Stand", apiValue: "Personalized Flex on Stand" },
  { id: "multiPanelBackdrop", label: "Multi - Panel Backdrop", apiValue: "Multi - Panel Backdrop" },
  { id: "onSquareStand", label: "On Square Stand", apiValue: "On Square Stand" },
  { id: "carDecor", label: "Car Decor", apiValue: "Car Decor" },
  { id: "entryArch", label: "Entry Arch", apiValue: "Entry Arch" },
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

            {/* Design Type: sirf tab jab options diye gaye (category page) */}
            {designOptions.length > 0 && (
              <>
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
              </>
            )}
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
  loading,
  categoryType,
  onSelectCategory,
  onSelectProduct,
  onViewMore, // View More dabane par category page par le jaata hai
  designPicker, // { labels, items } -> landing par design type ke liye category chuno
  filterLabels = [], // ["Under ₹2,000"] -> Products header mein dikhte hain
  primaryGroup = "decoration", // "decoration" | "photography": is group ki categories pehle
  getProductHref,
  getCategoryHref,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const hasQuery = query.trim().length > 0;

  const wantsPhoto = /\b(?:photo(?:graph(?:y|er|ers)|shoot|shoots|s)?|candid|cinematic|portraits?|poses?)\b/i.test(query);
  const wantsDeco = /\b(?:decoration|decorations|decor|balloon)\b/i.test(query);
  const effectiveGroup =
    wantsPhoto && !wantsDeco
      ? "photography"
      : wantsDeco && !wantsPhoto
        ? "decoration"
        : primaryGroup;

  // Categories + themes: har term match hoke ek ranked list (zyada match = upar).
  // "under 2000" / "low to high" jaise filter words ranking se hata dete hain.
  const matchingCategories = useMemo(() => {
    if (!hasQuery) return [];
    const rankQuery = parseSearchQuery(query, []).rest;
    if (!rankQuery) return [];
    const list = searchCategoryList || [];
    const ranked = rankItems(
      rankQuery,
      list.filter((c) => c.kind !== "theme"),
      list.filter((c) => c.kind === "theme"),
    );
    // Jis page par ho uski categories pehle (rank order har group ke andar same rehta hai).
    // User ne khud "photography" / "decoration" likha ho to wahi group pehle.
    const groupOf = (c) => c.group || "decoration";
    return [
      ...ranked.filter((c) => groupOf(c) === effectiveGroup),
      ...ranked.filter((c) => groupOf(c) !== effectiveGroup),
    ];
  }, [searchCategoryList, query, hasQuery, effectiveGroup]);

  // Products backend se already search + rank hoke aate hain (name filter nahi lagate)
  const matchingProducts = hasQuery ? products || [] : [];

  const CATEGORY_LIMIT = 5;
  const PRODUCT_LIMIT = 5;

  const visibleCategories = showAllCategories
    ? matchingCategories
    : matchingCategories.slice(0, CATEGORY_LIMIT);

  // Dropdown mein hamesha sirf top PRODUCT_LIMIT; baaki View More se page par
  const visibleProducts = matchingProducts.slice(0, PRODUCT_LIMIT);

  const getProductThumb = (item) => {
    if (categoryType === "photography" || item._group === "photography") {
      const f = item.featured_image || item.featured_images?.[0]?.fileName;
      return f ? `${COMPRESSED_WEBP_IMG_URL}${String(f).split(".")[0]}.webp` : "";
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

  // Landing page par design type / price / sort likha hai:
  // pehle user se category puchho, phir usi category page par filter ke saath bhejo.
  if (designPicker?.items?.length) {
    return (
      <div className="search-dropdown">
        <div className="search-section">
          <div className="search-section-header">
            <span>Select category for “{designPicker.labels.join(", ")}”</span>
          </div>
          <div style={{ padding: "0 16px 8px", fontSize: 12, opacity: 0.7 }}>
            {designPicker.hint || "Choose the category."}
          </div>

          {designPicker.items.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              className="search-category-row"
              onClick={(e) => {
                e.preventDefault(); // router.push se jayega (filters ke saath)
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
      </div>
    );
  }

  // Products abhi load ho rahe hain aur categories mein bhi kuch nahi
  if (!matchingCategories.length && !matchingProducts.length) {
    return (
      <div className="search-dropdown">
        <div className="search-no-results">
          {loading ? "Searching..." : `No results found for "${query}"`}
        </div>
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
              href={getCategoryHref?.(cat) || "#"}
              className="search-category-row"
              onClick={() => onSelectCategory?.(cat)}
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
                {cat.group && cat.group !== effectiveGroup && (
                  <div style={{ fontSize: 11, opacity: 0.6, textTransform: "capitalize" }}>
                    {cat.group}
                  </div>
                )}
              </div>
              <ChevronRight size={18} className="search-row-chevron" />
            </a>
          ))}
        </div>
      )}

      {(matchingProducts.length > 0 || loading) && (
        <div className="search-section">
          <div className="search-section-header">
            <span>
              Matching Products
              {filterLabels.length > 0 ? ` · ${filterLabels.join(" · ")}` : ""}
            </span>
          </div>

          {loading && matchingProducts.length === 0 && (
            <div className="search-no-results">Searching products...</div>
          )}

          {visibleProducts.map((product, idx) => {
            const thumb = getProductThumb(product);
            return (
              <a
                key={product._id || product.id || idx}
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

          {/* View More: dropdown mein expand nahi, category page par le jaata hai */}
          {matchingProducts.length > PRODUCT_LIMIT && (
            <button
              type="button"
              className="search-view-more-btn"
              onClick={() => onViewMore?.(query)}
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
  loading = false,
  categoryType,
  onCategorySelect,
  onProductSelect,
  onSearchChange,
  getProductHref,
  getCategoryHref,
  userId = null,
  showSort = true, // false => "Sort by" button aur Sort sheet dono nahi dikhenge
  showDesignType = false, // true => sheet mein Design Type section (sirf category page)
  initialQuery = "",
  designTypes = [],
  onApplyFilters, // ({ sortOption, designTypes }) => void  (ek saath apply)
  onQueryChange, // (value) => void  -- har keystroke par (global search ke liye)
  onViewMore, // (query) => void  -- View More dabane par category page par navigate
  designPicker = null, // { labels, items } -- landing par category chuna ke liye
  filterLabels = [],
  primaryGroup = "decoration",
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

  // ---- Typewriter placeholder words (searchCategoryList ke labels se) ----
  const typewriterWords = useMemo(() => {
    const words = (searchCategoryList || [])
      .filter((c) => (c.group || "decoration") === primaryGroup)
      .map((c) => c.label?.trim())
      .filter(Boolean);
    return words.length ? words : [DEFAULT_PLACEHOLDER];
  }, [searchCategoryList, primaryGroup]);

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

  // Outside click / Escape: SIRF dropdown band hoga.
  // Peeche ke page par koi search/filter apply nahi hota.
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

  const handleApply = ({ sortOption: nextSort, designTypes: nextDesigns }) => {
    const sortChanged = nextSort !== sortOption;
    const designChanged =
      showDesignType && nextDesigns.join(",") !== designTypes.join(",");

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
    onQueryChange?.(value); // parent ko har keystroke par batao
    // Text poora hata diya to search/filters bhi hatao (category page par
    // ?search= se aaya text mita do to filter hat jaye)
    if (!value.trim()) onSearchChange?.("");
  };

  // Enter: kuch apply nahi hota, page nahi badalta. Dropdown khula rehta hai.
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const typed = e.currentTarget.value.trim();
      if (typed) {
        setIsDropdownOpen(true);
        trackSearch({ searchTerm: typed, userId, pageName: pathname });
      }
    }
  };

  // Category ya product select hone ke baad ka common cleanup
  const closeAndResetAfterSelect = () => {
    setIsDropdownOpen(false);
    setQuery("");
    onQueryChange?.(""); // parent ka query bhi clear
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

  // View More: category page par navigate (wahan products + chips dikhte hain)
  const handleViewMore = (q) => {
    trackSearch({
      searchTerm: q,
      clickedType: "view_more",
      userId,
      pageName: pathname,
    });
    setIsDropdownOpen(false);
    onViewMore?.(q);
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
            loading={loading}
            categoryType={categoryType}
            onSelectCategory={handleCategoryClick}
            onSelectProduct={handleProductClick}
            onViewMore={handleViewMore}
            designPicker={designPicker}
            filterLabels={filterLabels}
            primaryGroup={primaryGroup}
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
          designTypes={showDesignType ? designTypes : []}
          designOptions={showDesignType ? designTypeOptions : []}
          onApply={handleApply}
        />
      )}
    </div>
  );
}

export { sortOptions, designTypeOptions };