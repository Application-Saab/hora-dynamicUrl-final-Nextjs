import React, { useState } from "react";
import "./vegToggle.css";

const VegToggle = ({ onChange }) => {
  const [type, setType] = useState("veg");


  const handleChange = (value) => {
    setType(value);

    if (onChange) {
      onChange(value);   // 👈 PARENT KO BHEJ DO
    }
  };
  return (
    <div className="veg-toggle">
      <button
        className={`veg-btn veg ${type === "veg" ? "active" : ""}`}
       onClick={() => handleChange("veg")}
      >
        Only Veg
      </button>

      <button
        className={`veg-btn nonveg ${type === "non-veg" ? "active" : ""}`}
        onClick={() => handleChange("non-veg")}
      >
        Non-Veg
      </button>
    </div>
  );
};

export default VegToggle;