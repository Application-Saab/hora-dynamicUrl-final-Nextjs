import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Engagement decoration in Mumbai sets up the ring ceremony with everything it deserves — a personalised couple backdrop, rose petals, floral arches, fairy lights, balloon clusters and a styled ring exchange table. We set up in banquet halls, hotel lawns and home spaces across the city. Engagement decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Engagement decoration in Bangalore covers the ring ceremony setup — a personalised couple backdrop, rose petals, fairy lights, floral arches and a styled ring exchange table. We set up in hotel banquets, lawns and home spaces. Engagement decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Engagement decoration in Hyderabad sets up the ring ceremony with a personalised couple backdrop, rose petals, fairy lights, balloon clusters and a styled ring exchange table. We decorate in hotel banquets, function halls and homes. Engagement decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Engagement decoration in Delhi covers the ring ceremony setup — a personalised couple backdrop, rose petals, floral arches, fairy lights and a styled ring exchange table. We set up in farmhouses, hotel banquets and home spaces. Engagement decoration in Delhi starts at Rs 1,499.",
  noida: "Engagement decoration in Noida sets up the ring ceremony with a personalised couple backdrop, rose petals, fairy lights, balloon clusters and a styled ring exchange table. We coordinate the gate pass and set up in hotel banquets and society party halls. Engagement decoration in Noida starts at Rs 1,499.",
  gurugram: "Engagement decoration in Gurugram covers the ring ceremony setup — a personalised couple backdrop, rose petals, fairy lights, floral arches and a styled ring exchange table in hotel banquets and home spaces. Engagement decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Engagement decoration in Ghaziabad sets up the ring ceremony with a personalised couple backdrop, rose petals, fairy lights and a styled ring exchange table. We set up in banquet halls and home spaces. Engagement decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Engagement decoration in Faridabad covers the ring ceremony setup — a personalised couple backdrop, rose petals, fairy lights and a styled ring exchange table. We set up in banquet halls and home spaces. Engagement decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does engagement decoration include in Mumbai?", answer: "A personalised couple backdrop, rose petals on the floor, floral arches, fairy lights, balloon clusters and a styled ring exchange table. The look can be romantic, floral or grand depending on the brief." },
    { question: "Do you decorate for engagement ceremonies in hotel banquets in Mumbai?", answer: "Yes. Hotel banquets and lawns in South Mumbai, BKC and the western suburbs are regular engagement decoration venues." },
    { question: "Which areas of Mumbai do you cover for engagement decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does engagement decoration include in Bangalore?", answer: "A personalised couple backdrop, rose petals, fairy lights, floral arches and a styled ring exchange table. The look can be tailored to your brief." },
    { question: "Which areas of Bangalore do you cover for engagement decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does engagement decoration include in Hyderabad?", answer: "A personalised couple backdrop, rose petals, fairy lights, balloon clusters and a styled ring exchange table. The look can be customised to your preference." },
    { question: "Which areas of Hyderabad do you cover for engagement decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does engagement decoration include in Delhi?", answer: "A personalised couple backdrop, rose petals, floral arches, fairy lights and a styled ring exchange table. Delhi engagement ceremonies are often grand and we scale accordingly." },
    { question: "Which areas of Delhi do you cover for engagement decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does engagement decoration include in Noida?", answer: "A personalised couple backdrop, rose petals, fairy lights, balloon clusters and a styled ring exchange table. The look can be customised." },
    { question: "Which areas of Noida do you cover for engagement decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does engagement decoration include in Gurugram?", answer: "A personalised couple backdrop, rose petals, floral arches, fairy lights and a styled ring exchange table. The look can be customised to your brief." },
    { question: "Which areas of Gurugram do you cover for engagement decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does engagement decoration include in Ghaziabad?", answer: "A personalised couple backdrop, rose petals, fairy lights and a styled ring exchange table. The look can be customised." },
    { question: "Which areas of Ghaziabad do you cover for engagement decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does engagement decoration include in Faridabad?", answer: "A personalised couple backdrop, rose petals, fairy lights and a styled ring exchange table. The look can be tailored to your preference." },
    { question: "Which areas of Faridabad do you cover for engagement decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const engagementDecoration = {
  "engagement-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Engagement Decoration",
    title: `Engagement Decoration in ${cityNames[city]}, Ring Ceremony Setups from Rs 1,499 | HORA`,
    metaDescription: `Engagement decoration in ${cityNames[city]} from Rs 1,499. Personalised couple backdrops, floral arches and ring exchange table setups for engagement ceremonies.`,
    heading: `Engagement Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Engagement ceremony setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Engagement decoration covers the full ring ceremony setup — a personalised couple backdrop, rose petals on the floor, floral arches, fairy lights, balloon clusters and a styled ring exchange table.",
      "Share the venue, the guest count and the look you have in mind. We design the setup to match the space and the occasion.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
