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
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import { ChatProvider } from "@/hooks/ChatContext";
import ChatProviderMain from "@/hooks/ChatProvider";
import { FIREBASE_VAPID_KEY } from "@/utils/constants";
import { BASE_URL, SUBSCRIBE_NOTIFICATION } from "@/utils/apiconstants";

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
      console.log("GTM Script Loaded");
    })(window, document, "script", "dataLayer", "GTM-K3SCKLTZ");
  }, [router.asPath]);

  const requestPermission = async () => {
    try {
      if ("Notification" in window && "serviceWorker" in navigator) {
        const swRegistration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: swRegistration,
          });

          if (currentToken) {
            let userId = localStorage.getItem("userID");
            await fetch(`${BASE_URL}${SUBSCRIBE_NOTIFICATION}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, fcmToken: currentToken }),
            });
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
