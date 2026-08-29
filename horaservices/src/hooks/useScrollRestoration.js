
import { useEffect, useLayoutEffect, useRef } from "react";
export function useScrollRestoration(router) {
  const isPopRef = useRef(false);

  // ================= DISABLE BROWSER'S NATIVE SCROLL RESTORATION =================
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
      sessionStorage.setItem(`scrollPos:${router.asPath}`, String(window.scrollY));
    };
    router.events.on("routeChangeStart", saveScroll);

    // MOBILE FIX: "pagehide" use karo, "beforeunload" nahi (bfcache disqualify hone se bachne ke liye)
    window.addEventListener("pagehide", saveScroll);

    return () => {
      router.events.off("routeChangeStart", saveScroll);
      window.removeEventListener("pagehide", saveScroll);
    };
  }, [router]);

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
      const maxDuration = 20000; // infinite-scroll/auto-pagination pages ke liye generous cap

      const reveal = () => {
        if (!revealed) {
          revealed = true;
          document.documentElement.style.visibility = "visible";
        }
      };

      const isTallEnough = () =>
        document.documentElement.scrollHeight - window.innerHeight >= targetY;

      let settleTimer = null;
      const SETTLE_MS = 1500;

      let ro = null;
      let revealFallback = null;
      let hardStop = null;

      const removeUserInteractionListeners = () => {
        userInteractionEvents.forEach((evt) =>
          window.removeEventListener(evt, handleUserInteraction)
        );
      };

      // ================= CONTENT-READY EVENT =================
      // Pages jab apna data-fetch / cache-hydrate complete kar lete hain,
      // tab "page-content-ready" event dispatch karte hain. Hum uska wait
      // karte hain, isse pehle blind revealFallback timer premature reveal
      // karke "footer dikhta hai fir jump hota hai" wala bug create karta tha.
      const onContentReady = () => {
        if (!revealed) {
          instantScrollTo(targetY);
          reveal();
        }
      };
      window.addEventListener("page-content-ready", onContentReady, { once: true });

      const stopCorrecting = () => {
        if (done) return;
        done = true;
        if (ro) ro.disconnect();
        reveal();
        clearTimeout(settleTimer);
        clearTimeout(revealFallback);
        clearTimeout(hardStop);
        window.removeEventListener("page-content-ready", onContentReady);
        removeUserInteractionListeners();
      };

      // MOBILE FIX: "touchmove" use karte hain (touchstart nahi) taaki
      // back-swipe gesture ka residual touch galti se cancel na kare.
      // 350ms grace period bhi dete hain.
      const userInteractionEvents = ["wheel", "touchmove", "pointerdown", "keydown"];
      const handleUserInteraction = () => stopCorrecting();

      let interactionListenerTimer = setTimeout(() => {
        userInteractionEvents.forEach((evt) =>
          window.addEventListener(evt, handleUserInteraction, { passive: true })
        );
      }, 350);

      instantScrollTo(targetY);

      ro = new ResizeObserver(() => {
        if (done) return;
        instantScrollTo(targetY);

        if (isTallEnough()) {
          reveal();
        }

        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          if (isTallEnough()) {
            stopCorrecting();
          }
        }, SETTLE_MS);

        if (Date.now() - startTime > maxDuration) {
          stopCorrecting();
        }
      });

      ro.observe(document.body);

      // Safety-net: primary trigger nahi, sirf un pages ke liye fallback
      // jo "page-content-ready" event kabhi fire nahi karte.
      revealFallback = setTimeout(() => {
        instantScrollTo(targetY);
        reveal();
      }, 1500);

      hardStop = setTimeout(() => {
        stopCorrecting();
      }, maxDuration);

      return () => {
        clearTimeout(interactionListenerTimer);
        if (ro) ro.disconnect();
        clearTimeout(settleTimer);
        clearTimeout(revealFallback);
        clearTimeout(hardStop);
        window.removeEventListener("page-content-ready", onContentReady);
        removeUserInteractionListeners();
      };
    } else {
      instantScrollTo(0);
      document.documentElement.style.visibility = "visible";
    }
  }, [router.asPath]);
}