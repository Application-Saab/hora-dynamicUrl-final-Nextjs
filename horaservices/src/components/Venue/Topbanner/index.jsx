import Image from "next/image";
import "./topbanner.css";

const TopBanner = ({ image, alt = "Banner" }) => {
  return (
 
  <div className="bannerWrapper">
      <Image
        src={image}
        alt="Banner"
        width={800}
        height={400}
        className="bannerImg"
        priority
      />
    </div>
  );
};

export default TopBanner;


   