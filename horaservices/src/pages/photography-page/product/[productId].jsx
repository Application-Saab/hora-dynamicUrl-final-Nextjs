import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDetails = () => {
  const router = useRouter();
  const { productId, product } = router.query;
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDiscountedPrice = (price) => {
    let discount = 0;
    if (price < 3000) discount = 20;
    else if (price <= 5000) discount = 27;
    else discount = 35;

    const discountedPrice = price * (1 - discount / 100);
    const discountDifference = price - discountedPrice;
    return { discount, discountedPrice, discountDifference };
  };

  useEffect(() => {
    const fetchFromBackup = async () => {
      try {
        const res = await axios.get(
          'https://horaservices.com:3000/api/photography/searchByTag/66c96b4e22ed47b72117e09a'
        );
        const allWorks = res.data.data;
        const matched = allWorks.find((item) => item._id === productId);
        if (matched) {
          const price = Number(matched.price);
          const { discount, discountedPrice, discountDifference } = getDiscountedPrice(price);
          setWork({
            ...matched,
            price,
            discountedPrice,
            discountPercentage: discount,
            discountDifference,
          });
        }
      } catch (err) {
        console.error("Backup fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (product) {
      try {
        const parsed = JSON.parse(product);
        const price = Number(parsed.price);
        const { discount, discountedPrice, discountDifference } = getDiscountedPrice(price);
        setWork({
          ...parsed,
          price,
          discountedPrice,
          discountPercentage: discount,
          discountDifference,
        });
        setLoading(false);
      } catch (err) {
        console.error("Invalid product JSON in query:", err);
        fetchFromBackup();
      }
    } else {
      fetchFromBackup();
    }
  }, [product, productId]);

  if (loading) return <div className="photodetails-loading">Loading...</div>;
  if (!work) return <div className="photodetails-loading">Work not found</div>;

  return (
    <div className="photodetails-container">
      <div className="photodetails-image-section">
        {/* <img src={`/uploads/${work.featured_image}`} alt={work.name} /> */}
        <img src="/traditionalPhoto.png" alt="Traditional Photography" />
      </div>

      <div className="photodetails-price-section">
        <span className="photodetails-discounted">₹ {Math.floor(work.discountedPrice)}</span>
        <span className="photodetails-original">₹ {work.price}</span>
        <span className="photodetails-offer">₹ {Math.floor(work.discountDifference)} off</span>
      </div>

      <div className="photodetails-inclusions">
        <h3>Inclusions</h3>
        <ul>
          {work.inclusion[0]
            .replace(/<[^>]*>/g, '')
            .split('-')
            .filter((line) => line.trim() !== '')
            .map((line, idx) => (
              <li key={idx}>
                <span className="photodetails-dot">●</span> {line.trim()}
              </li>
            ))}
        </ul>
      </div>

      <div className="photodetails-extra-features">
        <h4>Add Extra Features</h4>
        <div className="photodetails-scroll-row">
          <div className="photodetails-feature-card">
            <img src="/icons/photographer.png" alt="Photographer" />
            <p>Extra Photographer</p>
          </div>
          <div className="photodetails-feature-card">
            <img src="/icons/video.png" alt="Video" />
            <p>HD Video</p>
          </div>
          <div className="photodetails-feature-card">
            <img src="/icons/drone.png" alt="Drone" />
            <p>Drone Shots</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
