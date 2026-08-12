import React from "react";
import Image from "next/image";
const CateringBanner = ({ image }) => {
  return (
    <div className="catering-banner">
      <Image src={image} alt="Live Catering Banner" />
    </div>
  );
};

export default CateringBanner;