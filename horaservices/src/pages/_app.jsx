import "../app/globals.css";
import "../app/home.css";
import "../app/homepage.css";
import React, { useEffect, useState } from "react";
import PageLayout from "@/components/pagelayout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { useRouter } from "next/router";
import WhatsAppIcon from "../app/WhatsAppIconGtm.jsx";
import Head from "next/head";
import { ChatProvider } from "@/hooks/ChatContext";
import { UserDetailsProvider } from "@/hooks/UserDetailsContext";
import ChatProviderMain from "@/hooks/ChatProvider";
import VisitorTracker from "@/utils/VisitorTracker";
import ErrorBoundary from "@/components/ErrorBoundary/Errorboundary";
import {
  setupGlobalErrorHandlers,
  startMemoryMonitoring,
} from "@/utils/errorReporter";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";
import { fetchWithError } from "@/utils/fetchWithError";
import {
  BASE_URL,
  CHECK_TOKEN_HEALTH,
  REFRESH_ACCESS_TOKEN,
} from "@/utils/apiconstants";
import { initMetaPixel } from "../utils/fpixel";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [waReady, setWaReady] = useState(false);
  const pathname = router.asPath;

  useEffect(() => {
    setWaReady(true);
  }, []);

  const pathOnly = (router.asPath || "").split("?")[0];
  const hideWhatsApp =
    pathOnly === "/weblink-gallery" ||
    pathOnly.startsWith("/weblink-gallery/") ||
    pathOnly === "/video-viewer" ||
    pathOnly.startsWith("/video-viewer/") ||
    pathOnly?.includes("/photography/product") ||
    pathOnly?.includes("/balloon-decoration/product");

  // ================= SCROLL RESTORATION (moved to hooks/useScrollRestoration.js) =================
  useScrollRestoration(router);

  // ================= GLOBAL ERROR HANDLERS =================
  useEffect(() => {
    setupGlobalErrorHandlers();
    startMemoryMonitoring();
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
      console.log("GTM Script Loaded");
    })(window, document, "script", "dataLayer", "GTM-K3SCKLTZ");
  }, []);

  useEffect(() => {
  initMetaPixel();
}, []);

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Check if a JWT is expired locally
  const isTokenExpired = (token, bufferSeconds = 60) => {
    if (!token || typeof token !== "string") return true;
    try {
      const cleanToken = token.startsWith("Bearer ")
        ? token.split(" ")[1]
        : token;
      const base64Url = cleanToken.split(".")[1];
      if (!base64Url) return true;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));

      if (!payload.exp) return false;
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTime + bufferSeconds;
    } catch (e) {
      return true;
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = safeGetItem("refreshToken");

    if (!refreshToken) {
      logout();
      return null;
    }

    // If refresh token itself is expired locally, logout immediately
    if (isTokenExpired(refreshToken, 0)) {
      logout();
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}${REFRESH_ACCESS_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return null;
      }

      if (!response.ok) {
        console.warn(
          `Token refresh skipped due to server status: ${response.status}`,
        );
        return null;
      }

      const data = await response.json();
      if (data?.token) {
        safeSetItem("token", data.token);
        return data.token;
      }

      return null;
    } catch (error) {
      console.warn(
        "Network error during token refresh, keeping session:",
        error,
      );
      return null;
    }
  };

  useEffect(() => {
    const accessToken = safeGetItem("token");
    const refreshToken = safeGetItem("refreshToken");

    if (!accessToken && !refreshToken) return;

    const checkAuthentication = async () => {
      if (accessToken && !isTokenExpired(accessToken, 300)) {
        return;
      }

      if (!accessToken || isTokenExpired(accessToken, 300)) {
        await refreshAccessToken();
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}${CHECK_TOKEN_HEALTH}`, {
          method: "GET",
          headers: {
            Authorization: `${accessToken}`,
          },
        });

        if (response.status === 401) {
          await refreshAccessToken();
        }
      } catch (error) {
        console.warn("Server unreachable during auth check, keeping session");
      }
    };

    checkAuthentication();
  }, []);

  const appContent = (
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

          {/* Server + first client paint: kuch mat dikhao → hydration match */}
          {waReady && !hideWhatsApp && (
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
  );

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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;600;700&family=Just+Another+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Provider store={store}>
        <UserDetailsProvider>
          <PersistGate loading={appContent} persistor={persistor}>
            {appContent}
          </PersistGate>
        </UserDetailsProvider>
      </Provider>
    </>
  );
}

export default MyApp;
