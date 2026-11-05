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
  GET_ALL_VENUE_IMAGES,
} from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";
import { getPageCache, setPageCache } from "@/utils/scrollDataCache";

const BATCH_SIZE = 10;

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
  const [loadingMore, setLoadingMore] = useState(false);
  const loadTimerRef = useRef(null);
  const [imageCounts, setImageCounts] = useState({});
  const fetchedIdsRef = useRef(new Set());

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
    if (localityValue) params.append("locality", localityValue); // ✅ clean value

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
  }, [eventType, venueType, guestCapacity, city, localityValue]); // ✅ localityValue

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

    setLoadingMore(true);
    loadTimerRef.current = setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + BATCH_SIZE, filteredVenues.length),
      );
      setLoadingMore(false);
      loadTimerRef.current = null;
    }, 1000);

    return () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    };
  }, [loading, visibleCount, filteredVenues.length]);

  useEffect(() => {
    const displayed = filteredVenues.slice(0, visibleCount);
    const idsToFetch = displayed
      .map((v) => v._id)
      .filter((id) => id && !fetchedIdsRef.current.has(id));

    if (idsToFetch.length === 0) return;

    idsToFetch.forEach((id) => fetchedIdsRef.current.add(id));

    idsToFetch.forEach((id) => {
      const cacheKey = `venue-image-count-${id}`;
      const cached = getPageCache(cacheKey);
      if (cached) {
        setImageCounts((prev) => ({ ...prev, [id]: cached.data }));
        return;
      }

      fetchWithError(`${BASE_URL}${GET_ALL_VENUE_IMAGES}/${id}`)
        .then((r) => r.json())
        .then((res) => {
          const count = Array.isArray(res?.data) ? res.data.length : 0;
          setPageCache(cacheKey, count);
          setImageCounts((prev) => ({ ...prev, [id]: count }));
        })
        .catch(() => {});
    });
  }, [filteredVenues, visibleCount]);

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
                <span className="see-photos-btn">
                  <Image
                    src={galleryIcon}
                    alt="Gallery"
                    className="stat-icon"
                    width={14}
                    height={14}
                  />
                  {imageCounts[v._id] != null
                    ? `See Photos (${imageCounts[v._id]}+)`
                    : "See Photos"}
                </span>
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
                    ₹{v.startingPrice?.toLocaleString("en-IN") || "N/A"}
                    <span className="price-closer">/-</span>{" "}
                    <span className="price-divider">|</span>
                    <span className="price-starting-text">Starting Price</span>
                  </p>

                  <div className="venue-card-btn-ctn">
                    <div>
                      <span className="venue-menu-btn">
                        View Package <FaArrowRightLong className="menu-button-arrow" />
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
