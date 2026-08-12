// utils/pageDataCache.js
//
// Simple module-level (in-memory) cache. Next.js pages-router mein jab aap
// ek route se doosre route pe jaate ho (jaise category -> product detail),
// purana page COMPONENT UNMOUNT ho jaata hai aur uska saara React state
// (useState) kho jaata hai. Lekin JS module-level variables (yeh `cache`
// Map) tab tak zinda rehte hain jab tak tab/session poora reload nahi hota
// — SPA navigation (router.push / back button) isse touch nahi karti.
//
// Isliye: fetch karne se pehle is cache mein check karo. Agar mil jaaye,
// turant wahi data use karo (koi API call nahi, koi skeleton nahi).
// Fetch complete hone ke baad, result yahan save kar do agli baar ke liye.

const cache = new Map();

// Kitni der tak cache "fresh" maana jaaye (ms). Isके baad bhi cache se
// data turant dikhega (koi blank/skeleton nahi), lekin background mein
// silently refetch ho jayega taaki data zyada purana na ho jaaye.
const DEFAULT_MAX_AGE = 5 * 60 * 1000; // 5 minutes

export function getPageCache(key, maxAge = DEFAULT_MAX_AGE) {
  const entry = cache.get(key);
  if (!entry) return null;

  const isStale = Date.now() - entry.savedAt > maxAge;
  return { data: entry.data, isStale };
}

export function setPageCache(key, data) {
  cache.set(key, { data, savedAt: Date.now() });
}

export function clearPageCache(key) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}