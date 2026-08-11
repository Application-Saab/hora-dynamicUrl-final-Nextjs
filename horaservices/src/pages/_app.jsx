// pages/_app.tsx
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import "../app/globals.css";
import PageLayout from "@/components/pagelayout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { useRouter } from "next/router";
import WhatsAppIcon from "../app/WhatsAppIconGtm.jsx";
import Head from "next/head";
// import { getToken } from "firebase/messaging";
// import { messaging } from "../firebase";
import { ChatProvider } from "@/hooks/ChatContext";
import { UserDetailsProvider } from "@/hooks/UserDetailsContext";
import ChatProviderMain from "@/hooks/ChatProvider";
// import { FIREBASE_VAPID_KEY } from "@/utils/constants";
import { BASE_URL, SUBSCRIBE_NOTIFICATION } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
import { getVisitorId, getDeviceInfo, getBrowserInfo } from "@/utils/analytics";
import VisitorTracker from "@/utils/VisitorTracker";
import { safeGetItem } from "@/utils/safeStorage";
import ErrorBoundary from "@/components/ErrorBoundary/Errorboundary";
import { fetchWithError } from "@/utils/fetchWithError";
import { setupGlobalErrorHandlers, startMemoryMonitoring } from "@/utils/errorReporter";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState("");
  const [loggedinUserId, setLoggedinUserId] = useState(
    (typeof window !== "undefined" && safeGetItem("userID")) || "",
  );

  // ================= SCROLL RESTORATION: track back/forward vs normal nav =================
  const isPopRef = useRef(false);

  // ================= DISABLE BROWSER'S NATIVE SCROLL RESTORATION =================
  // Yeh zaroori hai - browser khud bhi popstate par scroll restore karne ki
  // koshish karta hai, jo humare manual restore se takra kar "top phir sahi
  // position" wala double-jump/flicker banata hai. Isse off karke sirf hum
  // control karenge.
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => {
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // ================= GLOBAL ERROR HANDLERS =================
  useEffect(() => {
    setupGlobalErrorHandlers();
    startMemoryMonitoring()
  }, []);

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

  // useEffect(() => {
  //   const visitorId = getVisitorId();
  //   console.log('visitor id' , visitorId);
  //   const { device, os } = getDeviceInfo();
  //   const browser = getBrowserInfo();
  //   console.log(JSON.stringify({
  //       visitorId,
  //       device,
  //       os,
  //       browser,
  //       page: window.location.pathname, // 👈 include page path
  //     }))

  //   // Track daily visit with page info
  //   fetch("https://horaservices.com/api/analytics/track-daily-visit", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       visitorId,
  //       device,
  //       os,
  //       browser,
  //       page: window.location.pathname, // 👈 include page path
  //     }),
  //   });
  // }, []);

  // const requestPermission = async () => {
  //   try {
  //     if ("Notification" in window && "serviceWorker" in navigator) {
  //       const swRegistration = await navigator.serviceWorker.register(
  //         "/firebase-messaging-sw.js",
  //       );

  //       const permission = await Notification.requestPermission();

  //       if (permission === "granted") {
  //         const currentToken = await getToken(messaging, {
  //           vapidKey: FIREBASE_VAPID_KEY,
  //           serviceWorkerRegistration: swRegistration,
  //         });

  //         if (currentToken) {
  //           await fetchWithError(`${BASE_URL}${SUBSCRIBE_NOTIFICATION}`, {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({
  //               userId: loggedinUserId,
  //               fcmToken: currentToken,
  //             }),
  //           });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("FCM error:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (loggedinUserId) requestPermission();
  // }, [loggedinUserId]);

  // Listen local storage changes for login state
  useEffect(() => {
    const syncLoginState = () => {
      setLoggedinUserId(safeGetItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);

    // Sync on same tab login without change page
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  // ================= TRACK CURRENT URL ON ROUTE CHANGE =================
  useEffect(() => {
    setCurrentUrl(router.asPath);
  }, [router.asPath]);

  // ================= DETECT BACK/FORWARD NAVIGATION (vs normal link click) =================
  useEffect(() => {
    router.beforePopState(() => {
      isPopRef.current = true;
      return true;
    });
  }, [router]);

  // ================= SAVE SCROLL POSITION BEFORE LEAVING A ROUTE =================
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem(
        `scrollPos:${router.asPath}`,
        String(window.scrollY)
      );
    };
    router.events.on("routeChangeStart", saveScroll);
    window.addEventListener("beforeunload", saveScroll);
    return () => {
      router.events.off("routeChangeStart", saveScroll);
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, [router]);

  // ================= GOOGLE TAG MANAGER (LOADS ONLY ONCE) =================
  useEffect(() => {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
      console.log("GTM Script Loaded"); // Debugging log
    })(window, document, "script", "dataLayer", "GTM-K3SCKLTZ");
  }, []);

// ================= SCROLL: restore on back/forward, top on normal nav =================
useLayoutEffect(() => {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.overflow = "";

  const wasPop = isPopRef.current;
  isPopRef.current = false;

  document.documentElement.style.visibility = "hidden";

  const instantScrollTo = (y) => {
    window.scrollTo({ top: y, left: 0, behavior: "instant" });
  };

  if (wasPop) {
    const saved = sessionStorage.getItem(`scrollPos:${router.asPath}`);
    const targetY = saved ? parseInt(saved, 10) : 0;

    let revealed = false;
    let done = false;
    const startTime = Date.now();
    const maxDuration = 6000; // API-heavy pages ke liye generous cap

    // sirf visibility dikhane ke liye — CORRECTION yeh nahi rokta
    const reveal = () => {
      if (!revealed) {
        revealed = true;
        document.documentElement.style.visibility = "visible";
      }
    };

    // pehla sync jump
    instantScrollTo(targetY);

    let settleTimer = null;

    // ResizeObserver: jab bhi content height badle (API data/images load
    // hone se), scroll ko wapas targetY par correct karo. Yeh tab tak
    // CHALTA rahega jab tak height 300ms tak stable na ho jaaye — chahe
    // visibility already reveal ho chuki ho.
    const ro = new ResizeObserver(() => {
      if (done) return;
      instantScrollTo(targetY);
      reveal();

      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        done = true;
        ro.disconnect();
      }, 300);

      if (Date.now() - startTime > maxDuration) {
        done = true;
        ro.disconnect();
      }
    });

    ro.observe(document.body);

    // Yeh SIRF visibility reveal karne ke liye hai (taaki blank screen
    // zyada der na dikhe) — yeh observer ko DISCONNECT nahi karta.
    const revealFallback = setTimeout(() => {
      instantScrollTo(targetY);
      reveal();
    }, 300);

    // Hard stop — sirf worst-case ke liye (data kabhi na aaye / height
    // kabhi stable na ho), taaki observer hamesha ke liye na chalta rahe.
    const hardStop = setTimeout(() => {
      done = true;
      ro.disconnect();
    }, maxDuration);

    return () => {
      ro.disconnect();
      clearTimeout(settleTimer);
      clearTimeout(revealFallback);
      clearTimeout(hardStop);
    };
  } else {
    instantScrollTo(0);
    document.documentElement.style.visibility = "visible";
  }
}, [router.asPath]);
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
                  <ErrorBoundary componentName="RootApp">
                    <Component {...pageProps} />
                  </ErrorBoundary>

                  <noscript>
                    <iframe
                      src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
                      height="0"
                      width="0"
                      style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                  </noscript>
                  {pathname !== "/weblink-gallery" && (
                    <div className="whatsapp-container">
                      <WhatsAppIcon router={router} />
                    </div>
                  )}
                  <div>
                    <VisitorTracker />
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