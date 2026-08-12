import Image from "next/image";
import "./loveposesbanner.css";
import heart from "@/assets/poselink/heart.svg";
const LovePosesBanner = ({
  title = "Love these poses?",
  description = "Our photographers will recreate these magical moment for your Event.",
  buttonText = "View Packages",
  onClick,
}) => {
  return (
    <div className="love-poses-banner">
      <div className="love-poses-left">
        <div className="love-icon">
          <Image src={heart} />
        </div>

        <div className="love-content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <button className="love-btn" onClick={onClick}>
        {buttonText} &gt;
      </button>
    </div>
  );
};

export default LovePosesBanner;