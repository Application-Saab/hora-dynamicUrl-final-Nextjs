import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Sangeet decoration in Mumbai sets up the most fun night of the wedding week. A stage for performances, a couple backdrop, colourful balloon installations, fairy lights, dhol and musical instrument props and table centrepieces that make the dance floor feel electric. We decorate for intimate home sangeets and large hotel banquet sangeets alike. Sangeet decoration in Mumbai starts at Rs 2,499.",
  bangalore: "Sangeet decoration in Bangalore covers the performance stage, the couple backdrop, colourful balloon clusters, fairy lights, musical props and table centrepieces for the wedding night that the family talks about most. We decorate for hotel banquets, banquet halls and home setups. Sangeet decoration in Bangalore starts at Rs 2,499.",
  hyderabad: "Sangeet decoration in Hyderabad sets up the most energetic night of the wedding season. A performance stage, a couple backdrop, colourful balloons, fairy lights and musical props make the venue electric. We decorate for large family sangeets in function halls and hotel banquets. Sangeet decoration in Hyderabad starts at Rs 2,499.",
  delhi: "Sangeet decoration in Delhi covers the performance stage, a couple backdrop, colourful balloon arches, fairy lights and musical props for the most celebrated night of the wedding week. We decorate for farmhouse sangeets, hotel banquets and large home lawns. Sangeet decoration in Delhi starts at Rs 2,499.",
  noida: "Sangeet decoration in Noida sets up the performance stage, the couple backdrop, colourful balloons and fairy lights for the wedding night everyone looks forward to most. We decorate for hotel banquets and wedding halls. Sangeet decoration in Noida starts at Rs 2,499.",
  gurugram: "Sangeet decoration in Gurugram covers the performance stage, the couple backdrop, colourful balloon arches, fairy lights and musical props for hotel banquets and wedding lawns. Sangeet decoration in Gurugram starts at Rs 2,499.",
  ghaziabad: "Sangeet decoration in Ghaziabad sets up the performance stage, the couple backdrop, colourful balloons and fairy lights for wedding halls and banquet venues. Sangeet decoration in Ghaziabad starts at Rs 2,499.",
  faridabad: "Sangeet decoration in Faridabad covers the performance stage, the couple backdrop, colourful balloon installations and fairy lights for banquet halls and home setups. Sangeet decoration in Faridabad starts at Rs 2,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does sangeet decoration include in Mumbai?", answer: "A performance stage backdrop, a couple backdrop for photos, colourful balloon installations, fairy lights across the venue, musical props and table centrepieces. The look is vibrant and energy-filled." },
    { question: "Do you decorate for hotel sangeets in Mumbai?", answer: "Yes. Hotel banquets and lawns in South Mumbai, BKC and the western suburbs are regular sangeet decoration venues." },
    { question: "Which areas of Mumbai do you cover for sangeet decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does sangeet decoration include in Bangalore?", answer: "A performance stage backdrop, a couple backdrop, colourful balloon clusters, fairy lights and musical props. The look is vibrant and energetic." },
    { question: "Which areas of Bangalore do you cover for sangeet decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does sangeet decoration include in Hyderabad?", answer: "A performance stage, a couple backdrop, colourful balloon arches, fairy lights and musical props. The look is bright and celebratory." },
    { question: "Which areas of Hyderabad do you cover for sangeet decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does sangeet decoration include in Delhi?", answer: "A performance stage backdrop, couple backdrop, colourful balloon arches, fairy lights, musical props and table centrepieces." },
    { question: "Which areas of Delhi do you cover for sangeet decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does sangeet decoration include in Noida?", answer: "A performance stage backdrop, couple backdrop, colourful balloons and fairy lights across the venue." },
    { question: "Which areas of Noida do you cover for sangeet decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does sangeet decoration include in Gurugram?", answer: "A performance stage backdrop, couple backdrop, colourful balloon arches, fairy lights and musical props." },
    { question: "Which areas of Gurugram do you cover for sangeet decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does sangeet decoration include in Ghaziabad?", answer: "A performance stage backdrop, couple backdrop, colourful balloons and fairy lights." },
    { question: "Which areas of Ghaziabad do you cover for sangeet decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does sangeet decoration include in Faridabad?", answer: "A performance stage backdrop, couple backdrop, colourful balloon installations and fairy lights." },
    { question: "Which areas of Faridabad do you cover for sangeet decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const sangeetDecoration = {
  "sangeet-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Sangeet Decoration",
    title: `Sangeet Decoration in ${cityNames[city]}, Wedding Night Setups from Rs 2,499 | HORA`,
    metaDescription: `Sangeet decoration in ${cityNames[city]} from Rs 2,499. Performance stage, colourful balloon installations, fairy lights and musical props for the wedding sangeet night.`,
    heading: `Sangeet Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Sangeet night setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Sangeet decoration covers the performance stage, a couple backdrop, colourful balloon installations, fairy lights across the venue, musical instrument props and table centrepieces. The look is vibrant and energetic — exactly right for the night that features most in the wedding album.",
      "Share the venue, the guest count and the colour palette. We design the setup to match the energy of the occasion.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
