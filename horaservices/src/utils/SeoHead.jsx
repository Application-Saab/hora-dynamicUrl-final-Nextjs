import Head from "next/head";
import { getDecorationCatOrganizationSchema } from "../utils/schema";

// ─────────────────────────────────────────────
// SEO DATA — titles & descriptions per catValue
// ─────────────────────────────────────────────
const seoData = {
  "kids-birthday-decoration": {
    title: (location) =>
      location
        ? `Kids Birthday Balloon Decoration in ${location} by Professional Decorators, Starting at ₹1199`
        : "Kids' Birthday Balloon Decoration by Professional Decorators, Starting at ₹1199",
    description: (location) =>
      location
        ? `At Hora in ${location}, 🎉 Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠️, Baby Boss 👔, Barbie 💖, and cars 🚗. Book your perfect party decor today! 🎈✨`
        : "At Hora, 🎉 Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠️, Baby Boss 👔, Barbie 💖, and cars 🚗. Book your perfect party decor today! 🎈✨",
  },
  "birthday-decoration": {
    title: (location) =>
      location
        ? `Birthday Balloon Decoration in ${location} at Home by Professional Decorators, Starting at ₹1199`
        : "Birthday Balloon Decoration at Home by Professional Decorators, Starting at ₹1199",
    description: (location) =>
      location
        ? `Celebrate birthdays in ${location} with balloon & flower decorations by professional decorators. Customize your party and make it unforgettable! 🎉`
        : "Celebrate birthdays with balloon & flower decorations by professional decorators. Customize your party and make it unforgettable! 🎉",
  },
  "anniversary-decoration": {
    title: (location) =>
      location
        ? `Anniversary Decorations in ${location} with Balloon & Rose Petals, Starting at ₹1199`
        : "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199",
    description: (location) =>
      location
        ? `Make your anniversary in ${location} magical with elegant balloon & rose petal decorations. Book directly online! 💖`
        : "Make your anniversary magical with elegant balloon & rose petal decorations. Book directly online! 💖",
  },
  "first-night-decoration": {
    title: (location) =>
      location
        ? `First Night Decorations in ${location} with Balloon & Rose Petals, Starting at ₹1199`
        : "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199",
    description: (location) =>
      location
        ? `Make your first night in ${location} special with beautiful balloon & rose petal decorations. Book online today! 💕`
        : "Make your first night special with beautiful balloon & rose petal decorations. Book online today! 💕",
  },
  "baby-shower-decoration": {
    title: (location) =>
      location
        ? `Baby Shower in ${location} with Latest Designs by Professional Decorators, Starting at ₹1199`
        : "Baby Shower with Latest Designs by Professional Decorators, Starting at ₹1199",
    description: (location) =>
      location
        ? `Plan the perfect baby shower in ${location} with stunning balloon & floral decorations by professional decorators. Book now! 🍼`
        : "Plan the perfect baby shower with stunning balloon & floral decorations by professional decorators. Book now! 🍼",
  },
  "welcome-baby-decoration": {
    title: (location) =>
      location
        ? `Baby Welcome Decoration in ${location} at Home by Professional Decorators, Starting at ₹1199`
        : "Baby Welcome Decoration at Home by Professional Decorators, Starting at ₹1199",
    description: (location) =>
      location
        ? `Welcome your little one in ${location} with beautiful home decorations by professional decorators. Book today! 👶`
        : "Welcome your little one with beautiful home decorations by professional decorators. Book today! 👶",
  },
  "haldi-mehendi-decoration": {
    title: (location) =>
      location
        ? `Haldi Decoration in ${location} with Latest Designs, Starting at ₹3000`
        : "Haldi Decoration with Latest Designs, Starting at ₹3000",
    description: (location) =>
      location
        ? `Brighten up your Haldi ceremony in ${location} with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups.`
        : "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups.",
  },
  "naming-ceremony-decoration": {
    title: (location) =>
      location
        ? `Naming Ceremony Decoration in ${location} with Latest Designs, Starting at ₹3000`
        : "Naming Ceremony Decoration with Latest Designs, Starting at ₹3000",
    description: (location) =>
      location
        ? `Celebrate your baby's naming ceremony in ${location} with beautiful & customized decorations. Book HORA today! 🎀`
        : "Celebrate your baby's naming ceremony with beautiful & customized decorations. Book HORA today! 🎀",
  },
  "Nation-Pride-decoration": {
    title: (location) =>
      location
        ? `Nation Pride Decoration in ${location} with Latest Designs, Starting at ₹3000`
        : "Nation Pride Decoration with Latest Designs, Starting at ₹3000",
    description: (location) =>
      location
        ? `Celebrate national pride in ${location} with patriotic balloon & flag decorations. Book HORA today! 🇮🇳`
        : "Celebrate national pride with patriotic balloon & flag decorations. Book HORA today! 🇮🇳",
  },
  "house-warming-decoration": {
    title: (location) =>
      location
        ? `House Warming Decoration in ${location} with Elegant Balloon & Flower Decor, Starting at ₹1999`
        : "House Warming Decoration with Elegant Balloon & Flower Decor, Starting at ₹1999",
    description: (location) =>
      location
        ? `Celebrate your new home in ${location} with elegant balloon & flower decorations. Book HORA today! 🏠✨`
        : "Celebrate your new home with elegant balloon & flower decorations. Book HORA today! 🏠✨",
  },
  "premium-decoration": {
    title: (location) =>
      location
        ? `Stage Decoration in ${location} with Premium Balloon & Flower Designs, Starting at ₹3000`
        : "Stage Decoration with Premium Balloon & Flower Designs, Starting at ₹3000",
    description: (location) =>
      location
        ? `Get premium stage decoration in ${location} with stunning balloon & floral designs for any occasion. Book HORA! 🌸`
        : "Get premium stage decoration with stunning balloon & floral designs for any occasion. Book HORA! 🌸",
  },
  Wedding: {
    title: (location) =>
      location
        ? `Wedding Decoration in ${location} with Stunning Balloon & Floral Designs, Starting at ₹4999`
        : "Wedding Decoration with Stunning Balloon & Floral Designs, Starting at ₹4999",
    description: (location) =>
      location
        ? `Make your wedding in ${location} unforgettable with stunning balloon & floral decorations. Book HORA today! 💍`
        : "Make your wedding unforgettable with stunning balloon & floral decorations. Book HORA today! 💍",
  },
  "bachelorette-decoration": {
    title: (location) =>
      location
        ? `Bachelorette Party Decoration in ${location} with Trendy Balloon & Theme Decor, Starting at ₹1999`
        : "Bachelorette Party Decoration with Trendy Balloon & Theme Decor, Starting at ₹1999",
    description: (location) =>
      location
        ? `Throw the ultimate bachelorette party in ${location} with trendy balloon & theme decorations. Book HORA! 🥂`
        : "Throw the ultimate bachelorette party with trendy balloon & theme decorations. Book HORA! 🥂",
  },
  "coorporate-showrooms-decoration": {
    title: (location) =>
      location
        ? `Corporate Showroom Decoration in ${location} for Product Launches & Brand Promotions, Starting at ₹3999`
        : "Corporate Showroom Decoration for Product Launches & Brand Promotions, Starting at ₹3999",
    description: (location) =>
      location
        ? `Transform your corporate showroom in ${location} with professional decoration for product launches, exhibitions & brand promotions. Book HORA today! 🏢✨`
        : "Transform your corporate showroom with professional decoration for product launches, exhibitions & brand promotions. Book HORA today! 🏢✨",
  },
  "car-decoration": {
    title: (location) =>
      location
        ? `Car Decoration in ${location} for Weddings, Engagements & Special Occasions, Starting at ₹999`
        : "Car Decoration for Weddings, Engagements & Special Occasions, Starting at ₹999",
    description: (location) =>
      location
        ? `Make your special moments memorable with beautiful car decoration in ${location} for weddings, engagements & anniversaries. Book HORA! 🚗🎊`
        : "Make your special moments memorable with beautiful car decoration for weddings, engagements & anniversaries. Book HORA! 🚗🎊",
  },
  "Pet-Animals-Decoration": {
    title: (location) =>
      location
        ? `Pet Animal Decoration in ${location} for Pet Birthdays, Adoption Celebrations & Parties, Starting at ₹999`
        : "Pet Animal Decoration for Pet Birthdays, Adoption Celebrations & Parties, Starting at ₹999",
    description: (location) =>
      location
        ? `Celebrate your furry friend in ${location} with creative pet decoration for birthdays, adoption parties & special occasions. Book HORA! 🐾🎉`
        : "Celebrate your furry friend with creative pet decoration for birthdays, adoption parties & special occasions. Book HORA! 🐾🎉",
  },
  "festivals-decoration": {
    title: (location) =>
      location
        ? `Festival Decoration in ${location} for Diwali, Holi, Christmas, New Year & More, Starting at ₹1499`
        : "Festival Decoration for Diwali, Holi, Christmas, New Year & More, Starting at ₹1499",
    description: (location) =>
      location
        ? `Light up your festivals in ${location} with stunning decoration for Diwali, Holi, Christmas, New Year & Navratri. Book HORA! 🪔🎊`
        : "Light up your festivals with stunning decoration for Diwali, Holi, Christmas, New Year & Navratri. Book HORA! 🪔🎊",
  },
  "engagement-decoration": {
    title: (location) =>
      location
        ? `Engagement Decoration in ${location} with Stage, Ring Ceremony & Couple Themes, Starting at ₹1999`
        : "Engagement Decoration with Stage, Ring Ceremony & Couple Themes, Starting at ₹1999",
    description: (location) =>
      location
        ? `Engagement Decoration in ${location} | Romantic Stage Setup, Couple Theme & Ring Ceremony Decor ✨ Book HORA for dreamy celebrations 💍🎊`
        : "Engagement Decoration | Romantic Stage Setup, Couple Theme & Ring Ceremony Decor ✨ Book HORA for dreamy celebrations 💍🎊",
  },
};

// ─────────────────────────────────────────────
// HELPER — build location string
// ─────────────────────────────────────────────
const getLocation = (city, locality) => {
  if (locality && city) return `${locality}, ${city}`;
  if (city) return city;
  return null;
};

// ─────────────────────────────────────────────
// HELPER — get title
// ─────────────────────────────────────────────
export const getPageTitle = (catValue, city, locality, theme) => {
  const location = getLocation(city, locality);
  const normalizedKey = Object.keys(seoData).find(
    (key) => key.toLowerCase() === (catValue || "").toLowerCase()
  );

  const baseTitle = normalizedKey
    ? seoData[normalizedKey].title(location)
    : location
    ? `Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings in ${location} – Starting at ₹1199`
    : "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";

  return theme ? `HORA Decorations - <${theme}> - ${baseTitle}` : baseTitle;
};

// ─────────────────────────────────────────────
// HELPER — get description
// ─────────────────────────────────────────────
export const getPageMetaDescription = (catValue, city, locality) => {
  const location = getLocation(city, locality);
  const normalizedKey = Object.keys(seoData).find(
    (key) => key.toLowerCase() === (catValue || "").toLowerCase()
  );

  return normalizedKey
    ? seoData[normalizedKey].description(location)
    : location
    ? `Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings in ${location} – Starting at ₹1199`
    : "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const SeoHead = ({ catValue, city, locality, theme }) => {
  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);

  const title = getPageTitle(catValue, city, locality, theme);
  const description = getPageMetaDescription(catValue, city, locality);

  const ogUrl =
    locality && city
      ? `https://horaservices.com/${city}/${locality}/balloon-decoration/${catValue}`
      : city
      ? `https://horaservices.com/${city}/balloon-decoration/${catValue}`
      : `https://horaservices.com/balloon-decoration/${catValue}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Balloon and Flower Decoration @999" />
      <meta property="og:title" content={getPageTitle(catValue, city, locality)} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
      />
      <script type="application/ld+json">{scriptTag}</script>
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />
      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
        type="image/x-icon"
      />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />
    </Head>
  );
};

export default SeoHead;
