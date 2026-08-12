"use client";
import React, { useEffect, useRef, useState } from "react";
import "./FilterBar.css";

const FilterBar = ({ priceFilter, setPriceFilter }) => {
  const barRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.boundingClientRect.top <= 0 && !entry.isIntersecting) {
          // Bar viewport se bahar chala gaya => fixed
          setIsFixed(true);
        } else {
          // Bar apni jagah dikh raha hai => normal
          setIsFixed(false);
        }
      },
      {
        root: null,
        threshold: 1.0, // pura element visible hona chahiye
      }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Placeholder div taki layout jump na kare */}
      {isFixed && (
        <div style={{ height: barRef.current?.offsetHeight || 0 }}></div>
      )}

      <div
        ref={barRef}
        className={`filterWrapper ${isFixed ? "fixed" : ""}`}
      >
        {/* <div className="filterBarContainer">
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
        </div> */}
        <div className="filterBarContainer">
  <div className="customSelectWrapper">
    <select
      className="filterSelect"
      value={priceFilter}
      onChange={(e) => setPriceFilter(e.target.value)}
    >
      <option value="all">Select : Price</option>
      <option value="lowToHigh">Price: Low to High</option>
      <option value="highToLow">Price: High to Low</option>
      <option value="under2000">Under ₹ 2000</option>
      <option value="2000to5000">₹ 2000 - ₹ 5000</option>
      <option value="above5000">Above ₹ 5000</option>
    </select>
  </div>
</div>

      </div>
    </>
  );
};

export default FilterBar;
