import { useEffect, useRef, useState } from "react";
import "./venuesearchbar.css";

/* ---- Inline icons ---- */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.2" />
    <path d="M21 21l-4.3-4.3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const EventTypeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l1.6 4.9L18.5 8l-4.9 1.6L12 14.5l-1.6-4.9L5.5 8l4.9-1.1L12 2Z"
      fill="#97538C"
    />
    <path d="M19 14l.8 2.4L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.6L19 14Z" fill="#97538C" />
    <path d="M5 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" fill="#97538C" />
  </svg>
);

const GuestIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3.2" fill="#97538C" />
    <circle cx="17" cy="9" r="2.6" fill="#97538C" opacity="0.55" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#97538C" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 14.2c2.6.3 4.6 2.4 4.8 5" stroke="#97538C" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
  </svg>
);

const FilterIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="#97538C" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="6" r="2" fill="#fff" stroke="#97538C" strokeWidth="1.6" />
    <circle cx="16" cy="12" r="2" fill="#fff" stroke="#97538C" strokeWidth="1.6" />
    <circle cx="10" cy="18" r="2" fill="#fff" stroke="#97538C" strokeWidth="1.6" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    className={`vsb-chevron ${open ? "open" : ""}`}
    width="11"
    height="11"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2 4L6 8L10 4"
      stroke="#7C3FB1"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DEFAULT_EVENTS = [
  "Birthday",
  "Baby Shower",
  "Engagement",
  "Reception",
  "Corporate",
  "Anniversary",
];

const DEFAULT_CAPACITIES = [
  { value: "", label: "Any Guests" },
  { value: "20", label: "20 Guests" },
  { value: "30", label: "30 Guests" },
  { value: "40", label: "40 Guests" },
  { value: "50", label: "50 Guests" },
  { value: "60", label: "60 Guests" },
  { value: "70", label: "70 Guests" },
  { value: "100", label: "100 Guests" },
  { value: "120", label: "120 Guests" },
  { value: "200", label: "200 Guests" },
  { value: "300", label: "300 Guests" },
  { value: "500", label: "500 Guests" },
];


const VenueSearchBar = ({
  searchValue,
  onSearchChange,
  eventType,
  onEventTypeChange,
  guestCapacity,
  onGuestCapacityChange,
  onMoreFilterClick,
  events = DEFAULT_EVENTS,
  capacities = DEFAULT_CAPACITIES,
}) => {
  const [openMenu, setOpenMenu] = useState(null); // "event" | "guest" | null
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef(null);
  const eventBtnRef = useRef(null);
  const guestBtnRef = useRef(null);

  const selectedGuest =
    capacities.find((c) => c.value === guestCapacity) || capacities[0];

  const openDropdown = (key, btnRef) => {
    if (openMenu === key) {
      setOpenMenu(null);
      return;
    }
    const btnRect = btnRef.current.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    setDropdownPos({
      top: btnRect.bottom - wrapRect.top + 6,
      left: btnRect.left - wrapRect.left,
    });
    setOpenMenu(key);
  };

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="vsb-wrap" ref={wrapRef}>
      {/* ── Search input ── */}
      <div className="vsb-search-row">
        <span className="vsb-search-icon"><SearchIcon /></span>
        <input
          className="vsb-search-input"
          type="text"
          placeholder="Search Venus, areas"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* ── Filter pills ── */}
      <div className="vsb-filters-row">
        <div className="vsb-filter-item">
          <button
            type="button"
            ref={eventBtnRef}
            className="vsb-filter-btn"
            onClick={() => openDropdown("event", eventBtnRef)}
          >
            <EventTypeIcon />
            <span className="vsb-filter-label">{eventType || "Event Type"}</span>
            <ChevronIcon open={openMenu === "event"} />
          </button>
        </div>

        <div className="vsb-filter-item">
          <button
            type="button"
            ref={guestBtnRef}
            className="vsb-filter-btn"
            onClick={() => openDropdown("guest", guestBtnRef)}
          >
            <GuestIcon />
            <span className="vsb-filter-label">
              {selectedGuest.value ? selectedGuest.label : "Guest Count"}
            </span>
            <ChevronIcon open={openMenu === "guest"} />
          </button>
        </div>

        <button type="button" className="vsb-filter-btn vsb-more-btn" onClick={onMoreFilterClick}>
          <FilterIcon />
          <span className="vsb-filter-label">More Filter</span>
        </button>
      </div>

      {/* ── Dropdown now lives OUTSIDE the scrollable row ── */}
      {openMenu === "event" && (
        <div className="vsb-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
          {events.map((label) => (
            <div
              key={label}
              className={`vsb-option ${eventType === label ? "active" : ""}`}
              onClick={() => { onEventTypeChange?.(label); setOpenMenu(null); }}
            >
              {label}
            </div>
          ))}
        </div>
      )}

      {openMenu === "guest" && (
        <div className="vsb-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
          {capacities.filter((c) => c.value !== "").map((c) => (
            <div
              key={c.value}
              className={`vsb-option ${guestCapacity === c.value ? "active" : ""}`}
              onClick={() => { onGuestCapacityChange?.(c.value); setOpenMenu(null); }}
            >
              {c.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueSearchBar;
