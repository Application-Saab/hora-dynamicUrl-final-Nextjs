import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "./DateSelectionBottomSheet.css";
import Image from "next/image";
import calendarBgimage from "@/assets/calendarBarBgimage.webp";
import { BASE_URL } from "@/utils/apiconstants";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import { fetchWithError } from "@/utils/fetchWithError";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const toISODateOnly = (date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  ).toISOString();
};

const parseDateSafely = (dateInput) => {
  if (dateInput instanceof Date) return dateInput;

  if (typeof dateInput === "string") {
    let normalized = dateInput.trim();

    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?/.test(normalized)) {
      normalized = normalized.replace(" ", "T");
    }
    if (/^\d{4}\/\d{2}\/\d{2}/.test(normalized)) {
      normalized = normalized.replace(/\//g, "-");
    }

    const d = new Date(normalized);
    if (!isNaN(d.getTime())) return d;
    return new Date(dateInput);
  }

  return new Date(dateInput);
};
const pickExistingEventDate = (events) => {
  if (!events || events.length === 0) return null;

  for (let i = events.length - 1; i >= 0; i--) {
    const parsed = parseDateSafely(events[i].date);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

export default function DateSelectionBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  userId,
  visitorId,
  pincode,
  eventTitle = "",
  initialDate = null,
  eventId = null,
}) {
  useLockBodyScroll(isOpen);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [resolvedMode, setResolvedMode] = useState(null);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setError(null);
    setResolvedMode(null);

 if (initialDate) {
      const parsedInitial = parseDateSafely(initialDate);
      if (!isNaN(parsedInitial.getTime())) {
        setSelectedDate(parsedInitial);
        setViewMonth(parsedInitial.getMonth());
        setViewYear(parsedInitial.getFullYear());
      }
    }

    if (!userId && !visitorId) return;

    let cancelled = false;
    setIsCheckingExisting(true);

    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (visitorId) params.append("visitorId", visitorId);

    fetchWithError(`${BASE_URL}/api/event-dates/my-events?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const events = json?.data?.eventDates || [];
        setResolvedMode(events.length > 0 ? "add" : "create");
     const existingDate = pickExistingEventDate(events);
        if (existingDate) {
          setSelectedDate(existingDate);
          setViewMonth(existingDate.getMonth());
          setViewYear(existingDate.getFullYear());
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to check existing events:", err);
        setResolvedMode("create");
      })
      .finally(() => {
        if (!cancelled) setIsCheckingExisting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, userId, visitorId]);

  if (!isOpen) return null;

  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isPastDate = (day) => {
    if (!day) return false;
    const cellDate = new Date(viewYear, viewMonth, day);
    return cellDate < todayDateOnly;
  };

  const isPrevMonthDisabled =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDateClick = (day) => {
    if (isPastDate(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setError(null);
  };

  const handleConfirm = async () => {
    if (!userId && !visitorId) {
      setError("Missing userId/visitorId — can't save this date.");
      return;
    }
    if (isCheckingExisting) {
      setError("Please wait, checking your existing events...");
      return;
    }
    if (!resolvedMode) {
      setError("Couldn't determine create/add mode — please try again.");
      return;
    }

    const endpoint =
      resolvedMode === "add"
        ? `${BASE_URL}/api/event-dates/add-date`
        : `${BASE_URL}/api/event-dates`;

    const payload = {
      ...(userId && { userId }),
      ...(visitorId && { visitorId }),
      ...(resolvedMode === "create" && pincode && { pincode }),
      date: toISODateOnly(selectedDate),
      ...(eventTitle && { eventTitle }),
    };

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetchWithError(endpoint, {
        method: resolvedMode === "add" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Request failed (${res.status})`);
      }

      const data = await res.json();
      if (onConfirm) onConfirm(selectedDate, data);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong saving this date.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  const totalRows = Math.ceil(calendarCells.length / 7);

  const isSelected = (day) =>
    day &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const [weekdayPart, ...rest] = formattedSelectedDate.split(", ");
  const displayDate = `${weekdayPart} , ${rest.join(", ")}`;
useEffect(() => {
  if (isOpen) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY); // ✅ exact scroll position restore
    };
  }
}, [isOpen]);
  return (
    <div className="dsb-device">
      <div className="dsb-overlay" onClick={onClose} />

      <button className="dsb-close-btn" onClick={onClose} aria-label="Close">
        <X size={16} strokeWidth={2.4} color="#1a1a1a" />
      </button>

      <div className="dsb-sheet">
        <div className="dsb-header">
       
          <Image
            src={calendarBgimage}
            alt=""
            fill
            sizes="(max-width: 500px) 100vw, 500px"
            className="dsb-header-bg"
            style={{ objectFit: "cover" }}
            priority
            placeholder="blur"
          />
          <div className="dsb-header-text">
            <h1>Select Event Date</h1>
            <p className="dsb-subtitle">
              Choose the date of your event to check availability.
            </p>
          </div>
        </div>

        <div className="dsb-calendar-card">
          <div className="dsb-month-nav">
            <button
              className="dsb-nav-btn"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              disabled={isPrevMonthDisabled}
              style={isPrevMonthDisabled ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
            >
              <ChevronLeft size={20} strokeWidth={2.4} />
            </button>
            <span className="dsb-month-label">{MONTH_NAMES[viewMonth].toUpperCase()}</span>
            <button className="dsb-nav-btn" onClick={handleNextMonth} aria-label="Next month">
              <ChevronRight size={20} strokeWidth={2.4} />
            </button>
          </div>

          <div className="dsb-day-names">
            {DAY_NAMES.map((d) => (
              <span key={d} className="dsb-day-name">{d}</span>
            ))}
          </div>

          <div className="dsb-days-grid" style={{ "--total-rows": totalRows }}>
            {calendarCells.map((day, idx) =>
              day === null ? (
                <span key={`empty-${idx}`} className="dsb-day-cell dsb-day-empty" />
              ) : (
                <button
                  key={day}
                  className={`dsb-day-cell ${isSelected(day) ? "dsb-day-selected" : ""} ${
                    isPastDate(day) ? "dsb-day-disabled" : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                  disabled={isPastDate(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>

        {error && <p className="dsb-error">{error}</p>}
      </div>

      <div className="dsb-footer">
        <div className="dsb-footer-left">
          <div className="dsb-footer-icon">
            <CalendarIcon size={18} strokeWidth={2} color="#7c3aad" />
          </div>
          <div>
            <p className="dsb-footer-label">Selected Date</p>
            <p className="dsb-footer-date">{displayDate}</p>
          </div>
        </div>
        <button
          className="dsb-confirm-btn"
          onClick={handleConfirm}
          disabled={isSubmitting || isCheckingExisting}
        >
          {isSubmitting || isCheckingExisting ? (
            <Loader2 size={16} className="dsb-spinner" />
          ) : (
            "Confirm Date"
          )}
        </button>
      </div>
    </div>
  );
}