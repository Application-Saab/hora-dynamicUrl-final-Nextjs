import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { decCat, getServiceForCategory } from "@/utils/decorationCategories";
import { photoCat } from "@/utils/photoCategories";
import { smallCardCategories } from "@/utils/smallCardCategories";
import { NamingCeremonyThemes, themeFilters } from "@/utils/themeFilters";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import axiosApi from "@/utils/axiosApi";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
  GET_PHOTOGRAPHY_BY_TAG,
} from "@/utils/apiconstants";
import { designTypeOptions, sortOptions } from "@/components/SearchSortBar";
import {
  cleanQuery,
  splitWords,
  findCategoryForQuery,
  parseSearchQuery,
  catCovers,
  queryGroup, // NEW: searchRelated.js se export (neeche patch dekho)
} from "@/utils/searchRelated";

/* ------------------------------------------------------------------ *
 * CONFIG
 * ------------------------------------------------------------------ */
const DEFAULT_PARENT = "balloon-decoration";
const PHOTOGRAPHY_PARENT = "photography";
const WEDDING_PARENT = "wedding-decoration";

const WEDDING_PARENT_CATS = new Set([
  "haldi-decoration",
  "mehendi-decoration",
  "mandap-decoration",
  "wedding-car-decoration",
  "reception-decoration",
  "sangeet-decoration",
  "engagement-decoration",
  "first-night-decoration",
]);

const SEARCH_PRIORITY = [
  "kids-birthday-decoration",
  "birthday-decoration",
  "baby-shower-decoration",
  "premium-decoration",
  "welcome-baby-decoration",
  "anniversary-decoration",
];
const PHOTO_PRIORITY = [
  "birthday-photography",
  "wedding-photography",
  "anniversary-photography",
  "engagement-photography",
  "baby-shower-photography",
  "new-born-baby-photography",
  "pre-wedding",
];
const MAX_SEARCH_CATS = 2;
const SEARCH_DEBOUNCE = 350;
const SEARCH_CACHE_LIMIT = 50;
const LANDING_LIMIT = 6;
const SCOPED_LIMIT = 10;
const PRICE_SORTS = ["newArrival", "lowToHigh", "highToLow"];

const PHOTO_STRIP_RE =
  /\b(?:photo|photos|photography|photographer|photographers|photoshoot|photoshoots|shoot|shoots)\b/gi;

/* ------------------------------------------------------------------ *
 * SMALL HELPERS
 * ------------------------------------------------------------------ */
const slugify = (val) => String(val || "").trim().toLowerCase().replace(/\s+/g, "-");

const toTitle = (s) =>
  String(s || "").trim().replace(/\s+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const photoSlug = (text) =>
  String(text || "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").toLowerCase();

const labelOfDesign = (id) => designTypeOptions.find((o) => o.id === id)?.label || id;

const isPhotoQuery = (text, onPhotoPage) =>
  queryGroup(text, onPhotoPage ? "photography" : "decoration") === "photography";

const fmtPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const priceLabel = (min, max) =>
  min != null && max != null
    ? `${fmtPrice(min)} – ${fmtPrice(max)}`
    : max != null
      ? `Under ${fmtPrice(max)}`
      : `Above ${fmtPrice(min)}`;

const hasPriceOrSort = (p) => p.minPrice != null || p.maxPrice != null || !!p.sort;

const filterLabelsOf = (parsed) => {
  const out = parsed.designTypes.map(labelOfDesign);
  if (parsed.minPrice != null || parsed.maxPrice != null) {
    out.push(priceLabel(parsed.minPrice, parsed.maxPrice));
  }
  if (parsed.sort) {
    out.push(sortOptions.find((o) => o.id === parsed.sort)?.label || parsed.sort);
  }
  return out;
};

const SORT_TEXT = { lowToHigh: "low to high", highToLow: "high to low", newArrival: "new arrival" };
const canonicalFilterText = (parsed) => {
  const { minPrice: min, maxPrice: max } = parsed;
  let price = "";
  if (min != null && max != null) price = `between ${min} and ${max}`;
  else if (max != null) price = `under ${max}`;
  else if (min != null) price = `above ${min}`;
  return [...parsed.designTypes.map(labelOfDesign), price, SORT_TEXT[parsed.sort] || ""]
    .filter(Boolean)
    .join(" ");
};

// ?search=... ke saath url
const withSearch = (path, search) =>
  `${path}${search ? `?search=${encodeURIComponent(search)}` : ""}`;

// Sabse zyada baar aane wali key (View More par best category chunne ke liye)
const mostCommon = (items, keyOf, fallback) => {
  const counts = {};
  items.forEach((i) => {
    const k = keyOf(i);
    if (k) counts[k] = (counts[k] || 0) + 1;
  });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || fallback;
};

// Same product ko dedupe karke, kitne terms mein mila (_hits) gino
const mergeByHits = (lists) => {
  const merged = new Map();
  lists.flat().forEach((p) => {
    const k = p._id || p.slug || p.name;
    const prev = merged.get(k);
    if (prev) prev._hits += 1;
    else merged.set(k, { ...p, _hits: 1 });
  });
  return [...merged.values()].sort((a, b) => b._hits - a._hits);
};

/* ------------------------------------------------------------------ *
 * RESULT CACHE (pages ke beech bhi bacha rehta hai)
 * ------------------------------------------------------------------ */
const resultCache = new Map();
const cachePut = (key, value) => {
  if (resultCache.size >= SEARCH_CACHE_LIMIT) {
    resultCache.delete(resultCache.keys().next().value);
  }
  resultCache.set(key, value);
};

/* ------------------------------------------------------------------ *
 * CATEGORY DATA (module level: ek hi baar banta hai)
 * ------------------------------------------------------------------ */
const parentFor = (cv, currentService) =>
  WEDDING_PARENT_CATS.has(cv)
    ? WEDDING_PARENT
    : getServiceForCategory(cv, currentService || DEFAULT_PARENT);

// Duplicate / trailing space / capital `Image` / uppercase catValue saaf
export const SEARCH_CATEGORIES = (() => {
  const seen = new Set();
  return decCat.reduce((acc, c) => {
    const catValue = String(c.catValue || "").trim().toLowerCase();
    if (!catValue || seen.has(catValue)) return acc;
    seen.add(catValue);
    acc.push({
      name: toTitle(c.name),
      catValue,
      subCategory: String(c.subCategory || "").trim(),
      image: String(c.image || c.Image || "").trim(),
    });
    return acc;
  }, []);
})();
const CAT_BY_VALUE = new Map(SEARCH_CATEGORIES.map((c) => [c.catValue, c]));

export const PHOTO_CATEGORIES = (() => {
  const seen = new Set();
  return photoCat.reduce((acc, c) => {
    const slug = String(c.slug || "").trim().toLowerCase();
    const label = toTitle(String(c.name || "").replace(/-/g, " "));
    const key = label.toLowerCase();
    if (!slug || !label || seen.has(key)) return acc;
    seen.add(key);
    acc.push({ slug, label, image: c.image || undefined });
    return acc;
  }, []);
})();
const PHOTO_SLUGS = new Set(PHOTO_CATEGORIES.map((c) => c.slug));
const PHOTO_LABEL = new Map(PHOTO_CATEGORIES.map((c) => [c.slug, c.label]));
const PHOTO_MATCH = PHOTO_CATEGORIES.map((c) => ({ name: c.label, catValue: c.slug }));
const PHOTO_MATCH_BY_SLUG = new Map(PHOTO_MATCH.map((c) => [c.catValue, c]));

const PHOTO_API_NAME = {
  "pre-wedding": "PreWeddingPhotography",
  "haldi-mehndi": "HaldiMehendiPhotography",
  wedding: "wedding-photography",
};
const photoApiName = (slug) => PHOTO_API_NAME[slug] || slug;

const SEARCH_THEMES = [
  ...themeFilters.map((t) => ({ ...t, cat: "kids-birthday-decoration" })),
  ...NamingCeremonyThemes.map((t) => ({ ...t, cat: "naming-ceremony-decoration" })),
];

const PRICE_SEARCH_CATS = SEARCH_PRIORITY.slice(0, 4)
  .map((cv) => CAT_BY_VALUE.get(cv))
  .filter(Boolean);

/* ------------------------------------------------------------------ *
 * API LAYER
 * ------------------------------------------------------------------ */
// Photography: search/price params nahi hain => category ke saare products ek baar, phir local filter
const photoProductPromises = new Map();
const getPhotoProducts = (slug) => {
  if (!photoProductPromises.has(slug)) {
    const p = axiosApi
      .get(`${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(photoApiName(slug))}`)
      .then((r) => r.data?.data?._id || null)
      .then((catId) =>
        catId ? axiosApi.get(`${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${catId}`) : null,
      )
      .then((r) =>
        (r?.data?.data || []).map((item) => ({
          ...item,
          _group: "photography",
          _catValue: slug,
          _catLabel: PHOTO_LABEL.get(slug) || "",
        })),
      )
      .catch(() => {
        photoProductPromises.delete(slug);
        return [];
      });
    photoProductPromises.set(slug, p);
  }
  return photoProductPromises.get(slug);
};

const catIdPromises = new Map();
const getCatId = (c) => {
  if (!c.subCategory) return Promise.resolve(null);
  if (!catIdPromises.has(c.catValue)) {
    const p = axiosApi
      .get(BASE_URL + GET_DECORATION_CAT_ID + c.subCategory)
      .then((res) => res.data?.data?._id || null)
      .catch(() => null)
      .then((id) => {
        if (!id) catIdPromises.delete(c.catValue);
        return id;
      });
    catIdPromises.set(c.catValue, p);
  }
  return catIdPromises.get(c.catValue);
};

const pickSearchCategories = (term, limit = MAX_SEARCH_CATS) => {
  const t = term.toLowerCase();
  const score = (c) => {
    if (`${c.name} ${c.catValue}`.toLowerCase().includes(t)) return 0;
    const i = SEARCH_PRIORITY.indexOf(c.catValue);
    return i === -1 ? 100 : i + 1;
  };
  return [...SEARCH_CATEGORIES].sort((a, b) => score(a) - score(b)).slice(0, limit);
};

const pickPhotoSlugs = (terms) => {
  if (!terms.length) {
    return PHOTO_PRIORITY.filter((sl) => PHOTO_SLUGS.has(sl)).slice(0, 4);
  }
  const named = PHOTO_CATEGORIES.filter((c) =>
    terms.some((t) => `${c.label} ${c.slug}`.toLowerCase().includes(t)),
  ).map((c) => c.slug);
  const namedSet = new Set(named);
  return [...named, ...PHOTO_CATEGORIES.map((c) => c.slug).filter((sl) => !namedSet.has(sl))];
};

/* ------------------------------------------------------------------ *
 * PHOTOGRAPHY SEARCH (pure functions)
 * ------------------------------------------------------------------ */
const PRODUCT_SKIP_KEYS = new Set([
  "_id", "__v", "createdAt", "updatedAt", "featured_image", "featured_images",
  "images", "image", "url", "price", "discount", "discountedPrice", "discountDifference",
]);

// Har product ka text ek hi baar banta hai (WeakMap cache)
const textCache = new WeakMap();
const searchableText = (p) => {
  const hit = textCache.get(p);
  if (hit !== undefined) return hit;

  const out = [p._catLabel || ""];
  Object.entries(p).forEach(([k, v]) => {
    if (PRODUCT_SKIP_KEYS.has(k) || (k.startsWith("_") && k !== "_catLabel")) return;
    if (typeof v === "string" && v.length < 4000) out.push(v);
    else if (Array.isArray(v)) {
      v.forEach((x) => {
        if (typeof x === "string") out.push(x);
        else if (x && typeof x === "object") {
          ["name", "title", "label", "value"].forEach((f) => {
            if (typeof x[f] === "string") out.push(x[f]);
          });
        }
      });
    }
  });
  const text = out.join(" ").replace(/<[^>]+>/g, " ").toLowerCase();
  textCache.set(p, text);
  return text;
};

// Query -> photography plan: filters, category hit, aur product terms
const planPhotoSearch = (value) => {
  const pp = parseSearchQuery(value, []); // design types photography mein nahi hote
  const cleanedRest = pp.rest.replace(PHOTO_STRIP_RE, " ").replace(/\s+/g, " ").trim();
  const words = splitWords(cleanedRest);
  const hit = cleanedRest ? findCategoryForQuery(cleanedRest, PHOTO_MATCH) : null;
  const hitItem = hit ? PHOTO_MATCH_BY_SLUG.get(hit.catValue) || null : null;
  const remaining = hitItem ? words.filter((w) => !catCovers(hitItem, w.term)) : words;
  const terms = remaining.filter((w) => !w.generic).slice(0, 3).map((w) => w.term);
  return { pp, hasPF: hasPriceOrSort(pp), hitItem, terms };
};

const runPhotoSearch = async ({ pp, hitItem, terms }) => {
  const slugs = hitItem ? [hitItem.catValue] : pickPhotoSlugs(terms);
  const lists = await Promise.all(slugs.map(getPhotoProducts));

  const priceOf = (p) => Number(p.price) || 0;
  const seen = new Set();
  let items = lists
    .flat()
    .filter((p) => {
      const k = p._id || p.slug || p.name;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((p) => {
      const hay = searchableText(p);
      return { ...p, _hits: terms.filter((t) => hay.includes(t)).length };
    });

  if (terms.length) {
    const matched = items.filter((p) => p._hits > 0);
    // Category naam diya par word kisi product mein nahi => us category ke saare products
    items = matched.length || !hitItem ? matched : items;
  }
  if (pp.minPrice != null) items = items.filter((p) => priceOf(p) >= pp.minPrice);
  if (pp.maxPrice != null) items = items.filter((p) => priceOf(p) <= pp.maxPrice);

  const bySort = (x, y) =>
    pp.sort === "lowToHigh"
      ? priceOf(x) - priceOf(y)
      : pp.sort === "highToLow"
        ? priceOf(y) - priceOf(x)
        : pp.sort === "newArrival"
          ? new Date(y.createdAt || 0) - new Date(x.createdAt || 0)
          : 0;

  return items.sort((x, y) => y._hits - x._hits || bySort(x, y)).slice(0, SCOPED_LIMIT);
};

/* ------------------------------------------------------------------ *
 * DECORATION SEARCH (pure function)
 * ------------------------------------------------------------------ */
const runDecoSearch = async ({
  terms, scoped, currentCat, target, filtersOn, minPrice, maxPrice, sortBy, designApi, signal,
}) => {
  const catsFor = (term) => {
    if (scoped) return [currentCat];
    if (target) {
      if (!term) return [target];
      return [
        target,
        ...pickSearchCategories(term).filter((c) => c.catValue !== target.catValue),
      ].slice(0, MAX_SEARCH_CATS);
    }
    return term ? pickSearchCategories(term) : PRICE_SEARCH_CATS;
  };

  const fetchCat = async (c, term) => {
    const catId = await getCatId(c);
    if (!catId || signal.aborted) return [];

    const params = { limit: target ? SCOPED_LIMIT : LANDING_LIMIT, page: 1 };
    if (term) params.search = term;
    // Filters sirf target category par lagte hain
    if (filtersOn && (!target || c.catValue === target.catValue)) {
      if (minPrice != null) params.minPrice = minPrice;
      if (maxPrice != null) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;
      if (designApi.length) params.designType = designApi.join(",");
    }

    const res = await axiosApi.get(`${BASE_URL + GET_DECORATION_CAT_ITEM}v3/${catId}`, {
      params,
      signal,
    });
    return (res.data?.data || []).map((p) => ({ ...p, _catValue: c.catValue }));
  };

  const perTerm = await Promise.all(
    terms.map(async (term) => {
      const results = await Promise.allSettled(catsFor(term).map((c) => fetchCat(c, term)));
      return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
    }),
  );
  return mergeByHits(perTerm);
};

/* ------------------------------------------------------------------ *
 * HOOK
 * ------------------------------------------------------------------ */
export default function useGlobalSearch({
  city,
  locality,
  // eslint-disable-next-line no-unused-vars
  smartFilters = false, // purane callers ke liye accept hota hai, hook mein use nahi
  catValue = null,
  service = null,
} = {}) {
  const router = useRouter();

  const isPhotoPage = useMemo(() => {
    if (service) return service === "photography";
    return String(router.asPath || "")
      .split("?")[0]
      .split("/")
      .filter(Boolean)
      .map((x) => x.toLowerCase())
      .some((x) => x === PHOTOGRAPHY_PARENT || PHOTO_SLUGS.has(x));
  }, [service, router.asPath]);

  const pathSlug = useMemo(
    () => getCategorySlugFromPath(router.asPath, city, locality),
    [router.asPath, city, locality],
  );
  const baseSlug = !pathSlug || pathSlug === WEDDING_PARENT ? DEFAULT_PARENT : pathSlug;

  const prefix = `${city ? "/" + String(city).toLowerCase() : ""}${
    locality ? "/" + String(locality).toLowerCase() : ""
  }`;

  const parentOf = useCallback((cv) => parentFor(cv, baseSlug), [baseSlug]);

  // Category page par current category (prop se, nahi to URL se)
  const currentCat = useMemo(() => {
    const explicit = catValue ? String(catValue).trim().toLowerCase() : "";
    if (explicit && CAT_BY_VALUE.has(explicit)) return CAT_BY_VALUE.get(explicit);

    const seg = String(router.asPath || "")
      .split("?")[0]
      .split("/")
      .filter(Boolean)
      .map((s) => s.toLowerCase())
      .find((s) => CAT_BY_VALUE.has(s));
    return seg ? CAT_BY_VALUE.get(seg) : null;
  }, [catValue, router.asPath]);

  const scoped = !!currentCat;

  const searchCategoryList = useMemo(() => {
    const localImages = Object.fromEntries(
      smallCardCategories.map((c) => [c.catValue, c.image]),
    );

    const cats = SEARCH_CATEGORIES.map((c) => ({
      id: `cat-${c.catValue}`,
      kind: "category",
      group: "decoration",
      catValue: c.catValue,
      label: c.name,
      image: c.image || localImages[c.catValue] || undefined,
      href: `${prefix}/${parentOf(c.catValue)}/${c.catValue}`,
    }));

    const themes = SEARCH_THEMES.map((t) => {
      const value = String(t.value).trim();
      return {
        id: `theme-${t.cat}-${value}`,
        kind: "theme",
        group: "decoration",
        value,
        cat: t.cat,
        label: `${String(t.label).trim()} Theme`,
        image: t.image,
        href: `${prefix}/${baseSlug}/${t.cat}/${value}`,
      };
    });

    const photos = PHOTO_CATEGORIES.map((c) => ({
      id: `photo-${c.slug}`,
      kind: "category",
      group: "photography",
      catValue: c.slug,
      label: c.label,
      keywords: "photoshoot photographer photo shoot",
      image: c.image,
      href: `${prefix}/${PHOTOGRAPHY_PARENT}/${c.slug}`,
    }));

    return isPhotoPage ? [...photos, ...cats, ...themes] : [...cats, ...photos, ...themes];
  }, [prefix, baseSlug, parentOf, isPhotoPage]);

  // Landing par design/price/sort likha ho to category puchhne ke liye
  const [pendingFilter, setPendingFilter] = useState(null);
  const [filterLabels, setFilterLabels] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchReq = useRef(0);
  const searchTimer = useRef(null);
  const searchAbort = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(searchTimer.current);
      searchAbort.current?.abort();
    },
    [],
  );

  const resolveTarget = useCallback(
    (rest) => {
      if (scoped) return currentCat;
      const hit = rest ? findCategoryForQuery(rest, SEARCH_CATEGORIES) : null;
      return hit ? CAT_BY_VALUE.get(hit.catValue) || null : null;
    },
    [scoped, currentCat],
  );

  const handleQueryChange = useCallback(
    (value) => {
      clearTimeout(searchTimer.current);
      searchAbort.current?.abort();
      const id = ++searchReq.current;

      const finish = (items) => {
        setSearchProducts(items);
        setSearchLoading(false);
      };

      // debounce + abort + stale-request check + cache write: dono modes ke liye ek jagah
      const schedule = (key, work) => {
        setSearchLoading(true);
        searchTimer.current = setTimeout(async () => {
          const controller = new AbortController();
          searchAbort.current = controller;
          const items = await work(controller.signal);
          if (id !== searchReq.current) return;
          cachePut(key, items);
          finish(items);
        }, SEARCH_DEBOUNCE);
      };

      /* ---------- PHOTOGRAPHY MODE ---------- */
      if (isPhotoQuery(value, isPhotoPage)) {
        const plan = planPhotoSearch(value);
        const { pp, hasPF, hitItem, terms } = plan;
        setPendingFilter(null);
        setFilterLabels(hasPF ? filterLabelsOf(pp) : []);

        // Sirf "photography" likha: products nahi, categories dikhte hain
        if (!hasPF && !hitItem && !terms.length) return finish([]);

        const key = [
          "photo",
          hitItem?.catValue || "*",
          terms.join("|"),
          `${pp.minPrice ?? ""}-${pp.maxPrice ?? ""}`,
          pp.sort || "",
        ].join("#");

        const cached = resultCache.get(key);
        if (cached) return finish(cached);

        return schedule(key, () => runPhotoSearch(plan));
      }

      /* ---------- DECORATION MODE ---------- */
      const parsed = parseSearchQuery(value, designTypeOptions);
      const hasFilter = parsed.designTypes.length > 0 || hasPriceOrSort(parsed);
      const target = resolveTarget(parsed.rest);
      const words = splitWords(parsed.rest);
      const remaining = target ? words.filter((w) => !catCovers(target, w.term)) : words;
      const real = remaining.filter((w) => !w.generic);
      const labels = filterLabelsOf(parsed);

      // Landing + filter + category nahi bataya => category puchho
      if (!scoped && hasFilter && !target) {
        setPendingFilter({
          search: [canonicalFilterText(parsed), cleanQuery(parsed.rest) || parsed.rest]
            .filter(Boolean)
            .join(" "),
          labels,
          hint:
            parsed.designTypes.length > 0
              ? "Choose the category where you want this design."
              : "Choose the category where you want to see these products.",
        });
        setFilterLabels([]);
        return finish([]);
      }
      setPendingFilter(null);
      setFilterLabels(hasFilter ? labels : []);

      const shouldSearch = scoped
        ? real.length > 0 || hasFilter
        : target || remaining.length > 0 || hasFilter;
      if (!shouldSearch) return finish([]);

      const filtersOn = !!target || (!scoped && hasFilter);
      const designApi = filtersOn
        ? parsed.designTypes
            .map((d) => designTypeOptions.find((o) => o.id === d)?.apiValue)
            .filter(Boolean)
        : [];
      const minPrice = filtersOn ? parsed.minPrice : null;
      const maxPrice = filtersOn ? parsed.maxPrice : null;
      const sortBy = filtersOn && PRICE_SORTS.includes(parsed.sort) ? parsed.sort : null;

      const textTerms = (target ? real : real.length ? real : remaining)
        .slice(0, 3)
        .map((w) => w.term);
      const terms = textTerms.length ? textTerms : [null];

      const key = [
        target ? target.catValue : "*",
        scoped ? "s" : "l",
        terms.join("|"),
        `${minPrice ?? ""}-${maxPrice ?? ""}`,
        sortBy || "",
        designApi.join(","),
      ].join("#");

      const cached = resultCache.get(key);
      if (cached) return finish(cached);

      schedule(key, (signal) =>
        runDecoSearch({
          terms, scoped, currentCat, target, filtersOn, minPrice, maxPrice, sortBy, designApi, signal,
        }),
      );
    },
    [scoped, currentCat, resolveTarget, isPhotoPage],
  );

  // Landing par category chunne ki list (href mein ?search= ke saath)
  const designPicker = useMemo(() => {
    if (!pendingFilter) return null;
    const q = pendingFilter.search ? `?search=${encodeURIComponent(pendingFilter.search)}` : "";
    const items = searchCategoryList
      .filter((c) => c.kind === "category" && c.group === "decoration")
      .map((c) => ({ ...c, href: `${c.href}${q}` }));
    return { labels: pendingFilter.labels, hint: pendingFilter.hint, items };
  }, [pendingFilter, searchCategoryList]);

  const getCategoryHref = useCallback((item) => item?.href || "#", []);

  const getProductHref = useCallback(
    (p) => {
      if (!p) return "#";
      if (p._group === "photography") {
        const ps = photoSlug(p.name);
        return ps ? `/${PHOTOGRAPHY_PARENT}/product/${ps}` : "#";
      }
      const slug = p.slug || p.product_slug || (p.name ? slugify(p.name) : "");
      return slug ? `/${parentOf(p._catValue)}/product/${slug}` : "#";
    },
    [parentOf],
  );

  const openSearchCategory = useCallback(
    (item) => {
      if (item?.href) router.push(item.href);
    },
    [router],
  );

  // View More
  const handleSearchSubmit = useCallback(
    (q) => {
      const text = String(q || "").trim();
      if (!text) return;

      // Photography: jis category ke dropdown mein sabse zyada products, uska page
      if (isPhotoQuery(text, isPhotoPage)) {
        const best = mostCommon(
          searchProducts,
          (pr) => pr._group === "photography" && pr._catValue,
          null,
        );
        if (best) router.push(`${prefix}/${PHOTOGRAPHY_PARENT}/${best}`);
        return;
      }

      const p = parseSearchQuery(text, designTypeOptions);
      const target = resolveTarget(p.rest);

      if (target) {
        const restWords = splitWords(p.rest)
          .filter((w) => !w.generic && !catCovers(target, w.term))
          .map((w) => w.term)
          .join(" ");
        const search = [canonicalFilterText(p), restWords].filter(Boolean).join(" ");

        const path = `${prefix}/${parentOf(target.catValue)}/${target.catValue}`;
        const url = withSearch(path, search);

        if (router.asPath.split("?")[0].toLowerCase() === path.toLowerCase()) {
          router.push(url, undefined, { shallow: true, scroll: false });
        } else {
          router.push(url);
        }
        return;
      }

      // Landing, category nahi mili: dropdown ke products jis category mein zyada hain
      const catV = mostCommon(searchProducts, (pr) => pr._catValue, "birthday-decoration");
      const search = [canonicalFilterText(p), cleanQuery(p.rest) || p.rest]
        .filter(Boolean)
        .join(" ");
      router.push(withSearch(`${prefix}/${parentOf(catV)}/${catV}`, search));
    },
    [router, prefix, parentOf, searchProducts, resolveTarget, isPhotoPage],
  );

  return {
    searchCategoryList,
    searchProducts,
    searchLoading,
    designPicker,
    filterLabels,
    primaryGroup: isPhotoPage ? "photography" : "decoration",
    handleQueryChange,
    handleSearchSubmit,
    getCategoryHref,
    getProductHref,
    openSearchCategory,
  };
}