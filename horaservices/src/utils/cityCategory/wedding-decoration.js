import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Wedding decoration in Mumbai covers the full wedding day setup — the mandap, the stage, floral arches, welcome gates, table centrepieces and the overall venue styling that makes the occasion look as significant as it is. We work with banquet halls in South Mumbai and the western suburbs, hotels in BKC, and venues across Navi Mumbai and Thane. Pricing is based on the venue, the scale and the floral brief; contact us for a personalised quote.",
  bangalore: "Wedding decoration in Bangalore covers the full venue setup — the mandap, the stage, welcome gates, floral arches and table centrepieces — for banquet halls, resorts and outdoor lawns across Whitefield, Koramangala and the Outer Ring Road corridor. Pricing is based on the venue, the scale and the brief; contact us for a personalised quote.",
  hyderabad: "Wedding decoration in Hyderabad covers the full venue setup — the mandap, the stage, floral arches, welcome gates and table centrepieces — for five-star hotel banquets, farmhouses in Shamirpet and wedding halls across the city. Pricing is based on the venue, the scale and the floral brief; contact us for a personalised quote.",
  delhi: "Wedding decoration in Delhi covers the full wedding setup — the mandap, the stage, welcome gates, floral arches and table centrepieces — for farmhouses, hotel banquets and marquee venues across South Delhi, Dwarka and NCR. Pricing is based on the venue, the scale and the brief; contact us for a personalised quote.",
  noida: "Wedding decoration in Noida covers the full venue setup — the mandap, the stage, floral arches, welcome gates and table centrepieces — for hotel banquets and wedding halls across Sectors 18, 62 and Greater Noida. Pricing is based on the venue, the scale and the brief; contact us for a personalised quote.",
  gurugram: "Wedding decoration in Gurugram covers the full venue setup — the mandap, the stage, welcome gates, floral arches and table centrepieces — for hotel banquets on Golf Course Road, DLF venues and wedding halls across Sohna Road. Pricing is based on the venue, the scale and the brief; contact us for a personalised quote.",
  ghaziabad: "Wedding decoration in Ghaziabad covers the full venue setup — the mandap, the stage, floral arches, welcome gates and table centrepieces — for banquet halls and wedding venues across Indirapuram, Raj Nagar and the NH-58 corridor. Pricing is based on the venue, the scale and the brief; contact us for a personalised quote.",
  faridabad: "Wedding decoration in Faridabad covers the full venue setup — the mandap, the stage, floral arches, welcome gates and table centrepieces — for banquet halls and wedding venues across NIT, the old sectors and Greater Faridabad. Pricing is based on the venue, the scale and the brief; contact us for a personalised quote.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does wedding decoration include in Mumbai?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates, table centrepieces and aisle decoration. Fresh flowers, fabric draping and lighting are the main elements. The exact scope depends on the venue and the brief." },
    { question: "Do you decorate for hotel banquets and farmhouses in Mumbai?", answer: "Yes. Hotel banquets in BKC and South Mumbai, and venues across Navi Mumbai and Thane, are all regular wedding decoration venues." },
    { question: "Which areas of Mumbai do you cover for wedding decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does wedding decoration include in Bangalore?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates, table centrepieces and aisle decoration. The scope depends on the venue and the brief." },
    { question: "Which areas of Bangalore do you cover for wedding decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does wedding decoration include in Hyderabad?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates, table centrepieces and aisle decoration. The scope and pricing depend on the venue and the floral brief." },
    { question: "Which areas of Hyderabad do you cover for wedding decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does wedding decoration include in Delhi?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates, table centrepieces and aisle decoration. Delhi weddings can be grand, and we scale the setup accordingly." },
    { question: "Which areas of Delhi do you cover for wedding decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does wedding decoration include in Noida?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates, table centrepieces and aisle decoration. The scope depends on the venue and the brief." },
    { question: "Which areas of Noida do you cover for wedding decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does wedding decoration include in Gurugram?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates, table centrepieces and aisle decoration. The scope depends on the venue and the brief." },
    { question: "Which areas of Gurugram do you cover for wedding decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does wedding decoration include in Ghaziabad?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates and table centrepieces. The scope and pricing depend on the venue and the brief." },
    { question: "Which areas of Ghaziabad do you cover for wedding decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does wedding decoration include in Faridabad?", answer: "Full venue styling including the mandap, the wedding stage, floral arches, welcome gates and table centrepieces. The scope and pricing depend on the venue and the brief." },
    { question: "Which areas of Faridabad do you cover for wedding decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const weddingDecoration = {
  "wedding-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Wedding Decoration",
    title: `Wedding Decoration in ${cityNames[city]}, Full Venue Styling | HORA`,
    metaDescription: `Wedding decoration in ${cityNames[city]}. Full venue styling with mandap, stage, floral arches and table centrepieces for banquets and wedding halls.`,
    heading: `Wedding Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Wedding venue styling in ${cityNames[city]}`,
    homeParagraphs: [
      "Wedding decoration covers the full venue — the mandap, the stage, floral arches at the entrance and aisle, table centrepieces for the reception and overall lighting and draping that ties the look together.",
      "Share the wedding date, the venue and your look and feel preferences. We visit the venue, understand the brief and provide a detailed quote based on the scope and the floral brief.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
