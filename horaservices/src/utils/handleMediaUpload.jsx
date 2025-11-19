"use client";

import axios from "axios";
import imageCompression from "browser-image-compression";
const { BASE_URL } = require("./apiconstants");

// 3-Second Video Clip Generator
export async function create3SecClip(videoFile) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.crossOrigin = "anonymous";

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");

      canvas.width = 480;
      canvas.height = (video.videoHeight / video.videoWidth) * 480;

      const ctx = canvas.getContext("2d");

      const stream = canvas.captureStream();
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      let chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const file = new File([blob], "thumbnail.webm", {
          type: "video/webm",
        });
        resolve(file);
      };

      let startTime = 1;
      video.currentTime = startTime;
      recorder.start();

      const draw = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (video.currentTime - startTime < 3) {
          requestAnimationFrame(draw);
        } else {
          recorder.stop();
        }
      };

      video.ontimeupdate = () => draw();
      video.play();
    };

    video.onerror = reject;
  });
}

// Presigned URL
export const getPresignedUrl = async (file, userId, eventId, folderName) => {
  const res = await fetch(`${BASE_URL}/api/customer/event/get-presigned-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      folder: folderName,
      userId,
      eventId,
    }),
  });

  if (!res.ok) throw new Error("Failed to get presigned URL");
  return res.json();
};

// Upload to S3
export const uploadToS3 = async (file, uploadURL) => {
  const res = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) throw new Error("S3 upload failed");
  return true;
};

//  Upload to s3 with progress tracking
export async function uploadToS3WithProgress(file, presignedUrl, onProgress) {
  return axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (p) => {
      const percent = Math.round((p.loaded * 100) / p.total);
      onProgress(percent);
    },
  });
}

export async function uploadImage(file, userId, eventId, onProgress) {
  const thumb = await imageCompression(file, {
    maxSizeMB: 0.15,
    maxWidthOrHeight: 400,
  });

  const [origSigned, thumbSigned] = await Promise.all([
    getPresignedUrl(file, userId, eventId, "self-upload"),
    getPresignedUrl(thumb, userId, eventId, "self-upload"),
  ]);

  await uploadToS3WithProgress(file, origSigned.uploadURL, onProgress);
  await uploadToS3(thumb, thumbSigned.uploadURL);

  const originalUrl = `https://photography-hora.s3.eu-north-1.amazonaws.com/${origSigned.key}`;
  const thumbnailUrl = `https://photography-hora.s3.eu-north-1.amazonaws.com/${thumbSigned.key}`;

  return {
    success: true,
    originalKey: origSigned.key,
    thumbnailKey: thumbSigned.key,
    originalUrl,
    thumbnailUrl,
  };
}

export async function uploadVideo(file, userId, eventId, onProgress) {
  const thumbnailFile = await create3SecClip(file);

  const [origSigned, thumbSigned] = await Promise.all([
    getPresignedUrl(file, userId, eventId, "self-upload"),
    getPresignedUrl(thumbnailFile, userId, eventId, "self-upload"),
  ]);

  await uploadToS3WithProgress(file, origSigned.uploadURL, onProgress);
  await uploadToS3(thumbnailFile, thumbSigned.uploadURL);

  const originalUrl = `https://photography-hora.s3.eu-north-1.amazonaws.com/${origSigned.key}`;
  const thumbnailUrl = `https://photography-hora.s3.eu-north-1.amazonaws.com/${thumbSigned.key}`;

  return {
    success: true,
    originalKey: origSigned.key,
    thumbnailKey: thumbSigned.key,
    originalUrl,
    thumbnailUrl,
  };
}
