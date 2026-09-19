import Image from "next/image";
import "./Eventcapsulebannerimage.css";
import arrowImg from "@/assets/arrowicon.svg";

export default function EventCapsuleBannerImage({
  image,         
  ctaText = "Explore Event Capsule",
  onExploreClick,
  openInNewTab = true, 
}) {
  const handleClick = (e) => {
    e.stopPropagation(); 
    if (onExploreClick) onExploreClick();
  };

  return (
    <div className="event-wrap" onClick={handleClick}>
      <Image
        src={image}
        alt="Event Capsule"
        fill
        sizes="(max-width: 768px) 100vw, 900px"
        className="event-img"
        priority
      />

      <button className="event-cta" onClick={handleClick} type="button">
        {ctaText}
        <Image
          src={arrowImg}
          alt=""
          aria-hidden="true"
          className="event-cta-arrow"
        />
      </button>
    </div>
  );
}