// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { BASE_URL, GET_TEMPLATES_BY_ID} from "@/utils/apiconstants";
// import html2canvas from "html2canvas";
// import "./DynamicTemplateRenderer.css";
// import { dateFormatter } from "./dateTimeFormatters";
// import CameraIcon from '@/assets/camera.png'
// import DefaultImageBgCircle from '../../../public/assets/templates/DefaultImageBgCircle.png'
// import Cropper from 'react-easy-crop';
// import { FaCropAlt } from "react-icons/fa";
// import { BiZoomOut } from "react-icons/bi";
// import { BiZoomIn } from "react-icons/bi";
// import SequentialLoader from "../SequentialLoader";

// const DynamicTemplateRenderer = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const templateRef = useRef(null);
//   const templateId = searchParams.get("templateId");
//   const eventId = searchParams.get("id");
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   const [template, setTemplate] = useState(null);
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
//   const [cropShape, setCropShape] = useState('rect'); 
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
//     image: uploadedImage ? uploadedImage : cropShape === 'round' ? DefaultImageBgCircle.src : DefaultImageBgCircle.src,
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

//   const [cropImage, setCropImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(4 / 3);
//   const [cropSize, setCropSize] = useState({ width: 200, height: 200 }); 
//   const [ aspectRatioTemplate , setAspectRatioTemplate] = useState();
//   const imgRef = useRef(null);
//   const [imgHeight, setImgHeight] = useState(0);
//   const [nameFontSize , setNameFontSize ] = useState();
//   const [nameLineHeight,setnameLineHeight] =useState();
//    const [dateTimeFontSize , setDateTimeFontSize ] = useState();
//   const [addressFontSize , setAddressFontSize ] = useState();
//    const [addressLineHeight,setaddressLineHeight] =useState();
//   const [namePosition , setNamePosition ] = useState();
//   const [dateTimePosition , setDateTimePosition ] = useState();
//   const [dateTimeLineHeight,setdateTimeLineHeight] =useState();
//   const [addressPosition , setAddressPosition ] = useState();
//   const [ imgCirclePosition , setImgCirclePosition ] = useState();
//   const [ imgCircleWidth , setImageCircleWidth] = useState();
//    const [ imgCircleHeight , setImageCircleHeight] = useState();
//    const [dayFontSize ,setDayFontSize]=useState();
//    const [dayPosition ,setDayPosition]=useState();
//    const [scaledData, setScaledData] = useState(null);
//     const [renderedHTML, setRenderedHTML] = useState("");

//   // useEffect(() => {
//   //   setDataForTemplate({
//   //     eventType: formData.eventType,
//   //     name: formData.name,
//   //     date: dateFormatter(formData.date, template?.dateFormatCase || "1"),
//   //     day: dateFormatter(formData?.date, template?.dateFormatCase)?.day,
//   //     month: dateFormatter(formData?.date, template?.dateFormatCase)?.month,
//   //     year: dateFormatter(formData?.date, template?.dateFormatCase)?.year,
//   //     time: formData.time,
//   //     address: formData.address,
//   //     templateId: templateId || "",
//   //     image: uploadedImage ? uploadedImage : cropShape === 'round' ? DefaultImageBgCircle.src : DefaultImageBgCircle.src,
//   //   });
//   // }, [formData, template, uploadedImage]);


//   useEffect(() => {
//   if (!template) return;

//   setDataForTemplate({
//     eventType: formData.eventType,
//     name: formData.name,
//     date: dateFormatter(formData.date, template?.dateFormatCase || "1"),
//     day: dateFormatter(formData.date, template?.dateFormatCase)?.day,
//     month: dateFormatter(formData.date, template?.dateFormatCase)?.month,
//     year: dateFormatter(formData.date, template?.dateFormatCase)?.year,
//     time: formData.time,
//     address: formData.address,
//     templateId: templateId || "",
//     image: uploadedImage || DefaultImageBgCircle.src,
//   });
// }, [formData, template, uploadedImage, eventId]);

//   const fileInputRef = useRef(null);
//   useEffect(() => {
    
//     const fetchTemplate = async () => {
//       try {
//         if(templateId){
//         const response = await fetch(`${BASE_URL}${GET_TEMPLATES_BY_ID}/${templateId}`);
//         const result = await response.json();

//         if (result.error) {
//           setError(result.message || "Failed to fetch template");
//         } else {
//           const selectedTemplate = result?.template;
//           if (selectedTemplate) {
//             let { cssCode, jsCode, fontUrls, backgroundUrl, } =
//               selectedTemplate.configs;
//             if (backgroundUrl) {
//               cssCode = cssCode.replace(
//                 /url\((['"]?).*?\1\)/g,
//                 `url('${selectedTemplate.backgroundUrl}')`
//               );
//             }

//             const heroCropShape = selectedTemplate?.configs?.heroImageConfig?.cropShape || 'rect';
//             setCropShape(heroCropShape);
//             let heroAspect = (parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.width) || 4) / (parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.height) || 3);
//             if (heroCropShape === 'round') {
//               heroAspect = 1;
//             }
//             setAspectRatio(heroAspect);
//             setCropSize({
//               width : parseInt(selectedTemplate?.configs?.heroImageConfig?.cropSize?.width * 1.3) || 200,
//               height: parseInt(selectedTemplate?.configs?.heroImageConfig?.cropSize?.height * 1.3) || 200
//             });

//             setTemplate({
//               cssCode: cssCode || "",
//               jsCode: jsCode || "",
//               fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
//               backgroundUrl: selectedTemplate.backgroundUrl || null,
//               isHeroImage: selectedTemplate?.isHeroImage || false,
//               bgImageName: selectedTemplate?.configs?.bgImageName || "",
//               bgImageHeight: selectedTemplate?.configs?.bgImageHeight || "",
//               charLimits: selectedTemplate.configs?.charLimits || {},
//               dateFormatCase: selectedTemplate?.configs?.dateFormatCase || "1",
//               templateInfo: selectedTemplate?.configs?.templateinfo || {},
//               image: uploadedImage
//                         ? uploadedImage
//                         : cropShape === "round"
//                         ? DefaultImageBgCircle.src
//                         : DefaultImageBgCircle.src,
                        
//             });
            
//           } else {
//             setError("Template not found");
//           }
//         }
//         }
//       } catch (err) {
//         setLoading(false);
//         setError("Error fetching template: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplate();
    
//   }, [templateId]);

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
//   const { name, value } = e.target;
//   const charLimit = template?.charLimits?.[name]
//     ? parseInt(template.charLimits[name])
//     : Infinity;
//   const newValue = value.length > charLimit ? value.slice(0, charLimit) : value;

//   setFormData((prev) => ({ ...prev, [name]: newValue }));
//   setCharCounts((prev) => ({ ...prev, [name]: newValue.length }));

//   if (value.length > charLimit) {
//     setFormErrors((prev) => ({
//       ...prev,
//       [name]: `Character limit of ${charLimit} exceeded`,
//     }));
//   } else {
//     setFormErrors((prev) => ({ ...prev, [name]: "" }));
//   }
// };

//     const handleZoomIn = () => {
//     setZoom((prev) => Math.min(prev + 0.1, 3));
//   };

//   const handleZoomOut = () => {
//     setZoom((prev) => Math.max(prev - 0.1, 1));
//   };

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const createCroppedImage = async () => {
//     try {
//       const image = new Image();
//       image.src = cropImage;
//       image.crossOrigin = "Anonymous";
//       await new Promise((resolve, reject) => {
//         image.onload = resolve;
//         image.onerror = reject;
//       });

//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       canvas.width = croppedAreaPixels.width;
//       canvas.height = croppedAreaPixels.height;

//       ctx.imageSmoothingEnabled = true;
//       ctx.imageSmoothingQuality = "high";

//       if (cropShape === 'round') {
//         ctx.beginPath();
//         ctx.arc(
//           canvas.width / 2,
//           canvas.height / 2,
//           Math.min(canvas.width, canvas.height) / 2,
//           0,
//           2 * Math.PI
//         );
//         ctx.clip();
//       }

//       ctx.drawImage(
//         image,
//         croppedAreaPixels.x,
//         croppedAreaPixels.y,
//         croppedAreaPixels.width,
//         croppedAreaPixels.height,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );

//       canvas.toBlob((blob) => {
//         if (blob) {
//           const croppedUrl = URL.createObjectURL(blob);
//           setUploadedImage(croppedUrl);
//         }
//         setCropImage(null); 
//       }, "image/png", 1.0);
//     } catch (err) {
//       console.error("Crop failed:", err);
//       alert("Failed to crop image.");
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     setUploadedImage(url);
//     setOriginalImage(url);
//     setCropImage(url); 
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
//     setSaving(true);
//     if (!userId) {
//       alert("User not logged in or UserId missing.");
//       setSaving(false);
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
//           method: "PUT",
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
//         setSaving(false);
//         const errData = await res.json();
//         alert(`Failed: ${errData.message || "Unknown error"}`);
//       }
//     } catch (err) {
//       setSaving(false);
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

//       const file = new File([blob], `invite_${template?.bgImageName}`, {
//         type: "image/png",
//         lastModified: new Date().getTime(),
//       });
//       console.log('%c [ image size ]-386', 'font-size:13px; background:pink; color:#bf2c9f;', file)

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
//           setSaving(false);
//           router.replace(`/wonderland?id=${userId}/${eventId}/host`);
//         }
//       } catch (err) {
//         setSaving(false);
//         console.error("Upload failed:", err);
//       }
//     }, "image/png", 1.0);
//   };

// const renderHTML = (jsCode, rawData) => {
//   if (!jsCode) return "";

//   // Handle conditional blocks
//   jsCode = jsCode.replace(/{{#if (.*?)}}([\s\S]*?){{\/if}}/g, (_, key, inner) => {
//     const value = rawData[key.trim()];
//     if (value) {
//       return inner.replace(/{{(.*?)}}/g, (_, innerKey) => rawData[innerKey.trim()] || "");
//     }
//     return "";
//   });

//   // Handle all {{variables}} (works for both CSS and text)
//   return jsCode.replace(/{{(.*?)}}/g, (_, key) => {
//     try {
//       const val = key
//         .trim()
//         .split(".")
//         .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""), rawData);
//       return val ?? "";
//     } catch {
//       return "";
//     }
//   });
// };



// // useEffect(() => {
// //   if (template?.jsCode && dataForTemplate && scaledData) {
// //     const combinedData = { ...dataForTemplate, ...scaledData };
// //     const html = renderHTML(template.jsCode, combinedData);
// //     setRenderedHTML(html);
// //   }
// // }, [template, dataForTemplate, scaledData]);

// useEffect(() => {
//   if (!template?.jsCode) return;

//   const combinedData = { ...dataForTemplate, ...scaledData };

//   // ensure name, date, etc. are available before rendering
//   if (combinedData.name || combinedData.address || combinedData.date) {
//     const html = renderHTML(template.jsCode, combinedData);
//     setRenderedHTML(html);
//   }
// }, [dataForTemplate, scaledData, template?.jsCode]);

//  useEffect(() => {
//   const updateHeight = () => {
//     if (imgRef.current) {
//       const height = imgRef.current.clientHeight;
//       setImgHeight(height);
//       console.log('Image height:', height);
//     }
//   };

//   const img = imgRef.current;

//   if (img?.complete) {
//     updateHeight();
//   } else {
//     img?.addEventListener("load", updateHeight);
//   }

//   return () => {
//     img?.removeEventListener("load", updateHeight);
//   };
// }, []);




// const handleImageLoad = () => {
//   if (!imgRef.current || !template?.templateInfo) return;

//   const {
//     templateWidth,
//     templateHeight,
//     templateNameSize,
//     templateNamePosition,
//     templateDateTimeSize,
//     templateDateTimePosition,
//     templateAddressSize,
//     templateAddressPosition,
//     templateNamelineHeight,
//     templateAddresslineHeight,
//     templateDatetimelineHeight,
//     templatedayfontSize,
//     templatedayposition,
//     templateCirclePosition = 0,
//     templateCircleWidth = 0,
//     templateCircleHeight = 0,
//   } = template.templateInfo;

//   console.log("templateHeight-----------",templateHeight);
  
//   if (!templateWidth || !templateHeight) {
//     console.warn("Missing template dimensions");
//     return;
//   }

//   const screenWidth = window.innerWidth;
//   console.log("screenWidth:", screenWidth);

//   const ratio = (templateWidth - screenWidth) / templateWidth;
//   const scaleFactor = 1 - ratio;
//  const newScaledData = {
//     imgHeight: scaleFactor * templateHeight,
//     nameFontSize: scaleFactor * templateNameSize,
//     nameLineHeight: (scaleFactor * templateNameSize + templateNamelineHeight),
//     namePosition: scaleFactor * templateNamePosition,
//     dateTimeFontSize: scaleFactor * templateDateTimeSize,
//     dateTimeLineHeight: (scaleFactor * templateDateTimeSize + templateDatetimelineHeight),
//     dateTimePosition: scaleFactor * templateDateTimePosition,
//     addressFontSize: scaleFactor * templateAddressSize,
//     addressLineHeight: (scaleFactor * templateAddressSize * templateAddresslineHeight),
//     addressPosition: scaleFactor * templateAddressPosition,
//     imgCirclePosition: scaleFactor * templateCirclePosition,
//     imgCircleHeight: scaleFactor * templateCircleHeight,
//     imgCircleWidth: scaleFactor * templateCircleWidth,
//     dayFontSize: scaleFactor * templatedayfontSize,
//     dayPosition: scaleFactor * templatedayposition,
//   };
//   // ✅ Update states
  
//   setScaledData(newScaledData);
//   setAspectRatioTemplate(ratio);
//   setImgHeight(imgHeight);
//   setNameFontSize(nameFontSize);
//   setDateTimeFontSize(dateTimeFontSize);
//   setAddressFontSize(addressFontSize);
//   setNamePosition(namePosition);
//   setDateTimePosition(dateTimePosition);
//   setAddressPosition(addressPosition);
//   setImgCirclePosition(imgCirclePosition);
//   setImageCircleHeight(imgCircleHeight);
//   setImageCircleWidth(imgCircleWidth);
// setnameLineHeight (nameLineHeight)
// setaddressLineHeight(addressLineHeight)
// setdateTimeLineHeight(dateTimeLineHeight)
// setDayFontSize(dayFontSize)
// setDayPosition(dayPosition)
// };


// useEffect(() => {
//   if (imgRef.current?.complete) {
//     handleImageLoad();
//   }
// }, []);


 

//   if (loading) return <SequentialLoader />;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div className="d-flex justify-content-center">
//       <div style={{ padding: "10px" ,  width: '100%' }}>
//       <div
//         ref={templateRef}
//         className="template-container"
//         style={{position: 'relative' }}
//       >
//         <img  ref={imgRef}  src={`/assets/templates/${template?.bgImageName}`}  id='bg-image' alt="bg" 
//         onLoad={handleImageLoad}
//         />

//         {/* Fonts  */}
//         {template?.fontUrls?.map((url, idx) => (
//           <link key={idx} href={url} rel="stylesheet" />
//         ))}

//         {/* CSS */}
//         {template?.cssCode && (
//           <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
//         )}

//         {/* Template HTML */}
//      {renderedHTML && (
//   <div
//     style={{ position: "absolute", zIndex: 2, top: 0, left: 0, right: 0, bottom: 0 }}
//     dangerouslySetInnerHTML={{ __html: renderedHTML }}
//   />
// )}

//       {/* <div class="invite-template-wrapper">
//   <div class="invite-template-card" style="height:{{imgHeight}}px;">
  

//     <div class="name" style="font-size:{{nameFontSize}}px; top:{{namePosition}}px; position:absolute; line-height:{{nameLineHeight}}px;">
//       {{name}}
//     </div>

//     <div class="date-wrapper" style="top:{{dateTimePosition}}px; position:absolute; line-height:{{dateTimeLineHeight}}px;">
//       <span class="month" style="font-size:{{dateTimeFontSize}}px;">{{month}}</span>
//       <span class="day" style="font-size:30px;">{{day}}</span>
//       <span class="time" style="font-size:{{dateTimeFontSize}}px;">{{time}}PM.</span>
//     </div>

//     <div class="address" style="font-size:{{addressFontSize}}px; top:{{addressPosition}}px; position:absolute; line-height:{{addressLineHeight}}px;">
//       {{address}}
//     </div>
//   </div>
// </div> */}

 
//       </div>

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

//          <input
//            type="file"
//            accept="image/*"
//            id="file-upload"
//            onChange={handleImageChange}
//            ref={fileInputRef}
//            hidden
//          />

//         {/* Cropper Modal */}
//         {cropImage && (
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
//                <div className="zoom-container">
//                 <div>
//                   <button className={`btn zoom-btns ${zoom === 1 && 'btn-disabled'}`} disabled={zoom === 1}>
//                      <BiZoomOut size={30} className="zoom-icons" onClick={handleZoomOut}  />
//                   </button>
//                 </div>
//                <input
//                   type="range"
//                   id="zoom"
//                   value={zoom}
//                   min={1}
//                   max={3}
//                   step={0.1}
//                   aria-labelledby="Zoom"
//                   onChange={(e) => setZoom(parseFloat(e.target.value))}
//                   className="zoom-range"
//               />
//               <div>
//                 <button className={`btn zoom-btns ${zoom === 3 && 'btn-disabled'}`} disabled={zoom === 3}>
//                   <BiZoomIn size={30} className="zoom-icons" onClick={handleZoomIn} />
//                 </button>
//               </div>
//                </div>
//               <div className="d-flex justify-content-center align-items-center w-100 gap-4">
//                  <div className="d-flex justify-content-end w-100">
//                   <button onClick={() => setCropImage(null)} className="crop-cancel-btn">
//                  Cancel
//                </button>
//                  </div>
//                  <div className="w-100">
//                <button onClick={createCroppedImage} className="crop-save-btn">
//                  Save
//                </button>
//                  </div>
//              </div>
//              </div>
//            </div>
//          )}

//          {template?.isHeroImage &&
//            (originalImage ? (
//              <div
//                className="preview-wrapper-template"
//              >
//                <div className="preview-image-div">
//                 <img src={originalImage} alt="Preview" className="image-preview-template"
//                   onClick={() => {
//                     if (fileInputRef.current) fileInputRef.current.click();
//                   }}
//                 />
//                </div>
//                <div className="d-flex justify-content-center align-items-end ms-2">
//                 <button className="crop-btn" onClick={handleEditImage}><FaCropAlt className="crop-icon" /> Crop</button>
//                </div>
//              </div>
//            ) : (
//              <label className="upload-box-template" htmlFor="file-upload">
//                <img src={CameraIcon.src} height='45px' width='45px' alt="Upload" />
//                <div className="mt-2 fw-bold" style={{color: '#666666'}}>Upload Photo</div>
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
//              {saving ? (
//                     <div class="spinner-border text-light" style={{
//                       height : '1.5rem', width: '1.5rem'
//                     }} role="status"></div>
//                   ) : (
//                     "Save"
//                   )}
//            </button>
//          </div>
//        </div>
//     </div>
// </div>
//   );
// };

// export default DynamicTemplateRenderer;

"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL, GET_TEMPLATES_BY_ID } from "@/utils/apiconstants";
import html2canvas from "html2canvas";
import "./DynamicTemplateRenderer.css";
import { dateFormatter } from "./dateTimeFormatters";
import CameraIcon from "@/assets/camera.png";
import DefaultImageBgCircle from "../../../public/assets/templates/DefaultImageBgCircle.png";
import Cropper from "react-easy-crop";
import { FaCropAlt } from "react-icons/fa";
import { BiZoomOut, BiZoomIn } from "react-icons/bi";
import SequentialLoader from "../SequentialLoader";

const DynamicTemplateRenderer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateRef = useRef(null);
  const templateId = searchParams.get("templateId");
  const eventId = searchParams.get("id");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // core form data (now edited inline on preview)
  const [formData, setFormData] = useState({
    eventType: "",
    name: "",
    date: "",
    time: "",
    address: "",
    templateId: templateId || "",
  });

  const [charCounts, setCharCounts] = useState({
    eventType: 0,
    name: 0,
    address: 0,
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropShape, setCropShape] = useState("rect");
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });

  const [scaledData, setScaledData] = useState(null);
  const [renderedHTML, setRenderedHTML] = useState("");
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  // flags to show inline editing for fields
  const [editingField, setEditingField] = useState(null);

  // --- fetch template ---
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateId) {
        setLoading(false);
        setError("Template ID missing");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}${GET_TEMPLATES_BY_ID}/${templateId}`);
        const result = await response.json();

        if (result.error) {
          setError(result.message || "Failed to fetch template");
        } else {
          const selectedTemplate = result?.template;
          if (selectedTemplate) {
            let { cssCode, jsCode, fontUrls } = selectedTemplate.configs;
            if (selectedTemplate.backgroundUrl) {
              cssCode = cssCode?.replace(/url\((['"]?).*?\1\)/g, `url('${selectedTemplate.backgroundUrl}')`) || cssCode;
            }

            const heroCropShape = selectedTemplate?.configs?.heroImageConfig?.cropShape || "rect";
            setCropShape(heroCropShape);

            let heroAspect =
              (parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.width) || 4) /
              (parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.height) || 3);
            if (heroCropShape === "round") heroAspect = 1;
            setAspectRatio(heroAspect);

            setCropSize({
              width:
                parseInt(selectedTemplate?.configs?.heroImageConfig?.cropSize?.width * 1.3) ||
                200,
              height:
                parseInt(selectedTemplate?.configs?.heroImageConfig?.cropSize?.height * 1.3) ||
                200,
            });

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
              templateInfo: selectedTemplate?.configs?.templateinfo || {},
              image: uploadedImage
                ? uploadedImage
                : cropShape === "round"
                ? DefaultImageBgCircle.src
                : DefaultImageBgCircle.src,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  // --- fetch event/order details if eventId present ---
  const userId = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const fetchOrderDetails = async () => {
    if (!eventId) return;
    try {
      const res = await fetch(`${BASE_URL}/api/customer/event/event-invites/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await res.json();
      if (res.status === 200 && result.data) {
        const data = result.data;
        const formattedDate = data.eventDate ? new Date(data.eventDate).toISOString().split("T")[0] : "";
        const formattedTime = data.eventTime ? data.eventTime.slice(0, 5) : "";
        setFormData({
          name: data.hostName || "",
          eventType: data.eventType || "",
          date: formattedDate,
          time: formattedTime,
          address: data.location || "",
          templateId: templateId,
        });
        setCharCounts({
          eventType: data.eventType?.length || 0,
          name: data.hostName?.length || 0,
          address: data.location?.length || 0,
        });

        // if server returned an uploaded image url, use it
        if (data.hostImage) {
          setUploadedImage(data.hostImage);
          setOriginalImage(data.hostImage);
        }
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    if (eventId) fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // update dataForTemplate when formData/template/uploadedImage change
  const [dataForTemplate, setDataForTemplate] = useState({
    eventType: "",
    name: "",
    date: "",
    day: "",
    month: "",
    year: "",
    time: "",
    address: "",
    templateId: templateId || "",
    image: DefaultImageBgCircle.src,
  });

  useEffect(() => {
    if (!template) return;
    setDataForTemplate({
      eventType: formData.eventType,
      name: formData.name,
      date: dateFormatter(formData.date, template?.dateFormatCase || "1"),
      day: dateFormatter(formData.date, template?.dateFormatCase)?.day,
      month: dateFormatter(formData.date, template?.dateFormatCase)?.month,
      year: dateFormatter(formData.date, template?.dateFormatCase)?.year,
      time: formData.time,
      address: formData.address,
      templateId: templateId || "",
      image: uploadedImage || DefaultImageBgCircle.src,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, template, uploadedImage]);

  // --- rendered HTML from template.jsCode (string templating) ---
  const renderHTML = (jsCode, rawData) => {
    if (!jsCode) return "";
    // conditional blocks {{#if key}}...{{/if}}
    jsCode = jsCode.replace(/{{#if (.*?)}}([\s\S]*?){{\/if}}/g, (_, key, inner) => {
      const value = rawData[key.trim()];
      if (value) {
        return inner.replace(/{{(.*?)}}/g, (_, innerKey) => rawData[innerKey.trim()] || "");
      }
      return "";
    });

    return jsCode.replace(/{{(.*?)}}/g, (_, key) => {
      try {
        const val = key
          .trim()
          .split(".")
          .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""), rawData);
        return val ?? "";
      } catch {
        return "";
      }
    });
  };

  useEffect(() => {
    if (!template?.jsCode) return;
    const combinedData = { ...dataForTemplate, ...scaledData };
    if (combinedData.name || combinedData.address || combinedData.date) {
      const html = renderHTML(template.jsCode, combinedData);
      setRenderedHTML(html);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataForTemplate, scaledData, template?.jsCode]);

  // --- image load + scaling calculations (to compute overlays positions) ---
  useEffect(() => {
    const updateHeight = () => {
      if (imgRef.current) {
        // just trigger scaledData calculation using template.templateInfo if available
        handleImageLoad();
      }
    };
    const img = imgRef.current;
    if (img?.complete) updateHeight();
    else img?.addEventListener("load", updateHeight);
    return () => img?.removeEventListener("load", updateHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const handleImageLoad = () => {
    if (!imgRef.current || !template?.templateInfo) return;
    const info = template.templateInfo;
    const {
      templateWidth,
      templateHeight,
      templateNameSize,
      templateNamePosition,
      templateDateTimeSize,
      templateDateTimePosition,
      templateAddressSize,
      templateAddressPosition,
      templateNamelineHeight,
      templateAddresslineHeight,
      templateDatetimelineHeight,
      templatedayfontSize,
      templatedayposition,
      templateCirclePosition = 0,
      templateCircleWidth = 0,
      templateCircleHeight = 0,
    } = info;

    if (!templateWidth || !templateHeight) return;

    const screenWidth = window.innerWidth;
    const ratio = Math.max(0, templateWidth - screenWidth) / templateWidth;
    const scaleFactor = 1 - ratio;

    const newScaledData = {
      imgHeight: scaleFactor * templateHeight,
      nameFontSize: Math.max(10, scaleFactor * templateNameSize),
      nameLineHeight: Math.max(12, scaleFactor * (templateNamelineHeight || templateNameSize)),
      namePosition: scaleFactor * templateNamePosition,
      dateTimeFontSize: Math.max(10, scaleFactor * templateDateTimeSize),
      dateTimeLineHeight: Math.max(12, scaleFactor * (templateDatetimelineHeight || templateDateTimeSize)),
      dateTimePosition: scaleFactor * templateDateTimePosition,
      addressFontSize: Math.max(10, scaleFactor * templateAddressSize),
      addressLineHeight: Math.max(12, scaleFactor * (templateAddresslineHeight || templateAddressSize)),
      addressPosition: scaleFactor * templateAddressPosition,
      imgCirclePosition: scaleFactor * templateCirclePosition,
      imgCircleHeight: scaleFactor * templateCircleHeight,
      imgCircleWidth: scaleFactor * templateCircleWidth,
      dayFontSize: Math.max(12, scaleFactor * templatedayfontSize),
      dayPosition: scaleFactor * templatedayposition,
    };

    setScaledData(newScaledData);
  };

  // --- inline edit handlers ---
  const startEdit = (field) => {
    setEditingField(field);
    // small timeout to focus contentEditable
    setTimeout(() => {
      const el = document.getElementById(`edit-${field}`);
      if (el) el.focus();
    }, 50);
  };

  const finishEdit = (field, newVal) => {
    // enforce char limit if exists
    const charLimit = template?.charLimits?.[field] ? parseInt(template.charLimits[field]) : Infinity;
    const value = newVal.length > charLimit ? newVal.slice(0, charLimit) : newVal;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setCharCounts((prev) => ({ ...prev, [field]: value.length }));
    setEditingField(null);
  };

  // handle onInput for contentEditable
  const handleEditableInput = (e, field) => {
    const text = e.target.innerText;
    const charLimit = template?.charLimits?.[field] ? parseInt(template.charLimits[field]) : Infinity;
    if (text.length > charLimit) {
      e.target.innerText = text.slice(0, charLimit);
    }
  };

  // --- image crop logic (same as before) ---
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = cropImage;
      image.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (cropShape === "round") {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, 2 * Math.PI);
        ctx.clip();
      }

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          setUploadedImage(croppedUrl);
          setOriginalImage(croppedUrl);
        }
        setCropImage(null);
      }, "image/png", 1.0);
    } catch (err) {
      console.error("Crop failed:", err);
      alert("Failed to crop image.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setOriginalImage(url);
    setCropImage(url);
  };

  const handleEditImage = () => {
    if (originalImage) setCropImage(originalImage);
    else alert("No original image available for editing.");
  };

  // --- Save (PUT) logic (keeps original behaviour) ---
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
      const res = await fetch(`${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // keep upload after saving
        await handleDownload();
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
    try {
      const canvas = await html2canvas(templateRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 1,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `invite_${template?.bgImageName || "image"}.png`, {
          type: "image/png",
          lastModified: new Date().getTime(),
        });

        const fd = new FormData();
        fd.append("image", file);
        fd.append("userId", userId);

        try {
          const response = await fetch(
            `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `${token}`,
              },
              body: fd,
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
      }, "image/png", 1.0);
    } catch (err) {
      setSaving(false);
      console.error("html2canvas failed:", err);
      alert("Failed to render image.");
    }
  };

  // --- helper to format date/time for inline editing display ---
  const displayDate = (isoDate) => {
    if (!isoDate) return "";
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString();
    } catch {
      return isoDate;
    }
  };

  if (loading) return <SequentialLoader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="d-flex justify-content-center">
      <div style={{ padding: "10px", width: "100%" }}>
        <div ref={templateRef} className="template-container" style={{ position: "relative" }}>
          {/* Background image */}
          <img
            ref={imgRef}
            src={`/assets/templates/${template?.bgImageName}`}
            id="bg-image"
            alt="bg"
            style={{ width: "100%", display: "block" }}
            onLoad={handleImageLoad}
          />

          {/* Fonts */}
          {template?.fontUrls?.map((url, idx) => (
            <link key={idx} href={url} rel="stylesheet" />
          ))}

          {/* CSS */}
          {template?.cssCode && <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />}

          {/* Rendered HTML from template */}
          {renderedHTML && (
            <div
              style={{ position: "absolute", zIndex: 2, top: 0, left: 0, right: 0, bottom: 0 }}
              dangerouslySetInnerHTML={{ __html: renderedHTML }}
            />
          )}

          {/* ---------- INLINE EDITABLE OVERLAYS ---------- */}
          {/* We place absolutely positioned editable elements using scaledData/template.templateInfo.
              IDs: edit-name, edit-eventType, edit-date, edit-time, edit-address
          */}

          {/* Host Name */}
          {scaledData && (
            <div
              id="edit-name"
              onClick={() => startEdit("name")}
              contentEditable={editingField === "name"}
              suppressContentEditableWarning
              onBlur={(e) => finishEdit("name", e.currentTarget.innerText.trim())}
              onInput={(e) => handleEditableInput(e, "name")}
              style={{
                position: "absolute",
                top: scaledData.namePosition || 20,
                left: 20,
                zIndex: 5,
                fontSize: `${scaledData.nameFontSize}px`,
                lineHeight: `${scaledData.nameLineHeight}px`,
                cursor: editingField ? "text" : "pointer",
                minWidth: 50,
                maxWidth: "90%",
                color: "#000",
                padding: 4,
                background: editingField === "name" ? "rgba(255,255,255,0.6)" : "transparent",
                borderRadius: 4,
                userSelect: "text",
                outline: editingField === "name" ? "2px solid #3b82f6" : "none",
              }}
            >
              {formData.name || "Host Name"}
            </div>
          )}

          {/* Event Type */}
          {scaledData && (
            <div
              id="edit-eventType"
              onClick={() => startEdit("eventType")}
              contentEditable={editingField === "eventType"}
              suppressContentEditableWarning
              onBlur={(e) => finishEdit("eventType", e.currentTarget.innerText.trim())}
              onInput={(e) => handleEditableInput(e, "eventType")}
              style={{
                position: "absolute",
                top: (scaledData.namePosition || 20) - 40,
                left: 20,
                zIndex: 5,
                fontSize: `${Math.max(12, scaledData.dateTimeFontSize - 2)}px`,
                lineHeight: "1.1",
                cursor: editingField ? "text" : "pointer",
                minWidth: 50,
                maxWidth: "90%",
                color: "#000",
                padding: 4,
                background: editingField === "eventType" ? "rgba(255,255,255,0.6)" : "transparent",
                borderRadius: 4,
                outline: editingField === "eventType" ? "2px solid #3b82f6" : "none",
              }}
            >
              {formData.eventType || "Event Type"}
            </div>
          )}

          {/* Date & Time group */}
          {scaledData && (
            <div
              id="edit-date-time-wrapper"
              style={{
                position: "absolute",
                top: scaledData.dateTimePosition || 100,
                right: 40,
                zIndex: 5,
                textAlign: "right",
                cursor: "default",
                color: "#000",
                userSelect: "none",
              }}
            >
              <div
                id="edit-date"
                onClick={() => startEdit("date")}
                contentEditable={editingField === "date"}
                suppressContentEditableWarning
                onBlur={(e) => finishEdit("date", e.currentTarget.innerText.trim())}
                onInput={(e) => handleEditableInput(e, "date")}
                style={{
                  fontSize: `${scaledData.dateTimeFontSize}px`,
                  lineHeight: `${scaledData.dateTimeLineHeight}px`,
                  padding: 4,
                  background: editingField === "date" ? "rgba(255,255,255,0.6)" : "transparent",
                  borderRadius: 4,
                  outline: editingField === "date" ? "2px solid #3b82f6" : "none",
                }}
              >
                {formData.date ? displayDate(formData.date) : "DD/MM/YYYY"}
              </div>
              <div
                id="edit-time"
                onClick={() => startEdit("time")}
                contentEditable={editingField === "time"}
                suppressContentEditableWarning
                onBlur={(e) => finishEdit("time", e.currentTarget.innerText.trim())}
                onInput={(e) => handleEditableInput(e, "time")}
                style={{
                  fontSize: `${Math.max(12, scaledData.dateTimeFontSize - 2)}px`,
                  lineHeight: "1.1",
                  padding: 4,
                  background: editingField === "time" ? "rgba(255,255,255,0.6)" : "transparent",
                  borderRadius: 4,
                  outline: editingField === "time" ? "2px solid #3b82f6" : "none",
                }}
              >
                {formData.time || "Time"}
              </div>
            </div>
          )}

          {/* Address */}
          {scaledData && (
            <div
              id="edit-address"
              onClick={() => startEdit("address")}
              contentEditable={editingField === "address"}
              suppressContentEditableWarning
              onBlur={(e) => finishEdit("address", e.currentTarget.innerText.trim())}
              onInput={(e) => handleEditableInput(e, "address")}
              style={{
                position: "absolute",
                top: scaledData.addressPosition || 200,
                left: 20,
                zIndex: 5,
                fontSize: `${scaledData.addressFontSize}px`,
                lineHeight: `${scaledData.addressLineHeight}px`,
                cursor: editingField ? "text" : "pointer",
                minWidth: 80,
                maxWidth: "70%",
                color: "#000",
                padding: 4,
                background: editingField === "address" ? "rgba(255,255,255,0.6)" : "transparent",
                borderRadius: 4,
                outline: editingField === "address" ? "2px solid #3b82f6" : "none",
              }}
            >
              {formData.address || "Venue / Address"}
            </div>
          )}

          {/* Hero image area overlay (click to upload/crop) */}
          {scaledData && template?.isHeroImage && (
            <div
              style={{
                position: "absolute",
                top: scaledData.imgCirclePosition || 40,
                right: 40,
                width: scaledData.imgCircleWidth || 120,
                height: scaledData.imgCircleHeight || 120,
                zIndex: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: cropShape === "round" ? "50%" : 6,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
            >
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <img src={CameraIcon.src} height="40" width="40" alt="upload" />
                </div>
              )}
            </div>
          )}

          {/* Cropper modal */}
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
                    <button
                      className={`btn zoom-btns ${zoom === 1 && "btn-disabled"}`}
                      disabled={zoom === 1}
                      onClick={() => setZoom((p) => Math.max(1, p - 0.1))}
                    >
                      <BiZoomOut size={20} />
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
                    <button
                      className={`btn zoom-btns ${zoom === 3 && "btn-disabled"}`}
                      disabled={zoom === 3}
                      onClick={() => setZoom((p) => Math.min(3, p + 0.1))}
                    >
                      <BiZoomIn size={20} />
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
          {/* ---------- END INLINE EDITABLE OVERLAYS ---------- */}
        </div>

        {/* Hidden file input used by preview image click */}
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={handleImageChange}
          ref={fileInputRef}
          hidden
        />

        {/* Controls: Save / Cancel back */}
        <div style={{ display: "flex", gap: "10px", marginTop: 16 }}>
          <button onClick={() => router.back()} className="cancel-btn" disabled={saving}>
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
            {saving ? (
              <div
                className="spinner-border text-light"
                style={{
                  height: "1.5rem",
                  width: "1.5rem",
                }}
                role="status"
              />
            ) : (
              "Save"
            )}
          </button>
          {/* quick edit image button if hero image exists */}
          {template?.isHeroImage && originalImage && (
            <button onClick={handleEditImage} className="crop-btn">
              <FaCropAlt style={{ marginRight: 8 }} />
              Crop Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicTemplateRenderer;
