import "./planningard.css";
import Image from "next/image";

const PlanningCard = ({
  title,
  description,
  buttonText,
  image,
  icon,
  onClick,
}) => {
  return (
    <div className="planning-card">
      <div className="planning-content">
        <div className="planning-icon">
          <Image
            src={icon}
            alt={title}
            fill
            style={{ objectFit: "contain", padding: "10px" }}
          />
        </div>

        <div className="planning-text">
          <h3>{title}</h3>

          <p>{description}</p>

          <button className="planning-btn" onClick={onClick}>
            {buttonText} <span>›</span>
          </button>
        </div>
      </div>

      <div className="planning-image">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default PlanningCard;