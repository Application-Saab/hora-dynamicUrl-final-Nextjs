"use client";
import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import Image from "next/image";
import "./Eventdatebanner.css";
import calendarBgimage from "@/assets/calendarBgimage.webp";
import { BASE_URL } from "@/utils/apiconstants";
import { useDateGate } from "@/utils/dateGateContext";
import DateSelectionBottomSheet from "../DateSelectionBottomSheet";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdProp, visitorIdProp]);

  // ✅ Kahin bhi (global date-sheet ya kisi aur component se) date confirm
  // hone par dateResolved true hota hai -> ye banner khud refetch kar le
  useEffect(() => {
    if (dateResolved) {
      fetchEventDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateResolved]);

  // ✅ onConfirm ab naya date/apiData bhi receive karta hai (agar sheet dega),
  // taaki UI turant update ho jaye — fir bhi safety ke liye refetch bhi karte hain
  const handleConfirm = (newDate, apiData) => {
    if (newDate) {
      setEventDate(newDate);
    }
    setIsSheetOpen(false);
    // ✅ server se confirm karne ke liye refetch bhi kar lo (latest event id sahi rahe)
    fetchEventDate();
  };

  const { userId: currentUserId, visitorId: currentVisitorId } = getIds();
  const showBanner = !isLoading && !!eventDate;

  return (
    <>
      {/* ✅ Banner sirf tab dikhta hai jab date load ho chuki ho aur maujood ho.
          Lekin isse "return null" NAHI kiya — kyunki wo poore component ko
          unmount kar deta tha, jisse edit-sheet bhi beech me band ho jaati thi
          agar exactly usi waqt koi background refetch chal raha ho. */}
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
            <Pencil size={16} strokeWidth={2.2} color="#ffffff" />
          </button>
        </div>
      )}

      {/* ✅ Ye ab banner ke isLoading/eventDate state se independent hai —
          isliye background refetch ke beech mein bhi sheet band nahi hogi */}
      <DateSelectionBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onConfirm={handleConfirm}
        userId={currentUserId}
        visitorId={currentVisitorId}
        pincode={pincode}
        eventTitle={eventTitle}
        eventId={eventId}       // ✅ isse sheet ko pata chalega ki EDIT karna hai, naya create nahi
        initialDate={eventDate} // ✅ sheet me current date pre-select dikhega
      />
    </>
  );
}