/**
 * blogServiceLinks.js
 *
 * Two-way mapping between blog posts and service category pages.
 *
 * getBlogArticlesForCatValue(catValue)
 *   → returns blog articles relevant to a decoration category page
 *     so the service page can link to the matching blog guide(s)
 *
 * getServiceLinksForBlogArticle(catValue)
 *   → returns service page links relevant to a blog article
 *     (already handled via article.closingCtaLink, but kept here for
 *      future use / photography blog)
 */

import { DECORATION_BLOG_ARTICLES } from "@/utils/decorationBlogData";

/**
 * Returns up to 3 blog articles whose catValue matches the given
 * decoration category page catValue. Used on service pages to show
 * "Read our guide →" links.
 */
export function getBlogArticlesForCatValue(catValue) {
  if (!catValue) return [];
  return DECORATION_BLOG_ARTICLES.filter(
    (a) => a.catValue === catValue
  ).slice(0, 3);
}

/**
 * Returns the primary service page URL for a blog article's catValue.
 * Used in blog articles to link back to the service page.
 */
export function getServiceUrlForCatValue(catValue, city = null) {
  if (!catValue) return "/balloon-decoration";
  const base = city
    ? `/${city}/balloon-decoration/${catValue}`
    : `/balloon-decoration/${catValue}`;
  return base;
}

/**
 * Venue listing blog link — static, points to the balloon-decoration blog
 * as a related content hub (venues ↔ decoration are closely related).
 */
export const VENUE_BLOG_LINK = {
  href: "/blog/balloon-decoration",
  label: "Party planning tips & decoration guides",
  description: "Read our blog for birthday decoration ideas, cost guides and party planning tips.",
};
