import { trackMetaCustomEvent } from "./fpixel";

/* =========================================
   ALL MARKETING EVENT NAMES — SINGLE SOURCE
========================================= */

export const MARKETING_EVENTS = {
  LOGIN_SUCCESS: "login_success",

  WHATSAPP_COMMON_CLICK: "common_whatsapp_button_click",

  WHATSAPP_BUTTONS: {
    BOOK_ON_WHATSAPP: "login_popup_whatsapp_booking_click",
    FLOTING_WA_ICON_ALL_PAGE : "floting_wa_icon_all_page",
    EVENT_DATE_CONSULTATION_POPUP : "event_date_consultation_popup",
    COUPON_AMOUNT_CHAT_NOW : "coupon_amount_chat_now",
    CUSTOMIZE_DECORATION_PRODUCT_GRID_POPUP : "customize_decoration_product_grid_popup",
    WE_ARE_HERE_BANNER_DECORATION : "we_are_here_banner_decoration",
    MAKE_IT_YOURS_CUSTOMIZE_BANNER : "make_it_yours_customize_banner",
    CHAT_NOW_PHOTOGRAPHY_BANNER : "chat_now_photography_banner",
    CHECK_AVAILABILITY_VENUE_INNER : "check_availability_venue_inner",
    CHECK_AVAILABILITY_VENUE_LANDING : "check_availability_venue_landing",
    VENUE_ENQUIRE_NOW_BTN : "venue_enquire_now_btn",
    PARTY_FOOD_WHATSAPP_BTN : "party_food_whatsapp_btn",
    ABOUT_US_CONTACT_BTN : "about_us_contact_btn",
    BOOK_CHEF_CHECKOUT_CONTACT_US : "book_chef_checkout_contact_us",
    DECORATION_CHECKOUT_CONTACT_US : "decoration_checkout_contact_us",
    FOOD_CHECKOUT_CONTACT_US : "food_checkout_contact_us",
    PHOTOGRAPHY_CHECKOUT_CONTACT_US : "photography_checkout_contact_us",

    ENQUIRY: "whatsapp_enquiry_click",
    CUSTOMIZATION: "whatsapp_customization_click",
    GENERAL_SUPPORT: "whatsapp_general_support_click",
    CHECKOUT_BOOKING: "whatsapp_checkout_booking_click",
  },
};

/* =========================================
   FIRE EVENT TO GTM + META PIXEL
========================================= */

export const trackMarketingEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;

//   // GTM
//   window.dataLayer = window.dataLayer || [];
//   window.dataLayer.push({
//     event: eventName,
//     ...params,
//   });

  // Meta Pixel
  trackMetaCustomEvent(eventName, params);
};

/* =========================================
   WHATSAPP BUTTON TRACKING
One click = common event + specific event
========================================= */

export const trackWhatsAppButtonClick = (
  specificEventName,
  params = {},
) => {
  if (typeof window === "undefined") return;

  const commonParams = {
    button_name: params.button_name || "Unknown WhatsApp Button",
    button_type: params.button_type || "whatsapp",
    page_path: window.location.pathname,
    ...params,
  };

  // fires for every tracked WhatsApp button
  trackMarketingEvent(
    MARKETING_EVENTS.WHATSAPP_COMMON_CLICK,
    commonParams,
  );

  // fires for this particular button
  if (specificEventName) {
    trackMarketingEvent(specificEventName, commonParams);
  }
};