// // "use client";

// // import { useEffect, useState, useRef } from "react";
// // import { useSearchParams, useRouter } from "next/navigation";
// // import {
// //   BASE_URL,
// //   GET_ALL_TEMPLATES,
// //   UPLOAD_THANKYOU_NOTE,
// // } from "@/utils/apiconstants";
// // import html2canvas from "html2canvas";
// // import TestImg from "../../assets/BabyWelcomeIMG.png";
// // import Image from "next/image";

// // const DynamicTemplateRenderer = () => {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();

// //   const templateId = searchParams.get("templateId");
// //   const eventId = searchParams.get("id");

// //   const token =
// //     typeof window !== "undefined" ? localStorage.getItem("token") : null;

// //   const isEdit = Boolean(eventId);

// //   const [template, setTemplate] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const templateRef = useRef(null);

// //   const [formData, setFormData] = useState({
// //     eventType: "",
// //     name: "",
// //     date: "",
// //     time: "",
// //     address: "",
// //     templateId: templateId || "",
// //   });

// //   const [uploadedImage, setUploadedImage] = useState(null);
// //   const fileInputRef = useRef(null);

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

// //             // Use the absolute background URL from API
// //             if (backgroundUrl) {
// //               cssCode = cssCode.replace(
// //                 /url\((['"]?).*?\1\)/g,
// //                 `url('${selectedTemplate.backgroundUrl}')`
// //               );
// //             }

// //             setTemplate({
// //               cssCode: cssCode || "",
// //               jsCode: jsCode || "",
// //               fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
// //               backgroundUrl: selectedTemplate.backgroundUrl || null,
// //               isHeroImage: selectedTemplate.configs?.isHeroImage || false,
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
// //           date: formattedDate,
// //           time: formattedTime,
// //           address: data.location || "",
// //           templateId: templateId,
// //           isHeroImage: template?.isHeroImage || false,
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

// //   /** Input Change */
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };
// //   const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
// //     return new Promise((resolve, reject) => {
// //       const img = new Image();
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
// //       img.onerror = reject;
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

// //   const userId =
// //     typeof window !== "undefined" ? localStorage.getItem("userID") : null;
// //   console.log(
// //     "%c [ userId ]-185",
// //     "font-size:13px; background:pink; color:#bf2c9f;",
// //     userId
// //   );

// //   const handleSave = async () => {
// //     if (!userId) {
// //       alert("User not logged in or UserId missing.");
// //       return;
// //     }

// //     handleDownload();

// //     // const payload = {
// //     //   userId: userId,
// //     //   eventType: formData.eventType,
// //     //   hostName: formData.name,
// //     //   eventDate: formData.date ? new Date(formData.date).toISOString() : "",
// //     //   eventTime: formData.time || "",
// //     //   location: formData.address,
// //     //   // templateId: formData.templateId,
// //     // };

// //     // try {
// //     //   const res = await fetch(
// //     //     `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
// //     //     {
// //     //       method: isEdit ? "PUT" : "POST",
// //     //       headers: {
// //     //         "Content-Type": "application/json",
// //     //         Authorization: token,
// //     //       },
// //     //       body: JSON.stringify(payload),
// //     //     }
// //     //   );

// //     //   if (res.ok) {
// //     //     // router.replace(`/wonderland?id=${userId}/${eventId || "new"}/host`);
// //     //   } else {
// //     //     const errData = await res.json();
// //     //     alert(`Failed: ${errData.message || "Unknown error"}`);
// //     //   }
// //     // } catch (err) {
// //     //   console.error("Error:", err);
// //     //   alert("Something went wrong.");
// //     // }
// //   };

// //   const handleDownload = async () => {
// //     // if (noteTitle.trim() === "") {
// //     //   // setErrorMsg("Please write a thank you message.");
// //     //   return;
// //     // }

// //     // setShowPopup(false);
// //     const canvas = await html2canvas(templateRef.current, {
// //       backgroundColor: null,
// //       useCORS: true,
// //     });

// //     canvas.toBlob(async (blob) => {
// //       if (!blob) return;

// //       const file = new File([blob], "sticky-note.png", {
// //         type: "image/png",
// //         lastModified: new Date().getTime(),
// //       });

// //       const formData = new FormData();
// //       formData.append("image", file);
// //       formData.append("userId", userId);
// //       try {
// //         const response = await fetch(
// //           `${BASE_URL}${UPLOAD_THANKYOU_NOTE}/${eventId}/thankyou-note`,
// //           {
// //             method: "PUT",
// //             headers: {
// //               Authorization: `${token}`,
// //             },
// //             body: formData,
// //           }
// //         );
// //         const result = await response.json();

// //         // if (result.success && result.uploaded && result.uploaded[0]?.url) {
// //         //   // ✅ Add the uploaded image to eventData so it shows in the UI
// //         //   const newImage = {
// //         //     type: "image",
// //         //     src: result.uploaded[0].url,
// //         //     alt: "Thank You Note",
// //         //   };
// //         //   // setEventData((prev) => [newImage, ...prev]);
// //         // }
// //         // setRefetchEventImages(!refetchEventImages);
// //         // setShowPopup(false);
// //         // setNoteTitle("");
// //         // setNoteBy("");
// //       } catch (err) {
// //         console.error("Upload failed:", err);
// //       }
// //     }, "image/png");
// //   };

// //   /** Replace variables inside template */
// //   const renderHTML = (jsCode, rawData) => {
// //     return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
// //   };

// //   if (loading) return <p>Loading template...</p>;
// //   if (error) return <p style={{ color: "red" }}>{error}</p>;

// //   return (
// //     <div style={{ padding: "20px" }}>
// //       {/* Template Preview with Background */}
// //       <div ref={templateRef}>
// //         {/*
// //       <div
// //         style={{
// //           // backgroundImage: template?.backgroundUrl
// //           //   ? `url('${template.backgroundUrl}')`
// //           //   : "none",
// //           // backgroundImage:  `url(${template.backgroundUrl})`,
// //           backgroundImage:  `https://res.cloudinary.com/dlewjmnku/image/upload/v1741768091/student/student_image_a1c163fc-42f0-49be-a689-78bc6dfb62e2.jpg`,
// //           backgroundSize: "cover",
// //           backgroundPosition: "center",
// //           minHeight: "400px",
// //           borderRadius: "12px",
// //           position: "relative",
// //         }}

// //       > */}

// //         <div
// //           style={{
// //             backgroundImage: `url(${template?.backgroundUrl})`,
// //             backgroundSize: "cover",
// //             backgroundPosition: "center",
// //             minHeight: "400px",
// //             borderRadius: "12px",
// //             position: "relative",
// //           }}
// //         >
// //           <img
// //             src={template?.backgroundUrl}
// //             crossOrigin="anonymous"
// //             style={{
// //               position: "absolute",
// //               inset: 0,
// //               width: "100%",
// //               height: "100%",
// //               objectFit: "cover",
// //               borderRadius: "12px",
// //               zIndex: 1,
// //             }}
// //             alt="background"
// //           />
// //           {/* Fonts */}
// //           {template?.fontUrls?.map((url, idx) => (
// //             <link key={idx} href={url} rel="stylesheet" />
// //           ))}

// //           {/* CSS */}
// //           {template?.cssCode && (
// //             <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
// //           )}

// //           {/* Template HTML */}
// //           {template?.jsCode && (
// //             <div
// //               style={{ position: "relative", zIndex: 2 }}
// //               dangerouslySetInnerHTML={{
// //                 __html: renderHTML(template.jsCode, formData),
// //               }}
// //             />
// //           )}

// //           {/* Uploaded Host Image */}
// //           {uploadedImage && (
// //             <img
// //               src={uploadedImage}
// //               alt="Host"
// //               style={{
// //                 position: "absolute",
// //                 bottom: "20px",
// //                 right: "20px",
// //                 width: "100px",
// //                 height: "100px",
// //                 borderRadius: "50%",
// //                 objectFit: "cover",
// //                 border: "3px solid white",
// //                 zIndex: 3,
// //               }}
// //             />
// //           )}
// //         </div>
// //       </div>

// //       {/* Form */}
// //       <div style={formWrapper}>
// //         <h3>Customize Invite {isEdit ? "(Edit Mode)" : ""}</h3>

// //         <input
// //           type="text"
// //           placeholder="Event Name"
// //           name="eventType"
// //           value={formData.eventType}
// //           onChange={handleChange}
// //           style={inputStyle}
// //         />
// //         <input
// //           type="text"
// //           placeholder="Host Name"
// //           name="name"
// //           value={formData.name}
// //           onChange={handleChange}
// //           style={inputStyle}
// //         />

// //         <div style={{ display: "flex", gap: "10px" }}>
// //           <div style={{ flex: 1 }}>
// //             <label>Event Date</label>
// //             <input
// //               type="date"
// //               name="date"
// //               value={formData.date}
// //               onChange={handleChange}
// //               style={inputStyle}
// //             />
// //           </div>
// //           <div style={{ flex: 1 }}>
// //             <label>Event Time</label>
// //             <input
// //               type="time"
// //               name="time"
// //               value={formData.time}
// //               onChange={handleChange}
// //               style={inputStyle}
// //             />
// //           </div>
// //         </div>

// //         <input
// //           type="text"
// //           placeholder="Venue"
// //           name="address"
// //           value={formData.address}
// //           onChange={handleChange}
// //           style={inputStyle}
// //         />

// //         {/* Always render file input, but keep it hidden */}
// //         <input
// //           type="file"
// //           accept="image/*"
// //           id="file-upload"
// //           onChange={handleImageChange}
// //           ref={fileInputRef}
// //           hidden
// //         />

// //         {/* Conditional UI display */}
// //         {uploadedImage ? (
// //           <div
// //             onClick={() => {
// //               if (fileInputRef.current) fileInputRef.current.click();
// //             }}
// //             style={previewWrapper}
// //           >
// //             <img src={uploadedImage} alt="Preview" style={imagePreview} />
// //             <div>Tap to change photo</div>
// //           </div>
// //         ) : (
// //           <label style={uploadBox} htmlFor="file-upload">
// //             <img src="/camera-icon.png" alt="Upload" width={40} />
// //             <div>Upload Photo</div>
// //           </label>
// //         )}

// //         <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
// //           <button onClick={() => router.back()} style={cancelBtn}>
// //             Cancel
// //           </button>
// //           <button onClick={handleSave} style={saveBtn}>
// //             {isEdit ? "Update" : "Save"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // /** ---- Styles ---- */
// // const formWrapper = { marginTop: "30px", maxWidth: "500px" };
// // const inputStyle = {
// //   width: "100%",
// //   margin: "8px 0",
// //   padding: "10px",
// //   border: "1px solid #ccc",
// //   borderRadius: "4px",
// //   fontSize: "14px",
// // };
// // const previewWrapper = {
// //   margin: "10px 0",
// //   cursor: "pointer",
// //   textAlign: "center",
// // };
// // const imagePreview = {
// //   width: "100%",
// //   maxHeight: "200px",
// //   objectFit: "cover",
// //   borderRadius: "8px",
// // };
// // const uploadBox = {
// //   border: "2px dashed #aaa",
// //   padding: "20px",
// //   textAlign: "center",
// //   cursor: "pointer",
// // };
// // const cancelBtn = {
// //   flex: 1,
// //   background: "#ccc",
// //   padding: "10px",
// //   border: "none",
// //   borderRadius: "4px",
// //   cursor: "pointer",
// // };
// // const saveBtn = {
// //   flex: 1,
// //   background: "#4CAF50",
// //   color: "#fff",
// //   padding: "10px",
// //   border: "none",
// //   borderRadius: "4px",
// //   cursor: "pointer",
// // };

// // export default DynamicTemplateRenderer;

"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import html2canvas from "html2canvas";
import "./DynamicTemplateRenderer.css";
import { dateFormatter } from "./dateTimeFormatters";


const DynamicTemplateRenderer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateRef = useRef(null);

  const templateId = searchParams.get("templateId");
  const eventId = searchParams.get("id");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isEdit = Boolean(eventId);

  const [template, setTemplate] = useState(null);
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
  const [dataForTemplate, setDataForTemplate] = useState({
    eventType: formData.eventType,
    name: formData?.name,
    date: dateFormatter(formData?.date, template?.dateFormatCase),
    day: dateFormatter(formData?.date, template?.dateFormatCase)?.day,
    month: dateFormatter(formData?.date, template?.dateFormatCase)?.month,
    month: dateFormatter(formData?.date, template?.dateFormatCase)?.year,
    time: formData?.time,
    address: formData?.address,
    templateId: templateId || "",
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
    });
  }, [formData, template]); 

  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  /** Fetch template */
  useEffect(() => {
    if (!templateId) {
      setError("No template selected");
      setLoading(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
        const result = await response.json();

        if (result.error) {
          setError(result.message || "Failed to fetch template");
        } else {
          const selectedTemplate = result.templates.find(
            (tpl) => tpl._id === templateId
          );

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
              isHeroImage: selectedTemplate.configs?.isHeroImage || false,
              bgImageName: selectedTemplate?.configs?.bgImageName || "",
              charLimits: selectedTemplate.configs?.charLimits || {},
              dateFormatCase: selectedTemplate?.configs?.dateFormatCase || "1",
            });
          } else {
            setError("Template not found");
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

        setUploadedImage(data.hostImage || null);
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

  /** Input Change */
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const charLimit = template?.charLimits?.[name]
  //     ? parseInt(template.charLimits[name])
  //     : Infinity;

  //   if (value.length <= charLimit) {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //     setCharCounts((prev) => ({ ...prev, [name]: value.length }));
  //     setFormErrors((prev) => ({ ...prev, [name]: "" }));
  //   } else {
  //     setFormErrors((prev) => ({
  //       ...prev,
  //       [name]: `Character limit of ${charLimit} exceeded`,
  //     }));
  //   }
  // };

 

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressed = await compressBase64Image(reader.result, 500, 0.4);
        setUploadedImage(compressed);
      } catch (err) {
        console.error("Image compression failed:", err);
        alert("Image compress karne mein error aaya.");
      }
    };
    reader.readAsDataURL(file);
  };

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;

  const handleSave = async () => {
    if (!userId) {
      alert("User not logged in or UserId missing.");
      return;
    }

    const payload = {
      userId: userId,
      eventType: formData.eventType,
      hostName: formData.name,
      eventDate: formData.date ? new Date(formData.date).toISOString() : "",
      eventTime: formData.time || "",
      location: formData.address,
      // templateId: formData.templateId,
    };

    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        handleDownload();
        // router.replace(`/wonderland?id=${userId}/${eventId || "new"}/host`);
      } else {
        const errData = await res.json();
        alert(`Failed: ${errData.message || "Unknown error"}`);
      }
    } catch (err) {
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

      const file = new File([blob], "sticky-note.png", {
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
          router.replace(`/wonderland?id=${userId}/${eventId}/host`);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }, "image/png");
  };

  /** Replace variables inside template */
  // const renderHTML = (jsCode, rawData) => {
  //   return jsCode.replace(/{{(.*?)}}/g, (_, key) => {
  //     console.log('%c [ key ]-882', 'font-size:13px; background:pink; color:#bf2c9f;', key)
  //     return rawData[key.trim()] || "";
  //   });
  // };

  const renderHTML = (jsCode, rawData) => {
  return jsCode.replace(/{{(.*?)}}/g, (_, key) => {
    const path = key.trim().replace(/\?/g, "");
    try {
      return path.split(".").reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : "";
      }, rawData) || "";
    } catch {
      return "";
    }
  });
};


  if (loading) return <p>Loading template...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "10px" }}>
      {/* Template Preview with Background */}
      <div
        ref={templateRef}
        className="template-container"
        style={{
          backgroundImage: template?.backgroundUrl
            ? `url('/assets/templates/${template?.bgImageName}')`
            : "none",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          maxHeight: "530px",
          maxWidth: "480px",
          width: "100%",
          // margin: '0 auto',
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

        
{/* 
        <div style={{ position: "relative", zIndex: 2 }}>
           <div class="invite-template-wrapper">
        <div class="invite-template-card">
          <div class="name">{{name}}</div>
          <div class="date">{{date}}</div>
          <div class="time">{{time}}</div>
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

         {template?.isHeroImage &&
           (uploadedImage ? (
             <div
               onClick={() => {
                 if (fileInputRef.current) fileInputRef.current.click();
               }}
               className="preview-wrapper"
             >
               <img src={uploadedImage} alt="Preview" className="image-preview" />
               <div>Tap to change photo</div>
             </div>
           ) : (
             <label className="upload-box" htmlFor="file-upload">
               <img src="/camera-icon.png" alt="Upload" width={40} />
               <div>Upload Photo</div>
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
              //  backgroundColor: saving ? "#ccc" : "#4CAF50",
               cursor: saving ? "not-allowed" : "pointer",
               opacity: saving ? 0.7 : 1,
             }}
             disabled={saving}
           >
             {saving ? "Saving..." : isEdit ? "SAVE" : "SAVE"}
           </button>
         </div>
       </div>
    </div>
  );
};

export default DynamicTemplateRenderer;

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
// import html2canvas from "html2canvas";
// import "./DynamicTemplateRenderer.css";
// import { dateFormatter } from "./dateTimeFormatters";

// const DynamicTemplateRenderer = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const templateRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const templateId = searchParams.get("templateId");
//   const eventId = searchParams.get("id");

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userID") : null;

//   const isEdit = Boolean(eventId);
//   const [template, setTemplate] = useState(null);
//   console.log('%c [ template ]-1043', 'font-size:13px; background:pink; color:#bf2c9f;', template)
//   console.log(
//     "%c [ template ]-1053",
//     "font-size:13px; background:pink; color:#bf2c9f;",
//     template
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [backgroundBase64, setBackgroundBase64] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [formData, setFormData] = useState({
//     eventType: "",
//     name: "",
//     date: "",
//     time: "",
//     address: "",
//     templateId: templateId || "",
//   });
//   const [dataForTemplate, setDataForTemplate] = useState({
//     eventType: formData.eventType,
//     name: formData?.name,
//     date: dateFormatter(formData?.date, template?.dateFormatCase),
//     time: formData?.time,
//     address: formData?.address,
//     templateId: templateId || "",
//   });

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

//   useEffect(() => {
//     setDataForTemplate({
//       eventType: formData.eventType,
//       name: formData.name,
//       date: dateFormatter(formData.date, template?.dateFormatCase || "1"),
//       time: formData.time,
//       address: formData.address,
//       templateId: templateId || "",
//     });
//   }, [formData, template]); 

//   /** Fetch template */
//   useEffect(() => {
//     if (!templateId) {
//       setError("No template selected");
//       setLoading(false);
//       return;
//     }

//     const fetchTemplate = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
//         const result = await response.json();

//         if (result.error) {
//           setError(result.message || "Failed to fetch template");
//         } else {
//           const selectedTemplate = result.templates.find(
//             (tpl) => tpl._id === templateId
//           );

//           if (selectedTemplate) {
//             let { cssCode, jsCode, fontUrls, backgroundUrl } =
//               selectedTemplate.configs;

//             setTemplate({
//               cssCode: cssCode || "",
//               jsCode: jsCode || "",
//               fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
//               backgroundUrl: selectedTemplate.backgroundUrl || null,
//               isHeroImage: selectedTemplate.configs?.isHeroImage || false,
//               bgImageName: selectedTemplate.configs?.bgImageName || "",
//               charLimits: selectedTemplate.configs?.charLimits || {},
//               dateFormatCase: selectedTemplate?.configs?.dateFormatCase || "1",
//             });
//           } else {
//             setError("Template not found");
//           }
//         }
//       } catch (err) {
//         setError("Error fetching template: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplate();
//   }, [templateId]);

//   /** Convert S3 image to Base64 to bypass CORS */
//   useEffect(() => {
//     if (template?.backgroundUrl) {
//       const convertToBase64 = async () => {
//         try {
//           const response = await fetch(template.backgroundUrl, {
//             mode: "cors",
//           });
//           if (!response.ok) {
//             throw new Error(`Fetch failed: ${response.statusText}`);
//           }
//           const blob = await response.blob();
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             setBackgroundBase64(reader.result);
//             console.log("Base64 conversion successful");
//           };
//           reader.onerror = () => {
//             console.error("Failed to read blob as Base64");
//             setBackgroundBase64(template.backgroundUrl);
//           };
//           reader.readAsDataURL(blob);
//         } catch (err) {
//           console.error("Failed to convert S3 image to Base64:", err);
//           setBackgroundBase64(template.backgroundUrl);
//         }
//       };
//       convertToBase64();
//     }
//   }, [template?.backgroundUrl]);

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
//           // date: formattedDate,
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

//         setUploadedImage(data.hostImage || null);
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

//   /** Input Change with Character Limit Validation */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const charLimit = template?.charLimits?.[name]
//       ? parseInt(template.charLimits[name])
//       : Infinity;

//     if (value.length <= charLimit) {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setCharCounts((prev) => ({ ...prev, [name]: value.length }));
//       setFormErrors((prev) => ({ ...prev, [name]: "" }));
//     } else {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: `Character limit of ${charLimit} exceeded`,
//       }));
//     }
//   };

//   /** Compress uploaded image */
//   const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
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
//       img.onerror = (err) => reject(err);
//       img.src = base64;
//     });
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       try {
//         const compressed = await compressBase64Image(reader.result, 500, 0.4);
//         setUploadedImage(compressed);
//       } catch (err) {
//         console.error("Image compression failed:", err);
//         alert("Image compress karne mein error aaya.");
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   /** Save and Generate Canvas */
//   const handleSave = async () => {
//     if (!userId) {
//       alert("User not logged in or UserId missing.");
//       return;
//     }

//     // Check for errors before saving
//     if (Object.values(formErrors).some((error) => error)) {
//       alert("Please fix input errors before saving.");
//       return;
//     }

//     setSaving(true);

//     const payload = {
//       userId: userId,
//       eventType: formData.eventType,
//       hostName: formData.name,
//       eventDate: formData.date ? new Date(formData.date).toISOString() : "",
//       eventTime: formData.time || "",
//       location: formData.address,
//     };

//     try {
//       // Save event details
//       const eventRes = await fetch(
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

//       if (!eventRes.ok) {
//         const errData = await eventRes.json();
//         throw new Error(errData.message || "Failed to save event details");
//       }

//       // Generate canvas
//       const canvas = await html2canvas(templateRef.current, {
//         backgroundColor: null,
//         useCORS: true,
//         scale: 2,
//         logging: true,
//       });

//       canvas.toBlob(async (blob) => {
//         if (!blob) {
//           alert("Failed to generate image.");
//           setSaving(false);
//           return;
//         }

//         // Debug: Download canvas output
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "test.png";
//         a.click();
//         URL.revokeObjectURL(url);

//         const file = new File([blob], "sticky-note.png", {
//           type: "image/png",
//           lastModified: new Date().getTime(),
//         });

//         const formDataToSend = new FormData();
//         formDataToSend.append("image", file);
//         formDataToSend.append("userId", userId);

//         try {
//           const response = await fetch(
//             `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
//             {
//               method: "PUT",
//               headers: {
//                 Authorization: `${token}`,
//               },
//               body: formDataToSend,
//             }
//           );
//           const result = await response.json();

//           if (response.ok && result) {
//             alert("Thank you note saved successfully!");
//             router.replace(`/wonderland?id=${userId}/${eventId}/host`);
//           } else {
//             alert(`Failed: ${result.message || "Unknown error"}`);
//           }
//         } catch (err) {
//           console.error("Upload failed:", err);
//           alert("Something went wrong while uploading the image.");
//         } finally {
//           setSaving(false);
//         }
//       }, "image/png");
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong: " + err.message);
//       setSaving(false);
//     }
//   };

//   /** Replace variables in template */
//   const renderHTML = (jsCode, rawData) => {
//     if (!jsCode || !rawData) return "";
//     return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
//   };

//   if (loading) return <p>Loading template...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div style={{ padding: "10px" }}>
//       <div
//         ref={templateRef}
//         className="template-container"
//         style={{
//           backgroundImage: backgroundBase64
//             ? `url(${backgroundBase64})`
//             : template?.backgroundUrl
//             ? `url(${template.backgroundUrl})`
//             : "none",
//           backgroundSize: "100% 100%",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           maxHeight: "530px",
//           maxWidth: "480px",
//           width: "100%",
//           borderRadius: "10px",
//           position: "relative",
//         }}
//       >
//         {template?.fontUrls?.map((url, idx) => (
//           <link key={idx} href={url} rel="stylesheet" />
//         ))}

//         {template?.cssCode && (
//           <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
//         )}

//         {/* {template?.jsCode && (
//           <div
//             style={{ position: "relative", zIndex: 2 }}
//             dangerouslySetInnerHTML={{
//               __html: renderHTML(template.jsCode, dataForTemplate),
//             }}
//           />
//           )} */}

//         <div style={{ position: "relative", zIndex: 2 }}>
//           <div className="invite-wrapper">
//             <div className="invite-card">
//               <div className="name">{dataForTemplate.name}</div>
//               <div className="datetime">{dataForTemplate.date}</div>
//               <div className="time">At {dataForTemplate.time}</div>
//               <div className="address">{dataForTemplate.address}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <div style={formWrapper}>
//         <h3>Customize Invite {isEdit ? "(Edit Mode)" : ""}</h3>
//         <div style={{ position: "relative" }}>
//           <label className="form-label">Host Name</label>
//           <input
//             type="text"
//             placeholder="Host Name"
//             name="name"
//             className="form-control"
//             value={formData.name}
//             onChange={handleChange}
//             maxLength={template?.charLimits?.name || undefined}
//             style={{
//               borderColor: formErrors.name ? "red" : "#ccc",
//             }}
//           />
//           {template?.charLimits?.name && (
//             <div style={charCountStyle}>
//               {charCounts.name}/{template.charLimits.name}
//             </div>
//           )}
//           {formErrors.name && <div style={errorStyle}>{formErrors.name}</div>}
//         </div>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <div style={{ flex: 1 }}>
//             <label className="form-label">Event Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               className="form-control"
//               onChange={handleChange}
//             />
//           </div>
//           <div style={{ flex: 1 }}>
//             <label className="form-label">Event Time</label>
//             <input
//               type="time"
//               className="form-control"
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div style={{ position: "relative" }}>
//           <label className="form-label mt-2">Address</label>
//           <textarea
//             type="text"
//             placeholder="Venue"
//             name="address"
//             className="form-control"
//             value={formData.address}
//             onChange={handleChange}
//             maxLength={template?.charLimits?.address || undefined}
//             style={{
//               borderColor: formErrors.address ? "red" : "#ccc",
//             }}
//           />
//           {template?.charLimits?.address && (
//             <div style={charCountStyle}>
//               {charCounts.address}/{template.charLimits.address}
//             </div>
//           )}
//           {formErrors.address && (
//             <div style={errorStyle}>{formErrors.address}</div>
//           )}
//         </div>

//         <input
//           type="file"
//           accept="image/*"
//           id="file-upload"
//           onChange={handleImageChange}
//           ref={fileInputRef}
//           hidden
//         />

//         {template?.isHeroImage &&
//           (uploadedImage ? (
//             <div
//               onClick={() => {
//                 if (fileInputRef.current) fileInputRef.current.click();
//               }}
//               style={previewWrapper}
//             >
//               <img src={uploadedImage} alt="Preview" style={imagePreview} />
//               <div>Tap to change photo</div>
//             </div>
//           ) : (
//             <label style={uploadBox} htmlFor="file-upload">
//               <img src="/camera-icon.png" alt="Upload" width={40} />
//               <div>Upload Photo</div>
//             </label>
//           ))}

//         <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
//           <button
//             onClick={() => router.back()}
//             style={cancelBtn}
//             disabled={saving}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             style={{
//               ...saveBtn,
//               backgroundColor: saving ? "#ccc" : "#4CAF50",
//               cursor: saving ? "not-allowed" : "pointer",
//               opacity: saving ? 0.7 : 1,
//             }}
//             disabled={saving}
//           >
//             {saving ? "Saving..." : isEdit ? "Update" : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /** ---- Styles ---- */
// const formWrapper = { marginTop: "30px", maxWidth: "500px" };
// // const inputStyle = {
// //   width: "100%",
// //   margin: "8px 0",
// //   padding: "10px",
// //   border: "1px solid #ccc",
// //   borderRadius: "4px",
// //   fontSize: "14px",
// //   boxSizing: "border-box",
// // };
// const charCountStyle = {
//   fontSize: "12px",
//   color: "#666",
//   textAlign: "right",
//   marginTop: "4px",
// };
// const errorStyle = {
//   fontSize: "12px",
//   color: "red",
//   textAlign: "left",
//   marginTop: "4px",
// };
// const previewWrapper = {
//   margin: "10px 0",
//   cursor: "pointer",
//   textAlign: "center",
//   border: "2px solid #ddd",
//   borderRadius: "8px",
//   padding: "10px",
//   backgroundColor: "#f9f9f9",
// };
// const imagePreview = {
//   width: "100px",
//   height: "100px",
//   objectFit: "cover",
//   borderRadius: "50%",
//   marginBottom: "5px",
//   border: "2px solid #ddd",
// };
// const uploadBox = {
//   border: "2px dashed #aaa",
//   padding: "20px",
//   textAlign: "center",
//   cursor: "pointer",
//   borderRadius: "8px",
//   backgroundColor: "#fafafa",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
// };
// const cancelBtn = {
//   flex: 1,
//   background: "grey",
//   padding: "10px",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: "500",
// };
// const saveBtn = {
//   flex: 1,
//   background: "#4CAF50",
//   color: "#fff",
//   padding: "10px",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
//   fontSize: "14px",
//   fontWeight: "500",
// };

// export default DynamicTemplateRenderer;
