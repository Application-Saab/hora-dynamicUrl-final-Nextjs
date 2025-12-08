// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getMessaging } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyD8mkyjHXX_fGcdENJJnU3GWI60YWMItl0",
//   authDomain: "wonderland-inapp-chat.firebaseapp.com",
//   projectId: "wonderland-inapp-chat",
//   storageBucket: "wonderland-inapp-chat.firebasestorage.app",
//   messagingSenderId: "336745779010",
//   appId: "1:336745779010:web:0f2125b937da40189942db",
//   measurementId: "G-QF6S6NZQL6",
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// export async function requestNotificationPermission() {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.log("Notification Permission Denied");
//       return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey:
//         "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA",
//     });

//     console.log("FCM Token:", token);
//     return token;
//   } catch (err) {
//     console.error("Token error:", err);
//     return null;
//   }
// }

// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// // import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
//   authDomain: "wonderland-hora.firebaseapp.com",
//   projectId: "wonderland-hora",
//   storageBucket: "wonderland-hora.firebasestorage.app",
//   messagingSenderId: "171662318448",
//   appId: "1:171662318448:web:aa881c252acba6fdd14db5",
//   measurementId: "G-2VGKGTVRRP"
// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);
// // const analytics = getAnalytics(app);

// export async function getFcmToken(publicVapidKey) {
//   try {
//     // ensure SW is registered as /sw.js (our combined SW)
//     // and messaging will use same service worker
//     const currentToken = await getToken(messaging, {
//       vapidKey: publicVapidKey,
//     });
//     return currentToken;
//   } catch (err) {
//     console.error("Error getting FCM token", err);
//     return null;
//   }
// }

// export function onForegroundMessage(cb) {
//   onMessage(messaging, cb);
// }




// import { initializeApp, getApps } from "firebase/app";
// import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
//   authDomain: "wonderland-hora.firebaseapp.com",
//   projectId: "wonderland-hora",
//   storageBucket: "wonderland-hora.appspot.com",
//   messagingSenderId: "171662318448",
//   appId: "1:171662318448:web:aa881c252acba6fdd14db5",
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// let messaging = null;

// (async () => {
//   if (typeof window !== "undefined") {
//     const supported = await isSupported();
//     if (supported) {
//       messaging = getMessaging(app);
//     } else {
//       console.warn("FCM is NOT supported in this browser");
//     }
//   }
// })();

// export async function getFcmToken(publicVapidKey) {
//   try {
//     if (!messaging) return null;

//     const registration = await navigator.serviceWorker.ready;

//     const currentToken = await getToken(messaging, {
//       vapidKey: publicVapidKey,
//       serviceWorkerRegistration: registration,
//     });

//     return currentToken;
//   } catch (err) {
//     console.error("Error getting FCM token", err);
//     return null;
//   }
// }

// export function onForegroundMessage(cb) {
//   if (!messaging) return;
//   onMessage(messaging, cb);
// }





// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
  authDomain: "wonderland-hora.firebaseapp.com",
  projectId: "wonderland-hora",
  storageBucket: "wonderland-hora.appspot.com",
  messagingSenderId: "171662318448",
  appId: "1:171662318448:web:aa881c252acba6fdd14db5",
};

import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Messaging
let messaging;
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

export { messaging, app };