"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import Head from "next/head";
import { usePathname } from "next/navigation";
import ConsultationPopupProvider from "@/components/ConsultationPopupProvider";
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";
import CitySelector from "@/components/Venue/CitySelector";
import { CityProvider, useCity } from "@/utils/cityContext";
import DateSelectionBottomSheet from "@/components/DateSelectionBottomSheet";
import EventReminderPopup from "@/components/EventReminderPopup";
import { BASE_URL } from "@/utils/apiconstants";
import { DateGateProvider, useDateGate } from "@/utils/dateGateContext";
import { fetchWithError } from "@/utils/fetchWithError";

const DATE_SHEET_DELAY_MS = 30 * 1000;
const DATE_SHEET_REASK_BUFFER_DAYS = 3;

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

const toDateKey = (dateInput) => {
  const { y, m, day } = getDateOnlyParts(dateInput);
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

const getVariantForDaysLeft = (daysLeft) => {
  if (Number.isNaN(daysLeft) || daysLeft < 0) return null;
  if (daysLeft <= 4) return "approaching";
  return "planner";
};

const LayoutInner = ({ children }) => {
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [pincode, setPincode] = useState("");
  const [idsReady, setIdsReady] = useState(false);
 const { showCityModal, selectCity, isCityDisabledRoute, dismissCityModal } = useCity();
  const { setDateResolved } = useDateGate();

  const [showDateSheet, setShowDateSheet] = useState(false);
  const [reminderVariant, setReminderVariant] = useState(null);
  const [showReminder, setShowReminder] = useState(false);

  const checkStarted = useRef(false);
  const dateSheetTimerRef = useRef(null);

  const [cityResolved, setCityResolved] = useState(false);
  const prevShowCityModal = useRef(showCityModal);

  useEffect(() => {
    if (isCityDisabledRoute) {
      setCityResolved(true);
      return;
    }
    if (prevShowCityModal.current === true && showCityModal === false) {
      setCityResolved(true);
    }
    if (!showCityModal && !prevShowCityModal.current) {
      setCityResolved(true);
    }
    prevShowCityModal.current = showCityModal;
  }, [showCityModal, isCityDisabledRoute]);

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

  const getIdentityKey = useCallback(() => {
    return visitorId || userId || "anon";
  }, [visitorId, userId]);

  const checkAndSchedule = useCallback(
    async (opts = {}) => {
      const { skipShownFlag = false } = opts;

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
            daysLeft: daysBetween(ev.date),
          }))
          // Drop anything Safari (or the API) gave us a bad date for,
          // instead of letting NaN silently break the sort/filter logic below.
          .filter((ev) => !Number.isNaN(ev.daysLeft));

        const futureEvents = eventsWithDays
          .filter((ev) => ev.daysLeft >= 0)
          .sort((a, b) => a.daysLeft - b.daysLeft);

        if (futureEvents.length > 0) {
          const nearest = futureEvents[0];
          const variant = getVariantForDaysLeft(nearest.daysLeft);

          const identityKey = getIdentityKey();
          const dateKey = toDateKey(nearest.date);
          const flagKey = `reminder_shown_${identityKey}_${dateKey}`;
          const alreadyShown = safeGetItem(flagKey);

          if (variant && (skipShownFlag || !alreadyShown)) {
            setReminderVariant(variant);
            setShowReminder(true);
            safeSetItem(flagKey, "true");
          }

          setDateResolved(true);
          return;
        }

        const pastEvents = eventsWithDays
          .filter((ev) => ev.daysLeft < 0)
          .sort((a, b) => b.daysLeft - a.daysLeft);

        if (pastEvents.length > 0) {
          const daysSinceExpiry = -pastEvents[0].daysLeft;

          if (daysSinceExpiry < DATE_SHEET_REASK_BUFFER_DAYS) {
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
    [userId, visitorId, idsReady, getIdentityKey, setDateResolved]
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

       {showCityModal && !isCityDisabledRoute && (
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
              setShowDateSheet(false);
              setDateResolved(true);
              checkAndSchedule({ skipShownFlag: true });
            }}
            userId={userId}
            visitorId={visitorId}
            pincode={pincode}
          />
        )}

        {isDateSheetAllowedPath && showReminder && (
          <EventReminderPopup
            isOpen={showReminder}
            onClose={() => setShowReminder(false)}
            variant={reminderVariant}
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