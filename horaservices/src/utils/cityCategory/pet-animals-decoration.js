import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "Pet birthday parties in Mumbai are becoming a regular booking, and the decoration needs to be as safe as it is beautiful. Pet-safe balloons, a personalised birthday backdrop with the pet's name, dog-bone and paw-print props and pet-friendly decorations make the celebration feel special without any element that could harm the animal. A verified decorator sets it up in about an hour. Pet and animal decoration in Mumbai starts at Rs 1,499.",
  bangalore: "Pet birthday parties in Bangalore are a growing trend, and we set up safe, fun decorations that work for pets and humans alike. Pet-safe balloons, a backdrop with the pet's name, paw prints and themed props make the occasion feel like a proper party. A verified decorator sets it up in about an hour. Pet decoration in Bangalore starts at Rs 1,499.",
  hyderabad: "Pet celebrations in Hyderabad — birthdays, adoption anniversaries and puppy welcome parties — deserve proper decoration. Pet-safe balloons, a personalised backdrop and themed props make the occasion festive and photograph beautifully. A verified decorator sets it up in about an hour. Pet decoration in Hyderabad starts at Rs 1,499.",
  delhi: "Pet birthday parties and welcome celebrations in Delhi are a growing trend. Pet-safe balloons, a personalised backdrop with the pet's name and fun props make the party look and feel special. A verified decorator sets it up in about an hour. Pet decoration in Delhi starts at Rs 1,499.",
  noida: "Pet celebrations in Noida — birthdays, adoption anniversaries and welcome parties — get the same decoration care as any other milestone. Pet-safe balloons, a personalised backdrop and dog-bone or paw-print props make the occasion festive. A verified decorator coordinates the gate pass and sets it up in about an hour. Pet decoration in Noida starts at Rs 1,499.",
  gurugram: "Pet birthday parties in Gurugram are a popular booking, and the decoration needs to be safe for the animal and fun for the guests. Pet-safe balloons, a backdrop with the pet's name and themed props make the occasion feel like a proper celebration. A verified decorator handles the gate pass and sets it up in about an hour. Pet decoration in Gurugram starts at Rs 1,499.",
  ghaziabad: "Pet birthday parties and welcome celebrations in Ghaziabad get the same decoration care as any other occasion. Pet-safe balloons, a personalised backdrop and fun themed props make the celebration look festive and photograph well. A verified decorator coordinates the gate pass and sets it up in about an hour. Pet decoration in Ghaziabad starts at Rs 1,499.",
  faridabad: "Pet celebrations in Faridabad — birthdays, adoption anniversaries and welcome parties — deserve proper decoration. Pet-safe balloons, a personalised backdrop with the pet's name and themed props make the occasion feel special. A verified decorator sets it up in about an hour. Pet decoration in Faridabad starts at Rs 1,499.",
};

const cityFaqs = {
  mumbai: [
    { question: "Are the decorations safe for pets and dogs in Mumbai?", answer: "Yes. We use pet-safe latex balloons, avoid sharp or small elements near the animal, and keep the setup stable so nothing can fall on the pet. Mention the animal type and size when you book." },
    { question: "What does a pet birthday decoration include in Mumbai?", answer: "A personalised backdrop with the pet's name, pet-safe balloon clusters, paw print or dog-bone props and a party table setup. You can choose a theme — a cartoon, a colour palette or a favourite toy." },
    { question: "Which areas of Mumbai do you cover for pet decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "Are the decorations safe for pets in Bangalore?", answer: "Yes. We use pet-safe materials, avoid sharp elements and keep the setup stable. Mention the animal type when you book so we plan accordingly." },
    { question: "What does a pet birthday decoration include in Bangalore?", answer: "A personalised backdrop with the pet's name, pet-safe balloons, paw print props and a party table setup. You can choose the theme and colour palette." },
    { question: "Which areas of Bangalore do you cover for pet decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "What does a pet birthday decoration include in Hyderabad?", answer: "A personalised backdrop with the pet's name, pet-safe balloon clusters, themed props and a party table setup. We choose all elements with animal safety as the first priority." },
    { question: "Which areas of Hyderabad do you cover for pet decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "Are the decorations safe for pets in Delhi?", answer: "Yes. Pet-safe balloons, no sharp elements, and a stable setup so nothing can fall near the animal. Mention the type and size of your pet when you book." },
    { question: "Which areas of Delhi do you cover for pet decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "What does a pet birthday decoration include in Noida?", answer: "A personalised backdrop with the pet's name, pet-safe balloons, paw print props and a party table setup. All elements are chosen with animal safety in mind." },
    { question: "Which areas of Noida do you cover for pet decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "Are the decorations safe for pets in Gurugram?", answer: "Yes. We use pet-safe latex balloons, avoid sharp or small elements near the animal and keep the setup stable. Mention the pet type when you book." },
    { question: "Which areas of Gurugram do you cover for pet decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "What does a pet birthday decoration include in Ghaziabad?", answer: "A personalised backdrop with the pet's name, pet-safe balloon clusters, themed props and a party table setup. We plan every element with animal safety as the priority." },
    { question: "Which areas of Ghaziabad do you cover for pet decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "Are the decorations safe for pets in Faridabad?", answer: "Yes. Pet-safe materials throughout, no sharp elements near the animal and a stable setup. Mention the pet type and size when you book." },
    { question: "Which areas of Faridabad do you cover for pet decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const petAnimalsDecoration = {
  "pet-animals-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "Pet & Animals Decoration",
    title: `Pet Birthday Decoration in ${cityNames[city]}, Setups from Rs 1,499 | HORA`,
    metaDescription: `Pet birthday decoration in ${cityNames[city]} from Rs 1,499. Pet-safe balloon setups with personalised backdrops and themed props for dog and cat parties.`,
    heading: `Pet & Animals Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `Pet party setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Pet birthday parties, adoption anniversaries and welcome-home celebrations are the most common bookings. Every setup uses pet-safe materials — no sharp elements, no small parts near the animal, and a stable arrangement so nothing can fall.",
      "Tell us the pet's name, the type of animal and the party theme when you book. We personalise the backdrop and choose props that match the occasion.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
