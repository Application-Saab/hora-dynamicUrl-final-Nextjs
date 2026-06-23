"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL, BG_REMOVER_URL, GET_TEMPLATES_BY_ID } from "@/utils/apiconstants";
import "./DynamicTemplateRenderer.css";
import { dateFormatter } from "../../../../utils/dateTimeFormatters";
import DefaultImageBgCircle from "../../../../../public/assets/templates/DefaultImageBgCircle.png";
import CalendarModal from "@/components/wonderland/create-invite/CalendarModal";
import TimeModal from "@/components/wonderland/create-invite/TimeModal";
import CustomButton from "@/components/wonderland/common/CustomButton";
import TemplatecardSkeleton from "@/components/wonderland/TemplateSkeleton/templatecardSkeleton";
import { applyCase } from "@/components/wonderland/fontsizeformat";
import { captureElementAsImage } from "@/utils/captureElementAsImage";
import { useHeroImageTransform } from "@/hooks/useHeroImageTransform";
import ErrorPopup from "@/components/common/ErrorPopup";
import { getCurrentTimeAMPM, formatToAMPM } from "@/utils/timeFormatters";
import { saveTemplate } from "@/utils/indexedDB";
import axios from "axios";

import AlertIcon from "@/assets/wonderland/AlertIcon.svg";

const TEMPLATE_ASSETS_BASE =
  "https://horaservices.com/api/template-assets/templates";

// ─── Image cache ───────────────────────────────────────────────────────────────
const imageCache = new Map();

// ─── FIX: Preload image immediately using just templateId (before API response)
// bgImageName pattern: templateId + some extension — we try to resolve from cache first
// OR we build the URL as soon as API gives bgImageName
const prefetchBgImage = (bgImageName, cacheKey) => {
  if (!bgImageName) return;
  if (imageCache.has(cacheKey)) return;
  const url = `${TEMPLATE_ASSETS_BASE}/${bgImageName}`;
  imageCache.set(cacheKey, url);
  const img = new window.Image();
  img.fetchPriority = "high";
  img.src = url;
};

const toText = (val) => (val ?? "").toString();
const escapeRegex = (value) =>
  toText(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const wrapEditable = (html = "", formData = {}) => {
  let rendered = html.replace(
    /<span class="editable"[^>]*>([\s\S]*?)<\/span>/g,
    "$1",
  );

  ["name", "eventType", "name2"].forEach((field) => {
    const value = toText(formData[field]);
    if (!value) return;
    rendered = rendered.replace(
      new RegExp(escapeRegex(value)),
      `<span class="editable" data-field="${field}">${value}</span>`,
    );
  });

  const wrapBlock = (cls, key) =>
    rendered.replace(
      new RegExp(`<div class="${cls}"([^>]*)>([\\s\\S]*?)</div>`, "g"),
      (_m, attrs, content) =>
        `<div class="${cls}"${attrs}>
          <span class="editable" data-field="${key}">${content.trim()}</span>
        </div>`,
    );

  rendered = wrapBlock("address", "address");
  rendered = wrapBlock("date", "date");
  rendered = wrapBlock("time", "time");
  return rendered;
};

const renderTemplate = (templateHtml = "", rawData = {}, formData) => {
  const withConditionals = templateHtml.replace(
    /{{#if (.*?)}}([\s\S]*?){{\/if}}/g,
    (_, key, inner) => {
      const value = rawData[key.trim()];
      if (!value) return "";
      return inner.replace(
        /{{(.*?)}}/g,
        (_, innerKey) => rawData[innerKey.trim()] || "",
      );
    },
  );

  let rendered = withConditionals.replace(/{{(.*?)}}/g, (_, key) => {
    try {
      return (
        key
          .trim()
          .split(".")
          .reduce(
            (acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""),
            rawData,
          ) ?? ""
      );
    } catch {
      return "";
    }
  });

  ["name", "name2", "eventType", "address", "time", "day", "month", "year"].forEach(
    (field) => {
      const value = toText(rawData[field]);
      if (!value) return;
      rendered = rendered.replace(
        new RegExp(escapeRegex(value)),
        `<span class="editable" data-field="${field}">${value}</span>`,
      );
    },
  );

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

  const loadUserId = () =>
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const loadToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const userId = loadUserId();
  const token = loadToken();

  const [templateLoading, setTemplateLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imgBlurred, setImgBlurred] = useState(true);

  const loading = templateLoading || !imageLoaded;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  const [formData, setFormData] = useState({
    eventType: "",
    name: "",
    name2: "",
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
  const [charCounts, setCharCounts] = useState({
    eventType: 0,
    name: 0,
    name2: 0,
    address: 0,
  });
  const [formErrors, setFormErrors] = useState({
    eventType: "",
    name: "",
    name2: "",
    address: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState({ calendar: false, time: false });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [heroTransform, setHeroTransform] = useState({ x: 0, y: 0, scale: 1 });

  const templatePayload = useMemo(() => {
    const today = new Date();
    const fallback = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`;

    const formatted = dateFormatter(
      formData.date || fallback,
      templateMeta?.dateFormatCase || "1",
    );

    const finalTime = formData.time?.trim()
      ? formData.time
      : getCurrentTimeAMPM();

    return {
      eventType: formData.eventType,
      name: applyCase(formData.name || "", templateMeta?.nameCase),
      name2: applyCase(formData.name2 || "", templateMeta?.name2Case),
      date: applyCase(
        formatted?.full || "",
        templateMeta?.dateCase || "default",
      ),
      day: formatted?.day || "",
      month: applyCase(
        formatted?.month || "",
        templateMeta?.monthCase || "default",
      ),
      year: formatted?.year || "",
      time: finalTime,
      borderColor: templateMeta?.borderColor,
      address: applyCase(formData.address || "", templateMeta?.addressCase),
      templateId,
      image: uploadedImage || originalImage || DefaultImageBgCircle.src,
    };
  }, [
    formData,
    templateMeta?.dateFormatCase,
    templateId,
    uploadedImage,
    originalImage,
    templateMeta?.nameCase,
    templateMeta?.name2Case,
    templateMeta?.addressCase,
    templateMeta?.monthCase,
  ]);

  /* --- enforce char limits on pre-filled data --- */
  useEffect(() => {
    if (!templateMeta?.charLimits) return;

    const fields = ["eventType", "name", "name2", "address"];
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
        prev.name2 === nextCounts.name2 &&
        prev.address === nextCounts.address
      ) {
        return prev;
      }
      return { ...prev, ...nextCounts };
    });
  }, [
    formData.eventType,
    formData.name,
    formData.name2,
    formData.address,
    templateMeta?.charLimits,
  ]);

  /* --- fetch template --- */
  useEffect(() => {
    let active = true;
    const fetchTemplate = async () => {
      if (!templateId) {
        setTemplateLoading(false);
        return;
      }
      try {
        // ✅ FIX: Set imageSrc IMMEDIATELY from cache if available (before API call)
        const cachedSrc = imageCache.get(`bg_${templateId}`);
        if (cachedSrc) {
          setImageSrc(cachedSrc);
        }

        const res = await fetch(
          `${BASE_URL}${GET_TEMPLATES_BY_ID}/${templateId}`,
        );
        const { template, error: apiError, message } = await res.json();

        if (!active) return;
        if (apiError || !template) {
          setError(message || "Failed to fetch template");
          return;
        }

        let { cssCode, jsCode, fontUrls } = template.configs;
        if (template.backgroundUrl) {
          cssCode = cssCode?.replace(
            /url\((['"]?).*?\1\)/g,
            `url('${template.backgroundUrl}')`,
          );
        }

        const heroConfig = template.configs?.heroImageConfig || {};
        const cropShape = heroConfig.cropShape === "round" ? "round" : "rect";
        const ratioW = parseInt(heroConfig?.cropRatio?.width, 10) || 4;
        const ratioH = parseInt(heroConfig?.cropRatio?.height, 10) || 3;

        const bgImageName = template.configs?.bgImageName || "";

        // ✅ FIX: Inject preload link immediately
        if (bgImageName && typeof document !== "undefined") {
          const existingPreload = document.head.querySelector(
            `link[rel="preload"][href*="${bgImageName}"]`
          );
          if (!existingPreload) {
            const preloadLink = document.createElement("link");
            preloadLink.rel = "preload";
            preloadLink.as = "image";
            preloadLink.href = `${TEMPLATE_ASSETS_BASE}/${bgImageName}`;
            preloadLink.setAttribute("fetchpriority", "high");
            document.head.appendChild(preloadLink);
          }
        }

        // ✅ FIX: Set imageSrc immediately (only if not already set from cache)
        const src = `${TEMPLATE_ASSETS_BASE}/${bgImageName}`;
        if (!cachedSrc) {
          setImageSrc(src);
        }

        // Prefetch into module cache for repeat visits
        prefetchBgImage(bgImageName, `bg_${templateId}`);

        setTemplateMeta({
          cssCode: cssCode || "",
          jsCode: jsCode || "",
          fontUrls: fontUrls ? JSON.parse(fontUrls) : [],
          bgImageName,
          charLimits: template.configs?.charLimits || {},
          dateFormatCase: template.configs?.dateFormatCase || "1",
          templateInfo: template.configs?.templateinfo || {},
          cropShape,
          nameCase: template.configs?.nameCase || "default",
          addressCase: template.configs?.addressCase || "default",
          monthCase: template.configs?.monthCase || "default",
          aspectRatio: cropShape === "round" ? 1 : ratioW / ratioH,
          borderColor: template.configs?.borderColor,
          isBgRemove: template.configs?.isBgRemove || false,
          name2Case: template.configs?.name2Case || "default",
          name2Size: template.configs?.templateinfo?.templateName2Size,
          name2Position: template.configs?.templateinfo?.templateName2Position,
        });
      } catch (err) {
        if (active) setError(`Error fetching template: ${err.message}`);
      } finally {
        if (active) setTemplateLoading(false);
      }
    };

    fetchTemplate();
    return () => {
      active = false;
    };
  }, [templateId]);

  /* --- fetch existing event data --- */
  useEffect(() => {
    if (!eventId) return;
    let active = true;
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token || "",
            },
          },
        );
        const { data } = await res.json();
        if (!active || res.status !== 200 || !data) return;

        const formattedDate = data.eventDate
          ? new Date(data.eventDate).toISOString().split("T")[0]
          : "";
        const formattedTime = data.eventTime
          ? formatToAMPM(data.eventTime)
          : "";

        setFormData((prev) => ({
          ...prev,
          name: applyCase(
            data.names?.one || data.hostName || "",
            templateMeta?.nameCase,
          ),
          name2: applyCase(
            data.names?.two || "",
            templateMeta?.name2Case,
          ),
          eventType: applyCase(
            data.eventType || "",
            templateMeta?.eventTypeCase,
          ),
          address: applyCase(data.location || "", templateMeta?.addressCase),
          date: formattedDate,
          time: formattedTime,
        }));

        setCharCounts({
          eventType: data.eventType?.length || 0,
          name: data.names?.one?.length || data.hostName?.length || 0,
          name2: data.names?.two?.length || 0,
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
  }, [eventId, token, templateMeta?.nameCase, templateMeta?.name2Case, templateMeta?.addressCase]);
  // ✅ FIX: Added templateMeta dependencies so applyCase runs with correct case config

  /* --- render HTML --- */
  useEffect(() => {
    if (!templateMeta?.jsCode) return;

    const payloadWithPlaceholder = {
      ...templatePayload,
      ...scaledData,
      name: formData.name || "Type your name",
      address: formData.address || "Type your address",
      name2: formData.name2 || "Type your name 2",
    };

    setRenderedHTML(
      renderTemplate(templateMeta.jsCode, payloadWithPlaceholder, formData),
    );
  }, [templateMeta?.jsCode, templatePayload, scaledData, formData]);

  const handleImageLoad = useCallback(() => {
    if (!imgRef.current || !templateMeta?.templateInfo) return;
    const info = templateMeta.templateInfo;
    if (!info.templateWidth || !info.templateHeight) return;

    const effectiveWidth = Math.min(window.innerWidth, 480);
    const scale = effectiveWidth / info.templateWidth;

    setScaledData({
      imgHeight: scale * info.templateHeight,
      // ✅ FIX: removed duplicate nameFontSize key (was declared twice)
      nameFontSize: scale * info.templateNameSize,
      nameLineHeight:
        scale * info.templateNameSize + info.templateNamelineHeight,
      namePosition: scale * info.templateNamePosition,
      dateTimeFontSize: scale * info.templateDateTimeSize,
      dateTimeLineHeight:
        scale * info.templateDateTimeSize + info.templateDatetimelineHeight,
      dateTimePosition: scale * info.templateDateTimePosition,
      addressFontSize: scale * info.templateAddressSize,
      addressLineHeight:
        scale * info.templateAddressSize * info.templateAddresslineHeight,
      addressPosition: scale * info.templateAddressPosition,
      imgCirclePosition: scale * info.templateCirclePosition,
      imgCircleHeight: scale * info.templateCircleHeight,
      imgCircleWidth: scale * info.templateCircleWidth,
      dayFontSize: scale * info.templatedayfontSize,
      dayPosition: scale * info.templatedayposition,
      // ✅ nameFontSize only once (above), name2 separately
      name2FontSize: scale * (info.templateName2Size || info.templateNameSize),
      name2Position: scale * (info.templateName2Position || info.templateNamePosition),
    });

    setImgBlurred(false);
    setImageLoaded(true);
  }, [templateMeta?.templateInfo]);

  const PLACEHOLDERS = {
    name: "Type your name",
    address: "Type your address",
    name2: "Type your name 2",
  };

  const handleEditableClick = useCallback(
    (field, node) => {
      const charLimit =
        parseInt(templateMeta?.charLimits?.[field], 10) || Infinity;
      node.contentEditable = "true";
      node.dataset.editing = "true";
      node.classList.add("editing");

      const placeholder = PLACEHOLDERS[field] || "";
      const isPlaceholder = node.innerText.trim() === placeholder;
      const isEmpty = !node.innerText.trim();

      if (isEmpty || isPlaceholder) {
        node.innerText = "";
        setCaretAtEnd(node);
      }

      node.focus();

      const onKeyDown = (ev) => {
        const printable =
          ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey;
        if (printable && node.innerText.length >= charLimit) {
          const allowed = [
            "Backspace", "Delete", "ArrowLeft", "ArrowRight",
            "ArrowUp", "ArrowDown", "Home", "End", "Tab",
          ];
          if (!allowed.includes(ev.key)) {
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

        if (ev.key === "Enter") {
          ev.preventDefault();
          node.blur();
        } else if (ev.key === "Escape") {
          node.innerText = formData[field] || "";
          node.blur();
        }
      };

      const onInput = (ev) => {
        const el = ev.target;
        const field = el.getAttribute("data-field");
        let text = el.innerText;

        if (text.length > charLimit) {
          const trimmed = text.slice(0, charLimit);
          const caret = saveCaretPosition(el);
          el.innerText = trimmed;
          restoreCaretPosition(el, caret);
          return;
        }

        if (field !== "time") {
          const caseKey = field === "name2" ? "name2Case" : `${field}Case`;
          const formattedValue = applyCase(text, templateMeta?.[caseKey]);
          if (formattedValue !== text) {
            const caret = saveCaretPosition(el);
            el.innerText = formattedValue;
            restoreCaretPosition(el, caret);
          }
        }

        setCharCounts((prev) => ({ ...prev, [field]: el.innerText.length }));
      };

      const onPaste = (ev) => {
        ev.preventDefault();
        const pasted = (ev.clipboardData || window.clipboardData).getData("text");
        const allowed = Math.max(0, charLimit - node.innerText.length);
        document.execCommand("insertText", false, pasted.slice(0, allowed));
      };

      const onBlur = (ev) => {
        const el = ev.target;
        let value = el.innerText.trim();

        if (field === "time") {
          if (!value) {
            value = new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        } else {
          if (value.length > charLimit) value = value.slice(0, charLimit);
        }

        setFormData((prev) => ({ ...prev, [field]: value }));

        el.contentEditable = "false";
        el.removeAttribute("data-editing");
        el.classList.remove("editing");

        el.removeEventListener("keydown", onKeyDown);
        el.removeEventListener("input", onInput);
        el.removeEventListener("paste", onPaste);
        el.removeEventListener("blur", onBlur);
      };

      node.addEventListener("keydown", onKeyDown);
      node.addEventListener("input", onInput);
      node.addEventListener("paste", onPaste);
      node.addEventListener("blur", onBlur);
    },
    [formData, templateMeta?.charLimits, templateMeta?.name2Case],
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

  useHeroImageTransform(heroTransform, setHeroTransform, fileInputRef, [
    renderedHTML,
  ]);

  const handleDownload = async () => {
    if (!templateRef.current) return;

    setSaving(true);

    const blob = await captureElementAsImage(templateRef.current, [
      ".hide-in-download",
    ]);

    if (!blob) {
      setSaving(false);
      return;
    }

    const file = new File(
      [blob],
      `invite_${templateMeta?.bgImageName || "image"}.png`,
      { type: "image/png", lastModified: Date.now() },
    );

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await saveTemplate(`template_${eventId}`, reader.result);
        router.replace(`/wonderlandinternational/invite?eventid=${eventId}`);
      } catch (err) {
        console.error("Failed to save template in IndexedDB:", err);
      }
    };
    reader.readAsDataURL(blob);

    const form = new FormData();
    form.append("image", file);
    form.append("userId", userId);

    try {
      await fetch(
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
        {
          method: "PUT",
          headers: { Authorization: token || "" },
          body: form,
        },
      );
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      setErrorModal({ open: true, message: "User not logged in or UserId missing." });
      return;
    }
    const errors = [];

    if (!formData.name?.trim() || formData.name === "Type your name") {
      errors.push("Name is required");
    }

    const addressExistsInTemplate =
      renderedHTML.includes("address") ||
      renderedHTML.includes("{{address}}") ||
      renderedHTML.includes("Type your address");

    if (addressExistsInTemplate) {
      if (!formData.address?.trim() || formData.address === "Type your address") {
        errors.push("Address is required");
      }
    }

    if (errors.length > 0) {
      setErrorModal({ open: true, message: errors.join("\n") });
      return;
    }

    setSaving(true);
    setIsSaved(true);
    document.body.classList.add("saved-mode");

    const finalDate = formData.date
      ? new Date(formData.date).toISOString()
      : new Date().toISOString();

    const finalTime = formData.time
      ? formatToAMPM(formData.time)
      : formatToAMPM(new Date().toLocaleTimeString());

    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventId || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({
            userId,
            eventType: formData.eventType,
            names: {
              one: formData.name,
              two: formData.name2,
            },
            eventDate: finalDate,
            eventTime: finalTime,
            location: formData.address,
          }),
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Unknown error");
      }

      await handleDownload();
    } catch (err) {
      setErrorModal({ open: true, message: err.message || "Something went wrong" });
      setSaving(false);
      setIsSaved(false);
      document.body.classList.remove("saved-mode");
    } finally {
      document.body.classList.remove("saved-mode");
    }
  };

  const saveCaretPosition = (el) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return 0;
    const range = selection.getRangeAt(0);
    return range.startOffset;
  };

  const restoreCaretPosition = (el, offset) => {
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      let node = el;
      if (el.childNodes.length > 0) {
        node = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE) || el;
      }
      const textLength = node.textContent?.length ?? 0;
      const safeOffset = Math.min(offset, textLength);
      range.setStart(node, safeOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (err) {
      console.warn("restoreCaretPosition failed on device:", err);
    }
  };

  useEffect(() => {
    if (!templateMeta?.borderColor) return;
    document.documentElement.style.setProperty(
      "--borderColor",
      templateMeta.borderColor,
    );
  }, [templateMeta?.borderColor]);

  const handleBackgroundRemoval = async (file) => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await axios.post(`${BG_REMOVER_URL}`, formDataObj, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setUploadedImage(imageUrl);
      setOriginalImage(imageUrl);
    } catch (error) {
      console.error("Background removal error:", error);
      alert("Error connecting to server. Make sure your Python backend is running on port 8000.");
    }
  };

  const handleImageUploadClick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (templateMeta?.isBgRemove) {
      await handleBackgroundRemoval(file);
    } else {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setOriginalImage(url);
    }
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{ maxWidth: "480px", margin: "0 auto" }}
    >
      <div style={{ padding: "8px", maxWidth: "480px", width: "100%" }}>
        {loading && (
          <div style={{ padding: "8px" }}>
            <TemplatecardSkeleton />
          </div>
        )}

        <div
          ref={templateRef}
          className="template-container"
          style={{
            position: "relative",
            opacity: loading ? 0 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="bg"
              fetchPriority="high"
              decoding="async"
              loading="eager"
              onLoad={handleImageLoad}
              onError={() => {
                setImgBlurred(false);
                setImageLoaded(true);
              }}
              style={{
                width: "100%",
                display: "block",
                filter: imgBlurred ? "blur(12px)" : "none",
                transform: imgBlurred ? "scale(1.03)" : "scale(1)",
                transition: "filter 0.35s ease, transform 0.35s ease",
                willChange: "filter, transform",
              }}
            />
          )}

          {templateMeta?.fontUrls?.map((url, idx) => (
            <link key={idx} href={url} rel="stylesheet" />
          ))}

          {templateMeta?.cssCode && (
            <style dangerouslySetInnerHTML={{ __html: templateMeta.cssCode }} />
          )}

          {!loading && renderedHTML && (
            <div
              style={{ position: "absolute", inset: 0, zIndex: 2, cursor: "text" }}
              dangerouslySetInnerHTML={{ __html: renderedHTML }}
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUploadClick}
        />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CustomButton title="Submit" onClick={handleSave} />
        </div>
      </div>

      <CalendarModal
        show={modal.calendar}
        onClose={() => setModal((p) => ({ ...p, calendar: false }))}
        selectedDate={selectedDate}
        setSelectedDate={(d) => {
          setSelectedDate(d);
          setFormData((p) => ({ ...p, date: d }));
        }}
      />

      <TimeModal
        show={modal.time}
        onClose={() => setModal((p) => ({ ...p, time: false }))}
        selectedTime={selectedTime}
        setSelectedTime={(t) => {
          setSelectedTime(t);
          setFormData((p) => ({ ...p, time: t }));
        }}
      />

      <ErrorPopup
        isOpen={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: "" })}
        heading="Missing information"
        message={errorModal.message}
        buttonLabel="OK"
        icon={AlertIcon}
      />
    </div>
  );
};

export default DynamicTemplateRenderer;
