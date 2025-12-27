// Firebase Configuration
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { firebaseConfig } from './config/firebaseConfig';

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