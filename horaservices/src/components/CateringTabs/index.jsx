import React, { useState } from "react";
import "./cateringTabs.css";
import bulkIcon from "@/assets/bulk.svg";
import liveIcon from "@/assets/live.svg";
import Image from "next/image";
const CateringTabs = () => {
  const [active, setActive] = useState("live");

  return (
    <div className="catering-tabs">

      <button
        className={`tab-btn ${active === "bulk" ? "active" : ""}`}
        onClick={() => setActive("bulk")}
      >
        <Image src={bulkIcon} alt="" />
        BULK PACKAGES
      </button>

      <button
        className={`tab-btn ${active === "live" ? "active" : ""}`}
        onClick={() => setActive("live")}
      >
        <Image src={liveIcon} alt="" />
        LIVE CATERING
      </button>

    </div>
  );
};

export default CateringTabs;