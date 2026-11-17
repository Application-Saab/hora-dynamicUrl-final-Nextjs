import Image from "next/image";
import "./topbanner.css";

const TopBanner = ({ image, alt = "Banner", fromVenue = false }) => {
  return (

  <div className="bannerWrapper">
      <Image
        src={image}
        alt={alt}
        width={800}
        height={400}
        className="bannerImg"
        priority
        style={{borderRadius: fromVenue ? "8px" : "0px"}}
      />
    </div>
  );
};

export default TopBanner;


   