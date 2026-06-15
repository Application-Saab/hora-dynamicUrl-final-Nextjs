import "./venueamenitybar.css";
import Image from "next/image";

import guestIcon   from "@/assets/venuelanding/users.svg";
import parkingIcon from "@/assets/venuelanding/parking.svg";
import hallIcon    from "@/assets/venuelanding/halls.svg";
import bedIcon     from "@/assets/venuelanding/rooms.svg";

const VenueAmenityBar = ({ venue }) => {
  const chips = [
    venue.guestCapacity && {
      icon: guestIcon,
      colorClass: "purple",
      label: `${venue.guestCapacity}`,
      sub: "Guests",
    },
    venue.isParkingAvailable && {
      icon: parkingIcon,
      colorClass: "green",
      label: "Parking",
      sub: "Available",
    },
    venue.hallType?.length > 0 && {
      icon: hallIcon,
      colorClass: "amber",
      label: `${venue.hallType.length} Hall${venue.hallType.length !== 1 ? "s" : ""}`,
      sub: venue.hallType.join(" & "),
    },
    venue.totalRoomsAvailable > 0 && {
      icon: bedIcon,
      colorClass: "blue",
      label: `${venue.totalRoomsAvailable} Rooms`,
      sub: "Available",
    },
  ].filter(Boolean);

  if (!chips.length) return null;

  return (
    <div className="amenity-scroll-wrap">
      <div className="amenity-bar">
        {chips.map((c, i) => (
          <div className="amenity-chip" key={i}>
            <div className={`amenity-icon ${c.colorClass}`}>
              <Image
                src={c.icon}
                alt={c.sub}
                width={22}
                height={22}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div className="amenity-label">{c.label}</div>
              <div className="amenity-sub">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueAmenityBar;