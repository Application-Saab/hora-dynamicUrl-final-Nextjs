importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD8mkyjHXX_fGcdENJJnU3GWI60YWMItl0",
  authDomain: "wonderland-inapp-chat.firebaseapp.com",
  projectId: "wonderland-inapp-chat",
  storageBucket: "wonderland-inapp-chat.appspot.com",
  messagingSenderId: "336745779010",
  appId: "1:336745779010:web:0f2125b937da40189942db",
  measurementId: "G-QF6S6NZQL6",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body: body,
    icon: "/new_logo_light.png", // You can replace this with your app icon
  });
});