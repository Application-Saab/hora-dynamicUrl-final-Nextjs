// // Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyD8mkyjHXX_fGcdENJJnU3GWI60YWMItl0",
//   authDomain: "wonderland-inapp-chat.firebaseapp.com",
//   projectId: "wonderland-inapp-chat",
//   storageBucket: "wonderland-inapp-chat.firebasestorage.app",
//   messagingSenderId: "336745779010",
//   appId: "1:336745779010:web:0f2125b937da40189942db",
//   measurementId: "G-QF6S6NZQL6"
// };

// importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// const app = firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/new_logo_light.png',
//     data: payload.data
//   };
  
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   const data = event.notification.data || {};
//   const url =
//     data.url ||
//     `/chat/room?groupId=${data.groupId}&id=${data.senderId}`;

//   event.waitUntil(
//     clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
//       for (const client of list) {
//         if (client.url.includes("/chat") && "focus" in client) {
//           client.postMessage({ type: "NAVIGATE", url });
//           return client.focus();
//         }
//       }
//       return clients.openWindow(
//         new URL(url, self.location.origin).href
//       );
//     })
//   );
// });
