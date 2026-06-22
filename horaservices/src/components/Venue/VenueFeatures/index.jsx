import Image from "next/image";
import verifiedIcon from "@/assets/venuelanding/verified.svg";
import supportIcon from "@/assets/venuelanding/support.svg";
import priceIcon from "@/assets/venuelanding/price.svg";
import bookingIcon from "@/assets/venuelanding/booking.svg";
import "./venuefeatures.css";

const features = [
  {
    icon: verifiedIcon,
    title: "Verified Venues",
    desc: "Personally verified venues you can trust",
  },
  {
    icon: supportIcon,
    title: "24/7 Expert Support",
    desc: "Assistance whenever you need it",
  },
  {
    icon: priceIcon,
    title: "Best Price Guarantee",
    desc: "Get the most competitive venue prices",
  },
  {
    icon: bookingIcon,
    title: "Easy Booking Process",
    desc: "Simple, fast and hassle-free booking",
  },
];

const VenueFeatures = () => {
  return (
    <div className="venue-features">
      {features.map((f, i) => (
        <div className="venue-feature-item" key={i}>
          <div className="feature-icon-wrap">
            <Image src={f.icon} alt={f.title} width={10} height={10} />
          </div>
          <p className="feature-title">{f.title}</p>
          <p className="feature-desc">{f.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default VenueFeatures;