// import { META_PIXEL_ID } from "./constants";

import { META_PIXEL_ID_STATIC } from "./constants";

// export const FB_PIXEL_ID = META_PIXEL_ID;

// // PageView fire karne ke liye
// export const pageview = () => {
//   if (typeof window !== "undefined" && window.fbq) {
//     window.fbq("track", "PageView");
//   }
// };

// // Meta Standard Events ke liye (Schedule, Purchase, Lead, ViewContent)
// export const event = (name, options = {}) => {
//   if (typeof window !== "undefined" && window.fbq) {
//     window.fbq("track", name, options);
//   }
// };

// // Custom Events ke liye
// export const customEvent = (name, options = {}) => {
//   if (typeof window !== "undefined" && window.fbq) {
//     window.fbq("trackCustom", name, options);
//   }
// };




const META_PIXEL_ID = META_PIXEL_ID_STATIC;

export const initMetaPixel = () => {
  if (typeof window === "undefined") return;

  // Prevent duplicate initialization
  if (window.__horaMetaPixelInitialized) return;

  window.__horaMetaPixelInitialized = true;

  // Meta Pixel base code
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;

    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };

    if (!f._fbq) f._fbq = n;

    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    t = b.createElement(e);
    t.async = true;
    t.src = v;

    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  window.fbq("init", META_PIXEL_ID);
};

// Fire a custom Meta event directly from website code
export const trackMetaCustomEvent = (
  eventName,
  params = {}
) => {
  if (typeof window === "undefined") return;

  if (typeof window.fbq !== "function") {
    console.warn("Meta Pixel is not initialized");
    return;
  }

  window.fbq("trackCustom", eventName, params);
};
