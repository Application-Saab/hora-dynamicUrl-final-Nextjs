import React from "react";
import CardSkeleton from "@/components/CardSkeleton";

const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default SkeletonGrid;
