import html2canvas from "html2canvas";

/**
 * Captures a DOM element as an image Blob using html2canvas.
 * Automatically handles textareas and hides unwanted elements before capture.
 * 
 * @param {HTMLElement} elementRef - The DOM element to capture (ref.current)
 * @param {string[]} hideSelectors - (Optional) Array of CSS selectors to temporarily hide
 * @returns {Promise<Blob|null>} - A Blob of the image, or null if failed
 */
export const captureElementAsImage = async (elementRef, hideSelectors = []) => {
  if (!elementRef) return null;
  const hiddenElements = [];
  hideSelectors.forEach((selector) => {
    const el = elementRef.querySelector(selector);
    if (el) {
      el.style.display = "none";
      hiddenElements.push(el);
    }
  });

  const textareas = elementRef.querySelectorAll("textarea");
  const replacements = [];
  textareas.forEach((ta) => {
    const div = document.createElement("div");
    const computed = window.getComputedStyle(ta);
    Object.assign(div.style, {
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      display: "block",
      boxSizing: "border-box",
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      letterSpacing: computed.letterSpacing,
      lineHeight: computed.lineHeight,
      color: computed.color,
      textAlign: computed.textAlign,
      background: computed.backgroundColor,
      padding: computed.padding,
      margin: computed.margin,
      width: `${ta.offsetWidth}px`,
      minHeight: `${ta.offsetHeight}px`,
      borderRadius: computed.borderRadius,
      transform: computed.transform,
      textTransform: computed.textTransform,
    });
    div.textContent = ta.value || ta.placeholder || "";
    ta.parentNode.insertBefore(div, ta);
    ta.style.display = "none";
    replacements.push({ ta, div });
  });

  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 100));

  try {
    const canvas = await html2canvas(elementRef, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    return blob;
  } catch (error) {
    console.error("Image capture failed:", error);
    return null;
  } finally {
    hiddenElements.forEach((el) => (el.style.display = ""));
    replacements.forEach(({ ta, div }) => {
      div.remove();
      ta.style.display = "";
    });
  }
};
