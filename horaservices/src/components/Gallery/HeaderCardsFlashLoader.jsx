import React from "react";
import "./headerCards.css";

const HeaderCardsFlashLoader = () => {
  return (
    <>
      {/* HEADER CARDS SKELETON */}
      <div className="gallery-headerCard placeholder-glow">
        {[1, 2, 3].map(i => (
          <div className="card-item" key={i}>
            <span
              className="placeholder rounded-circle"
              style={{ width: "90px", height: "90px" }}
            />
            <span
              className="placeholder mt-3"
              style={{ width: "60px", height: "14px", borderRadius: "8px" }}
            />
          </div>
        ))}
      </div>

      {/* ADD NEW IMAGES BUTTON SKELETON */}
      <div className="d-flex mt-4 placeholder-glow">
        <span
          className="placeholder"
          style={{
            width: "150px",
            height: "37px",
            borderRadius: "49.26px",
            marginBottom:"15px"
          }}
        />
      </div>
    </>
  );
};

export default HeaderCardsFlashLoader;
