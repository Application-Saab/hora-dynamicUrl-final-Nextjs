import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { decCat } from "@/utils/decorationCategories";
import { smallCardCategories } from "@/utils/smallCardCategories";
import { NamingCeremonyThemes, themeFilters } from "@/utils/themeFilters";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";
import axiosApi from "@/utils/axiosApi";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
} from "@/utils/apiconstants";
import { designTypeOptions } from "@/components/SearchSortBar";
import {
  cleanQuery,
  splitWords,
  findCategoryForQuery,
  parseSearchQuery,
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

  const parentOf = useCallback(
    (cv) => (WEDDING_PARENT_CATS.has(cv) ? WEDDING_PARENT : baseSlug),
    [baseSlug],
  );

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
      href: `${prefix}/${
        WEDDING_PARENT_CATS.has(c.catValue) ? WEDDING_PARENT : baseSlug
      }/${c.catValue}`,
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

      /* ---------- LANDING + filter words => category puchho ---------- */
      if (!scoped && hasFilter) {
        const hit = parsed.rest
          ? findCategoryForQuery(parsed.rest, SEARCH_CATEGORIES)
          : null;
        const restWords = hit
          ? hit.rest.join(" ")
          : cleanQuery(parsed.rest) || parsed.rest;
        const search = [...parsed.parts.map((x) => x.text), restWords]
          .filter(Boolean)
          .join(" ");

        setPendingFilter({
          search,
          labels: parsed.parts.map((p) =>
            p.type === "design" ? labelOfDesign(p.id) : p.text,
          ),
          hitCat: hit?.catValue || null,
        });
        setSearchProducts([]);
        setSearchLoading(false);
        return;
      }
      setPendingFilter(null);

      const words = splitWords(parsed.rest);

      // Kuch bhi nahi: na text, na (category page par) filter
      if (!words.length && !(scoped && hasFilter)) {
        setSearchProducts([]);
        setSearchLoading(false);
        return;
      }

      // Filters sirf category page par API params banke jaate hain
      const designApi = scoped
        ? parsed.designTypes
            .map((d) => designTypeOptions.find((o) => o.id === d)?.apiValue)
            .filter(Boolean)
        : [];
      const minPrice = scoped ? parsed.minPrice : null;
      const maxPrice = scoped ? parsed.maxPrice : null;
      const sortBy = scoped && PRICE_SORTS.includes(parsed.sort) ? parsed.sort : null;

      // "decoration" jaise generic words ka product search nahi (sab match ho jaata hai)
      const real = words.filter((w) => !w.generic);
      const textTerms = (real.length ? real : words).slice(0, 3).map((w) => w.term);
      // Category page par sirf filter ho (text nahi) to ek hi request, bina search term
      const terms = textTerms.length ? textTerms : [null];

      const key = [
        scoped ? currentCat.catValue : "*",
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
            const cats = scoped
              ? [currentCat]
              : pickSearchCategories(term, MAX_SEARCH_CATS);

            const results = await Promise.allSettled(
              cats.map(async (c) => {
                const catId = await getCatId(c);
                if (!catId || controller.signal.aborted) return [];

                const params = {
                  limit: scoped ? SCOPED_LIMIT : LANDING_LIMIT,
                  page: 1,
                };
                if (term) params.search = term;
                if (minPrice != null) params.minPrice = minPrice;
                if (maxPrice != null) params.maxPrice = maxPrice;
                if (sortBy) params.sortBy = sortBy;
                if (designApi.length) params.designType = designApi.join(",");

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
    [scoped, currentCat],
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
    if (pendingFilter.hitCat) {
      // Query mein jo category ka naam tha wo sabse upar
      items.sort(
        (a, b) =>
          Number(b.catValue === pendingFilter.hitCat) -
          Number(a.catValue === pendingFilter.hitCat),
      );
    }
    return { labels: pendingFilter.labels, items };
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
  //  - Landing: best category page par plain text search.
  const handleSearchSubmit = useCallback(
    (q) => {
      const text = String(q || "").trim();
      if (!text) return;

      /* ---------- CATEGORY PAGE ---------- */
      if (scoped) {
        const p = parseSearchQuery(text, designTypeOptions);
        const restWords = cleanQuery(p.rest) || p.rest;
        const search = [...p.parts.map((x) => x.text), restWords]
          .filter(Boolean)
          .join(" ");

        const target = `${prefix}/${parentOf(currentCat.catValue)}/${currentCat.catValue}`;
        const url = `${target}${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`;

        const samePage =
          router.asPath.split("?")[0].toLowerCase() === target.toLowerCase();
        if (samePage) {
          router.push(url, undefined, { shallow: true, scroll: false });
        } else {
          router.push(url);
        }
        return;
      }

      /* ---------- LANDING ---------- */
      const p = parseSearchQuery(text, []);
      if (!p.rest) return;

      const hit = findCategoryForQuery(p.rest, SEARCH_CATEGORIES);
      const catV =
        hit?.catValue || searchProducts[0]?._catValue || "birthday-decoration";
      const restWords = hit ? hit.rest.join(" ") : cleanQuery(p.rest) || p.rest;

      router.push(
        `${prefix}/${parentOf(catV)}/${catV}${
          restWords ? `?search=${encodeURIComponent(restWords)}` : ""
        }`,
      );
    },
    [router, prefix, parentOf, searchProducts, scoped, currentCat],
  );

  return {
    searchCategoryList,
    searchProducts,
    searchLoading,
    designPicker,
    handleQueryChange,
    handleSearchSubmit,
    getCategoryHref,
    getProductHref,
    openSearchCategory,
  };
}