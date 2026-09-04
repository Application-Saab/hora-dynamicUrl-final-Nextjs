"use client";
import useApi from "@/hooks/useApi";
import { GET_ALL_EVENTS_BY_USERID } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import "./Eventhub.css";
import Image from "next/image";
import celebrationRight from "@/assets/Homepageimages/celebration-right.webp";
import celebrationLeft from "@/assets/Homepageimages/celebration-left.webp";

const DUMMY_AVATARS = [
  "https://i.pravatar.cc/100?img=12",
  "https://i.pravatar.cc/100?img=32",
  "https://i.pravatar.cc/100?img=47",
  "https://i.pravatar.cc/100?img=49",
];

const EventHub = ({ userId }) => {
  const pathname = usePathname();
  const { data, loading } = useApi(
    userId ? `${GET_ALL_EVENTS_BY_USERID}/${userId}` : null,
    "get"
  );
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderlandinternational"
  );

  // Sirf city nikaal rahe hain, locality nahi
  const city = useMemo(() => {
    const segments = pathname?.split("/")?.filter(Boolean) || [];
    return segments[0] || null;
  }, [pathname]);

  const buildHref = (path) => {
    if (city) return `/${city}${path}`;
    return path;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Event Date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getEventHref = (event) => {
    const basePath = isWonderlandInternational
      ? "/wonderlandinternational/invite"
      : "/wonderland/invite";
    return buildHref(`${basePath}?eventid=${event._id}`);
  };

  const events = data?.data || [];

  return (
    <div className="event-hub">
      {/* HEADER */}
      <div className="event-hub-header">
        <Image
          src={celebrationLeft}
          alt="Celebration"
          className="header-icon"
          width={50}
          height={50}
        />
        <div className="header-text">
          <h2>Event Hub</h2>
          <p>
            A timeline of all the celebrations you've hosted and participated in.
          </p>
        </div>
        <Image
          src={celebrationRight}
          alt="Celebration"
          className="header-icon"
          width={50}
          height={50}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading your events...</p>
      ) : (
        <div className="event-hub-scroll">
          {events.map((event) => {
            const thumbSrc = event.externalTemplateImageUrl;

            const realGuests = (event.guests || []).filter(
              (g) => g && (g.url || g.name)
            );

            return (
              <Link
                href={getEventHref(event)}
                className="event-hub-card"
                key={event._id}
              >
                {/* LEFT - THUMBNAIL IMAGE */}
                <div className="event-hub-thumb">
                  {thumbSrc ? (
                    <img src={thumbSrc} alt={event.hostName || "Event invite"} />
                  ) : (
                    <div className="event-hub-thumb-fallback">
                      <span>{(event.hostName || "E").trim().charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {/* RIGHT - DETAILS */}
                <div className="event-hub-details">
                  <span
                    className={`role-badge ${
                      event.eventRole?.toLowerCase() === "host" ? "host" : "guest"
                    }`}
                  >
                    {event.eventRole
                      ? event.eventRole.charAt(0).toUpperCase() +
                        event.eventRole.slice(1)
                      : "Guest"}
                  </span>

                  <h3 className="event-title">
                    {event.eventType || event.hostName || "Event"}
                  </h3>

                  <div className="event-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span>{formatDate(event.eventDate)}</span>
                  </div>

                  <div className="event-avatars-row">
                    <div className="event-avatars">
                      {realGuests.length > 0
                        ? realGuests.slice(0, 4).map((g, i) => (
                            <img
                              key={g._id || g.id || `${event._id}-${i}`}
                              src={g.url || DUMMY_AVATARS[i % DUMMY_AVATARS.length]}
                              alt={g.name || "guest"}
                              className="avatar"
                              style={{ zIndex: 10 - i }}
                            />
                          ))
                        : DUMMY_AVATARS.map((avatar, i) => (
                            <img
                              key={`dummy-${i}`}
                              src={avatar}
                              alt="Guest"
                              className="avatar"
                              style={{ zIndex: 10 - i }}
                            />
                          ))}
                    </div>

                    {realGuests.length > 4 && (
                      <span className="avatar-more">
                        +{realGuests.length - 4}
                      </span>
                    )}
                  </div>

                  <span className="visit-btn">
                    Visit Event
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}

          {/* STATIC PROMO CARD - always shown at the end */}
          <div className="event-hub-promo-card">
            <div className="promo-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1z" />
                <path d="M16 8a4 4 0 010 8" />
                <path d="M19 5a8 8 0 010 14" />
              </svg>
            </div>
            <p>Don't let memories fade—track and relive every event.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHub;