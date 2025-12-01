// utils/indexedDB.js
import { openDB } from "idb";

export const getDB = async () => {
  return openDB("TemplatesDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("templates")) {
        db.createObjectStore("templates");
      }
    },
  });
};

export const saveTemplate = async (key, data) => {
  const db = await getDB();
  await db.put("templates", data, key);
};

export const getTemplate = async (key) => {
  const db = await getDB();
  return await db.get("templates", key);
};

export const deleteTemplate = async (key) => {
  const db = await getDB();
  await db.delete("templates", key);
};
