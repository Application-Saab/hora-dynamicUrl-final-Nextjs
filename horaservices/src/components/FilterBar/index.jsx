"use client";
import React from "react";
import { useRouter } from "next/navigation";
import "./FilterBar.css"; // optional for custom styling

const FilterBar = ({
  priceFilter,
  setPriceFilter,

}) => {
  const router = useRouter();

  return (
    <div className="filterBarContainer d-flex flex-wrap gap-3 align-items-center justify-content-center mb-4">
      {/* === Price Filter === */}
      <select
        className="filterSelect"
        value={priceFilter}
        onChange={(e) => setPriceFilter(e.target.value)}
      >
        <option value="all">Sort By: Price</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
        <option value="under2000">Under ₹ 2000</option>
        <option value="2000to5000">₹ 2000 - ₹ 5000</option>
        <option value="above5000">Above ₹ 5000</option>
      </select>

    
    </div>
  );
};

export default FilterBar;
