import React from "react";
import Image from "next/image";

const ReviewButton = ({ icon, text, onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      <Image src={icon} alt={text} className="btnIcon" />
      {text}
    </button>
  );
};

export default ReviewButton;