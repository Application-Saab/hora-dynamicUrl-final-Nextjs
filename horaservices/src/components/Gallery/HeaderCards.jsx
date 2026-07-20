"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import "./headerCards.css";

import myPhoto from "../../assets/myPhotos.svg";
import allPhotos from "../../assets/allPhotos.svg";
import captureIcon from "../../assets/captureIcon.svg";
import userIcon from "../../assets/userIcon.svg";
import imagePicker from "../../assets/imagePicker.svg";
import selfieCapture from "../../assets/selfieCapture.png";
import user2 from '../../assets/user2.svg';
import { createSubfolder, updateSubfolderDP } from "@/services/weblinkServices";
import Image from "next/image";
import CommonPopup from "../../components/CommonPop";
import { FACE_FINDER_URL } from '../../utils/apiconstants'
import LockerFolderIcon from "../../assets/my_locker_folder_icon.svg";
import { useUserDetailsStore } from "@/hooks/UserDetailsContext";
import LoginModal from "../wonderland/common/login/LoginModal";
import { fetchWithError } from "@/utils/fetchWithError";

const HeaderCards = ({
  folderName,
  mainFolderId,
  customerId,
  setIsSearching,
  onSearchResults,
  subFolders,
  onSelectSubFolder,
  onSubFolderCreated,
  onNewFolderActivate,
  showCreateFolderPopup,
  setShowCreateFolderPopup,
  pendingAssignImageId,
  setPendingAssignImageId,
  setAllThumbnails,
  activeTab,
  setActiveTab,
  setIsActualMyPhotos,
  setIsStremSearching,
  setSubFolders,
  setIsRefreshShow,
  isEditingDP,
  setIsEditingDP,
  showCameraPopup,
  setShowCameraPopup,
  setCapturedImage,
  capturedImage,
  matchedKeys,
  setIsPrivateFolder
}) => {
  /* ================= STATE ================= */
  const [newFolderName, setNewFolderName] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [localMyPhotos, setLocalMyPhotos] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [localPrivateLocker, setLocalPrivateLocker] = useState(null);
   const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifiedOTP, setIsVerifiedOTP] = useState(false);
    const { userDetails, refetchUser } = useUserDetailsStore();

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const localUserId = localStorage.getItem("userID");
  const localPhoneNumber = localStorage.getItem("mobileNumber")

  /* ================= DERIVED ================= */
  const myPhotosFolder = useMemo(
    () =>
      localMyPhotos ||
      subFolders.find(
        sf => sf.type === "my_photos" && sf.userId === localUserId
      ),
    [localMyPhotos, subFolders, localUserId]
  );

  const privateLocker = useMemo(
    () =>
      localPrivateLocker ||
      subFolders.find(
        (sf) =>
          sf.type === "others" &&
          sf.userId === localUserId &&
          sf.isLocker === true,
      ),
    [localPrivateLocker, subFolders, localUserId],
  );


  useEffect(() => {
    if (showCameraPopup) {
      setCapturedImage(null);
    }
  }, [showCameraPopup]);

  const isCreateDisabled =
    !newFolderName.trim() || isLoading;

  const isCaptureDisabled =
    !cameraReady || isCreating || isLoading;

  /* ================= ALBUM LIST ================= */
  useEffect(() => {
    const mapped = subFolders
      .filter((sf) => sf.type === "others" && sf.isLocker !== true && sf.isLocker !== "true")
      .map((sf) => ({
        _id: sf._id,
        name: sf.folderName, 
        folderDp: {
          thumbnailUrl: sf.folderDp?.thumbnailUrl,
        },
        isPersonFolder: sf?.isPersonFolder || false,
        personCount: sf?.personCount || 0,
      }));

    const personFolders = mapped
      .filter((f) => f.isPersonFolder)
      .sort((a, b) => b.personCount - a.personCount);

    let personCounter = 0;
    const namedPersonFolders = personFolders.map((f) => {
      const hasPersonWord = f.name?.toLowerCase().includes("person");

      if (hasPersonWord) {
        personCounter++; 
        return {
          ...f,
          name: `Person ${personCounter}`, 
        };
      } else {
        return f;
      }
    });

    const normalFolders = mapped.filter((f) => !f.isPersonFolder);

    setAlbums([...namedPersonFolders, ...normalFolders]);
  }, [subFolders]);

  /* ================= FILE PICK ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEditingDP) {
      handleUpdateSubfolderDP(file, myPhotosFolder?._id);
    } else {
      setPreviewFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  /* ================= CAMERA START / STOP ================= */
  useEffect(() => {
    if (!showCameraPopup) return;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      })
      .catch(console.error);

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setCameraReady(false);
    };
  }, [showCameraPopup]);

  /* ================= ENSURE MY PHOTOS ================= */
  const ensureMyPhotosFolder = async (file) => {
    if (myPhotosFolder) return myPhotosFolder;

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("folderName", folderName);
      fd.append("subFolderName", "My Photos");
      fd.append("type", "my_photos");
      fd.append("userId", localUserId);
      fd.append("customerId", customerId);
      fd.append("file", file);
      fd.append("phoneNo", localPhoneNumber)

      const data = await createSubfolder(fd);

      const created = data.subFolder;

      onSubFolderCreated(created);
      setLocalMyPhotos(created);
      setActiveTab(created._id);
      onNewFolderActivate(created._id);

      return created;
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= SEARCH STREAM ================= */
  const startSearchStream = async (formData) => {
    setIsStremSearching(true);
    try {
      const response = await fetchWithError(`${FACE_FINDER_URL}/search`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const matches = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();

        events.forEach((event) => {
          if (!event.startsWith("data:")) return;
          const payload = JSON.parse(event.replace("data:", ""));
          if (payload.type === "match") {
            matches.push(payload);
            console.log('%c [ matches ]-197', 'font-size:13px; background:pink; color:#bf2c9f;', matches)
            onSearchResults([...matches]);
          }
          if (payload.type === "complete") {
            setIsStremSearching(false);
            setIsCreating(false);
            return;
          }
        });
      }
    }
    catch (error) {
      console.error("Search stream error:", error);
      setIsStremSearching(false);
      setIsSearching(false);
      setIsCreating(false);
    }
  };

  /* ================= CAPTURE ================= */
  const handleCapture = async () => {
    if (!cameraReady || !videoRef.current) return;

    const video = videoRef.current;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraReady(false);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        setIsCreating(true);
        setIsSearching(true);
        onSearchResults([]);
        const myFolder = await ensureMyPhotosFolder(blob);

        if (isEditingDP) {
          await handleUpdateSubfolderDP(blob, myFolder._id);
        }


        setShowCameraPopup(false);
        const fd = new FormData();
        fd.append("sample_image", blob, "capture.png");
        fd.append("folder_name", folderName);
        fd.append("customer_id", customerId);
        fd.append("subFolderId", myFolder._id);

        await startSearchStream(fd);
      } catch (error) {
        console.log("error :" + error)
      }
    }, "image/png");
  };

  /* ================= CREATE ALBUM ================= */
  const handleCreateFolder = async (
    isLocker = false,
    subFolder = newFolderName,
  ) => {
    if (!isLocker && isCreateDisabled) return;

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", previewFile);
      fd.append("folderName", folderName);
      fd.append("subFolderName", subFolder || newFolderName);
      fd.append("type", "others");
      fd.append("userId", localUserId);
      fd.append("customerId", customerId);
      fd.append("phoneNo", localPhoneNumber)
      fd.append("isLocker","false");

      const data = await createSubfolder(fd);
      const newFolder = data.subFolder;

      onSubFolderCreated(newFolder);
      setActiveTab(newFolder._id);
      onNewFolderActivate(newFolder._id);

      if (pendingAssignImageId) {
        setAllThumbnails((prev) =>
          prev.map((img) =>
            img._id === pendingAssignImageId
              ? {
                  ...img,
                  folderIds: isLocker
                    ? [newFolder._id]
                    : [...(img.folderIds || []), newFolder._id],
                }
              : img,
          )
        );
        setPendingAssignImageId(null);
      }

      setShowCreateFolderPopup(false);
      setPreview(null);
      setPreviewFile(null);
      setNewFolderName("");
    } catch (error) {
      console.log("create folder error :", error?.message);
      // alert("create folder error :",error?.message)
      alert("create folder error: " + error?.message)
    }
    finally {
      setIsLoading(false);
    }
  };

  const updateAllStates = (subFolderId, url) => {
    setAlbums((prev) =>
      prev.map((album) =>
        album._id === subFolderId
          ? { ...album, folderDp: { thumbnailUrl: url } }
          : album
      )
    );
    setLocalMyPhotos((prev) =>
      prev && prev._id === subFolderId
        ? { ...prev, folderDp: { thumbnailUrl: url } }
        : prev
    );

    setLocalPrivateLocker((prev) =>
      prev && prev._id === subFolderId
        ? { ...prev, folderDp: { thumbnailUrl: url } }
        : prev,
    );

    setSubFolders(prev =>
      prev.map(sf =>
        sf._id === subFolderId
          ? { ...sf, folderDp: { thumbnailUrl: url } }
          : sf
      )
    );
  };

  const handleUpdateSubfolderDP = async (file, subFolderId) => {
    try {
      const previewUrl = URL.createObjectURL(file);

      updateAllStates(subFolderId, previewUrl);

      const fd = new FormData();
      fd.append("image", file);
      fd.append("folderId", mainFolderId);
      fd.append("subFolderId", subFolderId);
      fd.append("phoneNo", localPhoneNumber)

      const data = await updateSubfolderDP(fd);

      if (data?.data?.thumbnailUrl) {
        updateAllStates(subFolderId, data.data.thumbnailUrl);
      }

    } catch (err) {
      console.error("DP update failed", err);
      alert("Failed to update image");
    }
  };

  useEffect(() => {
    if (isVerifiedOTP) {
        if (privateLocker) {
          setActiveTab(privateLocker._id);
          onSelectSubFolder(privateLocker._id);
          setIsPrivateFolder(true)
        }
    }
  }, [isVerifiedOTP, showOTPModal, privateLocker]);

  return (
    <>
      {/* HEADER CARDS */}
      <div className="gallery-headerCard">

        {/* ALL */}
        <div
          className={`card-item ${activeTab === "all" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("all");
            onSelectSubFolder(null);
            setIsActualMyPhotos(false);
            setIsRefreshShow(false)
            setIsPrivateFolder(false)
          }}
        >
          <div className="circle-img-folder circle-img-both">
            <div className="circle-img-inner">
              <img src={allPhotos.src} alt="All" />
            </div>
          </div>
          <span>All</span>
        </div>

        {/* MY PHOTOS */}
        {myPhotosFolder ? (
          <div>
            <div
              className={`card-item ${activeTab === myPhotosFolder._id ? "active" : ""
                }`}
              onClick={() => {
                setActiveTab(myPhotosFolder._id);

                setIsActualMyPhotos(true)
                onSelectSubFolder(myPhotosFolder._id);
                setIsRefreshShow(true);
                setIsPrivateFolder(false)

                if (matchedKeys.length > 0) {
                  setIsSearching(true);
                }

              }}
            >
              <div className="circle-img-folder circle-img-both">
                <div className="circle-img-inner">
                  <img
                    src={
                      myPhotosFolder.folderDp?.thumbnailUrl || myPhoto.src
                    }
                    alt="My Photos"
                  />
                </div>
              </div>
              <div className="flex">
                <span>My Photos</span>
              </div>
            </div>

          </div>
        ) : (
          <div
            className="card-item"
            onClick={() => {
              setIsActualMyPhotos(true)
              setShowCameraPopup(true)
              setIsRefreshShow(false)
              setIsPrivateFolder(false)
            }
            }
          >
            <div className="circle-img-folder circle-img-both">
              <div className="circle-img-inner">
                <img src={myPhoto.src} alt="My Photos" />
              </div>
            </div>
            <span>My Photos</span>
          </div>
        )}


        {/* Private Folder */}
        {(privateLocker && localUserId === customerId) && (
          <div>
            <div
              className={`card-item ${
                activeTab === privateLocker._id ? "active" : ""
              }`}
              onClick={() => {
                if (isVerifiedOTP) {
                  setActiveTab(privateLocker._id);
                  onSelectSubFolder(privateLocker._id);
                  setIsPrivateFolder(true)
                } else {
                  setShowOTPModal(true);
                }
              }}
            >
              <div className="circle-img-folder circle-img-both">
                <div className="circle-img-inner">
                  <img
                    src={privateLocker.folderDp?.thumbnailUrl || LockerFolderIcon.src}
                    alt="Private Locker"
                    style={{width: '100%', height: '100%', objectFit: 'scale-down'}}
                  />
                </div>
              </div>
              <div className="flex">
                <span>My Locker</span>
              </div>
            </div>
          </div>
        )}

        {/* CREATE ALBUM */}
        <div
          className="card-item"
          onClick={() => {
            setShowCreateFolderPopup(true)
            setIsActualMyPhotos(false)
            setIsRefreshShow(false)
            setIsPrivateFolder(false)
          }
          }
        >
          <div className="circle-img add circle-img-both">
            <span>+</span>
          </div>
          <span>Create Album</span>
        </div>

        {/* ALBUMS */}
        {albums.map((sf) => (
          <div
            key={sf._id}
            className={`card-item ${activeTab === sf._id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(sf._id);
              onSelectSubFolder(sf._id);
              setIsActualMyPhotos(false);
              setIsRefreshShow(false);
              setIsPrivateFolder(false);
            }}
          >
            <div className="circle-img-folder circle-img-both">
              <div className={`${sf.folderDp.thumbnailUrl ? 'circle-img-inner' : ""}`}>
                <img
                  src={sf?.folderDp?.thumbnailUrl || user2.src}
                  alt={sf?.name || "Album"}
                />
              </div>
            </div>
            <span>{sf?.name || "Album"}</span> 
          </div>
        ))}


      </div>

      {/* CAMERA POPUP */}
      <CommonPopup
        isOpen={showCameraPopup}
        onClose={() => setShowCameraPopup(false)}
        title="Align Your Face & Capture!"
        popupHeight="404"
        onSubmit={handleCapture}
        disabled={isCaptureDisabled}
        buttonContent={
          <div className="capture-btn">
            <img src={captureIcon.src} className="capture-icon" />
            <span>Capture</span>
          </div>
        }
      >
        <div className="captureContainer">
          <div className="bgContainer">
            {capturedImage ? (
              <img
                src={capturedImage}
                className="camera-video captured-circle"
                alt="Captured"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
              />
            )}

            <img
              src={selfieCapture.src}
              className="face-overlay"
            />
          </div>
        </div>

      </CommonPopup>

      {/* CREATE FOLDER POPUP */}
      <CommonPopup
        isOpen={showCreateFolderPopup}
        onClose={() => setShowCreateFolderPopup(false)}
        title="Create New Folder"
        titleFontSize="22px"
        onSubmit={handleCreateFolder}
        disabled={isCreateDisabled}
        popupHeight={365}
        buttonContent={
          <div className="create-btn">
            <span>{isLoading ? "Creating" : "Create"}</span>
          </div>
        }
      >
        <div className="picker-container">
          <div
            className="image-picker"
            onClick={() => {
              setIsEditingDP(false);
              fileInputRef.current.click();
            }}
          >
            {preview ? (
              <div
                className="preview-bg"
                style={{ backgroundImage: `url(${preview})` }}
              />
            ) : (
              <Image
                src={userIcon}
                width={60}
                height={60}
                className="user-icon-img"
                alt="user"
              />
            )}
            <div className="upload-icon">
              <Image src={imagePicker} width={24} height={24} />
            </div>
          </div>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="input-container">
          <input
            className="folderName-input"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            maxLength={14}
            placeholder="Type Folder Name"
          />
          <p className="sub-text">{newFolderName.length}/14 Characters</p>
        </div>
      </CommonPopup>

      <LoginModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        fromCapsule={true}
        onlyOTP={true}
        setIsVerifiedOTP={setIsVerifiedOTP}
        bgColor="login-modal-white-content"
      />
    </>
  );
};

export default HeaderCards;
