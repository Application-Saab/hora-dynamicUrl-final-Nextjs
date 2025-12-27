import {
  BASE_URL,
  SUBSCRIBE_NOTIFICATION,
  UNSUBSCRIBE_NOTIFICATION,
} from "./apiconstants";

export async function registerServiceWorker() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.register("/sw.js");
    console.log("SW registered", reg);
    return reg;
  }
  throw new Error("Service worker not supported");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function askAndSubscribe(vapidPublicKey, userId, groupId = null) {
  if (!("Notification" in window)) throw new Error("No Notifications API");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Permission denied");
  const reg = await registerServiceWorker();

  // subscribe web push
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  // send subscription to backend
  await fetch(`${BASE_URL}${SUBSCRIBE_NOTIFICATION}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, groupId, subscription }),
  });

  return subscription;
}

export async function unsubscribeWebPush(endpoint) {
  await fetch(`${BASE_URL}${UNSUBSCRIBE_NOTIFICATION}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });
}
