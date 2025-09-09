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
import A2HSPrompt from "@/components/wonderland/AddToHomeScreen";

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

  // ✅ Disable image dragging & text selection
  // useEffect(() => {
  //   const style = document.createElement('style');
  //   style.innerHTML = `
  //     * {
  //       -webkit-user-select: none !important;
  //       -moz-user-select: none !important;
  //       -ms-user-select: none !important;
  //       user-select: none !important;
  //       -webkit-touch-callout: none !important;
  //     }
  //     img {
  //       pointer-events: none !important;
  //       -webkit-user-drag: none !important;
  //     }
  //   `;
  //   document.head.appendChild(style);
  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);

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

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PageLayout>
          <Component {...pageProps} />
          <A2HSPrompt />
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
  );
}

export default MyApp;
