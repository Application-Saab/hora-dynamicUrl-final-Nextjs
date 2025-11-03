'use client';

// import { useState, useEffect } from "react";
// import { IoIosNotificationsOff, IoIosNotifications } from "react-icons/io";
// import { getMessaging, getToken, deleteToken } from "firebase/messaging";
// import { app } from "../../firebase"; // Assuming your Firebase app is exported from this file

const VAPID_KEY =
  "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA";

// Initialize Firebase Messaging
// const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export default function NotificationToggleButton() {
  // const [notificationStatus, setNotificationStatus] = useState("default");
  // const [loading, setLoading] = useState(false);

  // // Check initial notification permission status
  // useEffect(() => {
  //   if ("Notification" in window) {
  //     setNotificationStatus(Notification.permission);
  //   } else {
  //     console.warn("This browser does not support notifications.");
  //   }
  // }, []);

  // const handleToggleNotifications = async () => {
  //   if (!("Notification" in window)) {
  //     alert("This browser does not support notifications.");
  //     return;
  //   }

  //   setLoading(true);

  //   if (notificationStatus === "granted") {
  //     // Notifications are ON. Turn them OFF.
  //     try {
  //       await deleteToken(messaging);
  //       console.log("Firebase token deleted. Notifications are turned OFF.");
  //       // Update status to "default" since browser permission may still be "granted"
  //       setNotificationStatus("default");
  //       alert("Notifications have been turned off.");
  //     } catch (error) {
  //       console.error("Error deleting Firebase token:", error);
  //       alert("Failed to turn off notifications. Please try again.");
  //     }
  //   } else {
  //     // Notifications are OFF ("default" or "denied"). Try to turn them ON.
  //     if (notificationStatus === "denied") {
  //       alert(
  //         "Notifications are blocked. Please enable them in your browser settings."
  //       );
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const permission = await Notification.requestPermission();
  //       setNotificationStatus(permission);

  //       if (permission === "granted") {
  //         try {
  //           const token = await getToken(messaging, { vapidKey: VAPID_KEY });
  //           console.log("New FCM Token:", token);
  //           // TODO: Save this token to your server
  //           alert("Notifications are now enabled!");
  //         } catch (error) {
  //           console.error("Error getting Firebase token:", error);
  //           if (error.code === "messaging/unsupported-browser") {
  //             alert("This browser is not supported for notifications.");
  //           } else {
  //             alert("Failed to enable notifications. Please try again.");
  //           }
  //         }
  //       } else {
  //         console.log("Permission to receive notifications was denied.");
  //         alert("You denied notification permissions.");
  //       }
  //     } catch (error) {
  //       console.error("Error requesting notification permission:", error);
  //       alert("An error occurred while requesting notification permission.");
  //     }
  //   }

  //   setLoading(false);
  // };

  // return (
  //   <button
  //     onClick={handleToggleNotifications}
  //     className="notification-toggle-btn"
  //     disabled={loading}
  //     style={{ opacity: loading ? 0.6 : 1 }}
  //   >
  //     {notificationStatus === "granted" ? (
  //       <IoIosNotifications size={32} />
  //     ) : (
  //       <IoIosNotificationsOff size={32} />
  //     )}
  //   </button>
  // );
}