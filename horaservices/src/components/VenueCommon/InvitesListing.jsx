import { useEffect, useState } from "react";
import "./venuelist.css";
import vegIcon from "@/assets/venuelanding/Veg.svg";
import nonVegIcon from "@/assets//venuelanding/Nonveg.svg";
import locationIcon from "@/assets/venuelanding/location.svg";
import tagIcon from "@/assets/venuelanding/Veg.svg";
import guestIcon from "@/assets/venuelanding/guest.svg";
import parkingIcon from "@/assets/venuelanding/parking.svg";
import hallIcon from "@/assets/venuelanding/halls.svg";
import roomIcon from "@/assets/venuelanding/rooms.svg";
import galleryIcon from "@/assets/venuelanding/Veg.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { BASE_URL, VENUE_PUBLIC_LISTING } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

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
                    <Image src={galleryIcon} alt="Gallery" className="stat-icon" width={14} height={14} />
                    See Photos ({photoCount}+)
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
                        <Image src={tagIcon} alt="Tag" className="stat-icon" width={12} height={12} />
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="venue-stats-row">
                  {v.guestCapacity ? (
                    <span className="stat-item">
                      <Image src={guestIcon} alt="Guests" className="stat-icon" width={18} height={18} />
                      {v.guestCapacity} Guests
                    </span>
                  ) : null}

                  {v.isParkingAvailable && (
                    <>
                      <span className="stat-divider" />
                      <span className="stat-item">
                        <Image src={parkingIcon} alt="Parking" className="stat-icon" width={20} height={16} />
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
                        <Image src={hallIcon} alt="Hall" className="stat-icon" width={18} height={18} />
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
                      <Image src={roomIcon} alt="Rooms" className="stat-icon" width={20} height={16} />
                      {v.totalRoomsAvailable} Room
                      <br />
                      Available
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