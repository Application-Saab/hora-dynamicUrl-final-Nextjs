// // utils/pushClient.js
// export async function registerServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     return await navigator.serviceWorker.register('/sw.js');
//   }
//   throw new Error("Service Worker not supported");
// }

// export async function askAndSubscribe(publicVapidKey, userId, roomId = null) {
//   // 1. Ask permission
//   const permission = await Notification.requestPermission();
//   if (permission !== "granted") throw new Error("Notification denied");

//   // 2. Register SW
//   const reg = await registerServiceWorker();

//   // 3. Subscribe
//   const subscription = await reg.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
//   });

//   // 4. Save to server
//   await fetch('http://localhost:5000/api/customer/event/subscribe', {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId, roomId, subscription })
//   });

//   return subscription;
// }

// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding)
//     .replace(/-/g, "+")
//     .replace(/_/g, "/");
//   const rawData = window.atob(base64);
//   return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
// }










// pushClient.js
export async function registerServiceWorker() {
  if ("Notification" in window && 'serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered', reg);
    return reg;
  }
  throw new Error('Service worker not supported');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function askAndSubscribe(vapidPublicKey, userId, roomId = null) {
  if (!('Notification' in window)) throw new Error('No Notifications API');
  
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permission denied');
  console.log('%c [ vapidPublicKey ]-73', 'font-size:13px; background:pink; color:#bf2c9f;', vapidPublicKey)

  const reg = await registerServiceWorker();

  // subscribe web push
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  // send subscription to backend
  await fetch('http://localhost:5000/api/customer/event/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, roomId, subscription })
  });

  return subscription;
}

export async function unsubscribeWebPush(endpoint) {
  await fetch('http://localhost:5000/api/customer/event/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint })
  });
}
