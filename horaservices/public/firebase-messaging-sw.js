// Firebase Configuration
const firebaseConfig = {
 apiKey: "AIzaSyD8mkyjHXX_fGcdENJJnU3GWI60YWMItl0",
  authDomain: "wonderland-inapp-chat.firebaseapp.com",
  projectId: "wonderland-inapp-chat",
  storageBucket: "wonderland-inapp-chat.firebasestorage.app",
  messagingSenderId: "336745779010",
  appId: "1:336745779010:web:0f2125b937da40189942db",
  measurementId: "G-QF6S6NZQL6",
};

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/new_logo_light.png'
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});