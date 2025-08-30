// importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyD8mkyjHXX_fGcdENJJnU3GWI60YWMItl0",
//   authDomain: "wonderland-inapp-chat.firebaseapp.com",
//   projectId: "wonderland-inapp-chat",
//   storageBucket: "wonderland-inapp-chat.appspot.com",
//   messagingSenderId: "336745779010",
//   appId: "1:336745779010:web:0f2125b937da40189942db",
//   measurementId: "G-QF6S6NZQL6",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("[firebase-messaging-sw.js] Background message received:", payload);
//   const { title, body } = payload.notification;

//   self.registration.showNotification(title, {
//     body: body,
//     icon: "/new_logo_light.png", // You can replace this with your app icon
//   });
// });



// importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("[firebase-messaging-sw.js] Background message received:", payload);
//   const { title, body } = payload.notification || payload.data || {};
//   self.registration.showNotification(title || "New Message", {
//     body: body || "You got a message!",
//     icon: "/new_logo_light.png",
//   });
// });


// importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js");

// const firebaseConfig = {
//   apiKey: "AIzaSyD8mkyjHXX_fGcdENJJnU3GWI60YWMItl0",
//   authDomain: "wonderland-inapp-chat.firebaseapp.com",
//   projectId: "wonderland-inapp-chat",
//   storageBucket: "wonderland-inapp-chat.firebasestorage.app",
//   messagingSenderId: "336745779010",
//   appId: "1:336745779010:web:0f2125b937da40189942db",
//   measurementId: "G-QF6S6NZQL6",
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("[firebase-messaging-sw.js] Background message received:", payload);
//   const { title, body } = payload.notification || payload.data || {};
//   self.registration.showNotification(title || "New Message", {
//     body: body || "You got a message!",
//     icon: "/new_logo_light.png",
//   });
// });


// importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js");

importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyD8mkyjHXX_fGcdENJJnU3GWI60YWMItl0",
  authDomain: "wonderland-inapp-chat.firebaseapp.com",
  projectId: "wonderland-inapp-chat",
  storageBucket: "wonderland-inapp-chat.firebasestorage.app",
  messagingSenderId: "336745779010",
  appId: "1:336745779010:web:0f2125b937da40189942db",
  measurementId: "G-QF6S6NZQL6",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);
  const { title, body } = payload.notification || payload.data || {};
  self.registration.showNotification(title || "New Message", {
    body: body || "You got a message!",
    icon: "/new_logo_light.png",
  });
});