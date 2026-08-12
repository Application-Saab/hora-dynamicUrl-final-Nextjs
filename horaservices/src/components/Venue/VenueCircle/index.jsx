import Image from "next/image";
import { venueData } from "@/utils/venueCircleData.js";

const VenueCircle = ({ active, onSelect }) => {
  return (
    <div className="venue-box">
      <div className="venue-scroll">
        {venueData.map((v) => (
          <div
            key={v.id}
            className={`venue-item ${active === v.id ? "active" : ""}`}
            onClick={() => onSelect(v.id)}
          >
            <div className={`venue-img ${active === v.id ? "active" : ""}`}>
              <Image
                src={v.img}
                alt={v.label}
                width={88}
                height={88}
              />
            </div>

            <p>{v.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueCircle;