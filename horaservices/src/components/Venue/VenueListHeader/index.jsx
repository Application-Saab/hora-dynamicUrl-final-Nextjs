import "./venuelistheader.css";

const CAPACITIES = [
  { label: "Any Guests", value: "" },
  { label: "50 Guests",  value: "50" },
  { label: "100 Guests", value: "100" },
  { label: "120 Guests", value: "120" },
  { label: "200 Guests", value: "200" },
  { label: "500 Guests", value: "500" },
  { label: "1000 Guests",value: "1000" },
];

const VenueListHeader = ({ eventType, guestCapacity, onCapacityChange }) => {
  const displayEvent = eventType || "Birthday";

  return (
    <div className="venue-list-header">
      <h2 className="vlh-title">Top Venues For {displayEvent}</h2>

      <div className="vlh-filter">
        <span className="vlh-icon">👥</span>
        <select
          value={guestCapacity}
          onChange={(e) => onCapacityChange(e.target.value)}
          className="vlh-select"
        >
          {CAPACITIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <span className="vlh-chevron">∨</span>
      </div>
    </div>
  );
};

export default VenueListHeader;