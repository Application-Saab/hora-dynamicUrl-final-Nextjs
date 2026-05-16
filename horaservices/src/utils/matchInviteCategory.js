// import { INVITE_CATEGORIES } from "./constants";

// export const matchInviteCategory = (occasion = "") => {
//   const normalized = occasion.toLowerCase().trim();

//   // exact includes match
//   const found = INVITE_CATEGORIES.find((category) =>
//     normalized.includes(category.toLowerCase()),
//   );

//   if (found) return found;

//   // custom keyword mapping
//   const keywordMap = {
//     marriage: "Wedding",
//     wedding: "Wedding",
//     bride: "Wedding",
//     groom: "Wedding",

//     engage: "Engagement",
//     ring: "Engagement",

//     baby: "BabyShower",
//     shower: "BabyShower",

//     birthday: "Birthday",
//     bday: "Birthday",

//     griha: "Housewarming",
//     house: "Housewarming",
//     home: "Housewarming",

//     baptism: "Baptism",

//     naming: "NamingCermony",
//     naamkaran: "NamingCermony",
//   };

//   for (const key in keywordMap) {
//     if (normalized.includes(key)) {
//       return keywordMap[key];
//     }
//   }

//   // fallback
//   return "Birthday";
// };


export const CATEGORY_KEYWORD_MAP = {
  Birthday: [
    // common
    "birthday",
    "bday",
    "happy birthday",
    "birthday party",
    "turning",
    "cake smash",
    "born day",

    // kids
    "1st birthday",
    "first birthday",
    "second birthday",
    "kids birthday",
    "teen birthday",

    // global slang
    "birthday bash",
    "birthday celebration",
    "birthday eve",
  ],

  BabyShower: [
    // common
    "baby shower",
    "babyshower",
    "shower",

    // indian
    "godh bharai",
    "godh bharai",
    "godbharai",
    "seemantham",
    "srimantham",
    "valaikappu",

    // western
    "mom to be",
    "parents to be",
    "bundle of joy",
    "new baby coming",
    "baby sprinkle",
    "gender reveal",
    "pregnancy celebration",
    "maternity celebration",
  ],

  Annaprashan: [
    // indian names
    "annaprashan",
    "annaprashana",
    "annaprasan",
    "annaprasana",
    "mukhe bhaat",
    "mukhebhat",
    "choroonu",
    "chorunu",
    "rice ceremony",
    "first rice ceremony",
    "feeding ceremony",

    // alternate spellings
    "anna prashan",
    "anna prasana",
    "first feeding",
  ],

  WelcomeBaby: [
    // common
    "welcome baby",
    "baby welcome",
    "welcome home baby",
    "newborn welcome",
    "baby arrival",

    // indian
    "chhathi",
    "chathi",
    "sutra ceremony",

    // modern
    "baby arrival party",
    "new baby celebration",
    "its a boy",
    "its a girl",
    "welcome little one",
    "newborn celebration",
  ],

  Baptism: [
    // christian
    "baptism",
    "baptism ceremony",
    "christening",
    "holy baptism",
    "baptize",
    "baby baptism",

    // catholic/christian global
    "dedication ceremony",
    "child dedication",
    "infant baptism",
    "water baptism",
    "holy sacrament",
    "first sacrament",
  ],

  NamingCermony: [
    // common
    "naming ceremony",
    "naming",
    "baby naming",

    // indian
    "naamkaran",
    "namkaran",
    "naamकरण",
    "naming function",
    "naming event",

    // global
    "name reveal",
    "baby naming ceremony",
    "christian naming",
    "newborn naming",
  ],

  Housewarming: [
    // common
    "housewarming",
    "house warming",
    "new home",
    "home inauguration",
    "home opening",

    // indian
    "griha pravesh",
    "grah pravesh",
    "gruha pravesam",
    "vastu puja",
    "vastu shanti",
    "home puja",

    // western
    "moving in party",
    "new house party",
    "new apartment",
    "home blessing",
    "house party",
  ],

  "Wedding&Engagement": [
    // wedding
    "wedding",
    "marriage",
    "shaadi",
    "shadi",
    "nikah",
    "nikkah",
    "vivah",
    "lagna",
    "wedding ceremony",
    "wedding celebration",
    "bridal",

    // engagement
    "engagement",
    "engaged",
    "ring ceremony",
    "proposal",
    "roka",
    "sagai",
    "mangni",
    "fiance",
    "fiancée",

    // functions
    "mehendi",
    "mehndi",
    "haldi",
    "sangeet",
    "reception",
    "cocktail party",
    "bridal shower",
    "wedding reception",

    // global
    "save the date",
    "wedding invite",
    "wedding party",
    "wedding day",
    "couple celebration",
    "union ceremony",
  ],
};


export const matchInviteCategory = (occasion = "") => {
  const normalized = occasion.toLowerCase().trim();

  for (const category in CATEGORY_KEYWORD_MAP) {
    const keywords = CATEGORY_KEYWORD_MAP[category];

    const matched = keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase())
    );

    if (matched) {
      return category;
    }
  }

  return false;
};