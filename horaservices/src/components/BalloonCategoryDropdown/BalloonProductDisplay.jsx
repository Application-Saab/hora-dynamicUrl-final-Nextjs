import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { BASE_URL, GET_DECORATION_CAT_ITEM, API_SUCCESS_CODE } from '@/utils/apiconstants';
import './BalloonProductDisplay.css';
import CardSkeleton from '@/components/CardSkeleton';

const BalloonProductDisplay = ({ categoryValue, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryValue) {
      fetchProducts(categoryValue);
    }
  }, [categoryValue]);

  const fetchProducts = async (catValue) => {
    setLoading(true);
    setError(null);
    try {
      // Get subcategory from catValue
      let subCategory = '';
      
      const catMapping = {
        'birthday-decoration': 'Birthday',
        'kids-birthday-decoration': 'KidsBirthday',
        'baby-shower-decoration': 'BabyShower',
        'welcome-baby-decoration': 'WelcomeBaby',
        'premium-decoration': 'PremiumDecoration',
        'anniversary-decoration': 'Anniversary',
        'first-night-decoration': 'FirstNight',
        'haldi-mehendi-decoration': 'Haldi-Mehandi',
        'naming-ceremony-decoration': 'NamingCeremony',
      };

      subCategory = catMapping[catValue] || catValue.replace(/-/g, ' ');

      const response = await axios.get(
        `${BASE_URL}${GET_DECORATION_CAT_ITEM}?subCategory=${subCategory}`,
        { timeout: 10000 }
      );

      if (response.data?.status === API_SUCCESS_CODE && response.data?.data) {
        setProducts(response.data.data);
      } else {
        setError('Unable to fetch products');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (!categoryValue) {
    return (
      <div className="balloon-product-display empty-state">
        <p>Select a category to see products</p>
      </div>
    );
  }

  return (
    <div className="balloon-product-display">
      <div className="product-header">
        <h2>{categoryName} Products</h2>
        {products.length > 0 && <span className="product-count">({products.length})</span>}
      </div>

      {loading && (
        <div className="products-grid">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={product._id || index} className="product-card">
              <div className="product-image-container">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.productName}
                    width={250}
                    height={250}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                ) : (
                  <div className="product-image-placeholder">No Image</div>
                )}
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.productName}</h3>
                <div className="product-price-rating">
                  {product.price && (
                    <span className="product-price">₹{product.price}</span>
                  )}
                  {product.rating && (
                    <div className="product-rating">
                      <span className="stars">★</span>
                      <span>{product.rating}</span>
                    </div>
                  )}
                </div>
                {product.description && (
                  <p className="product-description">{product.description.substring(0, 80)}...</p>
                )}
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="empty-state">
          <p>No products found for this category</p>
        </div>
      )}
    </div>
  );
};

export default BalloonProductDisplay;
