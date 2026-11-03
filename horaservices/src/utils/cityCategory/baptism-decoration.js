import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Baptism decoration in Mumbai marks the baby's christening with a setup that is reverent and celebratory at the same time. A soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers — roses, lilies or carnations — set the mood for the occasion. A verified decorator sets it up at the church hall or the venue of the reception. Baptism decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Baptism decoration in Bangalore sets up the christening with a soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers. The look is clean, celebratory and appropriate for the occasion. Baptism decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Baptism decoration in Hyderabad marks the christening with a soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers. A verified decorator sets it up at the church hall or venue. Baptism decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Baptism decoration in Delhi sets up the baby's christening with a soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers. The look is reverent and celebratory. Baptism decoration in Delhi starts at Rs 1,499.",
  noida: "Baptism decoration in Noida covers the christening setup — a soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers. A verified decorator coordinates the venue access and sets it up. Baptism decoration in Noida starts at Rs 1,499.",
  gurugram: "Baptism decoration in Gurugram sets up the christening with a soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers. Baptism decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Baptism decoration in Ghaziabad marks the christening with a soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers. A verified decorator handles the venue access and setup. Baptism decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Baptism decoration in Faridabad covers the christening setup with a soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers. Baptism decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does baptism decoration include in Mumbai?", answer: "A soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers — roses, lilies or carnations. A personalised welcome board with the baby's name and baptism date can be added." },
    { question: "Can you set up baptism decoration at a church hall in Mumbai?", answer: "Yes. Church halls and home receptions are both common baptism venues. Share the venue, the setup window and the look you want and we plan accordingly." },
    { question: "Which areas of Mumbai do you cover for baptism decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does baptism decoration include in Bangalore?", answer: "A soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers. A personalised welcome board can be added." },
    { question: "Which areas of Bangalore do you cover for baptism decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does baptism decoration include in Hyderabad?", answer: "A soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers. The look is reverent and celebratory." },
    { question: "Which areas of Hyderabad do you cover for baptism decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does baptism decoration include in Delhi?", answer: "A soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers. A personalised welcome board can be added." },
    { question: "Which areas of Delhi do you cover for baptism decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does baptism decoration include in Noida?", answer: "A soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers." },
    { question: "Which areas of Noida do you cover for baptism decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does baptism decoration include in Gurugram?", answer: "A soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers." },
    { question: "Which areas of Gurugram do you cover for baptism decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does baptism decoration include in Ghaziabad?", answer: "A soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers." },
    { question: "Which areas of Ghaziabad do you cover for baptism decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does baptism decoration include in Faridabad?", answer: "A soft white and gold backdrop, white balloon clusters, candle arrangements and fresh white flowers." },
    { question: "Which areas of Faridabad do you cover for baptism decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const baptismDecoration = {
  "baptism-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Baptism Decoration",
    title: `Baptism Decoration in ${cityNames[city]}, Christening Setups from Rs 1,499 | HORA`,
    metaDescription: `Baptism decoration in ${cityNames[city]} from Rs 1,499. White and gold backdrops, balloon clusters and candle arrangements for christening ceremonies.`,
    heading: `Baptism Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Baptism and christening setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Baptism decoration covers a soft white and gold backdrop with a cross motif, white balloon clusters, candle arrangements and fresh white flowers — roses, lilies or carnations. A personalised welcome board with the baby's name and baptism date can be added.",
      "Share the venue (church hall or home), the ceremony date and the reception timeline when you book. We plan the setup around the venue and the occasion.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
