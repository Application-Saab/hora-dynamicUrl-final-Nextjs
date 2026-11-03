import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Festival decoration in Mumbai covers Diwali, Navratri, Eid, Christmas, Holi and every other celebration on the calendar. Torans at the door, diyas, fairy lights, rangoli setups, themed backdrops and flower arrangements bring the festival mood into homes, offices and society common areas. A verified decorator sets it up so everything is ready before the celebration begins. Festival decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Festival decoration in Bangalore covers Diwali, Ugadi, Dussehra, Christmas, Eid and all the major celebrations. Torans, diyas, fairy lights, rangoli setups and festive backdrops make homes and offices look celebratory. A verified decorator sets it up before the festival begins. Festival decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Festival decoration in Hyderabad covers Diwali, Eid, Dussehra, Ugadi, Christmas and every celebration on the calendar. Torans, diyas, flower garlands, fairy lights and festive rangoli bring the celebration into any home, office or community hall. Festival decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Festival decoration in Delhi covers Diwali, Navratri, Holi, Eid, Christmas and all the major celebrations. Torans, diyas, fairy lights, rangoli setups and themed backdrops make homes and offices look festive and welcoming. Festival decoration in Delhi starts at Rs 1,499.",
  noida: "Festival decoration in Noida covers Diwali, Navratri, Eid, Christmas, Holi and all the major celebrations. Torans, diyas, fairy lights, rangoli and festive backdrops make the home or office look celebratory. A verified decorator coordinates the gate pass and sets it up before the festival. Festival decoration in Noida starts at Rs 1,499.",
  gurugram: "Festival decoration in Gurugram covers Diwali, Navratri, Eid, Christmas and all major celebrations. Torans, diyas, fairy lights, rangoli and festive backdrops transform homes, offices and society common areas. Festival decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Festival decoration in Ghaziabad covers Diwali, Navratri, Eid, Christmas, Holi and all the major celebrations. Torans, diyas, fairy lights, rangoli setups and festive backdrops make any home or office look celebratory. Festival decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Festival decoration in Faridabad covers Diwali, Navratri, Eid, Christmas, Holi and all major celebrations. Torans, diyas, fairy lights, rangoli and festive backdrops bring the celebration into homes and community spaces. Festival decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "Which festivals do you decorate for in Mumbai?", answer: "Diwali, Navratri, Eid, Christmas, Holi, Gudi Padwa, Ganesh Chaturthi and all major celebrations. Mention the festival and the look you want when you book." },
    { question: "Can you do society common area decoration for Diwali in Mumbai?", answer: "Yes. Society common areas, lobbies and amenity floors are regular Diwali decoration venues. Contact us with the scope and we quote based on the area." },
    { question: "Which areas of Mumbai do you cover for festival decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "Which festivals do you decorate for in Bangalore?", answer: "Diwali, Ugadi, Dussehra, Onam, Christmas, Eid and all major celebrations. Tell us the festival and the look you want when you book." },
    { question: "Which areas of Bangalore do you cover for festival decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "Which festivals do you decorate for in Hyderabad?", answer: "Diwali, Eid, Dussehra, Ugadi, Bonalu, Christmas and all major celebrations. Tell us the festival and the look you want when you book." },
    { question: "Which areas of Hyderabad do you cover for festival decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "Which festivals do you decorate for in Delhi?", answer: "Diwali, Navratri, Holi, Eid, Christmas, Lohri and all major celebrations. Tell us the festival and the look you want when you book." },
    { question: "Which areas of Delhi do you cover for festival decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "Which festivals do you decorate for in Noida?", answer: "Diwali, Navratri, Holi, Eid, Christmas and all major celebrations. Tell us the festival when you book and we plan the decoration accordingly." },
    { question: "Which areas of Noida do you cover for festival decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "Which festivals do you decorate for in Gurugram?", answer: "Diwali, Navratri, Eid, Christmas, Holi and all major celebrations. Tell us the festival and the venue when you book." },
    { question: "Which areas of Gurugram do you cover for festival decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "Which festivals do you decorate for in Ghaziabad?", answer: "Diwali, Navratri, Holi, Eid, Christmas and all major celebrations. Tell us the festival and the look you want when you book." },
    { question: "Which areas of Ghaziabad do you cover for festival decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "Which festivals do you decorate for in Faridabad?", answer: "Diwali, Navratri, Holi, Eid, Christmas and all major celebrations. Tell us the festival and the venue when you book." },
    { question: "Which areas of Faridabad do you cover for festival decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const festivalsDecoration = {
  "festivals-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Festival Decoration",
    title: `Festival Decoration in ${cityNames[city]}, Diwali, Eid & All Occasions from Rs 1,499 | HORA`,
    metaDescription: `Festival decoration in ${cityNames[city]} from Rs 1,499. Diwali, Navratri, Eid, Christmas and all celebrations with torans, diyas, fairy lights and festive setups.`,
    heading: `Festival Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Festival setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Festival decoration covers torans and diyas for Diwali, rangoli setups, fairy lights for homes and offices, flower garlands for puja spaces and themed backdrops for celebrations.",
      "Tell us the festival, the venue and the look you want — traditional, modern or a blend — and we plan the decoration to match the occasion and the space.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
