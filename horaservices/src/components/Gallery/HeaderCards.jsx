"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import "./headerCards.css";

import myPhoto from "../../assets/myPhoto.png";
import allPhotos from "../../assets/allPhotos.png";
import captureIcon from "../../assets/captureIcon.png";
import userIcon from "../../assets/userIcon.png";
import imagePicker from "../../assets/imagePicker.png";
import selfieCapture from "../../assets/selfieCapture.png";

import Image from "next/image";
import CommonPopup from "../../components/CommonPop";

const HeaderCards = ({
  folderName,
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
}) => {
  /* ================= STATE ================= */
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [localMyPhotos, setLocalMyPhotos] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const localUserId = localStorage.getItem("userID");

  /* ================= DERIVED ================= */
  const myPhotosFolder = useMemo(
    () =>
      localMyPhotos ||
      subFolders.find(
        sf => sf.type === "my_photos" && sf.userId === localUserId
      ),
    [localMyPhotos, subFolders, localUserId]
  );

  const isCreateDisabled =
    !newFolderName.trim() || !previewFile || isLoading;

  const isCaptureDisabled =
    !cameraReady || isCreating || isLoading;

  /* ================= ALBUM LIST ================= */
  useEffect(() => {
    const mapped = subFolders
      .filter(sf => sf.type === "others")
      .map(sf => ({
        _id: sf._id,
        name: sf.folderName,
        folderDp: {
          thumbnailUrl: sf.folderDp?.thumbnailUrl || userIcon.src,
        },
      }));
    setAlbums(mapped);
  }, [subFolders]);

  /* ================= FILE PICK ================= */
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= CAMERA START / STOP ================= */
  useEffect(() => {
    if (!showCameraPopup) return;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      })
      .catch(console.error);

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      setCameraReady(false);
    };
  }, [showCameraPopup]);

  /* ================= ENSURE MY PHOTOS ================= */
  const ensureMyPhotosFolder = async file => {
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

      const res = await fetch("http://localhost:4000/create-subfolder", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
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
  const startSearchStream = async formData => {
    const response = await fetch("http://localhost:8000/search", {
      method: "POST",
      body: formData,
    });

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

      events.forEach(event => {
        if (!event.startsWith("data:")) return;
        const payload = JSON.parse(event.replace("data:", ""));
        if (payload.type === "match") {
          matches.push(payload);
          onSearchResults([...matches]);
        }
      });
    }
  };

  /* ================= CAPTURE ================= */
  const handleCapture = async () => {
    if (!cameraReady) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async blob => {
      if (!blob) return;

      try {
        setIsCreating(true);
        setIsSearching(true);

        const myFolder = await ensureMyPhotosFolder(blob);

        setShowCameraPopup(false);
        streamRef.current?.getTracks().forEach(t => t.stop());

        const fd = new FormData();
        fd.append("sample_image", blob, "capture.png");
        fd.append("folder_name", folderName);
        fd.append("customer_id", customerId);
        fd.append("subFolderId", myFolder._id);

        await startSearchStream(fd);
      } finally {
        setIsSearching(false);
        setIsCreating(false);
      }
    }, "image/png");
  };

  /* ================= CREATE ALBUM ================= */
  const handleCreateFolder = async () => {
    if (isCreateDisabled) return;

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", previewFile);
      fd.append("folderName", folderName);
      fd.append("subFolderName", newFolderName);
      fd.append("type", "others");
      fd.append("userId", localUserId);
      fd.append("customerId", customerId);

      const res = await fetch("http://localhost:4000/create-subfolder", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      const newFolder = data.subFolder;

      onSubFolderCreated(newFolder);
      setActiveTab(newFolder._id);
      onNewFolderActivate(newFolder._id);

      if (pendingAssignImageId) {
        setAllThumbnails(prev =>
          prev.map(img =>
            img._id === pendingAssignImageId
              ? { ...img, folderIds: [...(img.folderIds || []), newFolder._id] }
              : img
          )
        );
        setPendingAssignImageId(null);
      }

      setShowCreateFolderPopup(false);
      setPreview(null);
      setPreviewFile(null);
      setNewFolderName("");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
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
            setIsSearching(false);
          }}
        >
          <div className="circle-img">
            <div className="circle-img-inner">
              <img src={allPhotos.src} alt="All" />
            </div>
          </div>
          <p>All</p>
        </div>

        {/* MY PHOTOS */}
        {myPhotosFolder ? (
          <div
            className={`card-item ${
              activeTab === myPhotosFolder._id ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab(myPhotosFolder._id);
              onSelectSubFolder(myPhotosFolder._id);
            }}
          >
            <div className="circle-img">
              <div className="circle-img-inner">
                <img
                  src={
                    myPhotosFolder.folderDp?.thumbnailUrl || myPhoto.src
                  }
                  alt="My Photos"
                />
              </div>
            </div>
            <p>{myPhotosFolder.folderName}</p>
          </div>
        ) : (
          <div
            className="card-item"
            onClick={() => setShowCameraPopup(true)}
          >
            <div className="circle-img">
              <div className="circle-img-inner">
                <img src={myPhoto.src} alt="My Photos" />
              </div>
            </div>
            <p>My Photos</p>
          </div>
        )}

        {/* ALBUMS */}
        {albums.map(sf => (
          <div
            key={sf._id}
            className={`card-item ${activeTab === sf._id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(sf._id);
              onSelectSubFolder(sf._id);
            }}
          >
            <div className="circle-img">
              <div className="circle-img-inner">
                <img
                  src={sf.folderDp.thumbnailUrl}
                  alt={sf.name}
                />
              </div>
            </div>
            <p>{sf.name}</p>
          </div>
        ))}

        {/* CREATE ALBUM */}
        <div
          className="card-item"
          onClick={() => setShowCreateFolderPopup(true)}
        >
          <div className="circle-img add">
            <span>+</span>
          </div>
          <p>Create Album</p>
        </div>
      </div>

      {/* CAMERA POPUP */}
      <CommonPopup
        isOpen={showCameraPopup}
        onClose={() => setShowCameraPopup(false)}
        title="Align Your Face & Capture"
        onSubmit={handleCapture}
        headerSize="sm"
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
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-video"
            />
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
        onSubmit={handleCreateFolder}
        disabled={isCreateDisabled}
        buttonContent={isLoading ? "Creating" : "Create"}
      >
        <div className="picker-container">
          <div
            className="image-picker"
            onClick={() => fileInputRef.current.click()}
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
    </>
  );
};

export default HeaderCards;
