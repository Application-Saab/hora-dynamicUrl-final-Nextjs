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
import { BASE_URL } from "@/utils/apiconstants";
import { DateGateProvider, useDateGate } from "@/utils/dateGateContext";
import { fetchWithError } from "@/utils/fetchWithError";

const DATE_SHEET_DELAY_MS = 30 * 1000;
const DATE_SHEET_REASK_BUFFER_DAYS = 1;

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
  const { showCityModal, selectCity, dismissCityModal } = useCity();
  const { setDateResolved } = useDateGate();

  const [showDateSheet, setShowDateSheet] = useState(false);

  const checkStarted = useRef(false);
  const dateSheetTimerRef = useRef(null);
  const futureRecheckTimerRef = useRef(null);

  // Date-sheet flow city ke wait mein nahi rukta — tracking city-resolve
  // ab background me chalta hai aur date-sheet flow se independent hai.
  const [cityResolved] = useState(true);

  const isDateSheetAllowedPath = /(^|\/)(balloon-decoration|photography-page)(\/|$)/.test(pathname || "");

  useEffect(() => {
    const storedId = safeGetItem("userID");
    const vId = getOrCreateVisitorId();
    const storedPincode = safeGetItem("pincode");

    if (storedId) setUserId(storedId);
    setVisitorId(vId);
    if (storedPincode) setPincode(storedPincode);

    setIdsReady(true);
  }, []);

  // Reminder-popup ab yahan se manage nahi hoti — DateSelectionBottomSheet
  // apne confirm ke turant baad khud EventReminderPopup dikhata hai. Isse
  // reminder guaranteed dikhega chahe date-sheet PageLayout se khule ya
  // kisi bhi doosre entry point (jaise "Change Date" button) se.
  // Yahan sirf date-sheet ko schedule/resolve karne ka logic bacha hai.
  const checkAndSchedule = useCallback(
    async () => {
      if (!idsReady) return;
      if (!userId && !visitorId) return;

      try {
        const params = new URLSearchParams();
        if (userId) params.append("userId", userId);
        if (visitorId) params.append("visitorId", visitorId);

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
            daysLeft: daysBetween(ev.date)
          }))
          .filter((ev) => !Number.isNaN(ev.daysLeft));

        const futureEvents = eventsWithDays
          .filter((ev) => ev.daysLeft >= 0)
          .sort((a, b) => a.daysLeft - b.daysLeft);

        if (futureEvents.length > 0) {
          setDateResolved(true);
         setShowDateSheet(false);

        // 👇 FIX 1: future event ke expire hone ka exact time nikaal ke
        // us waqt dobara checkAndSchedule() khud ko call karega —
        // taaki expire hote hi popup-logic fir se evaluate ho, page
        // reload ka wait na karna pade.
        const nearestEvent = futureEvents[0];
        const msUntilExpiry = (nearestEvent.daysLeft + 1) * 24 * 60 * 60 * 1000;

        if (futureRecheckTimerRef.current) clearTimeout(futureRecheckTimerRef.current);
        futureRecheckTimerRef.current = setTimeout(() => {
          checkAndSchedule();
        }, msUntilExpiry);

          return;
        }

        const pastEvents = eventsWithDays
          .filter((ev) => ev.daysLeft < 0)
          .sort((a, b) => b.daysLeft - a.daysLeft);

        if (pastEvents.length > 0) {
          const daysSinceExpiry = -pastEvents[0].daysLeft;

        // 👇 FIX 2: buffer ab sirf "expiry wale din" tak — 3 din nahi
        if (daysSinceExpiry <= DATE_SHEET_REASK_BUFFER_DAYS) {
          if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
          setDateResolved(true);
          return;
        }
      }

        if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
        setDateResolved(false);
        dateSheetTimerRef.current = setTimeout(() => {
          setShowDateSheet(true);
        }, DATE_SHEET_DELAY_MS);
      } catch (err) {
        console.error("Failed to check existing event dates:", err);
        if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
        setDateResolved(false);
        dateSheetTimerRef.current = setTimeout(() => {
          setShowDateSheet(true);
        }, DATE_SHEET_DELAY_MS);
      }
    },
    [userId, visitorId, idsReady, setDateResolved]
  );

useEffect(() => {
  if (!isDateSheetAllowedPath) {
    setDateResolved(true);
    return;
  }

  if (!idsReady) return;
  if (!userId && !visitorId) return;
  if (!cityResolved) return;
  if (checkStarted.current) return;
  checkStarted.current = true;

  checkAndSchedule();

  return () => {
    if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
    if (futureRecheckTimerRef.current) clearTimeout(futureRecheckTimerRef.current); // 👈 add
  };
}, [userId, visitorId, idsReady, checkAndSchedule, isDateSheetAllowedPath, setDateResolved, cityResolved]);
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
        <Head>
          <meta name="fast2sms" content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe" />
        </Head>

        {/* City modal ab sirf venue-list route par khulti hai — CityProvider ke
            andar isPillVisibleRoute check karke showCityModal set hota hai. */}
        {showCityModal && (
          <CitySelector onSelect={selectCity} onDismiss={dismissCityModal} />
        )}

        {isDateSheetAllowedPath && showDateSheet && (
          <DateSelectionBottomSheet
            isOpen={showDateSheet}
            onClose={() => {
              setShowDateSheet(false);
              setDateResolved(true);
            }}
            onConfirm={(date, apiData) => {
              setDateResolved(true);
              // Note: yahan setShowDateSheet(false) jaan-boojh kar nahi
              // bulaya — DateSelectionBottomSheet khud apna reminder
              // dikhane ke baad onClose() call karke sheet close karega.
            }}
            userId={userId}
            visitorId={visitorId}
            pincode={pincode}
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