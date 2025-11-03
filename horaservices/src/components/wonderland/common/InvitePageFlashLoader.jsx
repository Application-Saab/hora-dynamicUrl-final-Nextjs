import React from "react";

const InvitePageFlashLoader = () => {
  return (
    <div className="container-fluid w-100 p-0 m-0 d-flex justify-content-center">
      <div
        className="px-1 py-3"
        style={{
          maxWidth: "480px",
          width: "100%",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div className="container">
          <div className="placeholder-glow mb-4">
            <div
              className="placeholder w-100"
              style={{ height: "200px", borderRadius: "10px" }}
            ></div>
          </div>

          <div className="d-flex justify-content-start mb-4 placeholder-glow gap-4">
            <span
              className="placeholder rounded-circle"
              style={{ width: "40px", height: "40px" }}
            ></span>
            <span
              className="placeholder rounded-circle"
              style={{ width: "40px", height: "40px" }}
            ></span>
            <span
              className="placeholder rounded-circle"
              style={{ width: "40px", height: "40px" }}
            ></span>
          </div>

          <div className="placeholder-glow mb-4 mt-5">
            <div
              className="placeholder w-100"
              style={{ height: "118px", borderRadius: "10px" }}
            ></div>
          </div>

          <div className="d-flex mb-4 w-100 gap-3 placeholder-glow">
            <span
              className="placeholder col"
              style={{ height: "30px", borderRadius: "33px" }}
            ></span>
            <span
              className="placeholder col"
              style={{ height: "30px", borderRadius: "33px" }}
            ></span>
            <span
              className="placeholder col"
              style={{ height: "30px", borderRadius: "33px" }}
            ></span>
          </div>

          <div className="d-flex justify-content-center">
            <div className="placeholder-glow mb-4">
              <div
                className="placeholder"
                style={{
                  height: "160px",
                  width: "220px",
                  borderRadius: "10px",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePageFlashLoader;
