import React, { useEffect, useState } from "react";
import CustomModal from "../common/CustomModal";
import CameraIcon from "@/assets/wonderland/UploadPhotosCamera.svg";
import GalleryIcon from "@/assets/wonderland/UploadPhotosGallery.svg";
import BulkUploadIcon from "@/assets/wonderland/UploadPhotosBulkUpload.svg";
import "./EventWall.css";
import Image from "next/image";
import CustomButton from "../common/CustomButton";
import useApi from "@/hooks/useApi";
import { uploadImage, uploadVideo } from "@/utils/handleMediaUpload";
import { CREATE_NEW_POST } from "@/utils/apiconstants";
import ImageCropper from "./ImageCropper";

const UploadPhotoModal = ({
  isOpen,
  onClose,
  eventid,
  userId,
  userData,
  setAllImages,
}) => {
  const { makeRequest: createPost } = useApi();
  const [selectedOption, setSelectedOption] = useState(null);
  const [driveLink, setDriveLink] = useState("");
  const [driveUploadError, setDriveUploadError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [showCropImageModal, setShowCropImageModal] = useState(false);

  let activeUploads = 0;
  let uploadQueue = [];

  const updateProgress = (id, percent) => {
    setAllImages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress: percent } : item
      )
    );
  };

  const updateStatus = (id, status) => {
    setAllImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const updateUploadedUrls = (id, postUrl, thumbnailUrl) => {
    setAllImages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, postUrl, postWebpUrl: thumbnailUrl } : item
      )
    );
  };

  const handleUploadPictureClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.capture = selectedOption === 2 ? "environment" : "camera";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);

      const tempItems = files.map((file) => {
        const isVideo = file.type.startsWith("video");
        const localPreview = URL.createObjectURL(file);

        return {
          id: Math.random().toString(36).substring(2),
          file,
          localPreview,
          isVideo,
          progress: 0,
          status: "queued",
          postUrl: null,
          postWebpUrl: null,
        };
      });

      // Show instantly
      setAllImages((prev) => [...tempItems, ...prev]);
      // setSelectedImages((prev) => [...tempItems, ...prev]);

      // Add to queue
      uploadQueue.push(...tempItems);
      onClose();

      // Start 5 parallel workers
      for (let i = 0; i < 5; i++) {
        processNextUpload();
      }
    };

    input.click();
  };

  async function handleSingleUpload(tempItem) {
    const { file, id, isVideo } = tempItem;

    try {
      updateStatus(id, "uploading");

      let uploadResult;

      if (isVideo) {
        uploadResult = await uploadVideo(
          file,
          userId,
          eventid,
          "self-upload",
          (percent) => updateProgress(id, percent)
        );
      } else {
        uploadResult = await uploadImage(
          file,
          userId,
          eventid,
          "self-upload",
          (percent) => updateProgress(id, percent)
        );
      }

      if (!uploadResult.success) {
        updateStatus(id, "error");
        return;
      }

      updateUploadedUrls(
        id,
        uploadResult.originalUrl,
        uploadResult.thumbnailUrl
      );

      // Create DB post
      const postPayload = {
        postById: userId,
        postByName: userData?.name || "Guest",
        postType: "selfUploaded",
        postUrl: uploadResult.originalUrl,
        postKey: uploadResult.originalKey,
        postWebpUrl: uploadResult.thumbnailUrl,
        postWebpKey: uploadResult.thumbnailKey,
      };

      await createPost(`${CREATE_NEW_POST}/${eventid}`, "POST", postPayload);

      updateStatus(id, "done");
    } catch (err) {
      console.error(err);
      updateStatus(id, "error");
    }
  }

  async function processNextUpload() {
    if (activeUploads >= 5) return;
    if (uploadQueue.length === 0) return;

    const nextItem = uploadQueue.shift();
    activeUploads++;

    handleSingleUpload(nextItem).finally(() => {
      activeUploads--;
      processNextUpload();
    });
  }

  const handleClickOption = (optionId) => {
    setSelectedOption(optionId);
    if (optionId === 1 || optionId === 2) {
      handleUploadPictureClick();
    }
  };

  // useEffect(() => {
  //   if (selectedImages.length > 0) {
  //     setShowCropImageModal(true);
  //   }
  // }, [selectedImages]);

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title="Upload Photos"
        verticalCenter={false}
        bodyClass="upload-photos-modal-body"
        backdropClass={showCropImageModal ? "d-none" : ""}
        body={
          <>
            <div className="upload-option-row d-flex justify-content-between align-items-center w-100">
              <div
                className="upload-option-col d-flex flex-column align-items-center"
                onClick={() => handleClickOption(1)}
              >
                <Image src={CameraIcon} alt="Camera" />
                <p className="">Camera</p>
              </div>
              <div
                className="upload-option-col d-flex flex-column align-items-center"
                onClick={() => handleClickOption(2)}
              >
                <Image src={GalleryIcon} alt="Camera" />
                <p className="">Gallery</p>
              </div>
              <div
                className="upload-option-col d-flex flex-column align-items-center"
                onClick={() => handleClickOption(3)}
              >
                <Image src={BulkUploadIcon} alt="Camera" />
                <p className="">Bulk Upload</p>
              </div>
            </div>
            {selectedOption === 3 && (
              <>
                <div className="bulk-upload-body">
                  <p className="bulk-upload-instruction">
                    Just share your Google Drive link to auto-upload every
                    photo.
                  </p>
                </div>

                <div className="w-100">
                  <textarea
                    id="driveLink"
                    className="bulk-upload-input w-100"
                    placeholder="Paste Google Drive link here"
                    rows={1}
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>
                {driveUploadError && (
                  <div>
                    <p className="bulk-upload-error-text">{driveUploadError}</p>
                  </div>
                )}
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "28.93px" }}
                >
                  <CustomButton title="Submit" />
                </div>
              </>
            )}
          </>
        }
      />
      <ImageCropper
        isOpen={showCropImageModal}
        onClose={() => setShowCropImageModal(false)}
        selectedImages={selectedImages}
      />
    </>
  );
};

export default UploadPhotoModal;
