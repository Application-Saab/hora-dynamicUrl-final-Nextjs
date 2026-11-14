"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "./venueavailabilitymodal.css";
import { BASE_URL } from "@/utils/apiconstants";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import { fetchWithError } from "@/utils/fetchWithError";
import { useCity } from "@/utils/cityContext";
import { trackMetaCustomEvent } from "@/utils/fpixel";
import {
  MARKETING_EVENTS,
  trackWhatsAppButtonClick,
} from "@/utils/marketingEvents";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";

// Illustration from assets or inline SVG
import WatsappIcon from "../../assets/venue/check_availability_wa.svg";
import Banner from "../../assets/venue/check_availability_popup_banner.png";
import CalendarIcon from "../../assets/venue/calendor_icon.svg";

const MONTH_NAMES = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const NOT_SELECTED = "NOT_SELECTED";

const pushGTMEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

const toISODateOnly = (date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
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

export default function VenueAvailabilityModal({
  isOpen,
  onClose,
  eventData,
  userId,
  visitorId,
  pincode,
  whatsappNumber = "917338584828",
  initialDate = null,
}) {
  useLockBodyScroll(isOpen);

  const { selectedCityName, selectedCitySlug } = useCity();

  const venueName = eventData?.venueName || "";
  const address = eventData?.location || "";
  const resolvedCity =
    selectedCityName ||
    (selectedCitySlug && selectedCitySlug !== NOT_SELECTED
      ? selectedCitySlug
      : "") ||
    eventData?.city ||
    "";

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvedMode, setResolvedMode] = useState("create");
  const [error, setError] = useState(null);

  // GTM & Meta Tracking on view
  useEffect(() => {
    if (!isOpen) return;

    const eventParams = {
      popup_name: "venue_check_availability_modal",
      city: resolvedCity || "",
      venue_name: venueName,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    };

    pushGTMEvent("venue_availability_popup_view", eventParams);
    trackMetaCustomEvent("venue_availability_popup_view", eventParams);
  }, [isOpen, resolvedCity, venueName]);

  // Check existing events to set mode (add vs create)
  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    if (initialDate) {
      const parsed = parseDateSafely(initialDate);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        setViewMonth(parsed.getMonth());
        setViewYear(parsed.getFullYear());
      }
    }

    if (!userId && !visitorId) return;

    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    else params.append("visitorId", visitorId);

    fetchWithError(`${BASE_URL}/api/event-dates/my-events?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        const events = json?.data?.eventDates || [];
        setResolvedMode(events.length > 0 ? "add" : "create");
      })
      .catch((err) => {
        console.error("Error checking events:", err);
        setResolvedMode("create");
      });
  }, [isOpen, userId, visitorId, initialDate]);

  if (!isOpen) return null;

  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

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

  // WhatsApp link generator with date details
  const buildWhatsappUrl = (chosenDate) => {
    const formattedDate = chosenDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const lines = [
      `Hi, I'm interested in *${venueName || "this venue"}*.`,
      address ? `Address: ${address}` : null,
      `Event Date: *${formattedDate}*`,
      "",
      "Please share availability and more details.",
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const handleCheckAvailability = async () => {
    setIsSubmitting(true);
    setError(null);

    // Save event date to backend if user identifiers exist
    if (userId || visitorId) {
      const endpoint =
        resolvedMode === "add"
          ? `${BASE_URL}/api/event-dates/add-date`
          : `${BASE_URL}/api/event-dates`;
      const method = resolvedMode === "add" ? "PATCH" : "POST";

      const payload = {
        ...(userId && { userId }),
        ...(visitorId && { visitorId }),
        ...(resolvedMode === "create" && pincode && { pincode }),
        date: toISODateOnly(selectedDate),
        eventTitle: venueName ? `${venueName} Booking` : "Venue Booking",
      };

      try {
        await fetchWithError(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Failed to save date:", err);
      }
    }

    // Analytics Tracking
    trackWhatsAppButtonClick(
      MARKETING_EVENTS.WHATSAPP_BUTTONS.CHECK_AVAILABILITY_VENUE_INNER,
      {
        button_name: "Check Availability Popup",
        button_type: "check_availability_modal",
        venue_name: venueName,
        selected_date: toISODateOnly(selectedDate),
        page_path: window.location.pathname,
      },
    );
    trackWAClicks();

    setIsSubmitting(false);
    onClose();

    // Open WhatsApp
    window.open(buildWhatsappUrl(selectedDate), "_blank");
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  const isSelected = (day) =>
    day &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const formattedDisplay = selectedDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="vam-overlay" onClick={onClose}>
      <div className="vam-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button Top Center */}
        <button className="vam-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="vam-header">
          <Image
            src={Banner}
            alt="Check Availability"
            className="vam-banner-img"
            fill
            priority
          />
          <div className="vam-header-text">
            <h3>Check Availability</h3>
            <p>Choose your preferred event date to check venue availability.</p>
          </div>
        </div>

        {/* Calendar Inner Box */}
        <div className="vam-calendar-box">
          {/* Month Navigation */}
          <div className="vam-month-nav">
            <button
              type="button"
              className="vam-nav-arrow"
              onClick={handlePrevMonth}
              disabled={isPrevMonthDisabled}
            >
              <ChevronLeft size={22} strokeWidth={2.4} />
            </button>
            <span className="vam-month-title">{MONTH_NAMES[viewMonth]}</span>
            <button
              type="button"
              className="vam-nav-arrow"
              onClick={handleNextMonth}
            >
              <ChevronRight size={22} strokeWidth={2.4} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="vam-weekdays">
            {DAY_NAMES.map((d) => (
              <span key={d} className="vam-weekday">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="vam-days-grid">
            {calendarCells.map((day, idx) =>
              day === null ? (
                <span
                  key={`empty-${idx}`}
                  className="vam-day-cell vam-day-empty"
                />
              ) : (
                <button
                  key={day}
                  type="button"
                  className={`vam-day-cell ${isSelected(day) ? "selected" : ""} ${
                    isPastDate(day) ? "disabled" : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                  disabled={isPastDate(day)}
                >
                  {day}
                </button>
              ),
            )}
          </div>
        </div>

        {error && <p className="vam-error">{error}</p>}

        {/* Footer Row */}
        <div className="vam-footer">
          <div className="vam-footer-date-info">
            <div className="vam-cal-icon-wrap">
              <Image src={CalendarIcon} alt="Calendar" height={20} width={20} />
            </div>
            <div className="vam-date-labels">
              <span className="vam-date-subtitle">Selected Date</span>
              <span className="vam-date-value">{formattedDisplay}</span>
            </div>
          </div>

          <button
            type="button"
            className="vam-wa-btn"
            onClick={handleCheckAvailability}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 size={16} className="vam-spinner" />
            ) : (
              <>
                <Image src={WatsappIcon} alt="WA" width={16} height={16} />
                <span>Check Availability</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
