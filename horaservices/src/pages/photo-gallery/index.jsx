"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import { galleryPhoto } from "./gallery";
import "./gallery.css";

export default function Gallery() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [compressedPhotos, setCompressedPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // For popup modal
  const [rotation, setRotation] = useState(0); // Rotation state
  const [userPhotos, setUserPhotos] = useState([]); // Store filtered photos

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    const mobileNumber = localStorage.getItem("mobileNumber"); // Retrieve mobile number from localStorage

    setIsLoggedIn(loggedInStatus === "true");

    if (loggedInStatus === "true" && mobileNumber) {
      console.log("mobileNumber from localStorage:", mobileNumber); // Log the mobile number
      // Parse mobileNumber to an integer for comparison, ensure it's treated as a number
      const mobileNumberInt = parseInt(mobileNumber, 10);

      // Find the gallery associated with this mobileNumber
      const userGallery = galleryPhoto.find(
        (gallery) => gallery.customerNumber === mobileNumberInt
      );
      
      console.log("userGallery:", userGallery); // Log the found gallery data

      if (userGallery) {
        setUserPhotos(userGallery.photos); // Set the filtered photos for this mobileNumber
      } else {
        console.log("No gallery found for this mobile number.");
      }
    }
  }, []);

  const fetchImageAsBlob = async (relativeUrl) => {
    const absoluteUrl = `${window.location.origin}${relativeUrl}`;
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  };

  const compressImages = async (photos) => {
    const compressedImages = await Promise.all(
      photos.map(async (photo) => {
        try {
          const blob = await fetchImageAsBlob(photo.url);
          return new Promise((resolve) => {
            Resizer.imageFileResizer(
              blob,
              480,
              320,
              "JPEG",
              80,
              0,
              (uri) => {
                resolve({ id: photo.id, url: uri });
              },
              "base64"
            );
          });
        } catch (error) {
          console.error("Image compression error:", error);
          return { id: photo.id, url: photo.url };
        }
      })
    );
    setCompressedPhotos(compressedImages);
  };

  useEffect(() => {
    if (userPhotos.length > 0) {
      compressImages(userPhotos);
    }
  }, [userPhotos]);

  return (
    <>
      {isLoggedIn ? (
        <div className="masonry">
          {compressedPhotos.map((photo, index) => (
            <div
              className="images masonry-item"
              key={photo.id}
              onClick={() => setSelectedImage(userPhotos[index])} // Show modal with original image
              style={{ cursor: "pointer" }}
            >
              <Image
                src={photo.url}
                width={480}
                height={320}
                sizes="100vw"
                alt={`Gallery Image ${photo.id}`}
              />
            </div>
          ))}

          {/* Popup Modal for Zooming Image */}
          {selectedImage && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedImage(null)} // Close modal on overlay click
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
              >
                <button
                  className="close-button"
                  onClick={() => {
                    setSelectedImage(null); // Close modal
                    setRotation(0); // Reset rotation to 0
                  }}
                >
                  ✖
                </button>

                {/* Image Container with Rotation */}
                <div className="image-container">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    width={960}
                    height={600}
                    style={{
                      transform: `rotate(${rotation}deg)`, // Apply rotation
                      transition: "transform 0.3s ease-in-out", // Smooth rotation
                    }}
                    className="modal-image"
                  />
                </div>

                {/* Buttons for Rotation and Download */}
                <div className="button-container">
                  <button
                    className="rotate-button"
                    onClick={() => setRotation(rotation + 90)} // Increment rotation by 90 degrees
                  >
                    Rotate
                  </button>
                  <a
                    href={selectedImage.url} // Link to the original image
                    download={selectedImage.name} // Suggested download filename
                    className="download-button"
                  >
                    Download Original
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>Not Logged In</div>
      )}
    </>
  );
}
