import Image from "next/image";
import "./VenueFinder.css";
import { venueData } from "@/utils/venueCircleData"; // apna actual path daal dena
import arrowIcon from"@/assets/arrowicon.svg";
// "all" ko scroller me nahi dikhana, baaki sab venues dikhayenge
const venues = venueData.filter((v) => v.id !== "all");

export default function VenueFinder({ onViewAll, onSelectVenue }) {
  const handleViewAll = () => {
  window.location.href = "https://horaservices.com/venue-list";
};
  return (
    <div className="venue-finder">
      <div className="venue-hero">
        <h1>Find the Perfect Venue For Your Event</h1>
        <p>Book the Best Venues for your unforgettable events</p>
      </div>

      <div className="venue-scroll">
        {venues.map((v) => (
          <div
            className="venue-card"
            key={v.id}
            onClick={() => onSelectVenue && onSelectVenue(v.id)}
          >
            <Image className="venue-image" src={v.img} alt={v.label} />
            <div className="venue-label">
              <span>{v.label}</span>
              <button
  className="venue-arrow"
  aria-label={`Explore ${v.label}`}
>
  <Image
    src={arrowIcon}
    alt="Arrow"
    width={24}
    height={24}
    className="arrow-venue"
  />
</button>
            </div>
          </div>
        ))}
      </div>

      <button className="venue-cta" onClick={handleViewAll}>
        View All Venues
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}