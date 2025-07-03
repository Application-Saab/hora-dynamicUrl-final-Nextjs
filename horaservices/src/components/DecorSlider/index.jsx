import Image from "next/image";
import Link from "next/link";
import "./DecorSlider.css";
import { decCat } from "@/utils/decorationCategories";
const handleViewMore = (category) => {
    const categoryItem = decCat.find(cat => cat.subCategory === category);
    console.log('Category Item:', categoryItem);
    if (categoryItem) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "title_and_viewmore_decoration_page_clicked",
        categoryName: categoryItem.name,
        subCategory: categoryItem.subCategory,
        catValue: categoryItem.catValue,
        imgAlt: categoryItem.imgAlt,
      });
      openCatItems(categoryItem);
    } else {
      console.log('No matching category item found.');
    }
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
const DecorSlider = ({
  title,
  viewAllLink,
  data,
  showDiscount = false,
  discountAmount = 0,
  imageSize = { width: 120, height: 120 },
}) => {
  return (
    <section className="premium-slide-decor">
      <div className="premium-slide-decor-header">
        <h2>{title}</h2>
        {/* <Link href={viewAllLink}>View All</Link> */}
        <Link href={viewAllLink} onClick={() => handleViewMore(title)}>View All</Link>

      </div>

      <div className="premium-scroll-wrapper">
       {data.map((item, index) => {
  const numericPrice = parseInt(item.price.replace("₹", "")) || 0;
  const discountDifference = getDiscountedDifference(item.price);
  const originalPrice = numericPrice + discountDifference;

          return (
            <Link href={item.link} key={index} className="premium-card">
              <div className="premium-img-wrapper">
                <Image
                  src={item.Image}
                  alt={item.title}
                  width={imageSize.width}
                  height={imageSize.height}
                  className="premium-img"
                />
                {showDiscount && (
      <div className="premium-discount">₹{discountDifference} off</div>
    )}
              </div>
              <div className="premium-content">
                <p className="premium-title">{item.title}</p>
                <div className="premium-price-wrapper">
                  <span className="premium-price">{item.price}</span>
                  {showDiscount && (
                    <span className="premium-original">₹{originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DecorSlider;
