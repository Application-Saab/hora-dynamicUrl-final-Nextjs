import React, { useState } from "react";
import "./cateringTabs.css";
import bulkIcon from "@/assets/bulk.svg";
import liveIcon from "@/assets/live.svg";
import Image from "next/image";
const CateringTabs =({ onChange }) => {
  const [active, setActive] = useState("live");
  const handleClick = (type) => {
    setActive(type);

    // 👇 parent ko bhejo
    if (onChange) {
      onChange(type === "bulk" ? "bulkFood" : "liveCatering");
    }
  };

  return (
    <div className="catering-tabs">

      <button
        className={`tab-btn ${active === "bulk" ? "active" : ""}`}
         onClick={() => handleClick("bulk")}
      >
        <Image src={bulkIcon} alt="" />
        BULK PACKAGES
      </button>

      <button
        className={`tab-btn ${active === "live" ? "active" : ""}`}
       onClick={() => handleClick("live")}
      >
        <Image src={liveIcon} alt="" />
        LIVE CATERING
      </button>

    </div>
  );
};

export default CateringTabs;