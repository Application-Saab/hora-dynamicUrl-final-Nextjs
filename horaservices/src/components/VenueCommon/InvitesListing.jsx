import { useEffect, useMemo, useRef, useState } from "react";
import "./venuelist.css";
import locationIcon from "../../assets/venue/venue_card_location_icon.svg";
import tagIcon from "@/assets/venuelanding/tagIcon.svg";
import guestIcon from "@/assets/venuelanding/guest.svg";
import galleryIcon from "@/assets/venuelanding/galleryicon.svg";
import { FaArrowRightLong } from "react-icons/fa6";
import Image from "next/image";
import {
  BASE_URL,
  VENUE_PUBLIC_LISTING,
} from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";
import { getPageCache, setPageCache } from "@/utils/scrollDataCache";

const BATCH_SIZE = 10;

// GTM dataLayer push (inline helper — no extra file needed)
const pushToDataLayer = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

const getCacheKey = (eventType, venueType, guestCapacity, city, locality) =>
  `venue-list-${JSON.stringify({
    eventType,
    venueType,
    guestCapacity,
    city,
    locality: locality || null,
  })}`;

const getVenueRoute = (city) =>
  city ? `/${city.toLowerCase()}/venue-list/venue` : "/venue-list/venue";

const getLocalityValue = (locality) => {
  if (!locality) return null;
  if (typeof locality === "string") return locality.trim() || null;
  if (typeof locality === "object") {
    return (
      locality.name ||
      locality.label ||
      locality.value ||
      locality.locality ||
      null
    );
  }
  return null;
};

const VenueList = ({
  eventType,
  venueType,
  guestCapacity,
  city,
  locality,
  search,
  initialVenues = null,
}) => {
  const localityValue = getLocalityValue(locality);

  const cacheKey = getCacheKey(
    eventType,
    venueType,
    guestCapacity,
    city,
    localityValue,
  );

  const cached = typeof window !== "undefined" ? getPageCache(cacheKey) : null;

  const getVenueHref = (venue, halls = []) => {
    if (!venue?._id) return "#";

    const base = getVenueRoute(city);
    const params = new URLSearchParams();

    params.set("venueid", venue._id);
    if (venue.guestCapacity) params.set("guests", String(venue.guestCapacity));
    if (venue.isParkingAvailable) params.set("parking", "1");
    if (venue.totalRoomsAvailable)
      params.set("rooms", String(venue.totalRoomsAvailable));
    if (halls.length) params.set("halls", JSON.stringify(halls));

    return `${base}?${params.toString()}`;
  };

  const buildWhatsappLink = (venue) => {
    const rawCity = venue?.city || city || "";
    const cityName = rawCity
      ? rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase()
      : "";

    const message = encodeURIComponent(
      `Hi, give me offline booking support for venue services${
        cityName ? ` in ${cityName}` : ""
      }.`
    );

    return `https://wa.me/91${WHATSAPP_PHONE}?text=${message}`;
  };

  const [venues, setVenues] = useState(() => {
    if (Array.isArray(initialVenues)) return initialVenues;
    if (cached?.data) return cached.data;
    return [];
  });

  const [loading, setLoading] = useState(() => {
    if (Array.isArray(initialVenues)) return false;
    if (cached) return false;
    return true;
  });
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loadTimerRef = useRef(null);

  useEffect(() => {
    const key = getCacheKey(
      eventType,
      venueType,
      guestCapacity,
      city,
      localityValue,
    );
    const existing = typeof window !== "undefined" ? getPageCache(key) : null;

    if (existing && !existing.isStale) {
      setVenues(existing.data);
      setLoading(false);
      setVisibleCount(BATCH_SIZE);
      return;
    }

    if (!existing) {
      if (!(Array.isArray(initialVenues) && venues.length > 0 && !existing)) {
        if (venues.length === 0) setLoading(true);
      }
    }

    setVisibleCount(BATCH_SIZE);

    const params = new URLSearchParams();
    if (eventType) params.append("eventType", eventType);
    if (venueType && venueType !== "all") params.append("venueType", venueType);
    if (guestCapacity) params.append("guestCapacity", guestCapacity);
    if (city) params.append("city", city);
    if (localityValue) params.append("locality", localityValue);

    let cancelled = false;

    fetchWithError(`${BASE_URL}${VENUE_PUBLIC_LISTING}?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const dataList = res.data || [];
        if (typeof window !== "undefined") setPageCache(key, dataList);
        setVenues(dataList);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [eventType, venueType, guestCapacity, city, localityValue]);

  const filteredVenues = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return venues;

    return venues.filter((v) => {
      const nameMatch = v.venueName?.toLowerCase().includes(q);
      const localityMatch = v.locality?.toLowerCase().includes(q);
      const cityMatch = v.city?.toLowerCase().includes(q);
      const typeArr = Array.isArray(v.venueType)
        ? v.venueType
        : v.venueType
          ? [v.venueType]
          : [];
      const typeMatch = typeArr.some((t) => t?.toLowerCase().includes(q));

      return nameMatch || localityMatch || cityMatch || typeMatch;
    });
  }, [venues, search]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [search]);

  useEffect(() => {
    if (loading) return;
    if (visibleCount >= filteredVenues.length) return;

    loadTimerRef.current = setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + BATCH_SIZE, filteredVenues.length),
      );
      loadTimerRef.current = null;
    }, 1000);

    return () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    };
  }, [loading, visibleCount, filteredVenues.length]);

  if (loading) return null;

  if (!venues.length) {
    return (
      <div className="venue-status coming-soon-box">
        <h3>
          {city
            ? `${city} venues are coming soon! 🎉`
            : "Venues are coming soon! 🎉"}
        </h3>
        <p>
          {city
            ? `We're expanding our venue network in ${city}. Stay tuned for amazing venues and packages.`
            : "We're expanding to more cities. Stay tuned for amazing venues and packages."}
        </p>
      </div>
    );
  }

  if (!filteredVenues.length) {
    return (
      <div className="venue-status coming-soon-box">
        <h3>No venues found 🔍</h3>
        <p>
          We couldn't find any venues matching "{search}". Try a different
          search term.
        </p>
      </div>
    );
  }

  const displayedVenues = filteredVenues.slice(0, visibleCount);

  return (
    <>
      <div className="venue-list">
        {displayedVenues.map((v) => {
          const tags = Array.isArray(v.venueType)
            ? v.venueType
            : v.venueType
              ? [v.venueType]
              : [];
          const halls = Array.isArray(v.hallType)
            ? v.hallType
            : v.hallType
              ? [v.hallType]
              : [];

          const shortLocation =
            [v.locality, v.city].filter(Boolean).join(", ") || v.city || "N/A";

          const href = getVenueHref(v, halls);

          // Common GTM payload for this venue card
          const gtmPayload = {
            venue_id: v._id,
            venue_name: v.venueName,
            venue_city: v.city || city || "",
            venue_locality: v.locality || "",
            starting_price: v.startingPrice || null,
            page_path:
              typeof window !== "undefined" ? window.location.pathname : "",
          };

          return (
            <div
              key={v._id}
              className="venue-card"
              style={{
                position: "relative",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <a
                href={href}
                aria-label={v.venueName}
                onClick={() => pushToDataLayer("venue_card_click", gtmPayload)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}
              />

              <div className="venue-card-img-wrap">
                <img
                  src={v.venueImageUrl || "/placeholder.jpg"}
                  alt={v.venueName}
                  className="venue-card-img"
                />
                {v?.imageCount > 0 && (
                  <span className="see-photos-btn">
                    <Image
                      src={galleryIcon}
                      alt="Gallery"
                      className="stat-icon"
                      width={14}
                      height={14}
                    />
                    {`See Photos (${v?.imageCount}+)`}
                  </span>
                )}
              </div>

              <div className="venue-card-body">
                <div>
                  <h3 className="venue-name">{v.venueName}</h3>
                  <p className="venue-location">
                    <Image
                      src={locationIcon}
                      alt="Location"
                      className="location-icon"
                    />
                    <span className="location-text">{shortLocation}</span>
                  </p>

                  {tags.length > 0 && (
                    <div className="venue-tags-row">
                      {tags.map((t, i) => (
                        <span className="venue-tag-pill" key={i}>
                          <Image
                            src={tagIcon}
                            alt="Tag"
                            className="pill-icon-venue"
                            width={12}
                            height={12}
                          />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="guest-capacity-row">
                    <span>
                      <Image
                        src={guestIcon}
                        alt="Guests"
                        className="guest-capacity-icon"
                      />
                      <span className="guest-capacity-text">
                        {v.minGuestCapacity && `${v?.minGuestCapacity} -`}{" "}
                        {v.guestCapacity} Guests
                      </span>
                    </span>
                  </div>
                </div>
                <div className="venue-card-divider"></div>
                <div>
                  <p className="venue-price">
                    ₹{v?.startingPrice?.toLocaleString("en-IN") || "N/A"}
                    <span className="price-closer">/-</span>{" "}
                    <span className="price-divider">|</span>
                    <span className="price-starting-text">Starting Price</span>
                  </p>

                  <div className="venue-card-btn-ctn">
                    <div onClick={(e) => {
                        e.stopPropagation();
                        pushToDataLayer("view_venue_package_click", {
                          ...gtmPayload,
                          button_name: "View Package",
                        });
                      }}
                      >
                      <span className="venue-menu-btn">
                        View Package{" "}
                        <FaArrowRightLong className="menu-button-arrow" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VenueList;
