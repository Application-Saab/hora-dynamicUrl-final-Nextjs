import React, { useState } from 'react';
import BalloonCategoryDropdown from './BalloonCategoryDropdown';
import BalloonProductDisplay from './BalloonProductDisplay';
import './BalloonCategorySection.css';

const BalloonCategorySection = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCategoryName(category.name);
  };

  return (
    <section className="balloon-category-section">
      <div className="category-section-container">
        <div className="section-title">
          <h1>Explore Balloon Decoration Categories</h1>
          <p>Select a category to see our amazing products</p>
        </div>

        <BalloonCategoryDropdown 
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />

        {selectedCategory && (
          <BalloonProductDisplay 
            categoryValue={selectedCategory.catValue}
            categoryName={selectedCategoryName}
          />
        )}
      </div>
    </section>
  );
};

export default BalloonCategorySection;
