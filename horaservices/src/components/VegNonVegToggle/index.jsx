import React, { useState } from "react";
const VegToggle = ({ value = "veg", onChange }) => {

  const handleChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <div className="veg-toggle">
      <button
        className={`veg-btn veg ${value === "veg" ? "active" : ""}`}
       onClick={() => handleChange("veg")}
      >
        Only Veg
      </button>

      <button
        className={`veg-btn nonveg ${value === "non-veg" ? "active" : ""}`}
        onClick={() => handleChange("non-veg")}
      >
        Non-Veg
      </button>
    </div>
  );
};
export default VegToggle;