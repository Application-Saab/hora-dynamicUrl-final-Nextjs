// ThumbnailGallery.js
"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "./gallery.css";
import ImageGrid from "@/components/image-galleries/ImageGrid";
import { getImagesbyFolderName } from "@/services/weblinkServices";
import PaginationControls from "./capsulePagination";

const forceGarbageCollection = () => {
  if (typeof window !== "undefined") {
    const activeImages = document.querySelectorAll(".thumbnail-gallery img");
    activeImages.forEach((img) => {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    });
  }
};

const ThumbnailGallery = ({
  folderName,
  customerId,
  showInternalTitle = true,
  handleShareicon,
  handleImageClick
}) => {
  const [allThumbnails, setAllThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isActualMyPhotos, setIsActualMyPhotos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isIOSMobile, setIsIOSMobile] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef(null);
  const [totalPages2, setTotalPages] = useState(10);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const detectIOSMobile = () => {
      if (typeof window !== 'undefined' && navigator) {
        return /iPhone|iPod|iPad/.test(navigator.userAgent) && !window.MSStream;
      }
      return false;
    };
    setIsIOSMobile(detectIOSMobile()); 
  }, []);

  const getItemsPerPage = useCallback(() => {
    return 24;
  }, []);

  const [ITEMS_PER_PAGE, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getItemsPerPage]);

  const handleSelectImage = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedImages((prev) => [...prev, id]);
    }
  };

  const visibleThumbnails = useMemo(() => {
    return allThumbnails;
  }, [allThumbnails]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!folderName || !customerId) {
        setAllThumbnails([]);
        setLoading(false);
        return;
      }

      if (page === 1) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const data = await getImagesbyFolderName({
          folderName,
          customerId,
          subFolderId: null,
          page: page,
          limit: ITEMS_PER_PAGE,
        });

        const fetchedThumbnails = (data.thumbnails || [])
          .map((thumb, index) => ({ ...thumb, stableKey: thumb._id || index }));

        setTotalPages(data?.pagination?.totalPages || 10);

        if (isIOSMobile) {
          setAllThumbnails([]);
          setTimeout(() => {
            setAllThumbnails(fetchedThumbnails);
            setIsTransitioning(false);
          }, 50); 
        } else {
          setAllThumbnails((prev) => {
            const existingIds = new Set(prev.map(item => item._id));
            const newItems = fetchedThumbnails.filter(item => !existingIds.has(item._id));
            return [...prev, ...newItems];
          });
        }

        if (fetchedThumbnails.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (fetchError) {
        console.error("Error fetching images: ", fetchError);
        setIsTransitioning(false);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchThumbnails();
  }, [folderName, customerId, page, ITEMS_PER_PAGE, isIOSMobile]);

  useEffect(() => {
    const currentObserver = observerRef.current;
    if (!currentObserver || isIOSMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasMore &&
          !loading &&
          !isFetchingMore
        ) {
          setIsFetchingMore(true);
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(currentObserver);
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
      observer.disconnect();
    };
  }, [hasMore, loading, isFetchingMore, isIOSMobile]);

  const { currentThumbnailsOnPage } = useMemo(() => {
    return { currentThumbnailsOnPage: visibleThumbnails };
  }, [visibleThumbnails]);

  const handlePageChange = useCallback((pageNumber) => {
    if (isIOSMobile) {
      setIsTransitioning(true); 
      setAllThumbnails([]);     

      setTimeout(() => {
        forceGarbageCollection();
      }, 0);
    }

    setCurrentPage(pageNumber);
    setPage(pageNumber);

    setTimeout(() => {
      const galleryHeader = document.querySelector('.gallery-header');
      if (galleryHeader) {
        galleryHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, [isIOSMobile]);

  function getBlockType(index) {
    const pos = index % 6;
    if (pos === 0 || pos === 1 || pos === 2) return "small";
    if (pos === 3) return "big";
    if (pos === 4) return "small-right-top";
    if (pos === 5) return "small-right-bottom";
  }

  const pageOffset = isIOSMobile ? (currentPage - 1) * ITEMS_PER_PAGE : 0;
  const thumbnailsToRender = currentThumbnailsOnPage;

  const first18Images = thumbnailsToRender.slice(0, 18);
  const remainingImages = thumbnailsToRender.slice(18);

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const imageChunks = chunkArray(first18Images, 6);

  return (
    <div className="thumbnail-gallery">
      <div>
        <div className="thumbnail-gallery-content">
          <div>
            {(loading || isFetchingMore || isTransitioning) && (
              <div className="gallery-image-grid">
                {[...Array(12)].map((_, index) => {
                  const type = getBlockType(index);
                  return (
                    <div key={index} className={`grid-item ${type}`}>
                      <div className="event-masonry-item">
                        <div className="event-lazy-image-spinner-container placeholder-glow">
                          <div className="placeholder w-100 h-100"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isTransitioning && (
              <div style={{ minHeight: "500px" }}>
                {imageChunks.map((chunk, index) => (
                  <React.Fragment key={index}>
                    <ImageGrid
                      data={chunk}
                      loading={loading}
                      isEventWall={false}
                      handleSelectImage={handleSelectImage}
                      handleImageClick={(indexOnPage) => {
                        if (typeof handleImageClick === 'function') {
                          if (isIOSMobile) {
                            const clickedImageId = chunk[indexOnPage]?._id;
                            const actualIndex = allThumbnails.findIndex(img => img._id === clickedImageId);
                            handleImageClick(actualIndex >= 0 ? actualIndex : indexOnPage);
                          } else {
                            handleImageClick(pageOffset + (index * 6) + indexOnPage);
                          }
                        }
                      }}
                      isEditing={false}
                      isSearchMode={false}
                      activeSubFolderId={11111}
                      isActualMyPhotos={isActualMyPhotos}
                      selectedImages={selectedImages}
                      setSelectedImages={setSelectedImages}
                    />
                  </React.Fragment>
                ))}

                {remainingImages && remainingImages.length > 0 && (
                  <ImageGrid
                    data={remainingImages}
                    loading={loading}
                    isEventWall={false}
                    handleSelectImage={handleSelectImage}
                    handleImageClick={(indexOnPage) => {
                      if (typeof handleImageClick === 'function') {
                        if (isIOSMobile) {
                          const clickedImageId = remainingImages[indexOnPage]?._id;
                          const actualIndex = allThumbnails.findIndex(img => img._id === clickedImageId);
                          handleImageClick(actualIndex >= 0 ? actualIndex : indexOnPage);
                        } else {
                          handleImageClick(pageOffset + 18 + indexOnPage);
                        }
                      }
                    }}
                    isEditing={false}
                    isSearchMode={false}
                    activeSubFolderId={1111}
                    isActualMyPhotos={isActualMyPhotos}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div ref={observerRef} style={{ height: "10px" }} />
          {isIOSMobile && totalPages2 > 1 && (
            <div>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages2}
                onPageChange={handlePageChange}
                inline={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGallery;