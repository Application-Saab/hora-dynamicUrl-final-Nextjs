import React from "react";
import "./foodCard.css"; 
import Image from "next/image";

const FoodCard = ({ item, onClick }) => {
  const handleClick = (link) => {
    const eventName = item.title.replace(/\s+/g, "") + "Click";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      itemTitle: item.title,
      itemLink: item.link,
    });

    onClick(item.title,link);
  };

  return (
    <>
    <div
      className="position-relative rounded overflow-hidden card shadow-sm h-100"
      role="button"
      onClick={()=>handleClick(item.link)}
    >
      <Image
        src={item.image}
        alt={item.title}
        className="img-fluid food-card w-100 h-100"
        width={300}
        height={300}
        loading="lazy"
      />
      <button className="btn food-card-btn position-absolute  px-4 py-2 py-lg-3 fw-semibold start-50 translate-middle-x " onClick={()=>handleClick(item.link)}>
        {item.title} 
      </button>
    </div>
    </>
  );
};

export default React.memo(FoodCard);
