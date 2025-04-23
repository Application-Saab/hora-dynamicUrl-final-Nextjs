import React from "react";

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
      <img
        src={item.image}
        alt={item.title}
        className="img-fluid mb-2 w-100 h-100 food-card"
      />
      <button className="btn btn-danger position-absolute bottom-0 start-0 px-4 py-2 py-lg-3 fw-semibold w-100" onClick={()=>handleClick(item.link)}>
        {item.title} 
      </button>
    </div>
    </>
  );
};

export default React.memo(FoodCard);
