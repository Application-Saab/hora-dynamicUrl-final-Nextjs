import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Annaprashan decoration in Mumbai sets up the baby's first solid food ceremony with the warmth and care the occasion deserves. A personalised backdrop with the baby's name, soft flower arrangements, balloon clusters in gentle colours, marigold strings and a styled highchair or ceremony space make the occasion feel as significant as it is. A verified decorator sets it up in about an hour. Annaprashan decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Annaprashan decoration in Bangalore marks the baby's rice-eating ceremony with a personalised backdrop, soft balloon clusters, flower arrangements and marigold strings. The setup is gentle and celebratory without being overwhelming. A verified decorator sets it up in about an hour. Annaprashan decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Annaprashan decoration in Hyderabad sets up the rice-eating ceremony for large family gatherings. A personalised backdrop with the baby's name, marigold strings, flower arrangements and soft balloon clusters make the occasion feel festive and traditional. Annaprashan decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Annaprashan decoration in Delhi covers the baby's first food ceremony with a personalised backdrop, marigold strings, flower arrangements and soft balloon clusters. The setup is traditional and celebratory for the family gathering. Annaprashan decoration in Delhi starts at Rs 1,499.",
  noida: "Annaprashan decoration in Noida sets up the baby's rice-eating ceremony with a personalised backdrop, marigold strings, flower arrangements and soft balloon clusters. A verified decorator coordinates the gate pass and sets it up at the venue. Annaprashan decoration in Noida starts at Rs 1,499.",
  gurugram: "Annaprashan decoration in Gurugram marks the baby's first food ceremony with a personalised backdrop, marigold strings, flower arrangements and soft balloon clusters in a society flat or community hall. Annaprashan decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Annaprashan decoration in Ghaziabad sets up the baby's rice-eating ceremony with a personalised backdrop, marigold strings, flower arrangements and soft balloon clusters. A verified decorator handles the gate pass and the setup. Annaprashan decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Annaprashan decoration in Faridabad covers the baby's first food ceremony with a personalised backdrop, marigold strings, flower arrangements and soft balloon clusters. Annaprashan decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does annaprashan decoration include in Mumbai?", answer: "A personalised backdrop with the baby's name, marigold strings, flower arrangements, soft balloon clusters in gentle colours and a styled ceremony space or highchair area. Traditional and modern looks are both available." },
    { question: "Do you decorate for annaprashan at home in Mumbai?", answer: "Yes. Home setups in flats and society community rooms are the most common annaprashan venues. Share the space and the ceremony timeline and we design accordingly." },
    { question: "Which areas of Mumbai do you cover for annaprashan decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does annaprashan decoration include in Bangalore?", answer: "A personalised backdrop with the baby's name, soft balloon clusters, flower arrangements and marigold strings. Traditional and modern looks are available." },
    { question: "Which areas of Bangalore do you cover for annaprashan decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does annaprashan decoration include in Hyderabad?", answer: "A personalised backdrop with the baby's name, marigold strings, flower arrangements and soft balloon clusters. For large family gatherings, we scale the setup to match." },
    { question: "Which areas of Hyderabad do you cover for annaprashan decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does annaprashan decoration include in Delhi?", answer: "A personalised backdrop with the baby's name, marigold strings, flower arrangements and soft balloon clusters. Traditional or modern look available." },
    { question: "Which areas of Delhi do you cover for annaprashan decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does annaprashan decoration include in Noida?", answer: "A personalised backdrop with the baby's name, marigold strings, flower arrangements and soft balloon clusters." },
    { question: "Which areas of Noida do you cover for annaprashan decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does annaprashan decoration include in Gurugram?", answer: "A personalised backdrop with the baby's name, marigold strings, flower arrangements and soft balloon clusters." },
    { question: "Which areas of Gurugram do you cover for annaprashan decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does annaprashan decoration include in Ghaziabad?", answer: "A personalised backdrop with the baby's name, marigold strings, flower arrangements and soft balloon clusters." },
    { question: "Which areas of Ghaziabad do you cover for annaprashan decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does annaprashan decoration include in Faridabad?", answer: "A personalised backdrop with the baby's name, marigold strings, flower arrangements and soft balloon clusters." },
    { question: "Which areas of Faridabad do you cover for annaprashan decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const annaprashanDecoration = {
  "annaprashan-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Annaprashan Decoration",
    title: `Annaprashan Decoration in ${cityNames[city]}, Rice Eating Ceremony Setups from Rs 1,499 | HORA`,
    metaDescription: `Annaprashan decoration in ${cityNames[city]} from Rs 1,499. Personalised backdrops, marigold strings and soft balloon setups for the baby's first food ceremony.`,
    heading: `Annaprashan Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Annaprashan ceremony setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Annaprashan decoration covers a personalised backdrop with the baby's name, marigold strings, soft flower arrangements, gentle balloon clusters and a styled ceremony space. The look can be traditional with marigolds and flowers or a modern take with soft pastels.",
      "Share the ceremony date, the venue and the baby's name when you book. We design the setup around the occasion and the space.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
