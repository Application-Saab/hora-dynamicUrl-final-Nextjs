"use client";

import React from "react";
import "../../components/Gallery/headerCards.css";
import user2 from "../../assets/user2.svg";

export default function HeaderCards({
    subFolders = [],
    activeTab,
    onSelectSubFolder,
}) {

    console.log("subFolders --", subFolders)
    return (
        <div className="gallery-headerCard">
            {[...subFolders].reverse().map((folder, index) => {
                const folderId = String(folder.galleryId);
                const isActive = String(activeTab || "") === folderId;

                return (
                    <div
                        key={folder._id || folderId}
                        className={`card-item ${isActive ? "active" : ""}`}
                        onClick={() => onSelectSubFolder?.(folder.galleryId)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onSelectSubFolder?.(folder.galleryId);
                            }
                        }}
                    >
                               <div className="circle-img-folder circle-img-both">
                            <div className={`${folder?.selectedForBanner ? 'circle-img-inner' : ""}`}>
                                   <img
                                    src={folder?.selectedForBanner || user2.src}
                                    alt={`Folder ${index + 1}`}
                                   />
                                 </div>
                               </div>

                        <span>
                            Folder {index + 1}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}