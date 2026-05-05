import html2canvas from "html2canvas";

/**
 * Captures a DOM element as an image Blob using html2canvas.
 * Video elements ke frames bhi capture hote hain (html2canvas video nahi pakad sakta).
 *
 * @param {HTMLElement} elementRef   - The DOM element to capture (ref.current)
 * @param {string[]}   hideSelectors - CSS selectors to temporarily hide before capture
 * @returns {Promise<Blob|null>}
 */
export const captureElementAsImage = async (elementRef, hideSelectors = []) => {
  if (!elementRef) return null;

  // ── 1. Hide unwanted elements ──────────────────────────────
  const hiddenElements = [];
  hideSelectors.forEach((selector) => {
    const el = elementRef.querySelector(selector);
    if (el) {
      el.style.display = "none";
      hiddenElements.push(el);
    }
  });

  // ── 2. Textarea → div (html2canvas textarea nahi padhta) ──
  const textareas = elementRef.querySelectorAll("textarea");
  const replacements = [];
  textareas.forEach((ta) => {
    const div      = document.createElement("div");
    const computed = window.getComputedStyle(ta);
    Object.assign(div.style, {
      whiteSpace:     "pre-wrap",
      wordWrap:       "break-word",
      overflowWrap:   "break-word",
      display:        "block",
      boxSizing:      "border-box",
      fontFamily:     computed.fontFamily,
      fontSize:       computed.fontSize,
      fontWeight:     computed.fontWeight,
      letterSpacing:  computed.letterSpacing,
      lineHeight:     computed.lineHeight,
      color:          computed.color,
      textAlign:      computed.textAlign,
      background:     computed.backgroundColor,
      padding:        computed.padding,
      margin:         computed.margin,
      width:          `${ta.offsetWidth}px`,
      minHeight:      `${ta.offsetHeight}px`,
      borderRadius:   computed.borderRadius,
      transform:      computed.transform,
      textTransform:  computed.textTransform,
    });
    div.textContent = ta.value || ta.placeholder || "";
    ta.parentNode.insertBefore(div, ta);
    ta.style.display = "none";
    replacements.push({ ta, div });
  });

  // ── 3. NEW: Video → canvas replacement ────────────────────
  //    html2canvas <video> ko blank render karta hai.
  //    Solution: video ka current frame ek <canvas> mein draw karo,
  //    phus usse DOM mein video ki jagah rakho, capture ke baad wapas karo.
  const videoReplacements = [];
  const videoElements = elementRef.querySelectorAll("video");

  videoElements.forEach((video) => {
    try {
      // Video ka current frame canvas mein draw karo
      const frameCanvas        = document.createElement("canvas");
      frameCanvas.width        = video.videoWidth  || video.offsetWidth;
      frameCanvas.height       = video.videoHeight || video.offsetHeight;
      const ctx                = frameCanvas.getContext("2d");
      ctx.drawImage(video, 0, 0, frameCanvas.width, frameCanvas.height);

      // Canvas ko video jaisi styling do
      const computed = window.getComputedStyle(video);
      Object.assign(frameCanvas.style, {
        position:   computed.position,
        top:        computed.top,
        left:       computed.left,
        width:      computed.width,
        height:     computed.height,
        objectFit:  computed.objectFit,
        display:    "block",
        zIndex:     computed.zIndex,
      });

      // DOM mein video ki jagah frameCanvas insert karo
      video.parentNode.insertBefore(frameCanvas, video);
      video.style.display = "none";
      videoReplacements.push({ video, frameCanvas });
    } catch (err) {
      // Cross-origin video ya koi aur error — silently skip
      console.warn("Video frame capture skipped:", err);
    }
  });

  // ── 4. Fonts load hone do ─────────────────────────────────
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 100));

  // ── 5. html2canvas se capture karo ───────────────────────
  try {
    const canvas = await html2canvas(elementRef, {
      scale:           2,
      useCORS:         true,
      backgroundColor: null,
      // Video canvas elements ko ignore mat karo
      ignoreElements:  (el) => el.tagName === "VIDEO",
    });

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    return blob;
  } catch (error) {
    console.error("Image capture failed:", error);
    return null;
  } finally {
    // ── 6. Sab kuch restore karo ─────────────────────────────
    hiddenElements.forEach((el)         => (el.style.display = ""));
    replacements.forEach(({ ta, div }) => { div.remove(); ta.style.display = ""; });

    // Video wapas lao, frameCanvas hatao
    videoReplacements.forEach(({ video, frameCanvas }) => {
      frameCanvas.remove();
      video.style.display = "";
    });
  }
};
