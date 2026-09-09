import Image from "next/image";
import { useRouter } from "next/router";
import "./venuecircle.css";
import { venueData } from "@/utils/venueCircleData.js";

const VenueCircle = ({ active, onSelect, citySlug }) => {
  const router = useRouter();

  const handleClick = (v) => {
    onSelect(v.id); // local state bhi update rakho (agar kahin aur use ho raha ho)

    const cityPart = citySlug || "venue-list"; // fallback agar city na ho
    const path =
      v.id === "all"
        ? `/${cityPart}/venue-list`
        : `/${cityPart}/venue-list/${v.slug}`;

    router.push(path);
  };

  return (
    <div className="venue-box">
      <div className="venue-scroll">
        {venueData.map((v) => (
          <div
            key={v.id}
            className={`venue-item ${active === v.id ? "active" : ""}`}
            onClick={() => handleClick(v)}
          >
            <div className={`venue-img ${active === v.id ? "active" : ""}`}>
              <Image src={v.img} alt={v.label} width={88} height={88} />
            </div>
            <p>{v.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueCircle;