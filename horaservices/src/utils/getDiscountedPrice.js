export const getDiscountedPrice = (price) => {
    let discount;
  
    // Determine the discount percentage based on the item price
    if (price < 3000) {
        discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
        discount = 27; // 27% discount
    } else {
        discount = 35; // 35% discount for prices above 5000
    }
  
    const discountedPrice = parseFloat(price) * (1 + parseFloat(discount) / 100); // Calculate the discounted price
    const discountDifference = Math.abs(parseFloat(price) - discountedPrice); // Get the absolute difference
  
    return { discount, discountedPrice, discountDifference }; // Return discount percentage, discounted price, and discount difference
  };