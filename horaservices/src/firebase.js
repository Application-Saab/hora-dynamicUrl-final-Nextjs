// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8FU4YYnwLtRuGiSD5eYpEDIQSpFKh1zI",
  authDomain: "wonderland-hora.firebaseapp.com",
  projectId: "wonderland-hora",
  storageBucket: "wonderland-hora.appspot.com",
  messagingSenderId: "171662318448",
  appId: "1:171662318448:web:aa881c252acba6fdd14db5",
};

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// initialize Firebase
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
// Get Messaging
let messaging;
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

export { messaging, app };