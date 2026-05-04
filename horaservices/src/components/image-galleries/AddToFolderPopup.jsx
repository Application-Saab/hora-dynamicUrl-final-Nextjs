"use client";
import React from "react";
import CommonPopup from "@/components/CommonPop";
import user2 from "@/assets/user2.svg";

export default function AddToFolderPopup({
  isOpen,
  onClose,
  folders = [],
  folderSelection = [],
  setFolderSelection,
  initialSelection = [],
  title = "Add to Folder",
  popupHeightWhenEmpty = "269",
  popupHeightWhenList = "420",
  primaryCtaLabel = "Add Now",
  onSubmit,
  onCreateFolder,
  style = {},
}) {
  const hasFolders = Array.isArray(folders) && folders.length > 0;
  const disabled =
    JSON.stringify(folderSelection) === JSON.stringify(initialSelection);

  return (
    <CommonPopup
      isOpen={isOpen}
      onClose={onClose}
      popupHeight={hasFolders ? popupHeightWhenList : popupHeightWhenEmpty}
      title={title}
      titleFontSize="22px"
      buttonContent={hasFolders ? primaryCtaLabel : null}
      disabled={disabled}
      onSubmit={onSubmit}
      containerClass=""
      style={style}
    >
      <div
        className="add-folder-list"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {hasFolders ? (
          folders.map((sf) => (
            <label key={sf._id} className="folder-checkbox-row">
              <div className="folder-info">
                <div
                  className={`${
                    sf.folderDp?.thumbnailUrl ? "folder-dp" : "default-folder-dp"
                  }`}
                >
                  <img
                    src={sf?.folderDp?.thumbnailUrl || user2?.src}
                    alt={sf.folderName}
                  />
                </div>
                <span className="folder-name">{sf.folderName}</span>
              </div>
              <input
                type="checkbox"
                className="popup-checkbox"
                checked={folderSelection.includes(sf._id)}
                onChange={(e) => {
                  if (!setFolderSelection) return;
                  if (e.target.checked) {
                    setFolderSelection((prev) => [...prev, sf._id]);
                  } else {
                    setFolderSelection((prev) =>
                      prev.filter((id) => id !== sf._id),
                    );
                  }
                }}
              />
            </label>
          ))
        ) : (
          <div className="emptyFolder-container">
            <div className="no-subfolder-text">No Folders Found</div>
            <div className="sub-text-empty">You don’t have any folder yet.</div>
            <div className="pop-btn-container">
              <button
                className="popup-btn emptyFolder-popup-btn"
                onClick={() => (typeof onCreateFolder === "function" ? onCreateFolder() : onSubmit?.())}
              >
                Create Folder
              </button>
            </div>
          </div>
        )}
      </div>
    </CommonPopup>
  );
}

