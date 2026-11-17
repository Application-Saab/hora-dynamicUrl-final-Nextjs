import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Mehendi decoration in Mumbai sets up the pre-wedding function that the bridesmaids look forward to most. A soft floral backdrop, fairy lights, boho cushion seating on the floor, a styled mehendi table with tea lights and fresh flowers, and a Welcome Bride-To-Be sign. The look is warm, romantic and designed for photographs. A verified decorator sets it up at the venue. Mehendi decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Mehendi decoration in Bangalore creates the perfect pre-wedding setting for the bride and her squad. A soft floral backdrop, fairy lights, boho floor cushion seating, a styled mehendi table with tea lights and flowers. The look is relaxed, romantic and photograph-ready. Mehendi decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Mehendi decoration in Hyderabad sets up the pre-wedding celebration with a soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table. The look is warm and romantic, designed for the photographs that the wedding album remembers. Mehendi decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Mehendi decoration in Delhi covers the most photographed pre-wedding function. A soft floral backdrop, fairy lights, boho floor cushion seating, a styled mehendi table and a welcome sign set the mood for the bride and her squad. Mehendi decoration in Delhi starts at Rs 1,499.",
  noida: "Mehendi decoration in Noida sets up the pre-wedding celebration with a soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table. A verified decorator coordinates the gate pass and sets it up at the venue. Mehendi decoration in Noida starts at Rs 1,499.",
  gurugram: "Mehendi decoration in Gurugram sets up the pre-wedding function with a soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table with tea lights. The look is romantic and photograph-ready. Mehendi decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Mehendi decoration in Ghaziabad covers the pre-wedding celebration with a soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table. A verified decorator handles the gate pass and setup. Mehendi decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Mehendi decoration in Faridabad sets up the pre-wedding function with a soft floral backdrop, fairy lights, boho floor cushion seating and a styled mehendi table. Mehendi decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does mehendi decoration include in Mumbai?", answer: "A soft floral backdrop (pastel flowers or a boho design), fairy lights, floor cushion seating for the bride and bridesmaids, a styled mehendi table with tea lights and fresh flowers, and a Welcome Bride-To-Be sign." },
    { question: "Can you do mehendi decoration at a home in Mumbai?", answer: "Yes. Home setups are our most common mehendi venue — a living room, a terrace or a balcony can be transformed into a beautiful mehendi space. Share the space dimensions and we design accordingly." },
    { question: "Which areas of Mumbai do you cover for mehendi decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does mehendi decoration include in Bangalore?", answer: "A soft floral backdrop, fairy lights, boho floor cushion seating, a styled mehendi table with tea lights and fresh flowers." },
    { question: "Which areas of Bangalore do you cover for mehendi decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does mehendi decoration include in Hyderabad?", answer: "A soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table with tea lights and flowers." },
    { question: "Which areas of Hyderabad do you cover for mehendi decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does mehendi decoration include in Delhi?", answer: "A soft floral backdrop, fairy lights, boho floor cushion seating, a styled mehendi table and a Welcome Bride-To-Be sign." },
    { question: "Which areas of Delhi do you cover for mehendi decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does mehendi decoration include in Noida?", answer: "A soft floral backdrop, fairy lights, boho floor cushion seating and a styled mehendi table with tea lights and flowers." },
    { question: "Which areas of Noida do you cover for mehendi decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does mehendi decoration include in Gurugram?", answer: "A soft floral backdrop, fairy lights, boho floor cushion seating, a styled mehendi table with tea lights and flowers." },
    { question: "Which areas of Gurugram do you cover for mehendi decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does mehendi decoration include in Ghaziabad?", answer: "A soft floral backdrop, fairy lights, boho cushion seating and a styled mehendi table with tea lights and flowers." },
    { question: "Which areas of Ghaziabad do you cover for mehendi decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does mehendi decoration include in Faridabad?", answer: "A soft floral backdrop, fairy lights, boho floor cushion seating and a styled mehendi table with tea lights and flowers." },
    { question: "Which areas of Faridabad do you cover for mehendi decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const mehendiDecoration = {
  "mehendi-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Mehendi Decoration",
    title: `Mehendi Decoration in ${cityNames[city]}, Boho Floral Setups from Rs 1,499 | HORA`,
    metaDescription: `Mehendi decoration in ${cityNames[city]} from Rs 1,499. Soft floral backdrops, boho cushion seating and fairy lights for pre-wedding mehendi functions.`,
    heading: `Mehendi Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Mehendi function setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Mehendi decoration includes a soft floral backdrop (pastel flowers or a boho design), fairy lights, floor cushion seating for the bride and her squad, a styled mehendi table with tea lights and fresh flowers, and a Welcome Bride-To-Be sign. The look is warm, romantic and designed for photographs.",
      "Share the venue, the expected number of guests at the function and any reference photos for the look you want. We design the setup around the space and the brief.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
