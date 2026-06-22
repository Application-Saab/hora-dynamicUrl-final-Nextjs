import { useEffect, useState } from "react";
import "./venuelist.css";
import VenueAmenityBar from "../Venue/VenueAmenityBar";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";
import locationIcon from "@/assets/venuelanding/location.svg";
import Image from "next/image";
import { useRouter } from "next/router";

const VenueList = ({ eventType, venueType, guestCapacity,city }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // ← yahan rakho
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(5);

useEffect(() => {
  setLoading(true);
  setVisibleCount(5);

  const params = new URLSearchParams();

  if (eventType) params.append("eventType", eventType);
  if (venueType && venueType !== "all") params.append("venueType", venueType);
  if (guestCapacity) params.append("guestCapacity", guestCapacity);
  if (city) params.append("city", city);

  fetch(`https://horaservices.com/api/party-venue/venues-public-list?${params}`)
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

  const displayedVenues = venues.slice(0, visibleCount);
  return (
    <>
      <div className="venue-list">
        {displayedVenues.map((v) => (
          <div className="venue-card" key={v._id}>
            <div className="venue-card-img-wrap">
              <img
                src={v.venueImageUrl || "/placeholder.jpg"}
                alt={v.venueName}
                className="venue-card-img"
              />
            </div>
            <div className="venue-card-body">
              <div className="venue-card-header">
                <span className="venue-name">{v.venueName}</span>
              </div>
              <p className="venue-location">
                <span style={{ display: "flex", gap: "4px" }}>
                  <Image src={locationIcon} alt="Location" className="location-icon" />
                 <span className="location-text">
                   {v.city || "N/A"}
                 </span>
                </span>
                <span className="venue-tag">🏨 {v.venueType || "Venue"}</span>
              </p>
              <div style={{ borderBottom: "0.29px solid #ECE7EF" }} />
              <p className="venue-price">
                ₹{v.startingPrice?.toLocaleString("en-IN") || "N/A"}/- <span>Starting Price</span>
              </p>
              <VenueAmenityBar venue={v} />
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
              <button
                className="venue-menu-btn"
                onClick={() => router.push(`/venue-list/venue?venueid=${v._id}`)}
              >
                View Package ➜
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All — component ke andar hi */}
      {visibleCount < venues.length && (
  <div className="view-all-wrap">
    <button
      className="view-all-btn"
      onClick={() => setVisibleCount((prev) => prev + 5)}
    >
      View More
    </button>
  </div>
)}
    </>
  );
};

export default VenueList;