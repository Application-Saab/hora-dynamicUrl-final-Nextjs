// src/utils/schema.js
export const getPhotographyOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hora Photography",
  "alternateName": "Hora Services",
  "url": "https://horaservices.com/photography",
   "keywords":
    "couple photoshoot, romantic photoshoot for couples, pre wedding photoshoot, pre wedding photography, couple pre wedding photography, candid pre wedding shoot, pre bridal photography, pre wedding shoot price, pre wedding shoot in bangalore, couples photography, maternity photoshoot, maternity photoshoot near me, maternity photo sessions, maternity photoshoot in bangalore, maternity couple photoshoot, mother to be photoshoot, maternity shoot near me, pregnancy photoshoot near me, pregnancy photo shoot, photography in pregnancy, pregnant women photoshoot, motherhood photoshoot, pregnant ladies photoshoot, couple pregnancy photoshoot, seemantham photoshoot, pregnancy photoshoot in bangalore, newborn photography, infant photography, baby photography near me, newborn photography near me, newborn photoshoot, infant photographers near me, newborn portraits near me, newborn family photoshoot, family photography with newborn, cake smash photoshoot, first birthday cake smash photoshoot, engagement photo shoot, engagement photoshoot, engagement couple photography, engagement photography, wedding photographer, wedding photographer near me, wedding photoshoot, photographer wedding, candid wedding photography, marriage photoshoot, post wedding photoshoot, bridal photoshoot, traditional photography, wedding photographers in bangalore, marriage photographers in bangalore, birthday photoshoot, first birthday photoshoot, pre birthday photoshoot, birthday celebration photoshoot, birthday photo session, 18th photoshoot, birthday party photographer, event photography, photoshoot for wedding anniversary, anniversary photoshoot, candid photography, cinematic photography, fashion photography, model photography, black and white photography, landscape photography, portrait photography, photographers near me, professional photographer near me, professional photographer, freelance photographer, best photographers near me, photoshoot near me, photographer in bangalore, photography in bangalore, bangalore photoshoot, photography services",
 "description":
    "📸 Professional photography services for weddings, baby showers, birthday parties, anniversaries, corporate events, and more — starting from just ₹3500! Book instantly online with Hora.",
  "logo": "https://horaservices.com/api/uploads/logo-icon.png",
  "priceRange": "3500-25000",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "4566"
  },
   "sameAs": [
      "https://www.facebook.com/people/Hora/61550111701616/",
      "https://www.instagram.com/horaservices/?fbclid=IwAR0PktJ-rl5rKC6YGSZ8BSw3m8o9qMfLpJchO17FCEZuCXKxvASZWRymifA",
      "https://www.youtube.com/channel/UCj5gMUjptHut0aGYHxCbE5g",
      "https://horaservices.com"
    ],
    "image": [
      "https://horaservices.com/api/uploads/attachment-1706520980436.png",
      "https://horaservices.com/api/uploads/attachment-1711520474508.png",
      "https://horaservices.com/api/uploads/attachment-1706459457063.png"
    ]
});

export const getDecorationOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hora",
    "alternateName": "Hora Services",
    "url": "https://horaservices.com",
    "keywords": "birthday decoration, anniversary decoration, party themes decorations, candlelight dinners, welcome baby decoration, baby shower decoration, first night decorations, haldi decoration, mehndi decoration, balloon room decoration, birthday decorators near me",
    "description": "🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊",
    "logo": "https://horaservices.com//api/uploads/logo-icon.png",
    "priceRange": "999-39999",
    "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "4566"
  },
    "sameAs": [
      "https://www.facebook.com/people/Hora/61550111701616/",
      "https://www.instagram.com/horaservices/?fbclid=IwAR0PktJ-rl5rKC6YGSZ8BSw3m8o9qMfLpJchO17FCEZuCXKxvASZWRymifA",
      "https://www.youtube.com/channel/UCj5gMUjptHut0aGYHxCbE5g",
      "https://horaservices.com"
    ],
    "image": [
      "https://horaservices.com/api/uploads/attachment-1706520980436.png",
      "https://horaservices.com/api/uploads/attachment-1711520474508.png",
      "https://horaservices.com/api/uploads/attachment-1706459457063.png"
    ]
  });


  const PageTitle = (catValue) =>{
    if(catValue === "kids-birthday-decoration"){
      return "Kids' Birthday Balloon Decoration by Professionals Decorators, Starting at ₹1199"
    }
    else if(catValue === "birthday-decoration"){
      return "Birthday Balloon Decoration at Home by Professionals  Decorators, Starting at ₹1199";
    }
    else if(catValue === "anniversary-decoration"){
      return "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199"
    }
    else if(catValue === "first-night-decoration"){
      return "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199"
    }
    else if(catValue === "baby-shower-decoration") {
      return "Baby Shower with Latest Designs by Professionals  Decorators Starting at ₹1199"
    }
    else if (catValue === "welcome-baby-decoration"){
      return "Baby Welcome Decoration at home by Professionals  Decorators, Starting at ₹1199"
    }
    else if (catValue === "haldi-mehendi-decoration"){
      return "Haldi Decoration with Latest Designs starting at ₹3000"
    }
    else{
     return("Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199")
    }
  }

  const getPageMetaDescription = (catValue) =>{
    if(catValue === "kids-birthday-decoration"){
      return "At Hora, 🎉Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠, under the sea 🌊, Baby Boss 👔, Barbie 💖, and cars 🚗. Explore detailed pricing and inclusions, and let our professional team bring your chosen design to life. Book your perfect party decor today! 🎈✨"
    }
    else if(catValue === "birthday-decoration"){
      return "At Hora, 🎈 Explore our wide range of balloon and flower decorations for birthday parties, featuring ring, sequin, wall, and room designs. Discover pricing and inclusions for every balloon color and variety. Customise your celebration and make it unforgettable with our stunning decor. Book your perfect party setup today! 🎉🌟";
    }
    else if(catValue === "anniversary-decoration"){
      return "🎉 Explore top-notch anniversary decoration designs and book directly from our website 💖. Find elegant and customizable decor options for your special event. Browse our selection to choose the perfect theme and make your anniversary memorable with seamless online booking. ✨"
    }
    else if(catValue === "first-night-decoration"){
      return "🌟 Explore our selection of elegant decoration designs for your first night event 💖. Choose from a variety of styles and themes, and book your perfect decor directly through our website. Make your special night unforgettable with seamless online booking and beautiful, personalised decorations. ✨"
    }
    else if (catValue === "haldi-mehendi-decoration"){
      return "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups, featuring traditional elements, colorful floral arrangements, and custom designs to make your event unforgettable. 🌸💛"
    }
    else{
     return("Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199")
    }
  }

 
 export const getDecorationCatOrganizationSchema = (catValue) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "brand": "Hora Services",
  "name": catValue,
  "description": getPageMetaDescription(catValue),
  "url": `https://horaservices.com/balloon-decoration/${catValue}`,
  "image": [
    "https://horaservices.com/api/uploads/attachment-1706520980436.png",
    "https://horaservices.com/api/uploads/attachment-1711520474508.png",
    "https://horaservices.com/api/uploads/attachment-1706459457063.png"
  ],
  "sku": catValue?.toLowerCase().replace(/\s/g, '-'),
  "priceRange": "999-39999",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "1388"
  }
});



export const getDecorationProductOrganizationSchema = (product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${product.name}`,
    "image": [
      "https://horaservices.com/api/uploads/attachment-1706520980436.png",
      "https://horaservices.com/api/uploads/attachment-1711520474508.png",
      "https://horaservices.com/api/uploads/attachment-1706459457063.png"
    ],
    "description": `Book the Coolest Birthday Decorations for Kids in Bangalore. Themed, balloon decorations, or activities for kids, get only the best for your kid with Hora Services.`,
    "brand": "Hora Services",
    "priceRange": "999-39999",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "5600"
    }
  });


  export const getHomeOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hora",
    "alternateName": "Hora Services",
    "url": "https://horaservices.com",
    "description": "🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨",
    "keywords": "Personal chef, private chef to cook in home in India, home chef, book a cook near you, chef at home, Private cook in Mumbai, Book a cook for home near you, Hire Chef in Bangalore, Private Chef in Delhi, Catering service, balloon, decoration, celebration, party, birthday, anniversary, decorator, candle light dinner,  surprises, couples, bouquets , online caterers, catering services, best caterers, birthday party catering, birthday caterers, party catering, home catering, corporate catering, caterers for small parties, wedding caterers",
    "logo": "https://horaservices.com/api/uploads/logo-icon.png",
    "sameAs": [
        "https://www.facebook.com/people/Hora/61550111701616/",
        "https://www.instagram.com/horaservices/",
        "https://www.youtube.com/channel/UCj5gMUjptHut0aGYHxCbE5g",
        "https://horaservices.com"
    ],
    "image": [
      "https://horaservices.com/api/uploads/attachment-1706520980436.png",
      "https://horaservices.com/api/uploads/attachment-1711520474508.png",
      "https://horaservices.com/api/uploads/homepage_whatareu4.webp",
      "https://horaservices.com/api/uploads/homepage_whatareu2.webp",
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "10600"
    }
  });


  export const getProductFAQSchema = (location) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the cost of Anniversary Balloon Decoration in ${location?.toUpperCase()}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The cost of our Anniversary Decoration services depends on various factors such as the type of decoration, the size of the event, and the location. We offer packages starting from Rs.1200 for a simple yet elegant Anniversary Decoration.`
        }
      },
      {
        "@type": "Question",
        "name": `How can I arrange for Balloon Decoration at Home in ${location?.toUpperCase()} for any celebration?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `7eventzz makes it simple to bring the joy of Balloon Decoration to your doorstep for any celebration in ${location?.toUpperCase()}. Our website serves as your guide to planning memorable parties from the comfort of your own home. Choose the "Balloon Decoration at Home" option, enter the event details, modify your requirements, and complete the simple booking process. Our skilled team will handle all of the details, ensuring that your celebration is both seamless and extraordinary.`
        }
      },
      {
        "@type": "Question",
        "name": `Areas we provide our services across ${location?.toUpperCase()}`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We provide decorations in all areas of ${location?.toUpperCase()} - Sarjapur, Bellandur, Marathahalli, HSR Layout, Madiwala, MG Road, Kundalahalli, Brookefield, Defence Colony, Bagalagunte, Bannerghatta, Azad Nagar, Banashankari, Banaswadi, Bapuji Nagar, Basavanagar, Bhuvaneshwari Nagar, Bidadi, Bommasandra, BTM Layout, Chandapura, Chandra Layout, Electronic City, Frazer Town, Ganga Nagar, HBR Layout, Hebbal, Hegde Nagar, Hennur, HRBR Layout, Indira Nagar, Jagajeevanram Nagar, Jayanagar, Jayamahal, Kalyan Nagar, Kammanahalli, Kanakapura, Hebbal Kempapura, Koramangala, Kothanur, LB Shastri Nagar, Mahadevpura, Malleshpalya, Malleshwaram, Sahakara Nagar, Sarjapur, Shanthi Nagar, Shivaji Nagar, Ulsoor, Uttarahalli, Whitefield, Williams Town, K R Puram, Vijayanagar, JP Nagar, Vittal Nagar, and more.`
        }
      },
      {
        "@type": "Question",
        "name": `Our Services in ${location?.toUpperCase()}`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We provide various decoration services in all areas of ${location?.toUpperCase()}. Our offerings include balloon decorations, flower decorations, and more for different events such as birthdays, anniversaries, baby showers, and more.`
        }
      },
      {
        "@type": "Question",
        "name": `Do you provide Balloon Room Decoration Services in ${location}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we have a huge range to offer Room Balloon Decoration services in the vibrant city of ${location}. Our skilled and well-experienced team can beautifully transform any room with balloons as per your occasion and your mood of celebration.`
        }
      },
      {
        "@type": "Question",
        "name": `Do you offer same-day bookings for Birthday Decoration at Home in ${location}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we understand that plans can change, and sometimes you need decorations on short notice. At HORA, we strive to accommodate same-day birthday decoration bookings possible. Contact our customer support team, and we'll do our best to make your event special, even on short notice.`
        }
      },
      {
        "@type": "Question",
        "name": `Can you provide me some budget-friendly suggestions for 1st Birthday Party Decorations?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Of course! Consider themes for a first birthday such as Jungle Theme, Princess or Barbie Theme, Unicorn Theme, Space Theme, and many more. For wonderful photo options, add bright colors, balloons, customized banners, and a cake smash setup. Visit our website and explore a wide range of decoration options for the first birthday.`
        }
      },
      {
        "@type": "Question",
        "name": `Decorator near me in ${location?.toUpperCase()}`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We offer a wide range of decoration services, including balloon and flower decorations, for various events such as birthdays, anniversaries, and baby showers in ${location?.toUpperCase()}.`
        }
      }
    ]
  });


  export const getProductFAQSchemaProductDetails = (product) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does time slot mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Time slots are set times when you can book our services. If you choose the time slot of 1-4pm, then our decorators will be coming to your location between 1pm to 2pm and the decoration will be ready by 4pm."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customise the decoration according to my preference?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide customizations based on your preferences. You can change balloon colors, add name and age foils, and more. You can directly mention the details on the last page before payment or simply reach out to us to discuss your specific requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer same-day decoration service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer same-day decoration service. It depends upon the slot availability and design selected by the customer. Please contact us to check slot availability."
        }
      },
      {
        "@type": "Question",
        "name": "Do you only provide materials, or do you also decorate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide materials and also handle the decoration. Our team will come to your given location with all the materials and complete the decoration on time."
        }
      },
      {
        "@type": "Question",
        "name": "How much time do you take to set up the decoration?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The time needed depends on factors like the decor's complexity and the venue size. Simple setups take 40-45 minutes, while larger installations may need 1-2 hours. We ensure timely and efficient setup for every event."
        }
      },
      {
        "@type": "Question",
        "name": "Tell us more about the design?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For an unforgettable kids birthday celebration, our expert decoration services are tailored to match your vision and budget. ${product?.name} decoration under ₹${product?.price} is designed to create a stunning atmosphere. Our designs are crafted to enhance your event, ensuring a memorable experience for you and your guests. This is one of the 1000+ designs under kids' birthday decoration for kids under 15 years.`
        }
      },
      {
        "@type": "Question",
        "name": "How Early Should I Book Your Decoration Services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To ensure a smooth experience, we recommend booking our decoration services at least 2 days in advance. This helps avoid any last-minute issues and ensures we can fully meet your needs. However, we also provide same-day delivery, depending on availability. For more information or to check availability, feel free to contact us."
        }
      },
      {
        "@type": "Question",
        "name": "Tell us more about your designs and pricing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide 1000+ decoration designs across all events like Birthdays, Baby Showers, Anniversaries, Baby Welcome, First Night, Mehandi, Haldi, Weddings, etc. Customers can choose the designs based on the event and spot of decoration, like room decoration, stage decoration, hall decoration, etc. The price of the decoration depends on the design selected, inclusions, and add-ons. The prices and inclusions are mentioned with each design."
        }
      },
      {
        "@type": "Question",
        "name": "How does decoration service work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Customers can directly select the design, fill in details like city, event date, time slot, and pincode on the next page, and place the order. The executor will be assigned after order finalization. The executor would come to the defined location at the given time slot and date with materials, execute the design, and leave the location after taking the balance payment."
        }
      },
      {
        "@type": "Question",
        "name": "What all cities do we serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve decoration services in 7+ cities including Bangalore, Delhi NCR, Mumbai, Hyderabad, Indore, and more."
        }
      }
    ]
  });

// ── Photography: Landing Page LocalBusiness (city-aware) ──────
export const getPhotographyLandingSchema = (city) => {
  const cityName = city
    ? String(city).replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": cityName ? `Hora Photography – ${cityName}` : "Hora Photography",
    "url": cityName
      ? `https://horaservices.com/${city.toLowerCase()}/photography`
      : "https://horaservices.com/photography",
    "logo": "https://horaservices.com/api/uploads/logo-icon.png",
    "telephone": "+917338584828",
    "email": "info@horaservices.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Salarpuria Symbiosis, Bannerghatta Main Rd",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560076",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.9010,
      "longitude": 77.5961
    },
    "image": [
      "https://horaservices.com/api/uploads/attachment-1706520980436.png",
      "https://horaservices.com/api/uploads/attachment-1711520474508.png",
      "https://horaservices.com/api/uploads/attachment-1706459457063.png"
    ],
    "description": cityName
      ? `Book professional photographers in ${cityName} for birthdays, weddings, baby showers, maternity and corporate events. 100+ verified photographers. Starting ₹3500.`
      : "Book professional photographers across India for birthdays, weddings, baby showers, maternity and corporate events. 100+ verified photographers. Starting ₹3500.",
    "areaServed": cityName
      ? { "@type": "City", "name": cityName }
      : ["Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Chennai", "Pune", "Kolkata"],
    "sameAs": [
      "https://www.facebook.com/people/Hora/61550111701616/",
      "https://www.instagram.com/horaservices/",
      "https://www.youtube.com/channel/UCj5gMUjptHut0aGYHxCbE5g",
      "https://horaservices.com"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "5600"
    },
    "priceRange": "₹₹",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "09:00",
      "closes": "21:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Photography Packages",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Birthday Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wedding Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Maternity Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Baby Shower Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Anniversary Photography" } }
      ]
    }
  };
};

// ── Photography: Category BreadcrumbList ──────────────────────
export const getPhotographyCategoryBreadcrumbSchema = (catValue, city) => {
  const catLabel = (catValue || "Photography")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const citySlug = city ? String(city).toLowerCase().replace(/\s+/g, "-") : null;
  const catUrl = citySlug
    ? `https://horaservices.com/${citySlug}/photography/${catValue}`
    : `https://horaservices.com/photography/${catValue}`;
  const photoUrl = citySlug
    ? `https://horaservices.com/${citySlug}/photography`
    : "https://horaservices.com/photography";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://horaservices.com" },
      { "@type": "ListItem", "position": 2, "name": "Photography", "item": photoUrl },
      { "@type": "ListItem", "position": 3, "name": catLabel, "item": catUrl }
    ]
  };
};

// ── Photography: FAQPage schema (per category) ────────────────
const PHOTOGRAPHY_FAQS = {
  "birthday-photography": [
    { q: "How much does a birthday photoshoot cost?", a: "Birthday photoshoot packages at Hora Services start from ₹3,500, including a 1-hour session and 50+ edited digital photos. Price varies by duration and package." },
    { q: "Can I book a birthday photographer at home?", a: "Yes, Hora photographers come to your home, venue or any outdoor location of your choice across 17+ cities in India." },
    { q: "How many edited photos do I get?", a: "Depending on the package, you receive between 50 and 200+ edited digital photos. Your gallery is delivered online within 5–7 working days." },
    { q: "Are female photographers available for birthday shoots?", a: "Yes, female birthday photographers are available on request in most cities. Please mention your preference at the time of booking." }
  ],
  "wedding-photography": [
    { q: "What is the cost of wedding photography at Hora?", a: "Wedding photography packages at Hora Services start from ₹8,000 for a half-day shoot. Full-day and multi-day wedding packages are also available." },
    { q: "Do you provide candid and cinematic wedding coverage?", a: "Yes, Hora offers candid photography, cinematic videography, traditional coverage and pre-wedding shoots, all bookable online." },
    { q: "How soon will we receive our wedding photos?", a: "Edited wedding photos are typically delivered within 15–20 working days after the event via an online gallery." },
    { q: "Is pre-wedding photography included?", a: "Pre-wedding shoots can be booked separately or added to a wedding package. Browse pre-wedding photography packages on Hora Services." }
  ],
  "maternity-photography": [
    { q: "When is the best time for a maternity photoshoot?", a: "The ideal time for a maternity photoshoot is between 28 and 36 weeks of pregnancy, when the baby bump is prominent and the mother is most comfortable." },
    { q: "Can my partner and family be included in the maternity shoot?", a: "Yes, partners, children and family members are always welcome in maternity photoshoots. Let us know your preference when booking." },
    { q: "What should I wear for a maternity photoshoot?", a: "Hora's photographers will advise on outfits and props. Flowy dresses and fitted tops are popular choices. Colour themes can be discussed in advance." },
    { q: "How much does a maternity photoshoot cost?", a: "Maternity photoshoot packages at Hora start from ₹3,500 for a studio or at-home session with edited photos delivered digitally." }
  ],
  "anniversary-photography": [
    { q: "How much does an anniversary photoshoot cost?", a: "Anniversary photoshoot packages at Hora Services start from ₹3,500, including a 1-hour session and 50+ edited digital photos." },
    { q: "Can Hora set up a surprise anniversary photoshoot?", a: "Yes, surprise setup and photography sessions for anniversaries are available. Contact our team when booking to arrange a surprise shoot." },
    { q: "Is outdoor couple photography available for anniversaries?", a: "Yes, outdoor locations including gardens, cafes, rooftops and landmarks are available for anniversary photoshoots across all supported cities." },
    { q: "Can decoration be added to the anniversary photoshoot?", a: "Yes, balloon and floral decoration setups can be combined with the photography booking for a complete anniversary experience." }
  ],
  "baby-shower-photography": [
    { q: "Can Hora combine baby shower decoration with photography?", a: "Yes, Hora offers combined baby shower decoration and photography packages. Book both services together for a seamless, hassle-free experience." },
    { q: "How far in advance should I book a baby shower photographer?", a: "We recommend booking at least 7–10 days in advance, though last-minute bookings are also accepted subject to photographer availability." },
    { q: "Are themed baby shower photoshoots available?", a: "Yes, themed setups including floral, pastel and baby animal themes can be arranged for the photoshoot session." }
  ],
  "new-born-baby-photography": [
    { q: "Is newborn photography safe for the baby?", a: "Yes, Hora's newborn photographers are trained in baby-safe posing and handling. All setups use baby-safe materials and gentle lighting." },
    { q: "What is the best age for a newborn photoshoot?", a: "Newborn photoshoots are best done within the first 5–14 days after birth, when babies sleep deeply and are most flexible for posed shots." },
    { q: "Where does the newborn photoshoot take place?", a: "Hora newborn photographers come to your home for a comfortable, familiar environment, or studio sessions can also be arranged." }
  ],
  "engagement-photography": [
    { q: "Can Hora combine an engagement shoot with ring ceremony photography?", a: "Yes, Hora photographers cover both the ring ceremony and a standalone couple engagement shoot in a single booking." },
    { q: "What locations are available for engagement photoshoots?", a: "Indoor studio, outdoor garden, rooftop, beach and heritage location shoots are all available depending on your city." },
    { q: "How much does an engagement photoshoot cost?", a: "Engagement photoshoot packages at Hora start from ₹3,500, including an edited digital photo gallery delivered online." }
  ],
  "house-warming-photography": [
    { q: "Do you cover griha pravesh and gruhapravesam ceremonies?", a: "Yes, Hora photographers cover all housewarming ceremonies including Griha Pravesh, Gruhapravesam and Vastu Pooja in all supported cities." },
    { q: "How many hours does a housewarming photography session last?", a: "A standard housewarming photography session lasts 1.5 to 3 hours depending on the size of the ceremony and the package chosen." },
    { q: "Can I book a videographer along with the photographer?", a: "Yes, video coverage can be added to any photography package at the time of booking." }
  ],
  "corporate-photography": [
    { q: "What types of corporate events does Hora cover?", a: "Hora covers office parties, team outings, award nights, conferences, product launches, and corporate headshots across all major cities." },
    { q: "Can I get same-day delivery of edited corporate photos?", a: "Express delivery of a curated set of edited corporate photos within 24 hours is available for select packages. Please confirm at the time of booking." },
    { q: "Is bulk booking available for corporate photography?", a: "Yes, bulk and recurring corporate photography packages are available. Contact the Hora team for custom pricing for regular events." }
  ],
  "bachelorette-photography": [
    { q: "Can Hora provide props and setups for bachelorette photoshoots?", a: "Yes, fun props, balloon setups and photo booth experiences are available as add-ons for bachelorette photoshoots." },
    { q: "How much does a bachelorette photoshoot cost?", a: "Bachelorette photoshoot packages start from ₹3,500 for a 1-hour session. Group and multi-location packages are also available." }
  ],
  "naming-ceremony-photography": [
    { q: "Do you cover annaprashan and cradle ceremony photography?", a: "Yes, Hora photographers cover naming ceremonies, annaprashan, barasala, cradle ceremonies, baptism and christening events across India." },
    { q: "How many photos are delivered from a naming ceremony shoot?", a: "You will receive 100–200 edited digital photos depending on the package, delivered via an online gallery within 5–7 working days." }
  ],
  "welcome-baby-photography": [
    { q: "Can I book a welcome baby photoshoot at home?", a: "Yes, Hora photographers come to your home for welcome baby shoots, creating a comfortable and familiar environment for both baby and parents." },
    { q: "What is included in a welcome baby photography package?", a: "Packages include the photographer visit, edited digital photos and an online gallery. Props and themed setups can be added as add-ons." }
  ]
};

const DEFAULT_PHOTOGRAPHY_FAQS = [
  { q: "How much does it cost to hire a photographer?", a: "Photography packages at Hora Services start from ₹3,500 for a 1-hour session. Prices vary based on duration, event type and package selected." },
  { q: "Can I book a photographer at home?", a: "Yes, Hora photographers come to your home, venue or any outdoor location across 17+ cities in India." },
  { q: "How do I book a photographer online?", a: "Choose your occasion and package, select your city, and confirm with a small advance. Booking takes a few minutes and same-day slots are often available." },
  { q: "When will I receive my edited photos?", a: "Edited photos are delivered via an online gallery within 5–7 working days of your event." },
  { q: "Are female photographers available?", a: "Yes, female photographers are available on request in all supported cities. Please mention your preference at the time of booking." }
];

export const getPhotographyFAQSchema = (catValue) => {
  const faqs = (catValue && PHOTOGRAPHY_FAQS[catValue]) || DEFAULT_PHOTOGRAPHY_FAQS;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  };
};

// ── Photography: Product schema (Product + Offer + AggregateRating) ──
export const getPhotographyProductSchema = (work, city) => {
  if (!work) return null;
  const cityName = city
    ? String(city).replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  const imageUrl = work.featured_image
    ? `https://horaservices.com/api/uploads/compressed_webp/${String(work.featured_image).split(".")[0]}.webp`
    : "https://horaservices.com/api/uploads/attachment-1706520980436.png";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": work.name,
    "image": [imageUrl],
    "description": cityName
      ? `Book ${work.name} photography in ${cityName}. Professional photographers, edited photos delivered online. Starting ₹${work.price || 3500}.`
      : `Book ${work.name} photography across India. Professional photographers, edited photos delivered online. Starting ₹${work.price || 3500}.`,
    "brand": {
      "@type": "Brand",
      "name": "Hora Services"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": String(work.price || 3500),
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "url": cityName
        ? `https://horaservices.com/${city.toLowerCase()}/photography/product/${work.slug || work._id}`
        : `https://horaservices.com/photography/product/${work.slug || work._id}`,
      "seller": {
        "@type": "Organization",
        "name": "Hora Services"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "5600",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
};
