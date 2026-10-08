import axiosApi from "@/utils/axiosApi";
import cityNameToSlug from "./Citynametoslug.json";

/* ---------------- CONSTANTS ---------------- */
export const WHATSAPP_BOOKING_NUMBER = "917338584828";

const CHECKOUT_SERVICE_LABELS = {
  "book-chef": "chef booking",
  "party-food-delivery-live-catering-buffet": "party food delivery",
  photography: "photography",
};

/* ---------------- HELPERS ---------------- */

export const slugToText = (slug = "") =>
  decodeURIComponent(slug).replace(/[-_+]+/g, " ").trim();

/* "bangalore" -> "Bangalore" (JSON se naam, nahi mila to capitalize) */
export const slugToCityName = (slug = "") => {
  if (!slug) return "";
  const found = Object.entries(cityNameToSlug).find(
    ([, value]) => String(value).toLowerCase() === slug.toLowerCase(),
  );
  const name = found ? found[0] : slug;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const getBookingContext = (searchParams, pathname = "") => {
  const from = searchParams?.get("from") || "";
  const pathParts = from.split("/").filter(Boolean);

  const citySlug = pathParts[0] || "";
  const isKnownCity = Object.values(cityNameToSlug)
    .map((v) => String(v).toLowerCase())
    .includes(citySlug.toLowerCase());

  /* from path: /city/section/category/product/name -> category 3rd segment hai */
  const categoryFromPath =
    pathParts[2] && pathParts[2].toLowerCase() !== "product" ? pathParts[2] : "";

  /* Pathname se: /book-chef-checkout -> "book-chef" -> label */
  const routeKey = (pathname || "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/-checkout$/i, "")
    .toLowerCase();
  const routeLabel =
    CHECKOUT_SERVICE_LABELS[routeKey] ||
    (routeKey && routeKey !== "checkout" ? routeKey : "");

  /* Pehla meaningful (non-empty, sirf number nahi) value lo.
     orderType me kabhi "2" jaisa number aata hai, isliye wo skip hota hai. */
  const candidates = [
    searchParams?.get("catValue"),
    categoryFromPath,
    searchParams?.get("subCategory"),
    searchParams?.get("selectedDeliveryOption"),
    searchParams?.get("selectedOption"),
    routeLabel,
    searchParams?.get("orderType"),
  ];
  const service =
    candidates.find((v) => v && !/^\d+$/.test(String(v).trim())) || "";

  return {
    service: slugToText(service),
    city: isKnownCity ? slugToCityName(citySlug) : "",
  };
};

/* ---------------- WHATSAPP LINK ---------------- */

export const getWhatsAppBookingLink = (serviceName, cityName) => {
  const service = serviceName ? ` for ${serviceName}` : "";
  const city = cityName ? ` in ${cityName}` : "";
  const text = `Hi, give me offline booking support${service}${city}.`;

  return `https://wa.me/${WHATSAPP_BOOKING_NUMBER}?text=${encodeURIComponent(text)}`;
};

/* Component ke liye one-shot helper:
   priority -> prop > URL se nikala hua > header me selected city */
export const resolveWhatsAppLink = ({
  serviceName = "",
  cityName = "",
  searchParams,
  pathname = "",
  selectedCityName = "",
} = {}) => {
  const ctx = getBookingContext(searchParams, pathname);
  return getWhatsAppBookingLink(
    serviceName || ctx.service,
    cityName || ctx.city || selectedCityName || "",
  );
};

export const sendWelcomeMessage = async (mobile) => {
  const formatted = mobile.startsWith("+91") ? mobile : "+91" + mobile;

  try {
    await axiosApi.post(
      "https://public.doubletick.io/whatsapp/message/template",
      {
        messages: [
          {
            from: "+" + WHATSAPP_BOOKING_NUMBER,
            to: formatted,
            content: {
              templateName: "happy_to_help_v4",
              language: "en",
              templateData: {
                header: {
                  type: "IMAGE",
                  mediaUrl:
                    "https://quickscale-template-media.s3.ap-south-1.amazonaws.com/org_FGdNfMoTi9/2a2f1b0c-63e0-4c3e-a0fb-7ba269f23014.jpeg",
                },
                body: { placeholders: ["Hora Services"] },
                buttons: [
                  {
                    type: "URL",
                    parameter: "https://horaservices.com/",
                  },
                ],
              },
            },
          },
        ],
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_DOUBLETICK_KEY,
        },
      },
    );
  } catch (err) {
    console.error("WhatsApp error", err);
  }
};