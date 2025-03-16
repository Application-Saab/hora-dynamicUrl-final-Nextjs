"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';
import './gallery.css';
import photogallryIcon from '../../assets/gallry-loading.gif';
import downloadIcon from '../../assets/download.png';

const ThumbnailGallery = ({ folderName, customerId }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(""); // State to store the download URL for the selected image

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await fetch(
          `https://horaservices.com:3000/api/photo/thumbnailsWithinProject?folderName=${folderName}&customerId=${customerId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch thumbnails");
        }
        const data = await response.json();
        setThumbnails(data.thumbnails || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchThumbnails();
  }, [folderName, customerId]);

 

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    // Set the download URL when an image is clicked (only if the original URL is available)
    const thumbnailKey = thumbnails[index]?.key;
  };

  const closePopup = () => {
    setSelectedIndex(null);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedIndex,
  };

  return (
    <div className="thumbnail-gallery">
      {loading && (
        <p className="loader-photo">
          <Image src={photogallryIcon} alt="Loading icon" width={200} />
        </p>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="masonryGrid">
        {thumbnails.length > 0 ? (
          thumbnails.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail.url}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail"
              onClick={() => handleImageClick(index)}
            />
          ))
        ) : (
          !loading && <p>No thumbnails found.</p>
        )}
      </div>

      {selectedIndex !== null && (
        <div className="popupOverlay" onClick={closePopup}>
          <div className="popupContent" onClick={(e) => e.stopPropagation()}>
            {/* Popup Header */}
            <div className="popupHeader">
              <button className="closeButton" onClick={closePopup}>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="arrow-left"
                  className="svg-inline--fa fa-arrow-left fa-xl closeEffect"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="#bfbfbf"
                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                  ></path>
                </svg>
              </button>
              <p className="image-index">
                {/* {selectedIndex + 1} / {thumbnails.length} */}
                {thumbnails.length} Photos
              </p>
            </div>

            <Slider {...sliderSettings} initialSlide={selectedIndex}>
              {thumbnails.map((thumbnail, index) => (
                <ul key={index}>
                  <li>
                    <img
                      src={thumbnail.url}
                      alt="Original"
                      className="popupImage"
                    />
                  </li>
                </ul>
              ))}
            </Slider>

            {/* Popup Footer */}
            <div className="popupFooter">
              {/* Download Button */}
              {/* {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  className="downloadButton"
                >
                  <span>Download Image</span>
                  <Image src={downloadIcon} width={15} height={15} />
                </a>
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGallery;
