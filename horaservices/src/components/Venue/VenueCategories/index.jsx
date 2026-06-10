import Image from "next/image";
import "./venuecategories.css";

import birthdayIcon from "@/assets/venuelanding/cake.png";
import babyshowerIcon from "@/assets/venuelanding/baby-shower.png";
import engagementIcon from "@/assets/venuelanding/wedding-ring.png";
import corporateIcon from "@/assets/venuelanding/happy.png";
import receptionIcon from "@/assets/venuelanding/hall.png";
import anniversaryIcon from "@/assets/venuelanding/glass.png";

const events = [
  { label: "Birthday", icon: birthdayIcon },
  { label: "Baby Shower", icon: babyshowerIcon },
  { label: "Engagement", icon: engagementIcon },
  { label: "Reception", icon: receptionIcon },
  { label: "Corporate", icon: corporateIcon },
  { label: "Anniversary", icon: anniversaryIcon },
];

const VenueCategories = ({ active, onSelect }) => {
  return (
    <div className="event-box">
      <h3>Choose Event Type</h3>

      <div className="event-scroll">
        {events.map(({ label, icon }) => (
          <div
            key={label}
            className={`event-chip ${active === label ? "active" : ""}`}
            onClick={() => onSelect(label)}
          >
            <Image
              src={icon}
              alt={label}
              className="chip-icon"
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueCategories;