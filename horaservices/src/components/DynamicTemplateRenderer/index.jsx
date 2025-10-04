"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import html2canvas from "html2canvas";
import "./DynamicTemplateRenderer.css";
import { dateFormatter } from "./dateTimeFormatters";
import CameraIcon from '@/assets/camera.png'
import Cropper from 'react-easy-crop';
import { FaCropAlt } from "react-icons/fa";
import { BiZoomOut } from "react-icons/bi";
import { BiZoomIn } from "react-icons/bi";

const DynamicTemplateRenderer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateRef = useRef(null);
  const templateId = searchParams.get("templateId");
  const eventId = searchParams.get("id");
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
          console.log('%c [ selectedTemplate ]-626', 'font-size:13px; background:pink; color:#bf2c9f;',  selectedTemplate?.configs?.bgImageHeight)

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
              bgImageHeight: selectedTemplate?.configs?.bgImageHeight || "",
              charLimits: selectedTemplate.configs?.charLimits || {},
              dateFormatCase: selectedTemplate?.configs?.dateFormatCase || "1",
            });
            setCropShape(selectedTemplate?.configs?.heroImageConfig?.cropShape || 'rect');
            setAspectRatio((parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.width) || 4)  / (parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.height) || 3));
            setCropSize({
              width : parseInt(selectedTemplate?.configs?.heroImageConfig?.cropSize?.width) || 200,
              height: parseInt(selectedTemplate?.configs?.heroImageConfig?.cropSize?.height) || 200
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




  // const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const ratio = img.width / img.height;
  //       const newWidth = Math.min(img.width, maxWidth);
  //       const newHeight = newWidth / ratio;

  //       canvas.width = newWidth;
  //       canvas.height = newHeight;

  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0, newWidth, newHeight);

  //       const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
  //       resolve(compressedBase64);
  //     };
  //     img.onerror = reject;
  //     img.src = base64;
  //   });
  // };

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
      // const compressed = await compressBase64Image(croppedBase64, 500, 0.4);
      const compressed = croppedBase64;
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
        // const compressed = await compressBase64Image(reader.result, 500, 0.4);
        const compressed = reader.result;
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
      console.log('%c [ image size ]-386', 'font-size:13px; background:pink; color:#bf2c9f;', file)

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
          maxHeight: template?.bgImageHeight ? `${template?.bgImageHeight}px` : '530px',
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

        {template?.jsCode && (
          <div
            style={{ position: "relative", zIndex: 2 }}
            dangerouslySetInnerHTML={{
              __html: renderHTML(template.jsCode, dataForTemplate),
            }}
          />
        )}

       {/* <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div class="invite-template-wrapper">
                <div class="invite-template-card">
     
  <div class='template-image-wrapper'>
    <img src={dataForTemplate.image} alt="host image" class='template-image' />
  </div>


                  <div class="name">{dataForTemplate.name}</div>
                  
                  <div class="date-wrapper">
                    
                      <span class="month">{dataForTemplate.month}</span>
                      <span class="day">{dataForTemplate.day}</span>
                     <span class="time"> AT {dataForTemplate.time}</span>
                  </div>
                  <div class="address">
                    <p>{dataForTemplate.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>  */}
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
