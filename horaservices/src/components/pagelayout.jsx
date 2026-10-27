"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import "../app/globals.css";
import Head from "next/head";
import { usePathname } from "next/navigation";
import ConsultationPopupProvider from "@/components/ConsultationPopupProvider";
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";
import CitySelector from "@/components/Venue/CitySelector";
import { CityProvider, useCity } from "@/utils/cityContext";
import DateSelectionBottomSheet from "@/components/DateSelectionBottomSheet";
import DateNotificationBanner from "@/components/Datenotificationbanner";
import { BASE_URL } from "@/utils/apiconstants";
import { DateGateProvider, useDateGate } from "@/utils/dateGateContext";
import { fetchWithError } from "@/utils/fetchWithError";

const DATE_SHEET_DELAY_MS = 30 * 1000;
const BANNER_FIRST_DELAY_MS = 30 * 1000; 
const BANNER_REPEAT_MS = 30 * 1000;
const BANNER_VISIBLE_MS = 8 * 1000;

// [DATE CHANGE] 0 = event date nikalte hi (agle din) popup/notification wapas shuru
const DATE_SHEET_REASK_BUFFER_DAYS = 0;
const DATE_SHEET_SHOWN_KEY = "DATE_SHEET_SHOWN";

// [DATE CHANGE] Jin services ke pages par date popup/notification chalega.
// Naya service add karna ho to bas yahan slug daalo.
const DATE_SHEET_SERVICES = ["balloon-decoration", "photography", "food", "catering"];

// [DATE CHANGE] Popup din me ek baar: sessionStorage ki jagah localStorage me aaj ki date save hoti hai
const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const hasSheetBeenShown = () => {
  try {
    return localStorage.getItem(DATE_SHEET_SHOWN_KEY) === getTodayKey();
  } catch (e) {
    return false;
  }
};
const markSheetShown = () => {
  try {
    localStorage.setItem(DATE_SHEET_SHOWN_KEY, getTodayKey());
  } catch (e) {}
};
const resetSheetShown = () => {
  try {
    localStorage.removeItem(DATE_SHEET_SHOWN_KEY);
  } catch (e) {}
};

// Safari-safe UUID generator (crypto.randomUUID needs Safari 15.4+)
const generateUUID = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // fall through to manual fallback
    }
  }
  // RFC4122-ish fallback, good enough for a visitor id
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getOrCreateVisitorId = () => {
  if (typeof window === "undefined") return "";
  try {
    let visitorId = safeGetItem("VISITOR_ID");
    if (!visitorId) {
      visitorId = generateUUID();
      safeSetItem("VISITOR_ID", visitorId);
    }
    return visitorId;
  } catch (e) {
    console.error("Failed to get/create visitor id:", e);
    // Session-only fallback so the app doesn't just die (e.g. Safari private mode quota errors)
    return generateUUID();
  }
};

// Safari's Date parser is strict — it chokes on non-ISO strings like
// "2024-01-15 10:00:00" (space instead of "T") which Chrome/Firefox accept fine.
// Normalize before parsing so Safari doesn't silently produce Invalid Date.
const parseDateSafely = (dateInput) => {
  if (dateInput instanceof Date) return dateInput;

  if (typeof dateInput === "string") {
    let normalized = dateInput.trim();

    // "2024-01-15 10:00:00" -> "2024-01-15T10:00:00"
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?/.test(normalized)) {
      normalized = normalized.replace(" ", "T");
    }

    // "2024/01/15" -> "2024-01-15" (Safari is picky about slashes too)
    if (/^\d{4}\/\d{2}\/\d{2}/.test(normalized)) {
      normalized = normalized.replace(/\//g, "-");
    }

    const d = new Date(normalized);
    if (!isNaN(d.getTime())) return d;

    // Last resort: try native parse of the original string anyway
    return new Date(dateInput);
  }

  return new Date(dateInput);
};

const getDateOnlyParts = (dateInput) => {
  const d = parseDateSafely(dateInput);
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth(),
    day: d.getUTCDate(),
    valid: !isNaN(d.getTime()),
  };
};

const daysBetween = (targetDate) => {
  const now = new Date();
  const todayParts = { y: now.getFullYear(), m: now.getMonth(), day: now.getDate() };
  const targetParts = getDateOnlyParts(targetDate);

  if (!targetParts.valid) {
    console.warn("daysBetween: invalid date received:", targetDate);
    return NaN;
  }

  const todayUTC = Date.UTC(todayParts.y, todayParts.m, todayParts.day);
  const targetUTC = Date.UTC(targetParts.y, targetParts.m, targetParts.day);
  return Math.round((targetUTC - todayUTC) / (1000 * 60 * 60 * 24));
};

const LayoutInner = ({ children }) => {
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [pincode, setPincode] = useState("");
  const [idsReady, setIdsReady] = useState(false);
  const cityCtx = useCity();
  const { showCityModal, selectCity, dismissCityModal } = cityCtx;
  const { setDateResolved } = useDateGate();

  const rawCity = cityCtx?.selectedCity ?? cityCtx?.city ?? cityCtx?.cityName ?? "";
  const city = typeof rawCity === "string" ? rawCity : rawCity?.name || "";

  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // [CHANGE] Boolean ki jagah: kis identity (userId/visitorId) ke liye check start hua wo yaad rakhta hai.
  // Visitor se logged-in user banne par dobara check chalega.
  const checkStarted = useRef(null);
  const dateSheetTimerRef = useRef(null);
  const futureRecheckTimerRef = useRef(null);
  const dateConfirmedRef = useRef(false);
  const bannerShownOnceRef = useRef(false);

  const [cityResolved] = useState(true);

  // [DATE CHANGE] sab services ke liye (DATE_SHEET_SERVICES list se)
  const isDateSheetAllowedPath = new RegExp(
    `(^|\\/)(${DATE_SHEET_SERVICES.join("|")})(\\/|$)`
  ).test(pathname || "");

  useEffect(() => {
    const storedId = safeGetItem("userID");
    const vId = getOrCreateVisitorId();
    const storedPincode = safeGetItem("pincode");

    if (storedId) setUserId(storedId);
    setVisitorId(vId);
    if (storedPincode) setPincode(storedPincode);

    setIdsReady(true);
  }, []);

  // [CHANGE] Component unmount par hi timers clear hote hain.
  // (Pehle main effect ka cleanup har dependency change par timers maar deta tha.)
  useEffect(() => {
    return () => {
      if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
      if (futureRecheckTimerRef.current) clearTimeout(futureRecheckTimerRef.current);
    };
  }, []);

  const showReminder = useCallback(() => {
    if (!hasSheetBeenShown()) {
      markSheetShown();
      setShowDateSheet(true);
    } else {
      bannerShownOnceRef.current = true;
      setShowBanner(true);
    }
  }, []);
  const checkAndSchedule = useCallback(
    async (delayMs = DATE_SHEET_DELAY_MS, keepResolved = false) => {
      if (!idsReady) return;
      if (!userId && !visitorId) return;

      try {
        const params = new URLSearchParams();
        if (userId){
          params.append("userId", userId);
        } else{
          params.append("visitorId", visitorId);
        }
        // if (visitorId) 

        const res = await fetchWithError(
          `${BASE_URL}/api/event-dates/my-events?${params.toString()}`
        );

        let events = [];
        if (res.ok) {
          const json = await res.json();
          events = json?.data?.eventDates || [];
        }

        const eventsWithDays = events
          .map((ev) => ({
            ...ev,
            daysLeft: daysBetween(ev.date),
          }))
          .filter((ev) => !Number.isNaN(ev.daysLeft));

        const futureEvents = eventsWithDays
          .filter((ev) => ev.daysLeft >= 0)
          .sort((a, b) => a.daysLeft - b.daysLeft);

        if (futureEvents.length > 0) {
          resetSheetShown();
          if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
          setDateResolved(true);
          setShowDateSheet(false);
          setShowBanner(false);

          // [DATE CHANGE] Pehle (daysLeft + 1) * 24h ka timer tha. setTimeout ~24.8 din se
          // zyada delay par overflow hoke turant fire ho jata hai (API loop). Isliye
          // har raat 12 baje recheck karte hain; date nikalte hi flow wapas shuru.
          const now = new Date();
          const msUntilMidnight =
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now + 1000;

          if (futureRecheckTimerRef.current) clearTimeout(futureRecheckTimerRef.current);
          futureRecheckTimerRef.current = setTimeout(() => {
            checkAndSchedule();
          }, msUntilMidnight);

          return;
        }

        const pastEvents = eventsWithDays
          .filter((ev) => ev.daysLeft < 0)
          .sort((a, b) => b.daysLeft - a.daysLeft);

        if (pastEvents.length > 0) {
          const daysSinceExpiry = -pastEvents[0].daysLeft;

          if (daysSinceExpiry <= DATE_SHEET_REASK_BUFFER_DAYS) {
            if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
            setDateResolved(true);
            return;
          }
          // [DATE CHANGE] yahan pehle resetSheetShown() tha. Usse expired date wale user ko
          // har check par popup dobara dikhta tha (din me ek baar rule toot'ta tha). Hata diya.
        }

        if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
        setDateResolved(keepResolved);
        dateSheetTimerRef.current = setTimeout(showReminder, delayMs);
      } catch (err) {
        console.error("Failed to check existing event dates:", err);
        if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
        setDateResolved(keepResolved);
        dateSheetTimerRef.current = setTimeout(showReminder, delayMs);
      }
    },
    [userId, visitorId, idsReady, setDateResolved, showReminder]
  );

  useEffect(() => {
    if (!isDateSheetAllowedPath) {
      setDateResolved(true);
      // Doosre page par jaane par popup/notification/timer band.
      // Wapas aane par: sheet aaj dikh chuki hai to seedha notification,
      // warna popup. Agle din date na ho to popup phir ek baar aayega.
      setShowDateSheet(false);
      setShowBanner(false);
      checkStarted.current = null;
      if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
      // [CHANGE] midnight timer bhi band
      if (futureRecheckTimerRef.current) clearTimeout(futureRecheckTimerRef.current);
      return;
    }

    if (!idsReady) return;
    if (!userId && !visitorId) return;
    if (!cityResolved) return;

    // [CHANGE] userId/visitorId badalne par dobara check start hoga
    const identityKey = userId || visitorId;
    if (checkStarted.current === identityKey) return;
    checkStarted.current = identityKey;

    checkAndSchedule(
      hasSheetBeenShown() ? BANNER_FIRST_DELAY_MS : DATE_SHEET_DELAY_MS
    );
  }, [userId, visitorId, idsReady, checkAndSchedule, isDateSheetAllowedPath, setDateResolved, cityResolved]);

  // [CHANGE] Phone/browser me tab wapas aane par (ya raat 12 ke baad app kholne par) dobara check
  useEffect(() => {
    if (!isDateSheetAllowedPath || !idsReady) return;

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      // sheet ya banner pehle se dikh raha ho to kuch mat karo
      if (showDateSheet || showBanner) return;

      const shownToday = hasSheetBeenShown();
      checkAndSchedule(
        shownToday ? BANNER_FIRST_DELAY_MS : DATE_SHEET_DELAY_MS,
        shownToday
      );
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isDateSheetAllowedPath, idsReady, showDateSheet, showBanner, checkAndSchedule]);

  /* ---------------- Date bottom sheet handlers ---------------- */

  const handleDateSheetClose = () => {
    setShowDateSheet(false);
    setDateResolved(true);

    // Date confirm hui thi: onClose bhi chala, par ye dismiss nahi hai.
    if (dateConfirmedRef.current) {
      dateConfirmedRef.current = false;
      return;
    }

    // Bina date select kiye band kiya -> top notification dikhao.
    // [CHANGE] Popup ke baad pehli notification 30 sec baad, uske baad har 30 sec me.
    checkAndSchedule(
      bannerShownOnceRef.current ? BANNER_REPEAT_MS : BANNER_FIRST_DELAY_MS,
      true
    );
  };

  const handleDateSheetConfirm = () => {
    dateConfirmedRef.current = true;
    resetSheetShown();
    if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
    setShowBanner(false);
    setDateResolved(true);
    // Date sheet band hone ke baad DateSelectionBottomSheet khud
    // city ke hisaab se coupon (Delhi) ya invite (baaki) sheet kholta hai.
  };

  /* ---------------- Top notification handlers ---------------- */

  // Notification X se band hui ya apne aap hide hui -> 30 sec baad dobara.
  const handleBannerHide = () => {
    setShowBanner(false);
    checkAndSchedule(BANNER_REPEAT_MS, true);
  };

  // Notification par tap -> date bottom sheet kholo.
  const handleBannerClick = () => {
    if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
    setShowBanner(false);
    setShowDateSheet(true);
  };

  const showBottomNav =
    pathname === "/wonderland" ||
    pathname === "/wonderlandinternational" ||
    pathname === "/wonderland/create-invite-template" ||
    pathname === "/wonderlandinternational/create-invite-template" ||
    pathname === "/templates" ||
    (pathname?.startsWith("/chat") && !pathname?.startsWith("/chat/room")) ||
    (pathname?.startsWith("/wonderlandinternational/chat") &&
      !pathname?.startsWith("/wonderlandinternational/chat/room")) ||
    pathname === "/about" ||
    pathname === "/accounts" ||
    pathname === "/wonderlandinternational/accounts" ||
    pathname === "/services" ||
    pathname === "/wonderland/invite" ||
    pathname === "/wonderlandinternational/invite";

  const isWonderlandPath =
    pathname?.startsWith("/wonderland") ||
    pathname?.startsWith("/wonderlandinternational");

  return (
    <ConsultationPopupProvider>
      <div className="page-container container-fluid p-0">
        {/* <Head>
          <meta name="fast2sms" content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe" />
        </Head> */}

        {/* City modal sirf venue-list route par khulti hai */}
        {showCityModal && (
          <CitySelector onSelect={selectCity} onDismiss={dismissCityModal} />
        )}

        {isDateSheetAllowedPath && showBanner && !showDateSheet && (
          <DateNotificationBanner
            durationMs={BANNER_VISIBLE_MS}
            onClick={handleBannerClick}
            onClose={handleBannerHide}
            onTimeout={handleBannerHide}
            // illustration={calendarIllustration}
          />
        )}

        {isDateSheetAllowedPath && (
          <DateSelectionBottomSheet
            isOpen={showDateSheet}
            onClose={handleDateSheetClose}
            onConfirm={handleDateSheetConfirm}
            userId={userId}
            visitorId={visitorId}
            pincode={pincode}
            city={city}
            whatsappNumber="917338584828"
          />
        )}

        {pathname !== "/services" && <Header />}
        <main className="page-main row m-0">
          <section className="p-0">{children}</section>
        </main>

        {showBottomNav ? (
          <BottomNav id={userId} />
        ) : (
          !isWonderlandPath &&
          !pathname?.startsWith("/chat/room") &&
          !pathname?.startsWith("/wonderlandinternational/chat/room") && (
            <Footer />
          )
        )}
      </div>
    </ConsultationPopupProvider>
  );
};

const PageLayout = ({ children }) => {
  return (
    <CityProvider>
      <DateGateProvider>
        <LayoutInner>{children}</LayoutInner>
      </DateGateProvider>
    </CityProvider>
  );
};

export default PageLayout;