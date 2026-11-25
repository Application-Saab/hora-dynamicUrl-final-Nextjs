import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { decCat, getServiceForCategory } from "@/utils/decorationCategories";
import { smallCardCategories } from "@/utils/smallCardCategories";
import { NamingCeremonyThemes, themeFilters } from "@/utils/themeFilters";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import axiosApi from "@/utils/axiosApi";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
} from "@/utils/apiconstants";
import { designTypeOptions, sortOptions } from "@/components/SearchSortBar";
import {
  cleanQuery,
  splitWords,
  findCategoryForQuery,
  parseSearchQuery,
  catCovers,
} from "@/utils/searchRelated";

/* ------------------------------------------------------------------ *
 * CONFIG
 * ------------------------------------------------------------------ */
const DEFAULT_PARENT = "balloon-decoration";
const WEDDING_PARENT = "wedding-decoration";

// Ye categories /wedding-decoration/<catValue> ke andar aati hain (baaki balloon-decoration ke).
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

// Jin categories mein sabse zyada products hote hain, unhe pehle search karo
const SEARCH_PRIORITY = [
  "kids-birthday-decoration",
  "birthday-decoration",
  "baby-shower-decoration",
  "premium-decoration",
  "welcome-baby-decoration",
  "anniversary-decoration",
];
const MAX_SEARCH_CATS = 2; // landing: ek term ke liye max itni categories hit hongi
const SEARCH_DEBOUNCE = 350; // ms
const SEARCH_CACHE_LIMIT = 50; // max cached searches
const LANDING_LIMIT = 6; // landing: per category per term
const SCOPED_LIMIT = 10; // category page: dropdown mein 5 se zyada aaye taaki View More dikhe
const PRICE_SORTS = ["newArrival", "lowToHigh", "highToLow"];

/* ------------------------------------------------------------------ *
 * MODULE-LEVEL DATA (sirf ek baar banta hai, sab pages share karte hain)
 * ------------------------------------------------------------------ */
const slugify = (val) =>
  String(val || "").trim().toLowerCase().replace(/\s+/g, "-");

const toTitle = (s) =>
  String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const labelOfDesign = (id) =>
  designTypeOptions.find((o) => o.id === id)?.label || id;

const fmtPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const priceLabel = (min, max) =>
  min != null && max != null
    ? `${fmtPrice(min)} – ${fmtPrice(max)}`
    : max != null
      ? `Under ${fmtPrice(max)}`
      : `Above ${fmtPrice(min)}`;

// Query se nikle filters ke readable labels: ["Ring", "Under ₹2,000", "Price: Low To High"]
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

// Filters ko standard text mein badlo: category page ka parser ise hamesha samajhta hai,
// user ne chahe "3000 tak", "price 3000" ya "3k" kuch bhi likha ho.
const SORT_TEXT = {
  lowToHigh: "low to high",
  highToLow: "high to low",
  newArrival: "new arrival",
};
const canonicalFilterText = (parsed) => {
  const { minPrice: min, maxPrice: max } = parsed;
  let price = "";
  if (min != null && max != null) price = `between ${min} and ${max}`;
  else if (max != null) price = `under ${max}`;
  else if (min != null) price = `above ${min}`;
  return [
    ...parsed.designTypes.map(labelOfDesign),
    price,
    SORT_TEXT[parsed.sort] || "",
  ]
    .filter(Boolean)
    .join(" ");
};

// Category kis service ke andar khulti hai: wedding wali fixed, baaki decCat ke `services` se
// (festival categories /festivals-decoration par, current service mein ho to wahi).
const parentFor = (cv, currentService) =>
  WEDDING_PARENT_CATS.has(cv)
    ? WEDDING_PARENT
    : getServiceForCategory(cv, currentService || DEFAULT_PARENT);

// decCat me duplicate, trailing space, capital `Image` aur uppercase catValue
// ho sakte hain -- sab yahan saaf ho jaate hain.
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

const SEARCH_THEMES = [
  ...themeFilters.map((t) => ({ ...t, cat: "kids-birthday-decoration" })),
  ...NamingCeremonyThemes.map((t) => ({
    ...t,
    cat: "naming-ceremony-decoration",
  })),
];

// Promise cache: same category ki ID ek hi baar fetch hogi,
// chahe 2 calls ek saath aayein. Fail hone par retry ho sakta hai.
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

// Naam se match wali pehle, phir priority list, baaki last. Sirf top `limit`.
const pickSearchCategories = (term, limit = MAX_SEARCH_CATS) => {
  const t = term.toLowerCase();
  const score = (c) => {
    if (`${c.name} ${c.catValue}`.toLowerCase().includes(t)) return 0;
    const i = SEARCH_PRIORITY.indexOf(c.catValue);
    return i === -1 ? 100 : i + 1;
  };
  return [...SEARCH_CATEGORIES]
    .sort((a, b) => score(a) - score(b))
    .slice(0, limit);
};

// Sirf price/sort likha ho (text nahi): in popular categories mein products dhundho
const PRICE_SEARCH_CATS = SEARCH_PRIORITY.slice(0, 4)
  .map((cv) => SEARCH_CATEGORIES.find((c) => c.catValue === cv))
  .filter(Boolean);

// Search results ka cache (pages ke beech bhi bacha rehta hai)
const resultCache = new Map();

/* ------------------------------------------------------------------ *
 * HOOK
 * ------------------------------------------------------------------ */
export default function useGlobalSearch({
  city,
  locality,
  smartFilters = false,
  catValue = null, // category page par current category
} = {}) {
  const router = useRouter();

  // Current page ke path se parent slug (wedding page par bhi dusri categories sahi jaayein)
  const pathSlug = useMemo(
    () => getCategorySlugFromPath(router.asPath, city, locality),
    [router.asPath, city, locality],
  );
  const baseSlug =
    !pathSlug || pathSlug === WEDDING_PARENT ? DEFAULT_PARENT : pathSlug;

  const prefix = `${city ? "/" + String(city).toLowerCase() : ""}${
    locality ? "/" + String(locality).toLowerCase() : ""
  }`;

  const parentOf = useCallback((cv) => parentFor(cv, baseSlug), [baseSlug]);

  // Category page par current category (SEARCH_CATEGORIES se); nahi mili => landing jaisa behave
  // Pehle prop se, nahi to URL se (/balloon-decoration/kids-birthday-decoration).
  const currentCat = useMemo(() => {
    const find = (v) => SEARCH_CATEGORIES.find((c) => c.catValue === v) || null;

    const explicit = catValue ? String(catValue).trim().toLowerCase() : "";
    if (explicit && find(explicit)) return find(explicit);

    const segs = String(router.asPath || "")
      .split("?")[0]
      .split("/")
      .filter(Boolean)
      .map((s) => s.toLowerCase());
    const seg = segs.find((s) => find(s));
    return seg ? find(seg) : null;
  }, [catValue, router.asPath]);

  // scoped = kisi category ke page par ho: filters + isi category ke products.
  // Landing (/balloon-decoration) par category nahi hoti, wahan picker aata hai.
  const scoped = !!currentCat;

  // Category + Theme list (local data, turant match hoti hai)
  const searchCategoryList = useMemo(() => {
    const localImages = smallCardCategories.reduce((m, c) => {
      m[c.catValue] = c.image;
      return m;
    }, {});

    const cats = SEARCH_CATEGORIES.map((c) => ({
      id: `cat-${c.catValue}`,
      kind: "category",
      catValue: c.catValue,
      label: c.name,
      image: c.image || localImages[c.catValue] || undefined,
      href: `${prefix}/${parentFor(c.catValue, baseSlug)}/${c.catValue}`,
    }));

    const themes = SEARCH_THEMES.map((t) => {
      const value = String(t.value).trim();
      return {
        id: `theme-${t.cat}-${value}`,
        kind: "theme",
        value,
        cat: t.cat,
        label: `${String(t.label).trim()} Theme`,
        image: t.image,
        href: `${prefix}/${baseSlug}/${t.cat}/${value}`,
      };
    });

    return [...cats, ...themes];
  }, [prefix, baseSlug]);

  // Landing par design/price/sort likha ho to yahan aata hai (products nahi)
  // { search: "ring under 2000", labels: ["Ring", "under 2000"], hitCat }
  const [pendingFilter, setPendingFilter] = useState(null);
  // Dropdown ke Products header mein dikhane ke liye: ["Under ₹2,000"]
  const [filterLabels, setFilterLabels] = useState([]);

  // Products: backend se live
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

  // Query se category pehchano: category page par current category, landing par query ke naam se.
  const resolveTarget = useCallback(
    (rest) => {
      if (scoped) return currentCat;
      const hit = rest ? findCategoryForQuery(rest, SEARCH_CATEGORIES) : null;
      return hit ? SEARCH_CATEGORIES.find((c) => c.catValue === hit.catValue) || null : null;
    },
    [scoped, currentCat],
  );

  const handleQueryChange = useCallback(
    (value) => {
      const parsed = parseSearchQuery(value, designTypeOptions);
      clearTimeout(searchTimer.current);
      searchAbort.current?.abort(); // purani request network se cancel
      const id = ++searchReq.current;

      const hasFilter =
        parsed.designTypes.length > 0 ||
        parsed.minPrice != null ||
        parsed.maxPrice != null ||
        !!parsed.sort;

      const target = resolveTarget(parsed.rest); // category jisme products dhundhne hain
      const words = splitWords(parsed.rest);
      // Category ke naam wale words ("kids", "birthday") product search term nahi bante
      const remaining = target ? words.filter((w) => !catCovers(target, w.term)) : words;
      const real = remaining.filter((w) => !w.generic);

      const labels = filterLabelsOf(parsed);

      /* ---------- LANDING + design / price / sort + category nahi bataya => category puchho ---------- */
      if (!scoped && hasFilter && !target) {
        const search = [
          canonicalFilterText(parsed),
          cleanQuery(parsed.rest) || parsed.rest,
        ]
          .filter(Boolean)
          .join(" ");

        setPendingFilter({
          search,
          labels,
          hint:
            parsed.designTypes.length > 0
              ? "Choose the category where you want this design."
              : "Choose the category where you want to see these products.",
        });
        setFilterLabels([]);
        setSearchProducts([]);
        setSearchLoading(false);
        return;
      }
      setPendingFilter(null);
      setFilterLabels(hasFilter ? labels : []);

      // Search karna hai ya nahi
      //  - category page: text ya filter ho
      //  - landing + query mein category ka naam: hamesha (us category ke products)
      //  - landing, category nahi: koi word bacha ho
      const shouldSearch = scoped
        ? real.length > 0 || hasFilter
        : target
          ? true
          : remaining.length > 0 || hasFilter; // landing: price/sort akela bhi chalega

      if (!shouldSearch) {
        setSearchProducts([]);
        setSearchLoading(false);
        return;
      }

      // Filters API params bante hain jab category pata ho, ya landing par price/sort likha ho
      const filtersOn = !!target || (!scoped && hasFilter);
      const designApi = filtersOn
        ? parsed.designTypes
            .map((d) => designTypeOptions.find((o) => o.id === d)?.apiValue)
            .filter(Boolean)
        : [];
      const minPrice = filtersOn ? parsed.minPrice : null;
      const maxPrice = filtersOn ? parsed.maxPrice : null;
      const sortBy = filtersOn && PRICE_SORTS.includes(parsed.sort) ? parsed.sort : null;

      // "decoration" jaise generic words ka product search nahi (sab match ho jaata hai).
      // Category pata ho to bacha hua real word hi term; nahi to purana behaviour.
      const textTerms = (target ? real : real.length ? real : remaining)
        .slice(0, 3)
        .map((w) => w.term);
      // Sirf category/filter ho (text nahi) to ek hi request, bina search term
      const terms = textTerms.length ? textTerms : [null];

      const key = [
        target ? target.catValue : "*",
        scoped ? "s" : "l",
        terms.join("|"),
        `${minPrice ?? ""}-${maxPrice ?? ""}`,
        sortBy || "",
        designApi.join(","),
      ].join("#");

      // Cache hit: API call nahi, turant result
      if (resultCache.has(key)) {
        setSearchProducts(resultCache.get(key));
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      searchTimer.current = setTimeout(async () => {
        const controller = new AbortController();
        searchAbort.current = controller;

        const perTerm = await Promise.all(
          terms.map(async (term) => {
            let cats;
            if (scoped) {
              cats = [currentCat]; // category page: sirf isi category ke products
            } else if (target) {
              // Landing: query wali category pehle, phir term ke hisaab se baaki
              cats = term
                ? [
                    target,
                    ...pickSearchCategories(term, MAX_SEARCH_CATS).filter(
                      (c) => c.catValue !== target.catValue,
                    ),
                  ].slice(0, MAX_SEARCH_CATS)
                : [target];
            } else if (term) {
              cats = pickSearchCategories(term, MAX_SEARCH_CATS);
            } else {
              cats = PRICE_SEARCH_CATS; // price/sort only
            }

            const results = await Promise.allSettled(
              cats.map(async (c) => {
                const catId = await getCatId(c);
                if (!catId || controller.signal.aborted) return [];

                const params = {
                  limit: target ? SCOPED_LIMIT : LANDING_LIMIT,
                  page: 1,
                };
                if (term) params.search = term;
                // Filters sirf target category par lagte hain
                if (filtersOn && (!target || c.catValue === target.catValue)) {
                  if (minPrice != null) params.minPrice = minPrice;
                  if (maxPrice != null) params.maxPrice = maxPrice;
                  if (sortBy) params.sortBy = sortBy;
                  if (designApi.length) params.designType = designApi.join(",");
                }

                const res = await axiosApi.get(
                  `${BASE_URL + GET_DECORATION_CAT_ITEM}v3/${catId}`,
                  { params, signal: controller.signal },
                );
                return (res.data?.data || []).map((p) => ({
                  ...p,
                  _catValue: c.catValue,
                }));
              }),
            );
            return results.flatMap((r) =>
              r.status === "fulfilled" ? r.value : [],
            );
          }),
        );

        if (id !== searchReq.current) return; // purani request ignore

        // Sab terms ke results ek list mein: jo product zyada terms mein mila wo upar
        const merged = new Map();
        perTerm.flat().forEach((p) => {
          const k = p._id || p.slug || p.name;
          const prev = merged.get(k);
          if (prev) prev._hits += 1;
          else merged.set(k, { ...p, _hits: 1 });
        });
        const products = [...merged.values()].sort((a, b) => b._hits - a._hits);

        if (resultCache.size >= SEARCH_CACHE_LIMIT) {
          resultCache.delete(resultCache.keys().next().value);
        }
        resultCache.set(key, products);

        setSearchProducts(products);
        setSearchLoading(false);
      }, SEARCH_DEBOUNCE);
    },
    [scoped, currentCat, resolveTarget],
  );

  // Landing par category chunne ke liye list (href mein filters ?search= ke saath)
  const designPicker = useMemo(() => {
    if (!pendingFilter) return null;
    const q = pendingFilter.search
      ? `?search=${encodeURIComponent(pendingFilter.search)}`
      : "";
    const items = searchCategoryList
      .filter((c) => c.kind === "category")
      .map((c) => ({ ...c, href: `${c.href}${q}` }));
    return { labels: pendingFilter.labels, hint: pendingFilter.hint, items };
  }, [pendingFilter, searchCategoryList]);

  const getCategoryHref = useCallback((item) => item?.href || "#", []);

  const getProductHref = useCallback(
    (p) => {
      if (!p) return "#";
      const slug = p.slug || p.product_slug || (p.name ? slugify(p.name) : "");
      if (!slug) return "#";
      // Direct product page: /<parent>/product/<slug>
      return `/${parentOf(p._catValue)}/product/${slug}`;
    },
    [parentOf],
  );

  const openSearchCategory = useCallback(
    (item) => {
      if (item?.href) router.push(item.href);
    },
    [router],
  );

  // View More: category page par filters ke saath.
  //  - Category page: isi page par (shallow) filters lag jaate hain.
  //  - Landing + query mein category ka naam: us category page par.
  //  - Landing, category nahi: best category page par plain text search.
  const handleSearchSubmit = useCallback(
    (q) => {
      const text = String(q || "").trim();
      if (!text) return;

      const p = parseSearchQuery(text, designTypeOptions);
      const target = resolveTarget(p.rest);

      if (target) {
        // Category ke naam wale words text se hata do; baaki + filters ?search= mein
        const restWords = splitWords(p.rest)
          .filter((w) => !w.generic && !catCovers(target, w.term))
          .map((w) => w.term)
          .join(" ");
        const search = [canonicalFilterText(p), restWords]
          .filter(Boolean)
          .join(" ");

        const path = `${prefix}/${parentOf(target.catValue)}/${target.catValue}`;
        const url = `${path}${search ? `?search=${encodeURIComponent(search)}` : ""}`;

        const samePage =
          router.asPath.split("?")[0].toLowerCase() === path.toLowerCase();
        if (samePage) {
          router.push(url, undefined, { shallow: true, scroll: false });
        } else {
          router.push(url);
        }
        return;
      }

      /* ---------- LANDING, category nahi mili (price / sort / plain text) ---------- */
      // Dropdown ke products jis category mein sabse zyada hain, wahi page kholo
      const counts = {};
      searchProducts.forEach((pr) => {
        if (pr._catValue) counts[pr._catValue] = (counts[pr._catValue] || 0) + 1;
      });
      const catV =
        Object.keys(counts).sort((x, y) => counts[y] - counts[x])[0] ||
        "birthday-decoration";

      const restWords = cleanQuery(p.rest) || p.rest;
      const search = [canonicalFilterText(p), restWords]
        .filter(Boolean)
        .join(" ");

      router.push(
        `${prefix}/${parentOf(catV)}/${catV}${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`,
      );
    },
    [router, prefix, parentOf, searchProducts, resolveTarget],
  );

  return {
    searchCategoryList,
    searchProducts,
    searchLoading,
    designPicker,
    filterLabels,
    handleQueryChange,
    handleSearchSubmit,
    getCategoryHref,
    getProductHref,
    openSearchCategory,
  };
}