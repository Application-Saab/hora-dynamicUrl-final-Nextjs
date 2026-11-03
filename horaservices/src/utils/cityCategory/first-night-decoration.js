import { cityAreasData as c } from "./_cityAreas";

const cities = ["mumbai","bangalore","hyderabad","delhi","noida","gurugram","ghaziabad","faridabad"];
const cityNames = { mumbai:"Mumbai", bangalore:"Bangalore", hyderabad:"Hyderabad", delhi:"Delhi", noida:"Noida", gurugram:"Gurugram", ghaziabad:"Ghaziabad", faridabad:"Faridabad" };

const cityIntros = {
  mumbai: "A wedding first night in Mumbai — whether it is a hotel in BKC, a flat in Andheri or a suite in South Mumbai — should feel like the most romantic space you have ever walked into. Rose petals on the floor, a flower canopy overhead, candles and warm lights, and a bed dressed with fresh roses — a verified decorator sets it up in about an hour while you are at the reception.",
  bangalore: "The first night after a Bangalore wedding should be something you both remember. A hotel room or a flat in Koramangala or Whitefield dressed with rose petals, candles, a flower ceiling canopy and warm lights turns the room into something that photographs itself. A verified decorator sets it up while you are at the reception.",
  hyderabad: "A first night setup in Hyderabad is one of our most carefully done bookings. Whether it is a five-star hotel room or a flat in Gachibowli, rose petals on the floor, a flower and candle arrangement and warm lighting transform the room into a romantic space. A verified decorator sets it up while you are at the reception.",
  delhi: "Delhi first night setups happen across hotel suites in South Delhi, farmhouse rooms and flats, and the look needs to match the occasion. Rose petals, a flower canopy, candles and warm lights make the room feel like the most special space the couple has ever shared. A verified decorator sets it up while the reception is in progress.",
  noida: "A first night decoration in a Noida hotel or flat is one of our most personal bookings. Rose petals on the floor and bed, a flower canopy overhead, candles and warm lights create a romantic setting the couple walks into straight from the reception. A verified decorator handles the gate pass and sets it up while you are at the function.",
  gurugram: "Gurugram's hotels and serviced apartments are popular first night venues, and the setup needs to look as good as the occasion feels. Rose petals, a flower canopy, candles and warm lighting transform the room in about an hour. A verified decorator sets it up while you are at the wedding reception and leaves everything perfect.",
  ghaziabad: "A first night decoration in a Ghaziabad hotel or a flat in Indirapuram should make the couple feel like the evening was planned in every detail. Rose petals, candles, flowers and warm lights set the room apart from any other night. A verified decorator handles the gate pass and sets it up while you are at the function.",
  faridabad: "A first night setup in Faridabad — hotel or home — should make the couple feel that the evening was thought through completely. Rose petals, a flower arrangement, candles and warm lights turn the room into a romantic space that is ready when they arrive. A verified decorator sets it up while you are at the reception.",
};

const cityFaqs = {
  mumbai: [
    { question: "Can you set up first night decoration in a hotel in Mumbai?", answer: "Yes. Hotels in BKC, South Mumbai and the western suburbs are regular venues for first night setups. Share the hotel name and room number so we can coordinate with reception." },
    { question: "How do you access the room for a first night setup in Mumbai without the couple knowing?", answer: "We coordinate with the hotel reception or a family member who has access. The decorator sets up, sends a confirmation photo, and leaves before the couple arrives." },
    { question: "Which areas of Mumbai do you cover for first night decoration?", answer: c.mumbai.areasAnswer },
  ],
  bangalore: [
    { question: "Can you set up first night decoration in a hotel in Bangalore?", answer: "Yes. Hotels in Whitefield, Koramangala, Indiranagar and the airport corridor are regular first night venues. Share the hotel name and room number for coordination." },
    { question: "Which areas of Bangalore do you cover for first night decoration?", answer: c.bangalore.areasAnswer },
  ],
  hyderabad: [
    { question: "Can you set up first night decoration in a five-star hotel in Hyderabad?", answer: "Yes. Five-star and luxury hotels in HITEC City, Banjara Hills and Jubilee Hills are regular venues. Share the hotel name, room number and a contact at reception so we can coordinate." },
    { question: "Which areas of Hyderabad do you cover for first night decoration?", answer: c.hyderabad.areasAnswer },
  ],
  delhi: [
    { question: "Can you set up first night decoration in a farmhouse or banquet in Delhi?", answer: "Yes. Farmhouses and banquet rooms are popular first night venues in Delhi. Share the location and we coordinate with the venue for access and timing." },
    { question: "Which areas of Delhi do you cover for first night decoration?", answer: c.delhi.areasAnswer },
  ],
  noida: [
    { question: "How do you handle gate access for a first night setup in a Noida society flat?", answer: "Share the tower, flat number and a family contact who has access. We coordinate the gate pass and set up while you are at the function." },
    { question: "Which areas of Noida do you cover for first night decoration?", answer: c.noida.areasAnswer },
  ],
  gurugram: [
    { question: "Can you set up first night decoration in a Gurugram hotel or serviced apartment?", answer: "Yes. Hotels and serviced apartments on MG Road, Golf Course Road and Cyber City are regular venues. Share the hotel and room details and we coordinate with reception." },
    { question: "Which areas of Gurugram do you cover for first night decoration?", answer: c.gurugram.areasAnswer },
  ],
  ghaziabad: [
    { question: "How do you access a flat for a first night setup in Ghaziabad?", answer: "A family member or the building contact gives the decorator access while you are at the function. Share the society, tower and flat details and we coordinate the gate pass." },
    { question: "Which areas of Ghaziabad do you cover for first night decoration?", answer: c.ghaziabad.areasAnswer },
  ],
  faridabad: [
    { question: "Can you set up first night decoration in a Faridabad hotel or home?", answer: "Yes. Both hotels and home setups are common for first night decoration in Faridabad. Share the venue and access details and we coordinate the timing." },
    { question: "Which areas of Faridabad do you cover for first night decoration?", answer: c.faridabad.areasAnswer },
  ],
};

export const firstNightDecoration = {
  "first-night-decoration": Object.fromEntries(cities.map(city => [city, {
    city: cityNames[city], category: "First Night Decoration",
    title: `First Night Decoration in ${cityNames[city]}, Romantic Setups from Rs 1,499 | HORA`,
    metaDescription: `First night decoration in ${cityNames[city]} from Rs 1,499. Romantic rose petal, flower canopy and candle setups in hotels and homes.`,
    heading: `First Night Decoration in ${cityNames[city]}`,
    intro: cityIntros[city],
    homeHeading: `First night setups in ${cityNames[city]}`,
    homeParagraphs: [
      "Every first night setup includes rose petals on the floor and the bed, a flower arrangement or canopy overhead, candles and warm ambient lighting. You can add fresh flower walls, a bathtub arrangement or a personalised name setup.",
      "We coordinate with the hotel reception or the person who has access to the room. The decorator sets up, sends you a confirmation photo and clears out before the couple arrives.",
    ],
    ...c[city],
    faqHeading: "FAQs",
    faqs: cityFaqs[city],
  }])),
};
