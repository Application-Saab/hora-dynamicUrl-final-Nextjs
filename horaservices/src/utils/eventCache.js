import { safeGetItem, safeSetItem } from "./safeStorage";

const MAX_EVENTS = 10;
const EXPIRY_TIME = 12 * 60 * 60 * 1000; // 12 hours

const eventCache = {}; // in-memory cache (fastest)

/** Save event posts */
// export async function cacheEvent(eventId, posts) {
//   const now = Date.now();

//   // Add to memory cache
//   eventCache[eventId] = { posts, timestamp: now };

//   // Store in localStorage
//   safeSetItem(
//     "event_cache_" + eventId,
//     JSON.stringify({ posts, timestamp: now })
//   );

//   cleanupOldEvents();
// }


export async function cacheEvent(eventId, posts) {
  const now = Date.now();

  // Keep only TOP 25 posts
  const limitedPosts = posts.slice(0, 25);

  // Add to memory cache
  eventCache[eventId] = { posts: limitedPosts, timestamp: now };

  // Store in localStorage
  safeSetItem(
    "event_cache_" + eventId,
    JSON.stringify({ posts: limitedPosts, timestamp: now })
  );

  cleanupOldEvents();
}


/** Get event cache if valid */
export function getCachedEvent(eventId) {
  const data = safeGetItem("event_cache_" + eventId);
  if (!data) return null;

  const parsed = JSON.parse(data);

  // Expired?
  if (Date.now() - parsed.timestamp > EXPIRY_TIME) {
    localStorage.removeItem("event_cache_" + eventId);
    delete eventCache[eventId];
    return null;
  }

  return parsed.posts;
}

/** Remove old cache to max 10 events */
function cleanupOldEvents() {
  let keys = Object.keys(localStorage).filter((k) =>
    k.startsWith("event_cache_")
  );

  if (keys.length <= MAX_EVENTS) return;

  let all = keys.map((k) => ({
    key: k,
    timestamp: JSON.parse(safeGetItem(k)).timestamp,
  }));

  // sort by oldest first
  all.sort((a, b) => a.timestamp - b.timestamp);

  let toDelete = all.slice(0, all.length - MAX_EVENTS);

  toDelete.forEach((item) => {
    localStorage.removeItem(item.key);
    delete eventCache[item.key.replace("event_cache_", "")];
  });
}

/** Clear everything when session ends */
export function clearAllEventCache() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith("event_cache_"))
    .forEach((k) => localStorage.removeItem(k));

  Object.keys(eventCache).forEach((k) => delete eventCache[k]);
}
