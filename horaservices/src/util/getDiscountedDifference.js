export const getDiscountedDifference = (price) => {
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (isNaN(numericPrice) || numericPrice < 0) return null;
    const discount = numericPrice < 3000 ? 20 : numericPrice <= 5000 ? 27 : 35;
    const discountedPrice = Math.floor(numericPrice * (1 - discount / 100));
    return numericPrice - discountedPrice;
  };