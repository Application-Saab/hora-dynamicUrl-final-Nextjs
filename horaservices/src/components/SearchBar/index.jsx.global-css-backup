import React, { useState,useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./searchbar.css";

const SearchBar = ({ searchTerm, setSearchTerm, suggestions, onSelect, onFocus,isSearching }) => {
  const [showDropdown, setShowDropdown] = useState(false);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".search-wrapper")) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  return (
    <div className="search-wrapper">
      
      {/* Input */}
      <div className="search-container">
        <FaSearch className="search-icon-img" />
    <input
  type="text"
  placeholder="Search"
  value={searchTerm}
  onFocus={() => {
    setShowDropdown(true);   // ✅ dropdown open
    if (onFocus) onFocus();  // parent ko batana
  }}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  }}
  className="search-input"
  style={{ width: "100%" }}
/>
      </div>

      {/* Dropdown */}
      {showDropdown && searchTerm && (
        <div className="search-dropdown">
         {suggestions.length > 0 ? (
  suggestions.slice(0, 6).map((dish) => {
    const dishImage = dish.image
      ? `https://horaservices.com/api/uploads/${dish.image}`
      : "/placeholder.png"; // fallback

    return (
      <div
        key={dish._id}
        className="dropdown-item"
        onClick={() => {
          onSelect(dish);
          setShowDropdown(false);
        }}
      >
        <img
          src={dishImage}
          alt={dish.name}
          className="dropdown-img"
        />
        <span>{dish.name}</span>
      </div>
    );
  })
) : (
  <div className="dropdown-item">No dishes found</div>
)}
        </div>
      )}
    </div>
  );
};

export default SearchBar;