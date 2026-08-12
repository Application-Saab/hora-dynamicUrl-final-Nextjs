import "./capturemomentcard.css";

const CaptureMomentCard = ({
  title = "Let's Capture your special moment",
  subtitle = "Love These poses?",
  description = "Book With Hora and get a photography experience you'll always cherish.",
  price = "24,000",
  features = [
    "Professional photographers",
    "High Quality Edited Photos",
    "On-time Delivery",
  ],
  onBookNow,
}) => {
  return (
    <div className="capture-card">
      <div className="capture-left">
        <span className="capture-tag">{subtitle}</span>

        <h2 className="capture-title">{title}</h2>

        <p className="capture-desc">{description}</p>
      </div>

      <div className="capture-divider" />

      <div className="capture-right">
        <div className="capture-price-wrap">
          <span className="capture-starting">Starting from</span>

          <h3 className="capture-price">₹ {price}</h3>

          <div className="capture-features">
            {features.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>

        <button className="capture-btn" onClick={onBookNow}>
          Book Now ›
        </button>
      </div>
    </div>
  );
};

export default CaptureMomentCard;