import React, { useState } from "react";
import "./vegToggle.css";

const VegToggle = () => {
  const [type, setType] = useState("veg");

  return (
    <div className="veg-toggle">
      <button
        className={`veg-btn veg ${type === "veg" ? "active" : ""}`}
        onClick={() => setType("veg")}
      >
        Only Veg
      </button>

      <button
        className={`veg-btn nonveg ${type === "nonveg" ? "active" : ""}`}
        onClick={() => setType("nonveg")}
      >
        Non-Veg
      </button>
    </div>
  );
};

export default VegToggle;