export const photographyFAQData = () => [
  {
    question: "How much does it cost to hire a photographer?",
    answer:
      "Packages start at Rs 3,000, and most small events come in under Rs 5,000. The final price depends on the package, the hours and whether you add video, so share your timings and we'll confirm it before you book.",
  },
  {
    question: "Can I book a photographer for just one hour?",
    answer:
      "Yes. One hour is the minimum, and it's plenty for a cake-cutting or a family portrait. You can also book a few hours, a full day or a whole wedding.",
  },
  {
    question: "How do I book a photographer online?",
    answer:
      "Choose the occasion and a package, pick your city and hours, and confirm with a small advance. It only takes a few minutes, and same-day slots are often available for short sessions.",
  },
  {
    question: "Can I choose a specific photographer?",
    answer:
      "We assign your photographer based on your event type, location and availability, so you get someone experienced with your kind of shoot. Every photographer's portfolio is reviewed before they join. If you'd prefer a female photographer, just ask.",
  },
  {
    question: "Can I book a photoshoot near me, or at a studio?",
    answer:
      "Both. Our photographers come to your home, venue or an outdoor spot, and studio sessions are available in all our cities.",
  },
  {
    question: "What photography services does HORA offer?",
    answer:
      "Event photography for weddings, engagements, birthdays, baby showers, naming ceremonies, housewarmings, anniversaries and corporate events, plus maternity, newborn and baby shoots, studio sessions and videography.",
  },
  {
    question: "When will I get my photos?",
    answer:
      "When you need them. Tell us your preferred timeline and format at booking, and we'll plan the edit around it.",
  },
  {
    question: "Can I request a female photographer?",
    answer: "Yes, in any of our cities. Just mention it when you book.",
  },
  {
    question: "Can I book a camera man or videographer?",
    answer: "Yes. Add videography to a photo package or book it on its own.",
  },
  {
    question: "Is HORA like hiring a freelance photographer?",
    answer:
      "In a way, yes. You still get an independent photographer, but one whose portfolio we've already reviewed, with the package and price agreed before the shoot.",
  },
  {
    question: "Is HORA Photography reliable?",
    answer:
      "Our customers rate us 5.0. Every photographer's portfolio is reviewed before they're listed, and you know exactly what's included before you book.",
  },
  {
    question: "Which cities do you cover?",
    answer:
      "We cover 17 cities across India: Mumbai, Bangalore, Hyderabad, Delhi, Noida, Gurugram, Ghaziabad, Faridabad, Chennai, Kolkata, Lucknow, Kanpur, Indore, Surat, Bhopal, Goa and Pune. New cities are added regularly.",
  },
  {
    question: "How many photos will I receive after the shoot?",
    answer:
      "Around 150–200 color-corrected photos for a standard 4-hour event shoot. All photos are delivered via a permanent web gallery link within 24 hours. Premium packages include 20 fully edited photos of your choice; additional edits are available at ₹70 per photo.",
  },
  {
    question: "What equipment do your photographers use?",
    answer:
      "Our photographers use professional DSLRs and mirrorless cameras — Canon 80D, Sony A7M3, Canon R6 and similar — paired with fast lenses suited to indoor and outdoor lighting. All photographers on HORA are vetted before they join.",
  },
  {
    question: "What happens if my event runs longer than booked?",
    answer:
      "Additional hours are billed at ₹650 per hour, paid directly after the shoot. Let your photographer know early and they'll stay on to cover the full event.",
  },
  {
    question: "Can I see sample work before booking?",
    answer:
      "Yes. Every package on HORA shows sample galleries from similar events so you can see the style, lighting and editing approach before you confirm. You can also ask us to share additional galleries on request.",
  },
  {
    question: "Do you offer both candid and traditional photography?",
    answer:
      "Yes. Depending on the package you choose, you get candid photography (natural unposed moments), traditional posed photography, or a blend of both. Most of our event packages include candid shots as standard.",
  },
];

// Category-specific FAQ data for visible FAQ sections on category pages
// Format: { question, answer } to match FAQSection component expectations
const CATEGORY_FAQS = {
  "birthday-photography": [
    { question: "How much does a birthday photoshoot cost?", answer: "Birthday photoshoot packages at HORA start from ₹3,500, including a 1-hour session and 50+ edited digital photos. Final price depends on duration and package." },
    { question: "Can I book a birthday photographer at home?", answer: "Yes, HORA photographers come to your home, venue or any outdoor location across 17+ cities." },
    { question: "How many edited photos do I get?", answer: "Depending on the package, you receive between 50 and 200+ edited digital photos, delivered online within 24 hours." },
    { question: "Are female photographers available for birthday shoots?", answer: "Yes, female birthday photographers are available on request in most cities. Mention your preference at booking." },
    { question: "Can I add a videographer to a birthday shoot?", answer: "Yes, video coverage can be added to any photography package at the time of booking." },
    { question: "What is the minimum booking duration?", answer: "One hour is the minimum. Most birthday events run 2–3 hours, which is plenty to cover the full celebration." },
    { question: "How far in advance should I book?", answer: "7–10 days is ideal to guarantee photographer availability. Same-day bookings are often possible for short sessions." },
    { question: "Do I get candid and posed shots?", answer: "Yes. Our birthday packages include a blend of candid natural moments and posed family portraits." },
    { question: "What equipment do your photographers use?", answer: "Professional DSLRs and mirrorless cameras (Canon 80D, Sony A7M3, Canon R6) with lenses suited to indoor and low-light conditions." },
  ],
  "wedding-photography": [
    { question: "What is the cost of wedding photography at HORA?", answer: "Wedding photography packages start from ₹8,000 for a half-day shoot. Full-day and multi-day packages are available. See the wedding photography page for all options." },
    { question: "Do you provide candid and cinematic wedding coverage?", answer: "Yes. HORA offers candid photography, cinematic videography, traditional coverage and pre-wedding shoots, all bookable online." },
    { question: "How soon will we receive our wedding photos?", answer: "Edited wedding photos are typically delivered within 15–20 working days after the event via an online gallery." },
    { question: "Is pre-wedding photography included in wedding packages?", answer: "Pre-wedding shoots can be booked separately or added to a wedding package. Browse pre-wedding packages on HORA." },
    { question: "Can I book multiple photographers for a large wedding?", answer: "Yes, dual-photographer and multi-camera packages are available for large weddings with multiple functions." },
    { question: "Do you cover destination weddings?", answer: "Yes. We cover destination weddings in Goa, Rajasthan and other popular locations. Contact us for a custom quote." },
    { question: "What is the difference between candid and traditional wedding photography?", answer: "Traditional photography focuses on posed portraits and formal shots. Candid photography captures natural, unposed moments as they happen. Most HORA wedding packages include both." },
    { question: "Can decoration be arranged alongside wedding photography?", answer: "Yes, mandap and floral decoration can be combined with the photography booking for a complete wedding experience." },
  ],
  "maternity-photography": [
    { question: "When is the best time for a maternity photoshoot?", answer: "Ideally between 28 and 36 weeks of pregnancy, when the baby bump is prominent and the mother is most comfortable." },
    { question: "Can my partner and family be included in the maternity shoot?", answer: "Yes, partners, children and family members are always welcome. Mention it when booking and we'll plan the session accordingly." },
    { question: "What should I wear for a maternity photoshoot?", answer: "Our photographers advise on outfits and props before the session. Flowy dresses and fitted tops work well. Colour themes can be discussed in advance." },
    { question: "How much does a maternity photoshoot cost?", answer: "Maternity photoshoot packages start from ₹3,500 for a home or studio session with edited photos delivered digitally." },
    { question: "Where does the maternity shoot take place?", answer: "At your home for a comfortable and familiar setting, at a studio, or at an outdoor location — your choice." },
    { question: "Are female photographers available for maternity shoots?", answer: "Yes, female photographers are available on request and are the default assignment for maternity sessions when requested." },
    { question: "How long does a maternity photoshoot take?", answer: "Typically 1 to 2 hours, covering multiple outfits and setups if needed." },
    { question: "How many photos will I receive?", answer: "50 to 100+ edited digital photos depending on the package, delivered via a permanent online gallery." },
  ],
  "pre-wedding-photography": [
    { question: "How much does a pre-wedding photoshoot cost?", answer: "Pre-wedding photoshoot packages at HORA start from ₹4,500. Prices vary by location, duration and the number of looks." },
    { question: "Where can we do our pre-wedding shoot?", answer: "Any outdoor location, garden, heritage site, beach or indoor studio in your city. Popular spots include parks, forts and city landmarks. Your photographer can suggest the best spots." },
    { question: "How long does a pre-wedding shoot take?", answer: "Typically 2 to 4 hours for a standard pre-wedding session covering 2–3 different locations or looks." },
    { question: "When should we book our pre-wedding shoot?", answer: "Ideally 2–4 months before the wedding date to allow time for editing and to use images in invitations or décor." },
    { question: "Can we have multiple outfit changes?", answer: "Yes. Most pre-wedding packages accommodate 2–3 outfit changes. Discuss your preferences when booking." },
    { question: "Is a drone shot included?", answer: "Drone photography is available as an add-on in select packages and locations. Check availability when booking." },
    { question: "Will we receive edited photos?", answer: "Yes. Edited, colour-graded photos are delivered via an online gallery. Delivery timelines vary by package." },
    { question: "Do you shoot destination pre-wedding sessions?", answer: "Yes, we cover destination pre-wedding shoots in Goa, Rajasthan, hill stations and other scenic locations across India." },
  ],
  "anniversary-photography": [
    { question: "How much does an anniversary photoshoot cost?", answer: "Anniversary photoshoot packages start from ₹3,500 for a 1-hour session with 50+ edited digital photos." },
    { question: "Can HORA set up a surprise anniversary photoshoot?", answer: "Yes. Surprise setups for anniversaries can be arranged. Mention it at booking and we'll coordinate the surprise." },
    { question: "Is outdoor couple photography available for anniversaries?", answer: "Yes. Gardens, rooftops, cafes, beaches and city landmarks are all available for anniversary sessions." },
    { question: "Can decoration be added to the anniversary shoot?", answer: "Yes. Balloon and floral decoration packages can be combined with photography for a full anniversary experience." },
    { question: "How many photos will we receive?", answer: "50 to 150+ edited digital photos depending on the package, delivered online within 24 hours." },
  ],
  "baby-shower-photography": [
    { question: "Can HORA combine baby shower decoration with photography?", answer: "Yes. Hora offers combined baby shower decoration and photography packages. Book both together for a seamless experience." },
    { question: "How far in advance should I book a baby shower photographer?", answer: "At least 7–10 days in advance is recommended. Last-minute bookings are accepted subject to availability." },
    { question: "Are themed baby shower photoshoots available?", answer: "Yes. Floral, pastel, baby animal and other themed setups can be arranged alongside photography." },
    { question: "How long does a baby shower photoshoot session take?", answer: "Typically 1 to 2 hours, covering decoration, group shots and candid celebration moments." },
    { question: "How soon are photos delivered?", answer: "Within 24 hours via a permanent online gallery with all color-corrected photos." },
  ],
  "corporate-photography": [
    { question: "What types of corporate events does HORA cover?", answer: "Office parties, team outings, award nights, conferences, product launches, corporate headshots and annual day events across all major cities." },
    { question: "Can I get same-day delivery of edited corporate photos?", answer: "Express delivery of a curated set of edited corporate photos within 24 hours is available for select packages. Confirm at booking." },
    { question: "Is bulk booking available for recurring corporate events?", answer: "Yes. Bulk and recurring corporate photography packages are available. Contact the HORA team for custom pricing." },
    { question: "Do you provide headshots for individual employees?", answer: "Yes. Professional corporate headshot sessions are available for individuals or teams, in office or at a studio." },
    { question: "How do we book corporate photography for a large team event?", answer: "Share your event details and headcount via the booking form. We'll assign the right photographer count and package for your needs." },
  ],
  "new-born-baby-photography": [
    { question: "Is newborn photography safe for the baby?", answer: "Yes. HORA's newborn photographers are trained in baby-safe posing and handling. All setups use baby-safe materials and gentle lighting." },
    { question: "What is the best age for a newborn photoshoot?", answer: "Within the first 5–14 days after birth, when babies sleep deeply and can be gently posed." },
    { question: "Where does the newborn photoshoot take place?", answer: "At your home for a comfortable setting, or at a studio. Home shoots are most popular for newborns." },
    { question: "How long does a newborn photoshoot take?", answer: "2 to 3 hours, including feeding and settling breaks. Your photographer will work at the baby's pace." },
    { question: "Can siblings and parents be included?", answer: "Yes, family shots including siblings and parents are a standard part of most newborn packages." },
  ],
  "naming-ceremony-photography": [
    { question: "Do you cover annaprashan and cradle ceremony photography?", answer: "Yes. We cover naming ceremonies, annaprashan, barasala, cradle ceremonies, baptism and christening events across India." },
    { question: "How many photos are delivered from a naming ceremony shoot?", answer: "100–200 edited digital photos depending on the package, delivered via an online gallery within 24 hours." },
    { question: "What duration should I book for a naming ceremony?", answer: "Most naming ceremonies run 1.5 to 3 hours. Book the duration that covers the full ritual and celebration." },
    { question: "Can I add videography to the naming ceremony package?", answer: "Yes. A camera man/videographer can be added to any photography package." },
  ],
  "engagement-photography": [
    { question: "Can HORA combine an engagement shoot with ring ceremony photography?", answer: "Yes. We cover both the ring ceremony and a standalone couple shoot in a single booking." },
    { question: "What locations are available for engagement photoshoots?", answer: "Indoor studio, outdoor garden, rooftop, beach and heritage locations, depending on your city." },
    { question: "How much does an engagement photoshoot cost?", answer: "Engagement packages start from ₹3,500, including edited digital photos delivered via an online gallery." },
    { question: "How soon are photos delivered?", answer: "Within 24 hours for most packages. Your photographer will confirm the timeline before the shoot." },
  ],
  "house-warming-photography": [
    { question: "Do you cover griha pravesh and gruhapravesam ceremonies?", answer: "Yes. We cover all housewarming ceremonies — Griha Pravesh, Gruhapravesam, Vastu Pooja and related functions." },
    { question: "How many hours does a housewarming photography session last?", answer: "1.5 to 3 hours depending on the ceremony size and package." },
    { question: "Can I book a videographer alongside the photographer?", answer: "Yes. Video coverage can be added to any photography package at booking." },
    { question: "How many photos will I receive?", answer: "50–150 edited photos depending on the package, delivered within 24 hours." },
  ],
  "welcome-baby-photography": [
    { question: "Can I book a welcome baby photoshoot at home?", answer: "Yes. Photographers come to your home for a comfortable and familiar setting for both baby and parents." },
    { question: "What is included in a welcome baby photography package?", answer: "Photographer visit, edited digital photos and an online gallery. Props and themed setups can be added." },
    { question: "How soon are photos delivered?", answer: "Within 24 hours via a permanent online gallery." },
  ],
  "bachelorette-photography": [
    { question: "Can HORA provide props and setups for bachelorette photoshoots?", answer: "Yes. Fun props, balloon setups and photo booth experiences are available as add-ons." },
    { question: "How much does a bachelorette photoshoot cost?", answer: "Packages start from ₹3,500 for a 1-hour session. Group and multi-location packages are also available." },
    { question: "Can we do an outdoor bachelorette photoshoot?", answer: "Yes. Outdoor cafes, rooftops and parks are popular choices for bachelorette sessions." },
  ],
};

export const photographyCategoryFAQData = (catValue) => {
  return CATEGORY_FAQS[catValue] || photographyFAQData();
};

// ─────────────────────────────────────────────────────────────────────────────
// City + Category specific FAQs
// Keys: city slug (lowercase), then category slug matching CATEGORY_FAQS keys
// ─────────────────────────────────────────────────────────────────────────────
const CITY_CATEGORY_FAQS = {
  bangalore: {
    "birthday-photography": [
      { question: "Where can I find the best birthday photographer in Bangalore?", answer: "HORA connects you with vetted birthday photographers across Bangalore — Indiranagar, Koramangala, Whitefield, Jayanagar, HSR Layout and more. Book online in minutes." },
      { question: "How much does a birthday photoshoot cost in Bangalore?", answer: "Birthday photography packages in Bangalore start from ₹3,500 for a 1-hour session with 50+ edited digital photos. Prices vary by duration and package." },
      { question: "Can I book a home birthday photographer in Bangalore?", answer: "Yes. HORA photographers travel to your home, banquet hall, terrace or any outdoor location across Bangalore." },
      { question: "Are same-day birthday photographers available in Bangalore?", answer: "Yes, same-day and short-notice bookings are often available in Bangalore. Check current availability on the booking page." },
      { question: "How soon will I receive photos after a birthday shoot in Bangalore?", answer: "Edited photos are delivered via an online gallery within 24 hours of the shoot." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Bangalore?", answer: "Wedding photography in Bangalore starts from ₹8,000 for a half-day shoot. Full-day and multi-day packages are available for all functions." },
      { question: "Do you cover South Indian wedding rituals in Bangalore?", answer: "Yes. HORA photographers in Bangalore are experienced with Kannada, Tamil and Telugu wedding customs, rituals and ceremonies." },
      { question: "Which are the best wedding venues in Bangalore for photography?", answer: "Popular Bangalore wedding venues include Leela Palace, ITC Windsor, Golden Palms Resort, Taj West End and many banquet halls in Whitefield and Koramangala." },
      { question: "Can I book pre-wedding shoot locations in Bangalore?", answer: "Yes. Popular pre-wedding spots in Bangalore include Lalbagh, Cubbon Park, Nandi Hills, Manchanabele Dam and Hesaraghatta." },
      { question: "Do you provide candid wedding photographers in Bangalore?", answer: "Yes. All HORA wedding packages in Bangalore include candid photography as standard, with traditional coverage available too." },
    ],
    "maternity-photography": [
      { question: "Where can I get a maternity photoshoot done in Bangalore?", answer: "HORA maternity photographers visit your home across Bangalore — Whitefield, Indiranagar, JP Nagar, Hebbal and more — or at a studio of your choice." },
      { question: "What is the cost of a maternity photoshoot in Bangalore?", answer: "Maternity photoshoot packages in Bangalore start from ₹3,500 for a home or studio session with edited photos." },
      { question: "Are outdoor maternity photoshoots available in Bangalore?", answer: "Yes. Cubbon Park, Lalbagh and heritage bungalows in Bangalore are popular outdoor maternity shoot locations." },
      { question: "Can I request a female maternity photographer in Bangalore?", answer: "Yes. Female maternity photographers are available across Bangalore on request." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding photoshoot locations in Bangalore?", answer: "Top pre-wedding spots in Bangalore include Nandi Hills, Lalbagh Botanical Garden, Cubbon Park, Hesaraghatta Lake, Manchanabele Dam and Bangalore Palace grounds." },
      { question: "How much does a pre-wedding shoot cost in Bangalore?", answer: "Pre-wedding photoshoot packages in Bangalore start from ₹4,500. Price depends on locations, duration and number of looks." },
      { question: "Can we do a sunrise pre-wedding shoot at Nandi Hills, Bangalore?", answer: "Yes. Sunrise shoots at Nandi Hills are very popular. Mention your preferred time when booking and we'll assign an experienced photographer." },
    ],
    "anniversary-photography": [
      { question: "Where can we do a surprise anniversary photoshoot in Bangalore?", answer: "HORA photographers in Bangalore set up surprise anniversary shoots at your home, rooftop, garden or any venue across the city." },
      { question: "What is the cost of an anniversary photoshoot in Bangalore?", answer: "Anniversary packages in Bangalore start from ₹3,500 for a 1-hour session with 50+ edited photos." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Bangalore?", answer: "Yes. HORA baby shower photographers cover events across Bangalore — at home venues, banquet halls and outdoor spaces." },
      { question: "Can decoration be combined with baby shower photography in Bangalore?", answer: "Yes. HORA offers combined decoration and photography packages for baby showers in Bangalore." },
    ],
    "corporate-photography": [
      { question: "Which areas in Bangalore do you cover for corporate photography?", answer: "We cover all major Bangalore business districts — Whitefield, Electronic City, Outer Ring Road, MG Road, Koramangala, Hebbal and more." },
      { question: "Do you provide corporate headshot sessions in Bangalore offices?", answer: "Yes. Team headshot sessions at your Bangalore office can be arranged for any team size." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Bangalore?", answer: "Yes. HORA newborn photographers come to your home across Bangalore. Home shoots are the most popular choice for newborn sessions." },
      { question: "What is the cost of a newborn photoshoot in Bangalore?", answer: "Newborn photoshoot packages in Bangalore start from ₹3,500 for a home session with edited photos." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover Namakarana ceremony photography in Bangalore?", answer: "Yes. HORA photographers in Bangalore cover Namakarana (naming ceremonies) and all related traditions with experienced coverage." },
      { question: "How many photos do I get from a naming ceremony shoot in Bangalore?", answer: "100–200 edited digital photos, delivered via online gallery within 24 hours." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement photoshoot in Bangalore?", answer: "Popular spots include Cubbon Park, Lalbagh, Bangalore Palace grounds, boutique hotels in Indiranagar and rooftop venues across the city." },
      { question: "What is the cost of an engagement photoshoot in Bangalore?", answer: "Engagement packages in Bangalore start from ₹3,500 with edited digital photos delivered within 24 hours." },
    ],
    "house-warming-photography": [
      { question: "Do you cover Griha Pravesh photography in Bangalore?", answer: "Yes. HORA photographers cover all housewarming ceremonies across Bangalore, including Griha Pravesh and Vastu Pooja functions." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot at home in Bangalore?", answer: "Yes. Photographers come to your home across Bangalore for a comfortable newborn welcome session." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette photoshoot spots in Bangalore?", answer: "Rooftop cafes in Indiranagar, boutique hotels in Koramangala and outdoor gardens across Bangalore are popular bachelorette shoot locations." },
      { question: "How much does a bachelorette photoshoot cost in Bangalore?", answer: "Bachelorette packages in Bangalore start from ₹3,500 for a 1-hour session." },
    ],
  },

  mumbai: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Mumbai?", answer: "HORA covers all of Mumbai — Andheri, Bandra, Juhu, Powai, Thane, Navi Mumbai and beyond. Book online for any area." },
      { question: "How much does a birthday photoshoot cost in Mumbai?", answer: "Birthday photography packages in Mumbai start from ₹3,500 for a 1-hour session with 50+ edited digital photos." },
      { question: "Are outdoor birthday photoshoots available in Mumbai?", answer: "Yes. Marine Drive, Bandra Bandstand, Juhu Beach and parks across Mumbai are popular outdoor birthday shoot spots." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Mumbai?", answer: "Wedding photography in Mumbai starts from ₹8,000 for a half-day shoot. Full-day and multi-function packages are available." },
      { question: "Do you cover beach weddings in Mumbai?", answer: "Yes. We cover beach wedding ceremonies and receptions at Juhu, Versova and other Mumbai coastal venues." },
      { question: "Which are the best wedding photography venues in Mumbai?", answer: "Popular Mumbai wedding venues include The Leela, Taj Land's End, St. Regis, ITC Grand Central and luxury hotels in Bandra and BKC." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Mumbai?", answer: "Yes. HORA maternity photographers travel to your home across Mumbai, from Andheri to Navi Mumbai." },
      { question: "What is the cost of a maternity photoshoot in Mumbai?", answer: "Maternity photoshoot packages in Mumbai start from ₹3,500 for a home or studio session." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Mumbai?", answer: "Top pre-wedding spots in Mumbai include Marine Drive, Bandra Fort, Juhu Beach, Worli Seaface, Sanjay Gandhi National Park and heritage buildings in South Mumbai." },
      { question: "How much does a pre-wedding shoot cost in Mumbai?", answer: "Pre-wedding packages in Mumbai start from ₹4,500 depending on locations and duration." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange a surprise anniversary shoot in Mumbai?", answer: "Yes. Surprise anniversary setups at your Mumbai home, rooftop or venue are available on request." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Mumbai?", answer: "Yes. HORA baby shower photographers cover all Mumbai suburbs and the city centre." },
    ],
    "corporate-photography": [
      { question: "Which areas in Mumbai do you cover for corporate photography?", answer: "We cover all Mumbai business districts — BKC, Nariman Point, Andheri, Powai, Lower Parel and Thane." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Mumbai?", answer: "Yes. Newborn photographers travel to your Mumbai home for a safe and comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Mumbai?", answer: "Yes. We cover Barsa, naming ceremonies and all related celebrations across Mumbai." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Mumbai?", answer: "Marine Drive, Bandra Fort, Bandstand, Worli Seaface and boutique venues across Mumbai are great engagement shoot spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover Griha Pravesh photography in Mumbai?", answer: "Yes. HORA covers all housewarming ceremonies and Vastu Pooja events across Mumbai." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Mumbai?", answer: "Yes. Photographers come to your home across Mumbai for a comfortable newborn session." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette photoshoot spots in Mumbai?", answer: "Rooftop bars in Bandra, boutique hotels in BKC, Juhu Beach and indoor studio spaces are popular for Mumbai bachelorette shoots." },
    ],
  },

  hyderabad: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Hyderabad?", answer: "HORA covers all of Hyderabad — Banjara Hills, Jubilee Hills, Gachibowli, HITEC City, Kondapur, Secunderabad and more." },
      { question: "How much does a birthday photoshoot cost in Hyderabad?", answer: "Birthday photography packages in Hyderabad start from ₹3,500 for a 1-hour session with 50+ edited photos." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Hyderabad?", answer: "Wedding photography in Hyderabad starts from ₹8,000 for a half-day shoot. Full-day packages for all functions are available." },
      { question: "Do you cover Telugu and Muslim wedding photography in Hyderabad?", answer: "Yes. HORA photographers in Hyderabad are experienced with Telugu, Urdu and multi-community wedding customs and ceremonies." },
      { question: "Which are popular wedding photography venues in Hyderabad?", answer: "Popular Hyderabad venues include Taj Falaknuma, ITC Kohinoor, Novotel HICC, Sheraton Hyderabad and many banquet halls in Banjara Hills." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Hyderabad?", answer: "Yes. HORA maternity photographers come to your home across Hyderabad and Secunderabad." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Hyderabad?", answer: "Top pre-wedding spots in Hyderabad include Charminar, Golconda Fort, Hussain Sagar, Ramoji Film City, Birla Mandir surroundings and heritage havelis." },
    ],
    "anniversary-photography": [
      { question: "Can HORA set up a surprise anniversary shoot in Hyderabad?", answer: "Yes. Surprise anniversary setups at your home or a Hyderabad venue are available." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Hyderabad?", answer: "Yes. HORA photographers cover baby shower events across Hyderabad." },
    ],
    "corporate-photography": [
      { question: "Which areas in Hyderabad do you cover for corporate events?", answer: "We cover HITEC City, Gachibowli, Banjara Hills, Jubilee Hills, Secunderabad and all major Hyderabad business zones." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Hyderabad?", answer: "Yes. Newborn photographers come to your Hyderabad home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Hyderabad?", answer: "Yes. We cover naming ceremonies and all related celebrations across Hyderabad." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Hyderabad?", answer: "Golconda Fort, Hussain Sagar, Charminar area, Birla Mandir surroundings and luxury hotels in Banjara Hills are popular engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover Griha Pravesh photography in Hyderabad?", answer: "Yes. We cover Griha Pravesh and all housewarming ceremonies across Hyderabad." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Hyderabad?", answer: "Yes. Photographers come to your home across Hyderabad for the session." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette photoshoot spots in Hyderabad?", answer: "Luxury hotels in Banjara Hills, rooftop venues in HITEC City and indoor studio spaces are popular for Hyderabad bachelorette shoots." },
    ],
  },

  delhi: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Delhi?", answer: "HORA covers all of Delhi — South Delhi, North Delhi, Dwarka, Rohini, Lajpat Nagar, Saket and more." },
      { question: "How much does a birthday photoshoot cost in Delhi?", answer: "Birthday photography packages in Delhi start from ₹3,500 for a 1-hour session." },
      { question: "Are outdoor birthday shoots available in Delhi?", answer: "Yes. Lodhi Garden, India Gate lawns and parks across Delhi are popular outdoor birthday shoot locations." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Delhi?", answer: "Wedding photography in Delhi starts from ₹8,000 for a half-day shoot. Full-day and multi-day packages are available." },
      { question: "Which are popular wedding photography venues in Delhi?", answer: "Popular Delhi venues include The Oberoi, Taj Mahal Hotel, ITC Maurya, Leela Palace and farmhouses in Chattarpur." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Delhi?", answer: "Yes. HORA maternity photographers travel to your home anywhere in Delhi." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Delhi?", answer: "Top pre-wedding spots in Delhi include Lodhi Garden, Humayun's Tomb, Qutub Minar, India Gate, Hauz Khas Village and Mehrauli heritage zone." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange a surprise anniversary shoot in Delhi?", answer: "Yes. Surprise anniversary photography setups at your Delhi home or venue are available." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Delhi?", answer: "Yes. HORA baby shower photographers cover all Delhi areas." },
    ],
    "corporate-photography": [
      { question: "Which areas in Delhi do you cover for corporate photography?", answer: "We cover Connaught Place, Nehru Place, Saket, Aerocity, Dwarka and all major Delhi business districts." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Delhi?", answer: "Yes. Newborn photographers come to your Delhi home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Delhi?", answer: "Yes. We cover all naming ceremonies and related celebrations across Delhi." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Delhi?", answer: "Lodhi Garden, Humayun's Tomb, India Gate surroundings and luxury hotel venues across Delhi are popular engagement shoot spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover Griha Pravesh photography in Delhi?", answer: "Yes. We cover all housewarming ceremonies across Delhi." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Delhi?", answer: "Yes. Photographers come to your home across Delhi." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Delhi?", answer: "Rooftop venues in Connaught Place, boutique hotels in South Delhi and Hauz Khas Village are popular for Delhi bachelorette shoots." },
    ],
  },

  noida: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Noida?", answer: "HORA covers all Noida sectors — Sector 18, 62, 137, Greater Noida and more." },
      { question: "How much does a birthday photoshoot cost in Noida?", answer: "Birthday photography packages in Noida start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Noida?", answer: "Wedding photography in Noida starts from ₹8,000 for a half-day shoot." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Noida?", answer: "Yes. HORA maternity photographers travel to your home across Noida and Greater Noida." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations near Noida?", answer: "Okhla Bird Sanctuary, DND flyway areas, Greater Noida Expo Mart surroundings and select Delhi heritage sites nearby are popular Noida pre-wedding locations." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Noida?", answer: "Yes. Anniversary photography and surprise setups are available across Noida." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Noida?", answer: "Yes. HORA photographers cover baby shower events across Noida and Greater Noida." },
    ],
    "corporate-photography": [
      { question: "Which areas in Noida do you cover for corporate events?", answer: "We cover Sector 62, Sector 18, Film City, Expressway zones and all major Noida business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Noida?", answer: "Yes. Newborn photographers come to your Noida home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Noida?", answer: "Yes. We cover all naming ceremonies across Noida." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Noida?", answer: "Noida parks, DND flyway viewpoints and select Greater Noida venues are popular engagement shoot spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Noida?", answer: "Yes. We cover Griha Pravesh and all housewarming ceremonies across Noida." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Noida?", answer: "Yes. Photographers come to your home across Noida." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Noida?", answer: "Rooftop venues, restaurants in Sector 18 and indoor studio spaces across Noida are popular for bachelorette shoots." },
    ],
  },

  gurugram: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Gurugram?", answer: "HORA covers all of Gurugram — DLF Phase 1–5, Sohna Road, Golf Course Road, Cyber Hub and more." },
      { question: "How much does a birthday photoshoot cost in Gurugram?", answer: "Birthday photography packages in Gurugram start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Gurugram?", answer: "Wedding photography in Gurugram starts from ₹8,000 for a half-day shoot." },
      { question: "Which are popular wedding venues in Gurugram for photography?", answer: "Popular venues include Trident Gurgaon, The Westin, Leela Ambience, Marriott and farmhouses along Sohna Road." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Gurugram?", answer: "Yes. HORA maternity photographers travel to your home across Gurugram." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Gurugram?", answer: "Aravalli Biodiversity Park, Kingdom of Dreams, Cyber Hub and select heritage sites near Gurugram are popular pre-wedding locations." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Gurugram?", answer: "Yes. Anniversary photography and surprise setups are available across Gurugram." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Gurugram?", answer: "Yes. HORA photographers cover baby shower events across Gurugram." },
    ],
    "corporate-photography": [
      { question: "Which areas in Gurugram do you cover for corporate events?", answer: "We cover Cyber City, Golf Course Road, Sohna Road, Udyog Vihar and all major Gurugram business zones." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Gurugram?", answer: "Yes. Newborn photographers come to your Gurugram home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Gurugram?", answer: "Yes. We cover all naming ceremonies across Gurugram." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Gurugram?", answer: "Aravalli Biodiversity Park, DLF Golf Course surroundings and luxury hotels in Gurugram are popular engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Gurugram?", answer: "Yes. We cover all Griha Pravesh and housewarming ceremonies across Gurugram." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Gurugram?", answer: "Yes. Photographers come to your home across Gurugram." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Gurugram?", answer: "Cyber Hub rooftop venues, luxury hotels on Golf Course Road and studio spaces across Gurugram are popular for bachelorette shoots." },
    ],
  },

  ghaziabad: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Ghaziabad?", answer: "HORA covers all Ghaziabad areas — Indirapuram, Vaishali, Raj Nagar, Mohan Nagar, Crossings Republik and more." },
      { question: "How much does a birthday photoshoot cost in Ghaziabad?", answer: "Birthday photography packages in Ghaziabad start from ₹3,500 for a 1-hour session with 50+ edited photos." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Ghaziabad?", answer: "Wedding photography in Ghaziabad starts from ₹8,000 for a half-day shoot." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Ghaziabad?", answer: "Yes. HORA maternity photographers travel to your home across Ghaziabad." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations near Ghaziabad?", answer: "Hapur Road gardens, Hindon River side and select Delhi heritage sites accessible from Ghaziabad are popular pre-wedding locations." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Ghaziabad?", answer: "Yes. Anniversary photography and surprise setups are available across Ghaziabad." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Ghaziabad?", answer: "Yes. HORA photographers cover baby shower events across Ghaziabad." },
    ],
    "corporate-photography": [
      { question: "Which areas in Ghaziabad do you cover for corporate events?", answer: "We cover Sahibabad, Raj Nagar Extension, Indirapuram and all major Ghaziabad business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Ghaziabad?", answer: "Yes. Newborn photographers come to your Ghaziabad home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Ghaziabad?", answer: "Yes. We cover all naming ceremonies across Ghaziabad." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Ghaziabad?", answer: "Parks in Indirapuram, community centres and select outdoor venues across Ghaziabad are popular engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Ghaziabad?", answer: "Yes. We cover all Griha Pravesh and housewarming ceremonies across Ghaziabad." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Ghaziabad?", answer: "Yes. Photographers come to your home across Ghaziabad." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Ghaziabad?", answer: "Restaurants and party venues in Indirapuram and Vaishali are popular for Ghaziabad bachelorette shoots." },
    ],
  },

  faridabad: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Faridabad?", answer: "HORA covers all Faridabad sectors — Sector 15, 21, NIT, Ballabhgarh, Surajkund and more." },
      { question: "How much does a birthday photoshoot cost in Faridabad?", answer: "Birthday photography packages in Faridabad start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Faridabad?", answer: "Wedding photography in Faridabad starts from ₹8,000 for a half-day shoot." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Faridabad?", answer: "Yes. HORA maternity photographers travel to your home across Faridabad." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations near Faridabad?", answer: "Surajkund, Badkhal Lake area and nearby Delhi heritage sites are popular pre-wedding locations accessible from Faridabad." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Faridabad?", answer: "Yes. Anniversary photography and surprise setups are available across Faridabad." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Faridabad?", answer: "Yes. HORA photographers cover baby shower events across Faridabad." },
    ],
    "corporate-photography": [
      { question: "Which areas in Faridabad do you cover for corporate events?", answer: "We cover Mathura Road industrial belt, NIT, Sector 88 and all major Faridabad business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Faridabad?", answer: "Yes. Newborn photographers come to your Faridabad home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Faridabad?", answer: "Yes. We cover all naming ceremonies across Faridabad." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Faridabad?", answer: "Surajkund, parks across Faridabad and select banquet venues are popular engagement shoot spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Faridabad?", answer: "Yes. We cover all housewarming ceremonies across Faridabad." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Faridabad?", answer: "Yes. Photographers come to your home across Faridabad." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Faridabad?", answer: "Party venues in Sector 15 and Surajkund resort areas are popular for Faridabad bachelorette shoots." },
    ],
  },

  chennai: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Chennai?", answer: "HORA covers all Chennai areas — Anna Nagar, Adyar, Velachery, OMR, Porur, Tambaram and more." },
      { question: "How much does a birthday photoshoot cost in Chennai?", answer: "Birthday photography packages in Chennai start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Chennai?", answer: "Wedding photography in Chennai starts from ₹8,000 for a half-day shoot." },
      { question: "Do you cover Tamil Brahmin and non-Brahmin wedding ceremonies in Chennai?", answer: "Yes. HORA photographers in Chennai are experienced with Tamil Brahmin, Nadar, Mudaliar and other community wedding customs." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Chennai?", answer: "Yes. HORA maternity photographers travel to your home across Chennai." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Chennai?", answer: "Marina Beach, Elliots Beach, Semmozhi Poonga, Mahabalipuram shore temple and Guindy National Park are popular Chennai pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Chennai?", answer: "Yes. Anniversary photography and surprise setups are available across Chennai." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Chennai?", answer: "Yes. HORA photographers cover Valaikaapu and baby shower events across Chennai." },
    ],
    "corporate-photography": [
      { question: "Which areas in Chennai do you cover for corporate events?", answer: "We cover Guindy, OMR IT Corridor, Tidel Park, Nungambakkam, Adyar and all major Chennai business districts." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Chennai?", answer: "Yes. Newborn photographers come to your Chennai home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover Namakaranam ceremony photography in Chennai?", answer: "Yes. HORA photographers in Chennai cover Namakaranam and all naming traditions across communities." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Chennai?", answer: "Marina Beach, Elliots Beach, Semmozhi Poonga and luxury hotels in Nungambakkam are popular Chennai engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover Griha Pravesh photography in Chennai?", answer: "Yes. We cover all Griha Pravesh and housewarming ceremonies across Chennai." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Chennai?", answer: "Yes. Photographers come to your home across Chennai." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Chennai?", answer: "Elliots Beach area, boutique hotels in Adyar and studio spaces across Chennai are popular for bachelorette shoots." },
    ],
  },

  kolkata: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Kolkata?", answer: "HORA covers all Kolkata areas — Salt Lake, New Town, Park Street, Ballygunge, Rajarhat and more." },
      { question: "How much does a birthday photoshoot cost in Kolkata?", answer: "Birthday photography packages in Kolkata start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Kolkata?", answer: "Wedding photography in Kolkata starts from ₹8,000 for a half-day shoot." },
      { question: "Do you cover Bengali wedding rituals in Kolkata?", answer: "Yes. HORA photographers in Kolkata are experienced with Saat Paak, Shubho Drishti, Sindoor Daan and all Bengali wedding customs." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Kolkata?", answer: "Yes. HORA maternity photographers travel to your home across Kolkata." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Kolkata?", answer: "Victoria Memorial lawns, Prinsep Ghat, Millennium Park, Howrah Bridge viewpoints and heritage buildings in North Kolkata are popular pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Kolkata?", answer: "Yes. Anniversary photography and surprise setups are available across Kolkata." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Kolkata?", answer: "Yes. HORA photographers cover Shaadh and baby shower events across Kolkata." },
    ],
    "corporate-photography": [
      { question: "Which areas in Kolkata do you cover for corporate events?", answer: "We cover Salt Lake Sector V, Rajarhat, Park Street, Dalhousie and all major Kolkata business zones." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Kolkata?", answer: "Yes. Newborn photographers come to your Kolkata home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover Annaprashan photography in Kolkata?", answer: "Yes. HORA photographers in Kolkata cover Annaprashan, naming ceremonies and all related Bengali traditions." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Kolkata?", answer: "Victoria Memorial, Prinsep Ghat, Howrah Bridge viewpoints and luxury hotels in Park Street are popular Kolkata engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Kolkata?", answer: "Yes. We cover all Griha Pravesh and housewarming ceremonies across Kolkata." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Kolkata?", answer: "Yes. Photographers come to your home across Kolkata." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Kolkata?", answer: "Rooftop cafes in Park Street, boutique hotels in New Town and studio spaces across Kolkata are popular for bachelorette shoots." },
    ],
  },

  lucknow: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Lucknow?", answer: "HORA covers all Lucknow areas — Gomti Nagar, Hazratganj, Alambagh, Aliganj, Indira Nagar and more." },
      { question: "How much does a birthday photoshoot cost in Lucknow?", answer: "Birthday photography packages in Lucknow start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Lucknow?", answer: "Wedding photography in Lucknow starts from ₹8,000 for a half-day shoot." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Lucknow?", answer: "Yes. HORA maternity photographers travel to your home across Lucknow." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Lucknow?", answer: "Bara Imambara, Chota Imambara, Hazratganj lawns, Gomti Riverfront and Dilkusha Kothi garden are popular Lucknow pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Lucknow?", answer: "Yes. Anniversary photography is available across Lucknow." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Lucknow?", answer: "Yes. HORA photographers cover baby shower events across Lucknow." },
    ],
    "corporate-photography": [
      { question: "Which areas in Lucknow do you cover for corporate events?", answer: "We cover Gomti Nagar, Vibhuti Khand, Hazratganj and all major Lucknow business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Lucknow?", answer: "Yes. Newborn photographers come to your Lucknow home." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Lucknow?", answer: "Yes. We cover all naming ceremonies across Lucknow." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Lucknow?", answer: "Gomti Riverfront, Bara Imambara gardens and heritage hotels in Hazratganj are popular Lucknow engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Lucknow?", answer: "Yes. We cover all housewarming ceremonies across Lucknow." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Lucknow?", answer: "Yes. Photographers come to your home across Lucknow." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Lucknow?", answer: "Restaurants and rooftop venues in Gomti Nagar and Hazratganj are popular for Lucknow bachelorette shoots." },
    ],
  },

  kanpur: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Kanpur?", answer: "HORA covers all Kanpur areas — Swaroop Nagar, Civil Lines, Kakadeo, Kidwai Nagar and more." },
      { question: "How much does a birthday photoshoot cost in Kanpur?", answer: "Birthday photography packages in Kanpur start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Kanpur?", answer: "Wedding photography in Kanpur starts from ₹8,000 for a half-day shoot." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Kanpur?", answer: "Yes. HORA maternity photographers travel to your home across Kanpur." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Kanpur?", answer: "Allen Forest Zoo lawns, Phool Bagh, Moti Jheel and the Ganga Barrage are popular Kanpur pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Kanpur?", answer: "Yes. Anniversary photography is available across Kanpur." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Kanpur?", answer: "Yes. HORA photographers cover baby shower events across Kanpur." },
    ],
    "corporate-photography": [
      { question: "Which areas in Kanpur do you cover for corporate events?", answer: "We cover Swaroop Nagar, Naveen Market, Civil Lines and all major Kanpur business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Kanpur?", answer: "Yes. Newborn photographers come to your Kanpur home." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Kanpur?", answer: "Yes. We cover all naming ceremonies across Kanpur." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Kanpur?", answer: "Phool Bagh, Allen Forest Zoo lawns and select hotel venues in Kanpur are popular engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Kanpur?", answer: "Yes. We cover all housewarming ceremonies across Kanpur." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Kanpur?", answer: "Yes. Photographers come to your home across Kanpur." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Kanpur?", answer: "Party venues and restaurants in Civil Lines and Swaroop Nagar are popular for Kanpur bachelorette shoots." },
    ],
  },

  indore: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Indore?", answer: "HORA covers all Indore areas — Vijay Nagar, Palasia, MG Road, Rau and more." },
      { question: "How much does a birthday photoshoot cost in Indore?", answer: "Birthday photography packages in Indore start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Indore?", answer: "Wedding photography in Indore starts from ₹8,000 for a half-day shoot." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Indore?", answer: "Yes. HORA maternity photographers travel to your home across Indore." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Indore?", answer: "Ralamandal Wildlife Sanctuary, Patalpani Waterfall, Lal Bagh Palace and Sirpur Lake are popular Indore pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Indore?", answer: "Yes. Anniversary photography is available across Indore." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Indore?", answer: "Yes. HORA photographers cover baby shower events across Indore." },
    ],
    "corporate-photography": [
      { question: "Which areas in Indore do you cover for corporate events?", answer: "We cover Vijay Nagar, Palasia, Super Corridor and all major Indore business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Indore?", answer: "Yes. Newborn photographers come to your Indore home." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Indore?", answer: "Yes. We cover all naming ceremonies across Indore." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Indore?", answer: "Lal Bagh Palace, Sirpur Lake and heritage venues in Indore are popular engagement shoot spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Indore?", answer: "Yes. We cover all housewarming ceremonies across Indore." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Indore?", answer: "Yes. Photographers come to your home across Indore." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Indore?", answer: "Rooftop restaurants in Vijay Nagar and party venues across Indore are popular for bachelorette shoots." },
    ],
  },

  surat: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Surat?", answer: "HORA covers all Surat areas — Vesu, Adajan, Athwa, Katargam, Piplod and more." },
      { question: "How much does a birthday photoshoot cost in Surat?", answer: "Birthday photography packages in Surat start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Surat?", answer: "Wedding photography in Surat starts from ₹8,000 for a half-day shoot." },
      { question: "Do you cover Gujarati and Jain wedding photography in Surat?", answer: "Yes. HORA photographers in Surat are experienced with Gujarati and Jain wedding traditions and customs." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Surat?", answer: "Yes. HORA maternity photographers travel to your home across Surat." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Surat?", answer: "Sarthana Nature Park, Hazira Beach, Dutch Garden and Dumas Beach are popular Surat pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Surat?", answer: "Yes. Anniversary photography is available across Surat." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Surat?", answer: "Yes. HORA photographers cover baby shower events across Surat." },
    ],
    "corporate-photography": [
      { question: "Which areas in Surat do you cover for corporate events?", answer: "We cover Athwa, Vesu, Textile Market zone, Surat Diamond Bourse area and all major Surat business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Surat?", answer: "Yes. Newborn photographers come to your Surat home." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Surat?", answer: "Yes. We cover all naming ceremonies across Surat." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Surat?", answer: "Sarthana Nature Park, Hazira Beach and luxury hotels in Vesu are popular Surat engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Surat?", answer: "Yes. We cover all housewarming ceremonies across Surat." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Surat?", answer: "Yes. Photographers come to your home across Surat." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Surat?", answer: "Party venues in Vesu and Adajan and rooftop spaces across Surat are popular for bachelorette shoots." },
    ],
  },

  bhopal: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Bhopal?", answer: "HORA covers all Bhopal areas — Arera Colony, MP Nagar, Habibganj, Kolar Road and more." },
      { question: "How much does a birthday photoshoot cost in Bhopal?", answer: "Birthday photography packages in Bhopal start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Bhopal?", answer: "Wedding photography in Bhopal starts from ₹8,000 for a half-day shoot." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Bhopal?", answer: "Yes. HORA maternity photographers travel to your home across Bhopal." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Bhopal?", answer: "Upper Lake shore, Bhojpur Temple, Van Vihar National Park and Sanchi heritage site are popular Bhopal pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Bhopal?", answer: "Yes. Anniversary photography is available across Bhopal." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Bhopal?", answer: "Yes. HORA photographers cover baby shower events across Bhopal." },
    ],
    "corporate-photography": [
      { question: "Which areas in Bhopal do you cover for corporate events?", answer: "We cover MP Nagar, Arera Colony, Mandideep and all major Bhopal business areas." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Bhopal?", answer: "Yes. Newborn photographers come to your Bhopal home." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Bhopal?", answer: "Yes. We cover all naming ceremonies across Bhopal." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Bhopal?", answer: "Upper Lake shore, Van Vihar surroundings and heritage venues in Bhopal are popular engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Bhopal?", answer: "Yes. We cover all housewarming ceremonies across Bhopal." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Bhopal?", answer: "Yes. Photographers come to your home across Bhopal." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Bhopal?", answer: "Restaurants and party venues in MP Nagar and Arera Colony are popular for Bhopal bachelorette shoots." },
    ],
  },

  goa: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Goa?", answer: "HORA covers all Goa — North Goa (Calangute, Baga, Anjuna, Mapusa), South Goa (Colva, Margao, Palolem) and more." },
      { question: "How much does a birthday photoshoot cost in Goa?", answer: "Birthday photography packages in Goa start from ₹3,500 for a 1-hour session." },
      { question: "Can we do a beach birthday photoshoot in Goa?", answer: "Yes. Beach birthday shoots at Baga, Calangute, Anjuna, Colva and Palolem are popular and can be arranged." },
    ],
    "wedding-photography": [
      { question: "What is the cost of beach wedding photography in Goa?", answer: "Beach and destination wedding photography in Goa starts from ₹12,000 for a half-day shoot. Custom multi-day packages are available." },
      { question: "Which are the best beach wedding venues in Goa for photography?", answer: "Popular Goa wedding venues include Park Hyatt Goa, Zuri White Sands, Taj Exotica, W Goa and beachfront properties in Candolim and Morjim." },
      { question: "Do you cover Catholic and traditional Goan wedding ceremonies?", answer: "Yes. HORA photographers in Goa cover Catholic church ceremonies, Hindu beach weddings and destination weddings of all traditions." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot on a beach in Goa?", answer: "Yes. Beach maternity photoshoots at sunrise or sunset are a speciality in Goa. Home shoots are also available." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Goa?", answer: "Baga Beach at sunrise, Anjuna Flea Market surroundings, Chapora Fort, Old Goa churches, Dudhsagar Waterfall and Portuguese heritage homes are top Goa pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange a beach anniversary shoot in Goa?", answer: "Yes. Sunset beach anniversary shoots and surprise setups are a speciality in Goa." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Goa?", answer: "Yes. HORA photographers cover baby shower events across Goa." },
    ],
    "corporate-photography": [
      { question: "Which areas in Goa do you cover for corporate events?", answer: "We cover Panaji, Vasco, Margao, resorts in North and South Goa and all major venues." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Goa?", answer: "Yes. Newborn photographers come to your Goa home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Goa?", answer: "Yes. We cover all naming ceremonies across Goa." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Goa?", answer: "Baga Beach, Chapora Fort, Dudhsagar Waterfall, heritage properties in Old Goa and sunset beach venues are top Goa engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Goa?", answer: "Yes. We cover all housewarming ceremonies across Goa." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Goa?", answer: "Yes. Photographers come to your home across Goa." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Goa?", answer: "Beach clubs in North Goa, sunset cruise decks, villa rooftops and Baga Beach are iconic Goa bachelorette shoot spots." },
      { question: "Can we do a bachelorette photoshoot on a Goa beach?", answer: "Yes. Sunrise and sunset beach bachelorette shoots are among the most popular photography packages in Goa." },
    ],
  },

  pune: {
    "birthday-photography": [
      { question: "Where can I find a birthday photographer in Pune?", answer: "HORA covers all Pune areas — Koregaon Park, Baner, Hinjewadi, Kothrud, Viman Nagar, Hadapsar and more." },
      { question: "How much does a birthday photoshoot cost in Pune?", answer: "Birthday photography packages in Pune start from ₹3,500 for a 1-hour session." },
    ],
    "wedding-photography": [
      { question: "What is the cost of wedding photography in Pune?", answer: "Wedding photography in Pune starts from ₹8,000 for a half-day shoot." },
      { question: "Which are popular wedding photography venues in Pune?", answer: "Popular Pune venues include Hyatt Regency, JW Marriott, The Westin Koregaon Park, Corinthians Resort and heritage bungalows in Koregaon Park." },
    ],
    "maternity-photography": [
      { question: "Can I get a maternity photoshoot at home in Pune?", answer: "Yes. HORA maternity photographers travel to your home across Pune." },
    ],
    "pre-wedding-photography": [
      { question: "What are the best pre-wedding shoot locations in Pune?", answer: "Sinhagad Fort, Rajiv Gandhi Zoological Park, Aga Khan Palace, Osho Garden and the ghats near Lonawala are popular Pune pre-wedding spots." },
    ],
    "anniversary-photography": [
      { question: "Can HORA arrange an anniversary shoot in Pune?", answer: "Yes. Anniversary photography and surprise setups are available across Pune." },
    ],
    "baby-shower-photography": [
      { question: "Can I book a baby shower photographer in Pune?", answer: "Yes. HORA photographers cover baby shower events across Pune." },
    ],
    "corporate-photography": [
      { question: "Which areas in Pune do you cover for corporate events?", answer: "We cover Hinjewadi IT Park, Kharadi, Magarpatta, Baner and all major Pune business districts." },
    ],
    "new-born-baby-photography": [
      { question: "Is newborn photography available at home in Pune?", answer: "Yes. Newborn photographers come to your Pune home for a safe, comfortable session." },
    ],
    "naming-ceremony-photography": [
      { question: "Do you cover naming ceremony photography in Pune?", answer: "Yes. We cover all naming ceremonies across Pune." },
    ],
    "engagement-photography": [
      { question: "Where can we do an engagement shoot in Pune?", answer: "Aga Khan Palace grounds, Sinhagad Fort, Koregaon Park gardens and luxury hotels across Pune are popular engagement spots." },
    ],
    "house-warming-photography": [
      { question: "Do you cover housewarming photography in Pune?", answer: "Yes. We cover all Griha Pravesh and housewarming ceremonies across Pune." },
    ],
    "welcome-baby-photography": [
      { question: "Can I book a welcome baby photoshoot in Pune?", answer: "Yes. Photographers come to your home across Pune." },
    ],
    "bachelorette-photography": [
      { question: "Where are popular bachelorette shoot spots in Pune?", answer: "Rooftop venues in Koregaon Park, Baner restaurants and studio spaces across Pune are popular for bachelorette shoots." },
    ],
  },
};

/**
 * Returns city+category specific FAQ array, or null if none exists.
 * Falls back to null so callers can chain with photographyCategoryFAQData.
 * @param {string} city - city slug, e.g. "bangalore"
 * @param {string} catValue - category slug, e.g. "birthday-photography"
 * @returns {Array|null}
 */
export const getCityCategoryFAQData = (city, catValue) => {
  if (!city || !catValue) return null;
  return CITY_CATEGORY_FAQS[city.toLowerCase()]?.[catValue] || null;
};