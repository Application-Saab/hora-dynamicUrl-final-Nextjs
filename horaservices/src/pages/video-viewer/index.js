"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import CommonImagePopup from "@/components/CommonImagePopup";
import AddToFolderPopup from "@/components/image-galleries/AddToFolderPopup";
import { trackActivity, createSubfolder } from "@/services/weblinkServices";
import { fetchWithError } from "@/utils/fetchWithError";
import { downloadVideoFile } from "@/utils/downloadFile";
import {BASE_URL,CAPSULE_LIKE_TOGGLE,MEDIA_WORKER_URL} from "@/utils/apiconstants";
import { safeGetItem,safeGetSessionItem,safeRemoveSessionItem,} from "@/utils/safeStorage";
import "../weblink-gallery/gallery.css";
import like from "../../assets/like.svg";
import unLike from "../../assets/unLike.svg";
import whiteShareIcon from "../../assets/whiteShareIcon.svg";
import multiGroup from "../../assets/multiGroup.svg";
import plusVector from "../../assets/plusVector.svg";
import downloadVector from "../../assets/downloadVector.svg";
import shareVector from "../../assets/shareVector.svg";
import deleteVector from "../../assets/deleteVector.svg";
import { IoIosCloudDone } from "react-icons/io";
import Lock from "../../assets/Lock.svg";
import LockerPopup from "@/components/image-galleries/LockerPopup";

const sessionKey = (id) => `video_item_${id}`;

export default function VideoViewerPage() {
    const router = useRouter();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localUserId, setLocalUserId] = useState("");
    const [localPhoneNumber, setLocalPhoneNumber] = useState("");

    const [showActionMenu, setShowActionMenu] = useState(false);
    const actionMenuRef = useRef(null);

    const [subFolders, setSubFolders] = useState([]);
    const [showAddToFolderPopup, setShowAddToFolderPopup] = useState(false);
    const [folderSelection, setFolderSelection] = useState([]);
    const [initialPopupFolders, setInitialPopupFolders] = useState([]);

    const [snackbar, setSnackbar] = useState({ show: false, message: "" });
    const snackbarTimeout = useRef(null);


    const [customerId, setCustomerId] = useState("");
    const [resolvedFolderName, setResolvedFolderName] = useState("");
    const [isPrivateFolder, setIsPrivateFolder] = useState(false);

    const [isAddingToLocker, setIsAddingToLocker] = useState(false);
    const [showLockerPopup, setShowLockerPopup] = useState(false);
    const [pendingLockerVideo, setPendingLockerVideo] = useState(null);

    const isLiked = !!video?.liked;

    const showSnackbar = (message) => {
        setSnackbar({ show: true, message });
        if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
        snackbarTimeout.current = setTimeout(() => {
            setSnackbar({ show: false, message: "" });
        }, 5000);
    };

    const formatPhoneNumber = (num) => {
        if (!num) return "N/A";
        const str = num.toString();
        if (str.length < 4) return "N/A";
        return `91+ XXXXXX${str.slice(-4)}`;
    };

    const handleClose = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            Router.back();
        } else {
            Router.replace("/");
        }
    };

    useEffect(() => {
        if (!router.isReady) return;
        const { id } = router.query;
        if (!id) return;

        setLocalUserId(safeGetItem("userID") || "");
        setLocalPhoneNumber(safeGetItem("mobileNumber") || "");

        const cached = safeGetSessionItem(sessionKey(id));
        if (cached) {
            try {
                const parsedVideo = JSON.parse(cached);

                setVideo(parsedVideo);
                setCustomerId(parsedVideo.customerId || "");
                setLocalPhoneNumber(parsedVideo.localPhoneNumber || "");
                setResolvedFolderName(parsedVideo.resolvedFolderName || "");
                setIsPrivateFolder(!!parsedVideo.isPrivateFolder);
                setSubFolders(parsedVideo.subFolders || []);
            } catch (e) {
                console.error("Cache parse error:", e);
            }
        }

        const cachedFolders = safeGetSessionItem("video_subfolders");
        if (cachedFolders) {
            try {
                setSubFolders(JSON.parse(cachedFolders));
            } catch (e) {
                console.error("Subfolders parse error:", e);
            }
        }

        setLoading(false);
    }, [router.isReady, router.query.id]);

    useEffect(() => {
        const id = router.query.id;
        if (!id) return;

        const clear = () => safeRemoveSessionItem(sessionKey(id));

        Router.events.on("routeChangeStart", clear);
        return () => Router.events.off("routeChangeStart", clear);
    }, [router.query.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                actionMenuRef.current &&
                !actionMenuRef.current.contains(event.target)
            ) {
                setShowActionMenu(false);
            }
        };
        if (showActionMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showActionMenu]);

    const handleShare = async (url, id) => {
        if (!url) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Video",
                    text: "Check out this video!",
                    url,
                });
                trackActivity(id, "share");
            } catch (e) {
                console.error(e);
            }
        } else {
            await navigator.clipboard.writeText(url);
            alert("Video link copied!");
        }
    };

    const handleLikeToggle = async () => {
        if (!video?._id || !localUserId) return;
        const wasLiked = !!video.liked;

        setVideo((prev) => ({ ...prev, liked: !wasLiked }));

        try {
            await fetchWithError(`${BASE_URL}${CAPSULE_LIKE_TOGGLE}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageIds: [video._id], userId: localUserId }),
            });
        } catch (e) {
            console.error(e);
            setVideo((prev) => ({ ...prev, liked: wasLiked }));
        }
    };

    const privateLocker = subFolders.find(
        (sf) => sf.type === "others" && sf.isLocker === true
    );

    const handleSubFolderCreated = (newSubFolder) => {
        setSubFolders((prev) => [...prev, newSubFolder]);
    };

    const ensurePrivateLocker = async () => {
        if (privateLocker) return privateLocker;

        const fd = new FormData();
        fd.append("folderName", resolvedFolderName);
        fd.append("subFolderName", "My Locker");
        fd.append("type", "others");
        fd.append("userId", localUserId);
        fd.append("customerId", customerId);
        fd.append("phoneNo", localPhoneNumber);
        fd.append("isLocker", "true");

        const data = await createSubfolder(fd);
        const created = data.subFolder;

        handleSubFolderCreated(created);

        return created;
    };

    const handleAddToLocker = async (currentVideo) => {
        if (!currentVideo?._id || !localUserId || isAddingToLocker) return;

        const previousFolderIds = currentVideo.folderIds || [];

        if (
            privateLocker &&
            previousFolderIds.length === 1 &&
            previousFolderIds[0] === privateLocker._id
        ) {
            return;
        }

        setIsAddingToLocker(true);

        try {
            const locker = await ensurePrivateLocker();

            const newFolderIds = [locker._id];

            const toAdd = newFolderIds.filter(
                (id) => !previousFolderIds.includes(id)
            );

            const toRemove = previousFolderIds.filter(
                (id) => !newFolderIds.includes(id)
            );

            await fetchWithError(
                `${BASE_URL}/api/internal/assign-to-subfolder`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subFolderId: newFolderIds,
                        addImageIds: toAdd.length ? [currentVideo._id] : [],
                        removeImageIds: toRemove.length ? [currentVideo._id] : [],
                    }),
                }
            );

            setVideo((prev) => ({
                ...prev,
                folderIds: newFolderIds,
            }));

            setShowActionMenu(false);
            handleClose();

        } catch (err) {
            console.error("Add video to locker failed:", err);
            alert("Failed to add video to locker");
        } finally {
            setIsAddingToLocker(false);
        }
    };


    const handleDownloadVideo = async (currentVideo) => {
        try {
            trackActivity(currentVideo?._id, "download");
            setShowActionMenu(false);

            await downloadVideoFile(currentVideo?.originalUrl, true);

            showSnackbar("Video downloaded successfully");
        } catch (err) {
            showSnackbar("Download failed");
        }
    };


    const handleAddToFolderSubmit = async () => {
        if (!video?._id) return;

        const toAdd = folderSelection.filter(
            (id) => !initialPopupFolders.includes(id),
        );
        const toRemove = initialPopupFolders.filter(
            (id) => !folderSelection.includes(id),
        );

        try {
            await fetchWithError(`${BASE_URL}/api/internal/assign-to-subfolder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subFolderId: folderSelection,
                    addImageIds: toAdd.length ? [video._id] : [],
                    removeImageIds: toRemove.length ? [video._id] : [],
                }),
            });

            setVideo((prev) => ({ ...prev, folderIds: folderSelection }));
            setShowAddToFolderPopup(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteVideo = async () => {
        if (!video?._id) return;
        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {
            const res = await fetchWithError(
                `${MEDIA_WORKER_URL}/delete-image/${video._id}`,
                { method: "DELETE" },
            );

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }

            setShowActionMenu(false);
            handleClose();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete video");
        }
    };

    if (!video) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#000",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                }}
            >
                {loading ? (
                    <span>Loading...</span>
                ) : (
                    <>
                        <span>Video not found</span>
                        <button
                            onClick={handleClose}
                            style={{ color: "#fff", textDecoration: "underline" }}
                        >
                            Go back
                        </button>
                    </>
                )}
            </div>
        );
    }

    const isOwner =
        String(video?.orderByName || "") === String(localPhoneNumber || "");

    return (
        <div style={{ minHeight: "100vh", background: "#000" }}>
            <CommonImagePopup
                singleMode
                images={[video]}
                selectedIndex={0}
                setSelectedIndex={() => { }}
                onClose={handleClose}
                renderActions={(currentVideo) => (
                    <div>
                        <div style={{ position: "relative" }}>
                            <Image
                                src={multiGroup}
                                alt="More"
                                width={25}
                                height={25}
                                onClick={() => setShowActionMenu((prev) => !prev)}
                            />

                            {showActionMenu && (
                                <div className="action-menu" ref={actionMenuRef}>
                                    <div className="action-item">
                                        <strong>Shared by:</strong>
                                        <p>{formatPhoneNumber(currentVideo?.orderByName)}</p>
                                    </div>

                                    <div className="action-inner-container">
                                        <div
                                            className="action-item flex"
                                            onClick={() => {
                                                setFolderSelection(currentVideo?.folderIds || []);
                                                setInitialPopupFolders(currentVideo?.folderIds || []);
                                                setShowAddToFolderPopup(true);
                                                setShowActionMenu(false);
                                            }}
                                        >
                                            <Image src={plusVector} alt="" width={19} height={15} />
                                            <span>Add to Folder</span>
                                        </div>

                                        <div
                                            className="action-item flex"
                                            onClick={() => handleDownloadVideo(currentVideo)}
                                        >
                                            <Image src={downloadVector} alt="" width={19} height={15} />
                                            <span>Download</span>
                                        </div>

                                        <div
                                            className="action-item flex gallery-share-icon"
                                            onClick={() => {
                                                handleShare(currentVideo?.originalUrl, currentVideo?._id);
                                                setShowActionMenu(false);
                                            }}
                                        >
                                            <Image src={shareVector} alt="" width={19} height={15} />
                                            <span>Share</span>
                                        </div>

                                        {isOwner && (
                                            <div
                                                className="action-item flex"
                                                onClick={handleDeleteVideo}
                                            >
                                                <Image src={deleteVector} alt="" width={19} height={15} />
                                                <span>Delete</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                renderFooter={(currentVideo) => (
                    <div className="imagepopup-footer">
                        <div className="imagepopup-footer-left">
                            <div>
                                <Image
                                    src={isLiked ? like : unLike}
                                    alt="Like"
                                    width={30}
                                    height={32}
                                    style={{ filter: "none", cursor: "pointer" }}
                                    onClick={handleLikeToggle}
                                />
                            </div>
                            <div>
                                <Image
                                    src={whiteShareIcon}
                                    alt="Share"
                                    width={30}
                                    height={32}
                                    style={{ filter: "none", cursor: "pointer" }}
                                    onClick={() =>
                                        handleShare(currentVideo?.originalUrl, currentVideo?._id)
                                    }
                                />
                            </div>
                        </div>

                        {currentVideo?.inclusionType && (
                            <div style={{ color: "#fff" }} className="image-inclusion-type">
                                {currentVideo.inclusionType}
                            </div>
                        )}

                        {localUserId === customerId && !isPrivateFolder && (
                            <div>
                                <button
                                    className="add-locker-btn"
                                    onClick={() => {
                                        if (!privateLocker) {
                                            setPendingLockerVideo(currentVideo);
                                            setShowLockerPopup(true);
                                            return;
                                        }

                                        handleAddToLocker(currentVideo);
                                    }}
                                    disabled={isAddingToLocker}
                                >
                                    <span className="add-locker-icon">
                                        <img src={Lock.src} alt="" />
                                    </span>

                                    <span>
                                        {isAddingToLocker ? "Adding..." : "Add To Locker"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            />

            <AddToFolderPopup
                isOpen={showAddToFolderPopup}
                onClose={() => setShowAddToFolderPopup(false)}
                folders={subFolders}
                folderSelection={folderSelection}
                setFolderSelection={setFolderSelection}
                initialSelection={initialPopupFolders}
                onSubmit={handleAddToFolderSubmit}
                onCreateFolder={handleAddToFolderSubmit}
                style={{ zIndex: 9999 }}
            />

            {snackbar.show && (
                <div className="custom-snackbar">
                    <span>
                        <IoIosCloudDone color="green" size={30} />
                    </span>
                    {snackbar.message}
                </div>
            )}

            {showLockerPopup && (
                <LockerPopup
                    onClose={() => {
                        setShowLockerPopup(false);
                        setPendingLockerVideo(null);
                    }}
                    onMoveToLocker={async () => {
                        try {
                            setShowLockerPopup(false);

                            if (pendingLockerVideo) {
                                await handleAddToLocker(pendingLockerVideo);
                            }

                            setPendingLockerVideo(null);
                        } catch (err) {
                            console.error(err);
                        }
                    }}
                />
            )}
        </div>
    );
}