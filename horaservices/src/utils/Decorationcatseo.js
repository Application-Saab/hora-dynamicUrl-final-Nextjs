import { getCityCategoryLanding } from "@/utils/Citycategorydecorationlanding";

const defaultCategorySeo = {
  "birthday-decoration": {
    title: "Birthday Decoration at Home from Rs 1,499 | HORA Services",
    description:
      "Book birthday decoration at home from Rs 1,499. Kids and adult themes, first birthday and surprise setups, same-day and midnight slots, and verified decorators across 8 cities.",
  },

 };

const genericFallback = {
  title: "Balloon Decoration at Home from Rs 1,499 | HORA Services",
  description:
    "Book balloon decoration at home from Rs 1,499. Real setups with prices, same-day and midnight slots, and verified decorators across 8 cities. Arch, wall, ring and themed designs.",
};

export const getPageTitleCategory = (catValue, city, locality, theme) => {
  const catKey = catValue?.toLowerCase();

  if (city) {
    const cityData = getCityCategoryLanding(catValue, city);
    if (cityData?.title) return cityData.title;
  }

  return defaultCategorySeo[catKey]?.title || genericFallback.title;
};

export const getPageMetaDescriptionCategory = (catValue, city, locality) => {
  const catKey = catValue?.toLowerCase();

  if (city) {
    const cityData = getCityCategoryLanding(catValue, city);
    if (cityData?.metaDescription) return cityData.metaDescription;
  }

  return (
    defaultCategorySeo[catKey]?.description || genericFallback.description
  );
};