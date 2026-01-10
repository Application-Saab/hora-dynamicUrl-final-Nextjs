// import html2canvas from "html2canvas";

// /**
//  * Captures a DOM element as an image Blob using html2canvas.
//  * Automatically handles textareas and hides unwanted elements before capture.
//  * 
//  * @param {HTMLElement} elementRef - The DOM element to capture (ref.current)
//  * @param {string[]} hideSelectors - (Optional) Array of CSS selectors to temporarily hide
//  * @returns {Promise<Blob|null>} - A Blob of the image, or null if failed
//  */
// export const captureElementAsImage = async (elementRef, hideSelectors = []) => {
//   if (!elementRef) return null;
//   const hiddenElements = [];
//   hideSelectors.forEach((selector) => {
//     const el = elementRef.querySelector(selector);
//     if (el) {
//       el.style.display = "none";
//       hiddenElements.push(el);
//     }
//   });

//   const textareas = elementRef.querySelectorAll("textarea");
//   const replacements = [];
//   textareas.forEach((ta) => {
//     const div = document.createElement("div");
//     const computed = window.getComputedStyle(ta);
//     Object.assign(div.style, {
//       whiteSpace: "pre-wrap",
//       wordWrap: "break-word",
//       overflowWrap: "break-word",
//       display: "block",
//       boxSizing: "border-box",
//       fontFamily: computed.fontFamily,
//       fontSize: computed.fontSize,
//       fontWeight: computed.fontWeight,
//       letterSpacing: computed.letterSpacing,
//       lineHeight: computed.lineHeight,
//       color: computed.color,
//       textAlign: computed.textAlign,
//       background: computed.backgroundColor,
//       padding: computed.padding,
//       margin: computed.margin,
//       width: `${ta.offsetWidth}px`,
//       minHeight: `${ta.offsetHeight}px`,
//       borderRadius: computed.borderRadius,
//       transform: computed.transform,
//       textTransform: computed.textTransform,
//     });
//     div.textContent = ta.value || ta.placeholder || "";
//     ta.parentNode.insertBefore(div, ta);
//     ta.style.display = "none";
//     replacements.push({ ta, div });
//   });

//   await document.fonts.ready;
//   await new Promise((r) => setTimeout(r, 100));

//   try {
//     const canvas = await html2canvas(elementRef, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: null,
//     });

//     const blob = await new Promise((resolve) => {
//       canvas.toBlob(resolve, "image/png");
//     });

//     return blob;
//   } catch (error) {
//     console.error("Image capture failed:", error);
//     return null;
//   } finally {
//     hiddenElements.forEach((el) => (el.style.display = ""));
//     replacements.forEach(({ ta, div }) => {
//       div.remove();
//       ta.style.display = "";
//     });
//   }
// };




import { toBlob } from 'html-to-image';

/**
 * Captures a DOM element as an image Blob using html-to-image.
 * Optimized for iOS Safari to prevent blank images and missing fonts.
 * * @param {HTMLElement} elementRef - The DOM element to capture (ref.current)
 * @param {string[]} hideSelectors - Array of CSS selectors to hide during capture
 * @returns {Promise<Blob|null>} - A Blob of the image, or null if failed
 */
export const captureElementAsImage = async (elementRef, hideSelectors = []) => {
  if (!elementRef) {
    console.error("Capture failed: elementRef is null");
    return null;
  }

  try {
    // 1. FONT READINESS (Critical for iOS)
    // This prevents "blank text" by waiting for custom fonts to load.
    if (document.fonts) {
      await document.fonts.ready;
    }

    // 2. THE RENDER TICK
    // Force the browser to complete a paint cycle so text is actually drawn.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // 3. IOS STABILITY DELAY
    // Gives mobile CPUs time to settle layout shifts before taking the snapshot.
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 4. CAPTURE PROCESS
    const blob = await toBlob(elementRef, {
      // Prevents Safari from using cached/tainted images
      cacheBust: true,

      // Filter: Hides elements virtually without mutating the real DOM
      filter: (node) => {
        if (node.classList) {
          const isHidden = hideSelectors.some((selector) => {
            const cleanSelector = selector.replace('.', '');
            return node.classList.contains(cleanSelector) || node.matches?.(selector);
          });
          return !isHidden;
        }
        return true;
      },

      /**
       * PIXEL RATIO (Memory Management)
       * iOS Safari has a 16MB canvas limit. scale: 2 is high-quality and safe.
       * If your template is massive (e.g. > 4000px), reduce this to 1.5.
       */
      pixelRatio: 2,

      // Background consistency
      backgroundColor: '#ffffff',

      // Include all fonts in the final SVG/Blob
      skipFonts: false,

      // Ensures CSS transforms and position are respected
      style: {
        'image-rendering': 'auto',
      }
    });

    if (!blob) {
      throw new Error("Blob generation returned null");
    }

    return blob;

  } catch (error) {
    console.error("Error in captureElementAsImage (iOS):", error);
    return null;
  }
};

