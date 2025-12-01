// utils/pushClient.js
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    return await navigator.serviceWorker.register('/sw.js');
  }
  throw new Error("Service Worker not supported");
}

export async function askAndSubscribe(publicVapidKey, userId, roomId = null) {
  // 1. Ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification denied");

  // 2. Register SW
  const reg = await registerServiceWorker();

  // 3. Subscribe
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  // 4. Save to server
  await fetch('http://localhost:5000/api/customer/event/subscribe', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, roomId, subscription })
  });

  return subscription;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
