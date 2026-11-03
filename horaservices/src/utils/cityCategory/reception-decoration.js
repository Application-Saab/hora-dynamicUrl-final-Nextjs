import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Wedding reception decoration in Mumbai covers the stage, the entrance, floral arches, table centrepieces, couple chair styling and ambient lighting that ties the full venue together. Receptions in Mumbai run from intimate hotel banquets to grand ballrooms, and we plan the decoration to match the scale. Pricing is based on the venue and the brief; contact us for a personalised quote.",
  bangalore: "Wedding reception decoration in Bangalore covers the couple stage, the entrance arch, floral table centrepieces and ambient lighting for banquet halls and hotel lawns across the city. The decoration should match the scale of the guest list and the look of the venue. Pricing is based on the brief; contact us for a personalised quote.",
  hyderabad: "Wedding reception decoration in Hyderabad covers the couple stage, the entrance arch, table centrepieces and ambient venue lighting for hotel banquets and function halls. Hyderabad receptions are often large, and we scale the decoration to match. Pricing is based on the brief; contact us for a personalised quote.",
  delhi: "Wedding reception decoration in Delhi covers the couple stage, the entrance, floral arches, table centrepieces and ambient lighting for farmhouses, hotel banquets and marquee venues. Delhi receptions are grand occasions and we plan the decoration accordingly. Pricing is based on the brief; contact us for a personalised quote.",
  noida: "Wedding reception decoration in Noida covers the couple stage, the entrance, floral arches and table centrepieces for hotel banquets and wedding halls. Pricing is based on the venue and the brief; contact us for a personalised quote.",
  gurugram: "Wedding reception decoration in Gurugram covers the couple stage, the entrance arch, table centrepieces and ambient venue lighting for hotel banquets on Golf Course Road and DLF venues. Pricing is based on the brief; contact us for a personalised quote.",
  ghaziabad: "Wedding reception decoration in Ghaziabad covers the couple stage, the entrance arch, table centrepieces and ambient venue lighting for banquet halls and wedding venues. Pricing is based on the brief; contact us for a personalised quote.",
  faridabad: "Wedding reception decoration in Faridabad covers the couple stage, the entrance arch, table centrepieces and ambient venue lighting for banquet halls and wedding venues. Pricing is based on the brief; contact us for a personalised quote.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does wedding reception decoration include in Mumbai?", answer: "The couple stage backdrop and styling, the entrance floral arch, table centrepieces for all guest tables, chair bows and ambient lighting. The exact scope depends on the venue size and the brief." },
    { question: "Do you decorate for hotel ballroom receptions in Mumbai?", answer: "Yes. Hotel ballrooms and banquets in South Mumbai, BKC and the western suburbs are regular reception decoration venues. Contact us with the venue and brief for a quote." },
    { question: "Which areas of Mumbai do you cover for reception decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does wedding reception decoration include in Bangalore?", answer: "The couple stage backdrop, entrance floral arch, table centrepieces and ambient lighting. The scope depends on the venue and the brief." },
    { question: "Which areas of Bangalore do you cover for reception decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does wedding reception decoration include in Hyderabad?", answer: "The couple stage backdrop, entrance arch, table centrepieces and ambient venue lighting. Hyderabad receptions are often large and we scale the decoration to match the guest count." },
    { question: "Which areas of Hyderabad do you cover for reception decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does wedding reception decoration include in Delhi?", answer: "The couple stage backdrop, entrance floral arches, table centrepieces, chair bows and ambient lighting. Delhi reception decoration can be as grand as the brief calls for." },
    { question: "Which areas of Delhi do you cover for reception decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does wedding reception decoration include in Noida?", answer: "The couple stage backdrop, entrance arch, table centrepieces and ambient venue lighting. The scope depends on the venue and the brief." },
    { question: "Which areas of Noida do you cover for reception decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does wedding reception decoration include in Gurugram?", answer: "The couple stage backdrop, entrance floral arch, table centrepieces and ambient venue lighting. Pricing depends on the venue and the brief." },
    { question: "Which areas of Gurugram do you cover for reception decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does wedding reception decoration include in Ghaziabad?", answer: "The couple stage backdrop, entrance arch, table centrepieces and ambient venue lighting. The scope depends on the venue and the brief." },
    { question: "Which areas of Ghaziabad do you cover for reception decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does wedding reception decoration include in Faridabad?", answer: "The couple stage backdrop, entrance arch, table centrepieces and ambient venue lighting. Scope depends on the venue and the brief." },
    { question: "Which areas of Faridabad do you cover for reception decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const receptionDecoration = {
  "reception-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Reception Decoration",
    title: `Wedding Reception Decoration in ${cityNames[city]}, Full Venue Styling | HORA`,
    metaDescription: `Wedding reception decoration in ${cityNames[city]}. Couple stage, entrance arches, table centrepieces and ambient lighting for banquet halls and hotel venues.`,
    heading: `Wedding Reception Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Reception venue styling in ${cityNames[city]}`,
    homeParagraphs: [
      "Reception decoration covers the couple stage backdrop, the entrance floral arch, table centrepieces for all guest tables, chair styling and ambient lighting that ties the whole venue together.",
      "Share the venue, the expected guest count and your look and feel. We visit the venue and provide a detailed quote based on the scope and the brief.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
