// sw.js - Minimal Service Worker
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installed');
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  // This makes the service worker intercept fetch requests
  event.respondWith(fetch(event.request));
});
