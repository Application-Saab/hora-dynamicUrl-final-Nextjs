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
   },
   "wedding-decoration":{
     title:"Wedding Decoration for Every Function | HORA Services",
     description:"Book wedding decoration with HORA, one partner coordinating every function, from haldi, mehndi and the mandap to the stage, entrance, lighting and reception. Home to banquet, in 8 cities."
   },

   // ── Wedding sub-categories ───────────────────────────────────────────────
   // title is a function so city can be injected: "Mandap Decoration in Mumbai"
   "mandap-decoration": {
     title: (city) => city
       ? `Mandap Decoration in ${city} from Rs 4,999 | HORA Services`
       : "Mandap Decoration from Rs 4,999 | HORA Services",
     description: "Book mandap decoration from Rs 4,999. Floral, draping and themed mandap setups for Hindu, Punjabi and South Indian weddings. Same-day setup by verified HORA decorators.",
   },
   "reception-decoration": {
     title: (city) => city
       ? `Reception Decoration in ${city} from Rs 4,999 | HORA Services`
       : "Reception Decoration from Rs 4,999 | HORA Services",
     description: "Book reception decoration from Rs 4,999. Stage, backdrop and table setups for wedding receptions. Balloon, floral and luxury designs by verified HORA decorators.",
   },
   "sangeet-decoration": {
     title: (city) => city
       ? `Sangeet Decoration in ${city} from Rs 3,999 | HORA Services`
       : "Sangeet Decoration from Rs 3,999 | HORA Services",
     description: "Book sangeet decoration from Rs 3,999. Colourful backdrops, dance floor lighting and themed setups. Same-day setup by verified HORA decorators.",
   },
   "mehendi-decoration": {
     title: (city) => city
       ? `Mehndi Decoration in ${city} from Rs 3,499 | HORA Services`
       : "Mehndi Decoration from Rs 3,499 | HORA Services",
     description: "Book mehndi decoration from Rs 3,499. Floral swings, yellow and green themes, and outdoor setups. Same-day setup by verified HORA decorators.",
   },
   "haldi-decoration": {
     title: (city) => city
       ? `Haldi Decoration in ${city} from Rs 2,999 | HORA Services`
       : "Haldi Decoration from Rs 2,999 | HORA Services",
     description: "Book haldi decoration from Rs 2,999. Marigold, sunflower and turmeric-theme setups for home and banquet. Same-day setup by verified HORA decorators.",
   },
   "haldi-mehendi-decoration": {
     title: (city) => city
       ? `Haldi Mehndi Decoration in ${city} from Rs 2,999 | HORA Services`
       : "Haldi Mehndi Decoration from Rs 2,999 | HORA Services",
     description: "Book haldi mehndi decoration from Rs 2,999. Combined floral and yellow-green setups for home or banquet. Same-day setup by verified HORA decorators.",
   },
   "engagement-decoration": {
     title: (city) => city
       ? `Engagement Decoration in ${city} from Rs 3,660 | HORA Services`
       : "Engagement Decoration from Rs 3,660 | HORA Services",
     description: "Book engagement decoration from Rs 3,660. Ring ceremony backdrops, arches and stage setups. Same-day and midnight slots by verified HORA decorators.",
   },
   "wedding-car-decoration": {
     title: (city) => city
       ? `Wedding Car Decoration in ${city} from Rs 999 | HORA Services`
       : "Wedding Car Decoration from Rs 999 | HORA Services",
     description: "Book wedding car decoration from Rs 999. Floral, ribbon and theme-based setups for baraat and wedding exits. Same-day setup by verified HORA decorators.",
   },
   "bachelorette-decoration": {
     title: (city) => city
       ? `Bachelorette Party Decoration in ${city} from Rs 1,599 | HORA Services`
       : "Bachelorette Party Decoration from Rs 1,599 | HORA Services",
     description: "Book bachelorette party decoration from Rs 1,599. Bride-to-be backdrops, balloons and props. Same-day setup by verified decorators.",
   },
   "premium-decoration": {
     title: (city) => city
       ? `Premium Stage Decoration in ${city} from Rs 3,000 | HORA Services`
       : "Premium Stage Decoration from Rs 3,000 | HORA Services",
     description: "Book premium stage decoration from Rs 3,000. Luxury balloon, floral and draping setups for weddings, receptions and corporate events. Verified HORA decorators.",
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
    // 1. Specific city+category override table takes top priority
    const cityData = getCityCategoryLanding(catValue, city);
    if (cityData?.title) return cityData.title;
  }

  // 2. Default entry — call as function (city-aware) or use plain string
  const entry = defaultCategorySeo[catKey];
  if (entry) {
    return typeof entry.title === "function"
      ? entry.title(city || null)
      : entry.title;
  }

  return genericFallback.title;
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