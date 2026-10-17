// utils/gtm.js
// Single place for all GTM dataLayer pushes. SSR-safe.

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export const gtmPush = (event, params = {}) => {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch (err) {
    console.error("GTM push failed:", err);
  }
};

// Event names ek jagah rakhe hain taaki typo na ho aur GTM triggers match karein.
export const GTM_EVENTS = {
  CITY_MODAL_VIEW: "city_modal_view",
  CITY_SELECTED: "city_selected",
};