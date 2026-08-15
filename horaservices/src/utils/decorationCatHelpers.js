export function getSubCategory(catValue) {
  if (!catValue) return "";

  if (catValue === "birthday-decoration") {
    return "Birthday";
  }
  if (catValue === "anniversary-decoration") {
    return "Anniversary";
  }
  if (catValue === "haldi-mehendi-decoration") {
    return "Haldi-Mehandi";
  }
  if (catValue === "first-night-decoration") {
    return "FirstNight";
  }
  if (catValue === "baby-shower-decoration") {
    return "BabyShower";
  }
  if (catValue === "welcome-baby-decoration") {
    return "WelcomeBaby";
  }
  if (catValue === "premium-decoration") {
    return "PremiumDecoration";
  }
  if (catValue === "bachelorette-decoration") {
    return "bachelorette";
  }
  if (catValue === "naming-ceremony-decoration") {
    return "NamingCeremony";
  }
  if (catValue === "coorporate-showrooms-decoration") {
    return "Coorporateshowrooms";
  }
  if (catValue === "car-decoration") {
    return "CarDecoration";
  }
  if (catValue === "festivals-decoration") {
    return "Festivals";
  }
  if (catValue === "pet-animals-decoration") {
    return "PetAnimalsDecoration";
  }
  if (catValue === "engagement-decoration") {
    return "Engagementdecoration";
  }

  const parts = catValue.split("-");
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

export function getDiscountedPrice(price) {
  const numericPrice = Number(price);
  let discount;

  if (numericPrice < 3000) {
    discount = 20;
  } else if (numericPrice >= 3000 && numericPrice <= 5000) {
    discount = 27;
  } else {
    discount = 35;
  }

  const discountedPrice = numericPrice * (1 + discount / 100);
  const discountDifference = Math.abs(numericPrice - discountedPrice);

  return { discount, discountedPrice, discountDifference };
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomRating() {
  return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
}

export function decorateCatalogueItem(item) {
  const numericPrice = Number(item.price);
  const { discount, discountedPrice, discountDifference } =
    getDiscountedPrice(numericPrice);

  return {
    ...item,
    price: numericPrice,
    rating: getRandomRating(),
    userCount: getRandomNumber(20, 500),
    discountPercentage: discount,
    discountedPrice,
    discountDifference,
  };
}
