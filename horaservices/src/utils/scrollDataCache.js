// utils/pageDataCache.js
const memoryFallback = new Map();
const PREFIX = "pageCache:";

// Cache itni der "fresh" maani jaaye (ms). Iske baad bhi data turant
// dikhega, bas isStale=true return hoga (chaho to background refetch
// trigger kar sakte ho).
const DEFAULT_MAX_AGE = 5 * 60 * 1000; // 5 minutes

function hasSessionStorage() {
  try {
    return typeof window !== "undefined" && !!window.sessionStorage;
  } catch {
    return false;
  }
}

export function getPageCache(key, maxAge = DEFAULT_MAX_AGE) {
  let entry = null;

  // sessionStorage pehle try karo — ye hard-reload ke baad bhi zinda hota hai.
  if (hasSessionStorage()) {
    try {
      const raw = window.sessionStorage.getItem(PREFIX + key);
      if (raw) entry = JSON.parse(raw);
    } catch {
      entry = null;
    }
  }

  // sessionStorage available nahi (SSR, private-mode, ya blocked) — SPA
  // navigation ke andar to in-memory Map se hi kaam chal jaata hai.
  if (!entry) {
    entry = memoryFallback.get(key) || null;
  }

  if (!entry) return null;

  const isStale = Date.now() - entry.savedAt > maxAge;
  return { data: entry.data, isStale };
}

export function setPageCache(key, data) {
  const entry = { data, savedAt: Date.now() };

  memoryFallback.set(key, entry);

  if (hasSessionStorage()) {
    try {
      window.sessionStorage.setItem(PREFIX + key, JSON.stringify(entry));
    } catch {
      // sessionStorage full ho sakta hai (large catalogueData) ya
      // private-browsing mein blocked ho sakta hai — is-memory fallback
      // se SPA navigation ke liye kaam chal jayega.
    }
  }
}

export function clearPageCache(key) {
  if (key) {
    memoryFallback.delete(key);
    if (hasSessionStorage()) {
      try {
        window.sessionStorage.removeItem(PREFIX + key);
      } catch {}
    }
    return;
  }

  memoryFallback.clear();
  if (hasSessionStorage()) {
    try {
      Object.keys(window.sessionStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => window.sessionStorage.removeItem(k));
    } catch {}
  }
}