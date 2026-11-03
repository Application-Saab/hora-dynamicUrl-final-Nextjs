import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Nation pride decoration in Mumbai covers Independence Day on 15th August and Republic Day on 26th January — tricolour balloon arches, saffron-white-green themed backdrops, flag bunting and patriotic setups for societies, schools, offices and community events. A verified decorator sets it up before the flag-hoisting ceremony. Nation pride decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Nation pride decoration in Bangalore covers Independence Day and Republic Day celebrations in societies, schools, offices and community halls. Tricolour balloon arches, patriotic backdrops, flag bunting and saffron-white-green themed setups make the occasion look festive and respectful. Nation pride decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Nation pride decoration in Hyderabad is popular for Independence Day and Republic Day events in societies, schools and offices. Tricolour balloon arches, patriotic backdrops and flag bunting bring the celebration mood to any space. Nation pride decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Nation pride decoration in Delhi covers Independence Day and Republic Day celebrations with tricolour balloon arches, patriotic backdrops and flag bunting. Delhi's national day events are among the grandest in the country, and society and office decorations set the right tone. Nation pride decoration in Delhi starts at Rs 1,499.",
  noida: "Nation pride decoration in Noida covers Independence Day and Republic Day celebrations in societies, schools and offices. Tricolour balloon arches, patriotic backdrops and flag bunting make the occasion look festive and celebratory. Nation pride decoration in Noida starts at Rs 1,499.",
  gurugram: "Nation pride decoration in Gurugram covers Independence Day and Republic Day events in societies, corporate offices and schools. Tricolour balloon setups, patriotic backdrops and flag bunting are set up before the flag-hoisting ceremony. Nation pride decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Nation pride decoration in Ghaziabad covers Independence Day and Republic Day celebrations in societies, schools and offices. Tricolour balloon arches, patriotic backdrops and flag bunting bring the patriotic spirit to any venue. Nation pride decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Nation pride decoration in Faridabad covers Independence Day and Republic Day events in societies, schools and offices. Tricolour balloon setups, patriotic backdrops and flag bunting are set up for the occasion. Nation pride decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "Do you decorate for Independence Day and Republic Day events in Mumbai?", answer: "Yes. Societies, offices, schools and community halls are regular venues. Tricolour balloon arches, patriotic backdrops and flag bunting are the standard elements. Contact us with the venue and scale for a quote." },
    { question: "Can you set up nation pride decoration for a large society event in Mumbai?", answer: "Yes. Large society events and corporate Independence Day celebrations are regular bookings. Share the venue and expected guest count and we plan the decoration accordingly." },
    { question: "Which areas of Mumbai do you cover for nation pride decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "Do you decorate for Independence Day and Republic Day events in Bangalore?", answer: "Yes. Societies, offices and schools are regular venues. Tricolour balloon arches, patriotic backdrops and flag bunting are our standard nation pride setups." },
    { question: "Which areas of Bangalore do you cover for nation pride decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "Do you decorate for Independence Day and Republic Day events in Hyderabad?", answer: "Yes. Societies, schools and offices are regular bookings. Tricolour balloons, patriotic backdrops and flag bunting make the occasion look celebratory." },
    { question: "Which areas of Hyderabad do you cover for nation pride decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "Do you decorate for Independence Day and Republic Day events in Delhi?", answer: "Yes. Societies, corporate offices, schools and community halls are regular venues. Tricolour balloon arches, patriotic backdrops and flag bunting are set up before the ceremony." },
    { question: "Which areas of Delhi do you cover for nation pride decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "Do you decorate for Independence Day and Republic Day in Noida?", answer: "Yes. Society events, office celebrations and school ceremonies are regular bookings. Tricolour balloons, patriotic backdrops and flag bunting are the standard setup." },
    { question: "Which areas of Noida do you cover for nation pride decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "Do you decorate for Independence Day and Republic Day events in Gurugram?", answer: "Yes. Corporate offices, societies and schools are regular venues. We set up tricolour balloon arches, patriotic backdrops and flag bunting before the flag-hoisting ceremony." },
    { question: "Which areas of Gurugram do you cover for nation pride decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "Do you decorate for Independence Day and Republic Day in Ghaziabad?", answer: "Yes. Society events, school ceremonies and office celebrations are regular bookings. Tricolour balloons, patriotic backdrops and flag bunting are the standard setup." },
    { question: "Which areas of Ghaziabad do you cover for nation pride decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "Do you decorate for Independence Day and Republic Day events in Faridabad?", answer: "Yes. Societies, schools and offices are regular venues. Tricolour balloons, patriotic backdrops and flag bunting are set up before the ceremony." },
    { question: "Which areas of Faridabad do you cover for nation pride decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const nationPrideDecoration = {
  "nation-pride-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Nation Pride Decoration",
    title: `Nation Pride Decoration in ${cityNames[city]}, Independence & Republic Day Setups | HORA`,
    metaDescription: `Nation pride decoration in ${cityNames[city]}. Tricolour balloon arches, patriotic backdrops and flag bunting for Independence Day and Republic Day events.`,
    heading: `Nation Pride Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Patriotic setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Nation pride decoration covers tricolour balloon arches, saffron-white-green themed backdrops, flag bunting and patriotic props for Independence Day and Republic Day events. We set up before the flag-hoisting ceremony.",
      "Society common areas, corporate offices, schools and community halls are our most common venues. Tell us the location, the scale and the setup time and we plan the decoration accordingly.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
