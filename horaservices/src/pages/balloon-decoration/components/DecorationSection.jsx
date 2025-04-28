import React from "react";

const DecorationSection = ({handleItemClick, title, category, handleViewMore, viewLink, children }) => {
  return (
    <div className="mb-5 mt-2" onClick={()=>handleItemClick({title,category})}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2
          className="h5 text-dark mb-0 fw-bold cursor-pointer"
          onClick={() => handleViewMore(viewLink || category)}
        >
          {title}
        </h2>
        <div >
          <button
            className="btn btn-outline-primary"
            onClick={() => handleViewMore(viewLink || category)}
          >
            view more
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DecorationSection;
