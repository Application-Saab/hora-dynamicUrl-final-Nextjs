import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import './BalloonCategoryDropdown.css';
import arrowIcon from '@/assets/arrow-down.svg';

const BalloonCategoryDropdown = ({ categories = [], onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [displayProducts, setDisplayProducts] = useState([]);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
    
    if (onCategorySelect) {
      onCategorySelect(category);
    }

    // Navigate to the category page
    router.push(`/balloon-decoration/${category.catValue}`);
  };

  return (
    <div className="balloon-category-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="dropdown-label">
          {selectedCategory ? (
            <>
              {selectedCategory.image && (
                <Image
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  width={40}
                  height={40}
                  className="dropdown-category-image"
                />
              )}
              <span>{selectedCategory.name}</span>
            </>
          ) : (
            <span>Select a Balloon Decoration Category</span>
          )}
        </div>
        <Image
          src={arrowIcon}
          alt="dropdown arrow"
          width={20}
          height={20}
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="dropdown-item"
                onClick={() => handleCategorySelect(category)}
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={50}
                    height={50}
                    className="dropdown-item-image"
                  />
                )}
                <div className="dropdown-item-content">
                  <div className="dropdown-item-name">{category.name}</div>
                  {category.subCategory && (
                    <div className="dropdown-item-subtitle">{category.subCategory}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="dropdown-empty">No categories available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BalloonCategoryDropdown;
