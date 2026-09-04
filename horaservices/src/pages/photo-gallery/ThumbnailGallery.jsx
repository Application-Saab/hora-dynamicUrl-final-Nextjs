"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Slider from "react-slick";
import Image from "next/image";

import "./gallery.css";
import photogallryIcon from "../../assets/gallry-loading.gif";
import LazyImage from "../../components/LazyImage";
import PaginationControls from "../../components/PaginationControls";
import { BASE_URL } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

/**
 * Get image dimensions.
 *
 * IMPORTANT:
 * We don't load dimensions for all images together anymore.
 * iOS Safari can become unstable when many Image objects are
 * created at the same time.
 */
const getImageDimensions = (url) =>
  new Promise((resolve) => {
    const img = new window.Image();

    img.onload = () => {
      resolve({
        w: img.naturalWidth || 4,
        h: img.naturalHeight || 3,
      });
    };

    img.onerror = () => {
      resolve({
        w: 4,
        h: 3,
      });
    };

    img.src = url;
  });

/**
 * Justified Layout
 */
const buildJustifiedRows = (thumbs, cw, targetH, gap) => {
  const rows = [];
  let i = 0;

  while (i < thumbs.length) {
    let j = i;
    let ratioSum = 0;

    while (j < thumbs.length) {
      const w = thumbs[j].w || 4;
      const h = thumbs[j].h || 3;

      const r = w / h;

      const projected =
        (ratioSum + r) * targetH + (j - i) * gap;

      if (projected > cw && j > i) {
        break;
      }

      ratioSum += r;
      j++;
    }

    const row = thumbs.slice(i, j);

    const gaps = (row.length - 1) * gap;

    const totalRatio = row.reduce(
      (sum, item) => {
        const w = item.w || 4;
        const h = item.h || 3;

        return sum + w / h;
      },
      0
    );

    const rowH =
      totalRatio > 0
        ? Math.floor((cw - gaps) / totalRatio)
        : targetH;

    let used = 0;

    const sized = row.map((t, idx) => {
      const isLast = idx === row.length - 1;

      const ratio =
        (t.w || 4) / (t.h || 3);

      const w = isLast
        ? cw - gaps - used
        : Math.floor(ratio * rowH);

      if (!isLast) {
        used += w;
      }

      return {
        ...t,
        displayW: Math.max(w, 1),
        displayH: Math.max(rowH, 1),
      };
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
  const [allThumbnails, setAllThumbnails] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [isIOSMobile, setIsIOSMobile] = useState(false);

  const [cw, setCw] = useState(320);

  const galleryRef = useRef(null);
  const sliderRef = useRef(null);

  /**
   * ============================================================
   * IMAGE DIMENSION CACHE
   * ============================================================
   *
   * Important for iOS.
   *
   * When user goes:
   *
   * Page 1 -> Page 2 -> Page 3 -> Page 1
   *
   * we don't recreate image dimension requests for Page 1.
   */
  const dimensionCacheRef = useRef(new Map());

  /**
   * Prevent old API requests from updating state.
   */
  const requestIdRef = useRef(0);

  /**
   * ============================================================
   * CONTAINER WIDTH
   * ============================================================
   */
  useEffect(() => {
    const measure = () => {
      const screenW =
        document.documentElement.clientWidth;

      const w = Math.min(screenW, 480);

      setCw((previous) =>
        previous === w ? previous : w
      );
    };

    measure();

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  /**
   * ============================================================
   * IOS DETECTION
   * ============================================================
   */
  useEffect(() => {
    if (typeof navigator === "undefined") {
      return;
    }

    const userAgent = navigator.userAgent;

    const ios =
      /iPhone|iPad|iPod/i.test(userAgent) ||
      (
        navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1
      );

    setIsIOSMobile(ios);
  }, []);

  /**
   * ============================================================
   * SLIDER POSITION
   * ============================================================
   */
  useEffect(() => {
    if (
      selectedIndex !== null &&
      sliderRef.current
    ) {
      /**
       * Small timeout allows Slick to finish mounting
       * before moving to the selected slide.
       */
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(
            selectedIndex,
            true
          );
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [selectedIndex]);

  /**
   * ============================================================
   * ITEMS PER PAGE
   * ============================================================
   */
  const getItemsPerPage = useCallback(() => {
    if (typeof window === "undefined") {
      return 12;
    }

    if (isIOSMobile) {
      return window.innerWidth >= 400
        ? 15
        : 9;
    }

    return window.innerWidth >= 768
      ? 36
      : 24;
  }, [isIOSMobile]);

  const [ITEMS_PER_PAGE, setItemsPerPage] =
    useState(getItemsPerPage());

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage());
    };

    updateItemsPerPage();

    window.addEventListener(
      "resize",
      updateItemsPerPage
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateItemsPerPage
      );
    };
  }, [getItemsPerPage]);

  /**
   * ============================================================
   * FETCH THUMBNAILS
   * ============================================================
   */
  useEffect(() => {
    let cancelled = false;

    const fetchThumbnails = async () => {
      if (!folderName || !customerId) {
        setAllThumbnails([]);
        setLoading(false);
        setError(
          "Folder name or customer ID missing."
        );

        return;
      }

      const requestId =
        ++requestIdRef.current;

      setLoading(true);
      setError(null);

      try {
        const res = await fetchWithError(
          `${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(
            folderName
          )}&customerId=${encodeURIComponent(
            customerId
          )}`
        );

        if (!res.ok) {
          throw new Error(
            `API ${res.status}`
          );
        }

        const data = await res.json();

        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        /**
         * ======================================================
         * STEP 1
         * ======================================================
         *
         * Render immediately using 4:3.
         *
         * We DO NOT wait for all image dimensions.
         */
        const basic = (
          data.thumbnails || []
        ).map((t, i) => ({
          ...t,

          w: 4,
          h: 3,

          stableKey:
            t.id ||
            t.uniqueKey ||
            t.url ||
            t.thumbnailImageUrl ||
            `t-${i}`,
        }));

        setAllThumbnails(basic);

        setCurrentPage(1);

        setLoading(false);

        /**
         * ======================================================
         * STEP 2
         * ======================================================
         *
         * Load dimensions ONE BY ONE instead of:
         *
         * Promise.all(allImages)
         *
         * This is much safer for iOS Safari.
         */
        for (let i = 0; i < basic.length; i++) {
          if (
            cancelled ||
            requestId !== requestIdRef.current
          ) {
            return;
          }

          const thumbnail = basic[i];

          const cacheKey =
            thumbnail.thumbnailImageUrl ||
            thumbnail.url ||
            thumbnail.stableKey;

          /**
           * Already cached?
           */
          if (
            dimensionCacheRef.current.has(
              cacheKey
            )
          ) {
            const cached =
              dimensionCacheRef.current.get(
                cacheKey
              );

            setAllThumbnails((previous) =>
              previous.map((item) =>
                item.stableKey ===
                thumbnail.stableKey
                  ? {
                      ...item,
                      w: cached.w,
                      h: cached.h,
                    }
                  : item
              )
            );

            continue;
          }

          /**
           * Load one image.
           */
          const dimensions =
            await getImageDimensions(
              thumbnail.thumbnailImageUrl
            );

          /**
           * Save in cache.
           */
          dimensionCacheRef.current.set(
            cacheKey,
            dimensions
          );

          if (
            cancelled ||
            requestId !== requestIdRef.current
          ) {
            return;
          }

          /**
           * Update only this image.
           *
           * We don't replace the complete array
           * with Promise.all().
           */
          setAllThumbnails((previous) =>
            previous.map((item) =>
              item.stableKey ===
              thumbnail.stableKey
                ? {
                    ...item,
                    w: dimensions.w,
                    h: dimensions.h,
                  }
                : item
            )
          );
        }
      } catch (e) {
        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        console.error(e);

        setError(
          e?.message ||
            "Unable to load gallery."
        );

        setLoading(false);
      }
    };

    fetchThumbnails();

    return () => {
      cancelled = true;
    };
  }, [folderName, customerId]);

  /**
   * ============================================================
   * PAGINATION
   * ============================================================
   *
   * Pagination is NOT removed.
   *
   * iOS:
   *     15 images >= 400px
   *      9 images < 400px
   *
   * Android/Desktop:
   *     existing behavior is preserved.
   */
  const {
    currentThumbnailsOnPage,
    totalPages,
  } = useMemo(() => {
    if (!isIOSMobile) {
      return {
        currentThumbnailsOnPage:
          allThumbnails,
        totalPages: 1,
      };
    }

    const total = Math.ceil(
      allThumbnails.length /
        ITEMS_PER_PAGE
    );

    const start =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    return {
      currentThumbnailsOnPage:
        allThumbnails.slice(
          start,
          start + ITEMS_PER_PAGE
        ),

      totalPages: total,
    };
  }, [
    allThumbnails,
    currentPage,
    ITEMS_PER_PAGE,
    isIOSMobile,
  ]);

  /**
   * ============================================================
   * IMAGE CLICK
   * ============================================================
   */
  const handleImageClick = useCallback(
    (index) => {
      if (
        index >= 0 &&
        index < allThumbnails.length
      ) {
        setSelectedIndex(index);
      }
    },
    [allThumbnails.length]
  );

  /**
   * ============================================================
   * BROWSER BACK BUTTON
   * ============================================================
   */
  useEffect(() => {
    const handlePopState = () => {
      setSelectedIndex(null);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  /**
   * ============================================================
   * POPUP HISTORY
   * ============================================================
   */
  useEffect(() => {
    if (selectedIndex !== null) {
      /**
       * Don't add multiple gallery history states.
       */
      if (
        !window.history.state?.galleryPopup
      ) {
        window.history.pushState(
          { galleryPopup: true },
          ""
        );
      }
    }
  }, [selectedIndex]);

  /**
   * ============================================================
   * CLOSE POPUP
   * ============================================================
   */
  const closePopup = useCallback(() => {
    if (
      window.history.state?.galleryPopup
    ) {
      window.history.back();
    } else {
      setSelectedIndex(null);
    }
  }, []);

  /**
   * ============================================================
   * PAGINATION CHANGE
   * ============================================================
   */
  const handlepaginationChange =
    useCallback((page) => {
      setCurrentPage(page);

      /**
       * Scroll after React has rendered
       * the new page.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (galleryRef.current) {
            galleryRef.current.scrollIntoView(
              {
                behavior: "smooth",
                block: "start",
              }
            );
          } else {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        });
      });
    }, []);

  /**
   * ============================================================
   * SLIDER SETTINGS
   * ============================================================
   */
  const sliderSettings = useMemo(
    () => ({
      dots: false,

      infinite:
        allThumbnails.length > 1,

      speed: 300,

      slidesToShow: 1,

      slidesToScroll: 1,

      /**
       * Slick will only load nearby slides.
       */
      lazyLoad: "ondemand",

      adaptiveHeight: true,

      afterChange: (current) => {
        setSelectedIndex(current);
      },
    }),
    [allThumbnails.length]
  );

  /**
   * ============================================================
   * GRID RENDER
   * ============================================================
   */
  const renderGallery = () => {
    const actualW =
      galleryRef.current
        ? Math.floor(
            galleryRef.current.getBoundingClientRect()
              .width
          )
        : cw;

    const effectiveCw =
      actualW > 0
        ? Math.min(actualW, 480)
        : cw;

    if (
      !effectiveCw ||
      effectiveCw < 10
    ) {
      return null;
    }

    const gap = 6;

    let targetH;

    if (effectiveCw <= 360) {
      targetH = 120;
    } else if (effectiveCw <= 480) {
      targetH = 140;
    } else if (effectiveCw <= 768) {
      targetH = 170;
    } else {
      targetH = 210;
    }

    const allRows =
      buildJustifiedRows(
        currentThumbnailsOnPage,
        effectiveCw,
        targetH,
        gap
      );

  const result = [];

const globalOffset = isIOSMobile
  ? (currentPage - 1) * ITEMS_PER_PAGE
  : 0;

let bannerIdx = Math.floor(globalOffset / bannerInterval);
let imgCount = globalOffset;

allRows.forEach(
  (rowItems, rIdx) => {

        /**
         * ======================================================
         * ROW
         * ======================================================
         */
        result.push(
          <div
            key={`r-${currentPage}-${rIdx}`}
            style={{
              display: "flex",
              gap: `${gap}px`,
              marginBottom: `${gap}px`,
              width: `${effectiveCw}px`,
              overflow: "hidden",
            }}
          >
            {rowItems.map((thumb) => {
              const gi =
                allThumbnails.findIndex(
                  (t) =>
                    t.stableKey ===
                    thumb.stableKey
                );

              return (
                <div
                  key={thumb.stableKey}
                  onClick={() =>
                    handleImageClick(gi)
                  }
                  style={{
                    width: `${thumb.displayW}px`,
                    height: `${thumb.displayH}px`,
                    flexShrink: 0,
                    overflow: "hidden",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor:
                      "#e9ecef",
                    position: "relative",
                  }}
                >
                  <LazyImage
                    src={
                      thumb.thumbnailImageUrl
                    }
                    alt={`Photo ${
                      gi + 1
                    }`}
                    wrapperClassName="smart-image-wrapper"
                  />
                </div>
              );
            })}
          </div>
        );

        imgCount += rowItems.length;

        /**
         * ======================================================
         * BANNER
         * ======================================================
         */
        if (
          imgCount >=
            bannerInterval *
              (bannerIdx + 1) &&
          banners[bannerIdx]
        ) {
          result.push(
            <div
              key={`b-${currentPage}-${bannerIdx}`}
              style={{
                width: `${effectiveCw}px`,
                marginBottom: `${gap}px`,
              }}
            >
              {banners[bannerIdx]}
            </div>
          );

          bannerIdx++;
        }
      }
    );
  
    return result;
  };

  /**
   * ============================================================
   * LOADING
   * ============================================================
   */
  if (loading) {
    return (
      <div className="gallery-skeleton-wrapper">
        {[...Array(12)].map(
          (_, index) => (
            <div
              key={index}
              className={`gallery-skeleton skeleton-${
                (index % 4) + 1
              }`}
            />
          )
        )}
      </div>
    );
  }

  /**
   * ============================================================
   * ERROR
   * ============================================================
   */
  if (error) {
    return (
      <div className="thumbnail-gallery-status text-red-500">
        Error: {error}
      </div>
    );
  }

  /**
   * ============================================================
   * EMPTY
   * ============================================================
   */
  if (
    !loading &&
    !allThumbnails.length
  ) {
    return (
      <div className="thumbnail-gallery-status">
        No photos found.
      </div>
    );
  }

  /**
   * ============================================================
   * MAIN
   * ============================================================
   */
  return (
    <div
      ref={galleryRef}
      style={{
        width: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "block",
      }}
    >
      {/* =====================================================
          GRID
          ===================================================== */}
      {currentThumbnailsOnPage.length >
      0
        ? renderGallery()
        : null}

      {/* =====================================================
          POPUP
          ===================================================== */}
      {selectedIndex !== null &&
        allThumbnails[
          selectedIndex
        ] && (
          <div
            className="popupOverlay"
            onClick={closePopup}
          >
            <div
              className="popupContent"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="popupHeader">
                <span className="image-index">
                  {selectedIndex + 1} /{" "}
                  {allThumbnails.length}
                </span>

                <button
                  className="closeButton"
                  onClick={closePopup}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <Slider
                ref={sliderRef}
                {...sliderSettings}
                initialSlide={
                  selectedIndex
                }
              >
                {allThumbnails.map(
                  (t, i) => (
                    <div
                      key={
                        t.stableKey || i
                      }
                      className="popupSlide"
                    >
                      <img
                        src={
                          t.originalUrl ||
                          t.url
                        }
                        alt={`Photo ${
                          i + 1
                        }`}
                        className="popupImage"
                        loading={
                          Math.abs(
                            i -
                              selectedIndex
                          ) <= 1
                            ? "eager"
                            : "lazy"
                        }
                        decoding="async"
                      />
                    </div>
                  )
                )}
              </Slider>
            </div>
          </div>
        )}

      {/* =====================================================
          BOTTOM PAGINATION
          ===================================================== */}
      {totalPages > 1 && (
        <div className="gallery-header">
          <div className="gallery-header-content">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={
                handlepaginationChange
              }
              inline
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGallery;
