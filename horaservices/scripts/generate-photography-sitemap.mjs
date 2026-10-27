/**
 * generate-photography-sitemap.mjs
 *
 * Run this script locally to fetch all photography product slugs and
 * append them to public/sitemap-photography.xml.
 *
 * Usage:
 *   node scripts/generate-photography-sitemap.mjs
 *
 * Requirements:
 *   - Node 18+ (native fetch)
 *   - Run from the `horaservices/` directory
 *   - Must be run from a machine that can reach horaservices.com API
 *     (the server blocks requests from CI / cloud environments)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL = "https://horaservices.com";
const GET_CAT_ID = "/api/meals/idByTag?tag=";
const GET_BY_TAG = "/api/photography/searchByTag/";
const SITEMAP_PATH = path.resolve(__dirname, "../public/sitemap-photography.xml");
const LASTMOD = "2026-10-26T11:00:00+05:30";

// All photography category slugs (from photoCategories.js)
const CATEGORIES = [
  "birthday-photography",
  "anniversary-photography",
  "house-warming-photography",
  "naming-ceremony-photography",
  "bachelorette-photography",
  "baby-shower-photography",
  "engagement-photography",
  "wedding-photography",
  "maternity-photography",
  "new-born-baby-photography",
  "corporate-photography",
  "welcome-baby-photography",
  // Wedding sub-moments map to wedding-photography category
  // so their products appear under wedding-photography above
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const slugify = (text) =>
  text?.replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").toLowerCase() || "";

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; SitemapBot/1.0)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function getCategoryId(catSlug) {
  const data = await fetchJson(`${BASE_URL}${GET_CAT_ID}${encodeURIComponent(catSlug)}`);
  return data?.data?._id || null;
}

async function getProducts(catId) {
  const data = await fetchJson(`${BASE_URL}${GET_BY_TAG}${catId}`);
  return data?.data || [];
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔍 Fetching photography product slugs...\n");

  const allSlugs = new Set();

  for (const cat of CATEGORIES) {
    process.stdout.write(`  ${cat} ... `);
    try {
      const catId = await getCategoryId(cat);
      if (!catId) {
        console.log("⚠️  no category ID found");
        continue;
      }

      const products = await getProducts(catId);
      const slugs = products
        .map((p) => slugify(p.name || p.title || ""))
        .filter(Boolean);

      for (const s of slugs) allSlugs.add(s);
      console.log(`✅ ${slugs.length} products`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }

    // Small delay to avoid hammering the API
    await new Promise((r) => setTimeout(r, 300));
  }

  if (allSlugs.size === 0) {
    console.error("\n❌ No product slugs fetched. Aborting sitemap update.");
    process.exit(1);
  }

  console.log(`\n📦 Total unique product slugs: ${allSlugs.size}`);

  // ─── Build new <url> entries ─────────────────────────────────────────────
  const newEntries = [...allSlugs]
    .sort()
    .map(
      (slug) =>
        `  <url><loc>${BASE_URL}/photography/product/${slug}</loc><lastmod>${LASTMOD}</lastmod></url>`,
    )
    .join("\n");

  // ─── Read existing sitemap & inject before </urlset> ────────────────────
  const existing = fs.readFileSync(SITEMAP_PATH, "utf-8");

  // Remove any previously injected product entries (idempotent)
  const withoutOldProducts = existing.replace(
    /\n?  <!-- PHOTOGRAPHY PRODUCTS START -->[\s\S]*?<!-- PHOTOGRAPHY PRODUCTS END -->\n?/,
    "",
  );

  const marker = `\n  <!-- PHOTOGRAPHY PRODUCTS START -->\n${newEntries}\n  <!-- PHOTOGRAPHY PRODUCTS END -->\n`;
  const updated = withoutOldProducts.replace("</urlset>", `${marker}</urlset>`);

  fs.writeFileSync(SITEMAP_PATH, updated, "utf-8");

  const totalUrls = (updated.match(/<url>/g) || []).length;
  console.log(`\n✅ sitemap-photography.xml updated`);
  console.log(`   Added ${allSlugs.size} product URLs`);
  console.log(`   Total URLs in sitemap: ${totalUrls}`);
  console.log(`\n📄 File: ${SITEMAP_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
