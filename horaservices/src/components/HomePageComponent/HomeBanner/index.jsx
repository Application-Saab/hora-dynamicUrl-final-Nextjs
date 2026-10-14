import Image from "next/image";
import "./homebanner.css";
import topBanner from "@/assets/Homepageimages/top-banner.webp";

const DEFAULT_HEADING = "Book Party Decoration, Venues, Chefs & More";

export default function HomeBanner({ heading = DEFAULT_HEADING }) {
  return (
    <div className="banner">
      <div className="banner-hero">
        <h1>{heading}</h1>
        <p>Your Social Universe, Celebrating Every Moment Together</p>
      </div>

      <div className="banner-carousel">
        <Image src={topBanner} alt="Balloon decoration and party setup booked with HORA" className="banner-image" />
      </div>
    </div>
  );
}