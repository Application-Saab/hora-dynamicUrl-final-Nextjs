"use client";
import React from "react";

const TemplatecardSkeleton = ({ width = "100%", height = "200px", borderRadius = "12px" }) => {
  return (
    <div
      className="skeleton-placeholder mt-3"
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
        backgroundSize: "200% 100%",
        animation: "loading 1.5s infinite",
        margin: "0 auto",
      }}
    ></div>
  );
};

export default TemplatecardSkeleton;
