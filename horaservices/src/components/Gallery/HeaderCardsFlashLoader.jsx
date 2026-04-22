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
              style={{ width: "81px", height: "81px" }}
            />
            <span
              className="placeholder mt-1"
              style={{ width: "60px", height: "14px", borderRadius: "8px" }}
            />
          </div>
        ))}
      </div>

      {/* ADD NEW IMAGES BUTTON SKELETON */}
      <div className="d-flex gap-2 placeholder-glow">
        <span
          className="placeholder"
          style={{
            width: "138px",
            height: "37px",
            borderRadius: "49.26px",
            marginBottom:"15px"
          }}
        />
          <span
          className="placeholder"
          style={{
            width: "170px",
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
