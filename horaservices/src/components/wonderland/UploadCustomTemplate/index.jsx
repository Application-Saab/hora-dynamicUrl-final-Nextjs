// // "use client";

// // import { useState, useCallback } from "react";
// // import Cropper from "react-easy-crop";
// // import { useRouter } from "next/navigation";
// // import Image from "next/image";

// // import getCroppedImg from "@/utils/cropImage";
// // import { BASE_URL } from "@/utils/apiconstants";
// // import { saveTemplate } from "@/utils/indexedDB";

// // import CustomButton from "@/components/wonderland/common/CustomButton";

// // import "./UploadCustomTemplate.css";

// // const UploadCustomTemplate = ({
// //   eventId,
// //   userId,
// //   token,
// //   label = "Upload Your Own Design",
// // }) => {
// //   const router = useRouter();

// //   const [imageSrc, setImageSrc] = useState(null);
// //   const [crop, setCrop] = useState({ x: 0, y: 0 });
// //   const [zoom, setZoom] = useState(1);
// //   const [croppedPixels, setCroppedPixels] = useState(null);
// //   const [uploading, setUploading] = useState(false);

// //   const onSelectFile = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     const reader = new FileReader();
// //     reader.onload = () => setImageSrc(reader.result);
// //     reader.readAsDataURL(file);
// //   };

// //   /* ===== CROP COMPLETE ===== */
// //   const onCropComplete = useCallback((_, pixels) => {
// //     setCroppedPixels(pixels);
// //   }, []);

// //   /* ===== FINAL UPLOAD ===== */
// //   const handleUpload = async () => {
// //     if (!imageSrc || !croppedPixels) return;

// //     try {
// //       setUploading(true);

// //       const croppedImage = await getCroppedImg(imageSrc, croppedPixels);

// //       // Save locally (IndexedDB)
// //       await saveTemplate(`template_${eventId}`, croppedImage);

// //       // Convert to blob
// //       const blob = await fetch(croppedImage).then((r) => r.blob());
// //       const formData = new FormData();
// //       formData.append("image", blob);
// //       formData.append("userId", userId);

// //       await fetch(
// //         `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
// //         {
// //           method: "PUT",
// //           headers: {
// //             Authorization: token,
// //           },
// //           body: formData,
// //         }
// //       );

// //       router.replace(`/wonderland/invite?eventid=${eventId}`);
// //     } catch (err) {
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* ===== UPLOAD CARD ===== */}
// //       <div
// //         className="upload-banner"
// //         onClick={() =>
// //           document.getElementById("custom-template-upload").click()
// //         }
// //       >
// //         <div className="upload-icon-wrapper">
// //           <span className="upload-plus">+</span>
// //         </div>
// //         <p>{label}</p>
// //       </div>

// //       <input
// //         id="custom-template-upload"
// //         type="file"
// //         accept="image/*"
// //         hidden
// //         onChange={onSelectFile}
// //       />

// //       {/* ===== CROP MODAL ===== */}
// //       {imageSrc && (
// //         <div className="crop-modal">
// //           {/* BLUR BACKGROUND */}
// //           <div
// //             className="crop-bg"
// //             style={{ backgroundImage: `url(${imageSrc})` }}
// //           />

// //           {/* CROP FRAME */}
// //           <div className="crop-box">
// //             <Cropper
// //               image={imageSrc}
// //               crop={crop}
// //               zoom={zoom}
// //               aspect={377 / 416}
// //               onCropChange={setCrop}
// //               onZoomChange={setZoom}
// //               onCropComplete={onCropComplete}
// //               zoomWithScroll={false}
// //               restrictPosition={false}
// //               objectFit="contain"
// //             />
// //           </div>

// //           {/* FOOTER BUTTONS */}
// //           <div className="crop-footer">
// //             <CustomButton
// //               title="Cancel"
// //               variant="outline"
// //               onClick={() => setImageSrc(null)}
// //               buttonClass="crop-btn"
// //             />

// //             <CustomButton
// //               title="Upload"
// //               variant="primary"
// //               onClick={handleUpload}
// //               loading={uploading}
// //               disabled={uploading}
// //               buttonClass="crop-btn"
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default UploadCustomTemplate;
// "use client";

// import { useState, useCallback } from "react";
// import Cropper from "react-easy-crop";
// import { useRouter } from "next/navigation";

// import getCroppedImg from "@/utils/cropImage";
// import { BASE_URL } from "@/utils/apiconstants";
// import { saveTemplate } from "@/utils/indexedDB";
// import CustomButton from "@/components/wonderland/common/CustomButton";

// import "./UploadCustomTemplate.css";

// const ASPECT = 377 / 416; // width / height

// const UploadCustomTemplate = ({
//   eventId,
//   userId,
//   token,
//   label = "Upload Your Own Design",
// }) => {
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
//     reader.onload = () => {
//       setImageSrc(reader.result);
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//     };
//     reader.readAsDataURL(file);
//   };

//   const onCropComplete = useCallback((_, pixels) => {
//     setCroppedPixels(pixels);
//   }, []);

//   const handleUpload = async () => {
//     if (!imageSrc || !croppedPixels) return;
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
//     } catch (err) {
//       console.error(err);
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
//         <div className="upload-icon-wrapper">
//           <span className="upload-plus">+</span>
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

//       {/* Crop Modal */}
//       {imageSrc && (
//         <div className="crop-modal">
//           {/* Blurred background */}
//           <div
//             className="crop-bg"
//             style={{ backgroundImage: `url(${imageSrc})` }}
//           />

//           {/* Spacer to push cropper to center */}
//           <div className="crop-spacer" />

//           {/* Cropper container — full width, fixed ratio height */}
//           <div className="crop-area-wrapper">
//             <Cropper
//               image={imageSrc}
//               crop={crop}
//               zoom={zoom}
//               aspect={ASPECT}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//               zoomWithScroll={true}
//               restrictPosition={false}
//               objectFit="horizontal-cover"
//               showGrid={false}
//               style={{
//                 containerStyle: {
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                 },
//                 cropAreaStyle: {
//                   border: "none",
//                   boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
//                   borderRadius: "12px",
//                 },
//               }}
//             />
//           </div>

//           <div className="crop-spacer" />

//           {/* Zoom Slider */}
//           {/* <div className="zoom-slider-wrapper">
//             <span className="zoom-icon">−</span>
//             <input
//               type="range"
//               min={1}
//               max={3}
//               step={0.01}
//               value={zoom}
//               onChange={(e) => setZoom(Number(e.target.value))}
//               className="zoom-slider"
//             />
//             <span className="zoom-icon">+</span>
//           </div> */}

//           {/* Footer Buttons */}
//           <div className="crop-footer">
//             <CustomButton
//               title="Cancel"
//               variant="outline"
//               onClick={() => setImageSrc(null)}
//               buttonClass="crop-btn"
//             />
//             <CustomButton
//               title="Upload"
//               variant="primary"
//               onClick={handleUpload}
//               loading={uploading}
//               disabled={uploading}
//               buttonClass="crop-btn"
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UploadCustomTemplate;

// "use client";

// import { useState, useCallback } from "react";
// import Cropper from "react-easy-crop";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// import getCroppedImg from "@/utils/cropImage";
// import { BASE_URL } from "@/utils/apiconstants";
// import { saveTemplate } from "@/utils/indexedDB";

// import CustomButton from "@/components/wonderland/common/CustomButton";

// import "./UploadCustomTemplate.css";

// const UploadCustomTemplate = ({
//   eventId,
//   userId,
//   token,
//   label = "Upload Your Own Design",
// }) => {
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

//   /* ===== CROP COMPLETE ===== */
//   const onCropComplete = useCallback((_, pixels) => {
//     setCroppedPixels(pixels);
//   }, []);

//   /* ===== FINAL UPLOAD ===== */
//   const handleUpload = async () => {
//     if (!imageSrc || !croppedPixels) return;

//     try {
//       setUploading(true);

//       const croppedImage = await getCroppedImg(imageSrc, croppedPixels);

//       // Save locally (IndexedDB)
//       await saveTemplate(`template_${eventId}`, croppedImage);

//       // Convert to blob
//       const blob = await fetch(croppedImage).then((r) => r.blob());
//       const formData = new FormData();
//       formData.append("image", blob);
//       formData.append("userId", userId);

//       await fetch(
//         `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: token,
//           },
//           body: formData,
//         }
//       );

//       router.replace(`/wonderland/invite?eventid=${eventId}`);
//     } catch (err) {
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <>
//       {/* ===== UPLOAD CARD ===== */}
//       <div
//         className="upload-banner"
//         onClick={() =>
//           document.getElementById("custom-template-upload").click()
//         }
//       >
//         <div className="upload-icon-wrapper">
//           <span className="upload-plus">+</span>
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
//           {/* BLUR BACKGROUND */}
//           <div
//             className="crop-bg"
//             style={{ backgroundImage: `url(${imageSrc})` }}
//           />

//           {/* CROP FRAME */}
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

//           {/* FOOTER BUTTONS */}
//           <div className="crop-footer">
//             <CustomButton
//               title="Cancel"
//               variant="outline"
//               onClick={() => setImageSrc(null)}
//               buttonClass="crop-btn"
//             />

//             <CustomButton
//               title="Upload"
//               variant="primary"
//               onClick={handleUpload}
//               loading={uploading}
//               disabled={uploading}
//               buttonClass="crop-btn"
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UploadCustomTemplate;

"use client";

import { useState, useCallback } from "react";
// import Cropper from "react-easy-crop";
import { useRouter } from "next/navigation";

import getCroppedImg from "@/utils/cropImage";
import { BASE_URL } from "@/utils/apiconstants";
import { saveTemplate } from "@/utils/indexedDB";
import CustomButton from "@/components/wonderland/common/CustomButton";

import "./UploadCustomTemplate.css";

const ASPECT = 377 / 416; // width / height

const UploadCustomTemplate = ({
  eventId,
  userId,
  token,
  label = "Upload Your Own Design",
}) => {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState(null);
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);
  // const [croppedPixels, setCroppedPixels] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      // setCrop({ x: 0, y: 0 });
      // setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  // const onCropComplete = useCallback((_, pixels) => {
  //   setCroppedPixels(pixels);
  // }, []);

  const handleUpload = async () => {
    if (!imageSrc) return;

    try {
      setUploading(true);

      const blob = await fetch(imageSrc).then((r) => r.blob());

      const formData = new FormData();
      formData.append("image", blob);
      formData.append("userId", userId);

      await fetch(
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
        {
          method: "PUT",
          headers: { Authorization: token },
          body: formData,
        },
      );

      await saveTemplate(`template_${eventId}`, imageSrc);

      router.replace(`/wonderland/invite?eventid=${eventId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Upload Card */}
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

      {/* Crop Modal */}
      {imageSrc && (
        <div className="crop-modal">
          {/* Background */}
          <div
            className="crop-bg"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />

          <div className="crop-spacer" />

          {/* Image Preview */}
          <div className="image-preview-wrapper">
            <img src={imageSrc} alt="Preview" className="preview-image" />
          </div>

          <div className="crop-spacer" />

          {/* Footer */}
          <div className="crop-footer">
            <CustomButton
              title="Cancel"
              variant="outline"
              onClick={() => setImageSrc(null)}
              buttonClass="crop-btn"
            />
            <CustomButton
              title="Upload"
              variant="primary"
              onClick={handleUpload}
              loading={uploading}
              disabled={uploading}
              buttonClass="crop-btn"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UploadCustomTemplate;
