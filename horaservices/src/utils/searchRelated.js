// utils/searchRelated.js
const list = (s) => s.split(" ");

// Related groups: user ne jo keyword likha -> kaunsi themes dikhani hain
export const RELATED_GROUPS = [
  ["jungle animal animals safari zoo wild forest farm king lion elephant parrot panda dinosaur dino cow bird birds",
   "jungle lion elephant parrot panda dinosaur cow flamingo"],
  ["princess fairy unicorn barbie elsa frozen mermaid doll queen cinderella",
   "princess elsa barbie unicorn fairy mermaid butterfly bow-theme"],
  ["hero superhero spiderman spider avengers hulk marvel ironman iron batman superman",
   "hero spider-man avengers hulk"],
  ["car cars vehicle vehicles traffic aeroplane airplane plane truck train bike jcb construction racing",
   "car traffic aeroplane"],
  ["sport sports football cricket ball messi ronaldo basketball", "football cricket"],
  ["cartoon cartoons tom jerry doremon doraemon shinchan motu patlu masha mickey minnie mouse bluey cocomelon",
   "tom-jerry doremon shinchan motu-patlu masha mickey-mouse mickey-minnie bluey cocomelon pig paw"],
  ["game games gaming minecraft mario sonic pokemon pikachu naruto anime kpop pop",
   "minecraft mario sonic pikachu-pokemon naruto pop"],
  ["space astronaut planet sea ocean shark under", "astronaut-space shark mermaid"],
  ["1 1st first half month one", "1st-birthday 6-month-birthday"],
  ["naming name ceremony annaprashan baptism reveal revealing christening",
   "naming revealing annaprashan baptism"],
].map(([k, t]) => ({ keywords: list(k), themes: list(t) }));

// Category ke alag naam: user "kids" likhe to Kids Birthday mile
const CATEGORY_ALIASES = {
  "kids-birthday-decoration": list("kid child children boy girl toddler cartoon"),
  "birthday-decoration": list("adult men women teen teenage"),
  "baby-shower-decoration": list("shower seemantham srimantham godh bharai pregnancy"),
  "welcome-baby-decoration": list("newborn welcome"),
  "naming-ceremony-decoration": list("naming namkaran cradle uyyala palna jhula"),
  "anniversary-decoration": ["anniversary"],
  "wedding-decoration": list("wedding shaadi marriage"),
};

// "decoration" jaise generic words: search mein kam weight
const GENERIC = new Set(list("decoration decor decorate theme design"));
// Generic + filler words: query se hata diye jaate hain
const STOPWORDS = new Set([
  ...GENERIC,
  ...list("for the a in at of and my me best simple idea setup"),
]);

export const normalize = (s) =>
  String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// kids -> kid, decorations -> decoration ("ss" wale nahi katte: boss, glass)
const stem = (t) =>
  t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t;

const isNum = (t) => /^\d+$/.test(t);

const tokensOf = (q) => {
  const all = normalize(q).split(" ").filter(Boolean).map(stem);
  const kept = all.filter((t) => !STOPWORDS.has(t));
  return kept.length ? kept : all;
};

// Search ke liye saaf term (backend ko bhi yahi bhejo)
export const cleanQuery = (q) => tokensOf(q).join(" ");

/* ------------------------------------------------------------------ *
 * SMART QUERY PARSER
 * "ring under 2000 low to high" ->
 *   { designTypes:["ring"], maxPrice:2000, sort:"lowToHigh", rest:"", parts:[...] }
 * "2000 under design" bhi chalta hai (number pehle, under baad mein).
 * parts = text ke wo tukde jo filter bane (chip hatane par text se wahi nikalte hain)
 * designOptions khali do to design type parse nahi hota (ring normal word rahega).
 * ------------------------------------------------------------------ */
const NUM = "(?:rs\\.?|₹|inr)?\\s*(\\d[\\d,]*)\\s*(k|hazar|hazaar|thousand)?\\b";
// Kam / zyada batane wale words (English + Hinglish)
const MAX_WORD = "(?:under|below|less\\s+than|upto|up\\s+to|within|max(?:imum)?|budget|se\\s+kam|kam|tak|ke\\s+andar|andar|ke\\s+niche|niche|or\\s+less|or\\s+below)";
const MIN_WORD = "(?:above|over|more\\s+than|min(?:imum)?|se\\s+(?:zyada|jyada|upar)|ke\\s+upar|upar|zyada|jyada|or\\s+more|or\\s+above|plus)";
const PRICE_WORD = "(?:rs\\.?|rupees?|rupaye|price|budget|cost|rate|inr)";
const LEAD = "(?:price\\s*|budget\\s*)?(?:of\\s*)?";
const BETWEEN = new RegExp(`\\bbetween\\s*${NUM}\\s*(?:and|to|-)\\s*${NUM}`, "i");
// "under 2000", "below 2k", "upto price 5000", "budget 3000"
const MAX_RE = new RegExp(`\\b${MAX_WORD}\\s*${LEAD}${NUM}`, "i");
const MIN_RE = new RegExp(`\\b${MIN_WORD}\\s*${LEAD}${NUM}`, "i");
// Number pehle: "2000 under", "2000 rs tak", "2000 se kam", "5000 se zyada"
const MAX_TRAIL_RE = new RegExp(`${NUM}\\s*${PRICE_WORD}?\\s*(?:and\\s+)?${MAX_WORD}\\b`, "i");
const MIN_TRAIL_RE = new RegExp(`${NUM}\\s*${PRICE_WORD}?\\s*(?:and\\s+)?${MIN_WORD}\\b`, "i");
// Direction ke bina: "price 20000", "20000 price", "rs 20000", "20000 rs" => max price
const PRICE_NUM_RE = new RegExp(
  `(?:\\b${PRICE_WORD}\\s*(?:of\\s*|is\\s*|=\\s*|:\\s*)?${NUM})|(?:${NUM}\\s*${PRICE_WORD}\\b)`,
  "i",
);
// Sirf number ("20000", "20k", "₹20000"): 300 ya usse bada ho to max price maano
const BARE_SRC = "(?:^|\\s)(?:rs\\.?|₹|inr)?\\s*(\\d[\\d,]*)\\s*(k|hazar|hazaar|thousand)?(?=\\s|$)";
const BARE_MIN_PRICE = 300;
const toNum = (n, k) => Number(n.replace(/,/g, "")) * (k ? 1000 : 1);

const SORT_RULES = [
  [/\b(?:price\s*)?low(?:est)?\s*(?:to|-)\s*high(?:est)?\b|\bcheap(?:est)?\b|\bsast[ai]\b|\blow\s*price\b/i, "lowToHigh"],
  [/\b(?:price\s*)?high(?:est)?\s*(?:to|-)\s*low(?:est)?\b|\bcostl(?:y|iest)\b|\bmeh?n?ga\b|\bmost\s*expensive\b|\bexpensive\b/i, "highToLow"],
  [/\bnew\s*arrivals?\b|\bnewest\b|\blatest\b/i, "newArrival"],
];

export function parseSearchQuery(raw, designOptions = []) {
  let rest = ` ${String(raw || "")} `;
  const parts = [];
  const designTypes = [];
  let minPrice = null;
  let maxPrice = null;
  let sort = null;
  let m;

  const cut = (match, part) => {
    parts.push({ ...part, text: match[0].trim() });
    rest = rest.replace(match[0], " ");
  };

  if ((m = rest.match(BETWEEN))) {
    const a = toNum(m[1], m[2]);
    const b = toNum(m[3], m[4]);
    minPrice = Math.min(a, b);
    maxPrice = Math.max(a, b);
    cut(m, { type: "price" });
  }
  if (maxPrice == null && (m = rest.match(MAX_RE))) {
    maxPrice = toNum(m[1], m[2]);
    cut(m, { type: "price" });
  }
  if (minPrice == null && (m = rest.match(MIN_RE))) {
    minPrice = toNum(m[1], m[2]);
    cut(m, { type: "price" });
  }
  if (maxPrice == null && (m = rest.match(MAX_TRAIL_RE))) {
    maxPrice = toNum(m[1], m[2]);
    cut(m, { type: "price" });
  }
  if (minPrice == null && (m = rest.match(MIN_TRAIL_RE))) {
    minPrice = toNum(m[1], m[2]);
    cut(m, { type: "price" });
  }
  // Direction nahi likha: "price 20000" / "20000 price" / "rs 20000" => max price
  if (maxPrice == null && minPrice == null && (m = rest.match(PRICE_NUM_RE))) {
    maxPrice = m[1] !== undefined ? toNum(m[1], m[2]) : toNum(m[3], m[4]);
    cut(m, { type: "price" });
  }
  // Sirf number ("20000", "20k"): bada number ho to max price
  if (maxPrice == null && minPrice == null) {
    for (const mm of rest.matchAll(new RegExp(BARE_SRC, "gi"))) {
      const v = toNum(mm[1], mm[2]);
      if (v >= BARE_MIN_PRICE) {
        maxPrice = v;
        cut(mm, { type: "price" });
        break;
      }
    }
  }

  for (const [re, id] of SORT_RULES) {
    if ((m = rest.match(re))) {
      sort = id;
      cut(m, { type: "sort" });
      break;
    }
  }

  // Lamba label pehle: "Ring + Flex" ko "Ring" se pehle match karo.
  // Har character ke beech optional separator: label "UShape" ko "ushape",
  // "u shape" aur "u-shape" teeno match karte hain; "Ring + Flex" ko "ring flex" bhi.
  [...designOptions]
    .sort((a, b) => b.label.length - a.label.length)
    .forEach((o) => {
      const squashed = normalize(o.label).replace(/ /g, "");
      if (!squashed) return;
      const flexible = squashed.split("").join("[^a-z0-9]*");
      const re = new RegExp(`\\b${flexible}s?\\b`, "i");
      if ((m = rest.match(re))) {
        designTypes.push(o.id);
        cut(m, { type: "design", id: o.id });
      }
    });

  const cleaned = rest.replace(/\s+/g, " ").trim();
  const onlyStop =
    !cleaned ||
    normalize(cleaned)
      .split(" ")
      .every((w) => STOPWORDS.has(stem(w)));

  return {
    designTypes,
    minPrice,
    maxPrice,
    sort,
    parts,
    rest: onlyStop ? "" : cleaned,
  };
}

/* ------------------------------------------------------------------ *
 * CATEGORY / RANKING
 * ------------------------------------------------------------------ */

// Number term ("1") exact match: "1st" ✓, "10" ✗. Baaki words substring se.
const termInHay = (hay, hayC, term) =>
  isNum(term)
    ? hay.split(" ").some((t) => t === term || t.replace(/(st|nd|rd|th)$/, "") === term)
    : hay.includes(term) || hayC.includes(term);

const hayOf = (item) =>
  normalize(`${item.label || item.name || ""} ${item.value || ""} ${item.catValue || ""}`);

export const catCovers = (c, term) => {
  const aliases = CATEGORY_ALIASES[c.catValue] || [];
  if (aliases.includes(term)) return true;
  if (isNum(term)) return false;
  const hay = hayOf(c);
  const words = hay.split(" ");
  if (words.some((w) => w === term || (term.length >= 3 && w.startsWith(term)))) return true;
  return term.length >= 5 && hay.replace(/ /g, "").includes(term);
};

// Enter par kaunsi category kholni hai. rest = category se bacha hua words
export const findCategoryForQuery = (q, categories) => {
  const tokens = tokensOf(q);
  if (!tokens.length || tokens.every((t) => STOPWORDS.has(t) || isNum(t))) return null;

  let best = null;
  for (const c of categories) {
    const covered = tokens.filter((t) => catCovers(c, t));
    if (!covered.length) continue;
    const hayWords = hayOf(c).split(" ");
    const exactWords = covered.filter((t) => hayWords.includes(t)).length;
    if (
      !best ||
      covered.length > best.covered ||
      (covered.length === best.covered && exactWords > best.exactWords)
    ) {
      best = {
        catValue: c.catValue,
        covered: covered.length,
        exactWords,
        rest: tokens.filter((t) => !covered.includes(t)),
      };
    }
  }
  return best && { catValue: best.catValue, exact: !best.rest.length, rest: best.rest };
};

// [{ label: "kids", term: "kid", generic: false }, ...]  (generic words last)
export const splitWords = (q) => {
  const seen = new Set();
  const out = [];
  for (const label of normalize(q).split(" ").filter(Boolean)) {
    const term = stem(label);
    const isFiller = STOPWORDS.has(term) && !GENERIC.has(term);
    if (isFiller || (term.length < 2 && !isNum(term)) || seen.has(term)) continue;
    seen.add(term);
    out.push({ label, term, generic: GENERIC.has(term) });
  }
  const real = out.filter((w) => !w.generic);
  // Sirf "decoration" likha ho to wo normal word maano
  return real.length
    ? [...real, ...out.filter((w) => w.generic)]
    : out.map((w) => ({ ...w, generic: false }));
};

const relatedHit = (term, value) =>
  RELATED_GROUPS.some(
    (g) =>
      g.themes.includes(value) &&
      g.keywords.some((k) => k === term || (term.length >= 3 && k.startsWith(term))),
  );

// Har term alag match hota hai, phir sab ek ranked list mein (zyada match = upar)
export function rankItems(query, categories, themes, limit = 20) {
  const words = splitWords(query);
  if (!words.length) return [];
  const hasReal = words.some((w) => !w.generic);

  const scoreOf = (item) => {
    const hay = hayOf(item);
    const hayC = hay.replace(/ /g, "");
    const aliases = CATEGORY_ALIASES[item.catValue] || [];
    let score = 0;
    let matched = 0;
    let real = 0;

    for (const w of words) {
      let s = 0;
      if (termInHay(hay, hayC, w.term)) s = w.generic ? 0.3 : 3;
      else if (aliases.includes(w.term)) s = 2;
      else if (!w.generic && item.value && relatedHit(w.term, item.value)) s = 1;
      if (s) {
        score += s;
        matched++;
        if (!w.generic) real++;
      }
    }
    // "decoration" akela kisi ko match na karaye jab baaki words bhi hon
    if (hasReal && !real) return 0;
    return score ? score + matched * 0.5 : 0;
  };

  const cats = categories.map((c) => ({ item: c, score: scoreOf(c), kind: 0 }));
  const catScore = {};
  cats.forEach((c) => {
    if (c.score >= 2) catScore[c.item.catValue] = c.score;
  });

  // Category match hui to uski themes bhi (thode neeche) aayengi
  const ths = themes.map((t) => ({
    item: t,
    score: Math.max(scoreOf(t), (catScore[t.cat] || 0) * 0.5),
    kind: 1,
  }));

  return [...cats, ...ths]
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.kind - b.kind)
    .slice(0, limit)
    .map((x) => x.item);
}