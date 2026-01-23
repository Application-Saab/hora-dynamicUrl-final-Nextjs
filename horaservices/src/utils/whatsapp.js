
export const WHATSAPP_PHONE = "917338584828"; // +91 73385 84828

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi, I saw your website and want to know more about the services";

export const openWhatsApp = (
  phone = WHATSAPP_PHONE,
  message = WHATSAPP_DEFAULT_MESSAGE
) => {
  if (typeof window === "undefined") return;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};
