import balloonDecorationSeo from "@/utils/balloonDecorationSeo.json";

// ─────────────────────────────────────────────────────────────
// Meta title & description overrides for balloon-decoration pages,
// keyed by URL path (e.g. "/bangalore/balloon-decoration/kids-birthday-decoration/unicorn").
// Source: SEO sheet "meta title and description" (1107 URLs):
//   main page, categories, kids themes, city hubs,
//   city × category and city × kids-theme pages.
// Pages not listed here keep their existing SEO copy.
// ─────────────────────────────────────────────────────────────

const toSlug = (val) =>
  String(val || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

/**
 * Build the sheet lookup path for a balloon-decoration page.
 * Locality pages are not covered by the sheet, so they return null.
 */
export const buildBalloonSeoPath = ({ city, locality, catValue, theme } = {}) => {
  if (locality) return null;

  const parts = [];
  if (city) parts.push(toSlug(city));
  parts.push("balloon-decoration");
  if (catValue) parts.push(toSlug(catValue));
  if (catValue && theme) parts.push(toSlug(theme));

  return "/" + parts.join("/");
};

/**
 * Returns { title, description } from the SEO sheet for this page,
 * or null when the page isn't in the sheet.
 */
export const getBalloonDecorationSeo = (params = {}) => {
  const path = buildBalloonSeoPath(params);
  return (path && balloonDecorationSeo[path]) || null;
};
