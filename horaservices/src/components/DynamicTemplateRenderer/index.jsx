// // // "use client";

// // // import { useEffect, useState, useRef } from "react";
// // // import { useSearchParams, useRouter } from "next/navigation";
// // // import {
// // //   BASE_URL,
// // //   GET_ALL_TEMPLATES,
// // //   UPLOAD_THANKYOU_NOTE,
// // // } from "@/utils/apiconstants";
// // // import html2canvas from "html2canvas";
// // // import TestImg from "../../assets/BabyWelcomeIMG.png";
// // // import Image from "next/image";

// // // const DynamicTemplateRenderer = () => {
// // //   const router = useRouter();
// // //   const searchParams = useSearchParams();

// // //   const templateId = searchParams.get("templateId");
// // //   const eventId = searchParams.get("id");

// // //   const token =
// // //     typeof window !== "undefined" ? localStorage.getItem("token") : null;

// // //   const isEdit = Boolean(eventId);

// // //   const [template, setTemplate] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const templateRef = useRef(null);

// // //   const [formData, setFormData] = useState({
// // //     eventType: "",
// // //     name: "",
// // //     date: "",
// // //     time: "",
// // //     address: "",
// // //     templateId: templateId || "",
// // //   });

// // //   const [uploadedImage, setUploadedImage] = useState(null);
// // //   const fileInputRef = useRef(null);

// // //   /** Fetch template */
// // //   useEffect(() => {
// // //     if (!templateId) {
// // //       setError("No template selected");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     const fetchTemplate = async () => {
// // //       try {
// // //         const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
// // //         const result = await response.json();

// // //         if (result.error) {
// // //           setError(result.message || "Failed to fetch template");
// // //         } else {
// // //           const selectedTemplate = result.templates.find(
// // //             (tpl) => tpl._id === templateId
// // //           );

// // //           if (selectedTemplate) {
// // //             let { cssCode, jsCode, fontUrls, backgroundUrl } =
// // //               selectedTemplate.configs;

// // //             // Use the absolute background URL from API
// // //             if (backgroundUrl) {
// // //               cssCode = cssCode.replace(
// // //                 /url\((['"]?).*?\1\)/g,
// // //                 `url('${selectedTemplate.backgroundUrl}')`
// // //               );
// // //             }

// // //             setTemplate({
// // //               cssCode: cssCode || "",
// // //               jsCode: jsCode || "",
// // //               fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
// // //               backgroundUrl: selectedTemplate.backgroundUrl || null,
// // //               isHeroImage: selectedTemplate.configs?.isHeroImage || false,
// // //             });
// // //           } else {
// // //             setError("Template not found");
// // //           }
// // //         }
// // //       } catch (err) {
// // //         setError("Error fetching template: " + err.message);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchTemplate();
// // //   }, [templateId]);

// // //   /** Fetch event details (Edit Mode) */
// // //   const fetchOrderDetails = async () => {
// // //     try {
// // //       const res = await fetch(
// // //         `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
// // //         {
// // //           method: "GET",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: token,
// // //           },
// // //         }
// // //       );

// // //       const result = await res.json();

// // //       if (res.status === 200 && result.data) {
// // //         const data = result.data;

// // //         const formattedDate = data.eventDate
// // //           ? new Date(data.eventDate).toISOString().split("T")[0]
// // //           : "";

// // //         const formattedTime = data.eventTime ? data.eventTime.slice(0, 5) : "";

// // //         setFormData({
// // //           name: data.hostName || "",
// // //           eventType: data.eventType || "",
// // //           date: formattedDate,
// // //           time: formattedTime,
// // //           address: data.location || "",
// // //           templateId: templateId,
// // //           isHeroImage: template?.isHeroImage || false,
// // //         });

// // //         setUploadedImage(data.hostImage || null);
// // //       }
// // //     } catch (err) {
// // //       console.error("Fetch failed:", err);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (eventId) {
// // //       fetchOrderDetails();
// // //     }
// // //   }, [eventId]);

// // //   /** Input Change */
// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prev) => ({ ...prev, [name]: value }));
// // //   };
// // //   const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
// // //     return new Promise((resolve, reject) => {
// // //       const img = new Image();
// // //       img.onload = () => {
// // //         const canvas = document.createElement("canvas");
// // //         const ratio = img.width / img.height;
// // //         const newWidth = Math.min(img.width, maxWidth);
// // //         const newHeight = newWidth / ratio;

// // //         canvas.width = newWidth;
// // //         canvas.height = newHeight;

// // //         const ctx = canvas.getContext("2d");
// // //         ctx.drawImage(img, 0, 0, newWidth, newHeight);

// // //         const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
// // //         resolve(compressedBase64);
// // //       };
// // //       img.onerror = reject;
// // //       img.src = base64;
// // //     });
// // //   };

// // //   const handleImageChange = async (e) => {
// // //     const file = e.target.files[0];
// // //     if (!file) return;

// // //     const reader = new FileReader();
// // //     reader.onloadend = async () => {
// // //       try {
// // //         const compressed = await compressBase64Image(reader.result, 500, 0.4);
// // //         setUploadedImage(compressed);
// // //       } catch (err) {
// // //         console.error("Image compression failed:", err);
// // //         alert("Image compress karne mein error aaya.");
// // //       }
// // //     };
// // //     reader.readAsDataURL(file);
// // //   };

// // //   const userId =
// // //     typeof window !== "undefined" ? localStorage.getItem("userID") : null;
// // //   console.log(
// // //     "%c [ userId ]-185",
// // //     "font-size:13px; background:pink; color:#bf2c9f;",
// // //     userId
// // //   );

// // //   const handleSave = async () => {
// // //     if (!userId) {
// // //       alert("User not logged in or UserId missing.");
// // //       return;
// // //     }

// // //     handleDownload();

// // //     // const payload = {
// // //     //   userId: userId,
// // //     //   eventType: formData.eventType,
// // //     //   hostName: formData.name,
// // //     //   eventDate: formData.date ? new Date(formData.date).toISOString() : "",
// // //     //   eventTime: formData.time || "",
// // //     //   location: formData.address,
// // //     //   // templateId: formData.templateId,
// // //     // };

// // //     // try {
// // //     //   const res = await fetch(
// // //     //     `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
// // //     //     {
// // //     //       method: isEdit ? "PUT" : "POST",
// // //     //       headers: {
// // //     //         "Content-Type": "application/json",
// // //     //         Authorization: token,
// // //     //       },
// // //     //       body: JSON.stringify(payload),
// // //     //     }
// // //     //   );

// // //     //   if (res.ok) {
// // //     //     // router.replace(`/wonderland?id=${userId}/${eventId || "new"}/host`);
// // //     //   } else {
// // //     //     const errData = await res.json();
// // //     //     alert(`Failed: ${errData.message || "Unknown error"}`);
// // //     //   }
// // //     // } catch (err) {
// // //     //   console.error("Error:", err);
// // //     //   alert("Something went wrong.");
// // //     // }
// // //   };

// // //   const handleDownload = async () => {
// // //     // if (noteTitle.trim() === "") {
// // //     //   // setErrorMsg("Please write a thank you message.");
// // //     //   return;
// // //     // }

// // //     // setShowPopup(false);
// // //     const canvas = await html2canvas(templateRef.current, {
// // //       backgroundColor: null,
// // //       useCORS: true,
// // //     });

// // //     canvas.toBlob(async (blob) => {
// // //       if (!blob) return;

// // //       const file = new File([blob], "sticky-note.png", {
// // //         type: "image/png",
// // //         lastModified: new Date().getTime(),
// // //       });

// // //       const formData = new FormData();
// // //       formData.append("image", file);
// // //       formData.append("userId", userId);
// // //       try {
// // //         const response = await fetch(
// // //           `${BASE_URL}${UPLOAD_THANKYOU_NOTE}/${eventId}/thankyou-note`,
// // //           {
// // //             method: "PUT",
// // //             headers: {
// // //               Authorization: `${token}`,
// // //             },
// // //             body: formData,
// // //           }
// // //         );
// // //         const result = await response.json();

// // //         // if (result.success && result.uploaded && result.uploaded[0]?.url) {
// // //         //   // ✅ Add the uploaded image to eventData so it shows in the UI
// // //         //   const newImage = {
// // //         //     type: "image",
// // //         //     src: result.uploaded[0].url,
// // //         //     alt: "Thank You Note",
// // //         //   };
// // //         //   // setEventData((prev) => [newImage, ...prev]);
// // //         // }
// // //         // setRefetchEventImages(!refetchEventImages);
// // //         // setShowPopup(false);
// // //         // setNoteTitle("");
// // //         // setNoteBy("");
// // //       } catch (err) {
// // //         console.error("Upload failed:", err);
// // //       }
// // //     }, "image/png");
// // //   };

// // //   /** Replace variables inside template */
// // //   const renderHTML = (jsCode, rawData) => {
// // //     return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
// // //   };

// // //   if (loading) return <p>Loading template...</p>;
// // //   if (error) return <p style={{ color: "red" }}>{error}</p>;

// // //   return (
// // //     <div style={{ padding: "20px" }}>
// // //       {/* Template Preview with Background */}
// // //       <div ref={templateRef}>
// // //         {/*
// // //       <div
// // //         style={{
// // //           // backgroundImage: template?.backgroundUrl
// // //           //   ? `url('${template.backgroundUrl}')`
// // //           //   : "none",
// // //           // backgroundImage:  `url(${template.backgroundUrl})`,
// // //           backgroundImage:  `https://res.cloudinary.com/dlewjmnku/image/upload/v1741768091/student/student_image_a1c163fc-42f0-49be-a689-78bc6dfb62e2.jpg`,
// // //           backgroundSize: "cover",
// // //           backgroundPosition: "center",
// // //           minHeight: "400px",
// // //           borderRadius: "12px",
// // //           position: "relative",
// // //         }}

// // //       > */}

// // //         <div
// // //           style={{
// // //             backgroundImage: `url(${template?.backgroundUrl})`,
// // //             backgroundSize: "cover",
// // //             backgroundPosition: "center",
// // //             minHeight: "400px",
// // //             borderRadius: "12px",
// // //             position: "relative",
// // //           }}
// // //         >
// // //           <img
// // //             src={template?.backgroundUrl}
// // //             crossOrigin="anonymous"
// // //             style={{
// // //               position: "absolute",
// // //               inset: 0,
// // //               width: "100%",
// // //               height: "100%",
// // //               objectFit: "cover",
// // //               borderRadius: "12px",
// // //               zIndex: 1,
// // //             }}
// // //             alt="background"
// // //           />
// // //           {/* Fonts */}
// // //           {template?.fontUrls?.map((url, idx) => (
// // //             <link key={idx} href={url} rel="stylesheet" />
// // //           ))}

// // //           {/* CSS */}
// // //           {template?.cssCode && (
// // //             <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
// // //           )}

// // //           {/* Template HTML */}
// // //           {template?.jsCode && (
// // //             <div
// // //               style={{ position: "relative", zIndex: 2 }}
// // //               dangerouslySetInnerHTML={{
// // //                 __html: renderHTML(template.jsCode, formData),
// // //               }}
// // //             />
// // //           )}

// // //           {/* Uploaded Host Image */}
// // //           {uploadedImage && (
// // //             <img
// // //               src={uploadedImage}
// // //               alt="Host"
// // //               style={{
// // //                 position: "absolute",
// // //                 bottom: "20px",
// // //                 right: "20px",
// // //                 width: "100px",
// // //                 height: "100px",
// // //                 borderRadius: "50%",
// // //                 objectFit: "cover",
// // //                 border: "3px solid white",
// // //                 zIndex: 3,
// // //               }}
// // //             />
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Form */}
// // //       <div style={formWrapper}>
// // //         <h3>Customize Invite {isEdit ? "(Edit Mode)" : ""}</h3>

// // //         <input
// // //           type="text"
// // //           placeholder="Event Name"
// // //           name="eventType"
// // //           value={formData.eventType}
// // //           onChange={handleChange}
// // //           style={inputStyle}
// // //         />
// // //         <input
// // //           type="text"
// // //           placeholder="Host Name"
// // //           name="name"
// // //           value={formData.name}
// // //           onChange={handleChange}
// // //           style={inputStyle}
// // //         />

// // //         <div style={{ display: "flex", gap: "10px" }}>
// // //           <div style={{ flex: 1 }}>
// // //             <label>Event Date</label>
// // //             <input
// // //               type="date"
// // //               name="date"
// // //               value={formData.date}
// // //               onChange={handleChange}
// // //               style={inputStyle}
// // //             />
// // //           </div>
// // //           <div style={{ flex: 1 }}>
// // //             <label>Event Time</label>
// // //             <input
// // //               type="time"
// // //               name="time"
// // //               value={formData.time}
// // //               onChange={handleChange}
// // //               style={inputStyle}
// // //             />
// // //           </div>
// // //         </div>

// // //         <input
// // //           type="text"
// // //           placeholder="Venue"
// // //           name="address"
// // //           value={formData.address}
// // //           onChange={handleChange}
// // //           style={inputStyle}
// // //         />

// // //         {/* Always render file input, but keep it hidden */}
// // //         <input
// // //           type="file"
// // //           accept="image/*"
// // //           id="file-upload"
// // //           onChange={handleImageChange}
// // //           ref={fileInputRef}
// // //           hidden
// // //         />

// // //         {/* Conditional UI display */}
// // //         {uploadedImage ? (
// // //           <div
// // //             onClick={() => {
// // //               if (fileInputRef.current) fileInputRef.current.click();
// // //             }}
// // //             style={previewWrapper}
// // //           >
// // //             <img src={uploadedImage} alt="Preview" style={imagePreview} />
// // //             <div>Tap to change photo</div>
// // //           </div>
// // //         ) : (
// // //           <label style={uploadBox} htmlFor="file-upload">
// // //             <img src="/camera-icon.png" alt="Upload" width={40} />
// // //             <div>Upload Photo</div>
// // //           </label>
// // //         )}

// // //         <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
// // //           <button onClick={() => router.back()} style={cancelBtn}>
// // //             Cancel
// // //           </button>
// // //           <button onClick={handleSave} style={saveBtn}>
// // //             {isEdit ? "Update" : "Save"}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // /** ---- Styles ---- */
// // // const formWrapper = { marginTop: "30px", maxWidth: "500px" };
// // // const inputStyle = {
// // //   width: "100%",
// // //   margin: "8px 0",
// // //   padding: "10px",
// // //   border: "1px solid #ccc",
// // //   borderRadius: "4px",
// // //   fontSize: "14px",
// // // };
// // // const previewWrapper = {
// // //   margin: "10px 0",
// // //   cursor: "pointer",
// // //   textAlign: "center",
// // // };
// // // const imagePreview = {
// // //   width: "100%",
// // //   maxHeight: "200px",
// // //   objectFit: "cover",
// // //   borderRadius: "8px",
// // // };
// // // const uploadBox = {
// // //   border: "2px dashed #aaa",
// // //   padding: "20px",
// // //   textAlign: "center",
// // //   cursor: "pointer",
// // // };
// // // const cancelBtn = {
// // //   flex: 1,
// // //   background: "#ccc",
// // //   padding: "10px",
// // //   border: "none",
// // //   borderRadius: "4px",
// // //   cursor: "pointer",
// // // };
// // // const saveBtn = {
// // //   flex: 1,
// // //   background: "#4CAF50",
// // //   color: "#fff",
// // //   padding: "10px",
// // //   border: "none",
// // //   borderRadius: "4px",
// // //   cursor: "pointer",
// // // };

// // // export default DynamicTemplateRenderer;

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import html2canvas from "html2canvas";
import "./DynamicTemplateRenderer.css";
import { dateFormatter, imageForTest } from "./dateTimeFormatters";
import CameraIcon from '@/assets/camera.png'
import Cropper from 'react-easy-crop';
import EditIcon from '@/assets/edit.png';
import { FaCropAlt } from "react-icons/fa";
import { BiZoomOut } from "react-icons/bi";
import { BiZoomIn } from "react-icons/bi";

const DynamicTemplateRenderer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateRef = useRef(null);
  const templateId = searchParams.get("templateId");
  const eventId = searchParams.get("id");
  const defaultTemplateId = '68d7c6cb3d8722ccf540b91c';
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [template, setTemplate] = useState(null);
  console.log('%c [ template ]-554', 'font-size:13px; background:pink; color:#bf2c9f;', template)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    eventType: "",
    name: "",
    date: "",
    time: "",
    address: "",
    templateId: templateId || "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [dataForTemplate, setDataForTemplate] = useState({
    eventType: formData.eventType,
    name: formData?.name,
    date: dateFormatter(formData?.date, template?.dateFormatCase),
    day: dateFormatter(formData?.date, template?.dateFormatCase)?.day,
    month: dateFormatter(formData?.date, template?.dateFormatCase)?.month,
    year: dateFormatter(formData?.date, template?.dateFormatCase)?.year,
    time: formData?.time,
    address: formData?.address,
    templateId: templateId || "",
    image: uploadedImage,
  });
  console.log('%c [ dataForTemplate ]-567', 'font-size:13px; background:pink; color:#bf2c9f;', dataForTemplate)
  console.log('%c [ dateFormatter(formData?.date, template?.dateFormatCase)?.day ]-571', 'font-size:13px; background:pink; color:#bf2c9f;', dateFormatter(formData?.date, template?.dateFormatCase)?.day)
  
  const [formErrors, setFormErrors] = useState({
    eventType: "",
    name: "",
    address: "",
  });
  const [charCounts, setCharCounts] = useState({
    eventType: 0,
    name: 0,
    address: 0,
  });

  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropShape, setCropShape] = useState('rect'); // 'rect' or 'round'
  const [aspectRatio, setAspectRatio] = useState(4 / 3); // Default aspect ratio fro rectangular shape
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 }); // Adjust based on template needs
  
  useEffect(() => {
    setDataForTemplate({
      eventType: formData.eventType,
      name: formData.name,
      date: dateFormatter(formData.date, template?.dateFormatCase || "1"),
      day: dateFormatter(formData?.date, template?.dateFormatCase)?.day,
      month: dateFormatter(formData?.date, template?.dateFormatCase)?.month,
      year: dateFormatter(formData?.date, template?.dateFormatCase)?.year,
      time: formData.time,
      address: formData.address,
      templateId: templateId || "",
      image: uploadedImage,
    });
  }, [formData, template, uploadedImage]);

  console.log('%c [ uploadedImage ]-607', 'font-size:13px; background:pink; color:#bf2c9f;', uploadedImage)
  const fileInputRef = useRef(null);

  /** Fetch template */
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
        const result = await response.json();

        if(templateId){
          if (result.error) {
          setError(result.message || "Failed to fetch template");
        } else {
          const selectedTemplate = result.templates.find(
            (tpl) => tpl._id === templateId
          );
          console.log('%c [ selectedTemplate ]-626', 'font-size:13px; background:pink; color:#bf2c9f;', selectedTemplate)

          if (selectedTemplate) {
            let { cssCode, jsCode, fontUrls, backgroundUrl } =
              selectedTemplate.configs;

            // Use the absolute background URL from API
            if (backgroundUrl) {
              cssCode = cssCode.replace(
                /url\((['"]?).*?\1\)/g,
                `url('${selectedTemplate.backgroundUrl}')`
              );
            }

            setTemplate({
              cssCode: cssCode || "",
              jsCode: jsCode || "",
              fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
              backgroundUrl: selectedTemplate.backgroundUrl || null,
              isHeroImage: selectedTemplate?.isHeroImage || false,
              bgImageName: selectedTemplate?.configs?.bgImageName || "",
              charLimits: selectedTemplate.configs?.charLimits || {},
              dateFormatCase: selectedTemplate?.configs?.dateFormatCase || "1",
              // heroImageConfig: selectedTemplate?.configs?.heroImageConfig || {
              //   cropSize : {height : 200, width: 200},
              //   cropRatio : {width : 4, height : 3},
              //   cropShape : 'rect'
              // }
            });
            setCropShape(selectedTemplate?.configs?.heroImageConfig?.cropShape || 'rect');
            setAspectRatio((selectedTemplate?.configs?.heroImageConfig?.cropRatio?.width || 4)  / (selectedTemplate?.configs?.heroImageConfig?.cropRatio?.height || 3));
            setCropSize({
              width : selectedTemplate?.configs?.heroImageConfig?.cropSize?.width || 200,
              height: selectedTemplate?.configs?.heroImageConfig?.cropSize?.height || 200
            })
          } else {
            setError("Template not found");
          }
        }
        }
      } catch (err) {
        setError("Error fetching template: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  /** Fetch event details (Edit Mode) */
  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const result = await res.json();

      if (res.status === 200 && result.data) {
        const data = result.data;

        const formattedDate = data.eventDate
          ? new Date(data.eventDate).toISOString().split("T")[0]
          : "";

        const formattedTime = data.eventTime ? data.eventTime.slice(0, 5) : "";

        setFormData({
          name: data.hostName || "",
          eventType: data.eventType || "",
          date: formattedDate,
          time: formattedTime,
          address: data.location || "",
          templateId: templateId,
          isHeroImage: template?.isHeroImage || false,
        });

        setCharCounts({
          eventType: data.eventType?.length || 0,
          name: data.hostName?.length || 0,
          address: data.location?.length || 0,
        });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchOrderDetails();
    }
  }, [eventId]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  const charLimit = template?.charLimits?.[name]
    ? parseInt(template.charLimits[name])
    : Infinity;

  // Always allow change but trim if exceeds limit
  const newValue = value.length > charLimit ? value.slice(0, charLimit) : value;

  setFormData((prev) => ({ ...prev, [name]: newValue }));
  setCharCounts((prev) => ({ ...prev, [name]: newValue.length }));

  if (value.length > charLimit) {
    setFormErrors((prev) => ({
      ...prev,
      [name]: `Character limit of ${charLimit} exceeded`,
    }));
  } else {
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  }
};




  const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = img.width / img.height;
        const newWidth = Math.min(img.width, maxWidth);
        const newHeight = newWidth / ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = base64;
    });
  };

    const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 1));
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = cropImage;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = cropSize.width;
      canvas.height = cropSize.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        cropSize.width,
        cropSize.height
      );

      const croppedBase64 = canvas.toDataURL("image/jpeg");
      const compressed = await compressBase64Image(croppedBase64, 500, 0.4);
      setUploadedImage(compressed);
      setCropImage(null); // Close cropper
    } catch (err) {
      console.error("Crop failed:", err);
      alert("Failed to crop image.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressed = await compressBase64Image(reader.result, 500, 0.4);
        setUploadedImage(compressed);
        setOriginalImage(compressed);
        setCropImage(compressed); // Open cropper with uploaded image
      } catch (err) {
        console.error("Image compression failed:", err);
        alert("Error on image compression.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditImage = () => {
    if (originalImage) {
      setCropImage(originalImage);
    } else {
      alert("No original image available for editing.");
    }
  };

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;

  const handleSave = async () => {
    setSaving(true);
    if (!userId) {
      alert("User not logged in or UserId missing.");
      setSaving(false);
      return;
    }

    const payload = {
      userId: userId,
      eventType: formData.eventType,
      hostName: formData.name,
      eventDate: formData.date ? new Date(formData.date).toISOString() : "",
      eventTime: formData.time || "",
      location: formData.address,
    };

    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        handleDownload();
      } else {
        setSaving(false);
        const errData = await res.json();
        alert(`Failed: ${errData.message || "Unknown error"}`);
      }
    } catch (err) {
      setSaving(false);
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };
  const handleDownload = async () => {
    const canvas = await html2canvas(templateRef.current, {
      backgroundColor: null,
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], `invite_${template?.bgImageName}`, {
        type: "image/png",
        lastModified: new Date().getTime(),
      });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);
      try {
        const response = await fetch(
          `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `${token}`,
            },
            body: formData,
          }
        );
        const result = await response.json();

        if (result) {
          setSaving(false);
          router.replace(`/wonderland?id=${userId}/${eventId}/host`);
        }
      } catch (err) {
        setSaving(false);
        console.error("Upload failed:", err);
      }
    }, "image/png");
  };

const renderHTML = (jsCode, rawData) => {
  // Handle conditional blocks: {{#if key}} ... {{/if}}
  jsCode = jsCode.replace(/{{#if (.*?)}}([\s\S]*?){{\/if}}/g, (_, key, inner) => {
    const value = rawData[key.trim()];
    if (value) {
      // replace inner placeholders normally
      return inner.replace(/{{(.*?)}}/g, (_, innerKey) => {
        return rawData[innerKey.trim()] || "";
      });
    }
    return "";
  });

  // Handle normal placeholders: {{key}}
  return jsCode.replace(/{{(.*?)}}/g, (_, key) => {
    try {
      return key
        .trim()
        .split(".")
        .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""), rawData) || "";
    } catch {
      return "";
    }
  });
};



  if (loading) return <p>Loading template...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (

<div className="d-flex justify-content-center">
      <div style={{ padding: "10px", maxWidth: '500px', width: '100%' }}>
<div
        ref={templateRef}
        className="template-container"
        style={{
          backgroundImage: template?.bgImageName
            ? `url('/assets/templates/${template?.bgImageName}')`
            : "none",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          maxHeight: "530px",
          maxWidth: "480px",
          width: "100%",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        {/* Fonts */}
        {template?.fontUrls?.map((url, idx) => (
          <link key={idx} href={url} rel="stylesheet" />
        ))}

        {/* CSS */}
        {template?.cssCode && (
          <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
        )}

        {/* Template HTML */}
        {template?.jsCode && (
          <div
            style={{ position: "relative", zIndex: 2 }}
            dangerouslySetInnerHTML={{
              __html: renderHTML(template.jsCode, dataForTemplate),
            }}
          />
        )}

        

        {/* <div style={{ position: "relative", zIndex: 2 }}>
            <div class="invite-template-wrapper">
        <div class="invite-template-card">

         {{#if image}}
          <div class='template-image-wrapper'>
            <img src={{image}} alt="host image" class='template-image' />
        </div>
        {{/if}}

          <div class="default-temp-heading">It’s Time To Party!</div>
          <div class="name">{{name}}</div>
          <div class="date"><span><span>📅</span><span class='px-1'>Date :</span>{{date}}</span></div>
          <div class="time"><span><span>⏰</span><span class='px-1'>Time :</span>{{time}} AM</span></div>
          <div class="address">
            <p>{{address}}</p>
          </div>
        </div>
      </div>
        </div> */}
      </div>

      {/* Form */}
       <div className="form-wrapper">
         <h3 className="heading-txt">Do you Want <br /> customize Invite?</h3>
         <div style={{ position: "relative" }}>
           <input
            type="text"
             placeholder="Host Name"
             name="name"
             className="input-field"
             value={formData.name}
             onChange={handleChange}
             maxLength={template?.charLimits?.name || undefined}
             style={{
               borderColor: formErrors.name ? "red" : "#ccc",
             }}
           />
           {template?.charLimits?.name && (
             <div className="char-count">
               {charCounts.name}/{template.charLimits.name}
             </div>
           )}
           {formErrors.name && <div className="error-msg">{formErrors.name}</div>}
         </div>

         <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
           <div style={{ flex: 1 }}>
             <label className="input-label">Event Date</label>
             <input
               type="date"
               name="date"
               value={formData.date}
               className="input-field"
               onChange={handleChange}
             />
           </div>
           <div style={{ flex: 1 }}>
             <label className="input-label">Arrival Time</label>
             <input
               type="time"
               className="input-field"
               name="time"
               value={formData.time}
               onChange={handleChange}
             />
           </div>
         </div>

         <div style={{ position: "relative" }}>
           <textarea
             type="text"
             placeholder="Venue"
             name="address"
             className="input-field"
             value={formData.address}
             onChange={handleChange}
             maxLength={template?.charLimits?.address || undefined}
             style={{
               borderColor: formErrors.address ? "red" : "#ccc",
             }}
           />
           {template?.charLimits?.address && (
             <div className="char-count">
               {charCounts.address}/{template.charLimits.address}
             </div>
           )}
           {formErrors.address && (
             <div className="error-msg">{formErrors.address}</div>
           )}
         </div>

         <input
           type="file"
           accept="image/*"
           id="file-upload"
           onChange={handleImageChange}
           ref={fileInputRef}
           hidden
         />

        {/* Cropper Modal */}
        {cropImage && (
           <div className="crop-modal">
             <div className="cropper-container">
               <Cropper
                 image={cropImage}
                 crop={crop}
                 zoom={zoom}
                 aspect={aspectRatio}
                 cropShape={cropShape}
                 cropSize={cropSize}
                 onCropChange={setCrop}
                 onCropComplete={onCropComplete}
                 onZoomChange={setZoom}
               />
             </div>
             <div className="crop-controls">
               <div className="zoom-container">
                <div>
                  <button className={`btn zoom-btns ${zoom === 1 && 'btn-disabled'}`} disabled={zoom === 1}>
                     <BiZoomOut size={30} className="zoom-icons" onClick={handleZoomOut}  />
                  </button>
                </div>
               <input
                  type="range"
                  id="zoom"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="zoom-range"
              />
              <div>
                <button className={`btn zoom-btns ${zoom === 3 && 'btn-disabled'}`} disabled={zoom === 3}>
                  <BiZoomIn size={30} className="zoom-icons" onClick={handleZoomIn} />
                </button>
              </div>
               </div>
              <div className="d-flex justify-content-center align-items-center w-100 gap-4">
                 <div className="d-flex justify-content-end w-100">
                  <button onClick={() => setCropImage(null)} className="crop-cancel-btn">
                 Cancel
               </button>
                 </div>
                 <div className="w-100">
               <button onClick={createCroppedImage} className="crop-save-btn">
                 Save
               </button>
                 </div>
             </div>
             </div>
           </div>
         )}

         {template?.isHeroImage &&
           (originalImage ? (
             <div
               className="preview-wrapper-template"
             >
               <div className="preview-image-div">
                <img src={originalImage} alt="Preview" className="image-preview-template"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                />
               </div>
               <div className="d-flex justify-content-center align-items-end ms-2">
                <button className="crop-btn" onClick={handleEditImage}><FaCropAlt className="crop-icon" /> Crop</button>
               </div>
             </div>
           ) : (
             <label className="upload-box-template" htmlFor="file-upload">
               <img src={CameraIcon.src} height='45px' width='45px' alt="Upload" />
               <div className="mt-2 fw-bold" style={{color: '#666666'}}>Upload Photo</div>
             </label>
           ))}

         <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
           <button
             onClick={() => router.back()}
             className="cancel-btn"
             disabled={saving}
           >
             CANCEL
           </button>
           <button
             onClick={handleSave}
              className="save-btn"
             style={{
               cursor: saving ? "not-allowed" : "pointer",
               opacity: saving ? 0.7 : 1,
             }}
             disabled={saving}
           >
             {saving ? "Saving..." : "SAVE"}
           </button>
         </div>
       </div>
    </div>
</div>
  );
};

export default DynamicTemplateRenderer;

// // "use client";

// // import { useEffect, useState, useRef } from "react";
// // import { useSearchParams, useRouter } from "next/navigation";
// // import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
// // import html2canvas from "html2canvas";
// // import "./DynamicTemplateRenderer.css";
// // import { dateFormatter } from "./dateTimeFormatters";

// // const DynamicTemplateRenderer = () => {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const templateRef = useRef(null);
// //   const fileInputRef = useRef(null);

// //   const templateId = searchParams.get("templateId");
// //   const eventId = searchParams.get("id");

// //   const token =
// //     typeof window !== "undefined" ? localStorage.getItem("token") : null;
// //   const userId =
// //     typeof window !== "undefined" ? localStorage.getItem("userID") : null;

// //   const isEdit = Boolean(eventId);
// //   const [template, setTemplate] = useState(null);
// //   console.log('%c [ template ]-1043', 'font-size:13px; background:pink; color:#bf2c9f;', template)
// //   console.log(
// //     "%c [ template ]-1053",
// //     "font-size:13px; background:pink; color:#bf2c9f;",
// //     template
// //   );
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [saving, setSaving] = useState(false);
// //   const [backgroundBase64, setBackgroundBase64] = useState(null);
// //   const [uploadedImage, setUploadedImage] = useState(null);
// //   const [formData, setFormData] = useState({
// //     eventType: "",
// //     name: "",
// //     date: "",
// //     time: "",
// //     address: "",
// //     templateId: templateId || "",
// //   });
// //   const [dataForTemplate, setDataForTemplate] = useState({
// //     eventType: formData.eventType,
// //     name: formData?.name,
// //     date: dateFormatter(formData?.date, template?.dateFormatCase),
// //     time: formData?.time,
// //     address: formData?.address,
// //     templateId: templateId || "",
// //   });

// //   const [formErrors, setFormErrors] = useState({
// //     eventType: "",
// //     name: "",
// //     address: "",
// //   });
// //   const [charCounts, setCharCounts] = useState({
// //     eventType: 0,
// //     name: 0,
// //     address: 0,
// //   });

// //   useEffect(() => {
// //     setDataForTemplate({
// //       eventType: formData.eventType,
// //       name: formData.name,
// //       date: dateFormatter(formData.date, template?.dateFormatCase || "1"),
// //       time: formData.time,
// //       address: formData.address,
// //       templateId: templateId || "",
// //     });
// //   }, [formData, template]); 

// //   /** Fetch template */
// //   useEffect(() => {
// //     if (!templateId) {
// //       setError("No template selected");
// //       setLoading(false);
// //       return;
// //     }

// //     const fetchTemplate = async () => {
// //       try {
// //         const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
// //         const result = await response.json();

// //         if (result.error) {
// //           setError(result.message || "Failed to fetch template");
// //         } else {
// //           const selectedTemplate = result.templates.find(
// //             (tpl) => tpl._id === templateId
// //           );

// //           if (selectedTemplate) {
// //             let { cssCode, jsCode, fontUrls, backgroundUrl } =
// //               selectedTemplate.configs;

// //             setTemplate({
// //               cssCode: cssCode || "",
// //               jsCode: jsCode || "",
// //               fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
// //               backgroundUrl: selectedTemplate.backgroundUrl || null,
// //               isHeroImage: selectedTemplate.configs?.isHeroImage || false,
// //               bgImageName: selectedTemplate.configs?.bgImageName || "",
// //               charLimits: selectedTemplate.configs?.charLimits || {},
// //               dateFormatCase: selectedTemplate?.configs?.dateFormatCase || "1",
// //             });
// //           } else {
// //             setError("Template not found");
// //           }
// //         }
// //       } catch (err) {
// //         setError("Error fetching template: " + err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTemplate();
// //   }, [templateId]);

// //   /** Convert S3 image to Base64 to bypass CORS */
// //   useEffect(() => {
// //     if (template?.backgroundUrl) {
// //       const convertToBase64 = async () => {
// //         try {
// //           const response = await fetch(template.backgroundUrl, {
// //             mode: "cors",
// //           });
// //           if (!response.ok) {
// //             throw new Error(`Fetch failed: ${response.statusText}`);
// //           }
// //           const blob = await response.blob();
// //           const reader = new FileReader();
// //           reader.onloadend = () => {
// //             setBackgroundBase64(reader.result);
// //             console.log("Base64 conversion successful");
// //           };
// //           reader.onerror = () => {
// //             console.error("Failed to read blob as Base64");
// //             setBackgroundBase64(template.backgroundUrl);
// //           };
// //           reader.readAsDataURL(blob);
// //         } catch (err) {
// //           console.error("Failed to convert S3 image to Base64:", err);
// //           setBackgroundBase64(template.backgroundUrl);
// //         }
// //       };
// //       convertToBase64();
// //     }
// //   }, [template?.backgroundUrl]);

// //   /** Fetch event details (Edit Mode) */
// //   const fetchOrderDetails = async () => {
// //     try {
// //       const res = await fetch(
// //         `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
// //         {
// //           method: "GET",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: token,
// //           },
// //         }
// //       );

// //       const result = await res.json();

// //       if (res.status === 200 && result.data) {
// //         const data = result.data;
// //         const formattedDate = data.eventDate
// //           ? new Date(data.eventDate).toISOString().split("T")[0]
// //           : "";
// //         const formattedTime = data.eventTime ? data.eventTime.slice(0, 5) : "";

// //         setFormData({
// //           name: data.hostName || "",
// //           eventType: data.eventType || "",
// //           // date: formattedDate,
// //           date: formattedDate,
// //           time: formattedTime,
// //           address: data.location || "",
// //           templateId: templateId,
// //           isHeroImage: template?.isHeroImage || false,
// //         });

// //         setCharCounts({
// //           eventType: data.eventType?.length || 0,
// //           name: data.hostName?.length || 0,
// //           address: data.location?.length || 0,
// //         });

// //         setUploadedImage(data.hostImage || null);
// //       }
// //     } catch (err) {
// //       console.error("Fetch failed:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (eventId) {
// //       fetchOrderDetails();
// //     }
// //   }, [eventId]);

// //   /** Input Change with Character Limit Validation */
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     const charLimit = template?.charLimits?.[name]
// //       ? parseInt(template.charLimits[name])
// //       : Infinity;

// //     if (value.length <= charLimit) {
// //       setFormData((prev) => ({ ...prev, [name]: value }));
// //       setCharCounts((prev) => ({ ...prev, [name]: value.length }));
// //       setFormErrors((prev) => ({ ...prev, [name]: "" }));
// //     } else {
// //       setFormErrors((prev) => ({
// //         ...prev,
// //         [name]: `Character limit of ${charLimit} exceeded`,
// //       }));
// //     }
// //   };

// //   /** Compress uploaded image */
// //   const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
// //     return new Promise((resolve, reject) => {
// //       const img = new Image();
// //       img.crossOrigin = "anonymous";
// //       img.onload = () => {
// //         const canvas = document.createElement("canvas");
// //         const ratio = img.width / img.height;
// //         const newWidth = Math.min(img.width, maxWidth);
// //         const newHeight = newWidth / ratio;

// //         canvas.width = newWidth;
// //         canvas.height = newHeight;

// //         const ctx = canvas.getContext("2d");
// //         ctx.drawImage(img, 0, 0, newWidth, newHeight);

// //         const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
// //         resolve(compressedBase64);
// //       };
// //       img.onerror = (err) => reject(err);
// //       img.src = base64;
// //     });
// //   };

// //   const handleImageChange = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const reader = new FileReader();
// //     reader.onloadend = async () => {
// //       try {
// //         const compressed = await compressBase64Image(reader.result, 500, 0.4);
// //         setUploadedImage(compressed);
// //       } catch (err) {
// //         console.error("Image compression failed:", err);
// //         alert("Image compress karne mein error aaya.");
// //       }
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   /** Save and Generate Canvas */
// //   const handleSave = async () => {
// //     if (!userId) {
// //       alert("User not logged in or UserId missing.");
// //       return;
// //     }

// //     // Check for errors before saving
// //     if (Object.values(formErrors).some((error) => error)) {
// //       alert("Please fix input errors before saving.");
// //       return;
// //     }

// //     setSaving(true);

// //     const payload = {
// //       userId: userId,
// //       eventType: formData.eventType,
// //       hostName: formData.name,
// //       eventDate: formData.date ? new Date(formData.date).toISOString() : "",
// //       eventTime: formData.time || "",
// //       location: formData.address,
// //     };

// //     try {
// //       // Save event details
// //       const eventRes = await fetch(
// //         `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
// //         {
// //           method: isEdit ? "PUT" : "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: token,
// //           },
// //           body: JSON.stringify(payload),
// //         }
// //       );

// //       if (!eventRes.ok) {
// //         const errData = await eventRes.json();
// //         throw new Error(errData.message || "Failed to save event details");
// //       }

// //       // Generate canvas
// //       const canvas = await html2canvas(templateRef.current, {
// //         backgroundColor: null,
// //         useCORS: true,
// //         scale: 2,
// //         logging: true,
// //       });

// //       canvas.toBlob(async (blob) => {
// //         if (!blob) {
// //           alert("Failed to generate image.");
// //           setSaving(false);
// //           return;
// //         }

// //         // Debug: Download canvas output
// //         const url = URL.createObjectURL(blob);
// //         const a = document.createElement("a");
// //         a.href = url;
// //         a.download = "test.png";
// //         a.click();
// //         URL.revokeObjectURL(url);

// //         const file = new File([blob], "sticky-note.png", {
// //           type: "image/png",
// //           lastModified: new Date().getTime(),
// //         });

// //         const formDataToSend = new FormData();
// //         formDataToSend.append("image", file);
// //         formDataToSend.append("userId", userId);

// //         try {
// //           const response = await fetch(
// //             `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
// //             {
// //               method: "PUT",
// //               headers: {
// //                 Authorization: `${token}`,
// //               },
// //               body: formDataToSend,
// //             }
// //           );
// //           const result = await response.json();

// //           if (response.ok && result) {
// //             alert("Thank you note saved successfully!");
// //             router.replace(`/wonderland?id=${userId}/${eventId}/host`);
// //           } else {
// //             alert(`Failed: ${result.message || "Unknown error"}`);
// //           }
// //         } catch (err) {
// //           console.error("Upload failed:", err);
// //           alert("Something went wrong while uploading the image.");
// //         } finally {
// //           setSaving(false);
// //         }
// //       }, "image/png");
// //     } catch (err) {
// //       console.error("Error:", err);
// //       alert("Something went wrong: " + err.message);
// //       setSaving(false);
// //     }
// //   };

// //   /** Replace variables in template */
// //   const renderHTML = (jsCode, rawData) => {
// //     if (!jsCode || !rawData) return "";
// //     return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
// //   };

// //   if (loading) return <p>Loading template...</p>;
// //   if (error) return <p style={{ color: "red" }}>{error}</p>;

// //   return (
// //     <div style={{ padding: "10px" }}>
// //       <div
// //         ref={templateRef}
// //         className="template-container"
// //         style={{
// //           backgroundImage: backgroundBase64
// //             ? `url(${backgroundBase64})`
// //             : template?.backgroundUrl
// //             ? `url(${template.backgroundUrl})`
// //             : "none",
// //           backgroundSize: "100% 100%",
// //           backgroundPosition: "center",
// //           backgroundRepeat: "no-repeat",
// //           maxHeight: "530px",
// //           maxWidth: "480px",
// //           width: "100%",
// //           borderRadius: "10px",
// //           position: "relative",
// //         }}
// //       >
// //         {template?.fontUrls?.map((url, idx) => (
// //           <link key={idx} href={url} rel="stylesheet" />
// //         ))}

// //         {template?.cssCode && (
// //           <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
// //         )}

// //         {/* {template?.jsCode && (
// //           <div
// //             style={{ position: "relative", zIndex: 2 }}
// //             dangerouslySetInnerHTML={{
// //               __html: renderHTML(template.jsCode, dataForTemplate),
// //             }}
// //           />
// //           )} */}

// //         <div style={{ position: "relative", zIndex: 2 }}>
// //           <div className="invite-wrapper">
// //             <div className="invite-card">
// //               <div className="name">{dataForTemplate.name}</div>
// //               <div className="datetime">{dataForTemplate.date}</div>
// //               <div className="time">At {dataForTemplate.time}</div>
// //               <div className="address">{dataForTemplate.address}</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Form */}
// //       <div style={formWrapper}>
// //         <h3>Customize Invite {isEdit ? "(Edit Mode)" : ""}</h3>
// //         <div style={{ position: "relative" }}>
// //           <label className="form-label">Host Name</label>
// //           <input
// //             type="text"
// //             placeholder="Host Name"
// //             name="name"
// //             className="form-control"
// //             value={formData.name}
// //             onChange={handleChange}
// //             maxLength={template?.charLimits?.name || undefined}
// //             style={{
// //               borderColor: formErrors.name ? "red" : "#ccc",
// //             }}
// //           />
// //           {template?.charLimits?.name && (
// //             <div style={charCountStyle}>
// //               {charCounts.name}/{template.charLimits.name}
// //             </div>
// //           )}
// //           {formErrors.name && <div style={errorStyle}>{formErrors.name}</div>}
// //         </div>

// //         <div style={{ display: "flex", gap: "10px" }}>
// //           <div style={{ flex: 1 }}>
// //             <label className="form-label">Event Date</label>
// //             <input
// //               type="date"
// //               name="date"
// //               value={formData.date}
// //               className="form-control"
// //               onChange={handleChange}
// //             />
// //           </div>
// //           <div style={{ flex: 1 }}>
// //             <label className="form-label">Event Time</label>
// //             <input
// //               type="time"
// //               className="form-control"
// //               name="time"
// //               value={formData.time}
// //               onChange={handleChange}
// //             />
// //           </div>
// //         </div>

// //         <div style={{ position: "relative" }}>
// //           <label className="form-label mt-2">Address</label>
// //           <textarea
// //             type="text"
// //             placeholder="Venue"
// //             name="address"
// //             className="form-control"
// //             value={formData.address}
// //             onChange={handleChange}
// //             maxLength={template?.charLimits?.address || undefined}
// //             style={{
// //               borderColor: formErrors.address ? "red" : "#ccc",
// //             }}
// //           />
// //           {template?.charLimits?.address && (
// //             <div style={charCountStyle}>
// //               {charCounts.address}/{template.charLimits.address}
// //             </div>
// //           )}
// //           {formErrors.address && (
// //             <div style={errorStyle}>{formErrors.address}</div>
// //           )}
// //         </div>

// //         <input
// //           type="file"
// //           accept="image/*"
// //           id="file-upload"
// //           onChange={handleImageChange}
// //           ref={fileInputRef}
// //           hidden
// //         />

// //         {template?.isHeroImage &&
// //           (uploadedImage ? (
// //             <div
// //               onClick={() => {
// //                 if (fileInputRef.current) fileInputRef.current.click();
// //               }}
// //               style={previewWrapper}
// //             >
// //               <img src={uploadedImage} alt="Preview" style={imagePreview} />
// //               <div>Tap to change photo</div>
// //             </div>
// //           ) : (
// //             <label style={uploadBox} htmlFor="file-upload">
// //               <img src="/camera-icon.png" alt="Upload" width={40} />
// //               <div>Upload Photo</div>
// //             </label>
// //           ))}

// //         <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
// //           <button
// //             onClick={() => router.back()}
// //             style={cancelBtn}
// //             disabled={saving}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleSave}
// //             style={{
// //               ...saveBtn,
// //               backgroundColor: saving ? "#ccc" : "#4CAF50",
// //               cursor: saving ? "not-allowed" : "pointer",
// //               opacity: saving ? 0.7 : 1,
// //             }}
// //             disabled={saving}
// //           >
// //             {saving ? "Saving..." : isEdit ? "Update" : "Save"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // /** ---- Styles ---- */
// // const formWrapper = { marginTop: "30px", maxWidth: "500px" };
// // // const inputStyle = {
// // //   width: "100%",
// // //   margin: "8px 0",
// // //   padding: "10px",
// // //   border: "1px solid #ccc",
// // //   borderRadius: "4px",
// // //   fontSize: "14px",
// // //   boxSizing: "border-box",
// // // };
// // const charCountStyle = {
// //   fontSize: "12px",
// //   color: "#666",
// //   textAlign: "right",
// //   marginTop: "4px",
// // };
// // const errorStyle = {
// //   fontSize: "12px",
// //   color: "red",
// //   textAlign: "left",
// //   marginTop: "4px",
// // };
// // const previewWrapper = {
// //   margin: "10px 0",
// //   cursor: "pointer",
// //   textAlign: "center",
// //   border: "2px solid #ddd",
// //   borderRadius: "8px",
// //   padding: "10px",
// //   backgroundColor: "#f9f9f9",
// // };
// // const imagePreview = {
// //   width: "100px",
// //   height: "100px",
// //   objectFit: "cover",
// //   borderRadius: "50%",
// //   marginBottom: "5px",
// //   border: "2px solid #ddd",
// // };
// // const uploadBox = {
// //   border: "2px dashed #aaa",
// //   padding: "20px",
// //   textAlign: "center",
// //   cursor: "pointer",
// //   borderRadius: "8px",
// //   backgroundColor: "#fafafa",
// //   display: "flex",
// //   flexDirection: "column",
// //   alignItems: "center",
// // };
// // const cancelBtn = {
// //   flex: 1,
// //   background: "grey",
// //   padding: "10px",
// //   border: "none",
// //   borderRadius: "4px",
// //   cursor: "pointer",
// //   fontSize: "14px",
// //   fontWeight: "500",
// // };
// // const saveBtn = {
// //   flex: 1,
// //   background: "#4CAF50",
// //   color: "#fff",
// //   padding: "10px",
// //   border: "none",
// //   borderRadius: "4px",
// //   cursor: "pointer",
// //   fontSize: "14px",
// //   fontWeight: "500",
// // };

// // export default DynamicTemplateRenderer;









// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
// import html2canvas from "html2canvas";
// import "./DynamicTemplateRenderer.css";
// import { dateFormatter } from "./dateTimeFormatters";
// import CameraIcon from '@/assets/camera.png';
// import Cropper from 'react-easy-crop';
// import EditIcon from '@/assets/edit.png'; // Assume you have an edit icon

// const DynamicTemplateRenderer = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const templateRef = useRef(null);

//   const templateId = searchParams.get("templateId");
//   const eventId = searchParams.get("id");

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const isEdit = Boolean(eventId);

//   const [template, setTemplate] = useState(null);
//   console.log('%c [ template ]-554', 'font-size:13px; background:pink; color:#bf2c9f;', template)
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     eventType: "",
//     name: "",
//     date: "",
//     time: "",
//     address: "",
//     templateId: templateId || "",
//   });
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [originalImage, setOriginalImage] = useState(null);
//   const [dataForTemplate, setDataForTemplate] = useState({
//     eventType: formData.eventType,
//     name: formData?.name,
//     date: dateFormatter(formData?.date, template?.dateFormatCase),
//     day: dateFormatter(formData?.date, template?.dateFormatCase)?.day,
//     month: dateFormatter(formData?.date, template?.dateFormatCase)?.month,
//     year: dateFormatter(formData?.date, template?.dateFormatCase)?.year,
//     time: formData?.time,
//     address: formData?.address,
//     templateId: templateId || "",
//     image: uploadedImage,
//   });
//   console.log('%c [ dataForTemplate ]-567', 'font-size:13px; background:pink; color:#bf2c9f;', dataForTemplate)
//   console.log('%c [ dateFormatter(formData?.date, template?.dateFormatCase)?.day ]-571', 'font-size:13px; background:pink; color:#bf2c9f;', dateFormatter(formData?.date, template?.dateFormatCase)?.day)
  
//   const [formErrors, setFormErrors] = useState({
//     eventType: "",
//     name: "",
//     address: "",
//   });
//   const [charCounts, setCharCounts] = useState({
//     eventType: 0,
//     name: 0,
//     address: 0,
//   });
//   const [cropImage, setCropImage] = useState(null); // Image to crop
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [cropShape, setCropShape] = useState('rect'); // 'rect' or 'round'
//   const [aspectRatio, setAspectRatio] = useState(4 / 3); // Default aspect ratio
//   const [cropSize, setCropSize] = useState({ width: 200, height: 200 }); // Adjust based on template needs

//   useEffect(() => {
//     setDataForTemplate({
//       eventType: formData.eventType,
//       name: formData.name,
//       date: dateFormatter(formData.date, template?.dateFormatCase || "1"),
//       day: dateFormatter(formData?.date, template?.dateFormatCase)?.day,
//       month: dateFormatter(formData?.date, template?.dateFormatCase)?.month,
//       year: dateFormatter(formData?.date, template?.dateFormatCase)?.year,
//       time: formData.time,
//       address: formData.address,
//       templateId: templateId || "",
//       image: uploadedImage,
//     });
//   }, [formData, template, uploadedImage]); 

//   const fileInputRef = useRef(null);

//   /** Fetch template */
//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
//         const result = await response.json();

//         if(templateId){
//           if (result.error) {
//           setError(result.message || "Failed to fetch template");
//         } else {
//           const selectedTemplate = result.templates.find(
//             (tpl) => tpl._id === templateId
//           );
//           console.log('%c [ selectedTemplate ]-626', 'font-size:13px; background:pink; color:#bf2c9f;', selectedTemplate)

//           if (selectedTemplate) {
//             let { cssCode, jsCode, fontUrls, backgroundUrl } =
//               selectedTemplate.configs;

//             // Use the absolute background URL from API
//             if (backgroundUrl) {
//               cssCode = cssCode.replace(
//                 /url\((['"]?).*?\1\)/g,
//                 `url('${selectedTemplate.backgroundUrl}')`
//               );
//             }

//             setTemplate({
//               cssCode: cssCode || "",
//               jsCode: jsCode || "",
//               fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
//               backgroundUrl: selectedTemplate.backgroundUrl || null,
//               isHeroImage: selectedTemplate?.isHeroImage || false,
//               bgImageName: selectedTemplate?.configs?.bgImageName || "",
//               charLimits: selectedTemplate.configs?.charLimits || {},
//               dateFormatCase: selectedTemplate?.configs?.dateFormatCase || "1",
//             });
//           } else {
//             setError("Template not found");
//           }
//         }
//         }
//       } catch (err) {
//         setError("Error fetching template: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplate();
//   }, [templateId]);

//   /** Fetch event details (Edit Mode) */
//   const fetchOrderDetails = async () => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//         }
//       );

//       const result = await res.json();

//       if (res.status === 200 && result.data) {
//         const data = result.data;

//         const formattedDate = data.eventDate
//           ? new Date(data.eventDate).toISOString().split("T")[0]
//           : "";

//         const formattedTime = data.eventTime ? data.eventTime.slice(0, 5) : "";

//         setFormData({
//           name: data.hostName || "",
//           eventType: data.eventType || "",
//           date: formattedDate,
//           time: formattedTime,
//           address: data.location || "",
//           templateId: templateId,
//           isHeroImage: template?.isHeroImage || false,
//         });

//         setCharCounts({
//           eventType: data.eventType?.length || 0,
//           name: data.hostName?.length || 0,
//           address: data.location?.length || 0,
//         });

//         // setUploadedImage(data.hostImage || null);
//       }
//     } catch (err) {
//       console.error("Fetch failed:", err);
//     }
//   };

//   useEffect(() => {
//     if (eventId) {
//       fetchOrderDetails();
//     }
//   }, [eventId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const charLimit = template?.charLimits?.[name]
//       ? parseInt(template.charLimits[name])
//       : Infinity;

//     // Allow input but trim if exceeds limit
//     const newValue = value.length > charLimit ? value.slice(0, charLimit) : value;

//     setFormData((prev) => ({ ...prev, [name]: newValue }));
//     setCharCounts((prev) => ({ ...prev, [name]: newValue.length }));

//     if (value.length > charLimit) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: `Character limit of ${charLimit} exceeded`,
//       }));
//     } else {
//       setFormErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const ratio = img.width / img.height;
//         const newWidth = Math.min(img.width, maxWidth);
//         const newHeight = newWidth / ratio;

//         canvas.width = newWidth;
//         canvas.height = newHeight;

//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, newWidth, newHeight);

//         const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
//         resolve(compressedBase64);
//       };
//       img.onerror = reject;
//       img.src = base64;
//     });
//   };

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const createCroppedImage = async () => {
//     try {
//       const image = new Image();
//       image.src = cropImage;
//       await new Promise((resolve) => {
//         image.onload = resolve;
//       });

//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       canvas.width = cropSize.width;
//       canvas.height = cropSize.height;

//       ctx.drawImage(
//         image,
//         croppedAreaPixels.x,
//         croppedAreaPixels.y,
//         croppedAreaPixels.width,
//         croppedAreaPixels.height,
//         0,
//         0,
//         cropSize.width,
//         cropSize.height
//       );

//       const croppedBase64 = canvas.toDataURL("image/jpeg");
//       const compressed = await compressBase64Image(croppedBase64, 500, 0.4);
//       setUploadedImage(compressed);
//       setCropImage(null); // Close cropper
//     } catch (err) {
//       console.error("Crop failed:", err);
//       alert("Failed to crop image.");
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const imageBase64 = reader.result;
//       setOriginalImage(imageBase64);
//       setCropImage(imageBase64); // Open cropper with uploaded image
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleEditImage = () => {
//     if (originalImage) {
//       setCropImage(originalImage);
//     } else {
//       alert("No original image available for editing.");
//     }
//   };

//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userID") : null;

//   const handleSave = async () => {
//     if (!userId) {
//       alert("User not logged in or UserId missing.");
//       return;
//     }

//     const payload = {
//       userId: userId,
//       eventType: formData.eventType,
//       hostName: formData.name,
//       eventDate: formData.date ? new Date(formData.date).toISOString() : "",
//       eventTime: formData.time || "",
//       location: formData.address,
//     };

//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
//         {
//           method: isEdit ? "PUT" : "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (res.ok) {
//         handleDownload();
//       } else {
//         const errData = await res.json();
//         alert(`Failed: ${errData.message || "Unknown error"}`);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong.");
//     }
//   };

//   const handleDownload = async () => {
//     const canvas = await html2canvas(templateRef.current, {
//       backgroundColor: null,
//       useCORS: true,
//     });

//     canvas.toBlob(async (blob) => {
//       if (!blob) return;

//       const file = new File([blob], "sticky-note.png", {
//         type: "image/png",
//         lastModified: new Date().getTime(),
//       });

//       const formData = new FormData();
//       formData.append("image", file);
//       formData.append("userId", userId);
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
//           {
//             method: "PUT",
//             headers: {
//               Authorization: `${token}`,
//             },
//             body: formData,
//           }
//         );
//         const result = await response.json();

//         if (result) {
//           router.replace(`/wonderland?id=${userId}/${eventId}/host`);
//         }
//       } catch (err) {
//         console.error("Upload failed:", err);
//       }
//     }, "image/png");
//   };

//   /** Replace variables inside template */
//   const renderHTML = (jsCode, rawData) => {
//     return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
//   };

//   if (loading) return <p>Loading template...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div style={{ padding: "10px" }}>
//       {/* Template Preview with Background */}
//   {templateId !==  "default-template"  &&       <div
//         ref={templateRef}
//         className="template-container"
//         style={{
//           backgroundImage: template?.backgroundUrl
//             ? `url('/assets/templates/${template?.bgImageName}')`
//             : "none",
//           backgroundSize: "100% 100%",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           maxHeight: "530px",
//           maxWidth: "480px",
//           width: "100%",
//           // margin: '0 auto',
//           borderRadius: "10px",
//           position: "relative",
//         }}
//       >
//         {/* Fonts */}
//         {template?.fontUrls?.map((url, idx) => (
//           <link key={idx} href={url} rel="stylesheet" />
//         ))}

//         {/* CSS */}
//         {/* {template?.cssCode && (
//           <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
//         )} */}

//         {/* Template HTML */}
//         {/* {template?.jsCode && (
//           <div
//             style={{ position: "relative", zIndex: 2 }}
//             dangerouslySetInnerHTML={{
//               __html: renderHTML(template.jsCode, dataForTemplate),
//             }}
//           />
//         )} */}
// <div style={{ position: "relative", zIndex: 2 }}>
//              <div class="invite-template-wrapper">
//          <div class="invite-template-card">
//           {dataForTemplate?.image &&
//   <div class='template-image-wrapper'>
//     <img src={dataForTemplate?.image} alt="host image" class='template-image' />
//   </div>
// }
//           <div class="name">{dataForTemplate?.name}</div>
//           {/* <div class='date-row'> */}
//             <div class="date"><span>{dataForTemplate?.date}</span></div>
//             <div class="time"><span>AT {dataForTemplate?.time} PM</span></div>
//           {/* </div> */}
//           <div class="address">
//             <p>{dataForTemplate?.address}</p>
//           </div>
//         </div>
//       </div>
//         </div>
//       </div>}
      

//       {/* Form */}
//        <div className="form-wrapper">
//          <h3 className="heading-txt">Do you Want <br /> customize Invite?</h3>
//          <div style={{ position: "relative" }}>
//            <input
//             type="text"
//              placeholder="Host Name"
//              name="name"
//              className="input-field"
//              value={formData.name}
//              onChange={handleChange}
//              maxLength={template?.charLimits?.name || undefined}
//              style={{
//                borderColor: formErrors.name ? "red" : "#ccc",
//              }}
//            />
//            {template?.charLimits?.name && (
//              <div className="char-count">
//                {charCounts.name}/{template.charLimits.name}
//              </div>
//            )}
//            {formErrors.name && <div className="error-msg">{formErrors.name}</div>}
//          </div>

//          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//            <div style={{ flex: 1 }}>
//              <label className="input-label">Event Date</label>
//              <input
//                type="date"
//                name="date"
//                value={formData.date}
//                className="input-field"
//                onChange={handleChange}
//              />
//            </div>
//            <div style={{ flex: 1 }}>
//              <label className="input-label">Arrival Time</label>
//              <input
//                type="time"
//                className="input-field"
//                name="time"
//                value={formData.time}
//                onChange={handleChange}
//              />
//            </div>
//          </div>

//          <div style={{ position: "relative" }}>
//            <textarea
//              type="text"
//              placeholder="Venue"
//              name="address"
//              className="input-field"
//              value={formData.address}
//              onChange={handleChange}
//              maxLength={template?.charLimits?.address || undefined}
//              style={{
//                borderColor: formErrors.address ? "red" : "#ccc",
//              }}
//            />
//            {template?.charLimits?.address && (
//              <div className="char-count">
//                {charCounts.address}/{template.charLimits.address}
//              </div>
//            )}
//            {formErrors.address && (
//              <div className="error-msg">{formErrors.address}</div>
//            )}
//          </div>

//          {/* Cropper Modal */}
//          {cropImage && (
//            <div className="crop-modal">
//              <div className="cropper-container">
//                <Cropper
//                  image={cropImage}
//                  crop={crop}
//                  zoom={zoom}
//                  aspect={aspectRatio}
//                  cropShape={cropShape}
//                  cropSize={cropSize}
//                  onCropChange={setCrop}
//                  onCropComplete={onCropComplete}
//                  onZoomChange={setZoom}
//                />
//              </div>
//              <div className="crop-controls">
//                <button onClick={createCroppedImage} className="crop-save-btn">
//                  Crop and Save
//                </button>
//                <button onClick={() => setCropImage(null)} className="crop-cancel-btn">
//                  Cancel
//                </button>
//              </div>
//            </div>
//          )}

//          {template?.isHeroImage &&
//            (uploadedImage ? (
//              <div
//                onClick={() => {
//                  if (fileInputRef.current) fileInputRef.current.click();
//                }}
//                className="preview-wrapper-template"
//              >
//                <div className="preview-image-div">
//                 <img src={uploadedImage} alt="Preview" className="image-preview-template" />
//                </div>
//                <img
//                  src={EditIcon.src}
//                  className="edit-icon"
//                  onClick={handleEditImage}
//                  alt="Edit"
//                />
//                <input
//           type="file"
//           accept="image/*"
//           id="file-upload"
//           onChange={handleImageChange}
//           ref={fileInputRef}
//           hidden
//         />
//              </div>
//            ) : (
//              <label className="upload-box-template" htmlFor="file-upload">
//                <img src={CameraIcon.src} height='45px' width='45px' alt="Upload" />
//                <div className="mt-2 fw-bold" style={{color: '#666666'}}>Upload Photo</div>
//              <input
//           type="file"
//           accept="image/*"
//           id="file-upload"
//           onChange={handleImageChange}
//           ref={fileInputRef}
//           hidden
//         />
//              </label>
//            ))}

//          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
//            <button
//              onClick={() => router.back()}
//              className="cancel-btn"
//              disabled={saving}
//            >
//              CANCEL
//            </button>
//            <button
//              onClick={handleSave}
//               className="save-btn"
//              style={{
//                cursor: saving ? "not-allowed" : "pointer",
//                opacity: saving ? 0.7 : 1,
//              }}
//              disabled={saving}
//            >
//              {saving ? "Saving..." : isEdit ? "SAVE" : "SAVE"}
//            </button>
//          </div>
//        </div>
//     </div>
//   );
// };

// export default DynamicTemplateRenderer;