import Image from "next/image";
import guestIcon from "@/assets/venuelanding/guest.svg";
import parkingIcon from "@/assets/venuelanding/parking.svg";
import roomIcon from "@/assets/venuelanding/rooms.svg";
import hallIcon from "@/assets/venuelanding/halls.svg";
import enquiryBg from "@/assets/venuelanding/enquiry-bg.webp";
import enquiryIcon from "@/assets/venuelanding/enquiryIcon.png"
import "./VenueHighlights.css"
import arrowImage from "@/assets/venuelanding/venuearrow.svg"
// Backend field naming abhi consistent nahi hai (listing API vs details API
// alag keys bhej sakte hain) — isliye har field ke multiple possible names try karte hain.
const pick = (obj, keys) => {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== "") return obj[k];
  }
  return undefined;
};

const VenueHighlights = ({ venue, onEnquire }) => {
  if (!venue) return null;

  const guestCapacity = pick(venue, ["guestCapacity", "maxGuestCapacity", "capacity"]);
  const isParkingAvailable = pick(venue, ["isParkingAvailable", "parkingAvailable", "parking"]);
  const totalRoomsAvailable = pick(venue, ["totalRoomsAvailable", "roomsAvailable", "totalRooms"]);
  const rawHalls = pick(venue, ["hallType", "halls", "hallTypes"]);

  const halls = Array.isArray(rawHalls) ? rawHalls : rawHalls ? [rawHalls] : [];
  const hallLabel = halls
    .map((h) =>
      h?.toLowerCase?.().startsWith("in") ? "Indoor" : h?.toLowerCase?.().startsWith("out") ? "Outdoor" : h
    )
    .join(" & ");

  const hasStats = !!guestCapacity || !!isParkingAvailable || totalRoomsAvailable > 0 || halls.length > 0;

  return (
    <div className="venue-highlights-row">
      {/* ── Left: Stats card (sirf tab dikhega jab data ho) ── */}
     {hasStats && (
  <div className="venue-highlights-stats">
    <div className="vh-stats-grid">
      {guestCapacity && (
        <span className="vh-stat-item">
          <Image src={guestIcon} alt="Guests" width={24} height={24} />
          <span>{guestCapacity}&nbsp;- Guest</span>
        </span>
      )}

      {isParkingAvailable && (
        <span className="vh-stat-item">
          <Image src={parkingIcon} alt="Parking" width={26} height={20} />
          <span>Parking Available</span>
        </span>
      )}

      {halls.length > 0 && (
        <span className="vh-stat-item">
          <Image src={hallIcon} alt="Halls" width={22} height={22} />
          <span>{halls.length} Hall{halls.length > 1 ? "s" : ""} {hallLabel}</span>
        </span>
      )}

      {totalRoomsAvailable > 0 && (
        <span className="vh-stat-item">
          <Image src={roomIcon} alt="Rooms" width={24} height={20} />
          <span>{totalRoomsAvailable} Room Available</span>
        </span>
      )}
    </div>
  </div>
)}

      {/* ── Right: Enquiry banner (hamesha dikhega) ── */}
      <div className={`venue-highlights-enquiry ${!hasStats ? "full-width" : ""}`}>
        <div className="enquiry-banner">
          {/* Background image (blob gradient) */}
          <Image
            src={enquiryBg}
            alt=""
            fill
            className="enquiry-banner-bg"
            sizes="(max-width: 768px) 100vw, 400px"
          />

         <div className="enquiry-banner-icon">
            <Image
              src={enquiryIcon}
              alt="Have a question"
              width={44}
              height={44}
            />
          </div>

          <div className="enquiry-banner-body">
            <h3 className="enquiry-banner-title">
              Have a special <br/> <span>request ?</span>
            </h3>
            <p className="enquiry-banner-sub">
              Our team is here to help you plan the perfect event.
            </p>
            <button className="enquiry-banner-btn" onClick={onEnquire}>
              Enquire Now   <Image className="arrowICON"
                           src={arrowImage}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueHighlights;