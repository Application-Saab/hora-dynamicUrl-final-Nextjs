// Shared config: balloon-decoration + wedding dono ke liye
export const SUPPORTED_CATEGORY_SLUGS = ["balloon-decoration", "wedding"];
export const DEFAULT_CATEGORY_SLUG = "balloon-decoration";

// Category ke hisaab se alag content. Wedding ka price/reviews yahan set kar lena.
export const CATEGORY_CONFIG = {
  "balloon-decoration": { startingPrice: 999 },
  wedding: { startingPrice: null }, // null = "starting at" line nahi dikhegi
};

// explicit prop > URL se detect > default
export const resolveCategorySlug = (explicitSlug, path = "") => {
  if (explicitSlug) return explicitSlug;
  const parts = String(path).split(/[?#]/)[0].split("/").filter(Boolean);
  const found = parts.find((seg) =>
    SUPPORTED_CATEGORY_SLUGS.includes(seg.toLowerCase()),
  );
  return found ? found.toLowerCase() : DEFAULT_CATEGORY_SLUG;
};

// URL segment match: pehle exact, phir "balloon-decoration-instagram" jaise variants
export const findCategorySegment = (parts, categorySlug) => {
  const slug = categorySlug.toLowerCase();
  return (
    parts.find((seg) => seg.toLowerCase() === slug) ||
    parts.find((seg) => seg.toLowerCase().startsWith(slug + "-")) ||
    null
  );
};