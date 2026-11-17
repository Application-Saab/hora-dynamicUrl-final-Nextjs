import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Haldi and mehendi decoration in Mumbai sets the pre-wedding mood with marigold strings, fresh flower canopies, yellow and orange balloon clusters, knotted fabric backdrops and traditional props. The mehendi setup is styled differently — soft floral backdrops, fairy lights, boho cushions and tea-light arrangements. A verified decorator sets up for both functions. Haldi and mehendi decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Haldi and mehendi decoration in Bangalore brings the pre-wedding celebrations to life. Marigold strings, a yellow-and-orange flower canopy, fresh flowers and traditional props for the haldi; soft florals, fairy lights and a boho-style backdrop for the mehendi. A verified decorator sets it up at the venue. Haldi and mehendi decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Haldi and mehendi decoration in Hyderabad sets up the pre-wedding functions with colour and tradition. Marigold strings, orange and yellow balloons and a fresh flower canopy for the haldi; a soft floral backdrop, fairy lights and cushion setups for the mehendi. A verified decorator sets it up at your venue. Decoration starts at Rs 1,499.",
  delhi: "Haldi and mehendi decoration in Delhi covers the two most colourful pre-wedding functions. Marigold strings, yellow-and-orange balloon clusters and a fresh flower canopy for the haldi; soft florals, boho cushion seating and fairy lights for the mehendi. A verified decorator sets it up at your venue. Decoration starts at Rs 1,499.",
  noida: "Haldi and mehendi decoration in Noida sets up the pre-wedding celebrations with colour and tradition. Marigold strings and flower canopies for the haldi; soft florals, fairy lights and boho styling for the mehendi. A verified decorator coordinates the gate pass and sets it up at your venue. Decoration starts at Rs 1,499.",
  gurugram: "Haldi and mehendi decoration in Gurugram brings the pre-wedding mood to farmhouses, hotel banquets and home lawns. Marigold strings, flower canopies and yellow-orange balloon arches for the haldi; soft floral backdrops, fairy lights and cushion seating for the mehendi. Decoration starts at Rs 1,499.",
  ghaziabad: "Haldi and mehendi decoration in Ghaziabad covers the two most vibrant pre-wedding functions. Marigold strings, flower canopies and orange-yellow balloons for the haldi; soft florals, fairy lights and boho styling for the mehendi. A verified decorator handles the setup. Decoration starts at Rs 1,499.",
  faridabad: "Haldi and mehendi decoration in Faridabad sets up the pre-wedding celebrations with colour and tradition. Marigold strings, flower canopies and orange-yellow balloon clusters for the haldi; soft florals, fairy lights and boho styling for the mehendi. Decoration starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does haldi decoration include in Mumbai?", answer: "Marigold strings, a fresh flower canopy overhead, orange and yellow balloon clusters, a haldi-themed backdrop and traditional props. The setup creates the classic turmeric-ceremony mood." },
    { question: "What does mehendi decoration include in Mumbai?", answer: "A soft floral backdrop, fairy lights, boho cushion seating, tea-light arrangements and a styled mehendi table. The look is romantic and relaxed, perfect for photography." },
    { question: "Which areas of Mumbai do you cover for haldi and mehendi decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does haldi decoration include in Bangalore?", answer: "Marigold strings, a yellow-and-orange flower canopy, balloon clusters and traditional haldi props. The setup frames the ceremony beautifully." },
    { question: "What does mehendi decoration include in Bangalore?", answer: "A soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table. The look is warm and romantic." },
    { question: "Which areas of Bangalore do you cover for haldi and mehendi decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does haldi decoration include in Hyderabad?", answer: "Marigold strings, a flower canopy, orange and yellow balloons and a haldi-themed backdrop. The setup creates the classic pre-wedding celebration mood." },
    { question: "Which areas of Hyderabad do you cover for haldi and mehendi decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does haldi decoration include in Delhi?", answer: "Marigold strings, a fresh flower canopy, orange and yellow balloon clusters and a haldi-themed backdrop." },
    { question: "What does mehendi decoration include in Delhi?", answer: "A soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table. Warm, romantic and photograph-ready." },
    { question: "Which areas of Delhi do you cover for haldi and mehendi decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does haldi and mehendi decoration include in Noida?", answer: "Haldi: marigold strings, flower canopy, orange-yellow balloons and a backdrop. Mehendi: soft florals, fairy lights, cushion seating and a styled table. Both can be done at the same venue on different days." },
    { question: "Which areas of Noida do you cover for haldi and mehendi decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does haldi decoration include in Gurugram?", answer: "Marigold strings, a flower canopy, orange-yellow balloon arches and a backdrop. The setup frames the ceremony and photographs beautifully." },
    { question: "Which areas of Gurugram do you cover for haldi and mehendi decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does haldi and mehendi decoration include in Ghaziabad?", answer: "Haldi: marigold strings, flower canopy, orange-yellow balloons and a backdrop. Mehendi: soft florals, fairy lights, cushion seating and a styled table." },
    { question: "Which areas of Ghaziabad do you cover for haldi and mehendi decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does haldi and mehendi decoration include in Faridabad?", answer: "Haldi: marigold strings, flower canopy, orange-yellow balloons and a themed backdrop. Mehendi: soft florals, fairy lights, boho cushion seating and a styled mehendi table." },
    { question: "Which areas of Faridabad do you cover for haldi and mehendi decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const haldiMehendiDecoration = {
  "haldi-mehendi-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Haldi & Mehendi Decoration",
    title: `Haldi Mehendi Decoration in ${cityNames[city]}, Pre-Wedding Setups from Rs 1,499 | HORA`,
    metaDescription: `Haldi and mehendi decoration in ${cityNames[city]} from Rs 1,499. Marigold canopies and floral backdrops for pre-wedding functions.`,
    heading: `Haldi & Mehendi Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Haldi and mehendi setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Haldi decoration focuses on bright colour and tradition: marigold strings, a flower canopy overhead, orange and yellow balloon clusters and a themed backdrop. Mehendi decoration goes in a different direction — soft florals, fairy lights, boho cushion seating and tea lights.",
      "We can set up both functions at the same venue on different days, or at different locations. Share the dates, venues and brief and we plan both setups around your wedding timeline.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
