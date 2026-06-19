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
  "Wedding":                    { image: weddingBg,      eventName: "Wedding" },
  "maternity poses":            { image: maternityBg,    eventName: "Maternity" },
  "birthday poses":             { image: birthdayBg,     eventName: "Birthday" },
  "pre wedding":                { image: preWeddingBg,   eventName: "Pre-Wedding" },
  "HaldiandMehendi":            { image: haldiBg,        eventName: "Haldi & Mehndi" },
  "baby shower":                { image: babyShowerBg,   eventName: "Baby Shower" },
  "naming ceremony weblink":    { image: namingBg,       eventName: "Naming Ceremony" },
  "new born ":                  { image: newBornBg,      eventName: "New Born Baby" },
  "engagement weblink":         { image: engagementBg,   eventName: "Engagement" },
  "anniversary poses web link": { image: anniversaryBg,  eventName: "Anniversary" },
  "House warming weblink":      { image: houseWarmingBg, eventName: "House Warming" },
  "bacherrolerate":             { image: bachelorateBg,  eventName: "Bachelorette" },
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