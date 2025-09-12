// pages/_app.tsx
import { React, useEffect, useState } from "react";
import "../app/globals.css";
import PageLayout from "@/components/pagelayout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import Link from "next/link";
import Image from "next/image";
import whatsppicon from "../assets/whatsapp-new.webp";
import { useRouter } from "next/router"; // Import useRouter
import WhatsAppIcon from "../app/WhatsAppIconGtm.jsx";
import A2HSPrompt from "@/components/AddToHomeScreen";
import Head from "next/head";
import { getMessaging, getToken } from "firebase/messaging";
import { messaging } from "../firebase"; 

const VAPID_KEY =
  "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA";


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");
  const { catValue, productName } = router.query;
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


  useEffect(() => {
  if (typeof window !== "undefined") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              // Send token to server
            }
          })
          .catch((err) => console.error("Error getting token:", err));
      }
    });
  }
}, []);



  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <title>Hora Services</title>
        <link rel="icon" href="/new_logo_light.png" />
      </Head>
    
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PageLayout>
          <Component {...pageProps} />
          {/* <A2HSPrompt /> */}
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
      </PersistGate>
    </Provider>
    </>
  );
}

export default MyApp;
