export const getDiscountedPrice = (price) => {
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (isNaN(numericPrice) || numericPrice < 0) return null;
    const discount = numericPrice < 3000 ? 20 : numericPrice <= 5000 ? 27 : 35;
    return Math.floor(numericPrice * (1 + discount / 100));
  };