import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Mandap decoration in Mumbai is the centrepiece of the wedding ceremony. A well-designed mandap — fresh flowers, draped fabric, brass diyas, a flower canopy overhead and a styled backdrop — is what the family photographs remember. We design and execute mandap setups for banquet halls, hotel venues and outdoor wedding spaces across the city. Pricing is based on the design and the material brief; contact us for a personalised quote.",
  bangalore: "Mandap decoration in Bangalore sets up the ceremony centrepiece — fresh flowers, fabric draping, diyas, a flower canopy and a styled backdrop. We work with hotel banquets, outdoor lawns and wedding halls across Whitefield, Koramangala and the ORR corridor. Pricing is based on the brief; contact us for a personalised quote.",
  hyderabad: "Mandap decoration in Hyderabad is the visual heart of the wedding ceremony. Fresh flowers, fabric draping, diyas and a flower canopy create the traditional ceremony space. We design mandap setups for hotel banquets, farmhouses and function halls across the city. Pricing is based on the brief; contact us for a personalised quote.",
  delhi: "Mandap decoration in Delhi sets up the ceremony centrepiece with fresh flowers, fabric draping, brass diyas, a flower canopy and a styled backdrop. We design mandap setups for farmhouses, hotel banquets and marquee venues. Pricing is based on the brief; contact us for a personalised quote.",
  noida: "Mandap decoration in Noida covers the wedding ceremony centrepiece — fresh flowers, fabric draping, diyas and a flower canopy for hotel banquets and wedding halls. Pricing is based on the design and material brief; contact us for a personalised quote.",
  gurugram: "Mandap decoration in Gurugram covers the ceremony centrepiece — fresh flowers, fabric draping, diyas and a flower canopy for hotel banquets and wedding lawns. Pricing is based on the brief; contact us for a personalised quote.",
  ghaziabad: "Mandap decoration in Ghaziabad sets up the ceremony centrepiece with fresh flowers, fabric draping, diyas and a flower canopy for banquet halls and wedding venues. Pricing is based on the brief; contact us for a personalised quote.",
  faridabad: "Mandap decoration in Faridabad covers the ceremony centrepiece — fresh flowers, fabric draping, diyas and a flower canopy for banquet halls and wedding venues. Pricing is based on the brief; contact us for a personalised quote.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does mandap decoration include in Mumbai?", answer: "The mandap structure with fabric draping, a fresh flower canopy overhead, brass or gold diyas along the perimeter, floral pillars and a styled backdrop behind the ceremony area. The design and flowers depend on the brief." },
    { question: "Can you do both traditional and modern mandap designs in Mumbai?", answer: "Yes. We do traditional flower mandaps with marigolds and roses, contemporary designs with exotic flowers and minimal draping, and fusion looks that blend both. Share reference photos and we design around your vision." },
    { question: "Which areas of Mumbai do you cover for mandap decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does mandap decoration include in Bangalore?", answer: "The mandap structure with fabric draping, a fresh flower canopy, diyas and a styled backdrop. The design and flower choices depend on the brief and the look you want." },
    { question: "Which areas of Bangalore do you cover for mandap decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does mandap decoration include in Hyderabad?", answer: "The mandap structure with fabric draping, a fresh flower canopy, diyas and a styled backdrop. We do traditional marigold-heavy mandaps and modern floral designs." },
    { question: "Which areas of Hyderabad do you cover for mandap decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does mandap decoration include in Delhi?", answer: "The mandap structure with fabric draping, a fresh flower canopy, brass diyas, floral pillars and a styled backdrop. Delhi mandaps can be as grand as the brief requires." },
    { question: "Which areas of Delhi do you cover for mandap decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does mandap decoration include in Noida?", answer: "The mandap structure with fabric draping, a fresh flower canopy, diyas and a styled backdrop. Design and flowers depend on the brief." },
    { question: "Which areas of Noida do you cover for mandap decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does mandap decoration include in Gurugram?", answer: "The mandap structure with fabric draping, a fresh flower canopy, diyas and a styled backdrop. The design depends on the brief and the venue." },
    { question: "Which areas of Gurugram do you cover for mandap decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does mandap decoration include in Ghaziabad?", answer: "The mandap structure with fabric draping, a fresh flower canopy, diyas and a styled backdrop. Design depends on the brief." },
    { question: "Which areas of Ghaziabad do you cover for mandap decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does mandap decoration include in Faridabad?", answer: "The mandap structure with fabric draping, a fresh flower canopy, diyas and a styled backdrop. Design depends on the brief and the venue." },
    { question: "Which areas of Faridabad do you cover for mandap decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const mandapDecoration = {
  "mandap-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Mandap Decoration",
    title: `Mandap Decoration in ${cityNames[city]}, Wedding Ceremony Setups | HORA`,
    metaDescription: `Mandap decoration in ${cityNames[city]}. Fresh flower canopies, fabric draping and diyas for traditional and modern wedding ceremony mandaps.`,
    heading: `Mandap Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Mandap setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Mandap decoration covers the full ceremony centrepiece — the mandap structure, fabric draping, a fresh flower canopy overhead, brass or gold diyas along the perimeter, floral pillars and a styled backdrop. Traditional marigold-heavy designs and contemporary floral mandaps are both available.",
      "Share the venue, the wedding date and reference photos of the look you want. We design the mandap, source the flowers and set it up to match the ceremony vision.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
