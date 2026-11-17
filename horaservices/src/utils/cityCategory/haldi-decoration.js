import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Haldi decoration in Mumbai is all colour and tradition — the ceremony where the family comes together and the photographs are always the most joyful in the wedding album. Marigold strings, a fresh flower canopy overhead, orange and yellow balloon clusters, a haldi-themed backdrop and traditional props set the mood. A verified decorator sets it up at the venue. Haldi decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Haldi decoration in Bangalore brings the energy of the turmeric ceremony to life. Marigold strings, a fresh flower canopy, yellow and orange balloons, a haldi backdrop and traditional props make the ceremony space look celebratory and photograph beautifully. Haldi decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Haldi decoration in Hyderabad sets up the brightest ceremony of the wedding week. Marigold strings, a flower canopy, orange and yellow balloon clusters and a haldi backdrop create the traditional mood for the turmeric ceremony. Haldi decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Haldi decoration in Delhi sets up the most colourful pre-wedding function with marigold strings, a fresh flower canopy, orange and yellow balloon clusters, a haldi backdrop and traditional ceremony props. The look is traditional, vibrant and photograph-ready. Haldi decoration in Delhi starts at Rs 1,499.",
  noida: "Haldi decoration in Noida covers the turmeric ceremony setup — marigold strings, a flower canopy overhead, orange and yellow balloons and a haldi backdrop. A verified decorator coordinates the gate pass and sets it up at the venue. Haldi decoration in Noida starts at Rs 1,499.",
  gurugram: "Haldi decoration in Gurugram sets up the turmeric ceremony with marigold strings, a fresh flower canopy, orange and yellow balloon clusters and a haldi backdrop. A verified decorator handles the setup at the venue. Haldi decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Haldi decoration in Ghaziabad covers the pre-wedding turmeric ceremony with marigold strings, a flower canopy, orange and yellow balloons and a haldi backdrop. A verified decorator handles the gate pass and the setup. Haldi decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Haldi decoration in Faridabad sets up the turmeric ceremony with marigold strings, a fresh flower canopy, orange and yellow balloon clusters and a haldi backdrop. Haldi decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does haldi decoration include in Mumbai?", answer: "Marigold strings at the entrance and ceiling, a fresh flower canopy overhead, orange and yellow balloon clusters, a haldi-themed backdrop and traditional props like marigold torans. You can add a styled seating area for the bride or groom." },
    { question: "Can you do haldi decoration at home in Mumbai?", answer: "Yes. Home terraces, balconies and living rooms are popular haldi venues. Share the space and we design the setup to fit." },
    { question: "Which areas of Mumbai do you cover for haldi decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does haldi decoration include in Bangalore?", answer: "Marigold strings, a fresh flower canopy, orange and yellow balloons and a haldi backdrop. Traditional and modern looks are both available." },
    { question: "Which areas of Bangalore do you cover for haldi decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does haldi decoration include in Hyderabad?", answer: "Marigold strings, a flower canopy, orange and yellow balloon clusters and a haldi backdrop. The look is traditional and vibrant." },
    { question: "Which areas of Hyderabad do you cover for haldi decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does haldi decoration include in Delhi?", answer: "Marigold strings, a fresh flower canopy, orange and yellow balloon clusters, a haldi backdrop and traditional props." },
    { question: "Which areas of Delhi do you cover for haldi decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does haldi decoration include in Noida?", answer: "Marigold strings, a flower canopy overhead, orange and yellow balloons and a haldi backdrop." },
    { question: "Which areas of Noida do you cover for haldi decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does haldi decoration include in Gurugram?", answer: "Marigold strings, a fresh flower canopy, orange and yellow balloon clusters and a haldi backdrop." },
    { question: "Which areas of Gurugram do you cover for haldi decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does haldi decoration include in Ghaziabad?", answer: "Marigold strings, a flower canopy, orange and yellow balloon clusters and a haldi backdrop." },
    { question: "Which areas of Ghaziabad do you cover for haldi decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does haldi decoration include in Faridabad?", answer: "Marigold strings, a fresh flower canopy, orange and yellow balloon clusters and a haldi backdrop." },
    { question: "Which areas of Faridabad do you cover for haldi decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const haldiDecoration = {
  "haldi-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Haldi Decoration",
    title: `Haldi Decoration in ${cityNames[city]}, Turmeric Ceremony Setups from Rs 1,499 | HORA`,
    metaDescription: `Haldi decoration in ${cityNames[city]} from Rs 1,499. Marigold canopies, orange-yellow balloon clusters and haldi backdrops for pre-wedding turmeric ceremonies.`,
    heading: `Haldi Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Haldi ceremony setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Haldi decoration covers marigold strings at the entrance and ceiling, a fresh flower canopy overhead, orange and yellow balloon clusters, a haldi-themed backdrop and traditional props like torans and marigold garlands.",
      "Share the venue, the number of guests and the look you want — traditional or a modern take on the same colours — and we plan the setup accordingly.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
