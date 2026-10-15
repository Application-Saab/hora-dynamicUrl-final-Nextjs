import balloonDecorationH1 from "@/utils/balloonDecorationH1.json";

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
// ─────────────────────────────────────────────────────────────

/**
 * Returns the sheet H1 for a URL path (query string / hash ignored),
 * or null when the page isn't in the sheet.
 */
export const getBalloonDecorationH1 = (path) => {
  if (!path) return null;

  const normalized =
    String(path).split(/[?#]/)[0].toLowerCase().replace(/\/+$/, "") || "/";

  return balloonDecorationH1[normalized] || null;
};
