// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import {
//   BASE_URL,
//   GET_ALL_TEMPLATES,
//   UPLOAD_THANKYOU_NOTE,
// } from "@/utils/apiconstants";
// import html2canvas from "html2canvas";
// import TestImg from "../../assets/BabyWelcomeIMG.png";
// import Image from "next/image";

// const DynamicTemplateRenderer = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const templateId = searchParams.get("templateId");
//   const eventId = searchParams.get("id");

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const isEdit = Boolean(eventId);

//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const templateRef = useRef(null);

//   const [formData, setFormData] = useState({
//     eventType: "",
//     name: "",
//     date: "",
//     time: "",
//     address: "",
//     templateId: templateId || "",
//   });

//   const [uploadedImage, setUploadedImage] = useState(null);
//   const fileInputRef = useRef(null);

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
//               isHeroImage: selectedTemplate.configs?.isHeroImage || false,
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

//   /** Input Change */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
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

//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userID") : null;
//   console.log(
//     "%c [ userId ]-185",
//     "font-size:13px; background:pink; color:#bf2c9f;",
//     userId
//   );

//   const handleSave = async () => {
//     if (!userId) {
//       alert("User not logged in or UserId missing.");
//       return;
//     }

//     handleDownload();

//     // const payload = {
//     //   userId: userId,
//     //   eventType: formData.eventType,
//     //   hostName: formData.name,
//     //   eventDate: formData.date ? new Date(formData.date).toISOString() : "",
//     //   eventTime: formData.time || "",
//     //   location: formData.address,
//     //   // templateId: formData.templateId,
//     // };

//     // try {
//     //   const res = await fetch(
//     //     `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
//     //     {
//     //       method: isEdit ? "PUT" : "POST",
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //         Authorization: token,
//     //       },
//     //       body: JSON.stringify(payload),
//     //     }
//     //   );

//     //   if (res.ok) {
//     //     // router.replace(`/wonderland?id=${userId}/${eventId || "new"}/host`);
//     //   } else {
//     //     const errData = await res.json();
//     //     alert(`Failed: ${errData.message || "Unknown error"}`);
//     //   }
//     // } catch (err) {
//     //   console.error("Error:", err);
//     //   alert("Something went wrong.");
//     // }
//   };

//   const handleDownload = async () => {
//     // if (noteTitle.trim() === "") {
//     //   // setErrorMsg("Please write a thank you message.");
//     //   return;
//     // }

//     // setShowPopup(false);
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
//           `${BASE_URL}${UPLOAD_THANKYOU_NOTE}/${eventId}/thankyou-note`,
//           {
//             method: "PUT",
//             headers: {
//               Authorization: `${token}`,
//             },
//             body: formData,
//           }
//         );
//         const result = await response.json();

//         // if (result.success && result.uploaded && result.uploaded[0]?.url) {
//         //   // ✅ Add the uploaded image to eventData so it shows in the UI
//         //   const newImage = {
//         //     type: "image",
//         //     src: result.uploaded[0].url,
//         //     alt: "Thank You Note",
//         //   };
//         //   // setEventData((prev) => [newImage, ...prev]);
//         // }
//         // setRefetchEventImages(!refetchEventImages);
//         // setShowPopup(false);
//         // setNoteTitle("");
//         // setNoteBy("");
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
//     <div style={{ padding: "20px" }}>
//       {/* Template Preview with Background */}
//       <div ref={templateRef}>
//         {/*
//       <div
//         style={{
//           // backgroundImage: template?.backgroundUrl
//           //   ? `url('${template.backgroundUrl}')`
//           //   : "none",
//           // backgroundImage:  `url(${template.backgroundUrl})`,
//           backgroundImage:  `https://res.cloudinary.com/dlewjmnku/image/upload/v1741768091/student/student_image_a1c163fc-42f0-49be-a689-78bc6dfb62e2.jpg`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           minHeight: "400px",
//           borderRadius: "12px",
//           position: "relative",
//         }}

//       > */}

//         <div
//           style={{
//             backgroundImage: `url(${template?.backgroundUrl})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             minHeight: "400px",
//             borderRadius: "12px",
//             position: "relative",
//           }}
//         >
//           <img
//             src={template?.backgroundUrl}
//             crossOrigin="anonymous"
//             style={{
//               position: "absolute",
//               inset: 0,
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               borderRadius: "12px",
//               zIndex: 1,
//             }}
//             alt="background"
//           />
//           {/* Fonts */}
//           {template?.fontUrls?.map((url, idx) => (
//             <link key={idx} href={url} rel="stylesheet" />
//           ))}

//           {/* CSS */}
//           {template?.cssCode && (
//             <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
//           )}

//           {/* Template HTML */}
//           {template?.jsCode && (
//             <div
//               style={{ position: "relative", zIndex: 2 }}
//               dangerouslySetInnerHTML={{
//                 __html: renderHTML(template.jsCode, formData),
//               }}
//             />
//           )}

//           {/* Uploaded Host Image */}
//           {uploadedImage && (
//             <img
//               src={uploadedImage}
//               alt="Host"
//               style={{
//                 position: "absolute",
//                 bottom: "20px",
//                 right: "20px",
//                 width: "100px",
//                 height: "100px",
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 border: "3px solid white",
//                 zIndex: 3,
//               }}
//             />
//           )}
//         </div>
//       </div>

//       {/* Form */}
//       <div style={formWrapper}>
//         <h3>Customize Invite {isEdit ? "(Edit Mode)" : ""}</h3>

//         <input
//           type="text"
//           placeholder="Event Name"
//           name="eventType"
//           value={formData.eventType}
//           onChange={handleChange}
//           style={inputStyle}
//         />
//         <input
//           type="text"
//           placeholder="Host Name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           style={inputStyle}
//         />

//         <div style={{ display: "flex", gap: "10px" }}>
//           <div style={{ flex: 1 }}>
//             <label>Event Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               style={inputStyle}
//             />
//           </div>
//           <div style={{ flex: 1 }}>
//             <label>Event Time</label>
//             <input
//               type="time"
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//               style={inputStyle}
//             />
//           </div>
//         </div>

//         <input
//           type="text"
//           placeholder="Venue"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           style={inputStyle}
//         />

//         {/* Always render file input, but keep it hidden */}
//         <input
//           type="file"
//           accept="image/*"
//           id="file-upload"
//           onChange={handleImageChange}
//           ref={fileInputRef}
//           hidden
//         />

//         {/* Conditional UI display */}
//         {uploadedImage ? (
//           <div
//             onClick={() => {
//               if (fileInputRef.current) fileInputRef.current.click();
//             }}
//             style={previewWrapper}
//           >
//             <img src={uploadedImage} alt="Preview" style={imagePreview} />
//             <div>Tap to change photo</div>
//           </div>
//         ) : (
//           <label style={uploadBox} htmlFor="file-upload">
//             <img src="/camera-icon.png" alt="Upload" width={40} />
//             <div>Upload Photo</div>
//           </label>
//         )}

//         <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
//           <button onClick={() => router.back()} style={cancelBtn}>
//             Cancel
//           </button>
//           <button onClick={handleSave} style={saveBtn}>
//             {isEdit ? "Update" : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /** ---- Styles ---- */
// const formWrapper = { marginTop: "30px", maxWidth: "500px" };
// const inputStyle = {
//   width: "100%",
//   margin: "8px 0",
//   padding: "10px",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   fontSize: "14px",
// };
// const previewWrapper = {
//   margin: "10px 0",
//   cursor: "pointer",
//   textAlign: "center",
// };
// const imagePreview = {
//   width: "100%",
//   maxHeight: "200px",
//   objectFit: "cover",
//   borderRadius: "8px",
// };
// const uploadBox = {
//   border: "2px dashed #aaa",
//   padding: "20px",
//   textAlign: "center",
//   cursor: "pointer",
// };
// const cancelBtn = {
//   flex: 1,
//   background: "#ccc",
//   padding: "10px",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
// };
// const saveBtn = {
//   flex: 1,
//   background: "#4CAF50",
//   color: "#fff",
//   padding: "10px",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
// };

// export default DynamicTemplateRenderer;

"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import html2canvas from "html2canvas";
import "./DynamicTemplateRenderer.css";

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

  const [formData, setFormData] = useState({
    eventType: "",
    name: "",
    date: "",
    time: "",
    address: "",
    templateId: templateId || "",
  });

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    // if (noteTitle.trim() === "") {
    //   // setErrorMsg("Please write a thank you message.");
    //   return;
    // }

    // setShowPopup(false);
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
        // setRefetchEventImages(!refetchEventImages);
        // setShowPopup(false);
        // setNoteTitle("");
        // setNoteBy("");
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }, "image/png");
  };

  /** Replace variables inside template */
  const renderHTML = (jsCode, rawData) => {
    return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
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
              __html: renderHTML(template.jsCode, formData),
            }}
          />
        )}
        {/* <div style={{ position: "relative", zIndex: 2 }}>
          <div className="invite-wrapper">
            <div className="invite-card">
              <div className="name">{formData.name}</div>
              <div className="datetime">
                {formData.date
                  ? new Date(formData.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </div>
              <div className="time">at {formData.time}</div>
              <div className="address">{formData.address}</div>
            </div>
          </div>
        </div> */}

        {/* Uploaded Host Image */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Host"
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid white",
              zIndex: 3,
            }}
          />
        )}
      </div>

      {/* Form */}
      <div style={formWrapper}>
        <h3>Customize Invite {isEdit ? "(Edit Mode)" : ""}</h3>

        <input
          type="text"
          placeholder="Event Name"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Host Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Event Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Venue"
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* Always render file input, but keep it hidden */}
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={handleImageChange}
          ref={fileInputRef}
          hidden
        />

        {/* Conditional UI display */}
        {uploadedImage ? (
          <div
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            style={previewWrapper}
          >
            <img src={uploadedImage} alt="Preview" style={imagePreview} />
            <div>Tap to change photo</div>
          </div>
        ) : (
          <label style={uploadBox} htmlFor="file-upload">
            <img src="/camera-icon.png" alt="Upload" width={40} />
            <div>Upload Photo</div>
          </label>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={() => router.back()} style={cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSave} style={saveBtn}>
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

/** ---- Styles ---- */
const formWrapper = { marginTop: "30px", maxWidth: "500px" };
const inputStyle = {
  width: "100%",
  margin: "8px 0",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
};
const previewWrapper = {
  margin: "10px 0",
  cursor: "pointer",
  textAlign: "center",
};
const imagePreview = {
  width: "100%",
  maxHeight: "200px",
  objectFit: "cover",
  borderRadius: "8px",
};
const uploadBox = {
  border: "2px dashed #aaa",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};
const cancelBtn = {
  flex: 1,
  background: "#ccc",
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const saveBtn = {
  flex: 1,
  background: "#4CAF50",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default DynamicTemplateRenderer;
