import "./trustedpeoplecard.css";
import Image from "next/image";

const TrustedPeopleCard = ({
  title = "TRUSTED BY 10,000 PEOPLE",
  onClick,
  collageImage,
}) => {
  const stats = [
    {
      icon: "📷",
      value: "2500+",
      label: "Whatsapp Downloads",
    },
    {
      icon: "⭐",
      value: "4.9/5",
      label: "(1500+ Reviews)",
    },
    {
      icon: "🛡️",
      value: "5+",
      label: "Years of Experience",
    },
    {
      icon: "👩‍💼",
      value: "100+",
      label: "Expert Photographers",
    },
  ];

  return (
    <div className="trusted-card">
      <h3 className="trusted-heading">{title}</h3>

      <div className="trusted-content">
        <div className="trusted-left">
          <div className="trusted-stats">
            {stats.map((item, i) => (
              <div key={i} className="trusted-stat">
                <div className="trusted-icon">{item.icon}</div>

                <div className="trusted-value">{item.value}</div>

                <div className="trusted-label">{item.label}</div>
              </div>
            ))}
          </div>

          <button className="trusted-btn" onClick={onClick}>
            View Packages &gt;
          </button>
        </div>

        <div className="trusted-right">
          <Image
            src={collageImage}
            alt="Photography"
            fill
            className="trusted-collage"
          />
        </div>
      </div>
    </div>
  );
};

export default TrustedPeopleCard;