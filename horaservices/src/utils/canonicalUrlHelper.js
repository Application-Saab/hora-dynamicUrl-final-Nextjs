const SITE = "https://horaservices.com";

const slugify = (val) =>
  String(val || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

/** Build absolute canonical (no tracking params) */
export function buildPhotographyCanonical({
  city,
  locality,
  catValue,
  productName,
  productId,
  includeId = false, // product page: true if content depends on id
} = {}) {
  const parts = [];

  const citySlug = city ? slugify(city) : "";
  const localitySlug = locality ? slugify(locality) : "";

  if (citySlug) parts.push(citySlug);
  if (localitySlug) parts.push(localitySlug);

  parts.push("photography-page");

  if (catValue) parts.push(catValue); // keep original casing if routes use it
  if (productName) {
    parts.push("product");
    parts.push(productName);
  }

  let path = "/" + parts.filter(Boolean).join("/");

  // sirf content-defining id; utm etc. mat daalo
  if (includeId && productId) {
    path += `?id=${encodeURIComponent(productId)}`;
  }

  return `${SITE}${path}`;
}