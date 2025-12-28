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