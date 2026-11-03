import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Premium decoration in Mumbai is for occasions where the standard package is not enough. Hand-selected flowers, custom balloon sculptures, designer backdrops, fresh flower ceilings and curated lighting setups — every element is chosen and executed to a higher standard. Whether it is a milestone birthday in a suite at a South Mumbai hotel or an anniversary dinner at home in Bandra, a verified premium decorator designs the setup around your brief. Pricing varies by scope; contact us for a personalised quote.",
  bangalore: "Premium decoration in Bangalore is for the setups that need to look extraordinary — a designer flower canopy for a 50th anniversary, a custom balloon ceiling for a milestone birthday at a resort in Nandi Hills, or a full floral installation at a home in Whitefield. Every element is handpicked and executed to a level that goes well beyond the standard package. Pricing varies by scope; contact us for a personalised quote.",
  hyderabad: "Premium decoration in Hyderabad is for the occasions that call for something truly exceptional. Custom flower installations, designer backdrops, personalised neon signs, handpicked floral arrangements and curated lighting transform any space — a hotel in HITEC City, a farmhouse in Shamirpet or a large home in Jubilee Hills. Pricing varies by scope; contact us with your brief and we provide a personalised quote.",
  delhi: "Premium decoration in Delhi is for the occasions where every detail is meant to be memorable. Hand-selected flowers, designer backdrops, balloon sculptures, custom neon and curated lighting in hotel suites, farmhouses and large homes. We execute to a level that matches the grandeur Delhi occasions are known for. Pricing varies by scope; contact us for a personalised quote.",
  noida: "Premium decoration in Noida is for milestone occasions that deserve a setup beyond the standard. Custom flower ceilings, designer backdrops, balloon sculptures and curated lighting in hotels, penthouses and large society flats. A verified premium decorator builds the concept around your brief. Pricing varies by scope; contact us for a personalised quote.",
  gurugram: "Premium decoration in Gurugram is for occasions that need to look exceptional — a milestone anniversary in a Golf Course Road hotel, a surprise birthday in a luxury apartment, a corporate celebration in Cyber City. Hand-selected flowers, designer installations, custom neon and curated lighting are executed at a level that justifies the occasion. Pricing varies by scope; contact us for a personalised quote.",
  ghaziabad: "Premium decoration in Ghaziabad is for the occasions where a standard package is not enough. Custom floral installations, designer backdrops, balloon sculptures and curated lighting for milestone birthdays, anniversaries and special events. A verified premium decorator designs the setup to match your brief. Pricing varies by scope; contact us for a personalised quote.",
  faridabad: "Premium decoration in Faridabad is for the occasions that call for an extraordinary setup — milestone birthdays, grand anniversaries, special events that deserve more than the standard package. Custom flowers, designer backdrops, curated lighting and premium materials are selected for every element. Pricing varies by scope; contact us for a personalised quote.",
};

const cityFaqs = {
  mumbai: [
    { question: "What makes premium decoration different from a standard setup in Mumbai?", answer: "Premium setups use hand-selected flowers, custom balloon sculptures, designer backdrop panels, fresh flower ceilings and curated lighting rather than off-the-shelf materials. Every element is chosen and placed to a higher standard." },
    { question: "Do you do premium decoration for hotel rooms and suites in Mumbai?", answer: "Yes. Hotel rooms and suites at five-star properties in South Mumbai, BKC and the western suburbs are regular premium decoration venues. Share the hotel, room type and brief and we plan accordingly." },
    { question: "Which areas of Mumbai do you cover for premium decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What makes premium decoration different from a standard setup in Bangalore?", answer: "Premium setups use custom flower installations, designer backdrops, handpicked fresh flowers and curated lighting rather than standard balloon packages. Every element is elevated and placed with care." },
    { question: "Which areas of Bangalore do you cover for premium decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What is included in a premium decoration package in Hyderabad?", answer: "Premium setups include hand-selected flowers, custom backdrops, designer balloon sculptures, personalised neon or LED signage and curated lighting. The exact elements depend on your brief and budget." },
    { question: "Which areas of Hyderabad do you cover for premium decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What is included in a premium decoration package in Delhi?", answer: "Premium setups use hand-selected flowers, designer backdrops, balloon sculptures, custom neon and curated lighting. Every element is chosen to match the scale and style of the occasion." },
    { question: "Which areas of Delhi do you cover for premium decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What makes premium decoration different from a standard setup in Noida?", answer: "Premium setups use custom flower ceilings, designer backdrops, handcrafted balloon sculptures and curated lighting rather than standard packages. Every element is tailored to the brief." },
    { question: "Which areas of Noida do you cover for premium decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "Do you do premium decoration for hotel suites in Gurugram?", answer: "Yes. Hotel suites in Golf Course Road, Cyber City and MG Road area are regular premium decoration venues. Share the hotel, occasion and brief and we design the setup around it." },
    { question: "Which areas of Gurugram do you cover for premium decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What is included in a premium decoration package in Ghaziabad?", answer: "Custom floral installations, designer backdrops, balloon sculptures and curated lighting. The exact elements are chosen based on your brief, the venue and the occasion." },
    { question: "Which areas of Ghaziabad do you cover for premium decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What makes premium decoration different from a standard setup in Faridabad?", answer: "Premium setups use hand-selected flowers, designer backdrops, premium materials and curated lighting. Every element is elevated beyond what a standard package includes." },
    { question: "Which areas of Faridabad do you cover for premium decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const premiumDecoration = {
  "premium-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Premium Decoration",
    title: `Premium Decoration in ${cityNames[city]}, Luxury Setups | HORA`,
    metaDescription: `Premium decoration in ${cityNames[city]}. Luxury setups with custom flowers, designer backdrops and curated lighting for milestone occasions.`,
    heading: `Premium Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Premium setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Premium decoration covers every milestone that deserves more than a standard package — a 50th birthday, a 25th anniversary, a bespoke proposal setup or a grand welcome. Custom flower installations, designer backdrops, handcrafted balloon sculptures and curated lighting are the signature elements.",
      "Share your brief, the venue and the date and a premium decorator designs the concept around your occasion. Pricing is based on the scope of work; contact us for a personalised quote.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
