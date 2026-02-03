"use client";
import React, { useState, useRef, useEffect } from "react";
import "./headerCards.css";

import myPhoto from "../../assets/myPhoto.png";
import allPhotos from "../../assets/allPhotos.png";
import captureIcon from "../../assets/captureIcon.png";
import userIcon from '../../assets/userIcon.png'
import imagePicker from '../../assets/imagePicker.png'
import Image from "next/image";
import selfieCapture from '../../assets/selfieCapture.png'

import CommonPopup from "../../components/CommonPop";

const HeaderCards = ({ folderName, customerId, setIsSearching, onSearchResults, phoneNo, subFolders, onSelectSubFolder, onSubFolderCreated, onNewFolderActivate, showCreateFolderPopup, setShowCreateFolderPopup, pendingAssignImageId,
  setPendingAssignImageId,
  setAllThumbnails, }) => {
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [albums, setAlbums] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);


  const myPhotosFolder = subFolders.find(sf => sf.type === "my_photos");

  useEffect(() => {
    const mapped = subFolders
      .filter(sf => sf.type === "others")
      .map(sf => ({
        _id: sf._id,
        name: sf.folderName,
        folderDp: {
          thumbnailUrl: sf.folderDp?.thumbnailUrl || userIcon.src,
        },
        isSubFolder: true,
      }));

    setAlbums(mapped);
  }, [subFolders]);



  const handlePopImageClick = () => {
    fileInputRef.current.click();
  };

  const [previewFile, setPreviewFile] = useState(null);
  const isCreateDisabled = !newFolderName.trim() || !previewFile;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewFile(file); // store the actual file
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };


  const handleCreateFolder = async (file) => {
    if (!folderName || !file || newFolderName.trim() === "") return;

    try {
      setIsLoading(true); // 🔹 START loading

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", folderName);
      formData.append("subFolderName", newFolderName);
      formData.append("type", "others");
      formData.append("userId", localStorage.getItem("userID"));
      formData.append("customerId", customerId);

      const res = await fetch("http://localhost:4000/create-subfolder", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Subfolder creation failed: ${errorText}`);
      }

      const data = await res.json();

      const newSubFolder = {
        _id: data.subFolder._id,
        folderName: data.subFolder.folderName,
        type: data.subFolder.type,
        folderDp: data.subFolder.folderDp,
        userId: data.subFolder.userId,
      };

      onSubFolderCreated(newSubFolder);

      setActiveTab(newSubFolder._id);
      onNewFolderActivate(newSubFolder._id);


      if (pendingAssignImageId) {
        await fetch("https://horaservices.com:3000/api/internal/assign-to-subfolder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subFolderId: newSubFolder._id,
            addImageIds: [pendingAssignImageId],
            removeImageIds: [],
          }),
        });

        // 4️⃣ UI update
        setAllThumbnails(prev =>
          prev.map(img =>
            img._id === pendingAssignImageId
              ? { ...img, folderIds: [...(img.folderIds || []), newSubFolder._id] }
              : img
          )
        );
        setPendingAssignImageId(null);
      }

      setShowCreateFolderPopup(false);
      setPreview(null);
      setPreviewFile(null);
      setNewFolderName("");
    } catch (err) {
      console.error("Error creating subfolder:", err);
      alert(err.message);
    } finally {
      setIsLoading(false); // 🔹 STOP loading
    }
  };




  /* ================= CAMERA START / STOP ================= */
  useEffect(() => {
    if (showCameraPopup) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [showCameraPopup]);

  /* ================= SEARCH STREAM ================= */
  const startSearchStream = async (formData) => {
    const response = await fetch("http://localhost:8000/search", {
      method: "POST",
      body: formData,
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop();

      events.forEach((event) => {
        if (!event.startsWith("data:")) return;
        const payload = JSON.parse(event.replace("data:", "").trim());

        if (payload.type === "match") {
          onSearchResults(payload);
        }
      });
    }
  };

  /* ================= CAPTURE HANDLER ================= */
  const handleCapture = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("sample_image", blob, "capture.png");
      formData.append("folder_name", folderName);
      formData.append("customer_id", customerId);

      setIsSearching(true);
      await startSearchStream(formData);
      setIsSearching(false);
      setShowCameraPopup(false);
    }, "image/png");
  };

  return (
    <>
      {/* ================= HEADER CARDS ================= */}
      <div className="gallery-headerCard">

        <div
          className={`card-item ${activeTab === "all" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("all");
            onSelectSubFolder(null);
          }}
        >

          <div className="circle-img">
            <img src={allPhotos.src} alt="All" />
          </div>
          <p>All</p>
        </div>

        {myPhotosFolder ? (
          <div
            className={`card-item ${activeTab === "backend-my" ? "active" : ""}`}
            onClick={() => setActiveTab("backend-my")}
          >
            <div className="circle-img">
              <img
                src={myPhotosFolder.folderDp.thumbnailUrl || myPhoto.src}
                alt="My Photos"
              />
            </div>
            <p>{myPhotosFolder.folderName}</p>
          </div>
        ) :
          (
            <div
              className={`card-item ${activeTab === "my" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("my");
                setShowCameraPopup(true);
              }}
            >
              <div className="circle-img">
                <img src={myPhoto.src} alt="My Photos" />
              </div>
              <p>My Photos</p>
            </div>
          )
        }

        {/*  OTHER SUBFOLDERS (created albums) */}
        {albums.map((sf) => (
          <div
            key={sf._id}
            className={`card-item ${activeTab === sf._id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(sf._id);
              onSelectSubFolder(sf._id);
            }}
          >
            <div className="circle-img">
              <img src={sf.folderDp.thumbnailUrl || userIcon.src} alt={sf.name} />
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


      {/* ================= CAMERA POPUP ================= */}
      <CommonPopup
        isOpen={showCameraPopup}
        onClose={() => {
          setShowCameraPopup(false);
          streamRef.current?.getTracks().forEach(t => t.stop());
        }}

        title="Align Your Face & Capture"
        buttonText="Capture"
        onSubmit={handleCapture}
        headerSize="sm"
        buttonContent={
          <div className="capture-btn">
            <img
              src={captureIcon.src}
              alt="capture"
              height={15}
              width={15}
              className="capture-icon"
            />
            <span>Capture</span>
          </div>
        }
      >
        <div className="captureContainer">
          <div className="bgContainer">
            <video ref={videoRef} autoPlay playsInline className="camera-video" />
            <img
              src={selfieCapture.src}   // apni PNG yaha lagao
              alt="face guide"
              className="face-overlay"
            />
          </div>
        </div>

      </CommonPopup>


      {/* ================= CREATE FOLDER POPUP ================= */}
      <CommonPopup
        isOpen={showCreateFolderPopup}
        onClose={() => { setShowCreateFolderPopup(false); setNewFolderName(""); setPreview(null); }}
        title="Create New Folder"
        buttonContent={isLoading ? "Creating" : "Create"}
        disabled={isCreateDisabled || isLoading}
        onSubmit={() => {
          if (newFolderName.trim() === "") return; // empty name check
          handleCreateFolder(previewFile);
        }}
        headerSize="md"
      >

        <div>
          {/* IMAGE PICKER */}
          <div className="picker-container">
            <div
              className="image-picker"
              onClick={handlePopImageClick}
            >
              {/* PREVIEW IMAGE */}
              {preview ? (
                <div
                  className="preview-bg"
                  style={{
                    backgroundImage: `url(${preview})`,
                  }}
                />
              ) : (
                <Image
                  src={userIcon}
                  alt="User"
                  width={60}
                  height={60}
                  className="user-icon-img"
                />
              )}

              {/* upload icon */}
              <div className="upload-icon">
                <Image src={imagePicker} alt="Upload" width={24} height={24} />
              </div>
            </div>


            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
          </div>


          {/* INPUT */}
          <div className="input-container">
            <input
              type="text"
              placeholder="Type Folder Name"
              className="folderName-input"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              maxLength={14}
            />
            <p className="sub-text">{newFolderName.length}/14 Characters</p>

          </div>
        </div>
      </CommonPopup>
    </>
  );
};

export default HeaderCards;
