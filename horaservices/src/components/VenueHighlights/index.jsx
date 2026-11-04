import React from "react";
import Image from "next/image";
import "./VenueHighlights.css";

import ParkingIcon from "../../assets/venue/highlights/car_parking_icon.svg";
import GuestIcon from "../../assets/venue/highlights/guest_icon.svg";
import HallsIcon from "../../assets/venue/highlights/halls_building.svg";
import RoomIcon from "../../assets/venue/highlights/room_bed_icon.svg";

const buildHighlights = (data = {}) => {
  const items = [];

  // 1. Max Guests
  if (data.guestCapacity !== undefined && data.guestCapacity !== null) {
    items.push({
      id: "max-guests",
      value: `${data.guestCapacity} Maximum Guest`,
      // label: "Maximum Guest",
      icon: GuestIcon,
      tint: "#F2EAFA",
    });
  }

  // 2. Parking
  items.push({
    id: "parking",
    value: `${data.isParkingAvailable && "Parking"} Area`,
    // label: "Area",
    icon: ParkingIcon,
    tint: "#FDF1F7",
  });

  // 3. Outdoor Halls
  items.push({
    id: "outdoor-halls",
    value: "2 Maximum Halls",
    // label: "Outdoor",
    icon: HallsIcon,
    tint: "#FDF1F7",
  });

  // 4. Indoor Halls
  items.push({
    id: "indoor-halls",
    value: "1 Maximum Hall",
    label: "Indoor",
    icon: HallsIcon,
    tint: "#FDF1F7",
  });

  // 5. Rooms
  items.push({
    id: "rooms",
    value: `${data.totalRoomsAvailable || "20"} Rooms`,
    // label: "Ac Room",
    icon: RoomIcon,
    tint: "#FDF1F7",
  });

  // 6. Min Guests / Additional repeat item for scroll demonstration
  if (data.minGuestCapacity !== undefined && data.minGuestCapacity !== null) {
    items.push({
      id: "min-guests",
      value: `${data.minGuestCapacity || "100"} Minimum Guest`,
      // label: "Minimum Guest",
      icon: GuestIcon,
      tint: "#F2EAFA",
    });
  }

  return items;
};

const VenueHighlights = ({ venueDetails }) => {
  const items = buildHighlights(venueDetails);

  if (!items.length) return null;

  return (
    <div className="vh-container">
      {/* Header */}
      <div className="vh-header">
        <h3 className="vh-title">Venue Highlights</h3>
        <p className="vh-subtitle">
          Everything you need to know about this venue
        </p>
      </div>

      {/* Grid container with horizontal scroll (2 rows) */}
      <div className="vh-grid-scroll">
        <div className="vh-grid">
          {items.map((item) => (
            <div key={item.id} className="vh-card">
              <div className={`vh-icon-box`} style={{ backgroundColor: `${item.tint}` }}>
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="vh-icon-img"
                />
              </div>
              <div className="vh-info">
                <span className="vh-val">{item.value}</span>
                {/* <span className="vh-lbl">{item.label}</span> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative slider pill indicator */}
      {items.length > 6 && (
        <div className="vh-indicator-track">
          <div className="vh-indicator-thumb" />
        </div>
      )}
    </div>
  );
};

export default VenueHighlights;
