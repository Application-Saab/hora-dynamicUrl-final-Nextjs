// "use client";

// import { useState, useCallback } from "react";
// import Cropper from "react-easy-crop";
// import { useRouter } from "next/navigation";
// import getCroppedImg from "@/utils/cropImage";
// import { BASE_URL } from "@/utils/apiconstants";
// import { saveTemplate } from "@/utils/indexedDB";
// import "./UploadCustomTemplate.css";

// const UploadCustomTemplate = ({ eventId, userId, token, label = "Upload Your Own Design"  }) => {
//   const router = useRouter();

//   const [imageSrc, setImageSrc] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedPixels, setCroppedPixels] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const onSelectFile = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => setImageSrc(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const onCropComplete = useCallback((_, croppedAreaPixels) => {
//     setCroppedPixels(croppedAreaPixels);
//   }, []);

//   const handleUpload = async () => {
//     try {
//       setUploading(true);

//       const croppedImage = await getCroppedImg(imageSrc, croppedPixels);
//       await saveTemplate(`template_${eventId}`, croppedImage);

//       const blob = await fetch(croppedImage).then((r) => r.blob());
//       const formData = new FormData();
//       formData.append("image", blob);
//       formData.append("userId", userId);

//       await fetch(
//         `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
//         {
//           method: "PUT",
//           headers: { Authorization: token },
//           body: formData,
//         }
//       );

//       router.replace(`/wonderland/invite?eventid=${eventId}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <>
//       {/* Upload Card */}
//       <div
//         className="upload-banner"
//         onClick={() =>
//           document.getElementById("custom-template-upload").click()
//         }
//       > 
//       <div className="upload-icon-wrapper">
//         <span className="upload-plus">+</span>
//         </div>
//         <p>{label}</p>
//       </div>

//       <input
//         id="custom-template-upload"
//         type="file"
//         accept="image/*"
//         hidden
//         onChange={onSelectFile}
//       />

//       {/* ===== CROP MODAL ===== */}
//       {imageSrc && (
//         <div className="crop-modal">

//           {/* 🔥 SAME IMAGE BLUR BACKGROUND */}
//           <div
//             className="crop-bg"
//             style={{ backgroundImage: `url(${imageSrc})` }}
//           />

//           {/* 🔥 CROP FRAME */}
//           <div className="crop-box">
//             <Cropper
//               image={imageSrc}
//               crop={crop}
//               zoom={zoom}
//               aspect={377 / 416}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//               zoomWithScroll={false}
//               restrictPosition={false}
//               objectFit="contain"
//             />
//           </div>

//           {/* 🔥 BOTTOM BAR */}
//           <div className="crop-footer">
//             <button onClick={() => setImageSrc(null)}>Cancel</button>
//             <button onClick={handleUpload}>
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UploadCustomTemplate;


"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useRouter } from "next/navigation";
import getCroppedImg from "@/utils/cropImage";
import { BASE_URL } from "@/utils/apiconstants";
import { saveTemplate } from "@/utils/indexedDB";
import "./UploadCustomTemplate.css";

const UploadCustomTemplate = ({
  eventId,
  userId,
  token,
  label = "Upload Your Own Design",
}) => {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ===== FILE SELECT ===== */
  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  /* ===== CROP COMPLETE ===== */
  const onCropComplete = useCallback((_, pixels) => {
    setCroppedPixels(pixels);
  }, []);

  /* ===== FINAL UPLOAD ===== */
  const handleUpload = async () => {
    try {
      setUploading(true);

      const croppedImage = await getCroppedImg(imageSrc, croppedPixels);

      // Save locally
      await saveTemplate(`template_${eventId}`, croppedImage);

      // Convert to blob
      const blob = await fetch(croppedImage).then((r) => r.blob());
      const formData = new FormData();
      formData.append("image", blob);
      formData.append("userId", userId);

      await fetch(
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
        {
          method: "PUT",
          headers: { Authorization: token },
          body: formData,
        }
      );

      router.replace(`/wonderland/invite?eventid=${eventId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* ===== UPLOAD CARD ===== */}
      <div
        className="upload-banner"
        onClick={() =>
          document.getElementById("custom-template-upload").click()
        }
      >
        <div className="upload-icon-wrapper">
          <span className="upload-plus">+</span>
        </div>
        <p>{label}</p>
      </div>

      <input
        id="custom-template-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={onSelectFile}
      />

      {/* ===== CROP MODAL ===== */}
      {imageSrc && (
        <div className="crop-modal">
          {/* BLUR BACKGROUND */}
          <div
            className="crop-bg"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />

          {/* CROP FRAME */}
          <div className="crop-box">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={377 / 416}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              zoomWithScroll={false}
              restrictPosition={false}
              objectFit="contain"
            />
          </div>

          {/* FOOTER */}
          <div className="crop-footer">
            <button onClick={() => setImageSrc(null)}>Cancel</button>
            <button onClick={handleUpload}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadCustomTemplate;
