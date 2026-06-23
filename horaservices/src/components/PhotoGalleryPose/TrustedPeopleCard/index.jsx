import "./trustedpeoplecard.css";
import Image from "next/image";
import camera from "@/assets/poselink/camera.svg";
import star from "@/assets/poselink/star.svg";
import year from "@/assets/poselink/year.svg";
import expert from "@/assets/poselink/expert.svg";
const TrustedPeopleCard = ({
  title = "TRUSTED BY 10,000 PEOPLE",
  onClick,
  collageImage,
}) => {
const stats = [
  {
    icon: camera,
    value: "2500+",
    label: "Events Covered",
    className: "camera-bg",
  },
  {
    icon: star,
    value: "4.9/5",
    label: "(1500+ Reviews)",
    className: "star-bg",
  },
  {
    icon: year,
    value: "5+",
    label: "Years of Experience",
    className: "year-bg",
  },
  {
    icon: expert,
    value: "100+",
    label: "Expert Photographers",
    className: "expert-bg",
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
  <div className={`trusted-icon ${item.className}`}>
  <Image
    src={item.icon}
    alt={item.label}
    width={17}
    height={17}
    className="trusted-icon-img"
  />
</div>
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