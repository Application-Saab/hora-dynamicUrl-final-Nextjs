// utils/pageDataCache.js
//
// Module-level in-memory cache. Route change pe component unmount hota hai
// aur useState kho jaata hai, lekin module-level variable session/tab reload
// tak zinda rehta hai. Isliye fetch se pehle yahan check karo — mile to
// turant use karo, warna fetch karke yahan save kar do.

const cache = new Map();

// Cache itni der "fresh" maani jaaye (ms). Iske baad bhi data turant
// dikhega, bas background mein silently refetch ho jayega.
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