import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import "./catvaluephoto.css"

const getDiscountedPrice = (price) => {
  const discount = 20;
  const discountedPrice = price - (price * discount) / 100;
  return {
    discount,
    discountedPrice,
    discountDifference: price - discountedPrice,
  };
};

const slugToIdMap = {
  "Engagement-Photography": "68c3ab87c9c67cc47cedbf93",
  "Wedding-Photography": "68c3abc3c9c67cc47cedc01b",
  "Anniversary-Photography":"68c3aae9c9c67cc47cedbe6d",
  "Birthday-Photography": "68c3aa8ac9c67cc47cedbdec",
  "House-warming-Photography":"68c3aaf1c9c67cc47cedbe76",
  "Naming-ceremony-Photography":"68c3ab42c9c67cc47cedbefc",
  "Baby-Shower-Photography":"68c3ab2ec9c67cc47cedbede",
  "Bachelorette-Photography":"68c3abe5c9c67cc47cedc05c",
  "Maternity-Photography":"68c3ab97c9c67cc47cedbfb4",
"New-Born-Baby-Photography":"68c3abd1c9c67cc47cedc044"
};

export default function CatValuePage() {
  const router = useRouter();
  const { catValue } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (tagId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://horaservices.com:3000/api/photography/searchByTag/${tagId}`
      );
      const productData = response.data.data.map((item) => {
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(item.price);
        return {
          ...item,
          discountPercentage: discount,
          discountedPrice,
          discountDifference,
        };
      });
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (catValue) {
      const tagId = slugToIdMap[catValue]; 
      if (tagId) {
        fetchData(tagId);
      }
    }
  }, [catValue, fetchData]);

const handleViewMore = (work) => {
  if (!work?._id) return; // safety check

  const tagId = slugToIdMap[catValue]; // get tagId dynamically

  router.push({
    pathname: `/photography-page/product/${work._id}`,
    query: {
      product: JSON.stringify(work),
      tagId: tagId,
    },
  });

  // push analytics
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'photography_view_more_click',
    eventCategory: 'photography',
    eventAction: 'view_more_click',
    eventLabel: work?.title || work?.name || 'Unknown Product',
    productId: work?._id,
    tagId: tagId,
  });
};


  return (
    <div className="featured-works">
        <p className="ProductHeading">{catValue} Products</p>

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="work-container">
            {products.map((work, index) => (
              <div className="work-item" key={index}>
                <div className="discount-badge">
                  ₹ {work.discountDifference.toFixed(0)} off
                </div>
                <div className="work-image-wrapper">
                  <div className="work-image">
                    <Image
                      src={work.imageUrl || "/default.jpg"}
                      alt={work.name}
                      width={300}
                      height={200}
                      className="work-img"
                    />
                    <div className="work-image-overlay" />
                    <h5 className="work-title">{work.name}</h5>
                  </div>
                </div>

                <div className="work-card-info">
                  <p className="Prefred-occ">
                    <span className="old-price">₹ {work.price}</span>
                    <span className="new-price">
                      ₹{Math.floor(work.discountedPrice)}
                    </span>
                  </p>
                  <button
                     onClick={() => handleViewMore(work)}
                    className="photograpy-book-now"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>
  );
}
