import { useEffect, useState } from "react";
import "./venuelist.css";
import VenueAmenityBar from "../Venue/VenueAmenityBar";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";
import locationIcon from "@/assets/venuelanding/location.svg";
import Image from "next/image";
import { useRouter } from "next/router";

const VenueList = ({ eventType, venueType, guestCapacity }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // ← yahan rakho
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setShowAll(false); // ← filter change hone pe reset karo
    const params = new URLSearchParams();
    if (eventType) params.append("eventType", eventType);
    if (venueType && venueType !== "all") params.append("venueType", venueType);
    if (guestCapacity) params.append("guestCapacity", guestCapacity);

    fetch(`https://horaservices.com/api/party-venue/venues-public-list?${params}`)
      .then((r) => r.json())
      .then((res) => { setVenues(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [eventType, venueType, guestCapacity]);

  if (loading) return <p className="venue-status">Loading venues...</p>;
  if (!venues.length) return <p className="venue-status">No venues found</p>;

  const displayedVenues = showAll ? venues : venues.slice(0, 5); // ← yahan slice

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
                    {(v.location || v.city || "N/A").length > 20
                      ? `${(v.location || v.city || "N/A").slice(0, 20)}...`
                      : (v.location || v.city || "N/A")}
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
                View Menu ➜
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All — component ke andar hi */}
      {venues.length > 5 && !showAll && (
        <div className="view-all-wrap">
          <button className="view-all-btn" onClick={() => setShowAll(true)}>
            View All
          </button>
        </div>
      )}
    </>
  );
};

export default VenueList;