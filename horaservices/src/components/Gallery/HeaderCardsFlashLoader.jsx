import React from "react";
const HeaderCardsFlashLoader = () => {
  return (
    <>

<div
  className="placeholder-glow"
  style={{
    width: "100%",
    height: "200px",
    display: "block",
    marginTop: "10px",
    backgroundColor: "#e9ecef",
    borderRadius: "8px",
  }}
>
  <span
    className="placeholder w-100 h-100 d-block"
    style={{
      height: "100%",
      display: "block",
    }}
  ></span>
</div>
      {/* HEADER CARDS SKELETON */}
      <div className="gallery-headerCard placeholder-glow thumbnail-gallery-content">
        {[1, 2, 3].map(i => (
          <div className="card-item thumbnail-gallery-content" key={i}>
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
      <div className="d-flex gap-2 placeholder-glow thumbnail-gallery-content">
        <span
          className="placeholder"
          style={{
            width: "120px",
            height: "32px",
            borderRadius: "8px",
            marginBottom:"15px"
          }}
        />
          <span
          className="placeholder"
          style={{
            width: "170px",
            height: "32px",
            borderRadius: "8px",
            marginBottom:"15px"
          }}
        />
          <span
          className="placeholder"
          style={{
            width: "170px",
            height: "32px",
            borderRadius: "8px",
            marginBottom:"15px"
          }}
        />
      </div>
    </>
  );
};

export default HeaderCardsFlashLoader;
