const IMG_BASE = "https://horaservices.com/api/uploads/compressed_webp";

export const SERVICES = ["balloon-decoration", "wedding-decoration", "flower-decoration", "festivals-decoration"];
export const DEFAULT_SERVICE = "balloon-decoration";

export const decCat = [
  { id: "1", image: `${IMG_BASE}/Birthday.webp`, name: "Birthday", subCategory: "Birthday", catValue: "birthday-decoration", imgAlt: "A Gorgeous Candy Birthday Decoration Surprise!", services: ["balloon-decoration"] },
  { id: "2", image: `${IMG_BASE}/KIdsBirthday.webp`, name: "Kids Birthday", subCategory: "KidsBirthday", catValue: "kids-birthday-decoration", imgAlt: "Flutter into a world of whimsy with our exclusive Whimsical Flutter-themed Welcome Baby Decorations.", services: ["balloon-decoration"] },
  { id: "3", image: `${IMG_BASE}/Babyshower.webp`, name: "Baby Shower", subCategory: "BabyShower", catValue: "baby-shower-decoration", imgAlt: "Celebrate the transformation into motherhood with Our Gilded Baby Shower Decorations.", services: ["balloon-decoration"] },
  { id: "4", image: `${IMG_BASE}/stagedecoration.webp`, name: "Stage Decoration", subCategory: "PremiumDecoration", catValue: "premium-decoration", imgAlt: "Birthday party decoration ideas for adults", services: ["balloon-decoration"] },
  { id: "5", image: `${IMG_BASE}/welcomeBaby.webp`, name: "Welcome Baby", subCategory: "WelcomeBaby", catValue: "welcome-baby-decoration", imgAlt: "A Pastel Theme Oh Baby Decor for your Baby Shower Celebrations!", services: ["balloon-decoration"] },
  { id: "6", image: `${IMG_BASE}/NamingCeremony.webp`, name: "Naming Ceremony", subCategory: "NamingCeremony", catValue: "naming-ceremony-decoration", imgAlt: "Beautiful naming ceremony decoration with pastel balloons and elegant themed backdrops to welcome your little one", services: ["balloon-decoration", "flower-decoration"] },
  { id: "7", image: `${IMG_BASE}/Anniversary.webp`, name: "Anniversary", subCategory: "Anniversary", catValue: "anniversary-decoration", imgAlt: "Immerse yourself in a world of romance with our mesmerizing anniversary decorations.", services: ["balloon-decoration", "flower-decoration"] },
  { id: "8", image: `${IMG_BASE}/Housewarming.webp`, name: "House Warming", subCategory: "HouseWarming", catValue: "house-warming-decoration", imgAlt: "Create a warm and memorable welcome with our elegant house warming decoration setups.", services: ["balloon-decoration", "flower-decoration"] },
  { id: "9", image: `${IMG_BASE}/Fristnight.webp`, name: "First Night", subCategory: "FirstNight", catValue: "first-night-decoration", imgAlt: "Add extra happiness quotient to your wedding night with our exclusive décor package", services: ["wedding-decoration", "flower-decoration", "balloon-decoration"] },
  { id: "10", image: `${IMG_BASE}/ShowroomCoorporate.webp`, name: "Corporate Showroom", subCategory: "Coorporateshowrooms", catValue: "corporate-showrooms-decoration", imgAlt: "Professional corporate showroom decoration services for product launches, exhibitions, and brand promotions", services: ["balloon-decoration"] },
  { id: "11", image: `${IMG_BASE}/CarDecoration.webp`, name: "Car Decoration", subCategory: "CarDecoration", catValue: "car-decoration", imgAlt: "Beautiful car decoration services for weddings, engagements, anniversaries, surprises, and special occasions", services: ["balloon-decoration", "flower-decoration"] },
  { id: "12", image: `${IMG_BASE}/PetAnimalsDecoration.webp`, name: "Pet Decoration", subCategory: "PetAnimalsDecoration", catValue: "pet-animals-decoration", imgAlt: "Creative pet animal decoration services for pet birthdays, adoption celebrations, pet parties, and special occasions", services: ["balloon-decoration"] },
  { id: "13", image: `${IMG_BASE}/FestivalsDecoration.webp`, name: "Festivals Decoration", subCategory: "Festivals", catValue: "festivals-decoration", imgAlt: "Beautiful festival decoration services for Diwali, Holi, Christmas, New Year, Navratri, and other special celebrations", services: ["balloon-decoration", "festivals-decoration"] },
  { id: "14", image: `${IMG_BASE}/NationsPride.webp`, name: "NationPride", subCategory: "NationPride", catValue: "nation-pride-decoration", imgAlt: "Nation Pride patriotic theme decoration", services: ["balloon-decoration"] },
  { id: "15", image: `${IMG_BASE}/Mehendi.webp`, name: "Haldi Mehandi", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Vibrant haldi and mehendi ceremony decoration with yellow marigold flowers and traditional Indian motifs", services: ["wedding-decoration", "flower-decoration"] },
  { id: "16", image: "", name: "Wedding", subCategory: "Wedding", catValue: "wedding-decoration", imgAlt: "Elegant wedding decoration setup with floral mandap, fairy lights, and premium draping for a dream wedding", services: ["wedding-decoration", "flower-decoration"] },
  { id: "17", image: "", name: "Bachelorette", subCategory: "bachelorette", catValue: "bachelorette-decoration", imgAlt: "Fun and stylish bachelorette party decoration with balloons, banners, and neon signs for the bride-to-be", services: ["balloon-decoration"] },
  { id: "18", image: "", name: "Proposal Decorations", subCategory: "Proposal-Decoration", catValue: "proposal-decoration", imgAlt: "Romantic proposal decoration setup with rose petals, candles, and fairy lights for a perfect marriage proposal", services: ["balloon-decoration"] },

  { id: "19", image: `${IMG_BASE}/Housewarming.webp`, name: "House Warming Decoration", subCategory: "HouseWarming", catValue: "house-warming-decoration", imgAlt: "Warm and festive house warming decoration with marigold torans, diyas, and floral arrangements for a new home celebration", services: ["balloon-decoration", "flower-decoration"] },
  { id: "20", image: `${IMG_BASE}/Engagement.webp`, name: "Engagement Decoration", subCategory: "Engagementdecoration", catValue: "engagement-decoration", imgAlt: "Beautiful engagement decoration with floral backdrops, ring ceremony setup, and romantic lighting", services: ["wedding-decoration", "flower-decoration"] },
  { id: "21", image: `${IMG_BASE}/Reception.webp`, name: "Reception Decoration", subCategory: "ReceptionDecoration", catValue: "reception-decoration", imgAlt: "Grand reception decoration with elegant stage setup, floral centrepieces, and sophisticated lighting for a wedding reception", services: ["wedding-decoration", "flower-decoration"] },
  { id: "22", image: `${IMG_BASE}/Sangeet.webp`, name: "Sangeet Decoration", subCategory: "SangeetDecoration", catValue: "sangeet-decoration", imgAlt: "Colourful sangeet night decoration with vibrant draping, LED lights, and traditional Indian elements", services: ["wedding-decoration", "flower-decoration"] },
  { id: "23", image: `${IMG_BASE}/Mandap.webp`, name: "Mandap Decoration", subCategory: "MandapDecoration", catValue: "mandap-decoration", imgAlt: "Traditional mandap decoration with floral pillars, hanging marigolds, and sacred wedding ceremony setup", services: ["wedding-decoration", "flower-decoration"] },
  { id: "24", image: `${IMG_BASE}/Weddingcar.webp`, name: "Wedding Car Decoration", subCategory: "WeddingCarDecoration", catValue: "wedding-car-decoration", imgAlt: "Beautiful wedding car decoration with fresh flowers, ribbons, and personalised just-married signage", services: ["wedding-decoration", "flower-decoration"] },
  { id: "25", image: `${IMG_BASE}/Mehendi.webp`, name: "Mehendi Decoration", subCategory: "MehendiDecoration", catValue: "mehendi-decoration", imgAlt: "Colourful mehendi ceremony decoration with floral seating, yellow and green draping, and boho-style props", services: ["wedding-decoration", "flower-decoration"] },
  { id: "26", image: `${IMG_BASE}/Haldi.webp`, name: "Haldi Decoration", subCategory: "HaldiDecoration", catValue: "haldi-decoration", imgAlt: "Bright and cheerful haldi ceremony decoration with marigold garlands, yellow balloons, and traditional haldi props", services: ["wedding-decoration", "flower-decoration"] },
  { id: "27", image: "", name: "Annaprashan Decoration", subCategory: "AnnaprashanDecoration", catValue: "annaprashan-decoration", imgAlt: "Sweet annaprashan decoration for a baby's first rice-eating ceremony with pastel balloons and traditional Indian decor", services: ["balloon-decoration"] },
  { id: "28", image: "", name: "Name Reveal Decoration", subCategory: "NameRevealDecoration", catValue: "name-reveal-decoration", imgAlt: "Creative name reveal decoration setup with personalised letter balloons, floral arrangements, and surprise reveal props", services: ["balloon-decoration"] },
  { id: "29", image: "", name: "Baptism Decoration", subCategory: "BaptismDecoration", catValue: "baptism-decoration", imgAlt: "Elegant baptism decoration with white and gold theme, cross motifs, candles, and floral arrangements for a christening ceremony", services: ["balloon-decoration"] },
  // ---- Festival & misc categories (previously missing) ----
  { id: "30", image: `${IMG_BASE}/Ganpati.webp`, name: "Ganpati", subCategory: "GanpatiDecoration", catValue: "ganpati-decoration", imgAlt: "Traditional Ganpati decoration with floral backdrop, marigold garlands, and festive lighting for Ganesh Chaturthi", services: ["festivals-decoration"] },
  { id: "31", image: `${IMG_BASE}/Krishna.webp`, name: "Janmashtami", subCategory: "JanmastmiDecoration", catValue: "janmastmi-decoration", imgAlt: "Colourful Janmashtami decoration with flowers, peacock feather themes, and a beautifully decorated jhula for Lord Krishna", services: ["festivals-decoration"] },
  { id: "32", image: `${IMG_BASE}/Diwali.webp`, name: "Diwali", subCategory: "DiwaliDecoration", catValue: "diwali-decoration", imgAlt: "Bright Diwali decoration with diyas, rangoli, marigold torans, and glowing fairy lights for the festival of lights", services: ["festivals-decoration"] },
  { id: "33", image: `${IMG_BASE}/Navratri.webp`, name: "Navratri", subCategory: "NavratriDecoration", catValue: "navratri-decoration", imgAlt: "Vibrant Navratri decoration with colourful drapes, floral arrangements, and traditional garba-themed setup", services: ["festivals-decoration"] },
  { id: "34", image: `${IMG_BASE}/Christmas.webp`, name: "Christmas", subCategory: "ChristmasDecoration", catValue: "christmas-decoration", imgAlt: "Festive Christmas decoration with balloons, tree theme, and warm lights for a joyful holiday celebration", services: ["festivals-decoration"] },
  { id: "35", image: `${IMG_BASE}/NewYear.webp`, name: "New Year", subCategory: "NewYearDecoration", catValue: "new-year-decoration", imgAlt: "Sparkling New Year party decoration with metallic balloons, countdown props, and glittering backdrops", services: ["festivals-decoration"] },
  { id: "36", image: `${IMG_BASE}/Halloween.webp`, name: "Halloween", subCategory: "HalloweanDecoration", catValue: "hallowean-decoration", imgAlt: "Spooky Halloween decoration with black and orange balloons, pumpkins, and eerie themed props", services: ["festivals-decoration"] },
  { id: "37", image: `${IMG_BASE}/CardParty.webp`, name: "Card Party", subCategory: "CardPartyDecoration", catValue: "card-party-decoration", imgAlt: "Stylish card party decoration with themed balloons, table setups, and fun casino-style props", services: ["festivals-decoration"] },
  { id: "38", image: `${IMG_BASE}/Pooja.webp`, name: "Pooja Decoration", subCategory: "PoojaDecoration", catValue: "pooja-decoration", imgAlt: "Elegant pooja decoration with fresh flowers, marigold garlands, diyas, and a serene traditional setup", services: ["festivals-decoration", "flower-decoration"] },
];

const normalize = (value) => String(value || "").toLowerCase();

const findCategory = (catValue) =>
  decCat.find((c) => normalize(c.catValue) === normalize(catValue));

export const getCategoriesByService = (service) =>
  decCat.filter((c) => c.services?.includes(service));

export const isCategoryInService = (catValue, service) =>
  decCat.some(
    (c) =>
      normalize(c.catValue) === normalize(catValue) &&
      c.services?.includes(service)
  );

export const getCorrectServiceForCategory = (catValue) =>
  findCategory(catValue)?.services?.[0] || null;

export const getServiceFromPath = (path = "") => {
  const segs = String(path)
    .split("?")[0]
    .split("/")
    .filter(Boolean)
    .map((s) => s.toLowerCase());
  return segs.find((s) => SERVICES.includes(s)) || null;
};

export const getServiceForCategory = (catValue, currentService = DEFAULT_SERVICE) => {
  const services = findCategory(catValue)?.services || [];
  return services.includes(currentService) ? currentService : services[0] || currentService;
};