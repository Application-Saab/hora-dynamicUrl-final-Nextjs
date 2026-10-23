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