import { useEffect, useState } from "react";
import "./venuelist.css";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";
import locationIcon from "@/assets/venuelanding/location.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { BASE_URL, VENUE_PUBLIC_LISTING } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

/* ---- Small inline icons (no separate asset files needed) ---- */
const TagIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="4" stroke="#97538C" strokeWidth="2" />
    <path d="M8 8h.01M8 12h8M8 16h5" stroke="#97538C" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3.2" fill="#7B4F9E" />
    <circle cx="17" cy="9" r="2.6" fill="#7B4F9E" opacity="0.6" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#7B4F9E" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 14.2c2.6.3 4.6 2.4 4.8 5" stroke="#7B4F9E" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const ParkingIcon = () => (
  <svg width="20" height="16" viewBox="0 0 24 18" fill="none">
    <path
      d="M3 14 5 5.5C5.3 4.4 6.2 4 7.3 4h9.4c1.1 0 2 .5 2.3 1.6L21 14"
      stroke="#16a34a"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M2.5 14h19v2.2c0 .7-.6 1.3-1.3 1.3H3.8c-.7 0-1.3-.6-1.3-1.3V14Z" stroke="#16a34a" strokeWidth="1.8" />
    <circle cx="6.5" cy="14" r="1.3" fill="#16a34a" />
    <circle cx="17.5" cy="14" r="1.3" fill="#16a34a" />
  </svg>
);

const HallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 21V6l8-3 8 3v15" stroke="#C0663A" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 21v-6h6v6" stroke="#C0663A" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 10h.01M12 10h.01M15 10h.01" stroke="#C0663A" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const RoomIcon = () => (
  <svg width="20" height="16" viewBox="0 0 24 18" fill="none">
    <path d="M2 16V4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2 12h20v4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M4 12V8.5C4 7.7 4.7 7 5.5 7h6c.8 0 1.5.7 1.5 1.5V12"
      stroke="#2563eb"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="9.3" r="0.9" fill="#2563eb" />
    <path d="M22 16v-2.5c0-.8-.7-1.5-1.5-1.5H13" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const GalleryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="15" rx="2.5" stroke="#fff" strokeWidth="2" />
    <circle cx="8.5" cy="9.5" r="1.7" fill="#fff" />
    <path d="M4 16.5 9 12l3.5 3.2L16 12l4.5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VenueList = ({ eventType, venueType, guestCapacity, city }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const router = useRouter();

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

  const displayedVenues = venues.slice(0, visibleCount);

  return (
    <>
      <div className="venue-list">
        {displayedVenues.map((v) => {
          // venueType comes back as an array e.g. ["Banquet hall", "Restaurant"]
          const tags = Array.isArray(v.venueType) ? v.venueType : v.venueType ? [v.venueType] : [];

          // hallType comes back as an array e.g. ["Indoor"] / ["Indoor","Outdoor"]
          const halls = Array.isArray(v.hallType) ? v.hallType : v.hallType ? [v.hallType] : [];
          const hallLabel = halls
            .map((h) => (h?.toLowerCase().startsWith("in") ? "Indor" : h?.toLowerCase().startsWith("out") ? "Outdor" : h))
            .join(" & ");

          // short location line, e.g. "Miyapur, Hyderabad"
          const shortLocation = [v.locality, v.city].filter(Boolean).join(", ") || v.city || "N/A";

          const photoCount = v.photos?.length || v.galleryCount || 0;

          return (
            <div className="venue-card" key={v._id}>
              {/* ── Image with See Photos overlay ── */}
              <div className="venue-card-img-wrap">
                <img
                  src={v.venueImageUrl || "/placeholder.jpg"}
                  alt={v.venueName}
                  className="venue-card-img"
                />
                {photoCount > 0 && (
                  <button
                    type="button"
                    className="see-photos-btn"
                    onClick={() => router.push(`/venue-list/venue?venueid=${v._id}#photos`)}
                  >
                    <GalleryIcon /> See Photos ({photoCount}+)
                  </button>
                )}
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
                        <TagIcon /> {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="venue-stats-row">
                  {v.guestCapacity ? (
                    <span className="stat-item">
                      <PeopleIcon />
                      {v.guestCapacity} Guests
                    </span>
                  ) : null}

                  {v.isParkingAvailable && (
                    <>
                      <span className="stat-divider" />
                      <span className="stat-item">
                        <ParkingIcon />
                        <span>
                          Parking
                          <br />
                          Available
                        </span>
                      </span>
                    </>
                  )}

                  {halls.length > 0 && (
                    <>
                      <span className="stat-divider" />
                      <span className="stat-item">
                        <HallIcon />
                        <span>
                          {halls.length} Hall{halls.length > 1 ? "s" : ""}
                          <br />
                          {hallLabel}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {v.totalRoomsAvailable > 0 && (
                  <div className="venue-stats-row">
                    <span className="stat-item">
                      <RoomIcon />
                      {v.totalRoomsAvailable} Room
                      <br />
                      Aviilable
                    </span>
                  </div>
                )}

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
                  onClick={() => router.push(`/venue-list/venue?venueid=${v._id}`)}
                >
                  View Full Package ➜
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < venues.length && (
        <div className="view-all-wrap">
          <button className="view-all-btn" onClick={() => setVisibleCount((prev) => prev + 5)}>
            View More
          </button>
        </div>
      )}
    </>
  );
};

export default VenueList;