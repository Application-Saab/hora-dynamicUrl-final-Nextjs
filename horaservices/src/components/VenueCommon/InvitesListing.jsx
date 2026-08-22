import { useEffect, useMemo, useRef, useState } from "react";
import "./venuelist.css";
import vegIcon from "@/assets/venuelanding/Veg.svg";
import nonVegIcon from "@/assets/venuelanding/Nonveg.svg";
import locationIcon from "@/assets/venuelanding/location.svg";
import tagIcon from "@/assets/venuelanding/tagIcon.svg";
import guestIcon from "@/assets/venuelanding/guest.svg";
import parkingIcon from "@/assets/venuelanding/parking.svg";
import hallIcon from "@/assets/venuelanding/halls.svg";
import roomIcon from "@/assets/venuelanding/rooms.svg";
import galleryIcon from "@/assets/venuelanding/galleryicon.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { BASE_URL, VENUE_PUBLIC_LISTING } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";
import { getPageCache, setPageCache } from "@/utils/scrollDataCache";

const BATCH_SIZE = 10;

const getCacheKey = (eventType, venueType, guestCapacity, city) =>
  `venue-list-${JSON.stringify({ eventType, venueType, guestCapacity, city })}`;

const VenueList = ({ eventType, venueType, guestCapacity, city, search }) => {
  const cacheKey = getCacheKey(eventType, venueType, guestCapacity, city);
  const cached = getPageCache(cacheKey);

  const [venues, setVenues] = useState(cached?.data || []);
  const [loading, setLoading] = useState(!cached);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();
  const loadTimerRef = useRef(null);

  useEffect(() => {
    const key = getCacheKey(eventType, venueType, guestCapacity, city);
    const existing = getPageCache(key);

    if (existing) {
      setVenues(existing.data);
      setLoading(false);
      setVisibleCount(BATCH_SIZE);
      if (!existing.isStale) return; // fresh hai, refetch skip
      // stale hai to neeche background me chupke se refetch ho jayega
    } else {
      setLoading(true);
      setVisibleCount(BATCH_SIZE);
    }

    const params = new URLSearchParams();

    if (eventType) params.append("eventType", eventType);
    if (venueType && venueType !== "all") params.append("venueType", venueType);
    if (guestCapacity) params.append("guestCapacity", guestCapacity);
    if (city) params.append("city", city);

    fetchWithError(`${BASE_URL}${VENUE_PUBLIC_LISTING}?${params}`)
      .then((r) => r.json())
      .then((res) => {
        const dataList = res.data || [];
        setPageCache(key, dataList);
        setVenues(dataList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventType, venueType, guestCapacity, city]);

  // Client-side search filter — matches venue name, locality, city, or
  // venue type against whatever the user has typed in the search box.
  const filteredVenues = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return venues;

    return venues.filter((v) => {
      const nameMatch = v.venueName?.toLowerCase().includes(q);
      const localityMatch = v.locality?.toLowerCase().includes(q);
      const cityMatch = v.city?.toLowerCase().includes(q);
      const typeArr = Array.isArray(v.venueType) ? v.venueType : v.venueType ? [v.venueType] : [];
      const typeMatch = typeArr.some((t) => t?.toLowerCase().includes(q));

      return nameMatch || localityMatch || cityMatch || typeMatch;
    });
  }, [venues, search]);

  // Reset how many cards are visible whenever the search term changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [search]);

  // Auto-load: every 1 second, load the next batch automatically —
  // no scroll/sentinel needed.
  useEffect(() => {
    if (loading) return;
    if (visibleCount >= filteredVenues.length) return;

    setLoadingMore(true);
    loadTimerRef.current = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredVenues.length));
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

  if (loading) return null;

  if (!venues.length) {
    return (
      <div className="venue-status coming-soon-box">
        <h3>{city ? `${city} venues are coming soon! 🎉` : "Venues are coming soon! 🎉"}</h3>
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
          We couldn't find any venues matching "{search}". Try a different search term.
        </p>
      </div>
    );
  }

  const displayedVenues = filteredVenues.slice(0, visibleCount);

  return (
    <>
      <div className="venue-list">
        {displayedVenues.map((v) => {
          const tags = Array.isArray(v.venueType) ? v.venueType : v.venueType ? [v.venueType] : [];
          const halls = Array.isArray(v.hallType) ? v.hallType : v.hallType ? [v.hallType] : [];
          const hallLabel = halls
            .map((h) =>
              h?.toLowerCase().startsWith("in") ? "Indoor" : h?.toLowerCase().startsWith("out") ? "Outdoor" : h
            )
            .join(" & ");

          const shortLocation = [v.locality, v.city].filter(Boolean).join(", ") || v.city || "N/A";

          return (
            <div className="venue-card" key={v._id}>
              <div className="venue-card-img-wrap">
                <img
                  src={v.venueImageUrl || "/placeholder.jpg"}
                  alt={v.venueName}
                  className="venue-card-img"
                />
                <button
                  type="button"
                  className="see-photos-btn"
                  onClick={() =>
                    router.push({
                      pathname: "/venue-list/venue",
                      query: {
                        venueid: v._id,
                        guests: v.guestCapacity || "",
                        parking: v.isParkingAvailable ? "1" : "",
                        rooms: v.totalRoomsAvailable || "",
                        halls: JSON.stringify(halls),
                      },
                    })
                  }
                >
                  <Image src={galleryIcon} alt="Gallery" className="stat-icon" width={14} height={14} />
                  See Photos (20+)
                </button>
              </div>

              <div className="venue-card-body">
                <h3 className="venue-name">{v.venueName}</h3>

                <p className="venue-location">
                  <Image src={locationIcon} alt="Location" className="location-icon" />
                  <span className="location-text">{shortLocation}</span>
                </p>

                {tags.length > 0 && (
                  <div className="venue-tags-row">
                    {tags.map((t, i) => (
                      <span className="venue-tag-pill" key={i}>
                        <Image src={tagIcon} alt="Tag" className="" width={12} height={12} />
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {(() => {
                  const statCells = [];

                  if (v.guestCapacity) {
                    statCells.push(
                      <span className="stat-item" key="guests">
                        <Image src={guestIcon} alt="Guests" className="stat-icon" width={18} height={18} />
                        {v.guestCapacity} - Guests
                      </span>
                    );
                  }

                  if (v.isParkingAvailable) {
                    statCells.push(
                      <span className="stat-item" key="parking">
                        <Image src={parkingIcon} alt="Parking" className="stat-icon" width={20} height={16} />
                        <span>
                          Parking
                          Available
                        </span>
                      </span>
                    );
                  }

                  if (halls.length > 0) {
                    statCells.push(
                      <span className="stat-item" key="halls">
                        <Image src={hallIcon} alt="Hall" className="stat-icon" width={18} height={18} />
                        <span>
                          {halls.length} Hall{halls.length > 1 ? "s" : ""}
                          <br />
                          {hallLabel}
                        </span>
                      </span>
                    );
                  }

                  if (v.totalRoomsAvailable > 0) {
                    statCells.push(
                      <span className="stat-item" key="rooms">
                        <Image src={roomIcon} alt="Rooms" className="stat-icon" width={20} height={16} />
                        {v.totalRoomsAvailable} Room Available
                      </span>
                    );
                  }

                  if (statCells.length === 0) return null;

                  return <div className="venue-stats-grid">{statCells}</div>;
                })()}

                <div className="venue-food">
                  {v.foodTypes?.includes("veg") && (
                    <span className="veg">
                      <Image src={vegIcon} alt="Veg" className="food-icon" />
                      Veg Available
                    </span>
                  )}
                  {v.foodTypes?.includes("non-veg") && (
                    <span className="nonveg">
                      <Image src={nonVegIcon} alt="Non Veg" className="food-icon" />
                      Non-Veg Available
                    </span>
                  )}
                </div>

                <p className="venue-price">
                  ₹{v.startingPrice?.toLocaleString("en-IN") || "N/A"}/-{" "}
                  <span>Starting Price</span>
                </p>

                <button
                  className="venue-menu-btn"
                  onClick={() =>
                    router.push({
                      pathname: "/venue-list/venue",
                      query: {
                        venueid: v._id,
                        guests: v.guestCapacity || "",
                        parking: v.isParkingAvailable ? "1" : "",
                        rooms: v.totalRoomsAvailable || "",
                        halls: JSON.stringify(halls),
                      },
                    })
                  }
                >
                  View Full Package ➜
                </button>
              </div>
            </div>
          );
        })}
      </div>
.
    </>
  );
};

export default VenueList;