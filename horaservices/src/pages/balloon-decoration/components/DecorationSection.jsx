import React from "react";

const DecorationSection = ({handleItemClick, title, category, handleViewMore, viewLink, children }) => {
  return (
    <div className="mb-5 mt-2" onClick={()=>handleItemClick({title,category})}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2
          className="h5 text-dark mb-0 fw-bold cursor-pointer category-title"
          onClick={() => handleViewMore(viewLink || category)}
        >
          {title}
        </h2>
        <div >
          <span
            className="text-purple"
            onClick={() => handleViewMore(viewLink || category)}
          >
            view more
          </span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DecorationSection;
