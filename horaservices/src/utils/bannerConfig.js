// @/utils/bannerConfig.js

// ✅ Apni alag images yahan import karo
import weddingBg from "@/assets/poselink/wedding-bg.webp";
import maternityBg from "@/assets/poselink/maternity-bg.webp";
import birthdayBg from "@/assets/poselink/birthday-bg.webp";
import preWeddingBg from "@/assets/poselink/prewedding-bg.webp";
import haldiBg from "@/assets/poselink/haldi-bg.webp";
import babyShowerBg from "@/assets/poselink/babyshower-bg.webp";
import namingBg from "@/assets/poselink/naming-bg.webp";
import newBornBg from "@/assets/poselink/newborn-bg.webp";
import engagementBg from "@/assets/poselink/engagement-bg.webp";
import anniversaryBg from "@/assets/poselink/anniversary-bg.webp";
import houseWarmingBg from "@/assets/poselink/housewarming-bg.webp";
import bachelorateBg from "@/assets/poselink/bachelorette-bg.webp";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80";

// ✅ Sabke liye same fixed values
const FIXED_CONFIG = {
  highlightText: "2500+",
  description: "Get inspired with trending poses and book the best photographer for your Event.",
  ctaText: "Book Photographer",
  ctaUrl: "/photography-page",
};

// ✅ Har folder ke liye — background image + dynamic title ka event name
const folderMap = {
  "Wedding":                    { image: weddingBg,      eventName: "Wedding",         planningTitle: "Planning Wedding?",         planningDesc: "See wedding photography packages curated for your big day." },
  "maternity poses":            { image: maternityBg,    eventName: "Maternity",        planningTitle: "Planning Maternity Shoot?", planningDesc: "See maternity packages curated for your beautiful journey." },
  "birthday poses":             { image: birthdayBg,     eventName: "Birthday",         planningTitle: "Planning a Birthday?",      planningDesc: "See birthday photography packages for an unforgettable celebration." },
  "pre wedding":                { image: preWeddingBg,   eventName: "Pre-Wedding",      planningTitle: "Planning Pre-Wedding?",     planningDesc: "See pre-wedding packages for dreamy shots before the big day." },
  "HaldiandMehendi":            { image: haldiBg,        eventName: "Haldi & Mehndi",   planningTitle: "Planning Haldi/Mehndi?",    planningDesc: "See Haldi & Mehndi photography packages for your ceremony." },
  "baby shower":                { image: babyShowerBg,   eventName: "Baby Shower",      planningTitle: "Planning Baby Shower?",     planningDesc: "See baby shower packages to celebrate your little one's arrival." },
  "naming ceremony weblink":    { image: namingBg,       eventName: "Naming Ceremony",  planningTitle: "Planning Naming Ceremony?", planningDesc: "See naming ceremony packages to capture every precious moment." },
  "new born ":                  { image: newBornBg,      eventName: "New Born Baby",    planningTitle: "Planning Newborn Shoot?",   planningDesc: "See newborn photography packages for tiny precious memories." },
  "engagement weblink":         { image: engagementBg,   eventName: "Engagement",       planningTitle: "Planning Engagement?",      planningDesc: "See engagement photography packages to capture your love story." },
  "anniversary poses web link": { image: anniversaryBg,  eventName: "Anniversary",      planningTitle: "Planning Anniversary?",     planningDesc: "See anniversary packages to relive your beautiful love story." },
  "House warming weblink":      { image: houseWarmingBg, eventName: "House Warming",    planningTitle: "Planning House Warming?",   planningDesc: "See house warming packages to capture your new beginning." },
  "bacherrolerate":             { image: bachelorateBg,  eventName: "Bachelorette",     planningTitle: "Planning Bachelorette?",    planningDesc: "See bachelorette packages for a fun celebration photoshoot." },
};
export const getBannerConfig = (folderName) => {
  const matched = folderMap[folderName];

  const backgroundImage = matched?.image
    ? (typeof matched.image === "string" ? matched.image : matched.image?.src)
    : FALLBACK_IMAGE;

  // ✅ Title = eventName + " Poses" — "Wedding Poses", "Maternity Poses" etc.
  const title = matched?.eventName
    ? `${matched.eventName}`
    : "Event Poses";

  return {
    backgroundImage,
    title,           // dynamic
    ...FIXED_CONFIG, // highlightText, description, ctaText, ctaUrl — sab fixed
  };
};
export const getPlanningCardData = (folderName) => {
  const matched = folderMap[folderName];
  return {
    title: matched?.planningTitle || "Planning an Event?",
    description: matched?.planningDesc || "See photography packages curated for your special occasion.",
  };
};