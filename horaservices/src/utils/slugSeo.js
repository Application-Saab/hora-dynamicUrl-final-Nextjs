// ─────────────────────────────────────────────────────────────
// slugSeo.js
//
// Auto-generates SEO title, meta description, and H1 from a
// category slug so new balloon-decoration categories don't need
// a manual entry anywhere.
//
// Priority in SeoHead / DecorationBanner:
//   1. balloonDecorationSeo.json  (exact path lookup — richest copy)
//   2. Decorationcatseo.js        (~20 hardcoded entries with richer copy)
//   3. slugSeo (this file)        ← catches every new category automatically
// ─────────────────────────────────────────────────────────────

/**
 * Convert a URL slug to a readable title-case label.
 * "name-reveal-decoration" → "Name Reveal Decoration"
 * "baby-shower-decoration"  → "Baby Shower Decoration"
 */
export const slugToLabel = (slug) => {
  if (!slug) return "";
  return String(slug)
    .trim()
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
};

/**
 * Title for a balloon-decoration category page.
 *
 * No city  → "Name Reveal Decoration at Home | HORA"
 * With city → "Name Reveal Decoration in Mumbai | HORA"
 *
 * @param {string} catSlug  URL slug, e.g. "name-reveal-decoration"
 * @param {string|null} city  Display name, e.g. "Mumbai" (optional)
 * @returns {string}
 */
export const slugTitle = (catSlug, city = null) => {
  const label = slugToLabel(catSlug);
  if (!label) return city ? `Decoration in ${city} | HORA` : "Decoration at Home | HORA";
  return city
    ? `${label} in ${city} | HORA`
    : `${label} at Home | HORA`;
};

/**
 * Meta description for a balloon-decoration category page.
 *
 * @param {string} catSlug  URL slug
 * @param {string|null} city  Display name (optional)
 * @returns {string}
 */
export const slugDescription = (catSlug, city = null) => {
  const label = slugToLabel(catSlug);
  if (!label) {
    return city
      ? `Book home decoration in ${city} from Rs 1,499. Same-day setup by verified HORA decorators.`
      : "Book home decoration from Rs 1,499. Same-day setup by verified HORA decorators across 8 cities.";
  }
  return city
    ? `Book ${label.toLowerCase()} at home in ${city} from Rs 1,499. Same-day setup by verified HORA decorators.`
    : `Book ${label.toLowerCase()} at home from Rs 1,499. Same-day setup by verified HORA decorators across 8 cities.`;
};

/**
 * H1 for a balloon-decoration category page.
 *
 * No city  → "Name Reveal Decoration"
 * With city → "Name Reveal Decoration in Mumbai"
 *
 * @param {string} catSlug  URL slug
 * @param {string|null} city  Display name (optional)
 * @returns {string}
 */
export const slugH1 = (catSlug, city = null) => {
  const label = slugToLabel(catSlug);
  if (!label) return city ? `Decoration in ${city}` : "Decoration";
  return city ? `${label} in ${city}` : label;
};
