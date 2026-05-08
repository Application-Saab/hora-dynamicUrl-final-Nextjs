/**
 * utils/recordAndUploadVideo.js
 */

import html2canvas from "html2canvas";

/* ──────────────────────────────────────────────
   Overlay → Bitmap
────────────────────────────────────────────── */
const renderOverlayToBitmap = async (overlayEl) => {
  if (!overlayEl) return null;

  try {
    await document.fonts.ready;

    const canvas = await html2canvas(overlayEl, {
       scale: 2, 
      useCORS: true,
      backgroundColor: null,
      logging: false,

      onclone: (_doc, clonedEl) => {
        clonedEl.querySelectorAll("[contenteditable]").forEach((el) => {
          el.removeAttribute("contenteditable");
        });
      },
    });

    return await createImageBitmap(canvas);
  } catch (err) {
    console.warn("Overlay bitmap render failed:", err);
    return null;
  }
};

/* ──────────────────────────────────────────────
   RECORD VIDEO
────────────────────────────────────────────── */
export const recordVideoWithOverlay = async (
  videoEl,
  overlayEl,
  opts = {}
) => {
  if (!videoEl) {
    throw new Error("videoEl is required");
  }

  const {
    duration =
      isFinite(videoEl.duration) && videoEl.duration > 0
        ? Math.min(videoEl.duration * 1000, 10000)
        : 10000,

    fps = 15,

    videoBitrate = 8_000_000 ,

    onProgress = () => {},
  } = opts;

  const W = videoEl.videoWidth || 480;

  const H = videoEl.videoHeight || 854;

  const canvas = document.createElement("canvas");

  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");

  onProgress(5);

  const overlayBitmap = await renderOverlayToBitmap(overlayEl);

  onProgress(15);

  try {
    videoEl.currentTime = 0;
  } catch (_) {}

  await new Promise((r) => setTimeout(r, 200));

  try {
    await videoEl.play();
  } catch (_) {}

  const mimeType =
    [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ].find((m) => MediaRecorder.isTypeSupported(m)) || "video/webm";

  const stream = canvas.captureStream(fps);

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: videoBitrate,
  });

  const chunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  let rafId = null;

  let startTime = null;

  const drawFrame = (timestamp) => {
    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;

    const progress = Math.min(elapsed / duration, 1);

    onProgress(Math.round(15 + progress * 70));

    if (elapsed >= duration) {
      recorder.stop();
      return;
    }

    ctx.clearRect(0, 0, W, H);

    try {
      ctx.drawImage(videoEl, 0, 0, W, H);
    } catch (_) {}

    if (overlayBitmap) {
      try {
        ctx.drawImage(overlayBitmap, 0, 0, W, H);
      } catch (_) {}
    }

    rafId = requestAnimationFrame(drawFrame);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      onProgress(100);

      /**
       * FAKE MP4
       */

      const fakeMp4Blob = new Blob(chunks, {
        type: "video/mp4",
      });

      const mp4File = new File(
        [fakeMp4Blob],
        `invite-${Date.now()}.mp4`,
        {
          type: "video/mp4",
        }
      );

      resolve({
        file: mp4File,
      });
    };

    recorder.onerror = (e) => {
      reject(e.error || new Error("MediaRecorder error"));
    };

    recorder.start(100);

    rafId = requestAnimationFrame(drawFrame);
  });
};

/* ──────────────────────────────────────────────
   RECORD + UPLOAD
────────────────────────────────────────────── */
export const recordAndUploadVideo = async ({
  videoEl,
  overlayEl,
  eventId,
  userId,
  baseUrl,
  onProgress = () => {},
}) => {
  /**
   * STEP 1 → RECORD VIDEO
   */

  const recorded = await recordVideoWithOverlay(
    videoEl,
    overlayEl,
    {
      onProgress,
    }
  );

  /**
   * STEP 2 → FORM DATA
   */

  const formData = new FormData();

  /**
   * IMPORTANT
   * SAME AS YOUR WORKING HTML
   */

  formData.append("image", recorded.file);

  formData.append("userId", userId);

  /**
   * STEP 3 → API CALL
   */

  const response = await fetch(
    `${baseUrl}/api/customer/event/event-invites/external-template/${eventId}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  const data = await response.json();

  console.log("UPLOAD RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  /**
   * STEP 4 → RETURN SERVER VIDEO URL
   */

  return {
    success: true,

    /**
     * SERVER URL
     */

    videoUrl:
      data?.data?.image ||
      data?.data?.url ||
      data?.image ||
      "",

    data,
  };
};