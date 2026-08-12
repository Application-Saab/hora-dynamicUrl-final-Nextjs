"use client";
import React from "react";
import CustomButton from "@/components/wonderland/common/CustomButton";
const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-tabs-scroll">
      {categories.map((cat) => (
        <CustomButton
          key={cat}
          title={cat}
          onClick={() => onSelectCategory(cat)}
          variant="primary"
          buttonClass={`categories-Button ${selectedCategory === cat ? "active" : ""}`}
        />
      ))}
    </div>
  );
};

export default CategoryTabs;
