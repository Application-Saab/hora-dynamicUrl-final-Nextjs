import { getHomeOrganizationSchema } from "@/utils/schema";
import React from "react";

export function SEOHead() {
    const schemaOrg = getHomeOrganizationSchema();
    const scriptTag = JSON.stringify(schemaOrg);
  
  return (
    <head>
      <title>HORA : One-Stop Party Planning: Customise, Create, Book</title>
      <meta
        name="description"
        content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨"
      />
      <meta
        name="keywords"
        content="Personal chef, private chef to cook in home in India, home chef, book a cook near you, chef at home, Private cook in Mumbai, Book a cook for home near you, Hire Chef in Bangalore, Private Chef in Delhi, Catering service, balloon, decoration, celebration, party, birthday, anniversary, decorator, candle light dinner,  surprises, couples, bouquets , online caterers, catering services, best caterers, birthday party catering, birthday caterers, party catering, home catering, corporate catering, caterers for small parties, wedding caterers"
      />

      <meta
        property="og:title"
        content="HORA : One-Stop Party Planning: Customise, Create, Book"
      />
      <meta
        property="og:description"
        content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨"
      />

      <meta
        property="og:image"
        content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
      />
      <meta
        property="og:image:alt"
        content="Elegant balloon decoration setup by Hora Decorations"
      />
      <meta name="fast2sms" content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe" />
      <meta
        property="og:image"
        content="https://horaservices.com/api/uploads/attachment-1706459457063.png"
      />
      <meta
        property="og:image:alt"
        content="Beautiful floral arrangement for events by Hora Decorations"
      />

      <meta
        property="og:image"
        content="  https://horaservices.com/api/uploads/homepage_whatareu4.webp"
      />
      <meta
        property="og:image:alt"
        content="Beautiful food for events by Hora Caterers"
      />

      <meta
        property="og:image"
        content="https://horaservices.com/api/uploads/homepage_whatareu2.webp"
      />
      <meta
        property="og:image:alt"
        content="best food and chef for parties by Hora Kitchen"
      />
      <script type="application/ld+json">{scriptTag}</script>
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />
      <meta property="og:url" content="https://horaservices.com" />
      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
        type="image/x-icon"
      />
      <meta property="og:type" content="website" />
    </head>
  );
}
