// Your existing ThumbnailGallery.js file
"use client";
import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
// Make sure these CSS files are imported if you uncomment them in your original code
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image'; // Next/Image for icons
import './gallery.css'; // Ensure this path is correct
import photogallryIcon from '../../assets/gallry-loading.gif'; // Ensure this path is correct
import downloadIcon from '../../assets/download.png'; // Ensure this path is correct
import LazyImage from '../../components/LazyImage'; // Import the new component (adjust path if needed)

const ThumbnailGallery = ({ folderName, customerId }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  // const [downloadUrl, setDownloadUrl] = useState(""); // Keep if you plan to implement download

  useEffect(() => {
    const fetchThumbnails = async () => {
      setLoading(true); // Set loading true at the beginning of fetch
      setError(null); // Reset error
      try {
        const response = await fetch(
          `https://horaservices.com:3000/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}&customerId=${encodeURIComponent(customerId)}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch thumbnails. Status: ${response.status}`);
        }
        const data = await response.json();
        setThumbnails(data.thumbnails || []);
      } catch (error) {
        console.error("Fetch thumbnails error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (folderName && customerId) { // Only fetch if props are available
      fetchThumbnails();
    } else {
      setThumbnails([]); // Clear thumbnails if props are missing
      setLoading(false);
    }
  }, [folderName, customerId]); // folderName and customerId are dependencies

  const handleImageClick = useCallback((index) => {
    setSelectedIndex(index);
    // If you want to set download URL based on the selected image:
    // const selectedThumbnail = thumbnails[index];
    // if (selectedThumbnail && selectedThumbnail.originalUrl) { // Assuming you have an 'originalUrl' or similar
    //   setDownloadUrl(selectedThumbnail.originalUrl);
    // } else if (selectedThumbnail && selectedThumbnail.url) {
    //   setDownloadUrl(selectedThumbnail.url); // Fallback to thumbnail url if no original
    // }
  }, []); // No direct dependencies on thumbnails here, selectedIndex is local

  const closePopup = useCallback(() => {
    setSelectedIndex(null);
    // setDownloadUrl(""); // Clear download URL when popup closes
  }, []);

  // Memoize slider settings to prevent re-creation on every render
  // Note: initialSlide will cause the slider to re-initialize if selectedIndex changes while it's visible.
  // This is generally fine.
  const sliderSettings = React.useMemo(() => ({
    dots: false,
    infinite: thumbnails.length > 1, // Only infinite if more than 1 image
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // initialSlide: selectedIndex, // Set this directly on the Slider component when it's rendered
    lazyLoad: 'ondemand', // For react-slick internal lazy loading
    // afterChange: (current) => {
    //   // If you need to update download URL as slider changes
    //   const selectedThumbnail = thumbnails[current];
    //   if (selectedThumbnail && selectedThumbnail.originalUrl) {
    //     setDownloadUrl(selectedThumbnail.originalUrl);
    //   } else if (selectedThumbnail && selectedThumbnail.url) {
    //     setDownloadUrl(selectedThumbnail.url);
    //   }
    // }
  }), [thumbnails.length]);


  if (loading) {
    return (
      <div className="thumbnail-gallery-status">
        <Image src={photogallryIcon} alt="Loading..." width={200} height={200} priority />
      </div>
    );
  }

  if (error) {
    return <div className="thumbnail-gallery-status text-red-500">Error: {error}</div>;
  }

  if (thumbnails.length === 0) {
    return <div className="thumbnail-gallery-status">No thumbnails found.</div>;
  }

  return (
    <div className="thumbnail-gallery">
      <div className="masonryGrid">
        {thumbnails.map((thumbnail, index) => (
          <LazyImage
            key={thumbnail.key || thumbnail.url || index} // Prefer a stable key from data
            src={thumbnail.url}
            alt={`Thumbnail ${index + 1}`}
            className="thumbnail" // This class will be applied to the inner <img>
            onClick={() => handleImageClick(index)}
            // You can pass a placeholderStyle to LazyImage if needed, e.g. for aspect ratio
            // placeholderStyle={{ paddingTop: '75%' }} // for a 4:3 aspect ratio placeholder
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="popupOverlay" onClick={closePopup}>
          <div className="popupContent" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <button className="closeButton" onClick={closePopup} aria-label="Close popup">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="svg-inline--fa fa-arrow-left fa-xl closeEffect"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor" // Use currentColor for better theming
                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H109.2l105.5-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                  />
                </svg>
              </button>
              <p className="image-index">
                {/* Display current image index in slider if desired */}
                {/* {selectedIndex + 1} / {thumbnails.length} */}
                {thumbnails.length} Photo{thumbnails.length === 1 ? '' : 's'}
              </p>
              {/* Optional: Add a download button for the currently active slide here if needed */}
            </div>

            {/* Conditionally render Slider only when selectedIndex is not null to ensure initialSlide works */}
            <Slider {...sliderSettings} initialSlide={selectedIndex} key={selectedIndex}>
              {thumbnails.map((thumbnail, index) => (
                // The div wrapper for react-slick items is common
                <div key={thumbnail.key || thumbnail.url || index} className="slick-slide-item">
                  <img
                    src={thumbnail.url} // Or thumbnail.originalUrl if available for higher quality
                    alt={`Enlarged ${index + 1}`}
                    className="popupImage"
                  />
                </div>
              ))}
            </Slider>

            {/* Popup Footer - Download button can be reactivated here */}
            {/* <div className="popupFooter">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download // This attribute suggests the browser to download the linked URL
                  className="downloadButton"
                  // For actual S3 or similar, you might need a pre-signed URL for download
                  // and the 'download' attribute might need the filename.
                  // download={`image-${selectedIndex + 1}.jpg`} 
                >
                  <span>Download Image</span>
                  <Image src={downloadIcon} alt="Download" width={15} height={15} />
                </a>
              )}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGallery;