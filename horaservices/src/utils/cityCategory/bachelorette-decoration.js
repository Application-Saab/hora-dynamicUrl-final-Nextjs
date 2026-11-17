import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Bachelorette decoration in Mumbai is for the last night of freedom before the wedding — and it should look the part. Blush and gold balloon clusters, a Bride-To-Be sash and tiara setup, rose petal arrangements, fairy lights, cheeky props and a personalised backdrop for the squad photos. We set up in hotel rooms, Airbnbs and home spaces across the city. Bachelorette decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Bachelorette decoration in Bangalore is for the bride's night out done right. Blush and gold balloons, a Bride-To-Be backdrop, rose petals, fairy lights and fun props set the mood in hotel rooms, Airbnbs and home spaces. A verified decorator sets it up while the group is out. Bachelorette decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Bachelorette decoration in Hyderabad makes the bride's last single night one to remember. Blush and gold balloon clusters, a Bride-To-Be backdrop, rose petals and fairy lights set up in a hotel room or home space while the group is out. Bachelorette decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Bachelorette decoration in Delhi is for the bride's night before the wedding — pink and gold balloons, a Bride-To-Be sash and tiara display, rose petals, fairy lights and fun props set up in a hotel room or home. A verified decorator sets it up while the group is getting ready elsewhere. Bachelorette decoration in Delhi starts at Rs 1,499.",
  noida: "Bachelorette decoration in Noida makes the bride's last night as a single woman special. Blush and gold balloon clusters, a Bride-To-Be backdrop, rose petals and fairy lights set up in a hotel room or society flat. A verified decorator coordinates the gate pass and sets it up while the group is out. Bachelorette decoration in Noida starts at Rs 1,499.",
  gurugram: "Bachelorette decoration in Gurugram sets up the bride's final night in style. Blush and gold balloons, a Bride-To-Be backdrop, rose petals, fairy lights and fun props in a hotel room or home space. A verified decorator handles the setup while the group is out. Bachelorette decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Bachelorette decoration in Ghaziabad makes the bride's last night one to remember. Blush and gold balloons, a Bride-To-Be backdrop, rose petals and fairy lights set up in a hotel room or home space. A verified decorator coordinates the gate pass and sets it up. Bachelorette decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Bachelorette decoration in Faridabad is for the bride's night before the wedding. Blush and gold balloon clusters, a Bride-To-Be backdrop, rose petals and fairy lights set up in a hotel room or home space. Bachelorette decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does bachelorette decoration include in Mumbai?", answer: "Blush and gold balloon clusters, a Bride-To-Be personalised backdrop, rose petals, fairy lights, sash and tiara props, fun bachelorette signage and a table styled for the group. You can customise the colour palette and the theme." },
    { question: "Can you set up bachelorette decoration in a hotel room in Mumbai?", answer: "Yes. Hotel rooms are our most common bachelorette venue. Share the hotel name and room number and we coordinate with reception to set up while the bride and squad are out." },
    { question: "Which areas of Mumbai do you cover for bachelorette decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does bachelorette decoration include in Bangalore?", answer: "Blush and gold balloon clusters, a Bride-To-Be backdrop, rose petals, fairy lights and fun props. You can customise the colour palette and the theme." },
    { question: "Can you set up bachelorette decoration in a hotel in Bangalore?", answer: "Yes. Hotels in Whitefield, Koramangala and Indiranagar are regular bachelorette venues. Share the hotel and room details and we coordinate the setup." },
    { question: "Which areas of Bangalore do you cover for bachelorette decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does bachelorette decoration include in Hyderabad?", answer: "Blush and gold balloon clusters, a Bride-To-Be backdrop, rose petals, fairy lights and fun props. The colour palette and theme can be customised." },
    { question: "Which areas of Hyderabad do you cover for bachelorette decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does bachelorette decoration include in Delhi?", answer: "Blush and gold balloons, a Bride-To-Be backdrop, rose petals, fairy lights, sash and tiara props and bachelorette signage. Colour palette and theme can be customised." },
    { question: "Which areas of Delhi do you cover for bachelorette decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does bachelorette decoration include in Noida?", answer: "Blush and gold balloon clusters, a Bride-To-Be backdrop, rose petals, fairy lights and fun props. You can customise the colour palette and the theme." },
    { question: "Which areas of Noida do you cover for bachelorette decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does bachelorette decoration include in Gurugram?", answer: "Blush and gold balloons, a Bride-To-Be backdrop, rose petals, fairy lights and fun props. The colour palette and theme can be customised." },
    { question: "Which areas of Gurugram do you cover for bachelorette decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does bachelorette decoration include in Ghaziabad?", answer: "Blush and gold balloon clusters, a Bride-To-Be backdrop, rose petals, fairy lights and fun props. Colour palette and theme can be customised." },
    { question: "Which areas of Ghaziabad do you cover for bachelorette decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does bachelorette decoration include in Faridabad?", answer: "Blush and gold balloons, a Bride-To-Be backdrop, rose petals, fairy lights and fun props. The colour palette and theme can be customised." },
    { question: "Which areas of Faridabad do you cover for bachelorette decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const bacheloretteDecoration = {
  "bachelorette-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Bachelorette Decoration",
    title: `Bachelorette Decoration in ${cityNames[city]}, Bride-To-Be Setups from Rs 1,499 | HORA`,
    metaDescription: `Bachelorette decoration in ${cityNames[city]} from Rs 1,499. Blush and gold balloon setups, personalised backdrops and fun props for the bride's last night.`,
    heading: `Bachelorette Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Bachelorette setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Bachelorette decoration covers blush and gold balloon clusters, a Bride-To-Be personalised backdrop, rose petals, fairy lights, sash and tiara props and fun bachelorette signage. Hotel rooms and Airbnb spaces are our most common venues.",
      "Share the venue, the colour palette and the theme when you book. We coordinate with the hotel reception or whoever has access and set up while the group is out, so everything is ready when the bride walks in.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
