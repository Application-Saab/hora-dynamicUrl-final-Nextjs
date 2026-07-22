// localStorage-based chat message cache.
// Survives page reloads and client-side navigation.
// Each room's messages expire after TTL_MS to ensure freshness.

import { safeGetItem, safeSetItem } from "./safeStorage";

const CACHE_VERSION = "v1";
const TTL_MS = 10 * 24 * 60 * 60 * 1000; // 10 days
const MAX_MESSAGES = 300; // limit per room to control storage size

const storageKey = (groupId) => `hora_chat_${CACHE_VERSION}_${String(groupId)}`;

export const getCachedMessages = (groupId) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = safeGetItem(storageKey(groupId));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL_MS) {
      localStorage.removeItem(storageKey(groupId));
      return null;
    }
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
};

export const setCachedMessages = (groupId, messages) => {
  if (typeof window === "undefined" || !Array.isArray(messages)) return;
  try {
    // Keep only the most recent messages to cap storage usage
    const toStore = messages.length > MAX_MESSAGES
      ? messages.slice(-MAX_MESSAGES)
      : messages;
    safeSetItem(
      storageKey(groupId),
      JSON.stringify({ data: toStore, ts: Date.now() })
    );
  } catch {
    // Quota exceeded or private browsing — silently ignore
  }
};

export const clearCachedMessages = (groupId) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(storageKey(groupId));
  } catch {}
};

// Room display details cache (name, avatar, avatarText) — no TTL, room info rarely changes
const roomKey = (groupId) => `hora_room_v1_${String(groupId)}`;

export const getCachedRoomDetails = (groupId) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = safeGetItem(roomKey(groupId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCachedRoomDetails = (groupId, details) => {
  if (typeof window === "undefined" || !details) return;
  try {
    safeSetItem(roomKey(groupId), JSON.stringify(details));
  } catch {}
};
