// importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
//   authDomain: "wonderland-hora.firebaseapp.com",
//   projectId: "wonderland-hora",
//   storageBucket: "wonderland-hora.firebasestorage.app",
//   messagingSenderId: "171662318448",
//   appId: "1:171662318448:web:aa881c252acba6fdd14db5",
//   measurementId: "G-2VGKGTVRRP"
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("Background message:", payload);

//   const title = payload.notification?.title || payload.data?.title;
//   const body = payload.notification?.body || payload.data?.body;

//   self.registration.showNotification(title, {
//     body,
//     icon: "/new_logo_light.png",
//     data: payload.data,
//   });
// });







// importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
//   authDomain: "wonderland-hora.firebaseapp.com",
//   projectId: "wonderland-hora",
//   storageBucket: "wonderland-hora.appspot.com", // IMPORTANT FIX
//   messagingSenderId: "171662318448",
//   appId: "1:171662318448:web:aa881c252acba6fdd14db5",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   const title = payload.notification?.title || payload.data?.title || "New Message";
//   const body = payload.notification?.body || payload.data?.body;

//   self.registration.showNotification(title, {
//     body,
//     icon: "/new_logo_light.png",
//     data: payload.data || {},
//   });
// });

// self.addEventListener("notificationclick", (event) => {
//   const url = event.notification.data?.url || "/";
//   event.notification.close();
//   event.waitUntil(clients.openWindow(url));
// });





// यह फ़ाइल 'public' फ़ोल्डर में होनी चाहिए

// अपनी Firebase Configuration Keys के साथ बदलें
const firebaseConfig = {
  apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
  authDomain: "wonderland-hora.firebaseapp.com",
  projectId: "wonderland-hora",
  storageBucket: "wonderland-hora.appspot.com", // IMPORTANT FIX
  messagingSenderId: "171662318448",
  appId: "1:171662318448:web:aa881c252acba6fdd14db5",
};

// Next.js क्लाइंट-साइड कोड से अलग, सर्विस वर्कर में Firebase को इनिशियलाइज़ करें
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// बैकग्राउंड मैसेज को हैंडल करें
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/new_logo_light.png' // 'public' फ़ोल्डर में एक आइकन फ़ाइल का पथ
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});