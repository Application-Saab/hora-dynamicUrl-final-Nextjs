import Image from "next/image";
import "./Eventcapsulebannerimage.css";
import arrowImg from "@/assets/arrowicon.svg"
export default function EventCapsuleBannerImage({
  image,          // apni banner image yaha pass karo (static import ya URL string)
  ctaText = "Explore Event Capsule",
  onExploreClick,
}) {
  return (
    <div className="event-wrap" onClick={onExploreClick}>
      <Image
        src={image}
        alt="Event Capsule"
        fill
        sizes="(max-width: 768px) 100vw, 900px"
        className="event-img"
        priority
      />

     <button className="event-cta" onClick={onExploreClick}>
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