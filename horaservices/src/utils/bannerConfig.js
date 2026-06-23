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

import weddingCollage from "@/assets/poselink/wedding-collage.webp";
import maternityCollage from "@/assets/poselink/maternity-collage.webp";
import birthdayCollage from "@/assets/poselink/birthday-collage.webp";
import preWeddingCollage from "@/assets/poselink/prewedding-collage.webp";
import haldiCollage from "@/assets/poselink/haldi-collage.webp";
import babyShowerCollage from "@/assets/poselink/babyshower-collage.webp";
import namingCollage from "@/assets/poselink/naming-collage.webp";
import newBornCollage from "@/assets/poselink/newborn-collage.webp";
import engagementCollage from "@/assets/poselink/engagement-collage.webp";
import anniversaryCollage from "@/assets/poselink/anniversary-collage.webp";
import houseWarmingCollage from "@/assets/poselink/housewarming-collage.webp";
import bacholerateCollage from "@/assets/poselink/bachelorette-collage.webp";
import trustimage from "@/assets/poselink/trustedimage.webp"; 
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
  "Wedding":                    { image: weddingBg,      eventName: "Wedding",         planningTitle: "Planning Wedding?",         planningDesc: "See wedding photography packages curated for your big day." ,chatTitle: "Free Wedding Planning Chat", collageImage: weddingCollage },
  "maternity poses":            { image: maternityBg,    eventName: "Maternity",        planningTitle: "Planning Maternity Shoot?", planningDesc: "See maternity packages curated for your beautiful journey.",chatTitle: "Free Maternity Planning Chat" ,collageImage: maternityCollage },
  "birthday poses":             { image: birthdayBg,     eventName: "Birthday",         planningTitle: "Planning a Birthday?",      planningDesc: "See birthday photography packages for an unforgettable celebration.",chatTitle: "Free Birthday Planning Chat",collageImage: birthdayCollage  },
  "pre wedding":                { image: preWeddingBg,   eventName: "Pre-Wedding",      planningTitle: "Planning Pre-Wedding?",     planningDesc: "See pre-wedding packages for dreamy shots before the big day.",chatTitle: "Free Pre-Wedding Planning Chat" ,collageImage: preWeddingCollage  },
  "HaldiandMehendi":            { image: haldiBg,        eventName: "Haldi & Mehndi",   planningTitle: "Planning Haldi/Mehndi?",    planningDesc: "See Haldi & Mehndi photography packages for your ceremony.",chatTitle: "Free Haldi/Mehndi Planning Chat", collageImage: haldiCollage   },
  "baby shower":                { image: babyShowerBg,   eventName: "Baby Shower",      planningTitle: "Planning Baby Shower?",     planningDesc: "See baby shower packages to celebrate your little one's arrival.",chatTitle: "Free Baby Shower Planning Chat",collageImage: babyShowerCollage    },
  "naming ceremony weblink":    { image: namingBg,       eventName: "Naming Ceremony",  planningTitle: "Planning Naming Ceremony?", planningDesc: "See naming ceremony packages to capture every precious moment.", chatTitle: "Free Naming Ceremony Planning Chat",collageImage: namingCollage  },
  "new born ":                  { image: newBornBg,      eventName: "New Born Baby",    planningTitle: "Planning Newborn Shoot?",   planningDesc: "See newborn photography packages for tiny precious memories.",chatTitle: "Free Newborn Shoot Planning Chat",collageImage: newBornCollage   },
  "engagement weblink":         { image: engagementBg,   eventName: "Engagement",       planningTitle: "Planning Engagement?",      planningDesc: "See engagement photography packages to capture your love story." ,chatTitle: "Free Engagement Planning Chat",collageImage: engagementCollage  },
  "anniversary poses web link": { image: anniversaryBg,  eventName: "Anniversary",      planningTitle: "Planning Anniversary?",     planningDesc: "See anniversary packages to relive your beautiful love story.",chatTitle: "Free Anniversary Planning Chat" ,collageImage: anniversaryCollage  },
  "House warming weblink":      { image: houseWarmingBg, eventName: "House Warming",    planningTitle: "Planning House Warming?",   planningDesc: "See house warming packages to capture your new beginning.",chatTitle: "Free House Warming Planning Chat",collageImage: houseWarmingCollage },
  "bacherrolerate":             { image: bachelorateBg,  eventName: "Bachelorette",     planningTitle: "Planning Bachelorette?",    planningDesc: "See bachelorette packages for a fun celebration photoshoot.",chatTitle: "Free Bachelorette Planning Chat", collageImage: bacholerateCollage  },
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
    chatTitle: matched?.chatTitle || "Free Event Planning Chat", 
  };
};
export const getTrustedCardData = (folderName) => {
  const matched = folderMap[folderName];
  return {
    collageImage: matched?.collageImage || trustimage,
    title: matched?.eventName
      ? `TRUSTED BY 10,000 ${matched.eventName.toUpperCase()} CLIENTS`
      : "TRUSTED BY 10,000 PEOPLE",
  };
};