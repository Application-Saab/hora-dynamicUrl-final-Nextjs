import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import photographyAddOns from "../../../utils/photographyAddOns.json"
import traditionalPhoto from "../../../assets/traditionalPhoto.png";
import candidPhoto from "../../../assets/candidPhoto.jpg";
import proPhoto from "../../../assets/Prophoto.jpg";
import videoPhoto from "../../../assets/videophoto.png";
import "./productDetails.css";
const ProductDetails = ({ itemQuantities = {}, handleAddToCart, handleRemoveFromCart }) => {
  const router = useRouter();
  const { productId, product } = router.query;
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState([]);


  const productsData = {
    "6710f33c21847b9ca0554940": {
      name: "Traditional PhotoGraphy",
      category: "intimate",
      images: [traditionalPhoto],
    },
    "67c9af0c4bee1b66f0aac35d": {
      name: "Candid PhotoGraphy",
      category: "intimate",
      images: [candidPhoto],
    },
    "67c9af224bee1b66f0aac35e": {
      name: "Pro photoGraphy",
      category: "intimate",
      images: [proPhoto],
    },
    "67c9b0564bee1b66f0aac35f": {
      name: "Video Graphy",
      category: "intimate",
      images: [videoPhoto],
    },
    "683abe22fdfcb315ad5b02b0": {
      name: "Traditional PhotoGraphy",
      category: "Grand",
      images: [traditionalPhoto],
    },
    "683abe69fdfcb315ad5b02b1": {
      name: "Candid PhotoGraphy",
      category: "intimate",
      images: [candidPhoto],
    },
    "68411d34fdfcb315ad5b02bf": {
      name: "Pro photoGraphy",
      category: "intimate",
      images: [proPhoto],
    },
    "68411d61fdfcb315ad5b02c0": {
      name: "Video Graphy",
      category: "intimate",
      images: [videoPhoto],
    },
  };
  const images = productsData[productId]?.images || [];

  // const handleAdd = (item, index) => {
  //   const qty = quantities[index] || 0;
  //   if (qty > 0) {
  //     const price = item.price || ((item.minPrice + item.maxPrice) / 2);
  //     setAddedItems(prev => [...prev, { ...item, qty, total: qty * price }]);
  //   }
  // };
  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) return null;

    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, '');
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' ');
    const inclusionItems = withoutSpecialChars
      .split('<div>')
      .flatMap(statement =>
        statement
          .split('-')
          .map(item => item.trim())
          .filter(item => item !== '')
      );

    return (
      <div className="inclusionstyle">
        {inclusionItems.map((item, index) => (
          <div key={index} className="inclusion-line">
            <span className="inclusion-icon">✔</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  };


  const getDiscountedPrice = (price) => {
    let discount;

    // Determine the discount percentage based on the item price
    if (price < 3000) {
      discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
    } else {
      discount = 35; // 35% discount for prices above 5000
    }

    const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
    const discountDifference = Math.abs(price - discountedPrice);;
    return { discount, discountedPrice, discountDifference }; // Return both discount percentage and discounted price
  };
  const sendToCheckoutPage = (product) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "book_now_click",
      product_name: product.name,
    });

    router.push({
      pathname: '/photography-checkout',
      query: {
        from: window.location.pathname,
        product: JSON.stringify(product),
        totalAmount: product.discountedPrice, // use discounted price!
      }
    });
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

  if (loading) return <div className="photodetails-loading" >Loading...</div>;
  if (!work) return <div className="photodetails-loading">Work not found</div>;

  return (
    <div className="photodetails-container">
      <div className="photodetails-image-section">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${work?.name || "Product"} image ${idx + 1}`}
              width={400}
              height={300}
            />
          ))
        ) : (
          <p>No images found</p>
        )}
        {/* <img src="/traditionalPhoto.png" alt="Traditional Photography" /> */}
      </div>

      <div className="photodetails-price-section">
        <span className="photodetails-discounted">₹ {work.price}</span>
        <span className="photodetails-original">₹ {Math.floor(work.discountedPrice.toFixed(2))} </span>

        <span className="photodetails-offer">₹ {Math.floor(work.discountDifference)} off</span>
      </div>

      <div className="photodetails-inclusions">
        <h3>Inclusions</h3>
        {getItemInclusion(work.inclusion)}
        <p className="work-duration">
          <b className="Duration">Duration:</b> 2–4 Hours (After 4 hours, ₹650 extra per hour)
        </p>
      </div>
      <div className="book-now-wrapper">
        <button onClick={() => sendToCheckoutPage(work)} class="book-now-btn">Book Now</button>
      </div>
      {/* <h2 className="extra-action-heading">
       Add Extra Features
        </h2>
         <div className="extra-action-section">
         <div className="extra-action-middle-box">
         <div className="extra-action-card-container">
          {photographyAddOns.photographyAddOns.map((item, index) => (
        <div key={index} className="extra-action-card">
          <img
            src={item.image}
            alt={item.title}
            className="extra-action-image"
          />
          <h3 className="extra-action-title">{item.title}</h3>
          <p className="extra-action-description">{item.description}</p>

          <div className="extra-action-price-box">
            <span className="extra-action-price">
              ₹{' '}
              {item.minPrice && item.maxPrice
                ? `${item.minPrice} – ₹${item.maxPrice}`
                : item.price}
            </span>
            {itemQuantities[item.title] ? (
              <div className="extra-action-quantity-control">
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="extra-action-qty-btn"
                >
                  -
                </button>
                <span>{itemQuantities[item.title]}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="extra-action-qty-btn"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(item)}
                className="extra-action-add-btn"
              >
                Add
              </button>
            )}
          </div>
        </div>
      ))}
              </div>
              </div>
       </div> */}



    </div>
  );
};

export default ProductDetails;
