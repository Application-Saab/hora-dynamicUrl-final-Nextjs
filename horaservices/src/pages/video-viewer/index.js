"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import CommonImagePopup from "@/components/CommonImagePopup";
import { trackActivity } from "@/services/weblinkServices";
import { fetchWithError } from "@/utils/fetchWithError";
import { BASE_URL, CAPSULE_LIKE_TOGGLE } from "@/utils/apiconstants";
import { safeGetItem, safeGetSessionItem, safeRemoveSessionItem } from "@/utils/safeStorage";
import "../weblink-gallery/gallery.css";
import like from "../../assets/like.svg";
import unLike from "../../assets/unLike.svg";
import whiteShareIcon from "../../assets/whiteShareIcon.svg";

const sessionKey = (id) => `video_item_${id}`;

export default function VideoViewerPage() {
    const router = useRouter();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localUserId, setLocalUserId] = useState("");

    const isLiked = !!video?.liked;

    const handleClose = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            Router.back();
        } else {
            Router.replace("/");
        }
    };

    // load video from session
    useEffect(() => {
        if (!router.isReady) return;
        const { id } = router.query;
        if (!id) return;

        setLocalUserId(safeGetItem("userID") || "");

        const cached = safeGetSessionItem(sessionKey(id));
        if (cached) {
            try {
                setVideo(JSON.parse(cached));
            } catch (e) {
                console.error("Cache parse error:", e);
            }
        }
        setLoading(false);
    }, [router.isReady, router.query.id]);

    // page chhodte hi (cross ya browser back) session se video hata do
    useEffect(() => {
        const id = router.query.id;
        if (!id) return;

        const clear = () => safeRemoveSessionItem(sessionKey(id));

        Router.events.on("routeChangeStart", clear);
        return () => Router.events.off("routeChangeStart", clear);
    }, [router.query.id]);

    const handleShare = async (url, id) => {
        if (!url) return;
        if (navigator.share) {
            try {
                await navigator.share({ title: "Video", text: "Check out this video!", url });
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
                        <button onClick={handleClose} style={{ color: "#fff", textDecoration: "underline" }}>
                            Go back
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#000" }}>
            <CommonImagePopup
                singleMode
                images={[video]}
                selectedIndex={0}
                setSelectedIndex={() => { }}
                onClose={handleClose}
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
                                    onClick={() => handleShare(currentVideo?.originalUrl, currentVideo?._id)}
                                />
                            </div>
                        </div>

                        {currentVideo?.inclusionType && (
                            <div
                                style={{ color: "#fff" }}
                                className="image-inclusion-type"
                            >
                                {currentVideo.inclusionType}
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    );
}