"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import CommonPopup from "@/components/CommonPop";
import "@/components/Gallery/headerCards.css";
import allPhotos from "@/assets/allPhotos.svg";
import myPhoto from "@/assets/myPhotos.jpg";
import user2 from "@/assets/user2.svg";
import userIcon from "@/assets/userIcon.svg";
import imagePicker from "@/assets/imagePicker.svg";
import captureIcon from "@/assets/captureIcon.svg";
import selfieCapture from "@/assets/selfieCapture.png";
import { BASE_URL, CREATE_EVENT_SUBFOLDER, FACE_FINDER_URL } from "@/utils/apiconstants";

const S3_FOLDER_NAME = "event-invites";

export default function EventWallHeaderTabs({
  eventId,
  subFolders,
  setSubFolders,
  activeTab,
  setActiveTab,
  onSelectSubFolder,
  setIsSearching,
  onSearchResults,
  setIsStreamSearching,
  setMatchedKeys,
  setIsActualMyPhotos,
  showCreateFolderPopup: showCreateFolderPopupProp,
  setShowCreateFolderPopup: setShowCreateFolderPopupProp,
}) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const localUserId = localStorage.getItem("userID");

  const [showCreateFolderPopupLocal, setShowCreateFolderPopupLocal] =
    useState(false);
  const showCreateFolderPopup =
    typeof showCreateFolderPopupProp === "boolean"
      ? showCreateFolderPopupProp
      : showCreateFolderPopupLocal;
  const setShowCreateFolderPopup =
    typeof setShowCreateFolderPopupProp === "function"
      ? setShowCreateFolderPopupProp
      : setShowCreateFolderPopupLocal;
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [newFolderName, setNewFolderName] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const myPhotosFolder = useMemo(
    () => subFolders.find((sf) => sf.type === "my_photos" && String(sf.userId) === String(localUserId)),
    [subFolders, localUserId],
  );

  const albums = useMemo(
    () =>
      subFolders
        .filter((sf) => sf.type === "others")
        .map((sf) => ({
          _id: sf._id,
          name: sf.folderName,
          folderDp: { thumbnailUrl: sf.folderDp?.thumbnailUrl },
        })),
    [subFolders],
  );

  useEffect(() => {
    if (!showCameraPopup) return;

    setCapturedImage(null);
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

  const startSearchStream = async (formData) => {
    setIsStreamSearching(true);
    try {
      const response = await fetch(`${FACE_FINDER_URL}/event-face-search`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

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
            onSearchResults([...matches]);
          }
          if (payload.type === "complete") {
            setIsStreamSearching(false);
          }
        });
      }
    } catch (error) {
      console.error("Search stream error:", error);
      setIsStreamSearching(false);
      setIsSearching(false);
    }
  };

  const createSubFolder = async ({ type, subFolderName, file }) => {
    const fd = new FormData();
    if (file) fd.append("file", file);
    fd.append("folderName", S3_FOLDER_NAME);
    fd.append("type", type);
    fd.append("userId", localUserId);
    if (subFolderName) fd.append("subFolderName", subFolderName);

    const res = await fetch(`${BASE_URL}${CREATE_EVENT_SUBFOLDER}/${eventId}`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to create subfolder");
    return data?.data || data;
  };

  const ensureMyPhotosFolder = async (file) => {
    if (myPhotosFolder) return myPhotosFolder;
    const created = await createSubFolder({ type: "my_photos", subFolderName: "My Photos", file });
    setSubFolders((prev) => [...prev, created]);
    return created;
  };

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
      setIsSearching(true);
      onSearchResults([]);
      setMatchedKeys([]);

      setIsActualMyPhotos(true);
      setShowCameraPopup(false);

      try {
        setIsLoading(true);
        const myFolder = await ensureMyPhotosFolder(blob);
        setActiveTab(myFolder._id);
        onSelectSubFolder(myFolder._id);

        const fd = new FormData();
        fd.append("sample_image", blob, "capture.png");
        // Keep same field names as existing face-api integration.
        fd.append("folder_name", "eventwall");
        fd.append("eventId", eventId);
        fd.append("subFolderId", myFolder._id);

        await startSearchStream(fd);
      } finally {
        setIsSearching(false);
        setIsLoading(false);
      }
    }, "image/png");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const created = await createSubFolder({
        type: "others",
        subFolderName: newFolderName.trim(),
        file: previewFile,
      });
      setSubFolders((prev) => [...prev, created]);
      setActiveTab(created._id);
      onSelectSubFolder(created._id);
      setIsActualMyPhotos(false);
      setShowCreateFolderPopup(false);
      setPreview(null);
      setPreviewFile(null);
      setNewFolderName("");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Create folder failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="gallery-headerCard">
        <div
          className={`card-item ${activeTab === "all" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("all");
            onSelectSubFolder(null);
            setIsSearching(false);
            onSearchResults([]);
            setMatchedKeys([]);
            setIsActualMyPhotos(false);
          }}
        >
          <div className="circle-img-folder_wonderland circle-img-both" >
            <div className="circle-img-inner circle-img-innner-wonderland">
              <img src={allPhotos.src} alt="All" />
            </div>
          </div>
          <span>All</span>
        </div>

        {/* {myPhotosFolder ? (
          <div
            className={`card-item ${activeTab === myPhotosFolder._id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(myPhotosFolder._id);
              setIsActualMyPhotos(true);
              onSelectSubFolder(myPhotosFolder._id);
            }}
          >
            <div className="circle-img-folder_wonderland circle-img-both">
              <div className="circle-img-inner circle-img-innner-wonderland">
                <img src={myPhotosFolder.folderDp?.thumbnailUrl || myPhoto.src} alt="My Photos" />
              </div>
            </div>
            <span>My Photos</span>
          </div>
        ) : (
          <div
            className="card-item"
            onClick={() => {
              setIsActualMyPhotos(true);
              setShowCameraPopup(true);
            }}
          >
            <div className="circle-img-folder_wonderland circle-img-both">
              <div className="circle-img-inner circle-img-innner-wonderland">
                <img src={myPhoto.src} alt="My Photos" />
              </div>
            </div>
            <span>My Photos</span>
          </div>
        )} */}

        {/* <div
          className="card-item"
          onClick={() => {
            setShowCreateFolderPopup(true);
            setIsActualMyPhotos(false);
          }}
        >
          <div className="circle-img add circle-img-both">
            <span>+</span>
          </div>
          <span>Create Album</span>
        </div> */}

        {albums.map((sf) => (
          <div
            key={sf._id}
            className={`card-item ${activeTab === sf._id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(sf._id);
              onSelectSubFolder(sf._id);
              setIsActualMyPhotos(false);
            }}
          >
            <div className="circle-img-folder_wonderland circle-img-both">
              <div className={`${sf.folderDp.thumbnailUrl ? "circle-img-inner circle-img-innner-wonderland" : ""}`}>
                <img src={sf.folderDp.thumbnailUrl || user2.src} alt={sf.name || "Album"} />
              </div>
            </div>
            <span>{sf.name}</span>
          </div>
        ))}
      </div>

      <CommonPopup
        isOpen={showCameraPopup}
        onClose={() => setShowCameraPopup(false)}
        title="Align Your Face & Capture!"
        popupHeight="404"
        onSubmit={handleCapture}
        disabled={!cameraReady || isLoading}
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
              <img src={capturedImage} className="camera-video captured-circle" alt="Captured" />
            ) : (
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
            )}
            <img src={selfieCapture.src} className="face-overlay" />
          </div>
        </div>
      </CommonPopup>

      <CommonPopup
        isOpen={showCreateFolderPopup}
        onClose={() => setShowCreateFolderPopup(false)}
        title="Create New Folder"
        titleFontSize="22px"
        onSubmit={handleCreateFolder}
        disabled={!newFolderName.trim() || isLoading}
        popupHeight={365}
        buttonContent={
          <div className="create-btn">
            <span>{isLoading ? "Creating" : "Create"}</span>
          </div>
        }
      >
        <div className="picker-container">
          <div className="image-picker" onClick={() => fileInputRef.current?.click()}>
            {preview ? (
              <div className="preview-bg" style={{ backgroundImage: `url(${preview})` }} />
            ) : (
              <Image src={userIcon} width={60} height={60} className="user-icon-img" alt="user" />
            )}
            <div className="upload-icon">
              <Image src={imagePicker} width={24} height={24} alt="pick" />
            </div>
          </div>
          <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
        </div>

        <div className="input-container">
          <input
            className="folderName-input"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            maxLength={14}
            placeholder="Type Folder Name"
          />
          <p className="sub-text">{newFolderName.length}/14 Characters</p>
        </div>
      </CommonPopup>
    </>
  );
}

