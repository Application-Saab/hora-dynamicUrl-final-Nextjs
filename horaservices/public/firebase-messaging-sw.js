// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
  authDomain: "wonderland-hora.firebaseapp.com",
  projectId: "wonderland-hora",
  storageBucket: "wonderland-hora.appspot.com",
  messagingSenderId: "171662318448",
  appId: "1:171662318448:web:aa881c252acba6fdd14db5",
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