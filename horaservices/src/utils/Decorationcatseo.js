import { getCityCategoryLanding } from "@/utils/Citycategorydecorationlanding";

const defaultCategorySeo = {
  "birthday-decoration": {
    title: "Birthday Decoration at Home from Rs 1,499 | HORA Services",
    description:
      "Book birthday decoration at home from Rs 1,499. Kids and adult themes, first birthday and surprise setups, same-day and midnight slots, and verified decorators across 8 cities.",
  },
  "naming-ceremony-decoration":{
    title:"Naming Ceremony Decoration from Rs 1,499 | HORA",
    description:"Book naming ceremony and namkaran decoration at home from Rs 1,499. Name reveal backdrops, decorated cradle, and traditional or balloon themes, by verified decorators across 8 cities."
  },
  "welcome-baby-decoration":{
    title:"Welcome Baby Decoration at Home from Rs 1,499 | HORA",
    description:"Book welcome baby decoration at home from Rs 1,499. Entrance welcomes, baby name backdrops, room setups, and boy or girl themes, by verified decorators across 8 cities."
  },
  "baby-shower-decoration":{
    title:"Baby Shower Decoration at Home from Rs 1,499 | HORA",
    description:" Book baby shower decoration at home from Rs 1,499. Godh bharai and seemantham setups, a decorated mum-to-be seat, themes and flowers, by verified decorators across 8 cities."
  },
  "anniversary-decoration":{
    title:"Anniversary Decoration at Home from Rs 1,499 | HORA",
    description:"Book anniversary decoration at home from Rs 1,499. Romantic room setups, candlelight dinners, surprise and midnight slots, and milestone 25th and 50th designs, in 8 cities."
  },
   "wedding":{
     title:"Wedding Decoration for Every Function | HORA Services",
     description:"Book wedding decoration with HORA, one partner coordinating every function, from haldi, mehndi and the mandap to the stage, entrance, lighting and reception. Home to banquet, in 8 cities."
   }
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