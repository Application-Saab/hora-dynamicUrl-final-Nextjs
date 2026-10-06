// ⭐ Similar Products (Theme + Price Fallback)
// ⭐ Similar Products (Theme + Price)

export const filterSimilarProducts = (
  product,
  productsArray = [],
  themeFilters = [],
) => {
  if (!product || !productsArray.length) return [];

  const name = product.name.toLowerCase();

  // ⭐ theme detect
  const matchedTheme = themeFilters.find((t) => {
    if (t.value === "all") return false;

    const keywords = t.value.toLowerCase().split("-");

    return keywords.some((word) => name.includes(word));
  });

  // ⭐ Same Theme Products
  if (matchedTheme) {
    const keywords = matchedTheme.value.toLowerCase().split("-");

    const filtered = productsArray.filter((item) => {
      const itemName = item.name.toLowerCase();

      return (
        item._id !== product._id &&
        keywords.some((word) => itemName.includes(word))
      );
    });

    if (filtered.length > 0) {
      return filtered;
    }
  }

  // ⭐ Price Logic

  const price = Number(product.price);

  const min = price - 500;
  const max = price + 500;

  const filtered = productsArray.filter((item) => {
    const itemPrice = Number(item.price);

    return item._id !== product._id && itemPrice >= min && itemPrice <= max;
  });

  return filtered;
};

// ⭐ Level Up Products

export const filterLevelUpProducts = (price, productsArray = [], excludeId) => {
  if (!price || !productsArray.length) {
    return { level1: [], level2: [] };
  }

  const basePrice = Number(price);

  const level1Min = basePrice + 1000;
  const level1Max = basePrice + 2000;

  const level2Min = basePrice + 2000;
  const level2Max = basePrice + 3500;

  const level1 = productsArray.filter((item) => {
    const itemPrice = Number(item?.price);

    return (
      item._id !== excludeId && itemPrice >= level1Min && itemPrice <= level1Max
    );
  });

  const level2 = productsArray.filter((item) => {
    const itemPrice = Number(item?.price);

    return (
      item._id !== excludeId && itemPrice >= level2Min && itemPrice <= level2Max
    );
  });

  return { level1, level2 };
};

// ⭐ Category Slug Mapping

export const getMappedCatValue = (slug) => {
  const map = {
    "birthday-decoration": "Birthday",
    "anniversary-decoration": "Anniversary",
    "haldi-mehendi-decoration": "Haldi-Mehandi",
    "first-night-decoration": "FirstNight",
    "baby-shower-decoration": "BabyShower",
    "welcome-baby-decoration": "WelcomeBaby",
    "premium-decoration": "PremiumDecoration",
    "bachelorette-decoration": "bachelorette",
    "kids-birthday-decoration": "KidsBirthday",
    "naming-ceremony-decoration": "NamingCeremony",
    "house-warming-decoration": "HouseWarming",
    "corporate-showrooms-decoration": "Coorporateshowrooms",
    "car-decoration": "CarDecoration",
    "pet-animals-decoration": "PetAnimalsDecoration",
    "festivals-decoration": "Festivals",
    "engagement-decoration": "Engagementdecoration",
    "reception-decoration": "ReceptionDecoration",
    "sangeet-decoration": "SangeetDecoration",
    "mandap-decoration": "MandapDecoration",
    "nation-pride-decoration": "NationPride",
    "wedding-decoration": "Wedding",
  };

  return map[slug] || slug;
};

export const getCategoryNameToSlug = (slug) => {
  const map = {
    Birthday: "birthday-decoration",
    Anniversary: "anniversary-decoration",
    "Haldi-Mehandi": "haldi-mehendi-decoration",
    FirstNight: "first-night-decoration",
    BabyShower: "baby-shower-decoration",
    WelcomeBaby: "welcome-baby-decoration",
    PremiumDecoration: "premium-decoration",
    bachelorette: "bachelorette-decoration",
    KidsBirthday: "kids-birthday-decoration",
    NamingCeremony: "naming-ceremony-decoration",
    HouseWarming: "house-warming-decoration",
    Coorporateshowrooms: "corporate-showrooms-decoration",
    CarDecoration: "car-decoration",
    PetAnimalsDecoration: "pet-animals-decoration",
    Festivals: "festivals-decoration",
    Engagementdecoration: "engagement-decoration",
    NationPride: "nation-pride-decoration",
    Wedding: "wedding-decoration",
    // Wedding: "wedding",
    ReceptionDecoration: "reception-decoration",
    SangeetDecoration: "sangeet-decoration",
    MandapDecoration: "mandap-decoration",
  };

  return map[slug] || slug;
};
