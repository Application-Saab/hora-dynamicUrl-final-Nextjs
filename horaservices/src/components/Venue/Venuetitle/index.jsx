import { eventBanners } from "@/utils/venueheadingbanner";
import "./venuetitle.css";
import Image from "next/image";

const VenueBannertitle = ({ eventType = "birthday" }) => {
  // ✅ lowercase + spaces remove — "Baby Shower" → "babyshower"
  const normalizedKey = eventType.toLowerCase().replace(/\s+/g, "");
  const config = eventBanners[normalizedKey] || eventBanners.birthday;

  return (
    <div className="event-banner">
      <Image className="event-icon" src={config.icon} alt={config.title} width={40} height={40} />
      <div className="event-text">
        <p className="event-title">{config.title}</p>
        <p className="event-subtitle">{config.subtitle}</p>
      </div>
    </div>
  );
};

export default VenueBannertitle;