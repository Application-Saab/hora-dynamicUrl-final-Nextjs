
import { STATIC_FOOD_PACKAGES } from "./Venue1522.js";
import {BIG_PITCHER_FOOD_PACKAGES} from "./BigPitcher.js";
import { OAKWOOD_FOOD_PACKAGES } from "./OakwoodResidence.js";
import { ROYAL_ORCHID_PACKAGES } from "./RoyalOrchid.js";
export const EVENT_FOOD_PACKAGES = {

  "69e3619f800de79c9491390d": STATIC_FOOD_PACKAGES, 
  "69e5b0a2800de79c9494fa4d": OAKWOOD_FOOD_PACKAGES,
   "69e9b5da9beae4c61eec82ec":ROYAL_ORCHID_PACKAGES,
};

// ─── Helper function ─────────────────────────────────────────────────────────
export const getFoodPackagesByEventId = (eventId) => {
  return EVENT_FOOD_PACKAGES[eventId] || [];
};
