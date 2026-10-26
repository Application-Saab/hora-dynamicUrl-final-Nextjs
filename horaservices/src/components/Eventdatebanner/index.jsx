"use client";
import React, { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Head from "next/head";
import "./Eventdatebanner.css";
import bannerBg from "@/assets/eventDateBanner.svg";
import calendarBarBgimage from "../../assets/calendarBarBgimage.webp";
import plannerImage from "@/assets/Planner.webp";
import approachingImage from "@/assets/Approaching.webp";
import { BASE_URL } from "@/utils/apiconstants";
import { useDateGate } from "@/utils/dateGateContext";
import DateSelectionBottomSheet from "../DateSelectionBottomSheet";
import PencilEditIcon from "@/assets/pencilEdit.svg";
import { fetchWithError } from "@/utils/fetchWithError";
import { safeGetItem } from "@/utils/safeStorage";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const formatEventDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
};

// Layout ke daysBetween jaisa hi logic: event date UTC date-only hai, aaj local date.
// 0 = aaj, negative = expire ho chuki.
const getDaysLeft = (isoString) => {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return NaN;
  const now = new Date();
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const targetUTC = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  );
  return Math.round((targetUTC - todayUTC) / (1000 * 60 * 60 * 24));
};

export default function EventDateBanner({
  userId: userIdProp,
  visitorId: visitorIdProp,
  pincode,
  city,
  eventTitle = "",
}) {
  const { dateResolved, setDateResolved } = useDateGate();

  const [eventDate, setEventDate] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const midnightTimerRef = useRef(null);
  // Latest fetchEventDate ko timer/listeners me stale closure ke bina call karne ke liye
  const fetchRef = useRef(null);

  const getIds = () => {
    const userId = userIdProp || safeGetItem("userID");

    if (userId) {
      // Logged in — sirf userId se query karo, purana guest visitorId ignore karo
      return { userId, visitorId: null };
    }

    if (typeof window === "undefined") {
      return { userId: null, visitorId: visitorIdProp };
    }

    const visitorId =
      visitorIdProp || localStorage.getItem("VISITOR_ID") || null;
    return { userId: null, visitorId };
  };

  const fetchEventDate = () => {
    const { userId, visitorId } = getIds();

    if (!userId && !visitorId) {
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (userId) {
      params.append("userId", userId);
    } else {
      params.append("visitorId", visitorId);
    }

    setIsLoading(true);

    fetchWithError(`${BASE_URL}/api/event-dates/my-events?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        const events = json?.data?.eventDates || [];

        // Sirf aaj/future wali dates, sabse nazdeek pehle.
        // Expire ho chuki dates ignore (banner nahi dikhega).
        const upcoming = events
          .map((ev) => ({ ...ev, daysLeft: getDaysLeft(ev.date) }))
          .filter((ev) => !Number.isNaN(ev.daysLeft) && ev.daysLeft >= 0)
          .sort((a, b) => a.daysLeft - b.daysLeft);

        if (upcoming.length > 0) {
          const nextEvent = upcoming[0];
          setEventDate(nextEvent.date);
          setEventId(nextEvent._id);
          setDateResolved(true);
        } else {
          // Koi event nahi ya sab expire -> banner hide, popup flow wapas
          setEventDate(null);
          setEventId(null);
          setDateResolved(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch event date:", err);
        setEventDate(null);
        setEventId(null);
        setDateResolved(false);
      })
      .finally(() => setIsLoading(false));
  };

  fetchRef.current = fetchEventDate;

  useEffect(() => {
    fetchEventDate();
  }, [userIdProp, visitorIdProp]);

  useEffect(() => {
    if (dateResolved) {
      fetchEventDate();
    }
  }, [dateResolved]);

  useEffect(() => {
    if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
    if (!eventDate) return;

    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) -
      now +
      1000;

    midnightTimerRef.current = setTimeout(() => {
      fetchRef.current?.();
    }, msUntilMidnight);

    return () => {
      if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
    };
  }, [eventDate]);

  // Tab/app wapas khulne par (sleep ke baad timer miss ho sakta hai) recheck
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchRef.current?.();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const handleConfirm = (newDate) => {
    if (newDate) {
      setEventDate(newDate);
    }
    setIsSheetOpen(false);
    fetchEventDate();
  };

  const { userId: currentUserId, visitorId: currentVisitorId } = getIds();

  // Extra safety: state me koi expired date reh bhi jaye to banner nahi dikhega
  const isUpcoming = !!eventDate && getDaysLeft(eventDate) >= 0;
  const showBanner = !isLoading && isUpcoming;

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={calendarBarBgimage.src} />
        <link rel="preload" as="image" href={plannerImage.src} />
        <link rel="preload" as="image" href={approachingImage.src} />
      </Head>

      {showBanner && (
        <div className="edb-banner">
          {/* Background SVG (gradient + balloons illustration) */}
          <Image
            src={bannerBg}
            alt=""
            fill
            priority
            unoptimized
            className="edb-banner-bg"
            sizes="(max-width: 600px) 100vw, 600px"
          />

          {/* Left: calendar icon box */}
          <div className="edb-cal-box" aria-hidden="true">
            <CalendarDays className="edb-cal-icon" strokeWidth={2} />
          </div>

          {/* Middle: label + date */}
          <div className="edb-banner-content">
            <span className="edb-banner-text-label">Your Event Date</span>
            <span className="edb-banner-text-date">
              {formatEventDate(eventDate)}
            </span>
          </div>

          {/* Edit button */}
          <button
            type="button"
            className="edb-edit-btn"
            onClick={() => setIsSheetOpen(true)}
            aria-label="Edit event date"
          >
            <Image
              src={PencilEditIcon}
              alt="Edit"
              width={17}
              height={16}
              className="edb-edit-icon"
            />
          </button>
        </div>
      )}

      <DateSelectionBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onConfirm={handleConfirm}
        userId={currentUserId}
        visitorId={currentVisitorId}
        pincode={pincode}
        city={city}
        whatsappNumber="917338584828"
        eventTitle={eventTitle}
        eventId={eventId}
        initialDate={eventDate}
        mode="update"
      />
    </>
  );
}