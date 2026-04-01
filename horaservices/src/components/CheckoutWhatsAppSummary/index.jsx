// CheckoutWhatsAppSummary.js

export const contactUsRedirect = ({
  type = "decoration",
  category,
  city,
  selectedDate,
  selectedTimeSlot,
  address,
  totalAmount,
  product,
  selectedAddOnProduct,
  comment,
  router
}) => {

 const categoryMessages = {
    photography: {
      "Birthday-Photography": "birthday photography",
      "Anniversary-Photography": "anniversary photography",
      "House-warming-Photography": "house warming photography",
      "Naming-ceremony-Photography": "naming ceremony photography",
      "Bachelorette-Photography": "bachelorette photography",
      "Baby-Shower-Photography": "baby shower photography",
      "Engagement-Photography": "engagement photography",
      "Wedding-Photography": "wedding photography",
      "Maternity-Photography": "maternity photography",
      "New-Born-Baby-Photography": "new born baby photography",
      "Intimate-Gathering": "intimate gathering photography",
    },
    decoration: {
      "kids-birthday-decoration": "kids birthday decoration",
      "birthday-decoration": "birthday decoration",
      "anniversary-decoration": "anniversary decoration",
      "baby-shower-decoration": "baby shower decoration",
      "welcome-baby-decoration": "welcome baby decoration",
      "first-night-decoration": "first night decoration",
      "premium-decoration": "premium decoration",
      "haldi-mehendi-decoration": "haldi & mehendi decoration",
      "Wedding": "wedding decoration",
      "bachelorette-decoration": "bachelorette decoration",
    },
  };

  const categoryMap = categoryMessages[type] || {};

const normalizedCategory = category
  ?.toLowerCase()
  ?.replace(/\s+/g, "-");

let categoryText =
  categoryMap[category] ||
  categoryMap[normalizedCategory];

if (!categoryText && normalizedCategory) {
  categoryText = normalizedCategory.replace(/-/g, " ");
}
 const basePath = router?.query?.from || "";

const cleanBasePath = basePath.split("/product")[0];


  const productName =
    product?.product_name || product?.name || "No Product Found";

  const productSlug =
    product?.slug ||
    (productName
      ? productName.toLowerCase().replace(/\s+/g, "-")
      : "no-product");

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-GB")
    : "N/A";

  const message = `
Hi, I want to place ${categoryText} order urgently.
*Order Details:*
Order Date: ${formattedDate}
Address: ${address || "Not Provided"}
GoogleMapLocation: https://www.google.com/maps/search/?q=${encodeURIComponent(address || "India")}
Arrival Time: ${selectedTimeSlot || "Not Selected"}

*Amount: ₹${totalAmount || 0}*

*Comments:*
${comment || "No Comments"}

*Add-On Items:*
${
selectedAddOnProduct?.length
  ? selectedAddOnProduct.map(item => item.title).join(", ")
  : "No Add-ons"
}

*Product Name:* ${productName}

*Product Page:* https://horaservices.com${cleanBasePath}/product/${productSlug}
`;

  window.open(
    `https://wa.me/917338584828?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};