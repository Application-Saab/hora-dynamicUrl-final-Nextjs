export const WHATSAPP_PHONE = "917338584828";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi, I saw your website and want to know more about the services";

export const openWhatsApp = (
  phone = WHATSAPP_PHONE,
  message = WHATSAPP_DEFAULT_MESSAGE
) => {
  if (typeof window === "undefined") return;

  const encodedMsg = encodeURIComponent(message);

  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;
  window.open(url, "_blank", "noopener,noreferrer");
};
