"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import "../app/globals.css";
import Head from "next/head";
import { usePathname } from "next/navigation";
import ConsultationPopupProvider from "@/components/ConsultationPopupProvider";
import { safeGetItem, safeGetSessionItem, safeSetSessionItem } from "@/utils/safeStorage";
import CitySelector from "@/components/Venue/CitySelector";
import { CityProvider, useCity } from "@/utils/cityContext";
import DateSelectionBottomSheet from "@/components/DateSelectionBottomSheet";
import EventReminderPopup from "@/components/EventReminderPopup";
import { BASE_URL } from "@/utils/apiconstants";

const DATE_SHEET_DELAY_MS = 60 * 1000; // 1 minute

// ✅ Event expire hone ke kitne din baad date-sheet popup WAPAS dikhaya
// jaaye. Jaise agar event date 18 hai, to 19 aur 20 ko turant naya
// popup mat dikhao — 3 din ka buffer poora hone par (yani 21 ko) hi
// wapas date-sheet popup dikhega.
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

// ✅ TIMEZONE-SAFE: sirf "kaunsa calendar din hai" compare karta hai,
// UTC/local offset ka koi role nahi. Backend agar "2026-07-18T00:00:00.000Z"
// jaisa UTC-midnight bhejta hai, to normal `new Date().setHours(0,0,0,0)`
// kabhi kabhi ek din peeche/aage chala jaata hai user ke timezone ke hisaab se.
// Isliye humne date ke "Y-M-D" hi nikal kar direct integer subtraction kiya hai.
const getDateOnlyParts = (dateInput) => {
  const d = new Date(dateInput);
  // ✅ UTC methods use kiye — kyunki backend date UTC midnight me store/bhejta
  // hai (jaisa "...T00:00:00.000Z" wale examples me dikha), UTC date-parts hi
  // "actual intended calendar date" hain, local offset se shift nahi hote.
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth(),
    day: d.getUTCDate(),
  };
};

const daysBetween = (targetDate) => {
  const now = new Date();
  const todayParts = { y: now.getFullYear(), m: now.getMonth(), day: now.getDate() };
  const targetParts = getDateOnlyParts(targetDate);

  // Dono ko UTC-midnight Date banao taaki subtraction me koi DST/offset issue na ho
  const todayUTC = Date.UTC(todayParts.y, todayParts.m, todayParts.day);
  const targetUTC = Date.UTC(targetParts.y, targetParts.m, targetParts.day);

  return Math.round((targetUTC - todayUTC) / (1000 * 60 * 60 * 24));
};

// ✅ daysLeft ke hisaab se variant decide:
//  1-4 din baaki   -> "approaching" (LEFT popup)
//  4 din se zyada  -> "planner"     (RIGHT popup)
//  0 ya negative   -> null (aaj hi hai ya expire ho chuki -> reminder nahi)
const getVariantForDaysLeft = (daysLeft) => {
  if (daysLeft <= 0) return null;
  if (daysLeft <= 4) return "approaching";
  return "planner";
};

const LayoutInner = ({ children }) => {
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [pincode, setPincode] = useState("");
  const { showCityModal, selectCity, isCityDisabledRoute } = useCity();

  const [showDateSheet, setShowDateSheet] = useState(false);
  const [reminderVariant, setReminderVariant] = useState(null);
  const [showReminder, setShowReminder] = useState(false);

  const checkStarted = useRef(false);
  const dateSheetTimerRef = useRef(null);

  useEffect(() => {
    const storedId = safeGetItem("userID");
    if (storedId) setUserId(storedId);
    setVisitorId(getOrCreateVisitorId());
    const storedPincode = safeGetItem("pincode");
    if (storedPincode) setPincode(storedPincode);
  }, []);

  const checkAndSchedule = useCallback(
    async (opts = {}) => {
      const { skipShownFlag = false } = opts;

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

        console.log("[EventReminder] raw eventDates from API:", events);

        const eventsWithDays = events.map((ev) => ({
          ...ev,
          daysLeft: daysBetween(ev.date),
        }));

        const futureEvents = eventsWithDays
          .filter((ev) => ev.daysLeft > 0)
          .sort((a, b) => a.daysLeft - b.daysLeft);

        console.log("[EventReminder] futureEvents with daysLeft:", futureEvents);

        if (futureEvents.length > 0) {
          const nearest = futureEvents[0];
          const variant = getVariantForDaysLeft(nearest.daysLeft);

          console.log("[EventReminder] nearest event:", nearest, "-> variant:", variant);

          const flagKey = `reminder_shown_${userId || visitorId}_${nearest.date}_${new Date().toDateString()}`;
          const alreadyShownToday = safeGetSessionItem(flagKey);

          if (variant && (skipShownFlag || !alreadyShownToday)) {
            setReminderVariant(variant);
            setShowReminder(true);
            safeSetSessionItem(flagKey, "true");
          }
          return; // ✅ future date hai -> date-sheet ka timer schedule bilkul mat karo
        }

        // ✅ Koi future event nahi hai. Ab check karo ki koi past/expired event
        // hai kya, aur agar hai to uske expire hue kitne din ho chuke hain.
        // Jab tak DATE_SHEET_REASK_BUFFER_DAYS poora na ho jaaye, date-sheet
        // popup wapas nahi dikhega.
        const pastEvents = eventsWithDays
          .filter((ev) => ev.daysLeft <= 0)
          .sort((a, b) => b.daysLeft - a.daysLeft); // sabse recent expiry pehle (0, -1, -2 ...)

        if (pastEvents.length > 0) {
          const daysSinceExpiry = -pastEvents[0].daysLeft; // 0,1,2,3...
          console.log(
            "[EventReminder] most recent past event:",
            pastEvents[0],
            "-> daysSinceExpiry:",
            daysSinceExpiry
          );

          if (daysSinceExpiry < DATE_SHEET_REASK_BUFFER_DAYS) {
            // Buffer abhi khatam nahi hua -> date-sheet popup mat dikhao
            if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
            return;
          }
        }

        if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
        dateSheetTimerRef.current = setTimeout(() => {
          setShowDateSheet(true);
        }, DATE_SHEET_DELAY_MS);
      } catch (err) {
        console.error("Failed to check existing event dates:", err);
        if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
        dateSheetTimerRef.current = setTimeout(() => {
          setShowDateSheet(true);
        }, DATE_SHEET_DELAY_MS);
      }
    },
    [userId, visitorId]
  );

  useEffect(() => {
    if (!userId && !visitorId) return;
    if (checkStarted.current) return;
    checkStarted.current = true;

    checkAndSchedule();

    return () => {
      if (dateSheetTimerRef.current) clearTimeout(dateSheetTimerRef.current);
    };
  }, [userId, visitorId, checkAndSchedule]);

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

        {showDateSheet && (
          <DateSelectionBottomSheet
            isOpen={showDateSheet}
            onClose={() => setShowDateSheet(false)}
            onConfirm={(date, apiData) => {
              console.log("Event date saved:", date, apiData);
              setShowDateSheet(false);
              checkAndSchedule({ skipShownFlag: true });
            }}
            userId={userId}
            visitorId={visitorId}
            pincode={pincode}
          />
        )}

        {showReminder && (
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
      <LayoutInner>{children}</LayoutInner>
    </CityProvider>
  );
};

export default PageLayout;