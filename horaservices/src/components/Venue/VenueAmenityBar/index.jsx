import Image from "next/image";
import { getVenueAmenityChips } from "@/utils/venueAmenityChips";

const VenueAmenityBar = ({ venue }) => {
  const chips = getVenueAmenityChips(venue);

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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
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