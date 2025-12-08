// pages/_app.tsx
import { React, useEffect, useState } from "react";
import "../app/globals.css";
import PageLayout from "@/components/pagelayout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { useRouter } from "next/router"; // Import useRouter
import WhatsAppIcon from "../app/WhatsAppIconGtm.jsx";
import Head from "next/head";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFcmToken, messaging } from "../firebase";
import { ChatProvider } from "@/hooks/ChatContext";
import ChatProviderMain from "@/hooks/ChatProvider";

const VAPID_KEY =
  "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");
  const { catValue, productName } = router.query;

  const [token, setToken] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockKeys = (e) => {
      const key = e?.key?.toLowerCase();
      if (
        (e.ctrlKey && (key === "u" || key === "s")) || // Ctrl+U, Ctrl+S
        (e.ctrlKey && e.shiftKey && (key === "i" || key === "c")) || // Ctrl+Shift+I, C
        key === "f12"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const blockDrag = (e) => e.preventDefault();

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);
    document.addEventListener("dragstart", blockDrag);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockKeys = (e) => {
      const key = e.key;
      const combo = `${e.ctrlKey ? "Ctrl+" : ""}${
        e.shiftKey ? "Shift+" : ""
      }${key}`;

      const blockedCombos = [
        "F12",
        "Ctrl+Shift+I",
        "Ctrl+U",
        "Ctrl+Shift+C",
        "Ctrl+S",
      ];
      if (blockedCombos.includes(key) || blockedCombos.includes(combo)) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  useEffect(() => {
    setCurrentUrl(router.asPath);
    // Google Tag Manager script
    (function (w, d, s, l, i) {
      console.log("run", router.pathname);
      w[l] = w[l] || [];
      w[l].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
        pageName: router.pathname,
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
      console.log("GTM Script Loaded"); // Debugging log
    })(window, document, "script", "dataLayer", "GTM-K3SCKLTZ");
  }, [router.asPath]);

  // useEffect(() => {
  //   if (typeof window !== "undefined" && "Notification" in window) {
  //     async function requestNotificationPermission() {
  //       try {
  //         const permission = await Notification.requestPermission();
  //         if (permission !== "granted") {
  //           console.log("Notification Permission Denied");
  //           return null;
  //         }

  //         const token = await getToken(messaging, {
  //           vapidKey:
  //             "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA",
  //         });

  //         console.log("FCM Token:", token);
  //         return token;
  //       } catch (err) {
  //         console.error("Token error:", err);
  //         return null;
  //       }
  //     }
  //     requestNotificationPermission();
  //   }
  // }, []);
  // _app.jsx
  // useEffect(() => {
  //   async function registerPushForUser(userId) {
  //     try {
  //       if ("serviceWorker" in navigator) {
  //         navigator.serviceWorker
  //           .register("/firebase-messaging-sw.js")
  //           .then(() => console.log("SW registered"))
  //           .catch((err) => console.error("SW register failed", err));
  //       }

  //       // register SW first
  //       // await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  //       // get FCM token (vapid key same you used server-side)
  //       const fcmToken = await getFcmToken(
  //         "BOZNXy9qbUIXWfQ2KiAbapxBegzkO6pE1s6cDcNFVRCELKjsLXTPoxob0OwGmv1-oUAp-7ngNiHdify3j39OuZw"
  //       );
  //       // const fcmToken = await getFcmToken('BOZNXy9qbUIXWfQ2KiAbapxBegzkO6pE1s6cDcNFVRCELKjsLXTPoxob0OwGmv1-oUAp-7ngNiHdify3j39OuZw');

  //       if (fcmToken) {
  //         console.log(
  //           "%c [ fcmToken ]-133",
  //           "font-size:13px; background:pink; color:#bf2c9f;",
  //           fcmToken
  //         );
  //         // save to backend
  //         await fetch("http://localhost:5000/api/customer/event/subscribe", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ userId, fcmToken }),
  //         });
  //       }
  //     } catch (err) {
  //       console.error("registerPushForUser err", err);
  //     }
  //   }
  //   if (typeof window !== "undefined" && router.isReady) {
  //     registerPushForUser();
  //   }
  // }, [router.isReady]);

  const requestPermission = async () => {
    try {
      if ("Notification" in window && "serviceWorker" in navigator) {
        // 1. सर्विस वर्कर को रजिस्टर करें
        const swRegistration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        // 2. ब्राउज़र से नोटिफिकेशन की अनुमति मांगें
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          console.log("Notification permission granted.");

          // 3. FCM रजिस्ट्रेशन टोकन प्राप्त करें
          const currentToken = await getToken(messaging, {
            vapidKey:
              "BOZNXy9qbUIXWfQ2KiAbapxBegzkO6pE1s6cDcNFVRCELKjsLXTPoxob0OwGmv1-oUAp-7ngNiHdify3j39OuZw",
            serviceWorkerRegistration: swRegistration,
          });

          if (currentToken) {
            console.log("FCM Registration Token:", currentToken);
            setToken(currentToken);
            let userId = localStorage.getItem("userID");
            // save to backend
            await fetch("http://localhost:5000/api/customer/event/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, fcmToken: currentToken }),
            });
            // **महत्वपूर्ण**: इस टोकन को अपने सर्वर डेटाबेस में सेव करें
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        } else {
          console.log("Unable to get permission to notify.");
        }
      } else {
        console.log(
          "Browser does not support Notifications or Service Workers."
        );
      }
    } catch (error) {
      console.error("An error occurred while retrieving token:", error);
    }
  };

  useEffect(() => {
    requestPermission();
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        // यूज़र को दिखाने के लिए लोकल नोटिफिकेशन/UI अपडेट करें
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <title>Hora Services</title>
        <link rel="icon" href="/new_logo_light.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChatProvider>
            <ChatProviderMain>
              <PageLayout>
                <Component {...pageProps} />
                <div>
                  <noscript>
                    <iframe
                      src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
                      height="0"
                      width="0"
                      style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                  </noscript>

                  {/* whatapp icon */}
                  <div className="whatsapp-container">
                    <WhatsAppIcon router={router} />
                  </div>
                </div>
              </PageLayout>
            </ChatProviderMain>
          </ChatProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
