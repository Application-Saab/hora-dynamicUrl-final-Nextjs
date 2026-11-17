import balloonDecorationH1 from "@/utils/balloonDecorationH1.json";

// Convert "name-reveal-decoration" → "Name Reveal Decoration"
const slugToLabel = (slug) =>
  String(slug || "").trim().toLowerCase().replace(/-/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

// ─────────────────────────────────────────────────────────────
// Page H1 for balloon-decoration pages, keyed by URL path
// (e.g. "/bangalore/balloon-decoration/kids-birthday-decoration/unicorn").
// Source: SEO sheet "New H1" column (1107 URLs): main page,
// categories, kids themes, city hubs, city × category and
// city × kids-theme pages.
//
// Looked up by the page's real URL, so ad/social landing variants
// (balloon-decoration-youtube, -instagram, -google-ads) and locality
// pages, which aren't in the sheet, keep their current H1.
//
// Falls back to auto-generating from the URL slug so new categories
// never show a blank or generic H1.
// ─────────────────────────────────────────────────────────────

// Known city slugs — used to strip the city prefix before deriving H1
const CITY_SLUGS = new Set([
  "mumbai", "bangalore", "hyderabad", "delhi",
  "noida", "gurugram", "ghaziabad", "faridabad",
]);

/**
 * Returns the sheet H1 for a URL path (query string / hash ignored).
 * If the path is not in the sheet, auto-generates an H1 from the slug.
 *
 * e.g. "/name-reveal-decoration"            → "Name Reveal Decoration"
 *      "/mumbai/balloon-decoration/name-reveal-decoration" → "Name Reveal Decoration in Mumbai"
 *
 * Returns null only when the path is empty or unreadable.
 */
export const getBalloonDecorationH1 = (path) => {
  if (!path) return null;

  const normalized =
    String(path).split(/[?#]/)[0].toLowerCase().replace(/\/+$/, "") || "/";

  // 1. Exact match in the sheet
  if (balloonDecorationH1[normalized]) return balloonDecorationH1[normalized];

  // 2. Auto-generate from the URL slug
  // Path segments without empty strings, e.g. ["mumbai","balloon-decoration","name-reveal-decoration"]
  const segments = normalized.split("/").filter(Boolean);
  if (!segments.length) return null;

  // Extract city if first segment matches a known city slug
  const firstSeg = segments[0];
  const city = CITY_SLUGS.has(firstSeg)
    ? firstSeg.charAt(0).toUpperCase() + firstSeg.slice(1)
    : null;

  // Find the sub-category segment: last segment that isn't "balloon-decoration",
  // a city, or a known parent path
  const SKIP = new Set(["balloon-decoration", "wedding-decoration"]);
  const catSegments = segments.filter((s) => !CITY_SLUGS.has(s) && !SKIP.has(s));
  const catSlug = catSegments[catSegments.length - 1] || null;

  const label = slugToLabel(catSlug);
  return city ? `${label} in ${city}` : label;
};
