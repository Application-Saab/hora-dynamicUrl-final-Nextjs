"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL, GET_TEMPLATES_BY_ID } from "@/utils/apiconstants";
import html2canvas from "html2canvas";
import "./DynamicTemplateRenderer.css";
import { dateFormatter } from "./dateTimeFormatters";
import DefaultImageBgCircle from '../../../../../public/assets/templates/DefaultImageBgCircle.png';
import SequentialLoader from "@/components/SequentialLoader";
import TimeModal from "@/components/wonderland/create-invite/TimeModal";
import CalendarModal from "@/components/wonderland/create-invite/CalendarModal";
import CustomButton from "@/components/wonderland/common/CustomButton";

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
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSaved, setIsSaved] = useState(false);
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
  const [cropShape, setCropShape] = useState('rect');
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
    image: uploadedImage || originalImage || DefaultImageBgCircle.src,

  });

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
  
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });

  const [aspectRatioTemplate, setAspectRatioTemplate] = useState();
  const imgRef = useRef(null);
  const [imgHeight, setImgHeight] = useState(0);
  const [scaledData, setScaledData] = useState(null);
  const [renderedHTML, setRenderedHTML] = useState("");



  const wrapEditableVariables = (htmlString, formData) => {
    if (!htmlString) return "";
    if (!formData) formData = {};

    let replaced = htmlString;

    // 1️⃣ Remove previously added spans to avoid nesting
    replaced = replaced.replace(/<span class="editable"[^>]*>([\s\S]*?)<\/span>/g, "$1");

    // 2️⃣ Inline fields (only simple text replace)
    const inlineFields = ["name", "eventType"];
    inlineFields.forEach((field) => {
      const value = formData[field];
      if (!value) return;

      const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      replaced = replaced.replace(
        new RegExp(escaped),
        `<span class="editable" data-field="${field}">${value}</span>`
      );
    });

    // 3️⃣ Address block wrapping
    replaced = replaced.replace(
      /<div class="address"([^>]*)>([\s\S]*?)<\/div>/g,
      (match, attrs, content) =>
        `<div class="address"${attrs}>
        <span class="editable" data-field="address">${content.trim()}</span>
      </div>`
    );

    // 4️⃣ Date block wrapping → Combine day, month, year
    replaced = replaced.replace(
      /<div class="date"([^>]*)>([\s\S]*?)<\/div>/g,
      (match, attrs, content) => {
        const trimmed = content.trim();
        return `<div class="date"${attrs}>
        <span class="editable" data-field="date">${trimmed}</span>
      </div>`;
      }
    );

    // 5️⃣ Time block wrapping
    replaced = replaced.replace(
      /<div class="time"([^>]*)>([\s\S]*?)<\/div>/g,
      (match, attrs, content) =>
        `<div class="time"${attrs}>
        <span class="editable" data-field="time">${content.trim()}</span>
      </div>`
    );

    return replaced;
  };


  const renderHTML = (jsCode, rawData) => {
    if (!jsCode) return "";

    jsCode = jsCode.replace(/{{#if (.*?)}}([\s\S]*?){{\/if}}/g, (_, key, inner) => {
      const value = rawData[key.trim()];
      if (value) {
        return inner.replace(/{{(.*?)}}/g, (_, innerKey) => rawData[innerKey.trim()] || "");
      }
      return "";
    });

    let replaced = jsCode.replace(/{{(.*?)}}/g, (_, key) => {
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

    const editableFields = ["name", "eventType", "address", "time", "day", "month", "year"];
    editableFields.forEach((f) => {
      const value = (rawData[f] ?? "").toString();
      if (!value) return;
      const esc = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      replaced = replaced.replace(new RegExp(esc), `<span class="editable" data-field="${f}">${value}</span>`);
    });

    return wrapEditableVariables(replaced, formData);

  };

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const currentDate = `${yyyy}-${mm}-${dd}`;

    const formattedDate = dateFormatter(
      formData.date || currentDate,
      template?.dateFormatCase || "1"
    );

    setDataForTemplate({
      eventType: formData.eventType,
      name: formData.name,
      date: formattedDate || "",
      day: formattedDate?.day || dd,
      month: formattedDate?.month || mm,
      year: formattedDate?.year || yyyy,
      time: formData.time || "",
      address: formData.address || "Type your address",
      templateId: templateId,
      image: uploadedImage || DefaultImageBgCircle.src,
    });
  }, [formData, uploadedImage, template, templateId]);


  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        if (!templateId) {
          setLoading(false);
          return;
        }
        const response = await fetch(`${BASE_URL}${GET_TEMPLATES_BY_ID}/${templateId}`);
        const result = await response.json();
        if (result.error) {
          setError(result.message || "Failed to fetch template");
        } else {
          const selectedTemplate = result?.template;
          if (selectedTemplate) {
            let { cssCode, jsCode, fontUrls } = selectedTemplate.configs;
            if (selectedTemplate.backgroundUrl) {
              cssCode = cssCode?.replace(/url\((['"]?).*?\1\)/g, `url('${selectedTemplate.backgroundUrl}')`);
            }
            const heroCropShape = selectedTemplate?.configs?.heroImageConfig?.cropShape || 'rect';
            setCropShape(heroCropShape);
            let heroAspect = (parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.width) || 4) / (parseInt(selectedTemplate?.configs?.heroImageConfig?.cropRatio?.height) || 3);
            if (heroCropShape === 'round') heroAspect = 1;
            setAspectRatio(heroAspect);

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
              image: uploadedImage ? uploadedImage : DefaultImageBgCircle.src,
            });
          } else {
            setError("Template not found");
          }
        }
      } catch (err) {
        setLoading(false);
        setError("Error fetching template: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    if (!template?.jsCode) return;

    const data = { ...dataForTemplate, ...scaledData };

    if (!data.address) data.address = "Type your address";

    const html = renderHTML(template.jsCode, data);
    setRenderedHTML(html);
  }, [dataForTemplate, scaledData, template?.jsCode]);

  const setCaretAtEnd = (el) => {
    try {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
    }
  };

  const handlePasteTrim = (e, limit) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const cur = e.target.innerText || "";
    const allowed = Math.max(0, limit - cur.length);
    const toInsert = pasted.slice(0, allowed);
    document.execCommand("insertText", false, toInsert);
  };


  useEffect(() => {
    const container = templateRef.current;
    if (!container) return;

    const onClick = (e) => {
      const editable = e.target.closest?.(".editable");
      if (!editable) return;
      const field = editable.getAttribute("data-field");
      if (!field) return;

      if (["date", "day", "month", "year"].includes(field)) {
        setShowCalendarModal(true);
        return;
      }

      if (field === "time") {
        setShowTimeModal(true);
        return;
      }


      const charLimitRaw = template?.charLimits?.[field];
      const charLimit = charLimitRaw ? parseInt(charLimitRaw, 10) : Infinity;


      editable.contentEditable = "true";
      editable.setAttribute("data-editing", "true");
      editable.classList.add("editing");

      if (!editable.innerText || editable.innerText.trim() === "") {
        editable.innerText = formData[field] || (field === "address" ? "Type your address" : "");
      }


      editable.focus();
      setCaretAtEnd(editable);


      const onKeyDown = (ev) => {
        const key = ev.key;
        const printable =
          key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey;
        const current = editable.innerText || "";
        if (printable && current.length >= charLimit) {
          const allowedControlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
            "Tab",
          ];
          if (!allowedControlKeys.includes(key)) {
            ev.preventDefault();

            setFormErrors((prev) => ({
              ...prev,
              [field]: `Character limit of ${charLimit} reached`,
            }));
            return;
          }
        } else {
          setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }

        if (key === "Enter") {
          ev.preventDefault();
          editable.blur();
        } else if (key === "Escape") {
          editable.innerText = formData[field] || "";
          editable.blur();
        }
      };

      const onInput = () => {
        let text = editable.innerText || "";
        if (text.length > charLimit) {
          const trimmed = text.slice(0, charLimit);
          editable.innerText = trimmed;
          setCaretAtEnd(editable);
        }
        setCharCounts((prev) => ({ ...prev, [field]: editable.innerText.length }));
        if (editable.innerText.length <= charLimit) {
          setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }
      };
      const onPaste = (ev) => handlePasteTrim(ev, charLimit);
      const onBlur = () => {
        let value = (editable.innerText || "").trim();
        if (!value) {
          if (field === "address") value = "Type your address";
          if (field === "name") value = "";
        }
        if (value.length > charLimit) value = value.slice(0, charLimit);
        setFormData((prev) => ({ ...prev, [field]: value }));
        setCharCounts((prev) => ({ ...prev, [field]: value.length }));
        setFormErrors((prev) => ({ ...prev, [field]: "" }));

        editable.contentEditable = "false";
        editable.removeAttribute("data-editing");
        editable.classList.remove("editing");
        editable.removeEventListener("keydown", onKeyDown);
        editable.removeEventListener("input", onInput);
        editable.removeEventListener("paste", onPaste);
        editable.removeEventListener("blur", onBlur);
      };

      editable.addEventListener("keydown", onKeyDown);
      editable.addEventListener("input", onInput);
      editable.addEventListener("paste", onPaste);
      editable.addEventListener("blur", onBlur);
    };

    container.addEventListener("click", onClick);
    return () => {
      container.removeEventListener("click", onClick);
    };
  }, [template, formData]);

  useEffect(() => {
    const updateHeight = () => {
      if (imgRef.current) {
        const height = imgRef.current.clientHeight;
        setImgHeight(height);
      }
    };

    const img = imgRef.current;
    if (img?.complete) updateHeight();
    else img?.addEventListener("load", updateHeight);

    return () => img?.removeEventListener("load", updateHeight);
  }, []);

  const handleImageLoad = () => {
    if (!imgRef.current || !template?.templateInfo) return;
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
      templateCirclePosition,
      templateCircleWidth,
      templateCircleHeight,
    } = template.templateInfo || {};

    if (!templateWidth || !templateHeight) return;

    const screenWidth = window.innerWidth;
    const ratio = (templateWidth - screenWidth) / templateWidth;
    const scaleFactor = 1 - ratio;

    const newScaledData = {
      imgHeight: scaleFactor * templateHeight,
      nameFontSize: scaleFactor * templateNameSize,
      nameLineHeight: (scaleFactor * templateNameSize + templateNamelineHeight),
      namePosition: scaleFactor * templateNamePosition,
      dateTimeFontSize: scaleFactor * templateDateTimeSize,
      dateTimeLineHeight: (scaleFactor * templateDateTimeSize + templateDatetimelineHeight),
      dateTimePosition: scaleFactor * templateDateTimePosition,
      addressFontSize: scaleFactor * templateAddressSize,
      addressLineHeight: (scaleFactor * templateAddressSize * templateAddresslineHeight),
      addressPosition: scaleFactor * templateAddressPosition,
      imgCirclePosition: scaleFactor * templateCirclePosition,
      imgCircleHeight: scaleFactor * templateCircleHeight,
      imgCircleWidth: scaleFactor * templateCircleWidth,
      dayFontSize: scaleFactor * templatedayfontSize,
      dayPosition: scaleFactor * templatedayposition,
    };
    setScaledData(newScaledData);
  };


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

        setFormData((prev) => ({
          ...prev,
          name: data.hostName || "",
          eventType: data.eventType || "",
          date: formattedDate,
          time: formattedTime,
          address: data.location || "",
          templateId: templateId,
          isHeroImage: template?.isHeroImage || false,
        }));
  if (data.imageUrl) {
       setUploadedImage(data.imageUrl);
       setOriginalImage(data.imageUrl);
     }
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
    if (eventId) fetchOrderDetails();
  }, [eventId]);
  const handleEditImage = () => {
    if (originalImage) setCropImage(originalImage);
    else alert("No original image available for editing.");
  };

  const userId = typeof window !== "undefined" ? localStorage.getItem("userID") : null;

  const handleSave = async () => {
    setSaving(true);
    setIsSaved(true);
    if (!userId) {
      alert("User not logged in or UserId missing.");
      setSaving(false);
      return;
    }

    const payload = {
      userId,
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

      const form = new FormData();
      form.append("image", file);
      form.append("userId", userId);
      try {
        const response = await fetch(`${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`, {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
          },
          body: form,
        });
        const result = await response.json();
        if (result) {
          setSaving(false);
          // router.replace(`/wonderland?id=${userId}/${eventId}/host`);
          router.replace(`/wonderland/invite?eventid=${eventId}`);

        }
      } catch (err) {
        setSaving(false);
        console.error("Upload failed:", err);
      }
    }, "image/png", 1.0);
  };

  useEffect(() => {
    const container = templateRef.current;
    if (!container) return;

    const imgEl = container.querySelector(".template-Image");
    if (!imgEl) return;

    imgEl.style.cursor = "pointer";

    const handleClick = () => {
      if (originalImage) {
        handleEditImage();
      } else {
        document.getElementById("file-upload").click();
      }
    };

    imgEl.addEventListener("click", handleClick);

    return () => imgEl.removeEventListener("click", handleClick);

  }, [renderedHTML, originalImage]);

    const fileInputRef = useRef(null);

useEffect(() => {
  const wrapper = document.getElementById("heroImage");
  const imgEl = wrapper?.querySelector(".template-image");

  if (!wrapper || !imgEl) return;

  wrapper.style.touchAction = "none";
  imgEl.style.touchAction = "none";

  let dragging = false;
  let startX = 0, startY = 0;
  let lastX = 0, lastY = 0;
  let moved = false;

  const getPos = (e) =>
    e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };

  const start = (e) => {
    const { x, y } = getPos(e);
    dragging = true;
    moved = false;
    startX = x - lastX;
    startY = y - lastY;
    imgEl.style.cursor = "grabbing";
  };

  const move = (e) => {
    if (!dragging) return;
    const { x, y } = getPos(e);
    lastX = x - startX;
    lastY = y - startY;
    imgEl.style.transform = `translate(${lastX}px, ${lastY}px)`;
    moved = true;
  };

  const end = () => {
    dragging = false;
    imgEl.style.cursor = "grab";
    setTimeout(() => (moved = false), 50);
  };

  const openUpload = (e) => {
    if (!moved) fileInputRef.current?.click();
    e.stopPropagation();
  };

  wrapper.addEventListener("mousedown", start);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);

  wrapper.addEventListener("touchstart", start, { passive: false });
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);

  wrapper.addEventListener("click", openUpload);

  return () => {
    wrapper.removeEventListener("mousedown", start);
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", end);

    wrapper.removeEventListener("touchstart", start);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);

    wrapper.removeEventListener("click", openUpload);
  };
}, [renderedHTML, uploadedImage]);


  if (loading) return <SequentialLoader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="d-flex justify-content-center">
      <div style={{ padding: "10px", width: '100%' }}>

        <div
          ref={templateRef}
          className={`template-container ${isSaved ? "saved" : ""}`}
          style={{ position: "relative" }}
        >

          <img
            ref={imgRef}
            src={`/assets/templates/${template?.bgImageName}`}
            id="bg-image"
            alt="bg"
            onLoad={handleImageLoad}
          />

          {/* Fonts */}
          {template?.fontUrls?.map((url, idx) => (
            <link key={idx} href={url} rel="stylesheet" />
          ))}

          {/* CSS */}
          {template?.cssCode && (
            <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
          )}
          {renderedHTML && (
            <div
              style={{
                position: "absolute",
                zIndex: 2,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                cursor: "text",
              }}
              dangerouslySetInnerHTML={{ __html: renderedHTML }}
            />
          )}
        </div>

     
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  id="file-upload"
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setDataForTemplate(prev => ({ ...prev, image: url }));
  }}
/>


        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CustomButton title={"Submit"} onClick={handleSave} />
        </div>

      </div>


      <CalendarModal
        show={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
        setSelectedDate={(d) => {
          setSelectedDate(d);
          setFormData(prev => ({ ...prev, date: d }));
        }}
      />

      <TimeModal
        show={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        selectedTime={selectedTime}
        setSelectedTime={(t) => {
          setSelectedTime(t);
          setFormData(prev => ({ ...prev, time: t }));
        }}
      />
      
    </div>
  );
};

export default DynamicTemplateRenderer;



