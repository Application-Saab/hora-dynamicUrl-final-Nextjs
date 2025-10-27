import React from "react";
import "./invite.css";

const InvitesPage = () => {
  return (
    <div className="container-fluid w-100 p-0 m-0 d-flex justify-content-center">
      <div className="invite-page-container p-3">
        <div className="container">
          {/* 1. Large Image/Banner Placeholder (as per image) */}
          <div className="placeholder-glow mb-4">
            <div
              className="placeholder w-100 rounded"
              style={{ height: "150px" }}
            ></div>
          </div>

          {/* 2. Three Circular Placeholders (Categories/Icons) */}
          <div className="d-flex justify-content-around mb-4 placeholder-glow">
            <span
              className="placeholder rounded-circle"
              style={{ width: "48px", height: "48px" }}
            ></span>
            <span
              className="placeholder rounded-circle"
              style={{ width: "48px", height: "48px" }}
            ></span>
            <span
              className="placeholder rounded-circle"
              style={{ width: "48px", height: "48px" }}
            ></span>
          </div>

          {/* 3. Content Block Placeholder 1 (Card Style) */}
          <div className="placeholder-glow mb-4">
            <div
              className="placeholder w-100 rounded"
              style={{ height: "150px" }}
            ></div>
          </div>

          {/* 4. Two Small Placeholders (Side-by-side tabs/buttons) */}
          <div className="d-flex mb-4 w-100 gap-3 placeholder-glow">
            <span
              className="placeholder col rounded"
              style={{ height: "30px" }}
            ></span>
            <span
              className="placeholder col rounded"
              style={{ height: "30px" }}
            ></span>
            <span
              className="placeholder col rounded"
              style={{ height: "30px" }}
            ></span>
          </div>

          {/* 5. Large Card Placeholder (Detailed Content Block) */}
          <div className="placeholder-glow mb-4">
            <div
              className="placeholder w-100 rounded"
              style={{ height: "150px" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitesPage;
