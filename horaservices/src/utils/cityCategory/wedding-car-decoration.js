import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Wedding car decoration in Mumbai is for the bridal car and groom's car — fresh flowers garlands at the front, hood and back, ribbons along the sides, a personalised just-married or name signboard, and balloon clusters. Premium full-floral car decoration with roses and exotic flowers is also available for luxury vehicles. A verified decorator sets up at the venue. Wedding car decoration in Mumbai starts at Rs 999.",
  bangalore: "Wedding car decoration in Bangalore covers the bridal and groom's car — fresh flower garlands, ribbons, a just-married signboard and balloon clusters. Premium full-floral decoration for luxury vehicles is also available. A verified decorator sets up at the wedding venue. Wedding car decoration in Bangalore starts at Rs 999.",
  hyderabad: "Wedding car decoration in Hyderabad covers the bridal and groom's car — fresh flower garlands, ribbons and a personalised just-married or name signboard. Premium full-floral decoration is available for luxury vehicles. A verified decorator sets up at the wedding venue. Wedding car decoration in Hyderabad starts at Rs 999.",
  delhi: "Wedding car decoration in Delhi is for the bridal and groom's cars — fresh flower garlands, ribbons, a personalised signboard and balloon clusters. Premium full-floral decoration with roses and exotic flowers is available for luxury vehicles. A verified decorator sets up at the venue. Wedding car decoration in Delhi starts at Rs 999.",
  noida: "Wedding car decoration in Noida covers the bridal and groom's car — fresh flower garlands, ribbons and a personalised just-married signboard. A verified decorator coordinates the gate pass and sets up at the wedding venue. Wedding car decoration in Noida starts at Rs 999.",
  gurugram: "Wedding car decoration in Gurugram covers the bridal and groom's car — fresh flower garlands, ribbons and a personalised just-married signboard. Premium full-floral decoration for luxury vehicles is also available. A verified decorator sets up at the wedding venue. Wedding car decoration in Gurugram starts at Rs 999.",
  ghaziabad: "Wedding car decoration in Ghaziabad covers the bridal and groom's car — fresh flower garlands, ribbons and a personalised just-married signboard. A verified decorator sets up at the wedding venue. Wedding car decoration in Ghaziabad starts at Rs 999.",
  faridabad: "Wedding car decoration in Faridabad covers the bridal and groom's car — fresh flower garlands, ribbons and a personalised just-married signboard. A verified decorator sets up at the wedding venue. Wedding car decoration in Faridabad starts at Rs 999.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does wedding car decoration include in Mumbai?", answer: "Fresh flower garlands at the front, hood and back, ribbons along the sides, a personalised just-married or couple name signboard and balloon clusters. Roses, marigolds or a custom flower mix." },
    { question: "Can you do full-floral decoration for a luxury wedding car in Mumbai?", answer: "Yes. Full-floral decoration with roses, orchids or exotic flowers is available for luxury vehicles. Mention the car model and the look you want when you book." },
    { question: "Which areas of Mumbai do you cover for wedding car decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does wedding car decoration include in Bangalore?", answer: "Fresh flower garlands, ribbons, a personalised signboard and balloon clusters. You can choose roses, marigolds or a custom flower mix." },
    { question: "Which areas of Bangalore do you cover for wedding car decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does wedding car decoration include in Hyderabad?", answer: "Fresh flower garlands, ribbons and a personalised just-married or couple name signboard. Flower type and colour can be specified." },
    { question: "Which areas of Hyderabad do you cover for wedding car decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does wedding car decoration include in Delhi?", answer: "Fresh flower garlands, ribbons, a personalised signboard and balloon clusters. Premium full-floral decoration for luxury vehicles is also available." },
    { question: "Which areas of Delhi do you cover for wedding car decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does wedding car decoration include in Noida?", answer: "Fresh flower garlands, ribbons and a personalised just-married or couple name signboard. Flower type and colour can be specified when you book." },
    { question: "Which areas of Noida do you cover for wedding car decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does wedding car decoration include in Gurugram?", answer: "Fresh flower garlands, ribbons and a personalised signboard. Premium full-floral decoration for luxury vehicles is also available." },
    { question: "Which areas of Gurugram do you cover for wedding car decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does wedding car decoration include in Ghaziabad?", answer: "Fresh flower garlands, ribbons and a personalised just-married signboard. Flower type and colour can be specified." },
    { question: "Which areas of Ghaziabad do you cover for wedding car decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does wedding car decoration include in Faridabad?", answer: "Fresh flower garlands, ribbons and a personalised just-married or couple name signboard. Flower type and colour can be specified." },
    { question: "Which areas of Faridabad do you cover for wedding car decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const weddingCarDecoration = {
  "wedding-car-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Wedding Car Decoration",
    title: `Wedding Car Decoration in ${cityNames[city]}, Bridal Car Setups from Rs 999 | HORA`,
    metaDescription: `Wedding car decoration in ${cityNames[city]} from Rs 999. Fresh flower garlands, ribbons and personalised signboards for bridal and groom cars.`,
    heading: `Wedding Car Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Wedding car setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Wedding car decoration covers fresh flower garlands at the front and back, ribbons along the sides, a personalised just-married or couple name signboard and balloon clusters. Roses, marigolds or a custom flower mix are available.",
      "Premium full-floral car decoration with roses and exotic flowers is available for luxury vehicles. Share the car model, the venue and the setup time and we handle the rest.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
