import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Car decoration in Mumbai is most commonly done for weddings — the bride and groom's car dressed with fresh flowers, ribbons and a just-married sign — but we also decorate cars for anniversaries, birthdays and honeymoon departures. A verified decorator sets up at your venue or parking area. Car decoration in Mumbai starts at Rs 799.",
  bangalore: "Car decoration in Bangalore covers wedding cars, anniversary surprises and honeymoon departures. Fresh marigold or rose garlands, ribbons and a just-married board are the classic look; we can also do full floral car decoration for premium wedding setups. A verified decorator sets up at your venue or parking location. Car decoration in Bangalore starts at Rs 799.",
  hyderabad: "Car decoration in Hyderabad is most popular for wedding cars and honeymoon departures. Fresh flower garlands, ribbons and a personalised signboard make the car look festive and photograph beautifully. A verified decorator sets up at the wedding venue or parking area in Hyderabad. Car decoration starts at Rs 799.",
  delhi: "Car decoration in Delhi covers weddings, anniversaries and special departures. Fresh flowers, ribbons, a just-married sign and balloon clusters are the classic elements. We set up at your Delhi venue or parking area. Car decoration starts at Rs 799.",
  noida: "Car decoration in Noida is popular for weddings, anniversary surprises and honeymoon departures. Fresh flowers, ribbons and a personalised board make the car look festive and celebratory. A verified decorator sets up at the venue or the parking area in Noida. Car decoration starts at Rs 799.",
  gurugram: "Car decoration in Gurugram covers wedding cars, anniversary surprises and honeymoon departures. Fresh flowers, ribbons and a personalised signboard are the standard look; premium floral car decoration is also available for luxury vehicles. A verified decorator sets up at your venue. Car decoration in Gurugram starts at Rs 799.",
  ghaziabad: "Car decoration in Ghaziabad is most common for weddings and anniversary surprises. Fresh flower garlands, ribbons and a just-married sign make the car look festive and celebratory. A verified decorator sets up at the venue or parking area. Car decoration in Ghaziabad starts at Rs 799.",
  faridabad: "Car decoration in Faridabad covers weddings, anniversaries and special departures. Fresh flowers, ribbons and a personalised board are the classic look for a wedding or anniversary car. A verified decorator sets up at the venue. Car decoration in Faridabad starts at Rs 799.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does car decoration include for a wedding in Mumbai?", answer: "Fresh flower garlands at the front and back, ribbons along the sides, a just-married signboard and balloon clusters. You can choose roses, marigolds or a mix. Premium full-floral decoration is also available." },
    { question: "Can you do car decoration at any wedding venue in Mumbai?", answer: "Yes. We set up at the venue parking or wherever the car is parked. Share the venue location and the expected decoration time when you book." },
    { question: "Which areas of Mumbai do you cover for car decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does car decoration include for a wedding in Bangalore?", answer: "Fresh flower garlands, ribbons, a just-married signboard and balloon clusters. Roses, marigolds or a custom flower mix. Premium full-floral decoration is also available." },
    { question: "Which areas of Bangalore do you cover for car decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does car decoration include for a wedding in Hyderabad?", answer: "Fresh flower garlands, ribbons and a personalised just-married signboard. Roses, marigolds or a flower mix depending on your preference. Premium floral decoration is also available." },
    { question: "Which areas of Hyderabad do you cover for car decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does car decoration include for a wedding in Delhi?", answer: "Fresh flower garlands, ribbons, a just-married sign and balloon clusters. You can choose the flower type and the colour scheme." },
    { question: "Which areas of Delhi do you cover for car decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does car decoration include for a wedding in Noida?", answer: "Fresh flower garlands, ribbons and a just-married signboard. Roses, marigolds or a custom mix. The decorator sets up at the venue parking or wherever the car is parked." },
    { question: "Which areas of Noida do you cover for car decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "Can you do premium floral car decoration in Gurugram?", answer: "Yes. Full-floral car decoration with fresh roses and custom arrangements is available for premium wedding cars. Mention the vehicle and the look you want when you book." },
    { question: "Which areas of Gurugram do you cover for car decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does car decoration include for a wedding in Ghaziabad?", answer: "Fresh flower garlands, ribbons and a just-married signboard. The decorator sets up at the venue or parking area. Mention the flower preference when you book." },
    { question: "Which areas of Ghaziabad do you cover for car decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does car decoration include for a wedding in Faridabad?", answer: "Fresh flower garlands, ribbons and a personalised just-married signboard. You can choose the flower type and colour scheme." },
    { question: "Which areas of Faridabad do you cover for car decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const carDecoration = {
  "car-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Car Decoration",
    title: `Car Decoration in ${cityNames[city]}, Wedding Car Setups from Rs 799 | HORA`,
    metaDescription: `Car decoration in ${cityNames[city]} from Rs 799. Wedding car decoration with fresh flowers, ribbons and personalised signboards.`,
    heading: `Car Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Car decoration setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Wedding car decoration is the most popular booking — fresh flower garlands at the front and back, ribbons along the sides and a just-married signboard. You can choose roses, marigolds or a custom flower mix.",
      "We also decorate cars for anniversary surprises, honeymoon departures and birthday drives. Share the venue, the car details and the decoration time and we handle the rest.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
