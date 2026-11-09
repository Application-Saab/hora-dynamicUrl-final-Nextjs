const folderToSubCategory = {
  Wedding: "wedding-photography",
  "maternity poses": "maternity-photography",
  Candid: "birthday-photography",
  "pre wedding": "pre-wedding",
  HaldiandMehendi: "haldi-mehndi",
  haldi_mehendi_weblink1: "haldi-mehndi",
  "baby shower": "baby-shower-photography",
  "naming ceremony weblink": "naming-ceremony-photography",
  "new born ": "new-born-baby-photography",
  "engagement weblink": "engagement-photography",
  "anniversary poses web link": "anniversary-photography",
  "House warming weblink": "house-warming-photography",
  bacherrolerate: "bachelorette-photography",
  corporatePoselink: "corporate-photography",
  welcomeBaby_poseLink: "welcome-baby-photography",
  // ✅ NEW (folder naam wahi rakhna jo photographyData.js ke weblink mein hai)
  "half saree weblink": "half-saree-photography",
  "retirement weblink": "retirement-photography",
  "cocktail party weblink": "cocktail-party-photography",
  "farewell party weblink": "farewell-party-photography",
  "proposal weblink": "proposal-photography",
  "cradle ceremony weblink": "cradle-ceremony-photography",
  "car delivery weblink": "car-delivery-photography",
  "portfolio shoot weblink": "portfolio-shoot-photography",
  "baptism weblink": "baptism-and-holy-communion-photography",
  "family shoot weblink": "family-shoot-photography",
  "annaprashan weblink": "annaprashan-ceremony-photography",
};

export const getWeblinkPhotosUrl = (folderName) => {
  const subCategory = folderToSubCategory[folderName];
  if (!subCategory) return "/photography"; // fallback
  return `/photography/${subCategory}`;
};

export const categoryNameToSlug = {
  "Engagement-Photography": "engagement-photography",
  "Wedding-Photography": "wedding-photography",
  "Anniversary-Photography": "anniversary-photography",
  "Birthday-Photography": "birthday-photography",
  "House-warming-Photography": "house-warming-photography",
  "Naming-ceremony-Photography": "naming-ceremony-photography",
  "Baby-Shower-Photography": "baby-shower-photography",
  "Bachelorette-Photography": "bachelorette-photography",
  "Maternity-Photography": "maternity-photography",
  "New-Born-Baby-Photography": "new-born-baby-photography",
  "Corporate-Photography": "corporate-photography",
  "Welcome-Baby-Photography": "welcome-baby-photography",
  "PreWeddingPhotography": "pre-wedding",
  "HaldiMehendiPhotography": "haldi-mehndi",
  "Wedding-Photography": "wedding",
  // ✅ NEW
  "Half-saree-Photography": "half-saree-photography",
  "Retirement-Photography": "retirement-photography",
  "Cocktail-Party-Photography": "cocktail-party-photography",
  "Farewell-Party-Photography": "farewell-party-photography",
  "Proposal-Photography": "proposal-photography",
  "Cradle-Ceremony-Photography": "cradle-ceremony-photography",
  "Car-Delivery-Photography": "car-delivery-photography",
  "Portfolio-Shoot-Photography": "portfolio-shoot-photography",
  "Baptism-and-Holy-Communion-Photography": "baptism-and-holy-communion-photography",
  "Family-Shoot-Photography": "family-shoot-photography",
  "Annaprashan-Ceremony-Photography": "annaprashan-ceremony-photography",
};