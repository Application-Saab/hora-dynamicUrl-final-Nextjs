import Image from "next/image";
import "./homebanner.css";
import topBanner from "@/assets/Homepageimages/top-banner.webp";

export default function HomeBanner() {
  return (
    <div className="banner">
      <div className="banner-hero">
        <h1>Your Social Universe</h1>
        <p>Celebrating Every Moment, Together</p>
      </div>

      <div className="banner-carousel">
        {/* First thing customers see: load it eagerly at the size actually shown. */}
        <Image
          src={topBanner}
          alt="Celebration moments"
          className="banner-image"
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
        />

      </div>
    </div>
  );
}