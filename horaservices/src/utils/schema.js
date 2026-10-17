// src/utils/schema.js
// ============================================================
// HORA Services — Centralised Schema Utility
// ============================================================
// IMPORTANT: Before deploying, confirm these business constants
// with the team and update as needed:
//
//   HORA_RATING          → 4.8 (use one consistent number site-wide)
//   HORA_REVIEW_COUNT    → 5600 (total reviews across all platforms)
//   HORA_PHONE           → 7338584828 (match Google Business Profile)
//   HORA_ADDRESS         → confirm full address with pincode
//   HORA_CITY_LIST       → confirm all 17 cities list is complete
//
// ============================================================

// ── Business constants ──────────────────────────────────────
const HORA_RATING = "4.8";
const HORA_REVIEW_COUNT = "5600";
const HORA_PHONE = "+917338584828";
const HORA_EMAIL = "support@horaservices.com";
const HORA_ADDRESS = {
  "@type": "PostalAddress",
  "streetAddress": "Hora Services, Bengaluru",   // TODO: add exact street address
  "addressLocality": "Bengaluru",
  "addressRegion": "Karnataka",
  "postalCode": "560001",                         // TODO: confirm pincode
  "addressCountry": "IN"
};
const HORA_GEO = {
  "@type": "GeoCoordinates",
  "latitude": 12.9716,    // TODO: confirm coordinates
  "longitude": 77.5946
};
const HORA_SOCIAL = [
  "https://www.facebook.com/people/Hora/61550111701616/",
  "https://www.instagram.com/horaservices/",
  "https://www.youtube.com/channel/UCj5gMUjptHut0aGYHxCbE5g",
  "https://horaservices.com"
];
const HORA_IMAGES = [
  "https://horaservices.com/api/uploads/attachment-1706520980436.png",
  "https://horaservices.com/api/uploads/attachment-1711520474508.png",
  "https://horaservices.com/api/uploads/attachment-1706459457063.png"
];
const HORA_LOGO = "https://horaservices.com/api/uploads/logo-icon.png";

// ── Shared aggregate rating (consistent across all schemas) ──
const sharedRating = () => ({
  "@type": "AggregateRating",
  "ratingValue": HORA_RATING,
  "bestRating": "5",
  "worstRating": "1",
  "reviewCount": HORA_REVIEW_COUNT
});

// ── Category display helpers ─────────────────────────────────
const decorationCatTitle = (catValue) => {
  const map = {
    "kids-birthday-decoration": "Kids' Birthday Balloon Decoration by Professional Decorators, Starting at ₹1199",
    "birthday-decoration": "Birthday Balloon Decoration at Home by Professional Decorators, Starting at ₹1199",
    "anniversary-decoration": "Anniversary Decorations with Balloons & Rose Petals, Starting at ₹1199",
    "first-night-decoration": "First Night Decorations with Balloons & Rose Petals, Starting at ₹1199",
    "baby-shower-decoration": "Baby Shower Decoration with Latest Designs by Professional Decorators, Starting at ₹1199",
    "welcome-baby-decoration": "Baby Welcome Decoration at Home by Professional Decorators, Starting at ₹1199",
    "haldi-mehendi-decoration": "Haldi & Mehendi Decoration with Latest Designs, Starting at ₹3000",
  };
  return map[catValue] || "Professional Balloon & Flower Decorations for Birthdays, Parties & Weddings – Starting at ₹1199";
};

const decorationCatDesc = (catValue) => {
  const map = {
    "kids-birthday-decoration": "Explore popular kids' party themes — jungle, Cocomelon, candy, unicorn, dinosaur, superhero, princess, space, pirate, under the sea, Baby Boss, Barbie, and cars. Browse detailed pricing and inclusions, and let our professional team bring your chosen design to life. Book your perfect party decor today!",
    "birthday-decoration": "Explore our wide range of balloon and flower decorations for birthday parties, featuring ring, sequin, wall, and room designs. Discover pricing and inclusions for every balloon colour and variety. Customise your celebration and make it unforgettable with our stunning decor. Book your perfect party setup today!",
    "anniversary-decoration": "Explore top-notch anniversary decoration designs and book directly from our website. Find elegant and customisable decor options for your special event. Browse our selection to choose the perfect theme and make your anniversary memorable with seamless online booking.",
    "first-night-decoration": "Explore our selection of elegant decoration designs for your first night event. Choose from a variety of styles and themes, and book your perfect decor directly through our website. Make your special night unforgettable with seamless online booking and beautiful, personalised decorations.",
    "baby-shower-decoration": "Celebrate the arrival of your little one with beautiful baby shower decorations. Choose from a wide range of themes and styles, from pastel florals to jungle animals. Book online and let our professional team set up a stunning display at your venue.",
    "welcome-baby-decoration": "Welcome your newborn home in style with our beautiful baby welcome decorations. Explore balloon arches, floral backdrops, and custom name setups. Book online for a hassle-free, professional decoration experience.",
    "haldi-mehendi-decoration": "Brighten up your Haldi ceremony with vibrant and elegant décor! Explore our stunning Haldi decoration setups, featuring traditional elements, colourful floral arrangements, and custom designs to make your event unforgettable.",
  };
  return map[catValue] || "Professional Balloon & Flower Decorations for Birthdays, Parties & Weddings – Starting at ₹1199";
};

// ── 1. Home / Site-wide Organisation Schema ───────────────────
export const getHomeOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "Hora Services",
  "alternateName": "HORA",
  "url": "https://horaservices.com",
  "logo": HORA_LOGO,
  "description": "Hora Services is India's one-stop event planning platform — offering balloon & flower decoration, photography, live catering, private chef, and entertainment for birthdays, anniversaries, weddings, baby showers, and corporate events.",
  "keywords": "birthday decoration, anniversary decoration, party catering, private chef, event photography, balloon decoration, baby shower decoration, first night decoration, live catering, event planning",
  "telephone": HORA_PHONE,
  "email": HORA_EMAIL,
  "address": HORA_ADDRESS,
  "geo": HORA_GEO,
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "09:00",
    "closes": "21:00"
  },
  "sameAs": HORA_SOCIAL,
  "image": [
    ...HORA_IMAGES,
    "https://horaservices.com/api/uploads/homepage_whatareu4.webp",
    "https://horaservices.com/api/uploads/homepage_whatareu2.webp"
  ],
  "aggregateRating": sharedRating(),
  "areaServed": [
    "Bengaluru", "Delhi NCR", "Mumbai", "Hyderabad", "Indore", "Pune", "Chennai"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Hora Event Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Balloon Decoration" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Photography" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Live Catering" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Chef" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Entertainment" } }
    ]
  }
});

// ── 2. Decoration Landing (Organisation) Schema ───────────────
export const getDecorationOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hora Services",
  "alternateName": "HORA",
  "url": "https://horaservices.com",
  "logo": HORA_LOGO,
  "description": "Explore 1000+ balloon and flower decoration designs for birthdays, kids' parties, anniversaries, first nights, baby showers, naming ceremonies, Haldi, and Mehendi. Book directly online for seamless, professional decoration.",
  "keywords": "birthday decoration, anniversary decoration, baby shower decoration, first night decoration, balloon room decoration, balloon decorators near me, kids birthday decoration, haldi decoration, mehndi decoration",
  "telephone": HORA_PHONE,
  "sameAs": HORA_SOCIAL,
  "image": HORA_IMAGES,
  "aggregateRating": sharedRating()
});

// ── 3. Decoration Category Page Schema ───────────────────────
export const getDecorationCatOrganizationSchema = (catValue) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "brand": { "@type": "Brand", "name": "Hora Services" },
  "name": decorationCatTitle(catValue),
  "description": decorationCatDesc(catValue),
  "url": `https://horaservices.com/balloon-decoration/${catValue}`,
  "image": HORA_IMAGES,
  "sku": catValue?.toLowerCase().replace(/\s/g, "-"),
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "INR",
    "lowPrice": "1199",
    "highPrice": "39999",
    "offerCount": "100",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Hora Services" }
  },
  "aggregateRating": sharedRating()
});

// ── 4. Decoration Product Page Schema ────────────────────────
export const getDecorationProductOrganizationSchema = (product) => {
  const productImage = product?.featured_image || product?.image || HORA_IMAGES[0];
  const allImages = [
    productImage,
    ...(product?.images || []),
    ...HORA_IMAGES
  ].filter(Boolean).slice(0, 5);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product?.name || "Balloon Decoration",
    "image": allImages,
    "description": product?.description
      || `${product?.name} — professional balloon & flower decoration by Hora Services. Includes all materials and setup. Book online for a hassle-free celebration.`,
    "sku": product?._id || product?.slug,
    "brand": { "@type": "Brand", "name": "Hora Services" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product?.price || product?.discountedPrice || "1199",
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@type": "Organization", "name": "Hora Services", "url": "https://horaservices.com" }
    },
    "aggregateRating": sharedRating()
  };
};

// ── 5. Decoration Product BreadcrumbList Schema ───────────────
export const getDecorationBreadcrumbSchema = (product, catValue, city, locality) => {
  const items = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://horaservices.com" },
    { "@type": "ListItem", "position": 2, "name": "Balloon Decoration", "item": "https://horaservices.com/balloon-decoration" }
  ];
  if (catValue) {
    const catUrl = city
      ? `https://horaservices.com/${city}/balloon-decoration/${catValue}`
      : `https://horaservices.com/balloon-decoration/${catValue}`;
    items.push({
      "@type": "ListItem",
      "position": 3,
      "name": catValue.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      "item": catUrl
    });
  }
  if (product?.name) {
    items.push({
      "@type": "ListItem",
      "position": items.length + 1,
      "name": product.name
    });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items };
};

// ── 6. Photography Organisation Schema ───────────────────────
export const getPhotographyOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hora Photography",
  "alternateName": "Hora Services",
  "url": "https://horaservices.com/photography",
  "logo": HORA_LOGO,
  "description": "Professional photography services for weddings, birthday parties, baby showers, maternity, newborn, anniversaries, and corporate events — starting from just ₹3500. Book instantly online with Hora.",
  "keywords": "couple photoshoot, pre wedding photography, maternity photoshoot, newborn photography, baby photography, birthday photoshoot, wedding photographer, candid photography, photography in Bangalore, professional photographer near me",
  "telephone": HORA_PHONE,
  "sameAs": HORA_SOCIAL,
  "image": HORA_IMAGES,
  "aggregateRating": sharedRating()
});

// ── 7. Photography Category Page Schema ──────────────────────
export const getPhotographyCatSchema = (catValue) => {
  const catName = (catValue || "Photography").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${catName} Photography by Hora Services`,
    "description": `Professional ${catName.toLowerCase()} photography services in Bangalore and across India. Capture your most precious moments with Hora's experienced photographers. Book online starting from ₹3500.`,
    "provider": { "@type": "Organization", "name": "Hora Services", "url": "https://horaservices.com" },
    "serviceType": "Photography",
    "areaServed": ["Bengaluru", "Delhi NCR", "Mumbai", "Hyderabad"],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "3500",
      "highPrice": "25000",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": sharedRating()
  };
};

// ── 8. Photography Product Page Schema ───────────────────────
export const getPhotographyProductSchema = (product) => {
  const productImage = product?.featured_image || product?.image || HORA_IMAGES[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product?.name || "Photography Package",
    "image": [productImage, ...HORA_IMAGES].filter(Boolean).slice(0, 4),
    "description": product?.description
      || `${product?.name || "Professional photography"} by Hora Services. Experienced photographers, edited photos delivered digitally. Book online for birthdays, weddings, anniversaries and more.`,
    "brand": { "@type": "Brand", "name": "Hora Services" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product?.price || product?.discountedPrice || "3500",
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Hora Services" }
    },
    "aggregateRating": sharedRating()
  };
};

// ── 9. Photography BreadcrumbList Schema ─────────────────────
export const getPhotographyBreadcrumbSchema = (product, catValue, city) => {
  const items = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://horaservices.com" },
    { "@type": "ListItem", "position": 2, "name": "Photography", "item": "https://horaservices.com/photography" }
  ];
  if (catValue) {
    const catUrl = city
      ? `https://horaservices.com/${city}/photography/${catValue}`
      : `https://horaservices.com/photography/${catValue}`;
    items.push({
      "@type": "ListItem",
      "position": 3,
      "name": catValue.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      "item": catUrl
    });
  }
  if (product?.name) {
    items.push({ "@type": "ListItem", "position": items.length + 1, "name": product.name });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items };
};

// ── 10. Site-wide AggregateRating (for Reviews page) ─────────
export const getSiteAggregateRatingSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hora Services",
  "url": "https://horaservices.com",
  "aggregateRating": sharedRating()
});

// ── 11. Decoration Category FAQ Schema ───────────────────────
export const getProductFAQSchema = (location) => {
  const loc = location?.replace(/-/g, " ") || "your city";
  const locUpper = loc.toUpperCase();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the cost of Anniversary Balloon Decoration in ${locUpper}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The cost of our Anniversary Decoration services depends on the type of decoration, the size of the event, and the location. We offer packages starting from ₹1199 for a simple yet elegant Anniversary Decoration in ${locUpper}.`
        }
      },
      {
        "@type": "Question",
        "name": `How can I arrange for Balloon Decoration at Home in ${locUpper} for any celebration?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Hora Services makes it simple to bring the joy of Balloon Decoration to your doorstep for any celebration in ${locUpper}. Visit our website, choose the "Balloon Decoration at Home" option, enter your event details, customise your requirements, and complete the easy booking process. Our skilled team will handle all the details, ensuring your celebration is seamless and extraordinary.`
        }
      },
      {
        "@type": "Question",
        "name": `Which areas do you serve in ${locUpper}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We provide decoration services across all major areas of ${locUpper}, including Sarjapur, Bellandur, Marathahalli, HSR Layout, Madiwala, MG Road, Kundalahalli, Brookefield, Koramangala, Whitefield, Indira Nagar, Jayanagar, JP Nagar, Electronic City, Hebbal, and more. Contact us to confirm availability in your specific locality.`
        }
      },
      {
        "@type": "Question",
        "name": `Do you offer same-day bookings for Birthday Decoration at Home in ${loc}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we understand that plans can change and sometimes you need decorations on short notice. At Hora, we strive to accommodate same-day birthday decoration bookings. Contact our customer support team and we'll do our best to make your event special, even on short notice.`
        }
      },
      {
        "@type": "Question",
        "name": `Do you provide Balloon Room Decoration Services in ${loc}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we have a huge range of Balloon Room Decoration services in ${loc}. Our skilled and experienced team can beautifully transform any room with balloons as per your occasion and your mood of celebration.`
        }
      },
      {
        "@type": "Question",
        "name": "Can you provide budget-friendly suggestions for 1st Birthday Party Decorations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Of course! Consider themes for a first birthday such as Jungle Theme, Princess or Barbie Theme, Unicorn Theme, Space Theme, and many more. For wonderful photo options, add bright colours, balloons, customised banners, and a cake smash setup. Visit our website and explore a wide range of decoration options for the first birthday."
        }
      },
      {
        "@type": "Question",
        "name": "What all cities do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve decoration services in 7+ cities including Bangalore, Delhi NCR, Mumbai, Hyderabad, Indore, Pune, and more. Visit horaservices.com to check availability in your city."
        }
      }
    ]
  };
};

// ── 12. Decoration Product Detail Page FAQ Schema ────────────
export const getProductFAQSchemaProductDetails = (product) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does time slot mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Time slots are set times when you can book our services. For example, if you choose the 1–4 PM slot, our decorators will arrive between 1–2 PM and the decoration will be ready by 4 PM."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customise the decoration according to my preference?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we provide customisations based on your preferences. You can change balloon colours, add name and age foils, and more. You can mention the details on the last page before payment or reach out to us to discuss your specific requirements."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer same-day decoration service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer same-day decoration service, depending on slot availability and the design selected. Please contact us to check slot availability."
      }
    },
    {
      "@type": "Question",
      "name": "Do you only provide materials, or do you also decorate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide both materials and decoration. Our team will come to your location with all materials and complete the decoration on time."
      }
    },
    {
      "@type": "Question",
      "name": "How much time do you take to set up the decoration?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The time needed depends on the complexity of the decor and the venue size. Simple setups take 40–45 minutes, while larger installations may need 1–2 hours. We ensure timely and efficient setup for every event."
      }
    },
    {
      "@type": "Question",
      "name": "Tell us more about this design?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `For an unforgettable celebration, our expert decoration services are tailored to match your vision and budget. The ${product?.name || "selected"} decoration${product?.price ? ` under ₹${product.price}` : ""} is designed to create a stunning atmosphere. Our designs are crafted to enhance your event, ensuring a memorable experience for you and your guests.`
      }
    },
    {
      "@type": "Question",
      "name": "How early should I book your decoration services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We recommend booking at least 2 days in advance to ensure a smooth experience and avoid last-minute issues. However, we also offer same-day bookings depending on availability. Contact us for more details."
      }
    },
    {
      "@type": "Question",
      "name": "Tell us more about your designs and pricing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide 1000+ decoration designs across all events — Birthdays, Baby Showers, Anniversaries, Baby Welcome, First Night, Mehndi, Haldi, Weddings, and more. Prices depend on the design selected, inclusions, and add-ons. Full pricing and inclusions are shown with each design on our website."
      }
    },
    {
      "@type": "Question",
      "name": "How does the decoration service work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Select the design, fill in details like city, event date, time slot, and pincode, and place the order. An executor will be assigned after order finalisation. The executor will come to your location at the given time slot with all materials, complete the decoration, and collect the balance payment on-site."
      }
    },
    {
      "@type": "Question",
      "name": "What cities do you serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We serve decoration services in 7+ cities including Bangalore, Delhi NCR, Mumbai, Hyderabad, Indore, Pune, and more. Visit horaservices.com to check availability in your city."
      }
    }
  ]
});
