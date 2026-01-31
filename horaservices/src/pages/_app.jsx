// pages/_app.tsx
import React, { useEffect, useState, useLayoutEffect } from "react";
import "../app/globals.css";
import PageLayout from "@/components/pagelayout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { useRouter } from "next/router";
import WhatsAppIcon from "../app/WhatsAppIconGtm.jsx";
import Head from "next/head";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import { ChatProvider } from "@/hooks/ChatContext";
import { UserDetailsProvider } from "@/hooks/UserDetailsContext";
import ChatProviderMain from "@/hooks/ChatProvider";
import { FIREBASE_VAPID_KEY } from "@/utils/constants";
import { BASE_URL, SUBSCRIBE_NOTIFICATION } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState("");
  const [loggedinUserId, setLoggedinUserId] = useState(
    (typeof window !== "undefined" && localStorage.getItem("userID")) || "",
  );
  // ================= BLOCK KEYS + CONTEXT MENU =================
  useEffect(() => {
    const blockContextMenu = (e) => {
      const target = e.target;

      // Allow copy menu in these areas
      if (
        target.closest(
          ".chat-text, .chat-message, .chat-messages, a, input, textarea, [contenteditable='true']",
        )
      ) {
        return;
      }
      e.preventDefault();
    };

    const blockKeys = (e) => {
      const key = e.key?.toLowerCase();

      // Only devtools block
      if (
        key === "f12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const blockDrag = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);
    document.addEventListener("dragstart", blockDrag);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  const requestPermission = async () => {
    try {
      if ("Notification" in window && "serviceWorker" in navigator) {
        const swRegistration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: swRegistration,
          });

          if (currentToken) {
            await fetch(`${BASE_URL}${SUBSCRIBE_NOTIFICATION}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: loggedinUserId,
                fcmToken: currentToken,
              }),
            });
          }
        }
      }
    } catch (error) {
      console.error("FCM error:", error);
    }
  };

  useEffect(() => {
    if (loggedinUserId) requestPermission();
  }, [loggedinUserId]);

  // Listen local storage changes for login state
  useEffect(() => {
    const syncLoginState = () => {
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);

    // Sync on same tab login without change page
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
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

  // useLayoutEffect(() => {
  //   // reset any scroll lock
  //   document.body.style.position = "";
  //   document.body.style.top = "";
  //   document.body.style.overflow = "";

  //   // force scroll to top
  //   window.scrollTo(0, 0);

  //   console.log("scrolling app");
  // }, [pathname]);

  return (
    <>
      <Head>
        <title>HORA – Event & Balloon Decoration Services</title>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "HORA",
              alternateName: "HORA Services",
              url: "https://horaservices.com/",
            }),
          }}
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/new_logo_light.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Provider store={store}>
        <UserDetailsProvider>
          <PersistGate loading={null} persistor={persistor}>
            <ChatProvider>
              <ChatProviderMain>
                <PageLayout>
                  <Component {...pageProps} />

                  <noscript>
                    <iframe
                      src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
                      height="0"
                      width="0"
                      style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                  </noscript>

                  <div className="whatsapp-container">
                    <WhatsAppIcon router={router} />
                  </div>
                </PageLayout>
              </ChatProviderMain>
            </ChatProvider>
          </PersistGate>
        </UserDetailsProvider>
      </Provider>
    </>
  );
}

export default MyApp;
