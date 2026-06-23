import { useEffect, useRef, useState } from "react";
import "./venuelistheader.css";
import guestIcon from "@/assets/venuelanding/users.svg";
import Image from "next/image";
const CAPACITIES = [
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

const VenueListHeader = ({ eventType ,value, onChange }) => {
  const displayEvent = eventType || "Birthday";
const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = CAPACITIES.find((c) => c.value === value) || CAPACITIES[0];

  // Outside click se close karo
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="venue-list-header">
      <h2 className="vlh-title">Top Venues For {displayEvent}</h2>

      <div className="gd-wrap" ref={ref}>
      {/* Trigger button */}
      <button className="gd-trigger" onClick={() => setOpen((p) => !p)}>
        <Image src={guestIcon} alt="guests" width={16} height={16} />
        <span className="gd-label">{selected.label}</span>
        <svg
          className={`gd-chevron ${open ? "open" : ""}`}
          width="12" height="12"
          viewBox="0 0 12 12" fill="none"
        >
          <path d="M2 4L6 8L10 4" stroke="#7C3FB1" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="gd-dropdown">
          {CAPACITIES.filter((c) => c.value !== "").map((c) => (
            <div
              key={c.value}
              className={`gd-option ${value === c.value ? "active" : ""}`}
              onClick={() => { onChange(c.value); setOpen(false); }}
            >
              {c.label}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default VenueListHeader;