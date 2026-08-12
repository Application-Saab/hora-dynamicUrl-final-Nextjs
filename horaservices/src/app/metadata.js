import { getHomeOrganizationSchema } from "@/utils/schema";

// Assuming getHomeOrganizationSchema is defined and returns the JSON-LD data
const schemaOrg = getHomeOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);

export const metadata = {
  title: "Chef for Party | Balloon Decoration for Party | Food Delivery for Party | Chef Near me | Decoration at Home | Balloon Decoration Near me - Hora",
  description: "Want to book a cook for home near you? Hire skilled cooks for a day or book a chef for a party at home with Hora. Get a chef for a birthday or house party in Mumbai, Bangalore & Delhi NCR, Hora services, Horaservices",
  keywords: [
    "Personal chef",
    "private chef to cook in home in India",
    "home chef",
    "book a cook near you",
    "chef at home",
    "Private cook in Mumbai",
    "Book a cook for home near you",
    "Hire Chef in Bangalore",
    "Private Chef in Delhi",
    "Catering service",
    "Hora",
    "Hora services",
    "Horaservices"
  ],
  openGraph: {
    title: "Chef for Party | Balloon Decoration for Party | Food Delivery for Party | Chef Near me | Decoration at Home | Balloon Decoration Near me - Hora",
    description: "Want to book a cook for home near you? Hire skilled cooks for a day or book a chef for a party at home with Hora. Get a chef for a birthday or house party in Mumbai, Bangalore & Delhi NCR, Hora services, Horaservices",
    url: "https://horaservices.com",
    logo: "https://horaservices.com/api/uploads/logo-icon.png",
    type: "website",
    images: [
      {
        url: "https://horaservices.com/api/uploads/attachment-1706520980436.png",
        alt: "Chef for Party | Balloon Decoration for Party | Food Delivery for Party | Chef Near me | Decoration at Home | Balloon Decoration Near me - Hora",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Hora Services" }],
  additionalMetaTags: [
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "author",
      content: "Hora Services",
    },
  ],
  other: {
    script: [
      {
        type: "application/ld+json",
        content: scriptTag, // Using the scriptTag generated from getHomeOrganizationSchema
      },
    ],
  },
};
