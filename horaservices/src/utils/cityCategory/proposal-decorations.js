import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "A proposal in Mumbai should be impossible to say no to — not just the question, but the setting. Rose petals on the floor, a heart or arrow design, a personalised Marry Me backdrop, candles in a ring shape, fairy lights and fresh flowers turn a hotel room, a rooftop or a home into the most romantic space you have ever set up. A verified decorator sets it up while you keep her away, sends a confirmation photo, and clears out. Proposal decoration in Mumbai starts at Rs 1,499.",
  bangalore: "A marriage proposal in Bangalore deserves a setup as thoughtful as the question itself. Rose petals, candles, a personalised Marry Me backdrop, fairy lights and fresh flowers in a hotel room, a terrace or a home create the moment she will talk about for the rest of her life. A verified decorator sets it up while you keep her occupied. Proposal decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "A proposal setup in Hyderabad turns the moment into a memory. Rose petals in a heart or ring shape, a Marry Me backdrop, candles and fairy lights in a hotel room, a farmhouse or a home. A verified decorator sets it up while you keep her away. Proposal decoration in Hyderabad starts at Rs 1,499.",
  delhi: "A proposal in Delhi should look as big as the moment feels. Rose petals, candles in a ring shape, a personalised Marry Me backdrop, fairy lights and fresh flowers in a hotel suite, a farmhouse or a home. A verified decorator sets it up while you keep her away. Proposal decoration in Delhi starts at Rs 1,499.",
  noida: "A marriage proposal in Noida should feel like the most thought-through thing you have ever done. Rose petals, candles, a personalised Marry Me backdrop and fairy lights set up in a hotel room or society flat while you keep her away. A verified decorator handles the gate pass. Proposal decoration in Noida starts at Rs 1,499.",
  gurugram: "A proposal in Gurugram should look like you planned it down to the last petal. Rose petals, candles in a heart or ring shape, a Marry Me backdrop, fairy lights and fresh flowers in a hotel room or home. A verified decorator handles the gate pass and the setup. Proposal decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "A proposal setup in Ghaziabad turns an ordinary evening into one she will never forget. Rose petals, candles, a Marry Me backdrop and fairy lights set up in a hotel room or flat while you keep her away. A verified decorator handles the gate pass. Proposal decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "A marriage proposal in Faridabad should look as special as the moment is. Rose petals, candles, a personalised Marry Me backdrop and fairy lights set up in a hotel room or home. A verified decorator handles the setup. Proposal decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "What does proposal decoration include in Mumbai?", answer: "Rose petals on the floor in a heart or ring pattern, a personalised Marry Me backdrop, candles arranged in a ring or heart shape, fresh flower bunches and fairy lights. You can add a bathtub arrangement, a personalised name setup or a champagne table." },
    { question: "Can you set up proposal decoration in a hotel room in Mumbai without her knowing?", answer: "Yes. Share the hotel name and room number and we coordinate with the hotel reception or whoever has access. The decorator sets up, sends you a confirmation photo and leaves before you both arrive." },
    { question: "Which areas of Mumbai do you cover for proposal decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "What does proposal decoration include in Bangalore?", answer: "Rose petals on the floor, a personalised Marry Me backdrop, candles, fresh flowers and fairy lights. You can add a bathtub arrangement or a champagne table." },
    { question: "Can you set up proposal decoration without her knowing in Bangalore?", answer: "Yes. We coordinate with the hotel reception or a contact who has access. The decorator sets up and sends a confirmation photo before you both arrive." },
    { question: "Which areas of Bangalore do you cover for proposal decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does proposal decoration include in Hyderabad?", answer: "Rose petals on the floor in a heart or ring pattern, a personalised Marry Me backdrop, candles and fairy lights. You can add a champagne table or fresh flower bunches." },
    { question: "Which areas of Hyderabad do you cover for proposal decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "What does proposal decoration include in Delhi?", answer: "Rose petals in a heart or ring pattern, a Marry Me backdrop, candles, fresh flowers and fairy lights. You can add a bathtub arrangement, a champagne table or a personalised name setup." },
    { question: "Which areas of Delhi do you cover for proposal decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does proposal decoration include in Noida?", answer: "Rose petals on the floor, a personalised Marry Me backdrop, candles and fairy lights. You can add a champagne table or fresh flower bunches." },
    { question: "How do you access the room for a proposal setup in Noida?", answer: "Share the hotel or flat details and a contact who has access. We coordinate the gate pass and set up while you keep her away." },
    { question: "Which areas of Noida do you cover for proposal decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "What does proposal decoration include in Gurugram?", answer: "Rose petals in a heart or ring shape, a personalised Marry Me backdrop, candles, fairy lights and fresh flowers. You can add a bathtub arrangement or a champagne table." },
    { question: "Which areas of Gurugram do you cover for proposal decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does proposal decoration include in Ghaziabad?", answer: "Rose petals on the floor, a personalised Marry Me backdrop, candles and fairy lights. You can add fresh flowers or a champagne table." },
    { question: "Which areas of Ghaziabad do you cover for proposal decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "What does proposal decoration include in Faridabad?", answer: "Rose petals on the floor, a personalised Marry Me backdrop, candles and fairy lights. You can add fresh flower bunches or a champagne table." },
    { question: "Which areas of Faridabad do you cover for proposal decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const proposalDecorations = {
  "Proposal-Decorations": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Proposal Decoration",
    title: `Proposal Decoration in ${cityNames[city]}, Marry Me Setups from Rs 1,499 | HORA`,
    metaDescription: `Proposal decoration in ${cityNames[city]} from Rs 1,499. Rose petals, candles and Marry Me backdrops for marriage proposals in hotels and homes.`,
    heading: `Proposal Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Proposal setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Every proposal setup includes rose petals on the floor in a heart or ring pattern, a personalised Marry Me backdrop, candles arranged in a shape, fairy lights and fresh flowers. You can add a bathtub arrangement, a champagne table or a personalised name in lights.",
      "Share the venue, the access details and the time you need the setup done by. We coordinate with the hotel reception or whoever has access, set everything up while you keep her occupied, and send you a confirmation photo so you know it is perfect before you arrive.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
