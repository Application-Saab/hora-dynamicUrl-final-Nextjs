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

const VenueList = ({ eventType, venueType, guestCapacity, city, search }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();
  const sentinelRef = useRef(null);
  const loadTimerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(5);

    const params = new URLSearchParams();

    if (eventType) params.append("eventType", eventType);
    if (venueType && venueType !== "all") params.append("venueType", venueType);
    if (guestCapacity) params.append("guestCapacity", guestCapacity);
    if (city) params.append("city", city);

    fetchWithError(`${BASE_URL}${VENUE_PUBLIC_LISTING}?${params}`)
      .then((r) => r.json())
      .then((res) => {
        setVenues(res.data || []);
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

  // Reset how many cards are visible whenever the filtered result set changes
  useEffect(() => {
    setVisibleCount(5);
  }, [search]);

  // Infinite scroll: when the sentinel (end of list) comes into view,
  // load the next 5 venues after a 1 second delay.
  useEffect(() => {
    if (loading) return;
    if (visibleCount >= filteredVenues.length) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        if (!isVisible) return;

        // Avoid stacking multiple timers if it stays in view
        if (loadTimerRef.current) return;

        setLoadingMore(true);
        loadTimerRef.current = setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 5, filteredVenues.length));
          setLoadingMore(false);
          loadTimerRef.current = null;
        }, 1000);
      },
      { rootMargin: "150px" } // start loading a bit before it's fully in view
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    };
  }, [loading, visibleCount, filteredVenues.length]);

  if (loading) return <p className="venue-status">Loading venues...</p>;

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
          // venueType comes back as an array e.g. ["Restaurant"]
          const tags = Array.isArray(v.venueType) ? v.venueType : v.venueType ? [v.venueType] : [];

          // hallType comes back as an array e.g. ["Indoor"] / ["Indoor","Outdoor"]
          const halls = Array.isArray(v.hallType) ? v.hallType : v.hallType ? [v.hallType] : [];
          const hallLabel = halls
            .map((h) =>
              h?.toLowerCase().startsWith("in") ? "Indoor" : h?.toLowerCase().startsWith("out") ? "Outdoor" : h
            )
            .join(" & ");

          // short location line, e.g. "Madiwala New Extension, Bangalore"
          const shortLocation = [v.locality, v.city].filter(Boolean).join(", ") || v.city || "N/A";

          return (
            <div className="venue-card" key={v._id}>
              {/* ── Image with See Photos overlay (static, always shown) ── */}
              <div className="venue-card-img-wrap">
                <img
                  src={v.venueImageUrl || "/placeholder.jpg"}
                  alt={v.venueName}
                  className="venue-card-img"
                />
                <button
                  type="button"
                  className="see-photos-btn"
                  onClick={() => router.push(`/venue-list/venue?venueid=${v._id}`)}
                >
                  <Image src={galleryIcon} alt="Gallery" className="stat-icon" width={14} height={14} />
                  See Photos (20+)
                </button>
              </div>

              {/* ── Details ── */}
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
                        <Image src={tagIcon} alt="Tag" className="
                        " width={12} height={12} />
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
                      <br/>
                          {hallLabel}
                        </span>
                      </span>
                    );
                  }

                  if (v.totalRoomsAvailable > 0) {
                    statCells.push(
                      <span className="stat-item" key="rooms">
                        <Image src={roomIcon} alt="Rooms" className="stat-icon" width={20} height={16} />
                        {v.totalRoomsAvailable} Room
                    
                        Available
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
        halls: JSON.stringify(halls), // halls array already destructured upar
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

      {/* Sentinel: when this scrolls into view, next batch loads after 1s */}
      {visibleCount < filteredVenues.length && (
        <div ref={sentinelRef} className="venue-load-more-sentinel">
          {loadingMore && <p className="venue-status">Loading more venues...</p>}
        </div>
      )}
    </>
  );
};

export default VenueList;