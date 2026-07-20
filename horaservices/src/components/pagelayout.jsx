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
import EventReminderPopup from "@/components/EventReminderPopup";
import { BASE_URL } from "@/utils/apiconstants";
import { DateGateProvider, useDateGate } from "@/utils/dateGateContext";

const DATE_SHEET_DELAY_MS = 30 * 1000;
const DATE_SHEET_REASK_BUFFER_DAYS = 3;

const getOrCreateVisitorId = () => {
  if (typeof window === "undefined") return "";
  let visitorId = localStorage.getItem("VISITOR_ID");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("VISITOR_ID", visitorId);
  }
  return visitorId;
};

const getDateOnlyParts = (dateInput) => {
  const d = new Date(dateInput);
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth(),
    day: d.getUTCDate(),
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
  const todayUTC = Date.UTC(todayParts.y, todayParts.m, todayParts.day);
  const targetUTC = Date.UTC(targetParts.y, targetParts.m, targetParts.day);
  return Math.round((targetUTC - todayUTC) / (1000 * 60 * 60 * 24));
};

const getVariantForDaysLeft = (daysLeft) => {
  if (daysLeft < 0) return null;
  if (daysLeft <= 4) return "approaching";
  return "planner";
};

const LayoutInner = ({ children }) => {
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [pincode, setPincode] = useState("");
  const [idsReady, setIdsReady] = useState(false);
  const { showCityModal, selectCity, isCityDisabledRoute } = useCity();
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

        const res = await fetch(
          `${BASE_URL}/api/event-dates/my-events?${params.toString()}`
        );

        let events = [];
        if (res.ok) {
          const json = await res.json();
          events = json?.data?.eventDates || [];
        }

        const eventsWithDays = events.map((ev) => ({
          ...ev,
          daysLeft: daysBetween(ev.date),
        }));

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

        {showCityModal && !isCityDisabledRoute && <CitySelector onSelect={selectCity} />}

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