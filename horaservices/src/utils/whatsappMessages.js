/* =========================================================
   Helper Functions
========================================================= */

// Convert slug to readable text
// birthday-decoration → Birthday Decoration
export const formatCategoryName = (slug = "") => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Add city to message dynamically
export const addCityToMessage = (message, city) => {
  if (!city) return message;
  const formattedCity =
    city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  return `${message} in ${formattedCity}.`;
};

/* ======================================================
   Category Page Messages
========================================================= */

export const messagesByCategory = {
  "birthday-decoration":
    "Hi, I saw your birthday party decoration designs and want to know more about it",
   "kids-birthday-decoration":
    "Hi, I saw your kids birthday party decoration designs and want to know more about it",
   "premium-decoration":
    "Hi, I saw your premium decoration designs and want to know more about it",
   "baby-shower-decoration":
    "Hi, I saw your baby shower decoration designs and want to know more about it",
   "welcome-baby-decoration":
    "Hi, I saw your welcome baby decoration designs and would like more details",
   "anniversary-decoration":
    "Hi, I saw your anniversary decoration designs and would like more details",
   "first-night-decoration":
    "Hi, I saw your first night decoration designs and would like more details",
   "haldi-mehendi-decoration":
    "Hi, I saw your haldi & mehendi decoration designs and would like more details",
   "wedding-decoration":
    "Hi, I saw your wedding decoration designs and would like more details",
  "bachelorette-decoration":
    "Hi, I saw your bachelorette decoration designs and would like more details",
};

/* =========================================================
   Product Page Messages
========================================================= */

export const productMessagesByCategory = {
  "birthday-decoration":
    "Hi, I liked your birthday decoration design. Please help me with booking details.",
  "kids-birthday-decoration":
    "Hi, I liked your kids birthday decoration design. Please help me with booking details.",
  "premium-decoration":
    "Hi, I liked your premium decoration design. Please help me with booking details.",
  "baby-shower-decoration":
    "Hi, I liked your baby shower decoration design. Please help me with booking details.",
  "welcome-baby-decoration":
    "Hi, I liked your welcome baby decoration design. Please help me with booking details.",
  "anniversary-decoration":
    "Hi, I liked your anniversary decoration design. Please help me with booking details.",
  "first-night-decoration":
    "Hi, I liked your first night decoration design. Please help me with booking details.",
  "haldi-mehendi-decoration":
    "Hi, I liked your haldi & mehendi decoration design. Please help me with booking details.",
  "wedding-decoration":
    "Hi, I liked your wedding decoration design. Please help me with booking details.",
  "bachelorette-decoration":
    "Hi, I liked your bachelorette decoration design. Please help me with booking details.",
};

/* =========================================================
   Checkout Messages
========================================================= */


export const checkoutMessagesByCategory = {
    "kids-birthday-decoration": "Hi, can you help me book a kids birthday decor design",
    "birthday-decoration": "Hi, can you help me book a birthday decor design",
    "anniversary-decoration": "Hi, can you help me book an anniversary decor design",
    "baby-shower-decoration": "Hi, can you help me book a baby shower decor design",
    "welcome-baby-decoration": "Hi, can you help me book a baby welcome decor design",
    "first-night-decoration": "Hi, can you help me book a first night decor design",
    "premium-decoration": "Hi, can you help me book a premium decor design",
    "haldi-mehendi-decoration": "Hi, can you help me book a haldi & mehendi decor design",
    "wedding-decoration": "Hi, can you help me book a wedding decor design",
    "bachelorette-decoration": "Hi, can you help me book a bachelorette decor design"
  };
/* =========================================================
   City-Based Product Messages
========================================================= */



 export  const productMessagesByCategoryCity = {
    "kids-birthday-decoration": "Hi, I liked your kids birthday decor design, can you help me in booking process",
    "birthday-decoration": "Hi, I liked your birthday decor design, can you help me in booking process",
    "anniversary-decoration": "Hi, I liked your anniversary decor design, can you help me in booking process",
    "first-night-decoration": "Hi, I liked your first night decor design, can you help me in booking process",
    "premium-decoration": "Hi, I liked your premium decor design, can you help me in booking process",
    "baby-shower-decoration": "Hi, I liked your baby shower decor design, can you help me in booking process",
    "welcome-baby-decoration": "Hi, I liked your baby welcome decor design, can you help me in booking process",
    "haldi-mehendi-decoration": "Hi, I liked your haldi & mehendi decor design, can you help me in booking process",
    "wedding-decoration": "Hi, I liked your wedding decor design, can you help me in booking process",
    "bachelorette-decoration": "Hi, I liked your bachelorette decor design, can you help me in booking process"
  };
/* =========================================================
   Other Services Messages
========================================================= */

export const chefMessage =
  "Hi, I am interested in booking a chef for my event. Please share package details and pricing.";

export const photographyMessage =
  "Hi,I saw your website and want to know more about the Photography services";

export const photographyProductMessage=
"Hi,I saw your website and want to know more about the Photography services";

export const photographyCheckOutMessage =
"Hi, I need help completing my photography booking.";

export const youtubeDecorationMessage =
  "Hi, Found your decoration on Youtube. Need details.";
// Google Ads Messages

export const googleMainMessage =
  "Hi, Found your decoration on Google. Need it for an event.";

export const googleCategoryMessage =
  "Hi, Found your decoration on Google. Need it for an event.";

export const googleProductMessage =
  "Hi, Found your decoration on Google. Need it for an event.";

export const googleCityMainMessage =
  "Hi, I found your decoration services on Google. Please share details.";

export const googleCityCategoryMessage =
  "Hi, I found your decoration on Google. Please share details.";

export const googleCityProductMessage =
  "Hi, I saw your decoration on Google and want to book it.";

export const instagramMessage =
  "Hi, Found your decoration on Instagram. Need details for";

 export const instagramCategoryPageMessage =
 "Hi, Found your decoration on Instagram. Need details."

 export const instagramProductPageMessage =
 "Hi, Found your decoration on Instagram. Need details."

export const foodDeliveryMessage =
  "Hi, I am interested in your party food delivery service. Please share menu and pricing details.";

export const foodCategoryMainMessage =
  "Hi, I saw your website and want to know more about your catering and food services.";

export const liveBuffetMessage =
  "Hi, I am interested in your live buffet catering service. Please share details and pricing.";

  export const localityMainMessage =
  "Hi, I saw your decoration services for my locality. Please share details.";

export const localityCategoryMessage =
  "Hi, I saw your decoration category for my locality. Please share details.";

export const localityProductMessage =
  "Hi, I liked your decoration design for my locality. Please share booking details.";

export const localityHomeMessage =
  "Hi, I saw your decoration services for my area. Please share details.";

export const cityPageMessage =
  "Hi, I saw your decoration services in my city. Please share details.";

export const chefForPartyMessage =
  "Hi, I saw your website and want to know more about the chef for party services.";

export const defaultMessage =
  "Hi, I saw your website and would like more information about your services.";

export const chefOrderDetailsMessage =
  "Hi, I need help regarding my Chef for Party order details.";

export const chefCheckoutMessage =
  "Hi, I need assistance with completing my Chef for Party booking.";

export const chefCityPageMessage =
  "Hi, I saw your Chef for Party services page and would like more details.";

export const foodSelectDateMessage =
  "Hi, I need help selecting the date for party food delivery or live catering.";

export const photographyMainMessage =
  "Hi, I saw your website and want to know more about the photography services.";
