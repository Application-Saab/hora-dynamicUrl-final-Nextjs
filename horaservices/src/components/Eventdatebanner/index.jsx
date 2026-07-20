"use client";
import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import Image from "next/image";
import "./Eventdatebanner.css";
import calendarBgimage from "@/assets/calendarBgimage.webp";
import { BASE_URL } from "@/utils/apiconstants";
import { useDateGate } from "@/utils/dateGateContext";
import DateSelectionBottomSheet from "../DateSelectionBottomSheet";
import PencilEditIcon from "@/assets/pencilEdit.svg";
import EventReminderPopup from "../EventReminderPopup";
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const formatEventDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getUTCMonth()];
  return `${day} ${month}`;
};

export default function EventDateBanner({
  userId: userIdProp,
  visitorId: visitorIdProp,
  pincode,
  eventTitle = "",
}) {
  const { dateResolved, setDateResolved } = useDateGate();

  const [eventDate, setEventDate] = useState(null);
  const [eventId, setEventId] = useState(null); // ✅ latest event ka _id, edit ke liye
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderVariant, setReminderVariant] = useState("planner");

  const getIds = () => {
    if (typeof window === "undefined") {
      return { userId: userIdProp, visitorId: visitorIdProp };
    }
    const userId = userIdProp || null;
    const visitorId =
      visitorIdProp || localStorage.getItem("VISITOR_ID") || null;
    return { userId, visitorId };
  };

  const fetchEventDate = () => {
    const { userId, visitorId } = getIds();

    if (!userId && !visitorId) {
      console.warn(
        "EventDateBanner: no userId/visitorId found (prop or localStorage) — skipping fetch."
      );
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (visitorId) params.append("visitorId", visitorId);

    setIsLoading(true);

    fetch(`${BASE_URL}/api/event-dates/my-events?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        const events = json?.data?.eventDates || [];
        if (events.length > 0) {
          // ✅ array ka sabse LAST (latest added) event uthao, pehla nahi
          const lastEvent = events[events.length - 1];
          setEventDate(lastEvent.date);
          setEventId(lastEvent._id);
          setDateResolved(true);
        } else {
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

  useEffect(() => {
    fetchEventDate();
  }, [userIdProp, visitorIdProp]);

  useEffect(() => {
    if (dateResolved) {
      fetchEventDate();
    }
  }, [dateResolved]);

  const handleConfirm = (newDate, apiData) => {
    if (newDate) {
      setEventDate(newDate);
      // ✅ reminder sirf yahan open hoga
      const today = new Date();
      const selected = new Date(newDate);
      const diffMs = selected.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      setReminderVariant(diffDays >= 0 && diffDays <= 4 ? "approaching" : "planner");
      setReminderOpen(true);
    }
    setIsSheetOpen(false);
    fetchEventDate();
  };

  const { userId: currentUserId, visitorId: currentVisitorId } = getIds();
  const showBanner = !isLoading && !!eventDate;

  return (
    <>
      {showBanner && (
        <div className="edb-banner">
          {/* ✅ CSS me .edb-banner-image-wrap hi rounded-corner + shadow
              handle karta hai — Image ko usi wrapper ke andar rakhna zaroori hai */}
          <div className="edb-banner-image-wrap">
            <Image
              src={calendarBgimage}
              alt=""
              fill
              className="edb-banner-bg"
              style={{ pointerEvents: "none" }} // ✅ image kabhi click intercept na kare
              priority
             sizes="(max-width: 600px) 100vw, 600px"
              quality={90}
            />
          </div>

          <div className="edb-banner-content">
            <span className="edb-banner-text">
              <span className="edb-banner-text-label">Event Date</span>
              <span className="edb-banner-text-date">
                {formatEventDate(eventDate)}
              </span>
            </span>
          </div>

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
        eventTitle={eventTitle}
        eventId={eventId}
        initialDate={eventDate}
      />
      <EventReminderPopup
        isOpen={reminderOpen}
        onClose={() => setReminderOpen(false)}
        variant={reminderVariant}
      />
    </>
  );
}