"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL, GET_TEMPLATES_BY_ID } from "@/utils/apiconstants";
import html2canvas from "html2canvas";
import "./DynamicTemplateRenderer.css";
import { dateFormatter } from "./dateTimeFormatters";
import DefaultImageBgCircle from "../../../../../public/assets/templates/DefaultImageBgCircle.png";
import CalendarModal from "@/components/wonderland/create-invite/CalendarModal";
import TimeModal from "@/components/wonderland/create-invite/TimeModal";
import CustomButton from "@/components/wonderland/common/CustomButton";
import TemplatecardSkeleton from "@/components/wonderland/TemplateSkeleton/templatecardSkeleton";

/* ---------- helpers ---------- */
const toText = (val) => (val ?? "").toString();
const escapeRegex = (value) => toText(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const wrapEditable = (html = "", formData = {}) => {
  let rendered = html.replace(/<span class="editable"[^>]*>([\s\S]*?)<\/span>/g, "$1");

  ["name", "eventType"].forEach((field) => {
    const value = toText(formData[field]);
    if (!value) return;
    rendered = rendered.replace(
      new RegExp(escapeRegex(value)),
      `<span class="editable" data-field="${field}">${value}</span>`
    );
  });

  const wrapBlock = (cls, key) =>
    rendered.replace(
      new RegExp(`<div class="${cls}"([^>]*)>([\\s\\S]*?)</div>`, "g"),
      (_m, attrs, content) =>
        `<div class="${cls}"${attrs}>
          <span class="editable" data-field="${key}">${content.trim()}</span>
        </div>`
    );

  rendered = wrapBlock("address", "address");
  rendered = wrapBlock("date", "date");
  rendered = wrapBlock("time", "time");
  return rendered;
};

const renderTemplate = (templateHtml = "", rawData = {}, formData) => {
  const withConditionals = templateHtml.replace(/{{#if (.*?)}}([\s\S]*?){{\/if}}/g, (_, key, inner) => {
    const value = rawData[key.trim()];
    if (!value) return "";
    return inner.replace(/{{(.*?)}}/g, (_, innerKey) => rawData[innerKey.trim()] || "");
  });

  let rendered = withConditionals.replace(/{{(.*?)}}/g, (_, key) => {
    try {
      return key
        .trim()
        .split(".")
        .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""), rawData) ?? "";
    } catch {
      return "";
    }
  });

  ["name", "eventType", "address", "time", "day", "month", "year"].forEach((field) => {
    const value = toText(rawData[field]);
    if (!value) return;
    rendered = rendered.replace(
      new RegExp(escapeRegex(value)),
      `<span class="editable" data-field="${field}">${value}</span>`
    );
  });

  return wrapEditable(rendered, formData);
};

const setCaretAtEnd = (node) => {
  if (!node || typeof window === "undefined") return;
  const selection = window.getSelection?.();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

/* ---------- component ---------- */
const DynamicTemplateRenderer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const templateRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const templateId = searchParams.get("templateId") || "";
  const eventId = searchParams.get("id");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userID") : null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    eventType: "",
    name: "",
    date: "",
    time: "",
    address: "",
    templateId,
  });

  const [templateMeta, setTemplateMeta] = useState(null);
  const [renderedHTML, setRenderedHTML] = useState("");
  const [scaledData, setScaledData] = useState(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [charCounts, setCharCounts] = useState({ eventType: 0, name: 0, address: 0 });
  const [formErrors, setFormErrors] = useState({ eventType: "", name: "", address: "" });
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState({ calendar: false, time: false });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [heroTransform, setHeroTransform] = useState({ x: 0, y: 0, scale: 1 });
  const templatePayload = useMemo(() => {
    const today = new Date();
    const fallback = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

    const formatted = dateFormatter(formData.date || fallback, templateMeta?.dateFormatCase || "1");

    return {
      eventType: formData.eventType,
      name: formData.name,
      date: formatted || "",
      day: formatted?.day || fallback.slice(-2),
      month: formatted?.month || fallback.slice(5, 7),
      year: formatted?.year || fallback.slice(0, 4),
      time: formData.time || "",
      address: formData.address || "Type your address",
      templateId,
      image: uploadedImage || originalImage || DefaultImageBgCircle.src,
    };
  }, [formData, templateMeta?.dateFormatCase, templateId, uploadedImage, originalImage]);

  /* --- enforce char limits on pre-filled data --- */
  useEffect(() => {
    if (!templateMeta?.charLimits) return;

    const fields = ["eventType", "name", "address"];
    const updates = {};
    const nextCounts = {};
    let needsUpdate = false;

    fields.forEach((field) => {
      const limit = parseInt(templateMeta.charLimits[field], 10);
      const value = formData[field] || "";
      if (Number.isFinite(limit) && limit > 0 && value.length > limit) {
        const trimmed = value.slice(0, limit);
        updates[field] = trimmed;
        nextCounts[field] = trimmed.length;
        needsUpdate = true;
      } else {
        nextCounts[field] = value.length;
      }
    });

    if (needsUpdate) {
      setFormData((prev) => ({ ...prev, ...updates }));
    }

    setCharCounts((prev) => {
      if (
        prev.eventType === nextCounts.eventType &&
        prev.name === nextCounts.name &&
        prev.address === nextCounts.address
      ) {
        return prev;
      }
      return { ...prev, ...nextCounts };
    });
  }, [formData.eventType, formData.name, formData.address, templateMeta?.charLimits]);

  /* --- fetch template --- */
  useEffect(() => {
    let active = true;
    const fetchTemplate = async () => {
      if (!templateId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}${GET_TEMPLATES_BY_ID}/${templateId}`);
        const { template, error: apiError, message } = await res.json();
        if (!active) return;
        if (apiError || !template) {
          setError(message || "Failed to fetch template");
          return;
        }

        let { cssCode, jsCode, fontUrls } = template.configs;
        if (template.backgroundUrl) {
          cssCode = cssCode?.replace(/url\((['"]?).*?\1\)/g, `url('${template.backgroundUrl}')`);
        }

        const heroConfig = template.configs?.heroImageConfig || {};
        const cropShape = heroConfig.cropShape === "round" ? "round" : "rect";
        const ratioW = parseInt(heroConfig?.cropRatio?.width, 10) || 4;
        const ratioH = parseInt(heroConfig?.cropRatio?.height, 10) || 3;

        setTemplateMeta({
          cssCode: cssCode || "",
          jsCode: jsCode || "",
          fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
          bgImageName: template.configs?.bgImageName || "",
          charLimits: template.configs?.charLimits || {},
          dateFormatCase: template.configs?.dateFormatCase || "1",
          templateInfo: template.configs?.templateinfo || {},
          cropShape,
          aspectRatio: cropShape === "round" ? 1 : ratioW / ratioH,
        });
      } catch (err) {
        if (active) setError(`Error fetching template: ${err.message}`);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTemplate();
    return () => {
      active = false;
    };
  }, [templateId]);

  /* --- fetch order details --- */
  useEffect(() => {
    if (!eventId) return;
    let active = true;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/customer/event/event-invites/${eventId}`, {
          headers: { "Content-Type": "application/json", Authorization: token || "" },
        });
        const { data } = await res.json();
        if (!active || res.status !== 200 || !data) return;

        const formattedDate = data.eventDate ? new Date(data.eventDate).toISOString().split("T")[0] : "";
        const formattedTime = data.eventTime ? data.eventTime.slice(0, 5) : "";

        setFormData((prev) => ({
          ...prev,
          name: data.hostName || "",
          eventType: data.eventType || "",
          date: formattedDate,
          time: formattedTime,
          address: data.location || "",
        }));
        setCharCounts({
          eventType: data.eventType?.length || 0,
          name: data.hostName?.length || 0,
          address: data.location?.length || 0,
        });
        if (data.imageUrl) {
          setUploadedImage(data.imageUrl);
          setOriginalImage(data.imageUrl);
        }
      } catch (err) {
        console.error("Fetch order failed:", err);
      }
    };

    fetchOrder();
    return () => {
      active = false;
    };
  }, [eventId, token]);

  /* --- render template html --- */
  useEffect(() => {
    if (!templateMeta?.jsCode) return;
    const merged = { ...templatePayload, ...scaledData };
    if (!merged.address) merged.address = "Type your address";
    setRenderedHTML(renderTemplate(templateMeta.jsCode, merged, formData));
  }, [templateMeta?.jsCode, templatePayload, scaledData, formData]);

  /* --- scale template metrics on image load --- */
  const handleImageLoad = useCallback(() => {
    if (!imgRef.current || !templateMeta?.templateInfo) return;
    const info = templateMeta.templateInfo;
    if (!info.templateWidth || !info.templateHeight) return;

    const ratio = (info.templateWidth - window.innerWidth) / info.templateWidth;
    const scale = 1 - ratio;

    setScaledData({
      imgHeight: scale * info.templateHeight,
      nameFontSize: scale * info.templateNameSize,
      nameLineHeight: scale * info.templateNameSize + info.templateNamelineHeight,
      namePosition: scale * info.templateNamePosition,
      dateTimeFontSize: scale * info.templateDateTimeSize,
      dateTimeLineHeight: scale * info.templateDateTimeSize + info.templateDatetimelineHeight,
      dateTimePosition: scale * info.templateDateTimePosition,
      addressFontSize: scale * info.templateAddressSize,
      addressLineHeight: scale * info.templateAddressSize * info.templateAddresslineHeight,
      addressPosition: scale * info.templateAddressPosition,
      imgCirclePosition: scale * info.templateCirclePosition,
      imgCircleHeight: scale * info.templateCircleHeight,
      imgCircleWidth: scale * info.templateCircleWidth,
      dayFontSize: scale * info.templatedayfontSize,
      dayPosition: scale * info.templatedayposition,
    });
  }, [templateMeta?.templateInfo]);

  /* --- editable clicks --- */
  // const handleEditableClick = useCallback(
  //   (field, node) => {
  //     const charLimit = parseInt(templateMeta?.charLimits?.[field], 10) || Infinity;
  //     node.contentEditable = "true";
  //     node.dataset.editing = "true";
  //     node.classList.add("editing");
  //     node.innerText = node.innerText?.trim()
  //       ? node.innerText
  //       : formData[field] || (field === "address" ? "Type your address" : "");
  //     node.focus();

  //     const onKeyDown = (ev) => {
  //       const printable = ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey;
  //       if (printable && node.innerText.length >= charLimit) {
  //         const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Tab"];
  //         if (!allowed.includes(ev.key)) {
  //           ev.preventDefault();
  //           setFormErrors((prev) => ({ ...prev, [field]: `Character limit of ${charLimit} reached` }));
  //           return;
  //         }
  //       } else {
  //         setFormErrors((prev) => ({ ...prev, [field]: "" }));
  //       }
  //       if (ev.key === "Enter") {
  //         ev.preventDefault();
  //         node.blur();
  //       }
  //       if (ev.key === "Escape") {
  //         node.innerText = formData[field] || "";
  //         node.blur();
  //       }
  //     };

  //     const onInput = () => {
  //       if (node.innerText.length > charLimit) {
  //         node.innerText = node.innerText.slice(0, charLimit);
  //       }
  //       setCharCounts((prev) => ({ ...prev, [field]: node.innerText.length }));
  //       if (node.innerText.length <= charLimit) {
  //         setFormErrors((prev) => ({ ...prev, [field]: "" }));
  //       }
  //     };

  //     const onPaste = (ev) => {
  //       ev.preventDefault();
  //       const pasted = (ev.clipboardData || window.clipboardData).getData("text");
  //       const allowed = Math.max(0, charLimit - node.innerText.length);
  //       document.execCommand("insertText", false, pasted.slice(0, allowed));
  //     };

  //     const onBlur = () => {
  //       let value = node.innerText.trim();
  //       if (!value && field === "address") value = "Type your address";
  //       if (value.length > charLimit) value = value.slice(0, charLimit);
  //       setFormData((prev) => ({ ...prev, [field]: value }));
  //       setCharCounts((prev) => ({ ...prev, [field]: value.length }));
  //       setFormErrors((prev) => ({ ...prev, [field]: "" }));
  //       node.contentEditable = "false";
  //       node.removeAttribute("data-editing");
  //       node.classList.remove("editing");
  //       node.removeEventListener("keydown", onKeyDown);
  //       node.removeEventListener("input", onInput);
  //       node.removeEventListener("paste", onPaste);
  //       node.removeEventListener("blur", onBlur);
  //     };

  //     node.addEventListener("keydown", onKeyDown);
  //     node.addEventListener("input", onInput);
  //     node.addEventListener("paste", onPaste);
  //     node.addEventListener("blur", onBlur);
  //   },
  //   [formData, templateMeta?.charLimits]
  // );
  const handleEditableClick = useCallback(
    (field, node) => {
      const charLimit = parseInt(templateMeta?.charLimits?.[field], 10) || Infinity;
      node.contentEditable = "true";
      node.dataset.editing = "true";
      node.classList.add("editing");
  
      const isEmpty = !node.innerText?.trim();
      if (isEmpty) {
        node.innerText = formData[field] || (field === "address" ? "Type your address" : "");
        setCaretAtEnd(node); // sirf tab call karo jab humne text set kiya
      }
  
      node.focus();
  
      const onKeyDown = (ev) => {
        const printable = ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey;
        if (printable && node.innerText.length >= charLimit) {
          const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Tab"];
          if (!allowed.includes(ev.key)) {
            ev.preventDefault();
            setFormErrors((prev) => ({ ...prev, [field]: `Character limit of ${charLimit} reached` }));
            return;
          }
        } else {
          setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }
  
        if (ev.key === "Enter") {
          ev.preventDefault();
          node.blur();
        } else if (ev.key === "Escape") {
          node.innerText = formData[field] || "";
          node.blur();
        }
      };
  
      const onInput = () => {
        if (node.innerText.length > charLimit) {
          node.innerText = node.innerText.slice(0, charLimit);
          setCaretAtEnd(node);
        }
        setCharCounts((prev) => ({ ...prev, [field]: node.innerText.length }));
        if (node.innerText.length <= charLimit) {
          setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }
      };
  
      const onPaste = (ev) => {
        ev.preventDefault();
        const pasted = (ev.clipboardData || window.clipboardData).getData("text");
        const allowed = Math.max(0, charLimit - node.innerText.length);
        document.execCommand("insertText", false, pasted.slice(0, allowed));
      };
  
      const onBlur = () => {
        let value = node.innerText.trim();
        if (!value && field === "address") value = "Type your address";
        if (value.length > charLimit) value = value.slice(0, charLimit);
        setFormData((prev) => ({ ...prev, [field]: value }));
        setCharCounts((prev) => ({ ...prev, [field]: value.length }));
        setFormErrors((prev) => ({ ...prev, [field]: "" }));
        node.contentEditable = "false";
        node.removeAttribute("data-editing");
        node.classList.remove("editing");
        node.removeEventListener("keydown", onKeyDown);
        node.removeEventListener("input", onInput);
        node.removeEventListener("paste", onPaste);
        node.removeEventListener("blur", onBlur);
      };
  
      node.addEventListener("keydown", onKeyDown);
      node.addEventListener("input", onInput);
      node.addEventListener("paste", onPaste);
      node.addEventListener("blur", onBlur);
    },
    [formData, templateMeta?.charLimits]
  );
  useEffect(() => {
    const container = templateRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const editable = e.target.closest?.(".editable");
      if (!editable) return;
      const field = editable.dataset.field;
      if (!field) return;

      if (["date", "day", "month", "year"].includes(field)) {
        setModal((prev) => ({ ...prev, calendar: true }));
        return;
      }
      if (field === "time") {
        setModal((prev) => ({ ...prev, time: true }));
        return;
      }
      handleEditableClick(field, editable);
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [handleEditableClick]);

  /* --- hero image drag/open upload --- */
  useEffect(() => {
    const wrapper = document.getElementById("heroImage");
    const imgEl = wrapper?.querySelector(".template-image");
    if (!wrapper || !imgEl) return;

    wrapper.style.touchAction = "none";
    imgEl.style.touchAction = "none";

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let moved = false;

    const getPos = (e) =>
      e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

    const start = (e) => {
      const { x, y } = getPos(e);
      dragging = true;
      moved = false;
      startX = x - offsetX;
      startY = y - offsetY;
      imgEl.style.cursor = "grabbing";
    };
    const applyTransform = () => {
      imgEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${heroTransform.scale})`;
    };
    
    const move = (e) => {
      if (!dragging) return;
      const { x, y } = getPos(e);
      offsetX = x - startX;
      offsetY = y - startY;
      imgEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      moved = true;
    };

    const end = () => {
      dragging = false;
      imgEl.style.cursor = "grab";
      setTimeout(() => (moved = false), 50);
    };
    const clampScale = (value) => Math.min(3, Math.max(0.5, value));

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      heroTransform.scale = clampScale(heroTransform.scale + delta);
      setHeroTransform((prev) => ({ ...prev, scale: heroTransform.scale }));
      applyTransform();
    };
    
    const onGesture = (e) => {
      if (e.scale === undefined) return;
      heroTransform.scale = clampScale(e.scale);
      setHeroTransform((prev) => ({ ...prev, scale: heroTransform.scale }));
      applyTransform();
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
    wrapper.addEventListener("wheel", onWheel, { passive: false });
wrapper.addEventListener("gesturechange", onGesture);
    return () => {
      wrapper.removeEventListener("mousedown", start);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      wrapper.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      wrapper.removeEventListener("click", openUpload);
      wrapper.removeEventListener("wheel", onWheel);
wrapper.removeEventListener("gesturechange", onGesture);
    };
  }, [renderedHTML]);

  /* --- save + download --- */
  const handleDownload = async () => {
    const canvas = await html2canvas(templateRef.current, { backgroundColor: null, useCORS: true });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `invite_${templateMeta?.bgImageName}`, {
        type: "image/png",
        lastModified: Date.now(),
      });
      const form = new FormData();
      form.append("image", file);
      form.append("userId", userId);

      try {
        await fetch(`${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`, {
          method: "PUT",
          headers: { Authorization: token || "" },
          body: form,
        });
        router.replace(`/wonderland/invite?eventid=${eventId}`);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setSaving(false);
      }
    }, "image/png", 1.0);
  };

  const handleSave = async () => {
    if (!userId) {
      alert("User not logged in or UserId missing.");
      return;
    }
    setSaving(true);
    setIsSaved(true);

    try {
      const res = await fetch(`${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          userId,
          eventType: formData.eventType,
          hostName: formData.name,
          eventDate: formData.date ? new Date(formData.date).toISOString() : "",
          eventTime: formData.time || "",
          location: formData.address,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Unknown error");
      }

      await handleDownload();
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
      setSaving(false);
      setIsSaved(false);
    }
  };

  if (loading) return <div style={{padding:"10px"}}><TemplatecardSkeleton /></div>;

  return (
    <div className="d-flex justify-content-center">
      <div style={{ padding: "10px", width: "100%" }}>
        <div ref={templateRef} className={`template-container ${isSaved ? "saved" : ""}`} style={{ position: "relative" }}>
          <img
            ref={imgRef}
            src={`/assets/templates/${templateMeta?.bgImageName}`}
            id="bg-image"
            alt="bg"
            onLoad={handleImageLoad}
          />

          {templateMeta?.fontUrls?.map((url, idx) => (
            <link key={idx} href={url} rel="stylesheet" />
          ))}

          {templateMeta?.cssCode && <style dangerouslySetInnerHTML={{ __html: templateMeta.cssCode }} />}

          {renderedHTML && (
            <div
              style={{ position: "absolute", zIndex: 2, top: 0, left: 0, right: 0, bottom: 0, cursor: "text" }}
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
            setOriginalImage(url);
          }}
        />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CustomButton title={saving ? "Saving..." : "Submit"} onClick={saving ? undefined : handleSave} disabled={saving} />
        </div>
      </div>

      <CalendarModal
        show={modal.calendar}
        onClose={() => setModal((prev) => ({ ...prev, calendar: false }))}
        selectedDate={selectedDate}
        setSelectedDate={(d) => {
          setSelectedDate(d);
          setFormData((prev) => ({ ...prev, date: d }));
        }}
      />

      <TimeModal
        show={modal.time}
        onClose={() => setModal((prev) => ({ ...prev, time: false }))}
        selectedTime={selectedTime}
        setSelectedTime={(t) => {
          setSelectedTime(t);
          setFormData((prev) => ({ ...prev, time: t }));
        }}
      />
    </div>
  );
};

export default DynamicTemplateRenderer;