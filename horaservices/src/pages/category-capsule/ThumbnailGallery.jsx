"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import "../../pages/weblink-gallery/gallery.css";
import HeaderCards from "./HeaderCards";
import CommonImagePopup from "@/components/CommonImagePopup";
import ImageGrid from "@/components/image-galleries/ImageGrid";
import { getImagesbyFolderName } from "@/services/categoryCapsuleServices";
import whiteShareIcon from "../../assets/whiteShareIcon.svg";
import { fetchWithError } from "@/utils/fetchWithError";
import { BASE_URL } from "@/utils/apiconstants";
import capsuleTopBanner from "../../assets/capsuleTopBanner.svg";
import HeaderCardsFlashLoader from "@/components/Gallery/HeaderCardsFlashLoader";
import PaginationControls from "../../pages/weblink-gallery/capsulePagination";

const SKELETON_COUNT = 6;
const ITEMS_PER_PAGE = 24;

function getBlockType(index) {
  const pos = index % 6;

  if (pos === 0 || pos === 1 || pos === 2) return "small";
  if (pos === 3) return "big";
  if (pos === 4) return "small-right-top";
  return "small-right-bottom";
}

function getSrcKey(src) {
  return typeof src === "string" ? src : src?.src || "";
}

const mapImages = (list = []) =>
  list.map((image, index) => ({
    ...image,
    stableKey: image._id || index,
  }));

const cacheKey = (folderId, page) => `${folderId}:${page}`;

function GridSkeleton() {
  return (
    <div className="thumbnail-gallery-content">
      <div className="gallery-image-grid">
        {[...Array(SKELETON_COUNT)].map((_, index) => (
          <div key={index} className={`grid-item ${getBlockType(index)}`}>
            <div className="event-masonry-item">
              <div className="event-lazy-image-spinner-container placeholder-glow">
                <div className="placeholder w-100 h-100"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThumbnailGallery({ galleryId }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [capsuleBannerImageurl, setCapsulebannerImageurl] = useState("");
  const [loadedBannerKey, setLoadedBannerKey] = useState("");

  const [subFolders, setSubFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const [isIOS, setIsIOS] = useState(false);
  const [deviceChecked, setDeviceChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCache, setPageCache] = useState({}); 
  const [totalPagesMap, setTotalPagesMap] = useState({}); 

  const bannerRef = useRef(null);
  const firstFolderIdRef = useRef(null); 
  const latestRequestRef = useRef(""); 

  const bannerSrc = capsuleBannerImageurl || capsuleTopBanner;
  const bannerKey = getSrcKey(bannerSrc);
  const isBannerLoading = loadedBannerKey !== bannerKey;

  const markBannerLoaded = useCallback(() => {
    setLoadedBannerKey(bannerKey);
  }, [bannerKey]);

  useEffect(() => {
    const img = bannerRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoadedBannerKey(bannerKey);
    }
  }, [bannerKey, initialLoading]);

  useEffect(() => {
    const ios =
      typeof navigator !== "undefined" &&
      /iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream;

    setIsIOS(ios);
    setDeviceChecked(true);
  }, []);

  const fetchFolderPage = useCallback(
    async (folderId, page) => {
      if (String(folderId) === String(firstFolderIdRef.current)) {
        const data = await getImagesbyFolderName({
          galleryId,
          ...(isIOS && { page, limit: ITEMS_PER_PAGE }),
        });

        return {
          images: mapImages(data?.thumbnails),
          totalPages: data?.pagination?.totalPages || 1,
        };
      }

      const params = new URLSearchParams({ galleryId: folderId });
      if (isIOS) {
        params.set("page", String(page));
        params.set("limit", String(ITEMS_PER_PAGE));
      }

      const response = await fetchWithError(
        `${BASE_URL}/api/internal/imageby-galleryId?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch folder images");
      }

      return {
        images: mapImages(Array.isArray(data) ? data : data?.thumbnails),
        totalPages: data?.pagination?.totalPages || 1,
      };
    },
    [galleryId, isIOS]
  );

  useEffect(() => {
    if (!deviceChecked) return;

    let isMounted = true;

    const fetchGallery = async () => {
      if (!galleryId) {
        setError("galleryId is missing.");
        setInitialLoading(false);
        return;
      }

      setInitialLoading(true);
      setError("");
      setCurrentPage(1);
      setPageCache({});
      setTotalPagesMap({});

      try {
        const data = await getImagesbyFolderName({
          galleryId,
          ...(isIOS && { page: 1, limit: ITEMS_PER_PAGE }),
        });

        if (!isMounted) return;

        const galleries = data?.capsule?.galleryFolders || [];
        setSubFolders(galleries);

        const reversedGalleries = [...galleries].reverse();

        const firstGallery = reversedGalleries[0];
        const firstGalleryId = firstGallery?.galleryId;

        firstFolderIdRef.current = firstGalleryId || null;
        latestRequestRef.current = firstGalleryId
          ? cacheKey(firstGalleryId, 1)
          : "";

        setCapsulebannerImageurl(firstGallery?.bannerImageUrl || "");
        setSelectedFolderId(firstGalleryId || null);

        if (firstGalleryId) {
          setPageCache({
            [cacheKey(firstGalleryId, 1)]: mapImages(data?.thumbnails),
          });
          setTotalPagesMap({
            [firstGalleryId]: data?.pagination?.totalPages || 1,
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch gallery error:", err);
          setError(err?.message || "Unable to load images.");
        }
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    fetchGallery();

    return () => {
      isMounted = false;
    };
  }, [galleryId, deviceChecked, isIOS]);

  const loadPage = useCallback(
    async (folderId, page) => {
      const key = cacheKey(folderId, page);
      latestRequestRef.current = key;

      if (pageCache[key]) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { images, totalPages } = await fetchFolderPage(folderId, page);

        setPageCache((prev) => ({ ...prev, [key]: images }));
        setTotalPagesMap((prev) => ({ ...prev, [folderId]: totalPages }));
      } catch (err) {
        console.error("Folder images API error:", err);
        if (latestRequestRef.current === key) {
          setError(err?.message || "Unable to load folder images.");
        }
      } finally {
        if (latestRequestRef.current === key) {
          setLoading(false);
        }
      }
    },
    [pageCache, fetchFolderPage]
  );

  const handleFolderSelect = useCallback(
    (folderId) => {
      setSelectedFolderId(folderId);
      setCurrentPage(1);
      setSelectedIndex(null);
      setError("");

      const selectedGallery = subFolders.find(
        (folder) => String(folder.galleryId) === String(folderId)
      );
      setCapsulebannerImageurl(selectedGallery?.bannerImageUrl || "");

      loadPage(folderId, 1);
    },
    [subFolders, loadPage]
  );

  // Page change
  const handlePageChange = useCallback(
    (pageNumber) => {
      setCurrentPage(pageNumber);
      setSelectedIndex(null);
      loadPage(selectedFolderId, pageNumber);

      setTimeout(() => {
        const galleryHeader = document.querySelector(".gallery-header");
        if (galleryHeader) {
          galleryHeader.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    },
    [selectedFolderId, loadPage]
  );

  const visibleImages =
    pageCache[cacheKey(selectedFolderId, currentPage)] || [];
  const totalPages = totalPagesMap[selectedFolderId] || 1;

  const handleImageShare = async (image) => {
    const imageUrl = image?.originalUrl || image?.imageUrl;

    if (!imageUrl) {
      alert("Image link is not available.");
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Photo",
          text: "Check out this photo!",
          url: imageUrl,
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        alert("Image link copied!");
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  };

  const closePopup = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  if (error) {
    return (
      <div className="thumbnail-gallery-status" role="alert">
        {error}
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="thumbnail-gallery">
        <HeaderCardsFlashLoader showButtoLoaderShow={false} />
        <div style={{ minHeight: "500px" }}>
          <GridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="thumbnail-gallery">
      <div style={{ position: "relative" }}>
        <Image
          ref={bannerRef}
          src={bannerSrc}
          alt="banner"
          className="top-banner-image"
          width={800}
          height={200}
          onLoad={markBannerLoaded}
          onError={markBannerLoaded}
          priority
        />

        {isBannerLoading && (
          <div
            className="placeholder-glow"
            style={{
              position: "absolute",
              top: "10px",
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <span
              className="placeholder"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                backgroundColor: "#e9ecef",
              }}
            />
          </div>
        )}
      </div>

      <div className="thumbnail-gallery-content">
        <HeaderCards
          subFolders={subFolders}
          activeTab={selectedFolderId}
          onSelectSubFolder={handleFolderSelect}
        />
      </div>

      <div style={{ minHeight: "500px" }}>
        {loading ? (
          <GridSkeleton />
        ) : visibleImages.length === 0 ? (
          <div className="thumbnail-gallery-status">No photos found.</div>
        ) : (
          <div className="thumbnail-gallery-content">
            <ImageGrid
              data={visibleImages}
              loading={loading}
              isEventWall={false}
              handleSelectImage={() => { }}
              handleImageClick={(index) => setSelectedIndex(index)}
              isEditing={false}
              isSearchMode={false}
              activeSubFolderId={selectedFolderId}
              isActualMyPhotos={false}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
          </div>
        )}
      </div>

      {isIOS && totalPages > 1 && (
        <div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            inline={true}
          />
        </div>
      )}

      <CommonImagePopup
        images={visibleImages}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onClose={closePopup}
        renderFooter={(image) => (
          <div className="imagepopup-footer">
            <div className="imagepopup-footer-left">
              <div>
                <Image
                  src={whiteShareIcon}
                  alt="Share"
                  width={30}
                  height={32}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleImageShare(image)}
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
