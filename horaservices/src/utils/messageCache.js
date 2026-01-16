"use client";
class MessageCache {
  constructor() {
    this.dbName = "ChatMessagesDB";
    this.version = 1;
    this.db = null;
    this.initPromise = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store for messages
        if (!db.objectStoreNames.contains("messages")) {
          const messagesStore = db.createObjectStore("messages", {
            keyPath: "id",
          });
          messagesStore.createIndex("groupId", "groupId", { unique: false });
          messagesStore.createIndex("createdAt", "createdAt", { unique: false });
          messagesStore.createIndex("groupId_createdAt", ["groupId", "createdAt"], { unique: false });
        }

        // Store for cache metadata (last sync time, etc.)
        if (!db.objectStoreNames.contains("cache_meta")) {
          db.createObjectStore("cache_meta", { keyPath: "key" });
        }
      };
    });
  }

  async ensureDB() {
    if (!this.db) {
      await this.initPromise;
    }
    return this.db;
  }

  // Save messages for a group
  async saveMessages(groupId, messages) {
    try {
      const db = await this.ensureDB();
      const tx = db.transaction(["messages", "cache_meta"], "readwrite");
      const messagesStore = tx.objectStore("messages");
      const metaStore = tx.objectStore("cache_meta");

      // Save each message
      for (const msg of messages) {
        const messageData = {
          id: msg._id || msg.id,
          groupId,
          ...msg,
          cachedAt: Date.now(),
        };
        await messagesStore.put(messageData);
      }

      // Update metadata
      await metaStore.put({
        key: `lastSync_${groupId}`,
        timestamp: Date.now(),
        messageCount: messages.length,
      });

      await tx.complete;
    } catch (err) {
      console.error("Error saving messages to cache:", err);
    }
  }

  // Get cached messages for a group
  async getMessages(groupId, limit = 10000) {
    try {
      const db = await this.ensureDB();
      const tx = db.transaction("messages", "readonly");
      const store = tx.objectStore("messages");
      const index = store.index("groupId_createdAt");

      // Get messages for this group, sorted by createdAt DESC
      const range = IDBKeyRange.bound(
        [groupId, 0],
        [groupId, Date.now() * 2]
      );

      return new Promise((resolve, reject) => {
        const messages = [];
        const request = index.openCursor(range, "prev");

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && messages.length < limit) {
            messages.push(cursor.value);
            cursor.continue();
          } else {
            // Reverse to get oldest first
            resolve(messages.reverse());
          }
        };

        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error("Error getting cached messages:", err);
      return [];
    }
  }

  // Add a single new message
  async addMessage(groupId, message) {
    try {
      const db = await this.ensureDB();
      const tx = db.transaction("messages", "readwrite");
      const store = tx.objectStore("messages");

      const messageData = {
        id: message._id || message.id,
        groupId,
        ...message,
        cachedAt: Date.now(),
      };

      await store.put(messageData);
    } catch (err) {
      console.error("Error adding message to cache:", err);
    }
  }

  // Get last sync time for a group
  async getLastSyncTime(groupId) {
    try {
      const db = await this.ensureDB();
      const tx = db.transaction("cache_meta", "readonly");
      const store = tx.objectStore("cache_meta");
      
      return new Promise((resolve) => {
        const request = store.get(`lastSync_${groupId}`);
        request.onsuccess = () => {
          resolve(request.result?.timestamp || 0);
        };
        request.onerror = () => resolve(0);
      });
    } catch (err) {
      return 0;
    }
  }

  // Clear cache for a specific group
  async clearGroup(groupId) {
    try {
      const db = await this.ensureDB();
      const tx = db.transaction("messages", "readwrite");
      const store = tx.objectStore("messages");
      const index = store.index("groupId");

      return new Promise((resolve, reject) => {
        const request = index.openKeyCursor(IDBKeyRange.only(groupId));
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            store.delete(cursor.primaryKey);
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error("Error clearing group cache:", err);
    }
  }

  // Clear all cache
  async clearAll() {
    try {
      const db = await this.ensureDB();
      const tx = db.transaction(["messages", "cache_meta"], "readwrite");
      await tx.objectStore("messages").clear();
      await tx.objectStore("cache_meta").clear();
    } catch (err) {
      console.error("Error clearing cache:", err);
    }
  }

  // Get cache stats
  async getStats() {
    try {
      const db = await this.ensureDB();
      const tx = db.transaction("messages", "readonly");
      const store = tx.objectStore("messages");

      return new Promise((resolve) => {
        const request = store.count();
        request.onsuccess = () => {
          resolve({ totalMessages: request.result });
        };
      });
    } catch (err) {
      return { totalMessages: 0 };
    }
  }
}

// Export singleton instance
export const messageCache = new MessageCache();

