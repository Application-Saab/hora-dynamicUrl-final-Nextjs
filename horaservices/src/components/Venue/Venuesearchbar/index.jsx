import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./Venuesearchbar.css";

/* ---- Image icons (reused from VenueCategories + venue list icon set) ---- */
import searchIcon from "@/assets/searchbar.svg";
import guestIcon from "@/assets/venuelanding/guest.svg";
import filterIcon from "@/assets/venuelanding/Filter.svg";
import defaultEventIcon  from "@/assets/venuelanding/Eventtypeicon.svg"
import birthdayIcon from "@/assets/venuelanding/cake.png";
import babyshowerIcon from "@/assets/venuelanding/baby-shower.png";
import engagementIcon from "@/assets/venuelanding/wedding-ring.png";
import corporateIcon from "@/assets/venuelanding/happy.png";
import receptionIcon from "@/assets/venuelanding/hall.png";
import anniversaryIcon from "@/assets/venuelanding/glass.png";

/* ---- Chevron stays inline SVG (pure directional arrow, rotates via CSS) ---- */
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

// Same list + same icons as VenueCategories, so event type stays visually
// consistent everywhere on the venue landing page.
const DEFAULT_EVENTS = [
  { label: "Birthday", icon: birthdayIcon },
  { label: "Baby Shower", icon: babyshowerIcon },
  { label: "Engagement", icon: engagementIcon },
  { label: "Reception", icon: receptionIcon },
  { label: "Corporate", icon: corporateIcon },
  { label: "Anniversary", icon: anniversaryIcon },
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
const ClearIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="#97538C"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);


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

  // Look up the icon for whichever event is currently selected, so the
  // filter button itself shows that event's icon (not just a generic one).
  const selectedEvent = events.find((e) => e.label === eventType);

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
        <span className="vsb-search-icon">
          <Image src={searchIcon} alt="Search" width={18} height={18} />
        </span>
        <input
          className="vsb-search-input"
          type="text"
          placeholder="Search Venus, areas"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* ── Filter pills ── */}
      {/* <div className={`vsb-filters-row ${openMenu ? "menu-open" : ""}`}>
        <div className="vsb-filter-item">
          <button
            type="button"
            ref={eventBtnRef}
            className="vsb-filter-btn"
            onClick={() => openDropdown("event", eventBtnRef)}
          >
            <Image
              src={selectedEvent ? selectedEvent.icon : defaultEventIcon}
              alt={selectedEvent ? selectedEvent.label : "Event Type"}
              width={16}
              height={16}
              className="vsb-filter-icon"
            />
            <span className="vsb-filter-label">{eventType || "Event Type"}</span>
            {eventType ? (
              <span
                className="vsb-clear-btn"
                role="button"
                aria-label="Clear event type filter"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(null);
                  onEventTypeChange?.("");
                }}
              >
                <ClearIcon />
              </span>
            ) : (
              <ChevronIcon open={openMenu === "event"} />
            )}
          </button>
        </div>

        <div className="vsb-filter-item">
          <button
            type="button"
            ref={guestBtnRef}
            className="vsb-filter-btn"
            onClick={() => openDropdown("guest", guestBtnRef)}
          >
            <Image src={guestIcon} alt="Guests" width={17} height={17} className="vsb-filter-icon" />
            <span className="vsb-filter-label">
              {selectedGuest.value ? selectedGuest.label : "Guest Count"}
            </span>
            {selectedGuest.value ? (
              <span
                className="vsb-clear-btn"
                role="button"
                aria-label="Clear guest count filter"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(null);
                  onGuestCapacityChange?.("");
                }}
              >
                <ClearIcon />
              </span>
            ) : (
              <ChevronIcon open={openMenu === "guest"} />
            )}
          </button>
        </div>

        <button type="button" className="vsb-filter-btn vsb-more-btn" onClick={onMoreFilterClick}>
          <Image src={filterIcon} alt="Filter" width={17} height={17} className="vsb-filter-icon" />
          <span className="vsb-filter-label">More Filter</span>
        </button>
      </div> */}

      {/* ── Dropdown lives OUTSIDE the scrollable row ── */}
      {openMenu === "event" && (
        <div className="vsb-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
          {events.map(({ label, icon }) => (
            <div
              key={label}
              className={`vsb-option ${eventType === label ? "active" : ""}`}
              onClick={() => {
                onEventTypeChange?.(label);
                setOpenMenu(null);
              }}
            >
              <Image src={icon} alt={label} width={16} height={16} className="vsb-option-icon" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}

      {openMenu === "guest" && (
        <div className="vsb-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
          {capacities
            .filter((c) => c.value !== "")
            .map((c) => (
              <div
                key={c.value}
                className={`vsb-option ${guestCapacity === c.value ? "active" : ""}`}
                onClick={() => {
                  onGuestCapacityChange?.(c.value);
                  setOpenMenu(null);
                }}
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
