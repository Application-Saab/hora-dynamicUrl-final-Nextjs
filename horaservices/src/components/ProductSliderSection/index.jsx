import Image from "next/image";
import logo from '../../assets/new_logo_light.png'
import Link from "next/link";
import "./ProductSliderSection.css"
const getDiscountedPrice = (price) => {
    // Trim and remove currency symbol
    price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters

    // Check if the price is a valid number
    if (isNaN(price) || price < 0) {
      return { error: "Please enter a valid price." };
    }

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
    const discountDifference = price - discountedPrice; // Difference in original and discounted price

    return Math.floor(discountedPrice); // Return both discount percentage and discounted price
  };


  const getDiscountedDifference = (price) => {
    // Trim and remove currency symbol
    price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters

    // Check if the price is a valid number
    if (isNaN(price) || price < 0) {
      return { error: "Please enter a valid price." };
    }

    let discount;

    // Determine the discount percentage based on the item price
    if (price < 3000) {
      discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
    } else {
      discount = 35; // 35% discount for prices above 5000
    }
    const discountedPrice = Math.floor(price * (1 - discount / 100)); // Calculate the discounted price and round down
    const discountDifference = Math.floor(price - discountedPrice); // Difference in original and discounted price, rounded down

    return discountDifference; // Return both discount percentage and discounted price
  };




const ProductSliderSection = ({ title, data, handleViewMore, viewLink }) => (
  <div className="product-section-container">
    {/* === Header === */}
    <div className="product-section-header">
      <h2 onClick={() => handleViewMore(viewLink)}>{title}</h2>
     <Link href={viewLink}>View All</Link>
    </div>

    {/* === Cards === */}
    <div className="product-section-grid">
      {data.map((item, index) =>
        item.isViewMore ? (
          <a key={index} className="product-section-view-more-card"></a>
        ) : (
          <a key={index} className="product-section-card" href={item.link} onClick={() => handleViewMore(viewLink)}>
            <div className="product-section-image-wrapper">
              <Image
                src={item.Image}
                alt={item.title}
                className="product-section-image"
                width={200}
                height={250}
              />
              <div className="product-section-watermark">
                <Image src={logo} alt="hora watermark" width={70} height={80} className="product-section-watermark-img" />
              </div>
            </div>

            <div className="product-section-discount-badge">
              ₹{getDiscountedDifference(item.price)} off
            </div>

            <div className="product-section-details">
              <h3>{item.title}</h3>
              <div className="product-section-price">
                <p className="product-section-price-current">{item.price}</p>
                <p className="product-section-price-original">₹{getDiscountedPrice(item.price)}</p>
              </div>
            </div>
          </a>
        )
      )}
    </div>
  </div>
);




export default ProductSliderSection;
