import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Name reveal decoration in Mumbai is for the moment the baby's name is announced to the family for the first time. A personalised backdrop styled with a Question Mark or We Have a Name board, balloon clusters, flowers and fairy lights — and then the big reveal. A verified decorator sets it up in about an hour. Name reveal decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Name reveal decoration in Bangalore sets up the baby's name announcement moment with a personalised backdrop, balloon clusters, flowers and fairy lights. The reveal element can be a confetti balloon pop, a drape pull or a board flip. A verified decorator sets it up at the venue. Name reveal decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Name reveal decoration in Hyderabad marks the baby's name announcement with a personalised backdrop, balloon clusters and fairy lights. The reveal element can be customised — a balloon pop, a drape pull or a board flip. Name reveal decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Name reveal decoration in Delhi sets up the baby's name announcement with a personalised backdrop, balloon clusters, flowers and fairy lights. The reveal element is customised to your preference. Name reveal decoration in Delhi starts at Rs 1,499.",
  noida: "Name reveal decoration in Noida marks the baby's name announcement with a personalised backdrop, balloon clusters and fairy lights. A verified decorator coordinates the gate pass and sets it up at the venue. Name reveal decoration in Noida starts at Rs 1,499.",
  gurugram: "Name reveal decoration in Gurugram sets up the baby's name announcement with a personalised backdrop, balloon clusters and fairy lights. The reveal element is customised to your preference. Name reveal decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Name reveal decoration in Ghaziabad marks the baby's name announcement with a personalised backdrop, balloon clusters and fairy lights. A verified decorator handles the gate pass and the setup. Name reveal decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Name reveal decoration in Faridabad sets up the baby's name announcement with a personalised backdrop, balloon clusters and fairy lights. Name reveal decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does name reveal decoration include in Mumbai?", answer: "A personalised backdrop (We Have a Name or a styled Question Mark board), balloon clusters in the chosen colour palette, flowers and fairy lights. The reveal moment can be a balloon pop, a drape pull or a board flip." },
    { question: "Can you customise the reveal element for a name reveal in Mumbai?", answer: "Yes. A confetti balloon pop, a drape pull to reveal the name board, or a flip reveal are all available. Tell us the reveal style you want when you book." },
    { question: "Which areas of Mumbai do you cover for name reveal decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does name reveal decoration include in Bangalore?", answer: "A personalised backdrop, balloon clusters, flowers and fairy lights. The reveal element can be a balloon pop, a drape pull or a board flip." },
    { question: "Which areas of Bangalore do you cover for name reveal decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does name reveal decoration include in Hyderabad?", answer: "A personalised backdrop, balloon clusters and fairy lights. The reveal element is customised to your preference." },
    { question: "Which areas of Hyderabad do you cover for name reveal decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does name reveal decoration include in Delhi?", answer: "A personalised backdrop, balloon clusters, flowers and fairy lights. The reveal element can be customised." },
    { question: "Which areas of Delhi do you cover for name reveal decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does name reveal decoration include in Noida?", answer: "A personalised backdrop, balloon clusters and fairy lights. The reveal element is customised to your preference." },
    { question: "Which areas of Noida do you cover for name reveal decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does name reveal decoration include in Gurugram?", answer: "A personalised backdrop, balloon clusters and fairy lights. The reveal element can be a balloon pop, a drape pull or a board flip." },
    { question: "Which areas of Gurugram do you cover for name reveal decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does name reveal decoration include in Ghaziabad?", answer: "A personalised backdrop, balloon clusters and fairy lights. The reveal element is customised to your preference." },
    { question: "Which areas of Ghaziabad do you cover for name reveal decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does name reveal decoration include in Faridabad?", answer: "A personalised backdrop, balloon clusters and fairy lights. The reveal element can be customised." },
    { question: "Which areas of Faridabad do you cover for name reveal decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const nameRevealDecoration = {
  "name-reveal-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Name Reveal Decoration",
    title: `Name Reveal Decoration in ${cityNames[city]}, Baby Name Announcement Setups from Rs 1,499 | HORA`,
    metaDescription: `Name reveal decoration in ${cityNames[city]} from Rs 1,499. Personalised backdrops, balloon clusters and reveal moments for baby name announcement ceremonies.`,
    heading: `Name Reveal Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Name reveal setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Name reveal decoration covers a personalised backdrop styled for the announcement, balloon clusters in your chosen colour palette, flowers and fairy lights. The reveal moment — a balloon pop, a drape pull or a board flip — is customised to your preference.",
      "Share the baby's name (to be used on the reveal board), the venue and the colour palette when you book. We design the setup around the moment.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
