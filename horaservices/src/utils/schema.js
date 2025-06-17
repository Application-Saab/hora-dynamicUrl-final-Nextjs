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

  export const getDecorationCatOrganizationSchema = (categoryName) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "brand": "Hora Services",
    "name": `${categoryName}`,
    "keywords": PageTitle(categoryName),
    "description": getPageMetaDescription(categoryName),
    "url": `https://horaservices.com/balloon-decoration/${categoryName}`,
    "image": [
      "https://horaservices.com/api/uploads/attachment-1706520980436.png",
      "https://horaservices.com/api/uploads/attachment-1711520474508.png",
      "https://horaservices.com/api/uploads/attachment-1706459457063.png"
    ],
    "brand": "Horservices.com",
    "sku": `${categoryName?.toLowerCase().replace(/\s/g, '-')}`,
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
