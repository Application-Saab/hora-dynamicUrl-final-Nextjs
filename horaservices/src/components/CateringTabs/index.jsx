import React, { useState, useEffect } from "react";
import bulkIcon from "@/assets/bulk.svg";
import liveIcon from "@/assets/live.svg";
import Image from "next/image";
import { useRouter } from "next/router";

const CateringTabs = ({ onChange }) => {
  const router = useRouter();
  const [active, setActive] = useState("bulk");

  useEffect(() => {
    if (router.query.type === "liveCatering") {
      setActive("live");
    } else {
      setActive("bulk");
    }
  }, [router.query.type]);

  const handleClick = (type) => {
    setActive(type);

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